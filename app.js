(async function () {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const strip = h => String(h || '').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
const DAY = 864e5;
const toTop = () => { window.scrollTo(0, 0); const mm = document.getElementById('main'); if (mm) mm.scrollTop = 0; };
const dkey = (t = Date.now()) => { const d = new Date(t); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const sod = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };
const TLABEL = { '名解': '名词解释', '简答': '简答', '论述': '论述', '分析': '情境分析', '选择': '选择', '填空': '填空', '判断': '判断' };
const OBJ = ['选择', '填空', '判断'];
const BIG = ['简答', '论述', '分析'];
const LVL = ['未练', '不会', '模糊', '掌握'];


const SV = (d, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const IC = {
  labs: '<path d="M9.5 3.5h5M10.5 3.5v5.2L5.4 17.6A2 2 0 0 0 7.1 20.5h9.8a2 2 0 0 0 1.7-2.9L13.5 8.7V3.5"/><path d="M7.6 14h8.8"/><circle cx="10.5" cy="17" r=".9" fill="currentColor" stroke="none"/><circle cx="13.8" cy="16.2" r=".7" fill="currentColor" stroke="none"/>',
  dlApple: '<rect x="4.5" y="2.5" width="15" height="19" rx="2.5"/><path d="M10.5 18.5h3"/><path d="M12 6.5v7M9 10.5l3 3 3-3"/>',
  dlAndroid: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/><path d="M12 6.5v7M9 10.5l3 3 3-3"/>',
  dl: '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5"/><path d="M5 19.5h14"/>',
  today: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M9 15l2 2 4-4"/>',
  map: '<circle cx="5.5" cy="12" r="2.3"/><circle cx="18.5" cy="5" r="2.3"/><circle cx="18.5" cy="12" r="2.3"/><circle cx="18.5" cy="19" r="2.3"/><path d="M7.8 12h8.4M7.4 10.7c3.5-1 5-4.6 8.8-5.4M7.4 13.3c3.5 1 5 4.6 8.8 5.4"/>',
  learn: '<path d="M12 6.5C10 5 7.2 4.5 4 4.8v13.6c3.2-.3 6 .2 8 1.7 2-1.5 4.8-2 8-1.7V4.8c-3.2-.3-6 .2-8 1.7z"/><path d="M12 6.5v13.6"/>',
  path: '<circle cx="6" cy="18" r="2.3"/><path d="M8.2 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/><path d="M16 3.5v5.5M16 3.5h4l-1 1.4 1 1.4h-4"/>',
  practice: '<path d="M15.5 4.5l4 4L9 19H5v-4z"/><path d="M13.5 6.5l4 4"/><path d="M5 21h14"/>',
  daily: '<rect x="5" y="4.5" width="14" height="16.5" rx="2"/><path d="M9 4.5V3h6v1.5"/><path d="M8.5 11l1.6 1.6L13 9.7M8.5 16.5h7"/>',
  wrong: '<path d="M6 3.5h12v17l-6-4-6 4z"/><path d="M10 8.5l4 4M14 8.5l-4 4"/>',
  mock: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 11h7M9 14.5h7M9 18h4"/>',
  search: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/><path d="M8 10.5a2.5 2.5 0 0 1 2.5-2.5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/><circle cx="12" cy="12" r="6.5"/>',
  stats: '<path d="M4 20h16"/><rect x="5.5" y="12" width="3" height="6" rx=".8"/><rect x="10.5" y="8" width="3" height="10" rx=".8"/><rect x="15.5" y="4.5" width="3" height="13.5" rx=".8"/>',
  // 章节图标
  m1: '<path d="M9.5 3h5M10.5 3v6L5 18.5A1.8 1.8 0 0 0 6.6 21h10.8a1.8 1.8 0 0 0 1.6-2.5L13.5 9V3"/><path d="M7.5 14.5h9"/>',
  m2: '<path d="M12 3.5c3.2 4 5.5 7 5.5 10a5.5 5.5 0 0 1-11 0c0-3 2.3-6 5.5-10z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
  m3: '<path d="M12 3.5l7 4v8.5l-7 4-7-4V7.5z"/><circle cx="12" cy="11.8" r="3"/>',
  m4: '<circle cx="5" cy="15" r="2"/><circle cx="10" cy="9" r="2"/><circle cx="15" cy="15" r="2"/><circle cx="19.5" cy="8.5" r="2"/><path d="M6.3 13.5l2.4-3M11.3 10.5l2.4 3M16.4 13.5l1.8-3.4"/>',
  m5: '<path d="M12 4c3 3.7 5 6.4 5 9a5 5 0 0 1-10 0c0-2.6 2-5.3 5-9z"/><path d="M4 20.5c2-1.2 4-1.2 6 0s4 1.2 6 0 2.7-.9 4 0"/>',
  m6: '<rect x="3.5" y="9" width="17" height="6.5" rx="3.25" transform="rotate(-35 12 12.25)"/><path d="M10.2 9.3l3.6 5.9"/>',
  m7: '<path d="M7 4h10l3.5 5L12 20.5 3.5 9z"/><path d="M3.5 9h17M9.5 4l2.5 5 2.5-5M12 9v11.5"/>',
  m8: '<circle cx="6" cy="7" r="2.6"/><circle cx="6" cy="17" r="2.6"/><path d="M8.2 8.4L20 16M8.2 15.6L20 8"/>',
  m9: '<path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.4 0 1.8-1 1.4-2-.5-1.2.3-2.3 1.6-2.3H17a3.5 3.5 0 0 0 3.5-3.5c0-5-3.8-9.2-8.5-9.2z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10.5" cy="7.5" r="1.2"/><circle cx="15" cy="8" r="1.2"/>',
  m10: '<path d="M5 13h12v2a6 6 0 0 1-12 0z"/><path d="M17 14h1.5a2 2 0 0 1 0 4H16"/><path d="M8 9.5c0-1.5 1.2-1.5 1.2-3S8 5 8 4M12 9.5c0-1.5 1.2-1.5 1.2-3S12 5 12 4"/>',
  m11: '<path d="M9 3h6M10 3v7l-4.5 8A2 2 0 0 0 7.3 21h9.4a2 2 0 0 0 1.8-3L14 10V3"/><circle cx="10.5" cy="16" r="1"/><circle cx="13.5" cy="18" r="1"/>',
};
const icon = (k, cls) => SV(IC[k] || '', cls);
const MOL = '<svg class="mol" viewBox="0 0 260 200" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M70 40l35 20v40l-35 20-35-20V60z"/><path d="M78 52l22 13M78 108l22-13M44 66v28"/><path d="M105 60l35-20 35 20v40l-35 20-35-20"/><path d="M140 40V12M175 100l30 17M205 117v30M205 147l26 15M35 100L10 115"/><circle cx="140" cy="8" r="5"/><circle cx="235" cy="164" r="5"/><path d="M170 66v28"/></svg>';
const MARK = '<svg class="mk" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="var(--accent)"/><path d="M20 8.5l10 5.8v11.4l-10 5.8-10-5.8V14.3z" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/><circle cx="20" cy="20" r="4.2" fill="none" stroke="#fff" stroke-width="2"/><circle cx="30" cy="14.3" r="2.2" fill="#fff"/></svg>';

/* ---------- 数据 ---------- */
let BANK, META;
try {
  /* 安卓离线 App 里题库以脚本形式内置（window.__BANK / __META），网页版照常从 data/*.json 读取 */
  [BANK, META] = window.__BANK && window.__META ? [window.__BANK, window.__META] : await Promise.all([fetch('data/bank.json').then(r => r.json()), fetch('data/meta.json').then(r => r.json())]);
} catch (e) { $('#main').innerHTML = '<p class="empty">题库没有载入成功，请刷新页面重试。</p>'; return; }
const CL = Object.fromEntries(META.clusters.map(c => [c.id, c]));
const MODS = META.modules;
const MODN = Object.fromEntries(MODS.map(m => [m.id, m.name]));
META.scenarios.forEach(s => BANK.push({ id: 'S:' + s.id, y: 0, t: '分析', q: s.t + '\n' + s.q, a: s.a, src: '补充', c: s.c[0], cs: s.c, scen: 1 }));
const BY = Object.fromEntries(BANK.map(q => [q.id, q]));
const qmod = q => (CL[q.c] || {}).m;
const YEARS = [...new Set(BANK.filter(q => q.y).map(q => q.y))].sort((a, b) => b - a);
// 考点统计
const CS = {};
META.clusters.forEach(c => CS[c.id] = { qs: [], years: new Set(), bigYears: new Set(), last: 0 });
BANK.forEach(q => { (q.cs || [q.c]).forEach(c => { const s = CS[c]; if (!s) return; s.qs.push(q); if (q.y) { s.years.add(q.y); if (BIG.includes(q.t) || q.t === '名解') s.bigYears.add(q.y); s.last = Math.max(s.last, q.y); } }); });
Object.values(CS).forEach(s => { s.n = s.years.size; s.prio = s.n + s.bigYears.size * 0.6 + (s.last >= 2024 ? 4 : s.last >= 2021 ? 2.5 : s.last >= 2017 ? 1 : 0); });
const hotSet = new Set(Object.entries(CS).sort((a, b) => b[1].prio - a[1].prio).slice(0, 14).map(e => e[0]));

/* ---------- 进度存储 ---------- */
const LS = 'fcsite.v1';
const blank = () => ({ q: {}, k: {}, daily: {}, mocks: [], log: {}, path: {}, settings: { newPer: 8, exam: '', theme: '' }, updated: 0 });
let S = blank();
try { const r = localStorage.getItem(LS); if (r) S = Object.assign(blank(), JSON.parse(r)); } catch (e) { }
/* 同步用：本机编号（学习时长按设备分别记，合并时相加）；只属于本机的设置（风格、字号等不同设备各自独立） */
let DEV = ''; try { DEV = localStorage.getItem('fcsite.dev') || ''; if (!DEV) { DEV = 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); localStorage.setItem('fcsite.dev', DEV); } } catch (e) { DEV = 'd0'; }
const LOCAL_SET = ['skin', 'glassA', 'md3Dyn', 'zoom', 'theme', 'seenVer', 'autoTime'];
let SET_SNAP = {};
function snapSettings() { SET_SNAP = {}; for (const [k, v] of Object.entries(S.settings || {})) if (k !== '_t') SET_SNAP[k] = JSON.stringify(v); }
snapSettings();
const PLATFORM = window.AndroidApp ? 'android' : (window.__PWA || (/iPad|iPhone|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && 'ontouchend' in document))) ? 'apple' : 'web';
/* 主屏幕版（iPad / iPhone）：给页面顶部留出系统模糊带的空间 */
if (PLATFORM === 'apple' && (navigator.standalone === true || (window.matchMedia && matchMedia('(display-mode: standalone)').matches))) document.documentElement.classList.add('ios-app');
/* 主屏幕版更像原生 App：整页不再被双击放大、双指缩放；输入框获得焦点时也不会自动放大。
   知识结构图和机理图解（.zoomable）单独支持双指缩放、双击放大/还原，方便看清小字 */
if (document.documentElement.classList.contains('ios-app')) {
  const vp = document.querySelector('meta[name=viewport]'); if (vp) vp.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
  const zoomBox = t => t && t.closest ? t.closest('.zoomable') : null;
  const setZoom = (z, s) => { s = Math.min(4, Math.max(1, s)); z.dataset.zs = s; z.classList.toggle('zoomed', s > 1.01); for (const v of z.querySelectorAll('svg:not(svg svg)')) { v.style.width = (s * 100) + '%'; v.style.maxWidth = 'none'; v.style.height = 'auto'; } };
  let zs = null, lastTap = 0, lastBox = null;
  document.addEventListener('gesturestart', e => { e.preventDefault(); const z = zoomBox(e.target); zs = z ? { z, s: +z.dataset.zs || 1 } : null; }, { passive: false });
  document.addEventListener('gesturechange', e => { e.preventDefault(); if (zs) setZoom(zs.z, zs.s * e.scale); }, { passive: false });
  document.addEventListener('gestureend', e => { e.preventDefault(); zs = null; }, { passive: false });
  document.addEventListener('touchend', e => {
    if (e.touches.length || e.changedTouches.length !== 1) return;
    const z = zoomBox(e.target); const now = Date.now();
    if (z && z === lastBox && now - lastTap < 300 && !e.target.closest('button, a, input, select, textarea, [data-dg]')) { e.preventDefault(); setZoom(z, (+z.dataset.zs || 1) > 1.01 ? 1 : 2); lastTap = 0; return; }
    lastTap = now; lastBox = z;
  }, { passive: false });
}
const SKINS = [['', '现代', '简洁卡片，适合快速刷题', 'm'], ['book', '书本', '纸张质感、目录侧栏、翻页动效', 'b']]
  .concat(PLATFORM !== 'apple' ? [['md3', 'Material 3', '安卓 Material You：色调、圆润形状、弹性动效、底部导航', 'md']] : [])
  .concat(PLATFORM !== 'android' ? [['glass', '液态玻璃', 'iPadOS 27 风格：Liquid Glass、通栏侧边栏、浮动标签栏', 'gl']] : []);
/* 安卓 12 起：Material 3 风格可以跟随手机壁纸取色（由 App 提供系统色调） */
function dynColorCSS() {
  if (!(window.AndroidApp && window.AndroidApp.dynamicColors)) return '';
  let P; try { P = JSON.parse(window.AndroidApp.dynamicColors() || 'null'); } catch (e) { P = null; } if (!P || !P.a1) return '';
  const c = (p, t) => P[p][t], mix = (a, b, f) => '#' + [1, 3, 5].map(i => Math.round(parseInt(a.substr(i, 2), 16) * (1 - f) + parseInt(b.substr(i, 2), 16) * f).toString(16).padStart(2, '0')).join('');
  const L = `--bg:${c('n1', 10)};--surface:${c('n1', 50)};--surface2:${mix(c('n1', 50), c('n1', 100), .5)};--ink:${c('n1', 900)};--muted:${c('n2', 700)};--line:${c('n2', 200)};--accent:${c('a1', 600)};--accent-2:${c('a1', 700)};--accent-soft:${c('a1', 100)};--on-accent-soft:${c('a1', 900)};--sec:${c('a2', 100)};--on-sec:${c('a2', 900)};--hot:${c('a3', 600)};--hot-soft:${c('a3', 100)};--outline:${c('n2', 500)};`;
  const D = `--bg:${c('n1', 900)};--surface:${mix(c('n1', 900), c('n1', 800), .3)};--surface2:${mix(c('n1', 900), c('n1', 800), .65)};--ink:${c('n1', 100)};--muted:${c('n2', 200)};--line:${c('n2', 700)};--accent:${c('a1', 200)};--accent-2:${c('a1', 100)};--accent-soft:${c('a1', 700)};--on-accent-soft:${c('a1', 100)};--sec:${c('a2', 700)};--on-sec:${c('a2', 100)};--hot:${c('a3', 200)};--hot-soft:${c('a3', 700)};--outline:${c('n2', 400)};`;
  return `:root[data-skin="md3"]{${L}} :root[data-skin="md3"][data-theme="dark"]{${D}} @media (prefers-color-scheme: dark){:root[data-skin="md3"]:not([data-theme="light"]){${D}}}`;
}
function applyLook() { const de = document.documentElement; const sk = SKINS.some(x => x[0] === S.settings.skin) ? S.settings.skin : (S.settings.skin === 'md3' || S.settings.skin === 'glass' ? '' : S.settings.skin);
  if (sk) de.setAttribute('data-skin', sk); else de.removeAttribute('data-skin');
  let dyn = document.getElementById('dyncolor'); if (!dyn) { dyn = document.createElement('style'); dyn.id = 'dyncolor'; document.head.appendChild(dyn); }
  dyn.textContent = sk === 'md3' && S.settings.md3Dyn !== false ? dynColorCSS() : '';
  const ga = S.settings.glassA == null ? 50 : S.settings.glassA; de.style.setProperty('--glass-a', (0.22 + ga / 100 * 0.6).toFixed(3)); de.style.setProperty('--glass-blur', Math.round(16 + ga / 100 * 18) + 'px'); if (S.settings.theme) de.setAttribute('data-theme', S.settings.theme); else de.removeAttribute('data-theme'); const az = innerWidth > 860 ? Math.min(1.3, Math.max(1, innerWidth / 1536)) : 1; /* 1536 宽以下不放大，1920 约 1.25 倍，最大 1.3 倍 */
  de.style.setProperty('--az', az); de.style.setProperty('--zoom', (S.settings.zoom || 1) * az); }
applyLook();
let rsz; window.addEventListener('resize', () => { clearTimeout(rsz); rsz = setTimeout(applyLook, 120); });
let dbRef = null, syncOK = false, saveT = null, chain = Promise.resolve(), syncMsg = window.AndroidApp ? '进度保存在本机，离线可用' : window.__PWA ? (navigator.serviceWorker && navigator.serviceWorker.controller ? '已可离线使用 · 进度保存在本机' : '正在准备离线内容，请保持联网……') : '进度保存在本浏览器';
function save() {
  S.updated = Date.now();
  { const st = S.settings || (S.settings = {}); const T = st._t = Object.assign({}, st._t || {}); const keys = new Set([...Object.keys(st), ...Object.keys(SET_SNAP)]);
    for (const k of keys) if (k !== '_t' && JSON.stringify(st[k]) !== SET_SNAP[k]) T[k] = S.updated; snapSettings(); }
  try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) { }
  if (typeof CLOUD !== 'undefined' && CLOUD.user) cloudSchedule();
  if (!dbRef || !syncOK) return;
  clearTimeout(saveT);
  saveT = setTimeout(() => {
    const body = JSON.parse(JSON.stringify(S));
    chain = chain.then(async () => {
      try { await dbRef.set(body); setSync('进度已同步到你的账号'); }
      catch (e) {
        if (e && e.code === 'unavailable') { await new Promise(r => setTimeout(r, 900)); try { await dbRef.set(body); return; } catch (_) { } }
        if (e && e.code === 'quota_exceeded') setSync('同步空间已满，进度先保存在本浏览器'); else setSync('暂时无法同步，进度先保存在本浏览器');
        syncOK = false;
      }
    });
  }, 1500);
}
function setSync(t) { syncMsg = t; $$('.sync').forEach(e => e.textContent = t); }
/* iPad 主屏幕版：离线内容缓存好之后提示一下 */
if (window.__PWA && navigator.serviceWorker) navigator.serviceWorker.ready.then(() => setSync('已可离线使用 · 进度保存在本机')).catch(() => { });
function merge(R) {
  R = JSON.parse(JSON.stringify(R || {})); /* 同步回来的数据可能是只读对象，先深拷贝，避免之后写入时报错 */
  let L0 = S;
  /* 「清空进度」：较新的一次清空为准，清空之前的学习记录不再被另一台设备带回来 */
  if ((R.resetAt || 0) > (S.resetAt || 0)) L0 = Object.assign(blank(), { settings: S.settings, updated: S.updated, resetAt: R.resetAt });
  else if ((S.resetAt || 0) > (R.resetAt || 0)) R = { settings: R.settings, updated: R.updated, resetAt: R.resetAt };
  const o = Object.assign(blank(), L0); o.resetAt = Math.max(S.resetAt || 0, R.resetAt || 0) || undefined;
  o.q = Object.assign({}, L0.q); for (const [k, v] of Object.entries(R.q || {})) if (!o.q[k] || (v.t || 0) > (o.q[k].t || 0)) o.q[k] = v;
  o.k = Object.assign({}, L0.k); for (const [k, v] of Object.entries(R.k || {})) if (!o.k[k] || (v.t || 0) > (o.k[k].t || 0)) o.k[k] = v;
  /* 每日自测：同一天两边题目相同就合并作答；题目不同（各自生成或点了「换一套」）就取最后有操作的那一套，两台设备结果一致 */
  const dScore = D => D.u || (Object.keys(D.res || {}).length || Object.keys(D.inp || {}).length ? 1 : 0);
  o.daily = Object.assign({}, R.daily || {}, L0.daily);
  for (const [k, v] of Object.entries(R.daily || {})) {
    const a = (L0.daily || {})[k]; if (!a) continue;
    if (JSON.stringify(a.ids) === JSON.stringify(v.ids)) {
      const inp = Object.assign({}, v.inp || {}); for (const [i, x] of Object.entries(a.inp || {})) if (!inp[i] || (x.t || 0) >= (inp[i].t || 0)) inp[i] = x;
      o.daily[k] = { ids: a.ids, res: Object.assign({}, v.res, a.res), inp, u: Math.max(a.u || 0, v.u || 0) || undefined };
    } else {
      const sa = dScore(a), sv = dScore(v);
      o.daily[k] = sa > sv ? a : sv > sa ? v : (String(a.ids) <= String(v.ids) ? a : v);
    }
  }
  const ms = new Map(); (R.mocks || []).concat(L0.mocks || []).forEach(m => ms.set(m.ts, m)); o.mocks = [...ms.values()].sort((a, b) => a.ts - b.ts).slice(-40);
  /* 学习记录：各设备分开记，同一设备取较大值，最后相加 */
  o.log = {};
  const asBy = L => L.by ? L.by : ((L.min || L.done) ? { _legacy: { min: L.min || 0, done: L.done || 0 } } : {});
  for (const k of new Set([...Object.keys(R.log || {}), ...Object.keys(L0.log || {})])) {
    const a = asBy((L0.log || {})[k] || {}), b = asBy((R.log || {})[k] || {}), by = {};
    for (const d of new Set([...Object.keys(a), ...Object.keys(b)])) { const x = a[d] || {}, y = b[d] || {}; by[d] = { min: Math.max(x.min || 0, y.min || 0), done: Math.max(x.done || 0, y.done || 0) }; }
    o.log[k] = logSum({ by });
  }
  /* 复习路径按每一步合并：任何一台设备完成的步骤都算完成 */
  o.path = {};
  for (const id of new Set([...Object.keys(R.path || {}), ...Object.keys(L0.path || {})])) {
    const a = (R.path || {})[id] || {}, b = (L0.path || {})[id] || {}, x = Object.assign({}, a, b);
    for (const k of Object.keys(a)) if (a[k] && !b[k]) x[k] = a[k];
    o.path[id] = x;
  }
  o.planPath = L0.planPath; if (R.planPath && (!L0.planPath || (R.planPath.t || 0) > (L0.planPath.t || 0))) o.planPath = R.planPath;
  /* 设置按项合并：每一项记着自己的修改时间，较新的一边为准；风格、字号、颜色等只属于本机，不跟其他设备同步 */
  const sa = S.settings || {}, sb = R.settings || {}, ta = sa._t || {}, tb = sb._t || {}, newerR = (R.updated || 0) > (S.updated || 0);
  const st = {}, tt = {};
  for (const k of new Set([...Object.keys(sa), ...Object.keys(sb)])) {
    if (k === '_t') continue;
    if (LOCAL_SET.includes(k)) { if (k in sa) st[k] = sa[k]; if (ta[k]) tt[k] = ta[k]; continue; }
    const inA = k in sa, inB = k in sb;
    let useB;
    if (!inA) useB = true; else if (!inB) useB = false;
    else if (ta[k] || tb[k]) useB = (tb[k] || 0) > (ta[k] || 0);
    else useB = newerR;
    st[k] = useB ? sb[k] : sa[k]; const t = Math.max(ta[k] || 0, tb[k] || 0); if (t) tt[k] = t;
  }
  st._t = tt; o.settings = st;
  o.updated = Math.max(S.updated || 0, R.updated || 0);
  return o;
}
/* 账号同步：先把云端进度合并进来，再显示页面（最多等 4 秒），避免开机时的默认设置把云端的个人设置盖掉 */
/* ---------- 账号与云同步（Firebase）：网页版（GitHub Pages）、iPad 主屏幕版、安卓 App 共用 ----------
   不用 Firebase 官方代码包（需要联网加载），直接调用它的网页接口：
   注册/登录用 Identity Toolkit，进度存在 Firestore 的 users/{uid} 文档里（整份进度存成一段文字）。
   安全规则限定每个账号只能读写自己的文档。在 Claude 里打开的版本仍用 Claude 账号同步，不走这里。 */
