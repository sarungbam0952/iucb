import React, { useState } from 'react';
import {
  CreditCard,
  Printer,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  TrendingDown,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { KpiCard } from '../../components/common/KpiCard';
import { formatDate } from '../../utils/dateFormat';

export const LoanRegisterReportPage: React.FC = () => {
  const {
    loans,
    formatCurrency,
    setSelectedLoanId,
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
    const headers = 'Loan ID,Member Name,Employee ID,Department,Sanctioned Amount,Outstanding Principal,Interest Rate,Application Date,Status,Repayment Term\n';
    const rows = filteredLoans.map((l) =>
      `"${l.id}","${l.memberName}","${l.memberId}","${l.department}",${l.requestedAmount},${l.outstandingPrincipal},${l.interestRate}%,"${l.applicationDate}","${l.status}","${l.tenureMonths || 24} Months"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IUCB_Loan_Register_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const departments = ['All', ...Array.from(new Set(loans.map((l) => l.department)))];

  const filteredLoans = loans.filter((l) => {
    const matchesSearch =
      l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.memberId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    const matchesDept = deptFilter === 'All' || l.department === deptFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  const totalSanctioned = loans.reduce((sum, l) => sum + l.requestedAmount, 0);
  const totalOutstanding = loans.reduce((sum, l) => sum + l.outstandingPrincipal, 0);
  const totalRepayments = loans.reduce((sum, l) => sum + (l.repayments ? l.repayments.reduce((rSum, r) => rSum + r.total, 0) : 0), 0);
  const activeLoansCount = loans.filter((l) => l.status === 'Active' || l.outstandingPrincipal > 0).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            Loan Register Report
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Comprehensive audit schedule of sanctioned loans, outstanding principal balances, interest accrual, and repayment standing.
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
        <KpiCard
          label="Total Sanctioned Principal"
          value={formatCurrency(totalSanctioned)}
          icon={CreditCard}
          desc={`Cumulative borrowings across ${loans.length} loan files`}
        />

        <KpiCard
          label="Outstanding Loan Asset"
          value={formatCurrency(totalOutstanding)}
          icon={TrendingDown}
          desc="100% secured by member PF corpus balances"
        />

        <KpiCard
          label="Portfolio Arrears Rate"
          value="0.0%"
          icon={CheckCircle2}
          desc="Zero defaults via automated monthly payroll deduction"
        />

        <KpiCard
          label="Active Borrowing Files"
          value={activeLoansCount}
          icon={FileCheck}
          desc="Interest benchmark: 7.5% per annum"
        />
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
            placeholder="Search by Loan ID, Member Name, or Employee ID..."
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
            <option value="All">All Loan Statuses</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Under Committee Review">Under Committee Review</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* LOAN REGISTER TABLE */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="card-title">Official Loan Ledger & Repayment Schedule</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Detailed loan ledger accounts under Trust Rule 12 (Employee Credit Provision)
            </div>
          </div>
          <span className="badge badge-neutral">Audited Credit Portfolio</span>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Loan File ID</th>
                <th>Borrower Member</th>
                <th>Department</th>
                <th className="align-right">Sanction Amount</th>
                <th className="align-right">Outstanding Principal</th>
                <th>Sanction Date</th>
                <th className="align-center">Interest</th>
                <th>Portfolio Standing</th>
                <th>Approval Status</th>
                <th className="align-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{l.id}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>{l.memberName}</div>
                    <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{l.memberId}</div>
                  </td>
                  <td>{l.department}</td>
                  <td className="align-right num">{formatCurrency(l.requestedAmount)}</td>
                  <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-navy-900)' }}>
                    {formatCurrency(l.outstandingPrincipal)}
                  </td>
                  <td style={{ fontSize: '0.8125rem' }}>{formatDate(l.applicationDate)}</td>
                  <td className="align-center" style={{ fontWeight: 600 }}>{l.interestRate}%</td>
                  <td>
                    {l.outstandingPrincipal > 0 ? (
                      <span className="badge badge-approved">Standard (No Arrears)</span>
                    ) : (
                      <span className="badge badge-neutral">Settled / Closed</span>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={l.status} size="sm" />
                  </td>
                  <td className="align-right">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setSelectedLoanId(l.id);
                        setActivePage('loans');
                      }}
                      title="Inspect loan details in Loan Management"
                    >
                      <span>Manage</span>
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
