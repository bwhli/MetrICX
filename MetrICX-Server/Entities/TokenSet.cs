using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Text;

namespace MetrICXServerPush.Entities
{
    public class TokenSet
    {
        private Token aCS;
        private Token sPORT;
        private Token sSX;
        private Token tAP;
        private Token vELT;
        private Token wOK;
        private bool _dirty;

        [FirestoreProperty]
        public Token ACS { get => aCS; set => aCS = value; }
        [FirestoreProperty]
        public Token SPORT { get => sPORT; set => sPORT = value; }
        [FirestoreProperty]
        public Token SSX { get => sSX; set => sSX = value; }
        [FirestoreProperty]
        public Token TAP { get => tAP; set => tAP = value; }
        [FirestoreProperty]
        public Token VELT { get => vELT; set => vELT = value; }
        [FirestoreProperty]
        public Token WOK { get => wOK; set => wOK = value; }

        public bool Dirty
        {
            get
            {
                return _dirty || ACS.Dirty || SPORT.Dirty || SSX.Dirty || TAP.Dirty || VELT.Dirty || WOK.Dirty;
            }
        }

        internal void ResetDirty()
        {
            _dirty = false;
            ACS.ResetDirty();
            SPORT.ResetDirty();
            SSX.ResetDirty();
            TAP.ResetDirty();
            VELT.ResetDirty();
            WOK.ResetDirty();
        }

        public IEnumerable<Token> AsEnumerator()
        {
            yield return ACS;
            yield return SPORT;
            yield return SSX;
            yield return TAP;
            yield return VELT;
            yield return WOK;
        }
    }
}
