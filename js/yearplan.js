// ══════════════════════════════════════════════
// BIBLIA EN UN AÑO — plan de lectura generado a partir de BOOKS (app.js)
// ══════════════════════════════════════════════
function _ypLang() {
  return window.currentLang || localStorage.getItem('hv_lang') || 'es';
}

const YP_STR = {
  es: {
    cardTitle: 'Biblia en un año',
    cardStartTitle: 'Biblia en un año',
    cardStartSub: 'Comenzá tu plan de lectura',
    cardDaySub: (d) => `Día ${d} de 365`,
    cardReadToday: 'Leer el de hoy →',
    setupIntro: 'Leé toda la Biblia en 365 días. Elegí por dónde empezar y con qué traducción.',
    setupTestamentLabel: '¿Por dónde querés empezar?',
    setupOT: 'Antiguo Testamento',
    setupNT: 'Nuevo Testamento',
    setupTranslationLabel: 'Traducción',
    setupStrongsLabel: "Activar Strong's (griego/hebreo)",
    setupStartBtn: 'Comenzar plan',
    activeDayLabel: (d) => `Día ${d} de 365`,
    progressLabel: (n) => `${n} de 365 días completados`,
    todayLabel: 'Lectura de hoy',
    readBtn: 'Leer capítulo',
    markDoneBtn: 'Marcar como leído',
    doneLabel: '✓ Completado',
    allDaysTitle: 'Todos los días',
    prefsTitle: 'Preferencias del plan',
    prefsTranslationLabel: 'Traducción',
    prefsStrongsLabel: "Activar Strong's (griego/hebreo)",
    prefsSaveBtn: 'Guardar',
    prefsCancelBtn: 'Cancelar',
  },
  en: {
    cardTitle: 'Bible in a Year',
    cardStartTitle: 'Bible in a Year',
    cardStartSub: 'Start your reading plan',
    cardDaySub: (d) => `Day ${d} of 365`,
    cardReadToday: "Read today's →",
    setupIntro: 'Read the whole Bible in 365 days. Choose where to start and which translation.',
    setupTestamentLabel: 'Where would you like to start?',
    setupOT: 'Old Testament',
    setupNT: 'New Testament',
    setupTranslationLabel: 'Translation',
    setupStrongsLabel: "Enable Strong's (Greek/Hebrew)",
    setupStartBtn: 'Start plan',
    activeDayLabel: (d) => `Day ${d} of 365`,
    progressLabel: (n) => `${n} of 365 days completed`,
    todayLabel: "Today's reading",
    readBtn: 'Read chapter',
    markDoneBtn: 'Mark as read',
    doneLabel: '✓ Completed',
    allDaysTitle: 'All days',
    prefsTitle: 'Plan preferences',
    prefsTranslationLabel: 'Translation',
    prefsStrongsLabel: "Enable Strong's (Greek/Hebrew)",
    prefsSaveBtn: 'Save',
    prefsCancelBtn: 'Cancel',
  }
};

function _ypBuildFullList(startTestament) {
  const order = startTestament === 'nt' ? ['nt', 'ot'] : ['ot', 'nt'];
  const list = [];
  order.forEach(t => {
    BOOKS[t].forEach(b => {
      for (let c = 1; c <= b.chapters; c++) list.push({ book: b.name, chapter: c });
    });
  });
  return list;
}

function _ypBuildPlan(startTestament) {
  const list = _ypBuildFullList(startTestament);
  const total = list.length;
  const days = [];
  for (let d = 0; d < 365; d++) {
    const startIdx = Math.floor(d * total / 365);
    const endIdx = Math.floor((d + 1) * total / 365);
    days.push({ day: d + 1, entries: list.slice(startIdx, endIdx) });
  }
  return days;
}

function _ypFormatReading(entries, lang) {
  if (!entries || !entries.length) return '';
  const parts = [];
  let curBook = entries[0].book, rangeStart = entries[0].chapter, rangeEnd = entries[0].chapter;
  for (let i = 1; i <= entries.length; i++) {
    const e = entries[i];
    if (e && e.book === curBook && e.chapter === rangeEnd + 1) {
      rangeEnd = e.chapter;
    } else {
      const name = lang === 'en' ? (BOOK_NAMES_EN[curBook] || curBook) : curBook;
      parts.push(rangeStart === rangeEnd ? `${name} ${rangeStart}` : `${name} ${rangeStart}-${rangeEnd}`);
      if (e) { curBook = e.book; rangeStart = e.chapter; rangeEnd = e.chapter; }
    }
  }
  return parts.join(', ');
}