const FB = { key: 'AIzaSyD9-Fb5-BoOUiEipv5szrlsQX5r84s3cRE', project: 'foodchem' };
const AUTH_LS = 'fcsite.auth';
var CLOUD = { on: !window.claude, user: null, busy: false, t: null, lastPull: 0, lastOk: 0, err: '' };
try { CLOUD.user = JSON.parse(localStorage.getItem(AUTH_LS) || 'null'); } catch (e) { }
const AUTH_ERR = { EMAIL_EXISTS: '这个邮箱已经注册过了，请直接登录', EMAIL_NOT_FOUND: '没有找到这个邮箱的账号，请先注册', INVALID_PASSWORD: '密码不对', INVALID_LOGIN_CREDENTIALS: '邮箱或密码不对', INVALID_EMAIL: '邮箱格式不对', MISSING_PASSWORD: '请输入密码', WEAK_PASSWORD: '密码至少要 6 位', TOO_MANY_ATTEMPTS_TRY_LATER: '尝试次数太多，请稍后再试', USER_DISABLED: '这个账号已被停用', OPERATION_NOT_ALLOWED: 'Firebase 里还没启用「电子邮件/密码」登录' };
function authErr(code) { const k = String(code || '').split(' ')[0].split(':')[0]; return AUTH_ERR[k] || ('出错了：' + (code || '请检查网络')); }
async function fbAuth(path, body) {
  const r = await fetch(`https://identitytoolkit.googleapis.com/v1/${path}?key=${FB.key}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error((j.error && j.error.message) || ('HTTP ' + r.status)); return j;
}
function setUser(j, email) { CLOUD.user = { uid: j.localId || j.user_id, email: email || (CLOUD.user && CLOUD.user.email), idToken: j.idToken || j.id_token, refresh: j.refreshToken || j.refresh_token, exp: Date.now() + (+(j.expiresIn || j.expires_in || 3600) - 120) * 1000 }; try { localStorage.setItem(AUTH_LS, JSON.stringify(CLOUD.user)); } catch (e) { } }
async function fbToken() {
  const u = CLOUD.user; if (!u) throw new Error('NOT_SIGNED_IN');
  if (u.idToken && u.exp > Date.now()) return u.idToken;
  const r = await fetch(`https://securetoken.googleapis.com/v1/token?key=${FB.key}`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(u.refresh) });
  const j = await r.json().catch(() => ({})); if (!r.ok) { const m = (j.error && j.error.message) || ''; if (/TOKEN_EXPIRED|INVALID_REFRESH_TOKEN|USER_NOT_FOUND|USER_DISABLED/.test(m)) { cloudSignOut(true); throw new Error('登录已过期，请重新登录'); } throw new Error(m || 'HTTP ' + r.status); }
  setUser(j); return CLOUD.user.idToken;
}
const docUrl = () => `https://firestore.googleapis.com/v1/projects/${FB.project}/databases/(default)/documents/users/${CLOUD.user.uid}`;
async function cloudGet() {
  const r = await fetch(docUrl(), { headers: { Authorization: 'Bearer ' + await fbToken() } });
  if (r.status === 404) return null;
  if (r.status === 403) throw new Error('RULES');
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const j = await r.json(); const f = j.fields || {}; try { return f.data ? JSON.parse(f.data.stringValue) : null; } catch (e) { return null; }
}
async function cloudPut(state, keepalive) {
  const body = JSON.stringify({ fields: { data: { stringValue: JSON.stringify(state) }, updated: { integerValue: String(state.updated || Date.now()) }, email: { stringValue: CLOUD.user.email || '' } } });
  const r = await fetch(docUrl(), { method: 'PATCH', keepalive: !!keepalive && body.length < 60000, headers: { Authorization: 'Bearer ' + await fbToken(), 'Content-Type': 'application/json' }, body });
  if (r.status === 403) throw new Error('RULES'); if (!r.ok) throw new Error('HTTP ' + r.status);
}
function cloudMsg(e) { const m = e && e.message || ''; return m === 'RULES' ? '同步被拒绝：请在 Firebase 里贴好数据库安全规则' : /Failed to fetch|NetworkError|Load failed|network/i.test(m) ? '现在没有网络，联网后会自动同步' : m.length < 40 ? '同步失败：' + m : '同步失败，稍后会自动重试'; }
function agoText(t) { if (!t) return ''; const s = (Date.now() - t) / 1000; return s < 60 ? '刚刚' : s < 3600 ? Math.round(s / 60) + ' 分钟前' : new Date(t).toTimeString().slice(0, 5); }
/* 同步一次：先取云端、合并进本机，再把合并结果写回云端。两边都不会丢东西 */
async function cloudSync(opts = {}) {
  if (!CLOUD.on || !CLOUD.user || CLOUD.busy) return;
  CLOUD.busy = true; if (!opts.quiet) setSync('正在同步……');
  try {
    const R = await cloudGet(); CLOUD.lastPull = Date.now();
    const before = JSON.stringify(S);
    if (R) { S = merge(R); snapSettings(); try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) { } }
    const changedLocal = JSON.stringify(S) !== before;
    if (!R || JSON.stringify(S) !== JSON.stringify(R)) await cloudPut(S);
    CLOUD.lastOk = Date.now(); CLOUD.err = '';
    setSync(`${agoText(CLOUD.lastOk)} 已同步 · ${CLOUD.user.email}`);
    if (changedLocal && !opts.noRender) { const a = document.activeElement; if (!(a && /TEXTAREA|INPUT/.test(a.tagName))) render(); }
  } catch (e) { CLOUD.err = cloudMsg(e); setSync(CLOUD.err); }
  finally { CLOUD.busy = false; }
}
function cloudSchedule() { if (!CLOUD.on || !CLOUD.user) return; clearTimeout(CLOUD.t); CLOUD.t = setTimeout(() => cloudSync({ quiet: true }), 20000); }
function cloudSignOut(expired) { CLOUD.user = null; clearTimeout(CLOUD.t); try { localStorage.removeItem(AUTH_LS); } catch (e) { } setSync(expired ? '登录已过期，请在「设置」里重新登录' : '进度保存在本机'); }
if (CLOUD.on) {
  /* 离开页面时把还没上传的进度推上去；回到页面时拉一次别的设备的进度 */
  document.addEventListener('visibilitychange', () => {
    if (!CLOUD.user) return;
    if (document.visibilityState === 'hidden') { clearTimeout(CLOUD.t); if ((S.updated || 0) > CLOUD.lastOk) cloudPut(S, true).then(() => { CLOUD.lastOk = Date.now(); }).catch(() => { }); }
    else if (Date.now() - CLOUD.lastPull > 60000) cloudSync({ quiet: true });
  });
  window.addEventListener('online', () => { if (CLOUD.user) cloudSync({ quiet: true }); });
  setInterval(() => { if (CLOUD.user && !CLOUD.err && CLOUD.lastOk) setSync(`${agoText(CLOUD.lastOk)} 已同步 · ${CLOUD.user.email}`); }, 60000);
}
const syncReady = (async () => {
  try {
    if (CLOUD.on) { if (CLOUD.user) await cloudSync({ noRender: true }); return; }
    if (!window.claude || !window.claude.use) return;
    const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
    const uid = user ? await user.id() : null;
    if (!db || !uid) return;
    dbRef = db.doc('data/users/' + uid + '/state');
    setSync('正在连接账号同步……');
    const tm = setTimeout(() => setSync('同步暂时连不上，进度先保存在本浏览器'), 10000);
    const snap = await dbRef.get(); clearTimeout(tm); syncOK = true;
    if (snap.exists) { const R = snap.data() || {}; const before = JSON.stringify(S); S = merge(R); snapSettings(); try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) { } if (JSON.stringify(S) !== JSON.stringify(R)) save(); if (JSON.stringify(S) !== before) render(); }
    else if (S.updated) save();
    setSync('进度已同步到你的账号');
  } catch (e) { syncOK = false; setSync('进度保存在本浏览器'); }
})();

const qs = id => S.q[id] || { l: 0, n: 0, c: 0, w: 0, t: 0, d: 0 };
function logDone() { const k = dkey(); const L = logMine(k); L.by[DEV].done = (L.by[DEV].done || 0) + 1; logSum(L); S.log[k] = L; }
function rate(id, l) {
  const s = Object.assign({ l: 0, n: 0, c: 0, w: 0 }, S.q[id]); const now = Date.now();
  s.n++; s.l = l; s.t = now;
  if (l === 1) { s.c = 0; s.d = now + 10 * 60e3; s.w = 1; }
  else if (l === 2) { s.c = 0; s.d = sod() + DAY; s.w = 1; }
  else { s.c = (s.c || 0) + 1; s.d = sod() + [2, 4, 7, 15, 30][Math.min(s.c - 1, 4)] * DAY; if (s.c >= 2) s.w = 0; }
  S.q[id] = s; logDone(); save(); refreshRows(id);
}
/* 打分后，页面上同一道题的列表行（色条、掌握状态）马上跟着更新，不用重新进页面 */
function refreshRows(id) {
  const l = qs(id).l;
  document.querySelectorAll(`[data-q="${CSS.escape(id)}"]`).forEach(r => {
    const st = r.querySelector(':scope > .stripe'); if (st) st.className = st.className.replace(/\bl\d\b/g, '').trim() + ' l' + l;
    r.querySelectorAll('.lv').forEach(v => { v.className = 'lv l' + l; v.innerHTML = '<i></i>' + LVL[l]; });
  });
}
const isDue = id => { const s = S.q[id]; return s && s.l > 0 && s.d <= Date.now() && !(s.l === 3 && s.c >= 5); };

