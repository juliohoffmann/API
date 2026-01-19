import admin from "firebase-admin";
import {env} from "./env";

const initializeFirebaseAdmin = ():void => {
   if (admin.apps.length > 0) {
        console.log('Firebase Admin já inicializado.'); 
        return;
    }

    const {FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID} = env;
    if (!FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY || !FIREBASE_PROJECT_ID) {
        throw new Error('🚨Falha ao iniciar Firebase - faltado as credenciais');
    }
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                clientEmail: FIREBASE_CLIENT_EMAIL,
                privateKey: FIREBASE_PRIVATE_KEY!,
                projectId: FIREBASE_PROJECT_ID,
            }),
        });
    } catch (error) {
        throw new Error('🚨Falha ao iniciar Firebase');
        process.exit(1);
    }
};
export default initializeFirebaseAdmin
    