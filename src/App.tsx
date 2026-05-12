import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { useStore } from './store/useStore';
import { CinematicIntro } from './components/CinematicIntro';
import { AdminDesk } from './views/AdminDesk';
import { MobileApp } from './views/MobileApp';
import { AuthView } from './views/AuthView';
import { Loader2, Database } from 'lucide-react';
import { testConnection, initializeDevData } from './lib/devSetup';

export default function App() {
  const { user, profile, setUser, setProfile, isCinematicFinished } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testConnection();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setProfile]);

  if (!isCinematicFinished) {
    return <CinematicIntro />;
  }

  if (loading) {
    return (
      <div className="h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  // Hidden Dev Button for setting up initial data if profile is empty
  const DevButton = () => (
    <button 
      onClick={async () => {
        await initializeDevData();
        window.location.reload();
      }}
      className="fixed bottom-4 right-4 z-[999] bg-white/5 hover:bg-white/10 p-2 rounded-full border border-white/10 opacity-20 hover:opacity-100 transition-all"
      title="Initialize Demo Data"
    >
      <Database className="w-4 h-4 text-white" />
    </button>
  );

  // Route based on role
  if (profile?.role === 'admin') {
    return (
      <>
        <AdminDesk />
        <DevButton />
      </>
    );
  }

  // Default to MobileApp for technicians
  return (
    <>
      <MobileApp />
      {!profile && <DevButton />}
    </>
  );
}
