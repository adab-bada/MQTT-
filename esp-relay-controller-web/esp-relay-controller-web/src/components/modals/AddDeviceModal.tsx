import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useUiStore } from '../../stores/useUiStore';
import { useDeviceStore } from '../../stores/useDeviceStore';
import { Device, RelayState } from '../../types';
import { Network } from 'lucide-react';

/**
 * @description Modal untuk menambahkan perangkat baru berdasarkan alamat IP-nya.
 */
const AddDeviceModal: React.FC = () => {
  // State dari store
  const { isAddDeviceModalOpen, closeAddDeviceModal } = useUiStore();
  const { addDevice } = useDeviceStore();

  // State lokal untuk form
  const [ipAddress, setIpAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handler untuk submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Langkah 1: Fetch informasi dasar dari /device-info
      const deviceInfoRes = await fetch(`http://${ipAddress}/device-info`);
      if (!deviceInfoRes.ok) {
        throw new Error('Gagal menghubungi perangkat. Pastikan IP benar dan perangkat terhubung.');
      }
      const deviceInfo = await deviceInfoRes.json();
      if (!deviceInfo.deviceId || !deviceInfo.name || !deviceInfo.relayCount) {
        throw new Error('Respons /device-info dari perangkat tidak valid.');
      }

      // Langkah 2: Fetch status detail dari /status untuk pin dan state awal
      const statusRes = await fetch(`http://${ipAddress}/status`);
      if (!statusRes.ok) {
        throw new Error('Gagal mengambil status detail dari perangkat.');
      }
      const statusInfo = await statusRes.json();

      // Membuat objek relay berdasarkan data dari /status
      const relays: RelayState[] = [];
      for (let i = 0; i < deviceInfo.relayCount; i++) {
        relays.push({
          id: i,
          name: `Relay ${i + 1}`, // Nama default, karena tidak disediakan oleh API
          isOn: statusInfo[`output${i}`] === '1',
          pin: statusInfo[`pin${i}`] || 0,
        });
      }

      // Membuat objek perangkat baru
      const newDevice: Device = {
        deviceId: deviceInfo.deviceId,
        name: deviceInfo.name,
        ipAddress: ipAddress,
        isMqttConnected: statusInfo.mqtt || false,
        relays: relays,
        rssi: statusInfo.rssi,
        freeRam: statusInfo.freeRam,
        uptime: statusInfo.uptime,
      };

      // Menambahkan perangkat ke store
      addDevice(newDevice);

      // Reset form dan tutup modal
      setIpAddress('');
      closeAddDeviceModal();

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan yang tidak diketahui.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isAddDeviceModalOpen} onClose={closeAddDeviceModal} title="Tambah Perangkat Baru">
      <form onSubmit={handleSubmit}>
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
          Masukkan alamat IP lokal dari perangkat ESP8266 Anda. Aplikasi akan mencoba mengambil konfigurasinya secara otomatis.
        </p>
        <Input
          label="Alamat IP Perangkat"
          name="ipAddress"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          placeholder="contoh: 192.168.1.10"
          icon={<Network size={16} className="text-gray-400" />}
          required
        />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6">
          <Button type="submit" isLoading={isLoading} disabled={isLoading || !ipAddress}>
            {isLoading ? 'Mencari...' : 'Tambah Perangkat'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDeviceModal;
