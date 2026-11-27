import { useEffect, useMemo, useState } from 'react';
import { Skeleton } from '../components/atoms';
import {
  EmptyState,
  ErrorState,
  FilterChipGroup,
  SearchBar,
  TaskItem,
} from '../components/molecules';
import { AppLayoutTemplate } from '../components/templates';
import { MOCK_TASKS } from '../data/mockElitagData';
import './TaskListPage.css';

const STATUS_FILTER_OPTIONS = [
  { value: 'semua', label: 'Semua Status' },
  { value: 'Belum Dikumpulkan', label: 'Belum Dikumpulkan' },
  { value: 'Sudah Dikumpulkan', label: 'Sudah Dikumpulkan' },
  { value: 'Terlambat', label: 'Terlambat' },
  { value: 'Dinilai', label: 'Dinilai' },
];

function TaskSkeletonCard() {
  return (
    <div className="page-tasks__skeleton-card" aria-hidden="true">
      <Skeleton variant="text" width="38%" height="16px" />
      <Skeleton variant="text" width="76%" height="22px" />
      <Skeleton variant="text" width="56%" height="16px" />
      <div className="page-tasks__skeleton-footer">
        <Skeleton variant="rect" width="120px" height="28px" />
        <Skeleton variant="rect" width="110px" height="44px" />
      </div>
    </div>
  );
}

