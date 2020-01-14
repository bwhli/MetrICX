﻿using IconSDK;
using IconSDK.RPCs;
using MetrICXServerPush.Entities;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Numerics;
using System.Text;

namespace MetrICXServerPush.Gateways
{
    public static class IconGateway
    {
        public static Decimal IntToDecimal(BigInteger bigInt)
        {
            return ((decimal)bigInt) / (decimal)Consts.ICX2Loop;
        }

        public static Decimal GetAvailableRewards(Address address)
        {
            Console.WriteLine($"[ICON] Getting available Rewards for address {address}");
            var call = new Call<IDictionary<string, BigInteger>>(Consts.ApiUrl.MainNet);

            if (address.Symbol == "ICX")
            {
                try
                {
                    var result = call.Invoke(
                        address.address,
                        "cx0000000000000000000000000000000000000000",
                        "queryIScore",
                        ("address", address.address)
                    ).Result;

                    var icx = IntToDecimal(result["estimatedICX"]);
                    Console.WriteLine($"[ICON] ICX for address {address.address} is {icx}");
                    return icx;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[ICON] EXCEPTION GetAvailableRewards for address {address} : {ex.Message}");
                    throw;
                }
            }
            else
            {
                Console.WriteLine($"[ICON] EXCEPTION Unknown symbol {address.Symbol}");
                return 0;
            }
        }

        public static PReps GetAllPReps()
        {
            Console.WriteLine($"[ICON] Getting all PReps");
            var call = new Call<PRepResult>(Consts.ApiUrl.MainNet);

            var result = call.Invoke(
                "hx0000000000000000000000000000000000000000",
                "cx0000000000000000000000000000000000000000",
                "getPReps"
            ).Result;

            var preps = new PReps(result);
            return preps;
        }

        public static Decimal GetBalance(Address address)
        {
            Console.WriteLine($"[ICON] Getting balance for {address.Symbol} address {address.address}");
            if (address.Symbol == "ICX")
            {
                var getBalance = IconSDK.RPCs.GetBalance.Create(Consts.ApiUrl.MainNet);

                try
                {
                    var balance = IntToDecimal(getBalance(address.address).Result);
                    Console.WriteLine($"[ICON] ICX Balance for address {address} for {balance}");
                    return balance;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[ICON] EXCEPTION GetICXBalance for address {address} : {ex.Message}");
                    throw;
                }
            } else
            {
                //Need to load balance of different tokens
            }

            return 0;
        }

        public static PRepDelegations GetDelegatedPReps(Address address)
        {
            Console.WriteLine($"[ICON] Getting Delegated PReps {address}");
            if (address.Symbol == "ICX")
            {
                var call = new Call<PRepDelegations>(Consts.ApiUrl.MainNet);

                try
                {
                    var result = call.Invoke(
                        address.address,
                        "cx0000000000000000000000000000000000000000",
                        "getDelegation",
                        ("address", address)
                    ).Result;

                    return result;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[ICON] EXCEPTION GetDelegatedPReps for address {address.address} : {ex.Message}");
                    throw;
                }
            }

            return null;
        }

    }
}
