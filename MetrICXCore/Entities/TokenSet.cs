using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Text;

namespace MetrICXCore.Entities
{
    [FirestoreData]
    public class TokenSet
    {
        private Token aC3;
        private Token sPORT;
        private Token sSX;
        private Token tAP;
        private Token vELT;
        private Token wOK;
        private bool _dirty;

        [FirestoreProperty]
        public Token AC3 { get => aC3; set => aC3 = value; }
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
                return _dirty || AC3.Dirty || SPORT.Dirty || SSX.Dirty || TAP.Dirty || VELT.Dirty || WOK.Dirty;
            }
        }

        internal void ResetDirty()
        {
            _dirty = false;
            AC3.ResetDirty();
            SPORT.ResetDirty();
            SSX.ResetDirty();
            TAP.ResetDirty();
            VELT.ResetDirty();
            WOK.ResetDirty();
        }

        public IEnumerable<Token> AsEnumerator()
        {
            if (AC3 != null && AC3.isSelected == true) yield return AC3;
            if (SPORT != null && SPORT.isSelected == true) yield return SPORT;
            if (SSX != null && SSX.isSelected == true) yield return SSX;
            if (TAP != null && TAP.isSelected == true) yield return TAP;
            if (VELT != null && VELT.isSelected == true) yield return VELT;
            if (WOK != null && WOK.isSelected == true) yield return WOK;
        }
    }
}
