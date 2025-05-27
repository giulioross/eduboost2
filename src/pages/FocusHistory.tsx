import React from "react";
import { useQuery } from "react-query";
import { getRecentSessions, FocusSession } from "../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toLocaleDateString());
  }
  return days;
}

function groupByDay(sessions: FocusSession[]) {
  const days = getLast7Days();
  return days.map((day) => {
    const filtered = sessions.filter((s) => new Date(s.startTime).toLocaleDateString() === day);
    return {
      day,
      Studio: filtered.filter((s) => s.status === "WORK").reduce((acc, s) => acc + Math.floor(s.duration / 60), 0),
      Pausa: filtered.filter((s) => s.status === "BREAK").reduce((acc, s) => acc + Math.floor(s.duration / 60), 0),
    };
  });
}

const FocusHistory: React.FC = () => {
  const { data, isLoading, error } = useQuery<FocusSession[]>("recentSessions", getRecentSessions);
  const sessions = Array.isArray(data) ? data : [];

  const totalMinutes = sessions.filter((s) => s.status === "WORK").reduce((acc, s) => acc + Math.floor(s.duration / 60), 0);

  const chartData = groupByDay(sessions);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-600">Error loading focus sessions: {(error as Error).message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Storico Focus Sessions</h2>
      <div className="mb-4 text-lg font-semibold">
        Totale minuti di studio (ultimi 7 giorni): <span className="text-primary-600">{totalMinutes}</span>
      </div>

      {/* Grafico settimanale */}
      <section className="bg-white rounded shadow p-4 mb-8">
        <h3 className="font-semibold mb-2">Andamento settimanale</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Studio" fill="#34d399" />
            <Bar dataKey="Pausa" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inizio</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fine</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durata</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modalità</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sessions.map((session, index) => (
              <tr key={session.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{new Date(session.startTime).toLocaleDateString()}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {new Date(session.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {new Date(session.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{Math.floor(session.duration / 60)} min</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      session.status === "WORK" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    }`}>
                    {session.status === "WORK" ? "Studio" : "Pausa"}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {session.mode === "POMODORO" ? "Pomodoro" : "Personalizzata"}
                  </span>
                </td>
              </tr>
            ))}
            {sessions.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-2 text-gray-500">
                  Nessuna sessione trovata.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FocusHistory;
