import { useState } from 'react';

import { useT } from '../i18n';
import { useLanguageStore } from '../languageStore';
import { useSettingsStore } from '../settingsStore';

export function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const t = useT();
  const invertX = useSettingsStore((s) => s.invertX);
  const invertY = useSettingsStore((s) => s.invertY);
  const toggleInvertX = useSettingsStore((s) => s.toggleInvertX);
  const toggleInvertY = useSettingsStore((s) => s.toggleInvertY);
  const lang = useLanguageStore((s) => s.lang);
  const setLang = useLanguageStore((s) => s.setLang);

  return (
    <div className="settings">
      <button
        className="settings-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span aria-hidden="true">⚙</span> {t('settings.toggle')}
      </button>
      {open && (
        <div className="settings-panel">
          <div className="settings-title">{t('settings.language')}</div>
          <div className="settings-lang-row">
            <button
              className={`settings-lang-option ${lang === 'en' ? 'settings-lang-active' : ''}`}
              onClick={() => setLang('en')}
            >
              {t('settings.langEnglish')}
            </button>
            <button
              className={`settings-lang-option ${lang === 'zh' ? 'settings-lang-active' : ''}`}
              onClick={() => setLang('zh')}
            >
              {t('settings.langChinese')}
            </button>
          </div>

          <div className="settings-title">{t('settings.dragTitle')}</div>
          <label className="settings-row">
            <input type="checkbox" checked={invertX} onChange={toggleInvertX} />
            {t('settings.invertX')}
          </label>
          <label className="settings-row">
            <input type="checkbox" checked={invertY} onChange={toggleInvertY} />
            {t('settings.invertY')}
          </label>
        </div>
      )}
    </div>
  );
}
