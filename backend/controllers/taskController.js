import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import ActionLog from "../models/actionLogModel.js";
//create a nes task
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required." });
    }

    // If task already exists

    const existingTask = await Task.findOne({
      title,
      assignedTo: req.user._id,
    });

    if (existingTask) {
      return res.status(409).json({
        message: "Task with this title already exists.",
      });
    }
    const task = new Task({
      title,
      description,
      status,
      priority,
      assignedTo: req.user._id,
      lastModified: new Date(),
      lastModifiedBy: req.userId,
    });

    await task.save();

    await ActionLog.create({
      actionType: "CREATED_TASK",
      taskId: task._id,
      performedBy: req.user._id,
      details: `Created task "${title}"`,
    });

    res.status(201).json({ task, message: "Task created successfully!" });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Failed to create task." });
  }
};

// get all tasks
export const getAllTask = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user._id,
    }).populate("assignedTo", "name email");
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks." });
  }
};

// Update task (doubt check later)
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const assignedTo = req.user._id;
    const { title, description, priority, status } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, assignedTo },
      {
        title,
        description,
        priority,
        status,
        lastModified: new Date(),
        lastModifiedBy: req.user._id,
      },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(403).json({
        message: "You are not authorized to update this task.",
      });
    }
    await ActionLog.create({
      actionType: "UPDATED_TASK",
      taskId: updatedTask._id,
      performedBy: req.user._id,
      details: `Updated task "${updatedTask.title}"`,
    });
    res
      .status(200)
      .json({ updatedTask, message: "Task updated successfully!" });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Failed to update task." });
  }
};

// delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }
    await Task.findByIdAndDelete(id);
    await ActionLog.create({
      actionType: "DELETED_TASK",
      taskId: task._id,
      performedBy: req.user._id,
      details: `Deleted task "${task.title}"`,
    });
    res.json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Failed to delete task." });
  }
};

// change task status

export const changeTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status) {
      return res.status(400).json({ message: "Status is required." });
    }

    // Find the task
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const oldStatus = task.status;
    // Update status
    task.status = status;
    task.lastModified = new Date();
    task.lastModifiedBy = req.user._id;
    await task.save();

    // Log the status change
    await ActionLog.create({
      actionType: "STATUS_CHANGED",
      taskId: task._id,
      performedBy: req.user._id,
      details: `Moved task "${task.title}" from "${oldStatus}" to "${status}"`,
    });

    res.status(200).json({
      updatedTask: task,
      message: `Task status changed to "${status}".`,
    });
  } catch (error) {
    console.error("Error changing task status:", error);
    res.status(500).json({ message: "Failed to change status." });
  }
};
