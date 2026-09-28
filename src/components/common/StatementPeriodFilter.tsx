import React from 'react';

export type StatementPeriodOption = 'all' | '3months' | '6months' | 'custom';

export interface StatementPeriodFilterProps {
  value: StatementPeriodOption;
  onChange: (val: StatementPeriodOption) => void;
  customFrom?: string;
  onCustomFromChange?: (val: string) => void;
  customTo?: string;
  onCustomToChange?: (val: string) => void;
  label?: string;
  showLabel?: boolean;
}

export const StatementPeriodFilter: React.FC<StatementPeriodFilterProps> = ({
  value,
  onChange,
  customFrom = '',
  onCustomFromChange,
  customTo = '',
  onCustomToChange,
  label = 'Statement Period:',
  showLabel = true,
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      {showLabel && (
        <label
          style={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--color-navy-900)',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </label>
      )}
      <select
        className="form-select"
        style={{
          width: 'auto',
          minWidth: '135px',
          height: '32px',
          padding: '4px 28px 4px 10px',
          fontSize: '0.75rem',
          fontWeight: 500,
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border-subtle)',
          color: 'var(--color-navy-900)',
        }}
        value={value}
        onChange={(e) => onChange(e.target.value as StatementPeriodOption)}
      >
        <option value="all">All</option>
        <option value="3months">3 Months</option>
        <option value="6months">6 Months</option>
        <option value="custom">Custom Range</option>
      </select>

      {value === 'custom' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              From:
            </label>
            <input
              type="date"
              className="form-input"
              style={{
                width: '130px',
                height: '32px',
                padding: '4px 8px',
                fontSize: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-subtle)',
              }}
              value={customFrom}
              onChange={(e) => onCustomFromChange && onCustomFromChange(e.target.value)}
              title="From Date"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              To:
            </label>
            <input
              type="date"
              className="form-input"
              style={{
                width: '130px',
                height: '32px',
                padding: '4px 8px',
                fontSize: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-subtle)',
              }}
              value={customTo}
              onChange={(e) => onCustomToChange && onCustomToChange(e.target.value)}
              title="To Date"
            />
          </div>
        </div>
      )}
    </div>
  );
};
