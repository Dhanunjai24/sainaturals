import React, { useState, useRef } from 'react';
import { Navigation, Loader2, CheckCircle2, AlertCircle, ExternalLink, MapPin } from 'lucide-react';
import { LocationPickerModal } from './LocationPickerModal';

interface LocationResult {
  streetAddress: string;
  landmark: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
}

interface GpsLocationButtonProps {
  onLocationFound: (location: LocationResult) => void;
  className?: string;
}

export const GpsLocationButton: React.FC<GpsLocationButtonProps> = ({ onLocationFound, className = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  // Map Picker Modal state
  const [showMapModal, setShowMapModal] = useState(false);

  const watchIdRef = useRef<number | null>(null);
  const timeoutIdRef = useRef<any>(null);

  // High-precision reverse geocoding via building-level zoom
  const reverseGeocode = async (lat: number, lng: number, acc?: number): Promise<LocationResult> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=19&addressdetails=1`,
        {
          headers: { 'Accept-Language': 'en' },
          signal: controller.signal
        }
      );
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const a = data.address || {};

        const road = a.road || a.pedestrian || a.street || a.neighbourhood || a.residential || '';
        const houseNumber = a.house_number ? `#${a.house_number}, ` : '';
        const street = (houseNumber + road).trim() || data.name || `Coordinates (${lat.toFixed(5)}, ${lng.toFixed(5)})`;

        const landmark = a.amenity || a.building || a.shop || a.commercial || a.historic || 'Near Detected Point';
        const area = a.suburb || a.neighbourhood || a.residential || a.city_district || a.town || a.county || 'Sangareddy';
        const city = a.city || a.town || a.district || a.state_district || 'Telangana';
        const state = a.state || 'Telangana';
        const pincode = a.postcode || '502001';

        return {
          streetAddress: street,
          landmark,
          area,
          city,
          state,
          pincode,
          latitude: lat,
          longitude: lng,
          accuracy: acc
        };
      }
    } catch (e) {
      console.warn('Reverse geocoding error or timeout:', e);
    }

    return {
      streetAddress: `GPS Fixed Location (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
      landmark: 'Accurate to device sensors',
      area: 'Sangareddy',
      city: 'Sangareddy',
      state: 'Telangana',
      pincode: '502001',
      latitude: lat,
      longitude: lng,
      accuracy: acc
    };
  };

  // High-Accuracy Multi-Sample GPS Fix
  const handleGetHighAccuracyGps = () => {
    if (!navigator.geolocation) {
      setStatus('error');
      setStatusMessage('Geolocation is not supported by your current browser.');
      return;
    }

    // Clear any previous watch
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    setIsLoading(true);
    setStatus('loading');
    setStatusMessage('Acquiring fresh satellite GPS signal (ignoring cache)...');

    let bestAccuracy = Infinity;
    let bestPos: GeolocationPosition | null = null;

    // Safety timeout: after 7 seconds, lock in the best available reading
    timeoutIdRef.current = setTimeout(async () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }

      if (bestPos) {
        await lockLocation(bestPos);
      } else {
        setIsLoading(false);
        setStatus('error');
        setStatusMessage('GPS satellite request timed out. You can pinpoint on the map.');
      }
    }, 7000);

    // Watch position sampling to refine accuracy from raw hardware sensors
    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const acc = Math.round(pos.coords.accuracy || 100);
        setStatusMessage(`Refining GPS accuracy: ~${acc}m...`);

        if (acc < bestAccuracy) {
          bestAccuracy = acc;
          bestPos = pos;
        }

        // If satellite lock reaches high accuracy (<= 20 meters), lock it immediately!
        if (acc <= 20) {
          if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
          }
          if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
          }
          await lockLocation(pos);
        }
      },
      (err) => {
        if (bestPos) {
          lockLocation(bestPos);
          return;
        }
        setIsLoading(false);
        setStatus('error');
        if (err.code === err.PERMISSION_DENIED) {
          setStatusMessage('Location permission denied. Click "Pinpoint on Map" to select.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setStatusMessage('GPS position unavailable. Click "Pinpoint on Map" to select.');
        } else {
          setStatusMessage('Could not retrieve GPS coordinates.');
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0, // CRITICAL: NEVER USE STALE CACHED WI-FI/IP POSITION
        timeout: 10000
      }
    );
  };

  const lockLocation = async (pos: GeolocationPosition) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const acc = Math.round(pos.coords.accuracy || 0);

    setCoords({ lat, lng });
    setAccuracy(acc);

    setStatusMessage('Resolving exact building & postal address...');
    const resolved = await reverseGeocode(lat, lng, acc);

    onLocationFound(resolved);
    setIsLoading(false);
    setStatus('success');
    setStatusMessage(
      `Locked: ${resolved.area}, ${resolved.city} (Accuracy: ~${acc}m)`
    );
  };

  const handleMapConfirm = (location: LocationResult) => {
    setCoords({ lat: location.latitude!, lng: location.longitude! });
    setAccuracy(location.accuracy || 5);
    onLocationFound(location);
    setStatus('success');
    setStatusMessage(`Pinpoint Confirmed: ${location.area}, ${location.city}`);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Action Row with High-Accuracy GPS + Pinpoint on Map */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <button
          type="button"
          onClick={handleGetHighAccuracyGps}
          disabled={isLoading}
          className="w-full sm:flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-300 text-emerald-800 font-bold text-xs transition-all shadow-sm active:scale-[0.99] disabled:opacity-70 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>{statusMessage}</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4 text-emerald-600 flex-shrink-0 animate-pulse" />
              <span>📍 Auto-Detect High-Accuracy GPS</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setShowMapModal(true)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-[0.99] cursor-pointer flex-shrink-0"
          title="Drag pin on map to select your exact house or gate"
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Pinpoint on Map</span>
        </button>
      </div>

      {/* Success Badge */}
      {status === 'success' && coords && (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-300 text-emerald-900 text-[11px] animate-fadeIn">
          <div className="flex items-center gap-1.5 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="truncate font-medium">{statusMessage}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <button
              type="button"
              onClick={() => setShowMapModal(true)}
              className="text-emerald-700 hover:text-emerald-900 font-bold text-[10px] underline cursor-pointer"
            >
              Adjust Pin
            </button>
            <a
              href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0.5 font-bold text-emerald-700 hover:text-emerald-900 text-[10px]"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Error Badge */}
      {status === 'error' && (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
          <div className="flex items-center gap-1.5 min-w-0">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <p className="font-semibold truncate">{statusMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowMapModal(true)}
            className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded-lg font-bold text-[10px] flex-shrink-0 transition-colors cursor-pointer"
          >
            Pick on Map
          </button>
        </div>
      )}

      {/* Interactive Location Picker Map Modal */}
      {showMapModal && (
        <LocationPickerModal
          isOpen={showMapModal}
          onClose={() => setShowMapModal(false)}
          onConfirmLocation={handleMapConfirm}
          initialCoords={coords || { lat: 17.6155, lng: 78.0817 }}
        />
      )}
    </div>
  );
};
