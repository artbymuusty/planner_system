// ===== MODULE STATE =====
let modState = {
  medicines: [],
  water: { height:0, weight:0, age:0, gender:'male', dailyGoal:2500, log:{} },
  gym: { programs:[], activeProgram:null, exerciseLog:{} },
  birthdays: [],
  budget: { income:0, expenses:[], shoppingLists:[] },
  sleep: { logs:[], goalMin:7, goalMax:9 },
  goals: []
};

document.addEventListener('DOMContentLoaded', () => {
  loadModState();
  initModuleListeners();
});

function loadModState() {
  try {
    const raw = localStorage.getItem('hackplanner_modules');
    if (raw) { const d = JSON.parse(raw); Object.assign(modState, d); }
  } catch(e) { console.error(e); }
}
function saveModState() {
  localStorage.setItem('hackplanner_modules', JSON.stringify(modState));
}

function initModuleListeners() {
  // These are set up after DOM is ready
}

// ===== NOTIFICATIONS =====
function showNotification(msg, type='info') {
  const n = document.createElement('div');
  n.className = 'notification ' + type;
  n.textContent = msg;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 4500);
}

// ===== MEDICINE MODULE =====
function openMedicineModule() {
  document.getElementById('medicineOverlay').classList.add('active');
  renderMedicineList();
  renderMedSchedule();
  checkMedStock();
}

function renderMedicineList() {
  const list = document.getElementById('medList');
  if (!list) return;
  if (modState.medicines.length === 0) {
    list.innerHTML = '<p style="color:#64748b;text-align:center;padding:20px">Henüz ilaç eklenmedi</p>';
    return;
  }
  list.innerHTML = modState.medicines.map(m => {
    const freqText = m.frequency.join(', ');
    const daysText = m.days.join(', ');
    const isLow = m.remaining <= 5;
    return `<div class="med-item">
      <div class="med-icon">💊</div>
      <div class="med-info">
        <div class="med-name">${m.name}</div>
        <div class="med-detail">${m.dosage} • ${freqText} • ${daysText}</div>
        <div class="med-detail">${m.duration} gün • Başlangıç: ${m.startDate}</div>
      </div>
      <div class="med-stock">
        <div class="count ${isLow?'low':'ok'}">${m.remaining}</div>
        <div class="stock-label">kalan</div>
      </div>
      <button class="med-delete" onclick="deleteMedicine('${m.id}')">✕</button>
    </div>`;
  }).join('');
}

function addMedicine() {
  const name = document.getElementById('medName').value.trim();
  const dosage = document.getElementById('medDosage').value.trim();
  const duration = parseInt(document.getElementById('medDuration').value) || 0;
  const boxSize = parseInt(document.getElementById('medBoxSize').value) || 0;
  const remaining = parseInt(document.getElementById('medRemaining').value) || boxSize;
  const startDate = document.getElementById('medStartDate').value;

  if (!name || !dosage || !duration || !startDate) {
    alert('Lütfen tüm alanları doldurun'); return;
  }

  const frequency = [];
  document.querySelectorAll('#medFreqChecks .freq-check.active').forEach(el => frequency.push(el.dataset.val));
  if (frequency.length === 0) { alert('En az bir zaman seçin'); return; }

  const days = [];
  document.querySelectorAll('#medDayChecks .day-check.active').forEach(el => days.push(el.dataset.val));
  if (days.length === 0) { alert('En az bir gün seçin'); return; }

  const med = {
    id: 'med_' + Date.now(),
    name, dosage, frequency, days, duration, boxSize, remaining, startDate,
    takenLog: {}
  };

  modState.medicines.push(med);
  saveModState();
  renderMedicineList();
  renderMedSchedule();
  addMedicineToCalendar(med);
  showNotification(`${name} ilaç listesine eklendi`, 'success');

  // Clear form
  document.getElementById('medName').value = '';
  document.getElementById('medDosage').value = '';
  document.getElementById('medDuration').value = '';
  document.getElementById('medBoxSize').value = '';
  document.getElementById('medRemaining').value = '';
}

function deleteMedicine(id) {
  if (!confirm('Bu ilacı silmek istediğinize emin misiniz?')) return;
  modState.medicines = modState.medicines.filter(m => m.id !== id);
  saveModState();
  renderMedicineList();
  renderMedSchedule();
  removeMedicineFromCalendar(id);
}

function toggleFreqCheck(el) { el.classList.toggle('active'); }
function toggleDayCheck(el) { el.classList.toggle('active'); }

function renderMedSchedule() {
  const grid = document.getElementById('medScheduleGrid');
  if (!grid) return;
  const weekDates = getWeekDates();
  const dayMap = {'Pzt':0,'Sal':1,'Çar':2,'Per':3,'Cum':4,'Cmt':5,'Paz':6};

  grid.innerHTML = weekDates.map((d, i) => {
    const dateStr = formatDate(d);
    const dayName = DAYS_SHORT[i];
    const medsForDay = modState.medicines.filter(m => m.days.includes(dayName));
    const pillsHTML = medsForDay.map(m => {
      return m.frequency.map(f => {
        const taken = m.takenLog && m.takenLog[dateStr] && m.takenLog[dateStr].includes(f);
        return `<div class="med-pill${taken?' taken':''}" onclick="toggleMedTaken('${m.id}','${dateStr}','${f}')">${m.name.substring(0,6)} (${f.substring(0,1).toUpperCase()})</div>`;
      }).join('');
    }).join('');
    return `<div class="med-sched-day">
      <div class="day-label">${dayName}<br>${d.getDate()}</div>
      <div class="pills">${pillsHTML || '<span style="font-size:0.65rem;color:#64748b">-</span>'}</div>
    </div>`;
  }).join('');
}

