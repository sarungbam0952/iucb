import React, { useState } from 'react';
import {
  Award,
  Printer,
  Download,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdvanceTrackerReportPage: React.FC = () => {
  const {
    advances,
    formatCurrency,
    setSelectedMemberId,
    setActivePage,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = 'Member Name,Employee ID,Department,Joining Date,Service Years,Eligibility Date,Advance Status,Granted Amount\n';
    const rows = filteredAdvances.map((a) =>
      `"${a.memberName}","${a.memberId}","${a.department}","${a.joiningDate}",${a.yearsOfService},"${a.eligibilityDate}","${a.advanceStatus}",${a.grantedAmount || 0}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IUCB_18_Yr_Advance_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredAdvances = advances.filter((a) => {
    const matchesSearch =
      a.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.advanceStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalEligible = advances.filter((a) => a.yearsOfService >= 18).length;
  const totalGranted = advances.filter((a) => a.advanceStatus === 'Granted' || !!a.grantedAmount).length;
  const totalDisbursedAmount = advances.reduce((sum, a) => sum + (a.grantedAmount || 0), 0);
  const approachingCount = advances.filter((a) => a.advanceStatus === 'Approaching').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            18-Yr Advance Tracker Report
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Official service verification audit for 18-year unbroken bank tenure and non-refundable advance entitlements under Trust Rule 14.
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
            <span className="kpi-label">TRACKED SENIOR CADRE</span>
            <div className="kpi-icon-wrap" style={{ background: '#EFF6FF', color: 'var(--color-navy-900)' }}>
              <Award size={18} />
            </div>
          </div>
          <div className="kpi-value num">{advances.length}</div>
          <div className="kpi-desc">Staff monitored for 18-year unbroken milestone</div>
        </div>

        <div className="kpi-card accent-emerald">
          <div className="kpi-header">
            <span className="kpi-label">REACHED 18-YR TENURE</span>
            <div className="kpi-icon-wrap" style={{ background: '#ECFDF5', color: '#059669' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="kpi-value num">{totalEligible}</div>
          <div className="kpi-desc">Eligible for up to 50% non-refundable advance</div>
        </div>

        <div className="kpi-card accent-burgundy">
          <div className="kpi-header">
            <span className="kpi-label">TOTAL DISBURSED ADVANCES</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--color-burgundy-50)', color: 'var(--color-burgundy-700)' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="kpi-value num">{formatCurrency(totalDisbursedAmount)}</div>
          <div className="kpi-desc">{totalGranted} claims approved and settled</div>
        </div>

        <div className="kpi-card accent-amber">
          <div className="kpi-header">
            <span className="kpi-label">APPROACHING 18-YR MILESTONE</span>
            <div className="kpi-icon-wrap" style={{ background: '#FFFBEB', color: '#D97706' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value num">{approachingCount}</div>
          <div className="kpi-desc">Staff within 12 months of eligibility</div>
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
            placeholder="Search by member name, employee ID, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="toolbar-filters">
          <select
            className="toolbar-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Service Statuses</option>
            <option value="Eligible">Eligible</option>
            <option value="Granted">Granted</option>
            <option value="Approaching">Approaching</option>
            <option value="Not Eligible">Not Eligible</option>
          </select>
        </div>
      </div>

      {/* ADVANCE TRACKER TABLE */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="card-title">18-Year Service Milestone & Advance Eligibility Register</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Statutory verification of unbroken bank service records under Imphal Urban Co-operative Bank service rules
            </div>
          </div>
          <span className="badge badge-neutral">Service Book Audit</span>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Member Full Name</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Bank Joining Date</th>
                <th className="align-center">Completed Service</th>
                <th>18-Year Milestone Date</th>
                <th>Advance Standing</th>
                <th className="align-right">Sanctioned Amount</th>
                <th className="align-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdvances.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>{a.memberName}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>Cadre: Regular Confirmed</div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{a.memberId}</td>
                  <td>{a.department}</td>
                  <td style={{ fontSize: '0.8125rem' }}>{a.joiningDate}</td>
                  <td className="align-center" style={{ fontWeight: 700, color: a.yearsOfService >= 18 ? 'var(--color-navy-900)' : 'var(--color-text-muted)' }}>
                    {a.yearsOfService} Years
                  </td>
                  <td style={{ fontSize: '0.8125rem' }}>{a.eligibilityDate}</td>
                  <td>
                    <StatusBadge status={a.advanceStatus} size="sm" />
                  </td>
                  <td className="align-right num" style={{ fontWeight: 700, color: a.grantedAmount ? 'var(--color-burgundy-700)' : 'var(--color-text-muted)' }}>
                    {a.grantedAmount ? formatCurrency(a.grantedAmount) : '—'}
                  </td>
                  <td className="align-right">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setSelectedMemberId(a.memberId);
                        setActivePage('advances');
                      }}
                      title="Inspect in 18-Year Advance management module"
                    >
                      <span>View</span>
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
