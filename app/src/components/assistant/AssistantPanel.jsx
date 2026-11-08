import { useEffect, useRef, useState } from 'react';
import { useT } from '../../i18n';
import { href } from '../../i18n/urls';
import { sendHandoff } from './api';
import { track } from '../../lib/analytics';

const MAX = 500;
const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;

/** 转交卡片：摘要可改、邮箱、同意勾选——只有访客自己点「发送」才会发信。 */
function HandoffCard({ summary, page, onDone }) {
  const { t, lang } = useT();
  const [text, setText] = useState(summary);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState(null); // null | sending | ok | err | invalid
  const submit = async (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim()) || !text.trim()) { setStatus('invalid'); return; }
    setStatus('sending');
    try {
      await sendHandoff({ summary: text.trim().slice(0, 1000), email: email.trim(), lang, page });
      setStatus('ok');
      track('assistant-handoff');
      onDone(true);
    } catch { setStatus('err'); }
  };
  if (status === 'ok') {
    return <p className="fork-handoff__done t-body-sm" role="status">{t('已转交给创始人。回复会发到你留的邮箱。', 'Sent to the founder. The reply will go to the email you gave.')}</p>;
  }
  return (
    <form className="fork-handoff" onSubmit={submit}>
      <p className="t-ui fork-handoff__title">{t('转交给创始人', 'PASS TO THE FOUNDER')}</p>
      <label className="t-body-sm">
        {t('要转交的问题', 'Your question')}
        <textarea value={text} maxLength={1000} rows={3} onChange={(e) => setText(e.target.value)} />
      </label>
      <label className="t-body-sm">
        {t('你的邮箱', 'Your email')}
        <input type="email" value={email} autoComplete="email" onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="fork-handoff__consent t-body-sm">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>{t('同意把这个问题、最近的对话和我的邮箱发给创始人，用于回复我。', 'I agree to send this question, the recent conversation and my email to the founder so they can reply.')}</span>
      </label>
      <div className="fork-handoff__row">
        <button type="submit" className="btn btn--dark t-ui" disabled={!consent || status === 'sending'}><i /> <span>{status === 'sending' ? t('发送中…', 'SENDING…') : t('发送给创始人', 'SEND TO FOUNDER')}</span></button>
        <button type="button" className="fork__textbtn t-ui" onClick={() => onDone(false)}>{t('先不用', 'NOT NOW')}</button>
      </div>
      {status === 'invalid' ? <p className="fork__err t-body-sm" role="alert">{t('请填写问题和有效的邮箱。', 'Please add your question and a valid email.')}</p> : null}
      {status === 'err' ? <p className="fork__err t-body-sm" role="alert">{t('没发出去，请稍后再试，或直接写信到 v0id@melspectrum.com。', "That didn't go through. Try again later, or email v0id@melspectrum.com.")}</p> : null}
    </form>
  );
}

/**
 * 对话卡。回答一律按纯文本渲染（React 文本节点 + white-space: pre-wrap），绝不 dangerouslySetInnerHTML。
 * data-lenis-prevent：卡片内的滚轮只滚对话，不被 Lenis 接管成页面滚动。
 */
export default function AssistantPanel({ log, busy, suggestions, handoff, page, onSend, onClose, onHandoffDone, onFollow, headingRef }) {
  const { t, lang } = useT();
  const [draft, setDraft] = useState('');
  const logRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log.length, busy, handoff]);

  const send = (text) => {
    const v = (text ?? draft).trim();
    if (!v || busy) return;
    onSend(v.slice(0, MAX));
    if (text === undefined) setDraft('');
  };
  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); }
  };

  return (
    <div className="fork__panel island-light" role="dialog" aria-modal="false" aria-labelledby="fork-title" data-lenis-prevent
      onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } }}>
      <div className="fork__head">
        <span className="t-ui" id="fork-title" ref={headingRef}>{t('音叉 · 网站助手', 'FORK · SITE GUIDE')}</span>
        <button type="button" className="fork__textbtn t-ui" onClick={onClose}>{t('关闭', 'CLOSE')} ✕</button>
      </div>
      <p className="fork__notice">
        {t('对话由第三方 AI（MiniMax）处理，保存 90 天，请不要填写敏感信息。回答可能不准确，以网站页面为准。', 'Chats are processed by a third-party AI (MiniMax) and kept for 90 days. Please do not share sensitive information. Answers may be inaccurate; the website pages are authoritative.')}{' '}
        <a href={href(lang, 'privacy', 's4')}>{t('隐私政策', 'Privacy')}</a>
      </p>
      <div className="fork__log" ref={logRef} aria-live="polite">
        {log.length === 0 ? (
          <p className="fork__msg fork__msg--assistant">{t('你好，我是音叉。关于 Piano Tuner 的问题都可以问我；觉得哪里没讲清楚，也欢迎直接告诉我。', "Hi, I'm Fork. Ask me anything about Piano Tuner, and if something on the site isn't clear, tell me.")}</p>
        ) : log.map((m, i) => (
          <div key={i} className={`fork__msg fork__msg--${m.role}`}>
            {m.text}
            {m.link ? <a className="blink t-ui fork__link" href={m.link.href} onClick={(e) => onFollow(e, m.link)}>{m.link.label} →</a> : null}
          </div>
        ))}
        {busy ? <p className="fork__msg fork__msg--assistant fork__typing" aria-label={t('音叉正在想', 'Fork is thinking')}>···</p> : null}
        {handoff ? <HandoffCard key={handoff.key} summary={handoff.summary} page={page} onDone={onHandoffDone} /> : null}
      </div>
      {log.length === 0 && suggestions.length ? (
        <div className="fork__chips">
          {suggestions.map((s) => <button key={s} type="button" className="fork__chip t-body-sm" onClick={() => send(s)}>{s}</button>)}
        </div>
      ) : null}
      <form className="fork__form" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <textarea
          ref={inputRef}
          value={draft}
          rows={2}
          maxLength={MAX}
          placeholder={t('问点什么，或者告诉我哪里没讲清楚', 'Ask something, or tell me what was unclear')}
          aria-label={t('给音叉的消息', 'Message to Fork')}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
        />
        <button type="submit" className="btn btn--accent t-ui" disabled={busy || !draft.trim()}><i /> <span>{t('发送', 'SEND')}</span></button>
      </form>
    </div>
  );
}
