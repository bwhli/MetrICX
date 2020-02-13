﻿using MetrICXServerPush.Entities;
using MetrICXServerPush.Gateways;
using System;
using System.Linq;
using System.Timers;

namespace MetrICXServerPush
{
    class Program
    {
        static int timerInterval = 120; //Seconds
        static Timer timer = new Timer();

        static int timerPrepInterval = 600; //Seconds
        static Timer timerPrep = new Timer();

        static PReps AllPReps;
        static int pushNotificationCount = 0;

        static void Main(string[] args)
        {
            //var device = FirebaseGateway.GetDevice("fn8-z0vOzbM:APA91bESwaeBs9T2xeIOYrXTxzhFNMuanqNZSXS9x84O9bzohWou7vQoeew2vyeglwH_UC36X7rMHjWFsHEyI5esC3NtLthZzx8WDh3lENlU0Al5DOBL5l_5AuUtuzqNWLq-CIY9voP2");
            //FirebaseGateway.UpdateDevice(device);

            ////device.addresses_v2.p0.tokens = new System.Collections.Generic.List<Token>() { new Token() {token = "TAP", contractAddress = "cxc0b5b52c9f8b4251a47e91dda3bd61e5512cd782" } }; 

            //ProcessDeviceAddress(device, device.addresses_v2.p0);

            Console.WriteLine("[MAIN] STARTING APPLICATION TIMER v2.3");
            ////foreach (var token in device.addresses_v2.p0.tokens)
            ////{
            ////    ProcessDeviceToken(device, token);
            ////}

            Console.WriteLine("[MAIN] STARTING APPLICATION TIMER v2.4");
            timer.Elapsed += Timer_Elapsed;
            timer.Interval = timerInterval * 1000;
            timer.Start();

            timerPrep.Elapsed += TimerPrep_Elapsed;
            timerPrep.Interval = timerPrepInterval * 1000;
            timerPrep.Start();

            AllPReps = IconGateway.GetAllPReps();

            while (true)
            {
                System.Threading.Thread.Sleep(1000);
            }
        }

        private static void TimerPrep_Elapsed(object sender, ElapsedEventArgs e)
        {
            timerPrep.Stop();
            try
            {
                Console.WriteLine("[MAIN] PREP TIMER ELAPSED, Checking all PReps");
                AllPReps = IconGateway.GetAllPReps();
                Console.WriteLine($"[MAIN] Retrieved {AllPReps.Preps.Count} P-Reps");
            }
            finally
            {
                timerPrep.Start();
            }
        }

        private static void Timer_Elapsed(object sender, ElapsedEventArgs e)
        {
            timer.Stop();
            try
            {
                Console.WriteLine("[MAIN] TIMER ELAPSED, Checking all devices");
                
                var allDevices = FirebaseGateway.AllDevices();
                Console.WriteLine($"[MAIN] Processing all devices {allDevices.Count()}");
                var count = 0;
                pushNotificationCount = 0;
                foreach (var device in allDevices)
                {
                    Console.WriteLine($"[MAIN] Processing Device {count++}");
                    if (device.addresses_v2 != null)
                    {
                        foreach (var address in device.addresses_v2.AsEnumerator())
                        {
                            Console.WriteLine($"[MAIN] Processing Address {address.Symbol} {address.address}");
                            ProcessDeviceAddress(device, address);

                            if (address.tokens != null)
                            {
                                foreach (var token in address.tokens.AsEnumerator())
                                {
                                    Console.WriteLine($"[MAIN] Processing Token {token.token} {token.contractAddress}");
                                    ProcessDeviceToken(device, token);
                                }
                            }
                        }
                    }
                    
                    FirebaseGateway.UpdateDevice(device);
                }
                Console.WriteLine($"[MAIN] Finished processing devices, sent {pushNotificationCount} push notifications");
            }
            finally
            {
                timer.Start();
            }
        }

