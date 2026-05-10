'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Book, Play, Pause, RotateCcw, Plus, History, Library, Trash2, Calendar, Music, Trophy, Upload, CheckCircle2, TrendingUp, Zap, Clock, Settings, AlertCircle, Target, Maximize2, Minimize2 } from 'lucide-react';
import type { ModuleState, StudySubject } from '@/types';
import { formatDate } from '@/lib/dateUtils';

interface Props {
  active: boolean;
  modState: ModuleState;
  focusMode: boolean;
  onToggleFocus: () => void;
  onClose: () => void;
  onAddSession: (subjectId: string, duration: number, topic?: string, questions?: number) => void;
  onAddSubject: (name: string, color: string) => void;
  onDeleteSubject: (id: string) => void;
  onAddEvent?: (event: any) => void;
}

export default function StudyOverlay({
  active, modState, focusMode, onToggleFocus, onClose, onAddSession, onAddSubject, onDeleteSubject, onAddEvent
}: Props) {
  const [pomodoroFullscreen, setPomodoroFullscreen] = useState(false);
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubColor, setNewSubColor] = useState('#6366f1');
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null);
  
  // Pomodoro Settings
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [showSettings, setShowSettings] = useState(false);

  // Pomodoro State
  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<'work' | 'break'>('work');
  
  // Custom Music
  const [customMusic, setCustomMusic] = useState<{ name: string; url: string }[]>([]);
  const [activeMusicUrl, setActiveMusicUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Session Log Form
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [sessionTopic, setSessionTopic] = useState('');
  const [sessionQuestions, setSessionQuestions] = useState('');

  const subjects = modState.study.subjects || [];
  const activeSubject = subjects.find(s => s.id === activeSubjectId);

  // Stats
  const todayTotal = useMemo(() => {
    const today = formatDate(new Date());
    return modState.study.sessions
      .filter(s => s.date === today)
      .reduce((acc, curr) => acc + curr.duration, 0);
  }, [modState.study.sessions]);

  const personalRecord = useMemo(() => {
    const dailyTotals: Record<string, number> = {};
    modState.study.sessions.forEach(s => {
      dailyTotals[s.date] = (dailyTotals[s.date] || 0) + s.duration;
    });
    return Math.max(0, ...Object.values(dailyTotals));
  }, [modState.study.sessions]);

  // Timer Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleSessionEnd();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, sessionType, activeSubjectId]);

  // Audio Handler
  useEffect(() => {
    if (activeMusicUrl && audioRef.current) {
      audioRef.current.src = activeMusicUrl;
      audioRef.current.play().catch(() => {});
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
    return () => {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
    };
  }, [activeMusicUrl, active]);

  const handleSessionEnd = () => {
    setIsRunning(false);
    if (sessionType === 'work' && activeSubjectId) {
      setShowSessionForm(true);
    } else {
      setSessionType('work');
      setTimeLeft(workTime * 60);
    }
  };

  const finishSessionEarly = () => {
    if (isRunning) {
      const spentMin = Math.round((workTime * 60 - timeLeft) / 60);
      if (spentMin >= 1) {
         handleSessionEnd();
      } else {
         resetTimer();
      }
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(sessionType === 'work' ? workTime * 60 : breakTime * 60);
  };

  const updateWorkTime = (val: number) => {
    setWorkTime(val);
    if (!isRunning && sessionType === 'work') setTimeLeft(val * 60);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomMusic(prev => [...prev, { name: file.name, url }]);
      setActiveMusicUrl(url);
    }
  };

  const saveSession = () => {
    if (activeSubjectId) {
      const duration = sessionType === 'work' ? workTime : 0;
      onAddSession(activeSubjectId, duration, sessionTopic, parseInt(sessionQuestions) || 0);
      setShowSessionForm(false);
      setSessionTopic('');
      setSessionQuestions('');
      setSessionType('break');
      setTimeLeft(breakTime * 60);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${String(m).padStart(2, '0')}:${String(rs).padStart(2, '0')}`;
  };

  const handleAddSubject = () => {
    if (!newSubName) return;
    onAddSubject(newSubName, newSubColor);
    setNewSubName('');
    setShowAddSubject(false);
  };

  return (
    <div className={`module-overlay${active ? ' active' : ''}`} id="studyOverlay" style={{ background: '#fcfcfd', color: '#1e293b', fontFamily: "'Outfit', sans-serif" }}>
      <audio ref={audioRef} loop />
      
      <div className="module-header" style={{ background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#1e293b', fontWeight: 900 }}>
          <Library size={24} className="text-indigo-600" /> Kütüphane & Pomodoro
        </h2>
        <button className="close-module" onClick={onClose} style={{ background: '#f8fafc', borderRadius: '50%', width: 32, height: 32, border: 'none' }}>✕</button>
      </div>

      <div className="module-body" style={{ padding: '24px 40px' }}>
        {/* Bookshelf */}
        <div className="library-shelf-container" style={{ marginBottom: 40, display: pomodoroFullscreen ? 'none' : 'block' }}>
          <div className="shelf-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
               <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#475569' }}>Ders Rafları</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="m-btn"
                onClick={() => {
                  // Odak modu kapanırken pomodoro tam ekran da otomatik kapansın (tam ekran, odak modunu içerir)
                  if (focusMode && pomodoroFullscreen) setPomodoroFullscreen(false);
                  onToggleFocus();
                }}
                title="Odak Modu — sidebar ve üst barı gizler"
                style={{
                  background: focusMode ? 'rgba(239,68,68,0.1)' : '#f1f5f9',
                  color: focusMode ? '#ef4444' : '#475569',
                  border: focusMode ? '1px solid rgba(239,68,68,0.3)' : '1px solid #e2e8f0',
                  borderRadius: 12,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Target size={18} /> {focusMode ? 'Odak Modunu Kapat' : 'Odak Modu'}
              </button>
              <button className="m-btn primary" onClick={() => setShowAddSubject(true)} style={{ background: '#6366f1', borderRadius: 12 }}>
                <Plus size={18} /> Yeni Ders Ekle
              </button>
            </div>
          </div>

          <div className="shelf-row" style={{ 
            height: 180, borderBottom: '16px solid #e2e8f0', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '0 30px', gap: 8, background: '#fff', borderRadius: '20px 20px 0 0', boxShadow: 'inset 0 -20px 40px rgba(0,0,0,0.02)'
          }}>
            {subjects.map(sub => (
              <div key={sub.id} className={`book-spine ${activeSubjectId === sub.id ? 'active' : ''}`} onClick={() => setActiveSubjectId(sub.id)} style={{
                  width: 44, height: 140 + (Math.random() * 20), background: sub.color, borderRadius: '6px 6px 0 0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', border: activeSubjectId === sub.id ? '3px solid #1e293b' : '1px solid rgba(0,0,0,0.1)', boxShadow: activeSubjectId === sub.id ? `0 0 20px ${sub.color}44` : 'inset -4px 0 8px rgba(0,0,0,0.2)'
                }}>
                <span style={{ writingMode: 'vertical-rl', color: 'white', fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', textShadow: '0 1px 3px rgba(0,0,0,0.3)', letterSpacing: '0.5px' }}>{sub.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="module-grid" style={{ gridTemplateColumns: pomodoroFullscreen ? '1fr' : '1fr 380px', gap: 30 }}>
          {/* Work Panel */}
          <div className="module-card" style={{ background: '#fff', padding: 30, borderRadius: 24, border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
            {activeSubject ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 900, color: '#1e293b' }}>{activeSubject.name}</h3>
                    <p style={{ margin: 0, color: '#64748b', fontWeight: 600 }}>Çalışma Masasındasın</p>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                     <button
                        className="m-btn"
                        onClick={() => {
                          // Tam ekran açılırken odak modu da otomatik açılsın; kapanırken odak modu da kapansın.
                          const next = !pomodoroFullscreen;
                          setPomodoroFullscreen(next);
                          if (next && !focusMode) onToggleFocus();
                          if (!next && focusMode) onToggleFocus();
                        }}
                        title={pomodoroFullscreen ? 'Tam Ekrandan Çık' : 'Pomodoroyu Tam Ekran Yap'}
                        style={{
                          background: pomodoroFullscreen ? 'rgba(99,102,241,0.1)' : '#f1f5f9',
                          color: pomodoroFullscreen ? '#6366f1' : '#475569',
                          border: 'none',
                          width: 45,
                          height: 45,
                          borderRadius: 12,
                        }}
                     >
                        {pomodoroFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                     </button>
                     <button className="m-btn secondary" onClick={() => onAddEvent?.({ id: 'study_preset_' + activeSubject.id, name: activeSubject.name })} title="Takvime Planla" style={{ background: '#f1f5f9', color: '#6366f1', border: 'none', width: 45, height: 45, borderRadius: 12 }}>
                        <Calendar size={20} />
                     </button>
                     <button className="m-btn danger" style={{ background: '#fee2e2', color: '#ef4444', border: 'none', width: 45, height: 45, borderRadius: 12 }} onClick={() => setSubjectToDelete(activeSubject.id)}>
                        <Trash2 size={20} />
                     </button>
                  </div>
                </div>

                {/* Timer Settings Toggle */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                   <button onClick={() => setShowSettings(!showSettings)} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: '0.85rem', fontWeight: 700 }}>
                      <Settings size={16} /> Süre Ayarları
                   </button>
                </div>

                {showSettings && (
                   <div style={{ background: '#f8fafc', padding: 20, borderRadius: 20, marginBottom: 30, border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                         <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 8 }}>ÇALIŞMA (DK)</label>
                            <input type="number" value={workTime} onChange={e => updateWorkTime(parseInt(e.target.value) || 25)} style={{ width: '100%', height: 40, borderRadius: 10, border: '1px solid #cbd5e1', padding: '0 12px' }} />
                         </div>
                         <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 8 }}>MOLA (DK)</label>
                            <input type="number" value={breakTime} onChange={e => setBreakTime(parseInt(e.target.value) || 5)} style={{ width: '100%', height: 40, borderRadius: 10, border: '1px solid #cbd5e1', padding: '0 12px' }} />
                         </div>
                      </div>
                      <p style={{ fontSize: '0.7rem', color: '#6366f1', marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                         <AlertCircle size={14} /> Öneri: Verimli odaklanma için 25dk / 5dk kuralını dene.
                      </p>
                   </div>
                )}

                {/* Timer Display */}
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                   <div style={{ fontSize: '0.9rem', fontWeight: 900, color: sessionType === 'work' ? '#6366f1' : '#10b981', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 10 }}>
                      {sessionType === 'work' ? 'Odak Zamanı' : 'Dinlenme Vakti'}
                   </div>
                   <div style={{ fontSize: '8rem', fontWeight: 950, color: '#1e293b', fontVariantNumeric: 'tabular-nums', letterSpacing: '-4px', lineHeight: 1 }}>{formatTime(timeLeft)}</div>
                   
                   <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 40 }}>
                    <button className={`m-btn ${isRunning ? 'danger' : 'success'}`} onClick={toggleTimer} style={{ width: 90, height: 90, borderRadius: '50%', background: isRunning ? '#ef4444' : '#10b981', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                      {isRunning ? <Pause size={36} color="#fff" /> : <Play size={36} color="#fff" style={{ marginLeft: 6 }} />}
                    </button>
                    <button className="m-btn secondary" onClick={resetTimer} style={{ width: 90, height: 90, borderRadius: '50%', background: '#f1f5f9', border: 'none' }}>
                      <RotateCcw size={36} color="#64748b" />
                    </button>
                  </div>

                  {isRunning && sessionType === 'work' && (
                    <button onClick={finishSessionEarly} style={{ marginTop: 30, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', border: 'none', padding: '10px 24px', borderRadius: 12, fontWeight: 800, fontSize: '0.9rem' }}>
                      Ders Bitti (Kaydet)
                    </button>
                  )}
                </div>

                {/* Music */}
                <div style={{ marginTop: 50, borderTop: '1px solid #f1f5f9', paddingTop: 24 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <span style={{ fontWeight: 900, fontSize: '0.9rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 8 }}>
                         <Music size={18} className="text-indigo-400" /> ODAK MÜZİĞİ
                      </span>
                      <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#6366f1', fontSize: '0.85rem', fontWeight: 800 }}>
                        <Upload size={16} /> MP3 Yükle
                        <input type="file" accept="audio/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                      </label>
                   </div>
                   <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {customMusic.map((m, i) => (
                        <button key={i} onClick={() => setActiveMusicUrl(m.url === activeMusicUrl ? null : m.url)} style={{ padding: '10px 18px', background: activeMusicUrl === m.url ? '#6366f1' : '#f8fafc', border: activeMusicUrl === m.url ? 'none' : '1px solid #e2e8f0', borderRadius: 12, fontSize: '0.8rem', color: activeMusicUrl === m.url ? '#fff' : '#475569', fontWeight: 700 }}>
                          {m.name.length > 20 ? m.name.slice(0, 20) + '...' : m.name}
                        </button>
                      ))}
                      {customMusic.length === 0 && <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>Kendi odak müziğini yükleyerek atmosferi değiştir.</p>}
                   </div>
                </div>
              </>
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                <div style={{ width: 120, height: 120, borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                   <Book size={60} style={{ opacity: 0.2 }} />
                </div>
                <p style={{ fontWeight: 900, fontSize: '1.2rem' }}>Ders Seçilmedi</p>
                <p style={{ color: '#cbd5e1', textAlign: 'center', maxWidth: 300, marginTop: 8 }}>Yukarıdaki raftan bir kitap seçerek masaya oturabilirsin.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: pomodoroFullscreen ? 'none' : 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Performance Stats */}
            <div className="module-card" style={{ background: '#fff', padding: 24, borderRadius: 24, border: '1px solid #f1f5f9' }}>
               <h3 style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.1rem', fontWeight: 900, marginBottom: 20 }}>
                <Trophy size={20} className="text-yellow-500" /> Performans Özeti
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#eef2ff', borderRadius: 16 }}>
                    <span style={{ fontSize: '0.85rem', color: '#4338ca', fontWeight: 800 }}>BUGÜN TOPLAM</span>
                    <span style={{ fontWeight: 950, color: '#4338ca' }}>{todayTotal} dk</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#fef2f2', borderRadius: 16 }}>
                    <span style={{ fontSize: '0.85rem', color: '#b91c1c', fontWeight: 800 }}>REKOR ÇALIŞMA</span>
                    <span style={{ fontWeight: 950, color: '#b91c1c' }}>{personalRecord} dk</span>
                 </div>
              </div>
            </div>

            {/* History Log */}
            <div className="module-card" style={{ background: '#fff', padding: 24, borderRadius: 24, border: '1px solid #f1f5f9', flex: 1, display: 'flex', flexDirection: 'column' }}>
               <h3 style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.1rem', fontWeight: 900, marginBottom: 20 }}>
                <History size={20} className="text-indigo-600" /> Günlük Kayıtlar
              </h3>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {modState.study.sessions.length === 0 ? (
                  <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px 0', fontSize: '0.9rem' }}>Henüz ders kaydı bulunmuyor.</p>
                ) : (
                  [...modState.study.sessions].reverse().map((s, i) => {
                    const sub = subjects.find(sub => sub.id === s.subjectId);
                    return (
                      <div key={i} style={{ padding: 16, background: '#f8fafc', borderRadius: 16, marginBottom: 12, border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontWeight: 950, fontSize: '0.9rem', color: sub?.color }}>{sub?.name}</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6366f1' }}>{s.duration}dk</span>
                        </div>
                        {s.topic && <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{s.topic}</div>}
                        {s.questions !== undefined && <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4, fontWeight: 600 }}>✍️ {s.questions} Soru Çözüldü</div>}
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 6, fontWeight: 700 }}>{s.date}</div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Data Form Modal */}
      {showSessionForm && (
        <div className="modal-overlay active">
          <div className="modal" style={{ maxWidth: 420, padding: 30, borderRadius: 24 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981', textAlign: 'center' }}>Harika Odaklandın! 🎉</h2>
            <p style={{ color: '#64748b', textAlign: 'center', marginBottom: 24, fontSize: '0.95rem' }}>Bu oturumu günlüğüne kaydedelim.</p>
            
            <div className="m-form-group">
              <label style={{ fontWeight: 800, color: '#475569' }}>Çalışılan Konu</label>
              <input type="text" value={sessionTopic} onChange={e => setSessionTopic(e.target.value)} placeholder="Örn: Limit ve Süreklilik..." />
            </div>
            
            <div className="m-form-group">
              <label style={{ fontWeight: 800, color: '#475569' }}>Soru / Paragraf Sayısı</label>
              <input type="number" value={sessionQuestions} onChange={e => setSessionQuestions(e.target.value)} placeholder="Örn: 50" />
            </div>

            <div className="confirm-btns">
               <button className="m-btn success" style={{ width: '100%', height: 48, borderRadius: 14, fontWeight: 900 }} onClick={saveSession}>KAYDET VE MOLA VER</button>
               <button className="m-btn secondary" style={{ width: '100%', height: 48, borderRadius: 14, fontWeight: 800 }} onClick={() => { setShowSessionForm(false); setSessionType('break'); setTimeLeft(breakTime * 60); }}>KAYDETMEDEN MOLA VER</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddSubject && (
        <div className="modal-overlay active">
          <div className="modal" style={{ maxWidth: 380, padding: 30, borderRadius: 24 }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: 25 }}>Yeni Ders Kitabı</h2>
            <div className="m-form-group">
              <input type="text" value={newSubName} onChange={e => setNewSubName(e.target.value)} placeholder="Ders İsmi" />
            </div>
            <div className="m-form-group">
              <label>Kapak Rengi</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {['#f87171', '#fb923c', '#fbbf24', '#4ade80', '#2dd4bf', '#3b82f6', '#818cf8', '#c084fc', '#f472b6'].map(c => (
                  <div key={c} onClick={() => setNewSubColor(c)} style={{ width: 36, height: 36, borderRadius: '50%', background: c, cursor: 'pointer', border: newSubColor === c ? '3px solid #1e293b' : 'none', transition: 'all 0.2s' }} />
                ))}
              </div>
            </div>
            <div className="confirm-btns">
              <button className="m-btn primary" onClick={handleAddSubject} style={{ width: '100%', height: 48, borderRadius: 14 }}>KİTABI RAFA EKLE</button>
              <button className="m-btn secondary" onClick={() => setShowAddSubject(false)} style={{ width: '100%', height: 48, borderRadius: 14 }}>İPTAL</button>
            </div>
          </div>
        </div>
      )}

      {subjectToDelete && (
        <div className="modal-overlay active">
          <div className="modal" style={{ maxWidth: 360, borderRadius: 24 }}>
            <h2 style={{ color: '#ef4444' }}>Dersi Kaldır?</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 24 }}>Bu kitabı raftan kaldırmak üzeresin. Tüm kayıtların silinecektir.</p>
            <div className="confirm-btns">
              <button className="m-btn danger" onClick={() => { onDeleteSubject(subjectToDelete); setSubjectToDelete(null); setActiveSubjectId(null); }} style={{ width: '100%', height: 48, borderRadius: 14 }}>SİL</button>
              <button className="m-btn secondary" onClick={() => setSubjectToDelete(null)} style={{ width: '100%', height: 48, borderRadius: 14 }}>İPTAL</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .book-spine:hover { transform: translateY(-12px) rotate(-1deg); }
        .book-spine.active { transform: translateY(-18px); z-index: 2; }
      `}</style>
    </div>
  );
}
