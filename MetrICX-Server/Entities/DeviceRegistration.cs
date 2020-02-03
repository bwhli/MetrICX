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
        private MapArray<Address> _addresses;

        [FirestoreProperty]
        public string token { get => _token; set => _token = value; }

        [FirestoreProperty]
        [Obsolete]
        public string address
        {
            get
            {
                if (addresses != null && addresses.p0 != null) 
                    return addresses.p0.address;
                return null;
            }
            set
            {
                CreateDefaultAddress();
                _dirty = _dirty || _addresses.p0.address != value;
                addresses.p0.address = value;
            }
        }

        [FirestoreProperty]
        public DateTime? registrationDate { 
            get => _registrationDate; 
            set 
            {
                _dirty = _dirty || _registrationDate != value;
                _registrationDate = value; 
            } 
        }

        [FirestoreProperty]
        public bool? enablePushIScoreChange { 
            get => _enablePushIScoreChange; 
            set
            {
                _dirty = _dirty || _enablePushIScoreChange != value;
                _enablePushIScoreChange = value;
            }
        }

        [FirestoreProperty]
        [Obsolete]
        public DateTime? lastIScorePushSentDate
        {
            get
            {
                if (addresses != null && addresses.p0 != null)
                    return addresses.p0.lastIScorePushSentDate;
                return null;
            }
            set
            {
                CreateDefaultAddress();
                _dirty = _dirty || addresses.p0.lastIScorePushSentDate != value;
                addresses.p0.lastIScorePushSentDate = value;
            }
        }

        [FirestoreProperty]
        public bool? enablePushDeposits { 
            get => _enablePushDeposits; 
            set
            {
                _dirty = _dirty || _enablePushDeposits != value;
                _enablePushDeposits = value;
            }
        }

        [FirestoreProperty]
        [Obsolete]
        public DateTime? lastDepositPushSentDate
        {
            get
            {
                if (addresses != null && addresses.p0 != null)
                    return addresses.p0.lastDepositPushSentDate;
                return null;
            }
            set
            {
                CreateDefaultAddress();
                _dirty = _dirty || addresses.p0.lastDepositPushSentDate != value;
                addresses.p0.lastDepositPushSentDate = value;
            }
        }

        [FirestoreProperty]
        public string enablePushProductivityDrop { 
            get => _enablePushProductivityDrop; 
            set
            {
                _dirty = _dirty || _enablePushProductivityDrop != value;
                _enablePushProductivityDrop = value;
            }
        }

        [FirestoreProperty]
        public DateTime? lastProductivityPushSentDate { 
            get => _lastProductivityPushSentDate; 
            set
            {
                _dirty = _dirty || _lastProductivityPushSentDate != value;
                _lastProductivityPushSentDate = value;
            }
        }

        [FirestoreProperty]
        [Obsolete]
        public string availableRewards
        {
            get
            {
                if (addresses != null && addresses.p0 != null)
                    return addresses.p0.availableRewards;
                return null;
            }
            set
            {
                CreateDefaultAddress();
                _dirty = _dirty || addresses.p0.availableRewards != value;
                addresses.p0.availableRewards = value;
            }
        }

        [FirestoreProperty]
        [Obsolete]
        public string balance
        {
            get
            {
                if (addresses != null && addresses.p0 != null)
                    return addresses.p0.balance;
                return null;
            }
            set
            {
                CreateDefaultAddress();
                _dirty = _dirty || addresses.p0.balance != value;
                addresses.p0.balance = value;
            }
        }

        [FirestoreProperty]
        public MapArray<Address> addresses { 
            get => _addresses; 
            set
            {
                _dirty = _dirty || _addresses != value;
                _addresses = value;
            }
        }

        public bool Dirty {
            get 
            {
                return _dirty || addresses.AsEnumerator().Any(address => address.Dirty);
            }
        }

        public void ResetDirty()
        {
            _dirty = false;
            foreach (var address in addresses.AsEnumerator())
                address.ResetDirty();
        }

        private void CreateDefaultAddress()
        {
            //Some fields will auto-map to the first address in the list, so create that item
            if (addresses == null) addresses = new MapArray<Address>();
            addresses.p0 = new Address() { Symbol = "ICX" };
        }
    }
}
