import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'motion/react';
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: { src: string; alt: string }[];
  initialIndex?: number;
}

interface ModalContentProps {
  onClose: () => void;
  images: { src: string; alt: string }[];
  initialIndex: number;
  key?: React.Key;
}

function ModalContent({ onClose, images, initialIndex }: ModalContentProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const currentImage = images[currentIndex] || images[0];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % images.length);
    handleReset();
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
    handleReset();
  };

  // Recentramento Inteligente
  useEffect(() => {
    if (scale <= 1) {
      x.set(0);
      y.set(0);
    }
  }, [scale, x, y]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 1));
  const handleReset = () => {
    setScale(1);
    x.set(0);
    y.set(0);
  };

  const onWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) handleZoomIn();
    else handleZoomOut();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md overflow-hidden flex items-center justify-center"
      onWheel={onWheel}
    >
      {/* Controls Overlay */}
      <div className="absolute top-0 left-0 right-0 z-[70] flex justify-between items-center p-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] pointer-events-auto hidden md:block">
          {currentImage.alt} <span className="ml-2 text-white/30 font-mono">({currentIndex + 1} / {images.length})</span>
        </div>
        
        <div className="flex items-center gap-2 pointer-events-auto ml-auto">
          <div className="flex items-center bg-[#111315]/80 border border-white/10 rounded-full p-1 mr-2 shadow-2xl backdrop-blur-xl">
            <button
              onClick={handleZoomOut}
              className="p-2 text-white/70 hover:text-[#FFB800] transition-colors rounded-full hover:bg-white/5"
              title="Zoom Out"
            >
              <ZoomOut size={18} />
            </button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <span className="text-[10px] font-mono font-bold text-white/50 w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button
              onClick={handleZoomIn}
              className="p-2 text-white/70 hover:text-[#FFB800] transition-colors rounded-full hover:bg-white/5"
              title="Zoom In"
            >
              <ZoomIn size={18} />
            </button>
            <button
              onClick={handleReset}
              className="p-2 text-white/70 hover:text-[#FFB800] transition-colors rounded-full hover:bg-white/5 ml-1"
              title="Reset"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-white text-black hover:bg-[#FFB800] rounded-full transition-all shadow-xl active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-[70] w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-[#FFB800] border border-white/10 text-white hover:text-black rounded-full transition-all active:scale-90 shadow-2xl backdrop-blur-md group"
          >
            <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-[70] w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-[#FFB800] border border-white/10 text-white hover:text-black rounded-full transition-all active:scale-90 shadow-2xl backdrop-blur-md group"
          >
            <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </>
      )}

      {/* Image Container */}
      <div 
        ref={containerRef}
        className="w-full h-full flex items-center justify-center p-4 overflow-hidden"
      >
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: scale, x: scale <= 1 ? 0 : undefined, y: scale <= 1 ? 0 : undefined }}
          drag={scale > 1}
          dragMomentum={false}
          style={{ x, y }}
          transition={{
            scale: { type: "spring", stiffness: 400, damping: 40, mass: 1 },
            opacity: { duration: 0.2 },
            x: { type: "spring", stiffness: 400, damping: 40, mass: 1 }
          }}
          className={`${scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"} flex items-center justify-center select-none`}
        >
          <img 
            src={currentImage.src} 
            alt={currentImage.alt} 
            className="max-w-[85vw] max-h-[85vh] object-contain select-none pointer-events-none rounded-sm shadow-2xl"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/1200x800/111315/FFB800?text=Image+Not+Found';
            }}
          />
        </motion.div>
      </div>

      {/* Hint Overlay */}
      {scale === 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none hidden md:block"
        >
          <div className="px-6 py-3 bg-black/40 border border-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase flex items-center gap-4">
            <span>Scroll para ampliar</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span>Setas para navegar</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span>Arraste para explorar</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function ImageModal({ 
  isOpen, 
  onClose, 
  images, 
  initialIndex = 0 
}: ImageModalProps) {
  // Disable body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalContent 
          key="modal-content" 
          onClose={onClose} 
          images={images} 
          initialIndex={initialIndex} 
        />
      )}
    </AnimatePresence>
  );
}

