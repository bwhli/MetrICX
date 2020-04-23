using System;
using System.Collections.Generic;

using System.Globalization;
using System.Numerics;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace MetrICXCore.Entities
{

    public partial class PRepResult
    {
        [JsonProperty("blockHeight")]
        public BigInteger BlockHeight { get; set; }

        [JsonProperty("startRanking")]
        public BigInteger StartRanking { get; set; }

        [JsonProperty("totalDelegated")]
        public BigInteger TotalDelegated { get; set; }

        [JsonProperty("totalStake")]
        public BigInteger TotalStake { get; set; }

        [JsonProperty("preps")]
        public PrepResult[] Preps { get; set; }
    }

    public partial class PrepResult
    {
        [JsonProperty("address")]
        public string Address { get; set; }

        [JsonProperty("status")]
        public BigInteger Status { get; set; }

        [JsonProperty("penalty")]
        public BigInteger Penalty { get; set; }

        [JsonProperty("grade")]
        public BigInteger Grade { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("details")]
        public string Details { get; set; }

        [JsonProperty("country")]
        public string Country { get; set; }

        [JsonProperty("city")]
        public string City { get; set; }

        [JsonProperty("stake")]
        public BigInteger Stake { get; set; }

        [JsonProperty("delegated")]
        public BigInteger Delegated { get; set; }

        [JsonProperty("totalBlocks")]
        public BigInteger TotalBlocks { get; set; }

        [JsonProperty("validatedBlocks")]
        public BigInteger ValidatedBlocks { get; set; }

        [JsonProperty("irep")]
        public BigInteger Irep { get; set; }

        [JsonProperty("irepUpdateBlockHeight")]
        public BigInteger IrepUpdateBlockHeight { get; set; }

        [JsonProperty("lastGenerateBlockHeight")]
        public BigInteger LastGenerateBlockHeight { get; set; }

        [JsonProperty("blockHeight")]
        public BigInteger BlockHeight { get; set; }

    }

}
