import React from 'react';
import { Sun, Moon, Settings, Wifi, WifiOff, Menu } from 'lucide-react';
import { useUiStore } from '../../stores/useUiStore';
import { useMqttStore } from '../../stores/useMqttStore';

/**
 * @description Komponen Header aplikasi.
 * Menampilkan judul, status koneksi MQTT, dan kontrol untuk tema & pengaturan.
 */
const Header: React.FC = () => {
  // Mengambil state dan fungsi dari store UI dan MQTT
  const { theme, toggleTheme, openMqttSettingsModal, toggleSidebar } = useUiStore();
  const mqttStatus = useMqttStore(state => state.status);

  // Fungsi untuk mendapatkan warna dan teks indikator status MQTT
  const getStatusIndicator = () => {
    switch (mqttStatus) {
      case 'connected':
        return { color: 'text-green-500', text: 'Terhubung', Icon: Wifi };
      case 'connecting':
        return { color: 'text-yellow-500', text: 'Menghubungkan...', Icon: WifiOff };
      case 'reconnecting':
        return { color: 'text-yellow-500', text: 'Menyambung ulang...', Icon: WifiOff };
      case 'closed':
        return { color: 'text-red-500', text: 'Terputus', Icon: WifiOff };
      case 'error':
        return { color: 'text-red-500', text: 'Error', Icon: WifiOff };
      default:
        return { color: 'text-gray-500', text: 'Tidak Diketahui', Icon: WifiOff };
    }
  };

  const { color, text, Icon } = getStatusIndicator();

  return (
    <header className="bg-light-card dark:bg-dark-card shadow-md p-4 flex justify-between items-center z-20 relative">
      <div className="flex items-center space-x-4">
        {/* Tombol Menu untuk Mobile */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-light-bg dark:hover:bg-dark-bg transition-colors md:hidden"
          aria-label="Buka Menu"
          title="Buka Menu"
        >
          <Menu size={24} />
        </button>
        {/* Judul Aplikasi */}
        <h1 className="text-xl md:text-2xl font-bold text-light-primary dark:text-dark-primary">
          ESP Relay Controller
        </h1>
      </div>

      {/* Kontrol dan Status di sisi kanan */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Indikator Status MQTT */}
        <div className="hidden sm:flex items-center space-x-2">
          <span className={`text-sm font-medium ${color}`}>{text}</span>
          <Icon className={color} size={20} />
        </div>

        {/* Tombol Pengaturan MQTT */}
        <button
          onClick={openMqttSettingsModal}
          className="p-2 rounded-full hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
          aria-label="Pengaturan MQTT"
          title="Pengaturan MQTT"
        >
          <Settings size={20} />
        </button>

        {/* Tombol Ganti Tema */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
          aria-label="Ganti Tema"
          title="Ganti Tema"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
