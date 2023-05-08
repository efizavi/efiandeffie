import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from 'firebase/firestore/lite'

const firebaseConfig = {
  apiKey: process.env.FIRESTORE_API_KEY,
  authDomain: "efi-and-effie-385006.firebaseapp.com",
  projectId: "efi-and-effie-385006",
  storageBucket: "efi-and-effie-385006.appspot.com",
  messagingSenderId: "296174817448",
  appId: "1:296174817448:web:e2f3965839ae2dd289b29d"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app);


exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' })};
  }

  const data = JSON.parse(event.body);

  try {
    const guestsCol = collection(db, 'guests');
    await addDoc(guestsCol, {
      name: data.name,
      guests: data.guests,
      response: data.response,
    });
    return { statusCode: 200, body: JSON.stringify({ message: "Data saved successfully"})};
  } catch (error) {
    console.error('Error saving data:', error);
    return { statusCode: 500, body: JSON.stringify({ message: error })};
  }
};