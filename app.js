// ===== STATE =====
const DAYS_TR = ['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'];
const DAYS_SHORT = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
const MONTHS_TR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const START_HOUR = 8;
const END_HOUR = 23;
const HOUR_HEIGHT = 60;

let state = {
  currentWeekStart: getMonday(new Date()),
  events: [],
  user: null,
  deleteMode: false,
  pendingDeleteId: null,
  pendingReaddEvent: null,
  selectedImportance: 'high'
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  renderAll();
  setupListeners();
  setDefaultDate();
});

function setupListeners() {
  document.getElementById('prevWeek').addEventListener('click', () => navigateWeek(-1));
  document.getElementById('nextWeek').addEventListener('click', () => navigateWeek(1));
  document.getElementById('tourBtn').addEventListener('click', startTour);
  document.getElementById('profileBtn').addEventListener('click', () => showModal('loginModal'));
  document.getElementById('addEventBtn').addEventListener('click', () => {
    if (state.deleteMode) toggleDeleteMode();
    setDefaultDate();
    showModal('addEventModal');
  });
  document.getElementById('removeEventBtn').addEventListener('click', toggleDeleteMode);

  // Sidebar navigation
  const navBtns = {
    homeBtn: null,
    medicineBtn: 'medicineOverlay',
    waterBtn: 'waterOverlay',
    gymBtn: 'gymOverlay',
    birthdayBtn: 'birthdayOverlay',
    budgetBtn: 'budgetOverlay',
    sleepBtn: 'sleepOverlay',
    goalsBtn: 'goalsOverlay'
  };
  const openFnNames = {
    medicineBtn: 'openMedicineModule',
    waterBtn: 'openWaterModule',
    gymBtn: 'openGymModule',
    birthdayBtn: 'openBirthdayModule',
    budgetBtn: 'openBudgetModule',
    sleepBtn: 'openSleepModule',
    goalsBtn: 'openGoalsModule'
  };

  Object.keys(navBtns).forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener('click', () => {
      // Close all module overlays
      document.querySelectorAll('.module-overlay').forEach(o => o.classList.remove('active'));
      // Update active sidebar button
      document.querySelectorAll('.sidebar-btn').forEach(b => {
        if (Object.keys(navBtns).includes(b.id)) b.classList.remove('active');
      });
      btn.classList.add('active');

      // Toggle main content visibility
      const main = document.getElementById('mainContent');
      if (btnId === 'homeBtn') {
        main.style.display = '';
      } else {
        main.style.display = 'none';
        const fnName = openFnNames[btnId];
        if (fnName && typeof window[fnName] === 'function') window[fnName]();
        else if (navBtns[btnId]) document.getElementById(navBtns[btnId]).classList.add('active');
      }
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => q.parentElement.classList.toggle('open'));
  });

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', e => { if (e.target === o) hideModal(o.id); });
  });
}

// ===== DATE UTILS =====
function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0,0,0,0);
  return date;
}

function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function isToday(d) {
  const today = new Date();
  return d.getDate()===today.getDate() && d.getMonth()===today.getMonth() && d.getFullYear()===today.getFullYear();
}

function isPast(d) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const check = new Date(d);
  check.setHours(0,0,0,0);
  return check < today;
}

