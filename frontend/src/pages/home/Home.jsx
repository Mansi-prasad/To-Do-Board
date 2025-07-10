import React, { useEffect, useState } from "react";
import "./home.css";
import { toast } from "react-hot-toast";
import TaskCard from "../../components/taskCard/Taskcard";
import {
  getUserTasksApi,
  updateTaskApi,
  deleteTaskApi,
  createTaskApi,
} from "../../utils/api";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Todo",
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await getUserTasksApi();
    console.log("getUserTasks() returned:", data);
    setTasks(data);
  };

  const handleCreate = () => {
    setEditTask(null);
    setForm({
      title: "",
      description: "",
      priority: "Medium",
      status: "Todo",
    });
    setModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
    });
    setModalOpen(true);
  };

  const handleDelete = async (task) => {
    if (window.confirm(`Delete task "${task.title}"?`)) {
      await deleteTaskApi(task._id);
      loadTasks();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTask) {
        const res = await updateTaskApi(editTask._id, form);
        toast.success(res.message || "success");
      } else {
        const res = await createTaskApi(form);
        toast.success(res.message || "success");
      }
      setModalOpen(false);
      loadTasks();
    } catch (err) {
      console.error("Error!: ", err);
      const errMsg = err.response?.data?.message || "An error occured.";
      toast.error(errMsg);
    }
  };
  console.log("tasks: ", tasks);
  return (
    <div className="home-page">
      <div className="btn-con">
        <button onClick={handleCreate} className="create-btn">
          Create Task
        </button>
      </div>
      <div className="cards">
        {tasks.length === 0 ? (
          <div className="task-not-found">
            <p>Task not found!</p>
            <p>Create your first task</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="task-wrapper">
              <TaskCard task={task} />
              <div className="task-actions">
                <button onClick={() => handleEdit(task)} className="edit-btn">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="cancel-btn-con">
              <button
                className="cancel-btn"
                onClick={() => setModalOpen(false)}
              >
                X
              </button>
            </div>
            <h3>{editTask ? "Edit Task" : "Create Task"}</h3>
            <form onSubmit={handleSubmit} className="form">
              <div>
                <input
                  type="text"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="fields name"
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder="Description"
                  rows={5}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="fields desc"
                  required
                />
              </div>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="fields"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="fields"
              >
                <option>Todo</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
              <div className="modal-actions">
                <button type="submit">{editTask ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
