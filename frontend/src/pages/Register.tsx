import React from "react";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white">
      <div className="bg-black bg-opacity-40 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">📝 Register for MeddiSynx</h2>
        <form className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full p-3 rounded bg-gray-900 text-white" />
          <input type="email" placeholder="Email" className="w-full p-3 rounded bg-gray-900 text-white" />
          <input type="password" placeholder="Password" className="w-full p-3 rounded bg-gray-900 text-white" />
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 transition p-3 rounded font-semibold">
            Register
          </button>
        </form>
      </div>
    </div>
  );
} 