using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace MetrICXCore.Entities
{
    public class EventLog
    {

        [JsonProperty("scoreAddress")]
        public string ScoreAddress { get; set; }

        [JsonProperty("indexed")]
        public IList<string> Indexed { get; set; }

        [JsonProperty("data")]
        public IList<string> Data { get; set; }
    }

    public class TransactionResult
    {

        [JsonProperty("txHash")]
        public string TxHash { get; set; }

        [JsonProperty("blockHeight")]
        public string BlockHeight { get; set; }

        [JsonProperty("blockHash")]
        public string BlockHash { get; set; }

        [JsonProperty("txIndex")]
        public string TxIndex { get; set; }

        [JsonProperty("to")]
        public string To { get; set; }

        [JsonProperty("stepUsed")]
        public string StepUsed { get; set; }

        [JsonProperty("stepPrice")]
        public string StepPrice { get; set; }

        [JsonProperty("cumulativeStepUsed")]
        public string CumulativeStepUsed { get; set; }

        [JsonProperty("eventLogs")]
        public IList<EventLog> EventLogs { get; set; }

        [JsonProperty("logsBloom")]
        public string LogsBloom { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }
    }
}
