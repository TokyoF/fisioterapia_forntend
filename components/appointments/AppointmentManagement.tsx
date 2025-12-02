"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Edit2, Trash2, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
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

export function AppointmentManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    fecha: "",
    hora: "",
    motivo: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const upcomingAppointments = appointments.filter(apt => apt.estado === "PROGRAMADA" || apt.estado === "CONFIRMADA");
  const pastAppointments = appointments.filter(apt => apt.estado === "COMPLETADA" || apt.estado === "CANCELADA");

  const handleCancelAppointment = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta cita?")) return;

    try {
      setLoading(true);
      await api.cancelarCita(id);
      alert("Cita cancelada exitosamente");
      loadAppointments();
    } catch (err) {
      alert("Error al cancelar la cita");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingId(appointment.id);
    setEditForm({
      fecha: appointment.fecha,
      hora: appointment.hora,
      motivo: appointment.motivo || ""
    });
  };

  const handleSaveEdit = async (id: number) => {
    try {
      setLoading(true);
      await api.actualizarCita(id, {
        fecha: editForm.fecha,
        hora: editForm.hora,
        motivo: editForm.motivo || undefined
      });
      setEditingId(null);
      alert("Cita modificada exitosamente");
      loadAppointments();
    } catch (err) {
      alert("Error al modificar la cita");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "PROGRAMADA":
      case "CONFIRMADA":
        return (
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border-2 border-blue-200 font-semibold text-sm">
            <AlertCircle className="w-4 h-4" />
            {estado === "CONFIRMADA" ? "Confirmada" : "Programada"}
          </div>
        );
      case "COMPLETADA":
        return (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-lg border-2 border-green-200 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Completada
          </div>
        );
      case "CANCELADA":
        return (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-lg border-2 border-red-200 font-semibold text-sm">
            <XCircle className="w-4 h-4" />
            Cancelada
          </div>
        );
      case "INASISTENCIA":
        return (
          <div className="flex items-center gap-2 bg-gray-50 text-gray-700 px-3 py-1 rounded-lg border-2 border-gray-200 font-semibold text-sm">
            <XCircle className="w-4 h-4" />
            Inasistencia
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-8 h-8 text-white" />
          <h2 className="text-3xl font-bold text-white">Gestión de Citas</h2>
        </div>
        <p className="text-white/90 text-lg">
          Administra, modifica o cancela tus citas programadas
        </p>
      </motion.div>

      {/* Próximas Citas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-8 shadow-lg border-2 border-primary/30"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <AlertCircle className="w-7 h-7 text-blue-500" />
          Próximas Citas ({upcomingAppointments.length})
        </h3>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Cargando citas...</p>
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
        ) : upcomingAppointments.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border-2 border-dashed border-primary/30">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Calendar className="w-20 h-20 text-primary/40 mx-auto mb-6" />
              <h4 className="text-2xl font-bold text-gray-700 mb-3">No tienes citas programadas</h4>
              <p className="text-gray-500 text-lg mb-6 max-w-md mx-auto">
                Empieza tu camino hacia el bienestar. ¡Agenda tu primera cita ahora!
              </p>
              <Button
                onClick={() => {
                  // Navegar a la vista de reservar cita
                  const event = new CustomEvent('changeView', { detail: 'book' });
                  window.dispatchEvent(event);
                }}
                className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Reservar mi primera cita
              </Button>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-2 border-primary/30 rounded-xl p-6 hover:shadow-lg transition-all"
              >
                {editingId === appointment.id ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">
                          Dr(a). {appointment.fisioterapeuta.user.firstName} {appointment.fisioterapeuta.user.lastName}
                        </h4>
                        <p className="text-sm text-gray-600">{appointment.fisioterapeuta.especialidad}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nueva Fecha
                        </label>
                        <input
                          type="date"
                          value={editForm.fecha}
                          onChange={(e) => setEditForm({ ...editForm, fecha: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nueva Hora
                        </label>
                        <input
                          type="time"
                          value={editForm.hora}
                          onChange={(e) => setEditForm({ ...editForm, hora: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Motivo
                      </label>
                      <textarea
                        value={editForm.motivo}
                        onChange={(e) => setEditForm({ ...editForm, motivo: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none min-h-[80px]"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleSaveEdit(appointment.id)}
                        className="flex-1 bg-primary hover:bg-primary/80 text-white font-semibold"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Guardar Cambios
                      </Button>
                      <Button
                        onClick={() => setEditingId(null)}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-800">
                              Dr(a). {appointment.fisioterapeuta.user.firstName} {appointment.fisioterapeuta.user.lastName}
                            </h4>
                            <p className="text-sm text-gray-600">{appointment.fisioterapeuta.especialidad}</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 ml-15">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span className="text-gray-700 font-medium">
                              {new Date(appointment.fecha).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            <span className="text-gray-700 font-medium">{appointment.hora}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {getStatusBadge(appointment.estado)}
                          </div>
                        </div>

                        {appointment.motivo && (
                          <div className="mt-4 ml-15 bg-primary/10 rounded-lg p-3">
                            <p className="text-sm text-gray-700"><span className="font-semibold">Motivo:</span> {appointment.motivo}</p>
                          </div>
                        )}
                      </div>

                      {(appointment.estado === "PROGRAMADA" || appointment.estado === "CONFIRMADA") && (
                        <div className="flex lg:flex-col gap-2">
                          <Button
                            onClick={() => handleEditAppointment(appointment)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                          >
                            <Edit2 className="w-4 h-4 lg:mr-0 mr-2" />
                            <span className="lg:hidden">Modificar</span>
                          </Button>
                          <Button
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold"
                          >
                            <Trash2 className="w-4 h-4 lg:mr-0 mr-2" />
                            <span className="lg:hidden">Cancelar</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Citas Pasadas */}
      {pastAppointments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-300"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-7 h-7 text-gray-500" />
            Historial de Citas ({pastAppointments.length})
          </h3>

          <div className="space-y-4">
            {pastAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-700">
                      Dr(a). {appointment.fisioterapeuta.user.firstName} {appointment.fisioterapeuta.user.lastName}
                    </h4>
                    <p className="text-sm text-gray-500">{appointment.fisioterapeuta.especialidad}</p>
                  </div>
                  {getStatusBadge(appointment.estado)}
                </div>

                <div className="grid md:grid-cols-3 gap-3 ml-13 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(appointment.fecha).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{appointment.hora}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
