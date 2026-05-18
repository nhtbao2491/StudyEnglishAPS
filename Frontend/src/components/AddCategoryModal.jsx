import { useState } from 'react';
import Icon from './Icons';
import styles from '../styles/Modal.module.css';

export default function AddCategoryModal({ categories, onAdd, onClose }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Category name is required');
    if (categories.includes(name.trim())) return setError('Category already exists');
    onAdd(name.trim());
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modalSm}>
        <div className={styles.modalHeader}>
          <h2>🏷️ Add Category</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <Icon name="x" size={13} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Category Name *</label>
            <input
              required
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              placeholder="e.g. Science, History..."
              autoFocus
            />
            {error && <span className={styles.errMsg}>{error}</span>}
          </div>
          <div className={styles.existingList}>
            <p>Existing categories:</p>
            <div className={styles.tagList}>
              {categories.map(c => <span key={c} className={styles.catTag}>{c}</span>)}
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn}>Add Category</button>
          </div>
        </form>
      </div>
    </div>
  );
}