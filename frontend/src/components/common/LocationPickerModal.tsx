import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, Navigation, Check, Loader2, Crosshair, MapPin, Layers, Search } from 'lucide-react';

interface LocationResult {
  streetAddress: string;
  landmark: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLocation: (location: LocationResult) => void;
  initialCoords?: { lat: number; lng: number };
}

// Custom crisp SVG marker
const customPinIcon = L.divIcon({
  className: 'custom-map-pin',
  html: `
    <div style="transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center; pointer-events: none;">
      <div style="background: #15803d; color: white; padding: 6px; border-radius: 9999px; box-shadow: 0 4px 14px rgba(0,0,0,0.4); border: 2.5px solid white; display: flex; align-items: center; justify-content: center;">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
      <div style="width: 3px; height: 12px; background: #15803d;"></div>
      <div style="width: 10px; height: 5px; background: rgba(0,0,0,0.3); border-radius: 50%;"></div>
    </div>
  `,
  iconSize: [0, 0],
  iconAnchor: [0, 0]
});

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  onConfirmLocation,
  initialCoords = { lat: 17.6155, lng: 78.0817 } // Sangareddy center default
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const streetLayerRef = useRef<L.TileLayer | null>(null);
  const satelliteLayerRef = useRef<L.TileLayer | null>(null);

  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>(initialCoords);
  const [addressDetails, setAddressDetails] = useState<LocationResult | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  // In-map search
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Reverse geocode a lat/lng coordinate
  const fetchAddressForCoords = async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=19&addressdetails=1`,
        {
          headers: { 'Accept-Language': 'en' },
          signal: controller.signal
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const a = data.address || {};

        const road = a.road || a.pedestrian || a.street || a.neighbourhood || a.residential || '';
        const houseNumber = a.house_number ? `#${a.house_number}, ` : '';
        const street = (houseNumber + road).trim() || data.name || `Location (${lat.toFixed(5)}, ${lng.toFixed(5)})`;

        const landmark = a.amenity || a.building || a.shop || a.commercial || a.historic || 'Near Point';
        const area = a.suburb || a.neighbourhood || a.residential || a.city_district || a.town || a.county || 'Sangareddy';
        const city = a.city || a.town || a.district || a.state_district || 'Sangareddy';
        const state = a.state || 'Telangana';
        const pincode = a.postcode || '502001';

        setAddressDetails({
          streetAddress: street,
          landmark,
          area,
          city,
          state,
          pincode,
          latitude: lat,
          longitude: lng,
          accuracy: accuracy || undefined
        });
      }
    } catch (err) {
      console.warn('Geocoding error:', err);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Initialize Map with 2026 Google Roadmap & Satellite Hybrid Layers
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [currentCoords.lat, currentCoords.lng],
          zoom: 16,
          zoomControl: false
        });

        // 1. Google Maps 2026 Streets / Roadmap Layer
        const streetLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          attribution: '&copy; Google Maps'
        });

        // 2. Google Maps 2026 Photorealistic Satellite Hybrid Layer (with street labels)
        const satelliteLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          attribution: '&copy; Google Maps Satellite'
        });

        streetLayer.addTo(map);
        streetLayerRef.current = streetLayer;
        satelliteLayerRef.current = satelliteLayer;

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Draggable Marker
        const marker = L.marker([currentCoords.lat, currentCoords.lng], {
          icon: customPinIcon,
          draggable: true
        }).addTo(map);

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          setCurrentCoords({ lat: pos.lat, lng: pos.lng });
          fetchAddressForCoords(pos.lat, pos.lng);
        });

        map.on('click', (e) => {
          marker.setLatLng(e.latlng);
          setCurrentCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
          fetchAddressForCoords(e.latlng.lat, e.latlng.lng);
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;

        fetchAddressForCoords(currentCoords.lat, currentCoords.lng);
      } else {
        mapInstanceRef.current.invalidateSize();
        mapInstanceRef.current.setView([currentCoords.lat, currentCoords.lng], 16);
        markerRef.current?.setLatLng([currentCoords.lat, currentCoords.lng]);
        fetchAddressForCoords(currentCoords.lat, currentCoords.lng);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Switch between Google Streets & Satellite View
  const handleToggleLayer = (type: 'streets' | 'satellite') => {
    if (!mapInstanceRef.current || !streetLayerRef.current || !satelliteLayerRef.current) return;
    setMapType(type);

    if (type === 'satellite') {
      mapInstanceRef.current.removeLayer(streetLayerRef.current);
      satelliteLayerRef.current.addTo(mapInstanceRef.current);
    } else {
      mapInstanceRef.current.removeLayer(satelliteLayerRef.current);
      streetLayerRef.current.addTo(mapInstanceRef.current);
    }
  };

  // Search inside map
  const handleSearchOnMap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const q = encodeURIComponent(`${searchQuery.trim()}, Telangana, India`);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}&addressdetails=1&limit=1`, {
        headers: { 'Accept-Language': 'en' }
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);

          setCurrentCoords({ lat, lng });

          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.flyTo([lat, lng], 17, { duration: 1.0 });
            markerRef.current.setLatLng([lat, lng]);
          }

          fetchAddressForCoords(lat, lng);
        } else {
          alert(`Could not find "${searchQuery}". Please try searching with town or landmark.`);
        }
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Snap to Live High-Accuracy Hardware GPS
  const handleSnapToLiveGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported by browser.');
      return;
    }

    setIsLocating(true);
    let bestAccuracy = Infinity;
    let watchId: number | null = null;

    const timeout = setTimeout(() => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      setIsLocating(false);
    }, 8000);

    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const acc = Math.round(pos.coords.accuracy || 100);

        if (acc < bestAccuracy) {
          bestAccuracy = acc;
          setAccuracy(acc);
          setCurrentCoords({ lat, lng });

          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.flyTo([lat, lng], 17, { duration: 0.8 });
            markerRef.current.setLatLng([lat, lng]);
          }

          fetchAddressForCoords(lat, lng);

          if (acc <= 25) {
            navigator.geolocation.clearWatch(watchId!);
            clearTimeout(timeout);
            setIsLocating(false);
          }
        }
      },
      (err) => {
        console.warn('Snap to GPS error:', err);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      }
    );
  };

  const handleConfirm = () => {
    if (addressDetails) {
      onConfirmLocation(addressDetails);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="font-extrabold text-stone-900 text-sm sm:text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Pinpoint Exact Delivery Location</span>
            </h3>
            <p className="text-[11px] text-stone-500">
              Powered by 2026 Google Maps & Satellite imagery. Drag pin to your exact building/gate.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-200 text-stone-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Area */}
        <div className="relative w-full h-[360px] sm:h-[420px] bg-stone-100">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Top In-Map Search Bar */}
          <div className="absolute top-3 left-3 right-14 z-400 max-w-sm">
            <form onSubmit={handleSearchOnMap} className="flex gap-1 shadow-lg rounded-xl overflow-hidden">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search Sangareddy, landmark, colony..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2 py-2 bg-white/95 backdrop-blur-xs border border-stone-300 rounded-l-xl text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-r-xl transition-colors cursor-pointer flex items-center gap-1"
              >
                {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Find'}
              </button>
            </form>
          </div>

          {/* Layer Switcher (Streets vs Satellite) */}
          <div className="absolute bottom-4 left-3 z-400 bg-white/95 backdrop-blur-xs p-1 rounded-xl shadow-lg border border-stone-200 flex items-center gap-1 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => handleToggleLayer('streets')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                mapType === 'streets'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🗺️ Map
            </button>
            <button
              type="button"
              onClick={() => handleToggleLayer('satellite')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                mapType === 'satellite'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🛰️ Satellite
            </button>
          </div>

          {/* Snap to Live GPS Button */}
          <button
            type="button"
            onClick={handleSnapToLiveGps}
            disabled={isLocating}
            className="absolute top-3 right-3 z-400 bg-white hover:bg-stone-50 text-stone-800 px-3 py-2 rounded-xl shadow-lg border border-stone-200 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            title="Snap to Live GPS Location"
          >
            {isLocating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span className="hidden sm:inline">Fixing GPS...</span>
              </>
            ) : (
              <>
                <Crosshair className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Locate Me</span>
              </>
            )}
          </button>
        </div>

        {/* Address Footer preview */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200 space-y-3">
          <div className="flex items-start justify-between gap-3 text-xs">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Selected Doorstep Pin
                </span>
                <span className="text-[10px] text-stone-400 font-medium">
                  Drag pin on map to adjust
                </span>
              </div>
              {isGeocoding ? (
                <div className="flex items-center gap-2 mt-1.5 text-stone-500 text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  <span>Resolving exact building & street address...</span>
                </div>
              ) : (
                <div className="mt-1 space-y-0.5">
                  <p className="font-extrabold text-stone-900 text-sm truncate">
                    {addressDetails?.streetAddress || 'Main Road'}
                  </p>
                  <p className="text-stone-600 text-xs font-medium">
                    {addressDetails?.area}, {addressDetails?.city} - {addressDetails?.pincode}
                  </p>
                  <p className="text-[10px] text-stone-400 font-mono">
                    GPS: {currentCoords.lat.toFixed(5)}, {currentCoords.lng.toFixed(5)}
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={isGeocoding || !addressDetails}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50 flex-shrink-0 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Location</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
