import React from "react";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white p-10 rounded-xl shadow-xl text-center space-y-6 max-w-md">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to MeddiSynx 👩‍⚕️🧠</h1>
        <p className="text-gray-600">Generate privacy-safe synthetic data in just a few clicks.</p>
        <Link
          to="/synthetic"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full transition duration-300"
        >
          Go to Generator →
        </Link>
      </div>
    </div>
  );
};

export default Dashboard; 