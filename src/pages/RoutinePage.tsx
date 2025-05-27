import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchRoutines, addRoutine, deleteRoutine } from "../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Routine = {
  id: number;
  name: string;
  description: string;
  days?: string[];
  points?: string[];
};

const RoutinePage = () => {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedDates, setSelectedDates] = React.useState<Date[]>([]);
  const [points, setPoints] = React.useState<string[]>([""]);
  const queryClient = useQueryClient();

  const { data: routines = [], isLoading, error } = useQuery<Routine[]>("routines", fetchRoutines);

  const createMutation = useMutation((data: any) => addRoutine(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("routines");
      setName("");
      setDescription("");
      setSelectedDates([]);
      setPoints([""]);
    },
  });

  const deleteMutation = useMutation(deleteRoutine, {
    onSuccess: () => queryClient.invalidateQueries("routines"),
  });

  const handlePointChange = (idx: number, value: string) => {
    setPoints((prev) => prev.map((p, i) => (i === idx ? value : p)));
  };

  const addPoint = () => setPoints((prev) => [...prev, ""]);
  const removePoint = (idx: number) => setPoints((prev) => prev.filter((_, i) => i !== idx));

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    setSelectedDates((prevRaw) => {
      const prev = Array.isArray(prevRaw) ? prevRaw : [];
      return prev.some((d) => d.toDateString() === date.toDateString())
        ? prev.filter((d) => d.toDateString() !== date.toDateString())
        : [...prev, date];
    });
  };

  // INVIA SOLO I CAMPI CHE IL BACKEND ACCETTA!
  const handleSubmit = () => {
    createMutation.mutate({
      name,
      description,
      // days e points NON vengono inviati se il backend non li supporta!
    });
  };

  if (isLoading) return <div>Loading routines...</div>;
  if (error instanceof Error) return <div className="text-red-600">Errore nel caricamento: {error.message}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4 font-bold">Routines</h2>

      <div className="mb-6 space-y-4">
        <input className="input w-full" placeholder="Titolo" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea className="input w-full h-24" placeholder="Descrizione" value={description} onChange={(e) => setDescription(e.target.value)} />

        <div>
          <label className="block font-semibold mb-1">Scegli i giorni</label>
          <DatePicker
            selected={null}
            onChange={() => {}} // richiesto da react-datepicker ma non usato qui
            startDate={null}
            inline
            highlightDates={selectedDates}
            minDate={new Date()}
            // @ts-ignore
            value={selectedDates}
            onSelect={handleDateChange}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedDates.map((date, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                {date.toLocaleDateString()}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Punti/Attività della routine</label>
          {points.map((point, idx) => (
            <div key={idx} className="flex items-center mb-2">
              <input
                className="input flex-1"
                placeholder={`Punto ${idx + 1}`}
                value={point}
                onChange={(e) => handlePointChange(idx, e.target.value)}
              />
              {points.length > 1 && (
                <button className="ml-2 text-red-500" type="button" onClick={() => removePoint(idx)}>
                  Rimuovi
                </button>
              )}
            </div>
          ))}
          <button className="btn btn-secondary mt-2" type="button" onClick={addPoint}>
            + Aggiungi punto
          </button>
        </div>

        <button disabled={createMutation.isLoading} className="btn btn-primary w-full" onClick={handleSubmit}>
          {createMutation.isLoading ? "Adding..." : "Aggiungi Routine"}
        </button>
      </div>

      <ul className="space-y-2">
        {routines.map((r) => (
          <li key={r.id} className="flex flex-col md:flex-row justify-between p-2 border rounded shadow">
            <div>
              <strong>{r.name}</strong>
              <p>{r.description}</p>
              {r.days && <div className="text-xs text-blue-700 mt-1">Giorni: {r.days.join(", ")}</div>}
              {r.points && (
                <ul className="list-disc ml-5 text-sm mt-1">
                  {r.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              )}
            </div>
            <button
              className="text-red-500 hover:text-red-700 mt-2 md:mt-0"
              disabled={deleteMutation.isLoading}
              onClick={() => deleteMutation.mutate(r.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoutinePage;
