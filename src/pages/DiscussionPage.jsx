import { useMemo, useState } from 'react';
import { Badge, Button, Label, Skeleton } from '../components/atoms';
import {
  EmptyState,
  ErrorState,
  FilterChipGroup,
  FormField,
  PageHeader,
} from '../components/molecules';
import { AppLayoutTemplate } from '../components/templates';
import {
  MOCK_COURSE_CATALOG,
  MOCK_DISCUSSIONS,
  MOCK_STUDENT,
} from '../data/mockElitagData';
import './DiscussionPage.css';

function MessageIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function PlusIcon() {
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
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'EL';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function DiscussionPage({
  course,
  studentName = MOCK_STUDENT.name,
  initialThreads = null,
  logoSrc = '',
  onNavigate,
  onBack,
  onThreadsChange,
}) {
  const activeCourse = course || MOCK_COURSE_CATALOG[0];
  const defaultThreads =
    initialThreads ||
    MOCK_DISCUSSIONS[activeCourse.id] ||
    MOCK_DISCUSSIONS.default;

  const [threads, setThreads] = useState(defaultThreads);
  const [selectedThreadId, setSelectedThreadId] = useState(
    defaultThreads[0]?.id || ''
  );
  const [topicFilter, setTopicFilter] = useState('semua');
  const [viewState, setViewState] = useState('normal'); // 'normal' | 'loading' | 'empty' | 'error'

  /* Form Buat Topik Baru */
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicTag, setNewTopicTag] = useState('Pertemuan 1');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [topicErrors, setTopicErrors] = useState({});

  /* Form Kirim Balasan */
  const [replyText, setReplyText] = useState('');
  const [replyError, setReplyError] = useState('');
  const [statusNotice, setStatusNotice] = useState('');

  const topicOptions = useMemo(() => {
    const uniqueTags = Array.from(
      new Set(threads.map((item) => item.topicTag).filter(Boolean))
    );
    return [
      { value: 'semua', label: 'Semua Topik' },
      ...uniqueTags.map((tag) => ({ value: tag, label: tag })),
    ];
  }, [threads]);

  const filteredThreads = useMemo(() => {
    if (topicFilter === 'semua') return threads;
    return threads.filter((item) => item.topicTag === topicFilter);
  }, [threads, topicFilter]);

  const activeThread =
    filteredThreads.find((item) => item.id === selectedThreadId) ||
    filteredThreads[0] ||
    null;

  function updateThreads(nextThreads) {
    setThreads(nextThreads);
    onThreadsChange?.(activeCourse.id, nextThreads);
  }

  function handleCreateThread(event) {
    event.preventDefault();
    const errors = {};

    if (!newTopicTitle.trim()) {
      errors.title = 'Judul topik diskusi wajib diisi.';
    } else if (newTopicTitle.trim().length < 5) {
      errors.title = 'Judul topik minimal 5 karakter.';
    }

    if (!newTopicContent.trim()) {
      errors.content = 'Isi pertanyaan atau bahan diskusi wajib diisi.';
    } else if (newTopicContent.trim().length < 10) {
      errors.content = 'Tuliskan isi diskusi minimal 10 karakter.';
    }

    if (Object.keys(errors).length > 0) {
      setTopicErrors(errors);
      return;
    }

    const createdThread = {
      id: `disc-${Date.now()}`,
      topicTag: newTopicTag.trim() || 'Umum',
      title: newTopicTitle.trim(),
      authorName: studentName,
      authorRole: 'Mahasiswa',
      postedAt: 'Baru saja',
      content: newTopicContent.trim(),
      replies: [],
    };

    const nextThreads = [createdThread, ...threads];
    updateThreads(nextThreads);
    setTopicFilter('semua');
    setSelectedThreadId(createdThread.id);
    setNewTopicTitle('');
    setNewTopicContent('');
    setTopicErrors({});
    setIsComposerOpen(false);
    setViewState('normal');
    setStatusNotice('Topik diskusi baru berhasil dipublikasikan.');
  }

  function handleSendReply(event) {
    event.preventDefault();
    if (!activeThread) return;

    const trimmedReply = replyText.trim();
    if (!trimmedReply) {
      setReplyError('Tuliskan balasan diskusi terlebih dahulu sebelum mengirim.');
      return;
    }

    const newReply = {
      id: `rep-${Date.now()}`,
      authorName: studentName,
      authorRole: 'Mahasiswa',
      postedAt: 'Baru saja',
      content: trimmedReply,
    };

    const nextThreads = threads.map((item) =>
      item.id === activeThread.id
        ? { ...item, replies: [...item.replies, newReply] }
        : item
    );

    updateThreads(nextThreads);
    setReplyText('');
    setReplyError('');
    setStatusNotice('Balasan Anda berhasil dikirim ke forum diskusi.');
  }

  function handleRetry() {
    setViewState('loading');
    window.setTimeout(() => {
      setViewState('normal');
    }, 600);
  }

  const effectiveStatus =
    viewState === 'normal' && filteredThreads.length === 0
      ? 'empty'
      : viewState;

  return (
    <AppLayoutTemplate
      activeNav="beranda"
      onNavigate={onNavigate}
      logoSrc={logoSrc}
    >
      <div className="page-forum">
        {/* Header Halaman + Tombol Buat Topik */}
        <div className="page-forum__top-bar">
          <div className="page-forum__heading-group">
            <PageHeader
              title="Forum Diskusi"
              backLabel="Kembali ke Halaman Kelas"
              onBack={onBack}
            />
            <p className="page-forum__course-ref">
              {activeCourse.code} · {activeCourse.title}
            </p>
          </div>

          <Button
            variant={isComposerOpen ? 'sekunder' : 'sekunder'}
            size="sm"
            leftIcon={<PlusIcon />}
            onClick={() => {
              setIsComposerOpen((prev) => !prev);
              setTopicErrors({});
              setStatusNotice('');
            }}
          >
            {isComposerOpen ? 'Tutup Form' : 'Buat Topik Baru'}
          </Button>
        </div>

        {/* Umpan Balik Aksi */}
        {statusNotice && (
          <p className="page-forum__notice" role="status">
            {statusNotice}
          </p>
        )}

        {/* Form Buat Topik Diskusi Baru */}
        {isComposerOpen && (
          <form
            className="page-forum__composer"
            onSubmit={handleCreateThread}
            noValidate
          >
            <h2 className="page-forum__section-title">
              Buat Topik Diskusi Baru
            </h2>

            <div className="page-forum__composer-grid">
              <FormField
                id="forum-new-title"
                name="topicTitle"
                label="Judul Topik Diskusi"
                value={newTopicTitle}
                placeholder="Contoh: Pertanyaan tentang Flexbox dan Grid"
                required
                errorMessage={topicErrors.title}
                onChange={(event) => {
                  setNewTopicTitle(event.target.value);
                  if (topicErrors.title) {
                    setTopicErrors((prev) => ({ ...prev, title: '' }));
                  }
                }}
              />

              <FormField
                id="forum-new-tag"
                name="topicTag"
                label="Label Pertemuan / Topik"
                value={newTopicTag}
                placeholder="Pertemuan 1"
                onChange={(event) => setNewTopicTag(event.target.value)}
              />
            </div>

            <div className="page-forum__textarea-group">
              <Label htmlFor="forum-new-content" required>
                Isi Pertanyaan atau Diskusi
              </Label>
              <textarea
                id="forum-new-content"
                rows={3}
                className={`page-forum__textarea ${
                  topicErrors.content ? 'page-forum__textarea--error' : ''
                }`}
                placeholder="Tuliskan pertanyaan atau pendapat yang ingin didiskusikan bersama kelas..."
                value={newTopicContent}
                aria-invalid={topicErrors.content ? 'true' : undefined}
                onChange={(event) => {
                  setNewTopicContent(event.target.value);
                  if (topicErrors.content) {
                    setTopicErrors((prev) => ({ ...prev, content: '' }));
                  }
                }}
              />
              {topicErrors.content && (
                <p className="page-forum__field-error" role="alert">
                  {topicErrors.content}
                </p>
              )}
            </div>

            <div className="page-forum__composer-actions">
              <Button type="submit" variant="primer" fullWidthMobile>
                Publikasikan Topik
              </Button>
              <Button
                type="button"
                variant="sekunder"
                fullWidthMobile
                onClick={() => {
                  setIsComposerOpen(false);
                  setTopicErrors({});
                }}
              >
                Batal
              </Button>
            </div>
          </form>
        )}

        {/* Filter Topik */}
        {viewState === 'normal' && threads.length > 0 && (
          <FilterChipGroup
            label="Filter topik diskusi"
            options={topicOptions}
            selectedValue={topicFilter}
            onChange={(value) => {
              setTopicFilter(value);
              setReplyError('');
            }}
          />
        )}

        {/* State Data: Loading */}
        {effectiveStatus === 'loading' && (
          <div
            className="page-forum__skeleton-wrap"
            aria-busy="true"
            aria-label="Memuat forum diskusi kelas"
          >
            <div className="page-forum__card">
              <Skeleton variant="text" width="36%" height="20px" />
              <Skeleton variant="text" width="75%" height="24px" />
              <Skeleton variant="text" width="100%" height="16px" />
              <Skeleton variant="text" width="84%" height="16px" />
            </div>
            <div className="page-forum__card">
              <Skeleton variant="text" width="40%" height="20px" />
              <Skeleton variant="rect" width="100%" height="72px" />
              <Skeleton variant="rect" width="100%" height="72px" />
            </div>
          </div>
        )}

        {/* State Data: Galat */}
        {effectiveStatus === 'error' && (
          <ErrorState
            title="Forum Diskusi Gagal Dimuat"
            description="Periksa koneksi internet Anda lalu muat ulang utas diskusi kelas ini."
            actionLabel="Coba Lagi"
            onRetry={handleRetry}
          />
        )}

        {/* State Data: Kosong */}
        {effectiveStatus === 'empty' && (
          <EmptyState
            title="Belum Ada Utas Diskusi"
            description="Mulai diskusi pertama di kelas ini dengan mengajukan pertanyaan atau membagikan pendapat Anda."
            actionLabel="Buat Topik Pertama"
            onAction={() => {
              setViewState('normal');
              setIsComposerOpen(true);
            }}
          />
        )}

        {/* State Data: Normal (Daftar Utas + Detail Utas & Balasan) */}
        {effectiveStatus === 'normal' && activeThread && (
          <div className="page-forum__layout">
            {/* Daftar Utas Diskusi */}
            <aside
              className="page-forum__thread-list"
              aria-label="Daftar topik diskusi kelas"
            >
              <h2 className="page-forum__list-heading">
                Daftar Topik ({filteredThreads.length})
              </h2>

              <div className="page-forum__thread-items">
                {filteredThreads.map((item) => {
                  const isSelected = item.id === activeThread.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`page-forum__thread-btn ${
                        isSelected ? 'page-forum__thread-btn--active' : ''
                      }`}
                      aria-current={isSelected ? 'true' : undefined}
                      onClick={() => {
                        setSelectedThreadId(item.id);
                        setReplyError('');
                        setStatusNotice('');
                      }}
                    >
                      <div className="page-forum__thread-btn-top">
                        <Badge
                          tone={item.authorRole === 'Dosen' ? 'utama' : 'info'}
                        >
                          {item.topicTag} · {item.authorRole}
                        </Badge>
                        <span className="page-forum__reply-count">
                          <MessageIcon />
                          <span>{item.replies.length}</span>
                        </span>
                      </div>

                      <span className="page-forum__thread-btn-title">
                        {item.title}
                      </span>

                      <span className="page-forum__thread-btn-meta">
                        {item.authorName} · {item.postedAt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Detail Utas Aktif + Balasan + Form Kirim Balasan (Sesuai E11 - Forum Diskusi.pdf) */}
            <section
              className="page-forum__detail"
              aria-labelledby="active-thread-title"
            >
              <article className="page-forum__card page-forum__post">
                <div className="page-forum__post-badges">
                  <Badge
                    tone={
                      activeThread.authorRole === 'Dosen' ? 'utama' : 'info'
                    }
                  >
                    Topik {activeThread.topicTag} · {activeThread.authorRole}
                  </Badge>
                </div>

                <h2 id="active-thread-title" className="page-forum__post-title">
                  {activeThread.title}
                </h2>

                <div className="page-forum__author-row">
                  <span
                    className={`page-forum__avatar ${
                      activeThread.authorRole === 'Dosen'
                        ? 'page-forum__avatar--dosen'
                        : ''
                    }`}
                    aria-hidden="true"
                  >
                    {getInitials(activeThread.authorName)}
                  </span>
                  <div className="page-forum__author-meta">
                    <span className="page-forum__author-name">
                      {activeThread.authorName}
                    </span>
                    <span className="page-forum__author-time">
                      {activeThread.postedAt}
                    </span>
                  </div>
                </div>

                <p className="page-forum__post-body">{activeThread.content}</p>
              </article>

              {/* Daftar Balasan Komentar */}
              <div className="page-forum__replies-section">
                <h3 className="page-forum__section-title">
                  Balasan Mahasiswa ({activeThread.replies.length})
                </h3>

                {activeThread.replies.length > 0 ? (
                  <ul className="page-forum__replies-list">
                    {activeThread.replies.map((reply) => (
                      <li key={reply.id} className="page-forum__reply-card">
                        <div className="page-forum__reply-head">
                          <div className="page-forum__author-row">
                            <span
                              className={`page-forum__avatar page-forum__avatar--sm ${
                                reply.authorRole === 'Dosen'
                                  ? 'page-forum__avatar--dosen'
                                  : ''
                              }`}
                              aria-hidden="true"
                            >
                              {getInitials(reply.authorName)}
                            </span>
                            <div className="page-forum__author-meta">
                              <span className="page-forum__author-name">
                                {reply.authorName}
                              </span>
                              <span className="page-forum__author-time">
                                {reply.postedAt}
                              </span>
                            </div>
                          </div>

                          <Badge
                            tone={
                              reply.authorRole === 'Dosen' ? 'utama' : 'netral'
                            }
                          >
                            {reply.authorRole}
                          </Badge>
                        </div>

                        <p className="page-forum__reply-body">
                          {reply.content}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="page-forum__replies-empty">
                    Belum ada balasan pada topik ini. Jadilah yang pertama
                    memberikan tanggapan.
                  </p>
                )}
              </div>

              {/* Form Kirim Balasan Baru (1 Tombol Primer di Layar) */}
              <form
                className="page-forum__card page-forum__reply-form"
                onSubmit={handleSendReply}
                noValidate
              >
                <div className="page-forum__textarea-group">
                  <Label htmlFor="forum-reply-input">
                    Balasan Diskusi Anda
                  </Label>
                  <textarea
                    id="forum-reply-input"
                    rows={3}
                    className={`page-forum__textarea ${
                      replyError ? 'page-forum__textarea--error' : ''
                    }`}
                    placeholder="Tulis balasan diskusi Anda..."
                    value={replyText}
                    aria-invalid={replyError ? 'true' : undefined}
                    onChange={(event) => {
                      setReplyText(event.target.value);
                      if (replyError) setReplyError('');
                    }}
                  />
                  {replyError && (
                    <p className="page-forum__field-error" role="alert">
                      {replyError}
                    </p>
                  )}
                </div>

                <div className="page-forum__reply-actions">
                  <Button
                    type="submit"
                    variant="primer"
                    fullWidthMobile
                    leftIcon={<SendIcon />}
                  >
                    Kirim Balasan
                  </Button>

                  <Button
                    type="button"
                    variant="sekunder"
                    fullWidthMobile
                    onClick={onBack}
                  >
                    Kembali ke Halaman Kelas
                  </Button>
                </div>
              </form>
            </section>
          </div>
        )}

        {/* Panel Simulasi 4 State E11 */}
        <aside
          className="page-forum__demo-bar"
          aria-label="Simulasi 4 keadaan data halaman E11 Forum Diskusi"
        >
          <span className="page-forum__demo-label">Simulasi State E11:</span>
          <div className="page-forum__demo-actions">
            {[
              { key: 'normal', label: 'Normal' },
              { key: 'loading', label: 'Loading' },
              { key: 'empty', label: 'Kosong' },
              { key: 'error', label: 'Galat' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                className={`page-forum__demo-btn ${
                  viewState === item.key ? 'page-forum__demo-btn--active' : ''
                }`}
                aria-pressed={viewState === item.key}
                onClick={() => {
                  setViewState(item.key);
                  setStatusNotice('');
                }}
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