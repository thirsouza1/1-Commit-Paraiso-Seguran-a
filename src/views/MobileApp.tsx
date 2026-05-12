import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, 
  MapPin, 
  Camera, 
  PenTool, 
  CheckCircle2, 
  ArrowRight,
  Navigation,
  Clock,
  LogOut,
  User as UserIcon,
  Bell,
  ChevronRight,
  AlertCircle,
  Zap,
  Map as MapIcon,
  Route as RouteIcon
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useStore } from '../store/useStore';
import { TacticalMap } from '../components/TacticalMap';
import { optimizeRoute } from '../services/mapsService';

export const MobileApp: React.FC = () => {
  const { profile } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('agenda');
  const [selectedOS, setSelectedOS] = useState<any | null>(null);
  const [optimizedPath, setOptimizedPath] = useState<{ polyline: string, stops: any[] } | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    if (!profile?.uid) return;
    const q = query(collection(db, 'service_orders'), where('techId', '==', profile.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [profile?.uid]);

  const handleSmartRoute = async () => {
    if (orders.length === 0) return;
    setIsOptimizing(true);
    // Mock tech location at Cuiabá Center for this demo
    const techLoc = { lat: -15.6014, lng: -56.0979 };
    const stops = orders.filter(o => o.status !== 'finished').map(o => ({
      id: o.id,
      address: o.address
    }));

    const result = await optimizeRoute(techLoc, stops);
    if (result) {
      setOptimizedPath({ polyline: result.polyline, stops: result.stops });
      setActiveTab('maps');
    }
    setIsOptimizing(false);
  };

  const OSCard = ({ os }: { os: any }) => (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        setSelectedOS(os);
        setActiveTab('active');
      }}
      className="bg-black/40 border border-white/5 p-4 rounded-2xl mb-3 flex items-center gap-4 active:bg-cyan-500/10 active:border-cyan-500/30 transition-all backdrop-blur-md"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
        os.priority === 'high' ? 'bg-red-500/20 text-red-500' : 'bg-cyan-500/20 text-cyan-500'
      }`}>
        <ClipboardList className="w-6 h-6" />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-start">
           <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{os.id.slice(0, 8)}</span>
           <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-bold uppercase border border-cyan-500/20">{os.status}</span>
        </div>
        <h4 className="text-white font-bold text-sm truncate mt-1">{os.clientName || 'Cliente Indefinido'}</h4>
        <p className="text-white/40 text-[10px] truncate flex items-center gap-1 mt-1 font-mono uppercase tracking-tighter">
          <MapPin className="w-3 h-3 shrink-0 text-cyan-500" /> {os.address}
        </p>
      </div>
      <ChevronRight className="w-5 h-5 text-white/10" />
    </motion.div>
  );

  return (
    <div className="h-screen bg-[#050505] text-[#e0e0e0] flex flex-col font-sans overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[120px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900 rounded-full blur-[150px] opacity-10 pointer-events-none" />
      <div className="tech-grid absolute inset-0 opacity-20 pointer-events-none" />
      <div className="scanline" />

      {/* Header */}
      <header className="p-6 flex justify-between items-center bg-black/40 border-b border-white/10 backdrop-blur-xl shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-cyan-500 font-black overflow-hidden relative border border-cyan-500/20">
             {profile?.photoURL ? <img src={profile.photoURL} alt="Me" className="w-full h-full object-cover" /> : profile?.name?.charAt(0)}
             <div className="absolute inset-0 ring-1 ring-cyan-500/50 rounded-lg animate-pulse pointer-events-none" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-tight leading-none text-white">{profile?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
               <p className="text-cyan-400 font-mono text-[9px] uppercase tracking-widest font-bold">Operacional Ativo</p>
            </div>
          </div>
        </div>
        <button className="relative p-2.5 bg-white/5 rounded-xl border border-white/10 active:scale-90 transition-transform backdrop-blur-md">
           <Bell className="w-5 h-5 text-white/50" />
           <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_#06b6d4]" />
        </button>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-5 pb-28 touch-pan-y z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'agenda' && (
            <motion.div
              key="agenda"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
            >
              <div className="flex justify-between items-end mb-6 px-1">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Minha Agenda</h3>
                  <p className="text-[10px] text-cyan-400/60 font-mono uppercase tracking-[0.3em] mt-1 font-bold">Estratégia Técnica de Campo</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <button 
                     onClick={handleSmartRoute}
                     disabled={isOptimizing || orders.length === 0}
                     className="bg-cyan-500/20 border border-cyan-500/40 p-2 rounded-lg text-cyan-400 active:scale-95 transition-all disabled:opacity-30"
                   >
                     <RouteIcon className={`w-5 h-5 ${isOptimizing ? 'animate-spin' : ''}`} />
                   </button>
                   <div className="text-right">
                      <p className="text-[10px] text-white/40 font-mono uppercase tracking-tighter">Pendentes</p>
                      <p className="text-2xl font-black text-cyan-500 leading-none">{orders.filter(o => o.status !== 'finished').length}</p>
                   </div>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center opacity-20 text-center px-8 border border-dashed border-white/10 rounded-3xl">
                  <AlertCircle className="w-12 h-12 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]">Protocolo Vazio</p>
                </div>
              ) : (
                orders.map(os => <OSCard key={os.id} os={os} />)
              )}
            </motion.div>
          )}

          {activeTab === 'active' && selectedOS && (
             <motion.div
               key="active"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="h-full flex flex-col"
             >
                <button 
                  onClick={() => setActiveTab('agenda')}
                  className="mb-6 flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" /> Voltar para lista
                </button>

                <div className="glass-panel p-6 relative overflow-hidden mb-6">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                  
                  <div className="flex justify-between items-start mb-6">
                     <span className="bg-cyan-600 text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest leading-none shadow-lg">OS em Execução</span>
                     <span className="text-[10px] font-mono text-white/20">ID.{selectedOS.id.slice(0, 12)}</span>
                  </div>

                  <h3 className="text-2xl font-black text-white uppercase leading-tight mb-2">{selectedOS.clientName}</h3>
                  <p className="text-white/40 text-[11px] font-mono mb-8 uppercase flex items-center gap-2 tracking-tighter">
                    <MapPin className="w-4 h-4 text-cyan-500" /> {selectedOS.address}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                     <button className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 active:bg-cyan-500/20 active:border-cyan-500/50 transition-all backdrop-blur-md">
                        <Navigation className="w-6 h-6 text-cyan-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">GPS Rota</span>
                     </button>
                     <button className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 active:bg-cyan-500/20 active:border-cyan-500/50 transition-all backdrop-blur-md">
                        <Clock className="w-6 h-6 text-cyan-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">Arrivo</span>
                     </button>
                  </div>
                </div>

                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] px-2">Fluxo de Validação</h4>
                   <div className="grid grid-cols-1 gap-3">
                      {[
                        { label: 'Checklist Técnico', icon: ClipboardList, status: 'Pendente' },
                        { label: 'Evidências (0/4)', icon: Camera, status: 'Obrigatório' },
                        { label: 'Assinatura', icon: PenTool, status: 'Touch Link' }
                      ].map((item, i) => (
                        <div key={i} className="bg-black/20 border border-white/5 rounded-2xl p-4 flex justify-between items-center backdrop-blur-sm">
                           <div className="flex items-center gap-4">
                              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                                <item.icon className="w-4 h-4 text-cyan-500/60" />
                              </div>
                              <span className="text-[11px] font-bold uppercase tracking-widest text-white/80">{item.label}</span>
                           </div>
                           <span className="text-[9px] font-black text-cyan-500/40 uppercase tracking-tighter">{item.status}</span>
                        </div>
                      ))}
                   </div>
                   <button className="w-full bg-cyan-600 font-black py-5 rounded-2xl text-white uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.3)] active:scale-95 transition-all mt-4">
                      Finalizar Operação <CheckCircle2 className="w-5 h-5" />
                   </button>
                </div>
             </motion.div>
          )}
          {activeTab === 'maps' && (
             <motion.div
               key="maps"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="h-full flex flex-col gap-4"
             >
                <div className="flex justify-between items-center px-1">
                   <div>
                     <h3 className="text-xl font-black uppercase tracking-tighter text-white">Mapa Tático</h3>
                     <p className="text-[10px] text-cyan-400/60 font-mono uppercase tracking-widest mt-1">Rota Inteligente Ativa</p>
                   </div>
                   {optimizedPath && (
                     <div className="bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg">
                        <span className="text-[10px] font-bold text-green-400 uppercase">Otimizado</span>
                     </div>
                   )}
                </div>

                <div className="flex-1 min-h-[400px]">
                  <TacticalMap 
                    className="w-full h-full"
                    polyline={optimizedPath?.polyline}
                    markers={[
                      { id: 'me', position: { lat: -15.6014, lng: -56.0979 }, title: 'Minha Posição', type: 'tech' },
                      ...(optimizedPath?.stops.map(s => ({
                        id: s.id,
                        position: s.location,
                        title: s.address,
                        type: 'os' as const
                      })) || orders.filter(o => o.status !== 'finished').map(o => ({
                        id: o.id,
                        position: { lat: 0, lng: 0 }, // fallback, handled by map markers logic usually
                        title: o.clientName,
                        type: 'os' as const
                      })))
                    ]}
                  />
                </div>

                {optimizedPath && (
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">Próxima Parada</p>
                      <div className="bg-cyan-500/10 border border-cyan-500/30 p-4 rounded-2xl flex justify-between items-center">
                         <div>
                            <p className="text-white font-bold text-sm tracking-tight">{optimizedPath.stops[0].address.split(',')[0]}</p>
                            <p className="text-white/40 text-[10px] font-mono mt-1 uppercase tracking-tighter truncate w-48">Estimado: 12 min</p>
                         </div>
                         <button className="bg-cyan-600 p-3 rounded-xl shadow-lg active:scale-90 transition-all">
                            <Navigation className="w-5 h-5 text-white" />
                         </button>
                      </div>
                   </div>
                )}
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Bar */}
      <nav className="h-20 bg-black/60 backdrop-blur-2xl border-t border-white/10 flex items-center justify-around px-4 shrink-0 relative z-20">
        <button 
          onClick={() => setActiveTab('agenda')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'agenda' ? 'text-cyan-400' : 'text-white/20'}`}
        >
          <div className={`w-1 h-1 rounded-full bg-cyan-400 mb-1 absolute top-0 transition-opacity ${activeTab === 'agenda' ? 'opacity-100' : 'opacity-0'}`} />
          <ClipboardList className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Agenda</span>
        </button>
        <button 
          onClick={() => setActiveTab('active')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'active' ? 'text-cyan-400' : 'text-white/20'}`}
        >
          <div className={`w-1 h-1 rounded-full bg-cyan-400 mb-1 absolute top-0 transition-opacity ${activeTab === 'active' ? 'opacity-100' : 'opacity-0'}`} />
          <Zap className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Ops</span>
        </button>
        <button 
          onClick={() => setActiveTab('maps')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'maps' ? 'text-cyan-400' : 'text-white/20'}`}
        >
          <div className={`w-1 h-1 rounded-full bg-cyan-400 mb-1 absolute top-0 transition-opacity ${activeTab === 'maps' ? 'opacity-100' : 'opacity-0'}`} />
          <MapIcon className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Mapa</span>
        </button>
        <button 
          onClick={() => auth.signOut()}
          className="flex flex-col items-center gap-1.5 text-white/20 active:text-red-500"
        >
          <LogOut className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Sair</span>
        </button>
      </nav>
      
      {/* Cinematic Overlays */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent pointer-events-none z-[100]" />
      <div className="fixed bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent pointer-events-none z-[100]" />
    </div>
  );
};
