// ========================================
// server.js - Ready for Render deployment
// ========================================

const express = require("express");
const path = require("path");
const session = require("express-session");
const db = require("./db"); // SQLite database connection

const app = express();

// ===============================
// Dynamic Port (required for Render)
// ===============================
const PORT = process.env.PORT || 3000;

// ===============================
// Middleware
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.static(path.join(__dirname, "public"))); // Serve static files (HTML, CSS, JS, images)

// ===============================
// Session setup
// ===============================
app.use(session({
  secret: "secretKey",        // Secret key for session encryption
  resave: false,              // Do not save session if unmodified
  saveUninitialized: true     // Save new sessions
}));

// ===============================
// Routes
// ===============================

// Test route
app.get("/test", (req, res) => {
  res.send("TEST ROUTE WORKS ✅");
});

// ===============================
// CREATE reservation
// ===============================
app.post("/reserve", (req, res) => {
  const { name, email, persons, date, time, message } = req.body;

  const query = `
    INSERT INTO reservations (name, email, persons, date, time, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [name, email, persons, date, time, message], function (err) {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    // return created reservation id
    res.json({
      id: this.lastID,
      name,
      email,
      persons,
      date,
      time,
      message
    });
  });
});

// ===============================
// READ reservation
// ===============================
app.get("/reserve/:id", (req, res) => {
  const { id } = req.params;

  db.get(
    "SELECT * FROM reservations WHERE id = ?",
    [id],
    (err, row) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(row);
    }
  );
});

// ===============================
// UPDATE reservation
// ===============================
app.put("/reserve/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, persons, date, time, message } = req.body;

  const query = `
    UPDATE reservations
    SET name=?, email=?, persons=?, date=?, time=?, message=?
    WHERE id=?
  `;

  db.run(
    query,
    [name, email, persons, date, time, message, id],
    function (err) {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ updated: true });
    }
  );
});

// ===============================
// DELETE reservation
// ===============================
app.delete("/reserve/:id", (req, res) => {
  const { id } = req.params;

  db.run(
    "DELETE FROM reservations WHERE id = ?",
    [id],
    function (err) {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ deleted: true });
    }
  );
});
// GET home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// GET register page
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public/register.html"));
});

// POST register
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  db.run(query, [name, email, password], function(err) {
    if(err){
      if(err.message.includes("UNIQUE constraint failed")){
        return res.send("Email already registered"); // Duplicate email
      }
      return res.send("Database error"); // Other DB errors
    }
    res.redirect("/login"); // Redirect after successful registration
  });
});

// GET login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login.html"));
});

// POST login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
  db.get(query, [email, password], (err, user) => {
    if(err) return res.send("Database error"); // DB error

    if(user){
      req.session.user = user.name; // Save user name in session
      res.redirect("/"); // Redirect to home
    } else {
      res.send("Invalid email or password"); // Invalid credentials
    }
  });
});

// GET logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/"); // Redirect after session destroyed
  });
});

// GET session status
app.get("/session-status", (req, res) => {
  if(req.session.user){
    res.json({ loggedIn: true, user: req.session.user }); // User logged in
  } else {
    res.json({ loggedIn: false }); // User not logged in
  }
});


// ===============================
// RESERVATIONS CRUD ROUTES
// ===============================

// CREATE reservation
app.post("/reserve", (req, res) => {
  const { name, email, persons, date, time, message } = req.body;

  const query = `
    INSERT INTO reservations (name, email, persons, date, time, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [name, email, persons, date, time, message], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ success: true });
  });
});

// READ all reservations
app.get("/reserve", (req, res) => {
  db.all("SELECT * FROM reservations", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});

// READ single reservation
app.get("/reserve/:id", (req, res) => {
  const id = req.params.id;

  db.get("SELECT * FROM reservations WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(row);
  });
});

// UPDATE reservation
app.put("/reserve/:id", (req, res) => {
  const id = req.params.id;
  const { name, email, persons, date, time, message } = req.body;

  const query = `
    UPDATE reservations
    SET name = ?, email = ?, persons = ?, date = ?, time = ?, message = ?
    WHERE id = ?
  `;

  db.run(
    query,
    [name, email, persons, date, time, message, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ success: true });
    }
  );
});

// DELETE reservation
app.delete("/reserve/:id", (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM reservations WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ success: true });
  });
});

// ===============================
// Start server
// ===============================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
