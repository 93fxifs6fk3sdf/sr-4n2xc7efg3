// 세일즈 주간보고 화면 공통 (GitHub Pages)
// 데이터는 구글 Apps Script 웹앱(API)과 주고받습니다. apps-script/Code.gs 의 WEBAPP_URL 과 같아야 함
const API = 'https://script.google.com/macros/s/AKfycbz2xqr4g_7nrShEAmmvsPB4yfPk8MZNSv88BR0dfGs0QTF3C2Q1zF1fXrmnaaa102CU/exec';

const $ = (id) => document.getElementById(id);

// 쿠키 없이(익명) 요청하므로 크롬에 구글 계정이 여러 개 로그인돼 있어도 됩니다
async function call(fn, ...args) {
  if (window.MOCK_API) return window.MOCK_API(fn, args);  // 미리보기용
  let res;
  try {
    res = await fetch(API, { method: 'POST', body: JSON.stringify({ fn, args }) });
  } catch (e) {
    throw new Error('서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.');
  }
  const j = await res.json();
  if (!j.ok) throw new Error(j.error);
  return j.data;
}

function errText(e) {
  return String((e && e.message) || e).replace(/^Exception:\s*/, '');
}

function toast(msg, err) {
  const t = document.createElement('div');
  t.className = 'toast' + (err ? ' err' : '');
  t.setAttribute('role', 'status');
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), err ? 5000 : 2500);
}

function el(tag, attrs, ...kids) {
  const n = document.createElement(tag);
  Object.entries(attrs || {}).forEach(([k, v]) => {
    if (k === 'text') n.textContent = v; else if (v !== false && v != null) n.setAttribute(k, v === true ? '' : v);
  });
  kids.flat().forEach((k) => k != null && n.append(k));
  return n;
}

// 대명체는 공개 사이트에 올리지 않고 구글 드라이브에서 받아 이 브라우저에 저장해 둡니다
async function loadFont() {
  const KEY = 'sr_font_v1';
  let f = null;
  try { f = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
  if (!f) {
    try { f = await call('font'); } catch (e) { return; }
    try { localStorage.setItem(KEY, JSON.stringify(f)); } catch (e) {}
  }
  const css = [['regular', 400], ['bold', 700]].filter(([k]) => f && f[k]).map(([k, w]) =>
    "@font-face{font-family:'Daemyung';src:url(data:font/ttf;base64," + f[k] + ") format('truetype');font-weight:" + w + ';font-display:swap}');
  if (css.length) document.head.append(el('style', { text: css.join('\n') }));
}
loadFont();
