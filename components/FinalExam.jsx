/* FinalExam.jsx — mixed exam from all loaded lectures */
function FinalExam({ store, update, setView }) {
  const lectures = window.AOS.getLectures();
  const [stage, setStage] = React.useState('start'); // start | running | done
  const [questions, setQuestions] = React.useState([]);
  const [pos, setPos] = React.useState(0);
  const [answers, setAnswers] = React.useState([]); // chosen indices, parallel to questions
  const [timeLeft, setTimeLeft] = React.useState(null); // seconds, null = untimed
  const timerRef = React.useRef(null);

  const total = questions.length;

  // Timer effect
  React.useEffect(() => {
    if (stage !== 'running' || timeLeft === null) return;
    if (timeLeft <= 0) { finishExam(); return; }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [stage, timeLeft]);

  function buildExam(size, mode, durationSeconds) {
    const pool = [];
    lectures.forEach(lec => {
      lec.quiz.forEach((q, qIdx) => {
        if (mode === 'exam-only' && !q.exam) return;
        pool.push({ lec, q, qIdx });
      });
    });
    const picked = window.AOS.shuffle(pool).slice(0, Math.min(size, pool.length));
    const built = picked.map(({ lec, q, qIdx }) => {
      const perm = window.AOS.shuffle(q.opts.map((_, i) => i));
      const opts = perm.map(i => q.opts[i]);
      const correct = perm.indexOf(q.correct);
      return { lec, qIdx, opts, correct, q: q.q, expl: q.expl, explRu: q.explRu, exam: q.exam };
    });
    setQuestions(built);
    setAnswers(new Array(built.length).fill(null));
    setPos(0);
    setTimeLeft(durationSeconds || null);
    setStage('running');
    window.scrollTo({ top: 0 });
  }

  function choose(i) {
    setAnswers(a => a.map((x, idx) => idx === pos ? i : x));
  }
  function jump(delta) {
    setPos(p => Math.max(0, Math.min(total - 1, p + delta)));
  }
  function finishExam() {
    const correctCount = questions.reduce((s, q, i) => s + (answers[i] === q.correct ? 1 : 0), 0);
    const pct = Math.round((correctCount / total) * 100);
    update(s => {
      s.finalExam = s.finalExam || { lastScore: null, bestScore: null };
      s.finalExam.lastScore = pct;
      if (s.finalExam.bestScore == null || pct > s.finalExam.bestScore) s.finalExam.bestScore = pct;
      // Also log wrong answers as mistakes
      questions.forEach((q, i) => {
        if (answers[i] != null && answers[i] !== q.correct) {
          const lec = s.lectures[q.lec.id];
          const filtered = lec.quizMistakes.filter(m => m.qIdx !== q.qIdx);
          lec.quizMistakes = [...filtered, { qIdx: q.qIdx, chosen: answers[i] }];
        }
      });
    });
    setStage('done');
    window.scrollTo({ top: 0 });
  }

  if (stage === 'start') {
    const totalAvailable = lectures.reduce((s, l) => s + l.quiz.length, 0);
    const examOnly = lectures.reduce((s, l) => s + l.quiz.filter(q => q.exam).length, 0);
    return (
      <div>
        <div className="page-head">
          <div>
            <div className="eyebrow">FINAL MIXED EXAM</div>
            <h1>Closest thing to the real paper</h1>
            <p style={{ marginTop: 8, maxWidth: 620 }}>
              Random questions drawn from every lecture, options shuffled per question. No feedback during — full review after.
            </p>
            <p style={{ marginTop: 4, fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>
              Случайные вопросы из всех лекций, варианты перемешаны. Без подсказок во время — полный разбор после.
            </p>
          </div>
        </div>

        <div className="grid cols-3" style={{ marginBottom: 28 }}>
          <div className="stat">
            <span className="label">Lectures loaded</span>
            <span className="value">{lectures.length}</span>
            <span className="delta">of 10 total</span>
          </div>
          <div className="stat">
            <span className="label">Question pool</span>
            <span className="value">{totalAvailable}</span>
            <span className="delta">{examOnly} real endterm Qs included</span>
          </div>
          <div className="stat">
            <span className="label">Best score</span>
            <span className="value">{store.finalExam?.bestScore != null ? `${store.finalExam.bestScore}%` : '—'}</span>
            <span className="delta">{store.finalExam?.lastScore != null ? `last: ${store.finalExam.lastScore}%` : 'no attempts yet'}</span>
          </div>
        </div>

        <div className="card" style={{ borderColor: 'var(--accent)', background: 'linear-gradient(135deg, var(--accent-soft) 0%, transparent 60%)', marginBottom: 16 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>⏱</span>
            Exam Simulator — 40 questions · 50 minutes
          </h3>
          <p style={{ marginTop: 8, marginBottom: 6, fontSize: 14 }}>
            Closest to the real AOS endterm. Timer auto-submits when time is up.
          </p>
          <p style={{ marginBottom: 20, fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>
            Точная симуляция эндтерма: 40 вопросов, 50 минут. При истечении времени — автоматическая сдача.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => buildExam(40, 'all', 50 * 60)}>
              Start Simulator →
            </button>
            <button className="btn" onClick={() => buildExam(40, 'exam-only', 50 * 60)} disabled={examOnly < 40}>
              Real Qs only
            </button>
          </div>
        </div>

        <div className="card">
          <h3>Pick a length — full bank (no timer)</h3>
          <p style={{ marginTop: 6, marginBottom: 20, fontSize: 14 }}>
            Mixes real endterm questions with extra practice Qs across all lectures.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[20, 40, 60].map(n => (
              <button key={n} className="btn btn-primary" disabled={n > totalAvailable} onClick={() => buildExam(n, 'all', null)}>
                {n} questions
              </button>
            ))}
            <button className="btn" onClick={() => buildExam(totalAvailable, 'all', null)}>
              All {totalAvailable}
            </button>
          </div>
        </div>

        <div className="card" style={{ marginTop: 16, borderColor: 'var(--accent-2)', background: 'linear-gradient(0deg, var(--accent-2-soft), transparent 60%)' }}>
          <h3>
            <span className="badge" style={{ background: 'var(--accent-2)', color: 'white', fontWeight: 600, marginRight: 10 }}>★ ENDTERM</span>
            Drill only the {examOnly} real exam questions
          </h3>
          <p style={{ marginTop: 8, marginBottom: 20, fontSize: 14 }}>
            Real questions from the AOS Endterm (both variants). Use this for a focused review of what actually appeared.
          </p>
          <p style={{ marginTop: -10, marginBottom: 18, fontSize: 13, fontStyle: 'italic', color: 'var(--muted)' }}>
            Реальные вопросы с эндтерма (оба варианта). Фокусированный повтор того, что было.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn" onClick={() => buildExam(30, 'exam-only', null)}>30 real Qs</button>
            <button className="btn btn-primary" onClick={() => buildExam(examOnly, 'exam-only', null)}>All {examOnly} real Qs</button>
          </div>
        </div>

        <div className="section-h"><h2>Rules of engagement</h2></div>
        <div className="grid cols-3">
          <RuleCard n="01" h="No feedback during" b="Answer choice locks per question; you can change before submitting." />
          <RuleCard n="02" h="Wrongs → mistake log" b="Every miss is added to your Mistakes Review automatically." />
          <RuleCard n="03" h="Stay calm" b="Skip and return — every question has a back button." />
        </div>
      </div>
    );
  }

  if (stage === 'running') {
    const q = questions[pos];
    const answered = answers.filter(a => a != null).length;
    const timerMins = timeLeft !== null ? Math.floor(timeLeft / 60) : null;
    const timerSecs = timeLeft !== null ? timeLeft % 60 : null;
    const timerStr = timeLeft !== null
      ? `${String(timerMins).padStart(2, '0')}:${String(timerSecs).padStart(2, '0')}`
      : null;
    const timerRed = timeLeft !== null && timeLeft < 300; // < 5 min
    return (
      <div>
        <div className="page-head">
          <div>
            <div className="eyebrow">FINAL MIXED EXAM · IN PROGRESS</div>
            <h1>Question {pos + 1}</h1>
            <div style={{ marginTop: 6, fontSize: 13, color: 'var(--muted)' }}>From Lecture {String(q.lec.id).padStart(2, '0')} · {q.lec.title}</div>
          </div>
          <div className="meta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            {timerStr && (
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, letterSpacing: 2,
                color: timerRed ? 'var(--bad)' : 'var(--ink)',
                background: timerRed ? 'rgba(220,38,38,0.08)' : 'var(--surface)',
                border: `2px solid ${timerRed ? 'var(--bad)' : 'var(--line)'}`,
                borderRadius: 10, padding: '6px 16px',
                animation: timerRed ? 'pulse 1s ease-in-out infinite' : 'none',
              }}>
                ⏱ {timerStr}
              </div>
            )}
            <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}>
              Answered {answered} / {total}
            </div>
            <div className="bar accent" style={{ width: 220 }}>
              <i style={{ width: `${(answered / total) * 100}%` }} />
            </div>
          </div>
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
              if (answers[pos] === i) cls.push('selected');
              return (
                <button key={i} className={cls.join(' ')} onClick={() => choose(i)}>
                  <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <button className="btn" onClick={() => jump(-1)} disabled={pos === 0}>← prev</button>
            <div style={{ display: 'flex', gap: 8 }}>
              {pos < total - 1
                ? <button className="btn btn-primary" onClick={() => jump(1)}>{answers[pos] != null ? 'next →' : 'skip →'}</button>
                : <button className="btn btn-primary" onClick={finishExam}>Finish exam →</button>}
            </div>
          </div>
        </div>

        {/* Question palette */}
        <div className="section-h"><h2>Question palette</h2><span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>click to jump</span></div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {questions.map((_, i) => {
            const isAnswered = answers[i] != null;
            const isCurrent = i === pos;
            return (
              <button key={i} onClick={() => setPos(i)} style={{
                width: 36, height: 36, borderRadius: 8,
                border: `1px solid ${isCurrent ? 'var(--ink)' : 'var(--line)'}`,
                background: isCurrent ? 'var(--ink)' : isAnswered ? 'var(--accent-soft)' : 'var(--surface)',
                color: isCurrent ? 'var(--bg)' : isAnswered ? 'var(--accent)' : 'var(--muted)',
                fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500,
                cursor: 'pointer',
              }}>{i + 1}</button>
            );
          })}
        </div>

        {answered === total && (
          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <button className="btn btn-primary" onClick={finishExam} style={{ fontSize: 14, padding: '12px 26px' }}>
              All answered — submit exam →
            </button>
          </div>
        )}
      </div>
    );
  }

  // stage === 'done'
  clearTimeout(timerRef.current);
  const correctCount = questions.reduce((s, q, i) => s + (answers[i] === q.correct ? 1 : 0), 0);
  const pct = Math.round((correctCount / total) * 100);
  const wrong = questions.map((q, i) => ({ q, i, chosen: answers[i] })).filter(x => x.chosen !== x.q.correct);
  const grade = pct >= 90 ? 'Excellent' : pct >= 75 ? 'Solid' : pct >= 60 ? 'Passing' : 'Needs more prep';

  // Per-lecture breakdown
  const byLec = {};
  questions.forEach((q, i) => {
    const lid = q.lec.id;
    byLec[lid] = byLec[lid] || { total: 0, correct: 0, lec: q.lec };
    byLec[lid].total++;
    if (answers[i] === q.correct) byLec[lid].correct++;
  });

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">FINAL EXAM · RESULTS</div>
          <h1>{grade}</h1>
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '46px 22px' }}>
        <div className="score-circle" style={{ '--p': pct }}>
          <span className="pct">{pct}%</span>
        </div>
        <div style={{ marginTop: 20, fontSize: 16 }}><strong>{correctCount}</strong> of <strong>{total}</strong> correct</div>
        <div style={{ marginTop: 4, color: 'var(--muted)', fontSize: 13, fontStyle: 'italic' }}>Правильных: {correctCount} из {total}</div>
        <div style={{ marginTop: 26, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn" onClick={() => setStage('start')}>↻ Try again</button>
          <button className="btn btn-primary" onClick={() => setView({ kind: 'review' })}>Open Mistakes Review →</button>
        </div>
      </div>

      <div className="section-h"><h2>By lecture</h2></div>
      <div className="grid cols-3">
        {Object.values(byLec).sort((a, b) => a.lec.id - b.lec.id).map(b => {
          const lpct = Math.round((b.correct / b.total) * 100);
          return (
            <div key={b.lec.id} className="card" style={{ padding: 18 }}>
              <div className="num-big" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>L{String(b.lec.id).padStart(2, '0')}</div>
              <div style={{ fontWeight: 600, marginTop: 4, marginBottom: 10, fontSize: 14 }}>{b.lec.title}</div>
              <div className="bar accent"><i style={{ width: `${lpct}%` }} /></div>
              <div style={{ marginTop: 6, fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{b.correct}/{b.total}</span>
                <span>{lpct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {wrong.length > 0 && (
        <React.Fragment>
          <div className="section-h"><h2>Questions to revisit ({wrong.length})</h2></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {wrong.map(({ q, i, chosen }, idx) => (
              <div key={idx} className="card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <span className="badge blue">L{String(q.lec.id).padStart(2, '0')}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>Q{i + 1}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>{q.q}</div>
                <div style={{ fontSize: 13, color: 'var(--good)', marginBottom: 4 }}>✓ {q.opts[q.correct]}</div>
                {chosen != null && <div style={{ fontSize: 13, color: 'var(--bad)', marginBottom: 6 }}>✕ You picked: {q.opts[chosen]}</div>}
                {chosen == null && <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', marginBottom: 6 }}>(skipped)</div>}
                <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>{q.expl}</div>
                <div style={{ marginTop: 4, fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>{q.explRu}</div>
              </div>
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

function RuleCard({ n, h, b }) {
  return (
    <div className="card">
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted-2)', marginBottom: 6 }}>{n}</div>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{h}</div>
      <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>{b}</div>
    </div>
  );
}

window.FinalExam = FinalExam;