function getWeekDates() {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(state.currentWeekStart);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function setDefaultDate() {
  const input = document.getElementById('eventDate');
  if (input) input.value = formatDate(new Date());
}

// ===== NAVIGATION =====
function navigateWeek(dir) {
  state.currentWeekStart.setDate(state.currentWeekStart.getDate() + (dir * 7));
  renderAll();
}

// ===== RENDER ALL =====
function renderAll() {
  renderWeekInfo();
  renderCalendar();
  renderUpcoming();
  renderChart();
  renderUncompleted();
  renderInbox();
  updateProfileBtn();
}

// ===== WEEK INFO =====
function renderWeekInfo() {
  const dates = getWeekDates();
  const start = dates[0];
  const end = dates[6];
  let text;
  if (start.getMonth() === end.getMonth()) {
    text = `${start.getDate()}-${end.getDate()} ${MONTHS_TR[start.getMonth()]} ${start.getFullYear()} Haftası`;
  } else {
    text = `${start.getDate()} ${MONTHS_TR[start.getMonth()]} - ${end.getDate()} ${MONTHS_TR[end.getMonth()]} ${end.getFullYear()} Haftası`;
  }
  document.getElementById('weekInfo').textContent = text;
}

// ===== CALENDAR =====
function renderCalendar() {
  const section = document.getElementById('calendarSection');
  const dates = getWeekDates();

  // Header
  let headerHTML = '<div class="calendar-header"><div class="cal-time-header">Saat</div>';
  dates.forEach((d, i) => {
    const cls = isToday(d) ? ' today' : (isPast(d) ? ' past' : '');
    headerHTML += `<div class="cal-day-header${cls}">
      <span class="day-name">${DAYS_SHORT[i]}</span>
      <span class="day-date">${d.getDate()}</span>
    </div>`;
  });
  headerHTML += '</div>';

  // Body
  let bodyHTML = `<div class="calendar-body${state.deleteMode ? ' delete-mode' : ''}">`;
  // Time labels
  bodyHTML += '<div class="time-labels">';
  for (let h = START_HOUR; h <= END_HOUR; h++) {
    bodyHTML += `<div class="time-label">${String(h).padStart(2,'0')}:00</div>`;
  }
  bodyHTML += '</div>';

  // Day columns
  dates.forEach((d, dayIdx) => {
    const dateStr = formatDate(d);
    const colCls = isToday(d) ? ' today-col' : (isPast(d) ? ' past-col' : '');
    bodyHTML += `<div class="day-column${colCls}" data-date="${dateStr}">`;

    // Birthday banners at top
    if (typeof getBirthdayBannersForDate === 'function') {
      const bdays = getBirthdayBannersForDate(dateStr);
      bdays.forEach(b => {
        bodyHTML += `<div class="bday-banner">🎂 ${b.name}</div>`;
      });
    }

    // Hour lines
    for (let h = START_HOUR; h <= END_HOUR; h++) {
      bodyHTML += `<div class="hour-line" style="top:${(h - START_HOUR) * HOUR_HEIGHT}px"></div>`;
    }

    // Events for this day (exclude birthday module events)
    const dayEvents = state.events.filter(e => e.date === dateStr && e.moduleType !== 'birthday');
    dayEvents.forEach(ev => {
      const startParts = ev.startTime.split(':');
      const endParts = ev.endTime.split(':');
      const startH = parseInt(startParts[0]) + parseInt(startParts[1])/60;
      const endH = parseInt(endParts[0]) + parseInt(endParts[1])/60;
      const top = (startH - START_HOUR) * HOUR_HEIGHT;
      const height = Math.max((endH - startH) * HOUR_HEIGHT, 28);
      const impCls = ev.importance === 'high' ? 'imp-high' : (ev.importance === 'medium' ? 'imp-med' : 'imp-low');
      const completedCls = ev.completed ? ' completed' : '';

      bodyHTML += `<div class="event-card ${impCls}${completedCls}" 
        style="top:${top}px;height:${height}px" 
        data-id="${ev.id}"
        onclick="handleEventClick('${ev.id}')">
        <span class="event-name">${ev.name}</span>
        <span class="event-time">${ev.startTime} - ${ev.endTime}</span>
        <div class="delete-badge" onclick="event.stopPropagation();triggerDelete('${ev.id}')">✕</div>
      </div>`;
    });

    bodyHTML += '</div>';
  });
  bodyHTML += '</div>';

  section.innerHTML = headerHTML + bodyHTML;
}

// ===== EVENT MANAGEMENT =====
function handleEventClick(id) {
  if (state.deleteMode) {
    triggerDelete(id);
    return;
  }
  // Toggle completion
  const ev = state.events.find(e => e.id === id);
  if (ev) {
    ev.completed = !ev.completed;
    saveState();
    renderAll();
  }
}

function selectImportance(imp) {
  state.selectedImportance = imp;
  document.querySelectorAll('.imp-option').forEach(el => el.classList.remove('selected'));
  document.querySelector(`.imp-option[data-imp="${imp}"]`).classList.add('selected');
}

function addEvent() {
  const name = document.getElementById('eventName').value.trim();
  const date = document.getElementById('eventDate').value;
  const startTime = document.getElementById('eventStartTime').value;
  const endTime = document.getElementById('eventEndTime').value;

  if (!name) { alert('Lütfen etkinlik adı girin'); return; }
  if (!date) { alert('Lütfen tarih seçin'); return; }
  if (!startTime || !endTime) { alert('Lütfen saat belirleyin'); return; }
  if (startTime >= endTime) { alert('Bitiş saati başlangıçtan sonra olmalı'); return; }

  const ev = {
    id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2,5),
    name, date, startTime, endTime,
    importance: state.selectedImportance,
    completed: false
  };

  state.events.push(ev);
  saveState();
  hideModal('addEventModal');
  document.getElementById('eventName').value = '';
  state.selectedImportance = 'high';
  selectImportance('high');
  renderAll();
}

