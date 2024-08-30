import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZRPyRqXwUGyk6s4sbcom9N_AVyiA4KIg",
  authDomain: "scrollwise-e22e0.firebaseapp.com",
  projectId: "scrollwise-e22e0",
  storageBucket: "scrollwise-e22e0.appspot.com",
  messagingSenderId: "340650485632",
  appId: "1:340650485632:web:26d3e453774cc7f0234365",
  measurementId: "G-ZWB5TKP7MQ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore};