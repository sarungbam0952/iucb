import React, { useState } from 'react';
import {
  Landmark,
  PiggyBank,
  TrendingUp,
  CreditCard,
  Wallet,
  Download,
  Calendar,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrustFundGrowthChart, FundCompositionChart } from '../../components/common/FinancialChart';

export const TrustFundPoolPage: React.FC = () => {
  const { formatCurrency } = useApp();

  const [dateRange, setDateRange] = useState('FY 2026-27');
  const [activityTypeFilter, setActivityTypeFilter] = useState('All');

  // Trust Pool Financial Metrics
  const totalTrustFund = 53240000;
  const totalPrincipal = 39200000;
  const accruedInterest = 14040000;
  const loanOutstanding = 5750000;
  const availableLiquidBalance = 33450000;

  // Master Fund Activity Journal
  const fundActivities = [
    {
      id: 'FND-2026-0922',
      date: '2026-09-22',
      reference: 'BATCH-SEP-26',
      type: 'Contribution Credit',
      description: 'Monthly member PF deductions consolidated credit (September advance)',
      credit: 884000,
      debit: 0,
      balance: 53240000,
    },
    {
      id: 'FND-2026-0918',
      date: '2026-09-18',
      reference: 'LN-DISB-0019',
      type: 'Loan Disbursement',
      description: 'Principal disbursed for sanctioned loan LN-2026-0019 (Soraisam Devika)',
      credit: 0,
      debit: 150000,
      balance: 52356000,
    },
    {
      id: 'FND-2026-0831',
      date: '2026-08-31',
      reference: 'BATCH-AUG-26',
      type: 'Contribution Credit',
      description: 'Consolidated August 2026 employee payroll deductions',
      credit: 840000,
      debit: 0,
      balance: 52506000,
    },
    {
      id: 'FND-2026-0831',
      date: '2026-08-31',
      reference: 'LN-REP-AUG26',
      type: 'Loan Repayment',
      description: 'Consolidated monthly loan principal & interest recovery via payroll',
      credit: 124500,
      debit: 0,
      balance: 51666000,
    },
    {
      id: 'FND-2026-0630',
      date: '2026-06-30',
      reference: 'INT-Q1-DISTRIB',
      type: 'Interest Allocation',
      description: 'Q1 FD term deposit returns distributed into member accounts',
      credit: 1040000,
      debit: 0,
      balance: 51541500,
    },
    {
      id: 'FND-2026-0515',
      date: '2026-05-15',
      reference: 'ADV-18-SANCT',
      type: '18-Yr Advance',
      description: 'One-time interest-free advance sanctioned for qualifying members',
      credit: 0,
      debit: 350000,
      balance: 50501500,
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const filteredActivities = fundActivities.filter((act) => {
    const matchesFilter = activityTypeFilter === 'All' || act.type.includes(activityTypeFilter);
    const matchesSearch =
      searchTerm.trim() === '' ||
      act.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleExportJournal = () => {
    const headers = 'Date,Reference,Type,Description,Credit,Debit,Recorded Pool Balance\n';
    const rows = filteredActivities
      .map((a) => `"${a.date}","${a.reference}","${a.type}","${a.description}",${a.credit},${a.debit},${a.balance}`)
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IUCB_Trust_Fund_Journal_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

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
          <button className="btn btn-secondary btn-sm" onClick={handleExportJournal}>
            <Download size={14} />
            <span>Export Fund Journal</span>
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
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px 14px', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.6875rem', color: '#94A3B8', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>
              Total Principal Contributions
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#60A5FA' }} className="num">
              {formatCurrency(totalPrincipal)}
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#94A3B8', display: 'block', marginTop: '2px' }}>
              73.6% of pool
            </span>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px 14px', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.6875rem', color: '#94A3B8', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>
              Accrued Interest Returns
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F472B6' }} className="num">
              {formatCurrency(accruedInterest)}
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#94A3B8', display: 'block', marginTop: '2px' }}>
              FD maturity basis yield
            </span>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px 14px', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.6875rem', color: '#94A3B8', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>
              Loan Principal Outstanding
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FBBF24' }} className="num">
              {formatCurrency(loanOutstanding)}
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#94A3B8', display: 'block', marginTop: '2px' }}>
              Member loan assets
            </span>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '12px 14px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <span style={{ fontSize: '0.6875rem', color: '#FFFFFF', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>
              Available Pool Balance
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34D399' }} className="num">
              {formatCurrency(availableLiquidBalance)}
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#94A3B8', display: 'block', marginTop: '2px' }}>
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

      {/* FUND ACTIVITY JOURNAL */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Trust Fund Activity Journal</div>
            <div className="card-subtitle">Master consolidated credit and debit journal entries affecting the pool</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={handleExportJournal}>
            <Download size={14} />
            <span>Export Journal CSV</span>
          </button>
        </div>

        {/* Compact horizontal table-toolbar */}
        <div className="table-toolbar">
          <div className="toolbar-search">
            <Search className="toolbar-search-icon" size={15} />
            <input
              type="text"
              placeholder="Search journal entries by reference or description..."
              className="toolbar-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="toolbar-filters">
            <select
              className="toolbar-select"
              value={activityTypeFilter}
              onChange={(e) => setActivityTypeFilter(e.target.value)}
            >
              <option value="All">All Journal Types</option>
              <option value="Contribution">Contributions</option>
              <option value="Loan">Loan Transactions</option>
              <option value="Interest">Interest Allocations</option>
              <option value="Advance">18-Yr Advances</option>
            </select>
          </div>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Journal Reference</th>
                <th>Transaction Type</th>
                <th>Description</th>
                <th className="align-right">Credit (₹)</th>
                <th className="align-right">Debit (₹)</th>
                <th className="align-right">Recorded Pool Balance (₹)</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((act) => (
                <tr key={act.id}>
                  <td style={{ fontWeight: 500 }}>{act.date}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600 }}>{act.reference}</td>
                  <td>
                    <span className="badge badge-neutral">{act.type}</span>
                  </td>
                  <td>{act.description}</td>
                  <td className="align-right num td-credit" style={{ fontWeight: 600 }}>
                    {act.credit > 0 ? `+${formatCurrency(act.credit)}` : '—'}
                  </td>
                  <td className="align-right num td-debit" style={{ fontWeight: 600 }}>
                    {act.debit > 0 ? `-${formatCurrency(act.debit)}` : '—'}
                  </td>
                  <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-navy-900)' }}>
                    {formatCurrency(act.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
