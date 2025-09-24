import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useUiStore } from '../../stores/useUiStore';
import { useDeviceStore } from '../../stores/useDeviceStore';
import { useMqttStore } from '../../stores/useMqttStore';
import { AlertTriangle } from 'lucide-react';

// Definisikan tipe untuk schedule agar sesuai dengan firmware
interface Schedule {
  enabled: boolean;
  hour: number;
  minute: number;
  days: number; // bitmask
  action: boolean; // true=ON, false=OFF
}

interface RelayTimer {
  enabled: boolean;
  schedules: Schedule[];
}

const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const dayValues = [1, 2, 4, 8, 16, 32, 64]; // Sun=1, Mon=2, ...

/**
 * @description Sub-komponen untuk mengedit satu jadwal
 */
const ScheduleEditor: React.FC<{ schedule: Schedule, onChange: (newSchedule: Schedule) => void }> = ({ schedule, onChange }) => {
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hour, minute] = e.target.value.split(':').map(Number);
    onChange({ ...schedule, hour, minute });
  };

  const handleDayChange = (dayValue: number) => {
    const newDays = schedule.days ^ dayValue; // XOR untuk toggle bit
    onChange({ ...schedule, days: newDays });
  };

  const timeValue = `${String(schedule.hour).padStart(2, '0')}:${String(schedule.minute).padStart(2, '0')}`;

  return (
    <div className="p-3 bg-light-bg dark:bg-dark-bg rounded-md space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={schedule.enabled}
            onChange={e => onChange({ ...schedule, enabled: e.target.checked })}
            className="h-4 w-4 rounded"
          />
          <span className="font-medium">Aktifkan Jadwal</span>
        </label>
      </div>
      <div className={`space-y-3 ${!schedule.enabled ? 'opacity-50' : ''}`}>
        <div className="flex items-center space-x-4">
          <input type="time" value={timeValue} onChange={handleTimeChange} className="p-1 rounded-md border-gray-300 dark:bg-gray-700" disabled={!schedule.enabled} />
          <select value={schedule.action ? '1' : '0'} onChange={e => onChange({ ...schedule, action: e.target.value === '1' })} className="p-1 rounded-md border-gray-300 dark:bg-gray-700" disabled={!schedule.enabled}>
            <option value="1">NYALA</option>
            <option value="0">MATI</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          {dayNames.map((day, index) => (
            <label key={day} className="flex items-center space-x-1 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={(schedule.days & dayValues[index]) > 0}
                onChange={() => handleDayChange(dayValues[index])}
                disabled={!schedule.enabled}
              />
              <span>{day}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};


/**
 * @description Modal untuk mengedit pengaturan timer untuk semua relay pada perangkat.
 */
const TimerSettingsModal: React.FC = () => {
  const { isTimerSettingsModalOpen, closeTimerSettingsModal } = useUiStore();
  const { activeDeviceId, devices } = useDeviceStore();
  const { publish } = useMqttStore();
  const device = activeDeviceId ? devices[activeDeviceId] : null;

  const [timers, setTimers] = useState<RelayTimer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Inisialisasi state form dari data perangkat
  useEffect(() => {
    if (device) {
      // Firmware tidak menyediakan data timer, jadi kita buat struktur default
      const initialTimers = Array(4).fill(null).map(() => ({
        enabled: false,
        schedules: Array(3).fill(null).map(() => ({
          enabled: false, hour: 12, minute: 0, days: 0, action: true
        }))
      }));
      setTimers(initialTimers);
    }
  }, [device, isTimerSettingsModalOpen]);

  const handleTimerChange = (relayIndex: number, newTimer: RelayTimer) => {
    const newTimers = [...timers];
    newTimers[relayIndex] = newTimer;
    setTimers(newTimers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!device) return;
    setIsLoading(true);

    timers.forEach((timer, index) => {
      const payload = {
        relayId: index,
        enabled: timer.enabled,
        schedules: timer.schedules,
      };
      const topic = `relay/${device.deviceId}/timer/set`;
      publish(topic, JSON.stringify(payload));
    });

    setIsLoading(false);
    alert('Pengaturan timer telah dikirim ke perangkat!');
    closeTimerSettingsModal();
  };

  if (!device) return null;

  return (
    <Modal isOpen={isTimerSettingsModalOpen} onClose={closeTimerSettingsModal} title={`Pengaturan Timer - ${device.name}`}>
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-200 p-4 rounded-md" role="alert">
          <div className="flex">
            <div className="py-1"><AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" /></div>
            <div>
              <p className="font-bold">Perhatian</p>
              <p className="text-sm">Pengaturan timer saat ini tidak dapat dibaca dari perangkat. Form ini dimulai dari awal. Menyimpan akan menimpa semua jadwal yang ada di perangkat.</p>
            </div>
          </div>
        </div>

        {timers.map((timer, relayIndex) => (
          <div key={relayIndex} className="p-4 border rounded-lg">
            <h3 className="font-bold text-lg mb-3">{device.relays[relayIndex].name || `Relay ${relayIndex + 1}`}</h3>
            <label className="flex items-center space-x-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={timer.enabled}
                onChange={e => handleTimerChange(relayIndex, { ...timer, enabled: e.target.checked })}
                className="h-5 w-5"
              />
              <span className="font-semibold">Aktifkan Timer untuk Relay ini</span>
            </label>
            <div className={`space-y-3 ${!timer.enabled ? 'opacity-50' : ''}`}>
              {timer.schedules.map((schedule, schedIndex) => (
                <ScheduleEditor
                  key={schedIndex}
                  schedule={schedule}
                  onChange={(newSchedule) => {
                    const newSchedules = [...timer.schedules];
                    newSchedules[schedIndex] = newSchedule;
                    handleTimerChange(relayIndex, { ...timer, schedules: newSchedules });
                  }}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="mt-8 sticky bottom-0 bg-light-card dark:bg-dark-card py-4">
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : 'Simpan Semua Timer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TimerSettingsModal;
