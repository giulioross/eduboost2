import { ReactNode } from "react";

const API_BASE_URL = "http://localhost:8080/api";

// Recupera il token JWT da localStorage
function getToken(): string | null {
  return localStorage.getItem("token");
}

// Rimuove il token dal localStorage
function clearToken() {
  localStorage.removeItem("token");
}

// Header di autorizzazione
function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  if (!token) throw new Error("Token mancante. Effettua il login.");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

// Gestione centralizzata della risposta
async function handleResponse(response: Response) {
  if (!response.ok) {
    let errorMessage = "Errore generico";

    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      errorMessage = await response.text();
    }

    if (response.status === 401) {
      clearToken();
      window.location.href = "/login";
      throw new Error("Sessione scaduta. Effettua nuovamente il login.");
    }

    console.error(`Errore API [${response.status}]: ${errorMessage}`);
    throw new Error(errorMessage);
  }

  return response.json();
}

// Wrapper API generico
export async function fetchApi(path: string, options: RequestInit = {}) {
  const headers = getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  return handleResponse(response);
}

// Login
export async function loginUser(credentials: { email: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await handleResponse(response);

  if (data.token) {
    localStorage.setItem("token", data.token);
  } else {
    throw new Error("Token non ricevuto");
  }

  return data;
}

// Registrazione
export async function registerUser(data: { email: string; password: string; name?: string; surname?: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

// Logout
export function logoutUser() {
  clearToken();
  window.location.href = "/login";
}

// Tipi

export interface MindMap {
  id: number;
  title: string;
  content: string;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Routine {
  id: number;
  title: string;
  description: string;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Quiz {
  id: number;
  title: string;
  questions: any[];
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FocusSession {
  status: ReactNode;
  id: number;
  userId: number;
  duration: number;
  startTime: string;
  endTime: string;
  mode: "POMODORO" | "CUSTOM";
}

// --- MindMaps ---
export const fetchMindMaps = (p0: string): Promise<MindMap[]> => fetchApi("/mindmaps");

export const createMindMap = (data: { title: string; content: string }, p0: string): Promise<MindMap> =>
  fetchApi("/mindmaps", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteMindMap = (id: number, p0: string): Promise<void> =>
  fetchApi(`/mindmaps/${id}`, {
    method: "DELETE",
  });

// --- Routines ---
export const fetchRoutines = (): Promise<Routine[]> => fetchApi("/routines");

export const addRoutine = (data: Omit<Routine, "id">): Promise<Routine> =>
  fetchApi("/routines", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteRoutine = (id: number): Promise<void> =>
  fetchApi(`/routines/${id}`, {
    method: "DELETE",
  });

// --- Quizzes ---
export const fetchQuizzes = (): Promise<Quiz[]> => fetchApi("/quizzes");

export const createQuiz = (data: Omit<Quiz, "id">): Promise<Quiz> =>
  fetchApi("/quizzes", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteQuiz = (id: number): Promise<void> =>
  fetchApi(`/quizzes/${id}`, {
    method: "DELETE",
  });

// --- Focus Sessions ---
export const saveFocusSession = (data: Omit<FocusSession, "id">): Promise<FocusSession> =>
  fetchApi("/focus-sessions", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getFocusSessions = (userId: number): Promise<FocusSession[]> => fetchApi(`/focus-sessions/${userId}`);

// --- Dashboard ---
export const getUpcomingSessions = () => fetchApi("/upcoming-sessions");
export const getWeeklyStats = () => fetchApi("/weekly-stats");
export const getRecentActivities = () => fetchApi("/recent-activities");
export const getReminders = () => fetchApi("/reminders");
