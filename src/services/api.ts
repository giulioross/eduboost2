/// <reference types="vite/client" />

const API_BASE_URL =
  typeof import.meta.env.VITE_API_URL === "string" && import.meta.env.VITE_API_URL.trim() !== ""
    ? import.meta.env.VITE_API_URL
    : "http://localhost:8080/api";

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
      // Gestione caso specifico: utente non autenticato
      if (errorMessage === "User not authenticated") {
        clearToken();
        window.location.href = "/login";
        throw new Error("Sessione scaduta. Effettua nuovamente il login.");
      }
    } catch {
      errorMessage = await response.text();
    }
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
export async function loginUser(credentials: { username: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await handleResponse(response);

  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username || credentials.username);
    if (data.roles) localStorage.setItem("roles", JSON.stringify(data.roles));
  } else {
    throw new Error("Token non ricevuto");
  }

  return data;
}

// Registrazione
export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: string;
  roles: string[];
}) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
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
  points: string[];
  date: string;
  id: number;
  title: string;
  description: string;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Nuova struttura per quiz e domande
export interface QuizQuestion {
  question: string;
  options: string[]; // 4 risposte
  correctIndex: number; // indice della risposta corretta (0-3)
}

export interface Quiz {
  id: number;
  title: string;
  questions: QuizQuestion[];
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FocusSession {
  id: number;
  userId: number;
  duration: number;
  startTime: string;
  endTime: string;
  mode: "POMODORO" | "CUSTOM";
  status: "WORK" | "BREAK";
}

// --- MindMaps ---
export const fetchMindMaps = async (): Promise<MindMap[]> => {
  const res = await fetchApi("/maps");
  // Mappa description -> content per compatibilità frontend
  return Array.isArray(res)
    ? res.map((m: any) => ({
        ...m,
        content: m.content ?? m.description ?? "",
      }))
    : [];
};
export const createMindMap = (data: { title: string; content: string }): Promise<MindMap> =>
  fetchApi("/maps", {
    method: "POST",
    body: JSON.stringify({
      title: data.title,
      description: data.content, // usa content come description
      subject: "", // opzionale, puoi aggiungere un campo se vuoi
      topic: "", // opzionale, puoi aggiungere un campo se vuoi
    }),
  });

export const deleteMindMap = (id: number): Promise<void> =>
  fetchApi(`/maps/${id}`, {
    method: "DELETE",
  });

// --- Routines ---

export interface StudyBlock {
  date: unknown;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface Routine {
  id: number;
  name: string;
  description: string;
  subject: string;
  time: string;
  duration: number;
  days: string[];
  points: string[];
  studyBlocks?: StudyBlock[];
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const fetchRoutines = async (): Promise<Routine[]> => {
  const res = await fetchApi("/routines");
  return Array.isArray(res) ? res : [];
};
export const addRoutine = async (routine: {
  name: string;
  description?: string;
  studyBlocks: Array<{
    subject: string;
    topic?: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    recommendedMethod?: string;
    breakInterval?: number;
    breakDuration?: number;
  }>;
  points?: string[];
}): Promise<Routine> => {
  return fetchApi("/routines", {
    method: "POST",
    body: JSON.stringify(routine),
  });
};

export const deleteRoutine = async (id: number): Promise<void> => {
  return fetchApi(`/routines/${id}`, {
    method: "DELETE",
  });
};
// --- Quizzes ---
// Modifica le interfacce per i tipi di richiesta
export interface CreateQuizRequest {
  title: string;
  description?: string;
  subject?: string;
  topic?: string;
  quizType: string; // es: "MULTIPLE_CHOICE"
  adaptive?: boolean;
  timeLimit?: number;
  questions: {
    questionText: string;
    questionType: string; // es: "MULTIPLE_CHOICE"
    difficulty?: number;
    points?: number;
    explanation?: string;
    correctAnswer?: string;
    options: {
      optionText: string;
      isCorrect: boolean;
    }[];
  }[];
}

export interface QuizResponse {
  id: number;
  title: string;
  questions: QuizQuestion[];
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// Aggiorna le funzioni API
export const createQuizWithQuestions = async (data: CreateQuizRequest): Promise<Quiz> => {
  return fetchApi("/quizzes", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const fetchQuizzes = async (): Promise<Quiz[]> => {
  const res = await fetchApi("/quizzes");
  return Array.isArray(res) ? res : [];
};

export const deleteQuiz = async (id: number): Promise<void> => {
  return fetchApi(`/quizzes/${id}`, {
    method: "DELETE",
  });
};
// --- Focus Sessions ---
export const saveFocusSession = (data: Omit<FocusSession, "id">): Promise<FocusSession> =>
  fetchApi("/sessions", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getRecentSessions = (): Promise<FocusSession[]> => fetchApi("/sessions"); // --- Dashboard ---
export const getUpcomingSessions = () => fetchApi("/upcoming-sessions");
export const getWeeklyStats = () => fetchApi("/weekly-stats");
export const getRecentActivities = () => fetchApi("/recent-activities");
export const getReminders = () => fetchApi("/reminders");
