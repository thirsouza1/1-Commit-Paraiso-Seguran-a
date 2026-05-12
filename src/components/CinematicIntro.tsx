import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { Database, Shield, Zap, Target, Cpu, Activity, Globe } from 'lucide-react';

export const CinematicIntro: React.FC = () => {
  const [step, setStep] = useState(0);
  const setCinematicFinished = useStore((state) => state.setCinematicFinished);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1500), // Explosion to Globe Tracking
      setTimeout(() => setStep(2), 5500), // Globe Tracking to Logo Reveal
      setTimeout(() => setStep(3), 8500), // Reveal to Final Signature
      setTimeout(() => setCinematicFinished(true), 11500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [setCinematicFinished]);

  const GlobeZoom = () => (
    <motion.div 
      key="globe-zoom"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 2 }}
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Satellites and Beams */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute w-full h-full"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-x-0 h-full flex items-start justify-center"
              >
                <div className="mt-20 flex flex-col items-center">
                   <div className="relative">
                     <motion.div 
                        animate={{ opacity: [0.2, 0.8, 0.2] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute -inset-4 border border-cyan-400 rounded-full" 
                     />
                     <Globe className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_10px_#22d3ee]" />
                   </div>
                   {/* GPS Beam */}
                   <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: '400px' }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="w-[2px] bg-gradient-to-b from-cyan-400 to-transparent blur-[1px] relative opacity-40"
                   >
                     <motion.div 
                        animate={{ y: [0, 400] }}
                        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 left-0 w-full h-10 bg-white"
                     />
                   </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* The Globe Zoom Sequence */}
        <motion.div
          animate={{
            scale: [1, 1.5, 4, 12],
            x: [0, 0, -100, -450],
            y: [0, 0, 50, 200]
          }}
          transition={{
            duration: 4,
            times: [0, 0.4, 0.7, 1],
            ease: "easeInOut"
          }}
          className="relative w-[600px] h-[600px] flex items-center justify-center"
        >
          {/* External Halo */}
          <div className="absolute inset-0 border border-cyan-500/20 rounded-full animate-pulse" />
          <div className="absolute -inset-10 border border-cyan-500/10 rounded-full border-dashed" />
          
          {/* Earth Mockup (Stylized) */}
          <div className="w-[500px] h-[500px] rounded-full bg-black border-2 border-cyan-500/40 relative overflow-hidden shadow-[inset_0_0_80px_rgba(6,182,212,0.5)]">
            {/* Map Grids */}
            <div className="absolute inset-0 tech-grid opacity-40" />
            
            {/* Earth Rotation Simulation */}
            <motion.div
              animate={{ x: [-1000, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-y-0 w-[2000px] flex"
            >
               <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
            </motion.div>

            {/* Random Nodes across the globe */}
            {[...Array(12)].map((_, j) => (
              <motion.div
                key={j}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 2, delay: j * 0.3, repeat: Infinity }}
                style={{ 
                  top: `${20 + Math.random() * 60}%`, 
                  left: `${10 + Math.random() * 80}%` 
                }}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_5px_#22d3ee]"
              />
            ))}

            {/* Target Point: South America / Brazil / SSP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="absolute top-[60%] left-[32%] w-4 h-4"
            >
              <div className="relative">
                <motion.div 
                  animate={{ scale: [1, 3], opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 bg-white rounded-full"
                />
                <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff]" />
                
                {/* Location Tag */}
                <motion.div
                   initial={{ opacity: 0, x: 10 }}
                   animate={{ opacity: 1, x: 20 }}
                   transition={{ delay: 3 }}
                   className="absolute whitespace-nowrap"
                >
                  <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-black/80 px-2 py-1 rounded border border-cyan-400/30">
                    S. S. DO PARAÍSO, MG
                  </p>
                  <p className="text-[7px] font-mono text-white/60 mt-1">CEP: 37950-000</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* HUD Overlay Elements */}
        <div className="absolute bottom-10 left-10 text-left border-l-2 border-cyan-500/30 pl-4">
           <h4 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">Rastreamento de Ativos</h4>
           <div className="flex gap-2">
              <div className="w-1 h-3 bg-cyan-500" />
              <div className="w-1 h-3 bg-cyan-500/50" />
              <div className="w-1 h-3 bg-cyan-500/20" />
           </div>
        </div>

        <div className="absolute top-10 right-10 text-right">
           <p className="text-[14px] font-black text-white uppercase tracking-[0.5em] mb-2 drop-shadow-lg">Sincronização Global</p>
           <div className="h-1 w-32 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                animate={{ x: [-128, 128] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1/2 h-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]"
              />
           </div>
        </div>

        <div className="absolute bottom-20 text-center w-full">
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="text-[9px] font-black text-cyan-400 uppercase tracking-[1em] animate-pulse"
           >
             Estabelecendo Conexão Orbital
           </motion.p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 bg-[#020202] overflow-hidden z-[100] flex items-center justify-center font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)] opacity-30" />
      
      <button 
        onClick={() => setCinematicFinished(true)}
        className="fixed top-6 right-6 z-[110] bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full border border-white/30 text-[10px] uppercase tracking-[0.3em] text-white font-black transition-all backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      >
        Pular introdução
      </button>

      <AnimatePresence mode="wait">
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
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{ 
                    x: (Math.random() - 0.5) * 1400, 
                    y: (Math.random() - 0.5) * 1000,
                    scale: [0, 2, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: Math.random() * 0.5 }}
                  className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_15px_#fff]"
                />
              ))}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80">
                <motion.circle 
                  cx="50%" cy="50%" r="0"
                  animate={{ r: [0, 800], opacity: [1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  stroke="#fff"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                 <h2 className="text-white font-black text-xl tracking-[1em] uppercase animate-pulse">Iniciando Protocolos</h2>
              </div>
            </div>
          </motion.div>
        )}

        {step === 1 && <GlobeZoom />}

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
              animate={{ opacity: 0.8 }}
              transition={{ delay: 1 }}
              className="absolute bottom-10 flex items-center gap-4 group"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Operações Seguras por Pixelynx</span>
              <div className="w-10 h-6 rounded-lg bg-white/5 border border-white/20 flex items-center justify-center p-1">
                <img src="/logo_pixelynx.png" alt="Pixelynx" className="w-full h-full object-contain grayscale invert" />
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