function toggleDeleteMode() {
  state.deleteMode = !state.deleteMode;
  const btn = document.getElementById('removeEventBtn');
  btn.classList.toggle('active', state.deleteMode);
  renderCalendar();
}

function triggerDelete(id) {
  const ev = state.events.find(e => e.id === id);
  if (!ev) return;
  state.pendingDeleteId = id;
  document.getElementById('deleteEventName').textContent = ev.name;
  showModal('deleteModal');
}

function confirmDelete() {
  if (state.pendingDeleteId) {
    state.events = state.events.filter(e => e.id !== state.pendingDeleteId);
    state.pendingDeleteId = null;
    saveState();
    renderAll();
  }
  hideModal('deleteModal');
}

function cancelDelete() {
  state.pendingDeleteId = null;
  hideModal('deleteModal');
}

// ===== UPCOMING =====
function renderUpcoming() {
  const list = document.getElementById('upcomingList');
  const today = formatDate(new Date());
  const weekDates = getWeekDates().map(formatDate);

  const upcoming = state.events
    .filter(e => weekDates.includes(e.date) && e.date >= today && !e.completed)
    .sort((a,b) => (a.date+a.startTime).localeCompare(b.date+b.startTime))
    .slice(0, 8);

  if (upcoming.length === 0) {
    list.innerHTML = '<div class="upcoming-empty">Yaklaşan etkinlik yok</div>';
    return;
  }

  list.innerHTML = upcoming.map(ev => {
    const dotCls = ev.importance === 'high' ? 'high' : (ev.importance === 'medium' ? 'med' : 'low');
    const dateObj = new Date(ev.date);
    const dayName = DAYS_SHORT[dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1];
    const tagHTML = ev.moduleType ? `<span class="event-tag ${ev.moduleType==='medicine'?'med-tag':ev.moduleType==='gym'?'gym-tag':''}">${ev.moduleType==='medicine'?'💊':ev.moduleType==='gym'?'🏋️':''}</span>` : '';
    return `<div class="upcoming-item" onclick="handleEventClick('${ev.id}')">
      <div class="upcoming-dot ${dotCls}"></div>
      <div class="upcoming-info">
        <div class="name">${ev.name} ${tagHTML}</div>
        <div class="time">${dayName} • ${ev.startTime} - ${ev.endTime}</div>
      </div>
    </div>`;
  }).join('');
}

// ===== CHART =====
function renderChart() {
  const container = document.getElementById('chartContainer');
  const dates = getWeekDates();

  container.innerHTML = dates.map((d, i) => {
    const dateStr = formatDate(d);
    const dayEvents = state.events.filter(e => e.date === dateStr);
    const total = dayEvents.length;
    const completed = dayEvents.filter(e => e.completed).length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const barH = total > 0 ? Math.max((pct / 100) * 160, 6) : 6;
    const pastCls = isPast(d) && !isToday(d) ? ' past-bar' : '';
    const emptyCls = total === 0 ? ' empty' : '';
    const todayCls = isToday(d) ? ' today-label' : '';

    return `<div class="chart-bar-wrap">
      <span class="chart-percent">${total > 0 ? pct + '%' : '-'}</span>
      <div class="chart-bar${pastCls}${emptyCls}" style="height:${barH}px"></div>
      <span class="chart-day-name${todayCls}">${DAYS_SHORT[i]}</span>
    </div>`;
  }).join('');
}

