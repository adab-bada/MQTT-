import React from 'react';
import { PlusCircle, Power, ChevronRight, Bike, Smartphone, Activity } from 'lucide-react';
import { useDeviceStore } from '../../stores/useDeviceStore';
import { useUiStore } from '../../stores/useUiStore';
import { Device } from '../../types';

/**
 * @description Komponen Sidebar dengan desain navigasi otomotif modern.
 */
const Sidebar: React.FC = () => {
  const { devices, activeDeviceId, setActiveDeviceId } = useDeviceStore();
  const { openAddDeviceModal, toggleSidebar } = useUiStore();

  const deviceList = Object.values(devices);

  const handleDeviceClick = (deviceId: string) => {
    setActiveDeviceId(deviceId);
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <aside className="w-72 bg-dark-bg border-r border-white/5 p-6 flex flex-col z-10">
      <div className="mb-8">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-dark-text-secondary mb-4 px-2 flex items-center">
          <Activity size={14} className="mr-2 text-dark-primary" />
          Fleet Overview
        </h2>

        {/* Fleet Stats (Decorative/Informational) */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-dark-card p-3 rounded-2xl border border-white/5">
            <p className="text-[10px] font-bold text-dark-text-secondary uppercase">Total</p>
            <p className="text-xl font-black text-white">{deviceList.length}</p>
          </div>
          <div className="bg-dark-card p-3 rounded-2xl border border-white/5">
            <p className="text-[10px] font-bold text-dark-text-secondary uppercase">Active</p>
            <p className="text-xl font-black text-dark-success">
              {deviceList.filter(d => d.isMqttConnected).length}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-grow overflow-y-auto space-y-2 custom-scrollbar">
        {deviceList.length > 0 ? (
          deviceList.map((device: Device) => (
            <button
              key={device.deviceId}
              onClick={() => handleDeviceClick(device.deviceId)}
              className={`w-full text-left p-4 rounded-2xl flex items-center justify-between transition-all duration-300 border group
                ${activeDeviceId === device.deviceId
                  ? 'bg-dark-card border-dark-primary/50 shadow-neon-blue'
                  : 'bg-transparent border-transparent hover:bg-white/5'
                }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-xl transition-colors duration-300 ${
                  activeDeviceId === device.deviceId
                    ? 'bg-dark-primary text-white'
                    : 'bg-white/5 text-dark-text-secondary group-hover:text-white'
                }`}>
                  <Bike size={20} />
                </div>
                <div>
                  <p className={`font-bold transition-colors ${
                    activeDeviceId === device.deviceId ? 'text-white' : 'text-dark-text-secondary group-hover:text-white'
                  }`}>
                    {device.name}
                  </p>
                  <div className="flex items-center">
                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${device.isMqttConnected ? 'bg-dark-success' : 'bg-dark-accent'}`} />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-dark-text-secondary">
                      {device.isMqttConnected ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              </div>
              {activeDeviceId === device.deviceId && (
                <ChevronRight size={18} className="text-dark-primary" />
              )}
            </button>
          ))
        ) : (
          <div className="text-center py-10 px-4 bg-dark-card/50 rounded-3xl border border-dashed border-white/10">
            <Smartphone size={32} className="mx-auto text-dark-text-secondary/30 mb-4" />
            <p className="text-sm text-dark-text-secondary font-medium">
              No vehicles registered in your fleet.
            </p>
          </div>
        )}
      </nav>

      <div className="mt-6">
        <button
          onClick={openAddDeviceModal}
          className="w-full flex items-center justify-center p-4 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-dark-primary hover:border-dark-primary transition-all duration-300 font-bold uppercase tracking-widest text-xs group"
        >
          <PlusCircle size={18} className="mr-2 group-hover:rotate-90 transition-transform" />
          Register Vehicle
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
