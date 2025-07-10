import jwt from "jsonwebtoken";
import Task from "../models/taskModel.js";
import ActionLog from "../models/actionLogModel.js";
import User from "../models/userModel.js";

export function setupSocket(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Not authorized"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.userId);

    // Create task
    socket.on("createTask", async (data) => {
      const task = await Task.create({
        ...data,
        lastModified: new Date(),
        lastModifiedBy: socket.userId,
      });

      await ActionLog.create({
        actionType: "create",
        taskId: task._id,
        performedBy: socket.userId,
        details: { task },
      });

      io.emit("taskCreated", task); // broadcast to all users
    });

    // Update task
    socket.on("updateTask", async (data) => {
      const task = await Task.findByIdAndUpdate(
        data._id,
        {
          ...data,
          lastModified: new Date(),
          lastModifiedBy: socket.userId,
        },
        { new: true }
      );
      if (!task) {
        console.log("Update failed: Task not found", data._id);
        return;
      }

      await ActionLog.create({
        actionType: "update",
        taskId: task._id,
        performedBy: socket.userId,
        details: { task },
      });

      io.emit("taskUpdated", task);
    });

    // Delete task
    socket.on("deleteTask", async (taskId) => {
      const task = await Task.findByIdAndDelete(taskId);
      if (!task) return;

      await ActionLog.create({
        actionType: "delete",
        taskId: task._id,
        performedBy: socket.userId,
        details: { title: task.title },
      });

      io.emit("taskDeleted", taskId);
    });

    //  Smart Assign
    socket.on("smartAssign", async ({ taskId }) => {
      console.log("Received smartAssign for taskId:", taskId);
      try {
        // Fetch all users and count how many tasks each has
        const allUsers = await User.find(); // make sure User is imported
        const allTasks = await Task.find();

        const userTaskCounts = allUsers.map((user) => {
          const count = allTasks.filter(
            (task) =>
              task.assignedTo?.toString() === user._id.toString() &&
              task.status !== "Done"
          ).length;
          return { user, count };
        });

        // Find user with the fewest tasks
        const leastBusyUser = userTaskCounts.sort(
          (a, b) => a.count - b.count
        )[0];

        if (!leastBusyUser) return;
        // Update the task
        const updatedTask = await Task.findByIdAndUpdate(
          taskId,
          {
            assignedTo: leastBusyUser.user._id,
            lastModified: new Date(),
            lastModifiedBy: socket.userId,
          },
          { new: true }
        );
        if (!updatedTask) {
          console.log("Task not found for updating:", taskId);
          return;
        }
        console.log("Smart assign updated task:", updatedTask);
        // Log the action
        await ActionLog.create({
          actionType: "smartAssign",
          taskId: updatedTask._id,
          performedBy: socket.userId,
          details: `assignedTo: ${leastBusyUser.user._id}`,
        });

        io.emit("taskUpdated", updatedTask);
        console.log("Emitted taskUpdated");
      } catch (err) {
        console.error("Smart assign failed:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.userId);
    });
  });
}
