// ============================================================
// École Nouvelle Ayiti — Entegrasyon MonCash
// Firebase Cloud Functions (2nd gen), pwojè: ecole-nouvelle-ayiti
// ============================================================
// Deplwaman (sou laptop, gade DEPLOYMENT-GUIDE.md pou tout detay):
//   firebase functions:secrets:set MONCASH_CLIENT_ID
//   firebase functions:secrets:set MONCASH_CLIENT_SECRET
//   firebase deploy --only functions
// ============================================================

const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');

if (!admin.apps.length) admin.initializeApp();
const db = admin.database();

const MONCASH_CLIENT_ID = defineSecret('MONCASH_CLIENT_ID');
const MONCASH_CLIENT_SECRET = defineSecret('MONCASH_CLIENT_SECRET');

// Chanje 'sandbox' pou 'live' sèlman lè ou fin teste tout bagay
const MODE = 'sandbox';
const BASE_URL = MODE === 'live'
  ? 'https://moncashbutton.digicelgroup.com'
  : 'https://sandbox.moncashbutton.digicelgroup.com';

// JOVIN: si w chanje non repo GitHub la (rename), mete nouvo domèn lan isit la
const SIT_DOMAIN = 'https://jovinrodnor509-afk.github.io/-cole-nouvelle-aire-d-ha-ti';

async function getAccessToken(clientId, clientSecret) {
  const res = await fetch(`${BASE_URL}/Api/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    },
    body: 'scope=read,write&grant_type=client_credentials',
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error('Pa ka jwenn token MonCash: ' + JSON.stringify(data));
  }
  return data.access_token;
}

// ------------------------------------------------------------
// 1) Kreye yon peman — rele fonksyon sa a lè elèv la klike "Peye"
// ------------------------------------------------------------
exports.createMoncashPayment = onRequest(
  { secrets: [MONCASH_CLIENT_ID, MONCASH_CLIENT_SECRET], cors: true },
  async (req, res) => {
    try {
      const { amount, itemId, itemType, userId, retounenPaj } = req.body || {};

      if (!amount || !userId) {
        return res.status(400).json({ error: 'amount ak userId obligatwa' });
      }
      if (amount > 75000) {
        return res.status(400).json({ error: 'Montan an twò gwo pou yon sèl tranzaksyon MonCash (max 75,000 HTG)' });
      }

      const orderId = `ENA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const token = await getAccessToken(
        MONCASH_CLIENT_ID.value(),
        MONCASH_CLIENT_SECRET.value()
      );

      const payRes = await fetch(`${BASE_URL}/Api/v1/CreatePayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, orderId }),
      });
      const payData = await payRes.json();

      if (!payData.payment_token || !payData.payment_token.token) {
        console.error('MonCash CreatePayment echwe:', payData);
        return res.status(500).json({ error: 'MonCash pa kreye peman an, eseye ankò pita' });
      }

      // Anrejistre kòmand lan kòm "pending" nan Firebase anvan redireksyon an
      await db.ref(`orders/${orderId}`).set({
        orderId,
        userId,
        itemId: itemId || null,
        itemType: itemType || null, // egzanp: 'prime', 'segonde', 'metye-kouti'
        retounenPaj: retounenPaj || 'index.html',
        amount,
        status: 'pending',
        provider: 'moncash',
        createdAt: admin.database.ServerValue.TIMESTAMP,
      });

      const redirectUrl = `${BASE_URL}/Moncash-middleware/Payment/Redirect?token=${payData.payment_token.token}`;

      res.json({ orderId, redirectUrl });
    } catch (err) {
      console.error('createMoncashPayment error:', err);
      res.status(500).json({ error: 'Erè sèvè, eseye ankò' });
    }
  }
);

// ------------------------------------------------------------
// 2) Verifye peman lè MonCash voye elèv la tounen (Return URL)
//    Mete lyen sa a nan MonCash Business dashboard ou kòm "Return URL":
//    https://us-central1-ecole-nouvelle-ayiti.cloudfunctions.net/moncashReturn
// ------------------------------------------------------------
exports.moncashReturn = onRequest(
  { secrets: [MONCASH_CLIENT_ID, MONCASH_CLIENT_SECRET] },
  async (req, res) => {
    try {
      const orderId = req.query.orderId || req.body?.orderId;
      if (!orderId) return res.status(400).send('orderId manke nan retou a');

      const token = await getAccessToken(
        MONCASH_CLIENT_ID.value(),
        MONCASH_CLIENT_SECRET.value()
      );

      const verifyRes = await fetch(`${BASE_URL}/Api/v1/RetrieveTransactionPayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });
      const verifyData = await verifyRes.json();

      const isSuccess = verifyData.payment && verifyData.payment.message === 'successful';

      const orderSnap = await db.ref(`orders/${orderId}`).get();
      const order = orderSnap.val() || {};

      await db.ref(`orders/${orderId}`).update({
        status: isSuccess ? 'paid' : 'failed',
        verifiedAt: admin.database.ServerValue.TIMESTAMP,
        moncashTransactionId: verifyData.payment ? verifyData.payment.transaction_id : null,
      });

      // Si peman an reyisi, deba aksè a bay elèv la la menm
      if (isSuccess && order.userId && order.itemType) {
        await db.ref(`users/${order.userId}/aksè/${order.itemType}`).set({
          aktif: true,
          depiOrderId: orderId,
          dat: admin.database.ServerValue.TIMESTAMP,
        });
      }

      const paj = order.retounenPaj || 'index.html';
      const rezilta = isSuccess ? 'reyisi' : 'echwe';
      res.redirect(`${SIT_DOMAIN}/${paj}?peman=${rezilta}&orderId=${orderId}`);
    } catch (err) {
      console.error('moncashReturn error:', err);
      res.status(500).send('Erè pandan verifikasyon peman an');
    }
  }
);
