import React from 'react';
import { useDeviceStore } from '../../stores/useDeviceStore';
import { useMqttStore } from '../../stores/useMqttStore';
import { useUiStore } from '../../stores/useUiStore';
import RelayControl from './RelayControl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wifi,
  Settings,
  Timer,
  Bike,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Battery,
  Signal
} from 'lucide-react';

interface DeviceControlPanelProps {
  deviceId: string;
}

/**
 * @description Panel kontrol utama dengan desain Cluster Instrumen Digital Otomotif.
 */
const DeviceControlPanel: React.FC<DeviceControlPanelProps> = ({ deviceId }) => {
  const device = useDeviceStore(state => state.devices[deviceId]);
  const { publish } = useMqttStore();
  const { openDeviceSettingsModal, openTimerSettingsModal } = useUiStore();
  const AnyAnimatePresence = AnimatePresence as any;

  const handleToggleRelay = (relayId: number, currentState: boolean) => {
    const topic = `relay/${deviceId}/command`;
    const payload = JSON.stringify({
      [`output${relayId}`]: currentState ? "0" : "1"
    });
    publish(topic, payload);
  };

  // Logika Master Security
  // Relay 0 usually Alarm, Relay 1 usually Engine Kill
  const isAlarmOn = device?.relays[0]?.isOn;
  const isEngineCut = device?.relays[1]?.isOn;
  const isSecured = isAlarmOn && isEngineCut;

  const toggleMasterSecurity = () => {
    const topic = `relay/${deviceId}/command`;
    const targetState = isSecured ? "0" : "1";
    const payload = JSON.stringify({
      "output0": targetState,
      "output1": targetState
    });
    publish(topic, payload);
  };

  if (!device) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-500">Perangkat tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <AnyAnimatePresence mode="wait">
      <motion.div
        key={deviceId}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
        className="space-y-8 pb-10"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <Bike className="text-dark-primary" size={28} />
              <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">
                {device.name}
              </h1>
            </div>
            <p className="text-sm font-mono text-dark-text-secondary bg-white/5 px-2 py-1 rounded inline-block">
              SYS-ID: {device.deviceId} {' // '} IP: {device.ipAddress}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={openTimerSettingsModal}
              className="p-3 rounded-xl bg-dark-card border border-white/5 hover:border-dark-primary/50 transition-all"
              title="Jadwal Keamanan"
            >
              <Timer size={20} className="text-dark-text-secondary" />
            </button>
            <button
              onClick={openDeviceSettingsModal}
              className="p-3 rounded-xl bg-dark-card border border-white/5 hover:border-dark-primary/50 transition-all"
              title="Konfigurasi Sistem"
            >
              <Settings size={20} className="text-dark-text-secondary" />
            </button>
          </div>
        </div>

        {/* Status Dashboard Cluster */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            icon={<Signal size={20} />}
            label="Signal Strength"
            value={`${device.rssi || '-'} dBm`}
            status={device.rssi && device.rssi > -70 ? 'good' : 'warning'}
          />
          <DashboardCard
            icon={<Battery size={20} />}
            label="Main Voltage"
            value="12.6 V" // Mocked as requested, prepared in UI
            status="good"
          />
          <DashboardCard
            icon={<Activity size={20} />}
            label="System Load"
            value={`${device.freeRam ? (device.freeRam / 1024).toFixed(1) : '-'} KB`}
            status="good"
          />
          <DashboardCard
            icon={<Wifi size={20} />}
            label="Link Status"
            value={device.isMqttConnected ? 'ONLINE' : 'OFFLINE'}
            status={device.isMqttConnected ? 'good' : 'error'}
          />
        </div>

        {/* Visual Security Status & Master Switch */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 rounded-3xl p-8 relative overflow-hidden transition-all duration-500 flex flex-col items-center justify-center text-center ${
            isSecured
              ? 'bg-gradient-to-br from-dark-success/20 to-dark-bg border border-dark-success/30 shadow-neon-blue'
              : 'bg-gradient-to-br from-dark-accent/20 to-dark-bg border border-dark-accent/30'
          }`}>
            <div className="relative z-10">
              <div className={`mb-4 inline-flex p-6 rounded-full transition-all duration-700 ${
                isSecured ? 'bg-dark-success/20 text-dark-success scale-110' : 'bg-dark-accent/20 text-dark-accent'
              }`}>
                {isSecured ? <ShieldCheck size={64} /> : <ShieldAlert size={64} />}
              </div>
              <h2 className="text-4xl font-black mb-2 tracking-widest uppercase italic">
                {isSecured ? 'System Secured' : 'System Vulnerable'}
              </h2>
              <p className="text-dark-text-secondary mb-8 max-w-md mx-auto">
                {isSecured
                  ? 'Engine is locked and alarm system is active. Your vehicle is safe.'
                  : 'Engine is ready to start and alarm system is inactive. Use caution.'}
              </p>

              <button
                onClick={toggleMasterSecurity}
                className={`px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all duration-300 shadow-xl ${
                  isSecured
                    ? 'bg-dark-accent hover:bg-red-600 text-white'
                    : 'bg-dark-success hover:bg-emerald-600 text-white'
                }`}
              >
                {isSecured ? 'Disarm All Systems' : 'Activate Full Security'}
              </button>
            </div>

            {/* Background Decoration */}
            <Bike className={`absolute -bottom-10 -right-10 w-64 h-64 opacity-5 transition-transform duration-1000 ${
              isSecured ? 'rotate-0' : 'rotate-12 translate-x-10'
            }`} />
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-dark-text-secondary px-2">
              Individual Controls
            </h3>
            {device.relays.map((relay) => (
              <RelayControl
                key={relay.id}
                relay={relay}
                onToggle={() => handleToggleRelay(relay.id, relay.isOn)}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnyAnimatePresence>
  );
};

// Komponen Card khusus Dashboard
const DashboardCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  status: 'good' | 'warning' | 'error'
}> = ({ icon, label, value, status }) => {
  const statusColors = {
    good: 'text-dark-success',
    warning: 'text-dark-warning',
    error: 'text-dark-accent'
  };

  return (
    <div className="bg-dark-card border border-white/5 p-5 rounded-2xl shadow-inner-dark group hover:border-dark-primary/30 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-dark-bg rounded-lg text-dark-text-secondary group-hover:text-dark-primary transition-colors">
          {icon}
        </div>
        <div className={`w-2 h-2 rounded-full animate-pulse ${statusColors[status].replace('text', 'bg')}`} />
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-dark-text-secondary mb-1">{label}</p>
      <p className="text-xl font-mono font-bold text-white tracking-tight">{value}</p>
    </div>
  );
};

export default DeviceControlPanel;
