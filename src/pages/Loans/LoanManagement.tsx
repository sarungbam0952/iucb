import React, { useState } from 'react';
import {
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Eye,
  Check,
  X,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Receipt,
  FileCheck,
  Building2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoanRecord } from '../../types';

export const LoanManagement: React.FC = () => {
  const {
    loans,
    members,
    formatCurrency,
    approveLoan,
    rejectLoan,
    committeeRecommendLoan,
    submitLoan,
    currentRole,
    selectedLoanId,
    setSelectedLoanId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active' | 'completed' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Loan for Details Drawer
  const [activeLoanModal, setActiveLoanModal] = useState<LoanRecord | null>(null);

  // Approval Dialog State
  const [approvingLoan, setApprovingLoan] = useState<LoanRecord | null>(null);
  const [adminApprovalNotes, setAdminApprovalNotes] = useState('Approved in accordance with IUCB Trust Loan By-laws.');

  // Rejection Dialog State
  const [rejectingLoan, setRejectingLoan] = useState<LoanRecord | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Committee Recommendation Dialog State
  const [committeeReviewLoan, setCommitteeReviewLoan] = useState<LoanRecord | null>(null);
  const [committeeNotes, setCommitteeNotes] = useState('Recommended for approval after examining service continuity and PF collateral.');

  // New Loan Claim Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyMemberId, setApplyMemberId] = useState(members[0]?.id || '');
  const [requestedAmt, setRequestedAmt] = useState(75000);
  const [tenure, setTenure] = useState(24);
  const [purpose, setPurpose] = useState('Medical treatment / health expense');

  // KPI Metrics
  const pendingClaims = loans.filter((l) => l.status === 'Pending Approval' || l.status === 'Under Committee Review');
  const activeLoans = loans.filter((l) => l.status === 'Active');
  const completedLoans = loans.filter((l) => l.status === 'Completed');
  const totalOutstanding = activeLoans.reduce((sum, l) => sum + l.outstandingPrincipal, 0);

  // Filtered Loans
  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.purpose.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === 'pending') return matchesSearch && (loan.status === 'Pending Approval' || loan.status === 'Under Committee Review');
    if (activeTab === 'active') return matchesSearch && loan.status === 'Active';
    if (activeTab === 'completed') return matchesSearch && loan.status === 'Completed';
    if (activeTab === 'rejected') return matchesSearch && loan.status === 'Rejected';
    return matchesSearch;
  });

  const selectedMemberForApply = members.find((m) => m.id === applyMemberId);
  const maxEligibleAmount = selectedMemberForApply ? Math.round(selectedMemberForApply.currentBalance * 0.75) : 0;

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberForApply) return;

    submitLoan({
      memberId: selectedMemberForApply.id,
      memberName: selectedMemberForApply.fullName,
      department: selectedMemberForApply.department,
      requestedAmount: Number(requestedAmt),
      eligibleAmount: maxEligibleAmount,
      interestRate: 6.5,
      tenureMonths: Number(tenure),
      applicationDate: new Date().toISOString().split('T')[0],
      purpose,
    });

    setIsApplyModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            Loan Management
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Autonomous PF loan claims, Trust Committee recommendations, and Admin sanctions.
          </p>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => setIsApplyModalOpen(true)}
        >
          <Plus size={14} />
          <span>New Loan Claim</span>
        </button>
      </div>

      {/* 4 SUMMARY METRICS */}
      <div className="kpi-grid">
        <div
          className="kpi-card accent-amber"
          style={{ cursor: 'pointer' }}
          onClick={() => setActiveTab('pending')}
        >
          <div className="kpi-header">
            <span className="kpi-label">PENDING CLAIMS</span>
            <div className="kpi-icon-wrap" style={{ background: '#FFFBEB', color: '#D97706' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value num">{pendingClaims.length}</div>
          <div className="kpi-desc">Requires committee decision / admin action</div>
        </div>

        <div
          className="kpi-card accent-emerald"
          style={{ cursor: 'pointer' }}
          onClick={() => setActiveTab('active')}
        >
          <div className="kpi-header">
            <span className="kpi-label">ACTIVE LOANS</span>
            <div className="kpi-icon-wrap" style={{ background: '#ECFDF5', color: '#059669' }}>
              <CreditCard size={18} />
            </div>
          </div>
          <div className="kpi-value num">{activeLoans.length}</div>
          <div className="kpi-desc">Monthly repayments recovered through payroll</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">TOTAL OUTSTANDING PRINCIPAL</span>
            <div className="kpi-icon-wrap">
              <Building2 size={18} />
            </div>
          </div>
          <div className="kpi-value num">{formatCurrency(totalOutstanding)}</div>
          <div className="kpi-desc">Interest rate: 6.5% per annum</div>
        </div>

        <div
          className="kpi-card"
          style={{ cursor: 'pointer' }}
          onClick={() => setActiveTab('completed')}
        >
          <div className="kpi-header">
            <span className="kpi-label">COMPLETED LOANS</span>
            <div className="kpi-icon-wrap">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="kpi-value num">{completedLoans.length}</div>
          <div className="kpi-desc">Fully repaid with interest</div>
        </div>
      </div>

      {/* FILTER & TABS */}
      <div className="card">
        <div className="tab-nav" style={{ margin: 0, padding: '0 16px' }}>
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Loans ({loans.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Approval ({pendingClaims.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active ({activeLoans.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed ({completedLoans.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'rejected' ? 'active' : ''}`}
            onClick={() => setActiveTab('rejected')}
          >
            Rejected
          </button>
        </div>

        <div className="table-toolbar" style={{ borderTop: '1px solid var(--color-border-subtle)', borderRadius: 0 }}>
          <div className="toolbar-search">
            <div className="toolbar-search-icon">
              <Search size={16} />
            </div>
            <input
              type="text"
              className="toolbar-search-input"
              placeholder="Search by ID, member name, purpose..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="toolbar-filters">
            <select
              className="toolbar-select"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
            >
              <option value="all">All Loan Statuses</option>
              <option value="pending">Pending Approval</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* LOANS TABLE */}
        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Member Name</th>
                <th className="align-right">Requested</th>
                <th className="align-right">Eligible Ceiling</th>
                <th>Application Date</th>
                <th>Tenure</th>
                <th>Approval Status</th>
                <th className="align-right">Outstanding Balance</th>
                <th className="align-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                    No loans found matching the selected tab and search.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan.id}>
                    <td>
                      <span
                        style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-navy-900)', cursor: 'pointer' }}
                        onClick={() => setActiveLoanModal(loan)}
                      >
                        {loan.id}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>{loan.memberName}</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                        {loan.memberId} • {loan.department}
                      </div>
                    </td>
                    <td className="align-right num" style={{ fontWeight: 600 }}>
                      {formatCurrency(loan.requestedAmount)}
                    </td>
                    <td className="align-right num" style={{ color: 'var(--color-text-muted)' }}>
                      {formatCurrency(loan.eligibleAmount)}
                    </td>
                    <td>{loan.applicationDate}</td>
                    <td>{loan.tenureMonths} mos</td>
                    <td>
                      <StatusBadge status={loan.status} size="sm" />
                    </td>
                    <td className="align-right num" style={{ fontWeight: 700, color: loan.outstandingPrincipal > 0 ? 'var(--color-danger-text)' : 'inherit' }}>
                      {loan.outstandingPrincipal > 0 ? formatCurrency(loan.totalOutstanding) : '₹0'}
                    </td>
                    <td className="align-right">
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                        {/* Admin Action: Approve / Reject */}
                        {currentRole === 'Admin' && (loan.status === 'Pending Approval' || loan.status === 'Under Committee Review') && (
                          <>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => setApprovingLoan(loan)}
                              title="Approve Loan Sanction"
                            >
                              <Check size={13} />
                              <span>Approve</span>
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                setRejectingLoan(loan);
                                setRejectionReason('Exceeds borrowing capacity / incomplete documentation');
                              }}
                              title="Reject Loan Claim"
                            >
                              <X size={13} />
                            </button>
                          </>
                        )}

                        {/* Trust Committee Action: Recommend */}
                        {currentRole === 'Trust Committee' && loan.status === 'Pending Approval' && (
                          <button
                            className="btn btn-accent btn-sm"
                            onClick={() => setCommitteeReviewLoan(loan)}
                            title="Record Committee Recommendation"
                          >
                            <FileCheck size={13} />
                            <span>Recommend</span>
                          </button>
                        )}

                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setActiveLoanModal(loan)}
                          title="View Complete Loan Details"
                        >
                          <Eye size={13} />
                          <span>Details</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOAN DETAILS DRAWER / MODAL */}
      {activeLoanModal && (
        <div className="drawer-container" onClick={() => setActiveLoanModal(null)}>
          <div
            className="drawer-panel"
            style={{ width: '640px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="modal-title">Loan Details & Sanction File</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-burgundy-700)' }}>
                    {activeLoanModal.id}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  System of Record loan tracking • {activeLoanModal.memberName} ({activeLoanModal.memberId})
                </div>
              </div>
              <button className="btn-close" onClick={() => setActiveLoanModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Financial Snapshot */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#F8FAFC', padding: '14px', borderRadius: '6px', border: '1px solid var(--color-border-subtle)' }}>
                <div>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Requested</span>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700 }} className="num">{formatCurrency(activeLoanModal.requestedAmount)}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Interest Rate</span>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>{activeLoanModal.interestRate}% p.a.</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Outstanding</span>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-danger-text)' }} className="num">
                    {formatCurrency(activeLoanModal.totalOutstanding)}
                  </div>
                </div>
              </div>

              {/* Purpose & Application Meta */}
              <div style={{ fontSize: '0.8125rem' }}>
                <div style={{ marginBottom: '6px' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Loan Purpose: </span>
                  <strong>{activeLoanModal.purpose}</strong>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Tenure: </span>
                  <strong>{activeLoanModal.tenureMonths} Months</strong>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Eligible Ceiling against PF: </span>
                  <strong>{formatCurrency(activeLoanModal.eligibleAmount)}</strong>
                </div>
                {activeLoanModal.committeeNotes && (
                  <div style={{ background: '#EFF6FF', padding: '10px', borderRadius: '6px', border: '1px solid #BFDBFE', marginTop: '10px' }}>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase', display: 'block' }}>Trust Committee Decision / Recommendation:</span>
                    <span style={{ color: '#1E3A8A' }}>{activeLoanModal.committeeNotes}</span>
                  </div>
                )}
                {activeLoanModal.adminNotes && (
                  <div style={{ background: '#ECFDF5', padding: '10px', borderRadius: '6px', border: '1px solid #A7F3D0', marginTop: '8px' }}>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#065F46', textTransform: 'uppercase', display: 'block' }}>Admin Approval Notes:</span>
                    <span style={{ color: '#065F46' }}>{activeLoanModal.adminNotes}</span>
                  </div>
                )}
                {activeLoanModal.rejectionReason && (
                  <div style={{ background: '#FEF2F2', padding: '10px', borderRadius: '6px', border: '1px solid #FECACA', marginTop: '8px' }}>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#991B1B', textTransform: 'uppercase', display: 'block' }}>Rejection Reason:</span>
                    <span style={{ color: '#991B1B' }}>{activeLoanModal.rejectionReason}</span>
                  </div>
                )}
              </div>

              {/* 5-Stage Approval Timeline */}
              <div>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-navy-900)', marginBottom: '12px' }}>
                  Approval Workflow Lifecycle
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '8px' }}>
                  {activeLoanModal.approvalTimeline.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background:
                            step.status === 'completed'
                              ? 'var(--color-success-icon)'
                              : step.status === 'current'
                              ? 'var(--color-warning-icon)'
                              : '#E2E8F0',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.625rem',
                          fontWeight: 700,
                          flexShrink: 0,
                          marginTop: '2px',
                        }}
                      >
                        {step.status === 'completed' ? '✓' : idx + 1}
                      </div>
                      <div style={{ flex: 1, borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8125rem', fontWeight: step.status === 'current' ? 700 : 600, color: 'var(--color-navy-900)' }}>
                            {step.stage}
                          </span>
                          {step.date && <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>{step.date}</span>}
                        </div>
                        {step.actor && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                            Actor: {step.actor}
                          </div>
                        )}
                        {step.remarks && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                            {step.remarks}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Repayments History */}
              <div>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-navy-900)', marginBottom: '8px' }}>
                  Recorded Repayment Ledger ({activeLoanModal.repayments?.length || 0})
                </h4>
                {(!activeLoanModal.repayments || activeLoanModal.repayments.length === 0) ? (
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', padding: '12px', background: '#F8FAFC', borderRadius: '4px', textAlign: 'center' }}>
                    No repayments recorded yet for this active claim.
                  </div>
                ) : (
                  <table className="enterprise-table" style={{ fontSize: '0.75rem' }}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Receipt No</th>
                        <th className="align-right">Principal</th>
                        <th className="align-right">Interest</th>
                        <th className="align-right">Total Recovered</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeLoanModal.repayments.map((rep) => (
                        <tr key={rep.id}>
                          <td>{rep.date}</td>
                          <td style={{ fontFamily: 'var(--font-mono)' }}>{rep.receiptNo}</td>
                          <td className="align-right num">{formatCurrency(rep.principal)}</td>
                          <td className="align-right num">{formatCurrency(rep.interest)}</td>
                          <td className="align-right num" style={{ fontWeight: 700 }}>
                            {formatCurrency(rep.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="modal-footer" style={{ background: '#F8FAFC', padding: '12px 16px' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveLoanModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN APPROVAL CONFIRMATION DIALOG */}
      {approvingLoan && (
        <div className="modal-backdrop" onClick={() => setApprovingLoan(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <div className="modal-title">Confirm Admin Loan Sanction</div>
              <button className="btn-close" onClick={() => setApprovingLoan(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid var(--color-border-subtle)', fontSize: '0.8125rem' }}>
                <div><strong>Loan ID:</strong> {approvingLoan.id}</div>
                <div><strong>Member:</strong> {approvingLoan.memberName} ({approvingLoan.memberId})</div>
                <div><strong>Requested Amount:</strong> {formatCurrency(approvingLoan.requestedAmount)}</div>
                <div><strong>Committee Decision:</strong> {approvingLoan.committeeDecision || 'Recommended for approval'}</div>
              </div>

              <div className="form-group">
                <label className="form-label">Admin Sanction Order Notes</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={adminApprovalNotes}
                  onChange={(e) => setAdminApprovalNotes(e.target.value)}
                />
              </div>

              <div style={{ fontSize: '0.75rem', color: '#991B1B', background: '#FEF2F2', padding: '10px', borderRadius: '6px', border: '1px solid #FECACA' }}>
                <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                <strong>System of Record Boundary:</strong> This action updates the member ledger liability and records official approval. Physical fund disbursement occurs via the bank's existing manual process.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setApprovingLoan(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  approveLoan(approvingLoan.id, adminApprovalNotes);
                  setApprovingLoan(null);
                }}
              >
                <Check size={15} />
                <span>Confirm & Post Approval</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION REASON DIALOG */}
      {rejectingLoan && (
        <div className="modal-backdrop" onClick={() => setRejectingLoan(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <div className="modal-title">Reject Loan Claim</div>
              <button className="btn-close" onClick={() => setRejectingLoan(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                Enter the formal reason for rejecting loan claim <strong>{rejectingLoan.id}</strong> for {rejectingLoan.memberName}.
              </p>
              <div className="form-group">
                <label className="form-label">Mandatory Rejection Reason *</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setRejectingLoan(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (rejectionReason.trim()) {
                    rejectLoan(rejectingLoan.id, rejectionReason);
                    setRejectingLoan(null);
                  }
                }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRUST COMMITTEE RECOMMENDATION DIALOG */}
      {committeeReviewLoan && (
        <div className="modal-backdrop" onClick={() => setCommitteeReviewLoan(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div className="modal-title">Record Trust Committee Recommendation</div>
              <button className="btn-close" onClick={() => setCommitteeReviewLoan(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                Recording recommendation for claim <strong>{committeeReviewLoan.id}</strong> ({committeeReviewLoan.memberName}, {formatCurrency(committeeReviewLoan.requestedAmount)}).
              </div>
              <div className="form-group">
                <label className="form-label">Committee Findings & Remarks *</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={committeeNotes}
                  onChange={(e) => setCommitteeNotes(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setCommitteeReviewLoan(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  committeeRecommendLoan(committeeReviewLoan.id, committeeNotes);
                  setCommitteeReviewLoan(null);
                }}
              >
                Save Committee Decision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW LOAN CLAIM MODAL */}
      {isApplyModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsApplyModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Submit Member Loan Claim</div>
              <button className="btn-close" onClick={() => setIsApplyModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleApplySubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Select Trust Member *</label>
                  <select
                    className="form-select"
                    value={applyMemberId}
                    onChange={(e) => setApplyMemberId(e.target.value)}
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.id} — {m.fullName} (PF Bal: {formatCurrency(m.currentBalance)})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--color-border-subtle)', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Eligible Loan Ceiling (75% of PF balance):</span>
                  <strong className="num" style={{ color: 'var(--color-burgundy-700)' }}>{formatCurrency(maxEligibleAmount)}</strong>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Requested Loan Principal (₹) *</label>
                    <input
                      type="number"
                      className="form-input"
                      required
                      max={maxEligibleAmount}
                      value={requestedAmt}
                      onChange={(e) => setRequestedAmt(Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Repayment Tenure</label>
                    <select
                      className="form-select"
                      value={tenure}
                      onChange={(e) => setTenure(Number(e.target.value))}
                    >
                      <option value={12}>12 Months</option>
                      <option value={24}>24 Months</option>
                      <option value={36}>36 Months (Maximum)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Loan Purpose / Reason *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="e.g. Higher education, house repair, medical emergency"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsApplyModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Claim to Committee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
