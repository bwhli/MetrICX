using BlockSniffer.Gateways;
using IconSDK;
using IconSDK.RPCs;
using System;

namespace BlockSniffer
{
    public class Program
    {
        static void Main(string[] args)
        {

            // GetTotalSupply
            var getTotalSupply = new GetTotalSupply(Consts.ApiUrl.TestNet);
            var totalSupply = getTotalSupply.Invoke().Result;

            //var getLastBlock = IconSDK.RPCs.GetLastBlock.Create(Consts.ApiUrl.TestNet);
            //var block = getLastBlock().Result;

            //IconGateway.CallTestService().Wait();

            //var getablock = IconSDK.RPCs.GetBlockByHeight.Create(Consts.ApiUrl.TestNet);
            //var ablock = getablock(100000).Result;

            IconGateway.GetLastBlock();
        }
    }
}
