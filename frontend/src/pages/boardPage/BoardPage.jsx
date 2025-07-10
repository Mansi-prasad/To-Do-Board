import React, { useEffect, useState } from "react";
import "./boardPage.css";
import KanbanBoard from "../../components/kanbanBoard/KanbanBoard";
import ActivityLog from "../../components/activityPanel/ActivityLog";
import {
  getUserTasksApi,
  updateTaskStatusApi,
  getActionsApi,
} from "../../utils/api";
import { socket } from "../../utils/socket";
import { toast } from "react-hot-toast";

export default function BoardPage() {
  const [tasks, setTasks] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }, []);
  useEffect(() => {
    loadBoardData();

    socket.on("taskCreated", (task) => {
      setTasks((prev) => [...prev, task]);
      addActivity(`Task "${task.title}" created.`);
    });

    socket.on("taskUpdated", (updatedTask) => {
      console.log("Received taskUpdated:", updatedTask);
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
      addActivity(`Task "${updatedTask.title}" updated.`);
    });

    socket.on("taskDeleted", (id) => {
      setTasks((prev) => prev.filter((t) => t._id !== id));
      addActivity(`Task deleted.`);
    });

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  // Load tasks + activities
  const loadBoardData = async () => {
    try {
      setLoading(true);
      const [fetchedTasks, fetchedActivities] = await Promise.all([
        getUserTasksApi(),
        getActionsApi(),
      ]);
      setTasks(fetchedTasks);
      setActivity(
        fetchedActivities.map((act) => ({
          message: formatActivityMessage(act),
          timestamp: act.timestamp,
        }))
      );
    } catch (err) {
      console.error("Error loading board data:", err);
      toast.error("Failed to load board data.");
    } finally {
      setLoading(false);
    }
  };
  // format activity log messages
  const formatActivityMessage = (act) => {
    const who = act.performedBy?.name || act.performedBy?.username || "Someone";
    return `${who}: ${act.details || act.actionType}`;
  };
  // Add new activity locally
  const addActivity = (message) => {
    setActivity((prev) => [{ message, timestamp: new Date() }, ...prev]);
  };

  // Handle drag-drop status change
  const handleStatusChange = async (taskId, newStatus) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await updateTaskStatusApi(taskId, newStatus);
      toast.success("Task status updated.");
      // Optionally reload actions
      const updatedActivities = await getActionsApi();
      setActivity(
        updatedActivities.map((act) => ({
          message: formatActivityMessage(act),
          timestamp: act.timestamp,
        }))
      );
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status.");
      // Revert tasks if needed
      loadBoardData();
    }
  };

  if (loading) return <div>Loading board...</div>;
  return (
    <div className="board-page">
      <section className="kanban-section">
        <KanbanBoard tasks={tasks} onStatusChange={handleStatusChange} />
      </section>
      <aside className="activity-section">
        <ActivityLog activities={activity} />
      </aside>
    </div>
  );
}
