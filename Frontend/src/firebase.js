// Import Firebase core
import { initializeApp } from "firebase/app";

// Import Firestore (database)
import { getFirestore } from "firebase/firestore";

// Import Authentication (optional but useful)
import { getAuth } from "firebase/auth";

// Import Storage (optional for files/images)
import { getStorage } from "firebase/storage";


// 🔐 Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChjolrfR8tDksriDzQsoK5Gb07nxEiIn4",
  authDomain: "smart-cbc-analyzer.firebaseapp.com",
  projectId: "smart-cbc-analyzer",
  storageBucket: "smart-cbc-analyzer.firebasestorage.app",
  messagingSenderId: "229207808217",
  appId: "1:229207808217:web:b9d26f3587393ebcc806c8"
};


// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);


// 📦 Initialize Services
const db = getFirestore(app);      // Database
const auth = getAuth(app);         // Authentication
const storage = getStorage(app);   // Storage


// 📤 Export services
export { db, auth, storage };