using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Text;

namespace MetrICXCore.Entities
{
    [FirestoreData]
    public class BlockProcessedStatus
    {
        [FirestoreProperty]
        public long height { get; set; }

        [FirestoreProperty]
        public bool completed { get; set; }

        [FirestoreProperty]
        public Timestamp? blockTimestamp { get; set; }

        [FirestoreProperty]
        public Timestamp? processedTimestamp { get; set; }

        [FirestoreProperty]
        public long processingDelaySeconds { get; set; }

        [FirestoreProperty]
        public long eventsPublished { get; set; }

        [FirestoreProperty]
        public long retryAttempts { get; set; }

        [FirestoreProperty]
        public string lastErrorMessage { get; set; }

    }
}
