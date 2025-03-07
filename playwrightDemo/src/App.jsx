import React, { useState } from "react";
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormLabel, Select, MenuItem, FormControl, InputLabel, Container, Typography, Box, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const BasicForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    gender: "",
    country: ""
  });

  const [errors, setErrors] = useState({});
  const [entries, setEntries] = useState([]);
  const [success, setSuccess] = useState(null);

  const validate = () => {
    let tempErrors = {};
    tempErrors.name = formData.name ? "" : "Name is required";
    tempErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? "" : "Valid email is required";
    tempErrors.password = formData.password.length >= 6 ? "" : "Password must be at least 6 characters";
    tempErrors.address = formData.address ? "" : "Address is required";
    tempErrors.gender = formData.gender ? "" : "Gender is required";
    tempErrors.country = formData.country ? "" : "Country is required";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setEntries([...entries, formData]);
      setSuccess(true);
      setFormData({ name: "", email: "", password: "", address: "", gender: "", country: "" });
    }
    else{
      setSuccess(false)
    }
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
        {/* Form Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, marginTop: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
              Registration Form
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField label="Name" name="name" value={formData.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} data-testid="name-input" fullWidth margin="normal" />
              <TextField label="Email" name="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} data-testid="email-input" fullWidth margin="normal" />
              <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} data-testid="password-input" fullWidth margin="normal" />
              <TextField label="Address" name="address" value={formData.address} onChange={handleChange} error={!!errors.address} helperText={errors.address} data-testid="address-input" fullWidth margin="normal" />
              <FormControl error={!!errors.gender} margin="normal" fullWidth>
                <FormLabel>Gender</FormLabel>
                <RadioGroup name="gender" value={formData.gender} onChange={handleChange} row>
                  <FormControlLabel value="Male" control={<Radio />} label="Male" data-testid="gender-male" />
                  <FormControlLabel value="Female" control={<Radio />} label="Female" data-testid="gender-female" />
                </RadioGroup>
                <Typography variant="caption" color="error">{errors.gender}</Typography>
              </FormControl>
              <FormControl fullWidth margin="normal" error={!!errors.country}>
              <InputLabel>Country</InputLabel>
                <Select name="country" placeholder="Test" value={formData.country} onChange={handleChange} data-testid="country-select" label="Country">
                  
                  <MenuItem value="India" label="India">India</MenuItem>
                  <MenuItem value="USA" label="USA">USA</MenuItem>
                  <MenuItem value="UK" label="UK">UK</MenuItem>
                </Select>
                <Typography variant="caption" color="error">{errors.country}</Typography>
              </FormControl>
              <Box display="flex" justifyContent="center" mt={2}>
                <Button type="submit" variant="contained" color="primary" data-testid="submit-button">
                  Submit
                </Button>
              </Box>
              {success && (
                <Typography variant="h6" color="primary" align="center" mt={2} data-testid="success-message">
                  Submitted Details
                </Typography>
              )}
              {success===false && (
                <Typography variant="h6" color="primary" align="center" mt={2} data-testid="failed-message">
                  Invalid data
                </Typography>
              )}
            </form>
          </Paper>
        </Grid>

        {/* Entries Table Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, marginTop: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
              Submitted Entries
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>Country</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entries.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.name}</TableCell>
                      <TableCell>{entry.email}</TableCell>
                      <TableCell>{entry.address}</TableCell>
                      <TableCell>{entry.gender}</TableCell>
                      <TableCell>{entry.country}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BasicForm;
