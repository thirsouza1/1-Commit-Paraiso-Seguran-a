import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromCache, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Test connection and log status
async function testConnection() {
  try {
    // Try to get a dummy doc to wake up the connection
    await getDocFromServer(doc(db, '_connection_test_', 'init'));
    console.log("Firebase: Connection established successfully.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.error("Firebase: Client is offline or backend unreachable.");
    } else {
      console.warn("Firebase: Connection test result:", error);
    }
  }
}

testConnection();