function toggleMedTaken(medId, dateStr, freq) {
  const med = modState.medicines.find(m => m.id === medId);
  if (!med) return;
  if (!med.takenLog) med.takenLog = {};
  if (!med.takenLog[dateStr]) med.takenLog[dateStr] = [];

  const idx = med.takenLog[dateStr].indexOf(freq);
  if (idx >= 0) {
    med.takenLog[dateStr].splice(idx, 1);
    med.remaining = Math.min(med.remaining + 1, med.boxSize);
  } else {
    med.takenLog[dateStr].push(freq);
    med.remaining = Math.max(med.remaining - 1, 0);
  }
  saveModState();
  renderMedSchedule();
  renderMedicineList();
  checkMedStock();
  if (typeof renderAll === 'function') renderAll();
}

function checkMedStock() {
  modState.medicines.forEach(m => {
    if (m.remaining <= 5 && m.remaining > 0) {
      showNotification(`⚠️ ${m.name} ilacınız bitmek üzere! Kalan: ${m.remaining}`, 'warning');
    } else if (m.remaining === 0) {
      showNotification(`🚨 ${m.name} ilacınız bitti!`, 'warning');
    }
  });
}

function addMedicineToCalendar(med) {
  if (typeof state === 'undefined') return;
  const dayMap = {'Pzt':1,'Sal':2,'Çar':3,'Per':4,'Cum':5,'Cmt':6,'Paz':0};
  const timeMap = {'Sabah':'08:00','Öğle':'13:00','Akşam':'20:00'};
  const endMap = {'Sabah':'08:30','Öğle':'13:30','Akşam':'20:30'};
  const start = new Date(med.startDate);

  for (let d = 0; d < med.duration; d++) {
    const date = new Date(start);
    date.setDate(start.getDate() + d);
    const jsDay = date.getDay();
    const trDay = DAYS_SHORT[jsDay === 0 ? 6 : jsDay - 1];
    if (!med.days.includes(trDay)) continue;

    med.frequency.forEach(f => {
      const ev = {
        id: `medcal_${med.id}_${formatDate(date)}_${f}`,
        name: `💊 ${med.name}`,
        date: formatDate(date),
        startTime: timeMap[f] || '08:00',
        endTime: endMap[f] || '08:30',
        importance: 'high',
        completed: false,
        moduleType: 'medicine',
        moduleId: med.id
      };
      if (!state.events.find(e => e.id === ev.id)) {
        state.events.push(ev);
      }
    });
  }
  if (typeof saveState === 'function') saveState();
  if (typeof renderAll === 'function') renderAll();
}

function removeMedicineFromCalendar(medId) {
  if (typeof state === 'undefined') return;
  state.events = state.events.filter(e => !(e.moduleId === medId));
  if (typeof saveState === 'function') saveState();
  if (typeof renderAll === 'function') renderAll();
}

// ===== WATER MODULE =====
function openWaterModule() {
  document.getElementById('waterOverlay').classList.add('active');
  renderWaterVisual();
  renderWaterHistory();
  loadWaterProfile();
}

function loadWaterProfile() {
  const w = modState.water;
  if (w.height) document.getElementById('waterHeight').value = w.height;
  if (w.weight) document.getElementById('waterWeight').value = w.weight;
  if (w.age) document.getElementById('waterAge').value = w.age;
  if (w.gender) document.getElementById('waterGender').value = w.gender;
}

function saveWaterProfile() {
  const h = parseFloat(document.getElementById('waterHeight').value) || 0;
  const w = parseFloat(document.getElementById('waterWeight').value) || 0;
  const a = parseInt(document.getElementById('waterAge').value) || 0;
  const g = document.getElementById('waterGender').value;

  if (!h || !w || !a) { alert('Lütfen tüm bilgileri girin'); return; }

  modState.water.height = h;
  modState.water.weight = w;
  modState.water.age = a;
  modState.water.gender = g;

  // Calculate daily goal (ml) - basic formula
  let goal = w * 35; // 35ml per kg base
  if (a < 30) goal *= 1.1;
  if (g === 'male') goal *= 1.05;
  modState.water.dailyGoal = Math.round(goal / 50) * 50; // round to 50ml

  saveModState();
  renderWaterVisual();

  const bmi = (w / ((h/100) * (h/100))).toFixed(1);
  document.getElementById('bmiResult').innerHTML =
    `BMI: <strong>${bmi}</strong> • Günlük Su Hedefi: <strong>${modState.water.dailyGoal} ml</strong>`;
  document.getElementById('bmiResult').style.display = 'block';

  showNotification(`Günlük su hedefiniz: ${modState.water.dailyGoal} ml`, 'info');
}

function addWater(amount) {
  const today = formatDate(new Date());
  if (!modState.water.log[today]) modState.water.log[today] = { total:0, entries:[] };
  modState.water.log[today].total += amount;
  modState.water.log[today].entries.push({
    time: new Date().toLocaleTimeString('tr-TR', {hour:'2-digit',minute:'2-digit'}),
    amount: amount
  });
  saveModState();
  renderWaterVisual();
  renderWaterHistory();

  const pct = Math.round((modState.water.log[today].total / modState.water.dailyGoal) * 100);
  if (pct >= 100) {
    showNotification('🎉 Günlük su hedefinize ulaştınız!', 'success');
  } else {
    showNotification(`💧 +${amount}ml eklendi (${pct}%)`, 'info');
  }
  if (typeof renderAll === 'function') renderAll();
}

function addCustomWater() {
  const val = parseInt(document.getElementById('customWaterAmount').value) || 0;
  if (val <= 0) { alert('Geçerli bir miktar girin'); return; }
  addWater(val);
  document.getElementById('customWaterAmount').value = '';
}

