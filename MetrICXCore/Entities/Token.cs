using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Text;

namespace MetrICXCore.Entities
{
    [FirestoreData]
    public class Token
    {
        private bool _dirty = false;

        private string _token;
        private string _contractAddress;
        private DateTime? _lastDepositPushSentDate;
        private string _lastBalance;
        private bool? _isSelected;

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

        [FirestoreProperty("IsSelected")]
        public bool? isSelected
        {
            get => _isSelected;
            set
            {
                _dirty = _dirty || _isSelected != value;
                _isSelected = value;
            }
        }

        [FirestoreProperty]
        public DateTime? lastDepositPushSentDate
        {
            get => _lastDepositPushSentDate;
            set
            {
                _dirty = _dirty || _lastDepositPushSentDate != value;
                _lastDepositPushSentDate = value;
            }
        }

        [FirestoreProperty]
        public string lastBalance
        {
            get => _lastBalance;
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
