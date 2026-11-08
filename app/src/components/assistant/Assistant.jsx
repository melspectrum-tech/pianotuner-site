import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useT } from '../../i18n';
import { HINTS } from '../../data/assistant-hints';
import { gsap, ScrollTrigger, prefersReduced, EASE, DUR } from '../../lib/motion';
import { track } from '../../lib/analytics';
import ForkMark from './ForkMark';
import AssistantPanel from './AssistantPanel';
import * as api from './api';

/**
 * 网站助手「音叉」（2026-11-08）。不是角落里的聊天气泡：音叉停在当前区块的标题旁，
 * 换区块时飞过去；在一个区块停留 4 秒才冒一句提示（每块一次，可静音），点开就能提问、提反馈、转交创始人。
 *
 * - 只在 effect 里渲染（与 LangHint 同一模式），SSR 输出为空：禁用 JS / 404 掉入口 JS 时页面不受影响。
 * - motion owner：根节点的 transform / opacity / visibility / position 只由这里的 GSAP 写；
 *   波形只在「思考」态由 GSAP 驱动；CSS 只管 hover / focus。
 * - 首页视频锁定期间（#top 在判定带内）完全不出现。
 * - 手机（<768px）与 reduced-motion：不飞、不主动提示，只在页首标题旁放一个静止标记 + 页脚入口，打开为底部 sheet。
 */
const MARK = 36;
const DWELL = 4000;
const FLY_MQ = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';
const DEFAULT_ASK = [
  ['Piano Tuner 是什么？', 'What is Piano Tuner?'],
  ['什么时候能买到？', 'When can I buy it?'],
  ['我想提个建议', 'I have a suggestion'],
];

export default function Assistant({ page }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  if (!ready || page === '404') return null;
  return <AssistantInner page={page} />;
}

const navOffset = () => (document.querySelector('.nav')?.offsetHeight || 64) + 16;

