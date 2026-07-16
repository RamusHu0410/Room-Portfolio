import { create } from 'zustand';

export const useVideoStore = create((set) => ({
  open: false,
  openVideo: () => set({ open: true }),
  closeVideo: () => set({ open: false })
}));
