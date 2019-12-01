using IconSDK;
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

        public static Decimal GetAvailableRewards(string address)
        {
            Console.WriteLine($"[ICON] Getting available Rewards for address {address}");
            var call = new Call<IDictionary<string, BigInteger>>(Consts.ApiUrl.MainNet);

            try
            {
                var result = call.Invoke(
                    address,
                    "cx0000000000000000000000000000000000000000",
                    "queryIScore",
                    ("address", address)
                ).Result;

                var icx = IntToDecimal(result["estimatedICX"]);
                Console.WriteLine($"[ICON] ICX for address {address} is {icx}");
                return icx;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ICON] EXCEPTION GetAvailableRewards for address {address} : {ex.Message}");
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

        public static Decimal GetICXBalance(string address)
        {
            Console.WriteLine($"[ICON] Getting balance for address {address}");
            var getBalance = GetBalance.Create(Consts.ApiUrl.MainNet);

            try
            {
                var balance = IntToDecimal(getBalance(address).Result);
                Console.WriteLine($"[ICON] ICX Balance for address {address} for {balance}");
                return balance;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ICON] EXCEPTION GetICXBalance for address {address} : {ex.Message}");
                return 0;
            }
        }

        public static PRepDelegations GetDelegatedPReps(string address)
        {
            Console.WriteLine($"[ICON] Getting Delegated PReps {address}");
            var call = new Call<PRepDelegations>(Consts.ApiUrl.MainNet);

            try
            {
                var result = call.Invoke(
                    address,
                    "cx0000000000000000000000000000000000000000",
                    "getDelegation",
                    ("address", address)
                ).Result;

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ICON] EXCEPTION GetDelegatedPReps for address {address} : {ex.Message}");
                return null;
            }
        }

    }
}
