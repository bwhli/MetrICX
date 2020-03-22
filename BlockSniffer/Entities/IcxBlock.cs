﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace BlockSniffer.Entities
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

        [JsonProperty("prep")]
        public Prep Prep { get; set; }

        [JsonProperty("result")]
        public TxResult Result { get; set; }

        [JsonProperty("method")]
        public string Method { get; set; }

        [JsonProperty("params")]
        public BlockParams Params { get; set; }
    }

    public class ConfirmedTransactionList
    {

        [JsonProperty("version")]
        public string Version { get; set; }

        [JsonProperty("timestamp")]
        public string Timestamp { get; set; }

        [JsonProperty("dataType")]
        public string DataType { get; set; }

        [JsonProperty("data")]
        public Data Data { get; set; }

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

        [JsonProperty("confirmed_transaction_list")]
        public IList<ConfirmedTransactionList> ConfirmedTransactionList { get; set; }

        [JsonProperty("block_hash")]
        public string BlockHash { get; set; }

        [JsonProperty("peer_id")]
        public string PeerId { get; set; }

        [JsonProperty("next_leader")]
        public string NextLeader { get; set; }
    }

    //public class ICXBlock
    //{

    //    [JsonProperty("jsonrpc")]
    //    public string Jsonrpc { get; set; }

    //    [JsonProperty("result")]
    //    public ICXBlock Result { get; set; }

    //    [JsonProperty("id")]
    //    public int Id { get; set; }
    //}


}