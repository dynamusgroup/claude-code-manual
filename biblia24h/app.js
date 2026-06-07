/* ============================================================
   Bíblia24h — App logic, routing & rendering
   ============================================================ */
(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const screenEl = $("#screen");
  const navEl = $("#bottomNav");

  // ---------- State ----------
  const state = {
    lang: localStorage.getItem("b24h_lang") || "pt",
    theme: localStorage.getItem("b24h_theme") || "light",
    screen: "home",
    nowPlaying: null,
    playing: false,
    studyCat: 0,
    audioCat: 0,
  };

  const t = () => I18N[state.lang];
  const tr = (k) => t()[k] || k;

  // ---------- Theme ----------
  function applyTheme() {
    let theme = state.theme;
    if (theme === "system") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#1D1D1F" : "#8B3DFF");
  }

  function greetingKey() {
    const h = new Date().getHours();
    if (h < 12) return "greetingMorning";
    if (h < 18) return "greetingAfternoon";
    return "greetingEvening";
  }

  function bookName() {
    const c = DATA.continueBook;
    return state.lang === "en" ? c.bookEn : state.lang === "es" ? c.bookEs : c.book;
  }

  // ---------- Toast ----------
  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
  }

  // ---------- Header ----------
  function header(title, sub, withLang) {
    return `
      <div class="app-header">
        <div class="greeting">
          <h1>${title} <span>👋</span></h1>
          ${sub ? `<p>${sub}</p>` : ""}
        </div>
        <div class="header-actions">
          <button class="icon-btn" data-action="notifications" aria-label="notificações">
            ${ICONS.bell}<span class="dot"></span>
          </button>
          ${withLang ? `<button class="lang-pill" data-action="lang">
            <span class="flag">${t().flag}</span>${t().code} ${ICONS.chevDown}
          </button>` : ""}
        </div>
      </div>`;
  }

  function simpleHeader(title) {
    return `
      <div class="app-header">
        <div class="greeting"><h1>${title}</h1></div>
        <div class="header-actions">
          <button class="lang-pill" data-action="lang"><span class="flag">${t().flag}</span>${t().code} ${ICONS.chevDown}</button>
        </div>
      </div>`;
  }

  // ============================================================
  // HOME
  // ============================================================
  function renderHome() {
    const v = DATA.verse[state.lang];
    const d = DATA.devotional[state.lang];
    const nr = DATA.nightReflection[state.lang];
    const greet = `${tr(greetingKey())}, ${DATA.user.name}!`;

    const studies = DATA.studies.slice(0, 6).map(posterCard).join("");
    const audios = DATA.audios.slice(0, 6).map(audioTile).join("");

    return `
      ${header(greet, tr("greetingSub"), true)}

      <div class="verse-card">
        <svg class="cross" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.2"><path d="M12 2v20M7 7h10"/></svg>
        <div class="kicker">${tr("verseOfDay")}</div>
        <blockquote>"${v.text}"</blockquote>
        <cite>${v.ref}</cite>
        <div class="verse-actions">
          <button class="btn btn-light" data-action="readBible">${ICONS.book}${tr("readBible")}</button>
          <button class="round-icon" data-action="save" aria-label="salvar">${ICONS.bookmark}</button>
          <button class="round-icon" data-action="share" aria-label="compartilhar">${ICONS.share}</button>
        </div>
      </div>

      <div class="sec-head"><h2>${tr("devotionalOfDay")}</h2><a class="link">${tr("seeAll")}</a></div>
      <div class="devo-hero" data-action="openDevotional">
        <span class="seed">🌱</span>
        <span class="badge-time">${ICONS.clock} ${d.time} ${tr("minutes")}</span>
        <h3>${d.title}</h3>
        <p>${d.desc}</p>
        <button class="btn btn-light" style="align-self:flex-start" data-action="openDevotional">${tr("readDevotional")} ${ICONS.chevRight}</button>
      </div>

      <div class="sec-head"><h2>${tr("continueReading")}</h2><a class="link" data-action="readBible">${tr("readBible")}</a></div>
      <div class="continue-card" data-action="readBible">
        <div class="continue-thumb">${ICONS.book}</div>
        <div class="continue-info">
          <div class="title">${bookName()} ${DATA.continueBook.chapter}</div>
          <div class="sub">${tr("chapter")} ${DATA.continueBook.chapter}</div>
          <div class="progress"><span style="width:${DATA.continueBook.progress}%"></span></div>
        </div>
        <div class="continue-pct">${DATA.continueBook.progress}%</div>
      </div>

      <div class="sec-head"><h2>${tr("quickActions")}</h2></div>
      <div class="quick-grid">
        <button class="quick" data-action="prayer"><div class="qi q1">${ICONS.pray}</div><span>${tr("qaPrayer")}</span></button>
        <button class="quick" data-action="plan"><div class="qi q2">${ICONS.plan}</div><span>${tr("qaPlan")}</span></button>
        <button class="quick" data-action="word"><div class="qi q3">${ICONS.word}</div><span>${tr("qaWord")}</span></button>
        <button class="quick" data-action="night"><div class="qi q4">${ICONS.moon}</div><span>${tr("qaNight")}</span></button>
      </div>

      <div class="sec-head"><h2>${tr("recommendedStudies")}</h2><a class="link" data-action="goStudy">${tr("seeAll")}</a></div>
      <div class="h-scroll">${studies}</div>

      <div class="sec-head"><h2>${tr("recommendedAudio")}</h2><a class="link" data-action="goAudio">${tr("seeAll")}</a></div>
      <div class="h-scroll">${audios}</div>

      <div class="sec-head"><h2>${tr("nightReflection")} ${ICONS.moon ? "🌙" : ""}</h2></div>
      <div class="card" style="background:radial-gradient(130% 120% at 20% 0%, #2a0a66, #130a2e);color:#fff">
        <p style="font-size:16px;line-height:1.5;font-weight:600;font-style:italic">"${nr[Math.floor(Math.random()*nr.length)]}"</p>
        <p style="opacity:.7;font-size:12px;margin-top:8px">22:00 — 04:00 · ${state.lang==='pt'?'Esperança & Evangelismo':state.lang==='es'?'Esperanza & Evangelismo':'Hope & Evangelism'}</p>
      </div>
    `;
  }

  function posterCard(s) {
    const lessonsTxt = `${s.lessons} ${tr("lessons")}`;
    return `
      <div class="poster" data-action="openStudy" data-id="${s.id}">
        <div class="art" style="background:${GRADS[s.g]}">
          <span class="tag">${s.cat}</span>
          <span class="ico">${s.icon}</span>
          <h4>${s.title}</h4>
        </div>
        <div class="meta">${lessonsTxt}${s.prog>0?` · <b>${s.prog}%</b>`:""}</div>
        ${s.prog>0?`<div class="pbar"><span style="width:${s.prog}%"></span></div>`:""}
      </div>`;
  }

  function audioTile(a) {
    return `
      <div class="audio-tile" data-action="playAudio" data-id="${a.id}">
        <div class="art" style="background:${GRADS[a.g]}">
          <span style="font-size:46px">${a.icon}</span>
          <div class="play">${ICONS.play}</div>
        </div>
        <div class="t">${a.title}</div>
        <div class="s">${a.author}</div>
      </div>`;
  }

  // ============================================================
  // BIBLE
  // ============================================================
  function renderBible() {
    const ch = DATA.chapter;
    const book = ch.book[state.lang] || ch.book.pt;
    const verses = ch.verses.map(v =>
      `<p><span class="vn">${v.n}</span><span class="${v.hl?`hl-${v.hl}`:''}">${v.t}</span></p>`
    ).join("");

    return `
      ${simpleHeader(tr("bibleTitle"))}
      <div class="searchbar">${ICONS.search}<input placeholder="${tr("searchPlaceholder")}" /></div>

      <div class="chips">
        ${DATA.bibleVersions.map((vv,i)=>`<button class="chip ${i===0?'active':''}" data-action="version" data-v="${vv}">${vv}</button>`).join("")}
      </div>

      <div class="reader-top">
        <button class="version-select" data-action="bookPicker">${book} ${ch.number} ${ICONS.chevDown}</button>
        <div style="display:flex;gap:8px">
          <button class="icon-btn" data-action="save">${ICONS.bookmark}</button>
          <button class="icon-btn" data-action="share">${ICONS.share}</button>
        </div>
      </div>

      <div class="chapter-title">
        <div class="bk">${book}</div>
        <h2>${tr("chapter")} ${ch.number}</h2>
      </div>

      <div class="verses">${verses}</div>

      <div class="chapter-nav">
        <button class="btn btn-ghost btn-block" data-action="prevCh">${ICONS.chevLeft} ${tr("prevChapter")}</button>
        <button class="btn btn-purple btn-block" data-action="nextCh">${tr("nextChapter")} ${ICONS.chevRight}</button>
      </div>
    `;
  }

  // ============================================================
  // STUDY (Netflix)
  // ============================================================
  function renderStudy() {
    const cats = ["Todos","Guerra","Doutrina","Família","Casamento","Missões","Profecia"];
    const featured = DATA.studies[0];
    const rows = DATA.studies.map(posterCard).join("");
    const watching = DATA.studies.filter(s => s.prog>0 && s.prog<100).map(posterCard).join("");

    return `
      ${simpleHeader(tr("studyTitle"))}
      <div class="chips">
        ${cats.map((c,i)=>`<button class="chip ${i===state.studyCat?'active':''}" data-action="studyCat" data-i="${i}">${c}</button>`).join("")}
      </div>

      <div class="devo-hero" data-action="openStudy" data-id="${featured.id}" style="background:linear-gradient(180deg,rgba(40,12,90,.1),rgba(40,12,90,.85)),${GRADS[featured.g]}">
        <span class="seed">${featured.icon}</span>
        <span class="badge-time">${featured.cat}</span>
        <h3>${featured.title}</h3>
        <p>${featured.instructor} · ${featured.lessons} ${tr("lessons")}</p>
        <button class="btn btn-light" style="align-self:flex-start" data-action="openStudy" data-id="${featured.id}">${ICONS.play} ${tr("continueWatching")}</button>
      </div>

      ${watching ? `<div class="sec-head"><h2>${tr("continueWatching")}</h2></div><div class="h-scroll">${watching}</div>`:""}

      <div class="sec-head"><h2>${tr("recommendedStudies")}</h2></div>
      <div class="h-scroll">${rows}</div>

      <div class="sec-head"><h2>Teologia & Doutrina</h2></div>
      <div class="h-scroll">${[...DATA.studies].reverse().map(posterCard).join("")}</div>
    `;
  }

  // ============================================================
  // AUDIO (Spotify)
  // ============================================================
  function renderAudio() {
    const cats = ["Todos","Pregações","Devocionais","Orações","Bíblia Narrada","Estudos Bíblicos"];
    const tiles = DATA.audios.map(audioTile).join("");
    const list = DATA.audios.map(audioRow).join("");

    return `
      ${simpleHeader(tr("audioTitle"))}
      <div class="searchbar">${ICONS.search}<input placeholder="${tr("searchPlaceholder")}" /></div>
      <div class="chips">
        ${cats.map((c,i)=>`<button class="chip ${i===state.audioCat?'active':''}" data-action="audioCat" data-i="${i}">${c}</button>`).join("")}
      </div>

      <div class="sec-head"><h2>${tr("continueListening")}</h2></div>
      <div class="h-scroll">${tiles}</div>

      <div class="sec-head"><h2>${state.lang==='en'?'All episodes':state.lang==='es'?'Todos los episodios':'Todos os episódios'}</h2></div>
      <div>${list}</div>
    `;
  }

  function audioRow(a) {
    return `
      <div class="list-row" data-action="playAudio" data-id="${a.id}">
        <div class="lr-art" style="background:${GRADS[a.g]};font-size:24px">${a.icon}</div>
        <div class="lr-info">
          <div class="t">${a.title}</div>
          <div class="s">${a.author} · ${a.dur}</div>
        </div>
        <div class="lr-play">${ICONS.play}</div>
      </div>`;
  }

  // ============================================================
  // STORE
  // ============================================================
  function renderStore() {
    const cats = ["Todos","Livros","eBooks","Cursos","Kits","Conferências"];
    const grid = DATA.products.map(p => `
      <div class="product" data-action="product" data-id="${p.id}">
        <div class="pimg" style="background:${GRADS[p.g]}">
          ${p.tag?`<span class="ptag">${p.tag}</span>`:""}
          ${p.icon}
        </div>
        <div class="pbody">
          <div class="pcat">${p.cat}</div>
          <div class="pname">${p.name}</div>
          <div class="pprice">${p.price}<button class="pbuy" data-action="buy" data-id="${p.id}">${ICONS.plus}</button></div>
        </div>
      </div>`).join("");

    return `
      ${simpleHeader(tr("storeTitle"))}
      <div class="searchbar">${ICONS.search}<input placeholder="${tr("searchPlaceholder")}" /></div>
      <div class="chips">
        ${cats.map((c,i)=>`<button class="chip ${i===0?'active':''}">${c}</button>`).join("")}
      </div>

      <div class="verse-card" style="background:linear-gradient(135deg,#36b37e,#0b6e4f);box-shadow:0 18px 40px rgba(54,179,126,.3)">
        <div class="kicker">📚 ${tr("myLibrary")}</div>
        <blockquote style="font-size:16px;font-style:normal">3 itens · 1 download disponível</blockquote>
        <button class="btn btn-light" style="margin-top:6px" data-action="library">${tr("myLibrary")} ${ICONS.chevRight}</button>
      </div>

      <div class="sec-head"><h2>${state.lang==='en'?'Featured':state.lang==='es'?'Destacados':'Destaques'}</h2></div>
      <div class="store-grid">${grid}</div>
    `;
  }

  // ============================================================
  // PROFILE
  // ============================================================
  function renderProfile() {
    const u = DATA.user;
    const badges = DATA.badges.map(b => `
      <div class="badge-item">
        <div class="bdg ${b.unlocked?'':'locked'}">${b.icon}</div>
        <span>${b.name}</span>
      </div>`).join("");

    const menu = [
      { ic:"heart", t: tr("mSavedVerses"), badge: u.verses },
      { ic:"note", t: tr("mNotes"), badge: 12 },
      { ic:"plan", t: tr("mPlans"), badge: u.plans },
      { ic:"trophy", t: tr("mAchievements") },
      { ic:"settings", t: tr("mSettings"), action:"settings" },
      { ic:"help", t: tr("mHelp") },
    ].map(m => `
      <div class="menu-item" ${m.action?`data-action="${m.action}"`:''}>
        <div class="mi-ic">${ICONS[m.ic]}</div>
        <div class="mi-t">${m.t}</div>
        ${m.badge!=null?`<span class="continue-pct">${m.badge}</span>`:""}
        <svg class="chev" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>
      </div>`).join("");

    return `
      <div class="app-header">
        <div class="greeting"><h1>${tr("profileTitle")}</h1></div>
        <div class="header-actions">
          <button class="icon-btn" data-action="settings">${ICONS.settings}</button>
        </div>
      </div>

      <div class="profile-head">
        <div class="avatar">${u.initials}</div>
        <div class="name">${u.name} Reis</div>
        <div class="email">${u.email}</div>
      </div>

      <div class="stat-grid">
        <div class="stat"><div class="big">${u.streak}</div><div class="lbl">${tr("daysStreak")}</div></div>
        <div class="stat"><div class="big">${u.chapters}</div><div class="lbl">${tr("chaptersRead")}</div></div>
        <div class="stat"><div class="big">${u.plans}</div><div class="lbl">${tr("plansDone")}</div></div>
      </div>

      <div class="streak-banner">
        <span class="fire">🔥</span>
        <div>
          <div class="t">${tr("streakTitle")}</div>
          <div class="s">${u.streak} ${tr("streakSub")}</div>
        </div>
      </div>

      <div class="sec-head"><h2>${tr("achievements")}</h2></div>
      <div class="badges">${badges}</div>

      <div style="margin-top:16px" class="menu-list">${menu}</div>
    `;
  }

  // ============================================================
  // DETAIL VIEWS (devotional / study)
  // ============================================================
  function renderDevotional() {
    const d = DATA.devotional[state.lang];
    const body = d.body.map((p,i) => i===1?`<p class="pull">${p}</p>`:`<p>${p}</p>`).join("");
    return `
      <div class="detail-hero" style="background:radial-gradient(130% 120% at 30% 0%, #7b2cff, #2a0a66)">
        <button class="back" data-action="back">${ICONS.chevLeft}</button>
        <div class="meta" style="margin-top:30px"><span>${ICONS.clock} ${d.time} ${tr("minutes")}</span><span>📖 ${tr("devotionalOfDay")}</span></div>
        <h1>${d.title}</h1>
      </div>
      <div class="reading-body">${body}</div>
      <button class="btn btn-purple btn-block" data-action="markDone">${ICONS.check} ${state.lang==='en'?'Mark as completed':state.lang==='es'?'Marcar como completado':'Marcar como concluído'}</button>
      <button class="btn btn-ghost btn-block" style="margin-top:10px" data-action="playAudio" data-id="4">${ICONS.audio} ${state.lang==='en'?'Listen to audio version':state.lang==='es'?'Escuchar versión en audio':'Ouvir versão em áudio'}</button>
    `;
  }

  function renderStudyDetail(id) {
    const s = DATA.studies.find(x => x.id == id) || DATA.studies[0];
    const lessons = Array.from({length: Math.min(s.lessons,6)}, (_,i) => {
      const done = (i/ s.lessons*100) < s.prog;
      return `<div class="lesson ${done?'done':''}">
        <div class="num">${done?ICONS.check:i+1}</div>
        <div class="li-t">${tr("lesson")} ${i+1}</div>
        <div class="li-d">${12+i*3} min</div>
      </div>`;
    }).join("");
    return `
      <div class="detail-hero" style="background:radial-gradient(130% 120% at 30% 0%,${GRADS[s.g]})">
        <button class="back" data-action="back">${ICONS.chevLeft}</button>
        <div style="font-size:46px;margin-top:18px">${s.icon}</div>
        <h1>${s.title}</h1>
        <p>${s.instructor}</p>
        <div class="meta"><span>🎬 ${s.lessons} ${tr("lessons")}</span><span>📊 ${s.prog}%</span><span>${s.cat}</span></div>
      </div>
      <button class="btn btn-purple btn-block" data-action="playAudio" data-id="1">${ICONS.play} ${s.prog>0?tr("continueWatching"):(state.lang==='en'?'Start course':state.lang==='es'?'Empezar curso':'Começar curso')}</button>
      <div class="sec-head"><h2>${tr("lessons").charAt(0).toUpperCase()+tr("lessons").slice(1)}</h2></div>
      <div class="card">${lessons}</div>
    `;
  }

  // ============================================================
  // BOTTOM NAV
  // ============================================================
  const TABS = [
    { id:"home", icon:"home" },
    { id:"bible", icon:"book" },
    { id:"study", icon:"study" },
    { id:"audio", icon:"audio" },
    { id:"store", icon:"store" },
  ];
  function renderNav() {
    navEl.innerHTML = TABS.map(tab => `
      <button class="nav-item ${state.screen===tab.id?'active':''}" data-nav="${tab.id}">
        ${ICONS[tab.icon]}<span>${t().nav[tab.id]}</span>
      </button>`).join("") + `
      <button class="nav-item ${state.screen==='profile'?'active':''}" data-nav="profile">
        ${ICONS.user}<span>${tr("profileTitle")}</span>
      </button>`;
  }

  // ============================================================
  // ROUTER
  // ============================================================
  function render() {
    let html = "";
    switch (state.screen) {
      case "home": html = renderHome(); break;
      case "bible": html = renderBible(); break;
      case "study": html = renderStudy(); break;
      case "audio": html = renderAudio(); break;
      case "store": html = renderStore(); break;
      case "profile": html = renderProfile(); break;
      case "devotional": html = renderDevotional(); break;
      case "studyDetail": html = renderStudyDetail(state.detailId); break;
      default: html = renderHome();
    }
    screenEl.innerHTML = html;
    screenEl.scrollTop = 0;
    renderNav();
  }

  function go(screen, detailId) {
    state.prev = state.screen;
    state.screen = screen;
    if (detailId != null) state.detailId = detailId;
    render();
  }

  // ============================================================
  // SHEETS (language + settings)
  // ============================================================
  const backdrop = $("#sheetBackdrop");
  const sheetEl = $("#sheet");

  function openSheet(html) {
    sheetEl.innerHTML = `<div class="grab"></div>` + html;
    backdrop.classList.add("show");
  }
  function closeSheet() { backdrop.classList.remove("show"); }

  function langSheet() {
    const rows = Object.keys(I18N).map(k => `
      <div class="opt-row ${state.lang===k?'active':''}" data-setlang="${k}">
        <span class="flag">${I18N[k].flag}</span> ${I18N[k].langName}
        <svg class="check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>
      </div>`).join("");
    openSheet(`<h3>${tr("chooseLanguage")}</h3>${rows}`);
  }

  function settingsSheet() {
    const opts = [
      { k:"light", icon:"sun", label: tr("light") },
      { k:"dark", icon:"moon", label: tr("dark") },
      { k:"system", icon:"settings", label: tr("system") },
    ].map(o => `
      <div class="opt-row ${state.theme===o.k?'active':''}" data-settheme="${o.k}">
        <span class="o-ic">${ICONS[o.icon]}</span> ${o.label}
        <svg class="check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>
      </div>`).join("");
    openSheet(`<h3>${tr("appearance")}</h3>${opts}
      <h3 style="margin-top:18px">${tr("chooseLanguage")}</h3>
      ${Object.keys(I18N).map(k => `<div class="opt-row ${state.lang===k?'active':''}" data-setlang="${k}"><span class="flag">${I18N[k].flag}</span> ${I18N[k].langName}<svg class="check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></div>`).join("")}`);
  }

  // ============================================================
  // MINI PLAYER
  // ============================================================
  const mini = $("#miniPlayer");
  function playAudio(id) {
    const a = DATA.audios.find(x => x.id == id) || DATA.audios[0];
    state.nowPlaying = a;
    state.playing = true;
    $("#mpArt").textContent = a.icon;
    $("#mpTitle").textContent = a.title;
    $("#mpSub").textContent = a.author + " · " + a.dur;
    mini.classList.add("show");
    updatePlayBtn();
    toast("▶ " + a.title);
  }
  function togglePlay() {
    state.playing = !state.playing;
    updatePlayBtn();
  }
  function updatePlayBtn() {
    $("#mpToggle").innerHTML = state.playing
      ? `<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>`
      : ICONS.play;
  }

  // ============================================================
  // EVENT DELEGATION
  // ============================================================
  document.addEventListener("click", (e) => {
    const navBtn = e.target.closest("[data-nav]");
    if (navBtn) { go(navBtn.dataset.nav); return; }

    const setlang = e.target.closest("[data-setlang]");
    if (setlang) {
      state.lang = setlang.dataset.setlang;
      localStorage.setItem("b24h_lang", state.lang);
      document.documentElement.lang = state.lang === "pt" ? "pt-BR" : state.lang;
      closeSheet(); render(); return;
    }
    const settheme = e.target.closest("[data-settheme]");
    if (settheme) {
      state.theme = settheme.dataset.settheme;
      localStorage.setItem("b24h_theme", state.theme);
      applyTheme();
      settingsSheet(); return;
    }

    if (e.target.closest(".sheet")) return;
    if (e.target === backdrop) { closeSheet(); return; }

    const el = e.target.closest("[data-action]");
    if (!el) return;
    const action = el.dataset.action;
    const id = el.dataset.id;

    switch (action) {
      case "lang": langSheet(); break;
      case "notifications": toast("🔔 3 " + (state.lang==='en'?'new notifications':state.lang==='es'?'nuevas notificaciones':'novas notificações')); break;
      case "settings": settingsSheet(); break;
      case "readBible": go("bible"); break;
      case "goStudy": go("study"); break;
      case "goAudio": go("audio"); break;
      case "openDevotional": go("devotional"); break;
      case "openStudy": go("studyDetail", id); break;
      case "back": go(state.prev || "home"); break;
      case "playAudio": playAudio(id); break;
      case "save": toast("🔖 " + tr("saved")); break;
      case "share": toast("📤 " + tr("shared")); break;
      case "buy": case "product": toast("🛒 " + tr("added")); break;
      case "markDone": toast("✅ " + (state.lang==='en'?'Completed! +1 day streak':state.lang==='es'?'¡Completado! +1 día':'Concluído! +1 dia de sequência')); break;
      case "studyCat": state.studyCat = +el.dataset.i; render(); break;
      case "audioCat": state.audioCat = +el.dataset.i; render(); break;
      case "version": document.querySelectorAll('[data-action="version"]').forEach(c=>c.classList.remove('active')); el.classList.add('active'); toast(tr("version")+": "+el.dataset.v); break;
      case "prevCh": case "nextCh": case "bookPicker": toast("📖 " + bookName() + " " + DATA.continueBook.chapter); break;
      case "prayer": toast("🙏 " + tr("qaPrayer")); break;
      case "plan": go("study"); break;
      case "word": case "night": go("devotional"); break;
      case "library": toast("📚 " + tr("myLibrary")); break;
      default: break;
    }
  });

  $("#mpToggle").addEventListener("click", (e) => { e.stopPropagation(); togglePlay(); });
  mini.addEventListener("click", () => { if (state.nowPlaying) toast("🎧 " + state.nowPlaying.title); });

  // Live clock in status bar
  function tickClock() {
    const d = new Date();
    $("#sb-time").textContent = String(d.getHours()).padStart(2,"0") + ":" + String(d.getMinutes()).padStart(2,"0");
  }
  setInterval(tickClock, 10000); tickClock();

  // React to system theme changes when in auto mode
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (state.theme === "system") applyTheme();
  });

  // ---------- Boot ----------
  document.documentElement.lang = state.lang === "pt" ? "pt-BR" : state.lang;
  applyTheme();
  render();
})();
