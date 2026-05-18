import { createContext, useContext, useState } from 'react';

const INITIAL_PHRASES = [
  { id: 1, phrase: 'Kick the bucket', type: 'Idiom', meaning: 'Chết', example: 'He finally kicked the bucket after a long illness.', level: 'Medium', topic: 'General', status: 'Learning' },
  { id: 2, phrase: 'Give up', type: 'Phrasal Verb', meaning: 'Từ bỏ', example: "Don't give up on your dreams.", level: 'Easy', topic: 'Actions', status: 'Mastered' },
  { id: 3, phrase: 'Make a decision', type: 'Collocation', meaning: 'Đưa ra quyết định', example: 'She made a decision to quit her job.', level: 'Easy', topic: 'Business', status: 'Mastered' },
  { id: 4, phrase: 'Break a leg', type: 'Idiom', meaning: 'Chúc may mắn', example: 'Break a leg on your performance tonight!', level: 'Medium', topic: 'General', status: 'Learning' },
  { id: 5, phrase: 'Look up', type: 'Phrasal Verb', meaning: 'Tra cứu / Ngước nhìn', example: 'Look up the word in the dictionary.', level: 'Easy', topic: 'Study', status: 'Mastered' },
  { id: 6, phrase: 'Take advantage of', type: 'Collocation', meaning: 'Tận dụng', example: 'You should take advantage of this opportunity.', level: 'Medium', topic: 'Business', status: 'Learning' },
  { id: 7, phrase: 'Hit the nail on the head', type: 'Idiom', meaning: 'Nói đúng vấn đề', example: 'You hit the nail on the head with that comment.', level: 'Hard', topic: 'Communication', status: 'New' },
  { id: 8, phrase: 'Run out of', type: 'Phrasal Verb', meaning: 'Hết, cạn kiệt', example: "We've run out of time.", level: 'Easy', topic: 'General', status: 'Mastered' },
];

const PHRASE_TOPICS = ['General', 'Actions', 'Business', 'Study', 'Communication', 'Emotions', 'Travel', 'Food', 'Health'];

const PhrasesContext = createContext(null);

export function PhrasesProvider({ children }) {
  const [phrases, setPhrases] = useState(INITIAL_PHRASES);
  const [topics, setTopics] = useState(PHRASE_TOPICS);

  const addPhrase = (p) => setPhrases(prev => [...prev, { ...p, id: Date.now() }]);
  const updatePhrase = (id, updates) => setPhrases(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  const deletePhrase = (id) => setPhrases(prev => prev.filter(p => p.id !== id));
  const addTopic = (t) => { if (!topics.includes(t)) setTopics(prev => [...prev, t]); };

  return (
    <PhrasesContext.Provider value={{ phrases, topics, addPhrase, updatePhrase, deletePhrase, addTopic }}>
      {children}
    </PhrasesContext.Provider>
  );
}

export const usePhrases = () => useContext(PhrasesContext);