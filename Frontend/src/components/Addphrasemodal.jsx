import { useState } from 'react';
import { usePhrases } from '../context/PhrasesContext';
import Icon from './Icons';
import styles from '../styles/Modal.module.css';

const DEFAULT = {
  phrase: '', type: 'Idiom', meaning: '', example: '',
  level: 'Medium', topic: 'General', status: 'New',
};

export default function AddPhraseModal({ phrase, topics, onClose }) {
  const { addPhrase, updatePhrase } = usePhrases();
  const [form, setForm] = useState(phrase ? { ...phrase } : { ...DEFAULT });
  const isEdit = !!phrase;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) updatePhrase(phrase.id, form);
    else addPhrase(form);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{isEdit ? '✏️ Edit Phrase' : '➕ Add New Phrase'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <Icon name="x" size={13} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* Phrase + Type */}
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label>Phrase *</label>
              <input
                required
                value={form.phrase}
                onChange={e => set('phrase', e.target.value)}
                placeholder="e.g. Kick the bucket"
              />
            </div>
            <div className={styles.field}>
              <label>Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)}>
                <option>Idiom</option>
                <option>Phrasal Verb</option>
                <option>Collocation</option>
              </select>
            </div>
          </div>

          {/* Meaning */}
          <div className={styles.field}>
            <label>Meaning (Vietnamese) *</label>
            <input
              required
              value={form.meaning}
              onChange={e => set('meaning', e.target.value)}
              placeholder="e.g. Chết"
            />
          </div>

          {/* Example */}
          <div className={styles.field}>
            <label>Example sentence</label>
            <input
              value={form.example}
              onChange={e => set('example', e.target.value)}
              placeholder="e.g. He finally kicked the bucket."
            />
          </div>

          {/* Level + Topic + Status */}
          <div className={styles.grid3}>
            <div className={styles.field}>
              <label>Level</label>
              <select value={form.level} onChange={e => set('level', e.target.value)}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Topic</label>
              <select value={form.topic} onChange={e => set('topic', e.target.value)}>
                {topics.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                <option>New</option>
                <option>Learning</option>
                <option>Mastered</option>
              </select>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn}>
              {isEdit ? 'Save Changes' : 'Add Phrase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}