function renderWaterVisual() {
  const today = formatDate(new Date());
  const consumed = modState.water.log[today]?.total || 0;
  const goal = modState.water.dailyGoal;
  const pct = Math.min(Math.round((consumed / goal) * 100), 100);

  const fill = document.getElementById('waterFill');
  if (fill) fill.style.height = pct + '%';

  const cur = document.getElementById('waterCurrent');
  if (cur) cur.textContent = (consumed / 1000).toFixed(1) + 'L';

  const goalEl = document.getElementById('waterGoal');
  if (goalEl) goalEl.textContent = '/ ' + (goal / 1000).toFixed(1) + 'L';

  const pctEl = document.getElementById('waterPercent');
  if (pctEl) pctEl.textContent = pct + '%';
}

function renderWaterHistory() {
  const today = formatDate(new Date());
  const entries = modState.water.log[today]?.entries || [];
  const list = document.getElementById('waterHistoryList');
  if (!list) return;

  if (entries.length === 0) {
    list.innerHTML = '<p style="color:#64748b;font-size:0.8rem;text-align:center">Bugün henüz su içilmedi</p>';
    return;
  }
  list.innerHTML = entries.slice().reverse().map(e =>
    `<div class="water-history-item"><span class="time">${e.time}</span><span class="amount">+${e.amount}ml</span></div>`
  ).join('');
}

function getWaterPercent(dateStr) {
  const consumed = modState.water.log[dateStr]?.total || 0;
  const goal = modState.water.dailyGoal || 2500;
  return Math.round((consumed / goal) * 100);
}

// ===== GYM MODULE =====
function openGymModule() {
  document.getElementById('gymOverlay').classList.add('active');
  renderGymPrograms();
  renderActiveProgram();
}

const GYM_TEMPLATES = [
  {
    name: 'Push/Pull/Legs',
    desc: 'Klasik 3 günlük bölünmüş program. İtme, çekme ve bacak günleri.',
    days: ['Pzt','Çar','Cum'],
    badge: '3 Gün',
    exercises: [
      {day:'Pzt',name:'Bench Press',sets:4,reps:8,muscle:'Göğüs',rest:90},
      {day:'Pzt',name:'Incline Dumbbell Press',sets:3,reps:10,muscle:'Üst Göğüs',rest:60},
      {day:'Pzt',name:'Overhead Press',sets:3,reps:10,muscle:'Omuz',rest:60},
      {day:'Pzt',name:'Tricep Pushdown',sets:3,reps:12,muscle:'Tricep',rest:45},
      {day:'Pzt',name:'Lateral Raise',sets:3,reps:15,muscle:'Yan Omuz',rest:40},
      {day:'Çar',name:'Barbell Row',sets:4,reps:8,muscle:'Sırt',rest:90},
      {day:'Çar',name:'Pull-up',sets:3,reps:10,muscle:'Sırt',rest:60},
      {day:'Çar',name:'Cable Row',sets:3,reps:12,muscle:'Sırt',rest:60},
      {day:'Çar',name:'Bicep Curl',sets:3,reps:12,muscle:'Bicep',rest:45},
      {day:'Çar',name:'Hammer Curl',sets:3,reps:12,muscle:'Ön Kol',rest:40},
      {day:'Cum',name:'Squat',sets:4,reps:8,muscle:'Bacak',rest:120},
      {day:'Cum',name:'Leg Press',sets:3,reps:10,muscle:'Bacak',rest:90},
      {day:'Cum',name:'Leg Extension',sets:3,reps:12,muscle:'Ön Bacak',rest:60},
      {day:'Cum',name:'Leg Curl',sets:3,reps:12,muscle:'Arka Bacak',rest:60},
      {day:'Cum',name:'Calf Raise',sets:4,reps:15,muscle:'Baldır',rest:45}
    ]
  },
  {
    name: 'Full Body',
    desc: 'Haftada 3 gün tüm vücudu çalıştıran başlangıç programı.',
    days: ['Pzt','Çar','Cum'],
    badge: '3 Gün • Başlangıç',
    exercises: [
      {day:'Pzt',name:'Squat',sets:3,reps:10,muscle:'Bacak',rest:90},
      {day:'Pzt',name:'Bench Press',sets:3,reps:10,muscle:'Göğüs',rest:90},
      {day:'Pzt',name:'Barbell Row',sets:3,reps:10,muscle:'Sırt',rest:90},
      {day:'Çar',name:'Deadlift',sets:3,reps:8,muscle:'Sırt/Bacak',rest:120},
      {day:'Çar',name:'Overhead Press',sets:3,reps:10,muscle:'Omuz',rest:60},
      {day:'Çar',name:'Lat Pulldown',sets:3,reps:10,muscle:'Sırt',rest:60},
      {day:'Cum',name:'Leg Press',sets:3,reps:12,muscle:'Bacak',rest:90},
      {day:'Cum',name:'Dumbbell Fly',sets:3,reps:12,muscle:'Göğüs',rest:60},
      {day:'Cum',name:'Face Pull',sets:3,reps:15,muscle:'Omuz',rest:45}
    ]
  },
  {
    name: 'Upper/Lower',
    desc: '4 günlük üst/alt beden bölünmesi. Orta seviye için ideal.',
    days: ['Pzt','Sal','Per','Cum'],
    badge: '4 Gün • Orta',
    exercises: [
      {day:'Pzt',name:'Bench Press',sets:4,reps:8,muscle:'Göğüs',rest:90},
      {day:'Pzt',name:'Barbell Row',sets:4,reps:8,muscle:'Sırt',rest:90},
      {day:'Pzt',name:'Lateral Raise',sets:3,reps:15,muscle:'Omuz',rest:45},
      {day:'Sal',name:'Squat',sets:4,reps:8,muscle:'Bacak',rest:120},
      {day:'Sal',name:'Romanian Deadlift',sets:3,reps:10,muscle:'Hamstring',rest:90},
      {day:'Sal',name:'Leg Curl',sets:3,reps:12,muscle:'Hamstring',rest:60},
      {day:'Per',name:'Overhead Press',sets:4,reps:8,muscle:'Omuz',rest:90},
      {day:'Per',name:'Pull-up',sets:3,reps:10,muscle:'Sırt',rest:60},
      {day:'Per',name:'Tricep Dip',sets:3,reps:12,muscle:'Tricep',rest:45},
      {day:'Cum',name:'Front Squat',sets:3,reps:10,muscle:'Bacak',rest:90},
      {day:'Cum',name:'Hip Thrust',sets:3,reps:12,muscle:'Kalça',rest:60},
      {day:'Cum',name:'Calf Raise',sets:4,reps:15,muscle:'Baldır',rest:45}
    ]
  }
];

