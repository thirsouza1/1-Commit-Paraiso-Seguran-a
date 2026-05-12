import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { Database, Shield, Zap, Target, Cpu, Activity, Globe } from 'lucide-react';

export const CinematicIntro: React.FC = () => {
  const [step, setStep] = useState(0);
  const setCinematicFinished = useStore((state) => state.setCinematicFinished);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 2000), // Explosion to Glimpse
      setTimeout(() => setStep(2), 4000), // Glimpse to Reveal
      setTimeout(() => setStep(3), 6000), // Reveal to Signature
      setTimeout(() => setCinematicFinished(true), 8500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [setCinematicFinished]);

  return (
    <div className="fixed inset-0 bg-[#020202] overflow-hidden z-[100] flex items-center justify-center font-sans">
      {/* Background Deep Space */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)] opacity-30" />
      
      {/* Skip Button */}
      <button 
        onClick={() => setCinematicFinished(true)}
        className="fixed top-6 right-6 z-[110] bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 text-[10px] uppercase tracking-[0.2em] text-white/50 hover:text-white transition-all backdrop-blur-md"
      >
        Skip sequence
      </button>

      <AnimatePresence mode="wait">
        {/* STEP 0: Data Explosion (0-2s) */}
        {step === 0 && (
          <motion.div 
            key="step0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 2, filter: 'blur(20px)' }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative w-full h-full">
              {[...Array(40)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    scale: 0,
                    opacity: 0 
                  }}
                  animate={{ 
                    x: (Math.random() - 0.5) * 1200, 
                    y: (Math.random() - 0.5) * 800,
                    scale: [0, 1.5, 0],
                    opacity: [0, 0.8, 0]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    delay: Math.random() * 0.5,
                    ease: "easeOut"
                  }}
                  className="absolute w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee]"
                />
              ))}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <motion.circle 
                  cx="50%" cy="50%" r="0"
                  animate={{ r: [0, 600], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  stroke="#22d3ee"
                  strokeWidth="1"
                  fill="none"
                />
                <motion.circle 
                  cx="50%" cy="50%" r="0"
                  animate={{ r: [0, 400], opacity: [0.3, 0] }}
                  transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
                  stroke="#22d3ee"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* STEP 1: Operational Glimpse (2-4s) */}
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(30px)' }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
          >
            <div className="w-full max-w-4xl grid grid-cols-3 gap-6 p-10 relative">
              {/* HUD Elements */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-cyan-500/5 border border-cyan-500/20 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-2">
                    <Activity className="w-3 h-3 text-cyan-500/40" />
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4">
                    {i === 0 && <Globe className="w-5 h-5 text-cyan-400" />}
                    {i === 1 && <Shield className="w-5 h-5 text-cyan-400" />}
                    {i === 2 && <Target className="w-5 h-5 text-cyan-400" />}
                    {i === 3 && <Cpu className="w-5 h-5 text-cyan-400" />}
                    {i === 4 && <Activity className="w-5 h-5 text-cyan-400" />}
                    {i === 5 && <Database className="w-5 h-5 text-cyan-400" />}
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ x: [-100, 200] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-1/2 h-full bg-cyan-500/40"
                    />
                  </div>
                  <div className="mt-4 flex gap-1">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="w-1.5 h-1.5 bg-cyan-500/40 rounded-full" />
                    ))}
                  </div>
                </motion.div>
              ))}
              
              {/* Tactical Grid Background */}
              <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none -z-10" />
              <motion.div 
                animate={{ 
                  rotate: [0, 360],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-cyan-500/10 rounded-full pointer-events-none"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_15px_#22d3ee]" />
              </motion.div>
            </div>
            
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
              <h3 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[1em] font-black animate-pulse">
                Sincronizando Nodes Operacionais
              </h3>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Logo Reveal (4-6s) */}
        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6"
          >
            {/* Energy Convergence Flux */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: i % 2 === 0 ? -1000 : 1000, y: (Math.random() - 0.5) * 500 }}
                  animate={{ x: 0, y: 0, opacity: [0, 1, 0], scale: [1, 0.5, 0] }}
                  transition={{ duration: 1, ease: "circIn" }}
                  className="absolute w-40 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-[2px]"
                />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.5, filter: 'blur(20px)', opacity: 0 }}
              animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-12"
            >
              <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full" />
              <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center p-4 relative z-10 shadow-[0_0_80px_rgba(34,211,238,0.4)] overflow-hidden border-2 border-cyan-500/20">
                <img src="/logo_one.png" alt="Paraíso ONE" className="w-full h-full object-contain" />
                {/* Metallic Gleam */}
                <motion.div 
                  animate={{ x: [-200, 200], skewX: [-20, -20] }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
                  className="absolute inset-y-0 w-12 bg-white/40 blur-xl"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-7xl font-black tracking-[-0.05em] text-white flex items-center justify-center gap-4">
                <span>PARAÍSO</span>
                <span className="text-cyan-500 relative">
                  ONE
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="absolute -bottom-2 left-0 h-1 bg-cyan-500 shadow-[0_0_15px_#22d3ee]"
                  />
                </span>
              </h1>
            </motion.div>
          </motion.div>
        )}

        {/* STEP 3: Final Signature (6-8s) */}
        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
             <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 0.9, opacity: 0.8 }}
              className="flex flex-col items-center"
            >
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center p-3 mb-10 shadow-[0_0_50px_rgba(34,211,238,0.2)] overflow-hidden">
                <img src="/logo_one.png" alt="Paraíso ONE" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-4xl font-black tracking-tight text-white mb-6">
                PARAÍSO <span className="text-cyan-500">ONE</span>
              </h2>
              
              <div className="h-[1px] w-48 bg-white/10 relative mb-8">
                 <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                 />
              </div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-cyan-400 font-mono tracking-[0.4em] uppercase text-[11px] font-black cyan-text-glow"
              >
                Sua equipe técnica em tempo real.
              </motion.p>
            </motion.div>

            {/* Pixelynx Signature */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 1 }}
              className="absolute bottom-10 flex items-center gap-4 group"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Secure Ops by Pixelynx</span>
              <div className="w-10 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center p-1">
                <img src="/logo_pixelynx.png" alt="Pixelynx" className="w-full h-full object-contain grayscale" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Scanlines Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] z-[200] bg-[length:100%_4px,3px_100%]" />
    </div>
  );
};
