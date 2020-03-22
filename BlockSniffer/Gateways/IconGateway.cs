﻿using BlockSniffer.Entities;
using IconSDK;
using IconSDK.Blockchain;
using IconSDK.RPCs;
using JsonRpc.CoreCLR.Client;
using JsonRpc.CoreCLR.Client.Models;
using Newtonsoft.Json;
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
        icx_getLastBlock,
        icx_getBlockByHeight
    }

    public static class IconGateway
    {
        public static Decimal IntToDecimal(BigInteger bigInt)
        {
            return ((decimal)bigInt) / (decimal)Consts.ICX2Loop;
        }

        public static ICXBlock GetLastBlock()
        {
            var response = RPCCall<ICXBlock>(IcxMethods.icx_getLastBlock, new RequestParams()).Result.Result;
            return response;
        }

        public static ICXBlock GetBlockByHeight(long height)
        {
            string hexValue = height.ToString("X");

            var response = RPCCall<ICXBlock>(IcxMethods.icx_getBlockByHeight, new RequestParams() { Height = "0x" + hexValue.ToLower() }).Result.Result;
            return response;
        }

        public static async Task<JsonRpcResponse<ReturnType>> RPCCall<ReturnType>(IcxMethods method, RequestParams param = null)
        {
            Uri rpcEndpoint = new Uri("https://wallet.icon.foundation/api/v3");
            JsonRpcWebClient rpc = new JsonRpcWebClient(rpcEndpoint);

            // you can use Json.Net JValue if the service returns a value or
            // JObject if it returns an object or you can provide your own
            // custom class type to be used when deserializing the rpc result
            var response = rpc.InvokeAsync<ReturnType>(method.ToString(), param);
            return response.Result;
        }
    }
}