import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  
  Typography,
  Button,
  Container,
  Box,
  Paper,
  Modal,
  TextField,
  List,
  ListItem,
  ListItemText,
  
  Drawer,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";

import Appbar from "../components/Appbar";

const GmailDashboard = () => {
  const navigate = useNavigate();
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [openSendModal, setOpenSendModal] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [labels, setLabels] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("INBOX");
  const [isWebView, setIsWebView] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    const handleOpenSendModal = (event) => {
      if (event.detail) {
        setOpenSendModal(true);
      }
    };

    window.addEventListener("openSendModal", handleOpenSendModal);

    return () => {
      window.removeEventListener("openSendModal", handleOpenSendModal);
    };
  }, []);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    // window.addEventListener('authTokenSet');
    // alert(localStorage.getItem("is_webview"));
    setIsWebView(localStorage.getItem("is_webview"));
    const accessToken = localStorage.getItem("access_token");
    const idToken = localStorage.getItem("id_token");

    if (!accessToken || !idToken) {
      navigate("/");
    } else {
      fetchLabels();
      fetchEmails();
    }
  }, [navigate]);

  const fetchLabels = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");

      const response = await fetch("http://10.24.211.62:3002/api/labels", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (data && data.labels) {
        setLabels(data.labels);
      } else {
        setLabels([]);
      }
    } catch (error) {
      setLabels([]);
    }
  };

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");

      const response = await fetch("http://10.24.211.62:3002/api/read-email", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (data && data.emails) {
        setEmails(data.emails);
      } else {
        setEmails([]);
      }
    } catch (error) {
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");

      const response = await fetch("http://10.24.211.62:3002/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          to: emailTo,
          subject: emailSubject,
          body: emailBody,
        }),
      });

      if (response.ok) {
        alert("Email sent successfully!");
        setOpenSendModal(false);
        setEmailTo("");
        setEmailSubject("");
        setEmailBody("");
      } else {
        alert("Failed to send email.");
      }
    } catch (error) {
      alert("Error sending email.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ action: "logout" })
      );
    } else {
      navigate("/");
    }
  };

  const filteredEmails = emails.filter((email) =>
    email.labels.includes(selectedLabel)
  );

  return (
    <Container>
      <Appbar {...{ isMobile, isWebView, setDrawerOpen, navigate, setOpenSendModal, handleLogout }}/>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data-testid="drawer"
      >
        <Box width={250}>
          <List>
            <ListItem
              button
              onClick={() => setDrawerOpen(false)}
              data-testid="All-Email"
            >
              <ListItemText primary="All Email" />
            </ListItem>
            {labels.map((label) => (
              <ListItem
                button
                key={label.id}
                selected={selectedLabel === label.id}
                onClick={() => {
                  setSelectedLabel(label.id);
                  setDrawerOpen(false);
                }}
                data-testid={`label-${label.id}`}
              >
                <ListItemText primary={label.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box mt={4} display="flex" flexDirection={isMobile ? "column" : "row"}>
        {!isMobile && (
          <Box width="20%" mr={2}>
            <List>
              {labels.map((label) => (
                <ListItem
                  button
                  key={label.id}
                  selected={selectedLabel === label.id}
                  onClick={() => setSelectedLabel(label.id)}
                >
                  <ListItemText primary={label.name} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Box
          width={isMobile ? "100%" : "80%"}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Box
            width="100%"
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
            gap={2}
          >
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100%"
                data-testid="loading"
              >
                <CircularProgress />
              </Box>
            ) : filteredEmails.length > 0 ? (
              filteredEmails.map((email, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": { bgcolor: "#f5f5f5" },
                  }}
                  onClick={() => setSelectedEmail(email)}
                  data-testid="email-item"
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {email.title}
                  </Typography>
                  <Typography variant="body2">{email.subject}</Typography>
                </Paper>
              ))
            ) : (
              <Typography
                variant="body2"
                color="textSecondary"
                data-testid="no-emails"
              >
                No emails found.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Email Details Modal */}
      <Modal
        open={!!selectedEmail}
        onClose={() => setSelectedEmail(null)}
        data-testid="email-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 3,
            boxShadow: 24,
            width: "80%",
            maxWidth: 600,
            borderRadius: 2,
          }}
        >
          {selectedEmail && (
            <>
              <Typography variant="h6" fontWeight="bold">
                {selectedEmail.title}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                {selectedEmail.subject}
              </Typography>
              <Box
                sx={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  p: 2,
                  border: "1px solid #ddd",
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: selectedEmail.body }} />
              </Box>
              <Button
                onClick={() => setSelectedEmail(null)}
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                data-testid="close-modal"
              >
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>

      {/* Send Email Modal */}
      <Modal
        open={openSendModal}
        onClose={() => setOpenSendModal(false)}
        data-testid="send-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 3,
            boxShadow: 24,
            width: "80%",
            maxWidth: 600,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Send Email
          </Typography>

          <TextField
            label="To"
            fullWidth
            sx={{ mb: 2 }}
            value={emailTo}
            onChange={(e) => setEmailTo(e.target.value)}
            data-testid="email-to"
          />
          <TextField
            label="Subject"
            fullWidth
            sx={{ mb: 2 }}
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            data-testid="email-subject"
          />
          <TextField
            label="Body"
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 2 }}
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            data-testid="email-body"
          />

          <Button
            onClick={sendEmail}
            variant="contained"
            color="primary"
            data-testid="send-email"
          >
            Send
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default GmailDashboard;