/* ---------- 题卡 ---------- */
function keyLetter(q) { const m = /^\s*([A-E])(?![A-Za-z])/.exec(q.key || ''); return m ? m[1] : null; }
function keyTF(q) { const m = /^\s*([√×])/.exec(q.key || ''); return m ? m[1] : null; }
function chipsFor(q, extra = '') {
  const s = qs(q.id); const c = CL[q.c];
  const src = q.src === '汇编' ? '<span class="chip src1">汇编答案</span>' : q.src === '补充' ? '<span class="chip src2">补充答案</span>' : '<span class="chip src3">整理答案</span>';
  return `<span class="chip y">${q.y ? q.y : '原创情境'}</span><span class="chip">${TLABEL[q.t]}</span>${c ? `<span class="chip">${esc(MODN[c.m])} · ${esc(c.n)}</span>` : ''}${hotSet.has(q.c) ? '<span class="chip hot">高频考点</span>' : ''}${q.doubt ? '<span class="chip doubt">答案存疑</span>' : ''}<span class="lv l${s.l}"><i></i>${LVL[s.l]}</span>${extra}`;
}
/* ---------- 参考答案拆要点：背诵模式和按要点自评共用 ---------- */
const PTS_CACHE = new Map();
const RECITE_T = ['简答', '论述', '分析', '名解'];
function txt(html) { const d = document.createElement('div'); d.innerHTML = html; return (d.textContent || '').replace(/\s+/g, ' ').trim(); }
function answerPoints(q) {
  if (!q || !q.a || !RECITE_T.includes(q.t)) return [];
  if (PTS_CACHE.has(q.id)) return PTS_CACHE.get(q.id);
  const box = document.createElement('div'); box.innerHTML = q.a;
  const pieces = [];
  const walk = node => [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) { if (n.textContent.trim()) pieces.push(esc(n.textContent.trim())); return; }
    if (n.nodeType !== 1) return;
    const tag = n.tagName;
    if (tag === 'P') { n.innerHTML.split(/<br\s*\/?>/i).forEach(h => { if (txt(h)) pieces.push(h.trim()); }); }
    else if (tag === 'UL' || tag === 'OL') [...n.children].forEach(li => { if (txt(li.innerHTML)) pieces.push(li.innerHTML); });
    else if (tag === 'TABLE') pieces.push(n.outerHTML);
    else if (tag === 'DIV') walk(n);
    else if (txt(n.outerHTML)) pieces.push(n.outerHTML);
  });
  walk(box);
  const pts = []; let head = '';
  pieces.forEach(h => {
    const t = txt(h); if (!t) return;
    if (/^<table/i.test(h)) { pts.push({ head, label: '表格', hint: '表格', html: h, text: t }); return; }
    const lead = /^\s*<b>([\s\S]*?)<\/b>/i.exec(h);
    const boldOnly = lead && txt(lead[1]) === t;
    if (boldOnly && /[：:]$/.test(t) && t.length <= 24) { head = t.replace(/[：:]$/, ''); return; }   // 小标题
    let label = '', body = t;
    if (lead && !boldOnly) { const lb = txt(lead[1]); if (lb.length <= 20) { label = lb.replace(/[：:]\s*$/, ''); body = txt(h.slice(lead[0].length)); } }
    if (!label) { const m = /^([^，。；：:,;]{2,14})[：:]\s*(.+)$/.exec(t); if (m) { label = m[1]; body = m[2]; } }
    const first = t.split(/[，。；;,]|——/)[0].trim(); const hint = label || (first.length > 18 ? first.slice(0, 18) + '…' : first + (first.length < t.length ? '…' : ''));
    pts.push({ head, label, hint, html: h, text: t, body });
  });
  PTS_CACHE.set(q.id, pts); return pts;
}
/* 首字提示：每个小句只露出开头两个字，其余换成横线，点一下显示整句 */
function firstChars(text) {
  return text.split(/(?<=[，。；：、,;:！？])/).map(seg => {
    const core = seg.replace(/[，。；：、,;:！？]$/, ''), p = seg.slice(core.length);
    if (core.length <= 3) return esc(seg);
    return `<span class="fc" tabindex="0" role="button" title="点一下显示"><b>${esc(core.slice(0, 2))}</b><span class="fcb">${'＿'.repeat(Math.min(core.length - 2, 12))}</span><span class="fct" hidden>${esc(core.slice(2))}</span></span>${esc(p)}`;
  }).join('');
}
function reciteHTML(pts, mode) {
  let lastHead = null;
  const items = pts.map((p, i) => {
    const h = p.head && p.head !== lastHead ? `<div class="rh">${esc(p.head)}</div>` : ''; lastHead = p.head;
    if (mode === 'full') return h + `<div class="rp open">${p.html}</div>`;
    if (mode === 'first') return h + `<div class="rp"><span class="rn">${i + 1}</span>${p.label ? `<b>${esc(p.label)}：</b>` : ''}${/^<table/i.test(p.html) ? p.html : firstChars(p.label ? p.body : p.text)}</div>`;
    return h + `<div class="rp rk" data-rp="${i}" role="button" tabindex="0"><span class="rn">${i + 1}</span><span class="rt1">${esc(p.label || p.hint)}</span><span class="rtap">点一下揭开</span><div class="rc1" hidden>${p.html}</div></div>`;
  }).join('');
  return items;
}
/* ---------- 安卓每日提醒 ---------- */
const HAS_REM = !!(window.AndroidApp && window.AndroidApp.setReminder);
let REM = {}; try { if (HAS_REM) REM = JSON.parse(window.AndroidApp.getReminder() || '{}'); } catch (e) { }
/* ---------- 朗读：网页/iPad 用系统语音，安卓 App 用原生朗读 ---------- */
const TTS = { on: false, btn: null };
function ttsAvail() { return !!((window.AndroidApp && window.AndroidApp.speak) || window.speechSynthesis); }
function ttsChunks(t) { const out = []; let cur = ''; t.split(/(?<=[。；！？\n])/).forEach(x => { if ((cur + x).length > 180) { if (cur) out.push(cur); cur = x; } else cur += x; }); if (cur.trim()) out.push(cur); return out; }
function ttsStop() {
  try { if (window.AndroidApp && window.AndroidApp.stopSpeak) window.AndroidApp.stopSpeak(); else if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) { }
  TTS.on = false; if (TTS.btn) TTS.btn.textContent = TTS.btn.dataset.lb || '朗读'; TTS.btn = null;
}
window.onTtsDone = () => { TTS.on = false; if (TTS.btn) TTS.btn.textContent = TTS.btn.dataset.lb || '朗读'; TTS.btn = null; };
window.onTtsError = msg => { window.onTtsDone(); toast(msg); };
function toast(msg) { let t = document.getElementById('toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); } t.textContent = msg; t.hidden = false; clearTimeout(toast.tm); toast.tm = setTimeout(() => t.hidden = true, 5000); }
function ttsSpeak(text, btn) {
  ttsStop(); const rate = S.settings.ttsRate || 1; const parts = ttsChunks(text);
  if (!parts.length) return;
  TTS.on = true; TTS.btn = btn; if (btn) { btn.dataset.lb = btn.dataset.lb || btn.textContent; btn.textContent = '停止'; }
  if (window.AndroidApp && window.AndroidApp.speak) { window.AndroidApp.speak(JSON.stringify(parts), rate); return; }
  if (!window.speechSynthesis) { window.onTtsError('这个浏览器不支持朗读'); return; }
  const vs = speechSynthesis.getVoices(), v = vs.find(x => /zh[-_]CN/i.test(x.lang)) || vs.find(x => /^zh/i.test(x.lang));
  parts.forEach((p, i) => { const u = new SpeechSynthesisUtterance(p); u.lang = 'zh-CN'; if (v) u.voice = v; u.rate = rate; if (i === parts.length - 1) u.onend = () => { if (TTS.btn === btn) window.onTtsDone(); }; speechSynthesis.speak(u); });
}
function speakText(q) { return `${q.q}。参考答案：` + txt((q.a || '').replace(/<\/(p|li|tr|div)>/gi, '。</$1>')).replace(/。\s*。/g, '。'); }
window.addEventListener('hashchange', ttsStop);

function qcard(q, o = {}) {
  const el = document.createElement('div'); el.className = 'card q'; el.dataset.id = q.id;
  const s = qs(q.id); const kl = keyLetter(q), tf = keyTF(q);
  let body = '';
  if (q.opts && q.opts.length) body = `<div class="opts">${q.opts.map(([a, t]) => `<button class="opt" data-o="${esc(a)}">${esc(/^\d$/.test(a) ? '（' + a + '）' : a + '.')} ${esc(t)}</button>`).join('')}</div>`;
  else if (q.t === '判断') body = `<div class="row"><button class="opt" data-o="√">√ 对</button><button class="opt" data-o="×">× 错</button></div>`;
  else body = `<textarea placeholder="${q.t === '名解' ? '先写出定义的关键词，再对答案' : OBJ.includes(q.t) ? '填写答案' : '先列出答题要点（可以只写关键词），再对答案'}" aria-label="作答"></textarea>`;
  el.innerHTML = `<div class="qmeta">${chipsFor(q, o.extraChip || '')}</div><div class="qtext">${esc(q.q)}</div>${body}
    ${S.settings.labPoints && s.miss && s.miss.length && answerPoints(q).length > 1 ? `<div class="miss">上次漏了：${s.miss.map(esc).join('、')}</div>` : ''}
    <div class="row"><button class="btn pri" data-a="show">对答案</button>${S.settings.labRecite && answerPoints(q).length ? '<button class="btn" data-a="recite">背诵</button>' : ''}${q.a && ttsAvail() ? '<button class="btn" data-a="tts">朗读</button>' : ''}<button class="btn" data-a="star">${s.w ? '已在错题本' : '加入错题本'}</button>${o.noNote ? '' : '<button class="btn ghost" data-a="note">笔记</button>'}<span class="sp"></span>${o.nav || ''}</div>
    <div class="recite" hidden></div>
    <div class="ans" hidden><div class="h">参考答案 ${q.src === '汇编' ? '· 来自你的答案汇编' : q.src === '补充' ? '· Claude 按教材补写，建议对照课本' : '· Claude 整理，建议核对'}${q.doubt ? '<span class="chip doubt">存疑</span>' : ''}</div>${q.a || '<p>暂无参考答案。</p>'}</div>
    <div class="ptc" hidden></div>
    <div class="row rt" hidden><span class="note">这题你答得怎样？</span><button class="btn r1" data-r="1">不会</button><button class="btn r2" data-r="2">模糊</button><button class="btn r3" data-r="3">掌握</button></div>
    <div class="nt" hidden><textarea placeholder="写下易错点、记忆口诀……（自动保存）" aria-label="笔记">${esc(s.note || '')}</textarea></div>`;
  let shown = false;
  const PTS = answerPoints(q);
  const reveal = () => { $('.ans', el).hidden = false; $('.rt', el).hidden = false; showCheck(); $('[data-a=show]', el).textContent = '隐藏答案'; if (!shown) { shown = true; o.onReveal && o.onReveal(); } };
  /* 按要点自评：对照答案勾选答出的要点，按比例给出掌握程度 */
  function showCheck() {
    const pc = $('.ptc', el); if (!S.settings.labPoints || PTS.length < 2 || !pc.hidden) return;
    pc.hidden = false;
    pc.innerHTML = `<div class="ph"><b>按要点自评</b><span class="note">对照答案，勾上你答出来的要点</span><span class="sp"></span><button class="btn sm ghost" data-pall>全选</button></div>
      <div class="pchips">${PTS.map((p, i) => `<button class="pchip" data-pi="${i}" aria-pressed="false"><span class="rn">${i + 1}</span>${esc(p.label || p.hint)}</button>`).join('')}</div>
      <div class="row" style="margin-top:8px"><span class="note" data-psum>还没勾选</span><span class="sp"></span><button class="btn sm pri" data-pok disabled>按要点打分</button></div>`;
  }
  function checkState() {
    const on = $$('.pchip', el).filter(x => x.getAttribute('aria-pressed') === 'true').length, r = on / PTS.length, l = r >= 0.8 ? 3 : r >= 0.4 ? 2 : 1;
    $('[data-psum]', el).textContent = `答出 ${on}/${PTS.length} 个要点（${Math.round(r * 100)}%）→ ${LVL[l]}`;
    const ok = $('[data-pok]', el); ok.disabled = false; ok.textContent = `按要点打分：${LVL[l]}`; ok.dataset.l = l;
  }
  const conceal = () => { $('.ans', el).hidden = true; $('[data-a=show]', el).textContent = '再看答案'; };
  /* o.keep：保存作答状态（输入的文字、选的选项、答案是否展开、自评），切换页面回来时恢复 */
  const K = o.keep; const keepSave = () => { if (K) { K.t = Date.now(); o.onKeep && o.onKeep(); } };
  const markOpt = sel => { const right = kl || tf; $$('.opt', el).forEach(x => { x.classList.toggle('sel', x.dataset.o === sel); if (right && x.dataset.o === right) x.classList.add('right'); if (right && x.dataset.o === sel && sel !== right) x.classList.add('wrong'); }); };
  el.addEventListener('click', e => {
    const rp = e.target.closest('[data-rp]'); if (rp) { const open = rp.classList.toggle('open'); $('.rc1', rp).hidden = !open; $('.rtap', rp).hidden = open; return; }
    const fc = e.target.closest('.fc'); if (fc) { const open = fc.classList.toggle('open'); $('.fct', fc).hidden = !open; $('.fcb', fc).hidden = open; return; }
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.o) {
      if (shown) return;
      $$('.opt', el).forEach(x => x.classList.remove('sel')); b.classList.add('sel');
      if (K) { K.sel = b.dataset.o; keepSave(); }
      const right = kl || tf;
      if (right) { $$('.opt', el).forEach(x => { if (x.dataset.o === right) x.classList.add('right'); }); if (b.dataset.o !== right) b.classList.add('wrong'); reveal(); doRate(b.dataset.o === right ? 3 : 1, true); }
      return;
    }
    if (b.dataset.a === 'show') { if ($('.ans', el).hidden) reveal(); else conceal(); if (K) { K.open = !$('.ans', el).hidden; keepSave(); } }
    if (b.dataset.a === 'recite') {
      const rc = $('.recite', el);
      if (!rc.hidden) { rc.hidden = true; b.textContent = '背诵'; return; }
      conceal(); rc.hidden = false; b.textContent = '收起背诵'; $('.rt', el).hidden = false; showCheck();
      const mode0 = PTS.length > 1 ? (S.settings.reciteMode || 'key') : 'first';
      rc.innerHTML = `<div class="row rhd"><b>背诵</b><div class="seg sm" data-rm>${PTS.length > 1 ? `<button data-m="key">要点提示</button>` : ''}<button data-m="first">首字提示</button><button data-m="full">全文</button></div><span class="sp"></span><button class="btn sm ghost" data-rall>全部揭开</button></div><div class="rbody"></div>`;
      const draw = m => { $$('[data-rm] button', rc).forEach(x => x.setAttribute('aria-pressed', x.dataset.m === m)); $('.rbody', rc).innerHTML = reciteHTML(PTS, m); rc.dataset.m = m; };
      draw(mode0); if (!shown) { shown = true; o.onReveal && o.onReveal(); }
      return;
    }
    if (b.closest('[data-rm]') && b.dataset.m) { const rc = $('.recite', el); if (PTS.length > 1) { S.settings.reciteMode = b.dataset.m === 'full' ? S.settings.reciteMode : b.dataset.m; save(); } $$('[data-rm] button', rc).forEach(x => x.setAttribute('aria-pressed', x === b)); $('.rbody', rc).innerHTML = reciteHTML(PTS, b.dataset.m); return; }
    if (b.dataset.rall !== undefined) { $$('.recite .rk', el).forEach(x => { x.classList.add('open'); $('.rc1', x).hidden = false; $('.rtap', x).hidden = true; }); $$('.recite .fc', el).forEach(x => { $('.fct', x).hidden = false; $('.fcb', x).hidden = true; x.classList.add('open'); }); return; }
    if (b.dataset.pi !== undefined) { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); checkState(); return; }
    if (b.dataset.pall !== undefined) { const all = $$('.pchip', el).every(x => x.getAttribute('aria-pressed') === 'true'); $$('.pchip', el).forEach(x => x.setAttribute('aria-pressed', !all)); checkState(); return; }
    if (b.dataset.pok !== undefined) {
      const miss = PTS.filter((p, i) => $(`.pchip[data-pi="${i}"]`, el).getAttribute('aria-pressed') !== 'true').map(p => p.label || p.hint).slice(0, 8);
      doRate(+b.dataset.l); const st = S.q[q.id]; st.miss = miss; st.pr = Math.round((PTS.length - miss.length) / PTS.length * 100); save();
      $('[data-psum]', el).textContent += miss.length ? ` · 已记下漏掉的要点，下次做这题时会提醒` : ' · 全部答出，太棒了'; return;
    }
    if (b.dataset.a === 'tts') { if (TTS.on && TTS.btn === b) ttsStop(); else ttsSpeak(speakText(q), b); return; }
    if (b.dataset.a === 'star') { const st = Object.assign({ l: 0, n: 0, c: 0 }, S.q[q.id]); st.w = st.w ? 0 : 1; st.t = Date.now(); S.q[q.id] = st; save(); b.textContent = st.w ? '已在错题本' : '加入错题本'; }
    if (b.dataset.a === 'note') { const n = $('.nt', el); n.hidden = !n.hidden; if (!n.hidden) $('textarea', n).focus(); }
    if (b.dataset.r) doRate(+b.dataset.r);
  });
  function doRate(l, auto, restore) {
    if (!restore) rate(q.id, l);
    if (K && !restore) { K.lv = l; if (auto) K.open = true; keepSave(); }
    $$('.rt .btn', el).forEach(x => x.setAttribute('aria-pressed', x.dataset.r == l));
    $$('.rt .btn', el).forEach(x => x.style.outline = x.dataset.r == l ? '2px solid currentColor' : '');
    $('.lv', el).className = 'lv l' + l; $('.lv', el).innerHTML = '<i></i>' + LVL[l] + (auto ? '（已自动判分，可修改）' : '');
    $('[data-a=star]', el).textContent = qs(q.id).w ? '已在错题本' : '加入错题本';
    if (!restore) o.onRated && o.onRated(l);
  }
  if (K) {
    const ta = el.querySelector(':scope > textarea');
    if (ta) { if (K.txt) ta.value = K.txt; ta.addEventListener('input', () => { K.txt = ta.value; keepSave(); }); }
    if (K.sel) markOpt(K.sel);
    if (K.sel || K.lv || K.open) { shown = true; reveal(); if (!K.open) conceal(); }
    if (K.lv) doRate(K.lv, false, true);
  }
  const nta = $('.nt textarea', el);
  if (nta) nta.addEventListener('change', () => { const st = Object.assign({ l: 0, n: 0, c: 0, w: 0 }, S.q[q.id]); st.note = nta.value; st.t = Date.now(); if (nta.value) st.w = st.w || 0; S.q[q.id] = st; save(); });
  return el;
}
function openModal(node, title) {
  const m = $('#modal');
  m.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title || '')}"><div class="card"><div class="row" style="margin-bottom:8px"><h3 style="margin:0">${esc(title || '')}</h3><span class="sp"></span><button class="btn sm" data-x>关闭</button></div><div class="mb"></div></div></div>`;
  $('.mb', m).append(node);
  const close = () => { m.innerHTML = ''; };
  $('[data-x]', m).onclick = close;
  $('.modal', m).addEventListener('click', e => { if (e.target.classList.contains('modal')) close(); });
  document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', k); } });
}
/* ---------- 版本与更新日志：每次更新在最前面加一条，版本号变了，打开时就会弹一次更新说明 ---------- */
const CHANGELOG = [
  { v: '2.0.7', d: '2026-11-25', t: '本周学习时长', items: [
    '首页的「本周」学习时长改为从这周一开始算，每周一重新计；之前算的是最近 7 天，刚开始使用的几天里看起来就和总时长一样'] },
  { v: '2.0.6', d: '2026-11-24', t: '主屏幕版更像原生 App', items: [
    'iPad / iPhone 主屏幕版里，整页不会再被双击放大、双指缩放，点输入框时也不会自动放大',
    '知识结构图和机理图解保留缩放：双指捏合放大/缩小，双击放大到 2 倍或还原，放大后可以拖动查看',
    '按钮、导航栏长按不再弹出系统的选中和拷贝菜单；题目和答案的文字仍然可以长按选中复制',
    '想整体放大文字，可以用 设置 → 外观 → 字号'] },
  { v: '2.0.5', d: '2026-11-24', t: '全面自检：同步与排版修复', items: [
    '学习时长改为每台设备分别记、同步时相加：之前取两台设备中较大的一个，同一天在 iPad 和手机上都学了会少算',
    '设置的每一项单独记修改时间：另一台设备上更晚的刷题记录，不会再把你刚改好的设置（名字、考试日期、每日题量等）改回去',
    '风格、字号、颜色、玻璃效果、自动记录学习时间改为每台设备各自独立：安卓用 Material 3、iPad 用液态玻璃，不会互相覆盖',
    '每日自测：两台设备当天题目不同时，以最后有作答的那一套为准；在一台设备上「换一套」会同步到另一台；修复今日已答数可能多算的问题',
    '「清空进度」会同步到所有设备，不会被另一台设备上的旧记录带回来；之后从备份导入仍然有效',
    '特大字号下，每日自测题卡撑出屏幕、长考点标签溢出的问题',
    'Material 3 风格的分段按钮在窄屏放不下时改为左右滑动，不再折行'] },
  { v: '2.0.4', d: '2026-11-24', t: '主屏幕版顶部留白', items: [
    '状态栏下方那层模糊是 iPadOS 系统给主屏幕网页 App 加的效果，网页没法关掉；现在主屏幕版会在页面顶部留出一段空白，打开时模糊只落在背景上，不再糊住卡片和文字'] },
  { v: '2.0.3', d: '2026-11-24', t: '同步与顶部显示修复', items: [
    '修复复习路径的完成进度不能在设备之间同步的问题：在任何一台设备上完成的步骤，其他设备都会显示已完成，首页今日计划也会跟着更新',
    '尝试修复 iPad / iPhone 主屏幕版顶部状态栏下方出现一层模糊的问题'] },
  { v: '2.0.2', d: '2026-11-23', t: '手机上的排版修复', items: [
    '修复今日计划里复习路径完成后，「今日已完成」和「加练一个新路径」被挤成竖排的问题',
    '手机顶栏的标题不再折成两行，同步状态过长时自动省略',
    '更新日志的版本号、标题和日期在窄屏上重新排版：日期放到标题下方，不再被拆成两行'] },
  { v: '2.0.1', d: '2026-11-22', t: '修复新风格的显示错位', items: [
    '修复液态玻璃和 Material 3 风格下，设置页左侧的标签多出一块底色、与右侧按钮上下错位的问题',
    '修复「自动记录学习时间」等较长的标签被挤压、文字压到按钮上的问题',
    '风格卡片的名称和说明改为顶端对齐，几张卡片不再高低不齐',
    '侧边栏的同步状态改为「刚刚 已同步 · 邮箱」，邮箱过长时换行更整齐'] },
  { v: '2.0', d: '2026-11-22', t: '复习站 2.0：Material 3 与液态玻璃', items: [
    '安卓 App 新增「Material 3」风格（设置 → 外观 → 风格）：Material You 色调、圆润的容器和药丸按钮、按下时变形的弹性按钮、底部导航栏；安卓 12 以上可以跟随手机壁纸取色',
    'iPad 新增「液态玻璃」风格：参照 iPadOS 27 的 Liquid Glass 设计，半透明玻璃卡片、通栏侧边栏、iOS 风格的分段控件和开关；竖屏时使用浮动的玻璃标签栏，并可以在设置里调节玻璃从清透到磨砂',
    '两种新风格在窄屏上都改用底部导航：今日、自测、路径、错题本常驻，「更多」里能找到全部页面',
    '换页时新增与风格相配的过渡动画；系统开启「减少动态效果」时会自动关闭',
    '这一版汇总了近期的全部更新：账号登录与多设备同步、背诵模式与按要点自评（试验性功能）、进度图表、朗读、每日提醒'] },
  { v: '1.6', d: '2026-11-22', t: '账号登录与多设备自动同步', items: [
    '「设置」最上面新增「账号与同步」：用邮箱注册、登录，忘记密码可以发重置邮件',
    '登录后，GitHub Pages 网页版、iPad 主屏幕版和安卓 App 的进度自动同步：做题记录、错题本、笔记、设置、学习时间都包括在内',
    '第一次登录时，这台设备上已有的进度会和账号里的合并，不会被覆盖；同一道题以最近一次作答为准',
    '没网时照常使用，联网后自动补上同步；侧栏底部会显示上次同步的时间'] },
  { v: '1.5.1', d: '2026-11-22', t: '试验性功能', items: [
    '侧栏新增「试验性功能」（beta），大题背诵模式和按要点自评移到这里，各有一个开关',
    '两个功能默认关闭，刷题界面保持原样；在「试验性功能」里打开后，对应按钮才会出现'] },
  { v: '1.5', d: '2026-11-22', t: '背诵模式、按要点自评、图表、朗读和每日提醒', items: [
    '大题背诵模式：简答、论述、情境、名解的题卡上新增「背诵」。「要点提示」只显示每个要点的标题，回忆完再点开；「首字提示」每句只露出开头两个字，点一下显示整句',
    '按要点自评：对完答案后，勾上自己答出来的要点，按比例自动给出「不会 / 模糊 / 掌握」；漏掉的要点会记下来，下次做这题时在题目下方提醒',
    '模拟卷交卷后，大题可以「按要点给分」，勾选答出的要点，分数按比例自动填好',
    '进度页新增「模块掌握雷达」和「最需要补的 3 个模块」，以及模拟卷得分率变化曲线；图上的点可以悬停或点按看详细数字',
    '题卡上新增「朗读」：读出题目和参考答案，可以在「设置」里调语速；安卓 App 用手机自带的朗读引擎',
    '安卓 App 新增「每日学习提醒」：在「设置」里打开并选好时间，每天到点发一条通知；当天已经打开过 App 就不再提醒'] },
  { v: '1.4.1', d: '2026-11-22', t: '今日计划与复习路径修复', items: [
    '今日计划里的复习路径：三步都完成之前固定是同一个考点，退出再进来不会换；按钮会显示「继续（第 X 步）」，直接回到没做完的那一步',
    '三步都完成后显示「今日已完成」，可以点「加练一个新路径」再换一个；第二天会自动换新的考点',
    '复习路径「旧题补充」里：在展开的题卡上打分后，上面那一行的「未练 / 不会 / 模糊 / 掌握」马上更新；检索、错题本等列表也一样'] },
  { v: '1.4', d: '2026-11-21', t: '下载 App', items: [
    '「设置」里新增「下载 App」：iPad / iPhone 可以把复习站添加到主屏幕当 App 用，安卓手机可以直接下载安装包',
    '侧栏底部新增「下载 App」入口，点一下直接跳过去',
    '两种 App 都能离线使用，进度保存在设备里；换设备时用「备份与恢复」搬进度'] },
  { v: '1.3.1', d: '2026-11-21', t: '安卓 App 一键更新测试', items: [
    '这是一次测试更新：在安卓 App 里看到这条说明，就说明 App 内「检查更新 → 下载 → 安装」整套流程成功了',
    '更新后学习进度、设置、错题本都会保留'] },
  { v: '1.3', d: '2026-11-21', t: '更新提示与更新日志', items: [
    '新增更新提示：每次更新后第一次打开，会弹出这次更新了什么，看过就不再出现',
    '「设置」里新增「更新日志」，可以随时翻看每个版本的改动',
    'iPad 主屏幕版：新版本下载好后，页面底部会提示「点此刷新」，不用再等下次打开',
    '安卓 App：联网时自动检查新版本，可以在 App 里直接下载安装；「设置」里也能手动「检查更新」'] },
  { v: '1.2', d: '2026-11-20', t: '书本风格与离线版', items: [
    '新增「书本」风格（设置 → 外观 → 风格）：纸张质感、目录式侧栏、丝带书签、页码，换页时有翻书动画，深色模式是「夜读」配色',
    '新增安卓 App 和 iPad 主屏幕版，不联网也能用，进度保存在本机',
    '每日自测：每做一题，进度条和「掌握 / 模糊 / 不会」的数量都会马上更新',
    '整理了 78 道题参考答案的加粗和分点，小标题统一加粗，挤在一起的分点分行显示'] },
  { v: '1.1', d: '2026-11-19', t: '设置页、自动计时和模拟卷', items: [
    '新增「设置」页：名字、目标、座右铭、考试日期、每日题量、颜色、字号，首页会显示「xxx，欢迎回来」',
    '学习时间自动记录：页面开着、有操作就计时，离开或长时间不动会自动停止',
    '模拟卷按现行卷型组卷：填空 10×3、名词解释 10×3、简答 6×10、论述 2×15，共 150 分',
    '真题卷里的选择题、判断题改成点选，交卷后自动判分',
    '对答案后可以「隐藏答案」，方便收起来默背',
    '每日自测保留作答状态，切换页面回来不用重做；专项练习默认显示题目列表',
    '电脑大屏自动放大、铺满宽度；修复了 2025–26 答案里混入的章节标题'] },
  { v: '1.0', d: '2026-11-18', t: '复习站上线', items: [
    '11 个考纲模块，2004–2026 年真题，按考点整理',
    '复习路径（新题锚定 → 旧题补充 → 题型转换）、专项练习、每日自测、错题本、模拟卷、检索、进度统计',
    '知识结构图和反应机理图解'] }
];
const APP_VERSION = CHANGELOG[0].v;
function logItems(c) { return `<ul class="chg">${c.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`; }
function showUpdate() {
  if (S.settings.seenVer === APP_VERSION) return;
  const c = CHANGELOG[0], m = $('#modal');
  m.innerHTML = `<div class="modal upd" role="dialog" aria-modal="true" aria-label="更新说明"><div class="card">
    <div class="uh">${MARK}<div><div class="kick" style="margin:0">更新 · v${esc(c.v)} · ${esc(c.d)}</div><h3>${esc(c.t)}</h3></div></div>
    ${logItems(c)}
    <div class="row" style="margin-top:14px"><button class="btn" data-log>查看全部更新日志</button><span class="sp"></span><button class="btn pri" data-ok>开始复习</button></div></div></div>`;
  const close = go => { m.innerHTML = ''; S.settings.seenVer = APP_VERSION; save(); document.removeEventListener('keydown', k); if (go) { location.hash = 'settings'; setTimeout(() => { const t = document.getElementById('changelog'); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 700); } };
  const k = e => { if (e.key === 'Escape') close(); };
  $('[data-ok]', m).onclick = () => close(); $('[data-log]', m).onclick = () => close(true);
  $('.modal', m).addEventListener('click', e => { if (e.target.classList.contains('modal')) close(); });
  document.addEventListener('keydown', k);
  $('[data-ok]', m).focus();
}
/* ---------- 安卓 App：联网时检查 GitHub 上的新版本，可在 App 里直接下载安装 ---------- */
const HAS_UPD = !!(window.AndroidApp && window.AndroidApp.checkUpdate);
let updInfo = null;
function updBar(html) {
  let b = document.getElementById('app-upd');
  if (!html) { if (b) b.remove(); return; }
  if (!b) { b = document.createElement('div'); b.id = 'app-upd'; b.className = 'app-upd'; b.setAttribute('role', 'status'); document.body.appendChild(b); }
  b.innerHTML = html;
  b.onclick = e => { const t = e.target.closest('[data-u]'); if (!t) return; const a = t.dataset.u;
    if (a === 'go' && updInfo) window.AndroidApp.download(updInfo.url, updInfo.name || '');
    if (a === 'web' && updInfo) window.AndroidApp.openUrl(updInfo.page || updInfo.url);
    if (a === 'x') updBar(''); };
}
function updStatus(t) { const e = document.getElementById('ust'); if (e) e.textContent = t; }
window.onAppUpdate = raw => {
  let o; try { o = JSON.parse(raw); } catch (e) { return; }
  if (o.url) updInfo = o;
  if (o.latest) o.latest = 'v' + String(o.latest).replace(/^\D*/, '');
  const web = '<button class="btn sm" data-u="web">用浏览器下载</button>';
  switch (o.status) {
    case 'available':
      updStatus(`发现新版本 ${o.latest}（当前 v${o.current}）`);
      updBar(`<span><b>发现新版本 ${esc(o.latest)}</b><small>当前 v${esc(o.current)} · 进度不会丢失</small></span><button class="btn pri sm" data-u="go">下载并安装</button><button class="btn sm ghost" data-u="x" aria-label="稍后">稍后</button>`); break;
    case 'latest': updStatus(`已经是最新版本（v${o.current}）`); break;
    case 'error': updStatus('检查失败：请确认手机已联网，稍后再试'); break;
    case 'downloading': updStatus('正在下载新版本……'); updBar('<span><b>正在下载新版本</b><small>通知栏可以看进度，下载完会自动打开安装界面</small></span>'); break;
    case 'downloaded': updStatus('下载完成'); updBar(`<span><b>下载完成，正在打开安装界面</b><small>没有弹出来的话，可以改用浏览器下载</small></span>${web}<button class="btn sm ghost" data-u="x">关闭</button>`); break;
    case 'permission': updBar('<span><b>请允许「安装未知应用」</b><small>在刚打开的设置里打开开关，返回后会自动继续安装</small></span><button class="btn sm ghost" data-u="x">关闭</button>'); break;
    case 'failed': updStatus('下载或安装没有成功'); updBar(`<span><b>更新没有成功</b><small>可以改用浏览器下载新版本，再手动安装</small></span>${web}<button class="btn sm ghost" data-u="x">关闭</button>`); break;
  }
};
if (HAS_UPD) setTimeout(() => { try { window.AndroidApp.checkUpdate(false); } catch (e) { } }, 3000);
/* ---------- 下载 App：苹果设备添加到主屏幕；安卓下载安装包（始终指向最新版） ---------- */
const PWA_URL = 'https://hzy040122.github.io/foodchem-ipad/';
const APK_URL = 'https://hzy040122.github.io/foodchem-ipad/android/FoodChemReview.apk';
function downloadSection() {
  const ua = navigator.userAgent, apple = /iPad|iPhone|iPod|Macintosh/.test(ua) && 'ontouchend' in document, android = /Android/i.test(ua);
  const standalone = window.__PWA && ((window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone);
  const appleCard = standalone ? `<div class="dl-card"><div class="dl-h">${icon('dlApple', 'dl-i')}<div><b>iPad / iPhone</b><small>你正在使用主屏幕版</small></div></div><p class="note">已经可以离线使用。更新会在联网时自动下载，底部出现「点此刷新」时点一下即可。</p></div>`
    : `<div class="dl-card${apple ? ' hl' : ''}"><div class="dl-h">${icon('dlApple', 'dl-i')}<div><b>iPad / iPhone</b><small>添加到主屏幕，像 App 一样使用</small></div></div>
      <ol class="dl-steps">
        <li>在 iPad 或 iPhone 上用 <b>Safari</b> 打开：<br><a href="${PWA_URL}" target="_blank" rel="noopener">${PWA_URL.replace('https://', '')}</a></li>
        <li>点地址栏旁的<b>「分享」</b>按钮（方框加向上箭头）</li>
        <li>往下找到<b>「添加到主屏幕」</b>，点右上角<b>「添加」</b></li>
        <li>联网时从主屏幕图标打开一次，侧栏底部显示<b>「已可离线使用」</b>就装好了</li>
      </ol><div class="row"><a class="btn pri sm" href="${PWA_URL}" target="_blank" rel="noopener">打开主屏幕版网址</a><button class="btn sm" data-cp="${PWA_URL}">复制网址</button></div></div>`;
  const andCard = window.AndroidApp ? `<div class="dl-card"><div class="dl-h">${icon('dlAndroid', 'dl-i')}<div><b>安卓手机 / 平板</b><small>你正在使用安卓 App</small></div></div><p class="note">联网时会自动检查新版本，也可以在下面的「App 更新」里手动检查。</p></div>`
    : `<div class="dl-card${android ? ' hl' : ''}"><div class="dl-h">${icon('dlAndroid', 'dl-i')}<div><b>安卓手机 / 平板</b><small>下载安装包，离线使用</small></div></div>
      <ol class="dl-steps">
        <li>在安卓手机上点下面的<b>「下载安装包」</b>（下载的始终是最新版）</li>
        <li>打开下载好的文件安装；第一次会提示「安装未知应用」，按提示允许即可</li>
        <li>以后联网打开 App 会自动提示更新，点一下就能装好，进度不会丢</li>
      </ol><div class="row"><a class="btn pri sm" href="${APK_URL}" target="_blank" rel="noopener" download>下载安装包</a><button class="btn sm" data-cp="${APK_URL}">复制下载链接</button></div></div>`;
  return `<h2 id="download">下载 App</h2><div class="dl-grid">${appleCard}${andCard}</div>
    <p class="note" id="dlm">App 里的进度和网页版是分开保存的。想把进度带过去：在这里「备份与恢复 → 生成备份 → 复制」，再到 App 的「设置」里粘贴并「导入」。</p>`;
}
function openDiagram(id) {
  const d = document.createElement('div'); d.className = 'zoomable'; DG.mount(d, id); openModal(d, DG.title(id));
  /* 机理图点「下一步」会重画；已经放大的话，新画出来的图保持同样的放大倍数 */
  new MutationObserver(() => { const s = +d.dataset.zs || 1; if (s > 1.01) for (const v of d.querySelectorAll('svg:not(svg svg)')) if (v.style.width !== (s * 100) + '%') { v.style.width = (s * 100) + '%'; v.style.maxWidth = 'none'; v.style.height = 'auto'; } }).observe(d, { childList: true, subtree: true });
}
function openQ(id) { const q = BY[id]; if (q) openModal(qcard(q), `${q.y || '原创情境'} · ${TLABEL[q.t]}`); }

/* ---------- 导航 ---------- */
const PAGES = [['today', '今日', '今'], ['map', '知识结构', '图'], ['learn', '知识点', '知'], ['path', '复习路径', '路'], ['practice', '专项练习', '练'], ['daily', '每日自测', '测'], ['wrong', '错题本', '错'], ['mock', '模拟卷', '卷'], ['search', '检索', '搜'], ['stats', '进度', '度'], ['labs', '试验性功能', '试'], ['settings', '设置', '设']];
const NAV = { learnMod: 1, learnOpen: null, pathC: null, pathStep: 1, pf: { t: '全部', m: 0, lv: 'all', y1: 2004, y2: 2026, order: 'new', c: '', ids: null, i: 0, showList: true }, mock: null, mapMod: null, q: '' };
function navHTML() {
  const cur = location.hash.slice(1) || 'today';
  $('#sidenav').innerHTML = `<div class="brand">${MARK}<div class="bt">食品化学复习站<small>2004–2026 真题 · 11 模块</small></div></div><div class="sep"></div><div class="toc" aria-hidden="true">目　录</div>` +
    PAGES.map(([id, n], i) => `<a href="#${id}" ${cur === id ? 'aria-current="page"' : ''}${id === 'labs' ? ' class="has-beta"' : ''}>${icon(id)}<span class="nm">${n}${id === 'labs' ? '<sup class="beta">beta</sup>' : ''}</span><span class="ld" aria-hidden="true"></span><span class="pn" aria-hidden="true">${i + 1}</span></a>`).join('') + `<svg class="deco" viewBox="0 0 190 70" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M30 10l20 11.5v23L30 56 10 44.5v-23z"/><path d="M50 21.5l20-11.5 20 11.5v23L70 56 50 44.5"/><path d="M90 44.5l20 11.5M110 56l20-11.5v-23L110 10 90 21.5M130 21.5l20-11.5M150 10l20 11.5"/><circle cx="174" cy="24" r="3"/></svg><div class="foot">${window.AndroidApp ? '' : `<a href="#settings" class="dl-link" data-jump="download">${icon('dl')}下载 App</a>`}<span class="sync">${esc(syncMsg)}</span></div>`;
  $('#topnav').innerHTML = `<div class="bar1">${MARK}<b>食品化学复习站</b><span class="sp"></span><span class="sync">${esc(syncMsg)}</span></div><nav aria-label="主导航">${PAGES.map(([id, n]) => `<a href="#${id}" ${cur === id ? 'aria-current="page"' : ''}>${icon(id)}${n}${id === 'labs' ? '<sup class="beta">beta</sup>' : ''}</a>`).join('')}</nav>`;
  const a = $('#topnav nav a[aria-current]'); if (a) a.scrollIntoView({ block: 'nearest', inline: 'center' });
  /* 底部导航栏（Material 3 和液态玻璃风格在窄屏上使用）：四个常用页面 + 「更多」 */
  const bn = document.getElementById('bnav');
  if (bn) { const main4 = ['today', 'daily', 'path', 'wrong'], inMain = main4.includes(cur);
    bn.innerHTML = main4.map(id => { const pg = PAGES.find(x => x[0] === id); return `<a href="#${id}" ${cur === id ? 'aria-current="page"' : ''}><span class="bi">${icon(id)}</span><span class="bl">${id === 'daily' ? '自测' : id === 'path' ? '路径' : pg[1]}</span></a>`; }).join('')
      + `<button type="button" id="bmore" ${inMain ? '' : 'aria-current="page"'}><span class="bi">${SV('<circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/>')}</span><span class="bl">${inMain ? '更多' : esc((PAGES.find(x => x[0] === cur) || [0, '更多'])[1].replace('试验性功能', '试验'))}</span></button>`;
    $('#bmore').onclick = openMoreSheet; }
}
/* 「更多」：从底部弹出的全部页面列表 */
function openMoreSheet() {
  const m = $('#modal'), cur = location.hash.slice(1) || 'today';
  m.innerHTML = `<div class="modal sheet-wrap" role="dialog" aria-modal="true" aria-label="全部页面"><div class="sheet"><div class="grab" aria-hidden="true"></div><div class="sh-t">全部页面</div><div class="sh-grid">${PAGES.map(([id, n]) => `<a href="#${id}" ${cur === id ? 'aria-current="page"' : ''}><span class="bi">${icon(id)}</span><span>${n}${id === 'labs' ? '<sup class="beta">beta</sup>' : ''}</span></a>`).join('')}</div></div></div>`;
  const close = () => { m.innerHTML = ''; };
  $('.sheet-wrap', m).addEventListener('click', e => { if (e.target.classList.contains('sheet-wrap') || e.target.closest('a')) close(); });
  document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', k); } });
}
function go(page) { if (location.hash.slice(1) === page) render(); else location.hash = page; }
window.addEventListener('hashchange', () => { render(); toTop(); });
/* 侧栏「下载 App」：跳到设置页的下载区 */
document.addEventListener('click', e => { const a = e.target.closest('[data-jump]'); if (!a) return; pSettings.jump = a.dataset.jump;
  if (location.hash === '#settings') { e.preventDefault(); const t = document.getElementById(pSettings.jump); pSettings.jump = null; if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); } });
function render() {
  navHTML();
  const p = location.hash.slice(1) || 'today';
  applyLook();
  const f = { today: pToday, map: pMap, learn: pLearn, path: pPath, practice: pPractice, daily: pDaily, wrong: pWrong, mock: pMock, search: pSearch, stats: pStats, labs: pLabs, settings: pSettings }[p] || pToday;
  const m = document.createElement('div'); const pi = PAGES.findIndex(x => x[0] === p);
  m.dataset.pg = pi >= 0 ? pi + 1 : 1;
  const main = $('#main'), old = main.firstElementChild, changed = render.last && p !== render.last;
  if (changed) { const fwd = pi > render.lastIdx; m.className = (fwd ? 'turn ' : '') + 'pg-in ' + (fwd ? 'fwd' : 'back'); pageFlip(main, old, fwd); }
  render.last = p; render.lastIdx = pi;
  main.replaceChildren(m); f(m);
}
/* 书本风格的翻页（两种方向都以书脊为轴，和真书一样）：
   往后翻：旧的一页放进一张浮在正文上的“纸”里，绕书脊掀起离开，新的一页在下面露出来；
   往前翻：旧的一页留在下面不动，新的一页从左边绕书脊翻过来，盖在旧页上 */
function pageFlip(main, old, forward) {
  if (S.settings.skin !== 'book' || !old || !old.dataset.pg) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  $$('.flip').forEach(x => x.remove()); main.classList.remove('swing');
  const r = main.getBoundingClientRect(), top = Math.max(r.top, 0), bot = Math.min(r.bottom, innerHeight);
  if (bot - top < 40) return;
  const fl = document.createElement('div'); fl.className = 'flip' + (forward ? '' : ' under'); fl.setAttribute('aria-hidden', 'true');
  Object.assign(fl.style, { left: r.left + 'px', top: top + 'px', width: r.width + 'px', height: (bot - top) + 'px' });
  const fm = document.createElement('main'); fm.style.width = r.width + 'px'; fm.style.top = (r.top - top - main.scrollTop) + 'px';
  old.classList.remove('turn'); old.querySelectorAll('[id]').forEach(e => e.removeAttribute('id'));
  fm.appendChild(old); fl.appendChild(fm); document.body.appendChild(fl);
  if (forward) { const done = () => fl.remove(); fl.addEventListener('animationend', e => { if (e.target === fl) done(); }); setTimeout(done, 1200); return; }
  /* 往前翻：正文区域本身绕书脊（左边缘）从竖起的状态落下；旋转中心取屏幕中线，手机上长页面也不会变形 */
  const docTop = r.top + window.scrollY;
  main.style.transformOrigin = `left ${Math.round(innerHeight / 2 - docTop)}px`;
  void main.offsetWidth; main.classList.add('swing');
  const done = () => { fl.remove(); main.classList.remove('swing'); main.style.transformOrigin = ''; };
  const onEnd = e => { if (e.target === main) { main.removeEventListener('animationend', onEnd); done(); } };
  main.addEventListener('animationend', onEnd); setTimeout(done, 1200);
}

/* ---------- 今日 ---------- */
/* 自动记录学习时间：页面在前台、且 5 分钟内有操作时每 15 秒累计一次；做题、对答案也算操作 */
let lastAct = Date.now(), pend = 0;
['click', 'keydown', 'input', 'scroll', 'touchstart', 'pointermove'].forEach(ev => window.addEventListener(ev, () => { lastAct = Date.now(); }, { passive: true, capture: true }));
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') lastAct = Date.now(); else flushTime(); });
function studying() { return S.settings.autoTime !== false && document.visibilityState === 'visible' && Date.now() - lastAct < 5 * 60e3; }
/* 学习记录按设备分开记：by[设备] = {min, done}，总数 = 各设备相加（旧记录先算作 _legacy 一份） */
function logMine(k) { const L = S.log[k] || { min: 0, done: 0 }; if (!L.by) L.by = (L.min || L.done) ? { _legacy: { min: L.min || 0, done: L.done || 0 } } : {}; L.by[DEV] = L.by[DEV] || { min: 0, done: 0 }; return L; }
function logSum(L) { let m = 0, d = 0; for (const v of Object.values(L.by || {})) { m += v.min || 0; d += v.done || 0; } L.min = Math.round(m * 100) / 100; L.done = d; return L; }
function flushTime() { if (pend <= 0) return; const k = dkey(); const L = logMine(k); L.by[DEV].min = Math.round(((L.by[DEV].min || 0) + pend) * 100) / 100; logSum(L); S.log[k] = L; pend = 0; save(); }
setInterval(() => {
  if (!studying()) return;
  pend += 0.25;
  if (pend >= 1) flushTime();
  const k = dkey(); const mins = Math.floor(((S.log[k] || {}).min || 0) + pend);
  $$('[data-today-min]').forEach(e => e.textContent = mins);
  const t = $('#tm'); if (t) t.textContent = '正在记录 · 今天 ' + mins + ' 分钟';
}, 15000);
window.addEventListener('pagehide', flushTime);
function pToday(m) {
  const today = dkey(); const L = S.log[today] || { min: 0, done: 0 };
  const due = BANK.filter(q => isDue(q.id)).length;
  const wrong = BANK.filter(q => qs(q.id).w).length;
  const D = S.daily[today]; const dDone = D ? Object.keys(D.res).length : 0, dTot = D ? D.ids.length : (S.settings.dailyN || 12);
  /* 本周 = 从这周一到今天（之前算的是最近 7 天，刚开始用的头几天看起来和总时长一样） */
  const wd = (new Date().getDay() + 6) % 7; let week = pend; for (let i = 0; i <= wd; i++) week += (S.log[dkey(Date.now() - i * DAY)] || {}).min || 0;
  let cd = '';
  if (S.settings.exam) { const d = Math.ceil((new Date(S.settings.exam + 'T00:00:00') - sod()) / DAY); if (d >= 0) cd = `距离考试还有 <b>${d}</b> 天。`; }
  const PL = planPath(); const rec = PL.c; const rc = CL[rec];
  const PP = S.path[rec] || {}, pStep = [PP.s1, PP.s2, PP.s3].filter(Boolean).length, pNext = !PP.s1 ? 1 : !PP.s2 ? 2 : 3;
  const pathBtn = PL.done ? `<div class="pdone"><span class="chip ok">✓ 今日已完成</span><button class="btn sm" id="morePath">加练一个新路径</button></div>`
    : `<button class="btn pri" data-go="path" data-c="${rec}" data-step="${pNext}">${pStep ? `继续（第 ${pNext} 步）` : '开始'}</button>`;
  const item = MODS.flatMap(x => x.items).find(it => it.cs.includes(rec));
  const dur = S.settings.dur || 90;
  const plan = { 60: [30, 20, 10, 0], 90: [40, 25, 15, 10], 120: [50, 30, 25, 15] }[dur];
  const realQ = BANK.filter(q => !q.scen); const mast = realQ.filter(q => qs(q.id).l === 3).length; const pct = mast / realQ.length; const R = 46, CC = 2 * Math.PI * R;
  m.innerHTML = `<section class="hero">${MOL}<div><div class="kick">${today}${S.settings.goal ? ' · 目标：' + esc(S.settings.goal) : ''}</div><h1>${S.settings.name ? greet() + '，' + esc(S.settings.name) + '，欢迎回来' : '今天的复习'}</h1><p class="lead">${cd} ${S.settings.motto ? esc(S.settings.motto) : '按"复习路径 → 每日自测 → 错题回顾 → 知识点图解"的顺序，每天 1–2 小时，稳扎稳打。'}</p></div>
  <div class="ring" title="真题掌握进度"><svg viewBox="0 0 112 112"><circle cx="56" cy="56" r="${R}" fill="none" stroke="var(--line)" stroke-width="9"/><circle cx="56" cy="56" r="${R}" fill="none" stroke="var(--accent)" stroke-width="9" stroke-linecap="${pct ? 'round' : 'butt'}" stroke-dasharray="${(CC * pct).toFixed(1)} ${CC.toFixed(1)}"/></svg><div class="rv"><b>${Math.round(pct * 100)}%</b><span>真题已掌握</span><span>${mast}/${realQ.length}</span></div></div></section>
  <div class="grid g4">
    <div class="card tile">${icon('today', 'ti')}<b>${due}</b><span>到期复习题</span></div>
    <div class="card tile">${icon('daily', 'ti')}<b>${dDone}/${dTot}</b><span>今日自测</span></div>
    <div class="card tile">${icon('wrong', 'ti')}<b>${wrong}</b><span>错题本</span></div>
    <div class="card tile">${icon('stats', 'ti')}<b><span data-today-min>${Math.floor(L.min + pend)}</span><small style="font-size:13px"> 分钟</small></b><span>今天已学（本周 ${Math.round(week)} 分钟）</span></div>
  </div>
  <h2>今日计划</h2>
  <div class="card"><div class="row" style="margin-bottom:10px"><span class="note">今天打算学多久？</span><div class="seg" id="dur">${[60, 90, 120].map(x => `<button aria-pressed="${dur === x}" data-d="${x}">${x} 分钟</button>`).join('')}</div><span class="sp"></span><span class="timer" id="tm">${S.settings.autoTime === false ? '学习时间记录已暂停' : '正在记录 · 今天 ' + Math.floor(L.min + pend) + ' 分钟'}</span><button class="btn sm" id="tbtn">${S.settings.autoTime === false ? '恢复记录' : '暂停记录'}</button></div>
  <div class="plan">
    <div class="pi"><span class="min">${plan[0]}′</span><div><b>复习路径：${esc(rc.n)}</b><div class="note">${esc(MODN[rc.m])} · 出现 ${CS[rec].n} 年，最近 ${CS[rec].last}。${PL.done ? '三步都完成了，可以加练一个新路径，或者去做下面的任务。' : `已完成 ${pStep}/3 步。先做最新一年的题锚定考点，再补旧题，最后做题型转换；完成三步前这里不会换。`}</div><div class="psteps" aria-hidden="true">${[1, 2, 3].map(n => `<i class="${PP['s' + n] ? 'on' : ''}"></i>`).join('')}</div></div>${pathBtn}</div>
    <div class="pi"><span class="min">${plan[1]}′</span><div><b>每日自测（${dTot} 题）</b><div class="note">客观题 + 名解 + 简答 + 论述/情境，优先抽到期和薄弱的题。</div></div><button class="btn" data-go="daily">去自测</button></div>
    <div class="pi"><span class="min">${plan[2]}′</span><div><b>错题与到期复习（${due} 题到期）</b><div class="note">把"不会""模糊"的题再过一遍，写下易错点。</div></div><button class="btn" data-go="due">去复习</button></div>
    ${plan[3] ? `<div class="pi"><span class="min">${plan[3]}′</span><div><b>知识点与图解：${esc(item ? item.t : rc.n)}</b><div class="note">读一遍要点，看机理图，标记掌握程度。</div></div><button class="btn" data-go="learn" data-it="${item ? item.id : ''}">去阅读</button></div>` : ''}
  </div></div>
  <h2>高频考点（按出现年数和近年热度排序）</h2>
  <div class="list" id="hot"></div>`;
  $('#hot').innerHTML = Object.entries(CS).sort((a, b) => b[1].prio - a[1].prio).slice(0, 8).map(([id, s]) => clusterRow(id)).join('');
  if (HAS_REM) try { window.AndroidApp.setReminderText(PL.done ? `今天的复习路径已完成，还有 ${due} 题到期复习` : `今天的复习路径：「${rc.n}」（已完成 ${pStep}/3 步）· ${due} 题到期复习`); } catch (e) { }
  const mp = $('#morePath'); if (mp) mp.onclick = () => { S.planPath = { c: recommendCluster(S.planPath.c), t: Date.now() }; save(); render(); };
  $('#dur').onclick = e => { const b = e.target.closest('[data-d]'); if (b) { S.settings.dur = +b.dataset.d; save(); render(); } };
  $('#tbtn').onclick = () => { flushTime(); S.settings.autoTime = S.settings.autoTime === false; save(); render(); };
  m.addEventListener('click', e => {
    const b = e.target.closest('[data-go]'); if (b) {
      const g = b.dataset.go;
      if (g === 'path') { NAV.pathC = b.dataset.c; NAV.pathStep = +(b.dataset.step || 1); go('path'); }
      else if (g === 'due') { const ids = BANK.filter(q => isDue(q.id)).map(q => q.id); const w = BANK.filter(q => qs(q.id).w && !ids.includes(q.id)).map(q => q.id); startPractice(ids.concat(w), '到期复习 + 错题'); }
      else if (g === 'learn') { const it = b.dataset.it; if (it) { NAV.learnMod = +it.split('-')[0]; NAV.learnOpen = it; } go('learn'); }
      else go(g);
    }
    const r = e.target.closest('[data-cl]'); if (r) { NAV.pathC = r.dataset.cl; NAV.pathStep = 1; go('path'); }
  });
}
function clusterMastery(id) { const q = CS[id].qs; let a = 0, s = 0; q.forEach(x => { const l = qs(x.id).l; if (l) { a++; s += l; } }); return { att: a, tot: q.length, avg: a ? s / a : 0, m3: q.filter(x => qs(x.id).l === 3).length }; }
function heatHTML(id) { const ys = CS[id].years; return `<span class="heat" title="2017–2026 出现情况">${[2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map(y => `<i class="${ys.has(y) ? 'on' : ''}"></i>`).join('')}</span>`; }
function clusterRow(id) {
  const c = CL[id], s = CS[id], mm = clusterMastery(id), P = S.path[id] || {};
  const st = [P.s1, P.s2, P.s3].filter(Boolean).length;
  return `<div class="li" data-cl="${id}" style="cursor:pointer"><div class="stripe ${hotSet.has(id) ? 'hot' : ''}"></div><div class="main"><div class="t">${esc(c.n)}</div><div class="s"><span>${esc(MODN[c.m])}</span><span>出现 ${s.n} 年 · 最近 ${s.last || '—'}</span>${heatHTML(id)}<span>路径 ${st}/3</span><span>掌握 ${mm.m3}/${mm.tot}</span></div></div></div>`;
}
/* 今日计划里的复习路径：完成三步之前一直保持同一个考点；完成当天显示“今日已完成”，第二天自动换新的 */
function pathDone(id) { const P = S.path[id] || {}; return !!(P.s1 && P.s2 && P.s3); }
function planPath() {
  let pl = S.planPath;
  if (!pl || !CS[pl.c]) {   // 第一次：优先接着做已经做了一半的路径
    const half = Object.keys(CS).filter(id => { const P = S.path[id] || {}; const n = [P.s1, P.s2, P.s3].filter(Boolean).length; return n > 0 && n < 3; }).sort((a, b) => CS[b].prio - CS[a].prio);
    pl = S.planPath = { c: half[0] || recommendCluster(), t: Date.now() }; save();
  }
  if (pathDone(pl.c)) {
    if (!pl.done) { pl.done = dkey(); pl.t = Date.now(); save(); }
    if (pl.done !== dkey()) { pl = S.planPath = { c: recommendCluster(pl.c), t: Date.now() }; save(); }
  } else if (pl.done) { delete pl.done; pl.t = Date.now(); save(); }   // 取消了某一步的完成，回到进行中
  return pl;
}
function recommendCluster(skip) {
  const arr = Object.entries(CS).filter(([id]) => id !== skip && !pathDone(id)).map(([id, s]) => { const P = S.path[id] || {}; const st = [P.s1, P.s2, P.s3].filter(Boolean).length; const mm = clusterMastery(id); return [id, s.prio * (st === 3 ? 0.15 : 1 - st * 0.2) * (1.4 - mm.m3 / mm.tot)]; });
  if (!arr.length) return Object.keys(CS).filter(id => id !== skip)[0];   // 全部完成时随便给一个
  arr.sort((a, b) => b[1] - a[1]); return arr[0][0];
}

/* ---------- 知识结构 ---------- */
function pMap(m) {
  const modStat = mo => { const ids = new Set(mo.items.flatMap(i => i.cs)); const q = BANK.filter(x => ids.has(x.c)); const m3 = q.filter(x => qs(x.id).l === 3).length, m2 = q.filter(x => qs(x.id).l === 2).length, m1 = q.filter(x => qs(x.id).l === 1).length; return { tot: q.length, m3, m2, m1 }; };
  m.innerHTML = `<div class="kick">STRUCTURE · 知识结构</div><h1>知识结构</h1><p class="lead">11 个考纲模块，每个模块下是考纲条目和对应的真题考点。考点颜色表示你的掌握程度，数字是出现的年数。点考点进入复习路径。</p>
  <div class="mods" id="mods">${MODS.map(mo => { const s = modStat(mo); const w = n => (n / s.tot * 100).toFixed(1); return `<button class="card mod" data-m="${mo.id}" aria-pressed="${NAV.mapMod === mo.id}">${icon('m' + mo.id, 'mi')}<div class="no">第 ${mo.id} 章</div><div class="nm">${esc(mo.name)}</div><div class="note">${mo.items.length} 个考纲条目 · ${s.tot} 道题</div><div class="bar" style="margin-top:6px"><i style="width:${w(s.m3)}%;background:var(--ok)"></i><i style="width:${w(s.m2)}%;background:var(--mid)"></i><i style="width:${w(s.m1)}%;background:var(--bad)"></i></div></button>`; }).join('')}</div>
  <div id="tree" class="zoomable"></div><h2>机理图解</h2><p class="lead">复杂机理按步骤拆开，点开后用"下一步"逐步看；两张水分活度图可以拖动查看。</p><div class="mods" id="dgs">${DG.list().map(d => `<button class="card mod" data-dg="${d.id}"><div class="nm" style="font-size:15px">${esc(d.title)}</div><div class="note">点开看图解</div></button>`).join('')}</div>`;
  const drawTree = () => {
    const mo = MODS.find(x => x.id === NAV.mapMod); const t = $('#tree'); if (!mo) { t.innerHTML = ''; return; }
    const rows = []; mo.items.forEach(it => it.cs.forEach((c, j) => rows.push({ it, c, first: j === 0 })));
    const H = rows.length * 46 + 30, W = 760;
    const col = id => { const mm = clusterMastery(id); if (!mm.att) return 'var(--line)'; return mm.avg >= 2.5 ? 'var(--ok)' : mm.avg >= 1.6 ? 'var(--mid)' : 'var(--bad)'; };
    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(mo.name)}知识结构">`;
    const rootY = H / 2;
    s += `<rect x="6" y="${rootY - 24}" width="120" height="48" rx="10" fill="var(--accent)"/><text x="66" y="${rootY + 6}" text-anchor="middle" fill="#fff" font-size="16" font-weight="700" font-family="var(--f-disp)">${esc(mo.name)}</text>`;
    let y = 30; const itY = {};
    rows.forEach(r => { r.y = y; y += 46; });
    mo.items.forEach(it => { const rs = rows.filter(r => r.it === it); itY[it.id] = (rs[0].y + rs[rs.length - 1].y) / 2; });
    mo.items.forEach(it => { const iy = itY[it.id]; s += `<path d="M126,${rootY} C180,${rootY} 180,${iy} 230,${iy}" fill="none" stroke="var(--line)" stroke-width="2"/>`; s += `<g class="nodeT" data-it="${it.id}"><rect x="230" y="${iy - 17}" width="250" height="34" rx="8" fill="var(--surface)" stroke="var(--c-blue-b)"/><text x="242" y="${iy + 5}" font-size="13.5" fill="var(--ink)">${esc(it.id + ' ' + (it.t.length > 15 ? it.t.slice(0, 15) + '…' : it.t))}</text></g>`; });
    rows.forEach(r => { const iy = itY[r.it.id], c = CL[r.c], n = CS[r.c].n; s += `<path d="M480,${iy} C510,${iy} 510,${r.y} 540,${r.y}" fill="none" stroke="var(--line)" stroke-width="2"/><g class="nodeT" data-c="${r.c}"><rect x="540" y="${r.y - 17}" width="214" height="34" rx="17" fill="var(--surface)" stroke="${col(r.c)}" stroke-width="2.4"/><circle cx="558" cy="${r.y}" r="11" fill="${hotSet.has(r.c) ? 'var(--hot)' : 'var(--muted)'}"/><text x="558" y="${r.y + 4}" text-anchor="middle" font-size="11" fill="#fff" font-weight="700">${n}</text><text x="576" y="${r.y + 5}" font-size="13" fill="var(--ink)">${esc(c.n.length > 12 ? c.n.slice(0, 12) + '…' : c.n)}</text></g>`; });
    s += '</svg>';
    t.innerHTML = `<div class="card tree" style="margin-top:12px"><div class="row"><h3 style="margin:0">第 ${mo.id} 章 ${esc(mo.name)}</h3><span class="sp"></span><span class="note">边框：绿=掌握 黄=模糊 红=薄弱 灰=未练；圆点数字=出现年数（橙色为高频）</span></div><div class="tw">${s}</div></div>`;
    t.onclick = e => { const g = e.target.closest('.nodeT'); if (!g) return; if (g.dataset.c) { NAV.pathC = g.dataset.c; NAV.pathStep = 1; go('path'); } else { NAV.learnMod = mo.id; NAV.learnOpen = g.dataset.it; go('learn'); } };
  };
  $('#mods').onclick = e => { const b = e.target.closest('[data-m]'); if (!b) return; NAV.mapMod = +b.dataset.m; $$('#mods .mod').forEach(x => x.setAttribute('aria-pressed', x === b)); drawTree(); $('#tree').scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  $('#dgs').onclick = e => { const b = e.target.closest('[data-dg]'); if (b) openDiagram(b.dataset.dg); };
  if (!NAV.mapMod) NAV.mapMod = 1; drawTree();
}

/* ---------- 知识点 ---------- */
function pLearn(m) {
  const mo = MODS.find(x => x.id === NAV.learnMod) || MODS[0];
  m.innerHTML = `<div class="kick">SYLLABUS · 考纲 11 模块</div><h1>知识点</h1><p class="lead">按考纲 11 个模块整理。每个条目下有要点、机理图、相关真题考点；读完给自己标一个掌握程度。</p>
  <div class="seg" id="ms" style="margin-bottom:14px">${MODS.map(x => `<button data-m="${x.id}" aria-pressed="${x.id === mo.id}">${x.id} ${esc(x.name)}</button>`).join('')}</div>
  <div class="list" id="items">${mo.items.map(it => {
    const k = (S.k[it.id] || {}).l || 0; const KL = ['未标记', '不会', '模糊', '掌握'];
    const rel = it.cs.map(c => { const s = CS[c]; const names = s.qs.filter(q => q.t === '名解'); const terms = [...new Set(names.map(q => q.q))].slice(0, 10); return `<div class="card flat" style="margin-top:8px"><div class="row"><b>${esc(CL[c].n)}</b>${hotSet.has(c) ? '<span class="chip hot">高频</span>' : ''}<span class="note">出现 ${s.n} 年 · 最近 ${s.last || '—'} · ${s.qs.length} 题</span>${heatHTML(c)}<span class="sp"></span><button class="btn sm" data-pc="${c}">练这个考点</button><button class="btn sm pri" data-path="${c}">复习路径</button></div>${terms.length ? `<div class="row" style="margin-top:6px"><span class="note">名解：</span>${terms.map(t => `<button class="chip" style="cursor:pointer" data-term="${esc(t)}" data-c="${c}">${esc(t)}</button>`).join('')}</div>` : ''}</div>`; }).join('');
    return `<details class="kitem" data-it="${it.id}" ${NAV.learnOpen === it.id ? 'open' : ''}><summary>${icon('m' + mo.id, 'mi')}<span class="id">${it.id}</span><span class="t">${esc(it.t)}</span><span class="lv l${k}"><i></i>${KL[k]}</span></summary><div class="kbody">${it.h}${it.dg.length ? `<div class="row" style="margin:8px 0">${it.dg.map(d => `<button class="btn" data-dg="${d}">看图解：${esc(DG.title(d))}</button>`).join('')}</div>` : ''}${rel}<div class="row" style="margin-top:10px"><span class="note">这个条目我：</span>${[1, 2, 3].map(l => `<button class="btn sm r${l}" data-k="${l}" aria-pressed="${k === l}">${LVL[l]}</button>`).join('')}</div></div></details>`;
  }).join('')}</div>`;
  $('#ms').onclick = e => { const b = e.target.closest('[data-m]'); if (b) { NAV.learnMod = +b.dataset.m; NAV.learnOpen = null; render(); } };
  const open = $(`details[data-it="${NAV.learnOpen}"]`); if (open) setTimeout(() => open.scrollIntoView({ block: 'start' }), 50);
  $('#items').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const it = b.closest('[data-it]').dataset.it;
    if (b.dataset.dg) openDiagram(b.dataset.dg);
    if (b.dataset.pc) startPractice(CS[b.dataset.pc].qs.map(q => q.id), CL[b.dataset.pc].n);
    if (b.dataset.path) { NAV.pathC = b.dataset.path; NAV.pathStep = 1; go('path'); }
    if (b.dataset.term) { const q = CS[b.dataset.c].qs.filter(x => x.t === '名解' && x.q === b.dataset.term).sort((a, b) => b.y - a.y)[0]; if (q) openQ(q.id); }
    if (b.dataset.k) { S.k[it] = { l: +b.dataset.k, t: Date.now() }; save(); NAV.learnOpen = it; const d = b.closest('details'); d.querySelector('summary .lv').className = 'lv l' + b.dataset.k; d.querySelector('summary .lv').innerHTML = '<i></i>' + LVL[+b.dataset.k]; $$('[data-k]', d).forEach(x => x.setAttribute('aria-pressed', x === b)); }
  });
}

