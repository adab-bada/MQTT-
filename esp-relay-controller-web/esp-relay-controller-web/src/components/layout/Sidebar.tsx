import React from 'react';
import { PlusCircle, Power, ChevronRight } from 'lucide-react';
import { useDeviceStore } from '../../stores/useDeviceStore';
import { useUiStore } from '../../stores/useUiStore';
import { Device } from '../../types';

/**
 * @description Komponen Sidebar untuk menampilkan daftar perangkat.
 * Perilakunya responsif untuk desktop dan mobile.
 */
const Sidebar: React.FC = () => {
  // Mengambil state dan fungsi dari store
  const { devices, activeDeviceId, setActiveDeviceId } = useDeviceStore();
  const { openAddDeviceModal, toggleSidebar } = useUiStore();

  const deviceList = Object.values(devices);

  const handleDeviceClick = (deviceId: string) => {
    setActiveDeviceId(deviceId);
    // Tutup sidebar setelah memilih perangkat di mode mobile
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <aside className="w-64 bg-light-card dark:bg-dark-card p-4 flex flex-col shadow-lg z-10">
      <h2 className="text-lg font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        Perangkat Saya
      </h2>

      {/* Daftar Perangkat */}
      <nav className="flex-grow overflow-y-auto">
        <ul>
          {deviceList.length > 0 ? (
            deviceList.map((device: Device) => (
              <li key={device.deviceId} className="mb-2">
                <button
                  onClick={() => handleDeviceClick(device.deviceId)}
                  className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all duration-200
                    ${activeDeviceId === device.deviceId
                      ? 'bg-light-primary text-white shadow-md'
                      : 'hover:bg-light-bg dark:hover:bg-dark-bg'
                    }`}
                >
                  <div className="flex items-center">
                    <Power
                      size={18}
                      className={`mr-3 ${activeDeviceId === device.deviceId ? 'text-white' : (device.isMqttConnected ? 'text-green-500' : 'text-red-500')}`}
                    />
                    <span className="font-medium">{device.name}</span>
                  </div>
                  {activeDeviceId === device.deviceId && <ChevronRight size={20} />}
                </button>
              </li>
            ))
          ) : (
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary text-center mt-4">
              Belum ada perangkat. Klik tombol di bawah untuk menambahkan.
            </p>
          )}
        </ul>
      </nav>

      {/* Tombol Tambah Perangkat */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={openAddDeviceModal}
          className="w-full flex items-center justify-center p-3 bg-light-accent dark:bg-dark-accent text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <PlusCircle size={20} className="mr-2" />
          <span>Tambah Perangkat</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
