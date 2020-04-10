using System;
using System.IO;

namespace ICXDepositReceivedTEST
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            var trxScoreSample = File.ReadAllText("TrxScoreSample.json");
            var trxTransferSample = File.ReadAllText("TrxTransferSample.json"); 
            var trxTransferSampleError = File.ReadAllText("TrxTransferSampleError.json");
            var func = new ICXDepositReceivedFunction.Function();
            func.ProcessRecordAsync(null, trxTransferSampleError).Wait();
        }
    }
}
