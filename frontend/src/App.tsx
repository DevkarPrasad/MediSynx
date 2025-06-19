import React, { type ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Generator from "./pages/Generator";
import SyntheticPage from "./pages/SyntheticPage";

const Protected = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/generator" element={<Protected><Generator /></Protected>} />
        <Route path="/synthetic" element={<Protected><SyntheticPage /></Protected>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
