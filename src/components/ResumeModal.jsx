import { useEffect } from 'react';

import { RESUME } from '../data/resume';
import { useT } from '../i18n';
import { useResumeStore } from '../resumeStore';

export function ResumeModal() {
  const open = useResumeStore((s) => s.open);
  const closeResume = useResumeStore((s) => s.closeResume);
  const t = useT();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeResume();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, closeResume]);

  if (!open) return null;

  return (
    <div className="resume-overlay" onClick={closeResume}>
      <div className="resume-card" onClick={(event) => event.stopPropagation()}>
        <button
          className="resume-close"
          onClick={closeResume}
          aria-label={t('modal.close')}
        >
          ✕
        </button>

        <div className="resume-header">
          <h1>{RESUME.name}</h1>
          <p className="resume-role">{RESUME.role}</p>
          <p className="resume-contact">
            {RESUME.contact.address} · {RESUME.contact.phone} ·{' '}
            {RESUME.contact.email}
          </p>
        </div>

        <section className="resume-section">
          <h2>{t('modal.about')}</h2>
          <p className="resume-about">{RESUME.about}</p>
        </section>

        <section className="resume-section">
          <h2>{t('modal.experience')}</h2>
          {RESUME.experience.map((entry) => (
            <div className="resume-entry" key={entry.org + entry.title}>
              <div className="resume-entry-head">
                <span className="resume-entry-title">
                  {entry.org} — {entry.title}
                </span>
                <span className="resume-entry-period">{entry.period}</span>
              </div>
              <ul className="resume-bullets">
                {entry.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="resume-section">
          <h2>{t('modal.education')}</h2>
          <div className="resume-entry">
            <div className="resume-entry-head">
              <span className="resume-entry-title">{RESUME.education.school}</span>
              <span className="resume-entry-period">
                {RESUME.education.graduation}
              </span>
            </div>
            <div className="resume-tags">
              {RESUME.education.coursework.map((course) => (
                <span className="resume-tag" key={course}>
                  {course}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="resume-section">
          <h2>{t('modal.skills')}</h2>
          <div className="resume-skills">
            {RESUME.skills.map((skill) => (
              <div className="resume-skill" key={skill.name}>
                <span className="resume-skill-name">{skill.name}</span>
                <span className="resume-skill-detail">{skill.detail}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="resume-section">
          <h2>{t('modal.awards')}</h2>
          <ul className="resume-bullets">
            {RESUME.awards.map((award) => (
              <li key={award}>{award}</li>
            ))}
          </ul>
        </section>

        <p className="resume-footer">{t('modal.footer')}</p>
      </div>
    </div>
  );
}
