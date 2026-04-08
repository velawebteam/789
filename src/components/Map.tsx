import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom RB Marker Icon (Yellow pin with white dot and dark shadow)
const rbIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div style="filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.6));">
      <svg width="28" height="38" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.16344 0 0 7.16344 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.16344 24.8366 0 16 0Z" fill="#FFB800"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>
    </div>
  `,
  iconSize: [28, 38],
  iconAnchor: [14, 38]
});

const locations = [
  { id: 1, pos: [41.1579, -8.6291], name: "Porto" },
  { id: 2, pos: [38.7223, -9.1393], name: "Lisbon" },
  { id: 3, pos: [37.0176, -7.9304], name: "Faro" },
];

export default function Map() {
  return (
    <div className="w-full h-full bg-[#111315]">
      <MapContainer 
        center={[39.5, -8.0]} 
        zoom={6} 
        scrollWheelZoom={false} 
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {locations.map(loc => (
          <Marker key={loc.id} position={loc.pos as [number, number]} icon={rbIcon} />
        ))}
      </MapContainer>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .leaflet-container {
          background: #111315 !important;
        }
        .leaflet-marker-icon {
          background: transparent !important;
          border: none !important;
        }
      `}} />
    </div>
  );
}
