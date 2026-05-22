import { useState } from 'react';
import { useVisitorStats } from '../../../hooks/useAnalytics';

export default function VisitorAnalyticsChart() {
  const { data: visitorData = {
    total: 1248,
    devices: { desktop: 812, mobile: 345, tablet: 91 },
    types: { new: 980, returning: 268 }
  }, isFetching, refetch } = useVisitorStats();
  const [hoveredIdx, setHoveredIdx] = useState(null); // null means showing total

  const { total, devices } = visitorData;
  const { desktop, mobile, tablet } = devices;
  const overallCount = desktop + mobile + tablet;

  // Align segments
  const segments = [
    { label: 'Desktop', count: desktop, color: 'stroke-indigo-600', gradId: 'gradDesktop', colorHex: '#4f46e5', icon: 'desktop_windows' },
    { label: 'Mobile', count: mobile, color: 'stroke-emerald-500', gradId: 'gradMobile', colorHex: '#10b981', icon: 'smartphone' },
    { label: 'Tablet', count: tablet, color: 'stroke-amber-500', gradId: 'gradTablet', colorHex: '#f59e0b', icon: 'tablet_mac' }
  ];

  // Circle Geometry
  const radius = 50;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // ~314.159
  const center = 65;
  const svgSize = 130;

  // Calculate segment path offsets
  let accumulatedPercent = 0;
  const processedSegments = segments.map((seg) => {
    const percent = overallCount > 0 ? seg.count / overallCount : 0;
    const dashArrayStr = `${percent * circumference} ${circumference}`;
    const dashOffset = -accumulatedPercent * circumference;
    
    // Track percentage to offset next segment
    accumulatedPercent += percent;

    return {
      ...seg,
      percent,
      dashArray: dashArrayStr,
      dashOffset
    };
  });

  // Data to display in the center ring
  const getCenterDisplay = () => {
    if (hoveredIdx === null) {
      return {
        value: total,
        label: 'Total Pengunjung',
        color: 'text-slate-700'
      };
    }
    const seg = processedSegments[hoveredIdx];
    return {
      value: seg.count,
      label: seg.label,
      color: 'text-slate-800',
      sub: `${Math.round(seg.percent * 100)}% dari akses`
    };
  };

  const centerDisplay = getCenterDisplay();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Pengunjung Website</h3>
          <p className="text-xs text-slate-400 font-medium">Analisis perangkat akses pengunjung unik berbasis sesi</p>
        </div>
        
        <button
          onClick={() => refetch()}
          title="Muat ulang data pengunjung"
          className="flex items-center justify-center p-1.5 rounded-xl border border-slate-100 text-slate-400 hover:text-rose-700 hover:border-rose-100 hover:bg-rose-50/50 transition-all duration-200 shadow-sm"
        >
          <span className={`material-symbols-outlined text-[18px] ${isFetching ? 'animate-spin' : ''}`}>sync</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8 py-2">
        {/* SVG Donut Ring */}
        <div className="relative w-[130px] h-[130px] flex-shrink-0">
          <svg 
            width={svgSize} 
            height={svgSize} 
            viewBox={`0 0 ${svgSize} ${svgSize}`}
            className="transform -rotate-90"
          >
            <defs>
              <linearGradient id="gradDesktop" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="gradMobile" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
              <linearGradient id="gradTablet" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>

            {/* Base Background Track Ring */}
            <circle 
              cx={center} 
              cy={center} 
              r={radius} 
              fill="none" 
              stroke="#f1f5f9" 
              strokeWidth={strokeWidth} 
            />

            {/* Render segments with exact math offsets */}
            {processedSegments.map((seg, idx) => {
              const isActive = hoveredIdx === idx;
              return (
                <circle 
                  key={idx}
                  cx={center} 
                  cy={center} 
                  r={radius} 
                  fill="none" 
                  stroke={`url(#${seg.gradId})`}
                  strokeWidth={isActive ? strokeWidth + 2.5 : strokeWidth} 
                  strokeDasharray={seg.dashArray}
                  strokeDashoffset={seg.dashOffset}
                  className="transition-all duration-300 cursor-pointer origin-center"
                  style={{
                    filter: isActive ? `drop-shadow(0 0 4px ${seg.colorHex}50)` : 'none'
                  }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>

          {/* Centered Statistics HUD */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-2">
            <span className={`text-xl font-black tracking-tight leading-none ${centerDisplay.color}`}>
              {centerDisplay.value.toLocaleString('id-ID')}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1">
              {centerDisplay.label}
            </span>
            {centerDisplay.sub && (
              <span className="text-[8px] font-medium text-slate-400 scale-[0.9] mt-0.5 max-w-[80px] leading-tight">
                {centerDisplay.sub}
              </span>
            )}
          </div>
        </div>

        {/* Legend Indicators with Hover Highlights */}
        <div className="flex-1 flex flex-col justify-center space-y-3.5 w-full sm:w-auto">
          {processedSegments.map((seg, idx) => {
            const isHovered = hoveredIdx === idx;
            const percentage = overallCount > 0 ? Math.round(seg.percent * 100) : 0;
            return (
              <div 
                key={idx}
                className={`flex items-center justify-between p-2 rounded-xl transition-all duration-200 border border-transparent ${
                  isHovered 
                    ? 'bg-slate-50 border-slate-100 scale-[1.03] shadow-sm' 
                    : 'hover:bg-slate-50/50'
                }`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Status Indicator circle with custom gradient */}
                  <span className="material-symbols-outlined text-[18px] text-slate-500">
                    {seg.icon}
                  </span>
                  
                  <div className="min-w-0 flex flex-col">
                    <span className="text-xs font-bold text-slate-700 leading-none">{seg.label}</span>
                    <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{seg.count.toLocaleString('id-ID')} sesi</span>
                  </div>
                </div>

                <div className="text-right">
                  <span 
                    className="text-xs font-black px-2 py-0.5 rounded-full border"
                    style={{
                      borderColor: isHovered ? `${seg.colorHex}25` : '#f1f5f9',
                      backgroundColor: isHovered ? `${seg.colorHex}08` : '#f8f9fa',
                      color: seg.colorHex
                    }}
                  >
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
