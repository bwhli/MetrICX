using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Text;

namespace MetrICXServerPush.Entities
{
    [FirestoreData]
    public class Token
    {
        private bool _dirty = false;

        private string _token;
        private string _contractAddress;
        private DateTime? _lastDepositPushSentDate;
        private string _lastBalance;

        [FirestoreProperty("Token")]
        public string token
        {
            get => _token;
            set
            {
                _dirty = _dirty || _token != value;
                _token = value;
            }
        }

        [FirestoreProperty("ContractAddress")]
        public string contractAddress
        {
            get => _contractAddress;
            set
            {
                _dirty = _dirty || _contractAddress != value;
                _contractAddress = value;
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
        public string lastBalance { get => _lastBalance; 
            set
            {
                _dirty = _dirty || _lastBalance != value;
                _lastBalance = value;
            }
        }

        public decimal balanceAsDecimal
        {
            get
            {
                return Convert.ToDecimal(lastBalance);
            }
        }

        public bool Dirty { get => _dirty; }

        public void ResetDirty()
        {
            _dirty = false;
        }
    }
}
