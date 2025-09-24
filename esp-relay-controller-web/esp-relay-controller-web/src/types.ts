// File ini berisi semua definisi tipe data TypeScript yang digunakan di seluruh aplikasi.
// Menggunakan tipe yang terpusat membantu menjaga konsistensi data.

/**
 * @description Representasi state dari sebuah relay tunggal.
 */
export interface RelayState {
  id: number; // Nomor relay (misalnya, 0-3)
  name: string; // Nama kustom untuk relay
  isOn: boolean; // Status relay (true untuk ON, false untuk OFF)
  pin: number; // GPIO pin yang digunakan oleh relay
}

/**
 * @description Representasi sebuah perangkat ESP8266 yang dikontrol.
 */
export interface Device {
  // Informasi yang didapat dari endpoint /device-info atau pesan status
  deviceId: string; // ID unik perangkat, biasanya dari MAC address
  name: string; // Nama yang mudah diingat (friendly name)
  ipAddress: string; // Alamat IP lokal perangkat

  // State dinamis yang didapat dari MQTT
  isMqttConnected: boolean; // Status koneksi MQTT dari perangkat
  rssi?: number; // Kekuatan sinyal WiFi
  freeRam?: number; // Sisa RAM pada perangkat
  uptime?: number; // Waktu hidup perangkat dalam milidetik

  // Array dari state relay yang dimiliki perangkat ini
  relays: RelayState[];
}

/**
 * @description Konfigurasi untuk koneksi ke broker MQTT.
 */
export interface MqttConfig {
  brokerUrl: string;
  port: number;
  username?: string;
  password?: string;
}
