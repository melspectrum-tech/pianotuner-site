// 网站助手「音叉」的网络与会话存储。会话 id 和最近的对话放 sessionStorage：
// 本站是 MPA，跨页时对话接着聊；关掉标签页就忘。读写全部包 try/catch（隐私模式会抛）。
export const CHAT_API = '/api/pianotuner/assistant/chat';
export const HANDOFF_API = '/api/pianotuner/assistant/handoff';

const K_CONV = 'pt_asst_conv';
const K_LOG = 'pt_asst_log';
const K_SEEN = 'pt_asst_seen';
const K_QUIET = 'pt_assistant_quiet'; // localStorage：「别再主动提示」跨会话记住
const LOG_MAX = 30;

function read(store, key, fallback) {
  try {
    const v = window[store].getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
function write(store, key, value) {
  try { window[store].setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

export const loadLog = () => read('sessionStorage', K_LOG, []);
export const saveLog = (log) => write('sessionStorage', K_LOG, log.slice(-LOG_MAX));
export const conversationId = () => read('sessionStorage', K_CONV, null);
export const isQuiet = () => read('localStorage', K_QUIET, false) === true;
export const setQuiet = () => write('localStorage', K_QUIET, true);
export const wasSeen = (key) => read('sessionStorage', K_SEEN, []).includes(key);
export const markSeen = (key) => {
  const seen = read('sessionStorage', K_SEEN, []);
  if (!seen.includes(key)) write('sessionStorage', K_SEEN, [...seen, key]);
};

async function post(url, body) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  let data = null;
  try { data = await r.json(); } catch { /* 非 JSON（nginx 限流页等） */ }
  if (!r.ok || !data || data.status !== 'ok') {
    const err = new Error('request failed');
    err.status = r.status;
    throw err;
  }
  return data;
}

export async function ask({ message, page, section, lang }) {
  const data = await post(CHAT_API, { conversation_id: conversationId(), message, page, section, lang });
  write('sessionStorage', K_CONV, data.conversation_id);
  return data;
}

export const sendHandoff = ({ summary, email, lang, page }) =>
  post(HANDOFF_API, { conversation_id: conversationId(), summary, email, consent: true, lang, page });
