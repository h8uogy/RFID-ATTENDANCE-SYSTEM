const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🔐 Teacher secret code
const TEACHER_SECRET_CODE = "TEACH123";

// ===============================
// SIGNUP
// ===============================
app.post("/signup", (req, res) => {
  const { role, name, section, email, parentEmail, teacherCode } = req.body;

  if (!role || !name || !section) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (role === "teacher" && teacherCode !== TEACHER_SECRET_CODE) {
    return res.status(403).json({ message: "Invalid teacher code" });
  }

  // Check if user already exists
  db.get(
    "SELECT * FROM users WHERE name = ? AND role = ? AND section = ?",
    [name, role, section],
    (err, existingUser) => {
      if (err) {
        console.error("❌ Signup check error:", err.message);
        return res.status(500).json({ message: "Database error" });
      }

      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const sql = `
        INSERT INTO users (name, role, section, email, parent_email)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.run(
        sql,
        [name, role, section, email || null, parentEmail || null],
        function (err) {
          if (err) {
            console.error("❌ Signup error:", err.message);
            return res.status(500).json({ message: "Database error" });
          }

          res.json({
            message: "Signup successful",
            userId: this.lastID,
            role,
            name,
            section
          });
        }
      );
    }
  );
});

// ===============================
// LOGIN
// ===============================
app.post("/login", (req, res) => {
  const { name, role, section } = req.body;

  if (!name || !role || !section) {
    return res.status(400).json({ message: "Missing login fields" });
  }

  db.get(
    "SELECT * FROM users WHERE name = ? AND role = ? AND section = ?",
    [name, role, section],
    (err, user) => {
      if (err) {
        console.error("❌ Login error:", err.message);
        return res.status(500).json({ message: "Database error" });
      }

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json({
        message: "Login successful",
        id: user.id,
        name: user.name,
        role: user.role,
        section: user.section,
        email: user.email
      });
    }
  );
});

// ===============================
// ATTENDANCE (ESP32 → Backend)
// ===============================
app.post("/attendance", (req, res) => {
  const { uid, name, section } = req.body;

  if (!uid || !name) {
    return res.status(400).json({ message: "Missing attendance data" });
  }

  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  let status = "Absent";
  if (hour < 8) status = "Present";
  else if (hour === 8 && minute <= 15) status = "Late";

  db.run(
    `
    INSERT INTO attendance (uid, name, section, status)
    VALUES (?, ?, ?, ?)
    `,
    [uid, name, section || "Unknown", status],
    (err) => {
      if (err) {
        console.error("❌ Attendance error:", err.message);
        return res.status(500).json({ message: "Database error" });
      }

      res.json({ message: "Attendance recorded", status });
    }
  );
});

// ===============================
// GET ATTENDANCE (Teacher Dashboard)
// ===============================
app.get("/attendance", (req, res) => {
  const { section } = req.query;

  if (!section) {
    return res.status(400).json({ message: "Section is required" });
  }

  db.all(
    `
    SELECT * FROM attendance
    WHERE section = ?
    ORDER BY timestamp DESC
    `,
    [section],
    (err, rows) => {
      if (err) {
        console.error("❌ Fetch attendance error:", err.message);
        return res.status(500).json({ message: "Database error" });
      }

      res.json(rows);
    }
  );
});

// ===============================
// SERVER START
// ===============================
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
