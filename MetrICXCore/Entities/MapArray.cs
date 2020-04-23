using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Text;

namespace MetrICXCore.Entities
{
    [FirestoreData]
    public class MapArray<T>
    {
        private T __0;
        private T __1;
        private T __2;
        private T __3;
        private T __4;

        [FirestoreProperty]
        public T p4 { get => __4; set => __4 = value; }

        [FirestoreProperty]
        public T p3 { get => __3; set => __3 = value; }

        [FirestoreProperty]
        public T p2 { get => __2; set => __2 = value; }

        [FirestoreProperty]
        public T p1 { get => __1; set => __1 = value; }

        [FirestoreProperty]
        public T p0 { get => __0; set => __0 = value; }

        public IEnumerable<T> AsEnumerator()
        {
            if (p0 != null) yield return p0;
            if (p1 != null) yield return p1;
            if (p2 != null) yield return p2;
            if (p3 != null) yield return p3;
            if (p4 != null) yield return p4;
        }
    }
}
