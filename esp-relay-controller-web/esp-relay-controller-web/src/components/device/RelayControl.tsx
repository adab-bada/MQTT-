import React from 'react';
import { RelayState } from '../../types';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, Power, Zap, AlertTriangle, Lock, Unlock, Radio } from 'lucide-react';

interface RelayControlProps {
  relay: RelayState;
  onToggle: () => void;
}

/**
 * @description Komponen untuk menampilkan dan mengontrol satu relay dengan desain otomotif.
 * Dioptimalkan untuk fungsi keamanan motor.
 */
const RelayControl: React.FC<RelayControlProps> = ({ relay, onToggle }) => {
  const { name, isOn, id } = relay;

  // Mendapatkan icon berdasarkan ID atau Nama Relay
  const getIcon = () => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('alarm') || id === 0) {
      return isOn ? <Lock size={24} /> : <Unlock size={24} />;
    }
    if (lowerName.includes('engine') || lowerName.includes('kill') || id === 1) {
      return <Power size={24} />;
    }
    if (lowerName.includes('start') || id === 2) {
      return <Zap size={24} />;
    }
    if (lowerName.includes('hazard') || lowerName.includes('lampu') || id === 3) {
      return <AlertTriangle size={24} />;
    }
    return <Radio size={24} />;
  };

  const getStatusColor = () => {
    if (isOn) {
      if (id === 0) return 'text-dark-success shadow-neon-blue'; // Alarm Active
      if (id === 1) return 'text-dark-accent shadow-neon-red';   // Engine Cut/Off
      return 'text-dark-primary shadow-neon-blue';
    }
    return 'text-gray-500';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 ${
        isOn
          ? 'bg-dark-card border-dark-primary/30 shadow-lg'
          : 'bg-dark-bg border-white/5 shadow-inner-dark'
      }`}
    >
      {/* Glow Effect when ON */}
      {isOn && (
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-dark-primary/10 blur-3xl rounded-full" />
      )}

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-xl transition-all duration-500 ${
            isOn ? 'bg-dark-primary/20 text-dark-primary' : 'bg-white/5 text-gray-500'
          }`}>
            {getIcon()}
          </div>
          <div>
            <h3 className={`font-bold text-lg transition-colors duration-300 ${
              isOn ? 'text-white' : 'text-gray-400'
            }`}>
              {name}
            </h3>
            <p className={`text-xs uppercase tracking-widest font-medium ${
              isOn ? 'text-dark-primary' : 'text-gray-600'
            }`}>
              {isOn ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>

        <button
          onClick={onToggle}
          className={`relative w-16 h-8 rounded-full transition-colors duration-500 flex items-center px-1 ${
            isOn ? 'bg-dark-primary' : 'bg-gray-700'
          }`}
        >
          <motion.div
            animate={{ x: isOn ? 32 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="w-6 h-6 bg-white rounded-full shadow-md"
          />
        </button>
      </div>

      {/* Status Bar at bottom */}
      <div className={`absolute bottom-0 left-0 h-1 transition-all duration-500 ${
        isOn ? 'w-full bg-dark-primary' : 'w-0 bg-transparent'
      }`} />
    </motion.div>
  );
};

export default RelayControl;
