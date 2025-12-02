"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, User, FileText, MapPin, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface Appointment {
  id: number;
  codigo: string;
  fecha: string;
  hora: string;
  estado: string;
  motivo?: string;
  fisioterapeuta: {
    especialidad: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

export function AppointmentHistory() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "COMPLETADA" | "PROGRAMADA" | "CONFIRMADA" | "CANCELADA" | "INASISTENCIA">("all");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const paciente = await api.getPacienteActual();
      const citas = await api.getCitasPaciente(paciente.id);
      setAppointments(citas || []);
    } catch (err: any) {
      console.error("Error al cargar citas:", err);
      
      // Si el error es 404 o el paciente no existe, no mostramos error
      if (err?.response?.status === 404 || err?.message?.includes("not found") || err?.message?.includes("no encontrado")) {
        setAppointments([]);
        setError("");
      } else {
        setError("Error al cargar las citas. Por favor, intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(apt =>
    filter === "all" ? true : apt.estado === filter
  ).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case "COMPLETADA":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "PROGRAMADA":
      case "CONFIRMADA":
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case "CANCELADA":
      case "INASISTENCIA":
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case "COMPLETADA":
        return "Completada";
      case "PROGRAMADA":
        return "Programada";
      case "CONFIRMADA":
        return "Confirmada";
      case "CANCELADA":
        return "Cancelada";
      case "INASISTENCIA":
        return "Inasistencia";
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "COMPLETADA":
        return "bg-green-50 border-green-200 text-green-700";
      case "PROGRAMADA":
      case "CONFIRMADA":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "CANCELADA":
      case "INASISTENCIA":
        return "bg-red-50 border-red-200 text-red-700";
    }
  };

  const getFilterCount = (filterValue: string) => {
    if (filterValue === "all") return appointments.length;
    return appointments.filter(a => a.estado === filterValue).length;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-white" />
          <h2 className="text-3xl font-bold text-white">Historial de Citas</h2>
        </div>
        <p className="text-white/90 text-lg">
          Revisa tus citas anteriores y programadas
        </p>
      </motion.div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando historial...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-red-50 rounded-xl border-2 border-red-200 p-8">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-600 font-semibold mb-2">{error}</p>
          <Button
            onClick={loadAppointments}
            variant="outline"
            className="mt-4 border-red-300 text-red-600 hover:bg-red-50"
          >
            Reintentar
          </Button>
        </div>
      ) : appointments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-16 shadow-lg text-center border-2 border-dashed border-primary/30"
        >
          <FileText className="w-24 h-24 text-primary/30 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-700 mb-3">No tienes historial de citas</h3>
          <p className="text-gray-500 text-lg mb-6 max-w-md mx-auto">
            Aquí aparecerán todas tus citas una vez que reserves y completes sesiones de fisioterapia.
          </p>
          <Button
            onClick={() => {
              const event = new CustomEvent('changeView', { detail: 'book' });
              window.dispatchEvent(event);
            }}
            className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Reservar mi primera cita
          </Button>
        </motion.div>
      ) : (
        <>
          <div className="flex gap-3 flex-wrap">
            {[
              { value: "all", label: "Todas" },
              { value: "PROGRAMADA", label: "Programadas" },
              { value: "CONFIRMADA", label: "Confirmadas" },
              { value: "COMPLETADA", label: "Completadas" },
              { value: "CANCELADA", label: "Canceladas" },
              { value: "INASISTENCIA", label: "Inasistencias" },
            ].map(filterOption => (
              <motion.button
                key={filterOption.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(filterOption.value as any)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  filter === filterOption.value
                    ? "bg-primary text-white shadow-lg"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-primary/50"
                }`}
              >
                {filterOption.label} ({getFilterCount(filterOption.value)})
              </motion.button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-12 shadow-lg text-center border-2 border-dashed border-gray-300"
              >
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No hay citas en esta categoría</p>
                <p className="text-gray-400 text-sm mt-2">Prueba con otro filtro</p>
              </motion.div>
            ) : (
              filteredAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border-2 border-primary/30 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            Dr(a). {appointment.fisioterapeuta.user.firstName} {appointment.fisioterapeuta.user.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">{appointment.fisioterapeuta.especialidad}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 ml-15">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          <span className="text-gray-700 font-medium">
                            {new Date(appointment.fecha).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-primary" />
                          <span className="text-gray-700 font-medium">{appointment.hora}</span>
                        </div>
                      </div>

                      {appointment.motivo && (
                        <div className="mt-4 ml-15">
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Motivo:</span> {appointment.motivo}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex lg:flex-col items-center lg:items-end gap-3">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-semibold ${getStatusColor(appointment.estado)}`}>
                        {getStatusIcon(appointment.estado)}
                        <span>{getStatusText(appointment.estado)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
