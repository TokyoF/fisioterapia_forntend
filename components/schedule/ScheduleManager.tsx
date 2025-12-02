"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, Trash2, Save } from "lucide-react";
import { api } from "@/lib/api";

interface TimeSlot {
  id: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}

const DAYS = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];

const DAY_LABELS: Record<string, string> = {
  LUNES: "Lunes",
  MARTES: "Martes",
  MIERCOLES: "Miércoles",
  JUEVES: "Jueves",
  VIERNES: "Viernes",
  SABADO: "Sábado",
};

export function ScheduleManager() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fisioterapeutaId, setFisioterapeutaId] = useState<number | null>(null);

  const [newSlot, setNewSlot] = useState({
    diaSemana: "LUNES",
    horaInicio: "08:00",
    horaFin: "09:00",
  });

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      setError("");
      const fisioterapeuta = await api.getFisioterapeutaActual();
      setFisioterapeutaId(fisioterapeuta.id);
      const horarios = await api.getHorariosFisioterapeuta(fisioterapeuta.id);
      setTimeSlots(horarios);
    } catch (err) {
      setError("Error al cargar horarios");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = async () => {
    if (!fisioterapeutaId) return;

    try {
      setLoading(true);
      await api.crearHorario(newSlot);
      alert("Horario agregado exitosamente");
      await loadSchedule();
    } catch (err) {
      alert("Error al agregar horario");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeTimeSlot = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este horario?")) return;

    try {
      setLoading(true);
      await api.eliminarHorario(id);
      alert("Horario eliminado exitosamente");
      await loadSchedule();
    } catch (err) {
      alert("Error al eliminar horario");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (horario: TimeSlot) => {
    try {
      setLoading(true);
      await api.actualizarHorario(horario.id, {
        diaSemana: horario.diaSemana,
        horaInicio: horario.horaInicio,
        horaFin: horario.horaFin,
      });
      await loadSchedule();
    } catch (err) {
      alert("Error al actualizar disponibilidad");
      console.error(err);
    } finally {
      setLoading(false);
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
          <h2 className="text-3xl font-bold text-white">Gestión de Horarios</h2>
        </div>
        <p className="text-white/90 text-lg">
          Configura tus horarios disponibles para atención de pacientes
        </p>
      </motion.div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando horarios...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-primary/30"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Plus className="w-6 h-6 text-primary" />
              Agregar Horario
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Día de la semana
                </label>
                <select
                  value={newSlot.diaSemana}
                  onChange={(e) => setNewSlot({ ...newSlot, diaSemana: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                >
                  {DAYS.map(day => (
                    <option key={day} value={day}>{DAY_LABELS[day]}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hora Inicio
                  </label>
                  <input
                    type="time"
                    value={newSlot.horaInicio}
                    onChange={(e) => setNewSlot({ ...newSlot, horaInicio: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hora Fin
                  </label>
                  <input
                    type="time"
                    value={newSlot.horaFin}
                    onChange={(e) => setNewSlot({ ...newSlot, horaFin: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <Button
                onClick={addTimeSlot}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-6 disabled:opacity-50"
              >
                <Plus className="w-5 h-5 mr-2" />
                Agregar Horario
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-primary/30"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              Horarios Configurados
            </h3>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {timeSlots.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No hay horarios configurados</p>
              ) : (
                DAYS.map(day => {
                  const daySlots = timeSlots.filter(slot => slot.diaSemana === day);
                  if (daySlots.length === 0) return null;

                  return (
                    <div key={day} className="mb-4">
                      <h4 className="font-bold text-gray-700 mb-2 text-lg">{DAY_LABELS[day]}</h4>
                      <div className="space-y-2">
                        {daySlots.map(slot => (
                          <motion.div
                            key={slot.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                              slot.disponible
                                ? "bg-primary/10 border-2 border-primary/30"
                                : "bg-gray-100 border-2 border-gray-300 opacity-60"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-primary" />
                              <span className="font-semibold text-gray-700">
                                {slot.horaInicio} - {slot.horaFin}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                                slot.disponible
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-400 text-white"
                              }`}>
                                {slot.disponible ? "Disponible" : "No disponible"}
                              </span>
                              <button
                                onClick={() => removeTimeSlot(slot.id)}
                                disabled={loading}
                                className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
