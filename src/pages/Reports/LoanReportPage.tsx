import React, { useState } from 'react';
import {
  Printer,
  Download,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/dateFormat';

export const LoanReportPage: React.FC = () => {
  const { loans, formatCurrency, setSelectedLoanId, setActivePage } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = 'Loan ID,Member Name,Employee ID,Department,Loan Amount (INR),Interest Rate (%),Sanction Date,Outstanding Principal (INR),Total Outstanding (INR),Status\n';
    const rows = filteredLoans
      .map(
        (l) =>
          `"${l.id}","${l.memberName}","${l.memberId}","${l.department}",${l.requestedAmount},${l.interestRate},"${l.sanctionDate || l.applicationDate}",${l.outstandingPrincipal},${l.totalOutstanding || l.outstandingPrincipal},"${l.status}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IUCB_Consolidated_Loan_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const departments = ['All', ...Array.from(new Set(loans.map((l) => l.department)))];

  const filteredLoans = loans.filter((l) => {
    const matchesSearch =
      l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.sanctionDate && l.sanctionDate.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    const matchesDept = deptFilter === 'All' || l.department === deptFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  const totalSanctioned = filteredLoans.reduce((sum, l) => sum + l.requestedAmount, 0);
  const totalOutstanding = filteredLoans.reduce((sum, l) => sum + (l.totalOutstanding || l.outstandingPrincipal || 0), 0);

  const totalPages = Math.ceil(filteredLoans.length / pageSize) || 1;
  const paginatedLoans = filteredLoans.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            Loan Report
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Consolidated loan schedule detailing member borrowings, sanctioned amounts, interest rates, and outstanding balances.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={handlePrint} title="Print report">
            <Printer size={14} />
            <span>Print Report</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleExportCSV} title="Export CSV">
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="table-toolbar">
        <div className="toolbar-search">
          <div className="toolbar-search-icon">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="toolbar-search-input"
            placeholder="Search by loan ID, member name, or employee ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="toolbar-filters">
          <select
            className="toolbar-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Loan Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Approved">Approved</option>
            <option value="Settled">Settled / Closed</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            className="toolbar-select"
            value={deptFilter}
            onChange={(e) => {
              setDeptFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'All' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Consolidated Loan Table */}
      <div className="table-container">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th style={{ width: '130px' }}>Loan ID</th>
              <th>Member Name</th>
              <th style={{ width: '120px' }}>Employee ID</th>
              <th className="align-right" style={{ width: '140px' }}>Loan Amount</th>
              <th style={{ width: '110px' }}>Interest Rate</th>
              <th style={{ width: '120px' }}>Sanction Date</th>
              <th className="align-right" style={{ width: '150px' }}>Outstanding Amount</th>
              <th style={{ width: '140px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLoans.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}
                >
                  No loan records found matching the specified filters.
                </td>
              </tr>
            ) : (
              paginatedLoans.map((loan) => (
                <tr key={loan.id}>
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: 'var(--color-navy-900)',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setSelectedLoanId(loan.id);
                        setActivePage('loan-details');
                      }}
                      title="View loan details"
                    >
                      {loan.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>
                      {loan.memberName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {loan.department}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                      {loan.memberId}
                    </span>
                  </td>
                  <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-navy-900)' }}>
                    {formatCurrency(loan.requestedAmount)}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--color-navy-800)' }}>
                      {loan.interestRate}% p.a.
                    </span>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                      {formatDate(loan.sanctionDate || loan.applicationDate)}
                    </span>
                  </td>
                  <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-navy-900)' }}>
                    {formatCurrency(loan.totalOutstanding || loan.outstandingPrincipal || 0)}
                  </td>
                  <td>
                    <StatusBadge status={loan.status} size="sm" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {filteredLoans.length > 0 && (
            <tfoot>
              <tr style={{ background: '#F8FAFC', fontWeight: 700, borderTop: '2px solid var(--color-border-subtle)' }}>
                <td colSpan={3} style={{ textAlign: 'right', color: 'var(--color-navy-900)' }}>
                  Total Filtered Loans ({filteredLoans.length} records):
                </td>
                <td className="align-right num" style={{ color: 'var(--color-navy-900)' }}>
                  {formatCurrency(totalSanctioned)}
                </td>
                <td colSpan={2}></td>
                <td className="align-right num" style={{ color: 'var(--color-navy-900)' }}>
                  {formatCurrency(totalOutstanding)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>

        {/* Table Footer Pagination */}
        {filteredLoans.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderTop: '1px solid var(--color-border-subtle)',
              fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)',
              background: '#FFFFFF',
            }}
          >
            <span>
              Showing {Math.min(filteredLoans.length, (currentPage - 1) * pageSize + 1)} to{' '}
              {Math.min(filteredLoans.length, currentPage * pageSize)} of {filteredLoans.length} loans
            </span>
            {totalPages > 1 && (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  className="btn btn-secondary btn-xs"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span style={{ padding: '4px 8px', fontWeight: 600 }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-secondary btn-xs"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
