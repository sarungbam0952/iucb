import React, { useState } from 'react';
import {
  CreditCard,
  Clock,
  CheckCircle2,
  Plus,
  Search,
  Eye,
  Building2,
  X,
  AlertCircle,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { KpiCard } from '../../components/common/KpiCard';
import { ActionMenu } from '../../components/common/ActionMenu';
import { LoanRecord } from '../../types';
import { formatDate } from '../../utils/dateFormat';

export const LoanManagement: React.FC = () => {
  const {
    loans,
    members,
    formatCurrency,
    settings,
    submitLoan,
    currentRole,
    setSelectedLoanId,
    setSelectedMemberId,
    setActivePage,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active' | 'completed' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Configured System Interest Rate
  const systemInterestRate = settings?.loanInterestRate ?? 6.5;

  // Standard Reducing Balance EMI calculation: E = [P * r * (1+r)^n] / [(1+r)^n - 1]
  const calculateEMI = (principal: number, annualRate: number, tenureMonths: number): number => {
    if (!principal || !tenureMonths || tenureMonths <= 0 || principal <= 0) return 0;
    if (!annualRate || annualRate <= 0) return principal / tenureMonths;
    const monthlyRate = annualRate / (12 * 100);
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    if (!Number.isFinite(factor) || factor <= 1) return principal / tenureMonths;
    const emi = (principal * monthlyRate * factor) / (factor - 1);
    return Number.isFinite(emi) ? emi : 0;
  };

  // New Loan Claim Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyMemberId, setApplyMemberId] = useState(members[0]?.id || '');
  const [requestedAmt, setRequestedAmt] = useState<number | ''>(75000);
  const [tenure, setTenure] = useState<number | ''>(24);
  const [monthlyEmi, setMonthlyEmi] = useState<string>('');
  const [purpose, setPurpose] = useState('Medical treatment / health expense');
  const [formError, setFormError] = useState<string | null>(null);

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

  const numRequestedAmt = typeof requestedAmt === 'number' ? requestedAmt : Number(requestedAmt) || 0;
  const numTenure = typeof tenure === 'number' ? tenure : Number(tenure) || 0;
  const currentCalculatedEmi = calculateEMI(numRequestedAmt, systemInterestRate, numTenure);

  const handleOpenApplyModal = () => {
    const initialMem = members[0];
    const initialMemId = initialMem?.id || '';
    setApplyMemberId(initialMemId);
    const ceiling = initialMem ? Math.round(initialMem.currentBalance * 0.75) : 100000;
    const initialPrincipal = Math.min(75000, ceiling > 0 ? ceiling : 75000);
    setRequestedAmt(initialPrincipal);
    setTenure(24);
    setPurpose('Medical treatment / health expense');
    setFormError(null);

    const initialCalc = calculateEMI(initialPrincipal, systemInterestRate, 24);
    setMonthlyEmi(initialCalc > 0 ? initialCalc.toFixed(2) : '');
    setIsApplyModalOpen(true);
  };

  const handleMemberChange = (memberId: string) => {
    setApplyMemberId(memberId);
    setFormError(null);
    const mem = members.find((m) => m.id === memberId);
    if (mem) {
      const ceiling = Math.round(mem.currentBalance * 0.75);
      const currentAmt = typeof requestedAmt === 'number' ? requestedAmt : Number(requestedAmt);
      if (currentAmt > ceiling && ceiling > 0) {
        setRequestedAmt(ceiling);
        const currentTenure = typeof tenure === 'number' ? tenure : Number(tenure);
        if (currentTenure > 0) {
          const calc = calculateEMI(ceiling, systemInterestRate, currentTenure);
          setMonthlyEmi(calc > 0 ? calc.toFixed(2) : '');
        }
      }
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null);
    const valStr = e.target.value;
    if (valStr === '') {
      setRequestedAmt('');
      setMonthlyEmi('');
      return;
    }
    const val = Number(valStr);
    setRequestedAmt(val);
    const currentTenure = typeof tenure === 'number' ? tenure : Number(tenure);
    if (val > 0 && currentTenure > 0) {
      const calc = calculateEMI(val, systemInterestRate, currentTenure);
      setMonthlyEmi(calc > 0 ? calc.toFixed(2) : '');
    } else {
      setMonthlyEmi('');
    }
  };

  const handleTenureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null);
    const valStr = e.target.value;
    if (valStr === '') {
      setTenure('');
      setMonthlyEmi('');
      return;
    }
    const val = parseInt(valStr, 10);
    if (isNaN(val)) return;
    setTenure(val);
    const currentAmt = typeof requestedAmt === 'number' ? requestedAmt : Number(requestedAmt);
    if (currentAmt > 0 && val > 0) {
      const calc = calculateEMI(currentAmt, systemInterestRate, val);
      setMonthlyEmi(calc > 0 ? calc.toFixed(2) : '');
    } else {
      setMonthlyEmi('');
    }
  };

  const handleEmiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null);
    setMonthlyEmi(e.target.value);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberForApply) {
      setFormError('Please select a valid trust member.');
      return;
    }

    const p = typeof requestedAmt === 'number' ? requestedAmt : Number(requestedAmt);
    const t = typeof tenure === 'number' ? tenure : Number(tenure);
    const emi = Number(monthlyEmi);

    if (!p || isNaN(p) || p <= 0) {
      setFormError('Loan Amount / Principal must be greater than zero.');
      return;
    }

    if (p > maxEligibleAmount) {
      setFormError(`Loan amount exceeds the eligible loan ceiling of ₹${maxEligibleAmount.toLocaleString('en-IN')}.`);
      return;
    }

    if (!t || isNaN(t) || t <= 0 || !Number.isInteger(t)) {
      setFormError('Repayment Tenure must be a valid positive whole number of months.');
      return;
    }

    if (!emi || isNaN(emi) || emi <= 0) {
      setFormError('Monthly EMI must be a valid amount greater than zero.');
      return;
    }

    if (!purpose.trim()) {
      setFormError('Please enter a loan purpose or reason.');
      return;
    }

    submitLoan({
      memberId: selectedMemberForApply.id,
      memberName: selectedMemberForApply.fullName,
      department: selectedMemberForApply.department,
      requestedAmount: p,
      eligibleAmount: maxEligibleAmount,
      interestRate: systemInterestRate,
      tenureMonths: t,
      monthlyEmi: emi,
      applicationDate: new Date().toISOString().split('T')[0],
      purpose: purpose.trim(),
    });

    setIsApplyModalOpen(false);
  };

  const handleOpenLoanDetails = (loanId: string) => {
    setSelectedLoanId(loanId);
    setActivePage('loan-details');
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

        {currentRole !== 'Trust Committee' && (
          <button
            className="btn btn-primary btn-sm"
            onClick={handleOpenApplyModal}
          >
            <Plus size={14} />
            <span>New Loan Claim</span>
          </button>
        )}
      </div>

      {/* 4 SUMMARY METRICS */}
      <div className="kpi-grid">
        <KpiCard
          label="Pending Claims"
          value={pendingClaims.length}
          icon={Clock}
          onClick={() => setActiveTab('pending')}
          desc="Requires committee decision / admin action"
        />

        <KpiCard
          label="Active Loans"
          value={activeLoans.length}
          icon={CreditCard}
          onClick={() => setActiveTab('active')}
          desc="Monthly repayments recovered through payroll"
        />

        <KpiCard
          label="Total Outstanding Principal"
          value={formatCurrency(totalOutstanding)}
          icon={Building2}
          desc="Interest rate: 6.5% per annum"
        />

        <KpiCard
          label="Completed Loans"
          value={completedLoans.length}
          icon={CheckCircle2}
          onClick={() => setActiveTab('completed')}
          desc="Fully repaid with interest"
        />
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
                        onClick={() => handleOpenLoanDetails(loan.id)}
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
                    <td>{formatDate(loan.applicationDate)}</td>
                    <td>{loan.tenureMonths} mos</td>
                    <td>
                      <StatusBadge status={loan.status} size="sm" />
                    </td>
                    <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-navy-900)' }}>
                      {loan.outstandingPrincipal > 0 ? formatCurrency(loan.totalOutstanding) : '₹0'}
                    </td>
                    <td className="align-right">
                      <ActionMenu
                        primaryAction={{
                          label: 'Details',
                          icon: Eye,
                          onClick: () => handleOpenLoanDetails(loan.id),
                          title: 'View Complete Loan Details',
                        }}
                        secondaryActions={[
                          {
                            label: 'Member Profile',
                            icon: UserCheck,
                            onClick: () => {
                              setSelectedMemberId(loan.memberId);
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
        </div>
      </div>

      {/* NEW LOAN CLAIM MODAL */}
      {isApplyModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsApplyModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <div className="modal-title">New Loan Claim</div>
              <button className="btn-close" onClick={() => setIsApplyModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleApplySubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {formError && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      background: '#FEF2F2',
                      border: '1px solid #FCA5A5',
                      borderRadius: '6px',
                      color: '#991B1B',
                      fontSize: '0.8125rem',
                    }}
                  >
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Select Trust Member *</label>
                  <select
                    className="form-select"
                    value={applyMemberId}
                    onChange={(e) => handleMemberChange(e.target.value)}
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.id} — {m.fullName} (PF Bal: {formatCurrency(m.currentBalance)})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--color-border-subtle)', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Eligible Loan Ceiling (75% of PF balance):</span>
                  <strong className="num" style={{ color: 'var(--color-burgundy-700)', fontSize: '0.875rem' }}>{formatCurrency(maxEligibleAmount)}</strong>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Loan Amount / Principal (₹) *</label>
                    <input
                      type="number"
                      className="form-input"
                      required
                      min="1"
                      max={maxEligibleAmount}
                      value={requestedAmt}
                      onChange={handleAmountChange}
                      placeholder="e.g. 75000"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Repayment Tenure (Months) *</label>
                    <input
                      type="number"
                      className="form-input"
                      required
                      min="1"
                      step="1"
                      value={tenure}
                      onChange={handleTenureChange}
                      placeholder="24"
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Rate of Interest</span>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                        System Controlled
                      </span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      readOnly
                      disabled
                      value={`${systemInterestRate}% p.a.`}
                      style={{
                        backgroundColor: '#F8FAFC',
                        color: 'var(--color-navy-900)',
                        fontWeight: 600,
                        cursor: 'not-allowed',
                        borderColor: 'var(--color-border-subtle)',
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Monthly EMI (₹) *</span>
                      {monthlyEmi && currentCalculatedEmi > 0 && Number(monthlyEmi) !== Number(currentCalculatedEmi.toFixed(2)) && (
                        <span style={{ fontSize: '0.6875rem', color: 'var(--color-burgundy-700)', fontWeight: 600 }}>
                          Rounded / Custom
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="1"
                      className="form-input"
                      required
                      value={monthlyEmi}
                      onChange={handleEmiChange}
                      placeholder="e.g. 3285"
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3px' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                        {currentCalculatedEmi > 0 ? `Calculated: ₹${currentCalculatedEmi.toFixed(2)}` : 'Calculated automatically'}
                      </span>
                      {monthlyEmi && currentCalculatedEmi > 0 && Number(monthlyEmi) !== Number(currentCalculatedEmi.toFixed(2)) && (
                        <button
                          type="button"
                          onClick={() => {
                            setMonthlyEmi(currentCalculatedEmi.toFixed(2));
                            setFormError(null);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-burgundy-600)',
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                            padding: 0,
                            textDecoration: 'underline',
                          }}
                        >
                          Reset to ₹{currentCalculatedEmi.toFixed(2)}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Loan Purpose / Reason *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={purpose}
                    onChange={(e) => {
                      setPurpose(e.target.value);
                      setFormError(null);
                    }}
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
