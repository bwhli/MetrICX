using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Text;

namespace MetrICXCore.Entities
{
    [FirestoreData]
    public class TokenRegistration
    {
        [FirestoreProperty("token")]
        public string Token { get; set; }

        [FirestoreProperty("address")]
        public string Address { get; set; }

    }
}
