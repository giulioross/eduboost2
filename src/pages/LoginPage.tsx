import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginRequest {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [form, setForm] = useState<LoginRequest>({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("roles", JSON.stringify(data.roles));

        if (data.roles.includes("ROLE_ADMIN")) {
          navigate("/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        const errData = await response.json();
        setError(errData.message || "Credenziali errate");
      }
    } catch {
      setError("Errore di connessione al server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <div className="flex items-center justify-between gap-2">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex-1">
            {loading ? "Accesso in corso..." : "Accedi"}
          </button>
          <button
            type="button"
            className="bg-gray-200 text-blue-700 py-2 px-4 rounded hover:bg-gray-300 flex-1"
            onClick={() => navigate("/register")}>
            Registrati
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
