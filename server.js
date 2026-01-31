const express = require("express");
const path = require("path");
const session = require("express-session");
const db = require("./db"); // SQLite bağlantısı

const app = express();
const PORT = process.env.PORT || 3000;

// ===============================
// Middleware
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// Session Setup
// ===============================
app.use(session({
  secret: "secretKey", 
  resave: false,
  saveUninitialized: false, // Daha güvenli bir tercih
  cookie: { secure: false } // HTTP için false, HTTPS (Render) için ayar gerekebilir
}));

// ===============================
// Auth Routes (Login / Register)
// ===============================

app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public/login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "public/register.html")));

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  db.run(query, [name, email, password], function(err) {
    if (err) {
      if (err.message.includes("UNIQUE")) return res.status(400).send("Email already registered");
      return res.status(500).send("Database error");
    }
    res.redirect("/login");
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
  db.get(query, [email, password], (err, user) => {
    if (err) return res.status(500).send("Database error");
    if (user) {
      req.session.user = user.name;
      req.session.userEmail = user.email; // Kritik: Email'i session'a kaydetmelisin
      res.redirect("/");
    } else {
      res.status(401).send("Invalid credentials");
    }
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

app.get("/session-status", (req, res) => {
  res.json(req.session.user ? { loggedIn: true, user: req.session.user } : { loggedIn: false });
});

// ===============================
// Reservation CRUD Routes
// ===============================

// 1. REZERVASYON OLUŞTUR (Create)
app.post("/reserve", (req, res) => {
  if (!req.session.userEmail) return res.status(401).json({ error: "Giriş yapmalısınız" });
  
  const { name, persons, date, time, message } = req.body;
  const email = req.session.userEmail;
  const query = `INSERT INTO reservations (name, email, persons, date, time, message) VALUES (?, ?, ?, ?, ?, ?)`;

  db.run(query, [name, email, persons, date, time, message], function(err) {
    if (err) return res.status(500).json({ error: "Veritabanı hatası" });
    res.json({ success: true, id: this.lastID });
  });
});

// 2. KULLANICIYA AİT TÜM REZERVASYONLARI GETİR (Read)
app.get("/my-reservations", (req, res) => {
  if (!req.session.userEmail) return res.status(401).json({ error: "Yetkisiz erişim" });

  // Not: Giriş yapan kişinin sadece kendi emailine ait verileri görmesi için email üzerinden filtreliyoruz
  db.all("SELECT * FROM reservations WHERE email = ?", [req.session.userEmail], (err, rows) => {
    if (err) return res.status(500).json({ error: "Veritabanı hatası" });
    res.json(rows);
  });
});

// server.js içindeki UPDATE kısmını 
app.put("/reserve/:id", (req, res) => {
  if (!req.session.userEmail) return res.status(401).json({ error: "Yetkisiz" });

  const { persons, date, time } = req.body;
  const query = `UPDATE reservations SET persons=?, date=?, time=? WHERE id=?`;

  db.run(query, [persons, date, time, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: "Güncelleme hatası" });
    res.json({ success: true });
  });
});
// 4. REZERVASYON SİL (Delete)
// Frontend'den fetch(`/reserve/${id}`, { method: 'DELETE' }) şeklinde çağrılmalı
app.delete("/reserve/:id", (req, res) => {
  if (!req.session.userEmail) return res.status(401).json({ error: "Yetkisiz" });

  db.run("DELETE FROM reservations WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: "Silme hatası" });
    res.json({ success: true });
  });
});

// ===============================
// Start Server
// ===============================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});