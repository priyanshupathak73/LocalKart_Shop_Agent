"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Compass, AlertCircle, Loader2 } from 'lucide-react';
import { INDIAN_STATES } from './AddressFields';

export const OpenStreetMapPicker = ({ lat, lng, onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [locatingGps, setLocatingGps] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapLoaded) return;

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const loadLeafletScript = () => {
      if (window.L) {
        initMap();
        return;
      }
      if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => initMap();
        document.head.appendChild(script);
      }
    };

    const initMap = () => {
      if (!window.L || !mapContainerRef.current || mapRef.current) return;
      const L = window.L;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="background-color: #10B981; width: 36px; height: 36px; borderRadius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transform: translate(-50%, -50%);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const initialLat = lat || 28.6139;
      const initialLng = lng || 77.2090;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: false
      });

      L.control.zoom({ position: 'topright' }).addTo(map);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const marker = L.marker([initialLat, initialLng], { draggable: true, icon: customIcon }).addTo(map);
      mapRef.current = map;
      markerRef.current = marker;
      setMapLoaded(true);

      const handlePos = (newLat, newLng) => {
        reverseGeocode(newLat, newLng);
      };

      marker.on('dragend', (e) => {
        const pos = e.target.getLatLng();
        handlePos(pos.lat, pos.lng);
      });

      map.on('click', (e) => {
        marker.setLatLng(e.latlng);
        handlePos(e.latlng.lat, e.latlng.lng);
      });
    };

    loadLeafletScript();
  }, []);

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`, {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const road = addr.road || addr.suburb || addr.neighbourhood || '';
        const city = addr.city || addr.town || addr.village || addr.county || '';
        const state = addr.state || '';
        const matchedState = INDIAN_STATES.find(s => s.toLowerCase() === state.toLowerCase()) || state;
        const pincode = addr.postcode ? addr.postcode.replace(/\D/g, '').slice(0, 6) : '';
        if (onLocationSelect) {
          onLocationSelect({ lat: latitude, lng: longitude, road, city, state: matchedState, pincode });
        }
        return;
      }
    } catch (err) {
      // Graceful fallback on network, rate limit, or CORS failure
      console.warn("OpenStreetMap Geocoding Fallback:", err.message || err);
    }
    if (onLocationSelect) {
      onLocationSelect({ lat: latitude, lng: longitude });
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setGeoError(null);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`, {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const item = data[0];
        const newLat = parseFloat(item.lat);
        const newLng = parseFloat(item.lon);
        if (mapRef.current && markerRef.current) {
          mapRef.current.setView([newLat, newLng], 15);
          markerRef.current.setLatLng([newLat, newLng]);
        }
        await reverseGeocode(newLat, newLng);
      } else {
        setGeoError('No location results found.');
      }
    } catch (err) {
      console.warn("OpenStreetMap Search Fallback:", err.message || err);
      setGeoError('Location search unavailable. You can drag the pin marker directly on the map.');
    } finally {
      setSearching(false);
    }
  };

  const handleGps = () => {
    if (!navigator.geolocation) return;
    setLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLat = pos.coords.latitude;
        const newLng = pos.coords.longitude;
        if (mapRef.current && markerRef.current) {
          mapRef.current.setView([newLat, newLng], 16);
          markerRef.current.setLatLng([newLat, newLng]);
        }
        reverseGeocode(newLat, newLng);
        setLocatingGps(false);
      },
      () => setLocatingGps(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-heading">
            <MapPin className="w-4 h-4 text-emerald-600" /> OpenStreetMap Location Pin
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Click or drag pin marker to specify location</p>
        </div>
        <button
          type="button"
          onClick={handleGps}
          disabled={locatingGps}
          className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
        >
          {locatingGps ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Compass className="w-3.5 h-3.5" />}
          {locatingGps ? 'Locating...' : 'Use GPS Location'}
        </button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch(e);
              }
            }}
            placeholder="Search landmark or locality..."
            className="w-full bg-white border border-slate-200 focus:border-emerald-500 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 outline-none"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0 font-heading"
        >
          {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
        </button>
      </div>

      {geoError && <div className="p-2 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-1.5"><AlertCircle className="w-4 h-4" />{geoError}</div>}

      <div className="relative w-full h-56 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full z-10" />
        {!mapLoaded && (
          <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" /> Loading Map...
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] bg-white p-2.5 rounded-xl border border-slate-200/60">
        <span className="font-semibold text-slate-500">Pinned Coordinates:</span>
        <span className="font-bold text-slate-700 font-heading">{lat?.toFixed(5) || 28.6139}° N, {lng?.toFixed(5) || 77.2090}° E</span>
      </div>
    </div>
  );
};
