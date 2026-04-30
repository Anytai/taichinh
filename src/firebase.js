import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVDCRSDI__wZ5cbQpT3Efx4RI0C_NG3VU",
  authDomain: "taichinhdemo-9002a.firebaseapp.com",
  projectId: "taichinhdemo-9002a",
  storageBucket: "taichinhdemo-9002a.firebasestorage.app",
  messagingSenderId: "1097312808559",
  appId: "1:1097312808559:web:c9624a368190d73c34279a",
  measurementId: "G-Y5Z1DPZ6PV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
