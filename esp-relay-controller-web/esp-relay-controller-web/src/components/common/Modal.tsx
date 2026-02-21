import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * @description Komponen Modal yang dapat digunakan kembali dengan animasi.
 * Menyediakan overlay, panel, judul, dan tombol tutup.
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const AnyAnimatePresence = AnimatePresence as any;
  return (
    <AnyAnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-light-card dark:bg-dark-card rounded-lg shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()} // Mencegah penutupan modal saat mengklik di dalam konten
          >
            {/* Header Modal */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
                aria-label="Tutup Modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Konten Modal */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnyAnimatePresence>
  );
};

export default Modal;
