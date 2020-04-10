using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Amazon.Lambda.Core;
using Amazon.Lambda.SNSEvents;
using MetrICXCore.Entities;
using MetrICXCore.Gateways;
using Newtonsoft.Json;


// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace ICXDepositReceivedFunction
{
    public class Function
    {
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

            var addressToggles = FirebaseGateway.GetToggleAddresses("awsdeposits");

            ConfirmedTransactionList tx = JsonConvert.DeserializeObject<ConfirmedTransactionList>(message);
            string address = "";
            if (tx.From != null && tx.From.StartsWith("hx") && tx.To != null && tx.To.StartsWith("hx"))
                address = tx.To;

            if (tx.From != null && tx.From.StartsWith("hx") && tx.To != null && tx.To.StartsWith("cx"))
                address = tx.From;

            context.Logger.LogLine($"{address}, block timeStamp {tx.GetTimeStamp().ToString()}");

            if (addressToggles.Any(a => a == address)) //Check if address is in the toggles list
            {
                context.Logger.LogLine($"Address is in toggle list {address}");

                var devices = FirebaseGateway.GetDevicesByAddress(address);
                foreach (var device in devices)
                {
                    foreach (var addressObj in device.addresses_v2.AsEnumerator())
                    {
                        if (address == addressObj.address && addressObj.enablePushDeposits == true)
                        {

                            var balance = IconGateway.GetBalance(addressObj);
                            if (string.IsNullOrEmpty(addressObj.balance))
                            {
                                //Store current balance without sending a notification
                                addressObj.balance = balance.ToString();
                            }
                            else if (addressObj.balanceAsDecimal < balance && balance - addressObj.balanceAsDecimal > 0.005M) //Otherwise user gets a message of receiving 0
                            {
                                context.Logger.LogLine($"Sending Push notification to {address}");

                                decimal depositReceived = balance - addressObj.balanceAsDecimal;
                                if (string.IsNullOrEmpty(addressObj.Name))
                                    FirebaseGateway.SendPush(device.token, addressObj.address, $"{addressObj.Symbol} Deposit Received", $"You have received a deposit of {depositReceived.ToString("0.##")} {addressObj.Symbol}");
                                else
                                    FirebaseGateway.SendPush(device.token, addressObj.address, $"{addressObj.Symbol} Deposit Received", $"{addressObj.Name.ToUpper()} has received a deposit of {depositReceived.ToString("0.##")} {addressObj.Symbol}");

                                //Now update firestore so we dont send the user duplicate messages
                                addressObj.balance = balance.ToString();
                                addressObj.lastDepositPushSentDate = DateTime.UtcNow;
                                //pushNotificationCount++;
                            }
                            else if (addressObj.balanceAsDecimal > balance)
                            {
                                addressObj.balance = balance.ToString();
                            }
                        }
                    }
                }
            }

            await Task.CompletedTask;
        }

    }
}
