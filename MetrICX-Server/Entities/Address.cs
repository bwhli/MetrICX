using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MetrICXServerPush.Entities
{
    [FirestoreData]
    public class Address
    {
        private bool _dirty = false;

        private string _address;
        private string _name;
        private DateTime? _lastIScorePushSentDate;
        private DateTime? _lastDepositPushSentDate;
        private string _availableRewards;
        private string _balance;
        private string _symbol;
        private TokenSet _tokens;
        private bool? _enablePushDeposits;

        [FirestoreProperty]
        public string address
        {
            get => _address;
            set
            {
                _dirty = _dirty || _address != value;
                _address = value;
            }
        }

        [FirestoreProperty]
        public string name
        {
            get => _name;
            set
            {
                _dirty = _dirty || _name != value;
                _name = value;
            }
        }

        [FirestoreProperty]
        public string Symbol { get => _symbol; 
            set
            {
                _dirty = _dirty || _symbol != value;
                _symbol = value;
            }
        }

        [FirestoreProperty]
        public DateTime? lastIScorePushSentDate { get => _lastIScorePushSentDate; 
            set
            {
                _dirty = _dirty || _lastIScorePushSentDate != value;
                _lastIScorePushSentDate = value;
            }
        }

        [FirestoreProperty]
        public DateTime? lastDepositPushSentDate { get => _lastDepositPushSentDate;
            set
            {
                _dirty = _dirty || _lastDepositPushSentDate != value;
                _lastDepositPushSentDate = value;
            }
        }

        [FirestoreProperty]
        public string availableRewards { get => _availableRewards; 
            set
            {
                _dirty = _dirty || _availableRewards != value;
                _availableRewards = value;
            }
        }

        [FirestoreProperty]
        public TokenSet tokens { get => _tokens; set => _tokens = value; }

        public bool Dirty
        {
            get
            {
                return _dirty || (tokens != null && tokens.Dirty);
            }
        }


        [FirestoreProperty]
        public string balance { get => _balance; 
            set
            {
                _dirty = _dirty || _balance != value;
                _balance = value;
            }
        }

        [FirestoreProperty]
        public bool? enablePushDeposits
        {
            get => _enablePushDeposits;
            set
            {
                _dirty = _dirty || _enablePushDeposits != value;
                _enablePushDeposits = value;
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

        public void ResetDirty()
        {
            _dirty = false;
            if (tokens != null)
                tokens.ResetDirty();
        }
    }
}
