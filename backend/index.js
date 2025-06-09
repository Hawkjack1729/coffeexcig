import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

app.use(cors());
app.use(express.json());

// Middleware to validate shared password
const validateSharedPassword = (req, res, next) => {
  const { sharedPassword } = req.body;
  if (sharedPassword !== process.env.SHARED_PASSWORD) {
    return res.status(401).json({ error: "Invalid shared password" });
  }
  next();
};

// Check shared password
app.post("/api/validate-password", validateSharedPassword, (req, res) => {
  res.json({ success: true });
});

// Validate allowed email
app.post("/api/validate-email", (req, res) => {
  const { email } = req.body;
  const allowedEmails = [
    process.env.ALLOWED_EMAIL_1,
    process.env.ALLOWED_EMAIL_2,
  ];

  if (!allowedEmails.includes(email)) {
    return res.status(403).json({ error: "Email not authorized for this app" });
  }

  res.json({ success: true });
});

// Get user recordings
app.get("/api/recordings/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("recordings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update online status
app.post("/api/user-status", async (req, res) => {
  try {
    const { userId, isOnline } = req.body;

    const { error } = await supabase.from("user_status").upsert({
      user_id: userId,
      is_online: isOnline,
      last_seen: new Date().toISOString(),
    });

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get partner's online status
app.get("/api/partner-status/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const allowedEmails = [
      process.env.ALLOWED_EMAIL_1,
      process.env.ALLOWED_EMAIL_2,
    ];

    // Get all users except current user
    const { data, error } = await supabase
      .from("user_status")
      .select("*")
      .neq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    res.json(data || { is_online: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`💕 Love Server running on port ${PORT}`);
});
