import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Box, TextField, Button, MenuItem, Typography, Grid } from "@mui/material";

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
    },
    profilePicture: null,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

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
          { label: "Street", name: "street", address: true },
          { label: "Number", name: "number", address: true },
          { label: "City", name: "city", address: true },
          { label: "Postal Code", name: "postalCode", address: true },
        ].map(({ label, name, type, address }) => (
          <Grid key={name} item xs={12} sm={6}>
            <TextField
              fullWidth
              label={label}
              name={name}
              type={type || "text"}
              value={address ? formData.address[name] : formData[name] || ""}
              onChange={address ? handleAddressChange : handleChange}
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
          <Typography variant="h6">Profile Picture</Typography>
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
