import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';

let geocoder: google.maps.Geocoder | null = null;

export const initMaps = async () => {
  if (!API_KEY) return;
  
  setOptions({
    key: API_KEY,
    v: 'weekly',
  });
  
  try {
    const { Geocoder } = await importLibrary('geocoding') as google.maps.GeocodingLibrary;
    geocoder = new Geocoder();
    return window.google;
  } catch (error) {
    console.error('Failed to initialize Google Maps:', error);
    return null;
  }
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
 * Uses the Routes SDK (V2 via computeRoutes)
 */
export const optimizeRoute = async (
  origin: google.maps.LatLngLiteral,
  stops: RouteStop[]
): Promise<OptimizedRoute | null> => {
  if (!API_KEY) return null;

  try {
    const { Route } = await importLibrary('routes') as google.maps.RoutesLibrary;
    const { encoding } = await importLibrary('geometry') as google.maps.GeometryLibrary;

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

    const destination = validStops[validStops.length - 1].location;
    const intermediateWaypoints = validStops.slice(0, -1).map(s => 
      new google.maps.LatLng(s.location.lat, s.location.lng)
    );

    const request: any = {
      origin: new google.maps.LatLng(origin.lat, origin.lng),
      destination: new google.maps.LatLng(destination.lat, destination.lng),
      intermediates: intermediateWaypoints,
      travelMode: 'DRIVE',
      routingPreference: 'TRAFFIC_AWARE_OPTIMAL',
      optimizeWaypointOrder: true,
      fields: ['routes.durationMillis', 'routes.distanceMeters', 'routes.polyline.encodedPolyline', 'routes.optimizedIntermediateWaypointIndices']
    };

    const { routes } = await Route.computeRoutes(request);
    
    if (!routes || routes.length === 0) return null;

    const route = routes[0] as any;
    
    // Reorder stops based on optimizedIntermediateWaypointIndices if present
    let orderedStops = [...validStops];
    if (route.optimizedIntermediateWaypointIndices && route.optimizedIntermediateWaypointIndices.length > 0) {
      const order = route.optimizedIntermediateWaypointIndices;
      const optimizedIntermediates = order.map((idx: number) => validStops[idx]);
      orderedStops = [...optimizedIntermediates, validStops[validStops.length - 1]];
    }

    return {
      stops: orderedStops,
      polyline: route.polyline?.encodedPolyline || '',
      duration: `${(route.durationMillis || 0) / 1000}s`,
      distance: route.distanceMeters || 0
    };
  } catch (error) {
    console.error('Route optimization error:', error);
    return null;
  }
};
