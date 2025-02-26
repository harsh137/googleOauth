import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, Box } from "@mui/material";
import { useEffect } from "react";


function Home() {
  const navigate = useNavigate();

  useEffect(() => {

    const authData = localStorage.getItem("access_token");
    const id_token = localStorage.getItem("id_token");

    if (authData && id_token) {
      navigate("/dashboard");
    }
  }, [navigate]);


  const handleLogin = async () => {
    try {
        

        // Check if tokens exist in local storage
        const accessToken = localStorage.getItem("access_token");
        const idToken = localStorage.getItem("id_token");

        if (accessToken && idToken) {
            console.log("Tokens available, refreshing...");

            // Refresh token if already authenticated
            const refreshResponse = await fetch("http://10.24.209.93:3002/refresh-token", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${idToken}`,
                },
            });

            if (!refreshResponse.ok) {
                throw new Error("Token refresh failed");
            }

            const refreshData = await refreshResponse.json();
            console.log("Refreshed token:", refreshData);

            // Update access token
            if (refreshData.access_token) {
                localStorage.setItem("access_token", refreshData.access_token);
                // Redirect to dashboard
                navigate("/dashboard");

            }

            
        }

        console.log("No valid token found, starting authentication...");

        // Step 1: Get OAuth URL from backend
        const authResponse = await fetch("http://10.24.209.93:3002/api/auth");
        const data = await authResponse.json(); // Expecting { authUrl: "https://accounts.google.com/..." }

    if (data.authUrl) {
      window.location.href = data.authUrl; // Redirect user to Google OAuth page
    } else {
      console.error("Auth URL not received");
    }// Redirect user to Google OAuth

    } catch (error) {
        console.error("Login failed", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("id_token");
    }
};



  return (
    <Container>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h4" gutterBottom>
          Sign in with Google
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Sign in with Google
        </Button>
      </Box>
    </Container>
  );
}

export default Home;
