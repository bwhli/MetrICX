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
                long blockoftheday = icxBlock.Height % 43200;

                //What do we do
                Console.WriteLine($"{DateTime.Now} Incoming block received : {icxBlock.Height}, block of the day {blockoftheday}, transactions {icxBlock.ConfirmedTransactionList.Count}");

                lastProcessedHeight = icxBlock.Height;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"EXCEPTION : {ex.Message}");
                throw;
            }
        }
    }
}