export function TaskListPage({
  tasks = MOCK_TASKS,
  initialCourseFilter = '',
  logoSrc = '',
  onNavigate,
  onOpenTask,
  onOpenQuiz,
}) {
  const [viewState, setViewState] = useState('normal'); // 'normal' | 'loading' | 'empty' | 'error'
  const [activeTab, setActiveTab] = useState('mendatang'); // 'semua' | 'mendatang' | 'selesai'
  const [statusFilter, setStatusFilter] = useState('semua');
  const [searchQuery, setSearchQuery] = useState(initialCourseFilter);

  useEffect(() => {
    if (initialCourseFilter) {
      setSearchQuery(initialCourseFilter);
      setActiveTab('semua');
      setStatusFilter('semua');
    }
  }, [initialCourseFilter]);

  const tabCounts = useMemo(() => {
    const mendatang = tasks.filter((item) => item.tabGroup === 'mendatang').length;
    const selesai = tasks.filter((item) => item.tabGroup === 'selesai').length;
    return {
      semua: tasks.length,
      mendatang,
      selesai,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesTab =
        activeTab === 'semua' || task.tabGroup === activeTab;
      const matchesStatus =
        statusFilter === 'semua' || task.status === statusFilter;
      const matchesKeyword =
        !keyword ||
        task.title.toLowerCase().includes(keyword) ||
        task.courseName.toLowerCase().includes(keyword) ||
        task.status.toLowerCase().includes(keyword);

      return matchesTab && matchesStatus && matchesKeyword;
    });
  }, [tasks, activeTab, statusFilter, searchQuery]);

  function handleTabChange(nextTab) {
    setActiveTab(nextTab);
    setStatusFilter('semua');
    if (viewState !== 'normal') {
      setViewState('normal');
    }
  }

  function handleStatusFilterChange(nextStatus) {
    setStatusFilter(nextStatus);

    /* Selaraskan tab agar pengguna tidak tersesat saat memilih status dari grup lain */
    if (nextStatus === 'Belum Dikumpulkan' || nextStatus === 'Terlambat') {
      if (activeTab === 'selesai') setActiveTab('mendatang');
    } else if (nextStatus === 'Sudah Dikumpulkan' || nextStatus === 'Dinilai') {
      if (activeTab === 'mendatang') setActiveTab('selesai');
    }

    if (viewState !== 'normal') {
      setViewState('normal');
    }
  }

  function handleSearchChange(nextValue) {
    setSearchQuery(nextValue);
    if (viewState !== 'normal') {
      setViewState('normal');
    }
  }

  function handleResetFilters() {
    setActiveTab('semua');
    setStatusFilter('semua');
    setSearchQuery('');
    setViewState('normal');
  }

  function handleRetry() {
    setViewState('loading');
    window.setTimeout(() => {
      setViewState('normal');
    }, 600);
  }

  function handleTaskAction(task) {
    if (task.type === 'quiz') {
      onOpenQuiz?.(task);
    } else {
      onOpenTask?.(task);
    }
  }

  const hasActiveFilter =
    Boolean(searchQuery.trim()) ||
    statusFilter !== 'semua' ||
    activeTab !== 'semua';

  const effectiveStatus =
    viewState === 'normal' && filteredTasks.length === 0 ? 'empty' : viewState;

  return (
    <AppLayoutTemplate
      activeNav="tugas"
      onNavigate={onNavigate}
      logoSrc={logoSrc}
    >
      <div className="page-tasks">
        <header className="page-tasks__header">
          <div className="page-tasks__title-row">
            <h1 className="page-tasks__title">Daftar Tugas &amp; Tenggat</h1>

            <div className="page-tasks__search-wrap">
              <SearchBar
                id="tasks-search-input"
                value={searchQuery}
                placeholder="Cari mata kuliah atau tugas..."
                ariaLabel="Cari mata kuliah atau tugas"
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Tab Utama sesuai Desain Figma (Mendatang & Selesai + Semua) */}
          <div
            className="page-tasks__tabs"
            role="tablist"
            aria-label="Kelompok waktu tugas"
          >
            {[
              { key: 'mendatang', label: `Mendatang (${tabCounts.mendatang})` },
              { key: 'selesai', label: `Selesai (${tabCounts.selesai})` },
              { key: 'semua', label: `Semua (${tabCounts.semua})` },
            ].map((tab) => {
              const isSelected = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`page-tasks__tab ${
                    isSelected ? 'page-tasks__tab--active' : ''
                  }`}
                  onClick={() => handleTabChange(tab.key)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Filter Chip Status Pengerjaan */}
          <FilterChipGroup
            label="Filter status pengerjaan tugas"
            options={STATUS_FILTER_OPTIONS}
            selectedValue={statusFilter}
            onChange={handleStatusFilterChange}
          />
        </header>

        {/* Konten Daftar Tugas dalam 4 Keadaan Data */}
        <section
          className="page-tasks__content"
          aria-label="Daftar tugas dan kuis"
        >
          {effectiveStatus === 'loading' && (
            <div
              className="page-tasks__grid"
              aria-busy="true"
              aria-label="Memuat daftar tugas"
            >
              <TaskSkeletonCard />
              <TaskSkeletonCard />
              <TaskSkeletonCard />
            </div>
          )}

          {effectiveStatus === 'error' && (
            <ErrorState
              title="Daftar Tugas Gagal Dimuat"
              description="Periksa koneksi internet Anda lalu coba beberapa saat lagi."
              actionLabel="Coba Lagi"
              onRetry={handleRetry}
            />
          )}

          {effectiveStatus === 'empty' && (
            <EmptyState
              title="Tidak ada tugas atau kuis"
              description={
                viewState === 'empty'
                  ? 'Tidak ada tugas atau kuis yang menunggu saat ini.'
                  : 'Tidak ada tugas yang cocok dengan filter atau pencarian saat ini.'
              }
              actionLabel={
                viewState !== 'empty' && hasActiveFilter
                  ? 'Tampilkan Semua Tugas'
                  : ''
              }
              onAction={
                viewState !== 'empty' && hasActiveFilter
                  ? handleResetFilters
                  : undefined
              }
            />
          )}

          {effectiveStatus === 'normal' && (
            <div className="page-tasks__grid">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onAction={handleTaskAction}
                />
              ))}
            </div>
          )}
        </section>

        {/* Panel Simulasi 4 State E07 */}
        <aside
          className="page-tasks__demo-bar"
          aria-label="Simulasi 4 keadaan data halaman E07 Daftar Tugas"
        >
          <span className="page-tasks__demo-label">Simulasi State E07:</span>
          <div className="page-tasks__demo-actions">
            {[
              { key: 'normal', label: 'Normal' },
              { key: 'loading', label: 'Loading' },
              { key: 'empty', label: 'Kosong' },
              { key: 'error', label: 'Galat' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                className={`page-tasks__demo-btn ${
                  viewState === item.key ? 'page-tasks__demo-btn--active' : ''
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