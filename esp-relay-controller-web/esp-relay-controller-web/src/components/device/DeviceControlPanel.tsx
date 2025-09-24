import React from 'react';
import { useDeviceStore } from '../../stores/useDeviceStore';
import { useMqttStore } from '../../stores/useMqttStore';
import { useUiStore } from '../../stores/useUiStore';
import RelayControl from './RelayControl';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Thermometer, Cpu, Wifi, Settings, Timer } from 'lucide-react';

interface DeviceControlPanelProps {
  deviceId: string;
}

/**
 * @description Panel kontrol utama untuk perangkat yang dipilih.
 * Menampilkan detail perangkat dan daftar kontrol relay.
 */
const DeviceControlPanel: React.FC<DeviceControlPanelProps> = ({ deviceId }) => {
  // Mengambil data dan fungsi dari store
  const device = useDeviceStore(state => state.devices[deviceId]);
  const { publish } = useMqttStore();
  const { openDeviceSettingsModal, openTimerSettingsModal } = useUiStore();

  // Handler untuk toggle relay
  const handleToggleRelay = (relayId: number, currentState: boolean) => {
    const topic = `relay/${deviceId}/command`;
    // Format payload sesuai dengan yang diharapkan oleh firmware ESP
    // {"output0":"1"} atau {"output0":"0"}
    const payload = JSON.stringify({
      [`output${relayId}`]: currentState ? "0" : "1"
    });
    publish(topic, payload);
  };

  // Jika perangkat tidak ditemukan (misalnya, setelah dihapus)
  if (!device) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-500">Perangkat tidak ditemukan.</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <AnimatePresence mode="wait">
      <>
        <motion.div
          key={deviceId}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Header Panel */}
          <motion.div variants={itemVariants} className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{device.name}</h1>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                ID: {device.deviceId} | IP: {device.ipAddress}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={openTimerSettingsModal}
                className="p-3 rounded-full hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
                aria-label="Pengaturan Timer"
                title="Pengaturan Timer"
              >
                <Timer size={24} />
              </button>
              <button
                onClick={openDeviceSettingsModal}
                className="p-3 rounded-full hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
                aria-label="Pengaturan Perangkat"
                title="Pengaturan Perangkat"
              >
                <Settings size={24} />
              </button>
            </div>
          </motion.div>

          {/* Status Perangkat */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <StatusCard icon={<Wifi size={24} />} label="WiFi RSSI" value={`${device.rssi || 'N/A'} dBm`} />
            <StatusCard icon={<Cpu size={24} />} label="Free RAM" value={`${device.freeRam || 'N/A'} B`} />
            <StatusCard icon={<BarChart size={24} />} label="Uptime" value={`${device.uptime ? (device.uptime / 1000).toFixed(0) : 'N/A'} s`} />
            <StatusCard icon={<Thermometer size={24} />} label="MQTT" value={device.isMqttConnected ? 'Terhubung' : 'Terputus'} />
          </motion.div>

          {/* Kontrol Relay */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {device.relays.map((relay) => (
              <motion.div key={relay.id} variants={itemVariants}>
                <RelayControl
                  relay={relay}
                  onToggle={() => handleToggleRelay(relay.id, relay.isOn)}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </>
    </AnimatePresence>
  );
};

// Komponen kecil untuk kartu status
const StatusCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-light-card dark:bg-dark-card p-4 rounded-lg shadow-sm flex items-center space-x-4">
    <div className="bg-light-bg dark:bg-dark-bg p-3 rounded-full text-light-primary dark:text-dark-primary">
      {icon}
    </div>
    <div>
      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  </div>
);


export default DeviceControlPanel;
