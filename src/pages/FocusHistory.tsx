import React, { useEffect, useState } from "react";

const FocusHistory: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/focus-sessions/1") // Assicurati di passare l'ID dell'utente
      .then((response) => response.json())
      .then((data) => setSessions(data))
      .catch((error) => console.error("Error fetching focus sessions:", error));
  }, []);

  return (
    <div className="container">
      <h2>Storico Sessioni Focus</h2>
      <ul>
        {sessions.map((session, index) => (
          <li key={index}>
            Durata: {session.duration} sec | Stato: {session.status} | Inizio: {new Date(session.startTime).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FocusHistory;
