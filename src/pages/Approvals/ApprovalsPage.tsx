import React, { useState } from 'react';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  PiggyBank,
  CreditCard,
  Building2,
  Check,
  X,
  Eye,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const ApprovalsPage: React.FC = () => {
  const {
    loans,
    contributions,
    retirements,
    formatCurrency,
    approveLoan,
    rejectLoan,
    approveContribution,
    rejectContribution,
    approveRetirementSettlement,
    currentRole,
    setSelectedLoanId,
    setActivePage,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'loans' | 'contributions' | 'other'>('all');

  // Rejection modal
  const [rejectItem, setRejectItem] = useState<{ id: string; type: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('Verification discrepancy');

  // Consolidate pending approvals
  const pendingLoanApprovals = loans
    .filter((l) => l.status === 'Pending Approval' || l.status === 'Under Committee Review')
    .map((l) => ({
      id: l.id,
      type: 'Loan Claim',
      member: l.memberName,
      memberId: l.memberId,
      submittedBy: l.approvalTimeline[0]?.actor || 'Data Entry',
      submittedDate: l.applicationDate,
      amount: l.requestedAmount,
      status: l.status,
      rawItem: l,
    }));

  const pendingContribApprovals = contributions
    .filter((c) => c.entryStatus === 'Pending Approval')
    .map((c) => ({
      id: c.id,
      type: 'Contribution Entry',
      member: c.memberName,
      memberId: c.memberId,
      submittedBy: c.enteredBy,
      submittedDate: c.enteredDate,
      amount: c.contributionAmount,
      status: c.entryStatus,
      rawItem: c,
    }));

  const pendingRetirementApprovals = retirements
    .filter((r) => r.status === 'Calculation Pending' || r.status === 'Under Review')
    .map((r) => ({
      id: r.id,
      type: 'Retirement Settlement',
      member: r.memberName,
      memberId: r.memberId,
      submittedBy: 'System / Trustee',
      submittedDate: r.retirementDate,
      amount: r.settlementAmount,
      status: r.status,
      rawItem: r,
    }));

  const allPending = [...pendingLoanApprovals, ...pendingContribApprovals, ...pendingRetirementApprovals];

  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = allPending.filter((item) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'loans' && item.type === 'Loan Claim') ||
      (activeTab === 'contributions' && item.type === 'Contribution Entry') ||
      (activeTab === 'other' && item.type === 'Retirement Settlement');
    const matchesSearch =
      searchTerm.trim() === '' ||
      item.member.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalPendingValue = allPending.reduce((sum, item) => sum + item.amount, 0);

  const handleApprove = (item: typeof allPending[0]) => {
    if (item.type === 'Loan Claim') {
      approveLoan(item.id, 'Approved via Central Approvals Hub.');
    } else if (item.type === 'Contribution Entry') {
      approveContribution(item.id);
    } else if (item.type === 'Retirement Settlement') {
      approveRetirementSettlement(item.id);
    }
  };

  const handleConfirmReject = () => {
    if (!rejectItem) return;
    if (rejectItem.type === 'Loan Claim') {
      rejectLoan(rejectItem.id, rejectReason);
    } else if (rejectItem.type === 'Contribution Entry') {
      rejectContribution(rejectItem.id, rejectReason);
    }
    setRejectItem(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            Central Approvals Queue
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Consolidated verification queue for pending loans, monthly contributions, and retirement settlements.
          </p>
        </div>
      </div>

      {/* 4 SUMMARY METRICS */}
      <div className="kpi-grid">
        <div className="kpi-card accent-amber">
          <div className="kpi-header">
            <span className="kpi-label">PENDING APPROVALS</span>
            <div className="kpi-icon-wrap" style={{ background: '#FFFBEB', color: '#D97706' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value num">{allPending.length}</div>
          <div className="kpi-desc">Awaiting administrative sanction</div>
        </div>

        <div className="kpi-card accent-emerald">
          <div className="kpi-header">
            <span className="kpi-label">APPROVED TODAY</span>
            <div className="kpi-icon-wrap" style={{ background: '#ECFDF5', color: '#059669' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="kpi-value num">4</div>
          <div className="kpi-desc">Sanctioned and posted to ledgers</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">REJECTED ENTRIES</span>
            <div className="kpi-icon-wrap">
              <XCircle size={18} />
            </div>
          </div>
          <div className="kpi-value num">0</div>
          <div className="kpi-desc">With formal reason recorded</div>
        </div>

        <div className="kpi-card accent-burgundy">
          <div className="kpi-header">
            <span className="kpi-label">TOTAL PENDING VALUE</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--color-burgundy-50)', color: 'var(--color-burgundy-700)' }}>
              <Building2 size={18} />
            </div>
          </div>
          <div className="kpi-value num">{formatCurrency(totalPendingValue)}</div>
          <div className="kpi-desc">Pending monetary entries</div>
        </div>
      </div>

      {/* TABS & QUEUE TABLE */}
      <div className="card">
        <div className="tab-nav" style={{ padding: '0 16px', margin: 0 }}>
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Pending ({allPending.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'loans' ? 'active' : ''}`}
            onClick={() => setActiveTab('loans')}
          >
            Loan Claims ({pendingLoanApprovals.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'contributions' ? 'active' : ''}`}
            onClick={() => setActiveTab('contributions')}
          >
            Contributions ({pendingContribApprovals.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'other' ? 'active' : ''}`}
            onClick={() => setActiveTab('other')}
          >
            Retirements ({pendingRetirementApprovals.length})
          </button>
        </div>

        {/* Compact horizontal table-toolbar */}
        <div className="table-toolbar" style={{ borderTop: '1px solid var(--color-border-subtle)', borderRadius: 0 }}>
          <div className="toolbar-search">
            <Search className="toolbar-search-icon" size={15} />
            <input
              type="text"
              placeholder="Search approval queue by member name, employee ID, or request ID..."
              className="toolbar-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Record Type</th>
                <th>Member Name</th>
                <th>Employee ID</th>
                <th>Submitted By</th>
                <th>Submitted Date</th>
                <th className="align-right">Transaction Amount (₹)</th>
                <th>Current Status</th>
                <th className="align-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                    No pending items in this approval queue.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-navy-900)' }}>
                        {item.id}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{item.type}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{item.member}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-burgundy-700)' }}>
                      {item.memberId}
                    </td>
                    <td>{item.submittedBy}</td>
                    <td>{item.submittedDate}</td>
                    <td className="align-right num" style={{ fontWeight: 700 }}>
                      {formatCurrency(item.amount)}
                    </td>
                    <td>
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="align-right">
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                        {/* Role-based permissions: Only Admin can approve/reject */}
                        {currentRole === 'Admin' ? (
                          <>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleApprove(item)}
                              title="Approve and Post to Ledger"
                            >
                              <Check size={13} />
                              <span>Approve</span>
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => setRejectItem({ id: item.id, type: item.type })}
                              title="Reject with Reason"
                            >
                              <X size={13} />
                              <span>Reject</span>
                            </button>
                          </>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                            Admin action only
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REJECTION REASON MODAL */}
      {rejectItem && (
        <div className="modal-backdrop" onClick={() => setRejectItem(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <div className="modal-title">Reject Record {rejectItem.id}</div>
              <button className="btn-close" onClick={() => setRejectItem(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                Please state the reason for rejecting <strong>{rejectItem.id}</strong> ({rejectItem.type}).
              </p>
              <div className="form-group">
                <label className="form-label">Mandatory Reason *</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setRejectItem(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleConfirmReject}>
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
