import React from 'react'
import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function Appbar({ isMobile, isWebView, setDrawerOpen, navigate, setOpenSendModal, handleLogout }) {
    return (
        !JSON.parse(isWebView) && (
            <AppBar position="static" data-testid="appbar">
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setDrawerOpen(true)}
                            data-testid="menu-button"
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography
                        variant="h6"
                        sx={{ flexGrow: 1, cursor: "pointer" }}
                        onClick={() => navigate("/dashboard")}
                        data-testid="dashboard-title"
                    >
                        Gmail Dashboard
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={() => setOpenSendModal(true)}
                        sx={{ marginRight: 2 }}
                        data-testid="send-email-button"
                    >
                        Send Email
                    </Button>
                    <Button
                        color="inherit"
                        onClick={handleLogout}
                        data-testid="logout-button"
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
        )
    );
}