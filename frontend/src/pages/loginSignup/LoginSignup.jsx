import React, { useState } from "react";
import "./loginSignup.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { userLoginApi, userRegisterApi } from "../../utils/api";
const LoginSignup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signIn, setSigIn] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (signIn) {
        res = await userLoginApi({ email, password });
      } else {
        res = await userRegisterApi({ name, email, password });
      }

      if (res && res.token) {
        localStorage.setItem("token", res.token);
        toast.success(
          signIn ? "Login Successgully!" : "Register Successfully!"
        );
        setName("");
        setEmail("");
        setPassword("");
        navigate("/tasks/list");
      } else {
        console.error("Server Error! : ", res?.message);
        toast.error(res?.message);
      }
    } catch (error) {
      console.error("Error: ", error.message);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{signIn ? "Sign In" : "Sign Up"}</h2>
        {signIn ? (
          ""
        ) : (
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              required
            />
          </div>
        )}
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
        <button type="submit">{signIn ? "Sign In" : "Sign Up"}</button>
        <div className="signup-link">
          {signIn ? (
            <p>
              Don't have an account?{" "}
              <span onClick={() => setSigIn(!signIn)}>Sign up</span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span onClick={() => setSigIn(!signIn)}>Sign in</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginSignup;
