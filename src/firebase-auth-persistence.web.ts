import { FirebaseApp } from 'firebase/app';
import {
  Auth,
  browserLocalPersistence,
  getAuth,
  initializeAuth,
} from 'firebase/auth';

export function initializeFirebaseAuth(app: FirebaseApp): Auth {
  if (typeof window === 'undefined') {
    return getAuth(app);
  }

  try {
    return initializeAuth(app, { persistence: browserLocalPersistence });
  } catch {
    return getAuth(app);
  }
}