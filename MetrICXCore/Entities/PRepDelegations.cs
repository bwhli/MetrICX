using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace MetrICXCore.Entities
{
    public partial class PRepDelegations
    {
        [JsonProperty("delegations")]
        public Delegation[] Delegations { get; set; }

        [JsonProperty("totalDelegated")]
        public string TotalDelegated { get; set; }

        [JsonProperty("votingPower")]
        public string VotingPower { get; set; }
    }

    public partial class Delegation
    {
        [JsonProperty("address")]
        public string Address { get; set; }

        [JsonProperty("value")]
        public string Value { get; set; }
    }
}
