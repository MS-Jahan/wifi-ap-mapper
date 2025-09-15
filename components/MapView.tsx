
import React, { useEffect, useRef } from 'react';
import { APData } from '../types';

declare const L: any; // Using Leaflet from CDN

interface MapViewProps {
  data: APData[];
  selectedAp: APData | null;
  onMarkerClick: (ap: APData) => void;
}

const MapView: React.FC<MapViewProps> = ({ data, selectedAp, onMarkerClick }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any | null>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current).setView([23.8103, 90.4125], 7); // Default to Dhaka
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      mapRef.current = map;
    }
  }, []);

  // Update markers when data changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !data) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current.clear();

    if (data.length === 0) return;

    const newMarkers: any[] = [];
    data.forEach(ap => {
      const marker = L.marker([ap.Latitude, ap.Longitude]);
      
      // Hover tooltip
      marker.bindTooltip(ap.ESSID);
      
      // Click popup
      const popupContent = `
        <div class="font-sans">
          <strong class="text-base">${ap.ESSID}</strong>
          <ul class="mt-2 text-xs space-y-1">
            <li><strong>BSSID:</strong> ${ap.BSSID}</li>
            <li><strong>WPA PSK:</strong> ${ap['WPA PSK']}</li>
            <li><strong>WPS PIN:</strong> ${ap['WPS PIN']}</li>
            <li><strong>Date:</strong> ${ap.Date}</li>
            <li><strong>Coords:</strong> ${ap.Latitude.toFixed(6)}, ${ap.Longitude.toFixed(6)}</li>
          </ul>
        </div>
      `;
      marker.bindPopup(popupContent);
      
      marker.on('click', () => {
        onMarkerClick(ap);
      });

      marker.addTo(map);
      markersRef.current.set(ap.BSSID, marker);
      newMarkers.push(marker);
    });

    if (newMarkers.length > 0) {
      const featureGroup = L.featureGroup(newMarkers);
      map.fitBounds(featureGroup.getBounds().pad(0.1));
    }
  }, [data, onMarkerClick, theme]);

  // Handle selection from outside (e.g., table click)
  // useEffect(() => {
  //   const map = mapRef.current;
  //   if (!map) return;

  //   if (selectedAp) {
  //     const marker = markersRef.current.get(selectedAp.BSSID);
  //     if (marker) {
  //       map.flyTo(marker.getLatLng(), 16);
  //       marker.openPopup();
  //     }
  //   }
  // }, [selectedAp]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (selectedAp) {
      const marker = markersRef.current.get(selectedAp.BSSID);
      if (marker) {
        // REPLACED flyTo with setView for a more stable, non-conflicting pan and zoom.
        // It sets the center and ensures the zoom level is adequate.
        const targetZoom = map.getZoom() < 16 ? 16 : map.getZoom();
        map.setView(marker.getLatLng(), targetZoom);
        marker.openPopup();
      }
    }
  }, [selectedAp]);

  return <div ref={mapContainerRef} className="w-full h-full rounded-b-lg" />;
};

export default MapView;
