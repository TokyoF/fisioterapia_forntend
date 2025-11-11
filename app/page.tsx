"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/auth/LoginModal";

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-20 h-20 border-2 border-white"
            animate={{
              y: [0, 20, 0],
              rotate: [0, 90, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/4 w-16 h-16 border-2 border-white rotate-45"
            animate={{
              y: [0, -15, 0],
              x: [0, 15, 0]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/2 right-1/3 w-24 h-24 border-2 border-white rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 min-h-screen">
            <motion.div
              className="flex-1 text-white max-w-2xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className="text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Bienvenido a
                <br />
                <span className="block mt-2">Fisioterapia Santa María de Asís</span>
              </motion.h1>
              <motion.p
                className="text-lg lg:text-xl mb-8 text-white/90 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Brindamos atención profesional y personalizada para tu recuperación y bienestar.
                Nuestro equipo de especialistas está comprometido con tu salud.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-6 h-auto font-semibold"
                  onClick={() => setLoginOpen(true)}
                >
                  Reservar Cita
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex-1 relative w-full max-w-xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div
                className="relative rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/hero2.jpg"
                  alt="Fisioterapia profesional"
                  width={600}
                  height={700}
                  className="object-cover w-full h-auto"
                  priority
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}
