using System;
using System.Collections.Generic;

using System.Globalization;
using System.Net;
using System.Numerics;
using Google.Cloud.Firestore;
using MetrICXServerPush.Gateways;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace MetrICXServerPush.Entities
{

    public partial class PReps
    {
        public PReps(PRepResult prepResult)
        {
            
            BlockHeight = prepResult.BlockHeight;
            StartRanking = prepResult.StartRanking;
            TotalDelegated = IconGateway.IntToDecimal(prepResult.TotalDelegated);
            TotalStake = IconGateway.IntToDecimal(prepResult.TotalStake);
            Preps = new List<Prep>();

            foreach (var prep in prepResult.Preps)
            {
                Preps.Add(new Prep()
                {
                    Address = prep.Address,
                    BlockHeight = prep.BlockHeight,
                    City = prep.City,
                    Country = prep.Country,
                    Delegated = IconGateway.IntToDecimal(prep.Delegated),
                    Grade = prep.Grade,
                    Irep = IconGateway.IntToDecimal(prep.Irep),
                    IrepUpdateBlockHeight = prep.IrepUpdateBlockHeight,
                    LastGenerateBlockHeight = prep.LastGenerateBlockHeight,
                    Name = prep.Name,
                    Details = prep.Details,
                    Penalty = prep.Penalty,
                    Stake = prep.Stake,
                    Status = prep.Status,
                    TotalBlocks = prep.TotalBlocks,
                    ValidatedBlocks = prep.ValidatedBlocks,
                    DetailInfo = GetDetails(prep.Details)
                });
            }

            foreach (var prep in Preps)
            {
                FirebaseGateway.db.Collection("preps").Document(prep.Address).SetAsync(prep, SetOptions.MergeAll).Wait();
            }
        }

        public BigInteger BlockHeight { get; set; }
        public BigInteger StartRanking { get; set; }
        public decimal TotalDelegated { get; set; }
        public decimal TotalStake { get; set; }
        public List<Prep> Preps { get; set; }

        public string GetDetails(string details)
        {
            try
            {
                WebClient client = new WebClient();
                return client.DownloadString(details);
            }
            catch (Exception ex)
            {
            }
            return "{\"representative\":{\"logo\":{\"logo_256\":\"http://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/256/ICON-ICX-icon.png\",\"logo_1024\":\"\",\"logo_svg\":\"\"},\"media\":{\"steemit\":\"\",\"twitter\":\"\",\"youtube\":\"\",\"facebook\":\"\",\"github\":\"\",\"reddit\":\"\",\"keybase\":\"\",\"telegram\":\"\",\"wechat\":\"\"}},\"server\":{\"location\":{\"country\":\"\",\"city\":\"\"},\"server_type\":\"\",\"api_endpoint\":\"\"}}";
        }
    }

    [FirestoreData]
    public partial class Prep
    {
        [FirestoreProperty]
        public string Address { get; set; }

        public BigInteger Status { get; set; }

        public BigInteger Penalty { get; set; }

        public BigInteger Grade { get; set; }

        [FirestoreProperty]
        public string Name { get; set; }

        [FirestoreProperty]
        public string Details { get; set; }

        [FirestoreProperty]
        public string DetailInfo { get; set; }

        [FirestoreProperty]
        public string Country { get; set; }

        [FirestoreProperty]
        public string City { get; set; }

        public BigInteger Stake { get; set; }

        public decimal Delegated { get; set; }

        public BigInteger TotalBlocks { get; set; }

        public BigInteger ValidatedBlocks { get; set; }

        public decimal Irep { get; set; }

        public BigInteger IrepUpdateBlockHeight { get; set; }

        public BigInteger LastGenerateBlockHeight { get; set; }

        public BigInteger BlockHeight { get; set; }

        public Decimal Productivity
        {
            get
            {
                if (TotalBlocks > 0)
                    return (Decimal)ValidatedBlocks / (Decimal)TotalBlocks * 100;
                else return 100;
            }
        }
        
    }

}
