import { create } from 'zustand';

export const useLightingStore = create((set) => ({
  isNight: true,
  toggleNight: () => set((s) => ({ isNight: !s.isNight }))
}));
