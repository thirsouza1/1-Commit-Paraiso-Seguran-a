import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { motion } from 'motion/react';
import { Trash2, CheckCircle } from 'lucide-react';

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  onClose: () => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, onClose }) => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => sigCanvas.current?.clear();
  
  const save = () => {
    if (sigCanvas.current?.isEmpty()) return;
    const data = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');
    if (data) onSave(data);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-[#050505]/95 z-[100] flex items-center justify-center p-4 flex-col gap-6 font-sans overflow-hidden"
    >
      <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />
      <div className="scanline" />

      <div className="w-full max-w-xl relative z-10">
        <div className="flex flex-col items-center mb-10">
          <h3 className="text-2xl font-black text-white uppercase tracking-[0.3em] text-center">Protocolo de Confirmação</h3>
          <p className="text-cyan-500 font-mono text-[9px] uppercase tracking-[0.4em] mt-2 font-bold">Captura de Assinatura Biométrica Digital</p>
        </div>
        
        <div className="glass-panel p-2 overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.1)] border-white/20">
          <div className="bg-white rounded-2xl overflow-hidden">
            <SignatureCanvas 
              ref={sigCanvas}
              penColor="black"
              canvasProps={{
                className: "w-full h-80 bg-white cursor-crosshair"
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full max-w-xl relative z-10">
        <button 
          onClick={clear}
          className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest transition-all text-xs"
        >
          <Trash2 className="w-4 h-4 text-cyan-500" /> Limpar
        </button>
        <button 
          onClick={save}
          className={`flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all text-xs`}
        >
          <CheckCircle className="w-4 h-4" /> Confirmar
        </button>
      </div>

      <button 
        onClick={onClose}
        className="mt-8 text-white/20 hover:text-white uppercase tracking-[0.5em] font-black text-[9px] transition-all relative z-10 px-4 py-2 border border-transparent hover:border-white/10 rounded-lg"
      >
        Abortar Operação
      </button>
    </motion.div>
  );
};
