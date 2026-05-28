/* Progress.jsx — per-lecture progress tracker */
function ProgressPage({ store, setView, update }) {
  const lectures = window.AOS.getLectures();

  const stats = lectures.map(lec => {
    const lecStore = store.lectures[lec.id];
    const p = window.AOS.lectureProgress(lecStore, lec);
    return { lec, lecStore, p };
  });

  const totalCards = stats.reduce((s, x) => s + x.p.fcTotal, 0);
  const knownCards = stats.reduce((s, x) => s + x.p.fcDone, 0);
  const lecturesTouched = stats.filter(x => x.p.fcSeen > 0 || x.lecStore.bestScore != null).length;
  const lecturesMastered = stats.filter(x => x.p.fc >= 0.8 && (x.lecStore.bestScore || 0) >= 80).length;
  const avgQuiz = (() => {
    const scores = stats.map(x => x.lecStore.bestScore).filter(s => s != null);
    if (scores.length === 0) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  })();

  function resetAll() {
    if (!confirm('Reset ALL progress (flashcards, quiz scores, mistakes)? This cannot be undone.')) return;
    update(s => {
      lectures.forEach(l => {
        s.lectures[l.id] = { flashcards: {}, quizMistakes: [], quizScore: null, bestScore: null };
      });
      s.finalExam = { lastScore: null, bestScore: null };
    });
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">PROGRESS TRACKER</div>
          <h1>Where you stand</h1>
        </div>
        <div>
          <button className="btn btn-ghost" onClick={resetAll}>Reset all progress</button>
        </div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 28 }}>
        <div className="stat">
          <span className="label">Lectures mastered</span>
          <span className="value">{lecturesMastered}/{lectures.length}</span>
          <span className="delta">≥80% on cards + quiz</span>
        </div>
        <div className="stat">
          <span className="label">Lectures touched</span>
          <span className="value">{lecturesTouched}/{lectures.length}</span>
          <span className="delta">at least one card or quiz</span>
        </div>
        <div className="stat">
          <span className="label">Flashcards known</span>
          <span className="value">{knownCards}/{totalCards}</span>
          <span className="delta">{Math.round((knownCards / Math.max(1, totalCards)) * 100)}% complete</span>
        </div>
        <div className="stat">
          <span className="label">Avg quiz best</span>
          <span className="value">{avgQuiz != null ? `${avgQuiz}%` : '—'}</span>
          <span className="delta">{store.finalExam?.bestScore != null ? `final: ${store.finalExam.bestScore}%` : 'no final exam yet'}</span>
        </div>
      </div>

      <div className="section-h"><h2>Lecture breakdown</h2></div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '50px 1.4fr 1fr 1fr 1fr 120px', padding: '14px 20px', borderBottom: '1px solid var(--line)', fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          <span>#</span>
          <span>Lecture</span>
          <span>Flashcards</span>
          <span>Quiz best</span>
          <span>Mistakes</span>
          <span></span>
        </div>
        {stats.map(({ lec, lecStore, p }) => {
          const pct = Math.round(p.overall * 100);
          const pctColor = pct >= 80 ? 'var(--good)' : pct >= 50 ? 'var(--warn)' : pct > 0 ? 'var(--bad)' : 'var(--muted)';
          return (
            <div key={lec.id} style={{ display: 'grid', gridTemplateColumns: '50px 1.4fr 1fr 1fr 1fr 120px', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid var(--line)', fontSize: 13 }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontSize: 12 }}>{String(lec.id).padStart(2, '0')}</span>
              <div>
                <div style={{ fontWeight: 500 }}>{lec.title}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, fontStyle: 'italic' }}>{lec.titleRu}</div>
              </div>
              <div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{p.fcDone}/{p.fcTotal}</span>
                </div>
                <div className="bar accent" style={{ marginTop: 6, height: 4 }}>
                  <i style={{ width: `${p.fc * 100}%` }} />
                </div>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: pctColor, fontWeight: 600 }}>
                  {lecStore.bestScore != null ? `${lecStore.bestScore}%` : '—'}
                </span>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: lecStore.quizMistakes.length > 0 ? 'var(--bad)' : 'var(--muted)' }}>
                  {lecStore.quizMistakes.length}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => setView({ kind: 'lecture', lectureId: lec.id })}>
                  open →
                </button>
              </div>
            </div>
          );
        })}
        {/* missing lectures */}
        {Array.from({ length: 10 }).map((_, i) => {
          const id = i + 1;
          if (window.AOS.lectureExists(id)) return null;
          return (
            <div key={id} style={{ display: 'grid', gridTemplateColumns: '50px 1.4fr 1fr 1fr 1fr 120px', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid var(--line)', fontSize: 13, opacity: 0.5 }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontSize: 12 }}>{String(id).padStart(2, '0')}</span>
              <div style={{ color: 'var(--muted)', fontStyle: 'italic' }}>pending — add data file</div>
              <span>—</span><span>—</span><span>—</span><span></span>
            </div>
          );
        })}
      </div>

      <div className="section-h"><h2>Recommended next steps</h2></div>
      <NextSteps stats={stats} store={store} setView={setView} />
    </div>
  );
}

