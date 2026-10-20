// Use full URLs for the browser
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDKEfkcwgdL1nBzgfoFdnhY0jCVl-XYyXM",
  authDomain: "team4-6edb7.firebaseapp.com",
  databaseURL: "https://team4-6edb7-default-rtdb.firebaseio.com",
  projectId: "team4-6edb7",
  storageBucket: "team4-6edb7.firebasestorage.app",
  messagingSenderId: "510590718606",
  appId: "1:510590718606:web:6c5eadf7c5a56bc7e3efdf",
  measurementId: "G-WV52Q4MZM7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and export it
export const db = getDatabase(app);