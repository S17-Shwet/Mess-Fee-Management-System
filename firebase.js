// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYSZxAOcP-_wrbkD-Xm3_KqUSuFG69pnU",
  authDomain: "jijaumessfee.firebaseapp.com",
  projectId: "jijaumessfee",
  storageBucket: "jijaumessfee.appspot.com",
  messagingSenderId: "745128466059",
  appId: "1:745128466059:web:0bb72113c23f3f2578668e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
