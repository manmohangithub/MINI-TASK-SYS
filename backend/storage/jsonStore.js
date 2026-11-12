const fs = require("fs/promises");
const path = require("path");

// JSON files replace the previous PostgreSQL/Sequelize database.
// On Render, set DATA_DIR to the mount path of a persistent disk if you need
// the files to survive service restarts and redeploys.
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "data");

async function ensureFile(fileName) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const filePath = path.join(DATA_DIR, fileName);

  try {
    await fs.access(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    try {
      await fs.writeFile(filePath, "[]\n", { encoding: "utf8", flag: "wx" });
    } catch (createError) {
      // Another request may have created the file at the same time.
      if (createError.code !== "EEXIST") throw createError;
    }
  }

  return filePath;
}

async function readCollection(fileName) {
  const filePath = await ensureFile(fileName);

  try {
    const contents = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(contents || "[]");
    if (!Array.isArray(parsed)) {
      throw new Error(`${fileName} must contain a JSON array`);
    }
    return parsed;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`${fileName} contains invalid JSON. Restore a valid backup before restarting.`);
    }
    throw error;
  }
}

async function writeCollection(fileName, records) {
  const filePath = await ensureFile(fileName);
  const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(temporaryPath, `${JSON.stringify(records, null, 2)}\n`, "utf8");
  await fs.rename(temporaryPath, filePath);
}

module.exports = {
  readUsers: () => readCollection("users.json"),
  writeUsers: (users) => writeCollection("users.json", users),
  readTasks: () => readCollection("tasks.json"),
  writeTasks: (tasks) => writeCollection("tasks.json", tasks),
  dataDirectory: DATA_DIR,
};
