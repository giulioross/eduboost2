<<<<<<< HEAD
// API base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Helper function for handling API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'Network response was not ok');
  }
=======
const API_BASE_URL = "http://localhost:8080/api";

// ✅ Funzione per aggiungere header di autenticazione
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token mancante. Effettua di nuovo il login.");
  return { Authorization: `Bearer ${token}` };
}

// ✅ Login e salvataggio del token
export async function loginUser(credentials: { email: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Credenziali non valide");
  }

  const data = await response.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
  } else {
    throw new Error("Token non ricevuto");
  }

  return data;
}

// ✅ Funzioni con token
export async function fetchRoutines() {
  const response = await fetch(`${API_BASE_URL}/routines`, {
    headers: getAuthHeaders(),
  });
>>>>>>> 638423a (o)
  return response.json();
}

// Generic fetch wrapper with error handling
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Routines
export async function fetchRoutines() {
  return fetchApi('/routines');
}

export async function addRoutine(data: any) {
<<<<<<< HEAD
  return fetchApi('/routines', {
    method: 'POST',
=======
  const response = await fetch(`${API_BASE_URL}/routines`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
>>>>>>> 638423a (o)
    body: JSON.stringify(data),
  });
}

<<<<<<< HEAD
export async function deleteRoutine(id: number) {
  return fetchApi(`/routines/${id}`, {
    method: 'DELETE',
  });
}

// Mind Maps
export async function fetchMindMaps() {
  return fetchApi('/mindmaps');
}

export async function createMindMap(data: any) {
  return fetchApi('/mindmaps', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteMindMap(id: number) {
  return fetchApi(`/mindmaps/${id}`, {
    method: 'DELETE',
  });
}

// Quizzes
export async function fetchQuizzes() {
  return fetchApi('/quizzes');
}

export async function createQuiz(data: any) {
  return fetchApi('/quizzes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteQuiz(id: number) {
  return fetchApi(`/quizzes/${id}`, {
    method: 'DELETE',
  });
}

// Focus Sessions
export async function saveFocusSession(data: any) {
  return fetchApi('/focus-sessions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getFocusSessions(userId: number) {
  return fetchApi(`/focus-sessions/${userId}`);
}

// Dashboard Data
export async function getUpcomingSessions() {
  return fetchApi('/upcoming-sessions');
}

export async function getWeeklyStats() {
  return fetchApi('/weekly-stats');
}

export async function getRecentActivities() {
  return fetchApi('/recent-activities');
}

export async function getReminders() {
  return fetchApi('/reminders');
=======
export async function getUpcomingSessions() {
  const response = await fetch(`${API_BASE_URL}/upcoming-sessions`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch upcoming sessions");
  return response.json();
}

export async function getWeeklyStats() {
  const response = await fetch(`${API_BASE_URL}/weekly-stats`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch weekly stats");
  return response.json();
}

export async function getRecentActivities() {
  const response = await fetch(`${API_BASE_URL}/recent-activities`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch recent activities");
  return response.json();
}

export async function getReminders() {
  const response = await fetch(`${API_BASE_URL}/reminders`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch reminders");
  return response.json();
>>>>>>> 638423a (o)
}

// Types
export interface Routine {
  id: number;
  title: string;
  description: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface MindMap {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Quiz {
  id: number;
  title: string;
  questions: Question[];
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: number;
  quizId: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  correctAnswer: string;
}

export interface FocusSession {
  id: number;
  userId: number;
  duration: number;
  status: 'WORK' | 'BREAK';
  startTime: string;
  endTime: string;
}