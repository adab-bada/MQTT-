import { create } from 'zustand';
import mqtt, { MqttClient } from 'mqtt';
import { MqttConfig } from '../types';
import { useDeviceStore } from './useDeviceStore';

// Tipe untuk status koneksi MQTT
type MqttStatus = 'connecting' | 'connected' | 'reconnecting' | 'closed' | 'error';

// Tipe untuk state MQTT
type MqttState = {
  client: MqttClient | null;
  status: MqttStatus;
  error: string | null;
  config: MqttConfig | null;

  // Aksi-aksi untuk mengelola koneksi
  connect: (config: MqttConfig) => void;
  disconnect: () => void;
  publish: (topic: string, message: string) => void;
};

/**
 * @description Store Zustand untuk mengelola koneksi dan komunikasi MQTT.
 */
export const useMqttStore = create<MqttState>((set, get) => ({
  // State awal
  client: null,
  status: 'closed',
  error: null,
  config: null,

  /**
   * @description Membuat koneksi ke broker MQTT menggunakan konfigurasi yang diberikan.
   */
  connect: (config) => {
    // Putuskan koneksi lama jika ada
    get().disconnect();

    set({ status: 'connecting', config, error: null });

    const brokerUrl = `${config.brokerUrl}:${config.port}`;
    const client = mqtt.connect(brokerUrl, {
      username: config.username,
      password: config.password,
      reconnectPeriod: 5000, // Coba konek ulang setiap 5 detik
      connectTimeout: 10000, // Timeout koneksi 10 detik
    });

    set({ client });

    client.on('connect', () => {
      set({ status: 'connected', error: null });
      console.log('MQTT terhubung!');
      // Subscribe ke topik yang relevan untuk semua perangkat yang ada
      const { devices } = useDeviceStore.getState();
      Object.values(devices).forEach(device => {
        client.subscribe(`relay/${device.deviceId}/status`, (err) => {
          if (err) console.error(`Gagal subscribe ke status ${device.deviceId}:`, err);
        });
      });
    });

    client.on('reconnect', () => {
      set({ status: 'reconnecting' });
      console.log('Mencoba menghubungkan ulang MQTT...');
    });

    client.on('close', () => {
      set({ status: 'closed' });
      console.log('Koneksi MQTT ditutup.');
    });

    client.on('error', (err) => {
      set({ status: 'error', error: err.message });
      console.error('Kesalahan MQTT:', err);
      client.end(true); // Tutup koneksi secara paksa jika ada error
    });

    client.on('message', (topic, payload) => {
      const message = payload.toString();
      console.log(`Pesan diterima [${topic}]: ${message}`);

      // Logika untuk memproses pesan dan memperbarui device store
      const topicParts = topic.split('/');
      if (topicParts.length === 3 && topicParts[0] === 'relay' && topicParts[2] === 'status') {
        const deviceId = topicParts[1];
        try {
          const statusData = JSON.parse(message);
          // Update status relay
          for (let i = 0; i < 4; i++) {
            const key = `output${i}`;
            if (statusData[key] !== undefined) {
              useDeviceStore.getState().updateRelayState(deviceId, i, { isOn: statusData[key] === '1' });
            }
          }
          // Update status perangkat lainnya jika ada
          useDeviceStore.getState().updateDeviceStatus(deviceId, {
            isMqttConnected: statusData.mqtt,
            freeRam: statusData.freeRam,
          });
        } catch (e) {
          console.error('Gagal mem-parsing pesan status JSON:', e);
        }
      }
    });
  },

  /**
   * @description Memutuskan koneksi dari broker MQTT.
   */
  disconnect: () => {
    const { client } = get();
    if (client) {
      client.end(true, () => {
        set({ client: null, status: 'closed', config: null });
        console.log('Koneksi MQTT berhasil diputus.');
      });
    }
  },

  /**
   * @description Mempublikasikan pesan ke topik MQTT tertentu.
   */
  publish: (topic, message) => {
    const { client } = get();
    if (client && client.connected) {
      client.publish(topic, message, (err) => {
        if (err) {
          console.error('Gagal mempublikasikan pesan:', err);
        } else {
          console.log(`Pesan terkirim [${topic}]: ${message}`);
        }
      });
    } else {
      console.error('Tidak dapat mempublikasikan, MQTT tidak terhubung.');
    }
  },
}));
