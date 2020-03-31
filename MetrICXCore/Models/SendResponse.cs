using System;
using System.Collections.Generic;
using System.Text;

namespace MetrICXCore.Models
{
    public class Result
    {
        public string error { get; set; }
    }

    public class SendResponse
    {
        public long multicast_id { get; set; }
        public int success { get; set; }
        public int failure { get; set; }
        public int canonical_ids { get; set; }
        public IList<Result> results { get; set; }
    }
}