/* ---------- 复习路径 ---------- */
const normQ = t => t.replace(/[\s（）()，。、？?：:；;,.—\-_　]/g, '').replace(/[0-9]+分/g, '');
function pPath(m) {
  if (!NAV.pathC) {
    const sorted = Object.keys(CS).sort((a, b) => CS[b].prio - CS[a].prio);
    m.innerHTML = `<div class="kick">PATHWAY · 新题锚定 → 旧题补充 → 题型转换</div><h1>复习路径</h1><p class="lead">每个考点按三步走：<b>新题锚定</b>（先做最近一年的真题，明确现在怎么考）→ <b>旧题补充</b>（补齐往年问法，相同题合并显示）→ <b>题型转换</b>（同一知识点换成名解、简答、论述、情境题来练）。按优先级排序，橙色条为高频考点。</p>
    <div class="row" style="margin-bottom:10px"><div class="seg" id="pm"><button aria-pressed="true" data-m="0">全部</button>${MODS.map(x => `<button data-m="${x.id}">${x.id} ${esc(x.name)}</button>`).join('')}</div></div><div class="list" id="pl">${sorted.map(clusterRow).join('')}</div>`;
    $('#pm').onclick = e => { const b = e.target.closest('[data-m]'); if (!b) return; $$('#pm button').forEach(x => x.setAttribute('aria-pressed', x === b)); const mm = +b.dataset.m; $('#pl').innerHTML = sorted.filter(id => !mm || CL[id].m === mm).map(clusterRow).join(''); };
    $('#pl').onclick = e => { const r = e.target.closest('[data-cl]'); if (r) { NAV.pathC = r.dataset.cl; NAV.pathStep = 1; render(); toTop(); } };
    return;
  }
  const id = NAV.pathC, c = CL[id], s = CS[id], P = S.path[id] = S.path[id] || {};
  const real = s.qs.filter(q => q.y);
  const last = Math.max(...real.map(q => q.y), 0);
  const order = ['分析', '论述', '简答', '名解', '填空', '选择', '判断'];
  let anchor = real.filter(q => q.y === last).sort((a, b) => order.indexOf(a.t) - order.indexOf(b.t)).slice(0, 3);
  const anchorIds = new Set(anchor.map(q => q.id));
  const groups = {}; real.filter(q => !anchorIds.has(q.id)).forEach(q => { const k = q.t + '|' + normQ(q.q); (groups[k] = groups[k] || []).push(q); });
  const g2 = Object.values(groups).map(g => g.sort((a, b) => b.y - a.y)).sort((a, b) => order.indexOf(a[0].t) - order.indexOf(b[0].t) || b[0].y - a[0].y);
  const typesHas = {}; s.qs.forEach(q => typesHas[q.t] = (typesHas[q.t] || 0) + 1);
  const scen = META.scenarios.filter(x => x.c.includes(id));
  const it = MODS.flatMap(x => x.items).find(x => x.cs.includes(id));
  m.innerHTML = `<div class="row"><button class="btn sm" id="back">← 全部考点</button><span class="sp"></span>${it ? `<button class="btn sm" id="toK">看知识点 ${esc(it.id)}</button>` : ''}</div>
  <h1 style="margin-top:10px">${esc(c.n)}</h1><p class="lead">${esc(MODN[c.m])} · 出现 ${s.n} 年（${[...s.years].sort((a, b) => b - a).join('、')}）· 共 ${s.qs.length} 题 ${heatHTML(id)}</p>
  <div class="steps" id="st">${[['新题锚定', `${last} 年 · ${anchor.length} 题`], ['旧题补充', `${g2.length} 组 · 相同题已合并`], ['题型转换', `${Object.keys(typesHas).map(t => TLABEL[t]).join('、')}`]].map(([n, d], i) => `<button class="step ${P['s' + (i + 1)] ? 'done' : ''}" data-s="${i + 1}" aria-pressed="${NAV.pathStep === i + 1}"><b>${i + 1}. ${n}</b><span>${esc(d)}</span></button>`).join('')}</div>
  <div id="sb" style="margin-top:14px"></div>`;
  $('#back').onclick = () => { NAV.pathC = null; render(); };
  if (it) $('#toK').onclick = () => { NAV.learnMod = +it.id.split('-')[0]; NAV.learnOpen = it.id; go('learn'); };
  $('#st').onclick = e => { const b = e.target.closest('[data-s]'); if (b) { NAV.pathStep = +b.dataset.s; render(); } };
  const sb = $('#sb');
  const doneBtn = n => { const b = document.createElement('div'); b.className = 'row'; b.style.marginTop = '12px'; b.innerHTML = `<span class="sp"></span><button class="btn ${P['s' + n] ? '' : 'pri'}">${P['s' + n] ? '已完成，点击取消' : '完成这一步'}</button>`; b.querySelector('button').onclick = () => { P['s' + n] = !P['s' + n]; S.path[id] = P; save(); if (P['s' + n] && n < 3) NAV.pathStep = n + 1; render(); toTop(); }; return b; };
  if (NAV.pathStep === 1) {
    sb.innerHTML = `<div class="warnbox">先做 ${last} 年的题，确定这个考点现在的考法。不看答案先写，写完再对照、打分。</div>`;
    anchor.forEach(q => { const d = qcard(q); d.style.marginTop = '10px'; sb.append(d); });
    sb.append(doneBtn(1));
  } else if (NAV.pathStep === 2) {
    sb.innerHTML = `<div class="warnbox">往年问法按题型排列，相同或几乎相同的题合并成一组，标出全部年份。重复出现的题更要背熟。</div><div class="list" id="old" style="margin-top:10px">${g2.map(g => { const q = g[0], l = qs(q.id).l; return `<div class="li" data-q="${q.id}" style="cursor:pointer"><div class="stripe l${l}"></div><div class="main"><div class="t">${esc(q.q.split('\n')[0].slice(0, 90))}</div><div class="s"><span class="chip">${TLABEL[q.t]}</span><span>${g.map(x => x.y).join('、')}</span>${g.length > 1 ? `<span class="chip hot">考过 ${g.length} 次</span>` : ''}<span class="lv l${l}"><i></i>${LVL[l]}</span></div></div></div>`; }).join('') || '<p class="empty">这个考点只有一年考过。</p>'}</div>`;
    $('#old').onclick = e => { const r = e.target.closest('[data-q]'); if (!r) return; const nx = r.nextElementSibling; if (nx && nx.classList.contains('q')) { nx.remove(); return; } r.after(qcard(BY[r.dataset.q], { onRated: () => { } })); };
    sb.append(doneBtn(2));
  } else {
    const terms = [...new Set(s.qs.filter(q => q.t === '名解').map(q => q.q))];
    const shorts = s.qs.filter(q => q.t === '简答' && q.y).sort((a, b) => b.y - a.y);
    const bigs = s.qs.filter(q => (q.t === '论述' || q.t === '分析') && q.y).sort((a, b) => b.y - a.y);
    const objs = s.qs.filter(q => OBJ.includes(q.t));
    const P3 = [];
    if (terms.length) P3.push(`<li><b>名解 → 简答</b>：以「${esc(terms[0])}」为核心，自拟一道 6 分简答：写定义 + 机理或影响因素 + 一个应用实例。${terms.length > 1 ? `其余名解：${terms.slice(1, 8).map(esc).join('、')}，每个都用一句话说出定义要点。` : ''}</li>`);
    if (shorts.length) P3.push(`<li><b>简答 → 论述</b>：把「${esc(shorts[0].q.slice(0, 40))}」扩写成 15 分论述：补充机理、影响因素、控制措施和至少两个实例，最后写总结。</li>`);
    if (bigs.length) P3.push(`<li><b>论述 → 名解与填空</b>：从「${esc(bigs[0].q.slice(0, 40))}」的答案里挑出 3 个关键概念写成名解，再挑 3 个数字或术语（如温度、pH、Aw 范围）做成填空自测。</li>`);
    P3.push(`<li><b>换到情境中</b>：想一个生活或工厂中的具体食品（如果汁、奶粉、面包、腌肉、炸薯片），用"现象 → 原因（本考点机理）→ 控制措施"三段写出来。${scen.length ? '下面有现成的情境题可以练。' : ''}</li>`);
    sb.innerHTML = `<div class="card"><h3>转换练习</h3><ol style="margin:6px 0 0;padding-left:20px">${P3.join('')}</ol><p class="note">写完后对照本考点各题的参考答案；名解和简答答案已在第 1、2 步中。</p></div>
    ${scen.length ? `<h2>情境分析</h2><div id="sc"></div>` : ''}
    ${objs.length ? `<h2>客观题快查（${objs.length} 题）</h2><div class="row"><button class="btn" id="objgo">逐题练习</button></div>` : ''}`;
    if (scen.length) { const sc = $('#sc'); scen.forEach(x => { const d = qcard(BY['S:' + x.id]); d.style.marginBottom = '10px'; sc.append(d); }); }
    if (objs.length) $('#objgo').onclick = () => startPractice(objs.map(q => q.id), CL[id].n + ' · 客观题');
    sb.append(doneBtn(3));
  }
}

