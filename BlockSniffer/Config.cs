using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace BlockSniffer
{
    public class Config
    {
        public static Config LoadConfig()
        {
            string configStr = File.ReadAllText("config.json");
            return JsonConvert.DeserializeObject<Config>(configStr);
        }

        public string AccessKey { get; set; }
        public string SecretKey { get; set; }

    }
}
