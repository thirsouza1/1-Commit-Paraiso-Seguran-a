import { doc, getDocFromServer, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase Connection: OK");
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or network.");
    }
  }
}

export async function initializeDevData() {
  const user = auth.currentUser;
  if (!user) return;

  // 1. Set current user as Admin in 'admins' collection
  await setDoc(doc(db, 'admins', user.uid), { uid: user.uid });

  // 2. Set user Profile as Admin
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name: user.displayName || 'Senior Operator',
    email: user.email,
    role: 'admin',
    status: 'online',
    updatedAt: serverTimestamp()
  }, { merge: true });

  // 3. Create a Demo Client
  const clientRef = doc(db, 'clients', 'demo-client-1');
  await setDoc(clientRef, {
    name: 'Condomínio Morumbi Sul',
    document: '12.345.678/0001-99',
    address: 'Av. Giovanni Gronchi, 6000 - São Paulo, SP',
    phone: '(11) 99999-8888',
    createdAt: serverTimestamp()
  }, { merge: true });

  // 4. Create a Demo Service Order
  const osRef = doc(db, 'service_orders', 'OS-001');
  await setDoc(osRef, {
    clientId: 'demo-client-1',
    clientName: 'Condomínio Morumbi Sul',
    address: 'Av. Giovanni Gronchi, 6000 - São Paulo, SP',
    techId: user.uid,
    techName: user.displayName || 'Técnico Operacional',
    priority: 'high',
    status: 'pending',
    description: 'Manutenção preventiva no Motor PPA Jet Flex DZ Rio 500 do portão principal.',
    createdAt: serverTimestamp()
  }, { merge: true });

  console.log("Dev Data Initialized");
}
