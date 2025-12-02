"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, CheckCircle2, ArrowRight } from "lucide-react";

interface Therapist {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

const THERAPISTS: Therapist[] = [
  { id: "1", name: "Dr. Carlos Méndez", specialty: "Rehabilitación Deportiva", image: "/therapist1.jpg" },
  { id: "2", name: "Dra. Ana Torres", specialty: "Terapia Manual", image: "/therapist2.jpg" },
  { id: "3", name: "Dr. Luis Ramírez", specialty: "Neurorehabilitación", image: "/therapist3.jpg" },
];

const AVAILABLE_DATES = [
  { date: "2025-01-15", day: "Lunes", slots: ["08:00", "09:00", "10:00", "14:00", "15:00"] },
  { date: "2025-01-16", day: "Martes", slots: ["08:00", "09:00", "11:00", "14:00", "16:00"] },
  { date: "2025-01-17", day: "Miércoles", slots: ["08:00", "10:00", "11:00", "15:00", "16:00"] },
  { date: "2025-01-18", day: "Jueves", slots: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
  { date: "2025-01-19", day: "Viernes", slots: ["08:00", "09:00", "10:00", "14:00", "15:00"] },
];

export function AppointmentBooking() {
  const [step, setStep] = useState(1);
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [appointmentReason, setAppointmentReason] = useState("");

  const handleBookAppointment = () => {
    const therapist = THERAPISTS.find(t => t.id === selectedTherapist);
    const dateInfo = AVAILABLE_DATES.find(d => d.date === selectedDate);

    console.log("Reservando cita:", {
      therapist: therapist?.name,
      date: selectedDate,
      time: selectedTime,
      reason: appointmentReason
    });

    alert(`¡Cita reservada exitosamente!\n\nFisioterapeuta: ${therapist?.name}\nFecha: ${dateInfo?.day}, ${selectedDate}\nHora: ${selectedTime}\nMotivo: ${appointmentReason}`);

    // Reset
    setStep(1);
    setSelectedTherapist(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setAppointmentReason("");
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
          <h2 className="text-3xl font-bold text-white">Reservar Cita</h2>
        </div>
        <p className="text-white/90 text-lg">
          Agenda tu sesión de fisioterapia en 3 simples pasos
        </p>

        <div className="flex items-center justify-between mt-8 max-w-2xl">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                step >= num ? "bg-white text-[#a8dcd9]" : "bg-white/30 text-white/60"
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
          className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#a8dcd9]/30"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-[#a8dcd9]" />
            Paso 1: Selecciona tu Fisioterapeuta
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {THERAPISTS.map(therapist => (
              <motion.div
                key={therapist.id}
                whileHover={{ scale: 1.03 }}
                onClick={() => setSelectedTherapist(therapist.id)}
                className={`relative cursor-pointer rounded-2xl p-6 transition-all ${
                  selectedTherapist === therapist.id
                    ? "bg-[#a8dcd9]/20 border-3 border-[#a8dcd9] shadow-xl"
                    : "bg-gray-50 border-2 border-gray-200 hover:border-[#a8dcd9]/50"
                }`}
              >
                {selectedTherapist === therapist.id && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 className="w-6 h-6 text-[#a8dcd9]" />
                  </div>
                )}
                <div className="w-20 h-20 bg-gradient-to-br from-[#a8dcd9] to-[#8bc9c5] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h4 className="font-bold text-lg text-gray-800 text-center mb-2">
                  {therapist.name}
                </h4>
                <p className="text-sm text-gray-600 text-center">
                  {therapist.specialty}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-end mt-8">
            <Button
              onClick={() => setStep(2)}
              disabled={!selectedTherapist}
              className="bg-[#a8dcd9] hover:bg-[#8bc9c5] text-white font-semibold py-6 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#a8dcd9]/30"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#a8dcd9]" />
            Paso 2: Selecciona Fecha y Hora
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-700 mb-4 text-lg">Selecciona una fecha</h4>
              <div className="space-y-3">
                {AVAILABLE_DATES.map(dateInfo => (
                  <motion.div
                    key={dateInfo.date}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSelectedDate(dateInfo.date);
                      setSelectedTime(null);
                    }}
                    className={`cursor-pointer p-4 rounded-xl transition-all ${
                      selectedDate === dateInfo.date
                        ? "bg-[#a8dcd9]/20 border-2 border-[#a8dcd9]"
                        : "bg-gray-50 border-2 border-gray-200 hover:border-[#a8dcd9]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-800">{dateInfo.day}</p>
                        <p className="text-sm text-gray-600">{dateInfo.date}</p>
                      </div>
                      {selectedDate === dateInfo.date && (
                        <CheckCircle2 className="w-5 h-5 text-[#a8dcd9]" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-4 text-lg">
                Horarios disponibles {selectedDate && `- ${AVAILABLE_DATES.find(d => d.date === selectedDate)?.day}`}
              </h4>
              {selectedDate ? (
                <div className="grid grid-cols-2 gap-3">
                  {AVAILABLE_DATES.find(d => d.date === selectedDate)?.slots.map(time => (
                    <motion.div
                      key={time}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedTime(time)}
                      className={`cursor-pointer p-4 rounded-xl transition-all text-center ${
                        selectedTime === time
                          ? "bg-[#a8dcd9] text-white border-2 border-[#a8dcd9]"
                          : "bg-gray-50 border-2 border-gray-200 hover:border-[#a8dcd9]/50 text-gray-700"
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
              className="bg-[#a8dcd9] hover:bg-[#8bc9c5] text-white font-semibold py-6 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#a8dcd9]/30"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-[#a8dcd9]" />
            Paso 3: Confirmar y Detalles
          </h3>

          <div className="bg-[#a8dcd9]/10 rounded-xl p-6 mb-6">
            <h4 className="font-bold text-gray-800 mb-4 text-lg">Resumen de tu cita</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-[#a8dcd9]" />
                <span className="font-semibold">
                  {THERAPISTS.find(t => t.id === selectedTherapist)?.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#a8dcd9]" />
                <span className="font-semibold">
                  {AVAILABLE_DATES.find(d => d.date === selectedDate)?.day}, {selectedDate}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#a8dcd9]" />
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
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#a8dcd9] focus:outline-none transition-colors min-h-[120px]"
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
              className="bg-gradient-to-r from-[#a8dcd9] to-[#8bc9c5] hover:from-[#8bc9c5] hover:to-[#6fb5b1] text-white font-semibold py-6 px-8 shadow-lg"
            >
              Confirmar Reserva
              <CheckCircle2 className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