/* ---------- 专项练习 ---------- */
function startPractice(ids, label) { NAV.pf = Object.assign({}, NAV.pf, { ids: ids, label, i: 0 }); go('practice'); }
function filtered() {
  const f = NAV.pf;
  if (f.ids) return f.ids.map(id => BY[id]).filter(Boolean);
  let a = BANK.filter(q => (f.t === '全部' || q.t === f.t) && (!f.m || qmod(q) === f.m) && (q.scen || (q.y >= f.y1 && q.y <= f.y2)));
  if (f.lv !== 'all') a = a.filter(q => f.lv === 'due' ? isDue(q.id) : qs(q.id).l === +f.lv);
  if (f.c) a = a.filter(q => q.c === f.c);
  if (f.order === 'new') a.sort((x, y) => (y.y || 0) - (x.y || 0));
  else if (f.order === 'old') a.sort((x, y) => (x.y || 2027) - (y.y || 2027));
  else if (f.order === 'hot') a.sort((x, y) => (CS[y.c] ? CS[y.c].prio : 0) - (CS[x.c] ? CS[x.c].prio : 0) || y.y - x.y);
  else if (f.order === 'rand') { const seed = f.seed || (f.seed = Math.random()); a = a.map(q => [hash(q.id + seed), q]).sort((x, y) => x[0] - y[0]).map(x => x[1]); }
  return a;
}
function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967296; }
function pPractice(m) {
  const f = NAV.pf;
  const list = filtered(); if (f.i >= list.length) f.i = 0;
  m.innerHTML = `<div class="kick">PRACTICE · 2004–2026 真题</div><h1>专项练习</h1><p class="lead">按题型、模块、掌握程度、年份筛选。做完自评"不会/模糊/掌握"，系统会安排下次复习时间（不会：10 分钟后；模糊：明天；掌握：2→4→7→15→30 天）。</p>
  ${f.ids ? `<div class="warnbox row"><span>正在练：<b>${esc(f.label || '自选题目')}</b>（${list.length} 题）</span><span class="sp"></span><button class="btn sm" id="clr">回到筛选</button></div>` : `<div class="card flat"><div class="grid" style="gap:8px">
    <div class="seg" id="ft">${['全部', '名解', '简答', '论述', '分析', '选择', '填空', '判断'].map(t => `<button data-t="${t}" aria-pressed="${f.t === t}">${t === '全部' ? '全部题型' : TLABEL[t]}</button>`).join('')}</div>
    <div class="row"><select id="fm" aria-label="模块"><option value="0">全部模块</option>${MODS.map(x => `<option value="${x.id}" ${f.m === x.id ? 'selected' : ''}>${x.id} ${esc(x.name)}</option>`).join('')}</select>
    <select id="fl" aria-label="掌握程度">${[['all', '全部掌握程度'], ['0', '未练'], ['1', '不会'], ['2', '模糊'], ['3', '掌握'], ['due', '今天到期']].map(([v, n]) => `<option value="${v}" ${f.lv === v ? 'selected' : ''}>${n}</option>`).join('')}</select>
    <select id="y1" aria-label="起始年份">${YEARS.slice().reverse().map(y => `<option ${f.y1 === y ? 'selected' : ''}>${y}</option>`).join('')}</select><span class="note">至</span><select id="y2" aria-label="结束年份">${YEARS.map(y => `<option ${f.y2 === y ? 'selected' : ''}>${y}</option>`).join('')}</select>
    <select id="fo" aria-label="排序">${[['new', '新题在前'], ['old', '旧题在前'], ['hot', '高频考点优先'], ['rand', '随机']].map(([v, n]) => `<option value="${v}" ${f.order === v ? 'selected' : ''}>${n}</option>`).join('')}</select>
    ${f.c ? `<span class="chip">考点：${esc(CL[f.c].n)} <button class="btn sm ghost" id="fcx" aria-label="取消考点筛选">×</button></span>` : ''}</div></div></div>`}
  <div class="row" style="margin:12px 0"><span class="note">共 ${list.length} 题${list.length ? `，第 ${f.i + 1} 题` : ''}</span><span class="sp"></span><button class="btn sm" id="lst">${f.showList ? '收起列表' : '题目列表'}</button></div>
  <div id="pl2"></div><div id="card"></div>`;
  if (f.ids) $('#clr').onclick = () => { f.ids = null; f.i = 0; render(); };
  else {
    $('#ft').onclick = e => { const b = e.target.closest('[data-t]'); if (b) { f.t = b.dataset.t; f.i = 0; render(); } };
    $('#fm').onchange = e => { f.m = +e.target.value; f.i = 0; render(); };
    $('#fl').onchange = e => { f.lv = e.target.value; f.i = 0; render(); };
    $('#y1').onchange = e => { f.y1 = +e.target.value; f.i = 0; render(); };
    $('#y2').onchange = e => { f.y2 = +e.target.value; f.i = 0; render(); };
    $('#fo').onchange = e => { f.order = e.target.value; f.seed = null; f.i = 0; render(); };
    if (f.c) $('#fcx').onclick = () => { f.c = ''; render(); };
  }
  $('#lst').onclick = () => { f.showList = !f.showList; render(); };
  if (f.showList) { $('#pl2').innerHTML = `<div class="list" style="margin-bottom:12px;max-height:340px;overflow:auto">${list.map((q, i) => `<div class="li" data-i="${i}" style="cursor:pointer;padding:6px 10px"><div class="stripe l${qs(q.id).l}"></div><div class="main"><div class="t" style="font-size:14px">${esc(q.q.split('\n')[0].slice(0, 70))}</div><div class="s">${q.y || '原创'} · ${TLABEL[q.t]}</div></div></div>`).join('')}</div>`; $('#pl2').onclick = e => { const r = e.target.closest('[data-i]'); if (r) { f.i = +r.dataset.i; f.showList = false; render(); } }; }
  if (!list.length) { $('#card').innerHTML = '<p class="empty">这个筛选下没有题目，换个条件试试。</p>'; return; }
  const q = list[f.i];
  const nav = `<button class="btn sm" data-n="-1" ${f.i ? '' : 'disabled'}>上一题</button><button class="btn sm pri" data-n="1" ${f.i < list.length - 1 ? '' : 'disabled'}>下一题</button>`;
  const card = qcard(q, { nav });
  card.addEventListener('click', e => { const b = e.target.closest('[data-n]'); if (b) { f.i = Math.max(0, Math.min(list.length - 1, f.i + +b.dataset.n)); render(); toTop(); } });
  $('#card').append(card);
}

