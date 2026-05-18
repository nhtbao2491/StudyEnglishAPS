import { useState, useMemo } from 'react';
import { useVocab } from '../context/VocabContext';
import { usePhrases } from '../context/PhrasesContext';
import styles from '../styles/VocabReview.module.css';

const MONTHS = ['01','02','03','04','05','06','07','08','09','10','11','12'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const WEEKS = ['W1','W2','W3','W4'];
const YEARS = ['2024','2025','2026'];
const POS_OPTIONS = ['—','Noun','Verb','Adjective','Adverb','Noun/Verb','Phrasal Verb','Idiom','Collocation','Preposition'];

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

export default function VocabReview() {
  const { vocabList, categories } = useVocab();
  const { phrases, topics: phraseTopics } = usePhrases();
  const now = new Date();

  // ── SOURCE TAB ──
  const [sourceTab, setSourceTab] = useState('Vocab'); // 'Vocab' | 'Phrases'

  // ── PERIOD ──
  const [mode, setMode] = useState('Weekly');
  const [week, setWeek] = useState(`W${Math.ceil(now.getDate()/7)}`);
  const [month, setMonth] = useState(String(now.getMonth()+1).padStart(2,'0'));
  const [year, setYear] = useState(String(now.getFullYear()));

  // ── TOPIC FILTER ──
  const [selectedTopics, setSelectedTopics] = useState([]);
  const toggleTopic = (t) => setSelectedTopics(s => s.includes(t) ? s.filter(x=>x!==t) : [...s, t]);

  // ── GENERATED ROWS ──
  const [rows, setRows] = useState([]);
  const [generated, setGenerated] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const allTopics = sourceTab === 'Vocab' ? categories : phraseTopics;
  const allItems = sourceTab === 'Vocab'
    ? vocabList.map(v => ({ id: v.id, term: v.word, pos: v.pos, meaning: v.meaning, synonym: v.synonym }))
    : phrases.map(p => ({ id: p.id, term: p.phrase, pos: p.type, meaning: p.meaning, synonym: '' }));

  // Filter by topic
  const poolItems = useMemo(() => {
    let pool = allItems;
    if (selectedTopics.length > 0) {
      if (sourceTab === 'Vocab') pool = vocabList.filter(v => selectedTopics.includes(v.topic)).map(v => ({ id: v.id, term: v.word, pos: v.pos, meaning: v.meaning, synonym: v.synonym }));
      else pool = phrases.filter(p => selectedTopics.includes(p.topic)).map(p => ({ id: p.id, term: p.phrase, pos: p.type, meaning: p.meaning, synonym: '' }));
    }
    return pool;
  }, [allItems, selectedTopics, sourceTab, vocabList, phrases]);

  const handleGenerate = () => {
    const shuffled = shuffle(poolItems);
    setRows(shuffled.map(item => ({
      ...item,
      userPos: '—',
      userMeaning: '',
      userSynonym: '',
      result: null,
    })));
    setGenerated(true);
    setSubmitted(false);
  };

  const updateRow = (i, field, val) => {
    setRows(r => { const c=[...r]; c[i]={...c[i],[field]:val}; return c; });
  };

  const handleCheck = () => {
    setRows(r => r.map(row => {
      const posOk = row.userPos !== '—' && row.userPos.toLowerCase() === row.pos.toLowerCase();
      const meanOk = row.userMeaning.trim().toLowerCase() === row.meaning.trim().toLowerCase();
      return { ...row, result: (posOk && meanOk) ? 'TRUE' : 'FALSE' };
    }));
    setSubmitted(true);
  };

  const handleReset = () => { setRows([]); setGenerated(false); setSubmitted(false); };

  const trueCount = rows.filter(r=>r.result==='TRUE').length;
  const falseCount = rows.filter(r=>r.result==='FALSE').length;
  const scorePercent = submitted && rows.length > 0 ? Math.round(trueCount/rows.length*100) : 0;

  const periodLabel = mode === 'Weekly'
    ? `${week} – ${MONTH_NAMES[parseInt(month)-1]} ${year}`
    : `${MONTH_NAMES[parseInt(month)-1]} ${year}`;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{mode} Vocab Review</h1>
      <p className={styles.subtitle}>📅 Kiểm tra từ vựng {mode==='Weekly'?'hàng tuần':'hàng tháng'} – {periodLabel}</p>

      {/* Source tab */}
      <div className={styles.sourceTabs}>
        {['Vocab','Phrases'].map(t => (
          <button key={t} className={`${styles.sourceTab} ${sourceTab===t?styles.sourceTabActive:''}`}
            onClick={() => { setSourceTab(t); setRows([]); setGenerated(false); setSubmitted(false); setSelectedTopics([]); }}>
            {t==='Vocab'?'📚':'🧩'} {t}
          </button>
        ))}
      </div>

      {/* Settings row */}
      <div className={styles.settingsCard}>
        {/* Mode */}
        <div className={styles.settingGroup}>
          <span className={styles.settingLabel}>Chế độ</span>
          <div className={styles.modeRow}>
            {['Weekly','Monthly'].map(m => (
              <button key={m} className={`${styles.modeBtn} ${mode===m?styles.modeActive:''}`}
                onClick={() => { setMode(m); setGenerated(false); setSubmitted(false); }}>
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Period */}
        <div className={styles.settingGroup}>
          <span className={styles.settingLabel}>Thời gian</span>
          <div className={styles.periodGroup}>
            {mode==='Weekly' && <>
              <select className={styles.periodSelect} value={week} onChange={e=>setWeek(e.target.value)}>
                {WEEKS.map(w=><option key={w}>{w}</option>)}
              </select>
              <span className={styles.periodSep}>/</span>
            </>}
            <select className={styles.periodSelect} value={month} onChange={e=>setMonth(e.target.value)}>
              {MONTHS.map((m,i)=><option key={m} value={m}>{MONTH_NAMES[i]}</option>)}
            </select>
            <span className={styles.periodSep}>/</span>
            <select className={styles.periodSelect} value={year} onChange={e=>setYear(e.target.value)}>
              {YEARS.map(y=><option key={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* Topic filter */}
        <div className={styles.settingGroup} style={{flex:1}}>
          <span className={styles.settingLabel}>Topic (bỏ trống = tất cả)</span>
          <div className={styles.topicList}>
            {allTopics.map(t => (
              <button key={t}
                className={`${styles.topicBtn} ${selectedTopics.includes(t)?styles.topicActive:''}`}
                onClick={() => toggleTopic(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Generate */}
        <button className={styles.generateBtn} onClick={handleGenerate}>
          🎲 Generate ({poolItems.length} từ)
        </button>
      </div>

      {/* Score bar */}
      {submitted && (
        <div className={styles.scoreSummary}>
          <div className={styles.scoreItem}><span>Score</span><b>{scorePercent}%</b></div>
          <div className={styles.scoreItem} style={{color:'#065f46'}}><span>✅ TRUE</span><b>{trueCount}</b></div>
          <div className={styles.scoreItem} style={{color:'#c0392b'}}><span>❌ FALSE</span><b>{falseCount}</b></div>
          <div className={styles.scoreItem}><span>📝 Tổng</span><b>{rows.length}</b></div>
        </div>
      )}

      {/* Table */}
      {generated && rows.length > 0 && (
        <div className={styles.tableSection}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{width:80}}>Check</th>
                <th>Term</th>
                <th>Word Type</th>
                <th>Meaning (VI)</th>
                <th>Synonym</th>
                {submitted && <th className={styles.correctHead}>Correct Answer</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((r,i) => (
                <tr key={r.id} className={submitted ? (r.result==='TRUE' ? styles.trueRow : styles.falseRow) : ''}>
                  <td className={styles.checkCell}>
                    <span className={`${styles.checkTag} ${submitted ? (r.result==='TRUE' ? styles.trueTag : styles.falseTag) : styles.pendingTag}`}>
                      {submitted ? r.result : '—'}
                    </span>
                  </td>
                  <td className={styles.termCell}>{r.term}</td>
                  <td>
                    <select
                      className={styles.posSelect}
                      value={r.userPos}
                      onChange={e => updateRow(i,'userPos',e.target.value)}
                      disabled={submitted}
                    >
                      {POS_OPTIONS.map(p=><option key={p}>{p}</option>)}
                    </select>
                  </td>
                  <td>
                    <input
                      className={`${styles.cellInput} ${submitted && r.result==='FALSE' ? styles.wrongInput : ''}`}
                      value={r.userMeaning}
                      onChange={e => updateRow(i,'userMeaning',e.target.value)}
                      placeholder="Nhập nghĩa tiếng Việt..."
                      disabled={submitted}
                    />
                  </td>
                  <td>
                    <input
                      className={styles.cellInput}
                      value={r.userSynonym}
                      onChange={e => updateRow(i,'userSynonym',e.target.value)}
                      placeholder="Synonym..."
                      disabled={submitted}
                    />
                  </td>
                  {submitted && (
                    <td className={styles.correctCell}>
                      <div><b>{r.pos}</b> · {r.meaning}{r.synonym ? ` · ${r.synonym}` : ''}</div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {generated && rows.length === 0 && (
        <div className={styles.emptyState}>Không có từ nào trong bộ lọc này. Thử chọn topic khác!</div>
      )}

      {/* Buttons */}
      {generated && (
        <div className={styles.btnRow}>
          <button className={styles.clearBtn} onClick={handleReset}>🗑 Reset</button>
          {!submitted
            ? <button className={styles.submitBtn} onClick={handleCheck} disabled={rows.length===0}>✓ Check Result</button>
            : <button className={styles.generateBtn} onClick={handleGenerate}>🎲 Làm lại (random mới)</button>
          }
        </div>
      )}
    </div>
  );
}