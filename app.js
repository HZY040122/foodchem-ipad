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
  frame: '<rect x="4.5" y="3.5" width="15" height="17" rx="2"/><path d="M8 8h8M8 11.5h8M8 15h5"/><path d="M4.5 8h-1M4.5 11.5h-1M4.5 15h-1"/>',
  flash: '<rect x="3.5" y="6.5" width="13" height="14" rx="2"/><path d="M7.5 3.5h11a2 2 0 0 1 2 2v12"/><path d="M7 11.5h6M7 15h4"/>',
  compare: '<rect x="3.5" y="4.5" width="7" height="15" rx="1.5"/><rect x="13.5" y="4.5" width="7" height="15" rx="1.5"/><path d="M6 9h2M6 12.5h2M16 9h2M16 12.5h2"/>',
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
const LOCAL_SET = ['skin', 'glassA', 'md3Dyn', 'zoom', 'theme', 'seenVer', 'autoTime', 'badge'];
let SET_SNAP = {};
function snapSettings() { SET_SNAP = {}; for (const [k, v] of Object.entries(S.settings || {})) if (k !== '_t') SET_SNAP[k] = JSON.stringify(v); }
snapSettings();
const PLATFORM = window.AndroidApp ? 'android' : (window.__PWA || (/iPad|iPhone|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && 'ontouchend' in document))) ? 'apple' : 'web';
/* 主屏幕版（iPad / iPhone）：给页面顶部留出系统模糊带的空间 */
if (PLATFORM === 'apple' && (navigator.standalone === true || (window.matchMedia && matchMedia('(display-mode: standalone)').matches))) document.documentElement.classList.add('ios-app');
/* 主屏幕版更像原生 App：整页不再被双击放大、双指缩放；输入框获得焦点时也不会自动放大。
   知识结构图和机理图解（.zoomable）单独支持双指缩放、双击放大/还原，方便看清小字 */
