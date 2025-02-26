import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, Box, } from "@mui/material";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";


function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tokens, setTokens] = useState({ access_token: "", id_token: "" });
  
  console.log("IN US");
  
  
  useEffect(() => {
    
    
      console.log("THis is elsw")
      
      
        const accessToken = searchParams.get("access_token");
        const idToken = searchParams.get("id_token");
        if (accessToken && idToken) {
          setTokens({ access_token: accessToken, id_token: idToken });
          localStorage.setItem("access_token", accessToken);
          localStorage.setItem("id_token", idToken);
          localStorage.setItem("is_webview",false)
        
      }
      
      navigate("/dashboard", { replace: true });
  
      const authData = localStorage.getItem("access_token");
      const id_token = localStorage.getItem("id_token");
  
      if (!authData && !id_token) {
        navigate("/");
      }
      
    
  }, []);
  

  return (
    <Container>
      {/* {!isWebView && <AppBar />} */}
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h4" gutterBottom>
          Welcome to Your Dashboard
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/gmail")} style={{ marginBottom: 10 }}>
          Go to Gmail Dashboard
        </Button>
        <Button variant="contained" color="secondary" onClick={() => navigate("/drive")}>
          Go to Google Drive Dashboard
        </Button>
      </Box>
    </Container>
  );
}

export default Dashboard;
