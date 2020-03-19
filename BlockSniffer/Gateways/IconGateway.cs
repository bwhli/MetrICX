using BlockSniffer.Entities;
using IconSDK;
using IconSDK.Blockchain;
using IconSDK.RPCs;
using JsonRpc.CoreCLR.Client;
using JsonRpc.CoreCLR.Client.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace BlockSniffer.Gateways
{
    public enum IcxMethods
    {
        icx_getLastBlock
    }

    public static class IconGateway
    {


        public static Decimal IntToDecimal(BigInteger bigInt)
        {
            return ((decimal)bigInt) / (decimal)Consts.ICX2Loop;
        }

        public static ICXBlock GetLastBlock()
        {

            //var getBlockHeight = IconSDK.RPCs.GetLastBlock.Create(Consts.ApiUrl.MainNet);
            //var block = getBlockHeight.Invoke().Result;
            //return block;

            // GetLastBlock
            //var getLastBlock = IconSDK.RPCs.GetLastBlock.Create(Consts.ApiUrl.TestNet);
            //var block = getLastBlock();
            //return block.Result;

            var response = RPCCall<ICXBlock>(IcxMethods.icx_getLastBlock).Result.Result;
            return response;
        }

        public static async Task<JsonRpcResponse<ReturnType>> RPCCall<ReturnType>(IcxMethods method)
        {
            Uri rpcEndpoint = new Uri("https://wallet.icon.foundation/api/v3");
            JsonRpcWebClient rpc = new JsonRpcWebClient(rpcEndpoint);

            var request = new Entities.Request();
            request.Method = method.ToString();
            request.Jsonrpc = "2.0";
            request.Id = 1234;

            // you can use Json.Net JValue if the service returns a value or
            // JObject if it returns an object or you can provide your own
            // custom class type to be used when deserializing the rpc result
            var response = rpc.InvokeAsync<ReturnType>(request.Method, request);
            return response.Result;
        }
    }
}
