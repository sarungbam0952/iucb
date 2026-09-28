import React from 'react';

export interface KpiCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  desc?: React.ReactNode;
  trend?: {
    text: string;
    type?: 'positive' | 'neutral' | 'negative';
  };
  badge?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  icon: Icon,
  desc,
  trend,
  badge,
  onClick,
  className = '',
  style,
  id,
}) => {
  return (
    <div
      id={id}
      className={`kpi-card ${className}`}
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
    >
      <div className="kpi-header">
        <span className="kpi-label">{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {badge}
          <div className="kpi-icon-wrap">
            <Icon size={16} strokeWidth={2} />
          </div>
        </div>
      </div>
      <div className="kpi-value num">{value}</div>
      {(desc || trend) && (
        <div className="kpi-desc">
          {trend && (
            <span className={`kpi-trend ${trend.type || 'positive'}`}>
              {trend.text}
            </span>
          )}
          {desc && <span>{desc}</span>}
        </div>
      )}
    </div>
  );
};
