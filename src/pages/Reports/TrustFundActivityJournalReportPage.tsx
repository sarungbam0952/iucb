import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Search,
  BookOpen,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KpiCard } from '../../components/common/KpiCard';
import { formatDate } from '../../utils/dateFormat';

export const TrustFundActivityJournalReportPage: React.FC = () => {
  const { formatCurrency } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState('All');
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | '3months' | '6months' | 'custom'>('all');
  const [customFromDate, setCustomFromDate] = useState('');
  const [customToDate, setCustomToDate] = useState('');

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

  const filteredActivities = fundActivities.filter((act) => {
    const matchesFilter = activityTypeFilter === 'All' || act.type.includes(activityTypeFilter);
    const matchesSearch =
      searchTerm.trim() === '' ||
      act.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.type.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesDateRange = true;
    if (dateRangeFilter === 'all') {
      matchesDateRange = true;
    } else if (dateRangeFilter === '3months') {
      const now = new Date();
      const baseYear = Math.max(now.getFullYear(), 2026);
      const baseDate = new Date(baseYear, 8, 30);
      const d3 = new Date(baseDate);
      d3.setMonth(d3.getMonth() - 3);
      const d3Str = `${d3.getFullYear()}-${String(d3.getMonth() + 1).padStart(2, '0')}-${String(d3.getDate()).padStart(2, '0')}`;
      matchesDateRange = act.date >= d3Str;
    } else if (dateRangeFilter === '6months') {
      const now = new Date();
      const baseYear = Math.max(now.getFullYear(), 2026);
      const baseDate = new Date(baseYear, 8, 30);
      const d6 = new Date(baseDate);
      d6.setMonth(d6.getMonth() - 6);
      const d6Str = `${d6.getFullYear()}-${String(d6.getMonth() + 1).padStart(2, '0')}-${String(d6.getDate()).padStart(2, '0')}`;
      matchesDateRange = act.date >= d6Str;
    } else if (dateRangeFilter === 'custom') {
      if (customFromDate && act.date < customFromDate) matchesDateRange = false;
      if (customToDate && act.date > customToDate) matchesDateRange = false;
    }

    return matchesFilter && matchesSearch && matchesDateRange;
  });

  const totalCredits = filteredActivities.reduce((acc, cur) => acc + cur.credit, 0);
  const totalDebits = filteredActivities.reduce((acc, cur) => acc + cur.debit, 0);
  const latestBalance = filteredActivities.length > 0 ? filteredActivities[0].balance : 53240000;

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // CSV Export Handler
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            Trust Fund Activity Journal
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Master consolidated credit and debit journal entries affecting the trust fund pool.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
            <Printer size={14} />
            <span>Print Report</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleExportJournal}>
            <Download size={14} />
            <span>Export Journal CSV</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="kpi-grid">
        <KpiCard
          label="Total Filtered Entries"
          value={filteredActivities.length}
          icon={BookOpen}
          desc={`Out of ${fundActivities.length} total ledger batches`}
        />

        <KpiCard
          label="Total Credits Posted"
          value={`+${formatCurrency(totalCredits)}`}
          icon={ArrowDownLeft}
          desc="Contributions, recoveries & interest"
        />

        <KpiCard
          label="Total Debits Disbursed"
          value={`-${formatCurrency(totalDebits)}`}
          icon={ArrowUpRight}
          desc="Loan disbursements & advances"
        />

        <KpiCard
          label="Closing Pool Balance"
          value={formatCurrency(latestBalance)}
          icon={Layers}
          desc="Audited active pool position"
        />
      </div>

      {/* Main Journal Table Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Activity Journal Register</div>
            <div className="card-subtitle">Detailed line-by-line financial audit record with pool balance progression</div>
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

          <div className="toolbar-filters" style={{ flexWrap: 'wrap', gap: '8px' }}>
            {/* Statement Period Date-Range Filter Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-navy-900)', whiteSpace: 'nowrap' }}>
                Statement Period:
              </label>
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
                }}
                value={dateRangeFilter}
                onChange={(e) => setDateRangeFilter(e.target.value as any)}
              >
                <option value="all">All</option>
                <option value="3months">3 Months</option>
                <option value="6months">6 Months</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {dateRangeFilter === 'custom' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>From:</label>
                  <input
                    type="date"
                    className="form-input"
                    style={{ width: '130px', height: '32px', padding: '2px 8px', fontSize: '0.75rem', backgroundColor: '#FFFFFF' }}
                    value={customFromDate}
                    onChange={(e) => setCustomFromDate(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>To:</label>
                  <input
                    type="date"
                    className="form-input"
                    style={{ width: '130px', height: '32px', padding: '2px 8px', fontSize: '0.75rem', backgroundColor: '#FFFFFF' }}
                    value={customToDate}
                    onChange={(e) => setCustomToDate(e.target.value)}
                  />
                </div>
                {(customFromDate || customToDate) && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '2px 8px', fontSize: '0.6875rem', height: '32px' }}
                    onClick={() => {
                      setCustomFromDate('');
                      setCustomToDate('');
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            )}

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
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--color-text-muted)' }}>
                    No journal entries found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((act) => (
                  <tr key={act.id}>
                    <td style={{ fontWeight: 500 }}>{formatDate(act.date)}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
