import { createContext, useContext, useState } from 'react';

const INITIAL_VOCAB = [
  { id: 1, word: 'Abundant', phonetic: '/əˈbʌndənt/', pos: 'Adjective', meaning: 'Dồi dào, phong phú', definition: 'Existing in large quantities; more than enough', synonym: 'Plentiful', antonym: 'Scarce', example: 'Water is abundant in this region.', priority: 'High', topic: 'Nature', done: true, score: 100, mastery: 'Mastery', dateAdded: '18/02/25', dateCompleted: '21/02/25', duration: 3, status: 'Completed' },
  { id: 2, word: 'Benevolent', phonetic: '/bəˈnevələnt/', pos: 'Adjective', meaning: 'Nhân từ, tốt bụng', definition: 'Well-meaning and kindly', synonym: 'Kind', antonym: 'Malevolent', example: 'She was a benevolent ruler.', priority: 'High', topic: 'Personality', done: true, score: 100, mastery: 'Mastery', dateAdded: '12/02/25', dateCompleted: '18/02/25', duration: 6, status: 'Completed' },
  { id: 3, word: 'Conceal', phonetic: '/kənˈsiːl/', pos: 'Verb', meaning: 'Che giấu', definition: 'To hide something from view or knowledge', synonym: 'Hide', antonym: 'Reveal', example: 'He tried to conceal his disappointment.', priority: 'High', topic: 'Actions', done: true, score: 100, mastery: 'Mastery', dateAdded: '13/02/25', dateCompleted: '19/02/25', duration: 6, status: 'Completed' },
  { id: 4, word: 'Diligent', phonetic: '/ˈdɪlɪdʒənt/', pos: 'Adjective', meaning: 'Chăm chỉ, siêng năng', definition: 'Showing careful and persistent effort', synonym: 'Hardworking', antonym: 'Lazy', example: 'She is a diligent student.', priority: 'Medium', topic: 'Work/Study', done: true, score: 100, mastery: 'Mastery', dateAdded: '14/02/25', dateCompleted: '20/02/25', duration: 6, status: 'Completed' },
  { id: 5, word: 'Eliminate', phonetic: '/ɪˈlɪmɪneɪt/', pos: 'Verb', meaning: 'Loại bỏ', definition: 'To completely remove or get rid of something', synonym: 'Remove', antonym: 'Keep', example: 'The new law aims to eliminate corruption.', priority: 'Medium', topic: 'Politics', done: true, score: 100, mastery: 'Mastery', dateAdded: '15/02/25', dateCompleted: '21/02/25', duration: 6, status: 'Completed' },
  { id: 6, word: 'Fragile', phonetic: '/ˈfrædʒaɪl/', pos: 'Adjective', meaning: 'Dễ vỡ, mong manh', definition: 'Easily broken or damaged', synonym: 'Delicate', antonym: 'Strong', example: "Be careful with that vase, it's very fragile.", priority: 'Low', topic: 'Objects', done: true, score: 100, mastery: 'Mastery', dateAdded: '16/02/25', dateCompleted: '22/02/25', duration: 6, status: 'Completed' },
  { id: 7, word: 'Gratitude', phonetic: '/ˈɡrætɪtjuːd/', pos: 'Noun', meaning: 'Lòng biết ơn', definition: 'The quality of being thankful', synonym: 'Appreciation', antonym: 'Ingratitude', example: 'He expressed his gratitude for their support.', priority: 'Medium', topic: 'Emotions', done: true, score: 100, mastery: 'Mastery', dateAdded: '17/02/25', dateCompleted: '23/02/25', duration: 6, status: 'Completed' },
  { id: 8, word: 'Advocate', phonetic: '/ˈædvəkeɪt/', pos: 'Noun/Verb', meaning: 'Người ủng hộ; Ủng hộ', definition: 'A person who supports a cause; to publicly recommend or support', synonym: 'Supporter', antonym: 'Opponent', example: 'She advocates for environmental protection.', priority: 'High', topic: 'Politics', done: false, score: 80, mastery: 'Advanced', dateAdded: '20/02/25', dateCompleted: '', duration: 8, status: 'In Progress' },
  { id: 9, word: 'Foresight', phonetic: '/ˈfɔːsaɪt/', pos: 'Noun', meaning: 'Sự nhìn xa trông rộng', definition: 'The ability to predict what will happen', synonym: 'Vision', antonym: 'Hindsight', example: 'She had the foresight to plan ahead.', priority: 'Medium', topic: 'Thinking', done: false, score: 60, mastery: 'Intermediate', dateAdded: '22/02/25', dateCompleted: '', duration: 0, status: 'In Progress' },
  { id: 10, word: 'Meticulous', phonetic: '/məˈtɪkjʊləs/', pos: 'Adjective', meaning: 'Tỉ mỉ, cẩn thận', definition: 'Showing great attention to detail or being very careful', synonym: 'Precise', antonym: 'Careless', example: 'She was meticulous in her work.', priority: 'High', topic: 'Work/Study', done: false, score: 0, mastery: 'Beginner', dateAdded: '25/02/25', dateCompleted: '', duration: 0, status: 'Started' },
];

const CATEGORIES = ['Nature', 'Personality', 'Actions', 'Work/Study', 'Politics', 'Objects', 'Emotions', 'Technology', 'Mathematics', 'Business', 'Legal', 'Communication', 'Thinking', 'Evaluation'];

const VocabContext = createContext(null);

export function VocabProvider({ children }) {
  const [vocabList, setVocabList] = useState(INITIAL_VOCAB);
  const [categories, setCategories] = useState(CATEGORIES);

  const addWord = (word) => {
    setVocabList(prev => [...prev, { ...word, id: Date.now() }]);
  };

  const updateWord = (id, updates) => {
    setVocabList(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const deleteWord = (id) => {
    setVocabList(prev => prev.filter(w => w.id !== id));
  };

  const addCategory = (cat) => {
    if (!categories.includes(cat)) setCategories(prev => [...prev, cat]);
  };

  return (
    <VocabContext.Provider value={{ vocabList, categories, addWord, updateWord, deleteWord, addCategory }}>
      {children}
    </VocabContext.Provider>
  );
}

export const useVocab = () => useContext(VocabContext);
