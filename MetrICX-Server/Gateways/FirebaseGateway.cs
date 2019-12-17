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
        static FirestoreDb db = null;
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

        public static void SendPush(string recipientToken, string address, string title, string message)
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
                        }
                    }
                }
            }
        }

        public static IEnumerable<DeviceRegistration> AllDevices()
        {
            Query allCitiesQuery = db.Collection("devices");
            QuerySnapshot allCitiesQuerySnapshot = allCitiesQuery.GetSnapshotAsync().Result;
            foreach (DocumentSnapshot documentSnapshot in allCitiesQuerySnapshot.Documents)
            {
                DeviceRegistration device = documentSnapshot.ConvertTo<DeviceRegistration>();
                Console.WriteLine($"[FB] Document data for {documentSnapshot.Id} document: {JsonConvert.SerializeObject(device)}");

                yield return device;
                Console.WriteLine("");
            }
        }

        public static void UpdateDevice(DeviceRegistration device)
        {
            Console.WriteLine($"[FB] Updating Document data for {device.token}");
            db.Collection("devices").Document(device.token).SetAsync(device).Wait();
        }
    }
}
