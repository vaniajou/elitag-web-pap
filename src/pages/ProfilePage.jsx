import { useState } from 'react';
import { Badge, Button, Skeleton } from '../components/atoms';
import {
  ActivityItem,
  EmptyState,
  FormField,
  InfoList,
} from '../components/molecules';
import { ConfirmDialog } from '../components/organisms';
import { AppLayoutTemplate } from '../components/templates';
import { MOCK_HELP_TOPICS, MOCK_STUDENT } from '../data/mockElitagData';
import './ProfilePage.css';

function UserEditIcon() {
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
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function LockKeyIcon() {
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
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function HelpCircleIcon() {
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
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function MailIcon() {
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
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

function PhoneIcon() {
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
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function LogOutIcon() {
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
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
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

function getInitials(fullName = '') {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'MH';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function validateProfileForm(values) {
  const errors = {};
  const trimmedName = values.name.trim();
  const trimmedEmail = values.email.trim();
  const trimmedPhone = values.phone.trim();

  if (!trimmedName) {
    errors.name = 'Nama lengkap wajib diisi.';
  } else if (trimmedName.length < 3) {
    errors.name = 'Nama lengkap minimal terdiri dari 3 karakter.';
  }

  if (!trimmedEmail) {
    errors.email = 'Alamat email wajib diisi.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail)) {
    errors.email = 'Format email tidak valid.';
  }

  if (trimmedPhone && !/^0\d{9,13}$/.test(trimmedPhone.replace(/[\s-]/g, ''))) {
    errors.phone = 'Nomor telepon harus diawali angka 0 dan berisi 10–14 digit.';
  }

  return errors;
}

function validatePasswordForm(values) {
  const errors = {};
  if (!values.currentPassword) {
    errors.currentPassword = 'Kata sandi saat ini wajib diisi.';
  }
  if (!values.newPassword) {
    errors.newPassword = 'Kata sandi baru wajib diisi.';
  } else if (values.newPassword.length < 8) {
    errors.newPassword = 'Kata sandi baru minimal 8 karakter.';
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Konfirmasi kata sandi wajib diisi.';
  } else if (values.confirmPassword !== values.newPassword) {
    errors.confirmPassword = 'Konfirmasi kata sandi tidak cocok.';
  }
  return errors;
}

export function ProfilePage({
  studentProfile = MOCK_STUDENT,
  academicStats = null,
  logoSrc = '',
  onNavigate,
  onUpdateProfile,
  onLogout,
}) {
  const [viewState, setViewState] = useState('normal'); // 'normal' | 'loading' | 'empty' | 'error'
  const [activePanel, setActivePanel] = useState('overview'); // 'overview' | 'edit' | 'password' | 'help'

  /* State Form Edit Profil */
  const [formValues, setFormValues] = useState({
    name: studentProfile.name,
    email: studentProfile.email,
    phone: studentProfile.phone || '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  /* State Form Ganti Kata Sandi */
  const [pwValues, setPwValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [pwErrors, setPwErrors] = useState({});

  /* Feedback & Dialog Konfirmasi Keluar */
  const [successMessage, setSuccessMessage] = useState('');
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const stats = academicStats || studentProfile.academicStats || MOCK_STUDENT.academicStats;

  const academicInfoItems = [
    { label: 'NBI / NIM', value: studentProfile.nim },
    { label: 'Program Studi', value: studentProfile.program },
    { label: 'Fakultas', value: studentProfile.faculty || 'Fakultas Teknik' },
    { label: 'Semester Aktif', value: studentProfile.semester },
    { label: 'Email Kampus', value: studentProfile.email },
    { label: 'Nomor Telepon', value: studentProfile.phone || '-' },
  ];

  function openEditMode() {
    setFormValues({
      name: studentProfile.name,
      email: studentProfile.email,
      phone: studentProfile.phone || '',
    });
    setFormErrors({});
    setSuccessMessage('');
    setViewState('normal');
    setActivePanel('edit');
  }

  function handleFieldChange(field, value) {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (viewState === 'error') {
      setViewState('normal');
    }
    if (successMessage) setSuccessMessage('');
  }

  function handleSaveProfile(event) {
    event.preventDefault();
    const errors = validateProfileForm(formValues);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setViewState('error');
      return;
    }

    setFormErrors({});
    setViewState('normal');
    setIsSaving(true);

    window.setTimeout(() => {
      const updated = {
        ...studentProfile,
        name: formValues.name.trim(),
        email: formValues.email.trim(),
        phone: formValues.phone.trim(),
      };
      setIsSaving(false);
      onUpdateProfile?.(updated);
      setSuccessMessage('Perubahan profil berhasil disimpan.');
      setActivePanel('overview');
    }, 500);
  }

  function handleSavePassword(event) {
    event.preventDefault();
    const errors = validatePasswordForm(pwValues);
    if (Object.keys(errors).length > 0) {
      setPwErrors(errors);
      return;
    }

    setPwErrors({});
    setPwValues({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setSuccessMessage('Kata sandi akun berhasil diperbarui.');
    setActivePanel('overview');
  }

  function handleConfirmLogout() {
    setIsLogoutDialogOpen(false);
    onLogout?.();
  }

  /* Simulasi 4 state E10: Normal, Loading, Kosong, Galat (sesuai E10 - Profil Galat.pdf) */
  function applySimulation(mode) {
    setSuccessMessage('');
    setIsLogoutDialogOpen(false);

    if (mode === 'normal') {
      setViewState('normal');
      setFormErrors({});
      setActivePanel('overview');
    } else if (mode === 'loading') {
      setViewState('loading');
    } else if (mode === 'empty') {
      setViewState('empty');
    } else if (mode === 'error') {
      setViewState('error');
      setActivePanel('edit');
      setFormValues({
        name: studentProfile.name,
        email: 'raka.pratama@gm',
        phone: studentProfile.phone || '081234567890',
      });
      setFormErrors({
        email: 'Format email tidak valid.',
      });
    }
  }

  return (
    <AppLayoutTemplate
      activeNav="profil"
      onNavigate={onNavigate}
      logoSrc={logoSrc}
    >
      <div className="page-profile">
        <header className="page-profile__header">
          <h1 className="page-profile__title">Profil</h1>

          {viewState !== 'loading' && viewState !== 'empty' && activePanel !== 'overview' && (
            <Button
              variant="tersier"
              size="sm"
              onClick={() => {
                setActivePanel('overview');
                setFormErrors({});
                setViewState('normal');
              }}
            >
              Kembali ke Ringkasan
            </Button>
          )}
        </header>

        {/* Umpan balik simpan berhasil */}
        {successMessage && (
          <div className="page-profile__success" role="status">
            <span className="page-profile__success-icon">
              <CheckCircleIcon />
            </span>
            <p className="page-profile__success-text">{successMessage}</p>
          </div>
        )}

        {/* State Data: Loading */}
        {viewState === 'loading' && (
          <div
            className="page-profile__skeleton-wrap"
            aria-busy="true"
            aria-label="Memuat profil mahasiswa"
          >
            <div className="page-profile__card page-profile__skeleton-hero">
              <Skeleton variant="circle" width="72px" height="72px" />
              <Skeleton variant="text" width="55%" height="24px" />
              <Skeleton variant="text" width="42%" height="16px" />
              <Skeleton variant="text" width="60%" height="16px" />
            </div>

            <div className="page-profile__stats-grid">
              <Skeleton variant="rect" width="100%" height="84px" />
              <Skeleton variant="rect" width="100%" height="84px" />
              <Skeleton variant="rect" width="100%" height="84px" />
              <Skeleton variant="rect" width="100%" height="84px" />
            </div>

            <div className="page-profile__card">
              <Skeleton variant="rect" width="100%" height="56px" />
              <Skeleton variant="rect" width="100%" height="56px" />
              <Skeleton variant="rect" width="100%" height="56px" />
            </div>
          </div>
        )}

        {/* State Data: Kosong */}
        {viewState === 'empty' && (
          <EmptyState
            title="Data Profil Belum Lengkap"
            description="Lengkapi biodata mahasiswa dan alamat email kampus Anda agar pemberitahuan kelas serta tugas dapat diterima."
            actionLabel="Lengkapi Profil Sekarang"
            onAction={openEditMode}
          />
        )}

        {/* State Data: Normal & Galat Validasi Edit Profil */}
        {(viewState === 'normal' || viewState === 'error') && (
          <div className="page-profile__layout">
            {/* Kolom Kiri / Atas: Kartu Identitas Mahasiswa & Statistik Belajar */}
            <div className="page-profile__identity-col">
              <section
                className="page-profile__card page-profile__hero"
                aria-labelledby="profile-student-name"
              >
                <div
                  className="page-profile__avatar"
                  aria-hidden="true"
                >
                  {getInitials(studentProfile.name)}
                </div>

                <div className="page-profile__hero-text">
                  <div className="page-profile__hero-badges">
                    <Badge tone="berhasil">
                      {studentProfile.academicStatus || 'Mahasiswa Aktif'}
                    </Badge>
                  </div>

                  <h2 id="profile-student-name" className="page-profile__name">
                    {studentProfile.name}
                  </h2>

                  <p className="page-profile__email">{studentProfile.email}</p>

                  <p className="page-profile__meta">
                    {studentProfile.nim} · {studentProfile.program}
                  </p>
                </div>
              </section>

              {/* Ringkasan Statistik Belajar */}
              <section
                className="page-profile__section"
                aria-labelledby="profile-stats-heading"
              >
                <h2
                  id="profile-stats-heading"
                  className="page-profile__section-title"
                >
                  Ringkasan Statistik Belajar
                </h2>

                <div className="page-profile__stats-grid">
                  <div className="page-profile__stat-card">
                    <span className="page-profile__stat-value">
                      {stats.enrolledCourses}
                    </span>
                    <span className="page-profile__stat-label">
                      Kelas Aktif
                    </span>
                  </div>

                  <div className="page-profile__stat-card">
                    <span className="page-profile__stat-value">
                      {stats.completedTasks}
                    </span>
                    <span className="page-profile__stat-label">
                      Tugas Selesai
                    </span>
                  </div>

                  <div className="page-profile__stat-card">
                    <span className="page-profile__stat-value">
                      {stats.averageQuizScore}
                    </span>
                    <span className="page-profile__stat-label">
                      Rata-rata Kuis
                    </span>
                  </div>

                  <div className="page-profile__stat-card">
                    <span className="page-profile__stat-value">
                      {stats.attendanceRate}%
                    </span>
                    <span className="page-profile__stat-label">
                      Kehadiran
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* Kolom Kanan / Bawah: Menu Profil atau Form Edit Profil */}
            <div className="page-profile__detail-col">
              {/* PANEL 1: Ringkasan Biodata & Menu Pengaturan (E10 - Profil.pdf) */}
              {activePanel === 'overview' && (
                <>
                  <section
                    className="page-profile__card"
                    aria-labelledby="profile-academic-heading"
                  >
                    <h2
                      id="profile-academic-heading"
                      className="page-profile__section-title"
                    >
                      Informasi Akademik
                    </h2>
                    <InfoList items={academicInfoItems} />
                  </section>

                  <section
                    className="page-profile__card"
                    aria-labelledby="profile-settings-heading"
                  >
                    <h2
                      id="profile-settings-heading"
                      className="page-profile__section-title"
                    >
                      Pengaturan Akun
                    </h2>

                    <div className="page-profile__menu-list">
                      <ActivityItem
                        title="Edit Profil"
                        subtitle="Ubah nama lengkap, email, dan nomor telepon"
                        icon={<UserEditIcon />}
                        onClick={openEditMode}
                      />

                      <ActivityItem
                        title="Ganti Kata Sandi"
                        subtitle="Perbarui kata sandi akun secara berkala"
                        icon={<LockKeyIcon />}
                        onClick={() => {
                          setPwErrors({});
                          setSuccessMessage('');
                          setActivePanel('password');
                        }}
                      />

                      <ActivityItem
                        title="Pusat Bantuan"
                        subtitle="Panduan penggunaan ELITAG dan kontak layanan"
                        icon={<HelpCircleIcon />}
                        onClick={() => {
                          setSuccessMessage('');
                          setActivePanel('help');
                        }}
                      />
                    </div>
                  </section>
                </>
              )}

              {/* PANEL 2: Mode Edit Profil (E10 - Edit Profil.pdf & E10 - Profil Galat.pdf) */}
              {activePanel === 'edit' && (
                <form
                  className="page-profile__card page-profile__form"
                  onSubmit={handleSaveProfile}
                  noValidate
                >
                  <div className="page-profile__form-head">
                    <h2 className="page-profile__section-title">Edit Profil</h2>
                    <p className="page-profile__form-sub">
                      Perbarui informasi profil Anda. NBI/NIM dan program studi
                      dikelola otomatis oleh SIAKAD.
                    </p>
                  </div>

                  <FormField
                    id="profile-name"
                    name="name"
                    label="Nama Lengkap"
                    type="text"
                    value={formValues.name}
                    placeholder="Masukkan nama lengkap"
                    required
                    disabled={isSaving}
                    errorMessage={formErrors.name}
                    onChange={(event) =>
                      handleFieldChange('name', event.target.value)
                    }
                  />

                  <FormField
                    id="profile-email"
                    name="email"
                    label="Email"
                    type="email"
                    value={formValues.email}
                    placeholder="nama@contoh.untag-sby.ac.id"
                    required
                    disabled={isSaving}
                    leftIcon={<MailIcon />}
                    errorMessage={formErrors.email}
                    onChange={(event) =>
                      handleFieldChange('email', event.target.value)
                    }
                  />

                  <FormField
                    id="profile-phone"
                    name="phone"
                    label="Nomor Telepon"
                    type="tel"
                    inputMode="tel"
                    value={formValues.phone}
                    placeholder="08xxxxxxxxxx"
                    disabled={isSaving}
                    leftIcon={<PhoneIcon />}
                    helperText="Opsional. Digunakan untuk pemberitahuan darurat akademik."
                    errorMessage={formErrors.phone}
                    onChange={(event) =>
                      handleFieldChange('phone', event.target.value)
                    }
                  />

                  <div className="page-profile__form-actions">
                    <Button
                      type="submit"
                      variant="primer"
                      fullWidthMobile
                      isLoading={isSaving}
                      loadingText="Menyimpan..."
                    >
                      Simpan Perubahan
                    </Button>

                    <Button
                      type="button"
                      variant="sekunder"
                      fullWidthMobile
                      disabled={isSaving}
                      onClick={() => {
                        setFormErrors({});
                        setViewState('normal');
                        setActivePanel('overview');
                      }}
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              )}

              {/* PANEL 3: Ganti Kata Sandi */}
              {activePanel === 'password' && (
                <form
                  className="page-profile__card page-profile__form"
                  onSubmit={handleSavePassword}
                  noValidate
                >
                  <div className="page-profile__form-head">
                    <h2 className="page-profile__section-title">
                      Ganti Kata Sandi
                    </h2>
                    <p className="page-profile__form-sub">
                      Kata sandi baru minimal 8 karakter untuk menjaga keamanan
                      akun belajar Anda.
                    </p>
                  </div>

                  <FormField
                    id="pw-current"
                    name="currentPassword"
                    label="Kata Sandi Saat Ini"
                    type="password"
                    value={pwValues.currentPassword}
                    placeholder="Masukkan kata sandi saat ini"
                    required
                    errorMessage={pwErrors.currentPassword}
                    onChange={(event) => {
                      setPwValues((prev) => ({
                        ...prev,
                        currentPassword: event.target.value,
                      }));
                      if (pwErrors.currentPassword) {
                        setPwErrors((prev) => ({
                          ...prev,
                          currentPassword: '',
                        }));
                      }
                    }}
                  />

                  <FormField
                    id="pw-new"
                    name="newPassword"
                    label="Kata Sandi Baru"
                    type="password"
                    value={pwValues.newPassword}
                    placeholder="Minimal 8 karakter"
                    required
                    errorMessage={pwErrors.newPassword}
                    onChange={(event) => {
                      setPwValues((prev) => ({
                        ...prev,
                        newPassword: event.target.value,
                      }));
                      if (pwErrors.newPassword) {
                        setPwErrors((prev) => ({ ...prev, newPassword: '' }));
                      }
                    }}
                  />

                  <FormField
                    id="pw-confirm"
                    name="confirmPassword"
                    label="Konfirmasi Kata Sandi Baru"
                    type="password"
                    value={pwValues.confirmPassword}
                    placeholder="Ulangi kata sandi baru"
                    required
                    errorMessage={pwErrors.confirmPassword}
                    onChange={(event) => {
                      setPwValues((prev) => ({
                        ...prev,
                        confirmPassword: event.target.value,
                      }));
                      if (pwErrors.confirmPassword) {
                        setPwErrors((prev) => ({
                          ...prev,
                          confirmPassword: '',
                        }));
                      }
                    }}
                  />

                  <div className="page-profile__form-actions">
                    <Button type="submit" variant="primer" fullWidthMobile>
                      Simpan Kata Sandi
                    </Button>
                    <Button
                      type="button"
                      variant="sekunder"
                      fullWidthMobile
                      onClick={() => setActivePanel('overview')}
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              )}

              {/* PANEL 4: Pusat Bantuan */}
              {activePanel === 'help' && (
                <section
                  className="page-profile__card"
                  aria-labelledby="profile-help-heading"
                >
                  <h2
                    id="profile-help-heading"
                    className="page-profile__section-title"
                  >
                    Pusat Bantuan ELITAG
                  </h2>

                  <div className="page-profile__help-list">
                    {MOCK_HELP_TOPICS.map((topic) => (
                      <article
                        key={topic.id}
                        className="page-profile__help-item"
                      >
                        <h3 className="page-profile__help-q">
                          {topic.question}
                        </h3>
                        <p className="page-profile__help-a">{topic.answer}</p>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* Tombol Keluar dari Akun (tampil di semua mode profil sesuai desain Figma E10) */}
              <div className="page-profile__logout-wrap">
                <Button
                  type="button"
                  variant="sekunder"
                  fullWidth
                  leftIcon={<LogOutIcon />}
                  className="page-profile__logout-btn"
                  onClick={() => setIsLogoutDialogOpen(true)}
                >
                  Keluar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Panel Simulasi 4 State E10 */}
        <aside
          className="page-profile__demo-bar"
          aria-label="Simulasi 4 keadaan data halaman E10 Profil"
        >
          <span className="page-profile__demo-label">Simulasi State E10:</span>
          <div className="page-profile__demo-actions">
            {[
              { key: 'normal', label: 'Normal' },
              { key: 'loading', label: 'Loading' },
              { key: 'empty', label: 'Kosong' },
              { key: 'error', label: 'Galat' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                className={`page-profile__demo-btn ${
                  viewState === item.key ? 'page-profile__demo-btn--active' : ''
                }`}
                aria-pressed={viewState === item.key}
                onClick={() => applySimulation(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Dialog Konfirmasi Keluar dari Akun */}
        <ConfirmDialog
          isOpen={isLogoutDialogOpen}
          title="Keluar dari Akun ELITAG?"
          description="Sesi Anda akan diakhiri dan Anda perlu masuk kembali untuk mengakses kelas serta tugas."
          cancelLabel="Batal"
          confirmLabel="Ya, Keluar"
          confirmVariant="destruktif"
          onCancel={() => setIsLogoutDialogOpen(false)}
          onConfirm={handleConfirmLogout}
        />
      </div>
    </AppLayoutTemplate>
  );
}