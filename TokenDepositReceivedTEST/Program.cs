using MetrICXCore.Gateways;
using Newtonsoft.Json;
using System;

namespace TokenDepositReceivedTEST
{
    class Program
    {
        static void Main(string[] args)
        {
            var icxBlock = IconGateway.GetBlockByHeight(17699880); //ICX dividends

            var trx = icxBlock.ConfirmedTransactionList[1];
            var txResult = IconGateway.GetTransactionResult(trx.TxHash);
            trx.TxResultDetails = txResult;

            var msgStr = JsonConvert.SerializeObject(trx);

            var func = new TokenDepositReceivedFunction.Function();
            func.ProcessRecordAsync(null, msgStr).Wait();
        }
    }
}
