import React, { useState } from 'react';
import {
  Calendar,
  Printer,
  Download,
  Search,
  Users,
  PiggyBank,
  TrendingUp,
  Banknote,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const RetirementPipelineReportPage: React.FC = () => {
  const {
    retirements,
    formatCurrency,
    setSelectedMemberId,
    setActivePage,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = 'Member Name,Employee ID,Department,Superannuation Date,Contributed Principal,Accrued Interest,Total Settlement Outflow,Status\n';
    const rows = filteredRetirements.map((r) =>
      `"${r.memberName}","${r.employeeId}","${r.department}","${r.retirementDate}",${r.totalContribution},${r.accruedInterest},${r.settlementAmount},"${r.status}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IUCB_Retirement_Pipeline_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const departments = ['All', ...Array.from(new Set(retirements.map((r) => r.department)))];

  const filteredRetirements = retirements.filter((r) => {
    const matchesSearch =
      r.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesDept = deptFilter === 'All' || r.department === deptFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  const totalRetiringCount = retirements.length;
  const totalPrincipal = retirements.reduce((sum, r) => sum + r.totalContribution, 0);
  const totalInterest = retirements.reduce((sum, r) => sum + r.accruedInterest, 0);
  const totalOutflow = retirements.reduce((sum, r) => sum + r.settlementAmount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            Retirement Pipeline Report
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Forecasting superannuation dates, member accumulated principal, compound interest accruals, and final Trust settlement liquidity outflows.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
            <Printer size={14} />
            <span>Print Report</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleExportCSV}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 SUMMARY METRIC CARDS */}
      <div className="kpi-grid">
        <div className="kpi-card accent-navy">
          <div className="kpi-header">
            <span className="kpi-label">UPCOMING SUPERANNUATIONS</span>
            <div className="kpi-icon-wrap" style={{ background: '#EFF6FF', color: 'var(--color-navy-900)' }}>
              <Calendar size={18} />
            </div>
          </div>
          <div className="kpi-value num">{totalRetiringCount}</div>
          <div className="kpi-desc">Scheduled retirees in 24-month horizon</div>
        </div>

        <div className="kpi-card accent-emerald">
          <div className="kpi-header">
            <span className="kpi-label">CONTRIBUTED CORPUS (PRINCIPAL)</span>
            <div className="kpi-icon-wrap" style={{ background: '#ECFDF5', color: '#059669' }}>
              <PiggyBank size={18} />
            </div>
          </div>
          <div className="kpi-value num">{formatCurrency(totalPrincipal)}</div>
          <div className="kpi-desc">Historical employee PF contributions</div>
        </div>

        <div className="kpi-card accent-burgundy">
          <div className="kpi-header">
            <span className="kpi-label">ACCRUED COMPOUND INTEREST</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--color-burgundy-50)', color: 'var(--color-burgundy-700)' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="kpi-value num">{formatCurrency(totalInterest)}</div>
          <div className="kpi-desc">Trust investment yield credit</div>
        </div>

        <div className="kpi-card accent-amber">
          <div className="kpi-header">
            <span className="kpi-label">PROJECTED SETTLEMENT OUTFLOW</span>
            <div className="kpi-icon-wrap" style={{ background: '#FFFBEB', color: '#D97706' }}>
              <Banknote size={18} />
            </div>
          </div>
          <div className="kpi-value num">{formatCurrency(totalOutflow)}</div>
          <div className="kpi-desc">Total final payout commitment</div>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="table-toolbar">
        <div className="toolbar-search">
          <div className="toolbar-search-icon">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="toolbar-search-input"
            placeholder="Search by retiree name, employee ID, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="toolbar-filters">
          <select
            className="toolbar-select"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'All' ? 'All Departments' : dept}
              </option>
            ))}
          </select>

          <select
            className="toolbar-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Settlement Statuses</option>
            <option value="Settled">Settled / Closed</option>
            <option value="Pending Settlement">Pending Settlement</option>
            <option value="Under Review">Under Review</option>
          </select>
        </div>
      </div>

      {/* RETIREMENT PIPELINE TABLE */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="card-title">Retirement Pipeline & Superannuation Settlement Schedule</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Calculation schedule governed by IUCB Employee Provident Fund Trust settlement regulations
            </div>
          </div>
          <span className="badge badge-neutral">Settlement Forecast</span>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Retiring Member</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Superannuation Date</th>
                <th className="align-right">Contributed Corpus</th>
                <th className="align-right">Accrued Interest</th>
                <th className="align-right">Net Settlement Outflow</th>
                <th>Settlement Status</th>
                <th className="align-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRetirements.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>{r.memberName}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>Superannuation Schedule</div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{r.employeeId}</td>
                  <td>{r.department}</td>
                  <td style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{r.retirementDate}</td>
                  <td className="align-right num">{formatCurrency(r.totalContribution)}</td>
                  <td className="align-right num" style={{ color: 'var(--color-burgundy-700)' }}>
                    {formatCurrency(r.accruedInterest)}
                  </td>
                  <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-navy-900)' }}>
                    {formatCurrency(r.settlementAmount)}
                  </td>
                  <td>
                    <StatusBadge status={r.status} size="sm" />
                  </td>
                  <td className="align-right">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setSelectedMemberId(r.employeeId);
                        setActivePage('retirement');
                      }}
                      title="Inspect in Retirement Settlement module"
                    >
                      <span>Pipeline</span>
                      <ArrowRight size={12} />
                    </button>
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
