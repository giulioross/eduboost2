import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchRoutines, addRoutine, deleteRoutine } from "../services/api";

type Routine = {
  id: number;
  title: string;
  description: string;
};

const RoutinePage = () => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const queryClient = useQueryClient();

  const { data: routines = [], isLoading, error } = useQuery<Routine[]>("routines", fetchRoutines);

  const createMutation = useMutation(addRoutine, {
    onSuccess: () => {
      queryClient.invalidateQueries("routines");
      setTitle("");
      setDescription("");
    },
  });

  const deleteMutation = useMutation(deleteRoutine, {
    onSuccess: () => queryClient.invalidateQueries("routines"),
  });

  if (isLoading) return <div>Loading routines...</div>;
  if (error instanceof Error) return <div className="text-red-600">Errore nel caricamento: {error.message}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4 font-bold">Routines</h2>

      <div className="mb-6 space-y-4">
        <input className="input w-full" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="input w-full h-24" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button disabled={createMutation.isLoading} className="btn btn-primary w-full" onClick={() => createMutation.mutate({ title, description })}>
          {createMutation.isLoading ? "Adding..." : "Add Routine"}
        </button>
      </div>

      <ul className="space-y-2">
        {routines.map((r) => (
          <li key={r.id} className="flex justify-between p-2 border rounded shadow">
            <div>
              <strong>{r.title}</strong>
              <p>{r.description}</p>
            </div>
            <button className="text-red-500 hover:text-red-700" disabled={deleteMutation.isLoading} onClick={() => deleteMutation.mutate(r.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoutinePage;
