'use client';

import React, { useMemo } from 'react';
import { Flower, Sprout, Wind, Sun } from 'lucide-react';

interface Props {
  habitCount: number;      // Today's completed habits
  taskCount: number;       // Today's completed tasks
  waterPercent: number;    // Today's water progress (0-100)
  streak: number;
}

/**
 * HabitGarden: Görsel bir başarı bahçesi.
 * Tamamlanan her görev bir çiçek, su tüketimi canlanmış bir zemin,
 * streak ise güneşin parlaklığını temsil eder.
 */
export default function HabitGarden({ habitCount, taskCount, waterPercent, streak }: Props) {
  const totalPlants = habitCount + taskCount;
  
  // Bitkilerin konumlarını rastgele ama sabit (seed bazlı) hesaplayalım
  const plants = useMemo(() => {
    const p = [];
    const count = Math.min(totalPlants, 12); // Max 12 bitki
    for (let i = 0; i < count; i++) {
      // Basit bir pseudo-random dağılım
      const x = (i * 137.5) % 100; 
      const y = (i * 45) % 30 + 60; // Alt kısımda dağılsınlar
      p.push({ x, y, type: i % 2 === 0 ? 'flower' : 'sprout' });
    }
    return p;
  }, [totalPlants]);

  const groundColor = waterPercent >= 100 ? '#4ade80' : waterPercent >= 50 ? '#86efac' : '#d1fae5';
  const sunOpacity = Math.min(streak / 7, 1);

  return (
    <div className="habit-garden-container">
      <div className="habit-garden-header">
        <Sun size={14} className={streak > 0 ? 'sun-glow' : ''} />
        <span>Gelişim Bahçen</span>
      </div>
      
      <svg viewBox="0 0 100 100" className="habit-garden-svg">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#bae6fd" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Gökyüzü */}
        <rect width="100" height="100" fill="url(#skyGrad)" rx="12" />

        {/* Güneş (Streak bazlı) */}
        <circle cx="85" cy="15" r="8" fill="#fde047" opacity={0.3 + sunOpacity * 0.7} filter={streak > 5 ? 'url(#glow)' : ''} />

        {/* Zemin (Su bazlı) */}
        <path 
          d="M0 70 Q 25 65, 50 70 T 100 70 V 100 H 0 Z" 
          fill={groundColor} 
          style={{ transition: 'fill 0.5s ease' }}
        />

        {/* Bitkiler */}
        {plants.map((p, i) => (
          <g key={i} transform={`translate(${p.x}, ${p.y}) scale(0.6)`}>
            {p.type === 'flower' ? (
              <path 
                d="M0 0 Q 5 -10, 0 -20 Q -5 -10, 0 0" 
                fill="#f472b6" 
                className="plant-sway"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ) : (
              <path 
                d="M-2 0 Q 0 -15, 2 0" 
                fill="#22c55e" 
                className="plant-sway"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            )}
            <circle cx="0" cy="0" r="1.5" fill="#4ade80" />
          </g>
        ))}

        {plants.length === 0 && (
          <text x="50" y="85" textAnchor="middle" fontSize="5" fill="#64748b" opacity="0.6">
            Henüz çiçek açmadı...
          </text>
        )}
      </svg>

      <div className="habit-garden-stats">
        <span>{totalPlants} Bitki</span>
        <span>🔥 {streak} Gün</span>
      </div>

      <style jsx>{`
        .habit-garden-container {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(8px);
          border-radius: 16px;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          margin: 10px 0;
        }
        .habit-garden-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #0369a1;
          margin-bottom: 8px;
        }
        .habit-garden-svg {
          width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .habit-garden-stats {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 500;
        }
        .sun-glow {
          color: #f59e0b;
          filter: drop-shadow(0 0 4px #fbbf24);
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .plant-sway {
          transform-origin: bottom center;
          animation: sway 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
