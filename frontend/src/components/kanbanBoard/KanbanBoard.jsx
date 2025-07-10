import React, { useState } from "react";
import "./KanbanBoard.css";
import TaskCard from "../taskCard/Taskcard";

export default function KanbanBoard({ tasks, onStatusChange }) {
  const statuses = ["Todo", "In Progress", "Done"];

  // Drag handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newStatus) => {
    const taskId = e.dataTransfer.getData("taskId");
    onStatusChange(taskId, newStatus);
  };
  return (
    <div className="kanban-board">
      {statuses.map((status) => (
        <div
          key={status}
          className="kanban-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status)}
        >
          <h3>{status}</h3>
          {tasks &&
            tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div
                  key={task._id}
                  draggable={task.status !== "Done"} // Not draggable if "Done"
                  onDragStart={(e) => handleDragStart(e, task._id)}
                >
                  <TaskCard task={task} />
                </div>
              ))}
        </div>
      ))}
    </div>
  );
}
