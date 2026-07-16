import { useEffect } from 'react';

import { useCertificateStore } from '../certificateStore';
import { RESUME } from '../data/resume';
import { useT } from '../i18n';

export function AwardsModal() {
  const open = useCertificateStore((s) => s.open);
  const closeCertificates = useCertificateStore((s) => s.closeCertificates);
  const t = useT();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeCertificates();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, closeCertificates]);

  if (!open) return null;

  return (
    <div className="resume-overlay" onClick={closeCertificates}>
      <div
        className="resume-card resume-card-narrow"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="resume-close"
          onClick={closeCertificates}
          aria-label={t('modal.close')}
        >
          ✕
        </button>

        <div className="resume-header">
          <h1>{t('awards.title')}</h1>
          <p className="resume-role">{t('awards.subtitle')}</p>
        </div>

        <ul className="resume-award-list">
          {RESUME.awards.map((award) => (
            <li key={award}>{award}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
