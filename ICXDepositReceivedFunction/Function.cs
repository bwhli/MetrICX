using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Amazon.Lambda.Core;
using Amazon.Lambda.SNSEvents;
using MetrICXCore.Entities;
using MetrICXCore.Gateways;
using MetrICXCore.Models;
using Newtonsoft.Json;


// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace ICXDepositReceivedFunction
{
    public class Function
    {
        private string[] addressToggles;

        /// <summary>
        /// Default constructor. This constructor is used by Lambda to construct the instance. When invoked in a Lambda environment
        /// the AWS credentials will come from the IAM role associated with the function and the AWS region will be set to the
        /// region the Lambda function is executed in.
        /// </summary>
        public Function()
        {

        }


        /// <summary>
        /// This method is called for every Lambda invocation. This method takes in an SNS event object and can be used 
        /// to respond to SNS messages.
        /// </summary>
        /// <param name="evnt"></param>
        /// <param name="context"></param>
        /// <returns></returns>
        public async Task FunctionHandler(SNSEvent evnt, ILambdaContext context)
        {
            foreach(var record in evnt.Records)
            {
                await ProcessRecordAsync(context, record.Sns.Message);
            }
        }


        public async Task ProcessRecordAsync(ILambdaContext context, string message)
        {
            context.Logger.LogLine($"[{DateTime.Now.ToString()}] Processed record {message}");

            ConfirmedTransaction tx = JsonConvert.DeserializeObject<ConfirmedTransaction>(message);

            string address;
            decimal amount;

            //Subscription to AWS Topic ICX_Transfer
            //Just triggered from normal ICX to ICX wallets
            if (tx.From != null && tx.From.StartsWith("hx") && tx.To != null && tx.To.StartsWith("hx"))
            {
                address = tx.To;
                amount = tx.GetIcxValue();
                ProcessAddress(context, address, amount);
            }

            //Subscription to AWS Topic ICX_Contract_Method
            //Looks for specific events that causes ICX to be transferred
            if (tx.TxResultDetails != null)
            {
                foreach (var eventItem in tx.TxResultDetails.EventLogs)
                {
                    if (eventItem.Indexed[0].StartsWith("ICXTransfer"))
                    {
                        address = eventItem.Indexed[2];
                        amount = IconGateway.GetIcxValueFromHex(eventItem.Indexed[3]);
                        ProcessAddress(context, address, amount);
                    }
                    if (eventItem.Indexed[0].StartsWith("IScoreClaimed"))
                    {
                        address = tx.From;
                        amount = IconGateway.GetIcxValueFromHex(eventItem.Data[0]);
                        amount = amount / 1000M;
                        ProcessAddress(context, address, amount);
                    }
                }
            }

            await Task.CompletedTask;
        }

        public void ProcessAddress(ILambdaContext context, string address, decimal amount)
        {
            if (IsAddressInToggleList(address)) //Check if address is in the toggles list
            {
                context.Logger.LogLine($"Address is in toggle list {address}");

                var devices = FirebaseGateway.GetDevicesByAddress(address);
                foreach (var device in devices)
                {
                    foreach (var addressObj in device.addresses_v2.AsEnumerator())
                    {
                        if (address == addressObj.address)
                        {
                            ProcessDeviceAddress(device, addressObj, amount);
                        }
                    }
                }
            }
        }

        public bool IsAddressInToggleList(string address)
        {
            if (addressToggles == null)
                addressToggles = FirebaseGateway.GetToggleAddresses("awsdeposits");

            return addressToggles.Any(a => a == address);
        }

        public void ProcessDeviceAddress(DeviceRegistration device, Address address, decimal amount)
        {
            SendResponse sendResponse = null;

            if (!device.registrationDate.HasValue)
            {
                device.registrationDate = DateTime.UtcNow;
            }

            if (address.enablePushDeposits == true)
            {
                try
                {
                    if (string.IsNullOrEmpty(address.Name))
                        sendResponse = FirebaseGateway.SendPush(device.token, address.address, $"{address.Symbol} Deposit Received AWS", $"You have received a deposit of {amount.ToString("0.##")} {address.Symbol}");
                    else
                        sendResponse = FirebaseGateway.SendPush(device.token, address.address, $"{address.Symbol} Deposit Received AWS", $"{address.Name.ToUpper()} has received a deposit of {amount.ToString("0.##")} {address.Symbol}");
                    address.lastDepositPushSentDate = DateTime.UtcNow;

                    //This will not always be required
                    address.balance = IconGateway.GetBalance(address).ToString();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[MAIN] EXCEPTION processing Deposit check {ex.Message}");
                }
            }

            if (sendResponse != null && sendResponse.failure > 0)
            {
                if (sendResponse.results.Any(a => a.error == "NotRegistered"))
                {
                    //This token has become stale, need to remove it from firestore
                    FirebaseGateway.DeleteDevice(device);
                }
            }
        }
    }
}
