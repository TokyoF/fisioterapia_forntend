const API_BASE_URL = "http://localhost:8080/api";

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = true, headers = {}, ...restOptions } = options;

  const config: RequestInit = {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (requiresAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      // Intentar leer el error del servidor
      let errorMessage = `Error ${response.status}`;
      let errorText = "";
      
      try {
        errorText = await response.text();
        errorMessage = errorText || errorMessage;
      } catch (e) {
        // Si no se puede leer el texto, usar mensaje por defecto
      }

      // Mensajes específicos por código de estado
      if (response.status === 401) {
        errorMessage = "No autorizado. Por favor inicia sesión nuevamente.";
        // Limpiar sesión inválida
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Redirigir al login solo si estamos en una página protegida
        if (window.location.pathname.includes("/dashboard")) {
          window.location.href = "/";
        }
      } else if (response.status === 403) {
        errorMessage = "No tienes permisos para realizar esta acción.";
      } else if (response.status === 404) {
        errorMessage = "Recurso no encontrado.";
      } else if (response.status === 500) {
        // Si el error 500 es por token inválido, limpiar sesión
        if (errorText.includes("Usuario no encontrado") || errorText.includes("UsernameNotFoundException")) {
          errorMessage = "Sesión inválida. Por favor inicia sesión nuevamente.";
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          if (window.location.pathname.includes("/dashboard")) {
            window.location.href = "/";
          }
        } else {
          errorMessage = "Error interno del servidor. Intenta más tarde.";
        }
      }

      throw new Error(errorMessage);
    }

    // Si la respuesta es exitosa pero vacía (204 No Content)
    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  } catch (error) {
    // Capturar errores de red
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "No se puede conectar con el servidor. Verifica que el backend esté corriendo."
      );
    }
    // Re-lanzar otros errores
    throw error;
  }
}

export const api = {
  // Auth
  login: (username: string, password: string) =>
    apiRequest("/auth/login", {
      method: "POST",
      requiresAuth: false,
      body: JSON.stringify({ username, password }),
    }),

  register: (data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) =>
    apiRequest("/auth/register/paciente", {
      method: "POST",
      requiresAuth: false,
      body: JSON.stringify(data),
    }),

  forgotPassword: (email: string) =>
    apiRequest(`/auth/forgot-password?email=${encodeURIComponent(email)}`, {
      method: "POST",
      requiresAuth: false,
    }),

  resetPassword: (token: string, newPassword: string) =>
    apiRequest(
      `/auth/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`,
      {
        method: "POST",
        requiresAuth: false,
      }
    ),

  // Pacientes
  getPacienteActual: () => apiRequest("/pacientes/me", { method: "GET" }),

  getPaciente: (id: number) => apiRequest(`/pacientes/${id}`, { method: "GET" }),

  // Fisioterapeutas
  getFisioterapeutas: () => apiRequest("/fisioterapeutas", { method: "GET" }),

  getFisioterapeuta: (id: number) =>
    apiRequest(`/fisioterapeutas/${id}`, { method: "GET" }),

  getFisioterapeutaActual: () => apiRequest("/fisioterapeutas/me", { method: "GET" }),

  // Citas
  getCitas: () => apiRequest("/citas", { method: "GET" }),

  getCitasPaciente: (pacienteId: number) =>
    apiRequest(`/citas/paciente/${pacienteId}`, { method: "GET" }),

  getCitasFisioterapeuta: (fisioterapeutaId: number) =>
    apiRequest(`/citas/fisioterapeuta/${fisioterapeutaId}`, { method: "GET" }),

  crearCita: (data: {
    fisioterapeutaId: number;
    fecha: string;
    hora: string;
    motivo?: string;
  }) =>
    apiRequest("/citas", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  actualizarCita: (
    id: number,
    data: { fecha: string; hora: string; motivo?: string }
  ) =>
    apiRequest(`/citas/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  cancelarCita: (id: number) =>
    apiRequest(`/citas/${id}/cancelar`, {
      method: "PUT",
    }),

  // Horarios
  getHorariosFisioterapeuta: (fisioterapeutaId: number) =>
    apiRequest(`/horarios/fisioterapeuta/${fisioterapeutaId}`, { method: "GET" }),

  crearHorario: (data: {
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
  }) =>
    apiRequest("/horarios", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  actualizarHorario: (
    id: number,
    data: { diaSemana: string; horaInicio: string; horaFin: string }
  ) =>
    apiRequest(`/horarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  eliminarHorario: (id: number) =>
    apiRequest(`/horarios/${id}`, {
      method: "DELETE",
    }),

  // Registros Clínicos
  getRegistrosPaciente: (pacienteId: number) =>
    apiRequest(`/registros-clinicos/paciente/${pacienteId}`, { method: "GET" }),

  crearRegistroClinico: (data: {
    pacienteId: number;
    diagnostico: string;
    tratamiento: string;
    observaciones: string;
  }) =>
    apiRequest("/registros-clinicos", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  actualizarRegistroClinico: (
    id: number,
    data: {
      diagnostico: string;
      tratamiento: string;
      observaciones: string;
    }
  ) =>
    apiRequest(`/registros-clinicos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
