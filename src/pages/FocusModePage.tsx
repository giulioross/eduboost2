import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { saveFocusSession, getRecentSessions, FocusSession } from "../services/api";

const MODES = [
  { label: "Pomodoro (25 min)", value: "POMODORO", duration: 25 },
  { label: "Personalizzata", value: "CUSTOM", duration: 50 },
];

const STATUS = [
  { label: "Studio", value: "WORK" },
  { label: "Pausa", value: "BREAK" },
];

function pad(n: number) {
  return n < 10 ? `0${n}` : n;
}

const FocusModePage: React.FC = () => {
  const [mode, setMode] = useState<"POMODORO" | "CUSTOM">("POMODORO");
  const [status, setStatus] = useState<"WORK" | "BREAK">("WORK");
  const [duration, setDuration] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const queryClient = useQueryClient();

  // Usa getRecentSessions per lo storico
  const { data: sessions = [] } = useQuery<FocusSession[]>("focusSessions", getRecentSessions);

  const mutation = useMutation(saveFocusSession, {
    onSuccess: () => {
      queryClient.invalidateQueries("focusSessions");
      setShowEnd(true);
      setIsRunning(false);
    },
  });

  // Aggiorna il timer quando cambia la durata o la modalità
  useEffect(() => {
    if (mode === "POMODORO") setDuration(25);
    setSecondsLeft(duration * 60);
  }, [mode, duration]);

  // Countdown
  useEffect(() => {
    if (!isRunning) return;
    if (secondsLeft <= 0) {
      setIsRunning(false);
      mutation.mutate({
        duration: duration * 60,
        status,
        startTime: new Date(Date.now() - duration * 60000).toISOString(),
        endTime: new Date().toISOString(),
        mode,
        userId: 0,
      });
      // Suono di fine sessione
      try {
        const audio = new Audio("https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4c7b.mp3");
        audio.play();
      } catch {}
      return;
    }
    const interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, duration, status, mode, mutation]);

  const handleStart = () => {
    setSecondsLeft(duration * 60);
    setIsRunning(true);
    setShowEnd(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(duration * 60);
    setShowEnd(false);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl mb-4 font-bold">Modalità Focus Avanzata</h2>

      <div className="mb-4 flex gap-4">
        {MODES.map((m) => (
          <button
            key={m.value}
            className={`btn ${mode === m.value ? "btn-primary" : "btn-secondary"}`}
            onClick={() => {
              setMode(m.value as "POMODORO" | "CUSTOM");
              setDuration(m.duration);
            }}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex gap-4">
        {STATUS.map((s) => (
          <button
            key={s.value}
            className={`btn ${status === s.value ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setStatus(s.value as "WORK" | "BREAK")}>
            {s.label}
          </button>
        ))}
      </div>

      {mode === "CUSTOM" && (
        <div className="mb-4">
          <label>
            Durata (minuti):{" "}
            <input
              type="number"
              min={1}
              max={120}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="input w-20 ml-2"
              disabled={isRunning}
            />
          </label>
        </div>
      )}

      {/* Timer visivo */}
      <div className="flex flex-col items-center my-8">
        <div className="text-6xl font-mono mb-2">
          {pad(Math.floor(secondsLeft / 60))}:{pad(secondsLeft % 60)}
        </div>
        <div className="flex gap-4">
          {!isRunning && (
            <button className="btn btn-primary" onClick={handleStart} disabled={isRunning}>
              Avvia
            </button>
          )}
          {isRunning && (
            <button className="btn btn-secondary" onClick={handleReset}>
              Ferma
            </button>
          )}
        </div>
        {showEnd && <div className="mt-4 text-green-600 font-semibold animate-fade-in">Sessione completata e salvata!</div>}
      </div>

      {/* Storico sessioni */}
      <section className="mt-8">
        <h3 className="font-semibold mb-2">Storico sessioni recenti</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1">Data</th>
                <th className="px-2 py-1">Tipo</th>
                <th className="px-2 py-1">Durata</th>
                <th className="px-2 py-1">Modalità</th>
              </tr>
            </thead>
            <tbody>
              {sessions
                .slice(-10)
                .reverse()
                .map((s) => (
                  <tr key={s.id}>
                    <td className="px-2 py-1">{new Date(s.startTime).toLocaleDateString()}</td>
                    <td className="px-2 py-1">{s.status === "WORK" ? "Studio" : "Pausa"}</td>
                    <td className="px-2 py-1">{Math.floor(s.duration / 60)} min</td>
                    <td className="px-2 py-1">{s.mode === "POMODORO" ? "Pomodoro" : "Personalizzata"}</td>
                  </tr>
                ))}
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-2 text-gray-500">
                    Nessuna sessione trovata.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default FocusModePage;
