import { Badge, Button } from '../../atoms';
import './TaskItem.css';

function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
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

function AlertIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
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

function getStatusMeta(task) {
  if (task.status === 'Terlambat') {
    return {
      tone: 'gagal',
      label: 'Terlambat',
      icon: <AlertIcon />,
      actionLabel: task.type === 'quiz' ? 'Kerjakan' : 'Kumpulkan',
    };
  }

  if (task.status === 'Sudah Dikumpulkan') {
    return {
      tone: 'info',
      label: 'Sudah Dikumpulkan',
      icon: <CheckIcon />,
      actionLabel: 'Lihat Detail',
    };
  }

  if (task.status === 'Dinilai') {
    return {
      tone: 'berhasil',
      label: `Dinilai · ${task.score ?? 0}/100`,
      icon: <CheckIcon />,
      actionLabel: 'Lihat Detail',
    };
  }

  return {
    tone: task.isUrgent ? 'utama' : 'peringatan',
    label: task.statusDisplay || 'Belum Dikumpulkan',
    icon: <ClockIcon />,
    actionLabel: task.type === 'quiz' ? 'Kerjakan' : 'Kumpulkan',
  };
}

export function TaskItem({ task, onAction }) {
  const statusMeta = getStatusMeta(task);

  return (
    <article className="mol-task-card">
      <div className="mol-task-card__body">
        <p className="mol-task-card__course">{task.courseName}</p>
        <h2 className="mol-task-card__title">{task.title}</h2>
        <p className="mol-task-card__due">
          <span className="mol-task-card__due-icon" aria-hidden="true">
            <ClockIcon />
          </span>
          <span>{task.dueDateText}</span>
        </p>

        {task.feedback && task.status === 'Dinilai' && (
          <p className="mol-task-card__feedback">Catatan: {task.feedback}</p>
        )}
      </div>

      <div className="mol-task-card__footer">
        <Badge tone={statusMeta.tone} icon={statusMeta.icon}>
          {statusMeta.label}
        </Badge>

        <Button
          variant="sekunder"
          size="sm"
          onClick={() => onAction?.(task)}
        >
          {statusMeta.actionLabel}
        </Button>
      </div>
    </article>
  );
}