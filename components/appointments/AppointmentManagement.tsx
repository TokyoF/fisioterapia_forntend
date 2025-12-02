"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Edit2, Trash2, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface Appointment {
  id: string;
  therapistName: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  status: "scheduled" | "cancelled" | "completed";
  notes?: string;
  canModify: boolean;
}

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "APT-001",
    therapistName: "Dr. Luis Ramírez",
    specialty: "Neurorehabilitación",
    date: "2025-01-15",
    time: "10:00",
    location: "Consultorio 205",
    status: "scheduled",
    notes: "Seguimiento post-operatorio",
    canModify: true
  },
  {
    id: "APT-002",
    therapistName: "Dr. Carlos Méndez",
    specialty: "Rehabilitación Deportiva",
    date: "2025-01-18",
    time: "09:00",
    location: "Consultorio 201",
    status: "scheduled",
    notes: "Continuación tratamiento rodilla",
    canModify: true
  },
  {
    id: "APT-003",
    therapistName: "Dra. Ana Torres",
    specialty: "Terapia Manual",
    date: "2025-01-20",
    time: "14:00",
    location: "Consultorio 103",
    status: "scheduled",
    notes: "Dolor lumbar - primera consulta",
    canModify: true
  },
  {
    id: "APT-004",
    therapistName: "Dr. Carlos Méndez",
    specialty: "Rehabilitación Deportiva",
    date: "2025-01-12",
    time: "09:00",
    location: "Consultorio 201",
    status: "completed",
    notes: "Tratamiento completado",
    canModify: false
  }
];

export function AppointmentManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    date: "",
    time: "",
    notes: ""
  });

  const upcomingAppointments = appointments.filter(apt => apt.status === "scheduled");
  const pastAppointments = appointments.filter(apt => apt.status === "completed" || apt.status === "cancelled");

  const handleCancelAppointment = (id: string) => {
    if (confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
      setAppointments(appointments.map(apt =>
        apt.id === id ? { ...apt, status: "cancelled" as const } : apt
      ));
      alert("Cita cancelada exitosamente");
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingId(appointment.id);
    setEditForm({
      date: appointment.date,
      time: appointment.time,
      notes: appointment.notes || ""
    });
  };

  const handleSaveEdit = (id: string) => {
    setAppointments(appointments.map(apt =>
      apt.id === id ? { ...apt, ...editForm } : apt
    ));
    setEditingId(null);
    alert("Cita modificada exitosamente");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border-2 border-blue-200 font-semibold text-sm">
            <AlertCircle className="w-4 h-4" />
            Programada
          </div>
        );
      case "completed":
        return (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-lg border-2 border-green-200 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Completada
          </div>
        );
      case "cancelled":
        return (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-lg border-2 border-red-200 font-semibold text-sm">
            <XCircle className="w-4 h-4" />
            Cancelada
          </div>
        );
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
        className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#a8dcd9]/30"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <AlertCircle className="w-7 h-7 text-blue-500" />
          Próximas Citas ({upcomingAppointments.length})
        </h3>

        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No tienes citas programadas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-2 border-[#a8dcd9]/30 rounded-xl p-6 hover:shadow-lg transition-all"
              >
                {editingId === appointment.id ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#a8dcd9] to-[#8bc9c5] rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">{appointment.therapistName}</h4>
                        <p className="text-sm text-gray-600">{appointment.specialty}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nueva Fecha
                        </label>
                        <input
                          type="date"
                          value={editForm.date}
                          onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#a8dcd9] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nueva Hora
                        </label>
                        <input
                          type="time"
                          value={editForm.time}
                          onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#a8dcd9] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Notas
                      </label>
                      <textarea
                        value={editForm.notes}
                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#a8dcd9] focus:outline-none min-h-[80px]"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleSaveEdit(appointment.id)}
                        className="flex-1 bg-[#a8dcd9] hover:bg-[#8bc9c5] text-white font-semibold"
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
                          <div className="w-12 h-12 bg-gradient-to-br from-[#a8dcd9] to-[#8bc9c5] rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-800">{appointment.therapistName}</h4>
                            <p className="text-sm text-gray-600">{appointment.specialty}</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 ml-15">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[#a8dcd9]" />
                            <span className="text-gray-700 font-medium">
                              {new Date(appointment.date).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[#a8dcd9]" />
                            <span className="text-gray-700 font-medium">{appointment.time}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {getStatusBadge(appointment.status)}
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="mt-4 ml-15 bg-[#a8dcd9]/10 rounded-lg p-3">
                            <p className="text-sm text-gray-700"><span className="font-semibold">Notas:</span> {appointment.notes}</p>
                          </div>
                        )}
                      </div>

                      {appointment.canModify && (
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
                    <h4 className="text-lg font-bold text-gray-700">{appointment.therapistName}</h4>
                    <p className="text-sm text-gray-500">{appointment.specialty}</p>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>

                <div className="grid md:grid-cols-3 gap-3 ml-13 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(appointment.date).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{appointment.time}</span>
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
