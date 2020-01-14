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
        internal bool Dirty = false;
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
            set
            {
                CreateDefaultAddress();
                addresses[0].address = value;
                Dirty = true;
            }
        }

        [FirestoreProperty]
        public DateTime? registrationDate { get => _registrationDate; 
            set 
            {
                Dirty = _registrationDate != value;
                _registrationDate = value; 
            } 
        }

        [FirestoreProperty]
        public bool? enablePushIScoreChange { get => _enablePushIScoreChange; 
            set
            {
                Dirty = _enablePushIScoreChange != value;
                _enablePushIScoreChange = value;
            }
        }

        [FirestoreProperty]
        [Obsolete]
        public DateTime? lastIScorePushSentDate
        {
            set
            {
                CreateDefaultAddress();
                addresses[0].lastIScorePushSentDate = value;
                Dirty = true;
            }
        }

        [FirestoreProperty]
        public bool? enablePushDeposits { get => _enablePushDeposits; 
            set
            {
                Dirty = _enablePushDeposits != value;
                _enablePushDeposits = value;
            }
        }

        [FirestoreProperty]
        [Obsolete]
        public DateTime? lastDepositPushSentDate
        {
            set
            {
                CreateDefaultAddress();
                addresses[0].lastDepositPushSentDate = value;
                Dirty = true;
            }
        }

        [FirestoreProperty]
        public string enablePushProductivityDrop { get => _enablePushProductivityDrop; 
            set
            {
                Dirty = _enablePushProductivityDrop != value;
                _enablePushProductivityDrop = value;
            }
        }

        [FirestoreProperty]
        public DateTime? lastProductivityPushSentDate { get => _lastProductivityPushSentDate; 
            set
            {
                Dirty = _lastProductivityPushSentDate != value;
                _lastProductivityPushSentDate = value;
            }
        }

        [FirestoreProperty]
        [Obsolete]
        public string availableRewards
        {
            set
            {
                CreateDefaultAddress();
                addresses[0].availableRewards = value;
                Dirty = true;
            }
        }

        [FirestoreProperty]
        [Obsolete]
        public string balance
        {
            set
            {
                CreateDefaultAddress();
                addresses[0].balance = value;
                Dirty = true;
            }
        }

        public List<Address> addresses { get => _addresses; 
            set
            {
                Dirty = _addresses != value;
                _addresses = value;
            }
        }

        private void CreateDefaultAddress()
        {
            //Some fields will auto-map to the first address in the list, so create that item
            if (addresses == null) addresses = new List<Address>();
            if (addresses.Count == 0) addresses.Add(new Address() { Symbol = "ICX" });
        }

    }
}