/* 主屏幕版和安卓 App 用「App 外壳」：只有内容区滚动（见样式表 appshell） */
if (document.documentElement.classList.contains('ios-app') || window.AndroidApp) document.documentElement.classList.add('appshell');
/* iPhone 主屏幕 App：页面铺到屏幕边缘，顶栏和底栏按系统状态栏、主屏幕指示条的高度留出空间 */
if (document.documentElement.classList.contains('ios-app') && /iPhone|iPod/.test(navigator.userAgent)) document.documentElement.classList.add('iphone');
if (document.documentElement.classList.contains('ios-app')) {
  const vp = document.querySelector('meta[name=viewport]'); if (vp) vp.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' + (document.documentElement.classList.contains('iphone') ? ', viewport-fit=cover' : '');
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
function setSync(t) { syncMsg = t; $$('.sync').forEach(e => e.textContent = t); $$('.me-s').forEach(e => e.textContent = meSub()); }
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
  finally { CLOUD.busy = false; $$('.me-s').forEach(e => e.textContent = meSub()); }
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

const featOn = k => S.settings[k] !== false;   /* 已转正的功能（背诵、冲刺计划、睡前回顾）：默认开启，在设置里关 */
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
/* 挖空填词：按词挖空，只挖关键词（名词、术语、动词等），整个词挖掉；
   序号（1）、数字、字母（pH、VE）、标点和「且、受、较、使、等」这类虚词照常显示，句子骨架保留，读起来更顺 */
const FC_STOP = new Set(('的 了 过 是 在 它 它们 它的 差 好 强 弱 快 慢 难 新 旧 少量 大量 部分 全部 较为 相对 和 与 及 或 而 且 并 对 受 使 被 由 于 中 等 较 更 最 很 不 也 都 还 又 可 能 会 易 为 以 其 之 从 到 向 把 将 如 即 则 因 此 所 有 无 多 少 大 小 高 低 一 个 种 各 每 该 这 那 时 后 前 上 下 内 外 间 来 得 地 就 才 再 均 仍 已 亦 若 但 越 愈 其他 ' +
  '具有 含有 可以 能够 使得 由于 因为 所以 因此 从而 因而 同时 此外 另外 例如 比如 以及 并且 而且 但是 或者 通过 进行 发生 产生 导致 引起 一般 通常 主要 其中 之间 之一 以上 以下 不同 一定 较大 较小 较高 较低 容易 可能 能 作为 成为 对于 关于 随着 以及 等等 方面 情况 过程 作用 时候 ' +
  '形成 获得 发挥 显示 影响 直接 间接 重要 必须 逐渐 恢复 常用 称为 又称 叫做 包括 属于 存在 出现 增加 降低 提高 减少 加入 需要 保持 维持 达到 相互 分别 迅速 有关 相关 各种 某些 一些 大多 大多数 一种 这种 这些 正常 特定 充分 发生 进而 使用 利用 用于 用作 称作 也称 主要是 就是 不能 不会 没有 较多 较少 食品 本质 原因 特点 优点 缺点 非常 十分 比较 极易 难以 经过 甚至 会变 变得 现象 这种 以后 之后 然后 首先 其次 最后 主要有 可分为 分为 称之为 所谓 指的是 是指 一方面 另一方面').split(' '));
const FC_SUF = new Set('粒 性 度 剂 素 化 物 类 质 率 值 力 法 型 酶 酸 盐 糖 体 基 量 点 色 味 感 键 链 团 液 胶 粉 油 脂'.split(' '));
/* 分词用题库自带的词表（构建时从全部答案里提取），按「最长匹配」切词：
   各浏览器自带的中文分词不一定有词典，有的会切成单字，所以不用它，保证每台设备挖空一致 */
const FC_DICT = new Set(((META && META.words) || '').split(' ').filter(Boolean)); let FC_MAX = 2; for (const w of FC_DICT) FC_MAX = Math.max(FC_MAX, w.length);
const FC_SEG = { segment(t) {
  const out = []; let i = 0;
  while (i < t.length) {
    if (/[一-鿿]/.test(t[i])) {
      let L = 1; for (let n = Math.min(FC_MAX, t.length - i); n >= 2; n--) if (FC_DICT.has(t.substr(i, n))) { L = n; break; }
      out.push({ segment: t.substr(i, L), isWordLike: true }); i += L;
    } else { let j = i; while (j < t.length && !/[一-鿿]/.test(t[j])) j++; out.push({ segment: t.slice(i, j), isWordLike: false }); i = j; }
  }
  return out;
} };
function fcUnit(w) {
  /* 整个关键词挖掉，横线长度和词的字数一样，点一下显示 */
  const n = [...w].length;
  return `<span class="fc" tabindex="0" role="button" title="点一下显示"><span class="fcb">${'＿'.repeat(Math.min(Math.max(n, 2), 8))}</span><span class="fct" hidden>${esc(w)}</span></span>`;
}
function firstChars(text, ctx) {
  ctx = ctx || { seen: new Set(), topic: '' };
  const m = text.match(/^\s*(（\s*\d+\s*）|\(\s*\d+\s*\)|\d+\s*[.、．]|[①-⑳]|[一二三四五六七八九十]+\s*、)\s*/);
  const lead = m ? m[0] : '', body = text.slice(lead.length);
  if (!FC_SEG) { /* 不支持分词的旧系统：按小句留首字 */
    return esc(lead) + body.split(/(?<=[，。；：、,;:！？])/).map(seg => { const core = seg.replace(/[，。；：、,;:！？]$/, ''); return (core.length <= 2 ? esc(core) : fcUnit(core)) + esc(seg.slice(core.length)); }).join('');
  }
  /* 关键词：中文、不是虚词，也不是全由虚词单字组成（如「就不能」「可与」） */
  const isKey = x => x.isWordLike && /[\u4e00-\u9fff]/.test(x.segment) && !FC_STOP.has(x.segment) && ![...x.segment].every(c => FC_STOP.has(c));
  let out = esc(lead), buf = '', run = false;
  /* 题干里出现过的词（题目本身的主题，如「淀粉」「糊化」）不挖；同一道题里一个词只挖第一次，后面照常显示 */
  const flush = () => { if (buf) { const k = [...buf].length > 1 && !ctx.seen.has(buf) && !(ctx.topic && ctx.topic.includes(buf)); if (k) ctx.seen.add(buf); out += k ? fcUnit(buf) : esc(buf); buf = ''; } };
  for (const x of FC_SEG.segment(body)) {
    if (isKey(x)) {
      const n = [...x.segment].length, bn = [...buf].length;
      /* 词表里没有、被拆成单字的术语（如「坚|牢|度」）连起来算一个词；「稳定+性」这类后缀并到前一个词上；落单的一个字照常显示 */
      if (n === 1) {
        if (buf && !run && FC_SUF.has(x.segment) && bn + 1 <= 5) buf += x.segment;
        else if (buf && run && bn < 4) buf += x.segment;
        else { flush(); buf = x.segment; run = true; }
      } else { flush(); buf = x.segment; run = false; }
    } else { flush(); out += esc(x.segment); }
  }
  flush();
  return out;
}
function reciteHTML(pts, mode, topic) {
  const ctx = { seen: new Set(), topic: String(topic || '').replace(/<[^>]+>/g, '') };
  let lastHead = null;
  const items = pts.map((p, i) => {
    const h = p.head && p.head !== lastHead ? `<div class="rh">${esc(p.head)}</div>` : ''; lastHead = p.head;
    if (mode === 'full') return h + `<div class="rp open">${p.html}</div>`;
    if (mode === 'first') return h + `<div class="rp"><span class="rn">${i + 1}</span>${p.label ? `<b>${esc(p.label)}：</b>` : ''}${/^<table/i.test(p.html) ? p.html : firstChars(p.label ? p.body : p.text, ctx)}</div>`;
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
  const TMR = featOn('labTimer') && TLIM[q.t] && !(q.opts && q.opts.length) && q.t !== '判断';
  el.innerHTML = `<div class="qmeta">${chipsFor(q, o.extraChip || '')}${TMR ? `<span class="chip tmr" data-tmr>⏱ 建议 ${TLIM[q.t]} 分钟${s.tu ? ' · 上次用时 ' + mmss(s.tu) : ''}</span>` : ''}</div><div class="qtext">${esc(q.q)}</div>${body}
    ${S.settings.labPoints && s.miss && s.miss.length && answerPoints(q).length > 1 ? `<div class="miss">上次漏了：${s.miss.map(esc).join('、')}</div>` : ''}
    <div class="row"><button class="btn pri" data-a="show">对答案</button>${featOn('labRecite') && answerPoints(q).length ? '<button class="btn" data-a="recite">背诵</button>' : ''}${q.a && ttsAvail() ? '<button class="btn" data-a="tts">朗读</button>' : ''}${S.settings.labFrame && !OBJ.includes(q.t) && frameFor(q) ? '<button class="btn" data-a="frame">答题框架</button>' : ''}<button class="btn" data-a="star">${s.w ? '已在错题本' : '加入错题本'}</button>${o.noNote ? '' : '<button class="btn ghost" data-a="note">笔记</button>'}<span class="sp"></span>${o.nav || ''}</div>
    <div class="frm-p" hidden></div>
    <div class="recite" hidden></div>
    <div class="ans" hidden><div class="h">参考答案 ${q.src === '汇编' ? '· 来自你的答案汇编' : q.src === '补充' ? '· Claude 按教材补写，建议对照课本' : '· Claude 整理，建议核对'}${q.doubt ? '<span class="chip doubt">存疑</span>' : ''}</div>${q.a || '<p>暂无参考答案。</p>'}</div>
    <div class="ksc" hidden></div>
    <div class="ptc" hidden></div>
    <div class="row rt" hidden><span class="note">这题你答得怎样？</span><button class="btn r1" data-r="1">不会</button><button class="btn r2" data-r="2">模糊</button><button class="btn r3" data-r="3">掌握</button></div>
    <div class="row why" hidden></div>
    <div class="nt" hidden><textarea placeholder="写下易错点、记忆口诀……（自动保存）" aria-label="笔记">${esc(s.note || '')}</textarea></div>`;
  let shown = false;
  const PTS = answerPoints(q);
  /* 限时作答：点进输入框或开始打字时计时，对答案时停止并记下用时 */
  const tch = TMR ? $('[data-tmr]', el) : null, lim = TMR ? TLIM[q.t] * 60 : 0; let T0 = 0, TI = null, TU = 0;
  const tTick = () => { if (!el.isConnected) { clearInterval(TI); TI = null; return; } TU = (Date.now() - T0) / 1000; tch.classList.toggle('over', TU > lim); tch.textContent = TU > lim ? `⏱ 超时 ${mmss(TU - lim)}` : `⏱ ${mmss(TU)} / ${mmss(lim)}`; };
  const tStart = () => { if (!tch || TI || T0) return; T0 = Date.now(); tch.classList.add('run'); TI = setInterval(tTick, 1000); tTick(); };
  const tStop = () => { if (!TI) return; clearInterval(TI); TI = null; tTick(); tch.classList.remove('run'); tch.classList.add('done');
    tch.textContent = `⏱ 用时 ${mmss(TU)}${TU > lim ? '（超时 ' + mmss(TU - lim) + '）' : '（建议 ' + TLIM[q.t] + ' 分钟）'}`;
    const st = Object.assign({ l: 0, n: 0, c: 0, w: 0 }, S.q[q.id]); st.tu = Math.round(TU); st.t = Date.now(); S.q[q.id] = st; save(); };
  if (tch) { const ta0 = el.querySelector(':scope > textarea'); if (ta0) { ta0.addEventListener('focus', tStart); ta0.addEventListener('input', tStart); } }
  /* 关键词自动评分：对答案时，拿输入框里写的内容对照参考答案的关键词 */
  function runScore() {
    if (!S.settings.labScore || OBJ.includes(q.t)) return; const ta = el.querySelector(':scope > textarea'); if (!ta) return;
    const ks = $('.ksc', el), v = ta.value.trim(); ks.hidden = false;
    if (v.replace(/\s/g, '').length < 2) { ks.innerHTML = '<div class="ph"><b>关键词自动评分</b><span class="note">先在上面写下答案，再点「对答案」，就能自动对照关键词</span></div>'; return; }
    const sc = autoScore(q, v, PTS); ks.innerHTML = scoreHTML(sc);
    if (S.settings.labPoints && PTS.length > 1 && $('.pchip', el)) { sc.pts.forEach(p => { const c = $(`.pchip[data-pi="${p.i}"]`, el); if (c) c.setAttribute('aria-pressed', p.hit.length / p.terms.length >= 0.5); }); checkState(); }
  }
  const reveal = () => { tStop(); $('.ans', el).hidden = false; $('.rt', el).hidden = false; showCheck(); runScore(); $('[data-a=show]', el).textContent = '隐藏答案'; if (!shown) { shown = true; o.onReveal && o.onReveal(); } };
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
      tStop(); conceal(); rc.hidden = false; b.textContent = '收起背诵'; $('.rt', el).hidden = false; showCheck();
      const mode0 = PTS.length > 1 ? (S.settings.reciteMode || 'key') : 'first';
      rc.innerHTML = `<div class="row rhd"><b>背诵</b><div class="seg sm" data-rm>${PTS.length > 1 ? `<button data-m="key">要点提示</button>` : ''}<button data-m="first">挖空填词</button><button data-m="full">全文</button></div><span class="sp"></span><button class="btn sm ghost" data-rall>全部揭开</button></div><div class="rbody"></div>`;
      const draw = m => { $$('[data-rm] button', rc).forEach(x => x.setAttribute('aria-pressed', x.dataset.m === m)); $('.rbody', rc).innerHTML = reciteHTML(PTS, m, q.q); rc.dataset.m = m; const ra = $('[data-rall]', rc); if (ra) { ra.dataset.open = '0'; ra.textContent = '全部揭开'; } };
      draw(mode0); if (!shown) { shown = true; o.onReveal && o.onReveal(); }
      return;
    }
    if (b.closest('[data-rm]') && b.dataset.m) { const rc = $('.recite', el); if (PTS.length > 1) { S.settings.reciteMode = b.dataset.m === 'full' ? S.settings.reciteMode : b.dataset.m; save(); } $$('[data-rm] button', rc).forEach(x => x.setAttribute('aria-pressed', x === b)); $('.rbody', rc).innerHTML = reciteHTML(PTS, b.dataset.m, q.q); const ra = $('[data-rall]', rc); if (ra) { ra.dataset.open = '0'; ra.textContent = '全部揭开'; } return; }
    if (b.dataset.rall !== undefined) {
      /* 「全部揭开」和「全部收起」来回切换 */
      const close = b.dataset.open === '1';
      $$('.recite .rk', el).forEach(x => { x.classList.toggle('open', !close); $('.rc1', x).hidden = close; $('.rtap', x).hidden = !close; });
      $$('.recite .fc', el).forEach(x => { $('.fct', x).hidden = close; $('.fcb', x).hidden = !close; x.classList.toggle('open', !close); });
      b.dataset.open = close ? '0' : '1'; b.textContent = close ? '全部揭开' : '全部收起'; return;
    }
    if (b.dataset.pi !== undefined) { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); checkState(); return; }
    if (b.dataset.pall !== undefined) { const all = $$('.pchip', el).every(x => x.getAttribute('aria-pressed') === 'true'); $$('.pchip', el).forEach(x => x.setAttribute('aria-pressed', !all)); checkState(); return; }
    if (b.dataset.pok !== undefined) {
      const miss = PTS.filter((p, i) => $(`.pchip[data-pi="${i}"]`, el).getAttribute('aria-pressed') !== 'true').map(p => p.label || p.hint).slice(0, 8);
      doRate(+b.dataset.l); const st = S.q[q.id]; st.miss = miss; st.pr = Math.round((PTS.length - miss.length) / PTS.length * 100); save();
      $('[data-psum]', el).textContent += miss.length ? ` · 已记下漏掉的要点，下次做这题时会提醒` : ' · 全部答出，太棒了'; return;
    }
    if (b.dataset.ksok) { doRate(+b.dataset.ksok); return; }
    if (b.dataset.a === 'frame') { const fp = $('.frm-p', el), f = frameFor(q); if (!fp.hidden) { fp.hidden = true; b.textContent = '答题框架'; return; } fp.innerHTML = frameHTML(f, true); fp.hidden = false; b.textContent = '收起框架'; return; }
    if (b.dataset.why) { const st = Object.assign({ l: 0, n: 0, c: 0, w: 0 }, S.q[q.id]); if (st.why === b.dataset.why) delete st.why; else st.why = b.dataset.why; st.t = Date.now(); S.q[q.id] = st; save(); $$('[data-why]', el).forEach(x => x.setAttribute('aria-pressed', x.dataset.why === st.why)); return; }
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
    if (S.settings.labCause) { const w = $('.why', el);
      if (l < 3) { w.hidden = false; w.innerHTML = whyHTML(q.id); }
      else { w.hidden = true; if (!restore && S.q[q.id] && S.q[q.id].why) { delete S.q[q.id].why; save(); } } }
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
/* 浮层统一摆放：宽屏时在内容区居中（不算侧边栏），顶部和悬浮搜索框、搜索浮层对齐 */
function placeOverlay(ov) {
  if (innerWidth <= 860 || (typeof SET !== 'undefined' && SET.open)) return;
  const main = document.getElementById('main'); if (!main) return;
  const mr = main.getBoundingClientRect(); ov.style.paddingLeft = Math.max(12, mr.left) + 'px'; ov.style.paddingRight = Math.max(12, innerWidth - mr.right) + 'px';
  const pill = document.getElementById('gsPill');
  if (pill) { const t = parseFloat(getComputedStyle(pill).top) || 14; ov.style.paddingTop = t + 'px'; }
}
function openModal(node, title, opt = {}) {
  const m = $('#modal');
  m.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title || '')}"><div class="card"><div class="row mhd" style="margin-bottom:8px">${opt.back ? `<button class="btn sm ghost mback" data-back>‹ ${esc(opt.backLabel || '返回')}</button>` : ''}<h3 style="margin:0">${esc(title || '')}</h3><span class="sp"></span><button class="btn sm" data-x>关闭</button></div><div class="mb"></div></div></div>`;
  $('.mb', m).append(node);
  placeOverlay($('.modal', m));
  const close = () => { m.innerHTML = ''; document.removeEventListener('keydown', k); };
  function k(e) { if (e.key === 'Escape') close(); }
  $('[data-x]', m).onclick = close;
  if (opt.back) $('[data-back]', m).onclick = () => { close(); opt.back(); };
  $('.modal', m).addEventListener('click', e => { if (e.target.classList.contains('modal')) close(); });
  document.addEventListener('keydown', k);
}
/* ---------- 版本与更新日志：每次更新在最前面加一条，版本号变了，打开时就会弹一次更新说明 ---------- */
const CHANGELOG = [
  { v: '2.9.5', d: '2026-11-26', t: '复习站 2.9.5：首页问候去掉逗号，ⓘ 弹窗自动收起', items: [
    '首页问候不再用逗号：第一行是问候语和名字（名字用强调色），第二行「欢迎回来」作为副标题；iPad 和电脑上也统一成这个样式',
    '设置右上角 ⓘ 弹出的窗口，按到别处或者开始滑动就会自动收起',
    'ⓘ 弹窗里去掉「检查更新」，检查更新只在设置列表的「App 更新」里'] },
  { v: '2.9.4', d: '2026-11-26', t: '复习站 2.9.4：首页问候排版、下拉同步位置和演示动画修正', items: [
    '手机上首页问候改为两行：「早上好，名字」一行（名字用强调色），「欢迎回来」作为副标题，不再在名字后面突兀换行',
    'iPhone 下拉同步的提示往下移，不再压在顶栏的模糊渐隐上；完成时的对勾和失败时的叉在圆里居中',
    '限时作答演示动画里的计时标签不再超出卡片'] },
  { v: '2.9.3', d: '2026-11-26', t: '复习站 2.9.3：限时作答转正，下拉同步完成后显示对勾', items: [
    '限时作答转为正式功能，默认开启：在设置的「学习功能」里开关，页面顶部有演示动画',
    '下拉同步完成后显示绿色的对勾（失败显示红色的叉），不再一直转圈',
    'iPad 上下拉同步的提示放在内容区正中、悬浮搜索框下面，不再和搜索框重叠',
    '已登录的账号页去掉「立即同步」和「退出登录」按钮，这两项在设置首页里'] },
  { v: '2.9.2', d: '2026-11-26', t: '复习站 2.9.2：修复 iPhone 右滑时出现旧页面截图', items: [
    'iPhone / iPad 上切换页面不再新增浏览记录，各页面像原生 App 的标签页一样并列：系统的边缘右滑不会再退到旧页面的截图（比如侧栏还开着的画面）；从左边缘右滑改为拉出侧栏',
    'iPhone 顶栏两个按钮和状态栏的距离恢复到之前的样子'] },
  { v: '2.9.1', d: '2026-11-26', t: '复习站 2.9.1：独立的注册和找回密码页面', items: [
    '注册账号和找回密码改成单独的页面：在设置的账号页点「注册新账号」或「忘记密码？」进入；注册时要输入两次密码',
    'iPhone 状态栏恢复之前的样式，去掉打开侧栏时出现的亮线；滚动边缘的渐隐保留',
    '去掉复习站自己的边缘右滑返回，避免和系统的右滑返回冲突；只有在没有上一页时，右滑会拉出侧栏',
    '手机上的侧栏可以向左划收回',
    '下拉同步只在「今日」页面使用'] },
  { v: '2.9', d: '2026-11-26', t: '复习站 2.9：更像原生 App', items: [
    '从屏幕左边缘往右滑返回上一页；题卡和设置窗口在顶部时往下滑就能关掉',
    '点顶栏回到页面顶部；从标签栏或侧栏切换页面时回到上次看到的位置，再点一次当前标签回到顶部',
    '登录后，在页面顶部继续往下拉，松手就和云端同步一次',
    '液态玻璃风格：按住底部标签栏左右滑，会出现跟着手指走的玻璃放大镜，松手切换页面；标签栏的高度和位置调成和系统 App 一样',
    '设置里新增「通知」：可以在主屏幕图标上显示今天到期的复习题数；安卓的每日学习提醒也移到这里',
    '主屏幕 App 打开时显示启动画面，不再白屏一闪；iPad 分屏、台前调度时窗口变窄会自动切换布局',
    'iPhone 状态栏的颜色和顶栏连成一片，顶栏更紧凑，滚动边缘的渐隐效果恢复',
    '更流畅：专项练习的题目列表改为分批显示，换题、评分不再整页重画几百行；切换页面时少做几次排版计算',
    '手机上的液态玻璃恢复之前的效果'] },
  { v: '2.8.2', d: '2026-11-26', t: '复习站 2.8.2：iPhone 状态栏适配和流畅度优化', items: [
    'iPhone 主屏幕 App：页面铺到屏幕边缘，顶栏按系统状态栏的高度往下排，底部标签栏避开主屏幕指示条',
    '状态栏的颜色跟着页面顶部走，切换风格或深浅色时同步变化',
    '手机上的液态玻璃风格更流畅：滚动的卡片和按钮不再各自实时模糊背景，只保留顶栏按钮、底部标签栏、侧栏和弹窗的玻璃效果，滚动时要重新绘制的图层少了很多，外观基本不变'] },
  { v: '2.8.1', d: '2026-11-26', t: '复习站 2.8.1：修复 iPhone 主屏幕 App 的显示问题', items: [
    '修复：iPhone 主屏幕 App 里，液态玻璃风格的顶栏仍有一条背景，内容滚不到按钮下面',
    '修复：iPhone 主屏幕 App 里，点「三条杠」拉出的侧栏被截断，收起后顶部还残留一截',
    '设置的「学习功能」里，背诵模式、冲刺计划、睡前回顾和搜索栏的页面顶部各加了一段演示动画，直观展示功能的作用'] },
  { v: '2.8', d: '2026-11-26', t: '复习站 2.8：新顶栏、检查更新、统一版本号', items: [
    'iPhone 液态玻璃风格：顶栏只留左边的「三条杠」和右边的搜索按钮，两个按钮是液态玻璃质感，中间显示当前页面名称，去掉了顶栏的底框；点「三条杠」从左边拉出和 iPad 一样的侧栏',
    '液态玻璃风格的底部标签栏去掉「更多」，只留今日、自测、路径、错题本，其他页面从侧栏进入',
    'iPad 和 iPhone 的主屏幕 App 新增检查更新：设置里的「App 更新」和右上角 ⓘ 都能手动检查；从后台切回来时也会自动检查，不用再划掉重开',
    '所有平台的更新提示改为居中的大浮窗，写明新版本更新了什么',
    '安卓、iPad、iPhone 和网页版的版本号从这一版起保持一致',
    '侧边栏去掉「2004–2026 真题 · 11 模块」这一行；冲刺计划标题旁的「试验」标签也去掉了'] },
  { v: '2.7', d: '2026-11-25', t: '复习站 2.7：速查手册和周报放进设置，搜索栏转正', items: [
    '考前速查手册和学习周报改为设置窗口里的二级页面，不再跳出设置',
    '速查手册的 PDF 改为由复习站自己生成：点「生成 PDF」，完成后点「分享 / 保存 PDF」。iPad 和 iPhone 上可以存到「文件」或直接打印，安卓 App 打开系统打印界面，可另存为 PDF',
    '大题背诵模式、冲刺计划、睡前五分钟回顾各有自己的二级页面，在里面开关并查看功能说明',
    '悬浮搜索框转为正式功能：设置里新增「搜索栏」，可以选择悬浮搜索框或侧边栏「检索」'] },
  { v: '2.6', d: '2026-11-25', t: '复习站 2.6：速查手册、学习周报，三个功能转正', items: [
    '新增「考前速查手册」：按模块列出每个考点常考的名词解释和大题要点，可以只看高频或没掌握的考点，网页版和 iPad 版能打印或存为 PDF',
    '新增「学习周报」：一周的学习时长、每天的时长柱状图、做题和评分情况、薄弱模块和下周建议，可以翻看以前的周，一键复制周报文字',
    '大题背诵模式、冲刺计划、睡前五分钟回顾转为正式功能，默认开启，在设置的「学习功能」里开关',
    '「试验性功能」从侧边栏移到设置里；设置列表去掉「下载 App」和「更新日志」，改从右上角 ⓘ 进入',
    '修复：风格只有三个时，设置里的风格卡片挤在左边'] },
  { v: '2.5', d: '2026-11-25', t: '复习站 2.5：设置改成 iPad 设置的样式', items: [
    '设置窗口改成单栏的分组列表：最上面是头像和账号，下面是「学习」「应用程序」两组，点进去是二级页面，左上角返回',
    '外观直接放在设置首页：风格四宫格，颜色模式改成浅色、深色、系统三张预览图，字号在最后一行',
    '右上角 ⓘ 显示版本号，还能打开更新日志、下载其他平台的 App',
    '登录后，「退出登录」放在设置列表的最下面'] },
  { v: '2.4', d: '2026-11-25', t: '复习站 2.4：全新的设置窗口', items: [
    '设置改成居中显示的大窗口：左边是分组（账号、个人资料、学习安排、外观、下载 App、备份与恢复、更新日志等），右边是对应的内容，点哪组看哪组',
    '点侧边栏左下角的头像（手机上是顶栏右侧的头像）打开设置窗口；侧边栏不再单独放「设置」',
    '登录、同步、退出登录和更换头像都在「账号」分组里；更新日志在窗口里直接显示全部版本',
    '手机上设置窗口全屏显示：先是分组列表，点进去看详情，左上角返回'] },
  { v: '2.3.1', d: '2026-11-25', t: '头像与同步状态细节', items: [
    '上传头像后，头像右下角的相机小图标不再显示',
    '侧边栏名字下面的同步状态改为简短显示：已同步、x 分钟前同步、正在同步、离线等，不再跟着显示邮箱'] },
  { v: '2.3', d: '2026-11-25', t: '复习站 2.3：头像与账号浮窗', items: [
    '侧边栏左下角改为显示头像和名字，点一下弹出账号浮窗：没登录时直接在浮窗里登录或注册，登录后显示账号信息、立即同步和退出登录',
    '头像可以上传图片自定义（自动裁成正方形），也可以在浮窗里直接改名字；头像和名字会跟着账号同步到其他设备',
    '「账号与同步」从设置页移到了头像浮窗里；手机上头像在顶栏右侧',
    '侧边栏底部的装饰图案改为固定，不再跟着功能列表滚动；功能较多、屏幕较矮时，列表会自动收紧行距，尽量一屏放下'] },
  { v: '2.2.6', d: '2026-11-25', t: '侧边栏与回弹细节', items: [
    '侧边栏改成只有中间的功能列表滚动和回弹，上面的标题和下面的同步状态固定不动',
    'iPad 主屏幕版和安卓 App 的侧边栏去掉了「下载 App」，只在网页版保留',
    '内容较少、不满一屏的页面（如知识点的绪论模块）也能回弹了',
    '修复 iPhone 上书本风格的顶栏和搜索栏滑动后会收起、回弹不对的问题',
    '修复「更多」面板里试验性功能的 beta 角标把名字挤得偏左的问题'] },
  { v: '2.2.5', d: '2026-11-25', t: '回弹改进', items: [
    '恢复滑到顶部或底部时的回弹手感，但改成只有内容区回弹：侧边栏、背景和顶栏都固定不动，不会再露出空白',
    '手机上回弹时，顶栏和搜索栏不再跟着被拉动',
    '这项改动只在 iPad / iPhone 主屏幕版和安卓 App 里生效，浏览器里打开时保持浏览器自己的滚动方式'] },
  { v: '2.2.4', d: '2026-11-25', t: '滑动体验修复', items: [
    'iPad 上页面滑到最上面或最下面时，不再回弹露出空白；即使系统仍有轻微回弹，露出的底色也和页面一致',
    '手机上顶栏和搜索栏现在一直固定在页面上方：之前滑过一屏后会跟着页面一起滚走'] },
  { v: '2.2.3', d: '2026-11-25', t: '更新日志二级页面与侧边栏顺序', items: [
    '设置里的更新日志只显示最新一次更新，全部版本放到「查看全部更新日志」二级页面里，设置页不再拉得很长',
    '打开名解闪卡、易混对比、答题框架后，它们在侧边栏里排在「每日自测」下面，和刷题相关的功能放在一起',
    '悬浮搜索框去掉了右侧的快捷键提示，搜索浮层的提示文字也精简了'] },
  { v: '2.2.2', d: '2026-11-25', t: '弹窗与搜索浮层对齐', items: [
    '所有弹窗（题卡、机理图解等）在宽屏上改为在内容区居中，顶部和搜索浮层对齐，宽度也一致',
    '从搜索结果打开的题卡左上角多了「‹ 返回搜索结果」，点一下回到刚才的结果列表，还停在原来的位置'] },
  { v: '2.2.1', d: '2026-11-25', t: '悬浮搜索框改进', items: [
    '搜索浮层改为和顶部搜索框对齐，居中在内容区上方（之前按整个屏幕居中，看起来偏左）',
    '弹出题卡时，顶部搜索框会退到遮罩下面，不再和弹窗重叠',
    '手机上也改成悬浮搜索栏：顶栏下方一条整宽的搜索栏，随顶栏固定在页面上方'] },
  { v: '2.2', d: '2026-11-25', t: '复习站 2.2：答题框架、模拟卷诊断等五个新功能', items: [
    '答题框架库：影响因素、机理、区别、作用、控制措施、性质、情境分析、名解 8 类问法的写作框架和真题例子；题卡上可以一键查看这道题适用的框架',
    '模拟卷诊断报告：交卷打分后按模块、题型和考点分析丢分，一键重练低分题',
    '考点趋势提示：标出「连续 3 年都考」「高频 · 近两年没考」「近年新出现」的考点',
    '睡前五分钟回顾：首页集中今天评了「不会」「模糊」的题，睡前快速过一遍',
    '悬浮搜索框：检索从侧边栏移到页面顶部，任何页面都能随手搜，支持 ⌘K',
    '修复：题卡上「这题你答得怎样？」的打分按钮在对答案之前就显示出来的问题；设置里的「复制备份」按钮现在生成备份后才出现',
    '以上新功能都在「试验性功能」里，默认关闭'] },
  { v: '2.1.1', d: '2026-11-25', t: '冲刺计划排版', items: [
    '首页的冲刺计划改成和「今日计划」一样的独立板块：有自己的标题，和上面的数字卡片之间留出间距，不再贴在一起'] },
  { v: '2.1', d: '2026-11-25', t: '复习站 2.1：六个新的试验性功能', items: [
    '关键词自动评分：写完答案点「对答案」，自动对照参考答案的关键词，告诉你写到了哪些、漏了哪些，并给出建议打分',
    '限时作答：名解 3 分钟、简答 8 分钟、论述和分析 15 分钟，开始写就计时，超时变红提醒，用时记在题目上',
    '易混概念对比：糊化和老化、结合水和自由水、酶促和非酶褐变、三种油脂氧化、三种酸败等 13 组对照表，可以挖空练习',
    '名解闪卡：名词解释做成卡片，右滑「记住了」、左滑「还不会」，每组 20 张，没掌握的排在前面',
    '冲刺计划：按考试日期倒推，把还没过完的考点分到每一天，最后 7 天只安排错题和模拟卷',
    '错因标签：评「不会」「模糊」时选一下错在哪里，进度页统计最常见的失分原因并给出建议',
    '以上都在「试验性功能」里，默认关闭，按需打开'] },
  { v: '2.0.10', d: '2026-11-25', t: '答案文本全面校对', items: [
    '对照答案汇编原文的分行，找回 145 处被并成一段的换行（如「按照来源不同…」和「按照化学结构…」现在分成两段，「醌类」后面不再直接接下一段），共涉及 49 道题',
    '小标题统一加粗：「（1）热处理法」「（2）热和酸引起的变化」这类单独成行或以短句开头的编号小标题，与同一题里其他小标题保持一致',
    '标点统一：中文之间的半角逗号、分号、冒号改为全角，(1) 这类半角编号统一为（1），补上漏掉的句号和小标题后的冒号',
    '修正错字：酮类类 → 酮类衍生物、醌类类 → 醌类衍生物、叶绿色色变 → 叶绿素色变，以及几处重复的字',
    '共校对 839 道题，修改了其中 171 道；化学式、数字范围和填空题的空格不受影响'] },
  { v: '2.0.9', d: '2026-11-25', t: '背诵：整词挖空与全部收起', items: [
    '背诵模式的「首字提示」改名为「挖空填词」：关键词整个挖掉（如「坚牢度较差」挖成「＿＿＿较差」），不再留第一个字，横线长度和词的字数一样',
    '「全部揭开」之后按钮变成「全部收起」，可以把揭开的内容全部重新盖上，再背一遍'] },
  { v: '2.0.8', d: '2026-11-25', t: '背诵模式的首字提示更合理', items: [
    '「首字提示」改为按词挖空：只挖关键词（术语、名词、动词），每个词留第一个字作提示；序号（1）、数字、pH 这类字母和「且、受、较、等」这类虚词照常显示，句子读起来是通的',
    '题干里已经出现的词（比如题目问淀粉糊化，就不挖「淀粉」「糊化」）不挖；同一个词在一道题里只挖第一次',
    '分词改用题库自带的词表，iPad、iPhone、安卓和电脑上挖的空完全一样',
    '修复序号「（1）」被拆开、提示停在半个词上（如「且大」「一般」）的问题'] },
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
  const c = CHANGELOG[0], close = go => { updDlg(null); S.settings.seenVer = APP_VERSION; save(); if (go) openSettings('log'); };
  updDlg({ kick: `已更新到 v${c.v} · ${c.d}`, title: c.t, notes: c.items, actions: [['log', '全部更新日志'], ['ok', '开始复习', 'pri']], on: { ok: () => close(), log: () => close(true), x: () => close() } });
}
/* ---------- 统一的更新弹窗：安卓、主屏幕 App、网页都用这个居中的大浮窗 ---------- */
function updDlg(o) {
  let d = document.getElementById('updDlg');
  if (!o) { if (d) d.remove(); UPD.on = null; return; }
  if (!d) {
    d = document.createElement('div'); d.id = 'updDlg'; d.className = 'upd-ov'; d.innerHTML = '<div class="upd-win" role="dialog" aria-modal="true" aria-labelledby="updT"></div>'; document.body.append(d);
    d.addEventListener('click', e => { const b = e.target.closest('[data-u]'); if (b) return updAct(b.dataset.u); if (e.target === d && !UPD.busy) updAct('x'); });
  }
  UPD.on = o.on || null;
  d.querySelector('.upd-win').innerHTML = `<div class="upd-hero">${MARK}<div><div class="upd-k">${esc(o.kick || '')}</div><h3 id="updT">${esc(o.title)}</h3></div></div>
    ${o.notes && o.notes.length ? `<ul class="chg">${o.notes.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}${o.text ? `<p class="upd-tx">${esc(o.text)}</p>` : ''}
    ${o.status ? `<p class="upd-st">${o.spin ? '<span class="upd-spin" aria-hidden="true"></span>' : ''}${esc(o.status)}</p>` : ''}
    ${o.actions && o.actions.length ? `<div class="upd-act">${o.actions.map(([k, l, c]) => `<button class="btn ${c || ''}" data-u="${k}">${esc(l)}</button>`).join('')}</div>` : ''}`;
}
document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.getElementById('updDlg') && !UPD.busy) updAct('x'); });
function updAct(a) {
  if (UPD.on && UPD.on[a]) return UPD.on[a]();
  if (a === 'x' || a === 'later') { if (a === 'later' && UPD.offer) UPD.skip = UPD.offer; return updDlg(null); }
  if (a === 'go' && UPD.info) return window.AndroidApp.download(UPD.info.url, UPD.info.name || '');
  if (a === 'web' && UPD.info) return window.AndroidApp.openUrl(UPD.info.page || UPD.info.url);
  if (a === 'pwa') return pwaApply();
  if (a === 'reload') return location.reload();
}
/* ---------- 安卓 App：联网时检查 GitHub 上的新版本，可在 App 里直接下载安装 ---------- */
const UPD = { info: null, offer: null, skip: null, busy: false, ready: false, manual: false, last: 0, on: null, pwa: !!(window.__PWA && 'serviceWorker' in navigator && !window.AndroidApp) };
const IS_APK = !!(window.AndroidApp && window.AndroidApp.checkUpdate);
const HAS_UPD = IS_APK || UPD.pwa;
const vNewer = (a, b) => { const x = String(a).split('.').map(Number), y = String(b).split('.').map(Number); for (let i = 0; i < Math.max(x.length, y.length); i++) { const d = (x[i] || 0) - (y[i] || 0); if (d) return d > 0; } return false; };
function updStatus(t) { const e = document.getElementById('ust'); if (e) e.textContent = t; }
/* 手动检查：设置里的「检查更新」和 ⓘ 菜单都走这里 */
function appCheck(manual) {
  UPD.manual = !!manual; UPD.last = Date.now(); if (manual) updStatus('正在检查……');
  if (IS_APK) { try { window.AndroidApp.checkUpdate(!!manual); } catch (e) { } } else if (UPD.pwa) pwaCheck(manual);
}
const updLatest = cur => { updStatus(`已经是最新版本（v${cur}）`); if (UPD.manual) updDlg({ kick: '检查更新', title: '已经是最新版本', text: `当前 v${cur}`, actions: [['x', '好', 'pri']] }); UPD.manual = false; };
const updError = () => { updStatus('检查失败：请确认已联网，稍后再试'); if (UPD.manual) updDlg({ kick: '检查更新', title: '暂时无法检查更新', text: '请确认已联网，稍后再试。', actions: [['x', '好', 'pri']] }); UPD.manual = false; };
window.onAppUpdate = raw => {
  let o; try { o = JSON.parse(raw); } catch (e) { return; }
  if (o.url) UPD.info = o;
  const lv = o.latest ? String(o.latest).replace(/^\D*/, '') : '', cur = String(o.current || APP_VERSION).replace(/^\D*/, '');
  const notes = o.notes ? String(o.notes).split(/[；;\n]+/).map(x => x.trim()).filter(Boolean) : [];
  const offer = st => updDlg({ kick: '发现新版本', title: `复习站 v${lv} 可以更新了`, notes, text: `当前 v${cur} · 直接覆盖安装，学习进度不会丢失`, status: st, actions: [['later', '稍后'], ['go', '下载并安装', 'pri']] });
  switch (o.status) {
    case 'available': updStatus(`发现新版本 v${lv}（当前 v${cur}）`); UPD.offer = lv; if (o.manual || UPD.manual || UPD.skip !== lv) offer(); UPD.manual = false; break;
    case 'latest': updLatest(cur); break;
    case 'error': updError(); break;
    case 'downloading': updStatus('正在下载新版本……'); updDlg({ kick: '正在更新', title: `下载复习站 v${lv || UPD.offer || ''}`, status: '正在下载新版本，通知栏可以看进度，下载完会自动打开安装界面', spin: true, actions: [['x', '在后台继续']] }); break;
    case 'downloaded': updStatus('下载完成'); updDlg({ kick: '正在更新', title: '下载完成', text: '正在打开安装界面；没有弹出来的话，可以改用浏览器下载。', actions: [['web', '用浏览器下载'], ['x', '关闭', 'pri']] }); break;
    case 'permission': updDlg({ kick: '需要一个权限', title: '请允许「安装未知应用」', text: '在刚打开的设置里打开开关，返回后会自动继续安装。', actions: [['x', '好', 'pri']] }); break;
    case 'failed': updStatus('下载或安装没有成功'); updDlg({ kick: '更新没有成功', title: '可以改用浏览器下载', text: '用浏览器下载新版本安装包，再手动安装，学习进度不会丢失。', actions: [['x', '关闭'], ['web', '用浏览器下载', 'pri']] }); break;
  }
};
/* 主屏幕 App（iPad / iPhone）和网页版：读取 version.json 判断有没有新版本，再让离线缓存下载新文件 */
async function pwaCheck(manual) {
  try {
    const r = await fetch('version.json?t=' + Date.now(), { cache: 'no-store' }); if (!r.ok) throw new Error(r.status);
    const v = await r.json(); UPD.info = v;
    if (v.v && vNewer(v.v, APP_VERSION)) {
      updStatus(`发现新版本 v${v.v}（当前 v${APP_VERSION}）`); UPD.offer = v.v;
      navigator.serviceWorker.getRegistration().then(g => g && g.update()).catch(() => { });   /* 先在后台下载 */
      if (manual || UPD.skip !== v.v) pwaOffer();
      UPD.manual = false;
    } else updLatest(APP_VERSION);
  } catch (e) { updError(); }
}
function pwaOffer(st) {
  const v = UPD.info || {};
  updDlg({ kick: UPD.ready ? '新版本已下载好' : '发现新版本', title: v.v ? `复习站 v${v.v}${v.t ? '：' + v.t.replace(/^复习站\s*[\d.]+[：:]\s*/, '') : ''}` : '复习站有新版本', notes: v.items || [], text: `当前 v${APP_VERSION} · 更新只要几秒，学习进度不会丢失`, status: st, spin: !!st, actions: st ? [] : [['later', '稍后'], [UPD.ready ? 'reload' : 'pwa', UPD.ready ? '立即刷新' : '立即更新', 'pri']] });
}
async function pwaApply() {
  if (UPD.ready) return location.reload();
  UPD.busy = true; pwaOffer('正在下载新版本……');
  let done = false; const go = () => { if (!done) { done = true; location.reload(); } };
  navigator.serviceWorker.addEventListener('controllerchange', go);
  try { const g = await navigator.serviceWorker.getRegistration(); if (g) await g.update(); if (UPD.ready) go(); } catch (e) { }
  setTimeout(go, 15000);
}
if (UPD.pwa) {
  const had = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (!had) return; UPD.ready = true; if (!UPD.busy && UPD.skip !== UPD.offer) { if (UPD.info && UPD.info.v) pwaOffer(); else fetch('version.json?t=' + Date.now(), { cache: 'no-store' }).then(r => r.json()).then(v => { UPD.info = v; UPD.offer = v.v; pwaOffer(); }).catch(() => pwaOffer()); } });
}
/* 打开时检查一次；从后台切回来时（超过 10 分钟没检查过）再检查一次 */
if (HAS_UPD) {
  setTimeout(() => appCheck(false), 3000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && Date.now() - UPD.last > 10 * 60 * 1000 && !UPD.busy) appCheck(false); });
}
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
function openQ(id, opt) { const q = BY[id]; if (q) openModal(qcard(q), `${q.y || '原创情境'} · ${TLABEL[q.t]}`, opt); }

/* ---------- 导航 ---------- */
const PAGES_BASE = [['today', '今日', '今'], ['map', '知识结构', '图'], ['learn', '知识点', '知'], ['path', '复习路径', '路'], ['practice', '专项练习', '练'], ['daily', '每日自测', '测'], ['wrong', '错题本', '错'], ['mock', '模拟卷', '卷'], ['search', '检索', '搜'], ['stats', '进度', '度']];
/* 试验性功能打开后，对应的页面插到「试验性功能」前面 */
let PAGES = PAGES_BASE.slice();
function syncPages() { const ex = []; if (S.settings.labFlash) ex.push(['flash', '名解闪卡', '闪']); if (S.settings.labCompare) ex.push(['compare', '易混对比', '比']); if (S.settings.labFrame) ex.push(['frame', '答题框架', '框']); const base = PAGES_BASE.filter(x => !(featOn('labSearch') && x[0] === 'search')), at = base.findIndex(x => x[0] === 'daily') + 1; PAGES = base.slice(0, at).concat(ex, base.slice(at)); }
const NAV = { learnMod: 1, learnOpen: null, pathC: null, pathStep: 1, pf: { t: '全部', m: 0, lv: 'all', y1: 2004, y2: 2026, order: 'new', c: '', ids: null, i: 0, showList: true }, mock: null, mapMod: null, q: '' };
function navHTML() {
  syncPages();
  let cur = location.hash.slice(1) || 'today'; 
  $('#sidenav').innerHTML = `<div class="brand">${MARK}<div class="bt">食品化学复习站</div></div><div class="sep"></div><div class="side-list"><div class="sl-in"><div class="toc" aria-hidden="true">目　录</div>` +
    PAGES.map(([id, n], i) => `<a href="#${id}" ${cur === id ? 'aria-current="page"' : ''}${id === 'labs' ? ' class="has-beta"' : ''}>${icon(id)}<span class="nm">${n}${id === 'labs' ? '<sup class="beta">beta</sup>' : ''}</span><span class="ld" aria-hidden="true"></span><span class="pn" aria-hidden="true">${i + 1}</span></a>`).join('') + `</div></div><div class="foot"><svg class="deco" viewBox="0 0 190 70" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M30 10l20 11.5v23L30 56 10 44.5v-23z"/><path d="M50 21.5l20-11.5 20 11.5v23L70 56 50 44.5"/><path d="M90 44.5l20 11.5M110 56l20-11.5v-23L110 10 90 21.5M130 21.5l20-11.5M150 10l20 11.5"/><circle cx="174" cy="24" r="3"/></svg>${window.AndroidApp || window.__PWA || document.documentElement.classList.contains('ios-app') ? '' : `<a href="#settings" class="dl-link" data-jump="download">${icon('dl')}下载 App</a>`}${meBtnHTML()}</div>`;
  const curName = (PAGES.find(x => x[0] === cur) || [0, ''])[1];
  $('#topnav').innerHTML = `<div class="bar1"><button type="button" class="tn-ic tn-menu" id="tnMenu" aria-label="打开侧栏" aria-controls="sidenav">${SV('<path d="M4 7h16M4 12h16M4 17h16"/>')}</button>${MARK}<b class="tn-brand">食品化学复习站</b><b class="tn-title" aria-hidden="true">${esc(curName)}</b><span class="sp"></span><button type="button" class="tn-ic tn-search" id="tnSearch" aria-label="搜索">${icon('search')}</button><button type="button" class="me-mini" data-me aria-label="账号">${avatarHTML()}</button></div><nav aria-label="主导航">${PAGES.map(([id, n]) => `<a href="#${id}" ${cur === id ? 'aria-current="page"' : ''}>${icon(id)}${n}${id === 'labs' ? '<sup class="beta">beta</sup>' : ''}</a>`).join('')}</nav>`;
  const a = $('#topnav nav a[aria-current]'); if (a) a.scrollIntoView({ block: 'nearest', inline: 'center' });
  /* 底部导航栏（Material 3 和液态玻璃风格在窄屏上使用）：四个常用页面 + 「更多」 */
  const bn = document.getElementById('bnav');
  if (bn) { const main4 = ['today', 'daily', 'path', 'wrong'], inMain = main4.includes(cur);
    bn.innerHTML = main4.map(id => { const pg = PAGES.find(x => x[0] === id); return `<a href="#${id}" draggable="false" ${cur === id ? 'aria-current="page"' : ''}><span class="bi">${icon(id)}</span><span class="bl">${id === 'daily' ? '自测' : id === 'path' ? '路径' : pg[1]}</span></a>`; }).join('')
      + (S.settings.skin === 'glass' ? '' : `<button type="button" id="bmore" ${inMain ? '' : 'aria-current="page"'}><span class="bi">${SV('<circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/>')}</span><span class="bl">${inMain ? '更多' : esc((PAGES.find(x => x[0] === cur) || [0, '更多'])[1].replace('试验性功能', '试验'))}</span></button>`);
    const bm = $('#bmore'); if (bm) bm.onclick = openMoreSheet; }
  $('#tnMenu').onclick = () => drawer(true);
  $('#tnSearch').onclick = () => featOn('labSearch') ? gsOpen() : go('search');
  gsMount(); const pk = PAGES.map(x => x[0]).join(); if (pk !== navHTML.pk) { navHTML.pk = pk; requestAnimationFrame(fitSide); }
}
/* 手机上的液态玻璃风格：顶栏左边的「三条杠」拉出和 iPad 一样的侧栏 */
function drawer(open) {
  const h = document.documentElement; if (open === h.classList.contains('drawer')) return;
  let sc = document.getElementById('drScrim');
  if (!sc) { sc = document.createElement('div'); sc.id = 'drScrim'; sc.className = 'dr-scrim'; sc.onclick = () => drawer(false); document.body.append(sc); }
  h.classList.toggle('drawer', open);
  const sn = document.getElementById('sidenav'); if (sn) { sn.setAttribute('aria-modal', open ? 'true' : 'false'); if (open) { fitSide(); const a = sn.querySelector('a[aria-current]') || sn.querySelector('a'); a && a.focus({ preventScroll: true }); } }
}
document.addEventListener('click', e => { if (document.documentElement.classList.contains('drawer') && e.target.closest('#sidenav a, #sidenav [data-me]')) drawer(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.documentElement.classList.contains('drawer')) drawer(false); });
addEventListener('resize', () => { if (innerWidth > 860) drawer(false); });
/* 「更多」：从底部弹出的全部页面列表 */
function openMoreSheet() {
  const m = $('#modal'), cur = location.hash.slice(1) || 'today';
  m.innerHTML = `<div class="modal sheet-wrap" role="dialog" aria-modal="true" aria-label="全部页面"><div class="sheet"><div class="grab" aria-hidden="true"></div><div class="sh-t">全部页面</div><div class="sh-grid">${PAGES.map(([id, n]) => `<a href="#${id}" ${cur === id ? 'aria-current="page"' : ''}><span class="bi">${icon(id)}</span><span>${n}${id === 'labs' ? '<sup class="beta">beta</sup>' : ''}</span></a>`).join('')}<a href="#settings"><span class="bi">${icon('settings')}</span><span>设置</span></a></div></div></div>`;
  const close = () => { m.innerHTML = ''; };
  $('.sheet-wrap', m).addEventListener('click', e => { if (e.target.classList.contains('sheet-wrap') || e.target.closest('a')) close(); });
  document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', k); } });
}
/* iPhone / iPad：切换页面时替换当前历史记录，不新增。各页面像原生 App 的标签页一样并列，
   系统的边缘右滑返回就不会退到旧页面的截图（之前会看到侧栏还开着的旧画面） */
