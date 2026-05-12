import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { Database, Shield, Zap, Target, Cpu, Activity, Globe } from 'lucide-react';

export const CinematicIntro: React.FC = () => {
  const [step, setStep] = useState(0);
  const setCinematicFinished = useStore((state) => state.setCinematicFinished);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 2000), // Explosion to Globe Tracking (longer stay on protocols)
      setTimeout(() => setStep(2), 6500), // Globe Tracking to Logo Reveal (smoother zoom)
      setTimeout(() => setStep(3), 9500), // Reveal to Final Signature
      setTimeout(() => setCinematicFinished(true), 12500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [setCinematicFinished]);

  const GlobeZoom = () => (
    <motion.div 
      key="globe-zoom"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 2 }}
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#00040d]"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Deep Space Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,163,255,0.15)_0%,transparent_100%)] opacity-40" />

        {/* Global Connection Arcs (Background Layer) */}
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
           {[...Array(8)].map((_, i) => (
             <motion.div
               key={i}
               animate={{ 
                 rotate: [i * 45, i * 45 + 360],
                 opacity: [0.1, 0.3, 0.1]
               }}
               transition={{ duration: 30 + i * 10, repeat: Infinity, ease: "linear" }}
               className="absolute w-[900px] h-[400px] border border-[#00A3FF]/30 rounded-[100%] shadow-[0_0_30px_rgba(0,163,255,0.05)]"
               style={{ 
                 rotateX: '75deg',
                 rotateY: `${i * 22}deg`
               }}
             >
                {/* Data Packets traveling on background arcs */}
                <motion.div 
                  animate={{ left: ['0%', '100%'] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.5, ease: "linear" }}
                  className="absolute top-0 w-2 h-2 bg-white rounded-full blur-[2px] shadow-[0_0_10px_#fff]"
                />
             </motion.div>
           ))}
        </div>

        {/* The Digital Globe (Wireframe + Particles) */}
        <motion.div
          animate={{
            scale: [1, 1.3, 4, 22],
            x: [0, 0, -200, -800],
            y: [0, 0, 120, 450]
          }}
          transition={{
            duration: 6.5,
            times: [0, 0.3, 0.6, 1],
            ease: "easeInOut"
          }}
          className="relative w-[700px] h-[700px] flex items-center justify-center z-20"
        >
          {/* Outer Atmospheric Aura */}
          <div className="absolute inset-0 bg-[#00A3FF]/20 blur-[130px] rounded-full animate-pulse" />
          
          <div className="w-[600px] h-[600px] rounded-full bg-[#010614] border border-[#00A3FF]/40 relative overflow-hidden shadow-[0_0_100px_rgba(0,163,255,0.5),inset_0_0_80px_rgba(0,163,255,0.4)]">
            {/* The Wireframe Core (Lat/Long Lines) */}
            <div className="absolute inset-0 z-10 opacity-60">
              <svg className="w-full h-full" viewBox="0 0 600 600">
                <defs>
                   <linearGradient id="wireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00A3FF" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#00A3FF" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#00A3FF" stopOpacity="0.2" />
                   </linearGradient>
                </defs>
                {/* Longitudinal Lines */}
                {[...Array(12)].map((_, i) => (
                  <ellipse 
                    key={`lon-${i}`}
                    cx="300" cy="300" rx={300 * Math.cos((i * Math.PI) / 6)} ry="300"
                    stroke="url(#wireGrad)" strokeWidth="0.5" fill="none"
                    className="origin-center"
                  />
                ))}
                {/* Latitudinal Lines */}
                {[...Array(8)].map((_, i) => (
                  <ellipse 
                    key={`lat-${i}`}
                    cx="300" cy={75 * (i + 0.5)} rx={Math.sqrt(300*300 - Math.pow(300 - 75*(i+0.5), 2))} ry="15"
                    stroke="url(#wireGrad)" strokeWidth="0.5" fill="none"
                  />
                ))}
              </svg>
            </div>

            {/* Glowing Particle Surface */}
            <div className="absolute inset-0 z-20 opacity-80">
               {[...Array(150)].map((_, i) => (
                 <motion.div
                   key={i}
                   initial={{ opacity: 0 }}
                   animate={{ 
                     opacity: [0.1, 0.8, 0.1],
                     scale: [1, 1.5, 1]
                   }}
                   transition={{ 
                     duration: 2 + Math.random() * 3, 
                     repeat: Infinity, 
                     delay: Math.random() * 2 
                   }}
                   className="absolute w-[2px] h-[2px] bg-[#00A3FF] rounded-full shadow-[0_0_8px_#00A3FF]"
                   style={{ 
                     top: `${Math.random() * 100}%`, 
                     left: `${Math.random() * 100}%` 
                   }}
                 />
               ))}
            </div>

            {/* Scanning Laser HUD (Minimized style, more tech-beam) */}
            <motion.div 
               animate={{ y: [-300, 300], opacity: [0, 0.5, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               className="absolute inset-x-0 h-[4px] bg-gradient-to-r from-transparent via-[#00A3FF] to-transparent blur-md z-40 top-1/2"
            />

            {/* Target Marker: ONE BRAZIL */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.5 }}
              className="absolute top-[62%] left-[34%] w-10 h-10 z-50 flex items-center justify-center"
            >
              <div className="relative">
                {/* Core Impact */}
                <motion.div 
                  animate={{ scale: [1, 4], opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-white rounded-full blur-md"
                />
                <div className="w-5 h-5 bg-white rounded-full shadow-[0_0_30px_#fff] border-2 border-[#00A3FF]" />
                
                {/* Minimalist Tech Label */}
                <motion.div
                   initial={{ opacity: 0, scale: 0.8, x: 40 }}
                   animate={{ opacity: 1, scale: 1, x: 55 }}
                   transition={{ delay: 4.2 }}
                   className="absolute whitespace-nowrap bg-black/95 border border-[#00A3FF] p-4 rounded-lg shadow-[0_0_40px_rgba(0,163,255,0.5)] backdrop-blur-3xl"
                >
                  <p className="text-[12px] font-black text-white uppercase tracking-[0.5em] mb-1">
                    PROTOCOLO <span className="text-[#00A3FF]">ONE</span>
                  </p>
                  <div className="w-full h-[1px] bg-gradient-to-r from-[#00A3FF] to-transparent mb-2" />
                  <div className="flex items-center gap-3">
                     <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                     <p className="text-[9px] font-mono text-[#00A3FF]/80 uppercase tracking-widest font-black">S.S. DO PARAÍSO, BRASIL</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* High Energy Orbital Rings (Foreground Layer) */}
          <div className="absolute inset-0 z-30 pointer-events-none scale-110">
             {[...Array(3)].map((_, i) => (
               <motion.div
                 key={i}
                 animate={{ rotate: 360 }}
                 transition={{ duration: 12 + i * 4, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0"
               >
                 <div 
                   className="absolute top-0 left-1/2 -ml-[1px] h-full w-[2px] bg-gradient-to-b from-[#00A3FF] via-transparent to-transparent opacity-40 shadow-[0_0_20px_#00A3FF]"
                   style={{ transform: `rotateY(${i * 60}deg)` }}
                 />
                 {/* Traveling Pulse Node */}
                 <motion.div 
                    animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.7 }}
                    className="absolute left-1/2 -ml-2 w-4 h-4 bg-white rounded-full blur-[2px] shadow-[0_0_15px_#fff]"
                    style={{ transform: `rotateY(${i * 60}deg)` }}
                 />
               </motion.div>
             ))}
          </div>
        </motion.div>

        {/* Global Connection Pulses at the bottom */}
        <div className="absolute bottom-12 text-center w-full z-40">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-block"
           >
              <h3 className="text-[14px] font-black text-white uppercase tracking-[1.5em] mb-6 drop-shadow-[0_0_20px_rgba(0,163,255,0.8)]">
                PROCESSANDO REDE GLOBAL
              </h3>
              <div className="flex items-center justify-center gap-3">
                 {[...Array(6)].map((_, i) => (
                   <motion.div 
                      key={i}
                      animate={{ scale: [1, 2, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity }}
                      className="w-2 h-10 bg-[#00A3FF] rounded-full shadow-[0_0_15px_#00A3FF]"
                   />
                 ))}
              </div>
           </motion.div>
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
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(30px)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
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
                  className="absolute w-2 h-2 bg-[#00A3FF] rounded-full shadow-[0_0_20px_#00A3FF,0_0_40px_#00A3FF]"
                />
              ))}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-90">
                <motion.circle 
                  cx="50%" cy="50%" r="0"
                  animate={{ r: [0, 900], opacity: [1, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  stroke="#00A3FF"
                  strokeWidth="4"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                 <h2 className="text-[#00A3FF] font-black text-2xl tracking-[1.5em] uppercase animate-pulse drop-shadow-[0_0_25px_#00A3FF] text-center">
                  <span className="block mb-2 opacity-50 text-sm tracking-[2em]">Iniciando</span>
                  <span className="block">Protocolos</span>
                 </h2>
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
