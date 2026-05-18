import { useState, useRef, useCallback } from 'react';
import { usePhrases } from '../context/PhrasesContext';
import AddPhraseModal from '../components/AddPhraseModal';
import AddCategoryModal from '../components/AddCategoryModal';
import Icon from '../components/Icons';
import styles from '../styles/Phrases.module.css';

const TYPES = ['All', 'Idiom', 'Phrasal Verb', 'Collocation'];
const TYPE_COLORS = {
  'Idiom':        { bg: '#fde8e8', color: '#c0392b' },
  'Phrasal Verb': { bg: '#fef3c7', color: '#b7791f' },
  'Collocation':  { bg: '#dbeafe', color: '#1d4ed8' },
};
const LEVEL_COLORS = {
  'Easy':   { bg: '#d1fae5', color: '#065f46' },
  'Medium': { bg: '#fef3c7', color: '#92400e' },
  'Hard':   { bg: '#fde8e8', color: '#c0392b' },
};
const STATUS_COLORS = {
  'Mastered': { bg: '#d1fae5', color: '#065f46' },
  'Learning': { bg: '#fef3c7', color: '#92400e' },
  'New':      { bg: '#f3f4f6', color: '#374151' },
};

export default function Phrases() {
  const { phrases, topics, addPhrase: _add, updatePhrase: _upd, deletePhrase, addTopic } = usePhrases();
  const [activeType, setActiveType] = useState('All');
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterTopic, setFilterTopic] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editPhrase, setEditPhrase] = useState(null);
  const [showAddCat, setShowAddCat] = useState(false);

  const tableRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);
  const scrollTop = useRef(0);

  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    const el = tableRef.current;
    isDragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    startY.current = e.pageY - el.offsetTop;
    scrollLeft.current = el.scrollLeft;
    scrollTop.current = el.scrollTop;
    el.classList.add(styles.dragging);
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const el = tableRef.current;
    el.scrollLeft = scrollLeft.current - (e.pageX - el.offsetLeft - startX.current);
    el.scrollTop = scrollTop.current - (e.pageY - el.offsetTop - startY.current);
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    tableRef.current?.classList.remove(styles.dragging);
  }, []);

  const filtered = phrases.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !search || p.phrase.toLowerCase().includes(q) || p.meaning.toLowerCase().includes(q);
    const matchType = activeType === 'All' || p.type === activeType;
    const matchLevel = filterLevel === 'All' || p.level === filterLevel;
    const matchStatus = filterStatus === 'All' || p.status === filterStatus;
    const matchTopic = filterTopic === 'All' || p.topic === filterTopic;
    return matchSearch && matchType && matchLevel && matchStatus && matchTopic;
  });

  const counts = {
    All: phrases.length,
    Idiom: phrases.filter(p => p.type === 'Idiom').length,
    'Phrasal Verb': phrases.filter(p => p.type === 'Phrasal Verb').length,
    Collocation: phrases.filter(p => p.type === 'Collocation').length,
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>🧩 Phrases & Expressions</h1>
          <p className={styles.sub}>Total: <b>{phrases.length}</b> phrases</p>
        </div>
        <div style={{display:'flex', gap:'10px'}}>
          <button className={styles.btnSecondary} onClick={() => setShowAddCat(true)}>
            <Icon name="tag" size={13} color="var(--green-dark)" /> Add Category
          </button>
          <button className={styles.btnPrimary} onClick={() => { setEditPhrase(null); setShowModal(true); }}>
          <Icon name="plus" size={13} color="white" /> New Phrase
          </button>
        </div>
      </div>

      {/* Type tabs */}
      <div className={styles.tabs}>
        {TYPES.map(t => (
          <button
            key={t}
            className={`${styles.tab} ${activeType === t ? styles.tabActive : ''}`}
            onClick={() => setActiveType(t)}
            style={activeType === t && t !== 'All' ? {
              background: TYPE_COLORS[t]?.bg,
              color: TYPE_COLORS[t]?.color,
              borderColor: TYPE_COLORS[t]?.color + '44',
            } : {}}
          >
            {t}
            <span className={styles.tabCount}>{counts[t] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}><Icon name="search" size={14} color="var(--text-light)" /></span>
          <input
            className={styles.searchInput}
            placeholder="Search phrase or meaning..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className={styles.select} value={filterLevel} onChange={e => setFilterLevel(e.target.value)}>
          <option value="All">All Levels</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <select className={styles.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="All">All Status</option>
          <option>New</option>
          <option>Learning</option>
          <option>Mastered</option>
        </select>
        <select className={styles.select} value={filterTopic} onChange={e => setFilterTopic(e.target.value)}>
          <option value="All">All Topics</option>
          {topics.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Table */}
      <div
        className={styles.tableWrap}
        ref={tableRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <table className={styles.table}>
          <thead>
            <tr>
              <th>🔊</th>
              <th>Phrase</th>
              <th>Type</th>
              <th>Meaning (VI)</th>
              <th>Example</th>
              <th>Level</th>
              <th>Topic</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className={styles.row}>
                <td>
                  <button
                    className={styles.speakBtn}
                    onClick={() => {
                      const u = new SpeechSynthesisUtterance(p.phrase);
                      u.lang = 'en-US';
                      window.speechSynthesis.cancel();
                      window.speechSynthesis.speak(u);
                    }}
                    title={`Nghe: ${p.phrase}`}
                  >
                    <Icon name="speak" size={15} color="var(--green-dark)" />
                  </button>
                </td>
                <td className={styles.phraseCell}>{p.phrase}</td>
                <td>
                  <span className={styles.badge} style={{ background: TYPE_COLORS[p.type]?.bg, color: TYPE_COLORS[p.type]?.color }}>
                    {p.type}
                  </span>
                </td>
                <td className={styles.meaningCell}>{p.meaning}</td>
                <td className={styles.exampleCell}><i>{p.example}</i></td>
                <td>
                  <span className={styles.badge} style={{ background: LEVEL_COLORS[p.level]?.bg, color: LEVEL_COLORS[p.level]?.color }}>
                    {p.level}
                  </span>
                </td>
                <td>{p.topic}</td>
                <td>
                  <span className={styles.badge} style={{ background: STATUS_COLORS[p.status]?.bg, color: STATUS_COLORS[p.status]?.color, whiteSpace: 'nowrap' }}>
                    {p.status}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => { setEditPhrase(p); setShowModal(true); }}>
                      <Icon name="edit" size={14} color="#4a7c59" />
                    </button>
                    <button className={styles.delBtn} onClick={() => deletePhrase(p.id)}>
                      <Icon name="trash" size={14} color="#c0392b" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className={styles.empty}>No phrases found. Add your first phrase! 🧩</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddCat && (
        <AddCategoryModal
          categories={topics}
          onAdd={addTopic}
          onClose={() => setShowAddCat(false)}
        />
      )}
      {showModal && (
        <AddPhraseModal
          phrase={editPhrase}
          topics={topics}
          onClose={() => { setShowModal(false); setEditPhrase(null); }}
        />
      )}
    </div>
  );
}