function renderGymPrograms() {
  const container = document.getElementById('gymProgramCards');
  if (!container) return;

  if (modState.gym.programs.length === 0) {
    container.innerHTML = '<p style="color:#64748b;font-size:0.85rem">Henüz program eklenmedi. Aşağıdaki şablonlardan birini seçin veya kendi programınızı oluşturun.</p>';
    return;
  }

  container.innerHTML = modState.gym.programs.map(p => {
    const isActive = modState.gym.activeProgram === p.id;
    return `<div class="program-card${isActive?' active':''}" onclick="setActiveProgram('${p.id}')">
      <div class="prog-name">${p.name}</div>
      <div class="prog-days">${p.days.join(', ')}</div>
      <div class="prog-count">${p.exercises.length} hareket</div>
    </div>`;
  }).join('');
}

function renderActiveProgram() {
  const container = document.getElementById('gymExerciseList');
  if (!container) return;

  const prog = modState.gym.programs.find(p => p.id === modState.gym.activeProgram);
  if (!prog) {
    container.innerHTML = '<p style="color:#64748b;font-size:0.85rem;text-align:center">Aktif program seçilmedi</p>';
    return;
  }

  const today = formatDate(new Date());
  const todayDay = DAYS_SHORT[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const todayExercises = prog.exercises.filter(e => e.day === todayDay);

  if (todayExercises.length === 0) {
    container.innerHTML = `<p style="color:#64748b;font-size:0.85rem;text-align:center">Bugün (${todayDay}) ${prog.name} programında antrenman yok</p>`;
    return;
  }

  const log = modState.gym.exerciseLog[today] || [];

  container.innerHTML = `<h4 style="font-size:0.85rem;color:#fb923c;margin-bottom:10px">Bugünkü Antrenman (${todayDay})</h4>` +
    todayExercises.map((ex, i) => {
      const done = log.includes(`${prog.id}_${i}`);
      return `<div class="exercise-item${done?' done':''}">
        <span class="ex-muscle">${ex.muscle}</span>
        <div class="ex-info">
          <div class="ex-name">${ex.name}</div>
          <div class="ex-detail">${ex.sets} set × ${ex.reps} tekrar • ${ex.rest}s dinlenme</div>
        </div>
        <button class="ex-check${done?' checked':''}" onclick="toggleExercise('${prog.id}',${i})">${done?'✓':''}</button>
      </div>`;
    }).join('');
}

function setActiveProgram(id) {
  modState.gym.activeProgram = id;
  saveModState();
  renderGymPrograms();
  renderActiveProgram();
  addGymToCalendar();
}

function toggleExercise(progId, exIdx) {
  const today = formatDate(new Date());
  if (!modState.gym.exerciseLog[today]) modState.gym.exerciseLog[today] = [];
  const key = `${progId}_${exIdx}`;
  const idx = modState.gym.exerciseLog[today].indexOf(key);
  if (idx >= 0) {
    modState.gym.exerciseLog[today].splice(idx, 1);
  } else {
    modState.gym.exerciseLog[today].push(key);
  }
  saveModState();
  renderActiveProgram();
  if (typeof renderAll === 'function') renderAll();
}

function useGymTemplate(idx) {
  const tmpl = GYM_TEMPLATES[idx];
  const prog = {
    id: 'gym_' + Date.now(),
    name: tmpl.name,
    days: [...tmpl.days],
    exercises: tmpl.exercises.map(e => ({...e}))
  };
  modState.gym.programs.push(prog);
  modState.gym.activeProgram = prog.id;
  saveModState();
  renderGymPrograms();
  renderActiveProgram();
  addGymToCalendar();
  showNotification(`${tmpl.name} programı eklendi!`, 'success');
}

function addCustomExercise() {
  const name = document.getElementById('gymExName').value.trim();
  const muscle = document.getElementById('gymExMuscle').value.trim();
  const sets = parseInt(document.getElementById('gymExSets').value) || 3;
  const reps = parseInt(document.getElementById('gymExReps').value) || 10;
  const day = document.getElementById('gymExDay').value;

  if (!name || !muscle) { alert('Hareket adı ve kas grubu girin'); return; }

  let prog = modState.gym.programs.find(p => p.id === modState.gym.activeProgram);
  if (!prog) {
    prog = { id: 'gym_' + Date.now(), name: 'Programım', days: [], exercises: [] };
    modState.gym.programs.push(prog);
    modState.gym.activeProgram = prog.id;
  }

  if (!prog.days.includes(day)) prog.days.push(day);
  prog.exercises.push({ day, name, sets, reps, muscle, rest: 60 });
  saveModState();
  renderGymPrograms();
  renderActiveProgram();
  addGymToCalendar();
  showNotification(`${name} hareketi eklendi`, 'success');

  document.getElementById('gymExName').value = '';
  document.getElementById('gymExMuscle').value = '';
}

function deleteGymProgram(id) {
  if (!confirm('Bu programı silmek istediğinize emin misiniz?')) return;
  modState.gym.programs = modState.gym.programs.filter(p => p.id !== id);
  if (modState.gym.activeProgram === id) modState.gym.activeProgram = null;
  saveModState();
  renderGymPrograms();
  renderActiveProgram();
  removeGymFromCalendar(id);
}

function addGymToCalendar() {
  if (typeof state === 'undefined') return;
  // Remove old gym events
  state.events = state.events.filter(e => e.moduleType !== 'gym');

  const prog = modState.gym.programs.find(p => p.id === modState.gym.activeProgram);
  if (!prog) return;

  const weekDates = getWeekDates();
  weekDates.forEach((d, i) => {
    const dayName = DAYS_SHORT[i];
    if (!prog.days.includes(dayName)) return;
    const exCount = prog.exercises.filter(e => e.day === dayName).length;
    if (exCount === 0) return;

    const ev = {
      id: `gymcal_${prog.id}_${formatDate(d)}`,
      name: `🏋️ ${prog.name}`,
      date: formatDate(d),
      startTime: '17:00',
      endTime: '18:30',
      importance: 'medium',
      completed: false,
      moduleType: 'gym',
      moduleId: prog.id
    };
    if (!state.events.find(e => e.id === ev.id)) {
      state.events.push(ev);
    }
  });
  if (typeof saveState === 'function') saveState();
  if (typeof renderAll === 'function') renderAll();
}

function removeGymFromCalendar(id) {
  if (typeof state === 'undefined') return;
  state.events = state.events.filter(e => !(e.moduleId === id));
  if (typeof saveState === 'function') saveState();
  if (typeof renderAll === 'function') renderAll();
}

// ===== BIRTHDAY MODULE =====
function openBirthdayModule() {
  document.getElementById('birthdayOverlay').classList.add('active');
  renderBirthdayList();
}

function renderBirthdayList() {
  const list = document.getElementById('bdayList');
  if (!list) return;
  if (!modState.birthdays || modState.birthdays.length === 0) {
    list.innerHTML = '<p style="color:#64748b;text-align:center;padding:20px">Henüz doğum günü eklenmedi</p>';
    return;
  }

  const today = new Date();
  const sorted = [...modState.birthdays].sort((a, b) => {
    const da = getNextBirthday(a.date);
    const db = getNextBirthday(b.date);
    return da - db;
  });

  list.innerHTML = sorted.map(b => {
    const nextBday = getNextBirthday(b.date);
    const diff = Math.ceil((nextBday - today) / (1000*60*60*24));
    const countdownText = diff === 0 ? '🎉 BUGÜN!' : diff === 1 ? 'Yarın!' : `${diff} gün kaldı`;
    const isUpcoming = diff <= 7;
    const bdate = new Date(b.date);
    const age = today.getFullYear() - bdate.getFullYear();
    const giftBought = b.giftBought;
    const giftHTML = b.giftPlanned ? `
      <button class="bday-gift-status ${giftBought?'bought':'not-bought'}" onclick="toggleGiftBought('${b.id}')">
        ${giftBought ? '✅ Alındı' : '🎁 Alınmadı'}
      </button>
      ${b.giftIdea ? `<div class="bday-gift-detail">${b.giftIdea} • ${b.giftPrice ? b.giftPrice+'₺' : ''}</div>` : ''}
      ${b.giftBuyBy && !giftBought ? `<div class="bday-gift-detail">Son: ${b.giftBuyBy}</div>` : ''}
    ` : '';

    return `<div class="bday-item${isUpcoming?' upcoming':''}">
      <div class="bday-avatar">${b.name.charAt(0)}</div>
      <div class="bday-info">
        <div class="bday-name">${b.name}</div>
        <div class="bday-date">${formatBdayDate(b.date)} (${age} yaş)</div>
        <div class="bday-countdown">${countdownText}</div>
      </div>
      <div class="bday-gift">${giftHTML}</div>
      <button class="bday-delete" onclick="deleteBirthday('${b.id}')">✕</button>
    </div>`;
  }).join('');
}

function addBirthday() {
  const name = document.getElementById('bdayName').value.trim();
  const date = document.getElementById('bdayDate').value;
  const giftPlanned = document.getElementById('bdayGiftPlanned').value === 'yes';
  const giftIdea = document.getElementById('bdayGiftIdea').value.trim();
  const giftPrice = document.getElementById('bdayGiftPrice').value;
  const giftBuyBy = document.getElementById('bdayGiftBuyBy').value;

  if (!name || !date) { alert('İsim ve tarih girin'); return; }

  const bday = {
    id: 'bday_' + Date.now(),
    name, date, giftPlanned,
    giftIdea: giftPlanned ? giftIdea : '',
    giftPrice: giftPlanned ? parseFloat(giftPrice) || 0 : 0,
    giftBuyBy: giftPlanned ? giftBuyBy : '',
    giftBought: false
  };

  if (!modState.birthdays) modState.birthdays = [];
  modState.birthdays.push(bday);
  saveModState();
  renderBirthdayList();
  addBirthdayToCalendar(bday);
  showNotification(`${name} doğum günü eklendi 🎂`, 'success');

  document.getElementById('bdayName').value = '';
  document.getElementById('bdayDate').value = '';
  document.getElementById('bdayGiftIdea').value = '';
  document.getElementById('bdayGiftPrice').value = '';
  document.getElementById('bdayGiftBuyBy').value = '';
}

function deleteBirthday(id) {
  if (!confirm('Bu doğum gününü silmek istediğinize emin misiniz?')) return;
  modState.birthdays = modState.birthdays.filter(b => b.id !== id);
  saveModState();
  renderBirthdayList();
  if (typeof state !== 'undefined') {
    state.events = state.events.filter(e => e.moduleId !== id);
    if (typeof saveState === 'function') saveState();
    if (typeof renderAll === 'function') renderAll();
  }
}

function toggleGiftBought(id) {
  const b = modState.birthdays.find(x => x.id === id);
  if (b) { b.giftBought = !b.giftBought; saveModState(); renderBirthdayList(); }
}

function getNextBirthday(dateStr) {
  const today = new Date(); today.setHours(0,0,0,0);
  const bdate = new Date(dateStr);
  const next = new Date(today.getFullYear(), bdate.getMonth(), bdate.getDate());
  if (next < today) next.setFullYear(next.getFullYear() + 1);
  return next;
}

function formatBdayDate(dateStr) {
  const d = new Date(dateStr);
  const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

function addBirthdayToCalendar(bday) {
  // Birthdays no longer added as full-day calendar events
  // They show as banners at top of calendar day column
  if (typeof renderAll === 'function') renderAll();
}

// ===== BUDGET & SHOPPING MODULE =====
function openBudgetModule() {
  document.getElementById('budgetOverlay').classList.add('active');
  renderBudgetDashboard();
  renderShoppingLists();
}

function renderBudgetDashboard() {
  const dash = document.getElementById('budgetDash');
  if (!dash) return;
  const b = modState.budget;
  const totalExp = b.expenses.reduce((s,e) => s + e.amount, 0);
  const remaining = b.income - totalExp;
  const pct = b.income > 0 ? Math.round((totalExp / b.income) * 100) : 0;
  dash.innerHTML = `
    <div class="budget-summary">
      <div class="budget-card income"><div class="budget-label">Aylık Gelir</div><div class="budget-value">₺${b.income.toLocaleString('tr-TR')}</div></div>
      <div class="budget-card expense"><div class="budget-label">Toplam Harcama</div><div class="budget-value">₺${totalExp.toLocaleString('tr-TR')}</div></div>
      <div class="budget-card ${remaining>=0?'positive':'negative'}"><div class="budget-label">Kalan</div><div class="budget-value">₺${remaining.toLocaleString('tr-TR')}</div></div>
    </div>
    <div class="budget-bar-wrap"><div class="budget-bar-bg"><div class="budget-bar-fill" style="width:${Math.min(pct,100)}%"></div></div><span class="budget-bar-pct">${pct}%</span></div>
    <div class="expense-list">${b.expenses.length === 0 ? '<p style="color:#64748b;text-align:center;padding:12px">Henüz harcama eklenmedi</p>' : b.expenses.map(e => `<div class="expense-item"><span class="expense-cat">${e.category}</span><span class="expense-name">${e.name}</span><span class="expense-amount">₺${e.amount}</span><button class="med-delete" onclick="deleteExpense('${e.id}')">✕</button></div>`).join('')}</div>`;
}

function addIncome() {
  const val = parseFloat(document.getElementById('budgetIncome').value) || 0;
  if (val <= 0) { alert('Geçerli bir gelir girin'); return; }
  modState.budget.income = val;
  saveModState(); renderBudgetDashboard();
  showNotification('Gelir güncellendi', 'success');
}

function addExpense() {
  const name = document.getElementById('expName').value.trim();
  const amount = parseFloat(document.getElementById('expAmount').value) || 0;
  const category = document.getElementById('expCategory').value;
  if (!name || amount <= 0) { alert('Ad ve tutar girin'); return; }
  modState.budget.expenses.push({ id:'exp_'+Date.now(), name, amount, category, date: formatDate(new Date()) });
  saveModState(); renderBudgetDashboard();
  document.getElementById('expName').value = '';
  document.getElementById('expAmount').value = '';
  showNotification(`${name} harcaması eklendi`, 'success');
}

function deleteExpense(id) {
  modState.budget.expenses = modState.budget.expenses.filter(e => e.id !== id);
  saveModState(); renderBudgetDashboard();
}

function renderShoppingLists() {
  const container = document.getElementById('shoppingListContainer');
  if (!container) return;
  const lists = modState.budget.shoppingLists;
  if (lists.length === 0) {
    container.innerHTML = '<p style="color:#64748b;text-align:center;padding:12px">Henüz alışveriş listesi yok</p>';
    return;
  }
  container.innerHTML = lists.map(list => {
    const done = list.items.filter(i => i.bought).length;
    const total = list.items.length;
    const pct = total > 0 ? Math.round((done/total)*100) : 0;
    return `<div class="shopping-list-card">
      <div class="sl-header"><span class="sl-title">🛒 ${list.name}</span><span class="sl-date">${list.date}</span><button class="med-delete" onclick="deleteShoppingList('${list.id}')">✕</button></div>
      <div class="sl-progress"><div class="sl-bar"><div class="sl-fill" style="width:${pct}%"></div></div><span>${pct}%</span></div>
      <div class="sl-items">${list.items.map((item,idx) => `<div class="sl-item ${item.bought?'bought':''}" onclick="toggleShoppingItem('${list.id}',${idx})"><span class="sl-check">${item.bought?'✅':'⬜'}</span><span class="sl-item-name">${item.name}</span></div>`).join('')}</div>
    </div>`;
  }).join('');
}

function addShoppingList() {
  const name = document.getElementById('shopListName').value.trim();
  const date = document.getElementById('shopListDate').value;
  const itemsRaw = document.getElementById('shopListItems').value.trim();
  if (!name || !itemsRaw) { alert('Liste adı ve ürünler girin'); return; }
  const items = itemsRaw.split('\n').filter(i => i.trim()).map(i => ({ name: i.trim(), bought: false }));
  const list = { id:'shop_'+Date.now(), name, date: date || formatDate(new Date()), items };
  modState.budget.shoppingLists.push(list);
  saveModState(); renderShoppingLists();
  // Add to calendar
  if (typeof state !== 'undefined' && date) {
    const ev = { id:`shopcal_${list.id}`, name:`🛒 ${name}`, date, startTime:'10:00', endTime:'11:00', importance:'medium', completed:false, moduleType:'shopping', moduleId:list.id };
    if (!state.events.find(e => e.id === ev.id)) state.events.push(ev);
    if (typeof saveState === 'function') saveState();
    if (typeof renderAll === 'function') renderAll();
  }
  document.getElementById('shopListName').value = '';
  document.getElementById('shopListItems').value = '';
  showNotification(`${name} listesi eklendi`, 'success');
}

function deleteShoppingList(id) {
  modState.budget.shoppingLists = modState.budget.shoppingLists.filter(l => l.id !== id);
  if (typeof state !== 'undefined') { state.events = state.events.filter(e => e.moduleId !== id); if (typeof saveState === 'function') saveState(); }
  saveModState(); renderShoppingLists();
  if (typeof renderAll === 'function') renderAll();
}

function toggleShoppingItem(listId, idx) {
  const list = modState.budget.shoppingLists.find(l => l.id === listId);
  if (list && list.items[idx]) { list.items[idx].bought = !list.items[idx].bought; saveModState(); renderShoppingLists(); }
}

// ===== SLEEP MODULE =====
function openSleepModule() {
  document.getElementById('sleepOverlay').classList.add('active');
  renderSleepLogs();
  renderSleepReport();
}

function renderSleepLogs() {
  const container = document.getElementById('sleepLogList');
  if (!container) return;
  const logs = modState.sleep.logs;
  if (logs.length === 0) {
    container.innerHTML = '<p style="color:#64748b;text-align:center;padding:20px">Henüz uyku kaydı yok</p>';
    return;
  }
  container.innerHTML = [...logs].reverse().slice(0,14).map(log => {
    const hrs = log.duration;
    let quality = '😴', qualityText = 'Yetersiz', qualityClass = 'bad';
    if (hrs >= 7 && hrs <= 9) { quality = '😊'; qualityText = 'İdeal'; qualityClass = 'good'; }
    else if (hrs >= 5 && hrs < 7) { quality = '😐'; qualityText = 'Orta'; qualityClass = 'mid'; }
    else if (hrs > 9) { quality = '😪'; qualityText = 'Fazla'; qualityClass = 'mid'; }
    return `<div class="sleep-log-item"><div class="sleep-log-date">${log.date}</div><div class="sleep-log-times"><span>🌙 ${log.sleepTime}</span><span>☀️ ${log.wakeTime}</span></div><div class="sleep-log-dur ${qualityClass}"><span class="dur-val">${hrs.toFixed(1)} saat</span><span class="dur-quality">${quality} ${qualityText}</span></div></div>`;
  }).join('');
}

function addSleepLog() {
  const date = document.getElementById('sleepDate').value;
  const sleepTime = document.getElementById('sleepTimeInput').value;
  const wakeTime = document.getElementById('wakeTimeInput').value;
  if (!date || !sleepTime || !wakeTime) { alert('Tüm alanları doldurun'); return; }
  const sH = parseInt(sleepTime.split(':')[0]), sM = parseInt(sleepTime.split(':')[1]);
  const wH = parseInt(wakeTime.split(':')[0]), wM = parseInt(wakeTime.split(':')[1]);
  let duration = (wH + wM/60) - (sH + sM/60);
  if (duration <= 0) duration += 24;
  modState.sleep.logs.push({ id:'slp_'+Date.now(), date, sleepTime, wakeTime, duration: Math.round(duration*10)/10 });
  saveModState(); renderSleepLogs(); renderSleepReport();
  document.getElementById('sleepDate').value = '';
  showNotification(`Uyku kaydı eklendi: ${duration.toFixed(1)} saat`, 'info');
}

function renderSleepReport() {
  const report = document.getElementById('sleepReport');
  if (!report) return;
  const logs = modState.sleep.logs;
  if (logs.length < 1) { report.innerHTML = '<p style="color:#64748b;text-align:center">Rapor için uyku kaydı ekleyin</p>'; return; }
  const avg = logs.reduce((s,l) => s + l.duration, 0) / logs.length;
  const best = Math.max(...logs.map(l => l.duration));
  const worst = Math.min(...logs.map(l => l.duration));
  const idealCount = logs.filter(l => l.duration >= 7 && l.duration <= 9).length;
  const idealPct = Math.round((idealCount / logs.length) * 100);
  let advice = '', riskHTML = '';
  if (avg < 4) {
    advice = '⚠️ Ciddi uyku eksikliği! Bağışıklık sistemi zayıflar, dikkat bozukluğu ve kalp hastalığı riski artar.';
    riskHTML = '<div class="sleep-risk critical">🚨 KRİTİK: 0-4 saat uyku, bilişsel performansı %50 düşürür, kaza riski 3 kat artar!</div>';
  } else if (avg < 6) {
    advice = '⚠️ Yetersiz uyku. Hafıza sorunları, kilo artışı ve depresyon riski yükselir.';
    riskHTML = '<div class="sleep-risk warning">⚠️ DİKKAT: 4-6 saat uyku, bağışıklığı %30 zayıflatır, diyabet riski artar.</div>';
  } else if (avg <= 9) {
    advice = '✅ İdeal aralıktasınız! Vücudunuz yeterli dinlenme alıyor.';
    riskHTML = '<div class="sleep-risk good">💚 İDEAL: 7-9 saat uyku, beyin ve vücut sağlığı için en uygun aralık.</div>';
  } else {
    advice = '😪 Fazla uyku da zararlı olabilir. Depresyon ve kalp riski artabilir.';
    riskHTML = '<div class="sleep-risk warning">⚠️ 9+ saat uyku metabolizmayı yavaşlatabilir.</div>';
  }
  report.innerHTML = `
    <div class="sleep-stats-grid">
      <div class="sleep-stat"><div class="ss-icon">⏱️</div><div class="ss-val">${avg.toFixed(1)} saat</div><div class="ss-label">Ortalama</div></div>
      <div class="sleep-stat"><div class="ss-icon">🏆</div><div class="ss-val">${best.toFixed(1)} saat</div><div class="ss-label">En İyi</div></div>
      <div class="sleep-stat"><div class="ss-icon">📉</div><div class="ss-val">${worst.toFixed(1)} saat</div><div class="ss-label">En Kötü</div></div>
      <div class="sleep-stat"><div class="ss-icon">🎯</div><div class="ss-val">${idealPct}%</div><div class="ss-label">İdeal Oran</div></div>
    </div>
    ${riskHTML}
    <div class="sleep-advice">${advice}</div>
    <div class="sleep-ideal-range"><h4>🛏️ Önerilen Uyku Aralığı</h4>
      <div class="sleep-range-bar"><div class="range-bad">0-4s<br><small>Tehlikeli</small></div><div class="range-warn">4-6s<br><small>Yetersiz</small></div><div class="range-good">7-9s<br><small>İdeal ✓</small></div><div class="range-warn">9+s<br><small>Fazla</small></div></div>
      <div class="sleep-marker" style="left:${Math.min(avg/12*100,100)}%">▲ Siz: ${avg.toFixed(1)}s</div>
    </div>
    <div class="sleep-effects"><h4>⏰ Yetersiz Uykunun Etkileri</h4><ul>
      <li>🧠 <strong>0-3 saat:</strong> Bilişsel fonksiyonlar ciddi bozulur, halüsinasyon riski</li>
      <li>😵 <strong>3-5 saat:</strong> Dikkat dağınıklığı, refleks kaybı, bağışıklık çöker</li>
      <li>😴 <strong>5-6 saat:</strong> Hafıza zayıflar, kilo alımı hızlanır, stres artar</li>
      <li>💚 <strong>7-9 saat:</strong> İdeal aralık - hücre yenilenmesi, hafıza pekişmesi</li>
    </ul></div>`;
}

// ===== GOALS MODULE =====
function openGoalsModule() {
  document.getElementById('goalsOverlay').classList.add('active');
  renderGoals();
}

function renderGoals() {
  const container = document.getElementById('goalsList');
  if (!container) return;
  if (!modState.goals || modState.goals.length === 0) {
    container.innerHTML = '<p style="color:#64748b;text-align:center;padding:20px">Henüz hedef eklenmedi</p>';
    return;
  }
  container.innerHTML = modState.goals.map(g => {
    const pct = Math.min(Math.round((g.current / g.target) * 100), 100);
    const isComplete = pct >= 100;
    let barColor = 'linear-gradient(90deg,#ef4444,#f97316)';
    if (pct >= 75) barColor = 'linear-gradient(90deg,#22c55e,#a3e635)';
    else if (pct >= 50) barColor = 'linear-gradient(90deg,#3b82f6,#6366f1)';
    else if (pct >= 25) barColor = 'linear-gradient(90deg,#f97316,#eab308)';
    const motivational = pct < 25 ? '🔥 Hadi başla!' : pct < 50 ? '💪 Devam et!' : pct < 75 ? '🚀 Harika gidiyorsun!' : pct < 100 ? '⭐ Neredeyse tamam!' : '🏆 TAMAMLANDI!';
    return `<div class="goal-item ${isComplete?'complete':''}">
      <div class="goal-header"><span class="goal-icon">${g.icon||'🎯'}</span><span class="goal-name">${g.name}</span><button class="med-delete" onclick="deleteGoal('${g.id}')">✕</button></div>
      <div class="goal-bar-wrap"><div class="goal-bar-bg"><div class="goal-bar-fill" style="width:${pct}%;background:${barColor}"></div></div><span class="goal-pct">${pct}%</span></div>
      <div class="goal-detail"><span>${g.current} / ${g.target} ${g.unit||''}</span><span class="goal-motivate">${motivational}</span></div>
      <div class="goal-actions">
        <button class="goal-inc" onclick="updateGoalProgress('${g.id}',${g.step||1})">+${g.step||1}</button>
        <button class="goal-dec" onclick="updateGoalProgress('${g.id}',-${g.step||1})">-${g.step||1}</button>
      </div>
    </div>`;
  }).join('');
}

function addGoal() {
  const name = document.getElementById('goalName').value.trim();
  const target = parseFloat(document.getElementById('goalTarget').value) || 0;
  const unit = document.getElementById('goalUnit').value.trim();
  const step = parseFloat(document.getElementById('goalStep').value) || 1;
  const icon = document.getElementById('goalIcon').value || '🎯';
  if (!name || target <= 0) { alert('Hedef adı ve miktar girin'); return; }
  modState.goals.push({ id:'goal_'+Date.now(), name, target, current:0, unit, step, icon });
  saveModState(); renderGoals();
  document.getElementById('goalName').value = '';
  document.getElementById('goalTarget').value = '';
  document.getElementById('goalUnit').value = '';
  showNotification(`${name} hedefi eklendi!`, 'success');
}

function updateGoalProgress(id, delta) {
  const g = modState.goals.find(x => x.id === id);
  if (!g) return;
  g.current = Math.max(0, Math.min(g.current + delta, g.target * 1.5));
  saveModState(); renderGoals();
  const pct = Math.round((g.current / g.target) * 100);
  if (pct >= 100) showNotification(`🏆 ${g.name} hedefine ulaştınız!`, 'success');
}

function deleteGoal(id) {
  modState.goals = modState.goals.filter(g => g.id !== id);
  saveModState(); renderGoals();
}

// ===== BIRTHDAY BANNERS FOR CALENDAR =====
function getBirthdayBannersForDate(dateStr) {
  if (!modState.birthdays) return [];
  return modState.birthdays.filter(b => {
    const next = getNextBirthday(b.date);
    return formatDate(next) === dateStr;
  });
}
