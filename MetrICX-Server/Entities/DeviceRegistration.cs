using Google.Cloud.Firestore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Numerics;
using System.Text;

namespace MetrICXServerPush.Entities
{
    [FirestoreData]
    public class DeviceRegistration
    {
        [FirestoreProperty]
        public string token { get; set; }

        [FirestoreProperty] 
        public string address { get; set; }

        [FirestoreProperty]
        public DateTime? registrationDate { get; set; }

        [FirestoreProperty]
        public bool? enablePushIScoreChange { get; set; }

        [FirestoreProperty]
        public DateTime? lastIScorePushSentDate { get; set; }

        [FirestoreProperty]
        public bool? enablePushDeposits { get; set; }

        [FirestoreProperty]
        public DateTime? lastDepositPushSentDate { get; set; }

        [FirestoreProperty] 
        public bool? enablePushProductivityDrop { get; set; }

        [FirestoreProperty]
        public DateTime? lastProductivityPushSentDate { get; set; }

        [FirestoreProperty]
        public string availableRewards { get; set; }

        [FirestoreProperty]
        public string balance { get; set; }

        public decimal availableRewardsAsDecimal
        {
            get
            {
                return Convert.ToDecimal(availableRewards);
            }
        }

        public decimal balanceAsDecimal
        {
            get
            {
                return Convert.ToDecimal(balance);
            }
        }
    }
}