        public static void ProcessDeviceAddress(DeviceRegistration device, Address address)
        {
            SendResponse sendResponse = null;

            if (!device.registrationDate.HasValue)
            {
                device.registrationDate = DateTime.UtcNow;
            }

            if (device.enablePushIScoreChange == true)
            {
                try
                {
                    var totalRewards = IconGateway.GetAvailableRewards(address);
                    if (address.availableRewardsAsDecimal < totalRewards)
                    {
                        decimal awardedICX = totalRewards - address.availableRewardsAsDecimal;
                        sendResponse = FirebaseGateway.SendPush(device.token, address.address, $"{address.Symbol} Rewards Available", $"Congratulations! your reward of {totalRewards.ToString("0.##")} {address.Symbol} is ready to be claimed");
                        //Now update firestore so we dont send the user duplicate messages
                        address.availableRewards = totalRewards.ToString();
                        address.lastIScorePushSentDate = DateTime.UtcNow;
                        pushNotificationCount++;
                    }
                    else if (address.availableRewardsAsDecimal > totalRewards)
                    {
                        address.availableRewards = totalRewards.ToString();
                    }
                } catch (Exception ex)
                {
                    Console.WriteLine($"[MAIN] EXCEPTION processing IScore check {ex.Message}");
                }
            }

            if (device.enablePushDeposits == true)
            {
                try
                {
                    var balance = IconGateway.GetBalance(address);
                    if (string.IsNullOrEmpty(address.balance))
                    {
                        //Store current balance without sending a notification
                        address.balance = balance.ToString();
                    }
                    else if (address.balanceAsDecimal < balance && balance - address.balanceAsDecimal > 0.005M) //Otherwise user gets a message of receiving 0
                    {
                        decimal depositReceived = balance - address.balanceAsDecimal;
                        sendResponse = FirebaseGateway.SendPush(device.token, address.address, $"{address.Symbol} Deposit Received", $"You have received a deposit of {depositReceived.ToString("0.##")} {address.Symbol}");
                        //Now update firestore so we dont send the user duplicate messages
                        address.balance = balance.ToString();
                        address.lastDepositPushSentDate = DateTime.UtcNow;
                        pushNotificationCount++;
                    }
                    else if (address.balanceAsDecimal > balance)
                    {
                        address.balance = balance.ToString();
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[MAIN] EXCEPTION processing Deposit check {ex.Message}");
                }
            }

            if (!string.IsNullOrEmpty(device.enablePushProductivityDrop) && device.enablePushProductivityDrop != "disabled" && AllPReps != null)
            {
                try
                {
                    lock (AllPReps)
                    {
                        var prodDrop = decimal.Parse(device.enablePushProductivityDrop);
                        var pReps = IconGateway.GetDelegatedPReps(address);
                        if (pReps != null && pReps.Delegations != null && pReps.Delegations.Length > 0)
                        {
                            foreach (var prep in pReps.Delegations)
                            {
                                var findPrep = AllPReps.Preps.SingleOrDefault(p => p.Address == prep.Address);
                                if (findPrep != null && findPrep.Productivity < prodDrop && findPrep.Grade == 0)
                                {
                                    if (device.lastProductivityPushSentDate == null || (DateTime.UtcNow - device.lastProductivityPushSentDate).Value.Days > 1)
                                    {
                                        sendResponse = FirebaseGateway.SendPush(device.token, address.address, "P-Rep Productivity Warning", $"Warning! Your delegated P-Rep {findPrep.Name}'s productivity has dropped to {findPrep.Productivity.ToString("0.##")}%");
                                        //Now update firestore so we dont send the user duplicate messages
                                        device.lastProductivityPushSentDate = DateTime.UtcNow;
                                        pushNotificationCount++;
                                    }
                                }
                            }
                        }

                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[MAIN] EXCEPTION processing ProductivityDrop check {ex.Message}");
                }
            }

            if (sendResponse != null && sendResponse.failure > 0)
            {
                if (sendResponse.results.Any(a => a.error == "NotRegistered"))
                {
                    //This token has become stale, need to remove it from firestore
                    FirebaseGateway.DeleteDevice(device);
                }
            }
        }

        public static void ProcessDeviceToken(DeviceRegistration device, Token token)
        {
            SendResponse sendResponse = null;
            
            if (device.enablePushDeposits == true && token.isSelected == true)
            {
                try
                {
                    var balance = IconGateway.GetBalance(device.addresses_v2.p0, token);
                    if (string.IsNullOrEmpty(token.lastBalance))
                    {
                        //Store current balance without sending a notification
                        token.lastBalance = balance.ToString();
                    }
                    else if (token.balanceAsDecimal < balance && balance - token.balanceAsDecimal > 0.005M) //Otherwise user gets a message of receiving 0
                    {
                        decimal depositReceived = balance - token.balanceAsDecimal;
                        sendResponse = FirebaseGateway.SendPush(device.token, token.token, $"{token.token} Deposit Received", $"You have received a deposit of {depositReceived.ToString("0.##")} {token.token}");
                        //Now update firestore so we dont send the user duplicate messages
                        token.lastBalance = balance.ToString();
                        token.lastDepositPushSentDate = DateTime.UtcNow;
                        pushNotificationCount++;
                    }
                    else if (token.balanceAsDecimal > balance)
                    {
                        token.lastBalance = balance.ToString();
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[MAIN] EXCEPTION processing Deposit check {ex.Message}");
                }
            }

            if (sendResponse != null && sendResponse.failure > 0)
            {
                if (sendResponse.results.Any(a => a.error == "NotRegistered"))
                {
                    //This token has become stale, need to remove it from firestore
                    FirebaseGateway.DeleteDevice(device);
                }
            }
        }
    }
}
