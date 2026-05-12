import { Loader } from '@googlemaps/js-api-loader';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';

let geocoder: google.maps.Geocoder | null = null;

export const initMaps = async () => {
  if (!API_KEY) return;
  const loader = new Loader({
    apiKey: API_KEY,
    version: 'weekly',
  });
  
  await (loader as any).load();
  geocoder = new google.maps.Geocoder();
  return window.google;
};

export const geocodeAddress = async (address: string): Promise<google.maps.LatLngLiteral | null> => {
  if (!geocoder) await initMaps();
  if (!geocoder) return null;

  try {
    const response = await geocoder.geocode({ address });
    if (response.results[0]) {
      const { lat, lng } = response.results[0].geometry.location;
      return { lat: lat(), lng: lng() };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

export interface RouteStop {
  id: string;
  address: string;
  location?: google.maps.LatLngLiteral;
}

export interface OptimizedRoute {
  stops: RouteStop[];
  polyline: string;
  duration: string;
  distance: number;
}

/**
 * Optimizes a list of stops starting from a given origin.
 * Uses the Routes API (V2 via computeRoutes)
 * Note: Waypoint optimization is a premium feature.
 */
export const optimizeRoute = async (
  origin: google.maps.LatLngLiteral,
  stops: RouteStop[]
): Promise<OptimizedRoute | null> => {
  if (!API_KEY) return null;

  try {
    // 1. Geocode all addresses that don't have locations
    const stopsWithCoords = await Promise.all(
      stops.map(async (stop) => {
        if (stop.location) return stop;
        const coords = await geocodeAddress(stop.address);
        return { ...stop, location: coords || undefined };
      })
    );

    const validStops = stopsWithCoords.filter((s) => s.location) as (RouteStop & { location: google.maps.LatLngLiteral })[];
    if (validStops.length === 0) return null;

    // For simplicity in this demo, we'll use the last stop as the destination
    // and intermediates as everything in between.
    // Real optimization (TSP) often requires optimizeWaypointOrder=true
    
    const destination = validStops[validStops.length - 1].location;
    const intermediates = validStops.slice(0, -1).map(s => ({
      location: { latLng: { latitude: s.location.lat, longitude: s.location.lng } }
    }));

    const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.optimizedWaypointOrder'
      },
      body: JSON.stringify({
        origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
        destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
        intermediates,
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE',
        optimizeWaypointOrder: true
      })
    });

    const data = await response.json();
    if (!data.routes || data.routes.length === 0) return null;

    const route = data.routes[0];
    
    // Reorder stops based on optimizedWaypointOrder if present
    let orderedStops = [...validStops];
    if (route.optimizedWaypointOrder) {
      const order = route.optimizedWaypointOrder; // Array of indices for intermediates
      const optimizedIntermediates = order.map((idx: number) => validStops[idx]);
      orderedStops = [...optimizedIntermediates, validStops[validStops.length - 1]];
    }

    return {
      stops: orderedStops,
      polyline: route.polyline.encodedPolyline,
      duration: route.duration,
      distance: route.distanceMeters
    };
  } catch (error) {
    console.error('Route optimization error:', error);
    return null;
  }
};
