"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      const roles = data.roles || [];
      if (roles.includes("ROLE_ADMIN")) {
        window.location.href = "/dashboard/admin";
      } else if (roles.includes("ROLE_FISIOTERAPEUTA")) {
        window.location.href = "/dashboard/fisioterapeuta";
      } else if (roles.includes("ROLE_CLIENTE")) {
        window.location.href = "/dashboard/cliente";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Iniciar Sesión</DialogTitle>
            <DialogDescription className="text-center">
              Ingresa tus credenciales para acceder
            </DialogDescription>
          </DialogHeader>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              type="text"
              placeholder="Tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="transition-all focus:scale-[1.02]"
            />
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="transition-all focus:scale-[1.02]"
            />
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.p
                className="text-sm text-red-500 text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Iniciando sesión...
                </motion.span>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
