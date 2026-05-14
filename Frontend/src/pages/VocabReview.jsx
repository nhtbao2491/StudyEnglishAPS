import { useState } from 'react';
import { useVocab } from '../context/VocabContext';
import styles from '../styles/VocabReview.module.css';

const MODES = ['Weekly', 'Monthly'];

export default function VocabReview() {
  const { vocabList } = useVocab();
  const [mode, setMode] = useState('Weekly');
  const [period, setPeriod] = useState('');
  const [rows, setRows] = useState(
    Array(8).fill(null).map(() => ({ vocab: '', check: '', wordType: '', meaning: '', synonym: '' }))
  );
  const [submitted, setSubmitted] = useState(false);

  const now = new Date();
  const defaultPeriod = mode === 'Weekly'
    ? `W${Math.ceil(now.getDate() / 7)}/${now.getFullYear()}`
    : `${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

  const updateRow = (i, field, val) => {
    setRows(r => {
      const copy = [...r];
      copy[i] = { ...copy[i], [field]: val };
      return copy;
    });
  };

  const autoFill = (i, val) => {
    const found = vocabList.find(v => v.word.toLowerCase() === val.toLowerCase());
    if (found) {
      setRows(r => {
        const copy = [...r];
        copy[i] = {
          ...copy[i],
          vocab: found.word,
          wordType: found.pos,
          meaning: found.meaning,
          synonym: found.synonym,
        };
        return copy;
      });
    } else {
      updateRow(i, 'vocab', val);
    }
  };

  const filledRows = rows.filter(r => r.vocab.trim());

  const results = filledRows.map(r => {
    const found = vocabList.find(v => v.word.toLowerCase() === r.vocab.toLowerCase());
    if (!found) return { ...r, correct: { wordType: '?', meaning: '?', synonym: '?' }, isTrue: false };
    const posOk = r.wordType.toLowerCase().trim() === found.pos.toLowerCase().trim();
    const meanOk = r.meaning.toLowerCase().trim() === found.meaning.toLowerCase().trim();
    return {
      ...r,
      correct: { wordType: found.pos, meaning: found.meaning, synonym: found.synonym },
      isTrue: r.check === 'TRUE' || (posOk && meanOk),
      autoTrue: posOk && meanOk,
    };
  });

  const trueCount = results.filter(r => r.isTrue).length;
  const falseCount = results.filter(r => !r.isTrue).length;
  const scorePercent = results.length > 0 ? Math.round(trueCount / results.length * 100) : 0;

  const handleSubmit = () => setSubmitted(true);
  const handleClear = () => {
    setRows(Array(8).fill(null).map(() => ({ vocab: '', check: '', wordType: '', meaning: '', synonym: '' })));
    setSubmitted(false);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Monthly Vocab Review</h1>
      <p className={styles.subtitle}>
        📅 Kiểm tra từ vựng {mode === 'Weekly' ? 'hàng tuần' : 'hàng tháng'} – {period || defaultPeriod}
      </p>

      {/* Mode selector */}
      <div className={styles.modeRow}>
        {MODES.map(m => (
          <button
            key={m}
            className={`${styles.modeBtn} ${mode === m ? styles.modeActive : ''}`}
            onClick={() => { setMode(m); setSubmitted(false); }}
          >{m}</button>
        ))}
        <input
          className={styles.periodInput}
          placeholder={defaultPeriod}
          value={period}
          onChange={e => setPeriod(e.target.value)}
        />
      </div>

      {/* Score summary */}
      {submitted && (
        <div className={styles.scoreSummary}>
          <div className={styles.scoreBlock}>
            <span className={styles.scoreLabel}>Month</span>
            <span className={styles.scoreVal}>{period || defaultPeriod}</span>
          </div>
          <div className={styles.scoreBlock} style={{ flex: 2 }}>
            <div className={styles.scoreRow}>
              <div className={styles.scoreItem}>
                <span>Score</span>
                <b>{scorePercent}%</b>
              </div>
              <div className={styles.scoreItem} style={{ color: '#065f46' }}>
                <span>TRUE</span>
                <b>{trueCount}</b>
              </div>
              <div className={styles.scoreItem} style={{ color: '#c0392b' }}>
                <span>FALSE</span>
                <b>{falseCount}</b>
              </div>
            </div>
          </div>
          <div className={styles.scoreNote}>* ô tô đỏ là cảnh báo có thể k chính xác hoặc chưa đầy đủ so với đáp án</div>
        </div>
      )}

      {/* Main table */}
      <div className={styles.tableSection}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Check</th>
                <th>Vocabulary</th>
                <th colSpan={3} className={styles.yourHead}>Your Answer</th>
                {submitted && <th colSpan={3} className={styles.correctHead}>Correct Answer</th>}
              </tr>
              <tr className={styles.subHead}>
                <th>Đã thêm?</th>
                <th>Từ vựng lưu trữ</th>
                <th>Word Type <br/><small>Dịch nghĩa</small></th>
                <th>Meaning <br/><small>Nguồn từ vựng</small></th>
                <th>Synonym</th>
                {submitted && <>
                  <th>Word Type</th>
                  <th>Meaning</th>
                  <th>Synonym</th>
                </>}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const res = submitted ? results.find(x => x.vocab === r.vocab) : null;
                return (
                  <tr key={i} className={submitted && res ? (res.isTrue ? styles.trueRow : styles.falseRow) : ''}>
                    <td>
                      <select
                        className={`${styles.checkSel} ${r.check === 'TRUE' ? styles.trueCheck : r.check === 'FALSE' ? styles.falseCheck : ''}`}
                        value={r.check}
                        onChange={e => updateRow(i, 'check', e.target.value)}
                      >
                        <option value="">-</option>
                        <option value="TRUE">TRUE</option>
                        <option value="FALSE">FALSE</option>
                      </select>
                    </td>
                    <td>
                      <input
                        className={styles.vocabInput}
                        value={r.vocab}
                        onChange={e => autoFill(i, e.target.value)}
                        placeholder="Enter vocab..."
                        list={`vocab-list-${i}`}
                      />
                      <datalist id={`vocab-list-${i}`}>
                        {vocabList.map(v => <option key={v.id} value={v.word} />)}
                      </datalist>
                    </td>
                    <td>
                      <input
                        className={`${styles.cellInput} ${submitted && res && res.correct.wordType !== r.wordType ? styles.wrongCell : ''}`}
                        value={r.wordType}
                        onChange={e => updateRow(i, 'wordType', e.target.value)}
                        placeholder="Noun / Verb..."
                      />
                    </td>
                    <td>
                      <input
                        className={styles.cellInput}
                        value={r.meaning}
                        onChange={e => updateRow(i, 'meaning', e.target.value)}
                        placeholder="Meaning..."
                      />
                    </td>
                    <td>
                      <input
                        className={`${styles.cellInput} ${submitted && res && res.correct.synonym !== r.synonym ? styles.wrongCell : ''}`}
                        value={r.synonym}
                        onChange={e => updateRow(i, 'synonym', e.target.value)}
                        placeholder="Synonym..."
                      />
                    </td>
                    {submitted && res && <>
                      <td className={styles.correctCell}>{res.correct.wordType}</td>
                      <td className={styles.correctCell}>{res.correct.meaning}</td>
                      <td className={styles.correctCell}>{res.correct.synonym}</td>
                    </>}
                    {submitted && !res && <>
                      <td className={styles.correctCell}>-</td>
                      <td className={styles.correctCell}>-</td>
                      <td className={styles.correctCell}>-</td>
                    </>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buttons */}
      <div className={styles.btnRow}>
        <button className={styles.clearBtn} onClick={handleClear}>🗑 Clear & Reset</button>
        <button className={styles.addRowBtn} onClick={() => setRows(r => [...r, { vocab: '', check: '', wordType: '', meaning: '', synonym: '' }])}>
          + Add Row
        </button>
        <button className={styles.submitBtn} onClick={handleSubmit}>✓ Check Result</button>
      </div>
    </div>
  );
}
