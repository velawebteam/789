import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for Real Builder
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function Map() {
  const locations = [
    { name: 'Porto', position: [41.1579, -8.6291] as [number, number], count: 24 },
    { name: 'Lisboa', position: [38.7223, -9.1393] as [number, number], count: 41 },
    { name: 'Faro (Algarve)', position: [37.0194, -7.9322] as [number, number], count: 22 },
  ];

  return (
    <MapContainer 
      center={[39.5, -8]} 
      zoom={6} 
      scrollWheelZoom={false} 
      className="w-full h-full rounded-2xl z-0"
      style={{ background: '#1a1d21' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {locations.map((loc, index) => (
        <Marker key={index} position={loc.position} icon={customIcon}>
          <Popup className="custom-popup">
            <div className="font-bold text-black">{loc.name}</div>
            <div className="text-sm">{loc.count} Certified Professionals</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
