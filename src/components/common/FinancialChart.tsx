import React, { useState } from 'react';
import { TrendingUp, PieChart } from 'lucide-react';

interface GrowthChartProps {
  formatCurrency: (val: number) => string;
}

export const TrustFundGrowthChart: React.FC<GrowthChartProps> = ({ formatCurrency }) => {
  const [timeRange, setTimeRange] = useState<'6M' | '1Y' | '3Y'>('1Y');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Historical trust fund dataset (intact existing data)
  const dataMap = {
    '6M': [
      { label: 'Apr 2026', total: 46800000, contrib: 35100000, interest: 11700000 },
      { label: 'May 2026', total: 47900000, contrib: 35800000, interest: 12100000 },
      { label: 'Jun 2026', total: 49100000, contrib: 36600000, interest: 12500000 },
      { label: 'Jul 2026', total: 50400000, contrib: 37400000, interest: 13000000 },
      { label: 'Aug 2026', total: 51800000, contrib: 38300000, interest: 13500000 },
      { label: 'Sep 2026', total: 53240000, contrib: 39200000, interest: 14040000 },
    ],
    '1Y': [
      { label: 'Oct 2025', total: 41200000, contrib: 31200000, interest: 10000000 },
      { label: 'Dec 2025', total: 43100000, contrib: 32500000, interest: 10600000 },
      { label: 'Feb 2026', total: 44900000, contrib: 33800000, interest: 11100000 },
      { label: 'Apr 2026', total: 46800000, contrib: 35100000, interest: 11700000 },
      { label: 'Jun 2026', total: 49100000, contrib: 36600000, interest: 12500000 },
      { label: 'Aug 2026', total: 51800000, contrib: 38300000, interest: 13500000 },
      { label: 'Sep 2026', total: 53240000, contrib: 39200000, interest: 14040000 },
    ],
    '3Y': [
      { label: '2024 H1', total: 29800000, contrib: 23200000, interest: 6600000 },
      { label: '2024 H2', total: 33400000, contrib: 25800000, interest: 7600000 },
      { label: '2025 H1', total: 37200000, contrib: 28500000, interest: 8700000 },
      { label: '2025 H2', total: 43100000, contrib: 32500000, interest: 10600000 },
      { label: '2026 H1', total: 49100000, contrib: 36600000, interest: 12500000 },
      { label: 'Sep 2026', total: 53240000, contrib: 39200000, interest: 14040000 },
    ],
  };

  const points = dataMap[timeRange];
  const maxVal = 60000000;
  const width = 640;
  const height = 210;
  const paddingX = 44;
  const paddingY = 22;

  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const getX = (index: number) => paddingX + (index / (points.length - 1)) * chartW;
  const getY = (val: number) => height - paddingY - (val / maxVal) * chartH;

  const totalPathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.total)}`, '');
  const contribPathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.contrib)}`, '');
  const totalAreaD = `${totalPathD} L ${getX(points.length - 1)} ${height - paddingY} L ${getX(0)} ${height - paddingY} Z`;

  const latestPoint = points[points.length - 1];
  const activeData = hoveredIndex !== null ? points[hoveredIndex] : latestPoint;

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header" style={{ padding: '14px 20px' }}>
        <div>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={17} color="var(--color-navy-700)" />
            <span>Trust Fund Growth</span>
          </div>
          <div className="card-subtitle">Accumulated Member Contributions vs. Accrued Interest</div>
        </div>
        <div style={{ display: 'flex', background: '#F6F8FA', borderRadius: '6px', border: '1px solid var(--color-border-subtle)', padding: '2px' }}>
          {(['6M', '1Y', '3Y'] as const).map((r) => (
            <button
              key={r}
              onClick={() => {
                setTimeRange(r);
                setHoveredIndex(null);
              }}
              style={{
                border: timeRange === r ? '1px solid var(--color-border-subtle)' : 'none',
                background: timeRange === r ? '#FFFFFF' : 'transparent',
                color: timeRange === r ? 'var(--color-navy-900)' : 'var(--color-text-secondary)',
                fontWeight: timeRange === r ? 600 : 500,
                fontSize: '0.75rem',
                padding: '3px 9px',
                borderRadius: '4px',
                cursor: 'pointer',
                boxShadow: timeRange === r ? 'var(--shadow-xs)' : 'none',
                transition: 'all 0.12s ease',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="card-body" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Metric summary banner */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            background: 'var(--color-bg-surface-subtle)',
            borderRadius: '6px',
            border: '1px solid var(--color-border-subtle)',
            padding: '10px 16px',
          }}
        >
          <div style={{ borderRight: '1px solid var(--color-border-subtle)', paddingRight: '12px' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Total Fund ({activeData.label})
            </span>
            <span style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '2px', display: 'block' }} className="num">
              {formatCurrency(activeData.total)}
            </span>
          </div>
          <div style={{ borderRight: '1px solid var(--color-border-subtle)', paddingLeft: '14px', paddingRight: '12px' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Principal Contributions
            </span>
            <span style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-navy-600)', marginTop: '2px', display: 'block' }} className="num">
              {formatCurrency(activeData.contrib)}
            </span>
          </div>
          <div style={{ paddingLeft: '14px' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Accrued Interest
            </span>
            <span style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-burgundy-700)', marginTop: '2px', display: 'block' }} className="num">
              {formatCurrency(activeData.interest)}
            </span>
          </div>
        </div>

        {/* Scalable SVG Chart */}
        <div style={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <defs>
              <linearGradient id="totalFundGradientRefined" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0B1F3A" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#0B1F3A" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[0, 20000000, 40000000, 60000000].map((val) => (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={getY(val)}
                  x2={width - paddingX}
                  y2={getY(val)}
                  stroke="#E3E8EF"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={getY(val) + 3.5}
                  textAnchor="end"
                  fontSize="9.5"
                  fill="#8896AB"
                  fontFamily="Inter, sans-serif"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  ₹{(val / 10000000).toFixed(0)}Cr
                </text>
              </g>
            ))}

            {/* Area Fill */}
            <path d={totalAreaD} fill="url(#totalFundGradientRefined)" />

            {/* Contrib line */}
            <path d={contribPathD} fill="none" stroke="#2F68B4" strokeWidth="1.75" strokeDasharray="4 2" />

            {/* Total line */}
            <path d={totalPathD} fill="none" stroke="#0B1F3A" strokeWidth="2.2" />

            {/* Data points & Interaction triggers */}
            {points.map((p, i) => {
              const cx = getX(i);
              const cyTotal = getY(p.total);
              const cyContrib = getY(p.contrib);
              const isHovered = hoveredIndex === i;

              return (
                <g key={i}>
                  {/* Subtle vertical indicator on hover */}
                  {isHovered && (
                    <line
                      x1={cx}
                      y1={paddingY}
                      x2={cx}
                      y2={height - paddingY}
                      stroke="#CBD5E1"
                      strokeDasharray="2 2"
                      strokeWidth="1"
                    />
                  )}

                  {/* Contrib dot */}
                  <circle
                    cx={cx}
                    cy={cyContrib}
                    r={isHovered ? 4 : 3}
                    fill="#2F68B4"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />

                  {/* Total dot */}
                  <circle
                    cx={cx}
                    cy={cyTotal}
                    r={isHovered ? 5 : 3.5}
                    fill="#0B1F3A"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />

                  {/* X-axis label */}
                  <text
                    x={cx}
                    y={height - 5}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight={isHovered ? '600' : '500'}
                    fill={isHovered ? '#0B1F3A' : '#667085'}
                    fontFamily="Inter, sans-serif"
                  >
                    {p.label}
                  </text>

                  {/* Invisible broad hover target */}
                  <rect
                    x={cx - chartW / (points.length * 2)}
                    y={paddingY}
                    width={chartW / points.length}
                    height={height - paddingY * 2}
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredIndex(i)}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '22px', fontSize: '0.75rem', color: 'var(--color-text-secondary)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ width: '14px', height: '2.5px', background: '#0B1F3A', borderRadius: '1px' }}></span>
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>Total Trust Fund</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ width: '14px', height: '2px', borderTop: '2px dashed #2F68B4' }}></span>
            <span>Principal Contributions</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--color-burgundy-700)', borderRadius: '50%' }}></span>
            <span>Accrued Interest Component</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FundCompositionChart: React.FC<{ formatCurrency: (val: number) => string }> = ({ formatCurrency }) => {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  // Exact data intact
  const slices = [
    {
      label: 'Liquid Bank Deposits / Cash in Bank',
      amount: 33450000,
      color: '#0B1F3A', // Primary Navy
      percent: 62.8,
    },
    {
      label: 'Accrued Interest Receivables',
      amount: 14040000,
      color: '#9E173C', // IUCB Burgundy
      percent: 26.4,
    },
    {
      label: 'Member Loan Principal Outstanding',
      amount: 5750000,
      color: '#2F68B4', // Restrained Steel Blue
      percent: 10.8,
    },
  ];

  const totalAmount = 53240000;

  // Donut geometry calculations
  const size = 180;
  const center = size / 2;
  const radius = 64;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius; // ~402.12

  // Gap between segments in px
  const gapPx = 2.5;
  const totalGaps = slices.length * gapPx;
  const effectiveCircumference = circumference - totalGaps;

  // Compute strokeDasharray and offset for each slice
  let currentOffset = 0;
  const renderedSlices = slices.map((s) => {
    const sliceLen = (s.percent / 100) * effectiveCircumference;
    const dashArray = `${sliceLen} ${circumference - sliceLen}`;
    const offset = -currentOffset;
    currentOffset += sliceLen + gapPx;

    return {
      ...s,
      dashArray,
      offset,
    };
  });

  const activeSlice = hoveredSlice !== null ? slices[hoveredSlice] : null;

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header" style={{ padding: '14px 20px' }}>
        <div>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={17} color="var(--color-navy-700)" />
            <span>Fund Asset Composition</span>
          </div>
          <div className="card-subtitle">Recorded Pool Distribution as on 22 Sep 2026</div>
        </div>
      </div>

      <div className="card-body" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Donut Chart and Center Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
          {/* SVG Donut */}
          <div style={{ position: 'relative', width: '160px', height: '160px', flexShrink: 0 }}>
            <svg
              viewBox={`0 0 ${size} ${size}`}
              style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}
            >
              {/* Background Track */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#F6F8FA"
                strokeWidth={strokeWidth}
              />

              {/* Slices */}
              {renderedSlices.map((slice, idx) => {
                const isHovered = hoveredSlice === idx;
                return (
                  <circle
                    key={slice.label}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={slice.color}
                    strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                    strokeDasharray={slice.dashArray}
                    strokeDashoffset={slice.offset}
                    strokeLinecap="round"
                    style={{
                      cursor: 'pointer',
                      transition: 'stroke-width 0.15s ease, opacity 0.15s ease',
                      opacity: hoveredSlice !== null && !isHovered ? 0.65 : 1,
                    }}
                    onMouseEnter={() => setHoveredSlice(idx)}
                    onMouseLeave={() => setHoveredSlice(null)}
                  />
                );
              })}
            </svg>

            {/* Donut Center Content */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                textAlign: 'center',
                padding: '10px',
              }}
            >
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {activeSlice ? 'Selected' : 'Total'}
              </span>
              <span
                style={{
                  fontSize: activeSlice ? '1rem' : '1.125rem',
                  fontWeight: 700,
                  color: activeSlice ? activeSlice.color : 'var(--color-navy-900)',
                  lineHeight: 1.15,
                  marginTop: '2px',
                }}
                className="num"
              >
                {activeSlice ? `${activeSlice.percent}%` : '₹5.32 Cr'}
              </span>
              <span
                style={{
                  fontSize: '0.625rem',
                  color: 'var(--color-text-muted)',
                  marginTop: '1px',
                }}
              >
                {activeSlice ? formatCurrency(activeSlice.amount) : 'Trust Fund'}
              </span>
            </div>
          </div>
        </div>

        {/* Structured Financial Breakdown Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {slices.map((item, idx) => {
            const isHovered = hoveredSlice === idx;
            return (
              <div
                key={item.label}
                onMouseEnter={() => setHoveredSlice(idx)}
                onMouseLeave={() => setHoveredSlice(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  background: isHovered ? 'var(--color-bg-surface-active)' : '#FFFFFF',
                  borderRadius: '6px',
                  border: isHovered ? '1px solid var(--color-border-strong)' : '1px solid var(--color-border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
                  <span
                    style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      backgroundColor: item.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: isHovered ? 600 : 500,
                      color: 'var(--color-text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.label}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--color-navy-900)',
                    }}
                    className="num"
                  >
                    {formatCurrency(item.amount)}
                  </span>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                      color: 'var(--color-text-secondary)',
                      background: 'var(--color-bg-surface-subtle)',
                      border: '1px solid var(--color-border-subtle)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      minWidth: '42px',
                      textAlign: 'center',
                    }}
                  >
                    {item.percent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
