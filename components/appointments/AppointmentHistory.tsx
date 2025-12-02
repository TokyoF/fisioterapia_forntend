"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, User, FileText, MapPin, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface Appointment {
  id: string;
  therapistName: string;
  specialty: string;
  date: string;
  time: string;
  status: "completed" | "scheduled" | "cancelled";
  location: string;
  notes?: string;
  diagnosis?: string;
}

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    therapistName: "Dr. Carlos Méndez",
    specialty: "Rehabilitación Deportiva",
    date: "2025-01-10",
    time: "09:00",
    status: "completed",
    location: "Consultorio 201",
    notes: "Recuperación de lesión de rodilla",
    diagnosis: "Esguince grado II - Tratamiento con electroterapia y ejercicios de fortalecimiento"
  },
  {
    id: "2",
    therapistName: "Dra. Ana Torres",
    specialty: "Terapia Manual",
    date: "2025-01-12",
    time: "14:00",
    status: "completed",
    location: "Consultorio 103",
    notes: "Dolor lumbar crónico",
    diagnosis: "Contractura muscular - Terapia manual y programa de estiramientos"
  },
  {
    id: "3",
    therapistName: "Dr. Luis Ramírez",
    specialty: "Neurorehabilitación",
    date: "2025-01-15",
    time: "10:00",
    status: "scheduled",
    location: "Consultorio 205",
    notes: "Seguimiento post-operatorio"
  },
  {
    id: "4",
    therapistName: "Dr. Carlos Méndez",
    specialty: "Rehabilitación Deportiva",
    date: "2025-01-18",
    time: "09:00",
    status: "scheduled",
    location: "Consultorio 201",
    notes: "Continuación tratamiento rodilla"
  },
  {
    id: "5",
    therapistName: "Dra. Ana Torres",
    specialty: "Terapia Manual",
    date: "2024-12-20",
    time: "15:00",
    status: "cancelled",
    location: "Consultorio 103",
    notes: "Cancelada por paciente"
  },
];

export function AppointmentHistory() {
  const [filter, setFilter] = useState<"all" | "completed" | "scheduled" | "cancelled">("all");

  const filteredAppointments = MOCK_APPOINTMENTS.filter(apt =>
    filter === "all" ? true : apt.status === filter
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "scheduled":
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completada";
      case "scheduled":
        return "Programada";
      case "cancelled":
        return "Cancelada";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200 text-green-700";
      case "scheduled":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "cancelled":
        return "bg-red-50 border-red-200 text-red-700";
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#a8dcd9] to-[#8bc9c5] rounded-2xl p-8 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-white" />
          <h2 className="text-3xl font-bold text-white">Historial de Citas</h2>
        </div>
        <p className="text-white/90 text-lg">
          Revisa tus citas anteriores y programadas
        </p>
      </motion.div>

      <div className="flex gap-3 flex-wrap">
        {[
          { value: "all", label: "Todas", count: MOCK_APPOINTMENTS.length },
          { value: "scheduled", label: "Programadas", count: MOCK_APPOINTMENTS.filter(a => a.status === "scheduled").length },
          { value: "completed", label: "Completadas", count: MOCK_APPOINTMENTS.filter(a => a.status === "completed").length },
          { value: "cancelled", label: "Canceladas", count: MOCK_APPOINTMENTS.filter(a => a.status === "cancelled").length },
        ].map(filterOption => (
          <motion.button
            key={filterOption.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(filterOption.value as any)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filter === filterOption.value
                ? "bg-[#a8dcd9] text-white shadow-lg"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-[#a8dcd9]/50"
            }`}
          >
            {filterOption.label} ({filterOption.count})
          </motion.button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-12 shadow-lg text-center border-2 border-gray-200"
          >
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hay citas en esta categoría</p>
          </motion.div>
        ) : (
          filteredAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#a8dcd9]/30 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#a8dcd9] to-[#8bc9c5] rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {appointment.therapistName}
                      </h3>
                      <p className="text-sm text-gray-600">{appointment.specialty}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 ml-15">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#a8dcd9]" />
                      <span className="text-gray-700 font-medium">
                        {new Date(appointment.date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#a8dcd9]" />
                      <span className="text-gray-700 font-medium">{appointment.time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#a8dcd9]" />
                      <span className="text-gray-700 font-medium">{appointment.location}</span>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="mt-4 ml-15">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Notas:</span> {appointment.notes}
                      </p>
                    </div>
                  )}

                  {appointment.diagnosis && (
                    <div className="mt-3 ml-15 bg-[#a8dcd9]/10 rounded-lg p-4">
                      <p className="text-sm font-semibold text-gray-800 mb-1">Diagnóstico y Tratamiento:</p>
                      <p className="text-sm text-gray-700">{appointment.diagnosis}</p>
                    </div>
                  )}
                </div>

                <div className="flex lg:flex-col items-center lg:items-end gap-3">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-semibold ${getStatusColor(appointment.status)}`}>
                    {getStatusIcon(appointment.status)}
                    <span>{getStatusText(appointment.status)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