// ===== UNCOMPLETED =====
function renderUncompleted() {
  const list = document.getElementById('uncompletedList');
  const today = formatDate(new Date());
  const weekDates = getWeekDates().map(formatDate);

  const uncompleted = state.events
    .filter(e => weekDates.includes(e.date) && e.date < today && !e.completed);

  if (uncompleted.length === 0) {
    list.innerHTML = '<div class="no-uncompleted">🎉 Tüm geçmiş görevler tamamlandı!</div>';
    return;
  }

  list.innerHTML = uncompleted.map(ev => {
    const dateObj = new Date(ev.date);
    const dayName = DAYS_TR[dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1];
    return `<div class="uncompleted-item">
      <div class="uncompleted-info">
        <div class="name">${ev.name}</div>
        <div class="detail">${dayName} • ${ev.startTime} - ${ev.endTime}</div>
      </div>
      <button class="readd-btn" onclick="triggerReadd('${ev.id}')">Tekrar Ekle</button>
    </div>`;
  }).join('');
}

function triggerReadd(id) {
  const ev = state.events.find(e => e.id === id);
  if (!ev) return;
  state.pendingReaddEvent = ev;
  document.getElementById('readdEventName').textContent = ev.name;
  showModal('readdModal');
}

function confirmReadd() {
  if (state.pendingReaddEvent) {
    // Remove old, open add modal pre-filled
    state.events = state.events.filter(e => e.id !== state.pendingReaddEvent.id);
    document.getElementById('eventName').value = state.pendingReaddEvent.name;
    selectImportance(state.pendingReaddEvent.importance);
    document.getElementById('eventStartTime').value = state.pendingReaddEvent.startTime;
    document.getElementById('eventEndTime').value = state.pendingReaddEvent.endTime;
    setDefaultDate();
    state.pendingReaddEvent = null;
    saveState();
    hideModal('readdModal');
    showModal('addEventModal');
  }
}

// ===== AUTH =====
function login() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (!username) { alert('Kullanıcı adı girin'); return; }
  if (!password) { alert('Şifre girin'); return; }
  state.user = { name: username };
  saveState();
  updateLoginView();
  updateProfileBtn();
}

function logout() {
  state.user = null;
  saveState();
  updateLoginView();
  updateProfileBtn();
  document.getElementById('loginUsername').value = '';
  document.getElementById('loginPassword').value = '';
}

function updateLoginView() {
  const form = document.getElementById('loginForm');
  const view = document.getElementById('loggedInView');
  if (state.user) {
    form.style.display = 'none';
    view.style.display = 'block';
    document.getElementById('userAvatar').textContent = state.user.name.charAt(0).toUpperCase();
    document.getElementById('displayName').textContent = state.user.name;
  } else {
    form.style.display = 'block';
    view.style.display = 'none';
  }
}

function updateProfileBtn() {
  const btn = document.getElementById('profileBtn');
  btn.classList.toggle('active', !!state.user);
}

// ===== MODALS =====
function showModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add('active');
  if (id === 'loginModal') updateLoginView();
}

function hideModal(id) {
  document.getElementById(id).classList.remove('active');
}

function openModule(id) {
  document.getElementById(id).classList.add('active');
}
function closeModule(id) {
  document.getElementById(id).classList.remove('active');
  // Go back to home
  document.getElementById('mainContent').style.display = '';
  document.querySelectorAll('.sidebar-btn').forEach(b => {
    if (['homeBtn','medicineBtn','waterBtn','gymBtn','birthdayBtn','budgetBtn','sleepBtn','goalsBtn'].includes(b.id)) b.classList.remove('active');
  });
  const homeBtn = document.getElementById('homeBtn');
  if (homeBtn) homeBtn.classList.add('active');
}

