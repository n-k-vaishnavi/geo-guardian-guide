import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Tourist } from '@/types/tourist';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  tourist?: Tourist;
  tourists?: Tourist[];
  center: { lat: number; lng: number };
  zoom?: number;
  showGeofence?: boolean;
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({
  tourist,
  tourists,
  center,
  zoom = 15,
  showGeofence = false,
  className = '',
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const geofenceRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    mapInstanceRef.current = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView([center.lat, center.lng], zoom);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Clear existing geofence
    if (geofenceRef.current) {
      geofenceRef.current.remove();
      geofenceRef.current = null;
    }

    // Single tourist mode
    if (tourist) {
      const icon = L.divIcon({
        html: `<div class="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
        className: 'custom-marker',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const marker = L.marker([tourist.coordinates.lat, tourist.coordinates.lng], { icon })
        .addTo(mapInstanceRef.current);
      
      markersRef.current.push(marker);

      // Add geofence if enabled
      if (showGeofence && tourist.geofence) {
        geofenceRef.current = L.circle(
          [tourist.geofence.center.lat, tourist.geofence.center.lng],
          {
            radius: tourist.geofence.radius,
            color: tourist.status === 'safe' ? '#22c55e' : '#ef4444',
            fillColor: tourist.status === 'safe' ? '#22c55e' : '#ef4444',
            fillOpacity: 0.1,
            weight: 2,
          }
        ).addTo(mapInstanceRef.current);
      }

      // Center map on tourist
      mapInstanceRef.current.setView([tourist.coordinates.lat, tourist.coordinates.lng], zoom);
    }

    // Multiple tourists mode (admin dashboard)
    if (tourists) {
      tourists.forEach(t => {
        const statusColor = t.status === 'safe' ? '#22c55e' : t.status === 'alert' ? '#f59e0b' : '#ef4444';
        
        const icon = L.divIcon({
          html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-lg" style="background-color: ${statusColor}"></div>`,
          className: 'custom-marker',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        const marker = L.marker([t.coordinates.lat, t.coordinates.lng], { icon })
          .bindPopup(`
            <div class="font-semibold">${t.name}</div>
            <div class="text-sm text-gray-600">Status: ${t.status}</div>
            <div class="text-sm text-gray-600">Last seen: ${t.lastSeen.toLocaleTimeString()}</div>
          `)
          .addTo(mapInstanceRef.current);
        
        markersRef.current.push(marker);
      });

      // Fit map to show all tourists
      if (tourists.length > 0) {
        const group = L.featureGroup(markersRef.current);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    }
  }, [tourist, tourists, showGeofence, zoom]);

  return (
    <div 
      ref={mapRef} 
      className={`h-64 md:h-80 w-full rounded-lg shadow-card border border-border ${className}`}
    />
  );
};

export default MapView;