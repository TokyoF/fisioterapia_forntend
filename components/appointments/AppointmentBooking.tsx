"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, CheckCircle2, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

interface Therapist {
  id: number;
  codigo: string;
  especialidad: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

interface Horario {
  id: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}

export function AppointmentBooking() {
  const [step, setStep] = useState(1);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [appointmentReason, setAppointmentReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTherapists();
  }, []);

  const loadTherapists = async () => {
    try {
      setLoading(true);
      const data = await api.getFisioterapeutas();
      setTherapists(data);
    } catch (err) {
      setError("Error al cargar fisioterapeutas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Generate next 7 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('es-ES', { weekday: 'long' }),
      });
    }
    return dates;
  };

  // Generate time slots (8:00 AM to 6:00 PM, every hour)
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const handleBookAppointment = async () => {
    if (!selectedTherapist || !selectedDate || !selectedTime) return;

    try {
      setLoading(true);
      setError("");

      await api.crearCita({
        fisioterapeutaId: selectedTherapist,
        fecha: selectedDate,
        hora: selectedTime,
        motivo: appointmentReason || undefined,
      });

      const therapist = therapists.find(t => t.id === selectedTherapist);
      alert(`¡Cita reservada exitosamente!\n\nFisioterapeuta: Dr(a). ${therapist?.user.firstName} ${therapist?.user.lastName}\nFecha: ${selectedDate}\nHora: ${selectedTime}`);

      // Reset
      setStep(1);
      setSelectedTherapist(null);
      setSelectedDate(null);
      setSelectedTime(null);
      setAppointmentReason("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al reservar la cita");
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
          <h2 className="text-3xl font-bold text-white">Reservar Cita</h2>
        </div>
        <p className="text-white/90 text-lg">
          Agenda tu sesión de fisioterapia en 3 simples pasos
        </p>

        <div className="flex items-center justify-between mt-8 max-w-2xl">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                step >= num ? "bg-white text-primary" : "bg-white/30 text-white/60"
              }`}>
                {num}
              </div>
              {num < 3 && (
                <div className={`w-24 h-1 mx-2 transition-all ${
                  step > num ? "bg-white" : "bg-white/30"
                }`} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Paso 1: Seleccionar Fisioterapeuta */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg border-2 border-primary/30"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            Paso 1: Selecciona tu Fisioterapeuta
          </h3>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Cargando fisioterapeutas...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {therapists.map(therapist => (
                <motion.div
                  key={therapist.id}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setSelectedTherapist(therapist.id)}
                  className={`relative cursor-pointer rounded-2xl p-6 transition-all ${
                    selectedTherapist === therapist.id
                      ? "bg-primary/20 border-3 border-primary shadow-xl"
                      : "bg-gray-50 border-2 border-gray-200 hover:border-primary/50"
                  }`}
                >
                  {selectedTherapist === therapist.id && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="font-bold text-lg text-gray-800 text-center mb-2">
                    Dr(a). {therapist.user.firstName} {therapist.user.lastName}
                  </h4>
                  <p className="text-sm text-gray-600 text-center">
                    {therapist.especialidad}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-8">
            <Button
              onClick={() => setStep(2)}
              disabled={!selectedTherapist}
              className="bg-primary hover:bg-primary/90 text-white font-semibold py-6 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Paso 2: Seleccionar Fecha y Hora */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg border-2 border-primary/30"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            Paso 2: Selecciona Fecha y Hora
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-700 mb-4 text-lg">Selecciona una fecha</h4>
              <div className="space-y-3">
                {getAvailableDates().map(dateInfo => (
                  <motion.div
                    key={dateInfo.date}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSelectedDate(dateInfo.date);
                      setSelectedTime(null);
                    }}
                    className={`cursor-pointer p-4 rounded-xl transition-all ${
                      selectedDate === dateInfo.date
                        ? "bg-primary/20 border-2 border-primary"
                        : "bg-gray-50 border-2 border-gray-200 hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-800 capitalize">{dateInfo.day}</p>
                        <p className="text-sm text-gray-600">{dateInfo.date}</p>
                      </div>
                      {selectedDate === dateInfo.date && (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-4 text-lg">
                Horarios disponibles {selectedDate && `- ${getAvailableDates().find(d => d.date === selectedDate)?.day}`}
              </h4>
              {selectedDate ? (
                <div className="grid grid-cols-2 gap-3">
                  {getTimeSlots().map(time => (
                    <motion.div
                      key={time}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedTime(time)}
                      className={`cursor-pointer p-4 rounded-xl transition-all text-center ${
                        selectedTime === time
                          ? "bg-primary text-white border-2 border-primary"
                          : "bg-gray-50 border-2 border-gray-200 hover:border-primary/50 text-gray-700"
                      }`}
                    >
                      <Clock className="w-5 h-5 mx-auto mb-1" />
                      <p className="font-semibold">{time}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-12">
                  Selecciona una fecha para ver horarios disponibles
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button
              onClick={() => setStep(1)}
              variant="outline"
              className="font-semibold py-6 px-8"
            >
              Atrás
            </Button>
            <Button
              onClick={() => setStep(3)}
              disabled={!selectedDate || !selectedTime}
              className="bg-primary hover:bg-primary/90 text-white font-semibold py-6 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Paso 3: Confirmar y Motivo */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg border-2 border-primary/30"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            Paso 3: Confirmar y Detalles
          </h3>

          <div className="bg-primary/10 rounded-xl p-6 mb-6">
            <h4 className="font-bold text-gray-800 mb-4 text-lg">Resumen de tu cita</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <span className="font-semibold">
                  Dr(a). {therapists.find(t => t.id === selectedTherapist)?.user.firstName} {therapists.find(t => t.id === selectedTherapist)?.user.lastName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-semibold capitalize">
                  {getAvailableDates().find(d => d.date === selectedDate)?.day}, {selectedDate}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <span className="font-semibold">{selectedTime}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Motivo de la consulta (opcional)
            </label>
            <textarea
              value={appointmentReason}
              onChange={(e) => setAppointmentReason(e.target.value)}
              placeholder="Describe brevemente el motivo de tu consulta..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors min-h-[120px]"
            />
          </div>

          <div className="flex justify-between mt-8">
            <Button
              onClick={() => setStep(2)}
              variant="outline"
              className="font-semibold py-6 px-8"
            >
              Atrás
            </Button>
            <Button
              onClick={handleBookAppointment}
              disabled={loading}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold py-6 px-8 shadow-lg disabled:opacity-50"
            >
              {loading ? "Reservando..." : "Confirmar Reserva"}
              <CheckCircle2 className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
