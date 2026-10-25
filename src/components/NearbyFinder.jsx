import { useState } from 'react';
import { MapPin, Navigation, ChevronDown, AlertCircle } from 'lucide-react';
import { lagosLocations } from '../data';

export default function NearbyFinder() {
  const [locationStatus, setLocationStatus] = useState('idle');
  const [manualLocation, setManualLocation] = useState('');
  const [showManual, setShowManual] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('unsupported');
      setShowManual(true);
      return;
    }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationStatus('success');
      },
      (error) => {
        setLocationStatus('denied');
        setShowManual(true);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <section className="py-16 md:py-20 bg-white" id="nearby">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-deep-green to-deep-green-light rounded-3xl p-8 md:p-12 relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-fresh-green/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Navigation size={28} className="text-orange" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-heading mb-4">
              Find Foodstuff Near You
            </h2>
            <p className="text-white/70 mb-8">
              Discover sellers in your neighbourhood. Allow location access to find the closest foodstuff markets and sellers, or select your area manually.
            </p>

            {locationStatus === 'idle' && (
              <button
                onClick={requestLocation}
                className="group px-8 py-4 bg-orange hover:bg-orange-dark text-white rounded-xl font-semibold shadow-lg shadow-orange/30 hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
                id="find-sellers-btn"
              >
                <MapPin size={18} />
                Find Sellers Near Me
              </button>
            )}

            {locationStatus === 'loading' && (
              <div className="flex items-center justify-center gap-3 text-white">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Detecting your location...</span>
              </div>
            )}

            {locationStatus === 'success' && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-center gap-2 text-fresh-green mb-3">
                  <MapPin size={18} />
                  <span className="font-medium">Location detected</span>
                </div>
                <p className="text-white/70 text-sm">
                  This is a demonstration. In the live version, registered sellers near your detected location would be shown here. Currently no sellers have registered on the platform yet.
                </p>
              </div>
            )}

            {(locationStatus === 'denied' || locationStatus === 'unsupported' || showManual) && (
              <div className="mt-6">
                {locationStatus === 'denied' && (
                  <div className="flex items-center justify-center gap-2 text-orange mb-4">
                    <AlertCircle size={16} />
                    <span className="text-sm">Location access was declined. Please select your area manually.</span>
                  </div>
                )}
                <div className="max-w-sm mx-auto">
                  <select
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl text-white appearance-none cursor-pointer"
                    id="manual-location-select"
                  >
                    <option value="" className="text-dark-text">Select your Lagos area</option>
                    {lagosLocations.slice(1).map(loc => (
                      <option key={loc} value={loc} className="text-dark-text">{loc}</option>
                    ))}
                  </select>
                  {manualLocation && (
                    <p className="text-white/60 text-sm mt-4">
                      No registered sellers in {manualLocation} yet. Be among the first to join OjaConnect!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
