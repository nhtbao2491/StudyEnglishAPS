import { useState, useCallback } from 'react';
import { useVocab } from '../context/VocabContext';
import styles from '../styles/VocabTest.module.css';

export default function VocabTest() {
  const { vocabList } = useVocab();
  const [lang, setLang] = useState('Vietnamese');
  const [currentWord, setCurrentWord] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [userAnswer, setUserAnswer] = useState({ pos: '', meaning: '', synonym: '' });
  const [quizActive, setQuizActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const getRandomWord = useCallback(() => {
    const pool = vocabList.filter(v => !answers.some(a => a.vocab === v.word));
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [vocabList, answers]);

  const startQuiz = () => {
    setAnswers([]);
    setScore(null);
    setSubmitted(false);
    const w = getRandomWord();
    setCurrentWord(w);
    setUserAnswer({ pos: '', meaning: '', synonym: '' });
    setQuizActive(true);
  };

  const handleRandomWord = () => {
    const w = getRandomWord();
    if (!w) return;
    setCurrentWord(w);
    setUserAnswer({ pos: '', meaning: '', synonym: '' });
  };

  const handleAnswer = () => {
    if (!currentWord) return;
    const isCorrect =
      userAnswer.pos.toLowerCase().trim() === currentWord.pos.toLowerCase() &&
      userAnswer.meaning.toLowerCase().trim() === currentWord.meaning.toLowerCase();

    const newAnswer = {
      vocab: currentWord.word,
      check: isCorrect ? 'TRUE' : 'FALSE',
      yourPos: userAnswer.pos,
      yourMeaning: userAnswer.meaning,
      yourSynonym: userAnswer.synonym,
      correctPos: currentWord.pos,
      correctMeaning: currentWord.meaning,
      correctSynonym: currentWord.synonym,
    };
    const updated = [...answers, newAnswer];
    setAnswers(updated);
    setUserAnswer({ pos: '', meaning: '', synonym: '' });
    const next = vocabList.filter(v => !updated.some(a => a.vocab === v.word));
    if (next.length > 0) {
      setCurrentWord(next[Math.floor(Math.random() * next.length)]);
    } else {
      setCurrentWord(null);
    }
  };

  const handleSubmit = () => {
    const trueCount = answers.filter(a => a.check === 'TRUE').length;
    setScore({ total: answers.length, correct: trueCount });
    setSubmitted(true);
    setQuizActive(false);
  };

  const handleClear = () => {
    setAnswers([]);
    setCurrentWord(null);
    setQuizActive(false);
    setSubmitted(false);
    setScore(null);
  };

  return (
    <div className={styles.page}>
      <div className={styles.titleBar}>
        <div className={styles.birdLeft}>🐦</div>
        <h1 className={styles.title}>Vocab Test</h1>
        <div className={styles.birdRight}>🐦</div>
      </div>

      <div className={styles.card}>
        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.controlRow}>
            <div className={styles.langWrap}>
              <span className={styles.langLabel}>Answer Language</span>
              <select className={styles.langSelect} value={lang} onChange={e => setLang(e.target.value)}>
                <option>Vietnamese</option>
                <option>English</option>
              </select>
            </div>
            <div className={styles.quizTitle}>Vocabulary Quiz</div>
            <button className={styles.quizBtn} onClick={quizActive ? handleSubmit : startQuiz}>
              {quizActive ? 'Submit' : 'Quiz & Submit'}
            </button>
          </div>

          {/* Random Word */}
          <div className={styles.testRow}>
            <button className={styles.randomBtn} onClick={handleRandomWord} disabled={!quizActive}>
              Random Word
            </button>
            <div className={styles.wordDisplay}>
              {currentWord ? currentWord.word : <span className={styles.placeholder}>Press "Quiz & Submit" to start</span>}
            </div>
          </div>

          {/* Answer Row */}
          {quizActive && currentWord && (
            <div className={styles.answerRow}>
              <div className={styles.answerLabel}>Answer</div>
              <div className={styles.answerFields}>
                <div className={styles.answerField}>
                  <span>Part of Speech</span>
                  <input value={userAnswer.pos} onChange={e => setUserAnswer(a => ({ ...a, pos: e.target.value }))} placeholder="Noun / Verb..." />
                </div>
                <div className={styles.answerField}>
                  <span>Meaning</span>
                  <input value={userAnswer.meaning} onChange={e => setUserAnswer(a => ({ ...a, meaning: e.target.value }))} placeholder="Vietnamese meaning..." />
                </div>
                <div className={styles.answerField}>
                  <span>Synonym</span>
                  <input value={userAnswer.synonym} onChange={e => setUserAnswer(a => ({ ...a, synonym: e.target.value }))} placeholder="Synonym..." />
                </div>
              </div>
              <button className={styles.confirmBtn} onClick={handleAnswer}>✓ Confirm</button>
            </div>
          )}
        </div>

        {/* Score bar */}
        <div className={styles.scoreBar}>
          <button className={styles.clearBtn} onClick={handleClear}>Clear & Save</button>
          <div className={styles.checkResult}>
            {submitted && score
              ? `Score: ${score.correct}/${score.total} (${Math.round(score.correct / score.total * 100)}%)`
              : 'Check Result Now!'}
          </div>
          <div className={styles.progress}>{answers.length} / {vocabList.length}</div>
        </div>

        {/* Results Table */}
        {answers.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th rowSpan={2}>Vocab</th>
                  <th rowSpan={2}>Check</th>
                  <th colSpan={3} className={styles.yourCol}>Your Answer</th>
                  <th colSpan={3} className={styles.correctCol}>Correct Answer</th>
                </tr>
                <tr>
                  <th>Part of Speech</th>
                  <th>Meaning</th>
                  <th>Synonym</th>
                  <th>Part of Speech</th>
                  <th>Meaning</th>
                  <th>Synonym</th>
                </tr>
                <tr className={styles.subheader}>
                  <td>Từ vựng</td>
                  <td>Chấm</td>
                  <td>Loại từ</td>
                  <td>Dịch nghĩa</td>
                  <td>(Tiêu chí tự chọn)</td>
                  <td>Loại từ</td>
                  <td>Dịch nghĩa</td>
                  <td>(Tiêu chí tự chọn)</td>
                </tr>
              </thead>
              <tbody>
                {answers.map((a, i) => (
                  <tr key={i} className={a.check === 'TRUE' ? styles.trueRow : styles.falseRow}>
                    <td className={styles.vocabCell}>{a.vocab}</td>
                    <td>
                      <span className={a.check === 'TRUE' ? styles.trueTag : styles.falseTag}>{a.check}</span>
                    </td>
                    <td className={a.yourPos.toLowerCase() !== a.correctPos.toLowerCase() ? styles.wrong : ''}>{a.yourPos || '-'}</td>
                    <td>{a.yourMeaning || '-'}</td>
                    <td className={a.yourSynonym.toLowerCase() !== a.correctSynonym.toLowerCase() ? styles.wrong : ''}>{a.yourSynonym || '-'}</td>
                    <td>{a.correctPos}</td>
                    <td>{a.correctMeaning}</td>
                    <td>{a.correctSynonym}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
