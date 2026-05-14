import { useState, useMemo } from 'react';

export function useVocabFilter(vocabList) {
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('All');
  const [status, setStatus] = useState('All');
  const [topic, setTopic] = useState('All');

  const filtered = useMemo(() => {
    return vocabList.filter(v => {
      const q = search.toLowerCase();
      const matchSearch = !search || v.word.toLowerCase().includes(q) || v.meaning.toLowerCase().includes(q);
      const matchPriority = priority === 'All' || v.priority === priority;
      const matchStatus = status === 'All' || v.status === status;
      const matchTopic = topic === 'All' || v.topic === topic;
      return matchSearch && matchPriority && matchStatus && matchTopic;
    });
  }, [vocabList, search, priority, status, topic]);

  return { filtered, search, setSearch, priority, setPriority, status, setStatus, topic, setTopic };
}
