import { useT } from '../i18n';

export function Hud() {
  const t = useT();

  return (
    <div className="hud">
      <div className="hud-title">{t('hud.title')}</div>
      <div className="hud-hint">{t('hud.hint')}</div>
    </div>
  );
}
