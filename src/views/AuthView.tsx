import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Shield, Key, User, Fingerprint } from 'lucide-react';

const LOGO_PARAISO = "http://paraisoseguranca.com.br/imagens/logo_topo.png";
const googleProvider = new GoogleAuthProvider();

export const AuthView: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setError('POR FAVOR, INSIRA SUAS CREDENCIAIS');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Map user ID to a internal system email
      const emailToUse = username.trim().toLowerCase().includes('@') 
        ? username.trim().toLowerCase() 
        : `${username.trim().toLowerCase()}@paraiso.one`;
      
      const pwd = password.trim();

      try {
        await signInWithEmailAndPassword(auth, emailToUse, pwd);
      } catch (signInErr: any) {
        console.warn('Sign-in check failed:', signInErr.code);
        
        // Handle initial creation for the specific Thiago credentials
        const isBootstrapUser = username.trim().toLowerCase() === 'thiago' && pwd === 'Thiago@1920';
        
        if (
          (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential') && 
          isBootstrapUser
        ) {
          console.info('Attempting to create bootstrap user Thiago in project:', auth.app.options.projectId);
          try {
            const credential = await createUserWithEmailAndPassword(auth, emailToUse, pwd);
            await setDoc(doc(db, 'users', credential.user.uid), {
              uid: credential.user.uid,
              name: 'Thiago Admin',
              email: emailToUse,
              role: 'admin',
              status: 'online',
              createdAt: new Date().toISOString(),
            });
          } catch (createErr: any) {
            console.error('Failed to create bootstrap user:', createErr);
            throw createErr;
          }
        } else {
          throw signInErr;
        }
      }
    } catch (err: any) {
      console.error('Detailed login error data:', {
        code: err.code,
        message: err.message,
        projectId: auth.app.options.projectId
      });
      
      if (err.code === 'auth/operation-not-allowed') {
        setError(`ERRO: PROVEDOR DESATIVADO NO PROJETO: ${auth.app.options.projectId}`);
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('ACESSO NEGADO: CREDENCIAIS INCORRETAS');
      } else {
        setError(`ERRO DE AUTENTICAÇÃO: ${err.code || 'DESCONHECIDO'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          uid: user.uid,
          name: user.displayName || 'Usuário',
          email: user.email,
          role: 'technician',
          status: 'offline',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      setError('Falha na autenticação via Google.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900 rounded-full blur-[150px] opacity-10 pointer-events-none" />
      <div className="tech-grid absolute inset-0 opacity-10 pointer-events-none" />
      <div className="scanline" />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-black/40 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.3)] mb-8 p-2 overflow-hidden border-2 border-cyan-500/20">
             <img src="/logo_one.png" alt="Paraíso ONE" className="w-full h-full object-contain" />
          </div>
          
          <h2 className="text-2xl font-black text-white tracking-[0.2em] text-center uppercase">
            PARAISO <span className="text-cyan-500 underline decoration-2 underline-offset-8">ONE</span>
          </h2>
          <p className="text-cyan-400 font-mono text-[9px] mt-4 uppercase tracking-[0.4em] font-bold">GESTÃO DE EQUIPES EXTERNAS</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-cyan-400 transition-all" />
              <input 
                type="text"
                placeholder="ID DE ACESSO"
                className="w-full bg-white/10 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/60 focus:ring-4 focus:ring-cyan-500/10 transition-all font-mono tracking-tighter"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-cyan-400 transition-all" />
              <input 
                type="password"
                placeholder="SENHA OPERACIONAL"
                className="w-full bg-white/10 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/60 focus:ring-4 focus:ring-cyan-500/10 transition-all font-mono tracking-tighter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 border border-red-500/20 bg-red-500/5 p-3 rounded-lg">
              <Shield className="w-4 h-4 shrink-0" />
              <p className="text-[10px] uppercase font-black tracking-tighter">{error}</p>
            </div>
          )}

          <motion.button 
            onClick={handleLogin}
            disabled={loading}
            whileHover={{ scale: 1.01, boxShadow: "0 0 30px rgba(6,182,212,0.6)" }}
            whileTap={{ scale: 0.96 }}
            className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] uppercase tracking-[0.2em] text-sm relative overflow-hidden"
          >
            <motion.div 
              initial={false}
              animate={loading ? { x: 0 } : { x: "-100%" }}
              className="absolute inset-0 bg-white/10 pointer-events-none"
            />
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Fingerprint className="w-5 h-5" />
            )}
            {loading ? 'Validando...' : 'Autenticar Sistema'}
          </motion.button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em]"><span className="bg-black/40 px-6 text-white/20 font-mono backdrop-blur-xl">INTEGRAÇÃO ECOSSISTEMA</span></div>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-4 active:scale-[0.98] text-[10px] uppercase tracking-widest"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4 grayscale opacity-60" alt="Google" />
            Google Workspace Auth
          </button>
        </div>

        <div className="mt-10 pt-10 border-t border-white/5 text-center flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 opacity-60">
              <div className="w-16 h-10 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center p-1.5">
                 <img src="/logo_pixelynx.png" alt="Pixelynx" className="w-full h-full object-contain" />
              </div>
              <span className="text-[8px] uppercase tracking-[0.5em] text-white">PIXELYNX SECURE OPS</span>
            </div>
            <p className="text-white/10 text-[8px] uppercase tracking-[0.2em] leading-relaxed">
              Propriedade de Paraíso Segurança Ltda. <br/>
              Acesso restrito a pessoal autorizado.
            </p>
        </div>
      </motion.div>
    </div>
  );
};
