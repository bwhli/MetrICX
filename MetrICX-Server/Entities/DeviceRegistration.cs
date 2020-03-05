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

        //Remember legacy fields
        private string _legacyAddress;
        private string _legacyBalance;
        private DateTime? _legacylastIScorePushSentDate;
        private DateTime? _legacylastDepositPushSentDate;
        private string _legacyavailableRewards;

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
                return _legacyAddress;
            }
            set
            {
                _dirty = _dirty || _legacyAddress != value;
                _legacyAddress = value;
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
                return _legacylastIScorePushSentDate;
            }
            set
            {
                _dirty = _dirty || _legacylastIScorePushSentDate != value;
                _legacylastIScorePushSentDate = value;
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
                return _legacylastDepositPushSentDate;
            }
            set
            {
                _dirty = _dirty || _legacylastDepositPushSentDate != value;
                _legacylastDepositPushSentDate = value;
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
                return _legacyavailableRewards;
            }
            set
            {
                _dirty = _dirty || _legacyavailableRewards != value;
                _legacyavailableRewards = value;
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
                return _legacyBalance;
            }
            set
            {
                _dirty = _dirty || _legacyBalance != value;
                _legacyBalance = value;
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
                return _dirty || (addresses_v2 != null && addresses_v2.AsEnumerator().Any(address => address.Dirty));
            }
        }

        public void ResetDirty()
        {
            _dirty = false;
            if (addresses_v2 != null)
            {
                foreach (var address in addresses_v2.AsEnumerator())
                    address.ResetDirty();
            }
        }

        public void MigrateData()
        {
            //This is only for really old data structure to hopefully resolve into newer structures
            if (addresses == null && addresses_v2 == null)
            {
                addresses_v2 = new MapArray<Address>();
                addresses_v2.p0 = new Address() { Symbol = "ICX" };
                addresses_v2.p0.address = _legacyAddress;
                addresses_v2.p0.balance = _legacyBalance;
                addresses_v2.p0.lastIScorePushSentDate = _legacylastIScorePushSentDate;
                addresses_v2.p0.lastDepositPushSentDate = _legacylastDepositPushSentDate;
                addresses_v2.p0.availableRewards = _legacyavailableRewards;
                _dirty = true;
            }

            foreach (var address in addresses_v2.AsEnumerator())
            {
                if (address != null && address.enablePushDeposits == null)
                {
                    //If push deposits at address level is null, then inherit the core value
                    address.enablePushDeposits = enablePushDeposits;
                }

                if (!string.IsNullOrEmpty(address.address))
                    address.address = address.address.Trim();

                if (string.IsNullOrEmpty(address.Symbol))
                    address.Symbol = "ICX";
            }
        }
    }
}
