import React from 'react';
import { Sun, Moon, Settings, Wifi, WifiOff, Menu, Battery, Shield } from 'lucide-react';
import { useUiStore } from '../../stores/useUiStore';
import { useMqttStore } from '../../stores/useMqttStore';

/**
 * @description Komponen Header aplikasi dengan estetika instrumen otomotif.
 */
const Header: React.FC = () => {
  const { theme, toggleTheme, openMqttSettingsModal, toggleSidebar } = useUiStore();
  const mqttStatus = useMqttStore(state => state.status);

  const getStatusIndicator = () => {
    switch (mqttStatus) {
      case 'connected':
        return { color: 'text-dark-success', text: 'MQTT CONNECTED', Icon: Wifi };
      case 'connecting':
        return { color: 'text-dark-warning', text: 'CONNECTING...', Icon: WifiOff };
      case 'reconnecting':
        return { color: 'text-dark-warning', text: 'RECONNECTING...', Icon: WifiOff };
      case 'closed':
        return { color: 'text-dark-accent', text: 'MQTT DISCONNECTED', Icon: WifiOff };
      default:
        return { color: 'text-gray-500', text: 'UNKNOWN', Icon: WifiOff };
    }
  };

  const { color, text, Icon } = getStatusIndicator();

  return (
    <header className="bg-dark-card border-b border-white/5 shadow-lg p-4 flex justify-between items-center z-20 relative">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors md:hidden text-white"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center space-x-2">
          <div className="bg-dark-primary p-1.5 rounded-lg shadow-neon-blue">
            <Shield size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-black italic tracking-tighter text-white uppercase">
            MOTO<span className="text-dark-primary">GUARD</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        {/* Mocked Battery Indicator for Automotive feel */}
        <div className="hidden sm:flex items-center space-x-2 bg-dark-bg px-3 py-1.5 rounded-full border border-white/5">
          <Battery size={16} className="text-dark-success" />
          <span className="text-xs font-mono font-bold text-dark-success">12.6V</span>
        </div>

        <div className="hidden lg:flex items-center space-x-2 bg-dark-bg px-3 py-1.5 rounded-full border border-white/5">
          <Icon className={color} size={16} />
          <span className={`text-[10px] font-black tracking-widest ${color}`}>{text}</span>
        </div>

        <div className="flex items-center bg-dark-bg p-1 rounded-xl border border-white/5">
          <button
            onClick={openMqttSettingsModal}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors text-dark-text-secondary hover:text-white"
            title="MQTT Config"
          >
            <Settings size={18} />
          </button>

          <div className="w-px h-4 bg-white/10 mx-1" />

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors text-dark-text-secondary hover:text-white"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
