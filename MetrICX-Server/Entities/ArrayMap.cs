using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Text;

namespace MetrICXServerPush.Entities
{
    public class MapArray<T>
    {
        private T __0;
        private T __1;
        private T __2;
        private T __3;
        private T __4;

        [FirestoreProperty]
        public T _4 { get => this.__4; set => this.__4 = value; }

        [FirestoreProperty]
        public T _3 { get => this.__3; set => this.__3 = value; }

        [FirestoreProperty]
        public T _2 { get => this.__2; set => this.__2 = value; }

        [FirestoreProperty]
        public T _1 { get => this.__1; set => this.__1 = value; }

        [FirestoreProperty]
        public T _0 { get => this.__0; set => this.__0 = value; }

        public IEnumerable<T> AsEnumerator()
        {
            yield return _0;
            yield return _1;
            yield return _2;
            yield return _3;
            yield return _4;
        }
    }
}
