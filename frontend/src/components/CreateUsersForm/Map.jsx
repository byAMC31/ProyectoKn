import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

// Ícono personalizado para el marcador
const customMarker = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map({ markerPosition, setMarkerPosition, setFormData }) {
  // Obtener dirección a partir de coordenadas
  const fetchAddressFromCoords = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = response.data;

      if (data && data.address) {
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            street: [data.address.road, data.address.town, data.address.village].filter(Boolean).join(", "),
            number: data.address.house_number || "",
            city: data.address.city || "",
            postalCode: data.address.postcode || "",
            lat,
            lng,
          },
        }));
      }
    } catch (error) {
      console.error("Error obteniendo dirección:", error);
    }
  };

  // Manejar clics en el mapa
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        fetchAddressFromCoords(lat, lng);
      },
    });

    return <Marker position={markerPosition} icon={customMarker} />;
  }

  return (
    <MapContainer center={markerPosition} zoom={13} style={{ height: "300px", width: "100%", borderRadius: "10px", marginTop: "10px" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  );
}
