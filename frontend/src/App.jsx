import React, { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout.jsx";
import Home from "./pages/home/Home.jsx";
import BoardPage from "./pages/boardPage/BoardPage";
import LoginSignup from "./pages/loginSignup/LoginSignup";
import { Toaster } from "react-hot-toast";
const App = () => {
  return (
    <>
      <Toaster />
      <div className="app-container">
        <main className="main-content">
          <Routes>
            <Route path="/auth" element={<LoginSignup />} />
            <Route path="/tasks" element={<Layout />}>
              <Route path="list" element={<Home />} />
              <Route path="board" element={<BoardPage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </>
  );
};
export default App;
