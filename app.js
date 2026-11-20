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
function applyLook() { const de = document.documentElement; if (S.settings.skin === 'book') de.setAttribute('data-skin', 'book'); else de.removeAttribute('data-skin'); if (S.settings.theme) de.setAttribute('data-theme', S.settings.theme); else de.removeAttribute('data-theme'); const az = innerWidth > 860 ? Math.min(1.3, Math.max(1, innerWidth / 1536)) : 1; /* 1536 宽以下不放大，1920 约 1.25 倍，最大 1.3 倍 */
  de.style.setProperty('--az', az); de.style.setProperty('--zoom', (S.settings.zoom || 1) * az); }
applyLook();
let rsz; window.addEventListener('resize', () => { clearTimeout(rsz); rsz = setTimeout(applyLook, 120); });
let dbRef = null, syncOK = false, saveT = null, chain = Promise.resolve(), syncMsg = window.AndroidApp ? '进度保存在本机，离线可用' : window.__PWA ? (navigator.serviceWorker && navigator.serviceWorker.controller ? '已可离线使用 · 进度保存在本机' : '正在准备离线内容，请保持联网……') : '进度保存在本浏览器';
function save() {
  S.updated = Date.now();
  try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) { }
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
  const o = Object.assign(blank(), S);
  o.q = Object.assign({}, S.q); for (const [k, v] of Object.entries(R.q || {})) if (!o.q[k] || (v.t || 0) > (o.q[k].t || 0)) o.q[k] = v;
  o.k = Object.assign({}, S.k); for (const [k, v] of Object.entries(R.k || {})) if (!o.k[k] || (v.t || 0) > (o.k[k].t || 0)) o.k[k] = v;
  o.daily = Object.assign({}, R.daily || {}, S.daily); for (const [k, v] of Object.entries(R.daily || {})) { if (S.daily[k]) { const a = S.daily[k], inp = Object.assign({}, v.inp || {}); for (const [i, x] of Object.entries(a.inp || {})) if (!inp[i] || (x.t || 0) >= (inp[i].t || 0)) inp[i] = x; o.daily[k] = { ids: a.ids, res: Object.assign({}, v.res, a.res), inp }; } }
  const ms = new Map(); (R.mocks || []).concat(S.mocks || []).forEach(m => ms.set(m.ts, m)); o.mocks = [...ms.values()].sort((a, b) => a.ts - b.ts).slice(-40);
  o.log = Object.assign({}, R.log || {}); for (const [k, v] of Object.entries(S.log || {})) { const r = o.log[k] || { min: 0, done: 0 }; o.log[k] = { min: Math.max(r.min || 0, v.min || 0), done: Math.max(r.done || 0, v.done || 0) }; }
  o.path = Object.assign({}, R.path || {}, S.path || {});
  if ((R.updated || 0) > (S.updated || 0)) o.settings = Object.assign({}, S.settings, R.settings);
  o.updated = Math.max(S.updated || 0, R.updated || 0);
  return o;
}
(async () => {
  try {
    if (!window.claude || !window.claude.use) return;
    const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
    const uid = user ? await user.id() : null;
    if (!db || !uid) return;
    dbRef = db.doc('data/users/' + uid + '/state');
    setSync('正在连接账号同步……');
    const tm = setTimeout(() => setSync('同步暂时连不上，进度先保存在本浏览器'), 10000);
    const snap = await dbRef.get(); clearTimeout(tm); syncOK = true;
    if (snap.exists) { const R = snap.data() || {}; const before = JSON.stringify(S); S = merge(R); try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) { } if (JSON.stringify(S) !== JSON.stringify(R)) save(); if (JSON.stringify(S) !== before) render(); }
    else if (S.updated) save();
    setSync('进度已同步到你的账号');
  } catch (e) { syncOK = false; setSync('进度保存在本浏览器'); }
})();

