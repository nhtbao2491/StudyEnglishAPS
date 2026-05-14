import { useVocab } from '../context/VocabContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, ResponsiveContainer, Legend } from 'recharts';
import styles from '../styles/Dashboard.module.css';

const COLORS_STATUS = ['#f9c6c6', '#fde68a', '#a8d5b5'];
const COLORS_PRIORITY = ['#f9c6c6', '#fde68a', '#a8d5b5'];
const COLORS_MASTERY = ['#f9c6c6', '#fde68a', '#c8e6d0', '#6aab7e'];

export default function Dashboard() {
  const { vocabList } = useVocab();

  const total = vocabList.length;
  const completed = vocabList.filter(v => v.status === 'Completed').length;
  const inProgress = vocabList.filter(v => v.status === 'In Progress').length;
  const started = vocabList.filter(v => v.status === 'Started').length;

  const high = vocabList.filter(v => v.priority === 'High').length;
  const medium = vocabList.filter(v => v.priority === 'Medium').length;
  const low = vocabList.filter(v => v.priority === 'Low').length;

  const mastery = vocabList.filter(v => v.mastery === 'Mastery').length;
  const advanced = vocabList.filter(v => v.mastery === 'Advanced').length;
  const intermediate = vocabList.filter(v => v.mastery === 'Intermediate').length;
  const beginner = vocabList.filter(v => v.mastery === 'Beginner').length;

  const statusData = [
    { name: 'Started', value: started },
    { name: 'In Progress', value: inProgress },
    { name: 'Completed', value: completed },
  ];

  const priorityData = [
    { name: 'Low', value: low },
    { name: 'Medium', value: medium },
    { name: 'High', value: high },
  ];

  const masteryData = [
    { name: 'Beginner', value: beginner },
    { name: 'Intermediate', value: intermediate },
    { name: 'Advanced', value: advanced },
    { name: 'Mastery', value: mastery },
  ];

  const weekData = [
    { week: 'W1', completed: 4, added: 23 },
    { week: 'W2', completed: 19, added: 25 },
    { week: 'W3', completed: 15, added: 2 },
  ];

  const monthData = [
    { month: 'Jan', completed: 21, added: 60 },
    { month: 'Feb', completed: 28, added: 50 },
    { month: 'Mar', completed: 35, added: 40 },
  ];

  const reviewWords = vocabList.slice(0, 8).map(v => v.word);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard <span>🌿</span></h1>
        <p className={styles.quote}>"Failure is the opportunity to begin again more intelligently." – Henry Ford</p>
      </div>

      <div className={styles.topRow}>
        <div className={styles.statsCards}>
          <div className={styles.statCard} style={{ background: 'linear-gradient(135deg,#6aab7e,#4a7c59)' }}>
            <span className={styles.statIcon}>📚</span>
            <div>
              <div className={styles.statVal}>{total}</div>
              <div className={styles.statLbl}>Total Words</div>
            </div>
          </div>
          <div className={styles.statCard} style={{ background: 'linear-gradient(135deg,#a8d5b5,#6aab7e)' }}>
            <span className={styles.statIcon}>✅</span>
            <div>
              <div className={styles.statVal}>{completed}</div>
              <div className={styles.statLbl}>Completed</div>
            </div>
          </div>
          <div className={styles.statCard} style={{ background: 'linear-gradient(135deg,#fde68a,#f59e0b)' }}>
            <span className={styles.statIcon}>⚡</span>
            <div>
              <div className={styles.statVal}>{inProgress}</div>
              <div className={styles.statLbl}>In Progress</div>
            </div>
          </div>
          <div className={styles.statCard} style={{ background: 'linear-gradient(135deg,#f9c6c6,#ef4444)' }}>
            <span className={styles.statIcon}>🆕</span>
            <div>
              <div className={styles.statVal}>{started}</div>
              <div className={styles.statLbl}>Started</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h3>Vocabulary Status Distribution</h3>
          <div className={styles.donutWrap}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value">
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS_STATUS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.donutCenter}>{total}</div>
            <div className={styles.chartLegend}>
              {statusData.map((d, i) => (
                <div key={i} className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ background: COLORS_STATUS[i] }} />
                  <span>{d.name}: <b>{d.value}</b></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>Vocabulary Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priorityData} barSize={32}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {priorityData.map((_, i) => <Cell key={i} fill={COLORS_PRIORITY[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3>Mastery Level Distribution</h3>
          <div className={styles.donutWrap}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={masteryData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value">
                  {masteryData.map((_, i) => <Cell key={i} fill={COLORS_MASTERY[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.donutCenter}>{total}</div>
            <div className={styles.chartLegend}>
              {masteryData.map((d, i) => (
                <div key={i} className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ background: COLORS_MASTERY[i] }} />
                  <span>{d.name}: <b>{d.value}</b></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.reviewCard}>
          <h3>Daily Review 📝</h3>
          <div className={styles.reviewDate}>{new Date().toLocaleDateString('vi-VN')}</div>
          <div className={styles.reviewStats}>
            <span>Words to Review: <b>{reviewWords.length}</b></span>
            <span className={styles.statusDone}>Done</span>
          </div>
          <div className={styles.wordList}>
            {reviewWords.map((w, i) => (
              <div key={i} className={styles.wordItem}>
                <span className={styles.check}>☑</span>
                <span>{w}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.weekCard}>
          <h3>Week-on-Week</h3>
          <div className={styles.weekMeta}>
            <div className={styles.weekStat}>
              <span>Vocabulary Completed</span>
              <div>
                <b>19</b>
                <span className={styles.up}>▲375%</span>
              </div>
            </div>
            <div className={styles.weekStat}>
              <span>New Vocabulary Added</span>
              <div>
                <b>25</b>
                <span className={styles.up}>▲9%</span>
              </div>
            </div>
            <div className={styles.weekStat}>
              <span>Avg. Days to Master</span>
              <div>
                <b>5.05</b>
                <span className={styles.down}>▼16%</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={weekData}>
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="#6aab7e" strokeWidth={2} dot={{ r: 4 }} name="Completed" />
              <Line type="monotone" dataKey="added" stroke="#fde68a" strokeWidth={2} dot={{ r: 4 }} name="Added" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.monthCard}>
          <h3>Month-on-Month</h3>
          <div className={styles.weekMeta}>
            <div className={styles.weekStat}>
              <span>Vocabulary Completed</span>
              <div>
                <b>28</b>
                <span className={styles.up}>▲33%</span>
              </div>
            </div>
            <div className={styles.weekStat}>
              <span>New Vocabulary Added</span>
              <div>
                <b>50</b>
                <span className={styles.down}>▼17%</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={monthData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="#6aab7e" strokeWidth={2} dot={{ r: 4 }} name="Completed" />
              <Line type="monotone" dataKey="added" stroke="#fde68a" strokeWidth={2} dot={{ r: 4 }} name="Added" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
