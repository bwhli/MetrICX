using Google.Cloud.Firestore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;

namespace MetrICXServerPush.Entities
{
    [FirestoreData]
    public class DeviceRegistration
    {
        private bool _dirty = false;

        private DateTime? _registrationDate;
        private string _token;
        private bool? _enablePushIScoreChange;
        private bool? _enablePushDeposits;
        private string _enablePushProductivityDrop;
        private DateTime? _lastProductivityPushSentDate;
        private List<Address> _addresses;

        [FirestoreProperty]
        public string token { get => _token; set => _token = value; }

        [FirestoreProperty]
        [Obsolete]
        public string address
        {
            get
            {
                if (addresses != null && addresses.Count > 0) 
                    return addresses[0].address;
                return null;
            }
            set
            {
                CreateDefaultAddress();
                _dirty = addresses[0].address != value;
                addresses[0].address = value;
            }
        }

        [FirestoreProperty]
        public DateTime? registrationDate { 
            get => _registrationDate; 
            set 
            {
                _dirty = _registrationDate != value;
                _registrationDate = value; 
            } 
        }

        [FirestoreProperty]
        public bool? enablePushIScoreChange { 
            get => _enablePushIScoreChange; 
            set
            {
                _dirty = _enablePushIScoreChange != value;
                _enablePushIScoreChange = value;
            }
        }

        [FirestoreProperty]
        [Obsolete]
        public DateTime? lastIScorePushSentDate
        {
            get
            {
                if (addresses != null && addresses.Count > 0)
                    return addresses[0].lastIScorePushSentDate;
                return null;
            }
            set
            {
                CreateDefaultAddress();
                _dirty = addresses[0].lastIScorePushSentDate != value;
                addresses[0].lastIScorePushSentDate = value;
            }
        }

        [FirestoreProperty]
        public bool? enablePushDeposits { 
            get => _enablePushDeposits; 
            set
            {
                _dirty = _enablePushDeposits != value;
                _enablePushDeposits = value;
            }
        }

        [FirestoreProperty]
        [Obsolete]
        public DateTime? lastDepositPushSentDate
        {
            get
            {
                if (addresses != null && addresses.Count > 0)
                    return addresses[0].lastDepositPushSentDate;
                return null;
            }
            set
            {
                CreateDefaultAddress();
                _dirty = addresses[0].lastDepositPushSentDate != value;
                addresses[0].lastDepositPushSentDate = value;
            }
        }

        [FirestoreProperty]
        public string enablePushProductivityDrop { 
            get => _enablePushProductivityDrop; 
            set
            {
                _dirty = _enablePushProductivityDrop != value;
                _enablePushProductivityDrop = value;
            }
        }

        [FirestoreProperty]
        public DateTime? lastProductivityPushSentDate { 
            get => _lastProductivityPushSentDate; 
            set
            {
                _dirty = _lastProductivityPushSentDate != value;
                _lastProductivityPushSentDate = value;
            }
        }

        [FirestoreProperty]
        [Obsolete]
        public string availableRewards
        {
            get
            {
                if (addresses != null && addresses.Count > 0)
                    return addresses[0].availableRewards;
                return null;
            }
            set
            {
                CreateDefaultAddress();
                _dirty = addresses[0].availableRewards != value;
                addresses[0].availableRewards = value;
            }
        }

        [FirestoreProperty]
        [Obsolete]
        public string balance
        {
            get
            {
                if (addresses != null && addresses.Count > 0)
                    return addresses[0].balance;
                return null;
            }
            set
            {
                CreateDefaultAddress();
                _dirty = addresses[0].balance != value;
                addresses[0].balance = value;
            }
        }

        [FirestoreProperty]
        public List<Address> addresses { 
            get => _addresses; 
            set
            {
                _dirty = _addresses != value;
                _addresses = value;
            }
        }

        public bool Dirty {
            get 
            {
                return _dirty || addresses.Any(address => address.Dirty);
            }
        }

        public void ResetDirty()
        {
            _dirty = false;
            foreach (var address in addresses)
                address.ResetDirty();
        }

        private void CreateDefaultAddress()
        {
            //Some fields will auto-map to the first address in the list, so create that item
            if (addresses == null) addresses = new List<Address>();
            if (addresses.Count == 0) addresses.Add(new Address() { Symbol = "ICX" });
        }

    }
}
