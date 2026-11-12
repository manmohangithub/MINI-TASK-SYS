const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");
const { readUsers, writeUsers } = require("../storage/jsonStore");
const { JWT_SECRET } = require("../config");

exports.signup = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Enter a valid email address" });
    }

    const users = await readUsers();
    if (users.some((user) => user.email === email)) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    // Never store a plain-text password.
    const passwordHash = await bcrypt.hash(password, 12);
    const user = {
      id: randomUUID(),
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    await writeUsers(users);

    return res.status(201).json({ message: "Account created successfully. Please log in." });
  } catch (error) {
    console.error("Signup failed:", error);
    return res.status(500).json({ error: "Unable to create account. Please try again." });
  }
};

exports.login = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const users = await readUsers();
    const user = users.find((item) => item.email === email);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ error: "Unable to log in. Please try again." });
  }
};
