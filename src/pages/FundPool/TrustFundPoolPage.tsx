import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrustFundGrowthChart, FundCompositionChart } from '../../components/common/FinancialChart';

export const TrustFundPoolPage: React.FC = () => {
  const { formatCurrency, setActivePage } = useApp();

  const [dateRange, setDateRange] = useState('FY 2026-27');

  // Trust Pool Financial Metrics
  const totalTrustFund = 53240000;
  const totalPrincipal = 39200000;
  const accruedInterest = 14040000;
  const loanOutstanding = 5750000;
  const availableLiquidBalance = 33450000;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            Trust Fund Pool
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Central financial control centre for the autonomous employee trust fund.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage('reports-trust-fund-journal')}
          >
            <BookOpen size={14} />
            <span>View Activity Journal</span>
          </button>
        </div>
      </div>

      {/* MASTER CENTRAL BALANCE HERO BANNER */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--color-navy-950) 0%, var(--color-navy-900) 60%, var(--color-navy-850) 100%)',
          color: '#FFFFFF',
          padding: '24px 28px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94A3B8', fontWeight: 600 }}>
              CENTRAL TRUST FUND POOL BALANCE
            </span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', margin: '4px 0 8px 0' }} className="num">
              {formatCurrency(totalTrustFund)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8125rem', color: '#CBD5E1' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#34D399', fontWeight: 600 }}>
                <TrendingUp size={15} /> +8.4% Annual Corpus Growth
              </span>
              <span>•</span>
              <span>100+ Autonomous Member Accounts Consolidated</span>
              <span>•</span>
              <span>Audited Period FY 2026-27</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-approved" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
              <ShieldCheck size={14} /> Trust In Good Standing
            </span>
          </div>
        </div>

        {/* 4 POOL COMPONENT CARDS WITHIN HERO BANNER */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '14px',
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px 14px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.6875rem', color: '#94A3B8', textTransform: 'uppercase', display: 'block', fontWeight: 600, letterSpacing: '0.04em' }}>
              Total Principal Contributions
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px', display: 'block' }} className="num">
              {formatCurrency(totalPrincipal)}
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#94A3B8', display: 'block', marginTop: '3px' }}>
              73.6% of pool
            </span>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px 14px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.6875rem', color: '#94A3B8', textTransform: 'uppercase', display: 'block', fontWeight: 600, letterSpacing: '0.04em' }}>
              Accrued Interest Returns
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px', display: 'block' }} className="num">
              {formatCurrency(accruedInterest)}
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#94A3B8', display: 'block', marginTop: '3px' }}>
              FD maturity basis yield
            </span>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px 14px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.6875rem', color: '#94A3B8', textTransform: 'uppercase', display: 'block', fontWeight: 600, letterSpacing: '0.04em' }}>
              Loan Principal Outstanding
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px', display: 'block' }} className="num">
              {formatCurrency(loanOutstanding)}
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#94A3B8', display: 'block', marginTop: '3px' }}>
              Member loan assets
            </span>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '12px 14px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.16)' }}>
            <span style={{ fontSize: '0.6875rem', color: '#CBD5E1', textTransform: 'uppercase', display: 'block', fontWeight: 600, letterSpacing: '0.04em' }}>
              Available Pool Balance
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px', display: 'block' }} className="num">
              {formatCurrency(availableLiquidBalance)}
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#94A3B8', display: 'block', marginTop: '3px' }}>
              Liquid bank reserves
            </span>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1.1fr', gap: '20px' }}>
        <TrustFundGrowthChart formatCurrency={formatCurrency} />
        <FundCompositionChart formatCurrency={formatCurrency} />
      </div>
    </div>
  );
};
