import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Download,
  Eye,
  UserCheck,
  Wallet,
  Calendar,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { KpiCard } from '../../components/common/KpiCard';
import { ActionMenu } from '../../components/common/ActionMenu';
import { AddWithdrawalModal } from './AddWithdrawalModal';
import { WithdrawalDetails } from './WithdrawalDetails';
import { WithdrawalRecord } from '../../types';
import { formatDate } from '../../utils/dateFormat';

export const WithdrawalsPage: React.FC = () => {
  const {
    withdrawals,
    formatCurrency,
    setSelectedMemberId,
    setActivePage,
    currentRole,
  } = useApp();

  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | '3months' | '6months' | 'custom'>('all');
  const [customFromDate, setCustomFromDate] = useState('');
  const [customToDate, setCustomToDate] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // KPI Calculations
  const totalWithdrawalsAmount = useMemo(() => {
    return withdrawals.reduce((sum, w) => sum + w.amount, 0);
  }, [withdrawals]);

  const thisMonthWithdrawals = useMemo(() => {
    return withdrawals
      .filter((w) => w.date.startsWith('2026-09') && w.status !== 'Rejected')
      .reduce((sum, w) => sum + w.amount, 0);
  }, [withdrawals]);

  const pendingWithdrawalsCount = useMemo(() => {
    return withdrawals.filter(
      (w) => w.status === 'Pending Approval' || w.status === 'Under Review' || w.status === 'Draft'
    ).length;
  }, [withdrawals]);

  const lastWithdrawalDate = useMemo(() => {
    const dates = withdrawals
      .map((w) => w.date)
      .filter(Boolean)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    return dates[0] ? formatDate(dates[0]) : '—';
  }, [withdrawals]);

  // Filter logic
  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter((w) => {
      const matchesSearch =
        w.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === 'All' || w.withdrawalType === typeFilter;
      const matchesDept = deptFilter === 'All' || w.department === deptFilter;
      const matchesStatus = statusFilter === 'All' || w.status === statusFilter;

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
        matchesDateRange = w.date >= d3Str;
      } else if (dateRangeFilter === '6months') {
        const now = new Date();
        const baseYear = Math.max(now.getFullYear(), 2026);
        const baseDate = new Date(baseYear, 8, 30);
        const d6 = new Date(baseDate);
        d6.setMonth(d6.getMonth() - 6);
        const d6Str = `${d6.getFullYear()}-${String(d6.getMonth() + 1).padStart(2, '0')}-${String(d6.getDate()).padStart(2, '0')}`;
        matchesDateRange = w.date >= d6Str;
      } else if (dateRangeFilter === 'custom') {
        if (customFromDate && w.date < customFromDate) matchesDateRange = false;
        if (customToDate && w.date > customToDate) matchesDateRange = false;
      }

      return matchesSearch && matchesType && matchesDept && matchesStatus && matchesDateRange;
    });
  }, [withdrawals, searchTerm, typeFilter, deptFilter, statusFilter, dateRangeFilter, customFromDate, customToDate]);

  const totalPages = Math.ceil(filteredWithdrawals.length / pageSize) || 1;
  const paginatedWithdrawals = useMemo(() => {
    return filteredWithdrawals.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [filteredWithdrawals, currentPage, pageSize]);

  const handleExportCSV = () => {
    const headers =
      'Date,Employee ID,Member Name,Department,Withdrawal Type,Amount (INR),Reference No,Status,Remarks\n';
    const rows = filteredWithdrawals
      .map(
        (w) =>
          `"${w.date}","${w.memberId}","${w.memberName}","${w.department}","${w.withdrawalType}",${w.amount},"${w.referenceNo}","${w.status}","${w.remarks || ''}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IUCB_Withdrawals_Register_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Distinct withdrawal types for filter dropdown
  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(withdrawals.map((w) => w.withdrawalType)));
  }, [withdrawals]);

  if (selectedWithdrawal) {
    return (
      <WithdrawalDetails
        withdrawal={selectedWithdrawal}
        onBack={() => setSelectedWithdrawal(null)}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header & Main Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            Withdrawals Register
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Record and manage outgoing withdrawal transactions from member trust and provident fund accounts. Showing {filteredWithdrawals.length} recorded entries.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          {currentRole !== 'Trust Committee' && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus size={14} />
              <span>Add Withdrawal</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 SUMMARY METRIC CARDS */}
      <div className="kpi-grid">
        <KpiCard
          label="Total Withdrawals"
          value={formatCurrency(totalWithdrawalsAmount)}
          icon={Wallet}
          desc="Recorded cumulative member withdrawals"
        />

        <KpiCard
          label="This Month (Sep 2026)"
          value={formatCurrency(thisMonthWithdrawals)}
          icon={Calendar}
          desc="Recorded withdrawals this cycle"
        />

        <KpiCard
          label="Pending Entries (Sep 2026)"
          value={pendingWithdrawalsCount}
          icon={Clock}
          desc="Awaiting Admin ledger verification"
        />

        <KpiCard
          label="Last Withdrawal Date"
          value={lastWithdrawalDate}
          icon={CheckCircle2}
          desc="Latest recorded withdrawal"
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="table-toolbar">
        {/* Search */}
        <div className="toolbar-search">
          <div className="toolbar-search-icon">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="toolbar-search-input"
            placeholder="Search by name, ID, or reference number..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Filters */}
        <div className="toolbar-filters" style={{ flexWrap: 'wrap' }}>
          <select
            className="toolbar-select"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Withdrawal Types</option>
            {uniqueTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            className="toolbar-select"
            value={deptFilter}
            onChange={(e) => {
              setDeptFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Departments</option>
            <option value="Accounts & Finance">Accounts & Finance</option>
            <option value="Loans & Advances">Loans & Advances</option>
            <option value="Audit & Inspection">Audit & Inspection</option>
            <option value="Cash & Operations">Cash & Operations</option>
            <option value="IT & Systems">IT & Systems</option>
            <option value="General Administration">General Admin</option>
            <option value="Executive Office">Executive Office</option>
          </select>

          <select
            className="toolbar-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Under Review">Under Review</option>
            <option value="Rejected">Rejected</option>
          </select>

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
              onChange={(e) => {
                setDateRangeFilter(e.target.value as any);
                setCurrentPage(1);
              }}
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
                  style={{ width: '130px', height: '32px', padding: '4px 8px', fontSize: '0.75rem' }}
                  value={customFromDate}
                  onChange={(e) => {
                    setCustomFromDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="From"
                  title="From Date"
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>To:</label>
                <input
                  type="date"
                  className="form-input"
                  style={{ width: '130px', height: '32px', padding: '4px 8px', fontSize: '0.75rem' }}
                  value={customToDate}
                  onChange={(e) => {
                    setCustomToDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="To"
                  title="To Date"
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
                    setCurrentPage(1);
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="table-container">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Employee ID</th>
              <th>Member Name</th>
              <th>Withdrawal Type / Reason</th>
              <th className="align-right">Amount</th>
              <th>Reference / Txn ID</th>
              <th>Status</th>
              <th>Remarks</th>
              <th className="align-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedWithdrawals.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}
                >
                  No withdrawal records matched your search and filter criteria.
                </td>
              </tr>
            ) : (
              paginatedWithdrawals.map((withdrawal) => (
                <tr key={withdrawal.id}>
                  <td>{formatDate(withdrawal.date)}</td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: 'var(--color-navy-900)',
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedWithdrawal(withdrawal)}
                    >
                      {withdrawal.memberId}
                    </span>
                  </td>
                  <td>
                    <div
                      style={{ fontWeight: 600, color: 'var(--color-navy-900)', cursor: 'pointer' }}
                      onClick={() => setSelectedWithdrawal(withdrawal)}
                    >
                      {withdrawal.memberName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {withdrawal.department}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{withdrawal.withdrawalType}</span>
                  </td>
                  <td className="align-right num" style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>
                    {formatCurrency(withdrawal.amount)}
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                      {withdrawal.referenceNo}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={withdrawal.status} size="sm" />
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-text-secondary)',
                        maxWidth: '240px',
                        display: 'inline-block',
                      }}
                    >
                      {withdrawal.remarks || '—'}
                    </span>
                  </td>
                  <td className="align-right">
                    <ActionMenu
                      primaryAction={{
                        label: 'View Details',
                        icon: Eye,
                        onClick: () => setSelectedWithdrawal(withdrawal),
                        title: 'View Details',
                      }}
                      secondaryActions={[
                        {
                          label: 'Member Profile',
                          icon: UserCheck,
                          onClick: () => {
                            setSelectedMemberId(withdrawal.memberId);
                            setActivePage('member-profile');
                          },
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Bar */}
        <div className="table-pagination">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredWithdrawals.length)} of {filteredWithdrawals.length} records
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className="btn btn-secondary btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </button>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 8px', fontWeight: 600 }}>
              Page {currentPage} of {Math.max(1, totalPages)}
            </span>
            <button
              className="btn btn-secondary btn-sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Withdrawal Modal */}
      <AddWithdrawalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