const NAV_REPLACE = PLATFORM === 'apple';
const goHash = h => { if (NAV_REPLACE) location.replace('#' + h); else location.hash = h; };
function go(page) { if (location.hash.slice(1) === page) render(); else goHash(page); }
/* 侧栏「下载 App」：跳到设置页的下载区 */
document.addEventListener('click', e => { const a = e.target.closest('[data-jump]'); if (!a) return; pSettings.jump = a.dataset.jump;
  if (location.hash === '#settings') { e.preventDefault(); const t = document.getElementById(pSettings.jump); pSettings.jump = null; if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); } });
function render() {
  const SROUTE = ['settings', 'labs', 'handbook', 'weekly'], sh = location.hash.slice(1);
  if (SROUTE.includes(sh)) {   /* 设置是浮窗：打开窗口（或直接打开其中的二级页面），背后留在原来的页面 */
    const back = render.last && !SROUTE.includes(render.last) ? render.last : 'today';
    history.replaceState(null, '', '#' + back);
    const j = pSettings.jump; pSettings.jump = null;
    openSettings(sh !== 'settings' ? sh : j === 'download' ? 'download' : null);
    if (render.last) { navHTML(); return; }
  }
  navHTML();
  const p = location.hash.slice(1) || 'today';
  applyLook();
  const f = { today: pToday, map: pMap, learn: pLearn, path: pPath, practice: pPractice, daily: pDaily, wrong: pWrong, mock: pMock, search: pSearch, stats: pStats, settings: pSettings, flash: pFlash, compare: pCompare, frame: pFrame, changelog: pChangelog }[p] || pToday;
  const m = document.createElement('div'); const pi = PAGES.findIndex(x => x[0] === p);
  m.dataset.pg = pi >= 0 ? pi + 1 : 1;
  const main = $('#main'), old = main.firstElementChild, changed = render.last && p !== render.last;
  if (changed) { const fwd = pi > render.lastIdx; m.className = (fwd ? 'turn ' : '') + 'pg-in ' + (fwd ? 'fwd' : 'back'); pageFlip(main, old, fwd); }
  render.last = p; render.lastIdx = pi;
  main.replaceChildren(m); f(m);
  /* 设置窗口开着时，改动后同步刷新窗口里的内容（正在输入时不刷新，免得打断） */
  if (typeof syncBadge === 'function') syncBadge();
  if (SET.open) { const a = document.activeElement; if (!(a && a.closest && a.closest('.set-ov') && /INPUT|TEXTAREA|SELECT/.test(a.tagName))) setFill(); }
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
  m.innerHTML = `<section class="hero">${MOL}<div><div class="kick">${today}${S.settings.goal ? ' · 目标：' + esc(S.settings.goal) : ''}</div><h1 class="${S.settings.name ? 'hi' : ''}">${S.settings.name ? `<span class="hi-1"><span class="hi-g">${greet()}</span><span class="hi-nm">${esc(S.settings.name)}</span></span><span class="hi-2">欢迎回来</span>` : '今天的复习'}</h1><p class="lead">${cd} ${S.settings.motto ? esc(S.settings.motto) : '按"复习路径 → 每日自测 → 错题回顾 → 知识点图解"的顺序，每天 1–2 小时，稳扎稳打。'}</p></div>
  <div class="ring" title="真题掌握进度"><svg viewBox="0 0 112 112"><circle cx="56" cy="56" r="${R}" fill="none" stroke="var(--line)" stroke-width="9"/><circle cx="56" cy="56" r="${R}" fill="none" stroke="var(--accent)" stroke-width="9" stroke-linecap="${pct ? 'round' : 'butt'}" stroke-dasharray="${(CC * pct).toFixed(1)} ${CC.toFixed(1)}"/></svg><div class="rv"><b>${Math.round(pct * 100)}%</b><span>真题已掌握</span><span>${mast}/${realQ.length}</span></div></div></section>
  <div class="grid g4">
    <div class="card tile">${icon('today', 'ti')}<b>${due}</b><span>到期复习题</span></div>
    <div class="card tile">${icon('daily', 'ti')}<b>${dDone}/${dTot}</b><span>今日自测</span></div>
    <div class="card tile">${icon('wrong', 'ti')}<b>${wrong}</b><span>错题本</span></div>
    <div class="card tile">${icon('stats', 'ti')}<b><span data-today-min>${Math.floor(L.min + pend)}</span><small style="font-size:13px"> 分钟</small></b><span>今天已学（本周 ${Math.round(week)} 分钟）</span></div>
  </div>
  ${featOn('labNight') ? nightHTML() : ''}
  ${featOn('labSprint') ? sprintHTML() : ''}
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
  if (HAS_REM) try { window.AndroidApp.setReminderText((featOn('labNight') && nightIds().length ? `睡前回顾：今天有 ${nightIds().length} 道题没掌握 · ` : '') + PL.done ? `今天的复习路径已完成，还有 ${due} 题到期复习` : `今天的复习路径：「${rc.n}」（已完成 ${pStep}/3 步）· ${due} 题到期复习`); } catch (e) { }
  const mp = $('#morePath'); if (mp) mp.onclick = () => { S.planPath = { c: recommendCluster(S.planPath.c), t: Date.now() }; save(); render(); };
  $('#dur').onclick = e => { const b = e.target.closest('[data-d]'); if (b) { S.settings.dur = +b.dataset.d; save(); render(); } };
  $('#tbtn').onclick = () => { flushTime(); S.settings.autoTime = S.settings.autoTime === false; save(); render(); };
  m.addEventListener('click', e => {
    const b = e.target.closest('[data-go]'); if (b) {
      const g = b.dataset.go;
      if (g === 'path') { NAV.pathC = b.dataset.c; NAV.pathStep = +(b.dataset.step || 1); go('path'); }
      else if (g === 'due') { const ids = BANK.filter(q => isDue(q.id)).map(q => q.id); const w = BANK.filter(q => qs(q.id).w && !ids.includes(q.id)).map(q => q.id); startPractice(ids.concat(w), '到期复习 + 错题'); }
      else if (g === 'night') startPractice(nightIds(), '睡前回顾');
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
  return `<div class="li" data-cl="${id}" style="cursor:pointer"><div class="stripe ${hotSet.has(id) ? 'hot' : ''}"></div><div class="main"><div class="t">${esc(c.n)}</div><div class="s"><span>${esc(MODN[c.m])}</span><span>出现 ${s.n} 年 · 最近 ${s.last || '—'}</span>${heatHTML(id)}${trendTags(id)}<span>路径 ${st}/3</span><span>掌握 ${mm.m3}/${mm.tot}</span></div></div></div>`;
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
  if (f.showList) {   /* 题目列表分批画：先画当前题附近的一批，滚到底再接着画，换题时不用重画几百行 */
    const row = (q, i) => `<div class="li" data-i="${i}" style="cursor:pointer;padding:6px 10px"><div class="stripe l${qs(q.id).l}"></div><div class="main"><div class="t" style="font-size:14px">${esc(q.q.split('\n')[0].slice(0, 70))}</div><div class="s">${q.y || '原创'} · ${TLABEL[q.t]}</div></div></div>`;
    let shown = Math.min(list.length, Math.max(50, f.i + 25));
    $('#pl2').innerHTML = `<div class="list" style="margin-bottom:12px;max-height:340px;overflow:auto">${list.slice(0, shown).map(row).join('')}</div>`;
    const box = $('#pl2 .list'); box.addEventListener('scroll', () => { if (shown < list.length && box.scrollTop + box.clientHeight > box.scrollHeight - 240) { box.insertAdjacentHTML('beforeend', list.slice(shown, shown + 60).map((q, j) => row(q, shown + j)).join('')); shown = Math.min(list.length, shown + 60); } }, { passive: true });
    $('#pl2').onclick = e => { const r = e.target.closest('[data-i]'); if (r) { f.i = +r.dataset.i; f.showList = false; render(); } }; }
  if (!list.length) { $('#card').innerHTML = '<p class="empty">这个筛选下没有题目，换个条件试试。</p>'; return; }
  const q = list[f.i];
  const nav = `<button class="btn sm" data-n="-1" ${f.i ? '' : 'disabled'}>上一题</button><button class="btn sm pri" data-n="1" ${f.i < list.length - 1 ? '' : 'disabled'}>下一题</button>`;
  const card = qcard(q, { nav });
  card.addEventListener('click', e => { const b = e.target.closest('[data-n]'); if (b) { f.i = Math.max(0, Math.min(list.length - 1, f.i + +b.dataset.n)); toTop(); render(); } });
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
  <div class="list" id="wl">${list.map(q => { const s = qs(q.id); return `<div class="li" data-q="${q.id}"><div class="stripe l${s.l}"></div><div class="main"><div class="t">${esc(q.q.split('\n')[0].slice(0, 90))}</div><div class="s"><span>${q.y || '原创'} · ${TLABEL[q.t]}</span><span>${esc((CL[q.c] || {}).n || '')}</span><span class="lv l${s.l}"><i></i>${LVL[s.l]}</span>${S.settings.labCause && s.why && s.l < 3 ? `<span class="chip why">${WHYN[s.why] || ''}</span>` : ''}<span>练过 ${s.n || 0} 次</span>${s.note ? `<span>笔记：${esc(s.note.slice(0, 30))}${s.note.length > 30 ? '…' : ''}</span>` : ''}</div></div><div class="row"><button class="btn sm" data-a="open">展开</button><button class="btn sm ghost" data-a="rm">移出</button></div></div>`; }).join('') || ('<p class="empty">' + icon('wrong', 'empty-ill') + '错题本是空的。做题时自评"不会"或"模糊"，题目会自动收进来。</p>')}</div>`;
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
  ${M.sub && S.settings.labMockDiag ? '<h2>诊断报告</h2><div class="card mdiag" id="mdiag"></div>' : ''}
  ${groups.map((g, gi) => `<h2>${CN[gi]}、${TLABEL[g.k]}${/[释析]$/.test(TLABEL[g.k]) ? '' : '题'}（${g.ids.length} 题，每题 ${PTS[BY[g.ids[0]].t]} 分，共 ${g.ids.length * PTS[BY[g.ids[0]].t]} 分）</h2><div class="list">${g.ids.map((id, i) => { const q = BY[id]; const full = PTS[q.t]; return `<div class="card q" data-id="${id}"><div class="qtext">${i + 1}. ${esc(q.q)}</div>${mockKey(q) ? mockOpts(q, M) : `${q.opts ? `<div class="note">${q.opts.map(([a, t]) => esc(a + '. ' + t)).join('　')}</div>` : ''}<textarea aria-label="作答" ${M.sub ? 'readonly' : ''}>${esc((M.ans || {})[id] || '')}</textarea>`}${M.sub ? `<div class="ans"><div class="h">参考答案</div>${q.a || ''}</div><div class="row"><span class="note">本题得分</span><input type="number" min="0" max="${full}" step="${full > 3 ? 1 : 0.5}" value="${M.sc[id] != null ? M.sc[id] : ''}" data-sc="${id}" aria-label="得分" style="width:80px"><span class="note">/ ${full}</span><button class="btn sm" data-full="${id}">满分</button><button class="btn sm" data-zero="${id}">0 分</button>${S.settings.labPoints && answerPoints(q).length > 1 ? `<button class="btn sm" data-mpt="${id}">按要点给分</button>` : ''}</div><div class="ptc" data-mpc="${id}" hidden><div class="ph"><b>按要点给分</b><span class="note">勾上你答出来的要点，分数按比例自动填好</span></div><div class="pchips">${answerPoints(q).map((p, j) => `<button class="pchip" data-mpi="${j}" aria-pressed="false"><span class="rn">${j + 1}</span>${esc(p.label || p.hint)}</button>`).join('')}</div></div>` : ''}</div>`; }).join('')}</div>`).join('')}`;
  const tick = () => { const t = $('#mt'); if (!t) return clearInterval(M.tk); const used = Math.floor(((M.end || Date.now()) - M.start) / 60000); t.textContent = M.sub ? `用时 ${used} 分钟` : `剩余 ${Math.max(0, 180 - used)} 分钟`; };
  clearInterval(M.tk); M.tk = setInterval(tick, 20000); tick();
  m.addEventListener('input', e => { if (e.target.tagName === 'TEXTAREA' && !M.sub) { const id = e.target.closest('[data-id]').dataset.id; M.ans = M.ans || {}; M.ans[id] = e.target.value; } });
  const upd = () => { const sc = Object.values(M.sc).reduce((s, v) => s + (+v || 0), 0); const b = $('#msc'); if (b) b.textContent = `得分 ${sc} / ${total}（已评 ${Object.keys(M.sc).length}/${M.ids.length}）`; const dg = $('#mdiag', m); if (dg) { clearTimeout(dg._t); /* 稍等再重画：打分框失去焦点时会触发 change，立刻重画会吞掉正在点的按钮 */ dg._t = setTimeout(() => { const h = mockDiagHTML(M); if (dg._h !== h) { dg._h = h; dg.innerHTML = h; } }, dg._h ? 400 : 0); } return sc; };
  const dgEl = $('#mdiag', m); if (dgEl) dgEl.addEventListener('click', e => {
    const c = e.target.closest('[data-cl]'); if (c) { NAV.pathC = c.dataset.cl; NAV.pathStep = 1; go('path'); return; }
    const r = e.target.closest('[data-mr]'); if (r) { startPractice(r.dataset.mr.split(','), '模拟卷低分题重练'); return; }
    const w = e.target.closest('[data-mw]'); if (w) { w.dataset.mw.split(',').forEach(id => { const st = Object.assign({ l: 0, n: 0, c: 0, w: 0 }, S.q[id]); st.w = 1; st.t = Date.now(); S.q[id] = st; }); save(); w.outerHTML = '<span class="note">✓ 已加入错题本</span>'; } });
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
  <h2>各题型掌握情况</h2><div class="card grid" style="gap:8px">${['名解', '简答', '论述', '分析', '选择', '填空', '判断'].map(t => barRow(TLABEL[t], all.filter(q => q.t === t))).join('')}</div>
  ${S.settings.labCause ? `<h2>失分原因</h2><div class="card">${whyStats()}</div>` : ''}`;
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
/* ========== 试验性功能（2.1）：关键词自动评分、限时作答、易混对比卡、名解闪卡、冲刺计划、错因标签 ========== */

/* ---------- 关键词：从一段答案里取出关键词（和背诵挖空用同一套分词与词表） ---------- */
function keyTerms(text, topic) {
  const out = [], seen = new Set(); topic = topic || '';
  const isKey = x => x.isWordLike && /[一-鿿]/.test(x.segment) && !FC_STOP.has(x.segment) && ![...x.segment].every(c => FC_STOP.has(c));
  let buf = '', run = false;
  const flush = () => { if (buf) { if ([...buf].length > 1 && !seen.has(buf) && !topic.includes(buf)) { seen.add(buf); out.push(buf); } buf = ''; } };
  for (const x of FC_SEG.segment(text)) {
    if (isKey(x)) {
      const n = [...x.segment].length, bn = [...buf].length;
      if (n === 1) {
        if (buf && !run && FC_SUF.has(x.segment) && bn + 1 <= 5) buf += x.segment;
        else if (buf && run && bn < 4) buf += x.segment;
        else { flush(); buf = x.segment; run = true; }
      } else { flush(); buf = x.segment; run = false; }
    } else flush();
  }
  flush();
  return out;
}
/* 写到了吗：完全一样算写到；三个字以上的词，写出其中连续的大部分（约三分之二）也算 */
function termHit(term, typed) {
  if (typed.includes(term)) return true;
  const c = [...term], n = c.length; if (n < 3) return false;
  const k = Math.ceil(n * 2 / 3);
  for (let i = 0; i + k <= n; i++) if (typed.includes(c.slice(i, i + k).join(''))) return true;
  return false;
}
function autoScore(q, typed, PTS) {
  const clean = String(typed || '').replace(/[\s，。、；：,.;:！？!?（）()“”"'【】\[\]]/g, '');
  const pts = (PTS && PTS.length ? PTS : [{ label: '', text: txt(q.a || '') }]).map((p, i) => {
    const terms = keyTerms(p.label ? (p.label + '：' + (p.body || '')) : (p.text || ''), q.q).slice(0, 14);
    const hit = terms.filter(t => termHit(t, clean));
    return { i, label: p.label || p.hint || '', terms, hit, miss: terms.filter(t => !hit.includes(t)) };
  }).filter(p => p.terms.length);
  const tot = pts.reduce((a, p) => a + p.terms.length, 0), got = pts.reduce((a, p) => a + p.hit.length, 0);
  const r = tot ? got / tot : 0;
  return { pts, tot, got, r, cov: pts.filter(p => p.hit.length / p.terms.length >= 0.5).length, l: r >= 0.7 ? 3 : r >= 0.35 ? 2 : 1 };
}
function scoreHTML(sc) {
  if (!sc.tot) return '<div class="ph"><b>关键词自动评分</b><span class="note">这道题的答案里没找到可以对照的关键词</span></div>';
  const pc = Math.round(sc.r * 100);
  return `<div class="ph"><b>关键词自动评分</b><span class="note">对照参考答案里的关键词，结果仅供参考</span></div>
    <div class="kbar" role="img" aria-label="关键词覆盖 ${pc}%"><i class="l${sc.l}" style="width:${Math.max(pc, 2)}%"></i></div>
    <div class="row" style="margin:6px 0 4px"><b class="kpc">覆盖 ${pc}%</b><span class="note">写到 ${sc.got}/${sc.tot} 个关键词${sc.pts.length > 1 ? ` · 要点 ${sc.cov}/${sc.pts.length}` : ''}</span><span class="sp"></span><button class="btn sm pri" data-ksok="${sc.l}">按这个打分：${LVL[sc.l]}</button></div>
    <div class="kpts">${sc.pts.map((p, i) => { const ok = p.hit.length / p.terms.length >= 0.5; return `<div class="kpt ${ok ? 'ok' : ''}"><span class="km">${ok ? '✓' : '✗'}</span><div><b>${sc.pts.length > 1 ? (p.label ? esc(p.label) : '要点 ' + (i + 1)) : '关键词'}</b>${p.miss.length ? `<div class="kmiss">没写到：${p.miss.slice(0, 8).map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div>` : '<div class="note">关键词都写到了</div>'}</div></div>`; }).join('')}</div>`;
}

/* ---------- 限时作答：按题型给建议时间，超时只提醒不打断 ---------- */
const TLIM = { 名解: 3, 简答: 8, 论述: 15, 分析: 15 };
const mmss = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/* ---------- 错因标签 ---------- */
const WHY = [['concept', '概念不清'], ['mix', '记混了'], ['miss', '漏要点'], ['read', '审题错'], ['expr', '会但写不出']];
const WHYN = Object.fromEntries(WHY);
function whyHTML(id) { const w = qs(id).why; return `<span class="note">错在哪里？</span>${WHY.map(([k, n]) => `<button class="btn sm" data-why="${k}" aria-pressed="${w === k}">${n}</button>`).join('')}`; }
function whyStats() {
  const c = {}; let n = 0;
  for (const q of BANK) { const s = qs(q.id); if (s.why && s.l && s.l < 3) { c[s.why] = (c[s.why] || 0) + 1; n++; } }
  if (!n) return '<p class="note" style="margin:0">还没有记录。做题时评「不会」或「模糊」后，选一下错在哪里，这里会统计你最常见的失分原因。</p>';
  const max = Math.max(...Object.values(c));
  const top = WHY.filter(([k]) => c[k]).sort((a, b) => c[b[0]] - c[a[0]]);
  const tip = { concept: '回到「知识点」把定义和原理再读一遍，名解闪卡多过几轮', mix: '去「易混对比」把相近的概念放在一起对照着背', miss: '打开「按要点自评」或背诵的「要点提示」，先把要点的框架背下来', read: '做题前先圈出题干里的关键词（如「区别」「机理」「影响因素」），再动笔', expr: '多用「关键词自动评分」练习写完整，背诵时用「挖空填词」' }[top[0][0]];
  return `<div class="grid" style="gap:8px">${top.map(([k, nm]) => `<div class="bar-row"><span class="bl">${nm}</span><span class="bt"><i style="width:${c[k] / max * 100}%"></i></span><b>${c[k]}</b></div>`).join('')}</div>
    <p class="note" style="margin:10px 0 0">共 ${n} 道还没掌握的题标了原因。最多的是「${WHYN[top[0][0]]}」：${tip}。</p>`;
}

/* ---------- 冲刺计划：按考试日期倒推，把没过完的考点分到每一天，最后一周只做错题和模拟卷 ---------- */
function clusterDone(id) { if (pathDone(id)) return true; const mm = clusterMastery(id); return mm.att >= Math.ceil(mm.tot / 2) && mm.avg >= 2.5; }
function sprintHTML() {
  const T = '<h2 class="sp-title">冲刺计划</h2>';
  if (!S.settings.exam) return `${T}<div class="card sprint"><p class="note" style="margin:0 0 10px">先在设置里填好考试日期，冲刺计划会按剩下的天数，把所有考点分配到每一天。</p><button class="btn sm pri" data-go="settings">去设置考试日期</button></div>`;
  const days = Math.ceil((new Date(S.settings.exam + 'T00:00:00') - sod()) / DAY);
  if (days < 0) return '';
  const all = Object.keys(CS).sort((a, b) => CS[b].prio - CS[a].prio), left = all.filter(id => !clusterDone(id)), done = all.length - left.length;
  const pct = Math.round(done / all.length * 100);
  const head = `<div class="sp-h"><span class="note">离考试 <b>${days}</b> 天</span><span class="sp"></span><span class="note">考点过完 <b>${done}</b>/${all.length}</span></div><div class="kbar"><i class="l3" style="width:${Math.max(pct, 2)}%"></i></div>`;
  const chip = id => `<button class="chip cl" data-cl="${id}">${esc(CL[id].n)}</button>`;
  let body = '';
  if (days === 0) body = `<p class="sp-ph">今天考试，加油！</p><p class="note">不再刷新题。早点出门，带好证件和文具，考前翻一下错题本里的笔记就好。</p>`;
  else if (days <= 2) body = `<p class="sp-ph">考前最后两天：只回顾，不做新题</p><ul class="chg"><li>把高频考点的要点过一遍：${all.slice(0, 8).map(chip).join('')}</li><li>${S.settings.labFlash ? '<a href="#flash">名解闪卡</a>' : '名词解释'}快速过一轮，只看「还不会」的</li><li>翻错题本里的笔记，早点睡</li></ul>`;
  else if (days <= 7) {
    const wrong = BANK.filter(q => qs(q.id).w).length, due = BANK.filter(q => isDue(q.id)).length;
    body = `<p class="sp-ph">最后一周：错题清零 + 模拟卷</p><ul class="chg"><li>错题本还有 <b>${wrong}</b> 题，今天到期 <b>${due}</b> 题 <button class="btn sm" data-go="due">去复习</button></li><li>${days % 2 === 1 ? '今天做一套模拟卷，严格按 3 小时计时 <button class="btn sm" data-go="mock">去做模拟卷</button>' : '今天不做整卷，把昨天模拟卷里丢分的题重新写一遍'}</li>${left.length ? `<li>还没过完、最常考的几个考点，挑一两个快速看要点：${left.slice(0, 4).map(chip).join('')}</li>` : ''}</ul>`;
  } else {
    const L = days - 7, per = Math.max(1, Math.ceil(left.length / L));
    if (!left.length) body = `<p class="sp-ph">所有考点都过完了，提前进入复习阶段</p><p class="note">每天做错题和到期复习，隔天一套模拟卷。离考试一周时，冲刺计划会自动切到最后一周的安排。</p>`;
    else {
      const today = left.slice(0, per), next = [];
      for (let d = 1; d <= 4 && per * d < left.length; d++) next.push([d, left.slice(per * d, per * (d + 1))]);
      const dl = d => { const t = new Date(sod() + d * DAY); return `${t.getMonth() + 1}/${t.getDate()}`; };
      body = `<p class="sp-ph">考点学习阶段：还有 ${left.length} 个考点，每天 ${per} 个，${L} 天内过完，最后 7 天留给错题和模拟卷</p>
        <div class="sp-today"><span class="note">今天</span>${today.map(chip).join('')}</div>
        ${next.length ? `<details class="sp-next"><summary>接下来几天</summary>${next.map(([d, ids]) => `<div class="sp-day"><span class="note">${dl(d)}</span>${ids.map(chip).join('')}</div>`).join('')}</details>` : ''}
        <p class="note" style="margin:8px 0 0">点考点进入复习路径，三步做完就算过完。已经掌握的考点会自动跳过，计划每天按你的进度重新分配。</p>`;
    }
  }
  return `${T}<div class="card sprint">${head}${body}</div>`;
}

/* ---------- 易混对比卡 ---------- */
const CMP = [
  { id: 'gel', t: '淀粉糊化 vs 淀粉老化', m: 3, cols: ['糊化', '老化'], rows: [
    ['定义', '淀粉粒在适当温度下在水中吸水溶胀、分裂，形成均匀糊状溶液的过程', '糊化后的淀粉在室温或低温下放置，分子重新排列、相互靠拢，形成致密的高度晶化结构，变得不透明甚至凝结沉淀'],
    ['结构变化', '有序 → 无序：破坏结晶区的氢键，胶束解体', '无序 → 有序：分子间氢键重新形成，部分重新结晶，但不能恢复成生淀粉的结构'],
    ['条件', '加热且有足够的水', '2~4 ℃ 最易老化；含水量 30%~60%；直链淀粉多的易老化'],
    ['对食品的影响', '变软、黏，容易消化', '变硬、口感变差，消化性下降（面包变硬、米饭回生）'],
    ['应用或防止', '方便食品（α-化米饭、方便面）利用糊化', '80 ℃ 以上或 0 ℃ 以下迅速脱水；加入乳化剂、糖、脂类等延缓老化']] },
  { id: 'water', t: '结合水 vs 自由水', m: 2, cols: ['结合水', '自由水'], rows: [
    ['定义', '通过氢键与溶质或其他非水组分结合的水', '没有被非水物质化学结合，靠毛细管力等维系的水（截留水、毛细管水、游离水）'],
    ['冻结', '−40 ℃ 也不结冰', '0 ℃ 左右可以结冰'],
    ['溶剂能力', '不能作为溶剂', '能作为溶剂'],
    ['微生物利用', '不能被微生物利用', '能被微生物利用，引起腐败'],
    ['干燥除去', '很难除去', '容易除去'],
    ['与稳定性', '对水分活度贡献很小', '决定水分活度，与食品稳定性关系密切']] },
  { id: 'aw', t: '水分含量 vs 水分活度', m: 2, cols: ['水分含量', '水分活度 Aw'], rows: [
    ['定义', '食品中水的总量（质量分数）', '食品中水的蒸汽压与同温下纯水蒸汽压之比，Aw = p/p₀ = ERH/100'],
    ['反映什么', '水有多少', '水的存在状态，能被微生物和化学反应利用的程度'],
    ['预测稳定性', '差：含水量相同的食品，稳定性可能相差很大', '好：与微生物生长、化学反应速率关系密切'],
    ['温度影响', '与温度无关', '随温度升高而增大'],
    ['范围', '0~100%', '0~1']] },
  { id: 'brown', t: '酶促褐变 vs 非酶褐变', m: 8, cols: ['酶促褐变', '非酶褐变'], rows: [
    ['本质', '多酚氧化酶催化酚类物质氧化成醌，醌再聚合成黑色素', '不需要酶参与：美拉德反应、焦糖化反应、抗坏血酸氧化褐变'],
    ['必要条件', '酚类底物、酚酶、氧，三者缺一不可', '羰基与氨基化合物共存（美拉德）、糖高温加热（焦糖化）或抗坏血酸氧化'],
    ['常见场合', '果蔬切开、碰伤后的切面（苹果、马铃薯、香蕉）', '加热和贮藏中（面包皮、酱油、焙烤食品、果汁）'],
    ['控制方法', '热烫钝化酶、加酸调低 pH、二氧化硫和亚硫酸盐、驱除或隔绝氧、加抗坏血酸', '降低温度、调低 pH、控制水分活度、选用不易褐变的糖、加亚硫酸盐或钙盐']] },
  { id: 'mail', t: '美拉德反应 vs 焦糖化反应', m: 3, cols: ['美拉德反应', '焦糖化反应'], rows: [
    ['反应物', '羰基化合物（还原糖）+ 氨基化合物（氨基酸、肽、蛋白质）', '只有糖类，不需要氨基化合物'],
    ['温度', '常温下也能发生，加热明显加快', '需要高温直接加热糖（一般 150~200 ℃ 以上）'],
    ['产物', '类黑精（类黑色素）和多种风味物质（如吡嗪类）', '焦糖色素和焦糖香味物质'],
    ['影响', '产生色泽和风味；赖氨酸等必需氨基酸损失；可能生成丙烯酰胺', '产生色泽和焦糖风味，可用于生产焦糖色素'],
    ['影响因素', '糖的种类、pH、水分活度、温度、金属离子', '温度、pH，酸、碱和铵盐等催化剂可以加速']] },
  { id: 'oxid', t: '油脂自动氧化 vs 光敏氧化 vs 酶促氧化', m: 5, cols: ['自动氧化', '光敏氧化', '酶促氧化'], rows: [
    ['参与的氧', '三线态氧（³O₂）', '单线态氧（¹O₂）', '三线态氧，在脂肪氧合酶催化下'],
    ['机理', '自由基链式反应：链引发、链传递、链终止', '光敏剂吸光激发，把 ³O₂ 变成 ¹O₂，¹O₂ 直接与双键加成', '脂肪氧合酶专一作用于含顺,顺-1,4-戊二烯结构的多不饱和脂肪酸'],
    ['诱导期', '有', '没有', '没有明显诱导期'],
    ['速度', '较慢', '很快，约为自动氧化的 1500 倍', '快'],
    ['抑制方法', '加抗氧化剂（自由基清除剂）、避光、隔氧、低温、除金属离子', '单线态氧淬灭剂（β-胡萝卜素、生育酚）、避光', '热烫钝化脂肪氧合酶']] },
  { id: 'rancid', t: '三种油脂酸败', m: 5, cols: ['水解型酸败', '酮型酸败（β-氧化型）', '氧化型酸败'], rows: [
    ['原因', '油脂在水、脂肪酶或高温作用下水解，产生游离脂肪酸', '饱和脂肪酸在微生物酶作用下发生 β-氧化，生成 β-酮酸，再脱羧成甲基酮', '不饱和脂肪酸被氧化成氢过氧化物，再分解成醛、酮、酸等'],
    ['不良气味来源', '低级游离脂肪酸（如丁酸、己酸）', '甲基酮的特殊臭味', '醛、酮等小分子，即「哈喇味」'],
    ['容易发生的油脂', '含低级脂肪酸多的油脂，如乳脂', '受微生物污染、含水和含氮物质多的油脂，如奶油、椰子油', '含不饱和脂肪酸多的油脂，最常见'],
    ['防止', '降低水分、低温、钝化脂肪酶', '防止微生物污染、降低水分', '避光、隔氧、低温、加抗氧化剂、除去金属离子']] },
  { id: 'starch', t: '直链淀粉 vs 支链淀粉', m: 3, cols: ['直链淀粉', '支链淀粉'], rows: [
    ['结构', 'α-1,4-糖苷键连接的线性分子，呈螺旋结构', '主链 α-1,4-糖苷键，分支点 α-1,6-糖苷键，呈树枝状'],
    ['分子大小', '较小', '很大'],
    ['遇碘', '蓝色', '紫红色'],
    ['溶解与糊', '难溶于冷水，糊不稳定，容易凝沉', '容易分散，糊黏度高、稳定'],
    ['老化', '容易老化', '不易老化'],
    ['例子', '普通玉米、豆类淀粉含量较高', '糯米、糯玉米几乎全是支链淀粉']] },
  { id: 'salt', t: '盐溶 vs 盐析', m: 4, cols: ['盐溶', '盐析'], rows: [
    ['条件', '低浓度中性盐', '高浓度中性盐（如硫酸铵）'],
    ['结果', '蛋白质溶解度增大', '蛋白质溶解度降低，从溶液中沉淀析出'],
    ['原因', '盐离子与蛋白质表面电荷作用，减弱蛋白质分子间的静电吸引，增强与水的作用', '盐离子与蛋白质争夺水分子，破坏水化层，蛋白质分子聚集沉淀'],
    ['是否变性', '不变性', '一般不变性，过程可逆，常用于蛋白质分离纯化']] },
  { id: 'denat', t: '蛋白质变性 vs 蛋白质水解', m: 4, cols: ['变性', '水解'], rows: [
    ['本质', '二、三、四级结构改变，一级结构（肽键）不变', '肽键断裂，一级结构被破坏，生成肽和氨基酸'],
    ['引起因素', '热、酸、碱、有机溶剂、重金属盐、辐射、剧烈搅拌等', '酸、碱或蛋白酶'],
    ['结果', '溶解度降低、生物活性丧失、更容易被酶消化', '分子变小、溶解性增加，可能产生苦味肽'],
    ['可逆性', '有的可逆，有的不可逆', '不可逆']] },
  { id: 'antho', t: '花青素 vs 花黄素（类黄酮）', m: 9, cols: ['花青素', '花黄素'], rows: [
    ['基本结构', '2-苯基苯并吡喃阳离子（黄烊盐）', '2-苯基苯并吡喃酮（色原酮）'],
    ['颜色', '红、紫、蓝，随 pH 变化：酸性偏红，中性偏紫，碱性偏蓝', '浅黄至无色，碱性条件下变黄'],
    ['稳定性', '不稳定，受 pH、温度、光、氧、二氧化硫和金属离子影响', '比较稳定，但遇金属离子会络合变色（如遇铁变蓝绿或褐色）'],
    ['常见来源', '葡萄皮、紫甘蓝、草莓、紫薯', '洋葱、柑橘、茶叶（槲皮素、芦丁）']] },
  { id: 'vit', t: '脂溶性维生素 vs 水溶性维生素', m: 6, cols: ['脂溶性', '水溶性'], rows: [
    ['包括', '维生素 A、D、E、K', 'B 族维生素、维生素 C'],
    ['吸收', '随脂类一起吸收，需要胆汁', '直接吸收'],
    ['体内储存', '可以储存在肝脏和脂肪中，过量可能中毒', '一般不储存，多余的随尿排出，需要经常补充'],
    ['加工损失', '主要因光和氧引起的氧化', '容易溶在水里流失，很多对热敏感（如维生素 C、B₁）']] },
  { id: 'index', t: '碘值 vs 酸价 vs 过氧化值', m: 5, cols: ['碘值', '酸价', '过氧化值'], rows: [
    ['定义', '100 g 油脂吸收碘的克数', '中和 1 g 油脂中游离脂肪酸所需氢氧化钾的毫克数', '每千克油脂中所含过氧化物的毫摩尔数（或毫克当量数）'],
    ['反映什么', '油脂的不饱和程度', '游离脂肪酸的多少（水解程度、新鲜度）', '油脂初期氧化的程度'],
    ['数值高说明', '不饱和程度高，更容易氧化', '水解或酸败严重，品质差', '已经发生氧化；氧化后期过氧化物分解，数值反而会下降']] }
];
function pCompare(m) {
  const cl = NAV.cmpCloze;
  m.innerHTML = `<div class="kick">COMPARE · 易混对比</div><h1>易混概念对比</h1><p class="lead">把考试里常被问「区别」的概念放在一张表里对照着背。打开「挖空练习」后，表格内容会盖住，点一格看一格。</p>
  <div class="row" style="margin-bottom:12px"><div class="seg" id="cmz"><button data-z="0" aria-pressed="${!cl}">直接看</button><button data-z="1" aria-pressed="${!!cl}">挖空练习</button></div><span class="sp"></span><select id="cmm" aria-label="模块"><option value="0">全部模块</option>${[...new Set(CMP.map(c => c.m))].sort((a, b) => a - b).map(x => `<option value="${x}" ${NAV.cmpMod === x ? 'selected' : ''}>${esc(MODN[x] || '')}</option>`).join('')}</select></div>
  <div class="cmps">${CMP.filter(c => !NAV.cmpMod || c.m === NAV.cmpMod).map(c => `<div class="card cmp" data-cmp="${c.id}"><div class="row cmp-h"><b>${esc(c.t)}</b><span class="note">${esc(MODN[c.m] || '')}</span><span class="sp"></span>${cl ? '<button class="btn sm ghost" data-call>全部揭开</button>' : ''}</div>
    <div class="tw"><table class="t cmpt"><tr><th></th>${c.cols.map(x => `<th>${esc(x)}</th>`).join('')}</tr>${c.rows.map(([k, ...v]) => `<tr><th>${esc(k)}</th>${v.map(x => cl ? `<td class="cz" tabindex="0" role="button"><span class="czb">点一下看</span><span class="czt" hidden>${esc(x)}</span></td>` : `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</table></div></div>`).join('')}</div>`;
  $('#cmz').onclick = e => { const b = e.target.closest('[data-z]'); if (b) { NAV.cmpCloze = b.dataset.z === '1'; render(); } };
  $('#cmm').onchange = e => { NAV.cmpMod = +e.target.value; render(); };
  const flip = (td, open) => { td.classList.toggle('open', open); $('.czt', td).hidden = !open; $('.czb', td).hidden = open; };
  m.addEventListener('click', e => {
    const td = e.target.closest('.cz'); if (td) { flip(td, !td.classList.contains('open')); return; }
    const b = e.target.closest('[data-call]'); if (b) { const open = b.dataset.open !== '1'; $$('.cz', b.closest('.cmp')).forEach(x => flip(x, open)); b.dataset.open = open ? '1' : '0'; b.textContent = open ? '全部收起' : '全部揭开'; }
  });
  m.addEventListener('keydown', e => { const td = e.target.closest('.cz'); if (td && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); flip(td, !td.classList.contains('open')); } });
}

/* ---------- 名解闪卡：左滑「还不会」，右滑「记住了」 ---------- */
const FL = { deck: null, i: 0, res: [], flt: 'weak', mod: 0 };
function flashDeck() {
  const seen = new Map();
  for (const q of BANK) if (q.t === '名解' && q.a) { const k = q.q.replace(/\s/g, ''); if (!seen.has(k)) seen.set(k, [q]); else seen.get(k).push(q); }
  let list = [...seen.values()];
  if (FL.mod) list = list.filter(g => qmod(g[0]) === FL.mod);
  const lv = g => Math.max(...g.map(q => qs(q.id).l || 0)), due = g => g.some(q => isDue(q.id));
  if (FL.flt === 'weak') list = list.filter(g => lv(g) < 3 || due(g));
  list.sort((a, b) => (lv(a) - lv(b)) || (due(b) - due(a)) || (Math.random() - 0.5));
  return list.slice(0, 20);
}
function pFlash(m) {
  if (!FL.deck) { FL.deck = flashDeck(); FL.i = 0; FL.res = []; }
  const D = FL.deck, g = D[FL.i];
  const ctl = `<div class="row" style="margin-bottom:12px"><div class="seg" id="flf"><button data-f="weak" aria-pressed="${FL.flt === 'weak'}">没掌握的优先</button><button data-f="all" aria-pressed="${FL.flt === 'all'}">全部</button></div><select id="flm" aria-label="模块"><option value="0">全部模块</option>${MODS.map(x => `<option value="${x.id}" ${FL.mod === x.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select><span class="sp"></span><button class="btn sm ghost" id="flnew">换一组</button></div>`;
  const head = `<div class="kick">FLASHCARDS · 名解闪卡</div><h1>名解闪卡</h1><p class="lead">看到名词先在心里说出定义，再点卡片翻面核对。右滑（或点「记住了」）算掌握，左滑算「还不会」，结果会记进你的做题记录。每组 20 张。</p>${ctl}`;
  if (!D.length) { m.innerHTML = head + `<div class="card"><p style="margin:0">这个范围里的名词解释都掌握了 🎉 换成「全部」可以再过一遍。</p></div>`; bindFl(m); return; }
  if (!g) {
    const ok = FL.res.filter(x => x === 3).length, mid = FL.res.filter(x => x === 2).length, bad = FL.res.filter(x => x === 1).length;
    m.innerHTML = head + `<div class="card fl-end"><b>这一组过完了</b><p>记住了 <b class="ok">${ok}</b> 张 · 模糊 <b class="mid">${mid}</b> 张 · 还不会 <b class="bad">${bad}</b> 张</p><p class="note">还不会的会排到下一组前面，也会进入到期复习。</p><button class="btn pri" id="flnext">再来一组</button></div>`;
    bindFl(m); $('#flnext').onclick = () => { FL.deck = null; render(); }; return;
  }
  const q = g[0];
  m.innerHTML = head + `<div class="fl-prog"><span>第 ${FL.i + 1} / ${D.length} 张</span><span class="sp"></span><span class="note">${g.map(x => x.y).filter(Boolean).join('、')} 年考过 · ${esc((CL[q.c] || {}).n || '')}</span></div><div class="fl-bar"><i style="width:${FL.i / D.length * 100}%"></i></div>
    <div class="fl-stage"><div class="fl-card" id="flc" tabindex="0" role="button" aria-label="翻面"><div class="fl-front"><div class="fl-term">${esc(q.q)}</div><div class="note">点一下翻面看定义</div></div><div class="fl-back" hidden><div class="fl-term sm">${esc(q.q)}</div><div class="fl-def">${q.a}</div></div><span class="fl-stamp l" aria-hidden="true">还不会</span><span class="fl-stamp r" aria-hidden="true">记住了</span></div></div>
    <div class="row fl-btns"><button class="btn r1" data-fl="1">← 还不会</button><button class="btn r2" data-fl="2">模糊</button><button class="btn r3" data-fl="3">记住了 →</button></div>`;
  bindFl(m);
  const card = $('#flc'), flipC = () => { const b = $('.fl-back', card), f = $('.fl-front', card); const open = b.hidden; b.hidden = !open; f.hidden = open; card.classList.toggle('flipped', open); };
  const commit = l => {
    rate(q.id, l); const st = S.q[q.id];
    for (const x of g.slice(1)) S.q[x.id] = Object.assign({}, st);   /* 同一个名词在不同年份出现过，一起记 */
    save(); FL.res.push(l); FL.i++;
    card.classList.add(l === 3 ? 'out-r' : l === 1 ? 'out-l' : 'out-d'); setTimeout(render, 220);
  };
  m.querySelector('.fl-btns').onclick = e => { const b = e.target.closest('[data-fl]'); if (b) commit(+b.dataset.fl); };
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flipC(); } if (e.key === 'ArrowRight') commit(3); if (e.key === 'ArrowLeft') commit(1); });
  let sx = null, dx = 0, moved = false;
  card.addEventListener('pointerdown', e => { sx = e.clientX; dx = 0; moved = false; card.setPointerCapture(e.pointerId); card.style.transition = 'none'; });
  card.addEventListener('pointermove', e => { if (sx === null) return; dx = e.clientX - sx; if (Math.abs(dx) > 6) moved = true; card.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`; card.classList.toggle('to-r', dx > 60); card.classList.toggle('to-l', dx < -60); });
  const end = () => { if (sx === null) return; sx = null; card.style.transition = ''; card.classList.remove('to-r', 'to-l');
    if (dx > 110) commit(3); else if (dx < -110) commit(1); else { card.style.transform = ''; if (!moved) flipC(); } };
  card.addEventListener('pointerup', end); card.addEventListener('pointercancel', () => { sx = null; card.style.transition = ''; card.style.transform = ''; card.classList.remove('to-r', 'to-l'); });
}
function bindFl(m) {
  $('#flf').onclick = e => { const b = e.target.closest('[data-f]'); if (b) { FL.flt = b.dataset.f; FL.deck = null; render(); } };
  $('#flm').onchange = e => { FL.mod = +e.target.value; FL.deck = null; render(); };
  $('#flnew').onclick = () => { FL.deck = null; render(); };
}

/* ========== 试验性功能（2.2）：答题框架、模拟卷诊断、考点趋势、睡前回顾、悬浮搜索 ========== */

/* ---------- 答题框架库：按问法给出写作框架，题卡上自动匹配 ---------- */
const FRAMES = [
  { id: 'def', n: '名词解释', re: /^$/, ask: '「……是指」「名词解释」', steps: ['定义：它是什么、属于哪一类（属概念 + 区别于同类的特征）', '本质或条件：在什么条件下发生、关键的结构或原理', '结果或意义：引起什么变化、对食品有什么影响；必要时举一个食品例子'], tip: '3 分题写 2~3 句就够，第一句的定义最关键，尽量用教材原话的关键词。' },
  { id: 'factor', n: '影响因素题', re: /影响.{0,8}因素|哪些因素|因素有哪些|受.{0,6}影响|影响.{0,6}(的)?(主要)?因素/, ask: '「影响……的因素」「……受哪些因素影响」', steps: ['总述：一句话说明这个反应或性质是什么', '内因：物质本身的结构和组成（如脂肪酸不饱和度、糖的种类、蛋白质结构、淀粉中直链与支链的比例）', '外因：温度、pH、水分活度、氧气、光照、金属离子、酶、其他共存成分（糖、盐、脂类、蛋白质）', '每个因素都写「怎样影响 + 为什么」，不要只列名词', '收尾：一句话点出由此得到的控制或应用方法'], tip: '外因按「温度、pH、水分活度、氧、光、金属离子」的固定顺序写，不容易漏。' },
  { id: 'mech', n: '机理题', re: /机理|机制|原理|过程|历程|是如何|怎样发生/, ask: '「……的机理」「……的反应过程」「……的原理」', steps: ['条件：反应物是什么、在什么环境下发生', '过程：按阶段写（初期、中期、末期，或引发、传递、终止），写出关键的中间产物', '产物：最终生成什么', '影响：对食品色、香、味、营养、安全的影响'], tip: '能画反应式或示意图就画一个，阅卷时很加分；文字和图要对应。' },
  { id: 'cmp', n: '区别与比较题', re: /区别|异同|比较|不同点|相同点|有何不同|有什么不同|联系/, ask: '「……与……的区别」「比较……」', steps: ['先分别给两个概念下定义', '列表逐项对比：本质或结构、发生条件、过程、产物、对食品的影响、控制方法', '最后一句总结两者的联系'], tip: '用表格作答最清楚；没有表格时，每一点都写成「前者……，而后者……」的对照句。' },
  { id: 'role', n: '作用与应用题', re: /作用|功能|应用|用途|意义|有何用|在食品.{0,6}中的/, ask: '「……在食品中的作用」「……的应用」', steps: ['分点写，每点写「作用 + 原理 + 食品实例」', '按营养、感官（色、香、味、质地）、加工性能、贮藏稳定性、安全性分类，不容易漏', '有利和不利两方面都写（如美拉德反应既产生风味也损失赖氨酸）'], tip: '每一点后面跟一个具体食品例子，比空讲原理更容易拿分。' },
  { id: 'ctrl', n: '控制措施与防止方法题', re: /控制|防止|抑制|措施|如何|怎样|方法|避免|延缓|保护/, ask: '「如何防止……」「控制……的措施」', steps: ['先点明要控制的是哪个反应，以及它发生需要的条件', '针对每个条件写措施：去除底物、钝化酶、隔氧、避光、低温、调 pH、控制水分活度、加抑制剂或抗氧化剂', '每条写「做法 + 原理」', '最后提一句注意事项：措施对品质或安全的副作用（如亚硫酸盐残留）'], tip: '措施要和条件一一对应，阅卷时看得出你的逻辑。' },
  { id: 'prop', n: '性质与特点题', re: /性质|特点|特性|特征|结构特点/, ask: '「……的性质」「……有哪些特点」', steps: ['物理性质：溶解性、结晶、黏度、吸湿性、熔点等', '化学性质：会发生哪些反应', '功能性质：在食品加工中表现出的作用（如乳化、起泡、凝胶）', '每一点都联系一个食品实例'], tip: '先写结构，再写由结构决定的性质，体现「结构决定性质」的思路。' },
  { id: 'case', n: '分析与情境题', re: /分析|情境|某企业|某工厂|某产品|请解释|为什么|原因/, ask: '「分析……的原因」「某产品出现……，请分析并提出方案」', steps: ['现象：用专业术语描述发生了什么', '原因：属于哪个反应，写出机理要点', '影响因素：哪些条件促进了这个现象', '解决方案：至少 4 条，具体可操作，每条写原理', '结论：一句话总结'], tip: '情境题分值高，结构比细节更重要；每一段开头先写小标题。' }
];
function frameFor(q) {
  if (q.t === '名解') return FRAMES[0];
  const t = q.q || '';
  for (const f of FRAMES.slice(1)) if (f.re.test(t)) return f;
  return q.t === '分析' ? FRAMES.find(f => f.id === 'case') : null;
}
function frameHTML(f, short) {
  return `<div class="frm-h"><b>${esc(f.n)}</b>${short ? '<span class="note">答题框架</span>' : ''}</div><ol class="frm-s">${f.steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol><p class="note frm-tip">💡 ${esc(f.tip)}</p>`;
}
function pFrame(m) {
  const ex = f => BANK.filter(q => !OBJ.includes(q.t) && frameFor(q) === f).sort((a, b) => (b.y || 0) - (a.y || 0)).slice(0, 4);
  m.innerHTML = `<div class="kick">FRAMEWORKS · 答题框架</div><h1>答题框架</h1><p class="lead">考研大题的问法很固定。先认出是哪一类问法，再按框架往里填内容，遇到没见过的题也能写出完整的结构。打开后，题卡上会多一个「答题框架」按钮，自动匹配这道题的框架。</p>
  <div class="frms">${FRAMES.map(f => { const xs = ex(f); return `<div class="card frm"><div class="row" style="gap:10px;flex-wrap:wrap"><b class="frm-n">${esc(f.n)}</b><span class="note">常见问法：${esc(f.ask)}</span></div><ol class="frm-s">${f.steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol><p class="note frm-tip">💡 ${esc(f.tip)}</p>${xs.length ? `<div class="frm-ex"><span class="note">真题里的例子：</span>${xs.map(q => `<button class="chip cl" data-oq="${q.id}">${q.y || ''} ${esc(q.q.slice(0, 26))}${q.q.length > 26 ? '…' : ''}</button>`).join('')}</div>` : ''}</div>`; }).join('')}</div>`;
  m.addEventListener('click', e => { const b = e.target.closest('[data-oq]'); if (b) openQ(b.dataset.oq); });
}

/* ---------- 模拟卷诊断报告 ---------- */
function mockDiagHTML(M) {
  const rows = M.ids.map(id => { const q = BY[id], full = PTS[q.t], sc = M.sc[id]; return { q, id, full, sc, g: sc != null, lost: sc != null ? full - sc : 0 }; });
  const gr = rows.filter(r => r.g);
  if (!gr.length) return '<p class="note" style="margin:0">给大题打完分后，这里会按模块、题型和考点分析丢分情况。</p>';
  const agg = key => { const o = {}; gr.forEach(r => { const k = key(r.q); (o[k] = o[k] || { k, full: 0, lost: 0 }); o[k].full += r.full; o[k].lost += r.lost; }); return Object.values(o).sort((a, b) => b.lost - a.lost); };
  const mods = agg(q => qmod(q)), types = agg(q => q.t), cls = agg(q => q.c).filter(x => x.lost > 0).slice(0, 5);
  const got = gr.reduce((a, r) => a + (r.full - r.lost), 0), full = gr.reduce((a, r) => a + r.full, 0), lost = full - got;
  const weak = gr.filter(r => r.sc / r.full < 0.6).map(r => r.id), wNew = weak.filter(id => !qs(id).w).length;
  const bars = (list, name) => { const mx = Math.max(1, ...list.map(x => x.lost)); return list.map(x => `<div class="bar-row wide"><span class="bl">${esc(name(x.k))}</span><span class="bt"><i style="width:${x.lost / mx * 100}%"></i></span><b>−${+x.lost.toFixed(1)}</b></div>`).join(''); };
  const left = rows.length - gr.length;
  return `<div class="md-sum"><b>已评 ${gr.length} 题：得 ${+got.toFixed(1)} / ${full} 分，丢 ${+lost.toFixed(1)} 分（得分率 ${Math.round(got / full * 100)}%）</b>${left ? `<span class="note">还有 ${left} 题没打分，打完后报告会更完整</span>` : ''}</div>
    <div class="grid g2 md-g"><div><div class="note md-t">按模块丢分</div>${bars(mods.filter(x => x.lost > 0), k => MODN[k] || '其他') || '<p class="note">没有丢分</p>'}</div><div><div class="note md-t">按题型丢分</div>${bars(types.filter(x => x.lost > 0), k => TLABEL[k]) || '<p class="note">没有丢分</p>'}</div></div>
    ${cls.length ? `<div class="md-cl"><span class="note">丢分最多的考点（点进去走复习路径）：</span>${cls.map(x => `<button class="chip cl" data-cl="${x.k}">${esc((CL[x.k] || {}).n || x.k)} −${+x.lost.toFixed(1)}</button>`).join('')}</div>` : ''}
    <p class="note" style="margin:10px 0 0">${mods[0] && mods[0].lost > 0 ? `丢分最多的是「${esc(MODN[mods[0].k] || '')}」，接下来两天优先复习这个模块；` : ''}得分率低于 60% 的有 ${weak.length} 题。</p>
    ${weak.length ? `<div class="row" style="margin-top:8px;gap:8px;flex-wrap:wrap"><button class="btn sm pri" data-mr="${weak.join(',')}">重练这 ${weak.length} 道低分题</button>${wNew ? `<button class="btn sm" data-mw="${weak.join(',')}">把 ${wNew} 道加入错题本</button>` : '<span class="note">低分题已自动加入错题本</span>'}</div>` : ''}`;
}

/* ---------- 考点趋势提示 ---------- */
let TR_YMAX = 0, TR_YMIN = 9999; for (const s of Object.values(CS)) { TR_YMAX = Math.max(TR_YMAX, s.last || 0); for (const y of s.years) TR_YMIN = Math.min(TR_YMIN, y); }
function trendTags(id) {
  if (!S.settings.labTrend) return '';
  const s = CS[id]; if (!s || !s.years.size) return '';
  const ys = [...s.years], first = Math.min(...ys), out = [];
  if (s.years.has(TR_YMAX) && s.years.has(TR_YMAX - 1) && s.years.has(TR_YMAX - 2)) out.push(['hot', `连续 3 年都考`]);
  if (ys.length >= 6 && s.last <= TR_YMAX - 2) out.push(['gap', `高频 · 近两年没考`]);
  if (first >= TR_YMAX - 4 && ys.length <= 3) out.push(['new', `近年新出现`]);
  return out.map(([k, t]) => `<span class="chip tr ${k}" title="根据 ${TR_YMIN}–${TR_YMAX} 年真题的出现规律，仅供参考">${t}</span>`).join('');
}

/* ---------- 睡前五分钟回顾：今天评了「不会」「模糊」的题 ---------- */
function nightIds() { const t0 = sod(); return BANK.filter(q => { const s = qs(q.id); return s.l && s.l < 3 && s.t >= t0; }).map(q => q.id); }
function nightHTML() {
  const ids = nightIds(); if (!ids.length) return '';
  const h = new Date().getHours(), late = h >= 19 || h < 3;
  return `<div class="card night ${late ? 'late' : ''}"><div class="nt-i" aria-hidden="true">${late ? '🌙' : '📝'}</div><div class="nt-b"><b>睡前五分钟回顾</b><div class="note">今天有 <b>${ids.length}</b> 道题评了「不会」或「模糊」。${late ? '睡前把它们快速过一遍，只看答案要点，不用重新写，睡眠会帮你巩固记忆。' : '先记着，晚上睡前花五分钟快速过一遍。'}</div></div><button class="btn ${late ? 'pri' : ''}" data-go="night">${late ? '开始回顾' : '现在就看'}</button></div>`;
}

/* ---------- 悬浮搜索：页面上方的搜索框，点开在浮层里搜，不用离开当前页面 ---------- */
function searchHTML(k) {
  const kl = k.toLowerCase(); const hit = t => t.toLowerCase().includes(kl);
  const mk = t => { const i = t.toLowerCase().indexOf(kl); if (i < 0) return esc(t.slice(0, 90)); const a = Math.max(0, i - 30); return (a ? '…' : '') + esc(t.slice(a, i)) + '<mark>' + esc(t.slice(i, i + k.length)) + '</mark>' + esc(t.slice(i + k.length, i + k.length + 50)) + '…'; };
  const K = MODS.flatMap(mo => mo.items.map(it => ({ it, txt: it.t + ' ' + strip(it.h) }))).filter(x => hit(x.txt));
  const Q = BANK.filter(q => hit(q.q)); const A = BANK.filter(q => !hit(q.q) && hit(strip(q.a)));
  return `<h2>知识点（${K.length}）</h2><div class="list">${K.slice(0, 30).map(x => `<div class="li" data-it="${x.it.id}" style="cursor:pointer"><div class="main"><div class="t">${x.it.id} ${esc(x.it.t)}</div><div class="s">${mk(strip(x.it.h))}</div></div></div>`).join('') || '<p class="note">没有匹配的知识点。</p>'}</div>
    <h2>题目（${Q.length}）</h2><div class="list">${Q.slice(0, 60).map(q => `<div class="li" data-q="${q.id}" style="cursor:pointer"><div class="stripe l${qs(q.id).l}"></div><div class="main"><div class="t">${mk(q.q)}</div><div class="s">${q.y || '原创情境'} · ${TLABEL[q.t]} · ${esc((CL[q.c] || {}).n || '')}</div></div></div>`).join('') || '<p class="note">没有匹配的题目。</p>'}</div>
    <h2>答案中出现（${A.length}）</h2><div class="list">${A.slice(0, 40).map(q => `<div class="li" data-q="${q.id}" style="cursor:pointer"><div class="main"><div class="t">${esc(q.q.split('\n')[0].slice(0, 70))}</div><div class="s">${mk(strip(q.a))}</div></div></div>`).join('') || '<p class="note">答案中也没有。</p>'}</div>`;
}
const GS = { open: false };
function gsMount() {
  let pill = document.getElementById('gsPill');
  const on = featOn('labSearch');
  document.documentElement.classList.toggle('gs', on);
  if (!on) { if (pill) pill.remove(); const b = document.getElementById('gsBtn'); if (b) b.remove(); return; }
  if (!pill) {
    pill = document.createElement('button'); pill.id = 'gsPill'; pill.type = 'button'; pill.className = 'gs-pill';
    pill.innerHTML = `${icon('search', 'gs-ic')}<span>搜索知识点、真题和答案</span>`;
    pill.onclick = gsOpen; document.body.append(pill);
  }
  /* 手机：顶栏里放一条整宽的搜索栏，跟着顶栏悬浮在页面上方 */
  const top = document.getElementById('topnav'), bar = top && top.querySelector('.bar1');
  if (bar && !document.getElementById('gsBtn')) { const b = document.createElement('button'); b.id = 'gsBtn'; b.type = 'button'; b.className = 'gs-mpill'; b.innerHTML = `${icon('search', 'gs-ic')}<span>搜索知识点、真题和答案</span>`; b.onclick = gsOpen; bar.after(b); }
  gsPlace();
}
function gsPlace() {
  const pill = document.getElementById('gsPill'), main = document.getElementById('main'); if (!pill || !main) return;
  const r = main.getBoundingClientRect(); pill.style.left = (r.left + r.width / 2) + 'px'; pill.style.width = Math.min(560, Math.max(260, r.width - 64)) + 'px';
}
window.addEventListener('resize', () => gsPlace());
function gsOpen(restore) {
  if (GS.open) return; GS.open = true; if (restore !== true) GS.scroll = 0;
  const ov = document.createElement('div'); ov.className = 'gs-ov'; ov.id = 'gsOv';
  ov.innerHTML = `<div class="gs-box" role="dialog" aria-modal="true" aria-label="搜索"><div class="gs-in">${icon('search', 'gs-ic')}<input type="search" id="gsq" placeholder="搜索知识点、真题和答案，例如「亚硫酸」「0.33」「β′」" value="${esc(NAV.q || '')}" aria-label="搜索关键词" enterkeyhint="search"><button class="btn sm ghost" id="gsx">取消</button></div><div class="gs-res" id="gsr"><p class="note gs-hint">输入关键词，结果会在下面实时显示。</p></div></div>`;
  document.body.append(ov);
  /* 宽屏：浮层和顶部搜索框对齐，居中在内容区上方（不算侧边栏） */
  placeOverlay(ov);
  const inp = $('#gsq'), res = $('#gsr'); let tm = null;
  const run = () => { const k = inp.value.trim(); NAV.q = k; res.innerHTML = k ? searchHTML(k) : '<p class="note gs-hint">输入关键词，结果会在下面实时显示。</p>'; };
  inp.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(run, 180); });
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') { clearTimeout(tm); run(); inp.blur(); } });
  $('#gsx').onclick = gsClose;
  ov.addEventListener('click', e => {
    if (e.target === ov) return gsClose();
    const r = e.target.closest('[data-q],[data-it]'); if (!r) return;
    GS.scroll = res.scrollTop; gsClose();
    if (r.dataset.q) openQ(r.dataset.q, { back: () => gsOpen(true), backLabel: '返回搜索结果' }); else { NAV.learnMod = +r.dataset.it.split('-')[0]; NAV.learnOpen = r.dataset.it; go('learn'); }
  });
  if (NAV.q) { run(); if (restore === true && GS.scroll) res.scrollTop = GS.scroll; }
  /* 从题卡返回时不弹键盘，方便接着往下看结果 */
  if (restore !== true) setTimeout(() => { inp.focus(); inp.select(); }, 30);
}
function gsClose() { const ov = document.getElementById('gsOv'); if (ov) ov.remove(); GS.open = false; }
document.addEventListener('keydown', e => {
  if (!featOn('labSearch')) return;
  if (e.key === 'Escape' && GS.open) { gsClose(); return; }
  const tag = (e.target.tagName || '').toLowerCase(), typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
  if (((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing)) { e.preventDefault(); gsOpen(); }
});

const STABLE = new Set(['labRecite', 'labSprint', 'labNight', 'labSearch', 'labTimer']);
const LABS = [
  { k: 'labRecite', t: '大题背诵模式', d: '简答、论述、情境、名解的题卡上多一个「背诵」按钮，把参考答案拆成一条条要点来背。', how: ['<b>要点提示</b>：只显示每条要点的标题，先回忆，再点开核对', '<b>挖空填词</b>：把答案里的关键词整个挖掉换成横线，点一下横线显示', '<b>全文</b>：显示完整答案'], where: '题卡上「对答案」旁边' },
  { k: 'labPoints', t: '按要点自评', d: '对完答案后，勾上自己答出来的要点，按比例自动给出「不会 / 模糊 / 掌握」，漏掉的要点下次做这题时会提醒。', how: ['答出 80% 以上算「掌握」，40% 以上算「模糊」，再少算「不会」', '模拟卷交卷后，大题可以「按要点给分」，分数按比例自动填好', '漏掉的要点显示在题目下方：「上次漏了：……」'], where: '对完答案后，答案下方' },
  { k: 'labScore', t: '关键词自动评分', d: '在输入框里写下答案后点「对答案」，自动对照参考答案里的关键词，告诉你写到了哪些、漏了哪些，并给出建议的掌握程度。', how: ['覆盖 70% 以上建议「掌握」，35% 以上建议「模糊」', '按要点列出没写到的关键词，写到大部分的要点打 ✓', '同时开着「按要点自评」时，会帮你把写到的要点先勾上'], where: '名解和大题的题卡，对完答案后' },
  { k: 'labTimer', t: '限时作答', d: '按考试节奏给名解和大题计时：名解 3 分钟、简答 8 分钟、论述和分析 15 分钟。开始写的时候自动计时，超时只变红提醒，不会打断你。', how: ['在输入框里打字或点进去就开始计时', '点「对答案」停止，显示这题用了多久', '用时会记在这道题上，下次做时能看到上次用时'], where: '题卡左上角的标签栏' },
  { k: 'labCompare', t: '易混概念对比', d: '把常被问「区别」的概念做成对照表：糊化和老化、结合水和自由水、酶促和非酶褐变、三种油脂氧化、三种酸败等 13 组。', how: ['「直接看」用来理解，「挖空练习」把表格盖住，点一格看一格', '可以按模块筛选', '打开后侧边栏多一个「易混对比」'], where: '侧边栏「易混对比」' },
  { k: 'labFlash', t: '名解闪卡', d: '名词解释做成一张张卡片，先在心里说出定义，再翻面核对。右滑「记住了」、左滑「还不会」，适合碎片时间快速过一轮。', how: ['每组 20 张，没掌握和到期的排在前面', '同一个名词在不同年份考过，只出现一次，结果一起记', '打开后侧边栏多一个「名解闪卡」'], where: '侧边栏「名解闪卡」' },
  { k: 'labSprint', t: '冲刺计划', d: '按设置里的考试日期倒推：把还没过完的考点按常考程度分到每一天，最后 7 天只安排错题和模拟卷，考前两天只回顾。', how: ['已经做完复习路径或掌握的考点会自动跳过', '计划每天按你的进度重新分配，落下了也不用补', '需要先在设置里填好考试日期'], where: '首页「今日计划」上方' },
  { k: 'labCause', t: '错因标签', d: '评「不会」或「模糊」时，顺手选一下错在哪里：概念不清、记混了、漏要点、审题错、会但写不出。进度页会统计你最常见的失分原因，并给出建议。', how: ['评为「掌握」后，这道题的错因自动清除', '错题本里会显示每道题的错因', '统计只算还没掌握的题'], where: '题卡打分按钮下方；进度页' },
  { k: 'labFrame', t: '答题框架库', d: '考研大题的问法很固定：影响因素、机理、区别、作用、控制措施、性质、情境分析……每一类都有可以套用的写作框架。遇到没见过的题，先认出问法，再按框架填内容。', how: ['新增「答题框架」页面：8 类问法的框架、小贴士和真题例子', '题卡上多一个「答题框架」按钮，按题目的问法自动匹配', '名解统一用「定义 + 本质或条件 + 意义」的写法'], where: '侧边栏「答题框架」；名解和大题的题卡上' },
  { k: 'labMockDiag', t: '模拟卷诊断报告', d: '模拟卷交卷并打完分后，按模块、题型和考点分析丢分，指出丢分最多的地方，一键重练低分题。', how: ['按模块、按题型显示丢了多少分', '列出丢分最多的考点，点一下走复习路径', '得分率低于 60% 的题可以一键重练（打低分的题会自动进入错题本）'], where: '模拟卷交卷后，试卷顶部' },
  { k: 'labTrend', t: '考点趋势提示', d: '根据历年真题的出现规律，在考点上标出：连续 3 年都考、高频但近两年没考、近年新出现。帮你在最后阶段判断复习的轻重。', how: ['「连续 3 年都考」：最近三年每年都出现', '「高频 · 近两年没考」：出现过 6 年以上，但最近两年没出现', '「近年新出现」：最近五年才开始考，出现不超过 3 次', '这只是历年规律的参考，不是押题'], where: '首页高频考点、复习路径列表' },
  { k: 'labNight', t: '睡前五分钟回顾', d: '把今天评了「不会」「模糊」的题集中起来，睡前快速过一遍答案要点。睡眠期间大脑会巩固睡前接触的内容，花的时间少、效果好。', how: ['今天有评「不会」「模糊」的题时，首页出现回顾卡片', '晚上 7 点以后卡片会更醒目', '安卓 App 的每日提醒会顺带提示睡前回顾的题数'], where: '首页' },
  { k: 'labSearch', t: '悬浮搜索框', d: '把「检索」从侧边栏移到页面上方的悬浮搜索框，在任何页面都能随手搜，不用离开当前页面。', how: ['点页面顶部的搜索框，或按 ⌘K / Ctrl K、/ 键打开', '边输入边出结果，点题目直接弹出题卡', '手机上在顶栏右侧的放大镜图标'], where: '页面顶部；手机在顶栏' }
];
function pLabs(m) {
  const st = S.settings; const LABS2 = LABS.filter(f => !STABLE.has(f.k));
  m.innerHTML = `<div class="kick">LABS · 试验性功能</div><h1>试验性功能 <sup class="beta lg">beta</sup></h1><p class="lead">这里放的是还在打磨的新功能，默认都是关闭的。打开后，对应的按钮才会出现在刷题界面里；觉得用不惯，随时关掉，学习记录不受影响。</p>
  <div class="labs">${LABS2.map(f => `<div class="card lab${st[f.k] ? ' on' : ''}" data-lab="${f.k}"><div class="lab-h"><div><b>${esc(f.t)}</b><span class="note">出现在：${esc(f.where)}</span></div><button class="switch" role="switch" aria-checked="${!!st[f.k]}" aria-label="${esc(f.t)}" data-sw="${f.k}"><i></i></button></div>
    <p>${esc(f.d)}</p><ul class="chg">${f.how.map(x => `<li>${x}</li>`).join('')}</ul><div class="lab-st note">${st[f.k] ? '已开启 · 去刷题界面试试吧' : '未开启'}</div></div>`).join('')}</div>`;
  m.addEventListener('click', e => { const b = e.target.closest('[data-sw]'); if (!b) return; const k = b.dataset.sw; st[k] = !st[k]; save();
    b.setAttribute('aria-checked', !!st[k]); const c = b.closest('.lab'); c.classList.toggle('on', !!st[k]); $('.lab-st', c).textContent = st[k] ? '已开启 · 去刷题界面试试吧' : '未开启'; });
}

/* ========== 考前速查手册：每个考点最常考的名词解释和大题要点；屏幕上看和导出 PDF 用同一份数据 ========== */
const HB = { mod: 0, f: 'all', pdf: null, busy: false };
const hbCut = (s, n) => (s = String(s || '').trim()).length > n ? s.slice(0, n - 1) + '…' : s;
function hbDef(q) { const t = txt(q.a || '').replace(/\s+/g, ' '); const s = (t.match(/^[\s\S]*?[。；]/) || [t])[0]; return hbCut(s.replace(/[；]$/, '。'), 96); }
function hbLevel(id) { const mm = clusterMastery(id); if (!mm.att) return ['none', '未练']; if (mm.m3 / mm.tot >= .6) return ['ok', '已掌握']; return mm.avg >= 2 ? ['mid', '模糊'] : ['low', '没掌握']; }
function hbClusterData(id) {
  const c = CL[id], s = CS[id];
  const seen = new Set(), terms = s.qs.filter(q => q.t === '名解').sort((a, b) => (b.y || 0) - (a.y || 0)).filter(q => { const k = q.q.trim(); if (seen.has(k)) return false; seen.add(k); return true; }).map(q => ({ id: q.id, t: q.q.trim(), d: hbDef(q) }));
  const bs = new Set(), bigs = s.qs.filter(q => BIG.includes(q.t)).sort((a, b) => (b.y || 0) - (a.y || 0)).filter(q => { const k = q.q.replace(/\s/g, '').slice(0, 24); if (bs.has(k)) return false; bs.add(k); return true; }).slice(0, 2)
    .map(q => { const pts = answerPoints(q); return { id: q.id, tag: `${q.y || '补充'} · ${TLABEL[q.t] || q.t}`, q: hbCut(q.q.replace(/\n/g, ' '), 90), pts: pts.slice(0, 8).map(p => ({ label: p.label, text: hbCut(String(p.label ? p.body : p.text).replace(/^[\s：:]+/, ''), 52) })), more: Math.max(0, pts.length - 8) }; });
  const [lc, ln] = hbLevel(id);
  return { id, name: c.n, hot: hotSet.has(id), meta: `考过 ${s.n} 年${s.last ? ' · 最近 ' + s.last : ''}`, lc, ln, terms, bigs };
}
function hbMods() {
  const keep = id => (HB.f === 'hot' ? hotSet.has(id) : HB.f === 'weak' ? hbLevel(id)[0] !== 'ok' : true);
  return MODS.filter(mo => !HB.mod || mo.id === HB.mod).map(mo => [mo, [...new Set(mo.items.flatMap(i => i.cs))].filter(id => CS[id] && CL[id] && CL[id].m === mo.id && keep(id))]).filter(x => x[1].length);
}
function hbClusterHTML(d) {
  return `<section class="hb-c">
    <header class="hb-h"><b>${esc(d.name)}</b>${d.hot ? '<span class="chip hot">高频</span>' : ''}<span class="note">${esc(d.meta)}</span><span class="sp"></span><span class="hb-lv ${d.lc}">${d.ln}</span></header>
    ${d.terms.length ? `<div class="hb-ts">${d.terms.map(t => `<button class="hb-term" data-q="${t.id}"><b>${esc(t.t)}</b><span>${esc(t.d)}</span></button>`).join('')}</div>` : ''}
    ${d.bigs.map(b => `<div class="hb-q"><button class="hb-qt" data-q="${b.id}"><span class="chip y">${esc(b.tag)}</span><span>${esc(b.q)}</span></button>
      ${b.pts.length ? `<ol>${b.pts.map(p => `<li>${p.label ? `<b>${esc(p.label)}</b>：` : ''}${esc(p.text)}</li>`).join('')}${b.more ? `<li class="note">还有 ${b.more} 条，点题目看完整答案</li>` : ''}</ol>` : ''}</div>`).join('')}
    <div class="hb-go"><button class="btn sm ghost" data-hpath="${d.id}">走复习路径 ›</button></div></section>`;
}
function pHandbook(m) {
  const mods = hbMods(), n = mods.reduce((a, x) => a + x[1].length, 0);
  const pdfBtn = HB.busy ? `<button class="btn sm" disabled>${esc(HB.busy)}</button>` : HB.pdf ? `<button class="btn sm pri" id="hbS">分享 / 保存 PDF（${HB.pdf.pages} 页）</button>` : '<button class="btn sm" id="hbP">生成 PDF</button>';
  m.innerHTML = `<p class="ios-note hb-lead">每个考点最常考的名词解释和大题要点压缩在一起，考前快速过一遍。点名词或题目看完整答案。</p>
  <div class="hb-bar"><div class="seg" id="hbF">${[['all', '全部'], ['hot', '只看高频'], ['weak', '只看没掌握']].map(([v, t]) => `<button data-v="${v}" aria-pressed="${HB.f === v}">${t}</button>`).join('')}</div>
    <select id="hbM" aria-label="模块"><option value="0">全部模块</option>${MODS.map(mo => `<option value="${mo.id}" ${HB.mod === mo.id ? 'selected' : ''}>${mo.id} ${esc(mo.name)}</option>`).join('')}</select>
    <span class="note">${n} 个考点</span><span class="sp"></span><span id="hbPdf">${pdfBtn}</span></div>
  ${mods.length ? mods.map(([mo, ids]) => `<h3 class="hb-mh">${mo.id} ${esc(mo.name)}</h3>${ids.map(id => hbClusterHTML(hbClusterData(id))).join('')}`).join('') : '<div class="card"><p class="note" style="margin:0">这个筛选下没有考点。</p></div>'}`;
  $('#hbF', m).onclick = e => { const b = e.target.closest('[data-v]'); if (!b) return; HB.f = b.dataset.v; HB.pdf = null; pHandbook(m); };
  $('#hbM', m).onchange = e => { HB.mod = +e.target.value; HB.pdf = null; pHandbook(m); };
  m.onclick = e => {
    if (e.target.closest('#hbP')) return hbMakePdf(m);
    if (e.target.closest('#hbS')) return hbSharePdf();
    const q = e.target.closest('[data-q]'); if (q) return openQ(q.dataset.q);
    const p = e.target.closest('[data-hpath]'); if (p) { NAV.pathC = p.dataset.hpath; NAV.pathStep = 1; go('path'); }
  };
}
/* —— 导出 PDF：iPad 主屏幕 App 里不能直接打印，所以自己把手册排版画成 A4 页面，再打包成 PDF —— */
async function hbMakePdf(m) {
  const mods = hbMods(); if (!mods.length) return;
  const setBusy = t => { HB.busy = t; const s = m.querySelector('#hbPdf'); if (s) s.innerHTML = t ? `<button class="btn sm" disabled>${esc(t)}</button>` : ''; };
  setBusy('正在生成 PDF…');
  try {
    const title = '食品化学 · 考前速查手册', sub = `${HB.mod ? HB.mod + ' ' + MODN[HB.mod] : '全部模块'} · ${{ all: '全部考点', hot: '只看高频', weak: '只看没掌握' }[HB.f]} · ${dkey()} 生成`;
    const jpgs = await hbRender(mods, title, sub, n => setBusy(`正在生成 PDF… 第 ${n} 页`));
    HB.pdf = { blob: pdfFromJpegs(jpgs), pages: jpgs.length, name: `考前速查手册-${dkey()}.pdf` };
  } catch (e) { toast('PDF 生成失败：' + (e.message || e)); }
  HB.busy = false; if (m.isConnected) pHandbook(m);
}
async function hbSharePdf() {
  const P = HB.pdf; if (!P) return;
  if (window.AndroidApp && window.AndroidApp.printPdf) {   /* 安卓：系统打印界面，可以「另存为 PDF」或直接打印 */
    const b64 = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(String(fr.result).split(',')[1]); fr.readAsDataURL(P.blob); });
    try { window.AndroidApp.printPdf(b64, P.name); } catch (e) { toast('无法打开打印界面'); } return;
  }
  const file = new File([P.blob], P.name, { type: 'application/pdf' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {   /* iPad / iPhone：系统分享面板，可以「存储到文件」或「打印」 */
    try { await navigator.share({ files: [file], title: '考前速查手册' }); return; } catch (e) { if (e && e.name === 'AbortError') return; }
  }
  const url = URL.createObjectURL(P.blob), a = document.createElement('a'); a.href = url; a.download = P.name; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000); toast('PDF 已下载');
}
async function hbRender(mods, title, sub, onPage) {
  const SC = 1.6, W = Math.round(595.28 * SC * 1.25), H = Math.round(841.89 * SC * 1.25);   /* 约 150 dpi */
  const u = W / 595.28, M = 44 * u, CW = W - 2 * M, BOT = H - 46 * u;
  const FF = '"PingFang SC","Hiragino Sans GB","Noto Sans CJK SC","Source Han Sans SC","Microsoft YaHei",sans-serif';
  const C = { ink: '#1f1e1c', mut: '#7a756b', acc: '#b4532e', line: '#e4ded2', soft: '#f6efe6' };
  const f = (sz, b) => `${b ? 600 : 400} ${sz * u}px ${FF}`;
  const out = []; let cv, cx, y = 0, pg = 0;
  const NOSTART = '，。、；：？！）」』》〉】,.;:?!)%';
  const finish = async () => {
    cx.font = f(8); cx.fillStyle = C.mut; cx.textAlign = 'left'; cx.fillText('食品化学复习站 · 考前速查手册', M, H - 22 * u);
    cx.textAlign = 'right'; cx.fillText(`第 ${pg} 页 · Made with Claude`, W - M, H - 22 * u); cx.textAlign = 'left';
    cx.strokeStyle = C.line; cx.lineWidth = u * .6; cx.beginPath(); cx.moveTo(M, H - 34 * u); cx.lineTo(W - M, H - 34 * u); cx.stroke();
    const b = await new Promise(r => cv.toBlob(r, 'image/jpeg', .74)); out.push({ bytes: new Uint8Array(await b.arrayBuffer()), w: W, h: H });
    onPage && onPage(pg); await new Promise(r => setTimeout(r, 0));
  };
  const newPage = async () => { if (cv) await finish(); cv = document.createElement('canvas'); cv.width = W; cv.height = H; cx = cv.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, W, H); cx.textBaseline = 'alphabetic'; pg++; y = M; };
  const need = async h => { if (y + h > BOT) await newPage(); };
  /* runs：[{t, font, color}]，按字折行；行首避开标点；indent 是第二行起的缩进 */
  const flow = async (runs, x0, indent, lh) => {
    let x = x0, line = [];
    const flush = async () => { await need(lh); for (const s of line) { cx.font = s.font; cx.fillStyle = s.color; cx.fillText(s.t, s.x, y + lh * .78); } y += lh; line = []; x = x0 + indent; };
    for (const r of runs) {
      cx.font = r.font; let cur = { t: '', x, font: r.font, color: r.color };
      for (const ch of r.t) {
        const w = cx.measureText(ch).width;
        if (x + w > M + CW && !NOSTART.includes(ch) && (cur.t || line.length)) { if (cur.t) line.push(cur); await flush(); cx.font = r.font; cur = { t: '', x, font: r.font, color: r.color }; }
        cur.t += ch; x += w;
      }
      if (cur.t) line.push(cur);
    }
    if (line.length) await flush();
  };
  await newPage();
  cx.font = f(20, 1); cx.fillStyle = C.ink; cx.fillText(title, M, y + 22 * u); y += 32 * u;
  cx.font = f(9.5); cx.fillStyle = C.mut; cx.fillText(sub, M, y + 10 * u); y += 22 * u;
  for (const [mo, ids] of mods) {
    await need(60 * u); y += 8 * u;
    cx.fillStyle = C.acc; cx.fillRect(M, y + 3 * u, 3 * u, 15 * u); cx.font = f(14, 1); cx.fillStyle = C.ink; cx.fillText(`${mo.id} ${mo.name}`, M + 10 * u, y + 16 * u); y += 26 * u;
    for (const id of ids) {
      const d = hbClusterData(id);
      await need(56 * u); y += 4 * u;
      cx.strokeStyle = C.line; cx.lineWidth = u * .6; cx.beginPath(); cx.moveTo(M, y); cx.lineTo(W - M, y); cx.stroke(); y += 6 * u;
      await flow([{ t: d.name, font: f(11.5, 1), color: C.ink }, { t: `　${d.hot ? '高频 · ' : ''}${d.meta} · ${d.ln}`, font: f(8.5), color: d.hot ? C.acc : C.mut }], M, 0, 17 * u);
      for (const t of d.terms) await flow([{ t: t.t + '　', font: f(9.5, 1), color: C.acc }, { t: t.d, font: f(9.5), color: C.ink }], M, 12 * u, 14.5 * u);
      for (const b of d.bigs) {
        y += 3 * u;
        await flow([{ t: `［${b.tag}］`, font: f(8.5), color: C.mut }, { t: b.q, font: f(9.5, 1), color: C.ink }], M, 12 * u, 14.5 * u);
        for (let i = 0; i < b.pts.length; i++) { const p = b.pts[i]; await flow([{ t: `${i + 1}. `, font: f(9), color: C.mut }, ...(p.label ? [{ t: p.label + '：', font: f(9, 1), color: C.ink }] : []), { t: p.text, font: f(9), color: C.ink }], M + 10 * u, 22 * u, 13.5 * u); }
        if (b.more) await flow([{ t: `（还有 ${b.more} 条要点，见题库完整答案）`, font: f(8.5), color: C.mut }], M + 22 * u, 22 * u, 13 * u);
      }
      y += 4 * u;
    }
  }
  await finish();
  return out;
}
/* 把 JPEG 页面打包成 PDF（每页一张图，A4） */
function pdfFromJpegs(pages) {
  const enc = new TextEncoder(), parts = [], offs = []; let off = 0;
  const put = x => { const b = typeof x === 'string' ? enc.encode(x) : x; parts.push(b); off += b.length; };
  const obj = (n, body) => { offs[n] = off; put(`${n} 0 obj\n`); (Array.isArray(body) ? body : [body]).forEach(put); put('\nendobj\n'); };
  const N = pages.length, PW = 595.28, PH = 841.89;
  put('%PDF-1.4\n%âãÏÓ\n');
  obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
  obj(2, `<< /Type /Pages /Kids [${pages.map((_, i) => `${3 + i * 3} 0 R`).join(' ')}] /Count ${N} >>`);
  pages.forEach((p, i) => {
    const pn = 3 + i * 3, cn = pn + 1, im = pn + 2, cs = `q ${PW} 0 0 ${PH} 0 0 cm /Im0 Do Q`;
    obj(pn, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /XObject << /Im0 ${im} 0 R >> >> /Contents ${cn} 0 R >>`);
    obj(cn, `<< /Length ${cs.length} >>\nstream\n${cs}\nendstream`);
    obj(im, [`<< /Type /XObject /Subtype /Image /Width ${p.w} /Height ${p.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.bytes.length} >>\nstream\n`, p.bytes, '\nendstream']);
  });
  const total = 3 + N * 3, xref = off;
  put(`xref\n0 ${total}\n0000000000 65535 f \n`);
  for (let n = 1; n < total; n++) put(`${String(offs[n]).padStart(10, '0')} 00000 n \n`);
  put(`trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  return new Blob(parts, { type: 'application/pdf' });
}

/* ========== 学习周报：一周的学习时长、做题、自测、模拟卷和薄弱模块，附下周建议 ========== */
const WK = { off: 0 };
function weekStart(off) { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (d.getDay() + 6) % 7 + off * 7); return d.getTime(); }
function weekData(off) {
  const t0 = weekStart(off), e = new Date(t0); e.setDate(e.getDate() + 7); const t1 = e.getTime();
  const days = [...Array(7)].map((_, i) => { const d = new Date(t0); d.setDate(d.getDate() + i); const k = dkey(d.getTime()), L = S.log[k] || {}; return { k, d, min: Math.round(L.min || 0), done: L.done || 0 }; });
  const rated = Object.entries(S.q).filter(([id, s]) => s && s.t >= t0 && s.t < t1 && BY[id]);
  const lv = [0, 0, 0, 0]; const mod = {};
  rated.forEach(([id, s]) => { lv[s.l]++; const mo = qmod(BY[id]); if (mo) { mod[mo] = mod[mo] || [0, 0, 0, 0]; mod[mo][s.l]++; } });
  const dDays = days.filter(d => { const D = S.daily[d.k]; return D && D.ids && D.res && Object.keys(D.res).length >= D.ids.length; }).length;
  const mocks = (S.mocks || []).filter(x => x.ts >= t0 && x.ts < t1);
  return { t0, t1, days, rated: rated.length, lv, mod, dDays, mocks, min: days.reduce((a, d) => a + d.min, 0), done: days.reduce((a, d) => a + d.done, 0), act: days.filter(d => d.min || d.done).length };
}
const fmtMin = n => n >= 60 ? `${Math.floor(n / 60)} 小时${n % 60 ? ' ' + (n % 60) + ' 分' : ''}` : `${n} 分钟`;
const fmtMD = t => { const d = new Date(t); return `${d.getMonth() + 1} 月 ${d.getDate()} 日`; };
function wkAdvice(W) {
  const out = [], plan = (S.settings.dur || 90) * 7;
  if (W.act < 5) out.push(`这周学了 ${W.act} 天。考前最后阶段，每天哪怕只做一组每日自测，也比集中突击记得牢。`);
  else if (W.min < plan * .7) out.push(`学习时长是计划（每天 ${S.settings.dur || 90} 分钟）的 ${Math.round(W.min / plan * 100)}%，下周可以每天多留 20 分钟给错题。`);
  else out.push('学习节奏很稳，继续保持每天的复习路径和每日自测。');
  const weak = Object.entries(W.mod).map(([m, a]) => [m, a[1] + a[2], a[1] + a[2] + a[3]]).filter(x => x[1] >= 2).sort((a, b) => b[1] - a[1]).slice(0, 2);
  if (weak.length) out.push(`本周丢分集中在${weak.map(([m]) => `「${MODN[m]}」`).join('和')}，下周优先回顾这些模块的考点，可以在速查手册里按模块筛选。`);
  const due = Object.values(S.q).filter(s => s && s.w && s.d && s.d < Date.now() + 7 * DAY).length;
  if (due) out.push(`错题本里有 ${due} 道题会在下周到期复习，记得清掉。`);
  if (!W.mocks.length) out.push('这周没有做模拟卷，建议周末计时做一套，检查答题速度。');
  if (S.settings.exam) { const left = Math.ceil((new Date(S.settings.exam + 'T00:00:00') - sod()) / DAY); if (left > 0 && left <= 30) out.push(`离考试还有 ${left} 天，${left <= 7 ? '最后一周只看错题和速查手册，不再开新内容。' : '开始把重心转到错题、模拟卷和高频考点。'}`); }
  return out;
}
function wkChart(W) {
  const sm = innerWidth <= 560, mx = Math.max(30, ...W.days.map(d => d.min)), H = 150, bw = 54, gap = 40, x0 = 34, today = dkey();
  const nm = ['一', '二', '三', '四', '五', '六', '日'];
  return `<svg viewBox="0 0 ${x0 + 7 * (bw + gap)} ${H + 60}" class="dg wk-ch${sm ? ' sm' : ''}" role="img" aria-label="每天学习分钟数">
    ${[0, .5, 1].map(f => `<line x1="${x0}" x2="${x0 + 7 * (bw + gap) - gap}" y1="${26 + H * (1 - f)}" y2="${26 + H * (1 - f)}" stroke="var(--line)"/><text x="${x0 - 6}" y="${30 + H * (1 - f)}" text-anchor="end" class="ax">${Math.round(mx * f)}</text>`).join('')}
    ${W.days.map((d, i) => { const h = d.min / mx * H, x = x0 + i * (bw + gap); return `<g><title>${fmtMD(d.d.getTime())}：${d.min} 分钟，评分 ${d.done} 题</title>${d.min ? `<path d="M${x} ${26 + H}V${26 + H - h + 4}q0-4 4-4h${bw - 8}q4 0 4 4V${26 + H}z" fill="var(--accent)" opacity="${d.k === today ? 1 : .78}"/>` : ''}<text x="${x + bw / 2}" y="${26 + H - h - 6}" text-anchor="middle" class="vl">${d.min || ''}</text><text x="${x + bw / 2}" y="${H + 50}" text-anchor="middle" class="ax${d.k === today ? ' on' : ''}">周${nm[i]}</text></g>`; }).join('')}</svg>`;
}
function pWeekly(m) {
  const W = weekData(WK.off), P = weekData(WK.off - 1), dm = W.min - P.min;
  const end = new Date(W.t1 - DAY).getTime(), name = WK.off === 0 ? '本周' : WK.off === -1 ? '上周' : '';
  const bar = a => { const t = a[1] + a[2] + a[3] || 1; return `<div class="bar"><i style="width:${a[3] / t * 100}%;background:var(--ok)"></i><i style="width:${a[2] / t * 100}%;background:var(--mid)"></i><i style="width:${a[1] / t * 100}%;background:var(--bad)"></i></div>`; };
  const mods = Object.entries(W.mod).sort((a, b) => (b[1][1] + b[1][2] + b[1][3]) - (a[1][1] + a[1][2] + a[1][3]));
  const adv = wkAdvice(W);
  m.innerHTML = `<div class="wk-nav"><button class="btn sm ghost" data-wk="-1">‹ 上一周</button><b>${name ? name + ' · ' : ''}${fmtMD(W.t0)} – ${fmtMD(end)}</b>${WK.off < 0 ? '<button class="btn sm ghost" data-wk="1">下一周 ›</button>' : '<span class="wk-sp"></span>'}</div>
  <div class="grid g4 wk-tiles">
    <div class="card tile"><b>${fmtMin(W.min)}</b><span>学习时长</span>${W.min || P.min ? `<span class="wk-dl ${dm >= 0 ? 'up' : 'dn'}">比上周${dm >= 0 ? '多' : '少'} ${fmtMin(Math.abs(dm))}</span>` : ''}</div>
    <div class="card tile"><b>${W.done} 题</b><span>评分次数 · 涉及 ${W.rated} 道题</span></div>
    <div class="card tile"><b>${W.act} / 7 天</b><span>有学习记录的天数</span></div>
    <div class="card tile"><b>${W.dDays} 天</b><span>完成每日自测</span></div></div>
  <p class="ios-lab">每天学习时长（分钟）</p><div class="card">${W.min ? wkChart(W) : '<p class="note" style="margin:0">这一周还没有学习时长记录。</p>'}</div>
  <p class="ios-lab">本周做题情况</p><div class="card">${W.rated ? `<div class="wk-lv">${bar(W.lv)}<div class="wk-lg"><span><i style="background:var(--ok)"></i>掌握 ${W.lv[3]}</span><span><i style="background:var(--mid)"></i>模糊 ${W.lv[2]}</span><span><i style="background:var(--bad)"></i>不会 ${W.lv[1]}</span></div><p class="note" style="margin:0">按每道题本周最后一次评分统计</p></div>
    <div class="wk-mods">${mods.map(([mo, a]) => `<div class="wk-mod"><span>${mo} ${esc(MODN[mo])}</span>${bar(a)}<span class="note">${a[3]}/${a[1] + a[2] + a[3]} 掌握</span></div>`).join('')}</div>` : '<p class="note" style="margin:0">这一周还没有评分记录。</p>'}</div>
  ${W.mocks.length ? `<p class="ios-lab">模拟卷</p><div class="card">${W.mocks.map(x => `<div class="row" style="margin:0 0 6px"><span>${esc(x.title || '模拟卷')}</span><span class="sp"></span><b>${x.score} / ${x.total}</b><span class="note">${x.min} 分钟</span></div>`).join('')}</div>` : ''}
  ${WK.off === 0 || WK.off === -1 ? `<p class="ios-lab">下周建议</p><div class="card"><ul class="chg" style="margin:0">${adv.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
  <div class="row" style="margin-top:16px"><button class="btn" id="wkCp">复制周报文字</button><span class="note" id="wkMsg"></span></div>`;
  m.onclick = e => { const b = e.target.closest('[data-wk]'); if (b) { WK.off = Math.min(0, WK.off + +b.dataset.wk); pWeekly(m); } };
  $('#wkCp', m).onclick = async () => {
    const t = `食品化学复习周报（${fmtMD(W.t0)} – ${fmtMD(end)}）\n学习时长：${fmtMin(W.min)}（${W.act}/7 天有记录）\n评分：${W.done} 次，掌握 ${W.lv[3]} / 模糊 ${W.lv[2]} / 不会 ${W.lv[1]}\n每日自测：完成 ${W.dDays} 天${W.mocks.length ? `\n模拟卷：${W.mocks.map(x => x.score + '/' + x.total).join('、')}` : ''}${adv.length ? '\n下周建议：\n' + adv.map(x => '· ' + x).join('\n') : ''}`;
    try { if (window.AndroidApp && window.AndroidApp.copy) window.AndroidApp.copy(t); else await navigator.clipboard.writeText(t); $('#wkMsg').textContent = '已复制'; } catch (err) { $('#wkMsg').textContent = '无法自动复制'; }
  };
}
/* —— 已转正功能的二级页面：开关 + 说明；搜索栏页面在悬浮搜索框和侧边栏「检索」之间切换 —— */
const FEAT_PG = { recite: 'labRecite', sprint: 'labSprint', night: 'labNight', timer: 'labTimer' };
/* —— 学习功能二级页面顶部的演示动画（纯 CSS 循环播放；系统开了「减弱动态效果」时只显示最后的画面） —— */
function demoHTML(k) {
  if (k === 'labRecite') return `<div class="dm dm-rc" aria-hidden="true">
    <div class="dm-top"><span class="dm-q">影响美拉德反应的因素？</span><span class="dm-seg"><i>要点</i><i class="on">挖空</i><i>全文</i></span></div>
    <div class="dm-l"><i>1.</i><b class="k k1">温度</b><span>：温度越高，反应越快</span></div>
    <div class="dm-l"><i>2.</i><b class="k k2">pH</b><span>：碱性条件下更容易发生</span></div>
    <div class="dm-l"><i>3.</i><b class="k k3">水分活度</b><span>：中等水分活度时最快</span></div>
    <div class="dm-cap">点挖空处逐个揭开，背完可以全部收起再来一遍</div></div>`;
  if (k === 'labSprint') {
    const cols = [['今天', ['水分', '糖类']], ['明天', ['脂质', '蛋白质']], ['后天', ['色素', '酶']], ['…', ['…']], ['最后 7 天', ['错题', '模拟卷']], ['考前 2 天', ['回顾']]];
    let n = 0;
    return `<div class="dm dm-sp" aria-hidden="true"><div class="dm-sph"><span>离考试 <b>23</b> 天</span><span class="dm-bar"><i></i></span><span class="dm-flag">考试</span></div>
      <div class="dm-days">${cols.map(([d, cs], ci) => `<div class="dm-day${ci >= 4 ? ' end' : ''}"><span>${d}</span>${cs.map(c => `<b style="--d:${(n++) * .35}s">${c}</b>`).join('')}</div>`).join('')}</div></div>`;
  }
  if (k === 'labTimer') return `<div class="dm dm-tm" aria-hidden="true">
    <div class="dm-top"><span class="dm-q">简述影响淀粉糊化的因素</span><span class="tm-pill"><i class="tm-dot"></i><span class="tm-tx"><b class="tm-run">计时中 · 8 分钟</b><b class="tm-over">已超时 · 仅提醒</b></span></span></div>
    <div class="tm-bar"><i></i></div>
    <div class="tm-box"><span class="tl t1">1. 淀粉种类：直链淀粉含量高，糊化温度高</span><span class="tl t2">2. 水分含量：水分不足时难以完全糊化</span><span class="tl t3">3. 糖、盐、脂类：一般使糊化温度升高</span><span class="caret"></span></div>
    <div class="dm-cap">开始写答案时自动计时，超时只变红提醒</div></div>`;
  if (k === 'labNight') return `<div class="dm dm-nt" aria-hidden="true"><i class="st s1"></i><i class="st s2"></i><i class="st s3"></i><i class="st s4"></i><span class="moon"></span>
    <div class="dm-stack">${[['不会', '美拉德反应的条件'], ['模糊', '淀粉的糊化与老化'], ['不会', '油脂自动氧化历程']].map(([l, t], i) => `<div class="nc n${i + 1}"><b class="${l === '不会' ? 'bad' : 'mid'}">${l}</b>${t}</div>`).join('')}</div>
    <div class="dm-timer"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18"/><circle class="arc" cx="22" cy="22" r="18"/></svg><span>5 分钟</span></div>
    <div class="dm-ntcap">今天没掌握的题，睡前集中过一遍</div></div>`;
  return '';
}
function searchDemoHTML(float) {
  const res = ['<b>亚硫酸</b>盐的护色原理', '2019 · 名解 · <b>亚硫酸</b>盐', '酶促褐变的抑制方法'];
  const typed = `<span class="ty"><i>亚</i><i>硫</i><i>酸</i></span>`;
  return float ? `<div class="dm dm-sr" aria-hidden="true"><div class="dm-sk"><i></i><i></i><i></i><i></i></div>
      <div class="dm-pill"><span class="mg"></span>${typed}<span class="caret"></span></div>
      <div class="dm-res">${res.map((r, i) => `<div style="--d:${2.2 + i * .25}s">${r}</div>`).join('')}</div></div>`
    : `<div class="dm dm-sr side" aria-hidden="true"><div class="dm-sb"><i>今日</i><i>知识点</i><i>每日自测</i><i class="on">检索</i><i>进度</i></div>
      <div class="dm-pg"><div class="dm-in"><span class="mg"></span>${typed}<span class="caret"></span></div><div class="dm-res in">${res.map((r, i) => `<div style="--d:${2.2 + i * .25}s">${r}</div>`).join('')}</div></div></div>`;
}
function featPageHTML(k) {
  const f = LABS.find(x => x.k === k), sec = SET_SECS.find(x => FEAT_PG[x[0]] === k);
  return `<div class="ios-grp dm-wrap">${demoHTML(k)}</div><div class="ios-grp" style="margin-top:14px"><div class="ios-row ios-tog" data-feat="${k}" role="button">${SV(sec[2])}<span class="ios-n">${esc(sec[1])}</span><button class="switch" role="switch" aria-checked="${featOn(k)}" aria-label="${esc(sec[1])}"><i></i></button></div></div>
    <p class="ios-note">出现在：${esc(f.where)}</p>
    <p class="ios-lab">功能说明</p><div class="ios-grp ios-txt"><p>${esc(f.d)}</p><ul>${f.how.map(x => `<li>${x}</li>`).join('')}</ul></div>`;
}
function searchPageHTML() {
  const fl = featOn('labSearch'), ck = '<svg class="ck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  return `<div class="ios-grp dm-wrap">${searchDemoHTML(fl)}</div><div class="ios-grp" role="radiogroup" aria-label="搜索方式" style="margin-top:14px">
      <button class="ios-row" data-srch="float" role="radio" aria-checked="${fl}">${SV('<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><path d="M7.5 9h9"/>')}<span class="ios-n">悬浮搜索框</span>${fl ? ck : ''}</button>
      <button class="ios-row" data-srch="side" role="radio" aria-checked="${!fl}">${SV('<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><path d="M9 4.5v15"/>')}<span class="ios-n">侧边栏「检索」</span>${!fl ? ck : ''}</button></div>
    <p class="ios-note">悬浮搜索框：页面顶部常驻一个搜索框，任何页面都能随手搜，点题目直接弹出题卡，手机上在顶栏右侧的放大镜。侧边栏「检索」：在侧边栏里单独放一个「检索」页面，搜索结果占满整页。</p>`;
}

/* ---------- 设置 · 账号与同步 ---------- */
const ACCT = { email: '', sent: false };
function accountSection(pop, mode = 'login') {
  const H = pop ? '' : '<h2>账号与同步</h2>';
  if (!CLOUD.on) return `${H}<div class="${pop ? 'me-sec' : 'card'}"><p class="note" style="margin:0">在 Claude 里打开的这个版本，进度会同步到你的 Claude 账号。想和 iPad、安卓 App 同步，请用 GitHub Pages 网页版（<a href="${PWA_URL}" target="_blank" rel="noopener">${PWA_URL.replace('https://', '')}</a>）或 App 登录同一个复习站账号。</p></div>`;
  const u = CLOUD.user;
  if (u) return `${H}<div class="${pop ? 'me-sec' : 'card'} acct"><div class="row"><span class="av">${esc((u.email || '?')[0].toUpperCase())}</span><div><b>${esc(u.email || '')}</b><div class="note" id="acst">${esc(CLOUD.err || (CLOUD.lastOk ? '上次同步：' + agoText(CLOUD.lastOk) : '还没同步'))}</div></div>${pop ? '' : '<span class="sp"></span><button class="btn pri sm" id="acsync">立即同步</button><button class="btn sm ghost" id="acout">退出登录</button>'}</div>
    <p class="note" style="margin:8px 0 0">做题记录、错题本、笔记、设置、学习时间会在网页版、iPad 和安卓 App 之间自动同步：改动后 20 秒内上传，打开或回到页面时下载。没网时照常使用，联网后自动补上。${pop ? '要马上同步，可以用设置首页的「立即同步」，或在「今日」页面顶部往下拉；退出登录在设置首页最下面。' : ''}</p></div>`;
  const em = id => `<div class="af-f"><label for="${id}">邮箱</label><input type="email" id="${id}" autocomplete="email" inputmode="email" placeholder="you@example.com" value="${esc(ACCT.email)}"></div>`;
  if (mode === 'signup') return `<div class="${pop ? 'me-sec' : 'card'} acct af">
    <p class="note af-lead">注册一个复习站账号，网页版、iPad、iPhone 和安卓 App 的进度就能自动同步。这台设备上已有的进度会一起带进新账号。</p>
    ${em('suem')}
    <div class="af-f"><label for="supw">密码</label><input type="password" id="supw" autocomplete="new-password" placeholder="至少 6 位"></div>
    <div class="af-f"><label for="supw2">确认密码</label><input type="password" id="supw2" autocomplete="new-password" placeholder="再输入一次"></div>
    <button class="btn pri af-go" id="suup">注册并开始同步</button><p class="note af-msg" id="sumsg"></p></div>
    <p class="af-alt">已经有账号？<button class="lnk" data-go="acct">去登录</button></p>`;
  if (mode === 'reset') return `<div class="${pop ? 'me-sec' : 'card'} acct af">
    ${ACCT.sent ? `<div class="af-done"><b>邮件已发送</b><p class="note">重置密码的邮件已发到 <b>${esc(ACCT.email)}</b>。打开邮件里的链接设置新密码，再回来用新密码登录。没收到的话，看看垃圾邮件。</p></div><button class="btn pri af-go" data-go="acct">返回登录</button><button class="lnk af-again" id="rsagain">换个邮箱重新发送</button>`
    : `<p class="note af-lead">输入注册时用的邮箱，我们会发一封重置密码的邮件，按邮件里的链接设置新密码。</p>${em('rsem')}<button class="btn pri af-go" id="rsgo">发送重置邮件</button><p class="note af-msg" id="rsmsg"></p>`}</div>
    <p class="af-alt">想起密码了？<button class="lnk" data-go="acct">去登录</button></p>`;
  return `${H}<div class="${pop ? 'me-sec' : 'card'} acct af">
    <p class="note af-lead">登录后，网页版、iPad、iPhone 和安卓 App 的进度会自动同步。不登录也能用，进度只存在这台设备上。</p>
    ${em('acem')}
    <div class="af-f"><label for="acpw">密码</label><input type="password" id="acpw" autocomplete="current-password" placeholder="输入密码"></div>
    <button class="btn pri af-go" id="acin">登录</button><p class="note af-msg" id="acmsg"></p>
    <div class="af-links"><button class="lnk" ${pop ? 'data-go="reset"' : 'id="acrs"'}>忘记密码？</button><button class="lnk" ${pop ? 'data-go="signup"' : 'id="acup"'}>注册新账号</button></div></div>`;
}
/* ---------- 头像与账号浮窗（2.3）：侧边栏左下角显示头像和名字，点开是登录 / 账号信息 ---------- */
function meName() { return S.settings.name || (CLOUD.user && CLOUD.user.email ? CLOUD.user.email.split('@')[0] : '') || '我的复习站'; }
function avatarHTML() {
  if (S.settings.avatar) return `<img class="av-img" src="${esc(S.settings.avatar)}" alt="">`;
  const n = (S.settings.name || (CLOUD.user && CLOUD.user.email) || '').trim();
  return `<span class="av-ini">${n ? esc([...n][0].toUpperCase()) : SV('<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>')}</span>`;
}
/* 侧边栏名字下面的一行：只显示简短的同步状态（已同步 / x 分钟前同步 / 离线……），不带账号 */
function meSub() {
  const off = typeof navigator !== 'undefined' && navigator.onLine === false;
  if (!CLOUD.on) return syncOK ? '已同步' : /正在/.test(syncMsg) ? '正在同步…' : '仅保存在本机';
  if (!CLOUD.user) return '未登录 · 点击登录同步';
  if (CLOUD.busy) return '正在同步…';
  if (off) return '离线 · 联网后自动同步';
  if (CLOUD.err) return '同步出错，点开查看';
  if (!CLOUD.lastOk) return '还没同步';
  const a = agoText(CLOUD.lastOk); return a === '刚刚' ? '已同步' : `${a}同步`;
}
window.addEventListener('online', () => $$('.me-s').forEach(e => e.textContent = meSub()));
window.addEventListener('offline', () => $$('.me-s').forEach(e => e.textContent = meSub()));
function meBtnHTML() { return `<button type="button" class="me" data-me title="账号与设置"><span class="av">${avatarHTML()}</span><span class="me-t"><b>${esc(meName())}</b><span class="me-s">${esc(meSub())}</span></span><span class="me-gear" aria-hidden="true">${icon('settings')}</span></button>`; }
const ME = { open: false, user: null };
/* 头像：裁成正方形、缩到 160 像素，存成 JPEG（十几 KB），会跟着账号同步到其他设备 */
function setAvatar(file) {
  const r = new FileReader();
  r.onload = () => { const img = new Image(); img.onload = () => {
    const c = document.createElement('canvas'), n = 160; c.width = c.height = n; const g = c.getContext('2d');
    const sz = Math.min(img.width, img.height); g.drawImage(img, (img.width - sz) / 2, (img.height - sz) / 2, sz, sz, 0, 0, n, n);
    S.settings.avatar = c.toDataURL('image/jpeg', 0.85); save(); navHTML(); meFill(); toast('头像已更新');
  }; img.onerror = () => toast('这张图片打不开，换一张试试'); img.src = r.result; };
  r.readAsDataURL(file);
}
function meOpen(btn) {
  if (ME.open) return meClose(); ME.open = true;
  const ov = document.createElement('div'); ov.className = 'me-ov'; ov.id = 'meOv';
  ov.innerHTML = '<div class="me-pop" id="mePop" role="dialog" aria-label="账号"></div>'; document.body.append(ov);
  const pop = $('#mePop'), r = btn.getBoundingClientRect();
  if (innerWidth > 860) { pop.style.left = Math.max(12, r.left) + 'px'; pop.style.bottom = Math.max(12, innerHeight - r.top + 8) + 'px'; }
  else { pop.style.right = '12px'; pop.style.top = (r.bottom + 8) + 'px'; }
  meFill();
  ov.addEventListener('click', e => { if (e.target === ov) meClose(); });
}
function meClose() { const o = document.getElementById('meOv'); if (o) o.remove(); ME.open = false; }
document.addEventListener('click', e => { const b = e.target.closest('[data-me]'); if (b) { e.preventDefault(); openSettings(); } });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && ME.open) meClose(); });
/* 侧边栏放不下全部功能时，自动收紧行距，尽量不用滚动 */
function fitSide() {
  const nv = document.getElementById('sidenav'), sl = nv && nv.querySelector('.side-list'); if (!sl || !sl.offsetParent) return;
  nv.classList.remove('fit1', 'fit2', 'fit3');
  for (const c of ['fit1', 'fit2', 'fit3']) { if (sl.scrollHeight - sl.clientHeight <= 2) break; nv.classList.add(c); }
}
window.addEventListener('resize', () => fitSide());
/* ========== 设置窗口（2.5 预览）：仿 Claude iPad 版设置——居中的单栏浮窗，分组列表，点进二级页面 ========== */
const SET_SECS = [
  ['acct', '账号', '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>'],
  ['profile', '个人资料', '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c.8-3.8 3.6-5.8 7-5.8s6.2 2 7 5.8"/>'],
  ['study', '学习安排', '<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M8.5 3v4M15.5 3v4"/>'],
  ['remind', '每日学习提醒', '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'],
  ['notify', '通知', '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'],
  ['look', '外观', '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor" stroke="none"/>'],
  ['download', '下载 App', '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5"/><path d="M5 19.5h14"/>'],
  ['update', 'App 更新', '<circle cx="12" cy="12" r="8.5"/><path d="M12 16V8.5M8.8 11.5 12 8.3l3.2 3.2"/>'],
  ['backup', '备份与恢复', '<path d="M4 7c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z"/><path d="M4 7v10c0 1.7 3.6 3 8 3s8-1.3 8-3V7M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'],
  ['log', '更新日志', '<path d="M7 4h10a1 1 0 0 1 1 1v15l-3-2-3 2-3-2-3 2V5a1 1 0 0 1 1-1z"/><path d="M9 9h6M9 12.5h6"/>'],
  ['recite', '大题背诵模式', '<path d="M4 5.5c2.7-1 5.3-1 8 .8 2.7-1.8 5.3-1.8 8-.8v13c-2.7-1-5.3-1-8 .8-2.7-1.8-5.3-1.8-8-.8z"/><path d="M12 6.3v13"/>'],
  ['sprint', '冲刺计划', '<path d="M5.5 21V4.5M5.5 4.5h11l-2.2 3.7 2.2 3.8h-11"/>'],
  ['night', '睡前五分钟回顾', '<path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/>'],
  ['timer', '限时作答', '<circle cx="12" cy="13.5" r="7"/><path d="M12 9.5v4l2.5 2M9.5 3.5h5M18.5 7l1.5-1.5"/>'],
  ['search', '搜索栏', '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>'],
  ['handbook', '考前速查手册', '<path d="M6 3.5h11.5v17H6a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 6 3.5z"/><path d="M4.5 17.5A1.5 1.5 0 0 1 6 16h11.5M9 7.5h5.5M9 10.5h4"/>'],
  ['weekly', '学习周报', '<path d="M4.5 20V4M4.5 20h15"/><path d="M8.5 16v-4M12.5 16V8.5M16.5 16v-6"/>'],
  ['signup', '注册账号', '<circle cx="10" cy="8.5" r="3.5"/><path d="M3.5 20c.8-3.6 3.3-5.5 6.5-5.5 1.6 0 3 .4 4.1 1.3M18 13v6M15 16h6"/>'],
  ['reset', '找回密码', '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5M12 14.5v2"/>'],
  ['labs', '试验性功能', '<path d="M9.5 3.5h5M10.5 3.5v5.2L5.3 18.2a1.5 1.5 0 0 0 1.3 2.3h10.8a1.5 1.5 0 0 0 1.3-2.3L13.5 8.7V3.5"/><path d="M7.4 15h9.2"/>']
];

const SET_H2 = { '个人资料': 'profile', '学习安排': 'study', '外观': 'look', '每日学习提醒': 'remind', 'App 更新': 'update', '下载 App': 'download', '更新日志': 'log', '备份与恢复': 'backup' };
const SET = { open: false, sec: 'root', from: null, has: new Set(), rootTop: 0 };
const isPhone = () => innerWidth <= 860;
const SVG_X = '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>', SVG_BACK = '<path d="M14.5 5.5 8 12l6.5 6.5"/>', SVG_I = '<path d="M12 10.5V17"/><circle cx="12" cy="7.2" r=".6" fill="currentColor"/>';
const SVG_CHEV = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 6l6 6-6 6"/></svg>';
function openSettings(sec) {
  SET.sec = sec && sec !== 'acct-root' ? sec : 'root';
  if (!SET.open) {
    SET.open = true;
    const ov = document.createElement('div'); ov.className = 'set-ov'; ov.id = 'setOv';
    ov.innerHTML = `<div class="set-win" role="dialog" aria-modal="true" aria-label="设置">
      <header class="set-hd"><button class="ios-cb" data-setl aria-label="关闭"></button><h2 id="setTitle">设置</h2><button class="ios-cb" data-seti aria-label="关于与更新日志">${SV(SVG_I)}</button></header>
      <div class="set-body" id="setBody"></div></div>`;
    document.body.append(ov);
    /* ⓘ 弹窗：按到别处或开始滑动就收起（这一下只负责收起，不会顺带点开别的选项） */
    ov.addEventListener('pointerdown', e => {
      SET.swallow = false;
      if (document.getElementById('setInfo') && !e.target.closest('#setInfo, [data-seti]')) { setInfoClose(); SET.swallow = true; }
    }, true);
    ov.addEventListener('touchmove', () => { if (document.getElementById('setInfo')) setInfoClose(); }, { passive: true });
    ov.addEventListener('wheel', () => { if (document.getElementById('setInfo')) setInfoClose(); }, { passive: true });
    ov.addEventListener('click', e => {
      if (SET.swallow) { SET.swallow = false; return; }
      if (e.target === ov) return closeSettings();
      if (e.target.closest('[data-setl]')) return SET.sec === 'root' ? closeSettings() : setGo('root');
      const pop = document.getElementById('setInfo');
      if (e.target.closest('[data-seti]')) return pop ? setInfoClose() : setInfoOpen();
      if (pop && !e.target.closest('#setInfo')) { setInfoClose(); return; }
      const ia = e.target.closest('[data-info]'); if (ia) { setInfoClose(); setGo(ia.dataset.info); return; }
      const g = e.target.closest('[data-go]'); if (g) return setGo(g.dataset.go);
      const ft = e.target.closest('[data-feat]'); if (ft) { const k = ft.dataset.feat; S.settings[k] = !featOn(k); save(); $('.switch', ft).setAttribute('aria-checked', featOn(k)); const ar = document.activeElement; render(); return; }
      if (e.target.closest('[data-badge]')) return toggleBadge();
      const sr = e.target.closest('[data-srch]'); if (sr) { S.settings.labSearch = sr.dataset.srch === 'float'; save(); render(); return; }
    });
    $('#setBody').addEventListener('scroll', e => { if (document.getElementById('setInfo')) setInfoClose(); const h = document.querySelector('.set-hd'); if (h) h.classList.toggle('scrolled', e.target.scrollTop > 4); }, { passive: true });
  }
  setFill(); $('#setBody').scrollTop = 0;
}
function setInfoOpen() {
  const win = document.querySelector('.set-win'); if (!win) return;
  const plat = window.AndroidApp ? '安卓 App' : window.__PWA ? ((window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone ? '主屏幕 App' : '网页版') : '网页版';
  const ext = '<path d="M13.5 4.5h6v6M19.5 4.5l-8 8"/><path d="M17.5 13.5v4.5a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4.5"/>';
  const d = document.createElement('div'); d.id = 'setInfo'; d.className = 'set-info'; d.setAttribute('role', 'menu');
  d.innerHTML = `<div class="si-v">食品化学复习站 v${esc(APP_VERSION)}<br><span>${esc(plat)}</span></div><hr>
    <button data-info="log" role="menuitem">${SV('<path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20V4a.5.5 0 0 1 .5-.5z"/><path d="M14 3.5V8h4"/>')}<span>更新日志</span></button>
    ${SET.has.has('download') ? `<hr><button data-info="download" role="menuitem">${SV(ext)}<span>下载其他平台的 App</span></button>` : ''}`;
  win.append(d);
}
function setInfoClose() { const d = document.getElementById('setInfo'); if (!d) return; d.removeAttribute('id'); d.classList.add('out'); setTimeout(() => d.remove(), 160); }
function closeSettings() { const o = document.getElementById('setOv'); if (o) o.remove(); SET.open = false; }
function setGo(k) {
  const body = $('#setBody'), back = k === 'root';
  if (!back && SET.sec === 'root') SET.rootTop = body.scrollTop;
  SET.sec = k; setView(back ? 'pop' : 'push');
  body.scrollTop = back ? SET.rootTop : 0;
}
document.addEventListener('keydown', e => { if (e.key === 'Escape' && SET.open && !document.querySelector('#modal > *')) { if (document.getElementById('setInfo')) setInfoClose(); else if (SET.sec !== 'root') setGo('root'); else closeSettings(); } });
const fmtExam = d => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d || ''); return m ? `${+m[2]} 月 ${+m[3]} 日` : ''; };
/* 把原来设置页的内容拆成分组放进二级页面；首页是分组列表，外观直接放在首页 */
function setFill() {
  const body = document.getElementById('setBody'); if (!body) return;
  const keep = body.scrollTop, st = S.settings;
  pSettings(body);
  const groups = {}; let cur = null;
  for (const n of [...body.children]) {
    if (n.tagName === 'H2') { cur = SET_H2[n.textContent.trim()] || null; if (cur) groups[cur] = document.createElement('div'); n.remove(); continue; }
    if (cur) groups[cur].append(n); else n.remove();
  }
  if (groups.log) groups.log.innerHTML = `<p class="ios-foot" style="margin-top:0">食品化学复习站 v${esc(APP_VERSION)} · 共 ${CHANGELOG.length} 个版本</p><div class="card">${CHANGELOG.map((c, i) => `<details class="chlog" ${i === 0 ? 'open' : ''}><summary><b class="cv">v${esc(c.v)}</b><span class="ct">${esc(c.t)}</span><span class="note cd">${esc(c.d)}</span></summary>${logItems(c)}</details>`).join('')}</div>`;
  /* 账号页：头像 + 登录/同步 */
  const acct = document.createElement('div');
  acct.innerHTML = `<div class="ios-grp ios-avatar"><label class="av big" title="更换头像">${avatarHTML()}<input type="file" accept="image/*" id="avIn" hidden></label><b class="set-nm">${esc(meName())}</b><span class="note">${CLOUD.user ? esc(CLOUD.user.email || '') : CLOUD.on ? '还没登录' : '在 Claude 里使用'}</span>
    <div class="me-avb"><label class="btn sm" for="avIn">更换头像</label>${S.settings.avatar ? '<button class="btn sm ghost" data-avrm>移除头像</button>' : ''}</div></div>
    <p class="ios-lab">账号与同步</p>${accountSection(true).replace('class="me-sec', 'class="card me-sec')}`;
  groups.acct = acct;
  if (CLOUD.on && !CLOUD.user) for (const k of ['signup', 'reset']) { const d = document.createElement('div'); d.innerHTML = accountSection(true, k).replace('class="me-sec', 'class="card me-sec'); groups[k] = d; }
  /* 外观：风格四宫格 + 浅色/深色/系统三宫格 */
  const look = groups.look; delete groups.look;
  if (look) {
    const th = $('#th', look);
    if (th) { const v = st.theme || ''; th.className = 'th-tiles'; th.innerHTML = [['light', '浅色', 'l'], ['dark', '深色', 'd'], ['', '系统', 's']].map(([k, n, c]) => `<button data-v="${k}" aria-pressed="${v === k}"><span class="thpv ${c}" aria-hidden="true"><i></i><i></i><em></em></span><span>${n}</span></button>`).join(''); }
    const sk = $('#sk', look); if (sk) sk.classList.add('n' + sk.children.length);
    const zm = $('#zm', look); if (zm) zm.closest('.row').classList.add('ios-inline');
    const ga = $('#glassA', look); if (ga) ga.closest('.row').classList.add('ios-inline');
    const md = $('#md3d', look); if (md) md.closest('.row').classList.add('ios-inline');
    $$('.lab', look).forEach(l => { if (l.textContent === '颜色') l.textContent = '颜色模式'; });
  }
  body.innerHTML = '';
  SET.has = new Set();
  const pages = {};
  for (const [k, f] of Object.entries(FEAT_PG)) { const d = document.createElement('div'); d.innerHTML = featPageHTML(f); groups[k] = d; }
  { const d = document.createElement('div'); d.innerHTML = searchPageHTML(); groups.search = d; }
  { const d = document.createElement('div'); d.innerHTML = notifyHTML(); if (groups.remind) { const l = document.createElement('p'); l.className = 'ios-lab'; l.textContent = '每日学习提醒'; d.append(l, ...groups.remind.childNodes); delete groups.remind; } if (BADGE_OK || HAS_REM) groups.notify = d; }
  for (const k of ['handbook', 'weekly']) { const d = document.createElement('div'); d.innerHTML = '<div class="lz"></div>'; groups[k] = d; }
  { const lp = document.createElement('div'); pLabs(lp); $$('.kick, h1', lp).forEach(x => x.remove()); const ld = $('.lead', lp); if (ld) ld.className = 'ios-note';
    lp.addEventListener('click', e => { if (e.target.closest('[data-sw]')) navHTML(); }); groups.labs = { childNodes: [lp] }; }
  for (const [k] of SET_SECS) if (groups[k]) { const pg = document.createElement('div'); pg.className = 'set-pg'; pg.dataset.p = k; pg.append(...groups[k].childNodes); pages[k] = pg; SET.has.add(k); }
  /* 首页 */
  const row = k => { const s = SET_SECS.find(x => x[0] === k); if (!s || !SET.has.has(k)) return '';
    return `<button class="ios-row" data-go="${k}">${SV(s[2])}<span class="ios-n">${s[1]}</span>${SVG_CHEV}</button>`; };
  const root = document.createElement('div'); root.className = 'set-pg'; root.dataset.p = 'root';
  root.innerHTML = `<div class="ios-grp"><button class="ios-me" data-go="acct"><span class="av">${avatarHTML()}</span><span class="ios-me-t"><b>${esc(meName())}</b><span class="note">${CLOUD.user ? esc(CLOUD.user.email || '') + ' · ' + esc(meSub()) : CLOUD.on ? '未登录 · 进度只保存在这台设备' : '在 Claude 里使用'}</span></span></button>
      ${CLOUD.on ? CLOUD.user ? `<button class="ios-row acc" data-rsync>${SV('<path d="M19.5 12a7.5 7.5 0 0 1-13 5.1M4.5 12a7.5 7.5 0 0 1 13-5.1M17.5 3.5v3.6h-3.6M6.5 20.5v-3.6h3.6"/>')}<span class="ios-n">立即同步</span><span class="ios-v" id="rsyncSt"></span></button>` : `<button class="ios-row acc" data-go="acct">${SV('<path d="M12 5v14M5 12h14"/>')}<span class="ios-n">登录或注册账号</span></button>` : ''}</div>
    <p class="ios-lab">学习</p><div class="ios-grp">${row('profile')}${row('study')}${row('notify')}</div>
    <p class="ios-lab">学习功能</p><div class="ios-grp">${row('recite')}${row('sprint')}${row('night')}${row('timer')}${row('search')}</div>
    <p class="ios-lab">复习工具</p><div class="ios-grp">${row('handbook')}${row('weekly')}</div>
    <p class="ios-lab">应用程序</p><div class="ios-grp">${row('update')}${row('backup')}${row('labs').replace('</span>' + SVG_CHEV, '<sup class="beta">beta</sup></span>' + SVG_CHEV)}</div>
    ${look ? `<p class="ios-lab">外观</p><div class="ios-grp set-look"></div>` : ''}
    ${CLOUD.user ? `<div class="ios-grp" style="margin-top:22px"><button class="ios-row red" data-rout>${SV('<path d="M10 4.5H6a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 6 19.5h4M14.5 8l4 4-4 4M9.5 12h9"/>')}<span class="ios-n">退出登录</span></button></div>` : ''}`;
  if (look) { const c = look.querySelector(':scope > .card'); $('.set-look', root).append(...(c ? c.childNodes : look.childNodes)); }
  body.append(root, ...Object.values(pages));
  bindAccount(body);
  $('#avIn', body).onchange = e => { const f = e.target.files && e.target.files[0]; if (f) setAvatar(f); };
  const rm = $('[data-avrm]', body); if (rm) rm.onclick = () => { delete S.settings.avatar; save(); navHTML(); setFill(); };
  const rs = $('[data-rsync]', body); if (rs) rs.onclick = async () => { $('#rsyncSt').textContent = '正在同步…'; await cloudSync(); const e = $('#rsyncSt'); if (e) { e.textContent = CLOUD.err ? '同步失败' : '已同步'; setTimeout(() => { if (e.isConnected) e.textContent = ''; }, 2500); } };
  const ro = $('[data-rout]', body); if (ro) ro.onclick = () => { if (!ro.dataset.c) { ro.dataset.c = 1; $('.ios-n', ro).textContent = '再点一次确认退出'; return; } cloudSync({ quiet: true }).finally(() => { cloudSignOut(); render(); meFill(); toast('已退出登录，这台设备上的进度还保留着'); }); };
  if (SET.sec !== 'root' && !SET.has.has(SET.sec)) SET.sec = 'root';
  setView();
  body.scrollTop = keep;
}
function setView(anim) {
  const win = document.querySelector('.set-win'); if (!win) return;
  const root = SET.sec === 'root';
  { const ie = win.querySelector(`.set-pg[data-p="${SET.sec}"] input[type=email]`); if (ie && !ie.value && ACCT.email) ie.value = ACCT.email; }   /* 登录页填过的邮箱带到注册、找回密码页 */
  const lz = { handbook: pHandbook, weekly: pWeekly }[SET.sec]; if (lz) { const w = win.querySelector(`.set-pg[data-p="${SET.sec}"] .lz`); if (w && !w.dataset.ok) { w.dataset.ok = 1; lz(w); } }
  $$('.set-pg', win).forEach(p => { p.hidden = p.dataset.p !== SET.sec; p.classList.remove('push', 'pop'); if (!p.hidden && anim) { void p.offsetWidth; p.classList.add(anim); } });
  const t = SET_SECS.find(x => x[0] === SET.sec); $('#setTitle').textContent = root ? '设置' : t ? t[1] : '设置';
  const l = $('[data-setl]'); l.innerHTML = SV(root ? SVG_X : SVG_BACK); l.setAttribute('aria-label', root ? '关闭' : '返回');
  $('[data-seti]').classList.toggle('off', !root);
}
/* 账号相关的刷新（登录、退出、上传头像后）统一走这里 */
function meFill() { if (SET.open) setFill(); }

function bindAccount(m) {
  if (!CLOUD.on) return;
  const ok = (j, email, signup) => { setUser(j, email); ACCT.sent = false; if (SET.open) SET.sec = 'acct'; return cloudSync().then(() => { render(); meFill(); toast(signup ? '注册成功，已开始同步' : '登录成功，进度已同步'); }); };
  if (CLOUD.user) {
    const sy = $('#acsync', m), out = $('#acout', m);
    if (sy) sy.onclick = async () => { $('#acst').textContent = '正在同步……'; await cloudSync(); const e = $('#acst'); if (e) e.textContent = CLOUD.err || '上次同步：' + agoText(CLOUD.lastOk); };
    if (out) out.onclick = () => { if (!out.dataset.c) { out.dataset.c = 1; out.textContent = '再点一次确认退出'; return; } cloudSync({ quiet: true }).finally(() => { cloudSignOut(); render(); meFill(); toast('已退出登录，这台设备上的进度还保留着'); }); };
    return;
  }
  $$('#acem, #suem, #rsem', m).forEach(i => i.addEventListener('input', () => { ACCT.email = i.value.trim(); }));
  /* 登录 */
  const inB = $('#acin', m);
  if (inB) {
    const msg = t => { const e = $('#acmsg', m); if (e) e.textContent = t; };
    const go = async () => {
      const email = $('#acem', m).value.trim(), pw = $('#acpw', m).value;
      if (!email) return msg('请先填写邮箱'); if (!pw) return msg('请输入密码');
      msg('登录中……'); inB.disabled = true;
      try { const j = await fbAuth('accounts:signInWithPassword', { email, password: pw, returnSecureToken: true }); msg('登录成功，正在同步……'); await ok(j, email); }
      catch (e) { msg(authErr(e.message)); } finally { inB.disabled = false; }
    };
    inB.onclick = go; $('#acpw', m).onkeydown = e => { if (e.key === 'Enter') go(); };
    const up = $('#acup', m), rs = $('#acrs', m);   /* 不在设置窗口里时，打开设置里的对应页面 */
    if (up) up.onclick = () => openSettings('signup'); if (rs) rs.onclick = () => openSettings('reset');
  }
  /* 注册 */
  const suB = $('#suup', m);
  if (suB) {
    const msg = t => { const e = $('#sumsg', m); if (e) e.textContent = t; };
    const go = async () => {
      const email = $('#suem', m).value.trim(), pw = $('#supw', m).value, pw2 = $('#supw2', m).value;
      if (!email) return msg('请先填写邮箱'); if (pw.length < 6) return msg('密码至少要 6 位'); if (pw !== pw2) return msg('两次输入的密码不一样');
      msg('注册中……'); suB.disabled = true;
      try { const j = await fbAuth('accounts:signUp', { email, password: pw, returnSecureToken: true }); msg('注册成功，正在把这台设备的进度带进新账号……'); await ok(j, email, true); }
      catch (e) { msg(authErr(e.message)); } finally { suB.disabled = false; }
    };
    suB.onclick = go; $('#supw2', m).onkeydown = e => { if (e.key === 'Enter') go(); };
  }
  /* 找回密码 */
  const rsB = $('#rsgo', m);
  if (rsB) {
    const msg = t => { const e = $('#rsmsg', m); if (e) e.textContent = t; };
    const go = async () => {
      const email = $('#rsem', m).value.trim(); if (!email) return msg('请先填写邮箱');
      msg('正在发送……'); rsB.disabled = true;
      try { await fbAuth('accounts:sendOobCode', { requestType: 'PASSWORD_RESET', email }); ACCT.email = email; ACCT.sent = true; meFill(); }
      catch (e) { msg(authErr(e.message)); } finally { rsB.disabled = false; }
    };
    rsB.onclick = go; $('#rsem', m).onkeydown = e => { if (e.key === 'Enter') go(); };
  }
  const ag = $('#rsagain', m); if (ag) ag.onclick = () => { ACCT.sent = false; meFill(); };
}

/* ---------- 设置 ---------- */
function greet() { const h = new Date().getHours(); return h < 5 ? '夜深了' : h < 11 ? '早上好' : h < 13 ? '中午好' : h < 18 ? '下午好' : '晚上好'; }
/* ---------- 设置的二级页面：全部更新日志 ---------- */
function pChangelog(m) {
  m.innerHTML = `<a class="sub-back" href="#settings">‹ 打开设置</a><div class="kick">CHANGELOG · 更新日志</div><h1>更新日志</h1><p class="lead">当前版本 v${esc(APP_VERSION)}，共 ${CHANGELOG.length} 个版本。每次更新后第一次打开会弹出说明，以后都可以在这里翻看。</p>
  <div class="card">${CHANGELOG.map((c, i) => `<details class="chlog" ${i === 0 ? 'open' : ''}><summary><b class="cv">v${esc(c.v)}</b><span class="ct">${esc(c.t)}</span><span class="note cd">${esc(c.d)}</span></summary>${logItems(c)}</details>`).join('')}</div>`;
}
function pSettings(m) {
  const st = S.settings;
  const seg = (id, opts, cur) => `<div class="seg" id="${id}">${opts.map(([v, n]) => `<button data-v="${v}" aria-pressed="${String(cur) === String(v)}">${n}</button>`).join('')}</div>`;
  m.innerHTML = `<div class="kick">SETTINGS</div><h1>设置</h1><p class="lead">个人信息、学习安排和外观都在这里，改完自动保存。</p>
  <h2>个人资料</h2><div class="card form">
    <div class="row"><label for="nm">你的名字</label><input type="text" id="nm" maxlength="20" placeholder="例如：小林" value="${esc(st.name || '')}"><span class="note">填写后首页显示「${greet()} ${esc(st.name || 'xxx')}」和「欢迎回来」</span></div>
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
  ${HAS_UPD ? `<h2>App 更新</h2><div class="card"><div class="row"><span>当前版本 <b>v${esc(APP_VERSION)}</b></span><span class="sp"></span><button class="btn" id="chk">检查更新</button></div><p class="note" id="ust" style="margin-bottom:0">${IS_APK ? '联网时打开 App' : '打开复习站'}或从后台切回来时会自动检查；有新版本会弹出提示，${IS_APK ? '可以直接下载安装' : '点「立即更新」几秒就好'}，学习进度不会丢失。</p></div>` : ''}
  <h2 id="changelog">更新日志</h2><div class="card"><p class="note" style="margin-top:0">当前版本 v${esc(APP_VERSION)}。下面是最新一次更新，以前的版本点「查看全部更新日志」。</p>
    ${CHANGELOG.slice(0, 1).map(c => `<details class="chlog" open><summary><b class="cv">v${esc(c.v)}</b><span class="ct">${esc(c.t)}</span><span class="note cd">${esc(c.d)}</span></summary>${logItems(c)}</details>`).join('')}
    <a class="chlog-all" href="#changelog"><span>查看全部更新日志</span><span class="note">共 ${CHANGELOG.length} 个版本</span><span class="chev" aria-hidden="true">›</span></a></div>
  <h2>备份与恢复</h2><div class="card"><p class="note">同步状态：<span class="sync">${esc(syncMsg)}</span></p>${window.AndroidApp ? '<p class="note">进度保存在这台手机里，不联网也能用。卸载 App 或清除应用数据会清空进度，建议隔一段时间点「生成备份 → 分享备份」，存一份到网盘或聊天记录里。</p>' : window.__PWA ? '<p class="note">进度保存在这台 iPad 里，不联网也能用。从主屏幕删除这个图标会清空进度，建议隔一段时间点「生成备份 → 复制」，把文字存到备忘录或发给自己。</p>' : ''}<p class="note">进度会自动保存。想手动备份时，点「生成备份」后复制文本保存；恢复时把文本粘贴进来点「导入」。</p><div class="row"><button class="btn" id="exp">生成备份</button><button class="btn" id="cp" hidden>复制</button><button class="btn" id="imp">导入</button><span class="sp"></span><button class="btn ghost" id="rst">清空全部进度</button></div><textarea id="bk" style="margin-top:8px" aria-label="备份文本" placeholder="备份文本"></textarea><p class="note" id="bkm"></p></div>`;
  m.addEventListener('click', async e => { const b = e.target.closest('[data-cp]'); if (!b) return; const t = b.dataset.cp;
    try { if (window.AndroidApp) window.AndroidApp.copy(t); else await navigator.clipboard.writeText(t); b.textContent = '已复制'; } catch (err) { prompt('复制这个网址：', t); } });
  if (location.hash === '#settings' && pSettings.jump) { const j = pSettings.jump; pSettings.jump = null; setTimeout(() => { const t = document.getElementById(j); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300); }
  if (HAS_UPD) $('#chk').onclick = () => appCheck(true);
  const txt = (id, k) => $('#' + id).addEventListener('change', e => { st[k] = e.target.value.trim(); save();
    if (k === 'name') { navHTML(); document.querySelectorAll('.set-ov .me-t b, .set-ov .set-nm').forEach(b => b.textContent = meName()); } });
  txt('nm', 'name'); txt('gl', 'goal'); txt('mt2', 'motto');
  $('#nm').addEventListener('input', e => { $('#nm').nextElementSibling.textContent = `填写后首页显示「${greet()} ${e.target.value.trim() || 'xxx'}」和「欢迎回来」`; });
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

/* ================= 2.9 原生 App 体验 ================= */
/* 当前负责滚动的容器：App 外壳里是内容区 main，普通网页里是整个窗口 */
function scroller() { const mm = document.getElementById('main'); if (mm) { const o = getComputedStyle(mm).overflowY; if ((o === 'auto' || o === 'scroll') && mm.clientHeight < innerHeight + 2 && mm.scrollHeight > mm.clientHeight) return mm; } return window; }
const getScroll = () => { const s = scroller(); return s === window ? window.scrollY : s.scrollTop; };
const setScroll = y => { const s = scroller(); if (s === window) window.scrollTo(0, y); else s.scrollTop = y; const mm = document.getElementById('main'); if (s === window && mm) mm.scrollTop = 0; };
const scrollTopSmooth = () => { const s = scroller(); s.scrollTo({ top: 0, behavior: 'smooth' }); };
/* 各页面的滚动位置：从标签栏、侧栏切换时回到上次的位置；再点一次当前标签回到顶部 */
const SCROLL = {}; let navTab = false; const navStack = [location.hash.slice(1) || 'today'];
const NOSTACK = ['settings', 'labs', 'handbook', 'weekly'];
window.addEventListener('hashchange', () => {
  if (SET.open && !['#settings', '#labs', '#handbook', '#weekly'].includes(location.hash)) closeSettings();
  const prev = render.last, cur = location.hash.slice(1) || 'today';
  if (prev) SCROLL[prev] = getScroll();
  if (!NOSTACK.includes(cur)) { if (navStack.length > 1 && navStack[navStack.length - 2] === cur) navStack.pop(); else if (navStack[navStack.length - 1] !== cur) navStack.push(cur); if (navStack.length > 40) navStack.shift(); }
  setScroll(0); render();
  if (navTab && SCROLL[cur]) setScroll(SCROLL[cur]);
  navTab = false;
});
document.addEventListener('click', e => {
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
  const a = e.target.closest('a[href^="#"]'); if (!a || a.target === '_blank') return;
  const h = a.getAttribute('href').slice(1), cur = location.hash.slice(1) || 'today', tab = a.matches('#bnav a, #sidenav a, #topnav nav a');
  if (tab && !a.dataset.jump && h === cur) { e.preventDefault(); scrollTopSmooth(); return; }
  if (tab) navTab = true;
  if (NAV_REPLACE && h && h !== cur && !a.dataset.jump) { e.preventDefault(); goHash(h); }
}, true);
/* 点顶栏（按钮以外的地方）回到顶部，代替系统「点状态栏回顶部」 */
document.addEventListener('click', e => { const b = e.target.closest('#topnav .bar1'); if (b && !e.target.closest('button, a, input')) scrollTopSmooth(); });

/* —— 手势：从屏幕左边缘右滑返回；浮窗（题卡、设置）在顶部时下滑关闭 —— */
function scrollParent(el) { for (let n = el; n && n !== document.body; n = n.parentElement) { const o = getComputedStyle(n).overflowY; if ((o === 'auto' || o === 'scroll') && n.scrollHeight > n.clientHeight + 1) return n; } return null; }
function trackTouch(start, onMove, onEnd) {
  const mv = e => onMove(e), en = e => { document.removeEventListener('touchmove', mv); document.removeEventListener('touchend', en); document.removeEventListener('touchcancel', en); onEnd(e); };
  document.addEventListener('touchmove', mv, { passive: false }); document.addEventListener('touchend', en); document.addEventListener('touchcancel', en);
}
document.addEventListener('touchstart', e => {
  if (e.touches.length !== 1) return;
  const t = e.touches[0], de = document.documentElement;
  /* 左边缘右滑 */
  if (t.clientX <= 22 && !document.querySelector('#modal > *, .set-ov, .upd-ov, .gs-ov') && !de.classList.contains('drawer')) {
    const pg = document.querySelector('#main > div'); if (!pg) return;
    /* 返回交给系统自带的边缘右滑；只有在没有上一页可回时，右滑拉出侧栏 */
    const canBack = false, canDrawer = (NAV_REPLACE ? history.length <= 1 : navStack.length <= 1 && history.length <= 1) && de.getAttribute('data-skin') === 'glass' && innerWidth <= 860;
    if (!canDrawer) return;
    const s = { x0: t.clientX, y0: t.clientY, t0: Date.now(), dx: 0, on: false };
    trackTouch(e, ev => {
      const p = ev.touches[0], dx = p.clientX - s.x0, dy = p.clientY - s.y0;
      if (!s.on) { if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { s.dead = true; return; } if (s.dead || dx < 8) return; s.on = true; }
      ev.preventDefault(); s.dx = Math.max(0, dx);
      if (canBack) { pg.style.transition = 'none'; pg.style.transform = `translateX(${s.dx}px)`; pg.style.boxShadow = '-14px 0 36px rgba(0,0,0,.14)'; }
      else if (s.dx > 36) { drawer(true); s.on = false; s.dead = true; }
    }, () => {
      if (!s.on || !canBack) return;
      const v = s.dx / Math.max(1, Date.now() - s.t0);
      if (s.dx > 90 || (v > .5 && s.dx > 30)) { pg.style.transition = 'transform .18s ease-out'; pg.style.transform = `translateX(${innerWidth}px)`; setTimeout(() => history.back(), 170); }
      else { pg.style.transition = 'transform .28s cubic-bezier(.2,.9,.3,1.1)'; pg.style.transform = ''; setTimeout(() => { pg.style.boxShadow = ''; pg.style.transition = ''; }, 300); }
    });
    return;
  }
  /* 手机侧栏：向左划收回 */
  if (de.classList.contains('drawer') && e.target.closest('#sidenav')) {
    const nv = document.getElementById('sidenav'), sc = document.getElementById('drScrim'), s = { x0: t.clientX, y0: t.clientY, t0: Date.now(), dx: 0, on: false };
    trackTouch(e, ev => {
      const p = ev.touches[0], dx = p.clientX - s.x0, dy = p.clientY - s.y0;
      if (!s.on) { if (s.dead) return; if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { s.dead = true; return; } if (dx > -8) return; s.on = true; }
      ev.preventDefault(); s.dx = Math.min(0, dx);
      nv.style.transition = 'none'; nv.style.transform = `translateX(${s.dx}px)`; if (sc) { sc.style.transition = 'none'; sc.style.opacity = Math.max(0, 1 + s.dx / nv.offsetWidth); }
    }, () => {
      if (!s.on) return;
      const v = -s.dx / Math.max(1, Date.now() - s.t0), close = -s.dx > 80 || (v > .5 && -s.dx > 24);
      nv.style.transition = ''; nv.style.transform = ''; if (sc) { sc.style.transition = ''; sc.style.opacity = ''; }
      if (close) drawer(false);
    });
    return;
  }
  /* 浮窗下滑关闭（手机） */
  if (innerWidth > 860) return;
  const el = e.target; if (el.closest('input, textarea, select, .seg, .dm-days, .zoomable, .sheet-wrap')) return;
  let tgt = el.closest('#modal .modal > .card'), close = null;
  if (tgt) close = () => { const x = document.querySelector('#modal [data-x]'); if (x) x.click(); else document.getElementById('modal').innerHTML = ''; };
  else if ((tgt = el.closest('.set-win'))) close = () => closeSettings();
  if (!tgt) return;
  const sc = scrollParent(el), s = { y0: t.clientY, x0: t.clientX, t0: Date.now(), dy: 0, on: false };
  trackTouch(e, ev => {
    const p = ev.touches[0], dy = p.clientY - s.y0, dx = p.clientX - s.x0;
    if (!s.on) { if (s.dead) return; if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) { s.dead = true; return; } if (dy > 8 && (!sc || sc.scrollTop <= 0)) s.on = true; else { if (Math.abs(dy) > 8) s.dead = true; return; } }
    ev.preventDefault(); s.dy = Math.max(0, dy - 8);
    tgt.style.transition = 'none'; tgt.style.transform = `translateY(${s.dy}px)`;
  }, () => {
    if (!s.on) return;
    const v = s.dy / Math.max(1, Date.now() - s.t0);
    if (s.dy > 120 || (v > .6 && s.dy > 40)) { tgt.style.transition = 'transform .22s ease-in'; tgt.style.transform = `translateY(${innerHeight}px)`; setTimeout(close, 200); }
    else { tgt.style.transition = 'transform .3s cubic-bezier(.2,.9,.3,1.1)'; tgt.style.transform = ''; setTimeout(() => { tgt.style.transition = ''; }, 320); }
  });
}, { passive: true });

/* —— 下拉同步：在页面顶部继续往下拉，松手后和云端同步一次 —— */
(function () {
  let el = null, touching = false, armed = false, busy = false;
  const ensure = () => {
    if (!el) { el = document.createElement('div'); el.id = 'ptr'; el.className = 'ptr'; el.innerHTML = '<span class="ptr-ic"></span><span class="ptr-t"></span>'; document.body.append(el); }
    const mm = document.getElementById('main'), mr = mm && mm.getBoundingClientRect(), tn = document.getElementById('topnav'), tr = tn && tn.getBoundingClientRect();
    const gp = document.getElementById('gsPill'), gr = gp && getComputedStyle(gp).display !== 'none' ? gp.getBoundingClientRect() : null;
    let top = 12, left = innerWidth / 2;
    if (innerWidth <= 860) { if (tr && tr.height) { const fh = parseFloat(getComputedStyle(tn, '::before').height); top = Math.max(tr.bottom + 16, fh ? tr.top + fh - 14 : 0); } }
    else { if (mr) left = mr.left + mr.width / 2; top = gr && gr.height ? gr.bottom + 10 : (mr ? mr.top + 12 : 12); }
    el.style.top = top + 'px'; el.style.left = left + 'px'; return el;
  };
  const hide = () => { if (el && !busy) { el.classList.remove('on', 'arm'); el.style.opacity = 0; setTimeout(() => { if (el && !busy && el.style.opacity === '0') el.classList.remove('done', 'fail'); }, 250); } };
  const onScroll = () => {
    if (!touching || busy || !CLOUD.user || (location.hash.slice(1) || 'today') !== 'today') return;
    const y = getScroll(); if (y >= -4) { hide(); armed = false; return; }
    const d = -y; ensure(); el.classList.remove('done', 'fail'); el.classList.add('on'); el.style.opacity = Math.min(1, d / 60);
    armed = d > 72; el.classList.toggle('arm', armed); el.querySelector('.ptr-t').textContent = armed ? '松开同步' : '下拉同步';
    el.querySelector('.ptr-ic').style.transform = `rotate(${Math.min(d, 72) * 4}deg)`;
  };
  document.addEventListener('touchstart', () => { touching = true; }, { passive: true });
  document.addEventListener('touchend', () => {
    touching = false; if (!armed || busy) { hide(); return; }
    armed = false; busy = true; ensure(); el.classList.remove('done', 'fail'); el.classList.add('busy'); el.querySelector('.ptr-ic').style.transform = ''; el.querySelector('.ptr-t').textContent = '正在同步…';
    Promise.resolve(cloudSync()).catch(() => { }).finally(() => { busy = false; el.classList.remove('busy', 'arm'); el.classList.add(CLOUD.err ? 'fail' : 'done'); el.querySelector('.ptr-t').textContent = CLOUD.err ? '同步失败' : '已同步'; setTimeout(hide, 1200); });
  }, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('scroll', e => { if (e.target && e.target.id === 'main') onScroll(); }, { passive: true, capture: true });
})();

/* —— 底部标签栏的液态玻璃放大镜：按住标签栏左右滑，跟着手指走，松手切换到对应页面 —— */
(function () {
  let st = null, swallow = 0;
  const items = bn => [...bn.querySelectorAll(':scope > a, :scope > button')];
  const nearest = (bn, x) => { let best = null, bd = 1e9; for (const it of items(bn)) { const r = it.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - x); if (d < bd) { bd = d; best = it; } } return best; };
  function place(x, S0 = st) {
    const { lens, inner, br, w, h } = S0;
    const cx = Math.max(br.left + w / 2 - 6, Math.min(br.right - w / 2 + 6, x)), left = cx - w / 2 - br.left;
    lens.style.transform = `translate3d(${left}px, 0, 0) scale(${S0.sc})`;
    inner.style.transform = `translate3d(${-left}px, ${(h - br.height) / 2}px, 0)`;
    inner.style.transformOrigin = `${w / 2}px ${h / 2}px`;
  }
  document.addEventListener('pointerdown', e => {
    const bn = e.target.closest('#bnav'); if (!bn || document.documentElement.getAttribute('data-skin') !== 'glass' || innerWidth > 860 || (e.pointerType === 'mouse' && e.button)) return;
    e.preventDefault();   /* 不让浏览器把它当成拖动链接 */
    const br = bn.getBoundingClientRect(), it = nearest(bn, e.clientX), ir = it.getBoundingClientRect();
    const w = ir.width + 22, h = br.height + 14;
    const lens = document.createElement('div'); lens.className = 'bn-lens'; lens.style.width = w + 'px'; lens.style.height = h + 'px'; lens.style.top = (-(h - br.height) / 2) + 'px';
    const inner = document.createElement('div'); inner.className = 'bn-lens-in'; inner.style.width = br.width + 'px'; inner.style.height = br.height + 'px';
    inner.innerHTML = items(bn).map(x => x.outerHTML).join('');
    lens.append(inner); bn.append(lens); bn.classList.add('lensing');
    st = { bn, lens, inner, br, w, h, x0: e.clientX, moved: false, sc: .86, id: e.pointerId };
    try { bn.setPointerCapture(e.pointerId); } catch (_) { }
    place(e.clientX); requestAnimationFrame(() => { if (st) { st.sc = 1; lens.classList.add('on'); place(e.clientX); } });
  });
  document.addEventListener('pointermove', e => { if (!st || e.pointerId !== st.id) return; if (Math.abs(e.clientX - st.x0) > 6) st.moved = true; place(e.clientX); }, { passive: true });
  const finish = (e, go) => {
    if (!st || (e && e.pointerId !== st.id)) return; const s = st; st = null;
    const it = go ? nearest(s.bn, e.clientX) : null;
    s.sc = .9;
    if (it) { const r = it.getBoundingClientRect(); place(r.left + r.width / 2, s); } s.lens.classList.remove('on'); s.lens.classList.add('off');
    setTimeout(() => { s.lens.remove(); s.bn.classList.remove('lensing'); }, 220);
    if (!it) return;
    swallow = Date.now();
    if (it.tagName === 'A') { const h = it.getAttribute('href').slice(1); if (h === (location.hash.slice(1) || 'today')) scrollTopSmooth(); else { navTab = true; goHash(h); } }
    else it.click();
  };
  document.addEventListener('pointerup', e => finish(e, true));
  document.addEventListener('pointercancel', e => finish(e, false));
  document.addEventListener('click', e => { if (Date.now() - swallow < 500 && e.target.closest('#bnav')) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
})();

/* —— iOS 26 主屏幕 App 的状态栏颜色取自页面顶部的固定元素：放一条和顶栏同色的细条，风格变了或浮窗关掉后重新放一次，让系统重新取色 —— */
function sbColor() {
  const de = document.documentElement, sk = de.getAttribute('data-skin') || '', th = de.getAttribute('data-theme');
  const dark = th === 'dark' || (!th && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  if (sk === 'glass') return dark ? '#251a1d' : '#f6e5dd';
  const ok = c => c && !/rgba\(.*,\s*0\)$/.test(c) && c !== 'transparent';
  const tn = document.getElementById('topnav'); let c = tn && innerWidth <= 860 ? getComputedStyle(tn).backgroundColor : '';
  if (!ok(c)) c = getComputedStyle(document.body).backgroundColor; if (!ok(c)) c = getComputedStyle(de).getPropertyValue('--bg').trim();
  return c;
}
function syncStatusBar() {
  const de = document.documentElement, c = sbColor(); if (!c) return;
  de.style.setProperty('--sbc', c);
  let ms = document.querySelectorAll('meta[name="theme-color"]');
  if (!ms.length) { const m = document.createElement('meta'); m.name = 'theme-color'; document.head.append(m); ms = [m]; }
  ms.forEach(m => { m.setAttribute('content', c); m.removeAttribute('media'); });
}
const _applyLook = applyLook; applyLook = function () { _applyLook(); syncStatusBar(); };
if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncStatusBar);
syncStatusBar();

/* —— App 图标角标：显示今天到期的复习题数（需要 iOS 16.4 以上的主屏幕 App，并允许通知） —— */
const BADGE_OK = 'setAppBadge' in navigator && !window.AndroidApp;
const badgePerm = () => !('Notification' in window) || Notification.permission === 'granted';
let badgeT = 0;
function syncBadge() {
  if (!BADGE_OK) return; clearTimeout(badgeT);
  badgeT = setTimeout(() => { try { if (S.settings.badge && badgePerm()) { const n = BANK.filter(q => isDue(q.id)).length; n ? navigator.setAppBadge(n) : navigator.clearAppBadge(); } else navigator.clearAppBadge(); } catch (e) { } }, 400);
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') { clearTimeout(badgeT); if (BADGE_OK && S.settings.badge && badgePerm()) try { const n = BANK.filter(q => isDue(q.id)).length; n ? navigator.setAppBadge(n) : navigator.clearAppBadge(); } catch (e) { } } });
async function toggleBadge() {
  if (!BADGE_OK) return;
  if (S.settings.badge) { S.settings.badge = false; save(); syncBadge(); return render(); }
  if ('Notification' in window && Notification.permission !== 'granted') {
    let p = 'denied'; try { p = await Notification.requestPermission(); } catch (e) { }
    if (p !== 'granted') { toast('没有获得通知权限：可以到 iPhone「设置 → 通知 → 食品化学」里打开'); return render(); }
  }
  S.settings.badge = true; save(); syncBadge(); render();
}
function notifyHTML() {
  const on = !!S.settings.badge && badgePerm();
  return `<div class="ios-grp dm-wrap"><div class="dm dm-bd" aria-hidden="true"><div class="bd-icons"><i></i><i></i><span class="bd-app">${MARK}<b class="bd-n"><em>12</em></b></span><i></i></div><div class="dm-cap">今天到期的复习题数显示在主屏幕图标上，打开前就知道要复习多少</div></div></div>
    <p class="ios-lab">App 图标角标</p><div class="ios-grp"><div class="ios-row ios-tog${BADGE_OK ? '' : ' off'}" ${BADGE_OK ? 'data-badge role="button"' : ''}>${SV('<rect x="4" y="6" width="13" height="13" rx="3.5"/><circle cx="17.5" cy="6.5" r="3.2" fill="currentColor" stroke="none"/>')}<span class="ios-n">显示到期复习题数</span><button class="switch" role="switch" aria-checked="${on}" aria-label="显示到期复习题数" ${BADGE_OK ? '' : 'disabled'}><i></i></button></div></div>
    <p class="ios-note">${BADGE_OK ? '数字会在打开复习站、做完题和切到后台时更新。第一次打开时系统会询问是否允许通知，选「允许」才能显示角标。' : window.AndroidApp ? '安卓 App 暂不支持图标角标。' : '需要 iPhone / iPad（iOS 16.4 以上）上从主屏幕打开的复习站，才能显示图标角标。'}</p>`;
}

/* —— 分屏、台前调度：窗口宽度跨过手机 / 平板布局的分界时重新排版 —— */
let wideNow = innerWidth > 860;
window.addEventListener('resize', () => { const w = innerWidth > 860; if (w !== wideNow) { wideNow = w; if (!w) { } else drawer(false); const y = getScroll(); render(); setScroll(y); syncStatusBar(); } });

await Promise.race([syncReady, new Promise(r => setTimeout(r, 4000))]);
render();
syncReady.finally(() => setTimeout(showUpdate, 400));   // 同步完再判断要不要弹更新说明（看过的版本记在账号里）
})();
