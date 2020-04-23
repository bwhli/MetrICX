using Amazon;
using Amazon.SimpleNotificationService;
using Amazon.SimpleNotificationService.Model;
using MetrICXCore.Entities;
using MetrICXCore.Gateways;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Numerics;
//using System.Threading;
using System.Threading.Tasks;
using System.Timers;

namespace BlockSniffer
{
    public class Program
    {
        static int timerInterval = 1000;
        static Timer timer = new Timer();
        static int timerWLInterval = 60000;
        static Timer timerWL = new Timer();
        static int eventCounter = 0;
        static long lastProcessedHeight = 0;
        static AmazonSimpleNotificationServiceClient _snsClient;
        static decimal oldRewards = -1;
        static int MAX_THREADS = 120;

        static Config config;

        static void Main(string[] args)
        {
            config = Config.LoadConfig();

            //publishMessage();15,564,833
            //var lastBlock = IconGateway.GetLastBlock();//.GetBlockByHeight(17699880);
            //ProcessBlock(lastBlock);

            //var icxValue = lastBlock.ConfirmedTransactionList[1].GetIcxValue();


            //Get last block processed
            var lastBlockProcessed = FirebaseGateway.GetLastBlockProcessed();
            lastProcessedHeight = lastBlockProcessed.height;

            Console.WriteLine("[MAIN] STARTING APPLICATION v1.1");
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
                //UpdateWatchList();
            }
            finally
            {
                timerWL.Start();
            }
        }

        private static void Timer_Elapsed(object sender, ElapsedEventArgs e)
        {
            timer.Stop();
            try
            {
                Console.WriteLine($"TIMER BLOCK START (Threads {Process.GetCurrentProcess().Threads.Count})");
                var lastBlock = IconGateway.GetLastBlock();

                if (lastBlock.Height % 10 == 0)
                {
                    var incompleteBlocks = FirebaseGateway.GetAllIncompleteBlocks();
                    foreach (var block in incompleteBlocks)
                    {
                        ProcessBlockInThread(block.height);
                    }
                }

                if (lastProcessedHeight == 0)
                {
                    ProcessBlockInThread(lastBlock);
                }
                else if (lastProcessedHeight == lastBlock.Height)
                {
                    //Do nothing
                }
                else if (lastProcessedHeight == lastBlock.Height - 1)
                {
                    ProcessBlockInThread(lastBlock);
                }
                else
                {
                    //We have missed some blocks, need to catch up
                    for (long indexHeight = lastProcessedHeight + 1; indexHeight < lastBlock.Height; indexHeight++)
                    {
                        FirebaseGateway.SetBlockProcessed(new BlockProcessedStatus() {completed = false, height = indexHeight, retryAttempts = -1});
                        ProcessBlockInThread(indexHeight);
                        lastProcessedHeight = indexHeight;
                    }

                    ProcessBlockInThread(lastBlock);
                }
                lastProcessedHeight = lastBlock.Height;
            }
            catch (Exception ex)
            {
                //Do nothing for now, next timer hit will retry
            }
            finally
            {
                timer.Start();
            }
        }

        private static void ProcessBlockInThread(long height)
        {

            //If there are too many thread, wait here for a bit
            while (Process.GetCurrentProcess().Threads.Count > MAX_THREADS)
            {
                Console.Write(".");
                System.Threading.Thread.Sleep(100);
            }

            var newThread = (new System.Threading.Thread((idxHeight) =>
            {
                ProcessBlock(null, (long)idxHeight);
            })
            {
                Name = $"processing height {height}"
            });

            newThread.Start(height);
        }

        private static void ProcessBlockInThread(ICXBlock icxBlock)
        {

            //If there are too many thread, wait here for a bit
            while (Process.GetCurrentProcess().Threads.Count > MAX_THREADS)
            {
                Console.Write(".");
                System.Threading.Thread.Sleep(100);
            }

            var newThread = (new System.Threading.Thread((block) =>
            {
                ProcessBlock((ICXBlock)block);
            })
            {
                Name = $"processing height {icxBlock.Height}"
            });

            newThread.Start(icxBlock);
        }

