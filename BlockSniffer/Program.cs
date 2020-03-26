using BlockSniffer.Entities;
using BlockSniffer.Gateways;
using IconSDK;
using IconSDK.RPCs;
using System;
using System.Timers;

namespace BlockSniffer
{
    public class Program
    {
        static int timerInterval = 1500;
        static System.Timers.Timer timer = new Timer();
        static long lastProcessedHeight = 0; 

        static void Main(string[] args)
        {

            Console.WriteLine("[MAIN] STARTING APPLICATION");
            timer.Elapsed += Timer_Elapsed;
            timer.Interval = timerInterval;
            timer.Start();

            while (true)
            {
                System.Threading.Thread.Sleep(1000);
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

                var rewards1 = IconGateway.GetAvailableRewards("hx1141b769011ee8399ef70f393b568ca15a6e22d7");

                var rewards2 = IconGateway.GetAvailableRewards("hxc147caa988765c13eaa6ca43400c27a0372b9436");

                //TimeSpan t = DateTime.UtcNow - new DateTime(1970, 1, 1);
                //int secondsSinceEpoch = t.Ticks / DateTime. ;
                //Console.WriteLine(secondsSinceEpoch);
                //DateTimeOffset.Now.ToUnixTimeSeconds();

                var blockTimeStamp = DateTimeOffset.FromUnixTimeMilliseconds(icxBlock.TimeStamp / 1000).AddHours(8);


                //What do we do
                Console.WriteLine($"{DateTime.Now} Incoming block received : {icxBlock.Height}, block of the day {blockoftheday}, transactions {icxBlock.ConfirmedTransactionList.Count}, rewards 1 {rewards1}, rewards 2 {rewards2}");

                lastProcessedHeight = icxBlock.Height;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"EXCEPTION : Error on block {icxBlock.Height} :  {ex.Message}");
                throw;
            }
        }
    }
}
