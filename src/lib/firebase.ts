
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9ogVuRpUqzj8JHYpAhqHmD9U9F_kCcQY", 
  authDomain: "destinify-usa.firebaseapp.com",
  projectId: "destinify-usa",
  storageBucket: "destinify-usa.appspot.com",
  messagingSenderId: "1023826153893",
  appId: "1:1023826153893:web:fc01b2aef67cbf14b05241"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
