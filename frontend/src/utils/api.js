import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// USER
// Register user
export const userRegisterApi = async (formData) => {
  const response = await axios.post(
    `${backendUrl}/api/user/register`,
    formData
  );
  return response?.data;
};

// Login user
export const userLoginApi = async (formData) => {
  const response = await axios.post(`${backendUrl}/api/user/login`, formData);
  return response?.data;
};
// Auth user (verify token)
export const userAuthApi = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${backendUrl}/api/user/auth`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response?.data;
};

// ACTIONS
// get actions
export const getActionsApi = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${backendUrl}/api/actions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

// TaskS
// get user tasks
export const getUserTasksApi = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${backendUrl}/api/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response?.data;
};

// create task
export const createTaskApi = async (task) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${backendUrl}/api/tasks`, task, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response?.data;
};

// update task
export const updateTaskApi = async (id, task) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${backendUrl}/api/tasks/${id}`, task, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response?.data;
};

// delete task
export const deleteTaskApi = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${backendUrl}/api/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response?.data;
};

// update task status (drag-drop)

export const updateTaskStatusApi = async (id, status) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `${backendUrl}/api/tasks/${id}/status`,
    { status },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response?.data;
};
