import { useState } from 'react';
import { Button } from '../components/atoms';
import { FormField } from '../components/molecules';
import { AuthTemplate } from '../components/templates';
import './LoginPage.css';

/* Ikon garis (outline) agar bobot visual seimbang dengan teks input */
function UserIcon() {
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
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LockIcon() {
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

function EyeIcon({ visible }) {
  return visible ? (
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
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
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.45a5.51 5.51 0 0 1-2.39 3.62v3h3.87c2.26-2.08 3.56-5.15 3.56-8.65z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3c-1.07.72-2.44 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.29v3.1A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.29A7.2 7.2 0 0 1 4.91 12c0-.79.14-1.56.38-2.29v-3.1H1.29A12 12 0 0 0 0 12c0 1.94.46 3.77 1.29 5.39l4-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.61l4 3.1C6.23 6.88 8.88 4.77 12 4.77z"
      />
    </svg>
  );
}

function validateLoginForm(identifier, password) {
  const errors = {};
  const trimmedId = identifier.trim();

  if (!trimmedId) {
    errors.identifier = 'NIM atau email kampus wajib diisi.';
  } else if (/^\d+$/.test(trimmedId)) {
    if (trimmedId.length < 10) {
      const kurang = 10 - trimmedId.length;
      errors.identifier = `NIM harus 10 angka (kurang ${kurang} angka)`;
    } else if (trimmedId.length > 10) {
      const lebih = trimmedId.length - 10;
      errors.identifier = `NIM harus 10 angka (kelebihan ${lebih} angka)`;
    }
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedId)) {
    errors.identifier =
      'Format email belum tepat. Gunakan NIM 10 angka atau email kampus.';
  }

  if (!password) {
    errors.password = 'Kata sandi wajib diisi.';
  } else if (password.length < 6) {
    errors.password = 'Kata sandi minimal terdiri dari 6 karakter.';
  }

  return errors;
}

export function LoginPage({ onLoginSuccess, logoSrc = '' }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formFeedback, setFormFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleIdentifierChange(event) {
    setIdentifier(event.target.value);
    if (errors.identifier) {
      setErrors((prev) => ({ ...prev, identifier: '' }));
    }
    if (formFeedback) setFormFeedback('');
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: '' }));
    }
    if (formFeedback) setFormFeedback('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateLoginForm(identifier, password);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setFormFeedback('');
    setIsLoading(true);

    /* Simulasi autentikasi (menampilkan state Memuat... sebelum masuk ke E02 Beranda) */
    window.setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess?.({
        identifier: identifier.trim(),
        method: 'credentials',
      });
    }, 900);
  }

  function handleGoogleLogin() {
    setErrors({});
    setFormFeedback('');
    setIsLoading(true);

    window.setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess?.({
        identifier: 'mahasiswa.contoh@untag-sby.ac.id',
        method: 'google',
      });
    }, 900);
  }

  /* Helper simulasi cepat untuk memperagakan 3 state Figma saat demo */
  function applySimulation(mode) {
    setFormFeedback('');
    if (mode === 'normal') {
      setIsLoading(false);
      setIdentifier('');
      setPassword('');
      setErrors({});
    } else if (mode === 'galat') {
      setIsLoading(false);
      setIdentifier('146240001'); // Data contoh 9 angka
      setPassword('sandi123');
      setErrors({
        identifier: 'NIM harus 10 angka (kurang 1 angka)',
      });
    } else if (mode === 'memuat') {
      setIdentifier('1462400001'); // Data contoh 10 angka
      setPassword('sandi123');
      setErrors({});
      setIsLoading(true);
    }
  }

  return (
    <AuthTemplate logoSrc={logoSrc}>
      <section className="page-login" aria-labelledby="login-heading">
        <div className="page-login__intro">
          <h1 id="login-heading" className="page-login__title">
            Selamat Datang
          </h1>
          <p className="page-login__subtitle">
            Masuk untuk melanjutkan ke kelas Anda.
          </p>
        </div>

        <form className="page-login__form" onSubmit={handleSubmit} noValidate>
          <FormField
            id="login-identifier"
            name="identifier"
            label="NIM / Email Kampus"
            type="text"
            value={identifier}
            placeholder="Masukkan NIM atau email"
            autoComplete="username"
            leftIcon={<UserIcon />}
            errorMessage={errors.identifier}
            disabled={isLoading}
            onChange={handleIdentifierChange}
          />

          <FormField
            id="login-password"
            name="password"
            label="Kata Sandi"
            type={showPassword ? 'text' : 'password'}
            value={password}
            placeholder="••••••••"
            autoComplete="current-password"
            leftIcon={<LockIcon />}
            errorMessage={errors.password}
            disabled={isLoading}
            onChange={handlePasswordChange}
            rightAction={
              <button
                type="button"
                className="page-login__toggle-pw"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword
                    ? 'Sembunyikan kata sandi'
                    : 'Tampilkan kata sandi'
                }
                aria-pressed={showPassword}
                disabled={isLoading}
              >
                <EyeIcon visible={showPassword} />
              </button>
            }
          />

          {formFeedback && (
            <p className="page-login__feedback" role="status">
              {formFeedback}
            </p>
          )}

          <div className="page-login__actions">
            <Button
              type="submit"
              variant="primer"
              fullWidth
              isLoading={isLoading}
              loadingText="Memuat..."
            >
              Masuk
            </Button>

            <Button
              type="button"
              variant="sekunder"
              fullWidth
              leftIcon={<GoogleIcon />}
              disabled={isLoading}
              onClick={handleGoogleLogin}
            >
              Masuk dengan Akun Google
            </Button>
          </div>
        </form>

        <footer className="page-login__footer">
          <button
            type="button"
            className="page-login__help-link"
            onClick={() =>
              setFormFeedback(
                'Hubungi admin akademik atau gunakan menu reset kata sandi pada portal SIAKAD.'
              )
            }
          >
            Lupa kata sandi?
          </button>
          <span className="page-login__dot" aria-hidden="true">
            ·
          </span>
          <button
            type="button"
            className="page-login__help-link"
            onClick={() =>
              setFormFeedback(
                'Layanan bantuan ELITAG tersedia pada jam kerja melalui pusat bantuan kampus.'
              )
            }
          >
            Butuh bantuan?
          </button>
        </footer>

        {/* Panel pratinjau cepat untuk keperluan demo state E01 */}
        <div
          className="page-login__demo-bar"
          aria-label="Simulasi keadaan layar E01"
        >
          <span className="page-login__demo-label">Simulasi State E01:</span>
          <div className="page-login__demo-actions">
            <button
              type="button"
              className="page-login__demo-btn"
              onClick={() => applySimulation('normal')}
            >
              Normal
            </button>
            <button
              type="button"
              className="page-login__demo-btn"
              onClick={() => applySimulation('galat')}
            >
              Galat
            </button>
            <button
              type="button"
              className="page-login__demo-btn"
              onClick={() => applySimulation('memuat')}
            >
              Memuat
            </button>
          </div>
        </div>
      </section>
    </AuthTemplate>
  );
}