/* app.jsx — top-level mounting and view routing */
function App() {
  const [store, update] = window.AOS.useStore();
  const [view, setView] = React.useState({ kind: 'dashboard' });
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const lectures = window.AOS.getLectures();

  // Scroll up on view change
  React.useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view.kind, view.lectureId]);

  let content;
  if (view.kind === 'dashboard') {
    content = <Dashboard store={store} setView={setView} lectures={lectures} />;
  } else if (view.kind === 'lecture') {
    content = <LectureOverview lectureId={view.lectureId} store={store} setView={setView} />;
  } else if (view.kind === 'flashcards') {
    content = <Flashcards lectureId={view.lectureId} store={store} update={update} setView={setView} />;
  } else if (view.kind === 'quiz') {
    content = <Quiz lectureId={view.lectureId} store={store} update={update} setView={setView} />;
  } else if (view.kind === 'review') {
    content = <Review store={store} update={update} setView={setView} />;
  } else if (view.kind === 'final') {
    content = <FinalExam store={store} update={update} setView={setView} />;
  } else if (view.kind === 'progress') {
    content = <ProgressPage store={store} setView={setView} update={update} />;
  } else if (view.kind === 'glossary') {
    content = <Glossary setView={setView} />;
  } else {
    content = <Dashboard store={store} setView={setView} lectures={lectures} />;
  }

  return (
    <React.Fragment>
      <div className="app">
        <Sidebar
          view={view}
          setView={setView}
          store={store}
          lectures={lectures}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
        <button className="menu-btn" onClick={() => setMobileOpen(o => !o)} aria-label="menu">
          <span style={{ fontSize: 20 }}>≡</span>
        </button>
        <main className="main">{content}</main>
      </div>
      {ReactDOM.createPortal(<Chat view={view} />, document.body)}
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
