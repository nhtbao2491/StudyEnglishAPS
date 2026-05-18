import { useState, useMemo } from 'react';
import { useVocab } from '../context/VocabContext';
import { usePhrases } from '../context/PhrasesContext';
import styles from '../styles/FlashCard.module.css';
import Icon from '../components/Icons';

const MODES = ['Vocab', 'Phrases'];
const QUESTION_TYPES = ['meaning', 'word'];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getWrongOptions(correct, allItems, field, count = 3) {
  const others = allItems.filter(i => i[field] !== correct);
  return shuffle(others).slice(0, count).map(i => i[field]);
}

export default function FlashCard() {
  const { vocabList } = useVocab();
  const { phrases } = usePhrases();

  const [mode, setMode] = useState('Vocab');
  const [questionType, setQuestionType] = useState('meaning'); // show word → pick meaning
  const [started, setStarted] = useState(false);
  const [deck, setDeck] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [finished, setFinished] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const allItems = useMemo(() => {
    if (mode === 'Vocab') return vocabList.map(v => ({ id: v.id, front: v.word, back: v.meaning, sub: v.phonetic }));
    return phrases.map(p => ({ id: p.id, front: p.phrase, back: p.meaning, sub: p.type }));
  }, [mode, vocabList, phrases]);

  const buildDeck = () => {
    const shuffled = shuffle(allItems);
    const built = shuffled.map(item => {
      const correctAnswer = questionType === 'meaning' ? item.back : item.front;
      const questionLabel = questionType === 'meaning' ? item.front : item.back;
      const wrongField = questionType === 'meaning' ? 'back' : 'front';
      const wrongs = getWrongOptions(correctAnswer, allItems, wrongField, 3);
      const options = shuffle([correctAnswer, ...wrongs]);
      return { ...item, questionLabel, correctAnswer, options };
    });
    setDeck(built);
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setScore({ correct: 0, wrong: 0 });
    setFinished(false);
    setFlipped(false);
    setStarted(true);
  };

  const handleSelect = (opt) => {
    if (revealed) return;
    setSelected(opt);
    setRevealed(true);
    setFlipped(true);
    if (opt === deck[current].correctAnswer) {
      setScore(s => ({ ...s, correct: s.correct + 1 }));
    } else {
      setScore(s => ({ ...s, wrong: s.wrong + 1 }));
    }
  };

  const handleNext = () => {
    if (current + 1 >= deck.length) {
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setRevealed(false);
      setFlipped(false);
    }
  };

  const card = deck[current];
  const progress = deck.length > 0 ? ((current + (revealed ? 1 : 0)) / deck.length) * 100 : 0;

  // ── FINISHED screen ──
  if (finished) {
    const total = score.correct + score.wrong;
    const pct = Math.round((score.correct / total) * 100);
    return (
      <div className={styles.page}>
        <div className={styles.finishWrap}>
          <div className={styles.finishCard}>
            <div className={styles.finishEmoji}>{pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📖'}</div>
            <h2 className={styles.finishTitle}>
              {pct >= 80 ? 'Xuất sắc!' : pct >= 50 ? 'Khá tốt!' : 'Cần luyện thêm!'}
            </h2>
            <div className={styles.finishScore}>{pct}%</div>
            <div className={styles.finishStats}>
              <div className={styles.finishStat} style={{ color: '#065f46', background: '#d1fae5' }}>
                <span>✅ Đúng</span><b>{score.correct}</b>
              </div>
              <div className={styles.finishStat} style={{ color: '#c0392b', background: '#fde8e8' }}>
                <span>❌ Sai</span><b>{score.wrong}</b>
              </div>
              <div className={styles.finishStat} style={{ color: '#1d4ed8', background: '#dbeafe' }}>
                <span>📝 Tổng</span><b>{total}</b>
              </div>
            </div>
            <div className={styles.finishBtns}>
              <button className={styles.btnSecondary} onClick={() => setStarted(false)}>← Về menu</button>
              <button className={styles.btnPrimary} onClick={buildDeck}>🔁 Làm lại</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── START screen ──
  if (!started) {
    return (
      <div className={styles.page}>
        <div className={styles.startWrap}>
          <div className={styles.startCard}>
            <div className={styles.startIcon}>⚡</div>
            <h1 className={styles.startTitle}>FlashCard</h1>
            <p className={styles.startSub}>Chọn chế độ và bắt đầu học!</p>

            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Nguồn từ vựng</label>
              <div className={styles.modeRow}>
                {MODES.map(m => (
                  <button
                    key={m}
                    className={`${styles.modeBtn} ${mode === m ? styles.modeBtnActive : ''}`}
                    onClick={() => setMode(m)}
                  >
                    {m === 'Vocab' ? '📚' : '🧩'} {m}
                    <span className={styles.modeCount}>
                      {m === 'Vocab' ? vocabList.length : phrases.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Dạng câu hỏi</label>
              <div className={styles.modeRow}>
                <button
                  className={`${styles.modeBtn} ${questionType === 'meaning' ? styles.modeBtnActive : ''}`}
                  onClick={() => setQuestionType('meaning')}
                >
                  Từ → Nghĩa
                </button>
                <button
                  className={`${styles.modeBtn} ${questionType === 'word' ? styles.modeBtnActive : ''}`}
                  onClick={() => setQuestionType('word')}
                >
                  Nghĩa → Từ
                </button>
              </div>
            </div>

            <div className={styles.infoRow}>
              <span>Số thẻ: <b>{allItems.length}</b></span>
            </div>

            <button className={styles.startBtn} onClick={buildDeck} disabled={allItems.length < 4}>
              {allItems.length < 4 ? 'Cần ít nhất 4 từ' : '🚀 Bắt đầu'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── QUIZ screen ──
  return (
    <div className={styles.page}>
      <div className={styles.quizWrap}>

        {/* Top bar */}
        <div className={styles.topBar}>
          <button className={styles.exitBtn} onClick={() => setStarted(false)}>
            <Icon name="x" size={14} /> Thoát
          </button>
          <div className={styles.progressWrap}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <span className={styles.progressText}>{current + 1} / {deck.length}</span>
          </div>
          <div className={styles.scorePills}>
            <span className={styles.scoreCorrect}>✅ {score.correct}</span>
            <span className={styles.scoreWrong}>❌ {score.wrong}</span>
          </div>
        </div>

        {/* Card */}
        <div className={`${styles.card} ${flipped ? styles.cardFlipped : ''}`}>
          <div className={styles.cardInner}>
            {/* Front */}
            <div className={styles.cardFront}>
              <div className={styles.cardSub}>{questionType === 'meaning' ? 'Từ này nghĩa là gì?' : 'Đây là nghĩa của từ nào?'}</div>
              <div className={styles.cardWord}>{card?.questionLabel}</div>
              {card?.sub && <div className={styles.cardPhonetic}>{card.sub}</div>}
              <button
                className={styles.speakBtn}
                onClick={() => {
                  const u = new SpeechSynthesisUtterance(card?.front);
                  u.lang = 'en-US';
                  window.speechSynthesis.cancel();
                  window.speechSynthesis.speak(u);
                }}
              >
                <Icon name="speak" size={18} color="var(--green-dark)" />
              </button>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className={styles.options}>
          {card?.options.map((opt, i) => {
            let state = '';
            if (revealed) {
              if (opt === card.correctAnswer) state = 'correct';
              else if (opt === selected) state = 'wrong';
              else state = 'dim';
            }
            return (
              <button
                key={i}
                className={`${styles.option} ${styles['option_' + state]}`}
                onClick={() => handleSelect(opt)}
                disabled={revealed}
              >
                <span className={styles.optionKey}>{['A', 'B', 'C', 'D'][i]}</span>
                <span className={styles.optionText}>{opt}</span>
                {revealed && opt === card.correctAnswer && <span className={styles.optionIcon}>✅</span>}
                {revealed && opt === selected && opt !== card.correctAnswer && <span className={styles.optionIcon}>❌</span>}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        {revealed && (
          <button className={styles.nextBtn} onClick={handleNext}>
            {current + 1 >= deck.length ? '🏁 Xem kết quả' : 'Tiếp theo →'}
          </button>
        )}
      </div>
    </div>
  );
}