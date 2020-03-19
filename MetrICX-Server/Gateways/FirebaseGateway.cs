using Google.Cloud.Firestore;
using MetrICXServerPush.Entities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Reflection;
using System.Text;

namespace MetrICXServerPush.Gateways
{
    public static class FirebaseGateway
    {
        public static FirestoreDb db = null;
        private static Dictionary<string, string> FirebaseConfig = new Dictionary<string, string>();

        static FirebaseGateway()
        {
            LoadConfig();
            Console.WriteLine("[FB] Connecting to Firestore");
            db = FirestoreDb.Create(FirebaseConfig["PROJECT_NAME"]);
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

        public static IEnumerable<DeviceRegistration> AllDevices()
        {
            Query allCitiesQuery = db.Collection("devices");
            QuerySnapshot allCitiesQuerySnapshot = allCitiesQuery.GetSnapshotAsync().Result;
            foreach (DocumentSnapshot documentSnapshot in allCitiesQuerySnapshot.Documents)
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
                    yield return device;
                }
                Console.WriteLine("");
            }
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
    }
}
