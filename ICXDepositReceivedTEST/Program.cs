using MetrICXCore.Gateways;
using Newtonsoft.Json;
using System;
using System.IO;

namespace ICXDepositReceivedTEST
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            //var trxScoreSample = File.ReadAllText("TrxScoreSample.json");
            //var trxTransferSample = File.ReadAllText("TrxTransferSample.json"); 
            //var trxTransferSampleError = File.ReadAllText("TrxTransferSampleError.json");

            //var icxBlock = IconGateway.GetBlockByHeight(17305133); //Normal transfer
            var icxBlock = IconGateway.GetBlockByHeight(17564306); //ICX dividends

            var trx = icxBlock.ConfirmedTransactionList[3];
            var txResult = IconGateway.GetTransactionResult(trx.TxHash);
            trx.TxResultDetails = txResult;

            var msgStr = JsonConvert.SerializeObject(trx);

            var func = new ICXDepositReceivedFunction.Function();
            func.ProcessRecordAsync(null, msgStr).Wait();
        }
    }
}
