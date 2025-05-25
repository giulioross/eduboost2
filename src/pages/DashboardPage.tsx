import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const username = localStorage.getItem("username");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Benvenuto nella Dashboard</h1>
      <p className="mt-2 text-gray-700">Ciao, {username}!</p>
    </div>
  );
};

export default Dashboard;
