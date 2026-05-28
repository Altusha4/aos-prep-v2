/* Review.jsx — mistakes review & weak topics */
function Review({ store, update, setView }) {
  const lectures = window.AOS.getLectures();
  const allMistakes = [];
  lectures.forEach(lec => {
    const m = store.lectures[lec.id].quizMistakes;
    m.forEach(mm => {
      allMistakes.push({ lectureId: lec.id, lec, qIdx: mm.qIdx, q: lec.quiz[mm.qIdx], chosen: mm.chosen });
    });
  });

  const unknownCards = [];
  lectures.forEach(lec => {
    Object.entries(store.lectures[lec.id].flashcards).forEach(([idx, val]) => {
      if (val === 'unknown') {
        const i = parseInt(idx, 10);
        unknownCards.push({ lectureId: lec.id, lec, idx: i, fc: lec.flashcards[i] });
      }
    });
  });

  // Weak topics: lectures where bestScore < 70 OR many unknown cards
  const weakLectures = lectures.map(lec => {
    const lecStore = store.lectures[lec.id];
    const unknownCount = Object.values(lecStore.flashcards).filter(v => v === 'unknown').length;
    const mistakeCount = lecStore.quizMistakes.length;
    const score = lecStore.bestScore;
    const weak = (score != null && score < 70) || unknownCount >= 3 || mistakeCount >= 3;
    return { lec, weak, unknownCount, mistakeCount, score };
  }).filter(w => w.weak);

  const [tab, setTab] = React.useState('mistakes');

  // Mistakes drill mode
  const [drillIdx, setDrillIdx] = React.useState(null);
  const [drillSelected, setDrillSelected] = React.useState(null);
  const [drillRevealed, setDrillRevealed] = React.useState(false);

  function startDrill() { setDrillIdx(0); setDrillSelected(null); setDrillRevealed(false); }
  function exitDrill() { setDrillIdx(null); setDrillSelected(null); setDrillRevealed(false); }
  function submitDrill() {
    if (drillSelected == null) return;
    setDrillRevealed(true);
    const m = allMistakes[drillIdx];
    if (drillSelected === m.q.correct) {
      // success — remove from store
      update(s => {
        const lec = s.lectures[m.lectureId];
        lec.quizMistakes = lec.quizMistakes.filter(mm => mm.qIdx !== m.qIdx);
      });
    }
  }
  function nextDrill() {
    if (drillIdx >= allMistakes.length - 1) { exitDrill(); return; }
    setDrillIdx(i => i + 1);
    setDrillSelected(null);
    setDrillRevealed(false);
  }

  function clearAllMistakes() {
    if (!confirm('Clear all mistake history?')) return;
    update(s => { lectures.forEach(l => s.lectures[l.id].quizMistakes = []); });
  }

  if (drillIdx != null && allMistakes.length > 0) {
    const m = allMistakes[Math.min(drillIdx, allMistakes.length - 1)];
    return (
      <div>
        <div className="page-head">
          <div>
            <div className="eyebrow">MISTAKES REVIEW · DRILL MODE</div>
            <h1>Try this one again</h1>
          </div>
          <div className="meta"><div style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}>{drillIdx + 1} / {allMistakes.length}</div></div>
        </div>
        <div className="quiz-question">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span className="badge blue">Lecture {String(m.lec.id).padStart(2, '0')} · {m.lec.title}</span>
          </div>
          <div className="quiz-q-text">{m.q.q}</div>
          <div className="quiz-options">
            {m.q.opts.map((opt, i) => {
              const cls = ['quiz-opt'];
              if (drillRevealed) {
                if (i === m.q.correct) cls.push('correct');
                else if (i === drillSelected) cls.push('wrong');
              } else if (drillSelected === i) cls.push('selected');
              return (
                <button key={i} className={cls.join(' ')} onClick={() => !drillRevealed && setDrillSelected(i)} disabled={drillRevealed}>
                  <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
          {drillRevealed && (
            <div className={`feedback ${drillSelected === m.q.correct ? 'correct' : 'wrong'}`}>
              <h4>{drillSelected === m.q.correct ? '✓ Got it — removed from mistakes list' : '✕ Still wrong — stays in the list'}</h4>
              <p>{m.q.expl}</p>
              <p className="ru">{m.q.explRu}</p>
            </div>
          )}
          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-ghost" onClick={exitDrill}>↩ Exit drill</button>
            {!drillRevealed
              ? <button className="btn btn-primary" onClick={submitDrill} disabled={drillSelected == null}>Check →</button>
              : <button className="btn btn-primary" onClick={nextDrill}>{drillIdx >= allMistakes.length - 1 ? 'Done' : 'Next →'}</button>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">REVIEW</div>
          <h1>Plug your weak spots</h1>
          <p style={{ marginTop: 6, color: 'var(--muted)', maxWidth: 620 }}>
            Mistakes from quizzes and flashcards you marked "don't know" — plus a generated revision list of lectures that need more work.
          </p>
        </div>
      </div>

      <div className="filter-row">
        <button className={`chip ${tab === 'mistakes' && 'active'}`} onClick={() => setTab('mistakes')}>Quiz mistakes · {allMistakes.length}</button>
        <button className={`chip ${tab === 'unknown' && 'active'}`} onClick={() => setTab('unknown')}>Unknown cards · {unknownCards.length}</button>
        <button className={`chip ${tab === 'plan' && 'active'}`} onClick={() => setTab('plan')}>Revision plan · {weakLectures.length}</button>
      </div>

      {tab === 'mistakes' && (
        <React.Fragment>
          {allMistakes.length === 0 ? (
            <div className="empty">
              <div className="icon">✓</div>
              <h3>No mistakes logged</h3>
              <p>Run a quiz and any wrong answers will collect here.</p>
            </div>
          ) : (
            <React.Fragment>
              <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
                <button className="btn btn-primary" onClick={startDrill}>Drill these → ({allMistakes.length})</button>
                <button className="btn btn-ghost" onClick={clearAllMistakes}>Clear all</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {allMistakes.map((m, i) => (
                  <div key={i} className="card" style={{ padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                      <span className="badge blue">L{String(m.lec.id).padStart(2, '0')} · {m.lec.title}</span>
                      <button className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => setView({ kind: 'quiz', lectureId: m.lectureId })}>Retake lecture quiz →</button>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>{m.q.q}</div>
                    <div style={{ fontSize: 13, color: 'var(--good)', marginBottom: 4 }}>✓ Correct: {m.q.opts[m.q.correct]}</div>
                    <div style={{ fontSize: 13, color: 'var(--bad)', marginBottom: 8 }}>✕ Your answer: {m.q.opts[m.chosen]}</div>
                    <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>{m.q.expl}</div>
                    <div style={{ marginTop: 6, fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>{m.q.explRu}</div>
                  </div>
                ))}
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      )}

      {tab === 'unknown' && (
        <React.Fragment>
          {unknownCards.length === 0 ? (
            <div className="empty">
              <div className="icon">✓</div>
              <h3>Nothing marked unknown</h3>
              <p>Use the flashcards mode and mark cards you don't know — they'll appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {unknownCards.map((u, i) => (
                <div key={i} className="card" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <span className="badge blue">L{String(u.lec.id).padStart(2, '0')}</span>
                    <span className={`badge ${u.fc.diff}`}>{u.fc.diff}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>{u.fc.q}</div>
                  <div style={{ fontSize: 13.5, color: 'var(--ink-2)', marginBottom: 6 }}>{u.fc.a}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)', fontStyle: 'italic' }}>{u.fc.ru}</div>
                  <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                    <button className="btn" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => {
                      update(s => { s.lectures[u.lectureId].flashcards[u.idx] = 'known'; });
                    }}>Mark known ✓</button>
                    <button className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => setView({ kind: 'flashcards', lectureId: u.lectureId })}>Open in flashcards →</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </React.Fragment>
      )}

      {tab === 'plan' && (
        <React.Fragment>
          {weakLectures.length === 0 ? (
            <div className="empty">
              <div className="icon">✓</div>
              <h3>No weak lectures detected</h3>
              <p>You're scoring well and have few unknowns. Run the Final Mixed Exam to confirm.</p>
              <button className="btn btn-primary" onClick={() => setView({ kind: 'final' })} style={{ marginTop: 12 }}>Start Final Exam →</button>
            </div>
          ) : (
            <div className="grid cols-2">
              {weakLectures.map(({ lec, unknownCount, mistakeCount, score }, i) => (
                <div key={i} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                    <div>
                      <div className="num-big" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>LECTURE {String(lec.id).padStart(2, '0')}</div>
                      <h3 style={{ marginTop: 4 }}>{lec.title}</h3>
                    </div>
                    <span className="badge hard">needs work</span>
                  </div>
                  <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                    {score != null && <span>Best quiz: <strong style={{ color: 'var(--bad)' }}>{score}%</strong></span>}
                    {unknownCount > 0 && <span>Unknown cards: {unknownCount}</span>}
                    {mistakeCount > 0 && <span>Open mistakes: {mistakeCount}</span>}
                  </div>
                  <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                    <button className="btn" onClick={() => setView({ kind: 'flashcards', lectureId: lec.id })}>Flashcards</button>
                    <button className="btn btn-primary" onClick={() => setView({ kind: 'quiz', lectureId: lec.id })}>Retake quiz</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
}

window.Review = Review;
