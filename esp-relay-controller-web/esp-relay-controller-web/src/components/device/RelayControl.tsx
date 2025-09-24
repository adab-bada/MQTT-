import React from 'react';
import { RelayState } from '../../types';
import { motion } from 'framer-motion';

interface RelayControlProps {
  relay: RelayState;
  onToggle: () => void;
}

/**
 * @description Komponen untuk menampilkan dan mengontrol satu relay.
 * Menampilkan nama relay dan tombol ON/OFF.
 */
const RelayControl: React.FC<RelayControlProps> = ({ relay, onToggle }) => {
  const { name, isOn } = relay;

  const cardVariants = {
    on: { borderColor: '#22c55e', backgroundColor: '#ffffff' }, // green-500
    off: { borderColor: '#ef4444', backgroundColor: '#ffffff' }, // red-500
  };

  const darkCardVariants = {
    on: { borderColor: '#22c55e', backgroundColor: '#1f2937' },
    off: { borderColor: '#ef4444', backgroundColor: '#1f2937' },
  };

  const toggleVariants = {
    on: { backgroundColor: '#22c55e' },
    off: { backgroundColor: '#ef4444' },
  };

  return (
    <motion.div
      layout
      className="p-4 border-2 rounded-lg flex items-center justify-between shadow-sm dark:bg-dark-card"
      variants={document.documentElement.classList.contains('dark') ? darkCardVariants : cardVariants}
      animate={isOn ? 'on' : 'off'}
      transition={{ duration: 0.3 }}
    >
      <span className="font-semibold text-lg">{name}</span>
      <div className="flex items-center">
        <motion.button
          onClick={onToggle}
          className="w-24 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
          variants={toggleVariants}
          animate={isOn ? 'on' : 'off'}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOn ? 'ON' : 'OFF'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RelayControl;
