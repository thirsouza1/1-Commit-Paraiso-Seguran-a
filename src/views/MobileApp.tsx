import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, 
  MapPin, 
  Camera, 
  PenTool, 
  CheckCircle2, 
  Navigation,
  Clock,
  LogOut,
  User as UserIcon,
  Bell,
  ChevronRight,
  AlertCircle,
  Zap,
  Map as MapIcon,
  Route as RouteIcon,
  Home,
  LayoutGrid
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useStore } from '../store/useStore';
import { TacticalMap } from '../components/TacticalMap';
import { optimizeRoute } from '../services/mapsService';

export const MobileApp: React.FC = () => {
  const { profile } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedOS, setSelectedOS] = useState<any | null>(null);
  const [optimizedPath, setOptimizedPath] = useState<{ polyline: string, stops: any[] } | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    if (!profile?.uid) return;
    const q = query(collection(db, 'service_orders'), where('techId', '==', profile.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsInitialLoading(false);
    }, (error) => {
      console.warn("Firestore connectivity warning:", error);
      setIsInitialLoading(false);
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
      className="bg-white/[0.03] border border-white/10 p-5 rounded-3xl mb-4 flex items-center gap-5 active:bg-cyan-500/10 active:border-cyan-500/40 transition-all backdrop-blur-2xl relative overflow-hidden group shadow-lg"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.02] to-transparent opacity-0 group-active:opacity-100 transition-opacity" />
      
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl border relative z-10 ${
        os.priority === 'high' 
          ? 'bg-red-500/10 text-red-500 border-red-500/20' 
          : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
      }`}>
        <ClipboardList className="w-7 h-7" />
        {os.priority === 'high' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
        )}
      </div>

      <div className="flex-1 overflow-hidden relative z-10">
        <div className="flex justify-between items-center mb-1.5">
           <span className="text-[9px] font-black text-cyan-500/50 uppercase tracking-[0.2em] font-mono">OS.{os.id.slice(0, 8).toUpperCase()}</span>
           <div className="flex items-center gap-2">
               <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-[0.2em] border shadow-sm ${
                os.status === 'pending' || os.status === 'pendente' 
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-amber-500/20' 
                  : 'bg-green-500/20 text-green-400 border-green-500/40 shadow-green-500/20'
              }`}>
                {os.status === 'pending' ? 'Pendente' : os.status}
              </span>
           </div>
        </div>
        <h4 className="text-white font-black text-base truncate tracking-tight uppercase group-hover:text-cyan-400 transition-colors">{os.clientName || 'Cliente Indefinido'}</h4>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg border border-white/10">
            <MapPin className="w-3 h-3 text-cyan-400" />
            <p className="text-white text-[9px] font-black uppercase tracking-tighter truncate max-w-[120px]">
              {os.address.split(',')[0]}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg border border-white/10">
            <Clock className="w-3 h-3 text-cyan-400" />
            <p className="text-white text-[9px] font-black uppercase tracking-tighter">
              10:30
            </p>
          </div>
        </div>
      </div>
      
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-cyan-500 group-hover:text-black transition-all">
        <ChevronRight className="w-5 h-5" />
      </div>
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
      <header className="p-6 flex justify-between items-center bg-black/60 border-b border-white/20 backdrop-blur-xl shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] p-1">
             <img src="/logo_cliente.png" alt="Paraíso Segurança" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-tight leading-none text-white">{profile?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
               <p className="text-cyan-400 font-mono text-[9px] uppercase tracking-widest font-black">Operacional Ativo</p>
            </div>
          </div>
        </div>
        <button className="relative p-2.5 bg-white/10 rounded-xl border border-white/20 active:scale-90 transition-transform backdrop-blur-md">
           <Bell className="w-5 h-5 text-white/80" />
           <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_#06b6d4]" />
        </button>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-5 pb-28 touch-pan-y z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 pb-6"
            >
              <div className="mb-6 px-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-white leading-none">Comando</h3>
                    <p className="text-[10px] text-cyan-400 font-mono uppercase tracking-[0.4em] mt-1 font-black">Centro de Operações Táticas</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <LayoutGrid className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
              </div>

              {/* Bento Grid Menu */}
              <div className="grid grid-cols-2 gap-4 px-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('maps')}
                  className="bg-white/5 border border-cyan-500/50 p-6 rounded-[2.5rem] flex flex-col items-center gap-4 backdrop-blur-2xl relative group overflow-hidden h-40 justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-14 h-14 bg-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-500/40 relative z-10">
                    <MapIcon className="w-7 h-7" />
                  </div>
                  <div className="text-center relative z-10">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Mapa Tático</span>
                    <p className="text-[8px] text-cyan-400 uppercase mt-1 tracking-widest font-black">Rotas em Tempo Real</p>
                  </div>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('active')}
                  className="bg-white/5 border border-cyan-500/50 p-6 rounded-[2.5rem] flex flex-col items-center gap-4 backdrop-blur-2xl relative group overflow-hidden h-40 justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-14 h-14 bg-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-500/40 relative z-10">
                    <Zap className="w-7 h-7" />
                  </div>
                  <div className="text-center relative z-10">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Ações Ativas</span>
                    <p className="text-[8px] text-cyan-400 uppercase mt-1 tracking-widest font-black">Intervenção Rápida</p>
                  </div>
                </motion.button>
              </div>

              {/* Integrated Agenda Module */}
              <div className="pt-8 border-t border-white/5">
                <div className="flex justify-between items-end mb-8 px-2">
                  <div>
                    <h4 className="text-2xl font-black uppercase tracking-tight text-white leading-none">Minha Agenda</h4>
                    <p className="text-[10px] text-cyan-400 font-mono uppercase tracking-[0.4em] font-black mt-2">Protocolos Estratégicos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-white leading-none drop-shadow-[0_0_15px_rgba(34,211,238,0.7)]">{orders.filter(o => o.status !== 'finished').length}</p>
                    <p className="text-[9px] text-cyan-400 font-extrabold uppercase tracking-tighter mt-1">Ativos</p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center py-12 relative mb-10 overflow-hidden rounded-[3rem] bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5">
                  <div className="absolute inset-0 bg-cyan-500/5 blur-[80px] pointer-events-none" />
                  <div className="absolute w-56 h-56 border border-cyan-500/10 rounded-full pointer-events-none" />
                  <div className="absolute w-44 h-44 border border-cyan-500/10 rounded-full pointer-events-none animate-pulse" />
                  
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.3)] p-4 overflow-hidden border-4 border-cyan-500/20 relative z-10"
                  >
                    <img src="/logo_one.png" alt="Paraíso ONE" className="w-full h-full object-contain" />
                  </motion.div>
                  
                  <div className="mt-6 text-center relative z-10">
                    <p className="text-white font-black tracking-[0.6em] uppercase text-[10px] mb-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">Sincronizando nós táticos</p>
                    <div className="flex items-center justify-center gap-1">
                       {[...Array(3)].map((_, i) => (
                         <motion.div 
                           key={i}
                           animate={{ opacity: [0.4, 1, 0.4] }}
                           transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                           className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.7)]"
                         />
                       ))}
                    </div>
                  </div>
                </div>

                {isInitialLoading ? (
                   <div className="py-12 flex flex-col items-center justify-center gap-4">
                      <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin shadow-[0_0_20px_rgba(6,182,212,0.4)]" />
                      <p className="text-[10px] font-black text-cyan-300 uppercase tracking-[0.4em] animate-pulse">Estabelecendo Conexão Segura</p>
                   </div>
                ) : orders.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center opacity-40 text-center px-10 border border-dashed border-cyan-500/30 rounded-[2.5rem] bg-cyan-500/5">
                    <AlertCircle className="w-10 h-10 mb-4 text-cyan-500" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Nenhuma Ordem de Serviço Detectada</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(os => <OSCard key={os.id} os={os} />)}
                  </div>
                )}
              </div>

              {/* System Diagnostics Module */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 p-6 rounded-[2.5rem] backdrop-blur-md relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Integridade do Sistema</h4>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Base de Dados</p>
                    <p className="text-xs font-black text-white">Sincronizado</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Conectividade</p>
                    <p className="text-xs font-black text-green-500 uppercase">Estável</p>
                  </div>
                </div>

                <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '94%' }}
                    transition={{ duration: 1.5 }}
                    className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"
                   />
                </div>
              </div>
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
                  onClick={() => setActiveTab('home')}
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
                     <button className="bg-white/10 border border-white/20 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 active:bg-cyan-500/30 active:border-cyan-500/60 transition-all backdrop-blur-xl shadow-lg">
                        <Navigation className="w-6 h-6 text-cyan-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">GPS Rota</span>
                     </button>
                     <button className="bg-white/10 border border-white/20 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 active:bg-cyan-500/30 active:border-cyan-500/60 transition-all backdrop-blur-xl shadow-lg">
                        <Clock className="w-6 h-6 text-cyan-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Chegada</span>
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
                              <span className="text-[11px] font-black uppercase tracking-widest text-white">{item.label}</span>
                           </div>
                           <span className="text-[9px] font-black text-cyan-400 uppercase tracking-tighter bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{item.status}</span>
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
      <nav className="h-20 bg-black/90 backdrop-blur-2xl border-t border-white/20 flex items-center justify-around px-4 shrink-0 relative z-20">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'home' ? 'text-cyan-400' : 'text-white/40'}`}
        >
          <div className={`w-1 h-1 rounded-full bg-cyan-400 mb-1 absolute top-0 transition-opacity ${activeTab === 'home' ? 'opacity-100' : 'opacity-0'}`} />
          <Home className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Início</span>
        </button>
        <button 
          onClick={() => setActiveTab('active')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'active' ? 'text-cyan-400' : 'text-white/40'}`}
        >
          <div className={`w-1 h-1 rounded-full bg-cyan-400 mb-1 absolute top-0 transition-opacity ${activeTab === 'active' ? 'opacity-100' : 'opacity-0'}`} />
          <Zap className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Ativos</span>
        </button>
        <button 
          onClick={() => setActiveTab('maps')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'maps' ? 'text-cyan-400' : 'text-white/40'}`}
        >
          <div className={`w-1 h-1 rounded-full bg-cyan-400 mb-1 absolute top-0 transition-opacity ${activeTab === 'maps' ? 'opacity-100' : 'opacity-0'}`} />
          <MapIcon className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Mapa</span>
        </button>
        <button 
          onClick={() => auth.signOut()}
          className="flex flex-col items-center gap-1.5 text-white/40 active:text-red-500"
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
