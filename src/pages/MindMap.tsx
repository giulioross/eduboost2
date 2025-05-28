import React, { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchMindMaps, createMindMap, deleteMindMap, MindMap as MindMapType } from "../services/api";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  Connection,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Tipi per i template
type Template = {
  id: string;
  name: string;
  description: string;
  structure: {
    nodes: Node[];
    edges: Edge[];
  };
};

// Template predefiniti
const TEMPLATES: Template[] = [
  {
    id: "brainstorming",
    name: "Brainstorming",
    description: "Struttura base per sessioni di brainstorming",
    structure: {
      nodes: [
        { id: "root", data: { label: "Idea Centrale" }, position: { x: 250, y: 50 }, type: "input" },
        { id: "n1", data: { label: "Punto 1" }, position: { x: 100, y: 150 } },
        { id: "n2", data: { label: "Punto 2" }, position: { x: 250, y: 150 } },
        { id: "n3", data: { label: "Punto 3" }, position: { x: 400, y: 150 } },
      ],
      edges: [
        { id: "e1", source: "root", target: "n1" },
        { id: "e2", source: "root", target: "n2" },
        { id: "e3", source: "root", target: "n3" },
      ],
    },
  },
  {
    id: "decision-tree",
    name: "Albero Decisionale",
    description: "Struttura per analisi decisionale",
    structure: {
      nodes: [
        { id: "root", data: { label: "Decisione" }, position: { x: 250, y: 50 }, type: "input" },
        { id: "pro", data: { label: "Pro" }, position: { x: 100, y: 150 } },
        { id: "contro", data: { label: "Contro" }, position: { x: 400, y: 150 } },
        { id: "p1", data: { label: "Pro 1" }, position: { x: 50, y: 250 } },
        { id: "p2", data: { label: "Pro 2" }, position: { x: 150, y: 250 } },
        { id: "c1", data: { label: "Contro 1" }, position: { x: 350, y: 250 } },
        { id: "c2", data: { label: "Contro 2" }, position: { x: 450, y: 250 } },
      ],
      edges: [
        { id: "e1", source: "root", target: "pro" },
        { id: "e2", source: "root", target: "contro" },
        { id: "e3", source: "pro", target: "p1" },
        { id: "e4", source: "pro", target: "p2" },
        { id: "e5", source: "contro", target: "c1" },
        { id: "e6", source: "contro", target: "c2" },
      ],
    },
  },
  {
    id: "swot",
    name: "Analisi SWOT",
    description: "Template per analisi SWOT",
    structure: {
      nodes: [
        { id: "root", data: { label: "Obiettivo" }, position: { x: 250, y: 50 }, type: "input" },
        { id: "strengths", data: { label: "Punti di Forza" }, position: { x: 50, y: 150 } },
        { id: "weaknesses", data: { label: "Punti di Debolezza" }, position: { x: 250, y: 150 } },
        { id: "opportunities", data: { label: "Opportunità" }, position: { x: 450, y: 150 } },
        { id: "threats", data: { label: "Minacce" }, position: { x: 650, y: 150 } },
      ],
      edges: [
        { id: "e1", source: "root", target: "strengths" },
        { id: "e2", source: "root", target: "weaknesses" },
        { id: "e3", source: "root", target: "opportunities" },
        { id: "e4", source: "root", target: "threats" },
      ],
    },
  },
];

