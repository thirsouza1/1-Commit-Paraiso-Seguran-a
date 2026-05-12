import React, { useEffect, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle } from 'lucide-react';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';

interface TacticalMapProps {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  markers?: Array<{
    id: string;
    position: google.maps.LatLngLiteral;
    title: string;
    type: 'tech' | 'os';
  }>;
  polyline?: string;
  className?: string;
}

const RoutePolyline: React.FC<{ encodedPath?: string }> = ({ encodedPath }) => {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || !routesLib || !encodedPath) {
      if (polyline) polyline.setMap(null);
      return;
    }

    const path = google.maps.geometry.encoding.decodePath(encodedPath);
    const newPolyline = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: '#06b6d4',
      strokeOpacity: 0.8,
      strokeWeight: 4,
    });

    newPolyline.setMap(map);
    setPolyline(newPolyline);

    // Fit bounds to polyline
    const bounds = new google.maps.LatLngBounds();
    path.forEach(p => bounds.extend(p));
    map.fitBounds(bounds, 50);

    return () => {
      newPolyline.setMap(null);
    };
  }, [map, routesLib, encodedPath]);

  return null;
};

export const TacticalMap: React.FC<TacticalMapProps> = ({ 
  center = { lat: -15.6014, lng: -56.0979 }, // Cuiabá
  zoom = 13,
  markers = [],
  polyline,
  className
}) => {
  if (!API_KEY) {
    return (
      <div className={`flex flex-col items-center justify-center bg-zinc-900/50 rounded-3xl border border-dashed border-white/10 ${className}`}>
        <AlertCircle className="w-12 h-12 text-cyan-500 mb-4 animate-pulse" />
        <h2 className="text-white font-bold mb-2 uppercase tracking-widest text-sm">Chave de API Necessária</h2>
        <p className="text-white/40 text-[10px] text-center max-w-xs px-6 uppercase tracking-tighter leading-loose">
          Configure a chave <span className="text-cyan-500">GOOGLE_MAPS_PLATFORM_KEY</span> nos segredos do sistema para ativar a inteligência geoespacial.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl ${className}`}>
      <APIProvider apiKey={API_KEY} version="weekly" libraries={['geometry', 'routes']}>
        <Map
          defaultCenter={center}
          defaultZoom={zoom}
          mapId="99e7c53d9c57d8f4" // A refined dark map ID or generic
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          style={{ width: '100%', height: '100%' }}
        >
          {markers.map((m) => (
            <AdvancedMarker key={m.id} position={m.position} title={m.title}>
              {m.type === 'tech' ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping scale-150" />
                  <Pin background="#06b6d4" glyphColor="#000" borderColor="#000" scale={1.2}>
                    <div className="text-[10px] font-black text-black">T</div>
                  </Pin>
                </div>
              ) : (
                <Pin background="#ef4444" glyphColor="#fff" borderColor="#000" scale={0.8} />
              )}
            </AdvancedMarker>
          ))}
          
          <RoutePolyline encodedPath={polyline} />
        </Map>
      </APIProvider>

      {/* Map Overlays */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-[9px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
           Live Ops Map
        </div>
      </div>
    </div>
  );
};
