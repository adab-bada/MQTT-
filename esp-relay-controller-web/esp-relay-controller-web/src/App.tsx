import React, { useEffect } from 'react';
import MainLayout from './components/layout/MainLayout';
import MqttSettingsModal from './components/modals/MqttSettingsModal';
import AddDeviceModal from './components/modals/AddDeviceModal';
import DeviceSettingsModal from './components/modals/DeviceSettingsModal';
import TimerSettingsModal from './components/modals/TimerSettingsModal';
import DeviceControlPanel from './components/device/DeviceControlPanel';
import { useUiStore } from './stores/useUiStore';
import { useDeviceStore } from './stores/useDeviceStore';

// Placeholder components
const WelcomeScreen = () => <div className="flex justify-center items-center h-full"><p className="text-lg text-gray-500">Pilih perangkat dari sidebar untuk memulai, atau tambahkan perangkat baru.</p></div>;


/**
 * @description Komponen utama aplikasi.
 * Bertanggung jawab untuk merender layout utama, modal, dan konten utama
 * berdasarkan state aplikasi.
 */
function App() {
  const {
    initializeTheme
  } = useUiStore();

  const activeDeviceId = useDeviceStore(state => state.activeDeviceId);

  // Inisialisasi tema saat aplikasi pertama kali dimuat
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <>
      <MainLayout>
        {activeDeviceId ? (
          <DeviceControlPanel deviceId={activeDeviceId} />
        ) : (
          <WelcomeScreen />
        )}
      </MainLayout>

      {/* Render modal. Mereka mengelola visibilitas mereka sendiri dari dalam. */}
      <MqttSettingsModal />
      <AddDeviceModal />
      <DeviceSettingsModal />
      <TimerSettingsModal />
    </>
  );
}

export default App;
