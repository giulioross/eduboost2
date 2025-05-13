import React, { useEffect, useState } from "react";
import { Calendar, BookOpen, Brain, Clock, Award, TrendingUp, Bell, BarChart3, CheckCircle2, ChevronRight } from "lucide-react";
import * as api from "../services/api";

const DashboardPage: React.FC = () => {
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sessions = await api.getUpcomingSessions();
        const stats = await api.getWeeklyStats();
        const activities = await api.getRecentActivities();
        const remindersData = await api.getReminders();

        setUpcomingSessions(sessions);
        setWeeklyStats(stats);
        setRecentActivities(activities);
        setReminders(remindersData);
      } catch (err) {
        console.error("Errore nel caricamento dei dati:", err);
        setError("Errore nel caricamento dei dati");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto py-8">
      {/* Prossime Sessioni */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Prossime Sessioni</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingSessions.map((session: any) => (
            <div key={session.id} className="card p-4">
              <h3 className="font-medium text-lg">{session.title}</h3>
              <p className="text-sm text-gray-500">{session.time}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Statistiche Settimanali */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Statistiche Settimanali</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {weeklyStats &&
            Object.keys(weeklyStats).map((key) => (
              <div key={key} className="card p-4">
                <h3 className="font-medium text-lg">{key}</h3>
                <p className="text-2xl font-bold">{weeklyStats[key]}</p>
              </div>
            ))}
        </div>
      </section>

      {/* Attività Recenti */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Attività Recenti</h2>
        <div className="space-y-4">
          {recentActivities.map((activity: any) => (
            <div key={activity.id} className="flex items-center">
              <div className="mr-4">
                <BarChart3 className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <h3 className="font-medium">{activity.title}</h3>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promemoria */}
      <section>
        <h2 className="text-xl font-bold mb-4">Promemoria</h2>
        <div className="space-y-4">
          {reminders.map((reminder: any) => (
            <div key={reminder.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium">{reminder.title}</h3>
                  {reminder.urgent && <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">Urgente</span>}
                </div>
                <p className="text-sm text-gray-500 mt-1">{reminder.date}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  reminder.type === "Exam"
                    ? "bg-red-50 text-red-700"
                    : reminder.type === "Assignment"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-purple-50 text-purple-700"
                }`}>
                {reminder.type}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
