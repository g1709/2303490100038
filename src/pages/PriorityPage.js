import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  Chip,
  Box,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";

const API_URL = "http://4.224.186.213/evaluation-service/notifications";
const BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJnczI0NDI2MTZAZ21haWwuY29tIiwiZXhwIjoxNzgxMTcxNDU0LCJpYXQiOjE3ODExNzA1NTQsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIzZWZkMjZmMS05ZGFjLTRmYjMtOGJjMi1kNDI0Njc5OTZiMTQiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJnYXVyYXYgc2FodSIsInN1YiI6ImUxYzQ4MjJiLTJhYmItNDJjMC04NjMxLWI3OTg2NGNmZjllZiJ9LCJlbWFpbCI6ImdzMjQ0MjYxNkBnbWFpbC5jb20iLCJuYW1lIjoiZ2F1cmF2IHNhaHUiLCJyb2xsTm8iOiIyMzAzNDkwMTAwMDM4IiwiYWNjZXNzQ29kZSI6IkJBVkRTaCIsImNsaWVudElEIjoiZTFjNDgyMmItMmFiYi00MmMwLTg2MzEtYjc5ODY0Y2ZmOWVmIiwiY2xpZW50U2VjcmV0IjoiQ1VEU0FXTkRGRUFibndLSiJ9.k-OoQbdRJUEp77yfiqMNjuBcsn7Ykrnr5_4BrVd8sX0";

const TYPE_WEIGHT = { Placement: 3, Result: 2, Event: 1 };
const TYPE_COLOR = {
  Placement: "success",
  Result: "primary",
  Event: "warning",
};
const TYPE_EMOJI = { Placement: "💼", Result: "📊", Event: "🎉" };

function getScore(n) {
  return (TYPE_WEIGHT[n.Type] ?? 0) * 1e13 + new Date(n.Timestamp).getTime();
}

function getTopN(notifications, n) {
  return [...notifications]
    .sort((a, b) => getScore(b) - getScore(a))
    .slice(0, n);
}

export default function PriorityPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topN, setTopN] = useState(10);
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

  const top = getTopN(notifications, topN);

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
        🏆 Priority Inbox
      </Typography>
      <TextField
        label="Show Top N"
        type="number"
        value={topN}
        onChange={(e) => setTopN(Math.max(1, parseInt(e.target.value) || 1))}
        sx={{ mb: 3, width: 150 }}
        inputProps={{ min: 1, max: 50 }}
      />
      {top.map((n, i) => (
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
                #{i + 1} {TYPE_EMOJI[n.Type]} {n.Message}
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
