import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="h-screen w-60 bg-white shadow-md px-4 py-6 space-y-6">
      <h2 className="text-2xl font-bold text-blue-600">MeddiSynx</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
        <Link to="/synthetic" className="text-gray-700 hover:text-blue-600">Generate Data</Link>
        <Link to="/history" className="text-gray-700 hover:text-blue-600">History</Link>
        <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
      </nav>
    </div>
  );
}
