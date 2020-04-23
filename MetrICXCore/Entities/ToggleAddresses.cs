using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MetrICXCore.Entities
{
    [FirestoreData]
    public class ToggleAddresses
    {
        [FirestoreProperty]
        public string[] addresses { get; set; }

    }
}
