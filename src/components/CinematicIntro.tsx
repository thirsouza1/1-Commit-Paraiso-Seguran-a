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
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    delay: Math.random() * 0.5,
                    ease: "easeOut"
                  }}
                  className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_20px_#22d3ee]"
                />
              ))}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
                <motion.circle 
                  cx="50%" cy="50%" r="0"
                  animate={{ r: [0, 700], opacity: [0.8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  stroke="#22d3ee"
                  strokeWidth="2"
                  fill="none"
                />
                <motion.circle 
                  cx="50%" cy="50%" r="0"
                  animate={{ r: [0, 500], opacity: [0.6, 0] }}
                  transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
                  stroke="#22d3ee"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1.2] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-60 h-60 bg-cyan-500/20 rounded-full blur-[100px]" />
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
            className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="w-full max-w-lg grid grid-cols-2 gap-4 p-6 relative z-10">
              {/* HUD Elements */}
              {[
                { icon: Globe, label: 'Global Network', sub: 'Satellite Uplink' },
                { icon: Shield, label: 'Security Firewall', sub: 'Zero-Trust Protocol' },
                { icon: Target, label: 'Asset Tracking', sub: 'GPS Precision' },
                { icon: Cpu, label: 'Core Processor', sub: 'Tactical Kernel' },
                { icon: Activity, label: 'Biometrics', sub: 'Status Monitoring' },
                { icon: Database, label: 'Secure Storage', sub: 'Encrypted Vault' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-black/60 border border-cyan-500/30 p-5 rounded-2xl backdrop-blur-xl relative overflow-hidden group shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                >
                  <div className="absolute top-0 right-0 p-3">
                    <Activity className="w-3 h-3 text-cyan-500/20" />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-[inset_0_0_15px_rgba(6,182,212,0.1)]">
                      <item.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{item.label}</h4>
                      <p className="text-[7px] text-cyan-500/60 font-mono uppercase tracking-[0.2em]">{item.sub}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.5, delay: i * 0.2 }}
                        className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_8px_#06b6d4]"
                      />
                    </div>
                    <span className="text-[8px] font-mono text-cyan-500/40">v2.4</span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Tactical Grid Background */}
            <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none" />
            
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center w-full">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-cyan-500" />
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.8em] cyan-text-glow">
                  Sincronizando Nodes
                </h3>
                <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-cyan-500" />
              </div>
              <p className="text-[8px] font-mono text-cyan-500/40 uppercase tracking-[0.4em] animate-pulse">
                Establishing military-grade connection
              </p>
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
            className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-radial-gradient from-cyan-900/20 to-transparent"
          >
            {/* Energy Convergence Flux */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: i % 2 === 0 ? -1000 : 1000, y: (Math.random() - 0.5) * 800 }}
                  animate={{ x: 0, y: 0, opacity: [0, 1, 0], scale: [1, 0.8, 0] }}
                  transition={{ duration: 0.8, ease: "circIn", delay: Math.random() * 0.5 }}
                  className="absolute w-80 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-[1px]"
                />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.5, filter: 'blur(20px)', opacity: 0 }}
              animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-12"
            >
              <div className="absolute inset-0 bg-cyan-400/40 blur-[120px] rounded-full" />
              <div className="w-56 h-56 bg-white rounded-full flex items-center justify-center p-6 relative z-10 shadow-[0_0_100px_rgba(34,211,238,0.6)] overflow-hidden border-[6px] border-cyan-500/30">
                <img src="/logo_one.png" alt="Paraíso ONE" className="w-full h-full object-contain" />
                {/* Metallic Gleam */}
                <motion.div 
                  animate={{ x: [-300, 300], skewX: [-25, -25] }}
                  transition={{ duration: 1.2, delay: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  className="absolute inset-y-0 w-20 bg-white/60 blur-2xl"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-8xl font-black tracking-[-0.05em] text-white flex items-center justify-center gap-6">
                <span>PARAÍSO</span>
                <span className="text-cyan-400 relative drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                  ONE
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="absolute -bottom-3 left-0 h-2 bg-gradient-to-r from-cyan-400 to-cyan-600 shadow-[0_0_20px_#22d3ee]"
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
