"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, Trash2, CalendarDays, AlertCircle, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [isAddingSlot, setIsAddingSlot] = useState(false);

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

    // Validación
    if (newSlot.horaInicio >= newSlot.horaFin) {
      alert("La hora de inicio debe ser menor que la hora de fin");
      return;
    }

    try {
      setLoading(true);
      await api.crearHorario(newSlot);
      setIsAddingSlot(false);
      setNewSlot({
        diaSemana: "LUNES",
        horaInicio: "08:00",
        horaFin: "09:00",
      });
      alert("Horario agregado exitosamente");
      await loadSchedule();
    } catch (err) {
      alert("Error al agregar horario");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTimeSlotsByDay = (day: string) => {
    return timeSlots
      .filter(slot => slot.diaSemana === day)
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
  };

  const getTotalHoursPerDay = (day: string) => {
    const slots = getTimeSlotsByDay(day);
    return slots.reduce((total, slot) => {
      const start = new Date(`2000-01-01T${slot.horaInicio}`);
      const end = new Date(`2000-01-01T${slot.horaFin}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return total + hours;
    }, 0);
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
    <div className="space-y-5">
      {/* Header con estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Mi Agenda Semanal</h2>
              <p className="text-white/80 text-sm">
                Configura tus horarios de atención
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsAddingSlot(true)}
            className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Horario
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-white/70 text-xs mb-1">Total Horarios</p>
            <p className="text-white text-2xl font-bold">{timeSlots.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-white/70 text-xs mb-1">Días Activos</p>
            <p className="text-white text-2xl font-bold">
              {new Set(timeSlots.map(s => s.diaSemana)).size}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-white/70 text-xs mb-1">Horas Semanales</p>
            <p className="text-white text-2xl font-bold">
              {DAYS.reduce((total, day) => total + getTotalHoursPerDay(day), 0).toFixed(1)}h
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-white/70 text-xs mb-1">Disponibles</p>
            <p className="text-white text-2xl font-bold">
              {timeSlots.filter(s => s.disponible).length}
            </p>
          </div>
        </div>
      </motion.div>

      {loading && timeSlots.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border-2 border-primary/20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Cargando agenda...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-destructive/10 rounded-2xl border-2 border-destructive/20">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
          <p className="text-destructive font-medium">{error}</p>
          <Button
            onClick={loadSchedule}
            variant="outline"
            className="mt-4"
          >
            Reintentar
          </Button>
        </div>
      ) : timeSlots.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-gradient-to-br from-white to-primary/5 rounded-2xl border-2 border-dashed border-primary/30"
        >
          <CalendarDays className="w-20 h-20 text-primary/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No hay horarios configurados</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Comienza agregando tus horarios de atención para que los pacientes puedan agendar citas
          </p>
          <Button
            onClick={() => setIsAddingSlot(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Primer Horario
          </Button>
        </motion.div>
      ) : (
        /* Vista de Calendario Semanal */
        <div className="grid gap-4">
          {DAYS.map((day, index) => {
            const daySlots = getTimeSlotsByDay(day);
            const totalHours = getTotalHoursPerDay(day);
            const hasSlots = daySlots.length > 0;

            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl border-2 overflow-hidden transition-all ${
                  hasSlots
                    ? "bg-gradient-to-br from-white to-primary/5 border-primary/30 shadow-md hover:shadow-lg"
                    : "bg-muted border-border"
                }`}
              >
                {/* Header del Día */}
                <div className={`px-4 py-3 border-b-2 ${
                  hasSlots ? "bg-primary/10 border-primary/20" : "bg-muted border-border"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        hasSlots ? "bg-primary/20" : "bg-background"
                      }`}>
                        <Calendar className={`w-5 h-5 ${hasSlots ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg ${hasSlots ? "text-gray-800" : "text-muted-foreground"}`}>
                          {DAY_LABELS[day]}
                        </h3>
                        {hasSlots && (
                          <p className="text-xs text-muted-foreground">
                            {daySlots.length} horario{daySlots.length !== 1 ? 's' : ''} • {totalHours.toFixed(1)}h
                          </p>
                        )}
                      </div>
                    </div>
                    {hasSlots && (
                      <div className="flex items-center gap-2 text-primary">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-semibold">Activo</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Horarios del Día */}
                <div className="p-4">
                  {hasSlots ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {daySlots.map((slot, idx) => (
                        <motion.div
                          key={slot.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="bg-white rounded-lg border-2 border-primary/30 p-3 hover:shadow-md transition-all group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-primary" />
                              <span className="font-bold text-sm text-gray-800">
                                {slot.horaInicio} - {slot.horaFin}
                              </span>
                            </div>
                            <button
                              onClick={() => removeTimeSlot(slot.id)}
                              disabled={loading}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md bg-destructive/10 hover:bg-destructive/20 text-destructive transition-all disabled:opacity-50"
                              title="Eliminar horario"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`flex-1 h-1.5 rounded-full ${
                              slot.disponible ? "bg-primary" : "bg-muted"
                            }`} />
                            <span className={`text-xs font-medium ${
                              slot.disponible ? "text-primary" : "text-muted-foreground"
                            }`}>
                              {slot.disponible ? "Disponible" : "Ocupado"}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground text-sm py-4">
                      Sin horarios configurados
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal para Agregar Horario */}
      <Dialog open={isAddingSlot} onOpenChange={setIsAddingSlot}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <DialogTitle className="text-xl">Agregar Horario</DialogTitle>
            </div>
            <DialogDescription>
              Define el día y horario de atención
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-primary/5 rounded-lg p-3 border-2 border-primary/20">
              <label className="text-sm font-semibold text-gray-800 mb-2 block">
                Día de la Semana
              </label>
              <select
                value={newSlot.diaSemana}
                onChange={(e) => setNewSlot({ ...newSlot, diaSemana: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none transition-colors text-sm"
              >
                {DAYS.map(day => (
                  <option key={day} value={day}>{DAY_LABELS[day]}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary/5 rounded-lg p-3 border-2 border-primary/20">
                <label className="text-sm font-semibold text-gray-800 mb-2 block">
                  Hora Inicio
                </label>
                <input
                  type="time"
                  value={newSlot.horaInicio}
                  onChange={(e) => setNewSlot({ ...newSlot, horaInicio: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none transition-colors text-sm"
                />
              </div>
              <div className="bg-primary/5 rounded-lg p-3 border-2 border-primary/20">
                <label className="text-sm font-semibold text-gray-800 mb-2 block">
                  Hora Fin
                </label>
                <input
                  type="time"
                  value={newSlot.horaFin}
                  onChange={(e) => setNewSlot({ ...newSlot, horaFin: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>

            <div className="bg-muted rounded-lg p-3 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>El horario se agregará como disponible por defecto</span>
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddingSlot(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={addTimeSlot}
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Agregando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Horario
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
