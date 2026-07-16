import { create } from 'zustand';

export const useViewStore = create((set) => ({
  sitting: false,
  screenAnchor: null,
  sit: () => set({ sitting: true }),
  stand: () => set({ sitting: false }),
  setScreenAnchor: (anchor) => set({ screenAnchor: anchor })
}));
