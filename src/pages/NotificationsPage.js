import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  Chip,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const API_URL = "http://4.224.186.213/evaluation-service/notifications";
const BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJnczI0NDI2MTZAZ21haWwuY29tIiwiZXhwIjoxNzgxMTcxNDU0LCJpYXQiOjE3ODExNzA1NTQsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIzZWZkMjZmMS05ZGFjLTRmYjMtOGJjMi1kNDI0Njc5OTZiMTQiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJnYXVyYXYgc2FodSIsInN1YiI6ImUxYzQ4MjJiLTJhYmItNDJjMC04NjMxLWI3OTg2NGNmZjllZiJ9LCJlbWFpbCI6ImdzMjQ0MjYxNkBnbWFpbC5jb20iLCJuYW1lIjoiZ2F1cmF2IHNhaHUiLCJyb2xsTm8iOiIyMzAzNDkwMTAwMDM4IiwiYWNjZXNzQ29kZSI6IkJBVkRTaCIsImNsaWVudElEIjoiZTFjNDgyMmItMmFiYi00MmMwLTg2MzEtYjc5ODY0Y2ZmOWVmIiwiY2xpZW50U2VjcmV0IjoiQ1VEU0FXTkRGRUFibndLSiJ9.k-OoQbdRJUEp77yfiqMNjuBcsn7Ykrnr5_4BrVd8sX0";

const TYPE_COLOR = {
  Placement: "success",
  Result: "primary",
  Event: "warning",
};
const TYPE_EMOJI = { Placement: "💼", Result: "📊", Event: "🎉" };

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [viewed, setViewed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("viewed") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    fetch(API_URL, { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } })
      .then((r) => r.json())
      .then((data) => {
        const notifs = Array.isArray(data.notifications)
          ? data.notifications
          : [];
        setNotifications(notifs);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const markViewed = (id) => {
    const updated = [...new Set([...viewed, id])];
    setViewed(updated);
    localStorage.setItem("viewed", JSON.stringify(updated));
  };

  const filtered =
    filter === "All"
      ? notifications
      : notifications.filter((n) => n.Type === filter);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        Error: {error}
      </Alert>
    );

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        All Notifications ({filtered.length})
      </Typography>
      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>Filter by Type</InputLabel>
        <Select
          value={filter}
          label="Filter by Type"
          onChange={(e) => setFilter(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
        </Select>
      </FormControl>
      {filtered.length === 0 && (
        <Alert severity="info">No notifications found.</Alert>
      )}
      {filtered.map((n) => (
        <Card
          key={n.ID}
          onClick={() => markViewed(n.ID)}
          sx={{
            mb: 2,
            cursor: "pointer",
            backgroundColor: viewed.includes(n.ID) ? "#f5f5f5" : "#fff",
            border: viewed.includes(n.ID)
              ? "1px solid #ddd"
              : "2px solid #1a237e",
            opacity: viewed.includes(n.ID) ? 0.7 : 1,
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={viewed.includes(n.ID) ? "normal" : "bold"}
              >
                {TYPE_EMOJI[n.Type]} {n.Message}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Chip label={n.Type} color={TYPE_COLOR[n.Type]} size="small" />
                {!viewed.includes(n.ID) && (
                  <Chip label="NEW" color="error" size="small" />
                )}
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {n.Timestamp}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
