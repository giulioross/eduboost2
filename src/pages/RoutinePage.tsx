import React, { useEffect, useState } from "react";

interface Routine {
  id: number;
  title: string;
  description: string;
}

const RoutinePage: React.FC = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/routines")
      .then((res) => res.json())
      .then((data) => setRoutines(data));
  }, []);

  const addRoutine = () => {
    fetch("http://localhost:8080/api/routines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    })
      .then((res) => res.json())
      .then((newRoutine) => setRoutines([...routines, newRoutine]));
  };

  const deleteRoutine = (id: number) => {
    fetch(`http://localhost:8080/api/routines/${id}`, { method: "DELETE" }).then(() => setRoutines(routines.filter((r) => r.id !== id)));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Study Routines</h2>
      <div className="mb-4">
        <input type="text" placeholder="Title" className="border p-2 mr-2" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input
          type="text"
          placeholder="Description"
          className="border p-2 mr-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addRoutine}>
          Add Routine
        </button>
      </div>

      <ul>
        {routines.map((routine) => (
          <li key={routine.id} className="mb-2 p-2 border rounded">
            <h3 className="font-semibold">{routine.title}</h3>
            <p>{routine.description}</p>
            <button onClick={() => deleteRoutine(routine.id)} className="text-red-600 mt-1">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoutinePage;
