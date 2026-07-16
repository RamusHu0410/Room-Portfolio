import { create } from 'zustand';

export const useLanguageStore = create((set) => ({
  lang: 'en',
  setLang: (lang) => set({ lang }),
  toggleLang: () =>
    set((s) => ({ lang: s.lang === 'en' ? 'zh' : 'en' }))
}));
