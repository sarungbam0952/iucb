import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Search,
  Users,
  PiggyBank,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MemberStatementsReportPage: React.FC = () => {
  const {
    members,
    formatCurrency,
    setSelectedMemberId,
    setActivePage,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [loanFilter, setLoanFilter] = useState('All');

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = 'Employee ID,Member Name,Department,Designation,Joining Date,Basic Salary,Contrib Rate,Current PF Balance,Loan Outstanding,Has Active Loan\n';
    const rows = filteredMembers.map((m) =>
      `"${m.id}","${m.fullName}","${m.department}","${m.designation}","${m.dateOfJoining}",${m.salary},${m.contributionPercentage}%,${m.currentBalance},${m.outstandingLoan},"${m.hasLoan ? 'Yes' : 'No'}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IUCB_Member_Statements_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const departments = ['All', ...Array.from(new Set(members.map((m) => m.department)))];

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || m.department === deptFilter;
    const matchesLoan =
      loanFilter === 'All' ||
      (loanFilter === 'With Loans' && m.hasLoan) ||
      (loanFilter === 'No Loans' && !m.hasLoan);

    return matchesSearch && matchesDept && matchesLoan;
  });

  const totalBalance = members.reduce((sum, m) => sum + m.currentBalance, 0);
  const totalLoanLiabilities = members.reduce((sum, m) => sum + m.outstandingLoan, 0);
  const avgBalance = members.length > 0 ? Math.round(totalBalance / members.length) : 0;
  const membersWithLoans = members.filter((m) => m.hasLoan).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            Member Statements Report
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Official register of member Provident Fund accounts, monthly contribution rates, balances, and liabilities.
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
            <span className="kpi-label">TOTAL REGISTERED MEMBERS</span>
            <div className="kpi-icon-wrap" style={{ background: '#EFF6FF', color: 'var(--color-navy-900)' }}>
              <Users size={18} />
            </div>
          </div>
          <div className="kpi-value num">{members.length}</div>
          <div className="kpi-desc">100% active regular employees enrolled</div>
        </div>

        <div className="kpi-card accent-emerald">
          <div className="kpi-header">
            <span className="kpi-label">TOTAL ACCUMULATED PF BALANCE</span>
            <div className="kpi-icon-wrap" style={{ background: '#ECFDF5', color: '#059669' }}>
              <PiggyBank size={18} />
            </div>
          </div>
          <div className="kpi-value num">{formatCurrency(totalBalance)}</div>
          <div className="kpi-desc">Individual member equity in the Trust</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">AVERAGE MEMBER PF ACCRUAL</span>
            <div className="kpi-icon-wrap">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="kpi-value num">{formatCurrency(avgBalance)}</div>
          <div className="kpi-desc">Mean balance per enrolled bank staff</div>
        </div>

        <div className="kpi-card accent-amber">
          <div className="kpi-header">
            <span className="kpi-label">ACTIVE BORROWERS</span>
            <div className="kpi-icon-wrap" style={{ background: '#FFFBEB', color: '#D97706' }}>
              <BookOpen size={18} />
            </div>
          </div>
          <div className="kpi-value num">{membersWithLoans}</div>
          <div className="kpi-desc">Liabilities: {formatCurrency(totalLoanLiabilities)}</div>
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
            value={loanFilter}
            onChange={(e) => setLoanFilter(e.target.value)}
          >
            <option value="All">All Loan Statuses</option>
            <option value="With Loans">Active Loan Borrowers</option>
            <option value="No Loans">Zero Loan Liability</option>
          </select>
        </div>
      </div>

      {/* MEMBER STATEMENTS TABLE */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="card-title">Consolidated Member PF Statement Ledger</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Showing {filteredMembers.length} of {members.length} verified member accounts
            </div>
          </div>
          <span className="badge badge-neutral">Confidential Staff Records</span>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Member Full Name</th>
                <th>Department</th>
                <th>Joining Date</th>
                <th className="align-right">Basic Salary</th>
                <th className="align-center">Rate</th>
                <th className="align-right">Current PF Balance</th>
                <th>Loan Liability</th>
                <th className="align-right">Passbook Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{m.id}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>{m.fullName}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>{m.designation}</div>
                  </td>
                  <td>{m.department}</td>
                  <td style={{ fontSize: '0.8125rem' }}>{m.dateOfJoining}</td>
                  <td className="align-right num">{formatCurrency(m.salary)}</td>
                  <td className="align-center" style={{ fontWeight: 600 }}>{m.contributionPercentage}%</td>
                  <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-navy-900)' }}>
                    {formatCurrency(m.currentBalance)}
                  </td>
                  <td>
                    {m.hasLoan ? (
                      <div>
                        <span className="badge badge-pending">Active Loan</span>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--color-danger-text)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                          {formatCurrency(m.outstandingLoan)}
                        </div>
                      </div>
                    ) : (
                      <span className="badge badge-neutral">No Debt</span>
                    )}
                  </td>
                  <td className="align-right">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setSelectedMemberId(m.id);
                        setActivePage('ledger');
                      }}
                      title="Open individual passbook ledger"
                    >
                      <BookOpen size={13} />
                      <span>Passbook</span>
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
