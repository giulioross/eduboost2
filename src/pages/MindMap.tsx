import React from "react";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchMindMaps, createMindMap, deleteMindMap, MindMap as MindMapType } from '../services/api';

const MindMap = () => {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const queryClient = useQueryClient();

  const { data: mindmaps = [], isLoading, error } = useQuery<MindMapType[]>('mindmaps', fetchMindMaps);

  const createMutation = useMutation(createMindMap, {
    onSuccess: () => {
      queryClient.invalidateQueries('mindmaps');
      setTitle("");
      setContent("");
    },
  });

  const deleteMutation = useMutation(deleteMindMap, {
    onSuccess: () => {
      queryClient.invalidateQueries('mindmaps');
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
      <div className="p-4 text-red-600">
        Error loading mind maps: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4 font-bold">Mind Maps</h2>
      <div className="space-y-4 mb-6">
        <input
          className="input w-full"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="input w-full h-32"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={() => createMutation.mutate({ title, content })}
          disabled={createMutation.isLoading}
          className="btn btn-primary w-full"
        >
          {createMutation.isLoading ? 'Adding...' : 'Add Mind Map'}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mindmaps.map((m) => (
          <div key={m.id} className="card p-4">
            <h3 className="font-semibold text-lg mb-2">{m.title}</h3>
            <p className="text-gray-600 mb-4">{m.content}</p>
            <button
              onClick={() => deleteMutation.mutate(m.id)}
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

export default MindMap;