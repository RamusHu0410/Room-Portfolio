import { create } from 'zustand';

export const useSettingsStore = create((set) => ({
  invertX: false,
  invertY: false,
  toggleInvertX: () => set((s) => ({ invertX: !s.invertX })),
  toggleInvertY: () => set((s) => ({ invertY: !s.invertY }))
}));
