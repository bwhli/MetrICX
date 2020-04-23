using MetrICXCore.Gateways;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Numerics;
using System.Text;

namespace MetrICXCore.Entities
{
    public class Prep
    {

        [JsonProperty("irep")]
        public string Irep { get; set; }

        [JsonProperty("rrep")]
        public string Rrep { get; set; }

        [JsonProperty("totalDelegation")]
        public string TotalDelegation { get; set; }

        [JsonProperty("value")]
        public string Value { get; set; }
    }

    public class TxResult
    {

        [JsonProperty("coveredByFee")]
        public string CoveredByFee { get; set; }

        [JsonProperty("coveredByOverIssuedICX")]
        public string CoveredByOverIssuedICX { get; set; }

        [JsonProperty("issue")]
        public string Issue { get; set; }

    }

    public class BlockParams
    {

        [JsonProperty("postid")]
        public string Postid { get; set; }
    }

    public class Data
    {

        //[JsonProperty("prep")]
        //public Prep Prep { get; set; }

        //[JsonProperty("result")]
        //public TxResult Result { get; set; }

        [JsonProperty("method")]
        public string Method { get; set; }

        [JsonProperty("params")]
        public object Params { get; set; }
    }

    public class ConfirmedTransaction
    {

        [JsonProperty("version")]
        public string Version { get; set; }

        [JsonProperty("timestamp")]
        public string Timestamp { get; set; }

        public DateTime GetTimeStamp()
        {
            var bigNumber = Int64.Parse(Timestamp.Replace("0x", ""), System.Globalization.NumberStyles.HexNumber);
            var dateTime = DateTimeOffset.FromUnixTimeMilliseconds(bigNumber / 1000);
            return dateTime.UtcDateTime.AddHours(8);
        }

        [JsonProperty("dataType")]
        public string DataType { get; set; }

        [JsonProperty("data")]
        public dynamic Data { get; set; }

        [JsonProperty("txHash")]
        public string TxHash { get; set; }

        [JsonProperty("from")]
        public string From { get; set; }

        [JsonProperty("to")]
        public string To { get; set; }

        [JsonProperty("nid")]
        public string Nid { get; set; }

        [JsonProperty("stepLimit")]
        public string StepLimit { get; set; }

        [JsonProperty("signature")]
        public string Signature { get; set; }

        [JsonProperty("nonce")]
        public string Nonce { get; set; }

        [JsonProperty("value")]
        public string Value { get; set; }

        [JsonProperty("txResultDetails")]
        public TransactionResult TxResultDetails { get; set; }

        public decimal GetIcxValue()
        {
            return IconGateway.GetIcxValueFromHex(Value);
        }
    }

    public class ICXBlock
    {

        [JsonProperty("version")]
        public string Version { get; set; }

        [JsonProperty("height")]
        public int Height { get; set; }

        [JsonProperty("signature")]
        public string Signature { get; set; }

        [JsonProperty("prev_block_hash")]
        public string PrevBlockHash { get; set; }

        [JsonProperty("merkle_tree_root_hash")]
        public string MerkleTreeRootHash { get; set; }

        [JsonProperty("time_stamp")]
        public long TimeStamp { get; set; }
        public DateTime GetTimeStamp()
        {
            var dateTime = DateTimeOffset.FromUnixTimeMilliseconds(Convert.ToInt64(TimeStamp) / 1000);
            return dateTime.UtcDateTime.AddHours(8);
        }

        [JsonProperty("confirmed_transaction_list")]
        public IList<ConfirmedTransaction> ConfirmedTransactionList { get; set; }

        [JsonProperty("block_hash")]
        public string BlockHash { get; set; }

        [JsonProperty("peer_id")]
        public string PeerId { get; set; }

        [JsonProperty("next_leader")]
        public string NextLeader { get; set; }
    }

}
