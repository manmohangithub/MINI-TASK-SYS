const { randomUUID } = require("crypto");
const { readTasks, writeTasks } = require("../storage/jsonStore");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await readTasks();
    return res.json(
      tasks
        .filter((task) => task.userId === req.user.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
  } catch (error) {
    console.error("Get tasks failed:", error);
    return res.status(500).json({ error: "Unable to load tasks" });
  }
};

exports.createTask = async (req, res) => {
  try {
    const title = String(req.body.title || "").trim();
    if (!title) return res.status(400).json({ error: "Title required" });

    const tasks = await readTasks();
    const task = {
      id: randomUUID(),
      title,
      status: "Pending",
      userId: req.user.id,
      createdAt: new Date().toISOString(),
    };

    tasks.push(task);
    await writeTasks(tasks);
    return res.status(201).json(task);
  } catch (error) {
    console.error("Create task failed:", error);
    return res.status(500).json({ error: "Unable to create task" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Pending", "Completed"].includes(status)) {
      return res.status(400).json({ error: "Status must be Pending or Completed" });
    }

    const tasks = await readTasks();
    const task = tasks.find(
      (item) => item.id === req.params.id && item.userId === req.user.id
    );
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.status = status;
    task.updatedAt = new Date().toISOString();
    await writeTasks(tasks);
    return res.json(task);
  } catch (error) {
    console.error("Update task failed:", error);
    return res.status(500).json({ error: "Unable to update task" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const tasks = await readTasks();
    const index = tasks.findIndex(
      (item) => item.id === req.params.id && item.userId === req.user.id
    );
    if (index === -1) return res.status(404).json({ error: "Task not found" });

    tasks.splice(index, 1);
    await writeTasks(tasks);
    return res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task failed:", error);
    return res.status(500).json({ error: "Unable to delete task" });
  }
};
