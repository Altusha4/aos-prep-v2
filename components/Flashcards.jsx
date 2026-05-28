/* Flashcards.jsx — flashcard mode for a single lecture */
function Flashcards({ lectureId, store, update, setView }) {
  const lec = window.LECTURES[lectureId];
  const lecStore = store.lectures[lectureId];
  const [diffFilter, setDiffFilter] = React.useState('all'); // all | easy | medium | hard
  const [statusFilter, setStatusFilter] = React.useState('all'); // all | unknown | unseen
  const [order, setOrder] = React.useState(null); // array of indices, set on filter change
  const [pos, setPos] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);

  const filteredIndices = React.useMemo(() => {
    if (!lec) return [];
    return lec.flashcards
      .map((f, i) => ({ f, i }))
      .filter(({ f, i }) => {
        if (diffFilter !== 'all' && f.diff !== diffFilter) return false;
        const status = lecStore.flashcards[i];
        if (statusFilter === 'unknown' && status !== 'unknown') return false;
        if (statusFilter === 'unseen' && status != null) return false;
        return true;
      })
      .map(({ i }) => i);
  }, [lec, diffFilter, statusFilter, lecStore.flashcards]);

  // Reset order when filter changes
  React.useEffect(() => {
    setOrder(filteredIndices);
    setPos(0);
    setFlipped(false);
  }, [diffFilter, statusFilter, lectureId]);

  // Keyboard handlers
  React.useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === 'INPUT') return;
      if (e.code === 'Space') { e.preventDefault(); setFlipped(f => !f); }
      else if (e.code === 'ArrowRight') next();
      else if (e.code === 'ArrowLeft') prev();
      else if (e.code === 'KeyK') mark('known');
      else if (e.code === 'KeyU' || e.code === 'KeyN') mark('unknown');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!lec) {
    return <div className="empty"><div className="icon">·</div><h3>Lecture not loaded</h3></div>;
  }

  const list = order || [];
  const currentIdx = list[pos];
  const card = currentIdx != null ? lec.flashcards[currentIdx] : null;

  function next() {
    setFlipped(false);
    setTimeout(() => setPos(p => Math.min(list.length - 1, p + 1)), 50);
  }
  function prev() {
    setFlipped(false);
    setTimeout(() => setPos(p => Math.max(0, p - 1)), 50);
  }
  function mark(val) {
    if (currentIdx == null) return;
    update(s => {
      s.lectures[lectureId].flashcards[currentIdx] = val;
    });
    next();
  }
  function reshuffle() {
    setOrder(window.AOS.shuffle(filteredIndices));
    setPos(0);
    setFlipped(false);
  }
  function resetProgress() {
    if (!confirm('Reset known/unknown for this lecture?')) return;
    update(s => { s.lectures[lectureId].flashcards = {}; });
  }

  const knownInFilter = list.filter(i => lecStore.flashcards[i] === 'known').length;

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">
            <span onClick={() => setView({ kind: 'lecture', lectureId })} style={{ cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 2 }}>
              Lecture {String(lec.id).padStart(2, '0')}
            </span>
            <span style={{ margin: '0 8px' }}>/</span>
            FLASHCARDS
          </div>
          <h1>{lec.title}</h1>
        </div>
        <div className="meta" style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}>
            {list.length === 0 ? '0' : pos + 1} / {list.length}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{knownInFilter} known in filter</div>
        </div>
      </div>

      <div className="filter-row">
        <span className="chip-label">Difficulty</span>
        {['all', 'easy', 'medium', 'hard'].map(d => (
          <button key={d} className={window.AOS.classNames('chip', diffFilter === d && 'active')} onClick={() => setDiffFilter(d)}>
            {d}
          </button>
        ))}
        <span style={{ width: 12 }} />
        <span className="chip-label">Show</span>
        {['all', 'unseen', 'unknown'].map(s => (
          <button key={s} className={window.AOS.classNames('chip', statusFilter === s && 'active')} onClick={() => setStatusFilter(s)}>
            {s}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={reshuffle}>↻ Shuffle</button>
          <button className="btn btn-ghost" onClick={resetProgress}>Reset</button>
        </span>
      </div>

      {list.length === 0 ? (
        <div className="empty">
          <div className="icon">✓</div>
          <h3>Nothing matches that filter</h3>
          <p>Try a different difficulty or show 'all'.</p>
        </div>
      ) : (
        <div className="fc-stage">
          <div className="fc-meter">
            <span>{lec.titleRu}</span>
            <span>{card && <span className={`badge ${card.diff}`}>{card.diff}</span>}</span>
          </div>

          <div className="fc-card" onClick={() => setFlipped(f => !f)}>
            <div className={window.AOS.classNames('fc-inner', flipped && 'flipped')}>
              <div className="fc-face">
                <div className="top">
                  <span className="label-tag">Question</span>
                  <span className="label-tag">{currentIdx != null ? `#${currentIdx + 1}` : ''}</span>
                </div>
                <div className="q">{card?.q}</div>
                <div className="hint">click or press <span className="kbd">Space</span> to flip</div>
              </div>
              <div className="fc-face fc-back">
                <div className="top">
                  <span className="label-tag">Answer · Ответ</span>
                  <span className="label-tag">EN / RU</span>
                </div>
                <div className="a-en">{card?.a}</div>
                <div className="a-ru">{card?.ru}</div>
              </div>
            </div>
          </div>

          <div className="fc-controls">
            <button className="btn" onClick={prev} disabled={pos === 0}>← prev</button>
            <button className="btn btn-bad" onClick={() => mark('unknown')}>
              ✕ Don't know <span className="kbd" style={{ background: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.8)' }}>U</span>
            </button>
            <button className="btn btn-good" onClick={() => mark('known')}>
              ✓ Know it <span className="kbd" style={{ background: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.8)' }}>K</span>
            </button>
            <button className="btn" onClick={next} disabled={pos >= list.length - 1}>next →</button>
          </div>

          <div className="bar accent" style={{ width: 680, maxWidth: '100%' }}>
            <i style={{ width: `${list.length === 0 ? 0 : ((pos + 1) / list.length) * 100}%` }} />
          </div>
        </div>
      )}

      <div style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn btn-ghost" onClick={() => setView({ kind: 'lecture', lectureId })}>← Back to overview</button>
        <button className="btn btn-primary" onClick={() => setView({ kind: 'quiz', lectureId })}>Run quiz for this lecture →</button>
      </div>
    </div>
  );
}

window.Flashcards = Flashcards;
