import { useEffect } from 'react';

import { PERFORMANCE_VIDEO_ID } from '../data/projects';
import { useT } from '../i18n';
import { useVideoStore } from '../videoStore';

export function VideoModal() {
  const open = useVideoStore((s) => s.open);
  const closeVideo = useVideoStore((s) => s.closeVideo);
  const t = useT();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeVideo();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, closeVideo]);

  if (!open) return null;

  const watchUrl = `https://www.youtube.com/watch?v=${PERFORMANCE_VIDEO_ID}`;

  return (
    <div className="resume-overlay" onClick={closeVideo}>
      <div
        className="resume-card video-card"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="resume-close"
          onClick={closeVideo}
          aria-label={t('modal.close')}
        >
          ✕
        </button>

        <div className="resume-header">
          <h1>{t('video.title')}</h1>
          <p className="resume-role">{t('video.subtitle')}</p>
        </div>

        <div className="video-frame">
          {open && (
            <iframe
              src={`https://www.youtube.com/embed/${PERFORMANCE_VIDEO_ID}`}
              title={t('video.title')}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        <a
          className="screen-link video-link"
          href={watchUrl}
          target="_blank"
          rel="noreferrer"
        >
          {t('video.watchOnYoutube')}
        </a>
      </div>
    </div>
  );
}
