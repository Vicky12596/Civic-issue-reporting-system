import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Default Leaflet marker icons don't resolve correctly under bundlers; fix explicitly.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/** Renders all issues as pins on an interactive Leaflet map (no API key required). */
export default function MapView({ issues, center = [11.0168, 76.9558], zoom = 12 }) {
  return (
    <div className="leaflet-map-container">
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {issues.map((issue) => (
          <Marker key={issue.id} position={[issue.latitude, issue.longitude]}>
            <Popup>
              <strong>{issue.title}</strong>
              <br />
              {issue.status} · {issue.priority}
              <br />
              <Link to={`/issues/${issue.id}`}>View details</Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
