/* Dashboard.jsx — overview, stats, lecture grid */
function Dashboard({ store, setView, lectures }) {
  const totalCards = lectures.reduce((s, l) => s + l.flashcards.length, 0);
  const totalQuiz = lectures.reduce((s, l) => s + l.quiz.length, 0);
  const knownCards = lectures.reduce((s, l) => {
    return s + Object.values(store.lectures[l.id].flashcards).filter(v => v === 'known').length;
  }, 0);
  const seenCards = lectures.reduce((s, l) => {
    return s + Object.keys(store.lectures[l.id].flashcards).length;
  }, 0);
  const avgScore = (() => {
    const scores = lectures.map(l => store.lectures[l.id].bestScore).filter(s => s != null);
    if (scores.length === 0) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  })();
  const mastered = lectures.filter(l => {
    const p = window.AOS.lectureProgress(store.lectures[l.id], l);
    return p.fc >= 0.8 && (store.lectures[l.id].bestScore || 0) >= 80;
  }).length;

  const totalMistakes = Object.values(store.lectures).reduce((sum, l) => sum + l.quizMistakes.length, 0);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">AOS — Advanced Operating Systems · Final Prep</div>
          <h1>Master 10 lectures, one card at a time</h1>
          <p style={{ marginTop: 8, maxWidth: 620 }}>
            Flashcards and quizzes in English with Russian translations on the back.
            Filter by lecture and difficulty, track what you got wrong, and run a final mixed exam when you're ready.
          </p>
          <p style={{ marginTop: 6, fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>
            Карточки и тесты на английском с русским переводом. Фильтруйте по лекции и сложности, отмечайте ошибки, запускайте итоговый микс-экзамен.
          </p>
        </div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 28 }}>
        <Stat label="Lectures mastered" value={`${mastered}/${lectures.length}`} delta="≥80% on cards + quiz" />
        <Stat label="Flashcards known" value={`${knownCards}/${totalCards}`} delta={`${seenCards} seen total`} />
        <Stat label="Avg quiz score" value={avgScore != null ? `${avgScore}%` : '—'} delta={avgScore != null ? 'across attempted lectures' : 'take a quiz to start'} />
        <Stat label="Mistakes to revisit" value={totalMistakes} delta="open Mistakes Review" />
      </div>

      <div className="section-h">
        <h2>Lectures</h2>
        <span className="badge">{lectures.length} of 10 available</span>
      </div>

      <div className="grid cols-3">
        {lectures.map(l => (
          <LectureTile key={l.id} lec={l} store={store} setView={setView} />
        ))}
        {Array.from({ length: 10 }).map((_, i) => {
          const id = i + 1;
          if (window.AOS.lectureExists(id)) return null;
          return (
            <div key={id} className="lec-tile" style={{ opacity: 0.55, cursor: 'not-allowed' }}>
              <div className="head">
                <div>
                  <div className="num-big">LECTURE {String(id).padStart(2, '0')}</div>
                  <h3 style={{ marginTop: 6, color: 'var(--muted)' }}>Pending upload</h3>
                  <div className="ru">Будет добавлено позже</div>
                </div>
                <span className="badge">soon</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>
                When you add this lecture's content file the app will pick it up automatically — modular by design.
              </p>
              <div className="foot">
                <span>— · — flashcards</span>
                <span>— questions</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="section-h">
        <h2>Ready to push it?</h2>
      </div>
      <div className="grid cols-3">
        <ActionCard
          eyebrow="Mistakes Review"
          title="Drill the questions you got wrong"
          body="The mistakes log collects every MCQ you answered incorrectly across all lectures. Run through it until it's empty."
          cta="Open review"
          onClick={() => setView({ kind: 'review' })}
          disabled={totalMistakes === 0}
          fallback={totalMistakes === 0 ? "No mistakes yet — take a quiz first." : null}
        />
        <ActionCard
          eyebrow="Final Mixed Exam · ★ real questions inside"
          title="Run the full mock — or only the real endterm Qs"
          body="Random questions from every lecture, including the 60 real endterm questions from past exams. No feedback during; full review after."
          cta="Start exam"
          onClick={() => setView({ kind: 'final' })}
        />
        <ActionCard
          eyebrow="Glossary · Глоссарий"
          title={`Search ${(window.GLOSSARY || []).length} terms in EN/RU`}
          body="Every concept across the 10 lectures — bilingual definitions, searchable, grouped by topic."
          cta="Open glossary"
          onClick={() => setView({ kind: 'glossary' })}
        />
      </div>
    </div>
  );
}

function Stat({ label, value, delta }) {
  return (
    <div className="stat">
      <span className="label">{label}</span>
      <span className="value">{value}</span>
      <span className="delta">{delta}</span>
    </div>
  );
}

function LectureTile({ lec, store, setView }) {
  const lecStore = store.lectures[lec.id];
  const p = window.AOS.lectureProgress(lecStore, lec);
  const pct = Math.round(p.overall * 100);
  const status = pct >= 80 ? 'mastered' : pct >= 40 ? 'in progress' : p.fcSeen > 0 ? 'started' : 'fresh';
  const badgeClass = status === 'mastered' ? 'badge easy' : status === 'in progress' ? 'badge medium' : 'badge';
  const examCount = lec.quiz.filter(q => q.exam).length;

  return (
    <div className="lec-tile" onClick={() => setView({ kind: 'lecture', lectureId: lec.id })}>
      <div className="head">
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="num-big">LECTURE {String(lec.id).padStart(2, '0')}</div>
          <h3 style={{ marginTop: 6 }}>{lec.title}</h3>
          <div className="ru">{lec.titleRu}</div>
        </div>
        <span className={badgeClass}>{status}</span>
      </div>

      <div>
        <div className="bar accent">
          <i style={{ width: `${pct}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginTop: 6 }}>
          <span>{p.fcDone}/{p.fcTotal} cards</span>
          <span>{lecStore.bestScore != null ? `quiz: ${lecStore.bestScore}%` : 'no quiz yet'}</span>
        </div>
      </div>

      <div className="foot">
        <span>
          {lec.flashcards.length} cards · {lec.quiz.length} MCQ
          {examCount > 0 && <span style={{ color: 'var(--accent-2)', marginLeft: 8 }}>· ★ {examCount} exam Q</span>}
        </span>
        <span style={{ color: 'var(--accent)' }}>open →</span>
      </div>
    </div>
  );
}

function ActionCard({ eyebrow, title, body, cta, onClick, disabled, fallback }) {
  return (
    <div className="card">
      <div className="eyebrow">{eyebrow}</div>
      <h3 style={{ marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 14, marginBottom: 18, color: 'var(--ink-2)' }}>{body}</p>
      <button className="btn btn-primary" onClick={onClick} disabled={disabled}>
        {cta} →
      </button>
      {disabled && fallback && (
        <div style={{ marginTop: 10, fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>{fallback}</div>
      )}
    </div>
  );
}

window.Dashboard = Dashboard;
