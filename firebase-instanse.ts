import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagingSenderId: process.env.MESSAGING_SENDER_ID,
//   appId: process.env.APP_ID,
//   measurementId: process.env.MEASUREMENT_ID,
// };
const firebaseConfig = {
  apiKey: "AIzaSyAkFNpaQ1zZ0YDaPeff3MveLl0H3OY8B0k",
  authDomain: "soulcall-da5dd.firebaseapp.com",
  projectId: "soulcall-da5dd",
  storageBucket: "soulcall-da5dd.appspot.com",
  messagingSenderId: "780811741377",
  appId: "1:780811741377:web:bbed4127fe7af44c420c40",
  measurementId: "G-PS26ZYDN14",
};

console.log(firebaseConfig);

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
