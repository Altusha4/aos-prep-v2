/* LectureOverview.jsx — single lecture summary, topics, traps */
function LectureOverview({ lectureId, store, setView }) {
  const lec = window.LECTURES[lectureId];
  if (!lec) {
    return (
      <div>
        <div className="page-head"><h1>Lecture {lectureId} not loaded</h1></div>
        <div className="empty">
          <div className="icon">·</div>
          <h3>Content pending</h3>
          <p>Add the data file for this lecture and it will appear here automatically.</p>
        </div>
      </div>
    );
  }

  const lecStore = store.lectures[lectureId];
  const p = window.AOS.lectureProgress(lecStore, lec);
  const pct = Math.round(p.overall * 100);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">LECTURE {String(lec.id).padStart(2, '0')} · OVERVIEW</div>
          <h1>{lec.title}</h1>
          <div style={{ marginTop: 6, color: 'var(--muted)', fontStyle: 'italic' }}>{lec.titleRu}</div>
        </div>
        <div className="meta">
          <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>
            MASTERY · {pct}%
          </div>
          <div className="bar accent" style={{ width: 220, marginTop: 6 }}>
            <i style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="grid cols-3" style={{ marginBottom: 28 }}>
        <ActionTile
          eyebrow="Flashcards"
          count={`${p.fcDone}/${p.fcTotal} known`}
          title="Drill the terms"
          cta="Open flashcards"
          onClick={() => setView({ kind: 'flashcards', lectureId })}
        />
        <ActionTile
          eyebrow="Quiz"
          count={lecStore.bestScore != null ? `best ${lecStore.bestScore}%` : `${lec.quiz.length} MCQs`}
          title="Run the quiz"
          subtitle={lec.quiz.filter(q => q.exam).length > 0 ? `★ ${lec.quiz.filter(q => q.exam).length} real endterm questions inside` : null}
          cta="Start quiz"
          onClick={() => setView({ kind: 'quiz', lectureId })}
        />
        <ActionTile
          eyebrow="Skim summary"
          count={`${lec.topics.length} topics`}
          title="Read the summary below"
          cta="Jump down"
          onClick={() => {
            const el = document.getElementById('summary-section');
            if (el) {
              const r = el.getBoundingClientRect();
              window.scrollTo({ top: window.scrollY + r.top - 24, behavior: 'smooth' });
            }
          }}
        />
      </div>

      <div className="section-h">
        <h2>Topics covered</h2>
      </div>
      <div className="card" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {lec.topics.map((t, i) => (
          <span key={i} className="badge blue" style={{ padding: '6px 12px', fontSize: 12 }}>{t}</span>
        ))}
      </div>

      <div className="section-h" id="summary-section">
        <h2>Summary · Конспект</h2>
      </div>
      <div className="card">
        <RichSummary items={lec.summary} itemsRu={lec.summaryRu} />
      </div>

      {lec.traps && lec.traps.length > 0 && (
        <React.Fragment>
          <div className="section-h">
            <h2>Common exam traps</h2>
            <span className="badge medium">read carefully</span>
          </div>
          <div>
            {lec.traps.map((t, i) => (
              <div key={i} className="trap">
                <h4>Trap {i + 1}</h4>
                <p>{t.t}</p>
                <p style={{ marginTop: 6, fontStyle: 'italic', color: 'var(--muted)', fontSize: 13 }}>{t.ru}</p>
              </div>
            ))}
          </div>
        </React.Fragment>
      )}

      <div className="section-h">
        <h2>Quick reference card</h2>
      </div>
      <div className="card">
        <dl className="dl">
          {lec.flashcards.slice(0, 6).map((fc, i) => (
            <div key={i}>
              <dt>{fc.q}</dt>
              <dd>{fc.a}<span className="ru">{fc.ru}</span></dd>
            </div>
          ))}
        </dl>
        <div style={{ marginTop: 14, fontSize: 12, color: 'var(--muted)' }}>
          ⤷ See the rest in the flashcards mode.
        </div>
      </div>

      <div style={{ marginTop: 36, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        {lec.id > 1 && window.AOS.lectureExists(lec.id - 1) ? (
          <button className="btn" onClick={() => setView({ kind: 'lecture', lectureId: lec.id - 1 })}>← Lecture {String(lec.id - 1).padStart(2, '0')}</button>
        ) : <span />}
        {lec.id < 10 && window.AOS.lectureExists(lec.id + 1) ? (
          <button className="btn btn-primary" onClick={() => setView({ kind: 'lecture', lectureId: lec.id + 1 })}>Lecture {String(lec.id + 1).padStart(2, '0')} →</button>
        ) : <span />}
      </div>
    </div>
  );
}

function ActionTile({ eyebrow, count, title, subtitle, cta, onClick }) {
  return (
    <div className="card" style={{ cursor: 'pointer', transition: 'all 0.15s ease' }} onClick={onClick}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ink-2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = ''; }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div className="eyebrow">{eyebrow}</div>
        <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{count}</span>
      </div>
      <h3 style={{ marginTop: 6, marginBottom: subtitle ? 4 : 18 }}>{title}</h3>
      {subtitle && <div style={{ fontSize: 12, color: 'var(--accent-2)', marginBottom: 14, fontWeight: 500 }}>{subtitle}</div>}
      <span className="btn btn-primary">{cta} →</span>
    </div>
  );
}

