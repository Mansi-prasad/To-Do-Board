import React from "react";
import "./taskCard.css";
import { socket } from "../../utils/socket";
const Taskcard = ({ task }) => {
  const handleSmartAssign = () => {
    console.log("Emitting smartAssign with taskId:", task._id);
    socket.emit("smartAssign", { taskId: task._id });

    // Listen for response (optional)
    socket.on("taskUpdated", (updatedTask) => {
      console.log("Task was updated:", updatedTask);
      // You could trigger a re-fetch or update local state here.
    });
  };
  return (
    <div className="task-card">
      <div className="task-header">
        <h4
          className={`task-title ${task.status === "Done" ? "done-title" : ""}`}
        >
          {task.title}
        </h4>
        <span
          className={`status ${task.status.toLowerCase().replace(/\s/g, "-")}`}
        >
          {task.status}
        </span>
      </div>
      <p className="task-desc">{task.description}</p>
      <div className="task-footer">
        <span className={`priority priority-${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
        {task.assignedTo && (
          <span className="assigned">Assigned to: {task.assignedTo.name}</span>
        )}
      </div>
      <div className="smart-assign-con">
        <button
          className="smart-assign"
          onClick={handleSmartAssign} // Counts how many active tasks each user has, Finds the user with the fewest, Assigns the task.
        >
          Smart Assign
        </button>
      </div>
    </div>
  );
};

export default Taskcard;