// ===== INBOX =====
function renderInbox() {
  const bar = document.getElementById('inboxBar');
  if (!bar) return;
  const items = [];
  const today = new Date();

  // Check upcoming events today
  const todayStr = formatDate(today);
  const todayEvents = state.events.filter(e => e.date === todayStr && !e.completed);
  if (todayEvents.length > 0) {
    items.push(`<div class="inbox-item"><span class="inbox-icon">📅</span><span class="inbox-text"><strong>${todayEvents.length}</strong> etkinlik bugün</span></div>`);
  }

  // Check medicine stock
  if (typeof modState !== 'undefined' && modState.medicines) {
    modState.medicines.forEach(m => {
      if (m.remaining <= 5) {
        items.push(`<div class="inbox-item urgent"><span class="inbox-icon">💊</span><span class="inbox-text"><strong>${m.name}</strong> bitmek üzere (${m.remaining})</span></div>`);
      }
    });
  }

  // Check water
  if (typeof modState !== 'undefined' && modState.water) {
    const consumed = modState.water.log[todayStr]?.total || 0;
    const goal = modState.water.dailyGoal || 2500;
    const pct = Math.round((consumed / goal) * 100);
    if (pct < 100) {
      items.push(`<div class="inbox-item"><span class="inbox-icon">💧</span><span class="inbox-text">Su: <strong>${pct}%</strong></span></div>`);
    } else {
      items.push(`<div class="inbox-item"><span class="inbox-icon">✅</span><span class="inbox-text">Su hedefi tamam!</span></div>`);
    }
  }

  // Check birthdays
  if (typeof modState !== 'undefined' && modState.birthdays) {
    modState.birthdays.forEach(b => {
      const bdate = new Date(b.date);
      bdate.setFullYear(today.getFullYear());
      if (bdate < today) bdate.setFullYear(today.getFullYear() + 1);
      const diff = Math.ceil((bdate - today) / (1000*60*60*24));
      if (diff <= 7 && diff >= 0) {
        items.push(`<div class="inbox-item urgent"><span class="inbox-icon">🎂</span><span class="inbox-text"><strong>${b.name}</strong> ${diff===0?'BUGÜN!':diff+' gün sonra'}</span></div>`);
      }
    });
  }

  if (items.length === 0) {
    items.push(`<div class="inbox-item"><span class="inbox-icon">📬</span><span class="inbox-text">Bildirim yok, harika gidiyorsun!</span></div>`);
  }

  bar.innerHTML = items.join('');
}

// ===== STORAGE =====
function saveState() {
  const data = { events: state.events, user: state.user };
  localStorage.setItem('hackplanner', JSON.stringify(data));
}

function loadState() {
  try {
    const raw = localStorage.getItem('hackplanner');
    if (raw) {
      const data = JSON.parse(raw);
      state.events = data.events || [];
      state.user = data.user || null;
    }
  } catch(e) { console.error('Load error:', e); }
}

// ===== GUIDED TOUR =====
const TOUR_STEPS = [
  { target:'#inboxBar', title:'📬 Bildirim Çubuğu', desc:'Bugünkü etkinlik sayısı, su durumu, ilaç uyarıları ve yaklaşan doğum günleri burada görünür.', pos:'bottom' },
  { target:'.calendar-section', title:'📅 Haftalık Takvim', desc:'Tüm etkinlikleriniz burada saatlik olarak gösterilir. Bir etkinliğe tıklayarak tamamlandı olarak işaretleyebilirsiniz.', pos:'bottom' },
  { target:'#homeBtn', title:'🏠 Ana Sayfa', desc:'Ana takvim görünümüne dönmek için bu butona tıklayın.', pos:'right' },
  { target:'#medicineBtn', title:'💊 İlaç Takibi', desc:'İlaçlarınızı ekleyin, dozaj ve zamanlamalarını takip edin. İlaç azaldığında uyarı alırsınız.', pos:'right' },
  { target:'#waterBtn', title:'💧 Su Takibi', desc:'Günlük su tüketiminizi takip edin. Boy/kilo bilgilerinize göre kişisel hedef hesaplanır.', pos:'right' },
  { target:'#gymBtn', title:'🏋️ Gym Takibi', desc:'Antrenman programınızı oluşturun, hazır şablonları kullanın ve hareketlerinizi tamamlayın.', pos:'right' },
  { target:'#birthdayBtn', title:'🎂 Doğum Günleri', desc:'Yakınlarınızın doğum günlerini ekleyin, hediye takibi yapın. Takvimde üst kısımda banner olarak görünür.', pos:'right' },
  { target:'#budgetBtn', title:'💰 Bütçe & Alışveriş', desc:'Aylık gelir ve harcamalarınızı takip edin. Market alışveriş listeleri oluşturup takvimde gösterin.', pos:'right' },
  { target:'#sleepBtn', title:'😴 Uyku Takibi', desc:'Uyku saatlerinizi kaydedin, detaylı sağlık raporu alın. Yetersiz uykunun etkilerini görün.', pos:'right' },
  { target:'#goalsBtn', title:'🎯 Hedef Takibi', desc:'Kişisel hedefler belirleyin ve ilerlemenizi takip edin. Motivasyon mesajları ile hedefe ulaşın!', pos:'right' },
  { target:'#addEventBtn', title:'➕ Etkinlik Ekle', desc:'Yeni etkinlik oluşturmak için bu yeşil butona tıklayın. Ad, tarih, saat ve önem seviyesi belirleyin.', pos:'right' },
  { target:'#removeEventBtn', title:'➖ Etkinlik Sil', desc:'Silme modunu aktif edin, ardından takvimde silmek istediğiniz etkinliğin × işaretine tıklayın.', pos:'right' },
  { target:'#profileBtn', title:'👤 Profil', desc:'Kullanıcı girişi yapın. Verileriniz tarayıcınızda güvenle saklanır.', pos:'right' },
  { target:'.bottom-panels', title:'📊 Alt Paneller', desc:'Sol: AI Asistan (yakında). Sağ: Bu haftaki yaklaşan etkinlikleriniz listesi.', pos:'top' },
  { target:'.completion-section', title:'📈 Haftalık Tamamlanma', desc:'Her günün görev tamamlanma yüzdesini grafik olarak görün. Tamamlanmayan görevleri tekrar ekleyebilirsiniz.', pos:'top' },
];