/* ---- Rich Summary: parse "## heading", "• bullet", and **bold** ---- */
function renderInline(s) {
  // split on **bold** segments
  const parts = [];
  const re = /\*\*([^*]+)\*\*/g;
  let last = 0; let m; let key = 0;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) parts.push(s.slice(last, m.index));
    parts.push(<strong key={'b' + key++}>{m[1]}</strong>);
    last = m.index + m[0].length;
  }
  if (last < s.length) parts.push(s.slice(last));
  return parts;
}

function isHeading(s) {
  return s.startsWith('## ');
}
function isBullet(s) {
  return s.startsWith('• ') || s.startsWith('- ');
}
function stripPrefix(s) {
  if (isHeading(s)) return s.slice(3);
  if (isBullet(s)) return s.slice(2);
  return s;
}

function RichSummary({ items, itemsRu }) {
  // Group adjacent bullets into one list block
  const blocks = [];
  let listBuf = null;
  for (let i = 0; i < items.length; i++) {
    const en = items[i];
    const ru = itemsRu[i] || '';
    if (isBullet(en)) {
      if (!listBuf) { listBuf = { type: 'list', items: [] }; blocks.push(listBuf); }
      listBuf.items.push({ en: stripPrefix(en), ru: stripPrefix(ru) });
    } else if (isHeading(en)) {
      listBuf = null;
      blocks.push({ type: 'heading', en: stripPrefix(en), ru: stripPrefix(ru) });
    } else {
      listBuf = null;
      blocks.push({ type: 'para', en, ru });
    }
  }
  return (
    <div className="rich-summary">
      {blocks.map((b, i) => {
        if (b.type === 'heading') {
          return (
            <div key={i} className="rich-block heading">
              {b.en}
              {b.ru && <span className="ru">{b.ru}</span>}
            </div>
          );
        }
        if (b.type === 'list') {
          return (
            <div key={i} className="rich-list">
              {b.items.map((it, j) => (
                <div key={j} className="rich-list-item">
                  <span className="bullet">▸</span>
                  <div className="body">
                    <p className="en">{renderInline(it.en)}</p>
                    {it.ru && <p className="ru-text">{renderInline(it.ru)}</p>}
                  </div>
                </div>
              ))}
            </div>
          );
        }
        return (
          <div key={i} className="rich-block para">
            <p className="en">{renderInline(b.en)}</p>
            {b.ru && <p className="ru-text">{renderInline(b.ru)}</p>}
          </div>
        );
      })}
    </div>
  );
}

window.LectureOverview = LectureOverview;
