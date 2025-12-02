"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useState, useRef } from "react";
import { GalleryModal } from "./GalleryModal";

interface GalleryImage {
  src: string;
  alt: string;
  title: string;
  description: string;
}

interface FanGalleryProps {
  images: GalleryImage[];
}

export function FanGallery({ images }: FanGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleImageClick = (index: number, event: React.MouseEvent) => {
    const card = cardRefs.current[index];
    if (card) {
      const rect = card.getBoundingClientRect();
      setClickPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
    setSelectedImageIndex(index);
    setModalOpen(true);
  };

  return (
    <>
      <div className="relative w-full h-[500px] flex items-center justify-center">
        <div className="relative w-[400px] h-[500px]">
          {images.map((image, index) => {
            const totalImages = images.length;
            const centerIndex = Math.floor(totalImages / 2);

            // Calcular rotación y desplazamiento para efecto abanico
            const rotation = (index - centerIndex) * 12; // 12 grados entre cada imagen (más separación)
            const translateX = (index - centerIndex) * 40; // 40px de separación horizontal (más espaciado)
            const translateY = Math.abs(index - centerIndex) * 8; // Ligero desplazamiento vertical

            // Z-index: la imagen central tiene el mayor índice
            const zIndex = totalImages - Math.abs(index - centerIndex);

            // Scale cuando se hace hover
            const isHovered = hoveredIndex === index;
            const scale = isHovered ? 1.1 : 1;

            return (
              <motion.div
                key={index}
                ref={(el) => (cardRefs.current[index] = el)}
                className="absolute inset-0 cursor-pointer"
                style={{
                  zIndex: isHovered ? 100 : zIndex,
                }}
                initial={{
                  rotate: rotation,
                  x: translateX,
                  y: translateY,
                  scale: 0.9,
                  opacity: 0,
                }}
                animate={{
                  rotate: hoveredIndex !== null && !isHovered ? rotation : rotation,
                  x: translateX,
                  y: translateY,
                  scale: scale,
                  opacity: 1,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  scale: { duration: 0.3 },
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: 0,
                  x: 0,
                  y: -20,
                  transition: { duration: 0.3 },
                }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                onClick={(e) => handleImageClick(index, e)}
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />

                  {/* Overlay con título al hacer hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6"
                  >
                    <div className="text-white">
                      <h3 className="text-xl font-bold mb-1">{image.title}</h3>
                      <p className="text-sm text-white/80">{image.description}</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Indicador de interacción minimalista */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: images.length * 0.1 + 0.5 }}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-5 py-2.5 flex items-center gap-2 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672z"
              />
            </svg>
            <span className="text-sm font-medium text-primary">Click para ampliar</span>
          </div>
        </motion.div>
      </div>

      {/* Modal de galería con efecto de apertura */}
      <GalleryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        images={images}
        initialIndex={selectedImageIndex}
        clickPosition={clickPosition}
      />
    </>
  );
}
