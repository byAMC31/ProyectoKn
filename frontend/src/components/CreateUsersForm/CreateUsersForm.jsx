// CreateUsersForm.js
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Box, Button, Typography, Divider } from "@mui/material";
import UserFormFields from "./UserFormFields";

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
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, address: { ...prev.address, [name]: value } }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, profilePicture: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).some((error) => error)) {
      Swal.fire("Error", "Please fix the errors before submitting.", "error");
      return;
    }

    // Excluir lat y lng antes de enviar los datos
    const { lat, lng, ...filteredAddress } = formData.address;
    const dataToSend = { ...formData, address: filteredAddress };

    const data = new FormData();
    Object.keys(dataToSend).forEach((key) => {
      if (key === "profilePicture" && dataToSend[key]) {
        data.append(key, dataToSend[key]);
      } else if (key === "address") {
        Object.entries(dataToSend.address).forEach(([subKey, subValue]) => {
          data.append(`address[${subKey}]`, subValue);
        });
      } else {
        data.append(key, dataToSend[key]);
      }
    });

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/v1/users/register", data, {
        headers: { 
          "Content-Type": "multipart/form-data",
           Authorization: `Bearer ${token}`,
         },
      });
      Swal.fire("Success", "User registered successfully!", "success");
      setFormData(initialFormState);
      document.getElementById("profilePictureInput").value = "";
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Error registering user", "error");
    }
  };


  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, margin: "auto", padding: 3, boxShadow: 3, borderRadius: 2 }}>
      <Divider sx={{ my: 2 }}>
        <Typography variant="h6">Create user</Typography>
      </Divider>
      <UserFormFields
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleAddressChange={handleAddressChange}
        handleFileChange={handleFileChange}
        setMarkerPosition={setMarkerPosition}
        setFormData={setFormData}
      />
      <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
        Register
      </Button>

    </Box>
  );
}
