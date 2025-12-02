"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, ClipboardList, User } from "lucide-react";
import { AppointmentBooking } from "@/components/appointments/AppointmentBooking";
import { AppointmentHistory } from "@/components/appointments/AppointmentHistory";
import { AppointmentManagement } from "@/components/appointments/AppointmentManagement";

interface UserData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

type ViewType = "overview" | "book" | "history" | "manage";

export default function ClienteDashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>("overview");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Escuchar eventos de cambio de vista
    const handleChangeView = (e: CustomEvent) => {
      setCurrentView(e.detail as ViewType);
    };

    window.addEventListener('changeView', handleChangeView as EventListener);
    
    return () => {
      window.removeEventListener('changeView', handleChangeView as EventListener);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
          />
          <p className="text-primary text-xl font-semibold">Cargando...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/80 shadow-xl border-b border-primary/20">
        <div className="container mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center ring-2 ring-white/30">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Panel de Paciente
                </h1>
                <p className="text-white/90 text-sm">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </motion.div>
            <Button
              onClick={handleLogout}
              variant="secondary"
              className="font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        {/* Navigation Tabs */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-2 mb-6 border border-primary/10"
        >
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setCurrentView("overview")}
              variant={currentView === "overview" ? "default" : "ghost"}
              className={`flex items-center gap-2 font-medium transition-all ${
                currentView === "overview"
                  ? "shadow-lg shadow-primary/20"
                  : ""
              }`}
            >
              <User className="w-4 h-4" />
              Inicio
            </Button>
            <Button
              onClick={() => setCurrentView("book")}
              variant={currentView === "book" ? "default" : "ghost"}
              className={`flex items-center gap-2 font-medium transition-all ${
                currentView === "book"
                  ? "shadow-lg shadow-primary/20"
                  : ""
              }`}
            >
              <Calendar className="w-4 h-4" />
              Reservar Cita
            </Button>
            <Button
              onClick={() => setCurrentView("manage")}
              variant={currentView === "manage" ? "default" : "ghost"}
              className={`flex items-center gap-2 font-medium transition-all ${
                currentView === "manage"
                  ? "shadow-lg shadow-primary/20"
                  : ""
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Mis Citas
            </Button>
            <Button
              onClick={() => setCurrentView("history")}
              variant={currentView === "history" ? "default" : "ghost"}
              className={`flex items-center gap-2 font-medium transition-all ${
                currentView === "history"
                  ? "shadow-lg shadow-primary/20"
                  : ""
              }`}
            >
              <FileText className="w-4 h-4" />
              Historial
            </Button>
          </div>
        </motion.nav>

        {/* Content Area */}
        {currentView === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-primary/10">
              <h2 className="text-2xl font-bold text-primary mb-5">Accesos Rápidos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentView("manage")}
                  className="group bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-xl border border-primary/20 hover:border-primary/40 cursor-pointer hover:shadow-xl transition-all text-left"
                >
                  <ClipboardList className="w-10 h-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Mis Citas
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Gestiona tus citas programadas
                  </p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentView("book")}
                  className="group bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-xl border border-primary/20 hover:border-primary/40 cursor-pointer hover:shadow-xl transition-all text-left"
                >
                  <Calendar className="w-10 h-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Reservar Cita
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Solicita una nueva cita
                  </p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentView("history")}
                  className="group bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-xl border border-primary/20 hover:border-primary/40 cursor-pointer hover:shadow-xl transition-all text-left"
                >
                  <FileText className="w-10 h-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Historial
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Consulta tus atenciones
                  </p>
                </motion.button>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-primary/10">
              <h2 className="text-xl font-bold text-primary mb-4">Información Personal</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-primary/5 rounded-xl p-5 border border-primary/10">
                  <p className="text-muted-foreground text-sm mb-1">Usuario</p>
                  <p className="font-semibold text-lg text-foreground">{user.username}</p>
                </div>
                <div className="bg-primary/5 rounded-xl p-5 border border-primary/10">
                  <p className="text-muted-foreground text-sm mb-1">Email</p>
                  <p className="font-semibold text-lg text-foreground truncate">{user.email}</p>
                </div>
                <div className="bg-primary/5 rounded-xl p-5 border border-primary/10">
                  <p className="text-muted-foreground text-sm mb-1">Rol</p>
                  <p className="font-semibold text-lg text-foreground">{user.roles.join(", ")}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentView === "book" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AppointmentBooking />
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

        {currentView === "manage" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AppointmentManagement />
          </motion.div>
        )}
      </div>
    </div>
  );
}
