import React from "react";
import { useQuery } from "react-query";
import { fetchRoutines, fetchMindMaps, fetchQuizzes, getRecentSessions, FocusSession, MindMap, Routine } from "../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toLocaleDateString());
  }
  return days;
}

function groupByDay(items: { [key: string]: any }[], dateField: string) {
  const days = getLast7Days();
  const counts = days.map((day) => {
    const count = items.filter((item) => (item as any)[dateField] && new Date((item as any)[dateField]).toLocaleDateString() === day).length;
    return count;
  });
  return counts;
}

const DashboardPage: React.FC = () => {
  const { data: routines = [] } = useQuery("routines", fetchRoutines);
  const { data: mindmaps = [] } = useQuery("mindmaps", fetchMindMaps);
  const { data: quizzes = [] } = useQuery("quizzes", fetchQuizzes);
  const { data: focusSessions = [] } = useQuery<FocusSession[]>("focusSessions", getRecentSessions);

  // Prepara dati per il grafico
  const days = getLast7Days();
  const routineCounts = groupByDay(routines, "createdAt");
  const mindmapCounts = groupByDay(mindmaps, "createdAt");
  const focusCounts = groupByDay(focusSessions, "startTime");

  const chartData = days.map((day, i) => ({
    day,
    Routine: routineCounts[i],
    "Mappe mentali": mindmapCounts[i],
    "Sessioni Focus": focusCounts[i],
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Benvenuto nella Dashboard</h1>

      {/* Grafico settimanale */}
      <section className="bg-white rounded shadow p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4">Progressi ultimi 7 giorni</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Routine" fill="#2563eb" />
            <Bar dataKey="Mappe mentali" fill="#10b981" />
            <Bar dataKey="Sessioni Focus" fill="#f59e42" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Routine */}
        <section className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Routine recenti</h2>
          <ul>
            {routines
              .slice(-5)
              .reverse()
              .map((r) => (
                <li key={r.id} className="mb-1">
                  <span className="font-medium">{r.name || r.title}</span>
                  <span className="text-gray-500 text-xs ml-2">{r.createdAt && new Date(r.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            {routines.length === 0 && <li>Nessuna routine trovata.</li>}
          </ul>
        </section>
        {/* Mappe mentali */}
        <section className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Mappe mentali create</h2>
          <ul>
            {mindmaps
              .slice(-5)
              .reverse()
              .map((m) => (
                <li key={m.id} className="mb-1">
                  <span className="font-medium">{m.title}</span>
                  <span className="text-gray-500 text-xs ml-2">{m.createdAt && new Date(m.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            {mindmaps.length === 0 && <li>Nessuna mappa mentale trovata.</li>}
          </ul>
        </section>
        {/* Quiz */}
        <section className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Quiz disponibili</h2>
          <ul>
            {quizzes
              .slice(-5)
              .reverse()
              .map((q) => (
                <li key={q.id} className="mb-1">
                  <span className="font-medium">{q.title}</span>
                  <span className="text-gray-500 text-xs ml-2">{q.createdAt && new Date(q.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            {quizzes.length === 0 && <li>Nessun quiz trovato.</li>}
          </ul>
        </section>
        {/* Focus Sessions */}
        <section className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Sessioni Focus recenti</h2>
          <ul>
            {focusSessions
              .slice(-5)
              .reverse()
              .map((s) => (
                <li key={s.id} className="mb-1">
                  <span className="font-medium">{s.status}</span>
                  <span className="text-gray-500 text-xs ml-2">{new Date(s.startTime).toLocaleDateString()}</span>
                  <span className="text-gray-500 text-xs ml-2">{Math.floor(s.duration / 60)} min</span>
                </li>
              ))}
            {focusSessions.length === 0 && <li>Nessuna sessione trovata.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
