import { useEffect } from 'react';

import { useT } from '../i18n';
import { useViewStore } from '../viewStore';

export function ComputerScreen() {
  const sitting = useViewStore((s) => s.sitting);
  const stand = useViewStore((s) => s.stand);
  const t = useT();

  useEffect(() => {
    if (!sitting) return;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') stand();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sitting, stand]);

  if (!sitting) return null;

  return (
    <button className="sit-exit" onClick={stand}>
      {t('exit.standUp')}
    </button>
  );
}
