import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { MapPin, Store, Package, Truck, ArrowRight, ChevronDown } from 'lucide-react';
import { lagosMapMarkers } from '../data';
import L from 'leaflet';

/* Custom marker icon */
const createMarkerIcon = (area) => {
  const color = area === 'Lagos Mainland' ? '#14532D' : area === 'Lagos Island' ? '#22C55E' : '#F59E0B';
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 28px; height: 28px; 
      background: ${color}; 
      border: 3px solid white; 
      border-radius: 50%; 
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
    ">
      <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
};

export default function LagosMap() {
  const [selectedArea, setSelectedArea] = useState('all');
  const lagosCenter = [6.5244, 3.3792];

  const areaGroups = [
    { value: 'all', label: 'All Areas' },
    { value: 'Lagos Mainland', label: 'Lagos Mainland' },
    { value: 'Lagos Island', label: 'Lagos Island and Lekki Corridor' },
    { value: 'Other Areas', label: 'Other Areas' },
  ];

  const filteredMarkers = selectedArea === 'all'
    ? lagosMapMarkers
    : lagosMapMarkers.filter(m => m.area === selectedArea);

  return (
    <section className="py-16 md:py-20 bg-white" id="lagos-map">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-deep-green/10 text-deep-green text-sm font-semibold rounded-full mb-4">
            Lagos Markets
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-dark-text font-heading mb-4">
            Explore Foodstuff Markets Across Lagos
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Click on any location marker to learn about available markets. Currently awaiting sellers to register on the platform.
          </p>
        </div>

        {/* Area Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {areaGroups.map((area) => (
            <button
              key={area.value}
              onClick={() => setSelectedArea(area.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                selectedArea === area.value
                  ? 'bg-deep-green text-white shadow-lg shadow-deep-green/25'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {area.label}
            </button>
          ))}
        </div>

        {/* Map Container */}
        <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100" style={{ height: '500px' }}>
          <MapContainer
            center={lagosCenter}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredMarkers.map((marker) => (
              <Marker
                key={marker.name}
                position={[marker.lat, marker.lng]}
                icon={createMarkerIcon(marker.area)}
              >
                <Popup>
                  <div className="min-w-[220px] p-1">
                    <h3 className="font-bold text-base text-gray-800 mb-1 font-sans">{marker.name}</h3>
                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full mb-2">{marker.area}</span>
                    <p className="text-gray-600 text-sm mb-3">{marker.description}</p>
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Store size={12} />
                        <span>Registered Sellers: Awaiting registrations</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Package size={12} />
                        <span>Available Foodstuff: Pending seller onboarding</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Truck size={12} />
                        <span>Delivery: To be confirmed by sellers</span>
                      </div>
                    </div>
                    <a
                      href={`/shop?location=${encodeURIComponent(marker.name)}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-700 text-white text-xs font-medium rounded-lg hover:bg-green-800 transition-colors"
                    >
                      Explore Sellers in This Area
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-deep-green rounded-full border-2 border-white shadow"></div>
            <span className="text-sm text-gray-500">Lagos Mainland</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-fresh-green rounded-full border-2 border-white shadow"></div>
            <span className="text-sm text-gray-500">Lagos Island / Lekki</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange rounded-full border-2 border-white shadow"></div>
            <span className="text-sm text-gray-500">Other Areas</span>
          </div>
        </div>
      </div>
    </section>
  );
}