function AssistantInner({ page }) {
  const { t, lang } = useT();
  const hints = HINTS[page] || {};
  const [fly] = useState(() => window.matchMedia(FLY_MQ).matches);
  // 视频锁定只在桌面 + 有动效时存在（useHeroVideoLock 同一条 media query）
  const [heroLock] = useState(() => fly && page === 'index' && !!document.querySelector('#top.hero--video'));
  const [anchor, setAnchor] = useState('top');
  const [hint, setHint] = useState(null);
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState(() => api.loadLog());
  const [busy, setBusy] = useState(false);
  const [handoff, setHandoff] = useState(null);
  const [footerSlot, setFooterSlot] = useState(null);

  const rootRef = useRef(null);
  const markRef = useRef(null);
  const hintRef = useRef(null);
  const sheetRef = useRef(null);
  const anchorRef = useRef('top');
  const openRef = useRef(false);
  const shownRef = useRef(false);
  const placedRef = useRef(false);
  const logRef = useRef(log);
  logRef.current = log;

  /** 把根节点放到某个区块标题的右上方（文档坐标，随页面自然滚动，不做逐帧计算）。 */
  const place = useCallback((target, animate) => {
    const root = rootRef.current;
    const sec = typeof target === 'string' ? document.getElementById(target) : target;
    if (!root || !sec || openRef.current) return;
    const h = sec.querySelector('h1, h2') || sec;
    const hr = h.getBoundingClientRect();
    const sr = sec.getBoundingClientRect();
    const x = Math.round(Math.min(sr.right, document.documentElement.clientWidth) - 24 - MARK);
    const y = Math.round(Math.max(hr.top - MARK - 12, sr.top + 8) + window.scrollY);
    root.dataset.island = sec.matches('.island-dark, .hero') ? 'dark' : 'light';
    if (animate && fly && placedRef.current) gsap.to(root, { x, y, duration: DUR.l, ease: EASE.inOut, overwrite: 'auto' });
    else gsap.set(root, { x, y });
    placedRef.current = true;
  }, [fly]);

  const show = useCallback((on) => {
    const root = rootRef.current;
    if (!root || shownRef.current === on) return;
    shownRef.current = on;
    if (fly) gsap.to(root, { autoAlpha: on ? 1 : 0, duration: on ? DUR.m : DUR.s, ease: on ? EASE.out : EASE.exit, overwrite: 'auto' });
    else gsap.set(root, { autoAlpha: on ? 1 : 0 });
  }, [fly]);

  // 首次：藏起来（JS 成功接管后才写 inline 隐藏，符合 E0），放到当前锚点
  useLayoutEffect(() => {
    gsap.set(rootRef.current, { autoAlpha: 0, x: 0, y: 0 });
    place('top', false);
    show(!heroLock);
    setFooterSlot(document.querySelectorAll('.footer .footer__col')[1] || null);
  }, [place, show, heroLock]);

  // 当前区块：判定带在视口 30%–40% 之间，取 DOM 顺序最后一个在带内的锚点
  useEffect(() => {
    if (!fly) return undefined;
    const ids = ['top', ...Object.keys(hints)].filter((id, i, a) => a.indexOf(id) === i && document.getElementById(id));
    const els = ids.map((id) => document.getElementById(id));
    const inBand = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => inBand.set(e.target.id, e.isIntersecting));
      let act = null;
      for (const el of els) if (inBand.get(el.id)) act = el.id;
      if (act && act !== anchorRef.current) { anchorRef.current = act; setAnchor(act); }
    }, { rootMargin: '-30% 0px -60% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [fly, page]); // eslint-disable-line react-hooks/exhaustive-deps

  // 换区块：飞过去；停留 DWELL 才冒提示
  useEffect(() => {
    setHint((h) => (h && h.kind === 'section' ? null : h));
    const hidden = heroLock && anchor === 'top';
    if (!openRef.current) { place(anchor, true); show(!hidden); }
    const h = hints[anchor];
    if (!fly || hidden || !h || api.isQuiet()) return undefined;
    const key = `${page}#${anchor}`;
    if (api.wasSeen(key)) return undefined;
    const timer = setTimeout(() => {
      if (openRef.current || anchorRef.current !== anchor) return;
      api.markSeen(key);
      setHint({ kind: 'section', text: t(h.zh, h.en), ask: h.ask.map(([zh, en]) => t(zh, en)) });
    }, DWELL);
    return () => clearTimeout(timer);
  }, [anchor]); // eslint-disable-line react-hooks/exhaustive-deps

  // 没有结尾区块提示的页面：读到 90% 时，音叉跳到最后一个区块问一句「哪里没讲清楚」
  useEffect(() => {
    if (!fly || hints.join || hints.cta) return undefined;
    const key = `${page}#end`;
    if (api.wasSeen(key) || api.isQuiet()) return undefined;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0 || window.scrollY / max < 0.9 || openRef.current) return;
      window.removeEventListener('scroll', onScroll);
      api.markSeen(key);
      const last = [...document.querySelectorAll('#main section')].pop();
      if (last) { place(last, true); show(true); }
      setHint({ kind: 'end', text: t('看到这儿了——有哪里没讲清楚吗？告诉我，我记下来给团队。', "You've made it to the end. Anything unclear? Tell me and I'll pass it to the team."), ask: [t('我有个建议', 'I have a suggestion'), t('我想联系创始人', "I'd like to reach the founder")] });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [fly, page]); // eslint-disable-line react-hooks/exhaustive-deps

  // 布局变了（hero pin 晚建、字体、窗口）就重新对准
  useEffect(() => {
    const re = () => place(anchorRef.current, false);
    ScrollTrigger.addEventListener('refresh', re);
    window.addEventListener('resize', re);
    document.fonts?.ready?.then(re);
    return () => { ScrollTrigger.removeEventListener('refresh', re); window.removeEventListener('resize', re); };
  }, [place]);

  // 提示气泡入场
  useLayoutEffect(() => {
    if (!hint || !hintRef.current || !fly) return undefined;
    const tw = gsap.fromTo(hintRef.current, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: DUR.m, ease: EASE.out });
    return () => tw.kill();
  }, [hint, fly]);

  // 思考态：波形翻转
  useEffect(() => {
    const wave = markRef.current?.querySelector('.fork__wave');
    if (!wave || !fly || !busy) return undefined;
    const tw = gsap.to(wave, { scaleY: -1, transformOrigin: '50% 50%', duration: 0.35, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    return () => { tw.kill(); gsap.set(wave, { clearProps: 'transform' }); };
  }, [busy, fly]);

  const openPanel = useCallback(() => {
    if (openRef.current) return;
    setHint(null);
    openRef.current = true;
    setOpen(true);
    track('assistant-open');
    if (!fly) { sheetRef.current?.showModal(); return; }
    // 打开时把音叉 + 卡片固定在当前视口位置；看不见时落到右上
    const r = markRef.current.getBoundingClientRect();
    const top0 = navOffset();
    const panelH = Math.min(560, window.innerHeight * 0.72);
    const onScreen = shownRef.current && r.bottom > top0 && r.top < window.innerHeight - 80;
    const x = onScreen ? r.left : document.documentElement.clientWidth - 24 - MARK;
    const y = Math.max(top0, Math.min(onScreen ? r.top : top0, window.innerHeight - panelH - MARK - 24));
    gsap.set(rootRef.current, { position: 'fixed', x, y, autoAlpha: 1 });
    shownRef.current = true;
  }, [fly]);

  const closePanel = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setOpen(false);
    if (sheetRef.current?.open) sheetRef.current.close();
    if (fly) {
      gsap.set(rootRef.current, { position: 'absolute' });
      place(anchorRef.current, false);
      shownRef.current = true;
      show(!(heroLock && anchorRef.current === 'top'));
    }
    markRef.current?.focus({ preventScroll: true });
  }, [fly, place, show, heroLock]);

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - navOffset();
    if (window.__lenis) window.__lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: prefersReduced() ? 'auto' : 'smooth' });
    if (!fly) return;
    // 目标标题下一道一次性的强调色擦除线（GSAP 自建自删，不碰页面元素）
    const h = el.querySelector('h1, h2') || el;
    const r = h.getBoundingClientRect();
    const bar = document.createElement('div');
    bar.className = 'fork__flash';
    Object.assign(bar.style, { left: `${r.left + window.scrollX}px`, top: `${r.bottom + window.scrollY + 6}px`, width: `${Math.min(r.width, 480)}px` });
    document.body.appendChild(bar);
    gsap.timeline({ onComplete: () => bar.remove() })
      .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: DUR.wipe, ease: EASE.wipe, delay: 0.4 })
      .to(bar, { autoAlpha: 0, duration: DUR.m, ease: EASE.exit, delay: 1.2 });
  }, [fly]);

  const append = (items) => {
    const next = [...logRef.current, ...items];
    logRef.current = next;
    setLog(next);
    api.saveLog(next);
  };

  const onSend = useCallback(async (text) => {
    track('assistant-ask');
    append([{ role: 'user', text }]);
    setBusy(true);
    setHandoff(null);
    try {
      const data = await api.ask({ message: text, page, section: anchorRef.current, lang });
      const entry = { role: 'assistant', text: data.reply || '' };
      const notes = [];
      for (const a of data.actions || []) {
        if (a.type === 'go_to_section') {
          if (a.same_page) {
            if (!fly) closePanel();
            scrollToSection(a.section);
          } else {
            entry.link = { href: a.href, label: a.title || t('去看看', 'Take a look') };
          }
        } else if (a.type === 'handoff') {
          setHandoff({ summary: a.summary || text, key: Date.now() });
        } else if (a.type === 'feedback_recorded') {
          notes.push({ role: 'note', text: t('✓ 已记下这条反馈', '✓ Feedback noted') });
          track('assistant-feedback');
        }
      }
      append([...(entry.text || entry.link ? [entry] : []), ...notes]);
    } catch (err) {
      append([{ role: 'note', text: err.status === 429
        ? t('问得有点快了，稍等一会儿再试。', 'That was a bit fast. Please wait a moment and try again.')
        : t('暂时连不上。可以稍后再试，或把问题转给创始人。', "I can't connect right now. Try again later, or pass your question to the founder.") }]);
      if (err.status !== 429) setHandoff({ summary: text, key: Date.now() });
    } finally {
      setBusy(false);
    }
  }, [page, lang, fly, closePanel, scrollToSection, t]);

  const suggestions = (hints[anchor]?.ask || DEFAULT_ASK).map(([zh, en]) => t(zh, en));
  const panel = open ? (
    <AssistantPanel
      log={log}
      busy={busy}
      suggestions={suggestions}
      handoff={handoff}
      page={page}
      onSend={onSend}
      onClose={closePanel}
      onHandoffDone={(sent) => {
        setHandoff(null);
        if (sent) append([{ role: 'note', text: t('✓ 已转交给创始人', '✓ Passed to the founder') }]);
      }}
      onFollow={() => { /* 跨页链接：照常导航，sessionStorage 里的对话会接着显示 */ }}
    />
  ) : null;

  return (
    <>
      <div className="fork" ref={rootRef} data-open={open ? 'true' : 'false'} data-mode={fly ? 'fly' : 'static'}>
        <ForkMark
          ref={markRef}
          state={busy ? 'thinking' : hint ? 'hint' : 'idle'}
          label={t('打开网站助手「音叉」', 'Open Fork, the site guide')}
          expanded={open}
          onClick={() => (openRef.current ? closePanel() : openPanel())}
        />
        {hint && !open ? (
          <div className="fork__hint island-light" ref={hintRef} role="status">
            <p className="fork__hinttext">{hint.text}</p>
            <div className="fork__chips">
              {hint.ask.map((q) => <button key={q} type="button" className="fork__chip t-body-sm" onClick={() => { openPanel(); onSend(q); }}>{q}</button>)}
            </div>
            <div className="fork__hintfoot">
              <button type="button" className="fork__textbtn t-ui" onClick={() => setHint(null)}>{t('知道了', 'GOT IT')}</button>
              <button type="button" className="fork__textbtn t-ui" onClick={() => { api.setQuiet(); setHint(null); }}>{t('别再主动提示', 'NO MORE HINTS')}</button>
            </div>
          </div>
        ) : null}
        {fly ? panel : null}
      </div>
      {!fly ? (
        <dialog className="fork__sheet" ref={sheetRef} aria-label={t('网站助手「音叉」', 'Fork, the site guide')}
          onClose={closePanel} onClick={(e) => { if (e.target === e.currentTarget) closePanel(); }}>
          {panel}
        </dialog>
      ) : null}
      {footerSlot ? createPortal(
        <a href="#main" role="button" onClick={(e) => { e.preventDefault(); openPanel(); }}>{t('问问音叉', 'Ask Fork')}</a>,
        footerSlot,
      ) : null}
    </>
  );
}
