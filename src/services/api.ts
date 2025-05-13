const API_BASE_URL = "http://localhost:8080/api"; // Cambia la porta se diversa

export async function fetchRoutines() {
  const response = await fetch(`${API_BASE_URL}/routines`);
  return response.json();
}

export async function addRoutine(data: any) {
  const response = await fetch(`${API_BASE_URL}/routines`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}
export async function getUpcomingSessions() {
  const response = await fetch(`${API_BASE_URL}/upcoming-sessions`);
  if (!response.ok) {
    throw new Error("Failed to fetch upcoming sessions");
  }
  return response.json();
}

export async function getWeeklyStats() {
  const response = await fetch(`${API_BASE_URL}/weekly-stats`);
  if (!response.ok) {
    throw new Error("Failed to fetch weekly stats");
  }
  return response.json();
}

export async function getRecentActivities() {
  const response = await fetch(`${API_BASE_URL}/recent-activities`);
  if (!response.ok) {
    throw new Error("Failed to fetch recent activities");
  }
  return response.json();
}

export async function getReminders() {
  const response = await fetch(`${API_BASE_URL}/reminders`);
  if (!response.ok) {
    throw new Error("Failed to fetch reminders");
  }
  return response.json();
}
