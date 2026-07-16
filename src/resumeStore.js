import { create } from 'zustand';

export const useResumeStore = create((set) => ({
  open: false,
  openResume: () => set({ open: true }),
  closeResume: () => set({ open: false })
}));