// Componente per l'editor della mappa mentale
const MindMapEditor: React.FC<{
  initialNodes: Node[];
  initialEdges: Edge[];
  onSave: (nodes: Node[], edges: Edge[]) => void;
  onCancel: () => void;
}> = ({ initialNodes, initialEdges, onSave, onCancel }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const updateNodeLabel = useCallback(
    (label: string) => {
      if (!selectedNode) return;

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              data: { ...node.data, label },
            };
          }
          return node;
        })
      );
      setSelectedNode((prev) => (prev ? { ...prev, data: { ...prev.data, label } } : prev));
    },
    [selectedNode, setNodes]
  );

  const addNewNode = useCallback(() => {
    const newNode = {
      id: `n${nodes.length + 1}`,
      data: { label: "Nuovo nodo" },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length, setNodes]);

  const deleteSelectedNode = useCallback(() => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
    setSelectedNode(null);
  }, [selectedNode, setNodes, setEdges]);

  return (
    <div className="h-[500px] relative border rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView>
        <Controls />
        <MiniMap />
        <Background />

        <Panel position="top-right" className="space-y-2">
          <button onClick={addNewNode} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
            Aggiungi Nodo
          </button>
          {selectedNode && (
            <button onClick={deleteSelectedNode} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
              Elimina Nodo
            </button>
          )}
        </Panel>

        <Panel position="bottom-center" className="flex space-x-4">
          <button onClick={() => onSave(nodes, edges)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
            Salva Mappa
          </button>
          <button onClick={onCancel} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
            Annulla
          </button>
        </Panel>
      </ReactFlow>

      {selectedNode && (
        <div className="absolute top-4 left-4 bg-white p-4 rounded shadow-lg z-10">
          <h3 className="font-semibold mb-2">Modifica Nodo</h3>
          <input
            type="text"
            value={selectedNode.data.label}
            onChange={(e) => updateNodeLabel(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
      )}
    </div>
  );
};

// Componente per visualizzare la mappa mentale
const MindMapViewer: React.FC<{ nodes: Node[]; edges: Edge[] }> = ({ nodes, edges }) => {
  return (
    <div className="h-[500px] border rounded-lg">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Controls />
        <MiniMap />
        <Background />
      </ReactFlow>
    </div>
  );
};

// Funzione per convertire nodi e archi in formato testo
const nodesEdgesToText = (nodes: Node[], edges: Edge[]): string => {
  const rootNode = nodes.find((n) => n.type === "input");
  if (!rootNode) return "";

  const rootText = rootNode.data.label;
  const children = edges
    .filter((e) => e.source === rootNode.id)
    .map((e) => {
      const childNode = nodes.find((n) => n.id === e.target);
      return childNode ? `- ${childNode.data.label}` : "";
    })
    .filter(Boolean)
    .join("\n");

  return `${rootText}\n${children}`;
};

// Funzione per convertire testo in nodi e archi
const textToNodesEdges = (content: string) => {
  const lines = content.split("\n").filter(Boolean);
  if (lines.length === 0) return { nodes: [], edges: [] };

  const rootText = lines[0];
  const nodes: Node[] = [{ id: "root", data: { label: rootText }, position: { x: 250, y: 50 }, type: "input" }];
  const edges: Edge[] = [];

  lines.slice(1).forEach((line, i) => {
    const nodeId = `n${i}`;
    const label = line.replace(/^- /, "");
    nodes.push({
      id: nodeId,
      data: { label },
      position: { x: 100 + (i % 5) * 150, y: 150 + Math.floor(i / 5) * 100 },
    });
    edges.push({
      id: `e-root-${nodeId}`,
      source: "root",
      target: nodeId,
      markerEnd: { type: MarkerType.ArrowClosed },
    });
  });

  return { nodes, edges };
};

// Funzione per esportare la mappa mentale come PDF
const exportMapAsPDF = async () => {
  const mapElement = document.getElementById("mindmap-viewer");
  if (!mapElement) return;
  const canvas = await html2canvas(mapElement, { backgroundColor: "#fff" });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [canvas.width, canvas.height],
  });
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save("mappa-mentale.pdf");
};

