"use client";

import { Dialog, DialogContent, DialogTitle, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface GalleryImage {
  src: string;
  alt: string;
  title: string;
  description: string;
}

interface GalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: GalleryImage[];
  initialIndex: number;
  clickPosition?: { x: number; y: number };
}

export function GalleryModal({ open, onOpenChange, images, initialIndex, clickPosition }: GalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        {/* Overlay transparente personalizado */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-transparent" />

        {/* Contenido del modal sin estilos predeterminados */}
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 w-screen h-screen overflow-hidden focus:outline-none"
        >
          <VisuallyHidden>
            <DialogPrimitive.Title>{currentImage.title}</DialogPrimitive.Title>
          </VisuallyHidden>

          {/* Fondo borroso con la imagen actual */}
          <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={currentImage.src}
                alt="background"
                fill
                className="object-cover blur-xl scale-110"
                priority
              />
              <div className="absolute inset-0 bg-black/30" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Contenido principal - clic fuera cierra el modal */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          onClick={() => onOpenChange(false)}
        >
          {/* Imagen principal - carrusel sin contenedor visible - tamaño fijo consistente */}
          <div
            className="relative w-[1080px] h-[720px] max-w-[95vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={
                  clickPosition && open && currentIndex === initialIndex
                    ? {
                        opacity: 0,
                        scale: 0.3,
                        x: clickPosition.x - window.innerWidth / 2,
                        y: clickPosition.y - window.innerHeight / 2,
                      }
                    : { opacity: 0 }
                }
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  opacity: { duration: 0.3 },
                }}
                className="absolute inset-0"
              >
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt}
                  fill
                  className="object-cover rounded-2xl drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Información de la imagen - flotante abajo */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center max-w-3xl w-full px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {/* Gradiente de fondo sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent blur-2xl rounded-3xl" />

                {/* Contenido sin bordes */}
                <div className="relative px-10 py-6">
                  <h3 className="text-4xl font-bold mb-3 text-primary drop-shadow-2xl">
                    {currentImage.title}
                  </h3>
                  <p className="text-white/95 text-xl drop-shadow-lg leading-relaxed">
                    {currentImage.description}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <p className="text-white/80 text-sm font-medium">
                      {currentIndex + 1} / {images.length}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Botones de navegación */}
          {images.length > 1 && (
            <>
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/30 flex items-center justify-center transition-all group shadow-2xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="currentColor"
                  className="w-9 h-9 text-white group-hover:-translate-x-1 transition-transform"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/30 flex items-center justify-center transition-all group shadow-2xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="currentColor"
                  className="w-9 h-9 text-white group-hover:translate-x-1 transition-transform"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </motion.button>
            </>
          )}

          {/* Indicadores de navegación - minimalistas */}
          {images.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/40 backdrop-blur-xl rounded-full px-5 py-3 border border-white/30 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`transition-all ${
                    index === currentIndex
                      ? "w-10 h-2.5 bg-white rounded-full"
                      : "w-2.5 h-2.5 bg-white/50 hover:bg-white/70 rounded-full"
                  }`}
                />
              ))}
            </motion.div>
          )}
        </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
