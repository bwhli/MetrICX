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
        private MapArray<Address> _addresses_v2;

        [FirestoreProperty]
        public string token { get => _token; set => _token = value; }

        [FirestoreProperty]
        [Obsolete]
        public string address
        {
            get
            {
                if (addresses_v2 != null && addresses_v2.p0 != null) 
                    return addresses_v2.p0.address;
                return null;
            }
            set
            {
                //CreateDefaultAddress();
                //_dirty = _dirty || _addresses_v2.p0.address != value;
                //addresses_v2.p0.address = value;
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
                if (addresses_v2 != null && addresses_v2.p0 != null)
                    return addresses_v2.p0.lastIScorePushSentDate;
                return null;
            }
            set
            {
                //CreateDefaultAddress();
                //_dirty = _dirty || addresses_v2.p0.lastIScorePushSentDate != value;
                //addresses_v2.p0.lastIScorePushSentDate = value;
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
                if (addresses_v2 != null && addresses_v2.p0 != null)
                    return addresses_v2.p0.lastDepositPushSentDate;
                return null;
            }
            set
            {
                //CreateDefaultAddress();
                //_dirty = _dirty || addresses_v2.p0.lastDepositPushSentDate != value;
                //addresses_v2.p0.lastDepositPushSentDate = value;
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
                if (addresses_v2 != null && addresses_v2.p0 != null)
                    return addresses_v2.p0.availableRewards;
                return null;
            }
            set
            {
                //CreateDefaultAddress();
                //_dirty = _dirty || addresses_v2.p0.availableRewards != value;
                //addresses_v2.p0.availableRewards = value;
            }
        }

        [FirestoreProperty]
        [Obsolete]
        public string balance
        {
            get
            {
                if (addresses_v2 != null && addresses_v2.p0 != null)
                    return addresses_v2.p0.balance;
                return null;
            }
            set
            {
                //CreateDefaultAddress();
                //_dirty = _dirty || addresses_v2.p0.balance != value;
                //addresses_v2.p0.balance = value;
            }
        }

        [FirestoreProperty]
        [Obsolete]
        public List<Address> addresses
        {
            get => _addresses;
            set
            {
                _addresses = value;
                if (_addresses != null && _addresses.Count > 0 && _addresses_v2 == null)
                {
                    addresses_v2 = new MapArray<Address>();
                    addresses_v2.p0 = _addresses[0];
                }

            }
        }

        [FirestoreProperty]
        public MapArray<Address> addresses_v2
        {
            get {
                if (_addresses_v2 == null && _addresses != null && _addresses.Count > 0)
                {
                    _addresses_v2 = new MapArray<Address>();
                    _addresses_v2.p0 = _addresses[0];
                }
                return _addresses_v2; 
            }
            set
            {
                _dirty = _dirty || _addresses_v2 != value;
                _addresses_v2 = value;
            }
        }

        public bool Dirty {
            get 
            {
                return _dirty || addresses_v2.AsEnumerator().Any(address => address.Dirty);
            }
        }

        public void ResetDirty()
        {
            _dirty = false;
            foreach (var address in addresses_v2.AsEnumerator())
                address.ResetDirty();
        }

        //private void CreateDefaultAddress()
        //{
        //    //Some fields will auto-map to the first address in the list, so create that item
        //    if (addresses_v2 == null) addresses_v2 = new MapArray<Address>();
        //    //if (addresses == null) addresses = new List<Address>();
        //    //addresses_v2.p0 = new Address() { Symbol = "ICX" };
        //}

        public void MigrateData()
        {

        }
    }
}
