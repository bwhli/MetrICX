using Amazon;
using Amazon.SimpleNotificationService;
using Amazon.SimpleNotificationService.Model;
using MetrICXCore.Entities;
using MetrICXCore.Gateways;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Timers;

namespace BlockSniffer
{
    public class Program
    {
        static int timerInterval = 1500;
        static Timer timer = new Timer();
        static int timerWLInterval = 60000;
        static Timer timerWL = new Timer();

        static long lastProcessedHeight = 0;
        static AmazonSimpleNotificationServiceClient _snsClient;
        static List<string> watchList = new List<string>();

        static void Main(string[] args)
        {
            //publishMessage();15,564,833
            //var lastBlock = IconGateway.GetBlockByHeight(16286914);

            UpdateWatchList();

            Console.WriteLine("[MAIN] STARTING APPLICATION");
            timer.Elapsed += Timer_Elapsed;
            timer.Interval = timerInterval;
            timer.Start();

            timerWL.Elapsed += TimerWL_Elapsed;
            timerWL.Interval = timerWLInterval;
            timerWL.Start();

            while (true)
            {
                System.Threading.Thread.Sleep(1000);
            }
        }

        private static void TimerWL_Elapsed(object sender, ElapsedEventArgs e)
        {
            timerWL.Stop();
            try
            {
                UpdateWatchList();
            }
            finally
            {
                timerWL.Start();
            }
        }

        private static void UpdateWatchList()
        {
            lock (watchList)
            {
                watchList.Clear();
                var allDevices = FirebaseGateway.AllDevices();
                foreach (var device in allDevices)
                    foreach (var address in device.addresses_v2.AsEnumerator())
                        if (address.address != null && address.address.StartsWith("hx"))
                            watchList.Add(address.address);
            }
        }

        private static void Timer_Elapsed(object sender, ElapsedEventArgs e)
        {
            timer.Stop();
            try
            {
                var lastBlock = IconGateway.GetLastBlock();

                if (lastProcessedHeight == 0)
                {
                    //We dont have a previous block for some reason, do not catch up, start from here
                    ProcessBlock(lastBlock);
                }
                else if (lastProcessedHeight == lastBlock.Height)
                {
                    //Do nothing
                }
                else if (lastProcessedHeight == lastBlock.Height - 1)
                {
                    //As expected, got the next block
                    ProcessBlock(lastBlock);
                }
                else
                {
                    //We have missed some blocks, need to catch up
                    for (long indexHeight = lastProcessedHeight + 1; indexHeight < lastBlock.Height; indexHeight++)
                    {
                        var oldBlock = IconGateway.GetBlockByHeight(indexHeight);
                        ProcessBlock(oldBlock);
                    }
                    ProcessBlock(lastBlock);
                }
            }
            finally
            {

                timer.Start();
            }
        }

        private static void ProcessBlock(ICXBlock icxBlock)
        {
            try
            {
                long blockoftheday = (icxBlock.Height - 13283) % 43120;

                var rewards1 = 1; //IconGateway.GetAvailableRewards("hx1141b769011ee8399ef70f393b568ca15a6e22d7");

                var rewards2 = 2; //IconGateway.GetAvailableRewards("hxc147caa988765c13eaa6ca43400c27a0372b9436");

                //TimeSpan t = DateTime.UtcNow - new DateTime(1970, 1, 1);
                //int secondsSinceEpoch = t.Ticks / DateTime. ;
                //Console.WriteLine(secondsSinceEpoch);
                //DateTimeOffset.Now.ToUnixTimeSeconds();
//Incoming block received : 16700584, block of the day 42981, transactions 1, rewards 1 0, rewards 2 126.136519267542804784, block timestamp 3 / 27 / 2020 9:14:43 AM
//Incoming block received : 16700585, block of the day 42982, transactions 1, rewards 1 26.207820362406018518, rewards 2 140.021515648686631944, block timestamp 3 / 27 / 2020 9:14:45 AM

                var blockTimeStamp = DateTimeOffset.FromUnixTimeMilliseconds(icxBlock.TimeStamp / 1000).AddHours(8);
                var oldNess = Convert.ToInt32((DateTime.Now - icxBlock.GetTimeStamp()).TotalSeconds);

                //What do we do
                Console.WriteLine($"block timestamp {icxBlock.GetTimeStamp()}, oldNess {oldNess} seconds, HEIGHT {icxBlock.Height}, block of the day {blockoftheday}, transactions {icxBlock.ConfirmedTransactionList.Count}, rewards 1 {rewards1}, rewards 2 {rewards2}");

                foreach (var tx in icxBlock.ConfirmedTransactionList)
                {
                    var txStr = JsonConvert.SerializeObject(tx);
                    foreach (var watchItem in watchList)
                    {
                        if (txStr.Contains(watchItem))
                        {
                            Console.WriteLine($"WATCHLIST ITEM {watchItem}");
                            if (tx.From != null && tx.From.StartsWith("hx") && tx.To != null && tx.To.StartsWith("hx"))
                                publishTransferMessage(tx);

                            if (tx.From != null && tx.From.StartsWith("hx") && tx.To != null && tx.To.StartsWith("cx"))
                                publishContractMethodMessage(tx);

                            break;
                        }
                    }
                }

                lastProcessedHeight = icxBlock.Height;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"EXCEPTION : Error on block {icxBlock.Height} :  {ex.Message}");
                throw;
            }
        }

        static public void publishTransferMessage(ConfirmedTransactionList trx)
        {
            var msgStr = JsonConvert.SerializeObject(trx);
            Dictionary<String, MessageAttributeValue> messageAttributes = new Dictionary<string, MessageAttributeValue>();
            messageAttributes["from"] = new MessageAttributeValue
            {
                DataType = "String",
                StringValue = trx.From
            };
            messageAttributes["to"] = new MessageAttributeValue
            {
                DataType = "String",
                StringValue = trx.To
            }; 
            messageAttributes["value"] = new MessageAttributeValue
            {
                DataType = "String",
                StringValue = trx.Value
            };

            var request = new PublishRequest("arn:aws:sns:ap-southeast-2:850900483067:ICX_Transfer", msgStr, "transfer");
            request.MessageAttributes = messageAttributes;

            GetSNS().PublishAsync(request);
        }

        static public void publishContractMethodMessage(ConfirmedTransactionList trx)
        {
            var msgStr = JsonConvert.SerializeObject(trx);
            GetSNS().PublishAsync(new PublishRequest("arn:aws:sns:ap-southeast-2:850900483067:ICX_Contract_Method", msgStr, "contract method"));
        }

        static public AmazonSimpleNotificationServiceClient GetSNS()
        {
            if (_snsClient == null)
                _snsClient = new AmazonSimpleNotificationServiceClient("AKIA4MHM67P5QJRYNDYD", "YQ33fdnkyG/godWyLxiSTy9Im+dg9uhYGdN/I1sq", RegionEndpoint.APSoutheast2);
            return _snsClient;
        }

    }
}