function _ypTranslationOptionsHTML() {
  const existing = document.getElementById('translationSelect');
  if (existing && existing.innerHTML.trim()) return existing.innerHTML;
  return '<option value="nbla">NBLA</option>';
}

// Navega al lector de Biblia en un libro/capítulo específico, aplicando traducción y Strong's
function openBibleAt(bookName, chapterNum, translation, wantStrongs) {
  currentBookName = bookName;
  currentChapter = chapterNum;
  showScreen('bible');
  showChapterView();
  if (translation) {
    BibleAPI.setTranslation(translation); // ya llama a loadChapter con currentBookName/currentChapter, y esa función actualiza el header correctamente
  } else {
    BibleAPI.loadChapter(bookName, chapterNum);
  }
  if (typeof wantStrongs === 'boolean' && wantStrongs !== strongsEnabled) {
    toggleStrongs();
  }
}

const YearPlan = {
  _planCache: null,
  _selectedTestament: 'ot',

  async getConfig() {
    const user = auth.currentUser;
    if (user) {
      const doc = await db.collection('users').doc(user.uid).collection('readingPlan').doc('config').get();
      return doc.exists ? doc.data() : null;
    }
    const raw = localStorage.getItem('hv_yearplan');
    return raw ? JSON.parse(raw) : null;
  },

  async saveConfig(config) {
    const user = auth.currentUser;
    if (user) {
      await db.collection('users').doc(user.uid).collection('readingPlan').doc('config').set(config, { merge: true });
    } else {
      localStorage.setItem('hv_yearplan', JSON.stringify(config));
    }
  },

  getPlan(testament) {
    if (!this._planCache || this._planCache.testament !== testament) {
      this._planCache = { testament, days: _ypBuildPlan(testament) };
    }
    return this._planCache.days;
  },

  _chaptersInDay(dayData) {
    return dayData && dayData.entries ? dayData.entries.length : 0;
  },

  getTodayDayNumber(config) {
    const start = new Date(config.startedAt);
    const now = new Date();
    const diffDays = Math.floor((now - start) / 86400000);
    return Math.min(Math.max(diffDays + 1, 1), 365);
  },

  selectTestament(t, btnEl) {
    this._selectedTestament = t;
    document.querySelectorAll('.yp-test-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
  },

  async confirmStart() {
    const translationEl = document.getElementById('ypTranslation');
    const strongsEl = document.getElementById('ypStrongs');
    const translation = translationEl ? translationEl.value : 'nbla';
    const strongs = strongsEl ? strongsEl.checked : false;
    await this.start(this._selectedTestament, translation, strongs);
  },

  openPrefs() {
    const lang = _ypLang();
    const S = YP_STR[lang];
    document.getElementById('ypPrefsTitle').textContent = S.prefsTitle;
    document.getElementById('ypPrefsTranslationLabel').textContent = S.prefsTranslationLabel;
    document.getElementById('ypPrefsStrongsLabel').textContent = S.prefsStrongsLabel;
    document.getElementById('ypPrefsSaveBtn').textContent = S.prefsSaveBtn;
    document.getElementById('ypPrefsCancelBtn').textContent = S.prefsCancelBtn;
    this.getConfig().then(config => {
      if (!config) return;
      const sel = document.getElementById('ypPrefsTranslation');
      sel.innerHTML = _ypTranslationOptionsHTML();
      sel.value = config.translation;
      document.getElementById('ypPrefsStrongs').checked = !!config.strongs;
    });
    document.getElementById('ypPrefsModal').classList.remove('hidden');
  },

  async savePrefs() {
    const config = await this.getConfig();
    if (!config) return;
    config.translation = document.getElementById('ypPrefsTranslation').value;
    config.strongs = document.getElementById('ypPrefsStrongs').checked;
    await this.saveConfig(config);
    document.getElementById('ypPrefsModal').classList.add('hidden');
    showToast(_ypLang() === 'en' ? '✅ Preferences updated' : '✅ Preferencias actualizadas');
  },

  _activeDay: null,
  _activeDayLast: null,

  isAtBoundary() {
    return !!(this._activeDay && this._activeDayLast &&
      currentBookName === this._activeDayLast.book &&
      currentChapter === this._activeDayLast.chapter);
  },

  refreshBoundaryUI() {
    const nextBtn = document.getElementById('btnNextChapter');
    if (!nextBtn) return;
    const lang = _ypLang();
    if (this.isAtBoundary()) {
      nextBtn.textContent = lang === 'en' ? "✓ Mark as read" : '✓ Marcar como leído';
      nextBtn.classList.add('yp-boundary-btn');
    } else {
      nextBtn.classList.remove('yp-boundary-btn');
      nextBtn.textContent = (translations[lang] && translations[lang].nextChapter) || (lang === 'en' ? 'Next →' : 'Siguiente →');
    }
  },

  async completeActiveDayAndContinue() {
    const day = this._activeDay;
    if (!day) return;
    await this.markComplete(day);
    this._activeDay = null;
    this._activeDayLast = null;
    showScreen('yearplan');
  },

  async start(testament, translation, strongs) {
    const config = {
      testament, translation, strongs,
      startedAt: new Date().toISOString(),
      completedDays: []
    };
    await this.saveConfig(config);
    if (typeof logAnalyticsEvent === 'function') logAnalyticsEvent('yearplan_started', { testament, translation });
    await this.renderScreen();
    await this.renderHomeCard();
  },

  async markComplete(dayNumber) {
    const config = await this.getConfig();
    if (!config) return;
    if (!config.completedDays.includes(dayNumber)) {
      config.completedDays.push(dayNumber);
      await this.saveConfig(config);
    }
    if (typeof logAnalyticsEvent === 'function') logAnalyticsEvent('yearplan_day_completed', { day: dayNumber });
    showToast(_ypLang() === 'en' ? '✅ Day marked as read' : '✅ Día marcado como leído');
    await this.renderScreen();
    await this.renderHomeCard();
  },

  async openToday() {
    const config = await this.getConfig();
    if (!config) return;
    await this.openDay(this.getTodayDayNumber(config));
  },

  async openDay(dayNumber) {
    const config = await this.getConfig();
    if (!config) return;
    const plan = this.getPlan(config.testament);
    const dayData = plan[dayNumber - 1];
    if (!dayData || !dayData.entries.length) return;
    const first = dayData.entries[0];
    const alreadyDone = config.completedDays.includes(dayNumber);
    this._activeDay = alreadyDone ? null : dayNumber;
    this._activeDayLast = dayData.entries[dayData.entries.length - 1];
    openBibleAt(first.book, first.chapter, config.translation, config.strongs);
  },

  async renderHomeCard() {
    const el = document.getElementById('yearPlanHomeCard');
    if (!el) return;
    const lang = _ypLang();
    const S = YP_STR[lang];
    const config = await this.getConfig();
    if (!config) {
      el.innerHTML = `
        <div class="yp-home-icon"><svg class="isvg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6.5C10.5 5 8 4.5 3 4.5v14c5 0 7.5.5 9 2 1.5-1.5 4-2 9-2v-14c-5 0-7.5.5-9 2z"/><path d="M12 6.5v14"/></svg></div>
        <div class="yp-home-text">
          <div class="yp-home-title">${S.cardStartTitle}</div>
          <div class="yp-home-sub">${S.cardStartSub}</div>
        </div>`;
      return;
    }
    const dayNum = this.getTodayDayNumber(config);
    const planForPct = this.getPlan(config.testament);
    const totalChapters = planForPct.reduce((sum, d) => sum + this._chaptersInDay(d), 0);
    const readChapters = config.completedDays.reduce((sum, dnum) => sum + this._chaptersInDay(planForPct[dnum - 1]), 0);
    const pct = totalChapters ? Math.round((readChapters / totalChapters) * 100) : 0;
    el.innerHTML = `
      <div class="yp-home-icon"><svg class="isvg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6.5C10.5 5 8 4.5 3 4.5v14c5 0 7.5.5 9 2 1.5-1.5 4-2 9-2v-14c-5 0-7.5.5-9 2z"/><path d="M12 6.5v14"/></svg></div>
      <div class="yp-home-text">
        <div class="yp-home-title">${S.cardTitle}</div>
        <div class="yp-home-sub">${S.cardDaySub(dayNum)}</div>
        <div class="yp-home-bar"><div class="yp-home-bar-fill" style="width:${pct}%"></div></div>
      </div>`;
  },

  async renderScreen() {
    const container = document.getElementById('yearPlanContent');
    if (!container) return;
    const lang = _ypLang();
    const S = YP_STR[lang];
    const config = await this.getConfig();

    if (!config) {
      container.innerHTML = `
        <div class="yp-setup">
          <p class="yp-setup-intro">${S.setupIntro}</p>
          <div class="yp-setup-label">${S.setupTestamentLabel}</div>
          <div class="yp-testament-row">
            <button class="yp-test-btn active" onclick="YearPlan.selectTestament('ot', this)">${S.setupOT}</button>
            <button class="yp-test-btn" onclick="YearPlan.selectTestament('nt', this)">${S.setupNT}</button>
          </div>
          <div class="yp-setup-label">${S.setupTranslationLabel}</div>
          <select class="form-input" id="ypTranslation">${_ypTranslationOptionsHTML()}</select>
          <label class="yp-strongs-label">
            <input type="checkbox" id="ypStrongs">
            ${S.setupStrongsLabel}
          </label>
          <button class="submit-btn" onclick="YearPlan.confirmStart()">${S.setupStartBtn}</button>
        </div>`;
      return;
    }

    const btnPrefsEl = document.getElementById('btnYpPrefs');
    if (btnPrefsEl) btnPrefsEl.style.display = '';
    const plan = this.getPlan(config.testament);
    const dayNum = this.getTodayDayNumber(config);
    const dayData = plan[dayNum - 1];
    const isDone = config.completedDays.includes(dayNum);
    const readingText = _ypFormatReading(dayData.entries, lang);
    const totalChapters2 = plan.reduce((sum, d) => sum + this._chaptersInDay(d), 0);
    const readChapters2 = config.completedDays.reduce((sum, dnum) => sum + this._chaptersInDay(plan[dnum - 1]), 0);
    const pct = totalChapters2 ? Math.round((readChapters2 / totalChapters2) * 100) : 0;

    const daysListHTML = plan.map(d => {
      const done = config.completedDays.includes(d.day);
      const isToday = d.day === dayNum;
      return `<div class="yp-day-row ${done ? 'done' : ''} ${isToday ? 'current' : ''}" onclick="YearPlan.openDay(${d.day})" style="cursor:pointer">
        <div class="yp-day-num">${d.day}</div>
        <div class="yp-day-reading">${_ypFormatReading(d.entries, lang)}</div>
        <div class="yp-day-check">${done ? '✓' : ''}</div>
      </div>`;
    }).join('');

    container.innerHTML = `
      <div class="yp-progress-card">
        <div class="yp-day-label">${S.activeDayLabel(dayNum)}</div>
        <div class="yp-home-bar"><div class="yp-home-bar-fill" style="width:${pct}%"></div></div>
        <div class="yp-progress-text">${S.progressLabel(config.completedDays.length)}</div>
      </div>
      <div class="yp-today-card">
        <div class="yp-today-label">${S.todayLabel}</div>
        <div class="yp-today-reading">${readingText}</div>
        <div class="yp-today-actions">
          <button class="ch-btn" onclick="YearPlan.openToday()">${S.readBtn}</button>
          ${isDone
            ? `<button class="ch-btn" disabled style="opacity:0.6">${S.doneLabel}</button>`
            : `<button class="ch-btn" style="background:var(--gold);color:var(--ink);border:none" onclick="YearPlan.markComplete(${dayNum})">${S.markDoneBtn}</button>`
          }
        </div>
      </div>
      <div class="yp-daylist-title">${S.allDaysTitle}</div>
      <div class="yp-daylist">${daysListHTML}</div>`;
  }
};
window.YearPlan = YearPlan;
