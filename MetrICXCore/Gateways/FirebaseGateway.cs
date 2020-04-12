using Google.Cloud.Firestore;
using MetrICXCore.Entities;
using MetrICXCore.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Reflection;
using System.Text;
using Google.Cloud.Firestore.V1;
using Google.Apis.Auth.OAuth2;
using Grpc.Auth;
using Grpc.Core;

namespace MetrICXCore.Gateways
{
    public static class FirebaseGateway
    {
        public static FirestoreDb db = null;
        private static Dictionary<string, string> FirebaseConfig = new Dictionary<string, string>();

        static FirebaseGateway()
        {
            LoadConfig();

            Console.WriteLine("[FB] Connecting to Firestore");
            // Load a service account explicitly
            var serviceAcct = GoogleCredential.FromFile("firebase-creds.json");
            Channel channel = new Channel(FirestoreClient.DefaultEndpoint.Host, FirestoreClient.DefaultEndpoint.Port, serviceAcct.ToChannelCredentials());
            FirestoreClient client = FirestoreClient.Create(channel);
            db = FirestoreDb.Create(FirebaseConfig["PROJECT_NAME"], client);

            Console.WriteLine($"[FB] Created Cloud Firestore client with project ID: {FirebaseConfig["PROJECT_NAME"]}");
        }

        private static void LoadConfig()
        {
            try
            {

                Console.WriteLine("[FB] Loading firebase-config.json");
                string json = File.ReadAllText($"{Path.GetDirectoryName(Assembly.GetCallingAssembly().Location)}/firebase-config.json");
                FirebaseConfig = JsonConvert.DeserializeObject<Dictionary<string, string>>(json);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FB] Was not able to load firebase-config.json. Look at firebase-config.sample.json to see an example. Exception Message {ex.Message}");
                throw;
            }
        }

