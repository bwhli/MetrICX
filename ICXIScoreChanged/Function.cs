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

namespace ICXIScoreChangedFunction
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
            foreach (var record in evnt.Records)
            {
                await ProcessRecordAsync(context);
            }
        }

        public async Task ProcessRecordAsync(ILambdaContext context)
        {
            context.Logger.LogLine($"[{DateTime.Now.ToString()}] Processed record");

            var addressToggles = FirebaseGateway.GetToggleAddresses("awsdeposits");

            var devices = FirebaseGateway.GetDevicesForIScorePush();

            foreach (var device in devices)
            {
                foreach (var address in device.addresses_v2.AsEnumerator())
                {
                    if (addressToggles.Any(a => a == address.address)) //Check if address is in the toggles list
                    { 
                        try
                        {
                            var totalRewards = IconGateway.GetAvailableRewards(address);
                            if (address.availableRewardsAsDecimal < totalRewards)
                            {
                                decimal awardedICX = totalRewards - address.availableRewardsAsDecimal;
                                if (string.IsNullOrEmpty(address.Name))
                                    FirebaseGateway.SendPush(device.token, address.address, $"{address.Symbol} Rewards Available NEW", $"Congratulations! your reward of {totalRewards.ToString("0.##")} {address.Symbol} is ready to be claimed");
                                else
                                    FirebaseGateway.SendPush(device.token, address.address, $"{address.Symbol} Rewards Available NEW", $"Congratulations! your reward of {totalRewards.ToString("0.##")} {address.Symbol} is ready to be claimed from {address.Name.ToUpper()}");

                                //Now update firestore so we dont send the user duplicate messages
                                address.availableRewards = totalRewards.ToString();
                                address.lastIScorePushSentDate = DateTime.UtcNow;
                            }
                            else if (address.availableRewardsAsDecimal > totalRewards)
                            {
                                address.availableRewards = totalRewards.ToString();
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"[MAIN] EXCEPTION processing IScore check {ex.Message}");
                        }
                    }
                }
            }

            await Task.CompletedTask;
        }
    }
}
