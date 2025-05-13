import React, { useEffect, useState } from "react";

type MindMap = {
  id: number;
  title: string;
  content: string;
};

const MindMap = () => {
  const [mindmaps, setMindmaps] = useState<MindMap[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchMindMaps = async () => {
    const res = await fetch("http://localhost:8080/api/mindmaps");
    const data = await res.json();
    setMindmaps(data);
  };

  const createMindMap = async () => {
    await fetch("http://localhost:8080/api/mindmaps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    setTitle("");
    setContent("");
    fetchMindMaps();
  };

  const deleteMindMap = async (id: number) => {
    await fetch(`http://localhost:8080/api/mindmaps/${id}`, {
      method: "DELETE",
    });
    fetchMindMaps();
  };

  useEffect(() => {
    fetchMindMaps();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4 font-bold">Mind Maps</h2>
      <input className="border p-2 mb-2 w-full" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="border p-2 mb-2 w-full" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={createMindMap} className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Mind Map
      </button>

      <ul className="mt-4 space-y-2">
        {mindmaps.map((m) => (
          <li key={m.id} className="border p-2 rounded">
            <strong>{m.title}</strong>
            <p>{m.content}</p>
            <button onClick={() => deleteMindMap(m.id)} className="text-red-500 text-sm">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MindMap;
