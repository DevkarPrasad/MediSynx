import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/auth/register", { email, password });
      localStorage.setItem("token", res.data.access_token || res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 text-white">
      <div className="bg-black bg-opacity-40 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">🔐 Login to MeddiSynx</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-900 text-white"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-gray-900 text-white"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-purple-600 hover:bg-purple-700 transition p-3 rounded font-semibold">
            Login
          </button>
          {error && <div className="text-red-400 text-center mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
}
