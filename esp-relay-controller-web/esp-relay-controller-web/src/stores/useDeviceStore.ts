import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Device, RelayState } from '../types';

// Tipe untuk state perangkat
type DeviceState = {
  devices: Record<string, Device>; // Menggunakan objek untuk akses lebih cepat dengan deviceId
  activeDeviceId: string | null;

  // Aksi-aksi untuk mengubah state
  addDevice: (device: Device) => void;
  removeDevice: (deviceId: string) => void;
  setActiveDeviceId: (deviceId: string | null) => void;
  updateDeviceStatus: (deviceId: string, status: Partial<Pick<Device, 'isMqttConnected' | 'rssi' | 'freeRam' | 'uptime'>>) => void;
  updateRelayState: (deviceId: string, relayId: number, state: Partial<RelayState>) => void;
  updateDeviceName: (deviceId: string, newName: string) => void;
  updateRelayName: (deviceId: string, relayId: number, newName: string) => void;
};

/**
 * @description Store Zustand untuk mengelola daftar perangkat dan statusnya.
 * Data perangkat akan disimpan di localStorage agar persisten.
 */
export const useDeviceStore = create<DeviceState>()(
  persist(
    (set, get) => ({
      // State awal
      devices: {},
      activeDeviceId: null,

      /**
       * @description Menambahkan perangkat baru ke dalam daftar.
       */
      addDevice: (device) => set(state => ({
        devices: { ...state.devices, [device.deviceId]: device }
      })),

      /**
       * @description Menghapus perangkat dari daftar berdasarkan ID-nya.
       */
      removeDevice: (deviceId) => set(state => {
        const newDevices = { ...state.devices };
        delete newDevices[deviceId];
        return {
          devices: newDevices,
          // Jika perangkat yang dihapus adalah yang aktif, reset activeDeviceId
          activeDeviceId: state.activeDeviceId === deviceId ? null : state.activeDeviceId
        };
      }),

      /**
       * @description Mengatur perangkat mana yang sedang aktif/dilihat di UI.
       */
      setActiveDeviceId: (deviceId) => set({ activeDeviceId: deviceId }),

      /**
       * @description Memperbarui data status dinamis dari sebuah perangkat (mis. dari MQTT).
       */
      updateDeviceStatus: (deviceId, status) => set(state => {
        const device = state.devices[deviceId];
        if (!device) return state;
        const updatedDevice = { ...device, ...status };
        return { devices: { ...state.devices, [deviceId]: updatedDevice } };
      }),

      /**
       * @description Memperbarui state dari sebuah relay tunggal pada perangkat tertentu.
       */
      updateRelayState: (deviceId, relayId, partialState) => set(state => {
        const device = state.devices[deviceId];
        if (!device || !device.relays[relayId]) return state;

        const updatedRelays = [...device.relays];
        updatedRelays[relayId] = { ...updatedRelays[relayId], ...partialState };

        const updatedDevice = { ...device, relays: updatedRelays };
        return { devices: { ...state.devices, [deviceId]: updatedDevice } };
      }),

      /**
       * @description Memperbarui nama perangkat (friendly name).
       */
      updateDeviceName: (deviceId, newName) => set(state => {
        const device = state.devices[deviceId];
        if (!device) return state;
        const updatedDevice = { ...device, name: newName };
        return { devices: { ...state.devices, [deviceId]: updatedDevice } };
      }),

      /**
       * @description Memperbarui nama relay pada perangkat tertentu.
       */
      updateRelayName: (deviceId, relayId, newName) => set(state => {
        const device = state.devices[deviceId];
        if (!device || !device.relays[relayId]) return state;

        const updatedRelays = [...device.relays];
        updatedRelays[relayId] = { ...updatedRelays[relayId], name: newName };

        const updatedDevice = { ...device, relays: updatedRelays };
        return { devices: { ...state.devices, [deviceId]: updatedDevice } };
      }),
    }),
    {
      name: 'esp-device-storage', // Nama key di localStorage
    }
  )
);
