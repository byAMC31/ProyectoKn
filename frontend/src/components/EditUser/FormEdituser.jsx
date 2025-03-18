import React from "react";
import { TextField, MenuItem, Typography, Grid, Divider } from "@mui/material";
import Map from '../CreateUsersForm/Map';

export default function FormEdituser({ formData, errors, handleChange, handleAddressChange, handleFileChange, setMarkerPosition, setFormData }) {
  return (
    <Grid container spacing={2}>
      {[ 
        { label: "First Name", name: "firstName" },
        { label: "Last Name", name: "lastName" },
        { label: "Email", name: "email", type: "email" },
        // { label: "Password", name: "password", type: "password" },
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
        <TextField select fullWidth label="Role" name="role" value={formData.role} onChange={handleChange}>
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="User">User</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField select fullWidth label="Status" name="status" value={formData.status} onChange={handleChange}>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }}>
          <Typography variant="h6">Address</Typography>
        </Divider>
      </Grid>
      
      <Grid item xs={12}>
        <Map markerPosition={[formData.address.lat, formData.address.lng]} setMarkerPosition={setMarkerPosition} setFormData={setFormData} />
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
      
      {/* <Grid item xs={12}>
        <Divider sx={{ my: 2 }}>
          <Typography variant="h6">Profile Picture</Typography>
        </Divider>
        <input id="profilePictureInput" type="file" accept="image/*" onChange={handleFileChange} />
      </Grid> */}
    </Grid>
  );
}
