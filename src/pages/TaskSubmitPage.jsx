import { useEffect, useRef, useState } from 'react';
import { Badge, Button, Label } from '../components/atoms';
import { PageHeader } from '../components/molecules';
import { FileUploadBox } from '../components/organisms';
import { AppLayoutTemplate } from '../components/templates';
import { MOCK_TASKS } from '../data/mockElitagData';
import './TaskSubmitPage.css';

function ClockIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function formatFileSize(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${bytes} B`;
}

function formatNowWib() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];
  const mon = months[now.getMonth()];
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${dd} ${mon} ${yyyy} · ${hh}.${mm} WIB`;
}

function getStatusTone(status, isUrgent) {
  if (status === 'Dinilai') return 'berhasil';
  if (status === 'Sudah Dikumpulkan') return 'info';
  if (status === 'Terlambat') return 'gagal';
  return isUrgent ? 'utama' : 'peringatan';
}

export function TaskSubmitPage({
  task,
  logoSrc = '',
  onNavigate,
  onBack,
  onSubmitTask,
}) {
  const activeTask = task || MOCK_TASKS[0];
  const maxSizeMB = activeTask.maxSizeMB || 10;
  const allowedExtensions = activeTask.allowedExtensions || ['.pdf', '.zip'];
  const acceptString = allowedExtensions.join(',');

  const hasExistingSubmission =
    activeTask.status === 'Sudah Dikumpulkan' || activeTask.status === 'Dinilai';
  const latestHistory = activeTask.submissionHistory?.[0] || null;

  const [simState, setSimState] = useState(
    hasExistingSubmission ? 'normal' : 'empty'
  ); // 'normal' | 'loading' | 'empty' | 'error'
  const [selectedFile, setSelectedFile] = useState(
    latestHistory
      ? {
          name: latestHistory.fileName,
          sizeText: latestHistory.fileSize,
          statusText: 'Sudah diunggah',
        }
      : null
  );
  const [studentNote, setStudentNote] = useState(latestHistory?.note || '');
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successBanner, setSuccessBanner] = useState('');

  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  function clearActiveTimer() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function handleFileSelect(file) {
    clearActiveTimer();
    setSuccessBanner('');

    const fileNameLower = file.name.toLowerCase();
    const isExtensionValid = allowedExtensions.some((ext) =>
      fileNameLower.endsWith(ext)
    );
    const sizeInMB = file.size / (1024 * 1024);

    if (!isExtensionValid) {
      setSelectedFile(null);
      setIsUploading(false);
      setSimState('error');
      setUploadError(
        `Format berkas "${file.name}" tidak didukung. Gunakan berkas berformat ${allowedExtensions.join(', ')}.`
      );
      return;
    }

    if (sizeInMB > maxSizeMB) {
      setSelectedFile(null);
      setIsUploading(false);
      setSimState('error');
      setUploadError(
        `Ukuran berkas terlalu besar (${sizeInMB.toFixed(1)} MB). Maksimal ukuran berkas adalah ${maxSizeMB} MB.`
      );
      return;
    }

    setUploadError('');
    setIsUploading(false);
    setUploadProgress(0);
    setSimState('normal');
    setSelectedFile({
      name: file.name,
      sizeText: formatFileSize(file.size),
      statusText: 'Siap kirim',
    });
  }

  function handleClearFile() {
    clearActiveTimer();
    setSelectedFile(null);
    setUploadError('');
    setIsUploading(false);
    setUploadProgress(0);
    setSuccessBanner('');
    setSimState('empty');
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSuccessBanner('');

    if (!selectedFile) {
      setSimState('error');
      setUploadError(
        'Pilih minimal satu berkas tugas terlebih dahulu sebelum menyerahkan tugas.'
      );
      return;
    }

    clearActiveTimer();
    setUploadError('');
    setIsUploading(true);
    setSimState('loading');
    setUploadProgress(20);

    let progress = 20;
    timerRef.current = window.setInterval(() => {
      progress += 25;
      if (progress >= 100) {
        clearActiveTimer();
        setUploadProgress(100);
        setIsUploading(false);
        setSimState('normal');

        const submittedAt = formatNowWib();
        const nextVersion = (activeTask.submissionHistory?.length || 0) + 1;
        const newEntry = {
          id: `sub-${Date.now()}`,
          version: `Versi ${nextVersion} (Aktif)`,
          fileName: selectedFile.name,
          fileSize: selectedFile.sizeText,
          submittedAt,
          note: studentNote.trim(),
        };

        setSelectedFile({
          ...selectedFile,
          statusText: 'Berhasil dikirim',
        });
        setSuccessBanner(
          `Tugas berhasil diserahkan pada ${submittedAt}. Berkas "${selectedFile.name}" telah tercatat.`
        );

        onSubmitTask?.(activeTask.id, newEntry);
      } else {
        setUploadProgress(progress);
      }
    }, 260);
  }

  /* Helper simulasi 4 state E08 sesuai desain Figma & ketentuan ETS */
  function applySimulation(mode) {
    clearActiveTimer();
    setSuccessBanner('');

    if (mode === 'normal') {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadError('');
      setSelectedFile({
        name: latestHistory?.fileName || 'Tugas1_UIUX_Raka.pdf',
        sizeText: latestHistory?.fileSize || '2,4 MB',
        statusText: 'Siap kirim',
      });
      setSimState('normal');
    } else if (mode === 'loading') {
      setUploadError('');
      setSelectedFile({
        name: latestHistory?.fileName || 'Tugas1_UIUX_Raka.pdf',
        sizeText: latestHistory?.fileSize || '2,4 MB',
        statusText: 'Mengunggah',
      });
      setUploadProgress(65);
      setIsUploading(true);
      setSimState('loading');
    } else if (mode === 'empty') {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadError('');
      setSelectedFile(null);
      setSimState('empty');
    } else if (mode === 'error') {
      setIsUploading(false);
      setUploadProgress(0);
      setSelectedFile(null);
      setUploadError(
        `Ukuran berkas terlalu besar (14,2 MB). Maksimal ukuran berkas adalah ${maxSizeMB} MB.`
      );
      setSimState('error');
    }
  }

  const isGraded = activeTask.status === 'Dinilai';
  const submitButtonLabel = hasExistingSubmission
    ? 'Perbarui Pengumpulan'
    : 'Serahkan Tugas';

  return (
    <AppLayoutTemplate
      activeNav="tugas"
      onNavigate={onNavigate}
      logoSrc={logoSrc}
    >
      <div className="page-submit">
        <PageHeader
          title="Detail dan Pengumpulan Tugas"
          backLabel="Kembali ke Daftar Tugas"
          onBack={onBack}
        />

        {/* Notifikasi konfirmasi berhasil */}
        {successBanner && (
          <div className="page-submit__success" role="status">
            <span className="page-submit__success-icon">
              <CheckCircleIcon />
            </span>
            <p className="page-submit__success-text">{successBanner}</p>
          </div>
        )}

        <div className="page-submit__layout">
          {/* Kolom Utama: Ringkasan Tugas, Instruksi, dan Formulir Pengumpulan */}
          <div className="page-submit__main">
            <section
              className="page-submit__card page-submit__hero"
              aria-labelledby="task-submit-title"
            >
              <p className="page-submit__course">
                {activeTask.courseName}
                {activeTask.lecturer ? ` · ${activeTask.lecturer}` : ''}
              </p>

              <h2 id="task-submit-title" className="page-submit__title">
                {activeTask.title}
              </h2>

              <div className="page-submit__badges">
                <Badge
                  tone={getStatusTone(activeTask.status, activeTask.isUrgent)}
                >
                  {activeTask.status}
                </Badge>
                {activeTask.remainingTimeText && (
                  <Badge
                    tone={
                      activeTask.status === 'Terlambat'
                        ? 'gagal'
                        : activeTask.isUrgent
                          ? 'utama'
                          : 'netral'
                    }
                    icon={<ClockIcon />}
                  >
                    {activeTask.remainingTimeText}
                  </Badge>
                )}
              </div>

              <p className="page-submit__due">{activeTask.dueDateText}</p>
            </section>

            {/* Kartu Nilai & Umpan Balik Dosen (Khusus status Dinilai) */}
            {isGraded && (
              <section
                className="page-submit__grade-card"
                aria-labelledby="task-grade-heading"
              >
                <div className="page-submit__grade-head">
                  <div>
                    <h3
                      id="task-grade-heading"
                      className="page-submit__section-title"
                    >
                      Hasil Penilaian Dosen
                    </h3>
                    {activeTask.gradedAt && (
                      <p className="page-submit__grade-date">
                        Dinilai pada {activeTask.gradedAt}
                      </p>
                    )}
                  </div>
                  <div className="page-submit__score-pill">
                    <span className="page-submit__score-num">
                      {activeTask.score ?? 0}
                    </span>
                    <span className="page-submit__score-max">
                      / {activeTask.maxScore ?? 100}
                    </span>
                  </div>
                </div>

                {activeTask.feedback && (
                  <div className="page-submit__feedback-box">
                    <p className="page-submit__feedback-label">
                      Umpan Balik Dosen
                    </p>
                    <p className="page-submit__feedback-text">
                      {activeTask.feedback}
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* Kartu Instruksi & Ketentuan Berkas */}
            <section
              className="page-submit__card"
              aria-labelledby="task-instruction-heading"
            >
              <h3
                id="task-instruction-heading"
                className="page-submit__section-title"
              >
                Instruksi Tugas
              </h3>

              <p className="page-submit__desc">{activeTask.description}</p>

              {activeTask.instructions?.length > 0 && (
                <ol className="page-submit__steps">
                  {activeTask.instructions.map((step) => (
                    <li key={step} className="page-submit__step-item">
                      {step}
                    </li>
                  ))}
                </ol>
              )}

              <div className="page-submit__spec-bar">
                <span className="page-submit__spec-label">
                  Ketentuan Berkas:
                </span>
                <span className="page-submit__spec-value">
                  {activeTask.allowedFormats ||
                    `Format ${allowedExtensions.join(', ')} (Maks. ${maxSizeMB} MB)`}
                </span>
              </div>
            </section>

            {/* Formulir Unggah Berkas & Catatan Mahasiswa */}
            <form
              className="page-submit__card page-submit__form"
              onSubmit={handleSubmit}
              noValidate
            >
              <h3 className="page-submit__section-title">
                {hasExistingSubmission
                  ? 'Perbarui Berkas Pengumpulan'
                  : 'Unggah Berkas Tugas'}
              </h3>

              <FileUploadBox
                selectedFile={selectedFile}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                errorMessage={uploadError}
                allowedFormats={
                  activeTask.allowedFormats ||
                  `Format ${allowedExtensions.join(', ')} (Maks. ${maxSizeMB} MB)`
                }
                accept={acceptString}
                disabled={isGraded}
                onFileSelect={handleFileSelect}
                onClearFile={handleClearFile}
              />

              <div className="page-submit__note-field">
                <Label htmlFor="task-student-note">
                  Catatan / Komentar untuk Dosen (Opsional)
                </Label>
                <textarea
                  id="task-student-note"
                  name="studentNote"
                  rows={3}
                  className="page-submit__textarea"
                  placeholder="Tuliskan catatan singkat mengenai berkas yang Anda kumpulkan..."
                  value={studentNote}
                  disabled={isUploading || isGraded}
                  onChange={(event) => setStudentNote(event.target.value)}
                />
              </div>

              {isGraded && (
                <p className="page-submit__locked-note">
                  Tugas ini sudah dinilai oleh dosen sehingga unggahan baru tidak
                  lagi dibuka.
                </p>
              )}

              <div className="page-submit__actions">
                <Button
                  type="submit"
                  variant="primer"
                  fullWidthMobile
                  isLoading={isUploading}
                  loadingText="Mengirim"
                  disabled={isGraded}
                >
                  {submitButtonLabel}
                </Button>

                <Button
                  type="button"
                  variant="sekunder"
                  fullWidthMobile
                  disabled={isUploading}
                  onClick={onBack}
                >
                  Kembali ke Daftar Tugas
                </Button>
              </div>
            </form>
          </div>

          {/* Kolom Pendamping: Riwayat Unggahan Sebelumnya */}
          <aside
            className="page-submit__side"
            aria-labelledby="submission-history-heading"
          >
            <section className="page-submit__card">
              <h3
                id="submission-history-heading"
                className="page-submit__section-title"
              >
                Riwayat Unggahan ({activeTask.submissionHistory?.length || 0})
              </h3>

              {activeTask.submissionHistory?.length > 0 ? (
                <ul className="page-submit__history-list">
                  {activeTask.submissionHistory.map((item, index) => (
                    <li key={item.id} className="page-submit__history-item">
                      <div className="page-submit__history-top">
                        <Badge tone={index === 0 ? 'info' : 'netral'}>
                          {item.version}
                        </Badge>
                        <span className="page-submit__history-size">
                          {item.fileSize}
                        </span>
                      </div>
                      <p className="page-submit__history-file">
                        {item.fileName}
                      </p>
                      <p className="page-submit__history-time">
                        {item.submittedAt}
                      </p>
                      {item.note && (
                        <p className="page-submit__history-note">
                          “{item.note}”
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="page-submit__history-empty">
                  Belum ada berkas yang diunggah untuk tugas ini.
                </p>
              )}
            </section>
          </aside>
        </div>

        {/* Panel Simulasi 4 State E08 (Normal/Terisi, Loading/Mengunggah, Kosong, Galat) */}
        <aside
          className="page-submit__demo-bar"
          aria-label="Simulasi 4 keadaan data halaman E08 Pengumpulan Tugas"
        >
          <span className="page-submit__demo-label">Simulasi State E08:</span>
          <div className="page-submit__demo-actions">
            {[
              { key: 'normal', label: 'Normal' },
              { key: 'loading', label: 'Loading' },
              { key: 'empty', label: 'Kosong' },
              { key: 'error', label: 'Galat' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                className={`page-submit__demo-btn ${
                  simState === item.key ? 'page-submit__demo-btn--active' : ''
                }`}
                aria-pressed={simState === item.key}
                onClick={() => applySimulation(item.key)}
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