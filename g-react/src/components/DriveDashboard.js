import React, { useState, useEffect } from "react";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Button,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
const DriveDashboard = () => {
  
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [renameFileId, setRenameFileId] = useState(null);
  const [isWebView, setIsWebView] = useState(false);
  useEffect(() => {
    
    const handleRefreshEvent = (event) => {
    console.log("Refresh event received:",   event);

    fetchDriveFiles();
    };
    window.addEventListener("refreshPage", handleRefreshEvent);
    return () => {
      window.removeEventListener("refreshPage", handleRefreshEvent);
    };
  }, [selectedFile]);
  useEffect(() => {
    
    setIsWebView(localStorage.getItem("is_webview"));
    
  }, []);
  const fetchDriveFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("User not authenticated.");
      const response = await fetch("http://10.24.209.93:3002/drive-files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch drive files");
      }
      const data = await response.json();
      setFiles(data.files || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDriveFiles();
  }, []);
  const handleButtonClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "*/*";
    input.style.display = "none";
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setSelectedFile(file);
        console.log("Selected File:", file);
      }
    };
    document.body.appendChild(input);
    input.click(); //
  };
  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }
    const token =  localStorage.getItem("access_token"); // Retrieve token from localStorage
    if (!token) {
      alert("User not authenticated. Please log in again.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await fetch("http://10.24.209.93:3002/upload-file", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Attach token to request
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "File upload failed");
      alert("File uploaded successfully!");
      fetchDriveFiles();
      setSelectedFile(null);
    } catch (err) {
      alert(err.message);
    }
  };
  const handleFileRename = async (fileId) => {
    if (!newFileName) return;
    try {
      const response = await fetch("http://10.24.209.93:3002/update-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, newFileName }),
      });
      if (!response.ok) throw new Error("File rename failed");
      fetchDriveFiles();
      setRenameFileId(null);
      setNewFileName("");
    } catch (err) {
      setError(err.message);
    }
  };
  const handleFileDelete = async (fileId) => {
    try {
      const token =  localStorage.getItem("access_token"); 
      if (!token) {
        alert("User not authenticated. Please log in again.");
        return;
      }
      const response = await fetch("http://10.24.209.93:3002/delete-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fileId }),
      });
      if (!response.ok) throw new Error("File deletion failed");
      fetchDriveFiles();
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div style={{ padding: "20px" }}>
      { !(JSON.parse(isWebView)) && (
        <>
          <Typography variant="h4" gutterBottom>
            Google Drive Dashboard
          </Typography>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            
            <Button
              variant="contained"
              color="secondary"
              onClick={fetchDriveFiles}
            >
              Refresh Files
            </Button>
          </div>
        </>
      )}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </div>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && files.length === 0 && (
        <Typography>No files found.</Typography>
      )}
      {!loading && !error && files.length > 0 && (
        <Grid container spacing={3}>
          {files.map((file) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
              <Card
                sx={{
                  padding: 2,
                  minHeight: 150,
                  borderRadius: 3,
                  boxShadow: 3,
                }}
              >
                <CardContent>
                  {renameFileId === file.id ? (
                    <TextField
                      fullWidth
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      onBlur={() => handleFileRename(file.id)}
                      autoFocus
                    />
                  ) : (
                    <Typography variant="h6">{file.name}</Typography>
                  )}
                </CardContent>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px",
                  }}
                >
                  {file.webContentLink && (
                    <IconButton href={file.webContentLink} target="_blank">
                      <CloudDownloadIcon color="primary" />
                    </IconButton>
                  )}
                 
                  <IconButton onClick={() => handleFileDelete(file.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "15px",
          zIndex: 1000,
        }}
      >
        <Button
          variant="contained"
          size="large"
          color="primary"
          startIcon={selectedFile ? <CloudUploadIcon style={{marginLeft:'10px'}} /> : <AddIcon style={{marginLeft:'10px'}} />}
          onClick={selectedFile ? handleFileUpload : handleButtonClick}
          style={{
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            minWidth: "unset",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            
          }}
        />
      </div>
    </div>
  );
};
export default DriveDashboard;