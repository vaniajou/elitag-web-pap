import { useState } from 'react';
import { Badge, Button, Skeleton } from '../components/atoms';
import { EmptyState, ErrorState, PageHeader } from '../components/molecules';
import { AppLayoutTemplate } from '../components/templates';
import {
  MOCK_COURSE_CATALOG,
  MOCK_MATERIAL_DETAILS,
} from '../data/mockElitagData';
import './MaterialPage.css';

function PlayIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <polygon points="7 4 20 12 7 20 7 4" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function FileDocIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function MaterialPage({
  course,
  material,
  isCompleted = false,
  logoSrc = '',
  onNavigate,
  onBack,
  onToggleComplete,
}) {
  const [viewState, setViewState] = useState('normal'); // 'normal' | 'loading' | 'empty' | 'error'
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [statusNotice, setStatusNotice] = useState('');

  const activeCourse = course || MOCK_COURSE_CATALOG[0];
  const materialLookup =
    MOCK_MATERIAL_DETAILS[material?.id] || MOCK_MATERIAL_DETAILS.default;

  const activeMaterial = {
    ...materialLookup,
    id: material?.id || materialLookup.id,
    title:
      material?.id && MOCK_MATERIAL_DETAILS[material.id]
        ? materialLookup.title
        : material?.title || materialLookup.title,
  };

  function handleRetry() {
    setViewState('loading');
    window.setTimeout(() => {
      setViewState('normal');
    }, 600);
  }

  function handleDownload(file) {
    setStatusNotice(`Mengunduh berkas "${file.fileName}" (${file.fileSize})...`);
  }

  function handleToggleDone() {
    onToggleComplete?.(activeMaterial.id);
    setStatusNotice(
      isCompleted
        ? 'Status penyelesaian materi dikembalikan ke belum selesai.'
        : 'Materi berhasil ditandai selesai. Progres belajar diperbarui.'
    );
  }

  return (
    <AppLayoutTemplate
      activeNav="beranda"
      onNavigate={onNavigate}
      logoSrc={logoSrc}
    >
      <div className="page-material">
        <PageHeader
          title={activeMaterial.title}
          backLabel="Kembali ke Halaman Kelas"
          onBack={onBack}
        />

        {viewState === 'loading' && (
          <div
            className="page-material__skeleton-wrap"
            aria-busy="true"
            aria-label="Memuat materi pertemuan"
          >
            <Skeleton variant="rect" width="100%" height="220px" />
            <div className="page-material__card">
              <Skeleton variant="text" width="35%" height="20px" />
              <Skeleton variant="text" width="100%" height="16px" />
              <Skeleton variant="text" width="92%" height="16px" />
              <Skeleton variant="text" width="70%" height="16px" />
            </div>
            <Skeleton variant="rect" width="100%" height="72px" />
          </div>
        )}

        {viewState === 'error' && (
          <ErrorState
            title="Materi Pertemuan Gagal Dimuat"
            description="Periksa koneksi internet Anda lalu muat ulang halaman materi ini."
            actionLabel="Coba Lagi"
            onRetry={handleRetry}
          />
        )}

        {viewState === 'empty' && (
          <EmptyState
            title="Materi Belum Tersedia"
            description="Dosen pengampu belum mengunggah video atau modul bacaan untuk pertemuan ini."
            actionLabel="Kembali ke Halaman Kelas"
            onAction={onBack}
          />
        )}

        {viewState === 'normal' && (
          <div className="page-material__layout">
            {/* Kolom Utama: Video, Ringkasan Bacaan, dan Poin Penting */}
            <div className="page-material__main">
              <section
                className="page-material__video-card"
                aria-label="Pemutar video materi"
              >
                <div
                  className={`page-material__video-stage ${
                    isPlayingVideo ? 'page-material__video-stage--playing' : ''
                  }`}
                >
                  <button
                    type="button"
                    className="page-material__play-btn"
                    aria-label={
                      isPlayingVideo
                        ? 'Jeda video pembelajaran'
                        : 'Putar video pembelajaran'
                    }
                    aria-pressed={isPlayingVideo}
                    onClick={() => setIsPlayingVideo((prev) => !prev)}
                  >
                    {isPlayingVideo ? <PauseIcon /> : <PlayIcon />}
                  </button>

                  <span className="page-material__video-duration">
                    {isPlayingVideo
                      ? 'Sedang diputar · 00:42 / ' + activeMaterial.video.duration
                      : activeMaterial.video.duration}
                  </span>
                </div>

                <div className="page-material__video-meta">
                  <div className="page-material__badges">
                    <Badge tone="info">{activeMaterial.meetingBadge}</Badge>
                    <Badge tone="netral">{activeMaterial.estimatedRead}</Badge>
                    {isCompleted && (
                      <Badge tone="berhasil" icon={<CheckIcon />}>
                        Selesai
                      </Badge>
                    )}
                  </div>
                  <p className="page-material__course-ref">
                    {activeCourse.code} · {activeCourse.title}
                  </p>
                  <h2 className="page-material__video-title">
                    {activeMaterial.video.title}
                  </h2>
                  <p className="page-material__video-desc">
                    {activeMaterial.video.description}
                  </p>
                </div>
              </section>

              <article
                className="page-material__card"
                aria-labelledby="material-summary-heading"
              >
                <h2
                  id="material-summary-heading"
                  className="page-material__section-title"
                >
                  Ringkasan Materi
                </h2>
                <p className="page-material__summary">
                  {activeMaterial.summary}
                </p>

                {activeMaterial.keyPoints?.length > 0 && (
                  <div className="page-material__points-block">
                    <h3 className="page-material__sub-title">
                      Poin Penting Pertemuan
                    </h3>
                    <ul className="page-material__points">
                      {activeMaterial.keyPoints.map((point) => (
                        <li key={point} className="page-material__point-item">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            </div>

            {/* Kolom Samping / Bawah: Berkas Modul & Tombol Tandai Selesai */}
            <aside className="page-material__side">
              <section
                className="page-material__card"
                aria-labelledby="material-files-heading"
              >
                <h2
                  id="material-files-heading"
                  className="page-material__section-title"
                >
                  Berkas &amp; Slide Materi
                </h2>

                <div className="page-material__files">
                  {activeMaterial.attachments.map((file) => (
                    <button
                      key={file.id}
                      type="button"
                      className="page-material__file-item"
                      onClick={() => handleDownload(file)}
                    >
                      <span className="page-material__file-icon">
                        <FileDocIcon />
                      </span>
                      <span className="page-material__file-info">
                        <span className="page-material__file-title">
                          {file.title}
                        </span>
                        <span className="page-material__file-name">
                          {file.fileName} · {file.fileSize}
                        </span>
                      </span>
                      <span className="page-material__file-dl">
                        <DownloadIcon />
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {statusNotice && (
                <p className="page-material__notice" role="status">
                  {statusNotice}
                </p>
              )}

              <section
                className="page-material__card page-material__actions-card"
                aria-label="Aksi penyelesaian materi"
              >
                <Button
                  variant={isCompleted ? 'sekunder' : 'primer'}
                  fullWidth
                  leftIcon={isCompleted ? <CheckIcon /> : null}
                  onClick={handleToggleDone}
                >
                  {isCompleted ? 'Selesai Dipelajari' : 'Tandai Selesai'}
                </Button>

                <Button
                  variant={isCompleted ? 'primer' : 'sekunder'}
                  fullWidth
                  onClick={onBack}
                >
                  Kembali ke Halaman Kelas
                </Button>
              </section>
            </aside>
          </div>
        )}

        {/* Panel Simulasi 4 State E06 */}
        <aside
          className="page-material__demo-bar"
          aria-label="Simulasi 4 keadaan data halaman E06 Materi Pertemuan"
        >
          <span className="page-material__demo-label">Simulasi State E06:</span>
          <div className="page-material__demo-actions">
            {[
              { key: 'normal', label: 'Normal' },
              { key: 'loading', label: 'Loading' },
              { key: 'empty', label: 'Kosong' },
              { key: 'error', label: 'Galat' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                className={`page-material__demo-btn ${
                  viewState === item.key
                    ? 'page-material__demo-btn--active'
                    : ''
                }`}
                aria-pressed={viewState === item.key}
                onClick={() => setViewState(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </AppLayoutTemplate>
  );
}