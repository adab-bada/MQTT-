import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useUiStore } from '../../stores/useUiStore';
import { useMqttStore } from '../../stores/useMqttStore';
import { MqttConfig } from '../../types';
import { Globe, Key, User, Server } from 'lucide-react';

/**
 * @description Modal untuk mengonfigurasi dan terhubung ke broker MQTT.
 */
const MqttSettingsModal: React.FC = () => {
  // State dari store
  const { isMqttSettingsModalOpen, closeMqttSettingsModal } = useUiStore();
  const { connect, disconnect, status, config: currentConfig } = useMqttStore();

  // State lokal untuk form
  const [config, setConfig] = useState<MqttConfig>({
    brokerUrl: 'wss://broker.hivemq.com',
    port: 8884,
    username: '',
    password: ''
  });

  // Isi form dengan konfigurasi saat ini jika ada
  useEffect(() => {
    if (currentConfig) {
      setConfig(currentConfig);
    }
  }, [currentConfig]);

  // Handler untuk perubahan input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: name === 'port' ? parseInt(value) || 0 : value }));
  };

  // Handler untuk submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    connect(config);
    closeMqttSettingsModal();
  };

  const isConnecting = status === 'connecting' || status === 'reconnecting';
  const isConnected = status === 'connected';

  return (
    <Modal isOpen={isMqttSettingsModalOpen} onClose={closeMqttSettingsModal} title="Pengaturan Broker MQTT">
      <form onSubmit={handleSubmit}>
        <Input
          label="URL Broker"
          name="brokerUrl"
          value={config.brokerUrl}
          onChange={handleChange}
          placeholder="contoh: wss://broker.hivemq.com"
          icon={<Globe size={16} className="text-gray-400" />}
          required
        />
        <Input
          label="Port"
          name="port"
          type="number"
          value={config.port}
          onChange={handleChange}
          placeholder="contoh: 8884"
          icon={<Server size={16} className="text-gray-400" />}
          required
        />
        <Input
          label="Username (Opsional)"
          name="username"
          value={config.username}
          onChange={handleChange}
          placeholder="Username MQTT Anda"
          icon={<User size={16} className="text-gray-400" />}
        />
        <Input
          label="Password (Opsional)"
          name="password"
          type="password"
          value={config.password}
          onChange={handleChange}
          placeholder="Password MQTT Anda"
          icon={<Key size={16} className="text-gray-400" />}
        />

        <div className="mt-6 flex flex-col space-y-2">
          <Button type="submit" isLoading={isConnecting} disabled={isConnecting}>
            {isConnecting ? 'Menghubungkan...' : 'Simpan & Hubungkan'}
          </Button>
          {isConnected && (
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                disconnect();
                closeMqttSettingsModal();
              }}
            >
              Putuskan Koneksi
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default MqttSettingsModal;
