/* Shared utilities and store — exposed on window */
(function () {
  const STORAGE_KEY = 'aos-prep-v1';

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultStore();
      const parsed = JSON.parse(raw);
      // ensure all lectures present
      const def = defaultStore();
      for (let id = 1; id <= 10; id++) {
        if (!parsed.lectures[id]) parsed.lectures[id] = def.lectures[id];
      }
      return parsed;
    } catch (e) {
      return defaultStore();
    }
  }

  function defaultStore() {
    const lectures = {};
    for (let id = 1; id <= 10; id++) {
      lectures[id] = {
        flashcards: {},   // idx -> 'known' | 'unknown'
        quizMistakes: [], // array of {qIdx, chosenIdx}
        quizScore: null,  // last quiz: { correct, total, ts }
        bestScore: null,  // best quiz: number 0-100
      };
    }
    return { lectures, view: { kind: 'dashboard' }, finalExam: { lastScore: null, bestScore: null } };
  }

  function saveStore(s) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (e) {}
  }

  function useStore() {
    const [store, setStore] = React.useState(loadStore());
    const update = React.useCallback((mutator) => {
      setStore((cur) => {
        const next = JSON.parse(JSON.stringify(cur));
        mutator(next);
        saveStore(next);
        return next;
      });
    }, []);
    return [store, update];
  }

  function lectureProgress(lec, lecData) {
    if (!lecData) return { fc: 0, fcDone: 0, fcTotal: 0, quiz: 0, overall: 0 };
    const fcTotal = lecData.flashcards.length;
    const knownEntries = Object.entries(lec.flashcards).filter(([k, v]) => v === 'known').length;
    const seenEntries = Object.keys(lec.flashcards).length;
    const fc = fcTotal > 0 ? knownEntries / fcTotal : 0;
    const quiz = lec.bestScore ? lec.bestScore / 100 : 0;
    const overall = (fc * 0.6 + quiz * 0.4);
    return { fc, fcDone: knownEntries, fcSeen: seenEntries, fcTotal, quiz, overall };
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function classNames(...xs) {
    return xs.filter(Boolean).join(' ');
  }

  function getLectures() {
    const out = [];
    for (let id = 1; id <= 10; id++) {
      if (window.LECTURES && window.LECTURES[id]) out.push(window.LECTURES[id]);
    }
    return out;
  }

  function lectureExists(id) {
    return !!(window.LECTURES && window.LECTURES[id]);
  }

  window.AOS = {
    useStore,
    lectureProgress,
    shuffle,
    classNames,
    getLectures,
    lectureExists,
  };
})();
