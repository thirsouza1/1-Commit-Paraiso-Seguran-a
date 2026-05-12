import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  Map as MapIcon, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  Bell,
  Search,
  User as UserIcon,
  ShieldCheck,
  Zap,
  Activity,
  Navigation,
  Clock,
  Route as RouteIcon
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { useStore } from '../store/useStore';
import { TacticalMap } from '../components/TacticalMap';
import { optimizeRoute, RouteStop } from '../services/mapsService';

// Components (Stubs for now)
const DashboardOverview = () => {
  const [optimizedRoute, setOptimizedRoute] = useState<{ polyline: string, stops: any[] } | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimizeTest = async () => {
    setIsOptimizing(true);
    const mockOrigin = { lat: -15.6014, lng: -56.0979 };
    const mockStops: RouteStop[] = [
      { id: '1', address: 'Av. Hist. Rubens de Mendonça, 1000, Cuiabá' },
      { id: '2', address: 'Av. Fernando Corrêa da Costa, 2000, Cuiabá' },
      { id: '3', address: 'Rua Barão de Melgaço, 3000, Cuiabá' },
    ];

    const result = await optimizeRoute(mockOrigin, mockStops);
    if (result) {
      setOptimizedRoute({ polyline: result.polyline, stops: result.stops });
    }
    setIsOptimizing(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Centro de Operações</h2>
          <p className="text-cyan-400 font-mono text-[10px] uppercase tracking-[0.3em] mt-1 font-bold">Live Tactical Ops Intelligence</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleOptimizeTest}
            disabled={isOptimizing}
            className="bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-xl flex items-center gap-3 backdrop-blur-md hover:bg-cyan-500/20 transition-all disabled:opacity-50"
          >
            <RouteIcon className={`w-4 h-4 text-cyan-500 ${isOptimizing ? 'animate-spin' : ''}`} />
            <span className="text-cyan-500 font-mono text-[10px] font-bold uppercase">
              {isOptimizing ? 'Otimizando...' : 'Simular Rota Inteligente'}
            </span>
          </button>
          <div className="bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-xl flex items-center gap-3 backdrop-blur-md">
            <Activity className="w-4 h-4 text-cyan-500 animate-pulse" />
            <span className="text-cyan-500 font-mono text-[10px] font-bold uppercase">Sistema Online</span>
          </div>
        </div>
      </header>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: 'OS EM ANDAMENTO', value: '14', trend: '+12%', icon: Zap },
        { label: 'TÉCNICOS ONLINE', value: '08', trend: '92%', icon: Users },
        { label: 'SLA OPERACIONAL', value: '98.5', trend: '+0.4%', icon: ShieldCheck },
        { label: 'CHAMADOS HOJE', value: '42', trend: '+5', icon: FileText },
      ].map((card, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-panel p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-all cursor-pointer"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
            <card.icon className="w-16 h-16 text-cyan-500" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">{card.label}</span>
            <span className="text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded text-[9px] font-bold border border-cyan-500/20">{card.trend}</span>
          </div>
          <div className="text-4xl font-black text-white">{card.value}</div>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '70%' }}
                className="h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Real Tactical Map */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 h-[500px] relative group">
        <TacticalMap 
          className="w-full h-full"
          polyline={optimizedRoute?.polyline}
          markers={[
            { id: 'tech-1', position: { lat: -15.6014, lng: -56.0979 }, title: 'Técnico Sandro', type: 'tech' },
            ...(optimizedRoute?.stops.map(s => ({
              id: s.id,
              position: s.location,
              title: s.address,
              type: 'os' as const
            })) || [])
          ]}
        />

        {/* Telemetry Overlay */}
        <div className="absolute bottom-6 left-6 p-4 bg-black/80 border border-white/10 rounded-xl w-64 backdrop-blur-xl z-20">
           <div className="flex justify-between items-start mb-2">
             <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">Status Rede Ops</h3>
             <span className="text-[10px] text-white/40 font-mono">MAP-INTEL v2.0</span>
           </div>
           <div className="space-y-2">
             <div className="flex justify-between text-[9px] uppercase font-mono tracking-tighter">
               <span className="text-white/60">Tráfego Tempo Real</span>
               <span className="text-green-400">ATIVO</span>
             </div>
             <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
               <div className="w-full h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
             </div>
           </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] px-1">Inteligência Operacional</h3>
        <div className="bg-black/40 border border-white/10 rounded-2xl p-4 h-32 flex flex-col justify-between mb-4">
           <div>
             <p className="text-3xl font-light text-white tracking-tighter">94.2<span className="text-sm text-cyan-400 ml-1">%</span></p>
             <p className="text-[10px] uppercase text-white/30 tracking-widest">SLA Efficiency</p>
           </div>
           <div className="h-12 flex items-end gap-1 px-2">
             {[40, 70, 30, 90, 60, 80, 50].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  className={`w-full bg-cyan-500/20 border-t ${h > 80 ? 'bg-cyan-500/40 border-cyan-400' : 'border-cyan-400/50'}`}
                />
             ))}
           </div>
        </div>

        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] px-1">Alertas de Segurança</h3>
        <div className="space-y-3">
          {[
            { msg: 'OS #921 Atrasada', detail: 'Técnico em deslocamento > 45min', color: 'bg-red-500', shadow: 'shadow-[0_0_10px_#ef4444]' },
            { msg: 'Bateria Crítica', detail: 'Mobile de João Paulo (12%)', color: 'bg-yellow-500', shadow: 'shadow-[0_0_10px_#eab308]' },
            { msg: 'Manutenção OK', detail: 'Condomínio Solar das Águas', color: 'bg-cyan-500', shadow: 'shadow-[0_0_10px_#06b6d4]' },
          ].map((alert, i) => (
            <motion.div 
              key={i}
              whileHover={{ x: 4 }}
              className="flex gap-4 p-4 bg-white/5 border border-white/5 rounded-xl transition-all"
            >
              <div className={`w-1 h-8 ${alert.color} rounded-full ${alert.shadow}`} />
              <div>
                <p className="text-[11px] font-bold text-white uppercase tracking-tight">{alert.msg}</p>
                <p className="text-[9px] text-white/40">{alert.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
};

export const AdminDesk: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { profile } = useStore();

  const menuItems = [
    { id: 'dashboard', label: 'Painel de Controle', icon: LayoutDashboard },
    { id: 'orders', label: 'Mobile Ops', icon: FileText },
    { id: 'technicians', label: 'Equipe', icon: Users },
    { id: 'maps', label: 'Maps', icon: MapIcon },
    { id: 'analytics', label: 'BI Analytics', icon: BarChart3 },
    { id: 'settings', label: 'AI Control', icon: Zap },
  ];

  return (
    <div className="h-screen bg-[#050505] text-[#e0e0e0] flex overflow-hidden selection:bg-cyan-500/30 font-sans relative">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900 rounded-full blur-[150px] opacity-10 pointer-events-none" />
      <div className="scanline" />

      {/* Sidebar */}
      <aside className="w-72 bg-black/40 border-r border-white/10 flex flex-col p-6 relative z-10 backdrop-blur-xl">
        <div className="mb-12 flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.3)] mb-4 p-2 overflow-hidden">
             <img src="/logo_one.png" alt="Paraíso ONE" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl font-bold tracking-tighter text-white uppercase">Paraíso <span className="text-cyan-500">One</span></h1>
          <p className="text-[8px] uppercase tracking-[0.4em] text-cyan-400/60 mt-1 font-black">Tactical Operations</p>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-[10px] font-black uppercase transition-all relative overflow-hidden group tracking-widest ${
                activeTab === item.id 
                ? 'text-white' 
                : 'text-white/30 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              {activeTab === item.id && (
                <motion.div layoutId="nav-bg" className="absolute inset-0 bg-cyan-600 shadow-[0_0_20px_rgba(6,182,212,0.3)]" />
              )}
              <item.icon className={`w-4 h-4 relative z-10 ${activeTab === item.id ? 'text-white' : 'text-white/20'}`} />
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-lg">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-black text-cyan-500 border border-white shadow-[0_0_15px_rgba(255,255,255,0.1)] overflow-hidden p-1">
              <img src="/logo_cliente.png" alt="Cliente" className="w-full h-full object-contain" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-white uppercase truncate tracking-wide">{profile?.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                 <p className="text-[8px] text-white/40 font-mono uppercase tracking-widest">Administrador</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => auth.signOut()}
            className="w-full flex items-center gap-4 px-4 py-3 text-white/30 hover:text-red-500 hover:bg-red-500/5 rounded-xl text-[10px] font-black transition-all uppercase tracking-[0.2em]"
          >
            <LogOut className="w-4 h-4" />
            Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Top Navbar */}
        <header className="h-20 bg-black/40 backdrop-blur-xl border-b border-white/10 px-8 flex items-center justify-between">
          <nav className="flex gap-8">
             {['Overview', 'Performance', 'Logística', 'Logs'].map(tab => (
                <button key={tab} className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${tab === 'Overview' ? 'text-cyan-400' : 'text-white/30 hover:text-white'}`}>
                   {tab}
                </button>
             ))}
          </nav>
          
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
               <span className="text-[8px] text-white/30 uppercase font-mono tracking-widest">Network Latency</span>
               <span className="text-[10px] text-green-400 font-mono font-bold tracking-tighter">14ms • <span className="text-white/20">Synced</span></span>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <button className="relative group">
              <Bell className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_#06b6d4]" />
            </button>
          </div>
        </header>

        {/* Dynamic Section */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dashboard' && <DashboardOverview />}
              {activeTab !== 'dashboard' && (
                <div className="h-96 flex flex-col items-center justify-center border border-dashed border-white/5 bg-black/20 rounded-3xl opacity-40">
                    <Zap className="w-12 h-12 mb-4 text-cyan-500" />
                    <p className="uppercase font-black text-xs tracking-[0.5em] text-white">Módulo em Expansão Analítica</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer developed credit */}
          <footer className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center opacity-70">
             <div className="flex items-center gap-4">
                <div className="w-14 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center p-1">
                   <img src="/logo_pixelynx.png" alt="Pixelynx" className="w-full h-full object-contain" />
                </div>
                <span className="text-[8px] uppercase tracking-[0.4em] text-white/60">Powered by Pixelynx</span>
             </div>
             <p className="text-[8px] uppercase tracking-[0.4em] text-white/40">© 2026 Paraíso Segurança • v1.4.2 Production Ready</p>
          </footer>
        </div>
      </main>
    </div>
  );
};