const qs = id => S.q[id] || { l: 0, n: 0, c: 0, w: 0, t: 0, d: 0 };
function logDone() { const k = dkey(); const L = S.log[k] || { min: 0, done: 0 }; L.done++; S.log[k] = L; }
function rate(id, l) {
  const s = Object.assign({ l: 0, n: 0, c: 0, w: 0 }, S.q[id]); const now = Date.now();
  s.n++; s.l = l; s.t = now;
  if (l === 1) { s.c = 0; s.d = now + 10 * 60e3; s.w = 1; }
  else if (l === 2) { s.c = 0; s.d = sod() + DAY; s.w = 1; }
  else { s.c = (s.c || 0) + 1; s.d = sod() + [2, 4, 7, 15, 30][Math.min(s.c - 1, 4)] * DAY; if (s.c >= 2) s.w = 0; }
  S.q[id] = s; logDone(); save();
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
function qcard(q, o = {}) {
  const el = document.createElement('div'); el.className = 'card q'; el.dataset.id = q.id;
  const s = qs(q.id); const kl = keyLetter(q), tf = keyTF(q);
  let body = '';
  if (q.opts && q.opts.length) body = `<div class="opts">${q.opts.map(([a, t]) => `<button class="opt" data-o="${esc(a)}">${esc(/^\d$/.test(a) ? '（' + a + '）' : a + '.')} ${esc(t)}</button>`).join('')}</div>`;
  else if (q.t === '判断') body = `<div class="row"><button class="opt" data-o="√">√ 对</button><button class="opt" data-o="×">× 错</button></div>`;
  else body = `<textarea placeholder="${q.t === '名解' ? '先写出定义的关键词，再对答案' : OBJ.includes(q.t) ? '填写答案' : '先列出答题要点（可以只写关键词），再对答案'}" aria-label="作答"></textarea>`;
  el.innerHTML = `<div class="qmeta">${chipsFor(q, o.extraChip || '')}</div><div class="qtext">${esc(q.q)}</div>${body}
    <div class="row"><button class="btn pri" data-a="show">对答案</button><button class="btn" data-a="star">${s.w ? '已在错题本' : '加入错题本'}</button>${o.noNote ? '' : '<button class="btn ghost" data-a="note">笔记</button>'}<span class="sp"></span>${o.nav || ''}</div>
    <div class="ans" hidden><div class="h">参考答案 ${q.src === '汇编' ? '· 来自你的答案汇编' : q.src === '补充' ? '· Claude 按教材补写，建议对照课本' : '· Claude 整理，建议核对'}${q.doubt ? '<span class="chip doubt">存疑</span>' : ''}</div>${q.a || '<p>暂无参考答案。</p>'}</div>
    <div class="row rt" hidden><span class="note">这题你答得怎样？</span><button class="btn r1" data-r="1">不会</button><button class="btn r2" data-r="2">模糊</button><button class="btn r3" data-r="3">掌握</button></div>
    <div class="nt" hidden><textarea placeholder="写下易错点、记忆口诀……（自动保存）" aria-label="笔记">${esc(s.note || '')}</textarea></div>`;
  let shown = false;
  const reveal = () => { $('.ans', el).hidden = false; $('.rt', el).hidden = false; $('[data-a=show]', el).textContent = '隐藏答案'; if (!shown) { shown = true; o.onReveal && o.onReveal(); } };
  const conceal = () => { $('.ans', el).hidden = true; $('[data-a=show]', el).textContent = '再看答案'; };
  /* o.keep：保存作答状态（输入的文字、选的选项、答案是否展开、自评），切换页面回来时恢复 */
  const K = o.keep; const keepSave = () => { if (K) { K.t = Date.now(); o.onKeep && o.onKeep(); } };
  const markOpt = sel => { const right = kl || tf; $$('.opt', el).forEach(x => { x.classList.toggle('sel', x.dataset.o === sel); if (right && x.dataset.o === right) x.classList.add('right'); if (right && x.dataset.o === sel && sel !== right) x.classList.add('wrong'); }); };
  el.addEventListener('click', e => {
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
function openDiagram(id) { const d = document.createElement('div'); DG.mount(d, id); openModal(d, DG.title(id)); }
function openQ(id) { const q = BY[id]; if (q) openModal(qcard(q), `${q.y || '原创情境'} · ${TLABEL[q.t]}`); }

/* ---------- 导航 ---------- */
const PAGES = [['today', '今日', '今'], ['map', '知识结构', '图'], ['learn', '知识点', '知'], ['path', '复习路径', '路'], ['practice', '专项练习', '练'], ['daily', '每日自测', '测'], ['wrong', '错题本', '错'], ['mock', '模拟卷', '卷'], ['search', '检索', '搜'], ['stats', '进度', '度'], ['settings', '设置', '设']];
const NAV = { learnMod: 1, learnOpen: null, pathC: null, pathStep: 1, pf: { t: '全部', m: 0, lv: 'all', y1: 2004, y2: 2026, order: 'new', c: '', ids: null, i: 0, showList: true }, mock: null, mapMod: null, q: '' };
function navHTML() {
  const cur = location.hash.slice(1) || 'today';
  $('#sidenav').innerHTML = `<div class="brand">${MARK}<div class="bt">食品化学复习站<small>2004–2026 真题 · 11 模块</small></div></div><div class="sep"></div><div class="toc" aria-hidden="true">目　录</div>` +
    PAGES.map(([id, n], i) => `<a href="#${id}" ${cur === id ? 'aria-current="page"' : ''}>${icon(id)}<span class="nm">${n}</span><span class="ld" aria-hidden="true"></span><span class="pn" aria-hidden="true">${i + 1}</span></a>`).join('') + `<svg class="deco" viewBox="0 0 190 70" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M30 10l20 11.5v23L30 56 10 44.5v-23z"/><path d="M50 21.5l20-11.5 20 11.5v23L70 56 50 44.5"/><path d="M90 44.5l20 11.5M110 56l20-11.5v-23L110 10 90 21.5M130 21.5l20-11.5M150 10l20 11.5"/><circle cx="174" cy="24" r="3"/></svg><div class="foot"><span class="sync">${esc(syncMsg)}</span></div>`;
  $('#topnav').innerHTML = `<div class="bar1">${MARK}<b>食品化学复习站</b><span class="sp"></span><span class="sync">${esc(syncMsg)}</span></div><nav aria-label="主导航">${PAGES.map(([id, n]) => `<a href="#${id}" ${cur === id ? 'aria-current="page"' : ''}>${icon(id)}${n}</a>`).join('')}</nav>`;
  const a = $('#topnav nav a[aria-current]'); if (a) a.scrollIntoView({ block: 'nearest', inline: 'center' });
}
function go(page) { if (location.hash.slice(1) === page) render(); else location.hash = page; }
window.addEventListener('hashchange', () => { render(); toTop(); });
function render() {
  navHTML();
  const p = location.hash.slice(1) || 'today';
  applyLook();
  const f = { today: pToday, map: pMap, learn: pLearn, path: pPath, practice: pPractice, daily: pDaily, wrong: pWrong, mock: pMock, search: pSearch, stats: pStats, settings: pSettings }[p] || pToday;
  const m = document.createElement('div'); const pi = PAGES.findIndex(x => x[0] === p);
  m.dataset.pg = pi >= 0 ? pi + 1 : 1;
  const main = $('#main'), old = main.firstElementChild, changed = render.last && p !== render.last;
  if (changed) { const fwd = pi > render.lastIdx; if (fwd) m.className = 'turn'; pageFlip(main, old, fwd); }
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
function flushTime() { if (pend <= 0) return; const k = dkey(); const L = S.log[k] || { min: 0, done: 0 }; L.min = Math.round(((L.min || 0) + pend) * 100) / 100; S.log[k] = L; pend = 0; save(); }
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
  let week = 0; for (let i = 0; i < 7; i++) week += (S.log[dkey(Date.now() - i * DAY)] || {}).min || 0;
  let cd = '';
  if (S.settings.exam) { const d = Math.ceil((new Date(S.settings.exam + 'T00:00:00') - sod()) / DAY); if (d >= 0) cd = `距离考试还有 <b>${d}</b> 天。`; }
  const rec = recommendCluster(); const rc = CL[rec];
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
    <div class="pi"><span class="min">${plan[0]}′</span><div><b>复习路径：${esc(rc.n)}</b><div class="note">${esc(MODN[rc.m])} · 出现 ${CS[rec].n} 年，最近 ${CS[rec].last}。先做最新一年的题锚定考点，再补旧题，最后做题型转换。</div></div><button class="btn pri" data-go="path" data-c="${rec}">开始</button></div>
    <div class="pi"><span class="min">${plan[1]}′</span><div><b>每日自测（${dTot} 题）</b><div class="note">客观题 + 名解 + 简答 + 论述/情境，优先抽到期和薄弱的题。</div></div><button class="btn" data-go="daily">去自测</button></div>
    <div class="pi"><span class="min">${plan[2]}′</span><div><b>错题与到期复习（${due} 题到期）</b><div class="note">把"不会""模糊"的题再过一遍，写下易错点。</div></div><button class="btn" data-go="due">去复习</button></div>
    ${plan[3] ? `<div class="pi"><span class="min">${plan[3]}′</span><div><b>知识点与图解：${esc(item ? item.t : rc.n)}</b><div class="note">读一遍要点，看机理图，标记掌握程度。</div></div><button class="btn" data-go="learn" data-it="${item ? item.id : ''}">去阅读</button></div>` : ''}
  </div></div>
  <h2>高频考点（按出现年数和近年热度排序）</h2>
  <div class="list" id="hot"></div>`;
  $('#hot').innerHTML = Object.entries(CS).sort((a, b) => b[1].prio - a[1].prio).slice(0, 8).map(([id, s]) => clusterRow(id)).join('');
  $('#dur').onclick = e => { const b = e.target.closest('[data-d]'); if (b) { S.settings.dur = +b.dataset.d; save(); render(); } };
  $('#tbtn').onclick = () => { flushTime(); S.settings.autoTime = S.settings.autoTime === false; save(); render(); };
  m.addEventListener('click', e => {
    const b = e.target.closest('[data-go]'); if (b) {
      const g = b.dataset.go;
      if (g === 'path') { NAV.pathC = b.dataset.c; NAV.pathStep = 1; go('path'); }
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
function recommendCluster() {
  const arr = Object.entries(CS).map(([id, s]) => { const P = S.path[id] || {}; const st = [P.s1, P.s2, P.s3].filter(Boolean).length; const mm = clusterMastery(id); return [id, s.prio * (st === 3 ? 0.15 : 1 - st * 0.2) * (1.4 - mm.m3 / mm.tot)]; });
  arr.sort((a, b) => b[1] - a[1]); return arr[0][0];
}

/* ---------- 知识结构 ---------- */
function pMap(m) {
  const modStat = mo => { const ids = new Set(mo.items.flatMap(i => i.cs)); const q = BANK.filter(x => ids.has(x.c)); const m3 = q.filter(x => qs(x.id).l === 3).length, m2 = q.filter(x => qs(x.id).l === 2).length, m1 = q.filter(x => qs(x.id).l === 1).length; return { tot: q.length, m3, m2, m1 }; };
  m.innerHTML = `<div class="kick">STRUCTURE · 知识结构</div><h1>知识结构</h1><p class="lead">11 个考纲模块，每个模块下是考纲条目和对应的真题考点。考点颜色表示你的掌握程度，数字是出现的年数。点考点进入复习路径。</p>
  <div class="mods" id="mods">${MODS.map(mo => { const s = modStat(mo); const w = n => (n / s.tot * 100).toFixed(1); return `<button class="card mod" data-m="${mo.id}" aria-pressed="${NAV.mapMod === mo.id}">${icon('m' + mo.id, 'mi')}<div class="no">第 ${mo.id} 章</div><div class="nm">${esc(mo.name)}</div><div class="note">${mo.items.length} 个考纲条目 · ${s.tot} 道题</div><div class="bar" style="margin-top:6px"><i style="width:${w(s.m3)}%;background:var(--ok)"></i><i style="width:${w(s.m2)}%;background:var(--mid)"></i><i style="width:${w(s.m1)}%;background:var(--bad)"></i></div></button>`; }).join('')}</div>
  <div id="tree"></div><h2>机理图解</h2><p class="lead">复杂机理按步骤拆开，点开后用"下一步"逐步看；两张水分活度图可以拖动查看。</p><div class="mods" id="dgs">${DG.list().map(d => `<button class="card mod" data-dg="${d.id}"><div class="nm" style="font-size:15px">${esc(d.title)}</div><div class="note">点开看图解</div></button>`).join('')}</div>`;
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
    try { if (!q) throw new Error('题库里找不到 ' + id); D.inp = D.inp || {}; const keep = D.inp[id] = D.inp[id] || {}; const c = qcard(q, { keep, onKeep: () => { S.daily[key] = D; save(); }, extraChip: `<span class="chip">第 ${i + 1} 题</span>${D.res[id] ? `<span class="chip src1">今天已答</span>` : ''}`, onRated: l => { D.res[id] = l; S.daily[key] = D; save(); head(); } }); dl.append(c); }
    catch (e) { console.error(e); const c = document.createElement('div'); c.className = 'card'; c.innerHTML = `<p class="note">第 ${i + 1} 题没有载入成功（${esc(e && e.message)}），可以点「换一组」或刷新页面。</p>`; dl.append(c); }
  });
  /* 万一题目没有显示出来（例如同步数据刚好在渲染时到达），自动重画一次 */
  setTimeout(() => { const d = document.getElementById('dl'); if (location.hash.slice(1) === 'daily' && (!d || !d.children.length) && !pDaily.retried) { pDaily.retried = 1; render(); setTimeout(() => pDaily.retried = 0, 3000); } }, 300);
  $('#rd').onclick = () => { const k2 = key + ':' + Math.random(); const nd = makeDaily(k2); S.daily[key] = { ids: nd.ids, res: {} }; save(); render(); };
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
    <h2>历史成绩</h2>${S.mocks.length ? `<div class="tw"><table class="t"><tr><th>时间</th><th>试卷</th><th>得分</th><th>用时</th></tr>${S.mocks.slice().reverse().map(x => `<tr><td>${new Date(x.ts).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td><td>${esc(x.title)}</td><td><b>${x.score}</b> / ${x.total}</td><td>${x.min} 分钟</td></tr>`).join('')}</table></div>` : '<p class="empty">还没有做过模拟卷。</p>'}`;
    $('#mk1').onclick = () => { NAV.mock = { title: '现行卷型模拟卷', ids: makeMock('mix'), start: Date.now(), sub: false, sc: {}, mix: true }; render(); };
    $('#mk2').onclick = () => { const y = +$('#my').value; NAV.mock = { title: y + ' 年真题', ids: makeMock('year', y), start: Date.now(), sub: false, sc: {} }; render(); };
    return;
  }
  const total = M.ids.reduce((s, id) => s + PTS[BY[id].t], 0);
  const groups = []; M.ids.forEach(id => { const t = BY[id].t; const k = t; let g = groups.find(x => x.k === k); if (!g) groups.push(g = { k, ids: [] }); g.ids.push(id); });
  const CN = ['一', '二', '三', '四', '五', '六', '七'];
  m.innerHTML = `<div class="sticky"><div class="row"><b>${esc(M.title)}</b><span class="note">满分 ${total}</span><span class="sp"></span><span class="timer" id="mt"></span>${M.sub ? `<b id="msc"></b>` : '<button class="btn pri" id="sub">交卷</button>'}<button class="btn sm ghost" id="quit">${M.sub ? '返回' : '放弃'}</button></div></div>
  ${groups.map((g, gi) => `<h2>${CN[gi]}、${TLABEL[g.k]}${/[释析]$/.test(TLABEL[g.k]) ? '' : '题'}（${g.ids.length} 题，每题 ${PTS[BY[g.ids[0]].t]} 分，共 ${g.ids.length * PTS[BY[g.ids[0]].t]} 分）</h2><div class="list">${g.ids.map((id, i) => { const q = BY[id]; const full = PTS[q.t]; return `<div class="card q" data-id="${id}"><div class="qtext">${i + 1}. ${esc(q.q)}</div>${mockKey(q) ? mockOpts(q, M) : `${q.opts ? `<div class="note">${q.opts.map(([a, t]) => esc(a + '. ' + t)).join('　')}</div>` : ''}<textarea aria-label="作答" ${M.sub ? 'readonly' : ''}>${esc((M.ans || {})[id] || '')}</textarea>`}${M.sub ? `<div class="ans"><div class="h">参考答案</div>${q.a || ''}</div><div class="row"><span class="note">本题得分</span><input type="number" min="0" max="${full}" step="${full > 3 ? 1 : 0.5}" value="${M.sc[id] != null ? M.sc[id] : ''}" data-sc="${id}" aria-label="得分" style="width:80px"><span class="note">/ ${full}</span><button class="btn sm" data-full="${id}">满分</button><button class="btn sm" data-zero="${id}">0 分</button></div>` : ''}</div>`; }).join('')}</div>`).join('')}`;
  const tick = () => { const t = $('#mt'); if (!t) return clearInterval(M.tk); const used = Math.floor(((M.end || Date.now()) - M.start) / 60000); t.textContent = M.sub ? `用时 ${used} 分钟` : `剩余 ${Math.max(0, 180 - used)} 分钟`; };
  clearInterval(M.tk); M.tk = setInterval(tick, 20000); tick();
  m.addEventListener('input', e => { if (e.target.tagName === 'TEXTAREA' && !M.sub) { const id = e.target.closest('[data-id]').dataset.id; M.ans = M.ans || {}; M.ans[id] = e.target.value; } });
  const upd = () => { const sc = Object.values(M.sc).reduce((s, v) => s + (+v || 0), 0); const b = $('#msc'); if (b) b.textContent = `得分 ${sc} / ${total}（已评 ${Object.keys(M.sc).length}/${M.ids.length}）`; return sc; };
  if (M.sub) {
    upd();
    m.addEventListener('change', e => { const id = e.target.dataset.sc; if (!id) return; const full = PTS[BY[id].t]; M.sc[id] = Math.max(0, Math.min(full, +e.target.value || 0)); e.target.value = M.sc[id]; const sc = upd(); saveMock(sc, total); const r = M.sc[id] / full; rate(id, r >= 0.8 ? 3 : r >= 0.4 ? 2 : 1); });
    m.addEventListener('click', e => { const id = e.target.dataset.full || e.target.dataset.zero; if (!id) return; const inp = $(`[data-sc="${id}"]`, m); inp.value = e.target.dataset.full ? PTS[BY[id].t] : 0; inp.dispatchEvent(new Event('change', { bubbles: true })); });
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
  <h2>近 14 天做题量</h2><div class="card"><svg viewBox="0 0 700 170" class="dg" role="img" aria-label="近14天做题量">${[0, .5, 1].map(f => `<line x1="30" x2="690" y1="${140 - f * 120}" y2="${140 - f * 120}" stroke="var(--line)"/><text x="24" y="${144 - f * 120}" text-anchor="end" class="dgl">${Math.round(mx * f)}</text>`).join('')}${days.map(([d, L], i) => `<rect x="${42 + i * 46}" y="${140 - L.done / mx * 120}" width="30" height="${Math.max(1, L.done / mx * 120)}" rx="3" fill="${i === 13 ? 'var(--accent)' : 'var(--c-blue-b)'}"/><text x="${57 + i * 46}" y="160" text-anchor="middle" class="dgl">${d}</text>${L.done ? `<text x="${57 + i * 46}" y="${134 - L.done / mx * 120}" text-anchor="middle" class="dgl">${L.done}</text>` : ''}`).join('')}</svg></div>
  <h2>各模块掌握情况</h2><div class="card grid" style="gap:8px">${MODS.map(mo => { const ids = new Set(mo.items.flatMap(i => i.cs)); return barRow(mo.id + ' ' + mo.name, all.filter(q => ids.has(q.c))); }).join('')}</div>
  <h2>各题型掌握情况</h2><div class="card grid" style="gap:8px">${['名解', '简答', '论述', '分析', '选择', '填空', '判断'].map(t => barRow(TLABEL[t], all.filter(q => q.t === t))).join('')}</div>`;
}

/* ---------- 设置 ---------- */
function greet() { const h = new Date().getHours(); return h < 5 ? '夜深了' : h < 11 ? '早上好' : h < 13 ? '中午好' : h < 18 ? '下午好' : '晚上好'; }
function pSettings(m) {
  const st = S.settings;
  const seg = (id, opts, cur) => `<div class="seg" id="${id}">${opts.map(([v, n]) => `<button data-v="${v}" aria-pressed="${String(cur) === String(v)}">${n}</button>`).join('')}</div>`;
  m.innerHTML = `<div class="kick">SETTINGS</div><h1>设置</h1><p class="lead">个人信息、学习安排和外观都在这里，改完自动保存。</p>
  <h2>个人资料</h2><div class="card form">
    <div class="row"><label for="nm">你的名字</label><input type="text" id="nm" maxlength="20" placeholder="例如：小林" value="${esc(st.name || '')}"><span class="note">填写后首页显示「${greet()}，${esc(st.name || 'xxx')}，欢迎回来」</span></div>
    <div class="row"><label for="gl">目标</label><input type="text" id="gl" maxlength="30" placeholder="例如：江南大学 食品科学" value="${esc(st.goal || '')}"><span class="note">显示在首页日期旁</span></div>
    <div class="row"><label for="mt2">座右铭</label><input type="text" id="mt2" maxlength="60" placeholder="给自己的一句话" value="${esc(st.motto || '')}" style="flex:1;min-width:200px"><span class="note">替换首页的默认提示语</span></div>
  </div>
  <h2>学习安排</h2><div class="card form">
    <div class="row"><label for="ex">考试日期</label><input type="date" id="ex" value="${esc(st.exam || '')}"><span class="note">设置后首页显示倒计时</span></div>
    <div class="row"><span class="lab">每日计划时长</span>${seg('sdur', [[60, '60 分钟'], [90, '90 分钟'], [120, '120 分钟']], st.dur || 90)}</div>
    <div class="row"><span class="lab">每日自测题量</span>${seg('sdn', [[8, '轻量 8 题'], [12, '标准 12 题'], [16, '加量 16 题']], st.dailyN || 12)}<span class="note">从明天的自测（或点「换一套」）开始生效</span></div>
    <div class="row"><span class="lab">自动记录学习时间</span>${seg('sat', [['on', '开启'], ['off', '暂停']], st.autoTime === false ? 'off' : 'on')}</div>
  </div>
  <h2>外观</h2><div class="card form">
    <div class="row" style="align-items:flex-start"><span class="lab">风格</span><div class="skins" id="sk">
      <button data-v="" aria-pressed="${st.skin !== 'book'}"><span class="pv pv-m" aria-hidden="true"><i></i><b></b><b></b><b></b></span><span class="sn">现代</span><span class="note">简洁卡片，适合快速刷题</span></button>
      <button data-v="book" aria-pressed="${st.skin === 'book'}"><span class="pv pv-b" aria-hidden="true"><i></i><b></b><em></em></span><span class="sn">书本</span><span class="note">纸张质感、目录侧栏、翻页动效</span></button>
    </div></div>
    <div class="row"><span class="lab">颜色</span>${seg('th', [['', '跟随系统'], ['light', '浅色'], ['dark', '深色']], st.theme || '')}</div>
    <div class="row"><span class="lab">字号</span>${seg('zm', [[1, '标准'], [1.1, '大'], [1.2, '特大']], st.zoom || 1)}</div>
  </div>
  <h2>备份与恢复</h2><div class="card"><p class="note">同步状态：<span class="sync">${esc(syncMsg)}</span></p>${window.AndroidApp ? '<p class="note">进度保存在这台手机里，不联网也能用。卸载 App 或清除应用数据会清空进度，建议隔一段时间点「生成备份 → 分享备份」，存一份到网盘或聊天记录里。</p>' : window.__PWA ? '<p class="note">进度保存在这台 iPad 里，不联网也能用。从主屏幕删除这个图标会清空进度，建议隔一段时间点「生成备份 → 复制」，把文字存到备忘录或发给自己。</p>' : ''}<p class="note">进度会自动保存。想手动备份时，点「生成备份」后复制文本保存；恢复时把文本粘贴进来点「导入」。</p><div class="row"><button class="btn" id="exp">生成备份</button><button class="btn" id="cp" hidden>复制</button><button class="btn" id="imp">导入</button><span class="sp"></span><button class="btn ghost" id="rst">清空全部进度</button></div><textarea id="bk" style="margin-top:8px" aria-label="备份文本" placeholder="备份文本"></textarea><p class="note" id="bkm"></p></div>`;
  const txt = (id, k) => $('#' + id).addEventListener('change', e => { st[k] = e.target.value.trim(); save(); });
  txt('nm', 'name'); txt('gl', 'goal'); txt('mt2', 'motto');
  $('#nm').addEventListener('input', e => { $('#nm').nextElementSibling.textContent = `填写后首页显示「${greet()}，${e.target.value.trim() || 'xxx'}，欢迎回来」`; });
  $('#ex').onchange = e => { st.exam = e.target.value; save(); };
  const pick = (id, fn) => $('#' + id).onclick = e => { const b = e.target.closest('[data-v]'); if (!b) return; fn(b.dataset.v); save(); applyLook(); render(); };
  pick('sdur', v => st.dur = +v); pick('sdn', v => st.dailyN = +v); pick('sat', v => { flushTime(); st.autoTime = v === 'on'; });
  pick('sk', v => st.skin = v); pick('th', v => st.theme = v); pick('zm', v => st.zoom = +v);
  $('#exp').onclick = () => { $('#bk').value = JSON.stringify(S); $('#cp').hidden = false; $('#bkm').textContent = '备份已生成。'; };
  if (window.AndroidApp) { const sh = document.createElement('button'); sh.className = 'btn'; sh.id = 'shr'; sh.textContent = '分享备份'; sh.hidden = true; $('#cp').after(sh);
    sh.onclick = () => { try { window.AndroidApp.share($('#bk').value); } catch (e) { } };
    $('#exp').addEventListener('click', () => { sh.hidden = false; }); }
  $('#cp').onclick = async () => { try { if (window.AndroidApp) window.AndroidApp.copy($('#bk').value); else await navigator.clipboard.writeText($('#bk').value); $('#bkm').textContent = '已复制到剪贴板。'; } catch (e) { $('#bk').select(); $('#bkm').textContent = '无法自动复制，请手动全选复制。'; } };
  $('#imp').onclick = () => { try { const R = JSON.parse($('#bk').value); if (!R || typeof R.q !== 'object') throw 0; S = merge(R); save(); applyLook(); $('#bkm').textContent = '导入成功，已和现有进度合并。'; } catch (e) { $('#bkm').textContent = '导入失败：文本不是有效的备份。'; } };
  $('#rst').onclick = () => { const b = $('#rst'); if (b.dataset.c) { const keep = S.settings; S = blank(); S.settings = keep; save(); render(); } else { b.dataset.c = 1; b.textContent = '再点一次确认清空（个人设置会保留）'; b.classList.add('r1'); } };
}

render();
})();
