import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchMindMaps, createMindMap, deleteMindMap, MindMap as MindMapType } from "../services/api";

const templates = [
  {
    id: "template1",
    title: "Pianificazione Progetto",
    content: `- Obiettivi\n- Risorse\n- Timeline\n- Rischi\n- Stakeholder`,
  },
  {
    id: "template2",
    title: "Brainstorming Idee",
    content: `- Idea principale\n  - Sottocategoria 1\n  - Sottocategoria 2\n- Problemi da risolvere\n- Soluzioni possibili`,
  },
  {
    id: "template3",
    title: "Studio Argomento",
    content: `- Definizione\n- Concetti chiave\n- Esempi\n- Domande aperte\n- Fonti e riferimenti`,
  },
];

const MindMap: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | "">("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const {
    data: mindmaps = [],
    isLoading,
    error,
  } = useQuery<MindMapType[], Error>("mindmaps", () => fetchMindMaps(token ?? ""), { enabled: !!token });

  const createMutation = useMutation((data: { title: string; content: string }) => createMindMap(data, token ?? ""), {
    onSuccess: () => {
      queryClient.invalidateQueries("mindmaps");
      setTitle("");
      setContent("");
      setSelectedTemplate("");
    },
  });

  const deleteMutation = useMutation((id: number) => deleteMindMap(id, token ?? ""), {
    onSuccess: () => {
      queryClient.invalidateQueries("mindmaps");
    },
  });

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedTemplate(id);
    const template = templates.find((t) => t.id === id);
    if (template) {
      setTitle(template.title);
      setContent(template.content);
    } else {
      setTitle("");
      setContent("");
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Sei sicuro di voler eliminare questa mappa mentale?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Caricamento mappe mentali...</div>;

  if (error)
    return (
      <div role="alert" className="text-red-600">
        Errore nel caricamento: {error.message}
      </div>
    );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl mb-4 font-bold">Mind Maps</h2>

      <section aria-labelledby="form-section" className="mb-6 space-y-4">
        <label htmlFor="template-select" className="block font-semibold mb-1">
          Seleziona un template
        </label>
        <select id="template-select" className="input w-full border p-2 rounded" value={selectedTemplate} onChange={handleTemplateChange}>
          <option value="">-- Seleziona un template --</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>

        <label htmlFor="title-input" className="block font-semibold mb-1">
          Titolo
        </label>
        <input
          id="title-input"
          type="text"
          className="input w-full border p-2 rounded"
          placeholder="Titolo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="content-textarea" className="block font-semibold mb-1">
          Contenuto
        </label>
        <textarea
          id="content-textarea"
          className="input w-full h-32 border p-2 rounded"
          placeholder="Contenuto"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          type="button"
          disabled={createMutation.isLoading || !title.trim() || !content.trim()}
          className={`btn btn-primary w-full py-2 rounded text-white ${
            createMutation.isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={() => createMutation.mutate({ title: title.trim(), content: content.trim() })}
          aria-busy={createMutation.isLoading}>
          {createMutation.isLoading ? "Aggiunta in corso..." : "Aggiungi Mappa Mentale"}
        </button>
      </section>

      <section aria-labelledby="mindmaps-list" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <h3 id="mindmaps-list" className="sr-only">
          Elenco mappe mentali
        </h3>
        {mindmaps.map((m) => (
          <article
            key={m.id}
            className="card p-4 border rounded shadow bg-white flex flex-col justify-between"
            aria-label={`Mappa mentale: ${m.title}`}>
            <div>
              <h4 className="font-semibold text-lg mb-2">{m.title}</h4>
              <p className="text-gray-600 mb-4 whitespace-pre-line">{m.content}</p>
            </div>
            <button
              type="button"
              className="text-red-500 text-sm hover:text-red-700 self-start"
              disabled={deleteMutation.isLoading}
              onClick={() => handleDelete(m.id)}
              aria-disabled={deleteMutation.isLoading}>
              Elimina
            </button>
          </article>
        ))}
      </section>
    </div>
  );
};

export default MindMap;
