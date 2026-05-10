'use client';

import { useState, useEffect, useMemo, type CSSProperties } from 'react';
import type { ModuleState, JournalEntry } from '@/types';
import { formatDate } from '@/lib/dateUtils';
import { 
  Book, Save, Trash2, Smile, Meh, Frown, Sparkles, 
  MapPin, Cloud, Quote, Hash, Heart, RefreshCw, Feather,
  ChevronLeft, ChevronRight
} from 'lucide-react';

interface Props {
  active: boolean;
  modState: ModuleState;
  onClose: () => void;
  onSaveEntry: (date: string, content: string, mood?: string, title?: string, gratitude?: string[], weather?: string, location?: string, paperStyle?: JournalEntry['paperStyle'], quote?: string, color?: string) => void;
  onDeleteEntry: (date: string) => void;
}

type JournalPaperStyle = NonNullable<JournalEntry['paperStyle']>;
type MoodColorStyle = CSSProperties & Record<'--mood-color', string>;
type BookColorStyle = CSSProperties & Record<'--book-color', string>;

const MOODS = [
  { icon: <Smile />, label: 'Mutlu', val: 'happy', color: '#10b981' },
  { icon: <Sparkles />, label: 'Harika', val: 'amazing', color: '#6366f1' },
  { icon: <Meh />, label: 'Normal', val: 'neutral', color: '#f59e0b' },
  { icon: <Frown />, label: 'Yorgun', val: 'tired', color: '#64748b' },
  { icon: <Frown />, label: 'Üzgün', val: 'sad', color: '#ef4444' },
];

const BOOK_COLORS = [
  { label: 'Safir', hex: '#1e3a8a' },
  { label: 'Zümrüt', hex: '#064e3b' },
  { label: 'Bordo', hex: '#7f1d1d' },
  { label: 'Hardal', hex: '#78350f' },
  { label: 'Patlıcan', hex: '#4c1d95' },
  { label: 'Gece', hex: '#111827' },
  { label: 'Toprak', hex: '#451a03' },
];

const SAMPLE_QUOTES = [
  "Her gün, hayatının en güzel günü olması için şans ver.",
  "Mutluluk bir varış noktası değil, bir yolculuktur.",
  "Karanlıkta bile yıldızları görebilirsin.",
  "Küçük adımlar, büyük yollara çıkar.",
  "Bugün yapacağın bir şey, yarınki seni mutlu etsin.",
  "Kendi güneşin ol, başkasının ışığına muhtaç kalma.",
  "Yaşamak, sadece nefes almak değildir; hissetmektir.",
  "Zor yollar her zaman güzel manzaralara çıkar.",
  "Dünün acısı, bugünün gücüdür.",
  "Kendine inanmak, başarının yarısıdır.",
  "Hayallerin, korkularından büyük olsun.",
  "Sessizlik bazen en güçlü çığlıktır.",
  "Zaman, en kıymetli hazinendir; onu iyi harca.",
  "Sevgi, dünyayı döndüren tek şeydir.",
  "Önce sen değiş, sonra dünya değişir.",
  "Başarı, kaç kez düştüğün değil, kaç kez kalktığındır.",
  "Anı yaşa, gelecek zaten gelecektir.",
  "Her çiçek kendi zamanında açar.",
  "Kalbinin sesini dinle, o yolu bilir.",
  "Gülümsemek, ruhun en iyi ilacıdır."
];

