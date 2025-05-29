import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SignupRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: string;
  roles: string[];
}

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState<SignupRequest>({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    userType: "HIGH_SCHOOL_STUDENT",
    roles: ["ROLE_USER"],
  });

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setMessage("Registrazione completata con successo! Verrai reindirizzato al login...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Errore durante la registrazione.");
      }
    } catch (error) {
      setMessage("Errore di connessione al server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Registrati</h2>
      {message && <div className="mb-4 text-center text-red-600">{message}</div>}
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
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
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
        <input name="firstName" type="text" placeholder="Nome" value={form.firstName} onChange={handleChange} className="w-full p-2 border rounded" />
        <input
          name="lastName"
          type="text"
          placeholder="Cognome"
          value={form.lastName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <select name="userType" value={form.userType} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="HIGH_SCHOOL_STUDENT">Studente scuola superiore</option>
          <option value="UNIVERSITY_STUDENT">Studente universitario</option>
          <option value="PUBLIC_EXAM_CANDIDATE">Concorsista</option>
          <option value="OTHER">Altro</option>
        </select>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={loading}>
          {loading ? "Registrazione in corso..." : "Registrati"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