/* ---------- 每日自测 ---------- */
function rng(seed) { let s = Math.floor(seed * 2 ** 31) || 1; return () => { s = (s * 48271) % 2147483647; return s / 2147483647; }; }
function pickSet(pool, n, r, used) {
  const now = Date.now();
  const score = q => { const s = qs(q.id); let v = r() * 0.5; if (s.l && s.d <= now && s.l < 3) v += 5; else if (s.l === 1 || s.l === 2) v += 3.5; else if (!s.l) v += 1.5 + (CS[q.c] ? CS[q.c].prio / 12 : 0); else v += 0.2; return v; };
  const out = []; const usedC = new Set();
  pool.filter(q => !used.has(q.id)).map(q => [score(q), q]).sort((a, b) => b[0] - a[0]).forEach(([, q]) => { if (out.length < n && !usedC.has(normQ(q.q)) && (out.filter(x => x.c === q.c).length < 1 || out.length > n * 0.7)) { out.push(q); usedC.add(normQ(q.q)); used.add(q.id); } });
  return out;
}
const DAILY_SIZE = { 8: [3, 3, 1, 1], 12: [5, 4, 2, 1], 16: [6, 6, 3, 1] };
function makeDaily(key) {
  const r = rng(hash(key)); const used = new Set();
  const [n1, n2, n3, n4] = DAILY_SIZE[S.settings.dailyN] || DAILY_SIZE[12];
  const obj = pickSet(BANK.filter(q => OBJ.includes(q.t) && q.y), n1, r, used);
  const nm = pickSet(BANK.filter(q => q.t === '名解'), n2, r, used);
  const sh = pickSet(BANK.filter(q => q.t === '简答'), n3, r, used);
  const bg = pickSet(BANK.filter(q => q.t === '论述' || q.t === '分析'), n4, r, used);
  return { ids: obj.concat(nm, sh, bg).map(q => q.id), res: {} };
}
function pDaily(m) {
  const key = dkey();
  const cur = S.daily[key];
  if (!cur || !Array.isArray(cur.ids) || !cur.ids.some(id => BY[id])) { S.daily[key] = makeDaily(key); save(); }
  S.daily[key].res = S.daily[key].res || {};
  const D = S.daily[key]; const done = Object.keys(D.res).length;
  const hist = Object.entries(S.daily).filter(([k]) => k !== key).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 10);
  m.innerHTML = `<div class="kick">DAILY · ${D.ids.length} 题</div><h1>每日自测</h1><p class="lead">今天 ${D.ids.length} 题：${(() => { const c = t => D.ids.filter(id => BY[id] && t.includes(BY[id].t)).length; return `${c(OBJ)} 道客观题、${c(['名解'])} 道名解、${c(['简答'])} 道简答、${c(['论述', '分析'])} 道论述或情境分析`; })()}。写过的答案和自评会保留，切换页面回来不用重做。优先抽到期和薄弱的题，再补高频考点的新题。做错或模糊的题会自动进入错题本。</p>
  <div class="card"><div class="row"><b id="dpg"></b><span class="sp"></span><span class="note" id="dct"></span><button class="btn sm" id="rd">换一组</button></div><div class="bar" style="margin-top:8px"><i id="dbr" style="background:var(--accent)"></i></div></div>
  <div id="dl" style="margin-top:12px;display:grid;gap:12px"></div>
  ${hist.length ? `<h2>最近的自测</h2><div class="list">${hist.map(([k, v]) => { const r = Object.values(v.res); return `<div class="li"><div class="main"><div class="t">${k}</div><div class="s">完成 ${r.length}/${v.ids.length} · 掌握 ${r.filter(x => x === 3).length} · 模糊 ${r.filter(x => x === 2).length} · 不会 ${r.filter(x => x === 1).length}</div></div></div>`; }).join('')}</div>` : ''}`;
  /* 进度、各等级数量和进度条：每次自评后都即时刷新 */
  const head = () => { const r = D.ids.map(id => D.res[id]).filter(Boolean), n = l => r.filter(x => +x === l).length;
    $('#dpg').textContent = `进度 ${r.length}/${D.ids.length}`; $('#dct').textContent = `掌握 ${n(3)} · 模糊 ${n(2)} · 不会 ${n(1)}`; $('#dbr').style.width = (r.length / D.ids.length * 100) + '%'; };
  head();
  const dl = $('#dl');
  D.ids.forEach((id, i) => {
    const q = BY[id];
    try { if (!q) throw new Error('题库里找不到 ' + id); D.inp = D.inp || {}; const keep = D.inp[id] = D.inp[id] || {}; const c = qcard(q, { keep, onKeep: () => { D.u = Date.now(); S.daily[key] = D; save(); }, extraChip: `<span class="chip">第 ${i + 1} 题</span>${D.res[id] ? `<span class="chip src1">今天已答</span>` : ''}`, onRated: l => { D.res[id] = l; D.u = Date.now(); S.daily[key] = D; save(); head(); } }); dl.append(c); }
    catch (e) { console.error(e); const c = document.createElement('div'); c.className = 'card'; c.innerHTML = `<p class="note">第 ${i + 1} 题没有载入成功（${esc(e && e.message)}），可以点「换一组」或刷新页面。</p>`; dl.append(c); }
  });
  /* 万一题目没有显示出来（例如同步数据刚好在渲染时到达），自动重画一次 */
  setTimeout(() => { const d = document.getElementById('dl'); if (location.hash.slice(1) === 'daily' && (!d || !d.children.length) && !pDaily.retried) { pDaily.retried = 1; render(); setTimeout(() => pDaily.retried = 0, 3000); } }, 300);
  $('#rd').onclick = () => { const k2 = key + ':' + Math.random(); const nd = makeDaily(k2); S.daily[key] = { ids: nd.ids, res: {}, u: Date.now() }; save(); render(); };
}

/* ---------- 错题本 ---------- */
let wf = { t: '全部', m: 0 };
function pWrong(m) {
  let list = BANK.filter(q => qs(q.id).w);
  const tot = list.length;
  list = list.filter(q => (wf.t === '全部' || q.t === wf.t) && (!wf.m || qmod(q) === wf.m)).sort((a, b) => (qs(a.id).l - qs(b.id).l) || (qs(b.id).t - qs(a.id).t));
  m.innerHTML = `<div class="kick">REVIEW · 错题与笔记</div><h1>错题本</h1><p class="lead">自评"不会""模糊"的题和手动加入的题都在这里。连续两次评"掌握"会自动移出，也可以手动移出。可以给每道题写笔记。</p>
  <div class="row" style="margin-bottom:10px"><div class="seg" id="wt">${['全部', '名解', '简答', '论述', '分析', '选择', '填空', '判断'].map(t => `<button data-t="${t}" aria-pressed="${wf.t === t}">${t === '全部' ? '全部' : TLABEL[t]}</button>`).join('')}</div><select id="wm" aria-label="模块"><option value="0">全部模块</option>${MODS.map(x => `<option value="${x.id}" ${wf.m === x.id ? 'selected' : ''}>${x.id} ${esc(x.name)}</option>`).join('')}</select><span class="sp"></span><span class="note">共 ${tot} 题，当前 ${list.length} 题</span><button class="btn pri" id="wgo" ${list.length ? '' : 'disabled'}>逐题重练</button></div>
  <div class="list" id="wl">${list.map(q => { const s = qs(q.id); return `<div class="li" data-q="${q.id}"><div class="stripe l${s.l}"></div><div class="main"><div class="t">${esc(q.q.split('\n')[0].slice(0, 90))}</div><div class="s"><span>${q.y || '原创'} · ${TLABEL[q.t]}</span><span>${esc((CL[q.c] || {}).n || '')}</span><span class="lv l${s.l}"><i></i>${LVL[s.l]}</span><span>练过 ${s.n || 0} 次</span>${s.note ? `<span>笔记：${esc(s.note.slice(0, 30))}${s.note.length > 30 ? '…' : ''}</span>` : ''}</div></div><div class="row"><button class="btn sm" data-a="open">展开</button><button class="btn sm ghost" data-a="rm">移出</button></div></div>`; }).join('') || ('<p class="empty">' + icon('wrong', 'empty-ill') + '错题本是空的。做题时自评"不会"或"模糊"，题目会自动收进来。</p>')}</div>`;
  $('#wt').onclick = e => { const b = e.target.closest('[data-t]'); if (b) { wf.t = b.dataset.t; render(); } };
  $('#wm').onchange = e => { wf.m = +e.target.value; render(); };
  $('#wgo').onclick = () => startPractice(list.map(q => q.id), '错题本重练');
  $('#wl').onclick = e => {
    const b = e.target.closest('button[data-a]'); if (!b) return; const row = b.closest('[data-q]'); const id = row.dataset.q;
    if (b.dataset.a === 'rm') { const s = Object.assign({}, S.q[id]); s.w = 0; s.t = Date.now(); S.q[id] = s; save(); row.remove(); }
    if (b.dataset.a === 'open') { const nx = row.nextElementSibling; if (nx && nx.classList.contains('q')) { nx.remove(); b.textContent = '展开'; return; } const c = qcard(BY[id]); $('.nt', c).hidden = false; row.after(c); b.textContent = '收起'; }
  };
}