let tourStep = 0;
let tourActive = false;

function startTour() {
  tourStep = 0;
  tourActive = true;
  document.getElementById('tourOverlay').classList.add('active');
  showTourStep();
}

function showTourStep() {
  const step = TOUR_STEPS[tourStep];
  if (!step) { endTour(); return; }
  const el = document.querySelector(step.target);
  const popup = document.getElementById('tourPopup');
  const arrow = document.getElementById('tourArrow');
  document.getElementById('tourTitle').textContent = step.title;
  document.getElementById('tourDesc').textContent = step.desc;
  document.getElementById('tourStepIndicator').textContent = `${tourStep+1} / ${TOUR_STEPS.length}`;
  document.getElementById('tourPrevBtn').style.display = tourStep === 0 ? 'none' : '';
  document.getElementById('tourNextBtn').textContent = tourStep === TOUR_STEPS.length-1 ? 'Bitir ✓' : 'İleri →';

  // Highlight target
  document.querySelectorAll('.tour-highlight').forEach(e => e.classList.remove('tour-highlight'));
  if (el) {
    el.classList.add('tour-highlight');
    el.scrollIntoView({ behavior:'smooth', block:'center' });
    setTimeout(() => positionTourPopup(el, step.pos), 300);
  } else {
    popup.style.top = '50%'; popup.style.left = '50%'; popup.style.transform = 'translate(-50%,-50%)';
    arrow.style.display = 'none';
  }
}

function positionTourPopup(el, pos) {
  const popup = document.getElementById('tourPopup');
  const arrow = document.getElementById('tourArrow');
  const rect = el.getBoundingClientRect();
  const pw = 340, ph = 180;
  let top, left;
  arrow.className = 'tour-arrow';
  arrow.style.display = 'block';

  if (pos === 'right') {
    top = rect.top + rect.height/2 - ph/2;
    left = rect.right + 16;
    arrow.classList.add('arrow-left');
  } else if (pos === 'bottom') {
    top = rect.bottom + 16;
    left = rect.left + rect.width/2 - pw/2;
    arrow.classList.add('arrow-top');
  } else {
    top = rect.top - ph - 16;
    left = rect.left + rect.width/2 - pw/2;
    arrow.classList.add('arrow-bottom');
  }
  top = Math.max(10, Math.min(top, window.innerHeight - ph - 10));
  left = Math.max(10, Math.min(left, window.innerWidth - pw - 10));
  popup.style.top = top + 'px';
  popup.style.left = left + 'px';
  popup.style.transform = 'none';
}

function nextTourStep() {
  tourStep++;
  if (tourStep >= TOUR_STEPS.length) { endTour(); return; }
  showTourStep();
}

function prevTourStep() {
  if (tourStep > 0) { tourStep--; showTourStep(); }
}

function endTour() {
  tourActive = false;
  document.getElementById('tourOverlay').classList.remove('active');
  document.querySelectorAll('.tour-highlight').forEach(e => e.classList.remove('tour-highlight'));
}