export default function JournalOverlay({ active, modState, onClose, onSaveEntry, onDeleteEntry }: Props) {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<string | undefined>();
  const [title, setTitle] = useState('');
  const [gratitude, setGratitude] = useState(['', '', '']);
  const [weather, setWeather] = useState('');
  const [location, setLocation] = useState('');
  const [paperStyle, setPaperStyle] = useState<'lined' | 'grid' | 'blank' | 'dots'>('lined');
  const [quote, setQuote] = useState('');
  const [bookColor, setBookColor] = useState('#111827');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showSaved, setShowSaved] = useState(false);
  const [opening, setOpening] = useState(false);

  // Load entry when date changes
  useEffect(() => {
    const entry = modState.journal.entries[selectedDate];
    setOpening(true);
    setTimeout(() => setOpening(false), 600);

    if (entry) {
      setContent(entry.content);
      setMood(entry.mood);
      setTitle(entry.title || '');
      setGratitude(entry.gratitude || ['', '', '']);
      setWeather(entry.weather || '');
      setLocation(entry.location || '');
      setPaperStyle(entry.paperStyle || 'lined');
      setQuote(entry.quote || '');
      setBookColor(entry.color || '#111827');
    } else {
      setContent('');
      setMood(undefined);
      setTitle('');
      setGratitude(['', '', '']);
      setWeather('');
      setLocation('');
      setPaperStyle('lined');
      setQuote('');
      setBookColor('#111827');
    }
  }, [selectedDate, modState.journal.entries]);

  const handleSave = () => {
    onSaveEntry(selectedDate, content, mood, title, gratitude, weather, location, paperStyle, quote, bookColor);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleDelete = () => {
    if (window.confirm('Bu anıyı kalıcı olarak silmek istediğine emin misin?')) {
      onDeleteEntry(selectedDate);
    }
  };

  const randomizeQuote = () => {
    const q = SAMPLE_QUOTES[Math.floor(Math.random() * SAMPLE_QUOTES.length)];
    setQuote(q);
  };

  const wordCount = useMemo(() => content.trim() ? content.trim().split(/\s+/).length : 0, [content]);

  return (
    <div className={`module-overlay${active ? ' active' : ''}`} id="journalOverlay">
      <div className="module-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Book className="text-amber-800" /> Anı Kütüphanem
        </h2>
        <button className="close-module" onClick={onClose}>✕</button>
      </div>
      
      <div className="module-body" style={{ padding: '20px 40px', overflowY: 'auto' }}>
        <div className="journal-container" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 350px', gap: 40 }}>
          
          {/* Main Book Section */}
          <div className={`notebook-container ${opening ? 'book-opening' : ''}`}>
            <div className={`notebook-page paper-${paperStyle}`} style={{ background: '#fffef0' }}>
              <div className="notebook-margin" />
              
              <div className="notebook-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 30 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <span className="notebook-date">{selectedDate}</span>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div className="stamp-input"><Cloud size={14} /><input placeholder="Hava..." value={weather} onChange={e => setWeather(e.target.value)} /></div>
                      <div className="stamp-input"><MapPin size={14} /><input placeholder="Konum..." value={location} onChange={e => setLocation(e.target.value)} /></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {showSaved && <span className="saved-indicator">Anı Saklandı! ✓</span>}
                    <button onClick={handleSave} className="m-btn journal-save-btn">
                      <Feather size={18} /> ANIYI SAKLA
                    </button>
                    {modState.journal.entries[selectedDate] && (
                      <button onClick={handleDelete} className="m-btn journal-delete-btn"><Trash2 size={18} /></button>
                    )}
                  </div>
                </div>

                <input 
                  type="text" 
                  placeholder="Bu günün başlığı ne olsun?..." 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="journal-title-input"
                />

                <textarea 
                  placeholder="Buraya ruhunu dök..." 
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="journal-textarea"
                />

                <div className="notebook-footer">
                  <div style={{ display: 'flex', gap: 15 }}>
                    <span><Hash size={14} /> {wordCount} Kelime</span>
                    <span><Feather size={14} /> {Math.ceil(wordCount / 200)} dk okuma</span>
                  </div>
                  <div className="paper-style-selector">
                    {(['lined', 'grid', 'dots', 'blank'] as JournalPaperStyle[]).map(s => (
                      <button key={s} className={paperStyle === s ? 'active' : ''} onClick={() => setPaperStyle(s)} />
                    ))}
                  </div>
                </div>

                <div className="journal-quote-block">
                  <Quote size={20} className="quote-icon-top" />
                  <div style={{ position: 'relative' }}>
                    <textarea 
                      placeholder="İlham veren bir söz yaz veya yandaki butona bas..." 
                      value={quote}
                      onChange={e => setQuote(e.target.value)}
                    />
                    <button onClick={randomizeQuote} className="quote-random-btn" title="Rastgele Söz">
                      <RefreshCw size={14} />
                    </button>
                  </div>
                  <Quote size={20} className="quote-icon-bottom" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Color Palette */}
            <div className="module-card journal-card">
              <h3>Defter Kapağı Rengi</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                {BOOK_COLORS.map(c => (
                  <button 
                    key={c.hex} 
                    onClick={() => setBookColor(c.hex)}
                    className={`color-btn ${bookColor === c.hex ? 'active' : ''}`}
                    style={{ background: c.hex }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Mood Card */}
            <div className="module-card journal-card">
              <div className="card-header"><h3>Ruh Halim</h3><Heart size={16} /></div>
              <div className="mood-grid">
                {MOODS.map(m => (
                  <button key={m.val} onClick={() => setMood(m.val)} className={`mood-btn ${mood === m.val ? 'active' : ''}`} style={{ '--mood-color': m.color } as MoodColorStyle}>
                    {m.icon}<span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Past Books Library - Horizontal */}
            <div className="module-card journal-card" style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              <div className="card-header" style={{ marginBottom: 10 }}>
                <h3>Anı Kütüphanem</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                   <div className="search-mini">
                      <input 
                        type="text" 
                        placeholder="Tarih veya başlık ara..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                   </div>
                   <Book size={16} />
                </div>
              </div>
              
              <div className="library-wrapper">
                <button className="lib-nav-btn" onClick={() => document.getElementById('bookShelf')?.scrollBy({ left: -200, behavior: 'smooth' })}>
                  <ChevronLeft size={20} />
                </button>
                <div className="book-library-horizontal" id="bookShelf">
                  {Object.values(modState.journal.entries)
                    .filter(e => e.date.includes(searchTerm) || (e.title || '').toLowerCase().includes(searchTerm.toLowerCase()))
                    .sort((a,b) => a.date.localeCompare(b.date))
                    .map(e => (
                    <button 
                      key={e.date} 
                      onClick={() => setSelectedDate(e.date)}
                      className={`mini-book ${selectedDate === e.date ? 'active' : ''}`}
                      style={{ '--book-color': e.color || '#111827' } as BookColorStyle}
                    >
                      <div className="book-cover">
                        <div className="book-spine" />
                        <div className="book-label">{e.date.split('-').slice(1).reverse().join('/')}</div>
                      </div>
                      <span className="book-title">{e.title || 'İsimsiz Anı'}</span>
                    </button>
                  ))}
                  {Object.keys(modState.journal.entries).length === 0 && (
                    <p className="empty-txt">Kütüphane henüz boş...</p>
                  )}
                </div>
                <button className="lib-nav-btn" onClick={() => document.getElementById('bookShelf')?.scrollBy({ left: 200, behavior: 'smooth' })}>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .journal-container { position: relative; }
        
        /* Notebook Styling */
        .notebook-container { perspective: 1000px; }
        .notebook-page { 
          position: relative; border-radius: 4px 12px 12px 4px; border: 1px solid #e2e8f0; 
          min-height: 800px; box-shadow: 10px 10px 30px rgba(0,0,0,0.1); overflow: hidden;
        }
        .notebook-margin { position: absolute; left: 45px; top: 0; bottom: 0; width: 2px; background: rgba(239, 68, 68, 0.2); }
        .notebook-content { position: relative; z-index: 1; padding: 50px 60px; }
        
        .book-opening { animation: bookOpen 0.6s ease-out; }
        @keyframes bookOpen {
          0% { transform: rotateY(-10deg) scale(0.98); opacity: 0.8; }
          100% { transform: rotateY(0deg) scale(1); opacity: 1; }
        }

        .notebook-date { font-size: 1.6rem; fontWeight: 950; color: #1e293b; font-family: 'Georgia', serif; }
        .stamp-input { display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.03); padding: 4px 10px; border-radius: 20px; }
        .stamp-input input { border: none; background: transparent; font-size: 0.7rem; width: 80px; outline: none; }
        
        .journal-save-btn { 
          background: #111827; color: #fff; padding: 0 25px; height: 48px; border-radius: 24px; 
          font-weight: 900; display: flex; align-items: center; gap: 10px; transition: all 0.2s;
        }
        .journal-save-btn:hover { background: #1e293b; transform: scale(1.05); }
        .saved-indicator { color: #10b981; font-size: 0.85rem; font-weight: 800; animation: fadeIn 0.3s; }

        .journal-title-input {
          width: 100%; font-size: 2.5rem; font-weight: 950; border: none; background: transparent;
          font-family: 'Georgia', serif; color: #0f172a; margin-top: 20px; margin-bottom: 20px; outline: none; letter-spacing: -1px;
        }
        .journal-textarea {
          width: 100%; min-height: 500px; font-size: 1.3rem; line-height: 2.6rem; border: none; background: transparent;
          font-family: 'Georgia', serif; color: #334155; outline: none; resize: none;
        }
        
        .paper-lined .journal-textarea { background-image: linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px); background-size: 100% 2.6rem; }
        .paper-grid .journal-textarea { background-image: linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px); background-size: 2.6rem 2.6rem; }
        .paper-dots .journal-textarea { background-image: radial-gradient(rgba(0,0,0,0.1) 1px, transparent 1px); background-size: 2.6rem 2.6rem; }

        .notebook-footer { display: flex; justify-content: space-between; border-top: 1px dashed #e2e8f0; padding-top: 20px; color: #94a3b8; font-size: 0.8rem; margin-top: 20px; }
        .paper-style-selector { display: flex; gap: 8px; }
        .paper-style-selector button { width: 16px; height: 16px; border-radius: 3px; border: 1px solid #cbd5e1; cursor: pointer; }
        .paper-style-selector button.active { border-color: #111827; background: #111827; }

        .journal-quote-block {
          margin-top: 40px; padding: 25px; background: rgba(0,0,0,0.02); border-radius: 16px; text-align: center; position: relative;
        }
        .journal-quote-block textarea { 
          width: 100%; border: none; background: transparent; outline: none; text-align: center; 
          font-style: italic; color: #64748b; font-size: 1.1rem; resize: none; height: 50px; padding: 0 30px;
        }
        .quote-random-btn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: #fff; border: 1px solid #e2e8f0; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #6366f1; }
        
        /* Library Section */
        .book-library { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 20px; overflow-y: auto; padding-bottom: 20px; }
        .mini-book { background: transparent; border: none; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: all 0.2s; }
        .mini-book:hover { transform: translateY(-5px); }
        .mini-book.active .book-cover { box-shadow: 0 0 0 3px #fff, 0 0 0 6px var(--book-color); }
        
        .book-cover { 
          width: 80px; height: 110px; background: var(--book-color); border-radius: 4px 10px 10px 4px; 
          position: relative; box-shadow: 4px 4px 10px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center;
        }
        .book-spine { position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: rgba(0,0,0,0.2); border-radius: 4px 0 0 4px; }
        .book-label { color: #fff; font-size: 0.65rem; font-weight: 900; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; }
        .book-title { font-size: 0.7rem; font-weight: 800; color: #475569; margin-top: 8px; width: 100%; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        .color-btn { width: 30px; height: 30px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); cursor: pointer; transition: all 0.2s; }
        .color-btn.active { transform: scale(1.2); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }

        .mood-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 15px; }
        .mood-btn { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 10px 5px; border-radius: 12px; border: 2px solid #f1f5f9; background: #fff; color: #94a3b8; cursor: pointer; }
        .mood-btn.active { border-color: var(--mood-color); color: var(--mood-color); background: color-mix(in srgb, var(--mood-color), transparent 90%); }
        .mood-btn span { font-size: 0.6rem; font-weight: 800; }

        .gratitude-list { display: flex; flex-direction: column; gap: 10px; margin-top: 15px; }
        .gratitude-list input { border: 1px solid #f1f5f9; background: #f8fafc; padding: 10px; border-radius: 10px; font-size: 0.8rem; outline: none; }
        
        .search-mini { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 2px 10px; display: flex; align-items: center; }
        .search-mini input { border: none; background: transparent; font-size: 0.75rem; color: #475569; outline: none; width: 120px; }

        .library-wrapper { position: relative; display: flex; align-items: center; gap: 10px; }
        .lib-nav-btn { background: #fff; border: 1px solid #e2e8f0; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b; transition: all 0.2s; z-index: 5; }
        .lib-nav-btn:hover { background: #f8fafc; color: #1e293b; }

        .book-library-horizontal { 
          display: flex; gap: 20px; overflow-x: auto; padding: 10px 5px; scroll-behavior: smooth;
          flex: 1; -ms-overflow-style: none; scrollbar-width: none;
        }
        .book-library-horizontal::-webkit-scrollbar { display: none; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
