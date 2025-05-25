import React from "react";
import { useMutation } from "react-query";
import { saveFocusSession } from "../services/api";

const FocusSessionPage = () => {
  const [duration, setDuration] = React.useState(25); // minuti
  const [status, setStatus] = React.useState<"WORK" | "BREAK">("WORK");
  const mutation = useMutation(saveFocusSession, {
    onSuccess: () => alert("Focus session salvata!"),
    onError: (error: any) => alert("Errore: " + (error.message || "Impossibile salvare")),
  });

  const handleSave = () => {
    // TODO: Replace with actual userId and mode as appropriate for your app
    const userId = 1; // Replace with actual user id from context/auth (must be a number)
    const mode: "POMODORO" | "CUSTOM" = status === "WORK" ? "POMODORO" : "CUSTOM"; // Adjust as needed

    const session = {
      duration,
      status,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + duration * 60000).toISOString(),
      userId,
      mode,
    };
    mutation.mutate(session);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4 font-bold">Focus Session</h2>

      <label>
        Duration (minutes):
        <input type="number" min={1} max={120} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="input w-20 ml-2" />
      </label>

      <div className="mt-4">
        <label className="mr-4">
          <input type="radio" checked={status === "WORK"} onChange={() => setStatus("WORK")} />
          Work
        </label>
        <label>
          <input type="radio" checked={status === "BREAK"} onChange={() => setStatus("BREAK")} />
          Break
        </label>
      </div>

      <button className="btn btn-primary mt-4" onClick={handleSave} disabled={mutation.isLoading}>
        {mutation.isLoading ? "Saving..." : "Save Session"}
      </button>
    </div>
  );
};

export default FocusSessionPage;
