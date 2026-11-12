const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { dataDirectory } = require("./storage/jsonStore");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({
    message: "Mini SaaS Task API is running",
    storage: "JSON files (no database)",
  });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

app.use((err, req, res, next) => {
  console.error("Unhandled request error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`JSON file storage directory: ${dataDirectory}`);
});
