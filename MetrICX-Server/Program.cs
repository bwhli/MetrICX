using MetrICXServerPush.Entities;
using MetrICXServerPush.Gateways;
using System;
using System.Linq;
using System.Timers;

namespace MetrICXServerPush
{
    class Program
    {
        static int timerInterval = 30; //Seconds
        static Timer timer = new Timer();

        static int timerPrepInterval = 60; //Seconds
        static Timer timerPrep = new Timer();

        static PReps AllPReps;

        static void Main(string[] args)
        {
            Console.WriteLine("[MAIN] STARTING APPLICATION TIMER  v1.5");
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
                var count = 0;
                foreach (var device in FirebaseGateway.AllDevices())
                {
                    Console.WriteLine($"[MAIN] Processing Device {count++} with address {device.address}");
                    ProcessDevice(device);
                }
            }
            finally
            {
                timer.Start();
            }
        }

        public static void ProcessDevice(DeviceRegistration device)
        {
            if (!device.registrationDate.HasValue)
            {
                device.registrationDate = DateTime.UtcNow;
                FirebaseGateway.UpdateDevice(device);
            }

            if (device.enablePushIScoreChange == true)
            {
                var icxTotalRewards = IconGateway.GetAvailableRewards(device.address);
                if (device.availableRewardsAsDecimal < icxTotalRewards)
                {
                    decimal awardedICX = icxTotalRewards - device.availableRewardsAsDecimal;
                    FirebaseGateway.SendPush(device.token, device.address, "ICX Rewards Available", $"Congratulations! your reward of {icxTotalRewards.ToString("0.##")} ICX is ready to be claimed");
                    //Now update firestore so we dont send the user duplicate messages
                    device.availableRewards = icxTotalRewards.ToString();
                    device.lastIScorePushSentDate = DateTime.UtcNow;
                    FirebaseGateway.UpdateDevice(device);
                }
                else if (device.availableRewardsAsDecimal > icxTotalRewards)
                {
                    device.availableRewards = icxTotalRewards.ToString();
                    FirebaseGateway.UpdateDevice(device);
                }
            }

            if (device.enablePushDeposits == true)
            {
                var balance = IconGateway.GetICXBalance(device.address);
                if (string.IsNullOrEmpty(device.balance))
                {
                    //Store current balance without sending a notification
                    device.balance = balance.ToString();
                    FirebaseGateway.UpdateDevice(device);
                }
                else if (device.balanceAsDecimal < balance)
                {
                    decimal depositReceived = balance - device.balanceAsDecimal;
                    FirebaseGateway.SendPush(device.token, device.address, "ICX Deposit Received", $"You have received a deposit of {depositReceived.ToString("0.##")} ICX");
                    //Now update firestore so we dont send the user duplicate messages
                    device.balance = balance.ToString();
                    device.lastDepositPushSentDate = DateTime.UtcNow;
                    FirebaseGateway.UpdateDevice(device);
                }
                else if (device.balanceAsDecimal > balance)
                {
                    device.balance = balance.ToString();
                    FirebaseGateway.UpdateDevice(device);
                }
            }

            if (device.enablePushProductivityDrop == true && AllPReps != null)
            {
                if (AllPReps != null)
                {
                    lock (AllPReps)
                    {
                        var pReps = IconGateway.GetDelegatedPReps(device.address);
                        if (pReps != null && pReps.Delegations != null && pReps.Delegations.Length > 0)
                        {
                            foreach (var prep in pReps.Delegations)
                            {
                                var findPrep = AllPReps.Preps.SingleOrDefault(p => p.Address == prep.Address);
                                if (findPrep != null && findPrep.Productivity < 95)
                                {
                                    if (device.lastProductivityPushSentDate == null || (DateTime.UtcNow - device.lastProductivityPushSentDate).Value.Days > 1)
                                    {
                                        FirebaseGateway.SendPush(device.token, device.address, "P-Rep Productivity Warning", $"Warning! Your delegated P-Rep {findPrep.Name}'s productivity has dropped to {findPrep.Productivity.ToString("0.##")}%");
                                        //Now update firestore so we dont send the user duplicate messages
                                        device.lastProductivityPushSentDate = DateTime.UtcNow;
                                        FirebaseGateway.UpdateDevice(device);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            Console.WriteLine("");
        }

    }
}
