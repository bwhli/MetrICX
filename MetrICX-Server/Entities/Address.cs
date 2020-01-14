using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Text;

namespace MetrICXServerPush.Entities
{
    [FirestoreData]
    public class Address
    {
        internal bool Dirty = false;

        private string _address;
        private DateTime? _lastIScorePushSentDate;
        private DateTime? _lastDepositPushSentDate;
        private string _availableRewards;
        private string _balance;
        private string _symbol;

        [FirestoreProperty]
        public string address { get => _address; 
            set
            {
                Dirty = _address != value;
                _address = value;
            }
        }

        [FirestoreProperty]
        public string Symbol { get => _symbol; 
            set
            {
                Dirty = _symbol != value;
                _symbol = value;
            }
        }

        [FirestoreProperty]
        public DateTime? lastIScorePushSentDate { get => _lastIScorePushSentDate; 
            set
            {
                Dirty = _lastIScorePushSentDate != value;
                _lastIScorePushSentDate = value;
            }
        }

        [FirestoreProperty]
        public DateTime? lastDepositPushSentDate { get => _lastDepositPushSentDate;
            set
            {
                Dirty = _lastDepositPushSentDate != value;
                _lastDepositPushSentDate = value;
            }
        }

        [FirestoreProperty]
        public string availableRewards { get => _availableRewards; 
            set
            {
                Dirty = _availableRewards != value;
                _availableRewards = value;
            }
        }

        [FirestoreProperty]
        public string balance { get => _balance; 
            set
            {
                Dirty = _balance != value;
                _balance = value;
            }
        }

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
