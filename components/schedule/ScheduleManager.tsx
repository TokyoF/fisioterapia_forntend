"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, Trash2, Save } from "lucide-react";

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export function ScheduleManager() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: "1", day: "Lunes", startTime: "08:00", endTime: "09:00", available: true },
    { id: "2", day: "Lunes", startTime: "09:00", endTime: "10:00", available: true },
    { id: "3", day: "Martes", startTime: "08:00", endTime: "09:00", available: true },
    { id: "4", day: "Miércoles", startTime: "14:00", endTime: "15:00", available: true },
  ]);

  const [newSlot, setNewSlot] = useState({
    day: "Lunes",
    startTime: "08:00",
    endTime: "09:00",
  });

  const addTimeSlot = () => {
    const slot: TimeSlot = {
      id: Date.now().toString(),
      ...newSlot,
      available: true,
    };
    setTimeSlots([...timeSlots, slot]);
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const toggleAvailability = (id: string) => {
    setTimeSlots(timeSlots.map(slot =>
      slot.id === id ? { ...slot, available: !slot.available } : slot
    ));
  };

  const saveSchedule = () => {
    console.log("Guardando horarios:", timeSlots);
    alert("Horarios guardados exitosamente");
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#a8dcd9] to-[#8bc9c5] rounded-2xl p-8 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-8 h-8 text-white" />
          <h2 className="text-3xl font-bold text-white">Gestión de Horarios</h2>
        </div>
        <p className="text-white/90 text-lg">
          Configura tus horarios disponibles para atención de pacientes
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#a8dcd9]/30"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="w-6 h-6 text-[#a8dcd9]" />
            Agregar Horario
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Día de la semana
              </label>
              <select
                value={newSlot.day}
                onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#a8dcd9] focus:outline-none transition-colors"
              >
                {DAYS.map(day => (
                  <option key={day} value={day}>{day}</option>
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
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#a8dcd9] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hora Fin
                </label>
                <input
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#a8dcd9] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <Button
              onClick={addTimeSlot}
              className="w-full bg-[#a8dcd9] hover:bg-[#8bc9c5] text-white font-semibold py-6"
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
          className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#a8dcd9]/30"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-[#a8dcd9]" />
            Horarios Configurados
          </h3>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {DAYS.map(day => {
              const daySlots = timeSlots.filter(slot => slot.day === day);
              if (daySlots.length === 0) return null;

              return (
                <div key={day} className="mb-4">
                  <h4 className="font-bold text-gray-700 mb-2 text-lg">{day}</h4>
                  <div className="space-y-2">
                    {daySlots.map(slot => (
                      <motion.div
                        key={slot.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                          slot.available
                            ? "bg-[#a8dcd9]/10 border-2 border-[#a8dcd9]/30"
                            : "bg-gray-100 border-2 border-gray-300 opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-[#a8dcd9]" />
                          <span className="font-semibold text-gray-700">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleAvailability(slot.id)}
                            className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                              slot.available
                                ? "bg-green-500 text-white"
                                : "bg-gray-400 text-white"
                            }`}
                          >
                            {slot.available ? "Disponible" : "No disponible"}
                          </button>
                          <button
                            onClick={() => removeTimeSlot(slot.id)}
                            className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end"
      >
        <Button
          onClick={saveSchedule}
          className="bg-gradient-to-r from-[#a8dcd9] to-[#8bc9c5] hover:from-[#8bc9c5] hover:to-[#6fb5b1] text-white font-semibold py-6 px-8 text-lg shadow-lg"
        >
          <Save className="w-5 h-5 mr-2" />
          Guardar Todos los Cambios
        </Button>
      </motion.div>
    </div>
  );
}
