import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
  className?: string;
}

export const LocationPicker = ({
  latitude,
  longitude,
  onLocationChange,
  className = "",
}: LocationPickerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      
      // Custom green icon
      const greenIcon = new L.Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const initialLat = latitude || 0;
      const initialLng = longitude || 0;
      const initialZoom = latitude && longitude ? 8 : 2;

      const map = L.map(mapRef.current!).setView([initialLat, initialLng], initialZoom);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Add initial marker if coordinates provided
      if (latitude && longitude) {
        markerRef.current = L.marker([latitude, longitude], { icon: greenIcon }).addTo(map);
      }

      // Handle click to set location
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { icon: greenIcon }).addTo(map);
        }
        
        onLocationChange(lat, lng);
      });

      setIsLoaded(true);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker when coordinates change externally
  useEffect(() => {
    if (!mapInstanceRef.current || !latitude || !longitude) return;
    
    const L = (window as any).L;
    if (!L) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
    }
    mapInstanceRef.current.setView([latitude, longitude], 8);
  }, [latitude, longitude]);

  return (
    <div className={`rounded-xl overflow-hidden ${className}`}>
      <div className="relative">
        {!isLoaded && (
          <div className="absolute inset-0 bg-muted flex items-center justify-center z-10">
            <div className="text-center text-muted-foreground">
              <MapPin className="w-8 h-8 mx-auto mb-2 animate-pulse" />
              <p className="text-sm">Loading map...</p>
            </div>
          </div>
        )}
        <div ref={mapRef} style={{ height: "250px", width: "100%" }} />
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Click on the map to set project location
      </p>
    </div>
  );
};
