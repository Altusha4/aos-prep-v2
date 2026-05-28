/* Chat.jsx — floating AI tutor powered by Gemini */
function Chat({ view }) {
  const [open, setOpen] = React.useState(false);
  const [apiKey, setApiKey] = React.useState(() => localStorage.getItem('aos-gemini-key') || '');
  const [keyInput, setKeyInput] = React.useState('');
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const bottomRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const textareaRef = React.useRef(null);

  const currentLecture = React.useMemo(() => {
    if (view && view.lectureId && window.LECTURES && window.LECTURES[view.lectureId]) {
      return window.LECTURES[view.lectureId];
    }
    return null;
  }, [view && view.lectureId]);

  React.useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, loading]);

  React.useEffect(() => {
    if (open && apiKey && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [open, apiKey]);

  // Auto-resize textarea
  function handleInputChange(e) {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }

  function saveKey() {
    const k = keyInput.trim();
    if (!k) return;
    localStorage.setItem('aos-gemini-key', k);
    setApiKey(k);
    setKeyInput('');
    setError('');
  }

  function removeKey() {
    localStorage.removeItem('aos-gemini-key');
    setApiKey('');
    setMessages([]);
  }

  function buildSystemPrompt() {
    let p = 'You are a helpful study assistant for the Advanced Operating Systems (AOS) university course. ';
    p += 'Answer in the same language the student writes in — Russian or English. ';
    p += 'Be concise and clear. Explain concepts simply. Use examples when helpful.';

    if (currentLecture) {
      p += `\n\nThe student is currently studying Lecture ${currentLecture.id}: "${currentLecture.title}".`;
      if (currentLecture.topics && currentLecture.topics.length) {
        p += `\nTopics covered: ${currentLecture.topics.join(', ')}.`;
      }
      if (currentLecture.summary && currentLecture.summary.length) {
        p += `\n\nLecture content for context:\n${currentLecture.summary.join('\n')}`;
      }
    } else {
      p += '\n\nThe course covers 10 lectures: OS introduction, processes, threads, CPU scheduling, synchronization, deadlocks, memory management, virtual memory, file systems, and I/O systems.';
    }
    return p;
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setLoading(true);
    setError('');

    try {
      const contents = newMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: buildSystemPrompt() }] },
            contents,
            generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = err?.error?.message || `HTTP ${res.status}`;
        if (res.status === 400 && msg.toLowerCase().includes('api key')) {
          setError('Неверный API ключ. Проверьте и введите снова. / Invalid API key.');
          removeKey();
        } else {
          throw new Error(msg);
        }
        return;
      }

      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '…';
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'error', text: `Ошибка / Error: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const cx = window.AOS.classNames;

  return (
    <React.Fragment>
      <button
        className={cx('chat-fab', open && 'chat-fab-open')}
        onClick={() => setOpen(o => !o)}
        title="AI Tutor"
        aria-label="Open AI chat"
      >
        <span className="chat-fab-icon">{open ? '✕' : '✦'}</span>
        {!open && <span className="chat-fab-label">Ask AI</span>}
      </button>

      <div className={cx('chat-panel', open && 'chat-panel-open')}>
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-title">AI Tutor</div>
            <div className="chat-subtitle">
              {currentLecture
                ? `L${currentLecture.id}: ${currentLecture.title}`
                : 'Operating Systems'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {apiKey && (
              <button className="chat-icon-btn" onClick={() => setMessages([])} title="Clear chat">↺</button>
            )}
            <button className="chat-icon-btn" onClick={() => setOpen(false)} title="Close">✕</button>
          </div>
        </div>

        {!apiKey ? (
          <div className="chat-setup">
            <div className="chat-setup-icon">🔑</div>
            <div className="chat-setup-title">Нужен Gemini API ключ</div>
            <div className="chat-setup-desc">
              Получи бесплатный ключ за 1 минуту:<br />
              <strong>aistudio.google.com</strong> → Get API Key<br />
              <span style={{ color: 'var(--muted)', fontSize: 12 }}>
                Ключ сохраняется только в твоём браузере.
              </span>
            </div>
            {error && <div className="chat-setup-error">{error}</div>}
            <input
              ref={inputRef}
              className="chat-key-input"
              type="password"
              placeholder="AIzaSy..."
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveKey()}
              autoFocus
            />
            <button className="chat-key-btn" onClick={saveKey} disabled={!keyInput.trim()}>
              Сохранить ключ
            </button>
          </div>
        ) : (
          <React.Fragment>
            <div className="chat-messages">
              {messages.length === 0 && (
                <div className="chat-empty">
                  <div className="chat-empty-icon">✦</div>
                  <div>
                    {currentLecture
                      ? `Спрашивай про Лекцию ${currentLecture.id}: ${currentLecture.title}`
                      : 'Спрашивай всё об операционных системах'}
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {(currentLecture ? [
                      `Объясни простыми словами: ${(currentLecture.topics || [])[0] || 'главную тему'}`,
                      'В чём разница между этими понятиями?',
                      'Дай пример из реальной жизни',
                    ] : [
                      'Что такое deadlock и как его избежать?',
                      'Объясни разницу между процессом и потоком',
                      'Как работает виртуальная память?',
                    ]).map((hint, i) => (
                      <button
                        key={i}
                        className="chat-hint"
                        onClick={() => { setInput(hint); textareaRef.current && textareaRef.current.focus(); }}
                      >
                        {hint}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={cx('chat-msg', `chat-msg-${m.role}`)}>
                  <div className="chat-bubble">
                    <ChatText text={m.text} />
                  </div>
                </div>
              ))}

              {loading && (
                <div className="chat-msg chat-msg-assistant">
                  <div className="chat-bubble chat-thinking">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="chat-input-row">
              <textarea
                ref={textareaRef}
                className="chat-input"
                placeholder="Задай вопрос… / Ask a question…"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button
                className="chat-send"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                title="Send (Enter)"
              >
                ↑
              </button>
            </div>
            <div className="chat-footer">
              Gemini 2.0 Flash · бесплатно ·{' '}
              <span
                style={{ cursor: 'pointer', textDecoration: 'underline', color: 'var(--muted)' }}
                onClick={removeKey}
              >
                сменить ключ
              </span>
            </div>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
}

/* Renders basic markdown-like text: **bold**, `code`, newlines */
function ChatText({ text }) {
  const lines = text.split('\n');
  return (
    <React.Fragment>
      {lines.map((line, li) => {
        const parts = [];
        const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
        let last = 0, m;
        let key = 0;
        while ((m = re.exec(line)) !== null) {
          if (m.index > last) parts.push(<React.Fragment key={key++}>{line.slice(last, m.index)}</React.Fragment>);
          const raw = m[0];
          if (raw.startsWith('**')) {
            parts.push(<strong key={key++}>{raw.slice(2, -2)}</strong>);
          } else {
            parts.push(<code key={key++} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88em', background: 'rgba(0,0,0,0.07)', padding: '1px 4px', borderRadius: 3 }}>{raw.slice(1, -1)}</code>);
          }
          last = m.index + raw.length;
        }
        if (last < line.length) parts.push(<React.Fragment key={key++}>{line.slice(last)}</React.Fragment>);
        return (
          <React.Fragment key={li}>
            {parts.length ? parts : line}
            {li < lines.length - 1 && line.length > 0 && <br />}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
}

window.Chat = Chat;
