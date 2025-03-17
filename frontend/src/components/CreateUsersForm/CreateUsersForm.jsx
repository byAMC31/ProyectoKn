import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Box, TextField, Button, MenuItem, Typography, Grid,Divider  } from "@mui/material";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Ícono personalizado para el marcador
const customMarker = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});


export default function CreateUsersForm() {
  const initialFormState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "User",
    status: "Active",
    address: {
      street: "",
      number: "",
      city: "",
      postalCode: "",
      lat: 19.432608, // CDMX
      lng: -99.133209,
    },
    profilePicture: null,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [markerPosition, setMarkerPosition] = useState([initialFormState.address.lat, initialFormState.address.lng]);

  // Función para obtener la dirección a partir de coordenadas
  const fetchAddressFromCoords = async (lat, lng) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = response.data;
      
      if (data && data.address) {
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            street: [data.address.road, data.address.town, data.address.village].filter(Boolean).join(", "),
            number: data.address.house_number || "",
            city: data.address.city  || "",
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


  // Componente para manejar clics en el mapa
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        fetchAddressFromCoords(lat, lng); // Llamamos a la función de geocodificación
      },
    });

    return <Marker position={markerPosition} icon={customMarker} />;
  }

  const validateField = (name, value) => {
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/;
    const phoneRegex = /^\d{10}$/;
    const postalCodeRegex = /^\d{5}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    let error = "";

    switch (name) {
      case "firstName":
      case "lastName":
        if (!nameRegex.test(value)) error = "Only letters are allowed.";
        break;
      case "phoneNumber":
        if (!phoneRegex.test(value)) error = "Must be exactly 10 digits.";
        break;
      case "password":
        if (!passwordRegex.test(value))
          error = "At least 8 chars, one uppercase, one lowercase, one digit, one special char.";
        break;
      case "postalCode":
        if (!postalCodeRegex.test(value)) error = "Must be exactly 5 digits.";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profilePicture: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).some((error) => error)) {
      Swal.fire("Error", "Please fix the errors before submitting.", "error");
      return;
    }

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "profilePicture") {
        if (formData[key]) data.append(key, formData[key]);
      } else if (key === "address") {
        Object.entries(formData.address).forEach(([subKey, subValue]) => {
          data.append(`address[${subKey}]`, subValue);
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/register",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      Swal.fire("Success", "User registered successfully!", "success");
      setFormData(initialFormState);
      document.getElementById("profilePictureInput").value = "";
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Error registering user",
        "error"
      );
    }
  };

  return (
    <Box
    component="form"
    onSubmit={handleSubmit}
    sx={{ maxWidth: 600, margin: "auto", padding: 3, boxShadow: 3, borderRadius: 2 }}
  >
    <Typography variant="h5" align="center" gutterBottom>
      Register User
    </Typography>
    <Grid container spacing={2}>
      {[ 
        { label: "First Name", name: "firstName" },
        { label: "Last Name", name: "lastName" },
        { label: "Email", name: "email", type: "email" },
        { label: "Password", name: "password", type: "password" },
        { label: "Phone Number", name: "phoneNumber" },
      ].map(({ label, name, type }) => (
        <Grid key={name} item xs={12} sm={6}>
          <TextField
            fullWidth
            label={label}
            name={name}
            type={type || "text"}
            value={formData[name] || ""}
            onChange={handleChange}
            error={!!errors[name]}
            helperText={errors[name] || ""}
            required
          />
        </Grid>
      ))}
   <Grid item xs={12} sm={6}>
        <TextField
          select
          fullWidth
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="User">User</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          select
          fullWidth
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }}>
            <Typography variant="h6">Address</Typography>
        </Divider>
      </Grid>

      {/* Mapa interactivo con OpenStreetMap */}
      <Grid item xs={12}>
          <MapContainer center={markerPosition} zoom={13} style={{ height: "300px", width: "100%", borderRadius: "10px", marginTop: "10px" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker />
          </MapContainer>
        </Grid>

      {[ 
        { label: "Street", name: "street" },
        { label: "Number", name: "number" },
        { label: "City", name: "city" },
        { label: "Postal Code", name: "postalCode" },
      ].map(({ label, name }) => (
        <Grid key={name} item xs={12} sm={6}>
          <TextField
            fullWidth
            label={label}
            name={name}
            value={formData.address[name] || ""}
            onChange={handleAddressChange}
            error={!!errors[name]}
            helperText={errors[name] || ""}
            required
          />
        </Grid>
      ))}
  
     
      <Grid item xs={12}>
      <Divider sx={{ my: 2 }}>
        <Typography variant="h6">Profile Picture</Typography>
        </Divider>
        <input
          id="profilePictureInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </Grid>
      <Grid item xs={12}>
        <Button fullWidth type="submit" variant="contained">
          Register
        </Button>
      </Grid>
    </Grid>
  </Box>
  );
}
