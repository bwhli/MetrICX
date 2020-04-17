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

namespace TokenDepositReceivedFunction
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

            foreach (var eventItem in tx.TxResultDetails.EventLogs)
            {
                if (eventItem.Indexed[0].Contains("Transfer"))
                {
                    string address = eventItem.Indexed[2];

                    if (IsAddressInToggleList(address)) //Check if address is in the toggles list
                    {
                        context.Logger.LogLine($"Address is in toggle list {address}");
                        var devices = FirebaseGateway.GetDevicesByAddress(address);
                        foreach (var device in devices)
                        {
                            foreach (var addressObj in device.addresses_v2.AsEnumerator())
                            {
                                foreach (var token in addressObj.tokens.AsEnumerator())
                                {
                                    ProcessDeviceToken(device, addressObj, token);
                                }
                            }
                        }
                    }
                }
            }

            await Task.CompletedTask;
        }

        public bool IsAddressInToggleList(string address)
        {
            if (addressToggles == null)
                addressToggles = FirebaseGateway.GetToggleAddresses("awsdeposits");

            return addressToggles.Any(a => a == address);
        }

        public static void ProcessDeviceToken(DeviceRegistration device, Address address, Token token)
        {
            SendResponse sendResponse = null;

            if (address.enablePushDeposits == true && token.isSelected == true)
            {
                try
                {
                    var balance = IconGateway.GetBalance(address, token);
                    if (string.IsNullOrEmpty(token.lastBalance))
                    {
                        //Store current balance without sending a notification
                        token.lastBalance = balance.ToString();
                    }
                    else if (token.balanceAsDecimal < balance && balance - token.balanceAsDecimal > 0.005M) //Otherwise user gets a message of receiving 0
                    {
                        decimal depositReceived = balance - token.balanceAsDecimal;
                        if (string.IsNullOrEmpty(address.Name))
                            sendResponse = FirebaseGateway.SendPush(device.token, token.token, $"{token.token} Deposit Received AWS", $"You have received a deposit of {depositReceived.ToString("0.##")} {token.token}");
                        else
                            sendResponse = FirebaseGateway.SendPush(device.token, token.token, $"{token.token} Deposit Received AWS", $"{address.Name.ToUpper()} has received a deposit of {depositReceived.ToString("0.##")} {token.token}");
                        //Now update firestore so we dont send the user duplicate messages
                        token.lastBalance = balance.ToString();
                        token.lastDepositPushSentDate = DateTime.UtcNow;
                        //pushNotificationCount++;
                    }
                    else if (token.balanceAsDecimal > balance)
                    {
                        token.lastBalance = balance.ToString();
                    }
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
