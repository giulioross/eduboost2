import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchMindMaps, createMindMap, deleteMindMap, MindMap as MindMapType } from "../services/api";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";

function parseContentToNodes(content: string) {
  // Ogni riga diventa un nodo figlio del nodo centrale
  const lines = content.split("\n").filter(Boolean);
  const nodes = [
    { id: "root", data: { label: "Idea Centrale" }, position: { x: 250, y: 50 }, type: "input" },
    ...lines.map((line, i) => ({
      id: `n${i}`,
      data: { label: line.replace(/^- /, "") },
      position: { x: 100 + i * 150, y: 200 },
    })),
  ];
  const edges = lines.map((_, i) => ({
    id: `e-root-n${i}`,
    source: "root",
    target: `n${i}`,
    animated: true,
  }));
  return { nodes, edges };
}

const MindMap: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMap, setSelectedMap] = useState<MindMapType | null>(null);
  const queryClient = useQueryClient();

  const { data: mindmaps = [], isLoading, error } = useQuery<MindMapType[]>("mindmaps", fetchMindMaps);

  const createMutation = useMutation((data: any) => createMindMap(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("mindmaps");
      setTitle("");
      setContent("");
    },
  });

  const deleteMutation = useMutation(deleteMindMap, {
    onSuccess: () => queryClient.invalidateQueries("mindmaps"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    createMutation.mutate({ title, content });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
    if (selectedMap?.id === id) setSelectedMap(null);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl mb-4 font-bold">Mappe Mentali</h2>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-white p-4 rounded shadow">
        <input className="input w-full" placeholder="Titolo mappa mentale" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea
          className="input w-full h-32"
          placeholder="Scrivi ogni ramo su una nuova riga (es: - Primo ramo)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={createMutation.isLoading}>
          Crea mappa mentale
        </button>
      </form>

      <section className="mb-8">
        <h3 className="font-semibold mb-2">Le tue mappe mentali</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mindmaps.map((m) => (
            <article
              key={m.id}
              className={`card p-4 border rounded shadow bg-white flex flex-col justify-between cursor-pointer ${
                selectedMap?.id === m.id ? "border-blue-600" : ""
              }`}
              onClick={() => setSelectedMap(m)}
              aria-label={`Mappa mentale: ${m.title}`}>
              <div>
                <h4 className="font-semibold text-lg mb-2">{m.title}</h4>
                <p className="text-gray-600 mb-4 whitespace-pre-line">{m.content}</p>
              </div>
              <button
                type="button"
                className="text-red-500 text-sm hover:text-red-700 self-start"
                disabled={deleteMutation.isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(m.id);
                }}
                aria-disabled={deleteMutation.isLoading}>
                Elimina
              </button>
            </article>
          ))}
        </div>
      </section>

      {selectedMap && (
        <section className="my-8 bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-2">Visualizzazione: {selectedMap.title}</h3>
          <div style={{ width: "100%", height: 400 }}>
            <ReactFlow {...parseContentToNodes(selectedMap.content)}>
              <MiniMap />
              <Controls />
              <Background />
            </ReactFlow>
          </div>
        </section>
      )}
    </div>
  );
};

export default MindMap;
