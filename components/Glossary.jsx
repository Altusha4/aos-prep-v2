/* Glossary.jsx — bilingual searchable glossary */
function Glossary({ setView }) {
  const terms = window.GLOSSARY || [];
  const cats = React.useMemo(() => {
    const set = new Set(terms.map(t => t.cat));
    return ['All', ...Array.from(set)];
  }, [terms]);

  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState('All');

  const filtered = React.useMemo(() => {
    const qq = q.trim().toLowerCase();
    return terms.filter(t => {
      if (cat !== 'All' && t.cat !== cat) return false;
      if (!qq) return true;
      return (
        t.term.toLowerCase().includes(qq) ||
        t.ru.toLowerCase().includes(qq) ||
        t.def.toLowerCase().includes(qq) ||
        t.defRu.toLowerCase().includes(qq)
      );
    });
  }, [terms, q, cat]);

  // Group by category
  const grouped = React.useMemo(() => {
    const g = {};
    filtered.forEach(t => {
      g[t.cat] = g[t.cat] || [];
      g[t.cat].push(t);
    });
    return g;
  }, [filtered]);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">GLOSSARY · ГЛОССАРИЙ</div>
          <h1>Every term you need · {terms.length} entries</h1>
          <p style={{ marginTop: 8, maxWidth: 620 }}>
            Bilingual EN / RU definitions for every concept across the 10 lectures. Search by either language, or filter by topic.
          </p>
          <p style={{ marginTop: 4, fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>
            Двуязычные определения всех понятий из 10 лекций. Поиск на любом языке, фильтр по теме.
          </p>
        </div>
        <div className="meta" style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>SHOWING</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 2 }}>{filtered.length}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>of {terms.length}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'stretch', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 320px', position: 'relative' }}>
          <input
            type="search"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search terms in English or Russian…"
            style={{
              width: '100%',
              padding: '12px 18px 12px 42px',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-md)',
              background: 'var(--surface)',
              fontSize: 14,
              fontFamily: 'inherit',
              color: 'var(--ink)',
              outline: 'none'
            }}
            onFocus={e => e.target.style.borderColor = 'var(--ink-2)'}
            onBlur={e => e.target.style.borderColor = 'var(--line)'}
          />
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-2)', fontSize: 16 }}>⌕</span>
          {q && (
            <button onClick={() => setQ('')} className="btn btn-ghost" style={{ position: 'absolute', right: 6, top: 6, padding: '4px 10px', fontSize: 12 }}>clear ×</button>
          )}
        </div>
      </div>

      <div className="filter-row" style={{ marginBottom: 22 }}>
        <span className="chip-label">Category</span>
        {cats.map(c => (
          <button key={c} className={`chip ${cat === c && 'active'}`} onClick={() => setCat(c)}>
            {c}
            {c !== 'All' && <span style={{ marginLeft: 6, opacity: 0.55, fontFamily: 'var(--font-mono)', fontSize: 11 }}>{terms.filter(t => t.cat === c).length}</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="icon">⌕</div>
          <h3>No matches</h3>
          <p>Try a different search term or category.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([catName, items]) => (
          <div key={catName} style={{ marginBottom: 36 }}>
            <div className="section-h" style={{ marginTop: 0 }}>
              <h2>{catName}</h2>
              <span className="badge">{items.length} terms</span>
            </div>
            <dl className="dl">
              {items.map((t, i) => (
                <div key={i}>
                  <dt>
                    {t.term}
                    <span className="ru"> · {t.ru}</span>
                  </dt>
                  <dd>
                    {t.def}
                    <span className="ru">{t.defRu}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))
      )}
    </div>
  );
}

window.Glossary = Glossary;
