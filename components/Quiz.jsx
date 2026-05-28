/* Quiz.jsx — MCQ quiz mode for a single lecture */
function Quiz({ lectureId, store, update, setView }) {
  const lec = window.LECTURES[lectureId];
  const [questions, setQuestions] = React.useState(null);
  const [pos, setPos] = React.useState(0);
  const [selected, setSelected] = React.useState(null); // index of chosen option
  const [revealed, setRevealed] = React.useState(false);
  const [results, setResults] = React.useState([]); // per-question: { qIdx, chosen, correct }
  const [done, setDone] = React.useState(false);

  // Initialize quiz: shuffle q order, shuffle option order per question
  React.useEffect(() => {
    if (!lec) return;
    const qIdxs = window.AOS.shuffle(lec.quiz.map((_, i) => i));
    const built = qIdxs.map(qIdx => {
      const q = lec.quiz[qIdx];
      // permute options so correct index changes
      const perm = window.AOS.shuffle(q.opts.map((_, i) => i));
      const opts = perm.map(i => q.opts[i]);
      const correct = perm.indexOf(q.correct);
      return { ...q, opts, correct, origIdx: qIdx };
    });
    setQuestions(built);
    setPos(0);
    setSelected(null);
    setRevealed(false);
    setResults([]);
    setDone(false);
  }, [lectureId]);

  if (!lec) return <div className="empty">Lecture not loaded.</div>;
  if (!questions) return <div className="empty">Loading…</div>;

  const q = questions[pos];
  const total = questions.length;
  const correctCount = results.filter(r => r.correct).length;

  function choose(i) {
    if (revealed) return;
    setSelected(i);
  }
  function submit() {
    if (selected == null) return;
    const isCorrect = selected === q.correct;
    setRevealed(true);
    setResults(r => [...r, { qIdx: q.origIdx, chosen: selected, correct: isCorrect, lectureId }]);
    if (!isCorrect) {
      update(s => {
        const lec = s.lectures[lectureId];
        // Avoid duplicates: keep one entry per qIdx
        const filtered = lec.quizMistakes.filter(m => m.qIdx !== q.origIdx);
        lec.quizMistakes = [...filtered, { qIdx: q.origIdx, chosen: selected }];
      });
    } else {
      // remove from mistakes log if previously wrong
      update(s => {
        const lec = s.lectures[lectureId];
        lec.quizMistakes = lec.quizMistakes.filter(m => m.qIdx !== q.origIdx);
      });
    }
  }
  function nextQ() {
    if (pos >= total - 1) {
      // finished
      finalize();
      return;
    }
    setPos(p => p + 1);
    setSelected(null);
    setRevealed(false);
  }
  function finalize() {
    const correctNow = results.filter(r => r.correct).length;
    const pct = Math.round((correctNow / total) * 100);
    update(s => {
      const lec = s.lectures[lectureId];
      lec.quizScore = { correct: correctNow, total, pct, ts: Date.now() };
      if (lec.bestScore == null || pct > lec.bestScore) lec.bestScore = pct;
    });
    setDone(true);
  }
  function restart() {
    const qIdxs = window.AOS.shuffle(lec.quiz.map((_, i) => i));
    const built = qIdxs.map(qIdx => {
      const q = lec.quiz[qIdx];
      const perm = window.AOS.shuffle(q.opts.map((_, i) => i));
      const opts = perm.map(i => q.opts[i]);
      const correct = perm.indexOf(q.correct);
      return { ...q, opts, correct, origIdx: qIdx };
    });
    setQuestions(built);
    setPos(0);
    setSelected(null);
    setRevealed(false);
    setResults([]);
    setDone(false);
    window.scrollTo({ top: 0 });
  }

  if (done) {
    const pct = Math.round((correctCount / total) * 100);
    const grade = pct >= 90 ? 'Excellent' : pct >= 75 ? 'Solid' : pct >= 60 ? 'Passing' : 'Needs work';
    return (
      <div>
        <div className="page-head">
          <div>
            <div className="eyebrow">QUIZ COMPLETE · LECTURE {String(lec.id).padStart(2, '0')}</div>
            <h1>{grade}</h1>
            <p style={{ marginTop: 8 }}>{lec.title}</p>
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '46px 22px' }}>
          <div className="score-circle" style={{ '--p': pct }}>
            <span className="pct">{pct}%</span>
          </div>
          <div style={{ marginTop: 20, fontSize: 16, color: 'var(--ink-2)' }}>
            <strong>{correctCount}</strong> of <strong>{total}</strong> correct
          </div>
          <div style={{ marginTop: 4, color: 'var(--muted)', fontSize: 13, fontStyle: 'italic' }}>
            Правильных ответов: {correctCount} из {total}
          </div>
          <div style={{ marginTop: 26, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn" onClick={restart}>↻ Retake</button>
            <button className="btn btn-primary" onClick={() => setView({ kind: 'lecture', lectureId })}>Back to lecture</button>
            <button className="btn" onClick={() => setView({ kind: 'review' })}>Open Mistakes Review →</button>
          </div>
        </div>

        <div className="section-h"><h2>Question by question</h2></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {results.map((r, i) => {
            const orig = lec.quiz[r.qIdx];
            return (
              <div key={i} className="card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>Q{i + 1}</span>
                  <span className={`badge ${r.correct ? 'easy' : 'hard'}`}>{r.correct ? 'correct' : 'wrong'}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>{orig.q}</div>
                <div style={{ fontSize: 13, color: 'var(--good)', marginBottom: 4 }}>✓ {orig.opts[orig.correct]}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{orig.expl}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">
            <span onClick={() => setView({ kind: 'lecture', lectureId })} style={{ cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 2 }}>
              Lecture {String(lec.id).padStart(2, '0')}
            </span>
            <span style={{ margin: '0 8px' }}>/</span>
            QUIZ
          </div>
          <h1>{lec.title}</h1>
        </div>
        <div className="meta">
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}>{pos + 1} / {total}</div>
        </div>
      </div>

      <div className="quiz-progress">
        <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>SCORE</span>
        <div className="quiz-progress-track">
          <div className="bar accent"><i style={{ width: `${((pos) / total) * 100}%` }} /></div>
        </div>
        <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{correctCount}/{Math.max(pos, results.length)}</span>
      </div>

      <div className="quiz-question">
        {q.exam && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
            <span className="badge" style={{ background: 'var(--accent-2-soft)', color: 'var(--accent-2)', fontWeight: 600 }}>
              ★ real endterm question
            </span>
          </div>
        )}
        <div className="quiz-q-text">{q.q}</div>
        <div className="quiz-options">
          {q.opts.map((opt, i) => {
            const cls = ['quiz-opt'];
            if (revealed) {
              if (i === q.correct) cls.push('correct');
              else if (i === selected) cls.push('wrong');
            } else if (selected === i) cls.push('selected');
            return (
              <button key={i} className={cls.join(' ')} onClick={() => choose(i)} disabled={revealed}>
                <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className={`feedback ${selected === q.correct ? 'correct' : 'wrong'}`}>
            <h4>
              {selected === q.correct ? '✓ Correct' : '✕ Not quite'}
              {selected !== q.correct && (
                <span style={{ marginLeft: 8, color: 'var(--muted)', fontWeight: 400, fontSize: 13 }}>
                  · correct answer is {String.fromCharCode(65 + q.correct)}
                </span>
              )}
            </h4>
            <p>{q.expl}</p>
            <p className="ru">{q.explRu}</p>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: 0.06 }}>
              Topic · Lecture {String(lec.id).padStart(2, '0')}: {lec.title}
            </div>
          </div>
        )}

        <div style={{ marginTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setView({ kind: 'lecture', lectureId })}>↩ Quit</button>
          {!revealed ? (
            <button className="btn btn-primary" onClick={submit} disabled={selected == null}>
              Check answer →
            </button>
          ) : (
            <button className="btn btn-primary" onClick={nextQ}>
              {pos >= total - 1 ? 'Finish quiz →' : 'Next question →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

window.Quiz = Quiz;
