import { useState, useEffect } from 'react';
import Icon from './Icons';
import { useVocab } from '../context/VocabContext';
import styles from '../styles/Modal.module.css';

const DEFAULT = {
  word: '', phonetic: '', pos: 'Noun', meaning: '', definition: '',
  synonym: '', antonym: '', example: '', priority: 'Medium', topic: 'Nature',
  done: false, score: 0, mastery: 'Beginner',
  dateAdded: new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'2-digit', year:'2-digit' }),
  dateCompleted: '', duration: 0, status: 'Started'
};

export default function AddWordModal({ word, categories, onClose }) {
  const { addWord, updateWord } = useVocab();
  const [form, setForm] = useState(word ? { ...word } : { ...DEFAULT });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Tự động lấy phonetic + definition + meaning tiếng Việt
  useEffect(() => {
    const word = form.word.trim();
    if (!word) return;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        if (!res.ok) return;
        const data = await res.json();
        const phonetic = data[0]?.phonetic || data[0]?.phonetics?.find(p => p.text)?.text || '';
        if (phonetic) setForm(f => ({ ...f, phonetic }));
      } catch (_) {}
    }, 800);
    return () => clearTimeout(timer);
  }, [form.word]);
  const isEdit = !!word;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) updateWord(word.id, form);
    else addWord(form);
    onClose();
  };

  return (
    <div className={styles.overlay} >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{isEdit ? '✏️ Edit Word' : '➕ Add New Word'}</h2>
          <button className={styles.closeBtn} onClick={onClose}><Icon name="x" size={13} /></button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label>Word *</label>
              <input required value={form.word} onChange={e => set('word', e.target.value)} placeholder="e.g. Abundant" />
            </div>
            <div className={styles.field}>
              <label>Part of Speech</label>
              <select value={form.pos} onChange={e => set('pos', e.target.value)}>
                {['Noun','Verb','Adjective','Adverb','Preposition','Conjunction','Noun/Verb'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label>Phonetic <span className={styles.autoTag}>tự động</span></label>
            <input value={form.phonetic} readOnly className={styles.lockedInput} placeholder={form.word ? "Đang tra cứu..." : "Nhập từ để tự động điền"} tabIndex={-1} />
          </div>

          <div className={styles.field}>
            <label>Meaning (Vietnamese) *</label>
            <input
              required
              value={form.meaning}
              onChange={e => set('meaning', e.target.value)}
              placeholder="e.g. Dồi dào, phong phú"
            />
          </div>

          <div className={styles.field}>
            <label>Definition</label>
            <input
              value={form.definition}
              onChange={e => set('definition', e.target.value)}
              placeholder="e.g. Existing in large quantities; more than enough"
            />
          </div>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label>Synonym</label>
              <input value={form.synonym} onChange={e => set('synonym', e.target.value)} placeholder="e.g. Plentiful" />
            </div>
            <div className={styles.field}>
              <label>Antonym</label>
              <input value={form.antonym} onChange={e => set('antonym', e.target.value)} placeholder="e.g. Scarce" />
            </div>
          </div>

          <div className={styles.field}>
            <label>Example sentence</label>
            <input value={form.example} onChange={e => set('example', e.target.value)} placeholder="e.g. Water is abundant in this region." />
          </div>

          <div className={styles.grid3}>
            <div className={styles.field}>
              <label>Priority</label>
              <select value={form.priority} onChange={e => set('priority', e.target.value)}>
                {['High','Medium','Low'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label>Topic</label>
              <select value={form.topic} onChange={e => set('topic', e.target.value)}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                {['Started','In Progress','Completed'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.autoGroup}>
            <div className={styles.autoGroupTitle}>
              <span className={styles.autoTag}>TỰ ĐỘNG</span>
            </div>
            <div className={styles.grid3}>
              <div className={styles.field}>
                <label>Score L30s</label>
                <input value={`${form.score}%`} readOnly className={styles.lockedInput} tabIndex={-1} />
              </div>
              <div className={styles.field}>
                <label>Date Added</label>
                <input value={form.dateAdded} readOnly className={styles.lockedInput} tabIndex={-1} />
              </div>
              <div className={styles.field}>
                <label>Date Completed</label>
                <input value={form.dateCompleted || '—'} readOnly className={styles.lockedInput} tabIndex={-1} />
              </div>
            </div>
            <div className={styles.field} style={{marginTop: '10px'}}>
              <label>Mastery Level</label>
              <input value={form.mastery} readOnly className={styles.lockedInput} tabIndex={-1} />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn}>{isEdit ? 'Save Changes' : 'Add Word'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}