function NextSteps({ stats, store, setView }) {
  const recs = [];
  // Weakest lecture
  const weakest = stats
    .filter(x => x.p.fcSeen > 0 || x.lecStore.bestScore != null)
    .sort((a, b) => a.p.overall - b.p.overall)[0];
  if (weakest && weakest.p.overall < 0.8) {
    recs.push({
      h: `Drill Lecture ${String(weakest.lec.id).padStart(2, '0')}`,
      b: `Your weakest area right now: ${weakest.lec.title}. ${Math.round(weakest.p.overall * 100)}% overall.`,
      cta: 'Open flashcards',
      action: () => setView({ kind: 'flashcards', lectureId: weakest.lec.id })
    });
  }
  // Mistakes
  const totalMistakes = stats.reduce((s, x) => s + x.lecStore.quizMistakes.length, 0);
  if (totalMistakes > 0) {
    recs.push({
      h: `Clear ${totalMistakes} mistake${totalMistakes === 1 ? '' : 's'}`,
      b: 'You have quiz questions you got wrong. Drill them until the list is empty.',
      cta: 'Open Mistakes Review',
      action: () => setView({ kind: 'review' })
    });
  }
  // Untouched lectures
  const untouched = stats.filter(x => x.p.fcSeen === 0 && x.lecStore.bestScore == null);
  if (untouched.length > 0) {
    recs.push({
      h: `${untouched.length} lecture${untouched.length === 1 ? '' : 's'} not started`,
      b: `Start with Lecture ${String(untouched[0].lec.id).padStart(2, '0')}: ${untouched[0].lec.title}.`,
      cta: 'Open overview',
      action: () => setView({ kind: 'lecture', lectureId: untouched[0].lec.id })
    });
  }
  // If everything looks decent → final exam
  const allDecent = stats.every(x => x.p.overall >= 0.6);
  if (allDecent && stats.length >= 8) {
    recs.push({
      h: 'You look ready — try the Final Mixed Exam',
      b: 'Every lecture is at 60% or better. Run the full exam for a realistic check.',
      cta: 'Start Final Exam',
      action: () => setView({ kind: 'final' })
    });
  }
  if (recs.length === 0) {
    recs.push({
      h: 'Get started',
      b: 'Open Lecture 01 and run through the first few flashcards.',
      cta: 'Open Lecture 01',
      action: () => setView({ kind: 'lecture', lectureId: 1 })
    });
  }

  return (
    <div className="grid cols-2">
      {recs.slice(0, 4).map((r, i) => (
        <div key={i} className="card">
          <h3 style={{ marginBottom: 6 }}>{r.h}</h3>
          <p style={{ fontSize: 13.5, color: 'var(--ink-2)', marginBottom: 14 }}>{r.b}</p>
          <button className="btn btn-primary" onClick={r.action}>{r.cta} →</button>
        </div>
      ))}
    </div>
  );
}

window.ProgressPage = ProgressPage;
