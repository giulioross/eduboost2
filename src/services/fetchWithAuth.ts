export function clearToken() {
  localStorage.removeItem("token");
}

// services/fetchWithAuth.ts

export async function fetchWithAuth(url: string, method: "GET" | "POST" | "PUT" | "DELETE" = "GET", data?: any) {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (response.status === 401) {
    // Token scaduto o non valido, fai logout o redirect
    localStorage.removeItem("token");
    window.location.href = "/login"; // o la pagina di login che usi
    throw new Error("Unauthorized - token expired or invalid");
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Fetch error");
  }

  // Prova a fare il parse JSON
  try {
    return await response.json();
  } catch {
    return null;
  }
}
