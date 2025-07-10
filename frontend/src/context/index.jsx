import { createContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { userAuthApi } from "../utils/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until we verify
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        navigate("/auth");
        return;
      }

      try {
        const res = await userAuthApi();
        if (res?.success && res?.userInfo) {
          setUser(res.userInfo);
          setLoading(false);

          // If user is on "/" or "/auth", redirect them to tasks
          if (location.pathname === "/" || location.pathname === "/auth") {
            navigate("/tasks/list");
          }
        } else {
          localStorage.removeItem("token");
          setLoading(false);
          navigate("/auth");
        }
      } catch (err) {
        console.error("Error verifying user:", err);
        localStorage.removeItem("token");
        setLoading(false);
        navigate("/auth");
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/auth");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
