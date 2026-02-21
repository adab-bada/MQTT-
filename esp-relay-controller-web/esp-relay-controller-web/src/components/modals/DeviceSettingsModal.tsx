import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useUiStore } from '../../stores/useUiStore';
import { useDeviceStore } from '../../stores/useDeviceStore';
import { AlertTriangle } from 'lucide-react';

/**
 * @description Modal untuk mengedit pengaturan perangkat seperti nama dan pin relay.
 * Komunikasi dilakukan melalui HTTP POST ke endpoint /quickedit di perangkat.
 */
const DeviceSettingsModal: React.FC = () => {
  // State dari store
  const { isDeviceSettingsModalOpen, closeDeviceSettingsModal } = useUiStore();
  const { activeDeviceId, devices, updateDeviceName, updateRelayName } = useDeviceStore();
  const device = activeDeviceId ? devices[activeDeviceId] : null;

  // State lokal untuk form
  const [deviceName, setDeviceName] = useState('');
  const [relaySettings, setRelaySettings] = useState<{ name: string; pin: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Inisialisasi form saat perangkat aktif berubah atau modal dibuka
  useEffect(() => {
    if (device) {
      setDeviceName(device.name);
      setRelaySettings(device.relays.map(r => ({ name: r.name, pin: r.pin })));
      setError(null);
      setSuccessMessage(null);
    }
  }, [device, isDeviceSettingsModalOpen]);

  // Handler untuk perubahan nama relay
  const handleRelayChange = (index: number, field: 'name' | 'pin', value: string | number) => {
    const newSettings = [...relaySettings];
    if (field === 'name') {
      newSettings[index].name = value as string;
    } else {
      newSettings[index].pin = value as number;
    }
    setRelaySettings(newSettings);
  };

  // Handler untuk submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!device) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    let pinChanged = false;

    try {
      // 1. Update nama perangkat
      if (deviceName !== device.name) {
        const deviceNameBody = new URLSearchParams();
        deviceNameBody.append('type', 'device');
        deviceNameBody.append('name', deviceName);

        const resDevice = await fetch(`http://${device.ipAddress}/quickedit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: deviceNameBody,
        });
        if (!resDevice.ok || !(await resDevice.json()).success) throw new Error('Gagal memperbarui nama perangkat.');
        updateDeviceName(device.deviceId, deviceName);
      }

      // 2. Update setiap relay
      for (let i = 0; i < relaySettings.length; i++) {
        const oldRelay = device.relays[i];
        const newRelay = relaySettings[i];
        if (oldRelay.name !== newRelay.name || oldRelay.pin !== newRelay.pin) {
          if (oldRelay.pin !== newRelay.pin) pinChanged = true;

          const relayBody = new URLSearchParams();
          relayBody.append('type', 'switch');
          relayBody.append('id', String(i));
          relayBody.append('name', newRelay.name);
          relayBody.append('pin', String(newRelay.pin));
          relayBody.append('currentPin', String(oldRelay.pin));

          const resRelay = await fetch(`http://${device.ipAddress}/quickedit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: relayBody,
          });
          if (!resRelay.ok || !(await resRelay.json()).success) throw new Error(`Gagal memperbarui Relay ${i + 1}.`);
          updateRelayName(device.deviceId, i, newRelay.name);
        }
      }

      let message = 'Pengaturan berhasil disimpan!';
      if (pinChanged) {
        message += ' Pin GPIO diubah, perangkat akan restart. Harap tunggu sebentar.';
      }
      setSuccessMessage(message);

      setTimeout(() => {
        closeDeviceSettingsModal();
      }, pinChanged ? 4000 : 2000);

    } catch (err: any) {
      setError(err.message || 'Koneksi ke perangkat gagal. Pastikan Anda berada di jaringan lokal yang sama.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!device) return null;

  return (
    <Modal isOpen={isDeviceSettingsModalOpen} onClose={closeDeviceSettingsModal} title={`Pengaturan - ${device.name}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nama Perangkat"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          required
        />

        <div className="space-y-4">
          <h3 className="font-semibold border-b pb-2">Pengaturan Relay</h3>
          {relaySettings.map((relay, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 items-end">
              <Input
                label={`Nama Relay ${index + 1}`}
                value={relay.name}
                onChange={(e) => handleRelayChange(index, 'name', e.target.value)}
              />
              <div className="relative">
                <Input
                  label="GPIO Pin"
                  type="number"
                  value={relay.pin}
                  onChange={(e) => handleRelayChange(index, 'pin', parseInt(e.target.value))}
                />
                {device.relays[index].pin !== relay.pin && (
                   <span title="Mengubah pin akan me-restart perangkat" className="absolute top-0 right-0 mt-1 mr-1">
                     <AlertTriangle size={16} className="text-yellow-500" />
                   </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm" role="alert">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm" role="alert">
            <span>{successMessage}</span>
          </div>
        )}

        <div className="mt-8">
          <Button type="submit" isLoading={isLoading} disabled={isLoading || !!successMessage}>
            {isLoading ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DeviceSettingsModal;
