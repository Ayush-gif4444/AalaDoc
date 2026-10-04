import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeFirebaseAuth } from './firebase-auth-persistence';
import firebaseGoogleServices from '../google-services.json';

const projectInfo = firebaseGoogleServices.project_info;
const androidClient = firebaseGoogleServices.client[0];

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || androidClient.api_key[0].current_key,
  authDomain: `${projectInfo.project_id}.firebaseapp.com`,
  projectId: projectInfo.project_id,
  storageBucket: projectInfo.storage_bucket,
  messagingSenderId: projectInfo.project_number,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || androidClient.client_info.mobilesdk_app_id,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = initializeFirebaseAuth(app);
export const db = getFirestore(app);