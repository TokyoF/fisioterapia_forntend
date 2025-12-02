"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, ClipboardList, User, Stethoscope } from "lucide-react";
import { ScheduleManager } from "@/components/schedule/ScheduleManager";
import { ClinicalHistory } from "@/components/clinical/ClinicalHistory";
import { AppointmentHistory } from "@/components/appointments/AppointmentHistory";

interface UserData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

type ViewType = "overview" | "schedule" | "patients" | "history";

export default function FisioterapeutaDashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>("overview");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#a8dcd9] to-[#8bc9c5] flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5f4] to-[#d4ecea]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#a8dcd9] to-[#8bc9c5] shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                <Stethoscope className="w-8 h-8 text-[#a8dcd9]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Panel de Fisioterapeuta
                </h1>
                <p className="text-white/90 text-lg">
                  Bienvenido, Dr(a). {user.firstName} {user.lastName}
                </p>
              </div>
            </motion.div>
            <Button
              onClick={handleLogout}
              className="bg-white text-[#a8dcd9] hover:bg-gray-100 font-semibold"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-4 mb-8"
        >
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() => setCurrentView("overview")}
              className={`flex items-center gap-2 font-semibold transition-all ${
                currentView === "overview"
                  ? "bg-[#a8dcd9] text-white hover:bg-[#8bc9c5]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <User className="w-5 h-5" />
              Inicio
            </Button>
            <Button
              onClick={() => setCurrentView("schedule")}
              className={`flex items-center gap-2 font-semibold transition-all ${
                currentView === "schedule"
                  ? "bg-[#a8dcd9] text-white hover:bg-[#8bc9c5]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Calendar className="w-5 h-5" />
              Mi Agenda
            </Button>
            <Button
              onClick={() => setCurrentView("patients")}
              className={`flex items-center gap-2 font-semibold transition-all ${
                currentView === "patients"
                  ? "bg-[#a8dcd9] text-white hover:bg-[#8bc9c5]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FileText className="w-5 h-5" />
              Historia Clínica
            </Button>
            <Button
              onClick={() => setCurrentView("history")}
              className={`flex items-center gap-2 font-semibold transition-all ${
                currentView === "history"
                  ? "bg-[#a8dcd9] text-white hover:bg-[#8bc9c5]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ClipboardList className="w-5 h-5" />
              Mis Citas
            </Button>
          </div>
        </motion.div>

        {/* Content Area */}
        {currentView === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Accesos Rápidos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setCurrentView("schedule")}
                  className="bg-gradient-to-br from-[#a8dcd9]/20 to-[#8bc9c5]/20 p-8 rounded-xl border-2 border-[#a8dcd9]/30 cursor-pointer hover:shadow-xl transition-all"
                >
                  <Calendar className="w-12 h-12 text-[#a8dcd9] mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Mi Agenda
                  </h3>
                  <p className="text-gray-600">
                    Gestiona tus citas y horarios de atención
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setCurrentView("patients")}
                  className="bg-gradient-to-br from-[#a8dcd9]/20 to-[#8bc9c5]/20 p-8 rounded-xl border-2 border-[#a8dcd9]/30 cursor-pointer hover:shadow-xl transition-all"
                >
                  <FileText className="w-12 h-12 text-[#a8dcd9] mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Pacientes
                  </h3>
                  <p className="text-gray-600">
                    Accede a historias clínicas y planes de tratamiento
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setCurrentView("history")}
                  className="bg-gradient-to-br from-[#a8dcd9]/20 to-[#8bc9c5]/20 p-8 rounded-xl border-2 border-[#a8dcd9]/30 cursor-pointer hover:shadow-xl transition-all"
                >
                  <ClipboardList className="w-12 h-12 text-[#a8dcd9] mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Sesiones
                  </h3>
                  <p className="text-gray-600">
                    Registra evaluaciones y sesiones de terapia
                  </p>
                </motion.div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Información Personal</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-[#a8dcd9]/10 rounded-xl p-6 border-2 border-[#a8dcd9]/30">
                  <p className="text-gray-600 mb-1">Usuario</p>
                  <p className="font-bold text-xl text-gray-800">{user.username}</p>
                </div>
                <div className="bg-[#a8dcd9]/10 rounded-xl p-6 border-2 border-[#a8dcd9]/30">
                  <p className="text-gray-600 mb-1">Email</p>
                  <p className="font-bold text-xl text-gray-800">{user.email}</p>
                </div>
                <div className="bg-[#a8dcd9]/10 rounded-xl p-6 border-2 border-[#a8dcd9]/30">
                  <p className="text-gray-600 mb-1">Rol</p>
                  <p className="font-bold text-xl text-gray-800">{user.roles.join(", ")}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentView === "schedule" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ScheduleManager />
          </motion.div>
        )}

        {currentView === "patients" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ClinicalHistory />
          </motion.div>
        )}

        {currentView === "history" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AppointmentHistory />
          </motion.div>
        )}
      </div>
    </div>
  );
}
