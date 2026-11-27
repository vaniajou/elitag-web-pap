import { useRef, useState } from 'react';
import { Button } from '../../atoms';
import './FileUploadBox.css';

function UploadCloudIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg
      width="24"
      height="24"
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

function AlertTriangleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function FileUploadBox({
  selectedFile = null, // { name, sizeText, statusText? }
  isUploading = false,
  uploadProgress = 0,
  errorMessage = '',
  allowedFormats = 'Format .pdf, .zip (Maks. 10 MB)',
  accept = '.pdf,.zip,.docx',
  disabled = false,
  onFileSelect,
  onClearFile,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  function triggerFilePicker() {
    if (disabled || isUploading) return;
    inputRef.current?.click();
  }

  function handleInputChange(event) {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect?.(file);
    }
    /* Reset nilai input agar berkas dengan nama sama tetap bisa dipilih ulang */
    event.target.value = '';
  }

  function handleDragOver(event) {
    event.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;

    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileSelect?.(file);
    }
  }

  return (
    <div className="org-upload">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        aria-label="Pilih berkas tugas untuk diunggah"
        disabled={disabled || isUploading}
        onChange={handleInputChange}
      />

      {/* Keadaan 1: Mengunggah (Progress Bar) */}
      {isUploading && (
        <div
          className="org-upload__progress-box"
          role="status"
          aria-live="polite"
        >
          <div className="org-upload__progress-head">
            <span className="org-upload__progress-label">
              Mengunggah Berkas... {uploadProgress}%
            </span>
            {selectedFile?.name && (
              <span className="org-upload__progress-file">
                {selectedFile.name}
              </span>
            )}
          </div>

          <div
            className="org-upload__progress-track"
            role="progressbar"
            aria-valuenow={uploadProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Kemajuan unggah berkas tugas"
          >
            <div
              className="org-upload__progress-fill"
              style={{ width: `${Math.min(100, Math.max(0, uploadProgress))}%` }}
            />
          </div>
        </div>
      )}

      {/* Keadaan 2: Galat (Ukuran terlalu besar / format tidak didukung) */}
      {!isUploading && errorMessage && (
        <div className="org-upload__error-box" role="alert">
          <div className="org-upload__error-row">
            <span className="org-upload__error-icon">
              <AlertTriangleIcon />
            </span>
            <p className="org-upload__error-text">{errorMessage}</p>
          </div>

          <div className="org-upload__error-actions">
            <Button
              variant="sekunder"
              size="sm"
              disabled={disabled}
              onClick={triggerFilePicker}
            >
              Ganti Berkas
            </Button>
          </div>
        </div>
      )}

      {/* Keadaan 3: Terisi (Berkas dipilih & siap dikirim) */}
      {!isUploading && !errorMessage && selectedFile && (
        <div className="org-upload__file-card">
          <div className="org-upload__file-main">
            <span className="org-upload__file-icon">
              <FileTextIcon />
            </span>
            <div className="org-upload__file-info">
              <p className="org-upload__file-name">{selectedFile.name}</p>
              <p className="org-upload__file-meta">
                {selectedFile.sizeText} ·{' '}
                <span className="org-upload__file-ready">
                  {selectedFile.statusText || 'Siap kirim'}
                </span>
              </p>
            </div>
          </div>

          <div className="org-upload__file-actions">
            <Button
              variant="sekunder"
              size="sm"
              disabled={disabled}
              onClick={triggerFilePicker}
            >
              Ganti Berkas
            </Button>
            {onClearFile && (
              <Button
                variant="tersier"
                size="sm"
                disabled={disabled}
                onClick={onClearFile}
              >
                Hapus
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Keadaan 4: Kosong (Belum ada berkas yang diunggah — Dropzone) */}
      {!isUploading && !errorMessage && !selectedFile && (
        <div
          className={`org-upload__dropzone ${
            isDragging ? 'org-upload__dropzone--dragging' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <span className="org-upload__drop-icon">
            <UploadCloudIcon />
          </span>

          <div className="org-upload__drop-copy">
            <p className="org-upload__drop-title">Pilih file untuk diunggah</p>
            <p className="org-upload__drop-sub">
              atau seret dan lepaskan file di sini
            </p>
            <p className="org-upload__drop-hint">{allowedFormats}</p>
          </div>

          <Button
            variant="sekunder"
            size="sm"
            disabled={disabled}
            onClick={triggerFilePicker}
          >
            Pilih Berkas dari Perangkat
          </Button>
        </div>
      )}
    </div>
  );
}