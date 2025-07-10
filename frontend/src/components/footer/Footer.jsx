import React from "react";
import "./footer.css";
const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>
          &copy; {new Date().getFullYear()} My Task Manager. All rights
          reserved.
        </p>
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
