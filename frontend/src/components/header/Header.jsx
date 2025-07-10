import React, { useContext } from "react";
import "./header.css";
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { AuthContext } from "../../context";
const Header = () => {
  const { logout } = useContext(AuthContext);
  return (
    <header className="app-header">
      <div className="header-left">
        <Link to="/" className="app-logo">
          My Task Manager
        </Link>
      </div>
      <nav className="header-nav">
        <Link to="/tasks/list">Tasks</Link>
        <Link to="/tasks/board">Board</Link>
        <button onClick={logout} className="logout-button">
          Logout <FiLogOut />
        </button>
      </nav>
    </header>
  );
};

export default Header;
