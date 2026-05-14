// vocabService.js
// In a real app, these would make API calls to a backend.
// Currently the app uses in-memory state via VocabContext.

export const fetchVocab = async () => {
  return [];
};

export const createVocab = async (word) => {
  return word;
};

export const updateVocab = async (id, updates) => {
  return { id, ...updates };
};

export const deleteVocab = async (id) => {
  return id;
};
