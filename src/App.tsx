import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { useStore } from './store/useStore';
import { CinematicIntro } from './components/CinematicIntro';
import { AdminDesk } from './views/AdminDesk';
import { MobileApp } from './views/MobileApp';
import { AuthView } from './views/AuthView';
import { Loader2, Database, AlertCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { testConnection, initializeDevData } from './lib/devSetup';

export default function App() {
  const { user, profile, setUser, setProfile, isCinematicFinished } = useStore();
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Hidden Dev Button for setting up initial data if profile is empty
  const DevButton = () => (
    <button 
      onClick={async () => {
        setLoading(true);
        await initializeDevData();
        window.location.reload();
      }}
      className="fixed bottom-24 right-6 z-[999] bg-white/5 hover:bg-white/10 p-2 rounded-full border border-white/10 opacity-5 hover:opacity-100 transition-all font-sans"
      title="Initialize Demo Data"
    >
      <Database className="w-3 h-3 text-white" />
    </button>
  );

  useEffect(() => {
    testConnection();
    
    // Fallback timer to ensure loader doesn't hang forever
    const fallbackTimer = setTimeout(() => {
      setLoading(false);
    }, 10000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(fallbackTimer);
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          } else {
            console.info("Firebase: No profile document found, using default role");
          }
        } catch (err: any) {
          console.warn("Profile fetch error:", err);
          setProfileError(err.message);
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

  // Route based on role
  if (loading) {
    return (
      <div className="h-screen bg-[#050505] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
        
        <div className="relative">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(34,211,238,0.3)] p-2 overflow-hidden border-2 border-cyan-500/20"
          >
            <img src="/logo_one.png" alt="Paraíso ONE" className="w-full h-full object-contain" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-white font-black uppercase tracking-[0.4em] text-sm mb-3 cyan-text-glow">Conectando ao Centro de Comando</h2>
          <div className="flex flex-col items-center gap-1">
            <p className="text-cyan-400/40 text-[9px] font-mono uppercase tracking-[0.3em] animate-pulse">Sincronizando Protocolos Operacionais</p>
            <div className="w-32 h-[1px] bg-white/5 mt-6 overflow-hidden">
              <motion.div 
                animate={{ x: [-128, 128] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-full h-full bg-cyan-500 shadow-[0_0_10px_#22d3ee]"
              />
            </div>
          </div>
        </motion.div>

        {/* Emergency Manual Action if profile is missing */}
        {user && !profile && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12"
          >
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 border border-white/10 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all shadow-lg backdrop-blur-md"
            >
              Refresh
            </button>
            <DevButton />
          </motion.div>
        )}
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  // If logged in, prioritize showing the UI. 
  // We handle profile gaps inside the components or as overlays.
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
      <DevButton />
    </>
  );
}
