import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDwn5257QrJQhNH5Z9fuf-QUDMpGmMfED0',
  authDomain: 'vou-backend-22019.firebaseapp.com',
  projectId: 'vou-backend-22019',
  storageBucket: 'vou-backend-22019.appspot.com',
  messagingSenderId: '562175407861',
  appId: '1:562175407861:web:078d086dc2742661f437bc',
  measurementId: 'G-DFN2BKEM1F',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);
