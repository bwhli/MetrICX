using MetrICXServerPush.Entities;
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
            //var device = FirebaseGateway.GetDevice("f0gJLDyHKbY:APA91bE3ozkgWVVfURfDpZUvyWz8VRx7EbREgWfTPETMW9syfDrXnIQwTnX9qU8ZZ9VQf85Scx1pmGHs2ypir6Pxt91W93ekjo3G5Y08TqwZFPQD1HijcjQxAMJXo2ZqJvgrWBPMDrro");
            //ProcessDeviceAddress(device, device.addresses[0]);
            
            Console.WriteLine("[MAIN] STARTING APPLICATION TIMER  v2.1");
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
                    foreach (var address in device.addresses)
                    {
                        Console.WriteLine($"[MAIN] Processing Device {count++} with address {address.Symbol} {address.address}");
                        ProcessDeviceAddress(device, address);
                    }
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
            FirebaseGateway.UpdateDevice(device);

            if (sendResponse != null && sendResponse.failure > 0)
            {
                if (sendResponse.results.Any(a => a.error == "NotRegistered"))
                {
                    //This token has become stale, need to remove it from firestore
                    FirebaseGateway.DeleteDevice(device);
                }
            }

            Console.WriteLine("");
        }

    }
}
