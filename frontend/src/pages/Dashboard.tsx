import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-950 text-white font-sans">
      <header className="p-6 text-center shadow-md bg-opacity-10 backdrop-blur border-b border-indigo-800">
        <h1 className="text-4xl font-extrabold tracking-wide">🔐 MeddiSynx</h1>
        <p className="text-md mt-2 text-indigo-200">Privacy-Preserving Synthetic Data Platform</p>
      </header>

      <main className="flex flex-col items-center justify-center py-24 space-y-10">
        <img
          src="https://cdn.pixabay.com/photo/2021/12/11/12/06/artificial-intelligence-6862486_1280.jpg"
          alt="AI Art"
          className="rounded-2xl shadow-xl w-[600px]"
        />

        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Start Exploring</h2>
          <p className="text-indigo-300">
            Upload your medical dataset, generate private synthetic data, and evaluate results.
          </p>

          <div className="flex gap-4 justify-center mt-6">
            <Link
              to="/synthetic"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
            >
              🔬 Synthetic Data Lab
            </Link>
            <Link
              to="/login"
              className="border border-purple-500 hover:bg-purple-800 text-purple-300 hover:text-white py-2 px-6 rounded-full transition duration-300"
            >
              🔐 Login
            </Link>
          </div>
        </div>
      </main>

      <footer className="text-center text-indigo-400 text-sm py-6">
        © 2025 MeddiSynx — Built with love & privacy 💜
      </footer>
    </div>
  );
} 