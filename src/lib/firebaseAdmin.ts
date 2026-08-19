import * as admin from 'firebase-admin';

function getAdminDb() {
  if (!admin.apps.length) {
    const hasServiceAccount = !!process.env.FIREBASE_SERVICE_ACCOUNT;
    const hasIndividualVars = !!(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL);
    
    if (!hasServiceAccount && !hasIndividualVars) {
      throw new Error("⚠️ FIREBASE ADMIN VARIABLES ARE MISSING! Pastikan Anda memasukkan FIREBASE_SERVICE_ACCOUNT di Vercel Environment Variables.");
    }
    let credential;
    
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        credential = admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
      } catch (e) {
        throw new Error("Gagal membaca FIREBASE_SERVICE_ACCOUNT. Pastikan Anda menyalin seluruh isi file JSON dengan benar.");
      }
    } else {
      let privateKey = process.env.FIREBASE_PRIVATE_KEY || "";
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
      }
      privateKey = privateKey.replace(/\\n/g, '\n').replace(/\\r/g, '\r');

      if (privateKey.includes('BEGIN PRIVATE KEY')) {
        const match = privateKey.match(/-----BEGIN PRIVATE KEY-----([\s\S]+?)-----END PRIVATE KEY-----/);
        if (match && match[1]) {
          const base64 = match[1].replace(/\s+/g, '');
          const formattedBase64 = base64.match(/.{1,64}/g)?.join('\n') || base64;
          privateKey = `-----BEGIN PRIVATE KEY-----\n${formattedBase64}\n-----END PRIVATE KEY-----\n`;
        }
      }

      credential = admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID?.trim(),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL?.trim(),
        privateKey: privateKey,
      });
    }

    admin.initializeApp({ credential });
  }
  return admin.firestore();
}

const adminDb = new Proxy({}, {
  get: (target, prop) => {
    const db = getAdminDb();
    const value = (db as any)[prop];
    return typeof value === 'function' ? value.bind(db) : value;
  }
}) as admin.firestore.Firestore;

export { admin, adminDb };
