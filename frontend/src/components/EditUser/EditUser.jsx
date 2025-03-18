import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Box, Button } from "@mui/material";
import FormEdituser from "./FormEdituser";

export default function EditUserForm({ user, onClose, onUserUpdated }) {
  const initialFormState = {
    address: {
      lat: 19.432608, // CDMX
      lng: -99.133209,
    },
  };

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(() => ({
    ...initialFormState,
    ...user,
    address: {
      ...initialFormState.address,
      ...user?.address,
    },
  }));

  const [markerPosition, setMarkerPosition] = useState([initialFormState.address.lat, initialFormState.address.lng]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };



  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
     // Validar errores antes de enviar
  if (Object.values(errors).some((error) => error)) {
    return;
  }


    const { lat, lng, ...filteredAddress } = formData.address || {};
    const dataToSend = { ...formData, address: filteredAddress };
  
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/v1/users/${user.id}`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Cierra el modal primero
      onClose();
  
      //Espera un breve tiempo antes de mostrar SweetAlert
      setTimeout(() => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User updated successfully!",
          timer: 3000,
          showConfirmButton: true,
        });
      }, 100); // 100ms es suficiente
  
      onUserUpdated();
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.join("\n") || error.message || "Error updating user";

      onClose();
      setTimeout(() => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        showConfirmButton: true,
      });
    }, 100); 
    }
  };
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

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, margin: "auto", padding: 3, boxShadow: 3, borderRadius: 2 }}
    >
      <FormEdituser
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleAddressChange={handleAddressChange}
        setFormData={setFormData}
        setMarkerPosition={setMarkerPosition}
      />
      <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
        Update User
      </Button>
    </Box>
  );
}
