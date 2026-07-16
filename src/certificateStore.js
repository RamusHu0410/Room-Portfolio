import { create } from 'zustand';

export const useCertificateStore = create((set) => ({
  open: false,
  openCertificates: () => set({ open: true }),
  closeCertificates: () => set({ open: false })
}));
