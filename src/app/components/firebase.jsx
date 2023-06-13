import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAeZ8eGHTbRZkz2Q0JwEc8rjdBLjR3dZqU",
  authDomain: "megabillares-scp.firebaseapp.com",
  projectId: "megabillares-scp",
  storageBucket: "megabillares-scp.appspot.com",
  messagingSenderId: "912924618762",
  appId: "1:912924618762:web:7651be73cb17b0a6daeff3",
  measurementId: "G-P1JMJMN80R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleAuthProvider, db };
