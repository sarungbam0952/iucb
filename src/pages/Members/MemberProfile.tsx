import React, { useState } from 'react';
import {
  User,
  Building2,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Award,
  Plus,
  Trash2,
  Edit2,
  ArrowLeft,
  FileText,
  AlertTriangle,
  X,
  Check,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/dateFormat';
import { StatusBadge } from '../../components/common/StatusBadge';
import { KpiCard } from '../../components/common/KpiCard';
import { Nominee, LoanRecord } from '../../types';

export const MemberProfile: React.FC = () => {
  const {
    members,
    selectedMemberId,
    setActivePage,
    formatCurrency,
    ledgerEntries,
    loans,
    updateMember,
    addNominee,
    removeNominee,
    currentRole,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'ledger' | 'loans' | 'nominees'>('overview');

  // Nominee modal state
  const [isNomineeModalOpen, setIsNomineeModalOpen] = useState(false);
  const [newNominee, setNewNominee] = useState({
    name: '',
    relationship: 'Spouse',
    contactNumber: '+91 ',
    sharePercentage: 100,
    address: 'Imphal, Manipur',
  });

  // Member editing state
  const [isEditing, setIsEditing] = useState(false);

  const member = members.find((m) => m.id === selectedMemberId) || members[0];

  const [editForm, setEditForm] = useState({
    fullName: member.fullName,
    dob: member.dob,
    gender: member.gender,
    department: member.department,
    designation: member.designation,
    dateOfJoining: member.dateOfJoining,
    employmentStatus: member.employmentStatus,
    salary: member.salary,
    contactNumber: member.contactNumber,
    email: member.email,
    contributionPercentage: member.contributionPercentage,
    pfStartDate: member.pfStartDate,
    accountStatus: member.accountStatus,
  });

  // Specific member data
  const memberLedger = ledgerEntries.filter((l) => l.memberId === member.id);
  const memberLoans = loans.filter((l) => l.memberId === member.id);

  // Selected loan for Loan Account Statement
  const [selectedLoanIdState, setSelectedLoanIdState] = useState<string | null>(null);
  const activeLoan = memberLoans.find((l) => l.id === (selectedLoanIdState || memberLoans[0]?.id)) || memberLoans[0];

  // Loan date range filter
  const [loanDateFilter, setLoanDateFilter] = useState<'all' | '3months' | '6months' | 'custom'>('all');
  const [customFromDate, setCustomFromDate] = useState('');
  const [customToDate, setCustomToDate] = useState('');

  // Start editing handler
  const handleStartEdit = () => {
    setEditForm({
      fullName: member.fullName,
      dob: member.dob,
      gender: member.gender,
      department: member.department,
      designation: member.designation,
      dateOfJoining: member.dateOfJoining,
      employmentStatus: member.employmentStatus,
      salary: member.salary,
      contactNumber: member.contactNumber,
      email: member.email,
      contributionPercentage: member.contributionPercentage,
      pfStartDate: member.pfStartDate,
      accountStatus: member.accountStatus,
    });
    setIsEditing(true);
  };

  // Cancel edit handler
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Save edit handler
  const handleSaveEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateMember(member.id, {
      fullName: editForm.fullName,
      dob: editForm.dob,
      gender: editForm.gender as 'Male' | 'Female' | 'Other',
      department: editForm.department as any,
      designation: editForm.designation,
      dateOfJoining: editForm.dateOfJoining,
      employmentStatus: editForm.employmentStatus as any,
      salary: Number(editForm.salary),
      contactNumber: editForm.contactNumber,
      email: editForm.email,
      contributionPercentage: Number(editForm.contributionPercentage),
      pfStartDate: editForm.pfStartDate,
      accountStatus: editForm.accountStatus as any,
    });
    setIsEditing(false);
  };

  const handleAddNomineeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNominee.name.trim()) return;

    addNominee(member.id, {
      name: newNominee.name,
      relationship: newNominee.relationship,
      contactNumber: newNominee.contactNumber,
      sharePercentage: Number(newNominee.sharePercentage),
      address: newNominee.address,
      status: 'Active',
    });

    setIsNomineeModalOpen(false);
    setNewNominee({
      name: '',
      relationship: 'Spouse',
      contactNumber: '+91 ',
      sharePercentage: 100,
      address: 'Imphal, Manipur',
    });
  };

  // Build loan transactions and summary calculations
  const getLoanRepayments = (l: LoanRecord) => {
    if (l.repayments && l.repayments.length > 0) {
      return l.repayments;
    }
    // Default fallback repayments if older unmigrated state is in localStorage
    return [
      { id: `REP-${l.id}-01`, date: '2026-04-15', principal: 3500, interest: 460, total: 3960, receiptNo: 'RCP-2026-112', recordedBy: 'Kh. Tombi' },
      { id: `REP-${l.id}-02`, date: '2026-05-15', principal: 3500, interest: 441, total: 3941, receiptNo: 'RCP-2026-198', recordedBy: 'Kh. Tombi' },
      { id: `REP-${l.id}-03`, date: '2026-06-15', principal: 3500, interest: 422, total: 3922, receiptNo: 'RCP-2026-310', recordedBy: 'Kh. Tombi' },
      { id: `REP-${l.id}-04`, date: '2026-07-15', principal: 3500, interest: 403, total: 3903, receiptNo: 'RCP-2026-445', recordedBy: 'Kh. Tombi' },
      { id: `REP-${l.id}-05`, date: '2026-08-15', principal: 3500, interest: 384, total: 3884, receiptNo: 'RCP-2026-580', recordedBy: 'Kh. Tombi' },
      { id: `REP-${l.id}-06`, date: '2026-09-15', principal: 3500, interest: 365, total: 3865, receiptNo: 'RCP-2026-702', recordedBy: 'Kh. Tombi' },
    ];
  };

  // Loan Account Statement calculations
  const loanPrincipal = activeLoan ? (activeLoan.approvedAmount || activeLoan.requestedAmount) : 0;
  const loanRepayments = activeLoan ? getLoanRepayments(activeLoan) : [];

  // Build full loan transaction history rows with running balances
  const loanTransactions: Array<{
    date: string;
    description: string;
    principal: number;
    interest: number;
    total: number;
    outstanding: number;
  }> = [];

  if (activeLoan) {
    let runningBalance = loanPrincipal;
    // Initial disbursement transaction
    loanTransactions.push({
      date: activeLoan.applicationDate,
      description: 'Loan Disbursement (Sanction Order)',
      principal: loanPrincipal,
      interest: 0,
      total: loanPrincipal,
      outstanding: runningBalance,
    });

    // Repayments
    loanRepayments.forEach((rep) => {
      runningBalance = Math.max(0, runningBalance - rep.principal);
      loanTransactions.push({
        date: rep.date,
        description: `Monthly EMI Repayment (${rep.receiptNo})`,
        principal: rep.principal,
        interest: rep.interest,
        total: rep.total,
        outstanding: runningBalance,
      });
    });

    // Sort newest first
    loanTransactions.sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  // Filter loan transactions by date range
  const filteredLoanTransactions = loanTransactions.filter((txn) => {
    if (loanDateFilter === 'all') return true;

    // Use current application date context (September 2026)
    const refDate = new Date();

    if (loanDateFilter === '3months') {
      const d3 = new Date(refDate);
      d3.setMonth(d3.getMonth() - 3);
      const d3Str = d3.toISOString().split('T')[0];
      return txn.date >= d3Str;
    }

    if (loanDateFilter === '6months') {
      const d6 = new Date(refDate);
      d6.setMonth(d6.getMonth() - 6);
      const d6Str = d6.toISOString().split('T')[0];
      return txn.date >= d6Str;
    }

    if (loanDateFilter === 'custom') {
      if (customFromDate && txn.date < customFromDate) return false;
      if (customToDate && txn.date > customToDate) return false;
      return true;
    }

    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Back & Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage('members-all')}
          >
            <ArrowLeft size={14} />
            <span>Back to Members</span>
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
                {member.fullName}
              </h2>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-navy-900)', background: 'var(--color-bg-app)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--color-border-subtle)', fontSize: '0.8125rem' }}>
                {member.id}
              </span>
              <StatusBadge status={member.accountStatus} size="sm" />
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              {member.designation} • {member.department} • Joined Bank on {formatDate(member.dateOfJoining)}
            </div>
          </div>
        </div>

        {/* Top-right area */}
        <div />
      </div>

      {/* 4 SUMMARY METRIC CARDS */}
      <div className="kpi-grid">
        <KpiCard
          label="Current PF Balance"
          value={formatCurrency(member.currentBalance)}
          icon={PiggyBank}
          desc="Available net accumulated corpus"
        />

        <KpiCard
          label="Total Contribution"
          value={formatCurrency(member.totalContribution)}
          icon={Building2}
          desc={`Deducted from monthly payroll (${member.contributionPercentage}%)`}
        />

        <KpiCard
          label="Total Interest Credited"
          value={formatCurrency(member.totalInterest)}
          icon={TrendingUp}
          desc="Compound returns distributed"
        />

        <KpiCard
          label="Outstanding Loan"
          value={formatCurrency(member.outstandingLoan)}
          icon={CreditCard}
          desc={member.hasLoan ? 'Active loan liability recorded' : 'No active loan against PF'}
        />
      </div>

      {/* NAVIGATION TABS */}
      <div className="card">
        <div className="tab-nav" style={{ padding: '0 16px', margin: 0 }}>
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <User size={15} />
            <span>Overview</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'ledger' ? 'active' : ''}`}
            onClick={() => setActiveTab('ledger')}
          >
            <FileText size={15} />
            <span>Account Ledger / Passbook</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'loans' ? 'active' : ''}`}
            onClick={() => setActiveTab('loans')}
          >
            <CreditCard size={15} />
            <span>Loans ({memberLoans.length})</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'nominees' ? 'active' : ''}`}
            onClick={() => setActiveTab('nominees')}
          >
            <ShieldCheck size={15} />
            <span>Nominees ({member.nominees?.length || 0})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Overview Header with Edit Details Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy-900)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Member Employment & Trust Record
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  Official member profile and Provident Fund standing.
                </p>
              </div>
              <div>
                {currentRole !== 'Trust Committee' && (
                  !isEditing ? (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={handleStartEdit}
                    >
                      <Edit2 size={13} />
                      <span>Edit Details</span>
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={handleCancelEdit}
                      >
                        <X size={13} />
                        <span>Cancel</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleSaveEdit}
                      >
                        <Check size={13} />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
              {/* Personal & Employment Details */}
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy-900)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Bank Employment & Personal Profile
                </h4>
                {isEditing ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8125rem' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Member Full Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editForm.fullName}
                        onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Date of Birth *</label>
                      <input
                        type="date"
                        className="form-input"
                        value={editForm.dob}
                        onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Gender *</label>
                      <select
                        className="form-select"
                        value={editForm.gender}
                        onChange={(e) => setEditForm({ ...editForm, gender: e.target.value as any })}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Department *</label>
                      <select
                        className="form-select"
                        value={editForm.department}
                        onChange={(e) => setEditForm({ ...editForm, department: e.target.value as any })}
                      >
                        <option value="Accounts & Finance">Accounts & Finance</option>
                        <option value="Loans & Advances">Loans & Advances</option>
                        <option value="Audit & Inspection">Audit & Inspection</option>
                        <option value="Cash & Operations">Cash & Operations</option>
                        <option value="IT & Systems">IT & Systems</option>
                        <option value="General Administration">General Administration</option>
                        <option value="Executive Office">Executive Office</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Designation *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editForm.designation}
                        onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Date of Joining Bank *</label>
                      <input
                        type="date"
                        className="form-input"
                        value={editForm.dateOfJoining}
                        onChange={(e) => setEditForm({ ...editForm, dateOfJoining: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Employment Status *</label>
                      <select
                        className="form-select"
                        value={editForm.employmentStatus}
                        onChange={(e) => setEditForm({ ...editForm, employmentStatus: e.target.value as any })}
                      >
                        <option value="Permanent">Permanent</option>
                        <option value="Probation">Probation</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Basic Monthly Salary (₹) *</label>
                      <input
                        type="number"
                        min={0}
                        step={1000}
                        className="form-input"
                        value={editForm.salary}
                        onChange={(e) => setEditForm({ ...editForm, salary: Number(e.target.value) })}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Contact Phone *</label>
                      <input
                        type="tel"
                        className="form-input"
                        value={editForm.contactNumber}
                        onChange={(e) => setEditForm({ ...editForm, contactNumber: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Bank Email *</label>
                      <input
                        type="email"
                        className="form-input"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8125rem' }}>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Date of Birth</span>
                      <strong>{formatDate(member.dob)}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Gender</span>
                      <strong>{member.gender}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Department</span>
                      <strong>{member.department}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Designation</span>
                      <strong>{member.designation}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Date of Joining Bank</span>
                      <strong>{formatDate(member.dateOfJoining)}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Employment Status</span>
                      <strong>{member.employmentStatus}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Basic Monthly Salary</span>
                      <strong className="num">{formatCurrency(member.salary)}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Contact Phone</span>
                      <strong>{member.contactNumber}</strong>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Bank Email</span>
                      <strong>{member.email}</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Trust Membership Details */}
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy-900)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Trust Membership & Standing
                </h4>
                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8125rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '6px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>PF Membership No.</span>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: '140px', padding: '4px 8px', background: '#F1F5F9', cursor: 'not-allowed', fontFamily: 'var(--font-mono)', fontWeight: 700 }}
                        value={member.id}
                        disabled
                        title="PF Membership ID is a fixed unique system identifier"
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '6px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Contribution Percentage</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="number"
                          className="form-input"
                          style={{ width: '70px', padding: '4px 8px' }}
                          min={1}
                          max={30}
                          value={editForm.contributionPercentage}
                          onChange={(e) => setEditForm({ ...editForm, contributionPercentage: Number(e.target.value) })}
                          required
                        />
                        <span>% of Basic</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '6px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Monthly Deduction Amount</span>
                      <div>
                        <strong className="num">{formatCurrency(Math.round(Number(editForm.salary) * (Number(editForm.contributionPercentage) / 100)))}</strong>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginLeft: '6px' }}>(Auto-calculated)</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '6px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>PF Start Date</span>
                      <input
                        type="date"
                        className="form-input"
                        style={{ width: '150px', padding: '4px 8px' }}
                        value={editForm.pfStartDate}
                        onChange={(e) => setEditForm({ ...editForm, pfStartDate: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '6px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Account Status</span>
                      <select
                        className="form-select"
                        style={{ width: '130px', padding: '4px 8px' }}
                        value={editForm.accountStatus}
                        onChange={(e) => setEditForm({ ...editForm, accountStatus: e.target.value as any })}
                      >
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Settled">Settled</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>18-Year Service Milestone</span>
                      <strong>
                        {2026 - parseInt((editForm.dateOfJoining || '2026').substring(0, 4), 10) >= 18 ? (
                          <span style={{ color: 'var(--color-navy-900)', fontWeight: 600 }}>Eligible for Interest-Free Advance</span>
                        ) : (
                          <span>Approaching in {parseInt((editForm.dateOfJoining || '2026').substring(0, 4), 10) + 18}</span>
                        )}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Current Loan Borrowing Limit</span>
                      <strong className="num" style={{ color: 'var(--color-navy-900)' }}>
                        {formatCurrency(Math.round(member.currentBalance * 0.75))} (75% of PF)
                      </strong>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8125rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>PF Membership No.</span>
                      <strong style={{ fontFamily: 'var(--font-mono)' }}>{member.id}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Contribution Percentage</span>
                      <strong>{member.contributionPercentage}% of Basic Salary</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Monthly Deduction Amount</span>
                      <strong className="num">{formatCurrency(Math.round(member.salary * (member.contributionPercentage / 100)))}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>PF Start Date</span>
                      <strong>{formatDate(member.pfStartDate)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>18-Year Service Milestone</span>
                      <strong>
                        {2026 - parseInt(member.dateOfJoining.substring(0, 4), 10) >= 18 ? (
                          <span style={{ color: 'var(--color-navy-900)', fontWeight: 600 }}>Eligible for Interest-Free Advance</span>
                        ) : (
                          <span>Approaching in {parseInt(member.dateOfJoining.substring(0, 4), 10) + 18}</span>
                        )}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Current Loan Borrowing Limit</span>
                      <strong className="num" style={{ color: 'var(--color-navy-900)' }}>
                        {formatCurrency(Math.round(member.currentBalance * 0.75))} (75% of PF)
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Active Nominee Summary Banner */}
            <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '6px', border: '1px solid var(--color-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} color="var(--color-burgundy-700)" />
                <div>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                    Primary Nominee on Record:{' '}
                    {member.nominees && member.nominees.length > 0 ? member.nominees[0].name : 'Not Recorded'}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Relationship: {member.nominees?.[0]?.relationship || 'N/A'} • Share: {member.nominees?.[0]?.sharePercentage || 0}% • Last certified: {member.nominees?.[0]?.lastUpdated || 'N/A'}
                  </div>
                </div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveTab('nominees')}
              >
                Manage Nominees
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: ACCOUNT LEDGER / PASSBOOK */}
        {activeTab === 'ledger' && (
          <div className="card-body" style={{ padding: 0 }}>
            {/* Ledger header - 'Open Full Ledger View' removed as requested */}
            <div style={{ padding: '12px 16px', background: '#F8FAFC', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                  Digital PF Passbook Ledger
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: '8px' }}>
                  Member: {member.fullName} ({member.id})
                </span>
              </div>
            </div>

            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Txn ID</th>
                  <th>Transaction Type</th>
                  <th>Description</th>
                  <th className="align-right">Credit (₹)</th>
                  <th className="align-right">Debit (₹)</th>
                  <th className="align-right">Balance (₹)</th>
                </tr>
              </thead>
              <tbody>
                {memberLedger.map((txn) => (
                  <tr key={txn.id}>
                    <td>{formatDate(txn.date)}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{txn.id}</td>
                    <td>
                      <span className="badge badge-neutral">{txn.transactionType}</span>
                    </td>
                    <td>{txn.description}</td>
                    <td className="align-right num td-credit">
                      {txn.credit > 0 ? `+${formatCurrency(txn.credit)}` : '—'}
                    </td>
                    <td className="align-right num td-debit">
                      {txn.debit > 0 ? `-${formatCurrency(txn.debit)}` : '—'}
                    </td>
                    <td className="align-right num" style={{ fontWeight: 700 }}>
                      {formatCurrency(txn.balance || member.currentBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: LOANS (FUNCTIONAL LOAN ACCOUNT STATEMENT) */}
        {activeTab === 'loans' && (
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {memberLoans.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--color-text-muted)' }}>
                <CreditCard size={36} style={{ color: 'var(--color-border-subtle)', marginBottom: '10px' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-navy-900)', marginBottom: '4px' }}>
                  No Loan Accounts on Record
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', maxWidth: '420px', margin: '0 auto' }}>
                  This member currently has no active or recorded loan claims against their Provident Fund balance.
                  Member is eligible to borrow up to {formatCurrency(Math.round(member.currentBalance * 0.75))} (75% of PF corpus).
                </p>
              </div>
            ) : (
              <>
                {/* Loan Selector if multiple loans exist */}
                {memberLoans.length > 1 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                      Select Loan Account:
                    </span>
                    {memberLoans.map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        className={`btn btn-sm ${activeLoan.id === l.id ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setSelectedLoanIdState(l.id)}
                      >
                        <CreditCard size={13} />
                        <span>{l.id} ({formatCurrency(l.requestedAmount)}) - {l.status}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* LOAN STATEMENT HEADER WITH INTEGRATED STATEMENT PERIOD FILTER */}
                <div style={{ background: '#FFFFFF', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                    {/* LEFT: Title, Loan ID, Status, and metadata */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-navy-900)', margin: 0 }}>
                          Loan Account Statement
                        </h3>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-navy-900)', background: '#F6F8FA', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--color-border-subtle)', fontSize: '0.75rem' }}>
                          {activeLoan.id}
                        </span>
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            color: 'var(--color-navy-900)',
                            background: '#F6F8FA',
                            border: '1px solid var(--color-border-subtle)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          {activeLoan.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '6px' }}>
                        Purpose: <strong style={{ color: 'var(--color-navy-900)' }}>{activeLoan.purpose}</strong> • Sanction Date: <strong style={{ color: 'var(--color-navy-900)' }}>{formatDate(activeLoan.applicationDate)}</strong> • Tenure: <strong style={{ color: 'var(--color-navy-900)' }}>{activeLoan.tenureMonths || 24} Months</strong>
                      </div>
                    </div>

                    {/* RIGHT: Statement Period dropdown and Custom Range if active */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
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
                          value={loanDateFilter}
                          onChange={(e) => setLoanDateFilter(e.target.value as any)}
                        >
                          <option value="all">All</option>
                          <option value="3months">3 Months</option>
                          <option value="6months">6 Months</option>
                          <option value="custom">Custom Range</option>
                        </select>
                      </div>

                      {loanDateFilter === 'custom' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>From:</label>
                            <input
                              type="date"
                              className="form-input"
                              style={{ width: '130px', height: '32px', padding: '4px 8px', fontSize: '0.75rem' }}
                              value={customFromDate}
                              onChange={(e) => setCustomFromDate(e.target.value)}
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
                              onChange={(e) => setCustomToDate(e.target.value)}
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
                              }}
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* LOAN TRANSACTION HISTORY TABLE */}
                <div className="table-container">
                  <table className="enterprise-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Transaction</th>
                        <th className="align-right">Principal</th>
                        <th className="align-right">Interest</th>
                        <th className="align-right">Total</th>
                        <th className="align-right">Outstanding</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLoanTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '28px', color: 'var(--color-text-muted)' }}>
                            No loan transactions found for the selected date range.
                          </td>
                        </tr>
                      ) : (
                        filteredLoanTransactions.map((txn, idx) => (
                          <tr key={idx}>
                            <td>{formatDate(txn.date)}</td>
                            <td style={{ fontWeight: 600 }}>{txn.description}</td>
                            <td className="align-right num">{txn.principal > 0 ? formatCurrency(txn.principal) : '—'}</td>
                            <td className="align-right num">{txn.interest > 0 ? formatCurrency(txn.interest) : '—'}</td>
                            <td className="align-right num" style={{ fontWeight: 600 }}>{formatCurrency(txn.total)}</td>
                            <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-navy-900)' }}>
                              {formatCurrency(txn.outstanding)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 4: NOMINEES */}
        {activeTab === 'nominees' && (
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
                  Registered Nominees
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  Nominees entitled to provident fund settlement in event of unforeseen demise. Total share must equal 100%.
                </p>
              </div>
              {currentRole !== 'Trust Committee' && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsNomineeModalOpen(true)}
                >
                  <Plus size={14} />
                  <span>Add Nominee</span>
                </button>
              )}
            </div>

            <div className="table-container">
              <table className="enterprise-table">
                <thead>
                  <tr>
                    <th>Nominee Name</th>
                    <th>Relationship</th>
                    <th>Contact Phone</th>
                    <th className="align-center">Share Percentage</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                    {currentRole !== 'Trust Committee' && <th className="align-right">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {(!member.nominees || member.nominees.length === 0) ? (
                    <tr>
                      <td colSpan={currentRole !== 'Trust Committee' ? 8 : 7} style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>
                        No nominees on record.{currentRole !== 'Trust Committee' ? " Click 'Add Nominee' to register." : ''}
                      </td>
                    </tr>
                  ) : (
                    member.nominees.map((nom) => (
                      <tr key={nom.id}>
                        <td style={{ fontWeight: 600 }}>{nom.name}</td>
                        <td>{nom.relationship}</td>
                        <td>{nom.contactNumber}</td>
                        <td className="align-center">
                          <span className="badge badge-neutral" style={{ fontWeight: 700, color: 'var(--color-burgundy-700)' }}>
                            {nom.sharePercentage}%
                          </span>
                        </td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{nom.address}</td>
                        <td>
                          <StatusBadge status={nom.status} size="sm" />
                        </td>
                        <td>{formatDate(nom.lastUpdated)}</td>
                        {currentRole !== 'Trust Committee' && (
                          <td className="align-right">
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to remove nominee ${nom.name}?`)) {
                                  removeNominee(member.id, nom.id);
                                }
                              }}
                              title="Remove Nominee"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ADD NOMINEE MODAL */}
      {isNomineeModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsNomineeModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add Member Nominee</div>
              <button className="btn-close" onClick={() => setIsNomineeModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddNomineeSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Nominee Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={newNominee.name}
                    onChange={(e) => setNewNominee({ ...newNominee, name: e.target.value })}
                    placeholder="e.g. Ningthoujam Priya Devi"
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Relationship *</label>
                    <select
                      className="form-select"
                      value={newNominee.relationship}
                      onChange={(e) => setNewNominee({ ...newNominee, relationship: e.target.value })}
                    >
                      <option value="Spouse">Spouse</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Share Percentage (%) *</label>
                    <input
                      type="number"
                      className="form-input"
                      required
                      min={1}
                      max={100}
                      value={newNominee.sharePercentage}
                      onChange={(e) => setNewNominee({ ...newNominee, sharePercentage: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Mobile</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newNominee.contactNumber}
                    onChange={(e) => setNewNominee({ ...newNominee, contactNumber: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Residential Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newNominee.address}
                    onChange={(e) => setNewNominee({ ...newNominee, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsNomineeModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Nominee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
