import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import NotificationsPage from "./pages/NotificationsPage";
import PriorityPage from "./pages/PriorityPage";

function NavBar() {
  const location = useLocation();
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1a237e" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          🔔 Campus Notifications
        </Typography>
        <Button
          color="inherit"
          component={Link}
          to="/"
          sx={{
            fontWeight: location.pathname === "/" ? "bold" : "normal",
            textDecoration: location.pathname === "/" ? "underline" : "none",
          }}
        >
          All Notifications
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/priority"
          sx={{
            fontWeight: location.pathname === "/priority" ? "bold" : "normal",
            textDecoration:
              location.pathname === "/priority" ? "underline" : "none",
          }}
        >
          Priority Inbox
        </Button>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <Router>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<NotificationsPage />} />
          <Route path="/priority" element={<PriorityPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
