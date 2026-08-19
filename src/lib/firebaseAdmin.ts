import * as admin from 'firebase-admin';

function getAdminDb() {
  if (!admin.apps.length) {
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
      throw new Error("⚠️ FIREBASE ADMIN VARIABLES ARE MISSING! Pastikan Anda sudah memasukkan FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, dan FIREBASE_PRIVATE_KEY di Vercel Environment Variables.");
    }
    let privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();
    // Hapus tanda kutip jika user tidak sengaja menyertakannya saat copy-paste
    if (privateKey?.startsWith('"') && privateKey?.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    privateKey = privateKey?.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID?.trim(),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL?.trim(),
        privateKey: privateKey,
      }),
    });
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