const MindMap: React.FC = () => {
  const [title, setTitle] = useState("");
  const [selectedMap, setSelectedMap] = useState<MindMapType | null>(null);
  const [editingMap, setEditingMap] = useState<boolean>(false);
  const [editorNodes, setEditorNodes] = useState<Node[]>([]);
  const [editorEdges, setEditorEdges] = useState<Edge[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: mindmaps = [], isLoading, error } = useQuery<MindMapType[]>("mindmaps", fetchMindMaps);

  const createMutation = useMutation((data: { title: string; content: string }) => createMindMap(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("mindmaps");
      setTitle("");
      setEditingMap(false);
    },
  });

  const deleteMutation = useMutation(deleteMindMap, {
    onSuccess: () => queryClient.invalidateQueries("mindmaps"),
  });

  const handleCreateFromTemplate = () => {
    if (!selectedTemplate) return;

    const template = TEMPLATES.find((t) => t.id === selectedTemplate);
    if (!template) return;

    setEditorNodes(template.structure.nodes);
    setEditorEdges(template.structure.edges);
    setEditingMap(true);
  };

  const handleSaveMap = (nodes: Node[], edges: Edge[]) => {
    if (!title.trim()) return;

    const content = nodesEdgesToText(nodes, edges);
    createMutation.mutate({ title, content });
  };

  const handleEditMap = (map: MindMapType) => {
    const { nodes, edges } = textToNodesEdges(map.content);
    setTitle(map.title);
    setEditorNodes(nodes);
    setEditorEdges(edges);
    setSelectedMap(map);
    setEditingMap(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
    if (selectedMap?.id === id) {
      setSelectedMap(null);
      setEditingMap(false);
    }
  };

  const { nodes: viewNodes, edges: viewEdges } = useMemo(() => {
    if (!selectedMap) return { nodes: [], edges: [] };
    return textToNodesEdges(selectedMap.content);
  }, [selectedMap]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl mb-6 font-bold">Mappe Mentali</h2>

      {editingMap ? (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <input className="input flex-1" placeholder="Titolo mappa mentale" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <ReactFlowProvider>
            <MindMapEditor initialNodes={editorNodes} initialEdges={editorEdges} onSave={handleSaveMap} onCancel={() => setEditingMap(false)} />
          </ReactFlowProvider>
        </div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-4">Crea Nuova Mappa</h3>
              <div className="space-y-4">
                <input className="input w-full" placeholder="Titolo mappa mentale" value={title} onChange={(e) => setTitle(e.target.value)} />
                <button
                  onClick={() => {
                    setEditorNodes([{ id: "root", data: { label: "Idea Centrale" }, position: { x: 250, y: 50 }, type: "input" }]);
                    setEditorEdges([]);
                    setEditingMap(true);
                  }}
                  className="btn btn-primary w-full">
                  Crea Mappa Vuota
                </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-4">Usa un Template</h3>
              <div className="space-y-4">
                <select className="input w-full" value={selectedTemplate || ""} onChange={(e) => setSelectedTemplate(e.target.value)}>
                  <option value="">Seleziona un template...</option>
                  {TEMPLATES.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
                {selectedTemplate && <p className="text-sm text-gray-600">{TEMPLATES.find((t) => t.id === selectedTemplate)?.description}</p>}
                <button onClick={handleCreateFromTemplate} disabled={!selectedTemplate} className="btn btn-primary w-full disabled:opacity-50">
                  Crea da Template
                </button>
              </div>
            </div>
          </div>

          <section className="mb-8">
            <h3 className="font-semibold mb-4">Le tue mappe mentali</h3>
            {mindmaps.length === 0 ? (
              <p className="text-gray-500">Nessuna mappa mentale creata</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mindmaps.map((m) => (
                  <article
                    key={m.id}
                    className={`card p-4 border rounded shadow bg-white flex flex-col justify-between ${
                      selectedMap?.id === m.id ? "border-blue-600" : ""
                    }`}>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">{m.title}</h4>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {m.content.split("\n")[0]}
                        {m.content.split("\n").length > 1 && "..."}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <button type="button" className="text-blue-500 hover:text-blue-700 text-sm" onClick={() => setSelectedMap(m)}>
                        Visualizza
                      </button>
                      <div className="flex space-x-2">
                        <button type="button" className="text-green-500 hover:text-green-700 text-sm" onClick={() => handleEditMap(m)}>
                          Modifica
                        </button>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 text-sm"
                          disabled={deleteMutation.isLoading}
                          onClick={() => handleDelete(m.id)}>
                          Elimina
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {selectedMap && (
            <section className="my-8 bg-white rounded shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-xl">{selectedMap.title}</h3>
                <div className="flex gap-2">
                  <button onClick={exportMapAsPDF} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                    Esporta PDF
                  </button>
                  <button onClick={() => handleEditMap(selectedMap)} className="text-blue-500 hover:text-blue-700">
                    Modifica
                  </button>
                </div>
              </div>
              <div id="mindmap-viewer">
                <MindMapViewer nodes={viewNodes} edges={viewEdges} />
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default MindMap;
