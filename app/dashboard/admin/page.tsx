"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  Activity,
  TrendingUp,
  Clock,
  UserCheck,
  FileText,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { api } from "@/lib/api";

interface UserData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

interface Stats {
  totalPacientes: number;
  totalFisioterapeutas: number;
  citasHoy: number;
  citasSemana: number;
  citasMes: number;
}

interface Fisioterapeuta {
  id: number;
  codigo: string;
  especialidad: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

type View = "overview" | "horarios" | "estadisticas" | "configuracion";

export default function AdminDashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [currentView, setCurrentView] = useState<View>("overview");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalPacientes: 0,
    totalFisioterapeutas: 0,
    citasHoy: 0,
    citasSemana: 0,
    citasMes: 0,
  });
  const [fisioterapeutas, setFisioterapeutas] = useState<Fisioterapeuta[]>([]);
  const [selectedFisioId, setSelectedFisioId] = useState<number | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Cargar fisioterapeutas
      const fisios = await api.getFisioterapeutas();
      setFisioterapeutas(fisios);

      // Cargar todas las citas para calcular estadísticas
      const todasCitas = await api.getCitas();

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const inicioSemana = new Date(hoy);
      inicioSemana.setDate(hoy.getDate() - hoy.getDay());

      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

      const citasHoy = todasCitas.filter((cita: any) => {
        const fechaCita = new Date(cita.fecha);
        return fechaCita.toDateString() === hoy.toDateString();
      }).length;

      const citasSemana = todasCitas.filter((cita: any) => {
        const fechaCita = new Date(cita.fecha);
        return fechaCita >= inicioSemana;
      }).length;

      const citasMes = todasCitas.filter((cita: any) => {
        const fechaCita = new Date(cita.fecha);
        return fechaCita >= inicioMes;
      }).length;

      setStats({
        totalPacientes: 0, // Necesitaríamos endpoint específico
        totalFisioterapeutas: fisios.length,
        citasHoy,
        citasSemana,
        citasMes,
      });
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-5 mb-6 border border-primary/10"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Panel de Administrador
              </h1>
              <p className="text-gray-600 mt-1">
                Bienvenido, {user.firstName} {user.lastName}
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-primary/30 hover:bg-primary/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-2 mb-6 border border-primary/10"
        >
          <div className="flex gap-2 overflow-x-auto">
            <Button
              variant={currentView === "overview" ? "default" : "ghost"}
              onClick={() => setCurrentView("overview")}
              className={
                currentView === "overview"
                  ? "shadow-lg shadow-primary/20"
                  : ""
              }
            >
              <BarChart3 className="w-4 h-4" />
              Panel
            </Button>
            <Button
              variant={currentView === "horarios" ? "default" : "ghost"}
              onClick={() => setCurrentView("horarios")}
              className={
                currentView === "horarios"
                  ? "shadow-lg shadow-primary/20"
                  : ""
              }
            >
              <Clock className="w-4 h-4" />
              Horarios
            </Button>
            <Button
              variant={currentView === "estadisticas" ? "default" : "ghost"}
              onClick={() => setCurrentView("estadisticas")}
              className={
                currentView === "estadisticas"
                  ? "shadow-lg shadow-primary/20"
                  : ""
              }
            >
              <TrendingUp className="w-4 h-4" />
              Stats
            </Button>
            <Button
              variant={currentView === "configuracion" ? "default" : "ghost"}
              onClick={() => setCurrentView("configuracion")}
              className={
                currentView === "configuracion"
                  ? "shadow-lg shadow-primary/20"
                  : ""
              }
            >
              <Settings className="w-4 h-4" />
              Config
            </Button>
          </div>
        </motion.nav>

        {/* Overview - Estadísticas */}
        {currentView === "overview" && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-10 h-10 opacity-80" />
                  <span className="text-3xl font-bold">{stats.totalFisioterapeutas}</span>
                </div>
                <h3 className="text-lg font-semibold">Fisioterapeutas</h3>
                <p className="text-blue-100 text-sm">Profesionales activos</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="w-10 h-10 opacity-80" />
                  <span className="text-3xl font-bold">{stats.citasHoy}</span>
                </div>
                <h3 className="text-lg font-semibold">Citas Hoy</h3>
                <p className="text-green-100 text-sm">Programadas para hoy</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="w-10 h-10 opacity-80" />
                  <span className="text-3xl font-bold">{stats.citasSemana}</span>
                </div>
                <h3 className="text-lg font-semibold">Esta Semana</h3>
                <p className="text-purple-100 text-sm">Citas programadas</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-10 h-10 opacity-80" />
                  <span className="text-3xl font-bold">{stats.citasMes}</span>
                </div>
                <h3 className="text-lg font-semibold">Este Mes</h3>
                <p className="text-orange-100 text-sm">Total de citas</p>
              </div>
            </motion.div>

            {/* Fisioterapeutas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-primary/30"
            >
              <div className="flex items-center gap-3 mb-6">
                <UserCheck className="w-7 h-7 text-primary" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Fisioterapeutas del Centro
                </h2>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fisioterapeutas.map((fisio) => (
                    <motion.div
                      key={fisio.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-5 border-2 border-primary/20 hover:border-primary/40 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                          <UserCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">
                            Dr(a). {fisio.user.firstName} {fisio.user.lastName}
                          </h3>
                          <p className="text-xs text-gray-500">{fisio.codigo}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">
                        {fisio.especialidad}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Acciones Rápidas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-primary/30"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Acciones Rápidas
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  onClick={() => setCurrentView("horarios")}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-6 shadow-lg"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  Gestionar Horarios
                </Button>
                <Button
                  onClick={() => setCurrentView("estadisticas")}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-6 shadow-lg"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Ver Estadísticas
                </Button>
                <Button
                  onClick={() => setCurrentView("configuracion")}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-6 shadow-lg"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Configuración
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Gestión de Horarios */}
        {currentView === "horarios" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-primary/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-7 h-7 text-primary" />
              <h2 className="text-2xl font-bold text-gray-800">
                Gestión de Horarios de Fisioterapeutas
              </h2>
            </div>

            <p className="text-gray-600 mb-6">
              Selecciona un fisioterapeuta para ver y gestionar sus horarios disponibles
            </p>

            {/* Selector de Fisioterapeuta */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Seleccionar Fisioterapeuta
              </label>
              <select
                value={selectedFisioId || ""}
                onChange={(e) => setSelectedFisioId(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
              >
                <option value="">Selecciona un fisioterapeuta...</option>
                {fisioterapeutas.map((fisio) => (
                  <option key={fisio.id} value={fisio.id}>
                    {fisio.codigo} - Dr(a). {fisio.user.firstName} {fisio.user.lastName} - {fisio.especialidad}
                  </option>
                ))}
              </select>
            </div>

            {selectedFisioId ? (
              <div className="bg-primary/10 rounded-xl p-6">
                <p className="text-center text-gray-600">
                  Funcionalidad de gestión de horarios en desarrollo.
                  <br />
                  Próximamente podrás asignar y modificar horarios desde aquí.
                </p>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Selecciona un fisioterapeuta para comenzar
              </div>
            )}
          </motion.div>
        )}

        {/* Estadísticas */}
        {currentView === "estadisticas" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-primary/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-7 h-7 text-primary" />
              <h2 className="text-2xl font-bold text-gray-800">
                Estadísticas Detalladas
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4">
                  Citas por Estado
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Programadas</span>
                    <span className="font-bold text-blue-900">
                      {stats.citasSemana}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Confirmadas</span>
                    <span className="font-bold text-blue-900">-</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Completadas</span>
                    <span className="font-bold text-blue-900">-</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-4">
                  Resumen del Sistema
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Fisioterapeutas</span>
                    <span className="font-bold text-green-900">
                      {stats.totalFisioterapeutas}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Citas Este Mes</span>
                    <span className="font-bold text-green-900">
                      {stats.citasMes}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Configuración */}
        {currentView === "configuracion" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-primary/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-7 h-7 text-primary" />
              <h2 className="text-2xl font-bold text-gray-800">Configuración del Sistema</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-2">Información del Usuario</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Usuario:</p>
                    <p className="font-semibold">{user.username}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email:</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Nombre:</p>
                    <p className="font-semibold">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rol:</p>
                    <p className="font-semibold">{user.roles.join(", ")}</p>
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-2">
                  Configuraciones Adicionales
                </h3>
                <p className="text-gray-600 text-sm">
                  Funcionalidades de configuración avanzada próximamente disponibles.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
