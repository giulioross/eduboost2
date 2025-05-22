import React from "react";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchRoutines, addRoutine, deleteRoutine, Routine } from '../services/api';

const RoutinePage: React.FC = () => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const queryClient = useQueryClient();

  const { data: routines = [], isLoading, error } = useQuery<Routine[]>('routines', fetchRoutines);

  const createMutation = useMutation(addRoutine, {
    onSuccess: () => {
      queryClient.invalidateQueries('routines');
      setTitle("");
      setDescription("");
    },
  });

  const deleteMutation = useMutation(deleteRoutine, {
    onSuccess: () => {
      queryClient.invalidateQueries('routines');
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Error loading routines: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Study Routines</h2>
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="input w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          className="input w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          className="btn btn-primary w-full"
          onClick={() => createMutation.mutate({ title, description })}
          disabled={createMutation.isLoading}
        >
          {createMutation.isLoading ? 'Adding...' : 'Add Routine'}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {routines.map((routine) => (
          <div key={routine.id} className="card p-4">
            <h3 className="font-semibold text-lg mb-2">{routine.title}</h3>
            <p className="text-gray-600 mb-4">{routine.description}</p>
            <button
              onClick={() => deleteMutation.mutate(routine.id)}
              disabled={deleteMutation.isLoading}
              className="text-red-500 text-sm hover:text-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutinePage;