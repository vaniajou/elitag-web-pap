import { useEffect } from 'react';
import { Button } from '../../atoms';
import './ConfirmDialog.css';

export function ConfirmDialog({
  isOpen = false,
  title,
  description,
  cancelLabel = 'Batal',
  confirmLabel = 'Ya, Lanjutkan',
  confirmVariant = 'destruktif',
  onCancel,
  onConfirm,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onCancel?.();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="org-dialog-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onCancel?.();
        }
      }}
    >
      <div
        className="org-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
      >
        <h2 id="confirm-dialog-title" className="org-dialog__title">
          {title}
        </h2>
        <p id="confirm-dialog-desc" className="org-dialog__desc">
          {description}
        </p>

        <div className="org-dialog__actions">
          <Button variant="sekunder" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}