        private static GoogleCredential LoadCreds()
        {
            try
            {
                Console.WriteLine("[FB] Loading firebase-creds.json");
                //string json = File.ReadAllText($"{Path.GetDirectoryName(Assembly.GetCallingAssembly().Location)}/firebase-config.json");
                //FirebaseConfig = JsonConvert.DeserializeObject<Dictionary<string, string>>(json);
                var credential = GoogleCredential.FromFile("firebase-creds.json");
                return credential;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FB] Was not able to load firebase-creds.json. Exception Message {ex.Message}");
                throw;
            }
        }

        public static IEnumerable<DeviceRegistration> AllDevices()
        {
            Query allCitiesQuery = db.Collection("devices");
            QuerySnapshot allCitiesQuerySnapshot = allCitiesQuery.GetSnapshotAsync().Result;
            foreach (DocumentSnapshot documentSnapshot in allCitiesQuerySnapshot.Documents)
            {
                var device = GetDeviceByRef(documentSnapshot);
                if (device != null)
                    yield return device;
            }
        }

        private static DeviceRegistration GetDeviceByRef(DocumentSnapshot documentSnapshot)
        {
            DeviceRegistration device = null;
            try
            {
                object broken;
                documentSnapshot.TryGetValue<object>("addresses_v2.p0.tokens", out broken);
                if (broken != null && broken.GetType().FullName.Contains("List"))
                {
                    Console.WriteLine($"[FB] Invalid Tokens array found, deleting it {documentSnapshot.Id}");

                    //This will fail to be deserialized, so deleting the tokens array
                    DocumentReference docRef = db.Collection("devices").Document(documentSnapshot.Id);
                    Dictionary<string, object> updates = new Dictionary<string, object>
                        {
                            { "addresses_v2.p0.tokens", FieldValue.Delete }
                        };
                    docRef.UpdateAsync(updates).Wait();

                    var newdocumentSnapshot = db.Collection("devices").Document(documentSnapshot.Id).GetSnapshotAsync().Result;
                    device = newdocumentSnapshot.ConvertTo<DeviceRegistration>();
                    Console.WriteLine($"[FB] Invalid Tokens array successfully deleted {documentSnapshot.Id}");
                }
                else
                {
                    device = documentSnapshot.ConvertTo<DeviceRegistration>();
                }

                device.ResetDirty();
                device.MigrateData();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FB] EXCEPTION, unable to deserialize the document {documentSnapshot.Id} : {ex.Message}");
            }
            if (device != null)
            {
                Console.WriteLine($"[FB] Document data for {documentSnapshot.Id} document: {JsonConvert.SerializeObject(device)}");
                return device;
            }
            Console.WriteLine("");

            return device;
        }

        public static IEnumerable<DeviceRegistration> GetDevicesByAddress(string address)
        {
            Query allCitiesQuery = db.Collection("devices").WhereEqualTo("addresses_v2.p0.address", address);
            QuerySnapshot allCitiesQuerySnapshot = allCitiesQuery.GetSnapshotAsync().Result;
            foreach (DocumentSnapshot documentSnapshot in allCitiesQuerySnapshot.Documents)
            {
                var device = GetDeviceByRef(documentSnapshot);
                if (device != null)
                    yield return device;
            }
            allCitiesQuery = db.Collection("devices").WhereEqualTo("addresses_v2.p1.address", address);
            allCitiesQuerySnapshot = allCitiesQuery.GetSnapshotAsync().Result;
            foreach (DocumentSnapshot documentSnapshot in allCitiesQuerySnapshot.Documents)
            {
                var device = GetDeviceByRef(documentSnapshot);
                if (device != null)
                    yield return device;
            }
            allCitiesQuery = db.Collection("devices").WhereEqualTo("addresses_v2.p2.address", address);
            allCitiesQuerySnapshot = allCitiesQuery.GetSnapshotAsync().Result;
            foreach (DocumentSnapshot documentSnapshot in allCitiesQuerySnapshot.Documents)
            {
                var device = GetDeviceByRef(documentSnapshot);
                if (device != null)
                    yield return device;
            }
            allCitiesQuery = db.Collection("devices").WhereEqualTo("addresses_v2.p3.address", address);
            allCitiesQuerySnapshot = allCitiesQuery.GetSnapshotAsync().Result;
            foreach (DocumentSnapshot documentSnapshot in allCitiesQuerySnapshot.Documents)
            {
                var device = GetDeviceByRef(documentSnapshot);
                if (device != null)
                    yield return device;
            }
            allCitiesQuery = db.Collection("devices").WhereEqualTo("addresses_v2.p4.address", address);
            allCitiesQuerySnapshot = allCitiesQuery.GetSnapshotAsync().Result;
            foreach (DocumentSnapshot documentSnapshot in allCitiesQuerySnapshot.Documents)
            {
                var device = GetDeviceByRef(documentSnapshot);
                if (device != null)
                    yield return device;
            }
        }

        public static IEnumerable<DeviceRegistration> GetDevicesForIScorePush()
        {
            Query allCitiesQuery = db.Collection("devices").WhereEqualTo("enablePushIScoreChange", true);
            QuerySnapshot allCitiesQuerySnapshot = allCitiesQuery.GetSnapshotAsync().Result;
            foreach (DocumentSnapshot documentSnapshot in allCitiesQuerySnapshot.Documents)
            {
                var device = GetDeviceByRef(documentSnapshot);
                if (device != null)
                    yield return device;
            }
            
        }

        public static string[] GetToggleAddresses(string toggleName)
        {
            var documentSnapshot = db.Collection("toggles").Document(toggleName).GetSnapshotAsync().Result;
            var addresses = documentSnapshot.ConvertTo<ToggleAddresses>();
            return addresses.addresses;
        }

        public static SendResponse SendPush(string recipientToken, string address, string title, string message)
        {
            Console.WriteLine($"[FB] Sending PUSH to {address}, token {recipientToken}, with Title {title}, Message {message}");

            WebRequest tRequest = WebRequest.Create("https://fcm.googleapis.com/fcm/send");
            tRequest.Method = "post";
            //serverKey - Key from Firebase cloud messaging server  
            tRequest.Headers.Add(string.Format("Authorization: key={0}", FirebaseConfig["API_KEY"]));
            //Sender Id - From firebase project setting  
            tRequest.Headers.Add(string.Format("Sender: id={0}", FirebaseConfig["PROJECT_ID"])); //com.rhizome.metricx
            tRequest.ContentType = "application/json";
            var payload = new
            {
                to = recipientToken,
                priority = "high",
                content_available = true,
                notification = new
                {
                    body = message,
                    title = title,
                    badge = 0
                }
            };

            SendResponse response = null;
            string postbody = JsonConvert.SerializeObject(payload).ToString();
            Byte[] byteArray = Encoding.UTF8.GetBytes(postbody);
            tRequest.ContentLength = byteArray.Length;
            using (Stream dataStream = tRequest.GetRequestStream())
            {
                dataStream.Write(byteArray, 0, byteArray.Length);
                using (WebResponse tResponse = tRequest.GetResponse())
                {
                    using (Stream dataStreamResponse = tResponse.GetResponseStream())
                    {
                        if (dataStreamResponse != null) using (StreamReader tReader = new StreamReader(dataStreamResponse))
                            {
                                String sResponseFromServer = tReader.ReadToEnd();
                                Console.WriteLine($"[FB] RESPONSE : {sResponseFromServer}");

                                response = JsonConvert.DeserializeObject<SendResponse>(sResponseFromServer);
                            }
                    }
                }
            }

            return response;
        }


        public static DeviceRegistration GetDevice(string token)
        {
            var documentSnapshot = db.Collection("devices").Document(token).GetSnapshotAsync().Result;
            var broken = documentSnapshot.GetValue<object>("addresses_v2.p0.tokens");
            if (broken != null && broken.GetType().FullName.Contains("List"))
            {
                Console.WriteLine($"[FB] Invalid Tokens array found, deleting it {token}");

                //This will fail to be deserialized, so deleting the tokens array
                DocumentReference docRef = db.Collection("devices").Document(token);
                Dictionary<string, object> updates = new Dictionary<string, object>
                {
                    { "addresses_v2.p0.tokens", FieldValue.Delete }
                };
                docRef.UpdateAsync(updates).Wait();

                documentSnapshot = db.Collection("devices").Document(token).GetSnapshotAsync().Result;
                Console.WriteLine($"[FB] Invalid Tokens array successfully deleted {token}");
            }

            DeviceRegistration device = documentSnapshot.ConvertTo<DeviceRegistration>();
            device.ResetDirty();
            device.MigrateData();
            return device;
        }

        public static void UpdateDevice(DeviceRegistration device)
        {
            if (device.Dirty)
            {
                Console.WriteLine($"[FB] Updating Document data for {device.token}");
                db.Collection("devices").Document(device.token).SetAsync(device, SetOptions.MergeAll).Wait();
                device.ResetDirty();
            }
        }

        public static void DeleteDevice(DeviceRegistration device)
        {
            try
            {
                Console.WriteLine($"[FB] Deleting Document {device.token}");
                db.Collection("devices").Document(device.token).DeleteAsync().Wait();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FB] EXCEPTION, unable to delete the document {device.token} : {ex.Message}");
            }
        }

        public static void SetBlockProcessed(BlockProcessedStatus blockProcessedStatus)
        {
            Console.WriteLine($"[FB] Updating block status data for {blockProcessedStatus.height}");
            db.Collection("blocksProcessed").Document(blockProcessedStatus.height.ToString()).SetAsync(blockProcessedStatus).Wait();
        }

        public static BlockProcessedStatus GetBlockProcessed(long height)
        {
            Console.WriteLine($"[FB] Getting block status data for {height}");
            var documentSnapshot = db.Collection("blocksProcessed").Document(height.ToString()).GetSnapshotAsync().Result;
            if (documentSnapshot.Exists)
            {
                BlockProcessedStatus blockStatus = documentSnapshot.ConvertTo<BlockProcessedStatus>();
                return blockStatus;
            }
            return null;
        }

        public static IEnumerable<BlockProcessedStatus> GetAllIncompleteBlocks()
        {
            Console.WriteLine($"[FB] Getting all incomplete blocks");
            Query allCitiesQuery = db.Collection("blocksProcessed").WhereEqualTo("complete", false);
            QuerySnapshot allCitiesQuerySnapshot = allCitiesQuery.GetSnapshotAsync().Result;
            foreach (DocumentSnapshot documentSnapshot in allCitiesQuerySnapshot.Documents)
            {
                BlockProcessedStatus block = documentSnapshot.ConvertTo<BlockProcessedStatus>();
                if (block != null)
                    yield return block;
            }

        }
    }
}
