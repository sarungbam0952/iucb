import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Download,
  MoreVertical,
  User,
  Eye,
  BookOpen,
  CreditCard,
  Edit,
  History,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AddMemberModal } from './AddMemberModal';

export const MembersList: React.FC = () => {
  const {
    members,
    formatCurrency,
    setSelectedMemberId,
    setActivePage,
    currentRole,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loanFilter, setLoanFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Active 3-dot dropdown menu
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter logic
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || m.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || m.accountStatus === statusFilter;
    const matchesLoan =
      loanFilter === 'All' ||
      (loanFilter === 'Active Loan' && m.hasLoan) ||
      (loanFilter === 'No Loan' && !m.hasLoan);

    return matchesSearch && matchesDept && matchesStatus && matchesLoan;
  });

  const totalPages = Math.ceil(filteredMembers.length / pageSize);
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportCSV = () => {
    const headers = 'Employee ID,Full Name,Department,Designation,Joining Date,Salary,Contrib %,Current PF Balance,Loan Status,Account Status\n';
    const rows = filteredMembers.map(m =>
      `"${m.id}","${m.fullName}","${m.department}","${m.designation}","${m.dateOfJoining}",${m.salary},${m.contributionPercentage}%,${m.currentBalance},"${m.hasLoan ? 'Active Loan' : 'No Loan'}","${m.accountStatus}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IUCB_Trust_Members_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header & Main Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            Members Directory
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Manage employee records, contributions and account information. Showing {filteredMembers.length} recorded members.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={14} />
            <span>Add Member</span>
          </button>
        </div>
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
            placeholder="Search by name or Employee ID (e.g. IUCB-0042)..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Filters */}
        <div className="toolbar-filters">
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
            value={loanFilter}
            onChange={(e) => {
              setLoanFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Loans</option>
            <option value="Active Loan">Has Active Loan</option>
            <option value="No Loan">No Active Loan</option>
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
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="table-container">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Member Name</th>
              <th>Department</th>
              <th>Date of Joining</th>
              <th className="align-right">Basic Salary</th>
              <th className="align-center">Contrib %</th>
              <th className="align-right">Current PF Balance</th>
              <th>Loan Status</th>
              <th>Account Status</th>
              <th className="align-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMembers.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                  No members matched your search and filter criteria.
                </td>
              </tr>
            ) : (
              paginatedMembers.map((member) => (
                <tr key={member.id}>
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: 'var(--color-navy-900)',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setSelectedMemberId(member.id);
                        setActivePage('member-profile');
                      }}
                    >
                      {member.id}
                    </span>
                  </td>
                  <td>
                    <div
                      style={{ fontWeight: 600, color: 'var(--color-navy-900)', cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedMemberId(member.id);
                        setActivePage('member-profile');
                      }}
                    >
                      {member.fullName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {member.designation}
                    </div>
                  </td>
                  <td>{member.department}</td>
                  <td>{member.dateOfJoining}</td>
                  <td className="align-right num" style={{ fontWeight: 500 }}>
                    {formatCurrency(member.salary)}
                  </td>
                  <td className="align-center">
                    <span className="badge badge-neutral">{member.contributionPercentage}%</span>
                  </td>
                  <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-navy-900)' }}>
                    {formatCurrency(member.currentBalance)}
                  </td>
                  <td>
                    {member.hasLoan ? (
                      <span className="badge badge-pending">
                        <CreditCard size={11} />
                        <span>Active Loan ({formatCurrency(member.outstandingLoan)})</span>
                      </span>
                    ) : (
                      <span className="badge badge-neutral">No Loan</span>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={member.accountStatus} size="sm" />
                  </td>
                  <td className="align-right" style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSelectedMemberId(member.id);
                          setActivePage('member-profile');
                        }}
                        title="View Profile"
                      >
                        <Eye size={13} />
                        <span>Profile</span>
                      </button>
                      <button
                        className="btn-close"
                        style={{ border: '1px solid var(--color-border-subtle)', padding: '4px' }}
                        onClick={() => setActiveMenuId(activeMenuId === member.id ? null : member.id)}
                        title="Actions"
                      >
                        <MoreVertical size={14} />
                      </button>
                    </div>

                    {/* 3-Dot Action Dropdown Menu */}
                    {activeMenuId === member.id && (
                      <div
                        style={{
                          position: 'absolute',
                          right: '14px',
                          top: '100%',
                          zIndex: 30,
                          background: '#FFFFFF',
                          borderRadius: '6px',
                          boxShadow: 'var(--shadow-lg)',
                          border: '1px solid var(--color-border-subtle)',
                          padding: '4px',
                          minWidth: '160px',
                          textAlign: 'left',
                        }}
                      >
                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            width: '100%',
                            padding: '6px 10px',
                            background: 'transparent',
                            border: 'none',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            borderRadius: '4px',
                          }}
                          onClick={() => {
                            setSelectedMemberId(member.id);
                            setActivePage('member-profile');
                            setActiveMenuId(null);
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <User size={13} />
                          <span>View Profile</span>
                        </button>

                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            width: '100%',
                            padding: '6px 10px',
                            background: 'transparent',
                            border: 'none',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            borderRadius: '4px',
                          }}
                          onClick={() => {
                            setSelectedMemberId(member.id);
                            setActivePage('ledger');
                            setActiveMenuId(null);
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <BookOpen size={13} />
                          <span>View Account Ledger</span>
                        </button>

                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            width: '100%',
                            padding: '6px 10px',
                            background: 'transparent',
                            border: 'none',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            borderRadius: '4px',
                          }}
                          onClick={() => {
                            setSelectedMemberId(member.id);
                            setActivePage('contributions');
                            setActiveMenuId(null);
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <History size={13} />
                          <span>View Contributions</span>
                        </button>

                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            width: '100%',
                            padding: '6px 10px',
                            background: 'transparent',
                            border: 'none',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            borderRadius: '4px',
                          }}
                          onClick={() => {
                            setSelectedMemberId(member.id);
                            setActivePage('loans');
                            setActiveMenuId(null);
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <CreditCard size={13} />
                          <span>View Loans</span>
                        </button>
                      </div>
                    )}
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
            {Math.min(currentPage * pageSize, filteredMembers.length)} of {filteredMembers.length} records
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

      {/* Add Member Registration Modal */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
