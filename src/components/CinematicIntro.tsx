import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';

const LOGO_PARAISO = "http://paraisoseguranca.com.br/imagens/logo_topo.png";
const LOGO_PIXELYNX = "https://www.dropbox.com/scl/fi/kvr7ey34twfok67pi4p4p/WhatsApp-Image-2026-05-10-at-10.55.17.jpeg?rlkey=ido1ugq4ujj9qzxyhg5aje118&st=rts45d2n&dl=1"; // Fixed DL=1 for direct download

export const CinematicIntro: React.FC = () => {
  const [step, setStep] = useState(0);
  const setCinematicFinished = useStore((state) => state.setCinematicFinished);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1000), // Dark environment, rain start
      setTimeout(() => setStep(2), 2500), // Gate starts opening
      setTimeout(() => setStep(3), 5500), // Logo emerges
      setTimeout(() => setStep(4), 8500), // Paraíso One title
      setTimeout(() => setCinematicFinished(true), 11000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [setCinematicFinished]);

  return (
    <div className="fixed inset-0 bg-[#020202] overflow-hidden z-50 flex items-center justify-center">
      {/* Background Ambience: Rain & Particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 1000, opacity: [0, 1, 0] }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute w-[1px] h-10 bg-blue-400"
            style={{ left: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      {/* Industrial Gate (Conceptual) */}
      <AnimatePresence>
        {step < 3 && (
          <div className="absolute inset-0 flex">
            {/* Left Gate Panel */}
            <motion.div 
              initial={{ x: 0 }}
              animate={step >= 2 ? { x: "-90%" } : { x: 0 }}
              transition={{ duration: 3, ease: [0.45, 0, 0.55, 1] }}
              className="w-1/2 h-full bg-[#121212] border-r-4 border-blue-500/30 flex items-center justify-end pr-4 text-blue-500/10"
            >
              <div className="text-9xl font-black">PARAÍSO</div>
            </motion.div>
            
            {/* Right Gate Panel */}
            <motion.div 
              initial={{ x: 0 }}
              animate={step >= 2 ? { x: "90%" } : { x: 0 }}
              transition={{ duration: 3, ease: [0.45, 0, 0.55, 1] }}
              className="w-1/2 h-full bg-[#121212] border-l-4 border-blue-500/30 flex items-center justify-start pl-4 text-blue-500/10"
            >
              <div className="text-9xl font-black">SEGURANÇA</div>
            </motion.div>

            {/* Blue Glow on Floor (Light streaks) */}
            <motion.div 
              initial={{ opacity: 0, scaleX: 0 }}
              animate={step >= 2 ? { opacity: 1, scaleX: 1 } : { opacity: 0 }}
              transition={{ delay: 0.5, duration: 2 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-[2px] bg-blue-500 shadow-[0_0_20px_4px_rgba(59,130,246,0.8)]"
              style={{ width: '80vw' }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Holographic Logo Reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
        animate={step >= 3 ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
        transition={{ duration: 2, ease: "easeOut" }}
        className="flex flex-col items-center gap-8 relative z-10"
      >
        <div className="relative group">
          {/* Neon Glow Circle */}
          <motion.div 
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-blue-500/20 rounded-full blur-[60px]"
          />
          <img 
            src={LOGO_PARAISO} 
            alt="Paraíso" 
            className="w-80 h-auto filter drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] brightness-0 invert opacity-80"
            referrerPolicy="no-referrer"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={step >= 4 ? { opacity: 1, y: 0 } : {}}
          className="text-center"
        >
          <h1 className="text-6xl font-black tracking-[0.2em] text-white">
            PARAÍSO <span className="text-cyan-500">ONE</span>
          </h1>
          <p className="text-cyan-400 font-mono tracking-[0.4em] mt-4 uppercase opacity-80 text-[10px] font-black">
            Iniciando Protocolos Operacionais
          </p>
        </motion.div>
      </motion.div>

      {/* Developer Credit - Discrete Footer */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">Developed by Pixelynx</span>
        <img 
          src={LOGO_PIXELYNX} 
          alt="Pixelynx" 
          className="w-12 h-12 rounded-full grayscale brightness-50"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};
