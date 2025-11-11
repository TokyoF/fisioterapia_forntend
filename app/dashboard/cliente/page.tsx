"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

interface UserData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export default function ClienteDashboard() {
  const [user, setUser] = useState<UserData | null>(null);

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
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-emerald-600">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Mi Panel de Paciente
              </h1>
              <p className="text-gray-600 mt-2">
                Bienvenido, {user.firstName} {user.lastName}
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Cerrar Sesión
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-green-50 p-6 rounded-xl border-2 border-green-200"
            >
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Mis Citas
              </h3>
              <p className="text-green-600">
                Visualiza y gestiona tus citas programadas
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-emerald-50 p-6 rounded-xl border-2 border-emerald-200"
            >
              <h3 className="text-xl font-semibold text-emerald-800 mb-2">
                Reservar Cita
              </h3>
              <p className="text-emerald-600">
                Solicita una nueva cita con nuestros profesionales
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-teal-50 p-6 rounded-xl border-2 border-teal-200"
            >
              <h3 className="text-xl font-semibold text-teal-800 mb-2">
                Mi Historial
              </h3>
              <p className="text-teal-600">
                Consulta tu historial de atenciones y tratamientos
              </p>
            </motion.div>
          </div>

          <div className="mt-8 bg-gray-50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Información Personal</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Usuario:</p>
                <p className="font-semibold">{user.username}</p>
              </div>
              <div>
                <p className="text-gray-600">Email:</p>
                <p className="font-semibold">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Rol:</p>
                <p className="font-semibold">{user.roles.join(", ")}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
