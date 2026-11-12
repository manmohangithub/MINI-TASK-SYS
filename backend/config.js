const crypto = require("crypto");

// Set JWT_SECRET in Render for a stable signing key across restarts.
// The fallback lets local development start without additional configuration.
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString("hex");

if (!process.env.JWT_SECRET) {
  console.warn("JWT_SECRET is not set. Tokens will become invalid after the server restarts.");
}

module.exports = { JWT_SECRET };
