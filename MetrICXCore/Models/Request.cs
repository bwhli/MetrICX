using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace MetrICXCore.Models
{
    public class RequestParams
    {

        [JsonProperty("height")]
        public string Height { get; set; }
    }

    public class Request
    {
        [JsonProperty("jsonrpc")]
        public string Jsonrpc { get; set; }

        [JsonProperty("method")]
        public string Method { get; set; }

        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("params")]
        public RequestParams Params { get; set; }
    }

}

