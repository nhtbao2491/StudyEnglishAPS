import { useState, useRef, useCallback } from "react";
import Icon from "../components/Icons";
import { useVocab } from "../context/VocabContext";
import AddWordModal from "../components/AddWordModal";
import AddCategoryModal from "../components/AddCategoryModal";
import styles from "../styles/VocabList.module.css";

const PRIORITY_COLORS = {
  High: "badge-high",
  Medium: "badge-medium",
  Low: "badge-low",
};
const STATUS_COLORS = {
  Completed: "badge-completed",
  "In Progress": "badge-inprogress",
  Started: "badge-started",
};

export default function VocabList() {
  const { vocabList, categories, deleteWord } = useVocab();
  const [showAddWord, setShowAddWord] = useState(false);
  const [showAddCat, setShowAddCat] = useState(false);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterTopic, setFilterTopic] = useState("All");
  const [editWord, setEditWord] = useState(null);
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
    const x = e.pageX - el.offsetLeft;
    const y = e.pageY - el.offsetTop;
    el.scrollLeft = scrollLeft.current - (x - startX.current);
    // el.scrollTop = scrollTop.current - (y - startY.current);
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    tableRef.current?.classList.remove(styles.dragging);
  }, []);

  const filtered = vocabList.filter((v) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      v.word.toLowerCase().includes(q) ||
      v.meaning.toLowerCase().includes(q);
    const matchPriority =
      filterPriority === "All" || v.priority === filterPriority;
    const matchStatus = filterStatus === "All" || v.status === filterStatus;
    const matchTopic = filterTopic === "All" || v.topic === filterTopic;
    return matchSearch && matchPriority && matchStatus && matchTopic;
  });

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>📚 Vocab List</h1>
          <p className={styles.sub}>
            Total: <b>{vocabList.length}</b> words
          </p>
        </div>
        <div className={styles.headerBtns}>
          <button
            className={styles.btnSecondary}
            onClick={() => setShowAddCat(true)}
          >
            <Icon name="tag" size={13} color="var(--green-dark)" /> Add Category
          </button>
          <button
            className={styles.btnPrimary}
            onClick={() => {
              setEditWord(null);
              setShowAddWord(true);
            }}
          >
            <Icon name="plus" size={13} color="white" /> New Word
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        <div
          className={styles.statPill}
          style={{ background: "#fde8e8", color: "#c0392b" }}
        >
          High: <b>{vocabList.filter((v) => v.priority === "High").length}</b>
        </div>
        <div
          className={styles.statPill}
          style={{ background: "#fef3c7", color: "#b7791f" }}
        >
          Medium:{" "}
          <b>{vocabList.filter((v) => v.priority === "Medium").length}</b>
        </div>
        <div
          className={styles.statPill}
          style={{ background: "#d4edda", color: "#2d6a4f" }}
        >
          Low: <b>{vocabList.filter((v) => v.priority === "Low").length}</b>
        </div>
        <div
          className={styles.statPill}
          style={{ background: "#d1fae5", color: "#065f46" }}
        >
          Completed:{" "}
          <b>{vocabList.filter((v) => v.status === "Completed").length}</b>
        </div>
        <div
          className={styles.statPill}
          style={{ background: "#fef3c7", color: "#92400e" }}
        >
          In Progress:{" "}
          <b>{vocabList.filter((v) => v.status === "In Progress").length}</b>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>
            <Icon name="search" size={14} color="var(--text-light)" />
          </span>
          <input
            className={styles.searchInput}
            placeholder="Search word or meaning..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className={styles.select}
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="All">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          className={styles.select}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Started">Started</option>
        </select>
        <select
          className={styles.select}
          value={filterTopic}
          onChange={(e) => setFilterTopic(e.target.value)}
        >
          <option value="All">All Topics</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
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
              <th>Word</th>
              <th>Phonetic</th>
              <th>Part of Speech</th>
              <th>Meaning</th>
              <th>Definition</th>
              <th>Synonym</th>
              <th>Antonym</th>
              <th>Example</th>
              <th>Priority</th>
              <th>Topic</th>
              <th>Done?</th>
              <th>Score L30s</th>
              <th>Mastery</th>
              <th>Date Added</th>
              <th>Date Completed</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v, idx) => (
              <tr key={v.id} className={styles.row}>
                <td className={styles.num}>
                  <button
                    className={styles.speakBtn}
                    onClick={() => {
                      const u = new SpeechSynthesisUtterance(v.word);
                      u.lang = "en-US";
                      window.speechSynthesis.cancel();
                      window.speechSynthesis.speak(u);
                    }}
                    title={"Nghe phát âm: " + v.word}
                  >
                    <Icon name="speak" size={15} color="var(--green-dark)" />
                  </button>
                </td>
                <td className={styles.wordCell}>
                  <b>{v.word}</b>
                </td>
                <td className={styles.phonetic}>{v.phonetic}</td>
                <td>{v.pos}</td>
                <td className={styles.meaning}>{v.meaning}</td>
                <td className={styles.def}>{v.definition}</td>
                <td className={styles.green}>{v.synonym}</td>
                <td className={styles.red}>{v.antonym}</td>
                <td className={styles.example}>{v.example}</td>
                <td>
                  <span className={`tag ${PRIORITY_COLORS[v.priority]}`}>
                    {v.priority}
                  </span>
                </td>
                <td>{v.topic}</td>
                <td>
                  <span className={v.done ? styles.yes : styles.no}>
                    {v.done ? "Yes" : "No"}
                  </span>
                </td>
                <td className={styles.score}>{v.score}%</td>
                <td>
                  <span className={styles.masteryBadge} data-level={v.mastery}>
                    {v.mastery}
                  </span>
                </td>
                <td>{v.dateAdded}</td>
                <td>{v.dateCompleted || "-"}</td>
                <td>{v.duration} days</td>
                <td>
                  <span
                    className={`tag ${STATUS_COLORS[v.status]}`}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {v.status}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => {
                        setEditWord(v);
                        setShowAddWord(true);
                      }}
                    >
                      <Icon name="edit" size={14} color="#4a7c59" />
                    </button>
                    <button
                      className={styles.delBtn}
                      onClick={() => deleteWord(v.id)}
                    >
                      <Icon name="trash" size={14} color="#c0392b" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={19} className={styles.empty}>
                  No words found. Add your first word! 🌱
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddWord && (
        <AddWordModal
          word={editWord}
          categories={categories}
          onClose={() => {
            setShowAddWord(false);
            setEditWord(null);
          }}
        />
      )}
      {showAddCat && (
        <AddCategoryModal
          categories={categories}
          onAdd={addCategory}
          onClose={() => setShowAddCat(false)}
        />
      )}
    </div>
  );
}
