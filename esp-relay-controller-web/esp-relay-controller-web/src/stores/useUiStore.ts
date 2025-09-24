import { create } from 'zustand';

// Tipe untuk state UI
type UiState = {
  theme: 'light' | 'dark';
  isMqttSettingsModalOpen: boolean;
  isAddDeviceModalOpen: boolean;
  isDeviceSettingsModalOpen: boolean;
  isTimerSettingsModalOpen: boolean;
  isSidebarOpen: boolean; // Untuk sidebar di mode mobile

  // Aksi-aksi untuk mengubah state
  toggleTheme: () => void;
  openMqttSettingsModal: () => void;
  closeMqttSettingsModal: () => void;
  openAddDeviceModal: () => void;
  closeAddDeviceModal: () => void;
  openDeviceSettingsModal: () => void;
  closeDeviceSettingsModal: () => void;
  openTimerSettingsModal: () => void;
  closeTimerSettingsModal: () => void;
  toggleSidebar: () => void;
  initializeTheme: () => void;
};

/**
 * @description Store Zustand untuk mengelola state antarmuka pengguna (UI).
 * Termasuk tema (gelap/terang) dan status visibilitas modal.
 */
export const useUiStore = create<UiState>((set, get) => ({
  // State awal
  theme: 'light',
  isMqttSettingsModalOpen: false,
  isAddDeviceModalOpen: false,
  isDeviceSettingsModalOpen: false,
  isTimerSettingsModalOpen: false,
  isSidebarOpen: false,

  /**
   * @description Mengganti tema antara 'light' dan 'dark' dan menyimpannya di localStorage.
   */
  toggleTheme: () => set(state => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: newTheme };
  }),

  /**
   * @description Membuka modal untuk pengaturan MQTT.
   */
  openMqttSettingsModal: () => set({ isMqttSettingsModalOpen: true }),

  /**
   * @description Menutup modal untuk pengaturan MQTT.
   */
  closeMqttSettingsModal: () => set({ isMqttSettingsModalOpen: false }),

  /**
   * @description Membuka modal untuk menambah perangkat baru.
   */
  openAddDeviceModal: () => set({ isAddDeviceModalOpen: true }),

  /**
   * @description Menutup modal untuk menambah perangkat baru.
   */
  closeAddDeviceModal: () => set({ isAddDeviceModalOpen: false }),

  /**
   * @description Membuka modal untuk pengaturan perangkat.
   */
  openDeviceSettingsModal: () => set({ isDeviceSettingsModalOpen: true }),

  /**
   * @description Menutup modal untuk pengaturan perangkat.
   */
  closeDeviceSettingsModal: () => set({ isDeviceSettingsModalOpen: false }),

  /**
   * @description Membuka modal untuk pengaturan timer.
   */
  openTimerSettingsModal: () => set({ isTimerSettingsModalOpen: true }),

  /**
   * @description Menutup modal untuk pengaturan timer.
   */
  closeTimerSettingsModal: () => set({ isTimerSettingsModalOpen: false }),

  /**
   * @description Toggle visibilitas sidebar di mode mobile.
   */
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),

  /**
   * @description Menginisialisasi tema dari localStorage atau preferensi sistem.
   */
  initializeTheme: () => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme: initialTheme });
  }
}));
