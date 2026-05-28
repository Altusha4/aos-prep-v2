/* Sidebar.jsx — main navigation */
function Sidebar({ view, setView, store, lectures, mobileOpen, setMobileOpen }) {
  const cx = window.AOS.classNames;

  const navItems = [
    { kind: 'dashboard', label: 'Dashboard', icon: '◇' },
    { kind: 'review', label: 'Mistakes Review', icon: '↺' },
    { kind: 'final', label: 'Final Mixed Exam', icon: '✦' },
    { kind: 'cheatsheet', label: 'Cheat Sheet · Шпаргалка', icon: '⚡' },
    { kind: 'glossary', label: 'Glossary · Глоссарий', icon: '⌘' },
    { kind: 'progress', label: 'Progress Tracker', icon: '▤' },
  ];

  function go(v) {
    setView(v);
    setMobileOpen(false);
    window.scrollTo({ top: 0 });
  }

  const totalMistakes = Object.values(store.lectures).reduce((sum, l) => sum + l.quizMistakes.length, 0);

  return (
    <React.Fragment>
      <div className={cx("backdrop", mobileOpen && "show")} onClick={() => setMobileOpen(false)} />
      <aside className={cx("sidebar", mobileOpen && "open")}>
        <div className="brand">
          <div className="brand-mark">AOS</div>
          <div>
            <div className="brand-name">AOS Prep</div>
            <div className="brand-sub">Final Exam · 10 lectures</div>
          </div>
        </div>

        <div className="nav-section">Study</div>
        {navItems.map((n) => (
          <div
            key={n.kind}
            className={cx("nav-item", view.kind === n.kind && "active")}
            onClick={() => go({ kind: n.kind })}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: 'var(--muted-2)', fontFamily: 'var(--font-mono)', fontSize: 12, width: 14, textAlign: 'center' }}>{n.icon}</span>
              {n.label}
            </span>
            {n.kind === 'review' && totalMistakes > 0 && (
              <span className="num" style={{ background: 'var(--bad-soft)', color: 'var(--bad)' }}>{totalMistakes}</span>
            )}
          </div>
        ))}

        <div className="nav-section">Lectures</div>
        {lectures.map((lec) => {
          const isActive = (view.kind === 'lecture' || view.kind === 'flashcards' || view.kind === 'quiz') && view.lectureId === lec.id;
          const prog = window.AOS.lectureProgress(store.lectures[lec.id], lec);
          return (
            <div key={lec.id}>
              <div
                className={cx("nav-item", isActive && "active")}
                onClick={() => go({ kind: 'lecture', lectureId: lec.id })}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <span className="num">{String(lec.id).padStart(2, '0')}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>{lec.title}</span>
                </span>
              </div>
              {isActive && (
                <div className="lec-progress" style={{ margin: '4px 12px 6px' }}>
                  <i style={{ width: `${Math.round(prog.overall * 100)}%` }} />
                </div>
              )}
            </div>
          );
        })}

        {/* Placeholder for missing lectures */}
        {Array.from({ length: 10 }).map((_, i) => {
          const id = i + 1;
          if (window.AOS.lectureExists(id)) return null;
          return (
            <div key={id} className="nav-item locked">
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="num">{String(id).padStart(2, '0')}</span>
                <span style={{ fontSize: 13 }}>Lecture {id} — pending</span>
              </span>
            </div>
          );
        })}

        <div style={{ marginTop: 30, padding: '12px 14px', background: 'var(--bg-tint)', borderRadius: 10, fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>
          <div style={{ fontWeight: 600, color: 'var(--ink-2)', marginBottom: 4 }}>Tip · Совет</div>
          Press <span className="kbd">Space</span> to flip a flashcard.<br/>
          <span style={{ fontStyle: 'italic' }}>Нажмите Space, чтобы перевернуть карточку.</span>
        </div>
      </aside>
    </React.Fragment>
  );
}

window.Sidebar = Sidebar;
