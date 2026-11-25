import { useEffect, useMemo, useState } from 'react';
import { FilterChipGroup, SearchBar } from '../components/molecules';
import { SearchCourseList } from '../components/organisms';
import { AppLayoutTemplate } from '../components/templates';
import { MOCK_COURSE_CATALOG } from '../data/mockElitagData';
import './SearchCoursePage.css';

const CATEGORY_OPTIONS = [
  { value: 'semua', label: 'Semua' },
  { value: 'Wajib', label: 'Wajib' },
  { value: 'Pilihan', label: 'Pilihan' },
];

export function SearchCoursePage({
  initialQuery = '',
  enrolledCourseIds = [],
  logoSrc = '',
  onNavigate,
  onSelectCourse,
}) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [viewState, setViewState] = useState('normal'); // 'normal' | 'loading' | 'empty' | 'error'

  useEffect(() => {
    setQuery(initialQuery);
    setViewState('normal');
  }, [initialQuery]);

  const filteredCourses = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return MOCK_COURSE_CATALOG.filter((course) => {
      const matchesCategory =
        selectedCategory === 'semua' || course.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!keyword) return true;

      return (
        course.title.toLowerCase().includes(keyword) ||
        course.code.toLowerCase().includes(keyword) ||
        course.lecturer.toLowerCase().includes(keyword)
      );
    });
  }, [query, selectedCategory]);

  function handleQueryChange(nextValue) {
    setQuery(nextValue);
    if (viewState !== 'normal') {
      setViewState('normal');
    }
  }

  function handleCategoryChange(nextCategory) {
    setSelectedCategory(nextCategory);
    if (viewState !== 'normal') {
      setViewState('normal');
    }
  }

  function handleResetSearch() {
    setQuery('');
    setSelectedCategory('semua');
    setViewState('normal');
  }

  function handleRetry() {
    setViewState('loading');
    window.setTimeout(() => {
      setViewState('normal');
    }, 700);
  }

  /* Helper simulasi 4 state sesuai file desain Figma E03 */
  function applySimulation(mode) {
    if (mode === 'normal') {
      setQuery('');
      setSelectedCategory('semua');
      setViewState('normal');
    } else if (mode === 'loading') {
      setQuery('');
      setViewState('loading');
    } else if (mode === 'empty') {
      setQuery('Pemweb');
      setSelectedCategory('semua');
      setViewState('empty');
    } else if (mode === 'error') {
      setQuery('Pemweb');
      setViewState('error');
    }
  }

  const effectiveStatus =
    viewState === 'normal' && filteredCourses.length === 0
      ? 'empty'
      : viewState;

  return (
    <AppLayoutTemplate
      activeNav="cari"
      onNavigate={onNavigate}
      logoSrc={logoSrc}
    >
      <div className="page-search">
        <header className="page-search__header">
          <h1 className="page-search__title">Cari Mata Kuliah</h1>

          <div className="page-search__controls">
            <div className="page-search__bar">
              <SearchBar
                id="catalog-search-input"
                value={query}
                placeholder="Ketik kode atau nama mata kuliah..."
                ariaLabel="Ketik kode atau nama mata kuliah"
                onChange={handleQueryChange}
                onSubmit={() => setViewState('normal')}
              />
            </div>

            <FilterChipGroup
              label="Filter jenis mata kuliah"
              options={CATEGORY_OPTIONS}
              selectedValue={selectedCategory}
              onChange={handleCategoryChange}
            />
          </div>
        </header>

        <SearchCourseList
          status={effectiveStatus}
          courses={filteredCourses}
          enrolledIds={enrolledCourseIds}
          hasActiveFilter={Boolean(query.trim()) || selectedCategory !== 'semua'}
          onSelectCourse={onSelectCourse}
          onResetSearch={handleResetSearch}
          onRetry={handleRetry}
        />

        {/* Panel Simulasi 4 State E03 untuk pengujian & demo EAS */}
        <aside
          className="page-search__demo-bar"
          aria-label="Simulasi 4 keadaan data halaman E03 Cari Mata Kuliah"
        >
          <span className="page-search__demo-label">Simulasi State E03:</span>
          <div className="page-search__demo-actions">
            {[
              { key: 'normal', label: 'Normal' },
              { key: 'loading', label: 'Loading' },
              { key: 'empty', label: 'Kosong' },
              { key: 'error', label: 'Galat' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                className={`page-search__demo-btn ${
                  viewState === item.key ? 'page-search__demo-btn--active' : ''
                }`}
                aria-pressed={viewState === item.key}
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