        private static void ProcessBlock(ICXBlock block, long icxBlockHeight = -1)
        {
            BlockProcessedStatus blockStatus = null;
            ICXBlock icxBlock = block;
            long blockHeight = 0;

            try
            {
                //Get block height to process
                
                if (icxBlockHeight > 0)
                    blockHeight = icxBlockHeight;
                else
                    blockHeight = block.Height;

                //Get block info from Firebase
                Console.WriteLine($"Starting to Process Block {blockHeight} in thread {System.Threading.Thread.CurrentThread.ManagedThreadId}");
                blockStatus = FirebaseGateway.GetBlockProcessed(blockHeight);
                if (blockStatus == null)
                {
                    blockStatus = new BlockProcessedStatus()
                    {
                        height = blockHeight,
                        eventsPublished = 0,
                        retryAttempts = 0
                    };
                }
                else
                {
                    if (blockStatus.completed == true)
                    {
                        Console.WriteLine($"Block {blockHeight} is already completed, exiting");
                        return;
                    }

                    blockStatus.retryAttempts++;
                }

                //Get the ICX Block if it not provided
                if (icxBlockHeight > 0)
                    icxBlock = IconGateway.GetBlockByHeight(icxBlockHeight);

                blockStatus.blockTimestamp = Google.Cloud.Firestore.Timestamp.FromDateTimeOffset(icxBlock.GetTimeStamp().AddHours(-8));

                // Check ISCORE
                var rewards = IconGateway.GetAvailableRewards("hxc147caa988765c13eaa6ca43400c27a0372b9436");
                if (rewards < oldRewards || oldRewards == -1)
                {
                    oldRewards = rewards;
                }
                else if (rewards > oldRewards)
                {
                    blockStatus.eventsPublished++;
                    Console.WriteLine($"ISCORE CHANGED, Pushing event update");
                    publishIScoreChange();
                    oldRewards = rewards;
                }
 
                var blockTimeStamp = DateTimeOffset.FromUnixTimeMilliseconds(icxBlock.TimeStamp / 1000).AddHours(8);
                var oldNess = Convert.ToInt32((DateTime.UtcNow.AddHours(8) - icxBlock.GetTimeStamp()).TotalSeconds);

                //What do we do
                Console.WriteLine($"block timestamp {icxBlock.GetTimeStamp()}, oldNess {oldNess} seconds, HEIGHT {icxBlock.Height}, transactions {icxBlock.ConfirmedTransactionList.Count}, eventCount {eventCounter}, retries {blockStatus.retryAttempts} in thread {System.Threading.Thread.CurrentThread.ManagedThreadId}");

                foreach (var tx in icxBlock.ConfirmedTransactionList)
                {
                    var txStr = JsonConvert.SerializeObject(tx);

                    if (tx.From != null && tx.From.StartsWith("hx") && tx.To != null && tx.To.StartsWith("hx"))
                    {
                        blockStatus.eventsPublished++;
                        publishTransferMessage(tx);
                    }
                        
                    if (tx.From != null && tx.From.StartsWith("hx") && tx.To != null && tx.To.StartsWith("cx"))
                    {
                        blockStatus.eventsPublished++;
                        var txResult = IconGateway.GetTransactionResult(tx.TxHash);
                        tx.TxResultDetails = txResult;

                        publishContractMethodMessage(tx);

                    }
                }

                blockStatus.completed = true;
                UpdateBlockStatus(blockStatus, icxBlock);
                Console.WriteLine($"COMPLETED {icxBlock.Height} in thread {System.Threading.Thread.CurrentThread.ManagedThreadId}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"EXCEPTION : Error on block {blockHeight} :  {ex.Message} in thread {System.Threading.Thread.CurrentThread.ManagedThreadId}");

                blockStatus.completed = false;
                blockStatus.lastErrorMessage = ex.Message;
                UpdateBlockStatus(blockStatus, icxBlock);
            }
        }

        static public void publishTransferMessage(ConfirmedTransaction trx)
        {
            eventCounter++;
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
                DataType = "Number",
                StringValue = trx.GetIcxValue().ToString()
            };

            var request = new PublishRequest("arn:aws:sns:ap-southeast-2:850900483067:ICX_Transfer", msgStr, "transfer");
            request.MessageAttributes = messageAttributes;

            GetSNS().PublishAsync(request);

            Console.WriteLine($"Published message to AWS : ICX_Transfer, txHash " + trx.TxHash);
        }

        static public void publishContractMethodMessage(ConfirmedTransaction trx)
        {
            eventCounter++;
            var msgStr = JsonConvert.SerializeObject(trx);
            Dictionary<String, MessageAttributeValue> messageAttributes = new Dictionary<string, MessageAttributeValue>();
            messageAttributes["from"] = new MessageAttributeValue
            {
                DataType = "String",
                StringValue = trx.From
            };
            messageAttributes["contract"] = new MessageAttributeValue
            {
                DataType = "String",
                StringValue = trx.To
            };
            if (trx.Data.method != null)
            {
                messageAttributes["method"] = new MessageAttributeValue
                {
                    DataType = "String",
                    StringValue = trx.Data.method.Value
                };
            }

            List<string> eventList = new List<string>();
            foreach (var eventitem in trx.TxResultDetails.EventLogs)
            {
                string eventName = eventitem.Indexed[0];
                if (eventName.IndexOf("(") > 0)
                    eventName = eventName.Substring(0, eventName.IndexOf("("));
                eventList.Add(eventName);
            }

            messageAttributes["events"] = new MessageAttributeValue
            {
                DataType = "String.Array",
                StringValue = "[\"" + string.Join("\",\"", eventList) + "\"]"
            };

            var request = new PublishRequest("arn:aws:sns:ap-southeast-2:850900483067:ICX_Contract_Method", msgStr, "score method");
            request.MessageAttributes = messageAttributes;

            GetSNS().PublishAsync(request);

            Console.WriteLine($"Published message to AWS : ICX_Contract_Method, txHash " + trx.TxHash);
        }

        static public void publishIScoreChange()
        {
            eventCounter++;
            GetSNS().PublishAsync(new PublishRequest("arn:aws:sns:ap-southeast-2:850900483067:ICX_IScore_Change", "{}", "iscore changed"));

            Console.WriteLine($"Published message to AWS : ICX_IScore_Change");
        }

        static public AmazonSimpleNotificationServiceClient GetSNS()
        {
            if (_snsClient == null)
                _snsClient = new AmazonSimpleNotificationServiceClient(config.AccessKey, config.SecretKey, RegionEndpoint.APSoutheast2);
            return _snsClient;
        }

        static public void UpdateBlockStatus(BlockProcessedStatus blockStatus, ICXBlock block)
        {
            if (block != null)
                blockStatus.processingDelaySeconds = Convert.ToInt32((DateTime.UtcNow.AddHours(8) - block.GetTimeStamp()).TotalSeconds);
            blockStatus.processedTimestamp = Google.Cloud.Firestore.Timestamp.GetCurrentTimestamp();

            FirebaseGateway.SetBlockProcessed(blockStatus);
        }
    }
}
