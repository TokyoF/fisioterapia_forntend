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

export default function FisioterapeutaDashboard() {
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
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-cyan-600">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Panel de Fisioterapeuta
              </h1>
              <p className="text-gray-600 mt-2">
                Bienvenido, Dr(a). {user.firstName} {user.lastName}
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Cerrar Sesión
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-teal-50 p-6 rounded-xl border-2 border-teal-200"
            >
              <h3 className="text-xl font-semibold text-teal-800 mb-2">
                Mi Agenda
              </h3>
              <p className="text-teal-600">
                Gestiona tus citas y horarios de atención
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-cyan-50 p-6 rounded-xl border-2 border-cyan-200"
            >
              <h3 className="text-xl font-semibold text-cyan-800 mb-2">
                Pacientes
              </h3>
              <p className="text-cyan-600">
                Accede a historias clínicas y planes de tratamiento
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200"
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                Sesiones
              </h3>
              <p className="text-blue-600">
                Registra evaluaciones y sesiones de terapia
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