/* ---------- 模拟卷 ---------- */
/* 现行卷型：填空 10×3、名词解释 10×3、简答 6×10、论述 2×15 = 150 分（选择/判断/分析只出现在旧年份真题，分值为估算） */
const PTS = { '填空': 3, '名解': 3, '简答': 10, '论述': 15, '选择': 2, '判断': 2, '分析': 15 };
const MOCK_SPEC = [['填空', 10], ['名解', 10], ['简答', 6], ['论述', 2]];
function makeMock(kind, year) {
  if (kind === 'year') { const qsx = BANK.filter(q => q.y === year); const ord = ['选择', '判断', '填空', '名解', '简答', '论述', '分析']; return qsx.sort((a, b) => ord.indexOf(a.t) - ord.indexOf(b.t)).map(q => q.id); }
  const r = rng(Math.random()); const used = new Set();
  return MOCK_SPEC.flatMap(([t, n]) => pickSet(BANK.filter(q => q.t === t && q.y && q.a), n, r, used)).map(q => q.id);
}
/* 模拟卷里可以点选的题：单选（字母或 2004 年的（1）（2）编号）和判断，返回正确选项；多空/多选返回 null，仍用文本框 */
function mockKey(q) {
  if (q.t === '判断') return keyTF(q);
  if (q.t !== '选择' || !(q.opts && q.opts.length)) return null;
  const k = keyLetter(q); if (k && q.opts.some(([a]) => a === k)) return k;
  const n = /^\s*[（(](\d)[)）][^；;（(]*$/.exec(q.key || ''); return n && q.opts.some(([a]) => a === n[1]) ? n[1] : null;
}
function mockOpts(q, M) {
  const right = mockKey(q), mine = (M.ans || {})[q.id];
  const cls = o => 'opt' + (mine === o ? ' sel' : '') + (M.sub && o === right ? ' right' : '') + (M.sub && mine === o && o !== right ? ' wrong' : '');
  const items = q.t === '判断' ? [['√', '对'], ['×', '错']] : q.opts;
  const lab = a => q.t === '判断' ? a : /^\d$/.test(a) ? '（' + a + '）' : a + '.';
  const sh = a => /^\d$/.test(a) ? '（' + a + '）' : a;
  return `<div class="opts">${items.map(([a, t]) => `<button class="${cls(a)}" data-mo="${esc(a)}" ${M.sub ? 'disabled' : ''}>${esc(lab(a))} ${esc(t)}</button>`).join('')}</div>${M.sub ? `<p class="note">${mine ? (mine === right ? '✓ 答对了' : '✗ 你选了 ' + esc(sh(mine)) + '，正确答案是 ' + esc(sh(right))) : '未作答 · 正确答案是 ' + esc(sh(right))}（已自动判分）</p>` : ''}`;
}
function pMock(m) {
  const M = NAV.mock;
  if (!M) {
    m.innerHTML = `<div class="kick">MOCK EXAM · 150 分</div><h1>模拟卷</h1><p class="lead">按现行卷型组卷：填空题 10 题（每题 3 分）、名词解释 10 题（每题 3 分）、简答题 6 题（每题 10 分）、论述题 2 题（每题 15 分），满分 150 分，限时 180 分钟。也可以按年份做整套真题。交卷后对照参考答案给自己打分。</p>
    <div class="grid g2"><div class="card"><h3>按现行卷型组卷</h3><p class="note">优先抽薄弱和高频考点的题，每次组卷都不同。</p><button class="btn pri" id="mk1">开始一套模拟卷</button></div>
    <div class="card"><h3>按年份做真题</h3><div class="row"><select id="my" aria-label="年份">${YEARS.map(y => `<option>${y}</option>`).join('')}</select><button class="btn" id="mk2">开始</button></div><p class="note">2025 年为回忆版，题目不全。旧年份的题型和分值跟现在不完全一样，满分按现行分值估算，仅供参考。</p></div></div>
    <h2>历史成绩</h2>${S.mocks.length ? `<div class="tw"><table class="t"><tr><th>时间</th><th>试卷</th><th>得分</th><th>用时</th></tr>${S.mocks.slice().reverse().map(x => `<tr><td>${new Date(x.ts).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td><td>${esc(x.title)}</td><td><b>${x.score}</b> / ${x.total}</td><td>${x.min != null ? x.min + " 分钟" : "—"}</td></tr>`).join('')}</table></div>` : '<p class="empty">还没有做过模拟卷。</p>'}`;
    $('#mk1').onclick = () => { NAV.mock = { title: '现行卷型模拟卷', ids: makeMock('mix'), start: Date.now(), sub: false, sc: {}, mix: true }; render(); };
    $('#mk2').onclick = () => { const y = +$('#my').value; NAV.mock = { title: y + ' 年真题', ids: makeMock('year', y), start: Date.now(), sub: false, sc: {} }; render(); };
    return;
  }
  const total = M.ids.reduce((s, id) => s + PTS[BY[id].t], 0);
  const groups = []; M.ids.forEach(id => { const t = BY[id].t; const k = t; let g = groups.find(x => x.k === k); if (!g) groups.push(g = { k, ids: [] }); g.ids.push(id); });
  const CN = ['一', '二', '三', '四', '五', '六', '七'];
  m.innerHTML = `<div class="sticky"><div class="row"><b>${esc(M.title)}</b><span class="note">满分 ${total}</span><span class="sp"></span><span class="timer" id="mt"></span>${M.sub ? `<b id="msc"></b>` : '<button class="btn pri" id="sub">交卷</button>'}<button class="btn sm ghost" id="quit">${M.sub ? '返回' : '放弃'}</button></div></div>
  ${groups.map((g, gi) => `<h2>${CN[gi]}、${TLABEL[g.k]}${/[释析]$/.test(TLABEL[g.k]) ? '' : '题'}（${g.ids.length} 题，每题 ${PTS[BY[g.ids[0]].t]} 分，共 ${g.ids.length * PTS[BY[g.ids[0]].t]} 分）</h2><div class="list">${g.ids.map((id, i) => { const q = BY[id]; const full = PTS[q.t]; return `<div class="card q" data-id="${id}"><div class="qtext">${i + 1}. ${esc(q.q)}</div>${mockKey(q) ? mockOpts(q, M) : `${q.opts ? `<div class="note">${q.opts.map(([a, t]) => esc(a + '. ' + t)).join('　')}</div>` : ''}<textarea aria-label="作答" ${M.sub ? 'readonly' : ''}>${esc((M.ans || {})[id] || '')}</textarea>`}${M.sub ? `<div class="ans"><div class="h">参考答案</div>${q.a || ''}</div><div class="row"><span class="note">本题得分</span><input type="number" min="0" max="${full}" step="${full > 3 ? 1 : 0.5}" value="${M.sc[id] != null ? M.sc[id] : ''}" data-sc="${id}" aria-label="得分" style="width:80px"><span class="note">/ ${full}</span><button class="btn sm" data-full="${id}">满分</button><button class="btn sm" data-zero="${id}">0 分</button>${S.settings.labPoints && answerPoints(q).length > 1 ? `<button class="btn sm" data-mpt="${id}">按要点给分</button>` : ''}</div><div class="ptc" data-mpc="${id}" hidden><div class="ph"><b>按要点给分</b><span class="note">勾上你答出来的要点，分数按比例自动填好</span></div><div class="pchips">${answerPoints(q).map((p, j) => `<button class="pchip" data-mpi="${j}" aria-pressed="false"><span class="rn">${j + 1}</span>${esc(p.label || p.hint)}</button>`).join('')}</div></div>` : ''}</div>`; }).join('')}</div>`).join('')}`;
  const tick = () => { const t = $('#mt'); if (!t) return clearInterval(M.tk); const used = Math.floor(((M.end || Date.now()) - M.start) / 60000); t.textContent = M.sub ? `用时 ${used} 分钟` : `剩余 ${Math.max(0, 180 - used)} 分钟`; };
  clearInterval(M.tk); M.tk = setInterval(tick, 20000); tick();
  m.addEventListener('input', e => { if (e.target.tagName === 'TEXTAREA' && !M.sub) { const id = e.target.closest('[data-id]').dataset.id; M.ans = M.ans || {}; M.ans[id] = e.target.value; } });
  const upd = () => { const sc = Object.values(M.sc).reduce((s, v) => s + (+v || 0), 0); const b = $('#msc'); if (b) b.textContent = `得分 ${sc} / ${total}（已评 ${Object.keys(M.sc).length}/${M.ids.length}）`; return sc; };
  if (M.sub) {
    upd();
    m.addEventListener('change', e => { const id = e.target.dataset.sc; if (!id) return; const full = PTS[BY[id].t]; M.sc[id] = Math.max(0, Math.min(full, +e.target.value || 0)); e.target.value = M.sc[id]; const sc = upd(); saveMock(sc, total); const r = M.sc[id] / full; rate(id, r >= 0.8 ? 3 : r >= 0.4 ? 2 : 1); });
    m.addEventListener('click', e => {
      const t = e.target.closest('[data-mpt]'); if (t) { const pc = $(`[data-mpc="${t.dataset.mpt}"]`, m); pc.hidden = !pc.hidden; return; }
      const c = e.target.closest('[data-mpi]'); if (c) {
        c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') !== 'true');
        const pc = c.closest('[data-mpc]'), id = pc.dataset.mpc, q = BY[id], full = PTS[q.t], all = $$('.pchip', pc), on = all.filter(x => x.getAttribute('aria-pressed') === 'true');
        const step = full > 3 ? 1 : 0.5, v = Math.round(full * on.length / all.length / step) * step;
        const inp = $(`[data-sc="${id}"]`, m); inp.value = v; inp.dispatchEvent(new Event('change', { bubbles: true }));
        const pts = answerPoints(q), st = S.q[id]; if (st) { st.miss = pts.filter((p, j) => all[j].getAttribute('aria-pressed') !== 'true').map(p => p.label || p.hint).slice(0, 8); save(); }
        return;
      }
      const id = e.target.dataset.full || e.target.dataset.zero; if (!id) return; const inp = $(`[data-sc="${id}"]`, m); inp.value = e.target.dataset.full ? PTS[BY[id].t] : 0; inp.dispatchEvent(new Event('change', { bubbles: true })); });
  }
  if (!M.sub) m.addEventListener('click', e => { const b = e.target.closest('[data-mo]'); if (!b) return; const id = b.closest('[data-id]').dataset.id; M.ans = M.ans || {}; M.ans[id] = b.dataset.mo; $$('[data-mo]', b.parentNode).forEach(x => x.classList.toggle('sel', x === b)); });
  if (!M.sub) $('#sub').onclick = () => {
    const left = M.ids.filter(id => mockKey(BY[id]) && !(M.ans || {})[id]).length;
    if (left && !window.__noConfirmMock) { const t = $('#sub'); if (t.dataset.warn !== '1') { t.dataset.warn = '1'; t.textContent = `还有 ${left} 道选择/判断没选，再点一次交卷`; return; } }
    M.sub = true; M.end = Date.now();
    M.ids.forEach(id => { const q = BY[id], k = mockKey(q); if (!k || M.sc[id] != null) return; const ok = (M.ans || {})[id] === k; M.sc[id] = ok ? PTS[q.t] : 0; rate(id, ok ? 3 : 1); });
    saveMock(Object.values(M.sc).reduce((a, v) => a + (+v || 0), 0), total);
    render(); toTop();
  };
  $('#quit').onclick = () => { clearInterval(M.tk); NAV.mock = null; render(); };
}
function saveMock(score, total) {
  const M = NAV.mock; const rec = { ts: M.start, title: M.title, score, total, min: Math.round(((M.end || Date.now()) - M.start) / 60000) };
  const i = S.mocks.findIndex(x => x.ts === M.start); if (i >= 0) S.mocks[i] = rec; else S.mocks.push(rec); save();
}

/* ---------- 检索 ---------- */
function pSearch(m) {
  m.innerHTML = `<div class="kick">SEARCH</div><h1>检索</h1><p class="lead">在知识点、2004–2026 真题和参考答案、情境题中搜索关键词，例如"亚硫酸""0.33""叶绿素酶""β′"。</p>
  <div class="row"><input type="search" id="sq" placeholder="输入关键词" value="${esc(NAV.q)}" style="flex:1;min-width:200px" aria-label="检索关键词"><button class="btn pri" id="sgo">搜索</button></div><div id="sr" style="margin-top:14px"></div>`;
  const run = () => {
    const k = $('#sq').value.trim(); NAV.q = k; const out = $('#sr'); if (!k) { out.innerHTML = ''; return; }
    const kl = k.toLowerCase(); const hit = t => t.toLowerCase().includes(kl);
    const mk = t => { const i = t.toLowerCase().indexOf(kl); if (i < 0) return esc(t.slice(0, 90)); const a = Math.max(0, i - 30); return (a ? '…' : '') + esc(t.slice(a, i)) + '<mark>' + esc(t.slice(i, i + k.length)) + '</mark>' + esc(t.slice(i + k.length, i + k.length + 50)) + '…'; };
    const K = MODS.flatMap(mo => mo.items.map(it => ({ it, txt: it.t + ' ' + strip(it.h) }))).filter(x => hit(x.txt));
    const Q = BANK.filter(q => hit(q.q)); const A = BANK.filter(q => !hit(q.q) && hit(strip(q.a)));
    out.innerHTML = `<h2>知识点（${K.length}）</h2><div class="list">${K.slice(0, 30).map(x => `<div class="li" data-it="${x.it.id}" style="cursor:pointer"><div class="main"><div class="t">${x.it.id} ${esc(x.it.t)}</div><div class="s">${mk(strip(x.it.h))}</div></div></div>`).join('') || '<p class="note">没有匹配的知识点。</p>'}</div>
    <h2>题目（${Q.length}）</h2><div class="list">${Q.slice(0, 60).map(q => `<div class="li" data-q="${q.id}" style="cursor:pointer"><div class="stripe l${qs(q.id).l}"></div><div class="main"><div class="t">${mk(q.q)}</div><div class="s">${q.y || '原创情境'} · ${TLABEL[q.t]} · ${esc((CL[q.c] || {}).n || '')}</div></div></div>`).join('') || '<p class="note">没有匹配的题目。</p>'}</div>
    <h2>答案中出现（${A.length}）</h2><div class="list">${A.slice(0, 40).map(q => `<div class="li" data-q="${q.id}" style="cursor:pointer"><div class="main"><div class="t">${esc(q.q.split('\n')[0].slice(0, 70))}</div><div class="s">${mk(strip(q.a))}</div></div></div>`).join('') || '<p class="note">答案中也没有。</p>'}</div>`;
  };
  $('#sgo').onclick = run; $('#sq').onkeydown = e => { if (e.key === 'Enter') run(); };
  $('#sr').onclick = e => { const r = e.target.closest('[data-q],[data-it]'); if (!r) return; if (r.dataset.q) openQ(r.dataset.q); else { NAV.learnMod = +r.dataset.it.split('-')[0]; NAV.learnOpen = r.dataset.it; go('learn'); } };
  if (NAV.q) run(); else $('#sq').focus();
}

/* ---------- 进度 ---------- */
function pStats(m) {
  const all = BANK.filter(q => !q.scen); const att = all.filter(q => qs(q.id).l);
  const cnt = l => all.filter(q => qs(q.id).l === l).length;
  let streak = 0; for (let i = 0; ; i++) { const L = S.log[dkey(Date.now() - i * DAY)]; if (L && (L.done || L.min)) streak++; else if (i) break; if (i > 400) break; }
  const totMin = Object.values(S.log).reduce((s, v) => s + (v.min || 0), 0);
  const barRow = (name, qsx) => { const t = qsx.length || 1; const a = l => qsx.filter(q => qs(q.id).l === l).length; return `<div style="display:grid;grid-template-columns:120px 1fr 90px;gap:10px;align-items:center;font-size:14px"><span>${esc(name)}</span><div class="bar"><i style="width:${a(3) / t * 100}%;background:var(--ok)"></i><i style="width:${a(2) / t * 100}%;background:var(--mid)"></i><i style="width:${a(1) / t * 100}%;background:var(--bad)"></i></div><span class="note" style="font-variant-numeric:tabular-nums">${a(3)}/${qsx.length} 掌握</span></div>`; };
  const days = []; for (let i = 13; i >= 0; i--) { const k = dkey(Date.now() - i * DAY); days.push([k.slice(5), S.log[k] || { min: 0, done: 0 }]); }
  const mx = Math.max(30, ...days.map(d => d[1].done));
  m.innerHTML = `<div class="kick">PROGRESS</div><h1>进度</h1><p class="lead">已练 ${att.length} / ${all.length} 道真题。绿色=掌握，黄色=模糊，红色=不会。</p>
  <div class="grid g4"><div class="card tile"><b>${cnt(3)}</b><span>掌握</span></div><div class="card tile"><b>${cnt(2)}</b><span>模糊</span></div><div class="card tile"><b>${cnt(1)}</b><span>不会</span></div><div class="card tile"><b>${streak} 天</b><span>连续学习 · 累计 ${Math.round(totMin)} 分钟</span></div></div>
  <h2>模块掌握雷达</h2><div class="card radar-wrap">${radarSVG(all)}<div class="weak"><b>最需要补的 3 个模块</b>${weakMods(all)}</div></div>
  <h2>模拟卷分数变化</h2><div class="card">${mockTrendSVG()}</div>
  <h2>近 14 天做题量</h2><div class="card"><svg viewBox="0 0 700 170" class="dg" role="img" aria-label="近14天做题量">${[0, .5, 1].map(f => `<line x1="30" x2="690" y1="${140 - f * 120}" y2="${140 - f * 120}" stroke="var(--line)"/><text x="24" y="${144 - f * 120}" text-anchor="end" class="dgl">${Math.round(mx * f)}</text>`).join('')}${days.map(([d, L], i) => `<rect x="${42 + i * 46}" y="${140 - L.done / mx * 120}" width="30" height="${Math.max(1, L.done / mx * 120)}" rx="3" fill="${i === 13 ? 'var(--accent)' : 'var(--c-blue-b)'}"/><text x="${57 + i * 46}" y="160" text-anchor="middle" class="dgl">${d}</text>${L.done ? `<text x="${57 + i * 46}" y="${134 - L.done / mx * 120}" text-anchor="middle" class="dgl">${L.done}</text>` : ''}`).join('')}</svg></div>
  <h2>各模块掌握情况</h2><div class="card grid" style="gap:8px">${MODS.map(mo => { const ids = new Set(mo.items.flatMap(i => i.cs)); return barRow(mo.id + ' ' + mo.name, all.filter(q => ids.has(q.c))); }).join('')}</div>
  <h2>各题型掌握情况</h2><div class="card grid" style="gap:8px">${['名解', '简答', '论述', '分析', '选择', '填空', '判断'].map(t => barRow(TLABEL[t], all.filter(q => q.t === t))).join('')}</div>`;
  chartHover(m);
  m.addEventListener('click', e => { const b = e.target.closest('[data-wm]'); if (!b) return; NAV.learnMod = +b.dataset.wm; NAV.learnOpen = null; go('learn'); });
}
/* ---------- 进度页图表：模块掌握雷达（已练覆盖 + 掌握两层，同一色相深浅区分）和模拟卷分数折线 ---------- */
function modStats(all) {
  return MODS.map(mo => { const ids = new Set(mo.items.flatMap(i => i.cs)); const q = all.filter(x => ids.has(x.c)); const t = q.length || 1;
    const m3 = q.filter(x => qs(x.id).l === 3).length, at = q.filter(x => qs(x.id).l).length; return { mo, tot: q.length, m3, at, pm: m3 / t, pa: at / t }; });
}
function radarSVG(all) {
  const st = modStats(all), n = st.length, cx = 210, cy = 190, R = 130;
  const pt = (i, r) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + Math.cos(a) * R * r, cy + Math.sin(a) * R * r]; };
  const poly = key => st.map((d, i) => pt(i, Math.max(d[key], 0.02)).map(v => v.toFixed(1)).join(',')).join(' ');
  const rings = [0.25, 0.5, 0.75, 1].map(f => `<polygon points="${st.map((d, i) => pt(i, f).join(',')).join(' ')}" fill="none" stroke="var(--line)" stroke-width="1"/>`).join('');
  const spokes = st.map((d, i) => { const [x, y] = pt(i, 1); return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="var(--line)" stroke-width="1"/>`; }).join('');
  const labels = st.map((d, i) => { const [x, y] = pt(i, 1.17); const anc = Math.abs(x - cx) < 8 ? 'middle' : x > cx ? 'start' : 'end'; return `<text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="${anc}" class="rl">${d.mo.id} ${esc(d.mo.name)}</text>`; }).join('');
  const dots = st.map((d, i) => { const [x, y] = pt(i, Math.max(d.pm, 0.02)); const [hx, hy] = pt(i, 1); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="var(--accent)" stroke="var(--surface)" stroke-width="2"/><line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="transparent" stroke-width="22" data-tip="${esc(d.mo.id + ' ' + d.mo.name)}|掌握 ${d.m3}/${d.tot}（${Math.round(d.pm * 100)}%）|已练 ${d.at}/${d.tot}（${Math.round(d.pa * 100)}%）"/>`; }).join('');
  return `<div class="chart"><div class="legend"><span><i class="sw sw-a"></i>已练覆盖</span><span><i class="sw sw-m"></i>掌握</span></div>
    <svg viewBox="0 0 420 380" class="radar" role="img" aria-label="11 个模块的掌握率和已练覆盖率">${rings}${spokes}
    <polygon points="${poly('pa')}" fill="var(--accent-soft)" fill-opacity=".75" stroke="var(--accent)" stroke-opacity=".45" stroke-width="2" stroke-dasharray="5 4"/>
    <polygon points="${poly('pm')}" fill="var(--accent)" fill-opacity=".22" stroke="var(--accent)" stroke-width="2"/>
    ${[0.5, 1].map(f => `<text x="${cx + 4}" y="${cy - R * f + 12}" class="rg">${f * 100}%</text>`).join('')}${labels}${dots}</svg>
    <details class="tbl"><summary>查看表格</summary><table class="t"><tr><th>模块</th><th>掌握</th><th>已练</th></tr>${st.map(d => `<tr><td>${d.mo.id} ${esc(d.mo.name)}</td><td>${d.m3}/${d.tot}（${Math.round(d.pm * 100)}%）</td><td>${d.at}/${d.tot}（${Math.round(d.pa * 100)}%）</td></tr>`).join('')}</table></details></div>`;
}
function weakMods(all) {
  return modStats(all).filter(d => d.tot).sort((a, b) => a.pm - b.pm || b.tot - a.tot).slice(0, 3).map(d => `<button class="wm" data-wm="${d.mo.id}"><span>${d.mo.id} ${esc(d.mo.name)}</span><small>掌握 ${Math.round(d.pm * 100)}% · 已练 ${Math.round(d.pa * 100)}%</small><span class="go">去看知识点 →</span></button>`).join('') + '<p class="note" style="margin:6px 0 0">按掌握率从低到高排；点一下进入这个模块的知识点。</p>';
}
function mockTrendSVG() {
  const ms = (S.mocks || []).filter(x => x.total > 0).slice(-20);
  if (ms.length < 2) return `<p class="note" style="margin:0">做完${ms.length ? '再做 1' : ' 2'} 套模拟卷（交卷并打完分）后，这里会出现分数变化曲线。${ms.length ? `目前 1 套：${esc(ms[0].title)} ${ms[0].score}/${ms[0].total}。` : ''}</p>`;
  const W = 700, H = 230, L = 44, Rr = 16, T = 16, B = 40, w = W - L - Rr, h = H - T - B;
  const x = i => L + (ms.length === 1 ? w / 2 : i * w / (ms.length - 1)), y = v => T + h - v * h;
  const pts = ms.map((d, i) => [x(i), y(d.score / d.total)]);
  const grid = [0, 0.25, 0.5, 0.75, 1].map(f => `<line x1="${L}" x2="${W - Rr}" y1="${y(f)}" y2="${y(f)}" stroke="var(--line)" stroke-width="1"/><text x="${L - 8}" y="${y(f) + 4}" text-anchor="end" class="dgl">${f * 100}%</text>`).join('');
  const lab = ms.map((d, i) => (ms.length <= 8 || i % Math.ceil(ms.length / 8) === 0 || i === ms.length - 1) ? `<text x="${x(i)}" y="${H - 14}" text-anchor="middle" class="dgl">${dkey(d.ts).slice(5)}</text>` : '').join('');
  const last = ms[ms.length - 1], best = Math.max(...ms.map(d => d.score / d.total));
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" class="dg trend" role="img" aria-label="模拟卷得分率变化">${grid}
    <polyline points="${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    ${pts.map(([px, py], i) => { const d = ms[i]; return `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="5" fill="var(--accent)" stroke="var(--surface)" stroke-width="2"/><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="16" fill="transparent" data-tip="${esc(d.title)}|${d.score}/${d.total} 分（${Math.round(d.score / d.total * 100)}%）|${dkey(d.ts)} · 用时 ${d.min} 分钟"/>`; }).join('')}
    <text x="${pts[pts.length - 1][0] - 8}" y="${pts[pts.length - 1][1] - 12}" text-anchor="end" class="dgv">${Math.round(last.score / last.total * 100)}%</text>${lab}</svg>
    <p class="note" style="margin:4px 0 0">共 ${ms.length} 套，最近一次 ${last.score}/${last.total}，最好 ${Math.round(best * 100)}%。纵轴是得分率，不同满分的试卷可以放在一起比。</p></div>`;
}
/* 图表悬停/点按提示 */
function chartHover(m) {
  let tip = null;
  const show = (el, ev) => { if (!tip) { tip = document.createElement('div'); tip.className = 'ctip'; document.body.appendChild(tip); }
    const [a, ...rest] = el.dataset.tip.split('|'); tip.innerHTML = `<b>${a}</b>${rest.map(r => `<span>${r}</span>`).join('')}`; tip.hidden = false;
    const r = el.getBoundingClientRect(), px = ev && ev.clientX ? ev.clientX : r.left + r.width / 2, py = ev && ev.clientY ? ev.clientY : r.top;
    tip.style.left = Math.min(innerWidth - tip.offsetWidth - 8, Math.max(8, px + 12)) + 'px'; tip.style.top = Math.max(8, py - tip.offsetHeight - 12) + 'px'; };
  const hide = () => { if (tip) tip.hidden = true; };
  m.addEventListener('pointermove', e => { const t = e.target.closest('[data-tip]'); if (t) show(t, e); else hide(); });
  m.addEventListener('pointerleave', hide);
  m.addEventListener('click', e => { const t = e.target.closest('[data-tip]'); if (t) show(t, e); });
  window.addEventListener('hashchange', () => { if (tip) tip.remove(); tip = null; }, { once: true });
}

/* ---------- 试验性功能：默认关闭，打开后才在刷题界面出现 ---------- */
const LABS = [
  { k: 'labRecite', t: '大题背诵模式', d: '简答、论述、情境、名解的题卡上多一个「背诵」按钮，把参考答案拆成一条条要点来背。', how: ['<b>要点提示</b>：只显示每条要点的标题，先回忆，再点开核对', '<b>首字提示</b>：每句只露出开头两个字，其余换成横线，点一下显示整句', '<b>全文</b>：显示完整答案'], where: '题卡上「对答案」旁边' },
  { k: 'labPoints', t: '按要点自评', d: '对完答案后，勾上自己答出来的要点，按比例自动给出「不会 / 模糊 / 掌握」，漏掉的要点下次做这题时会提醒。', how: ['答出 80% 以上算「掌握」，40% 以上算「模糊」，再少算「不会」', '模拟卷交卷后，大题可以「按要点给分」，分数按比例自动填好', '漏掉的要点显示在题目下方：「上次漏了：……」'], where: '对完答案后，答案下方' }
];
function pLabs(m) {
  const st = S.settings;
  m.innerHTML = `<div class="kick">LABS · 试验性功能</div><h1>试验性功能 <sup class="beta lg">beta</sup></h1><p class="lead">这里放的是还在打磨的新功能，默认都是关闭的。打开后，对应的按钮才会出现在刷题界面里；觉得用不惯，随时关掉，学习记录不受影响。</p>
  <div class="labs">${LABS.map(f => `<div class="card lab${st[f.k] ? ' on' : ''}" data-lab="${f.k}"><div class="lab-h"><div><b>${esc(f.t)}</b><span class="note">出现在：${esc(f.where)}</span></div><button class="switch" role="switch" aria-checked="${!!st[f.k]}" aria-label="${esc(f.t)}" data-sw="${f.k}"><i></i></button></div>
    <p>${esc(f.d)}</p><ul class="chg">${f.how.map(x => `<li>${x}</li>`).join('')}</ul><div class="lab-st note">${st[f.k] ? '已开启 · 去刷题界面试试吧' : '未开启'}</div></div>`).join('')}</div>`;
  m.addEventListener('click', e => { const b = e.target.closest('[data-sw]'); if (!b) return; const k = b.dataset.sw; st[k] = !st[k]; save();
    b.setAttribute('aria-checked', !!st[k]); const c = b.closest('.lab'); c.classList.toggle('on', !!st[k]); $('.lab-st', c).textContent = st[k] ? '已开启 · 去刷题界面试试吧' : '未开启'; });
}

/* ---------- 设置 · 账号与同步 ---------- */
function accountSection() {
  if (!CLOUD.on) return `<h2>账号与同步</h2><div class="card"><p class="note" style="margin:0">在 Claude 里打开的这个版本，进度会同步到你的 Claude 账号。想和 iPad、安卓 App 同步，请用 GitHub Pages 网页版（<a href="${PWA_URL}" target="_blank" rel="noopener">${PWA_URL.replace('https://', '')}</a>）或 App 登录同一个复习站账号。</p></div>`;
  const u = CLOUD.user;
  if (u) return `<h2>账号与同步</h2><div class="card acct"><div class="row"><span class="av">${esc((u.email || '?')[0].toUpperCase())}</span><div><b>${esc(u.email || '')}</b><div class="note" id="acst">${esc(CLOUD.err || (CLOUD.lastOk ? '上次同步：' + agoText(CLOUD.lastOk) : '还没同步'))}</div></div><span class="sp"></span><button class="btn pri sm" id="acsync">立即同步</button><button class="btn sm ghost" id="acout">退出登录</button></div>
    <p class="note" style="margin:8px 0 0">做题记录、错题本、笔记、设置、学习时间会在网页版、iPad 和安卓 App 之间自动同步：改动后 20 秒内上传，打开或回到页面时下载。没网时照常使用，联网后自动补上。</p></div>`;
  return `<h2>账号与同步</h2><div class="card acct form">
    <p class="note" style="margin:0">登录后，网页版、iPad 主屏幕版和安卓 App 的进度会自动同步。不登录也能用，进度只存在这台设备上。</p>
    <div class="row"><label for="acem">邮箱</label><input type="email" id="acem" autocomplete="email" placeholder="you@example.com" style="flex:1;min-width:200px"></div>
    <div class="row"><label for="acpw">密码</label><input type="password" id="acpw" autocomplete="current-password" placeholder="至少 6 位" style="flex:1;min-width:200px"></div>
    <div class="row"><button class="btn pri" id="acin">登录</button><button class="btn" id="acup">注册新账号</button><span class="sp"></span><button class="btn sm ghost" id="acrs">忘记密码</button></div>
    <p class="note" id="acmsg" style="margin:0"></p></div>`;
}
function bindAccount(m) {
  if (!CLOUD.on) return;
  const msg = t => { const e = $('#acmsg'); if (e) e.textContent = t; };
  const go2 = async (path, label) => {
    const email = $('#acem').value.trim(), pw = $('#acpw').value;
    if (!email) return msg('请先填写邮箱');
    msg(label + '中……'); $$('#acin,#acup').forEach(b => b.disabled = true);
    try { const j = await fbAuth(path, { email, password: pw, returnSecureToken: true }); setUser(j, email); msg('成功！正在把这台设备的进度和账号合并……'); await cloudSync(); render(); toast(path === 'accounts:signUp' ? '注册成功，已开始同步' : '登录成功，进度已同步'); }
    catch (e) { msg(authErr(e.message)); }
    finally { $$('#acin,#acup').forEach(b => b && (b.disabled = false)); }
  };
  if (CLOUD.user) {
    $('#acsync').onclick = async () => { $('#acst').textContent = '正在同步……'; await cloudSync(); const e = $('#acst'); if (e) e.textContent = CLOUD.err || '上次同步：' + agoText(CLOUD.lastOk); };
    $('#acout').onclick = () => { const b = $('#acout'); if (!b.dataset.c) { b.dataset.c = 1; b.textContent = '再点一次确认退出'; return; } cloudSync({ quiet: true }).finally(() => { cloudSignOut(); render(); toast('已退出登录，这台设备上的进度还保留着'); }); };
    return;
  }
  $('#acin').onclick = () => go2('accounts:signInWithPassword', '登录');
  $('#acup').onclick = () => go2('accounts:signUp', '注册');
  $('#acpw').onkeydown = e => { if (e.key === 'Enter') go2('accounts:signInWithPassword', '登录'); };
  $('#acrs').onclick = async () => { const email = $('#acem').value.trim(); if (!email) return msg('先在上面填好邮箱，再点「忘记密码」'); msg('正在发送……'); try { await fbAuth('accounts:sendOobCode', { requestType: 'PASSWORD_RESET', email }); msg('重置密码的邮件已发到 ' + email + '，没收到的话看看垃圾邮件'); } catch (e) { msg(authErr(e.message)); } };
}

/* ---------- 设置 ---------- */
function greet() { const h = new Date().getHours(); return h < 5 ? '夜深了' : h < 11 ? '早上好' : h < 13 ? '中午好' : h < 18 ? '下午好' : '晚上好'; }
function pSettings(m) {
  const st = S.settings;
  const seg = (id, opts, cur) => `<div class="seg" id="${id}">${opts.map(([v, n]) => `<button data-v="${v}" aria-pressed="${String(cur) === String(v)}">${n}</button>`).join('')}</div>`;
  m.innerHTML = `<div class="kick">SETTINGS</div><h1>设置</h1><p class="lead">个人信息、学习安排和外观都在这里，改完自动保存。</p>
  ${accountSection()}
  <h2>个人资料</h2><div class="card form">
    <div class="row"><label for="nm">你的名字</label><input type="text" id="nm" maxlength="20" placeholder="例如：小林" value="${esc(st.name || '')}"><span class="note">填写后首页显示「${greet()}，${esc(st.name || 'xxx')}，欢迎回来」</span></div>
    <div class="row"><label for="gl">目标</label><input type="text" id="gl" maxlength="30" placeholder="例如：江南大学 食品科学" value="${esc(st.goal || '')}"><span class="note">显示在首页日期旁</span></div>
    <div class="row"><label for="mt2">座右铭</label><input type="text" id="mt2" maxlength="60" placeholder="给自己的一句话" value="${esc(st.motto || '')}" style="flex:1;min-width:200px"><span class="note">替换首页的默认提示语</span></div>
  </div>
  <h2>学习安排</h2><div class="card form">
    <div class="row"><label for="ex">考试日期</label><input type="date" id="ex" value="${esc(st.exam || '')}"><span class="note">设置后首页显示倒计时</span></div>
    <div class="row"><span class="lab">每日计划时长</span>${seg('sdur', [[60, '60 分钟'], [90, '90 分钟'], [120, '120 分钟']], st.dur || 90)}</div>
    <div class="row"><span class="lab">每日自测题量</span>${seg('sdn', [[8, '轻量 8 题'], [12, '标准 12 题'], [16, '加量 16 题']], st.dailyN || 12)}<span class="note">从明天的自测（或点「换一套」）开始生效</span></div>
    ${ttsAvail() ? `<div class="row"><span class="lab">朗读语速</span>${seg('ttr', [[0.8, '慢'], [1, '正常'], [1.25, '快']], st.ttsRate || 1)}<button class="btn sm" id="ttsTry">试听</button><span class="note">题卡上点「朗读」会读题目和参考答案</span></div>` : ''}
    <div class="row"><span class="lab">自动记录学习时间</span>${seg('sat', [['on', '开启'], ['off', '暂停']], st.autoTime === false ? 'off' : 'on')}</div>
  </div>
  <h2>外观</h2><div class="card form">
    <div class="row" style="align-items:flex-start"><span class="lab">风格</span><div class="skins" id="sk">
      ${SKINS.map(([v, n, d, pv]) => `<button data-v="${v}" aria-pressed="${(document.documentElement.getAttribute('data-skin') || '') === v}"><span class="pv pv-${pv}" aria-hidden="true"><i></i><b></b><b></b><em></em></span><span class="sn">${n}${(v === 'md3' && PLATFORM === 'android') || (v === 'glass' && PLATFORM === 'apple') ? ' <span class="chip ok" style="font-size:11px">本机推荐</span>' : ''}</span><span class="note">${d}</span></button>`).join('')}
    </div></div>
    ${(document.documentElement.getAttribute('data-skin') || '') === 'glass' ? `<div class="row"><span class="lab">玻璃效果</span><span class="note">清透</span><input type="range" id="glassA" min="0" max="100" step="5" value="${st.glassA == null ? 50 : st.glassA}" aria-label="玻璃透明度" style="flex:1;max-width:260px"><span class="note">磨砂</span></div>` : ''}
    ${(document.documentElement.getAttribute('data-skin') || '') === 'md3' && window.AndroidApp && window.AndroidApp.dynamicColors && dynColorCSS() ? `<div class="row"><span class="lab">跟随壁纸取色</span>${seg('md3d', [['on', '开启'], ['off', '关闭']], st.md3Dyn === false ? 'off' : 'on')}<span class="note">用手机壁纸的颜色作为主色调（Material You）</span></div>` : ''}
    <div class="row"><span class="lab">颜色</span>${seg('th', [['', '跟随系统'], ['light', '浅色'], ['dark', '深色']], st.theme || '')}</div>
    <div class="row"><span class="lab">字号</span>${seg('zm', [[1, '标准'], [1.1, '大'], [1.2, '特大']], st.zoom || 1)}</div>
  </div>
  ${downloadSection()}
  ${HAS_REM ? `<h2>每日学习提醒</h2><div class="card form"><div class="row"><span class="lab">提醒</span>${seg('rem', [['on', '开启'], ['off', '关闭']], REM.on ? 'on' : 'off')}<label for="remt" class="lab" style="min-width:0">时间</label><input type="time" id="remt" value="${esc(REM.time || '20:00')}"></div><p class="note" style="margin:0">每天到点会收到一条通知，写着今天的复习路径和到期题数。当天已经打开过 App 就不再打扰你。第一次开启时，手机会询问是否允许通知，请选「允许」。</p></div>` : ''}
  ${HAS_UPD ? `<h2>App 更新</h2><div class="card"><div class="row"><span>当前 App 版本 <b>v${esc(window.AndroidApp.version ? window.AndroidApp.version() : '')}</b></span><span class="sp"></span><button class="btn" id="chk">检查更新</button></div><p class="note" id="ust" style="margin-bottom:0">联网时打开 App 会自动检查一次；有新版本会在底部提示，可以直接下载安装，进度不会丢失。</p></div>` : ''}
  <h2 id="changelog">更新日志</h2><div class="card"><p class="note" style="margin-top:0">当前版本 v${esc(APP_VERSION)}。每次更新后第一次打开会弹出说明，之后都可以在这里查看。</p>
    ${CHANGELOG.map((c, i) => `<details class="chlog" ${i === 0 ? 'open' : ''}><summary><b class="cv">v${esc(c.v)}</b><span class="ct">${esc(c.t)}</span><span class="note cd">${esc(c.d)}</span></summary>${logItems(c)}</details>`).join('')}</div>
  <h2>备份与恢复</h2><div class="card"><p class="note">同步状态：<span class="sync">${esc(syncMsg)}</span></p>${window.AndroidApp ? '<p class="note">进度保存在这台手机里，不联网也能用。卸载 App 或清除应用数据会清空进度，建议隔一段时间点「生成备份 → 分享备份」，存一份到网盘或聊天记录里。</p>' : window.__PWA ? '<p class="note">进度保存在这台 iPad 里，不联网也能用。从主屏幕删除这个图标会清空进度，建议隔一段时间点「生成备份 → 复制」，把文字存到备忘录或发给自己。</p>' : ''}<p class="note">进度会自动保存。想手动备份时，点「生成备份」后复制文本保存；恢复时把文本粘贴进来点「导入」。</p><div class="row"><button class="btn" id="exp">生成备份</button><button class="btn" id="cp" hidden>复制</button><button class="btn" id="imp">导入</button><span class="sp"></span><button class="btn ghost" id="rst">清空全部进度</button></div><textarea id="bk" style="margin-top:8px" aria-label="备份文本" placeholder="备份文本"></textarea><p class="note" id="bkm"></p></div>`;
  m.addEventListener('click', async e => { const b = e.target.closest('[data-cp]'); if (!b) return; const t = b.dataset.cp;
    try { if (window.AndroidApp) window.AndroidApp.copy(t); else await navigator.clipboard.writeText(t); b.textContent = '已复制'; } catch (err) { prompt('复制这个网址：', t); } });
  if (location.hash === '#settings' && pSettings.jump) { const j = pSettings.jump; pSettings.jump = null; setTimeout(() => { const t = document.getElementById(j); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300); }
  if (HAS_UPD) $('#chk').onclick = () => { updStatus('正在检查……'); window.AndroidApp.checkUpdate(true); };
  bindAccount(m);
  const txt = (id, k) => $('#' + id).addEventListener('change', e => { st[k] = e.target.value.trim(); save(); });
  txt('nm', 'name'); txt('gl', 'goal'); txt('mt2', 'motto');
  $('#nm').addEventListener('input', e => { $('#nm').nextElementSibling.textContent = `填写后首页显示「${greet()}，${e.target.value.trim() || 'xxx'}，欢迎回来」`; });
  $('#ex').onchange = e => { st.exam = e.target.value; save(); };
  const pick = (id, fn) => $('#' + id).onclick = e => { const b = e.target.closest('[data-v]'); if (!b) return; fn(b.dataset.v); save(); applyLook(); render(); };
  if (HAS_REM) { const setR = () => { try { window.AndroidApp.setReminder($('#rem [aria-pressed="true"]').dataset.v === 'on', $('#remt').value || '20:00'); toast($('#rem [aria-pressed="true"]').dataset.v === 'on' ? `已设置：每天 ${$('#remt').value} 提醒` : '已关闭每日提醒'); } catch (e) { } };
    $('#rem').onclick = e => { const b = e.target.closest('[data-v]'); if (!b) return; $$('#rem button').forEach(x => x.setAttribute('aria-pressed', x === b)); setR(); };
    $('#remt').onchange = setR; }
  if ($('#ttr')) { pick('ttr', v => st.ttsRate = +v); $('#ttsTry').onclick = e => { if (TTS.on) ttsStop(); else ttsSpeak('美拉德反应是羰基化合物与氨基化合物之间发生的非酶褐变反应。', e.target); }; }
  pick('sdur', v => st.dur = +v); pick('sdn', v => st.dailyN = +v); pick('sat', v => { flushTime(); st.autoTime = v === 'on'; });
  pick('sk', v => st.skin = v);
  const ga = $('#glassA'); if (ga) ga.oninput = () => { st.glassA = +ga.value; applyLook(); clearTimeout(ga.t); ga.t = setTimeout(save, 400); };
  if ($('#md3d')) pick('md3d', v => st.md3Dyn = v === 'on'); pick('th', v => st.theme = v); pick('zm', v => st.zoom = +v);
  $('#exp').onclick = () => { $('#bk').value = JSON.stringify(S); $('#cp').hidden = false; $('#bkm').textContent = '备份已生成。'; };
  if (window.AndroidApp) { const sh = document.createElement('button'); sh.className = 'btn'; sh.id = 'shr'; sh.textContent = '分享备份'; sh.hidden = true; $('#cp').after(sh);
    sh.onclick = () => { try { window.AndroidApp.share($('#bk').value); } catch (e) { } };
    $('#exp').addEventListener('click', () => { sh.hidden = false; }); }
  $('#cp').onclick = async () => { try { if (window.AndroidApp) window.AndroidApp.copy($('#bk').value); else await navigator.clipboard.writeText($('#bk').value); $('#bkm').textContent = '已复制到剪贴板。'; } catch (e) { $('#bk').select(); $('#bkm').textContent = '无法自动复制，请手动全选复制。'; } };
  $('#imp').onclick = () => { try { const R = JSON.parse($('#bk').value); if (!R || typeof R.q !== 'object') throw 0; R.resetAt = S.resetAt; /* 导入的备份是你主动要恢复的数据，不受之前「清空进度」的影响 */ S = merge(R); snapSettings(); save(); applyLook(); $('#bkm').textContent = '导入成功，已和现有进度合并。'; } catch (e) { $('#bkm').textContent = '导入失败：文本不是有效的备份。'; } };
  $('#rst').onclick = () => { const b = $('#rst'); if (b.dataset.c) { const keep = S.settings; S = blank(); S.settings = keep; S.resetAt = Date.now(); save(); render(); } else { b.dataset.c = 1; b.textContent = '再点一次确认清空（个人设置会保留）'; b.classList.add('r1'); } };
}

await Promise.race([syncReady, new Promise(r => setTimeout(r, 4000))]);
render();
syncReady.finally(() => setTimeout(showUpdate, 400));   // 同步完再判断要不要弹更新说明（看过的版本记在账号里）
})();
