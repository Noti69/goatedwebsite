import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  databaseURL: "https://jiya-website-default-rtdb.asia-southeast1.firebasedatabase.app/" // PASTE YOUR LINK HERE!
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);