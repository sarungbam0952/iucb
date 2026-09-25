import React, { useState } from 'react';
import {
  LayoutDashboard,
  UserCheck,
  CircleDollarSign,
  BookOpen,
  CreditCard,
  Award,
  Landmark,
  Users,
  Bell,
  HelpCircle,
  Download,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  ArrowRight,
  Printer,
  ShieldCheck,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Plus,
  TrendingUp,
  Building2,
  FileCheck,
  Wallet,
  ChevronRight,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const MemberPortal: React.FC = () => {
  const {
    activePage,
    setActivePage,
    members,
    contributions,
    ledgerEntries,
    loans,
    advances,
    retirements,
    notifications,
    formatCurrency,
    submitLoan,
  } = useApp();

  // Designated demo self-service member: Ningthoujam John (IUCB-0001)
  const currentMember =
    members.find((m) => m.id === 'IUCB-0001') || {
      id: 'IUCB-0001',
      fullName: 'Ningthoujam John',
      dob: '1974-08-12',
      gender: 'Male' as const,
      contactNumber: '+91 98621 11223',
      email: 'n.john@iucb.co.in',
      department: 'Accounts & Finance' as const,
      designation: 'Senior Manager',
      dateOfJoining: '2004-03-15',
      salary: 84000,
      employmentStatus: 'Permanent' as const,
      contributionPercentage: 10,
      pfStartDate: '2004-03-15',
      accountStatus: 'Active' as const,
      currentBalance: 1802100,
      totalContribution: 1305800,
      totalInterest: 496300,
      outstandingLoan: 85000,
      hasLoan: true,
      nominees: [
        {
          id: 'NOM-01',
          name: 'Ningthoujam Tombisana Devi',
          relationship: 'Spouse',
          contactNumber: '+91 98621 55432',
          sharePercentage: 100,
          address: 'Uripok Achom Leikai, Imphal West, Manipur - 795001',
          status: 'Active' as const,
          lastUpdated: '2004-03-15',
        },
      ],
    };

  // Filter scoped data strictly to John
  const memberContributions = contributions.filter((c) => c.memberId === 'IUCB-0001');
  const memberLedger = ledgerEntries.filter((e) => e.memberId === 'IUCB-0001');
  const memberLoans = loans.filter((l) => l.memberId === 'IUCB-0001');
  const memberAdvance = advances.find((a) => a.memberId === 'IUCB-0001');

  // Filter states
  const [contribSearch, setContribSearch] = useState('');
  const [contribYearFilter, setContribYearFilter] = useState('All');
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState('All');

  // Modals & form state
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [loanAmount, setLoanAmount] = useState(50000);
  const [loanReason, setLoanReason] = useState('Medical treatment / Family requirement');
  const [loanTenure, setLoanTenure] = useState(24);
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
  const [isNomineeModalOpen, setIsNomineeModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Computed values
  const yearsOfService = 22; // 2004 to 2026
  const isAdvanceEligible = yearsOfService >= 18;
  const maxBorrowingLimit = Math.round(currentMember.currentBalance * 0.75); // 75% rule
  const remainingBorrowingCapacity = Math.max(0, maxBorrowingLimit - currentMember.outstandingLoan);
  const monthlyDeduction = Math.round(currentMember.salary * (currentMember.contributionPercentage / 100));

  const handleApplyLoan = (e: React.FormEvent) => {
    e.preventDefault();
    submitLoan({
      memberId: currentMember.id,
      memberName: currentMember.fullName,
      department: currentMember.department,
      applicationDate: new Date().toISOString().split('T')[0],
      requestedAmount: Number(loanAmount),
      purpose: loanReason,
      tenureMonths: Number(loanTenure),
      interestRate: 6.5,
      eligibleAmount: maxBorrowingLimit,
    });
    setIsLoanModalOpen(false);
    setActionNotice('Your loan application has been submitted to the Trust Committee Secretariat for appraisal.');
    setTimeout(() => setActionNotice(null), 6000);
  };

  const handleApplyAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdvanceModalOpen(false);
    setActionNotice('18-Year Advance claim request submitted. Verification will be completed against service records.');
    setTimeout(() => setActionNotice(null), 6000);
  };

  const handleNomineeUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNomineeModalOpen(false);
    setActionNotice('Nominee update request received. Physical Form 2 submission required at Trust Secretariat for legal execution.');
    setTimeout(() => setActionNotice(null), 7000);
  };

  // ==========================================
  // VIEW 1: MY DASHBOARD
  // ==========================================
  const renderDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--color-navy-900) 0%, #1E3A5F 100%)',
          color: '#FFFFFF',
          border: 'none',
          padding: '24px 28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)' }}>
                Employee Self-Service Portal
              </span>
              <span className="badge" style={{ background: 'rgba(52, 211, 153, 0.2)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                ● Active Account
              </span>
            </div>
            <h2 style={{ fontSize: '1.625rem', fontWeight: 800, margin: '4px 0', letterSpacing: '-0.02em' }}>
              Welcome back, {currentMember.fullName}
            </h2>
            <div style={{ fontSize: '0.8125rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '6px' }}>
              <span><strong>ID:</strong> {currentMember.id}</span>
              <span>•</span>
              <span><strong>Designation:</strong> {currentMember.designation}</span>
              <span>•</span>
              <span><strong>Department:</strong> {currentMember.department}</span>
              <span>•</span>
              <span><strong>Service:</strong> {yearsOfService} Years</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-primary"
              style={{ background: 'var(--color-burgundy-600)', borderColor: 'var(--color-burgundy-600)', color: '#FFFFFF' }}
              onClick={() => setIsLoanModalOpen(true)}
            >
              <CreditCard size={15} />
              <span>Apply for Loan</span>
            </button>
            <button
              className="btn btn-secondary"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }}
              onClick={() => setActivePage('my-ledger')}
            >
              <Printer size={15} />
              <span>View Passbook</span>
            </button>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem' }}>
          <CheckCircle2 size={18} color="#059669" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* KPI GRID */}
      <div className="kpi-grid">
        <div className="kpi-card accent-burgundy">
          <div className="kpi-header">
            <span className="kpi-label">TOTAL ACCUMULATED PF</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--color-burgundy-50)', color: 'var(--color-burgundy-700)' }}>
              <Wallet size={18} />
            </div>
          </div>
          <div className="kpi-value num">{formatCurrency(currentMember.currentBalance)}</div>
          <div className="kpi-desc">
            Principal: {formatCurrency(currentMember.totalContribution)} + Interest: {formatCurrency(currentMember.totalInterest)}
          </div>
        </div>

        <div className="kpi-card accent-navy">
          <div className="kpi-header">
            <span className="kpi-label">MONTHLY DEDUCTION</span>
            <div className="kpi-icon-wrap" style={{ background: '#EFF6FF', color: 'var(--color-navy-700)' }}>
              <CircleDollarSign size={18} />
            </div>
          </div>
          <div className="kpi-value num">{formatCurrency(monthlyDeduction)}</div>
          <div className="kpi-desc">
            {currentMember.contributionPercentage}% of Basic Salary ({formatCurrency(currentMember.salary)})
          </div>
        </div>

        <div className="kpi-card accent-amber">
          <div className="kpi-header">
            <span className="kpi-label">ACTIVE LOAN BALANCE</span>
            <div className="kpi-icon-wrap" style={{ background: '#FFFBEB', color: '#D97706' }}>
              <CreditCard size={18} />
            </div>
          </div>
          <div className="kpi-value num" style={{ color: currentMember.outstandingLoan > 0 ? '#B45309' : 'inherit' }}>
            {formatCurrency(currentMember.outstandingLoan)}
          </div>
          <div className="kpi-desc">
            {currentMember.outstandingLoan > 0 ? 'Monthly recovery EMI: ₹5,200 via payroll' : 'No active loan liability'}
          </div>
        </div>

        <div className="kpi-card accent-emerald">
          <div className="kpi-header">
            <span className="kpi-label">18-YEAR ADVANCE STATUS</span>
            <div className="kpi-icon-wrap" style={{ background: '#ECFDF5', color: '#059669' }}>
              <Award size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#059669', fontSize: '1.25rem', fontWeight: 800 }}>
            {isAdvanceEligible ? 'Eligible (22 Yrs)' : `${yearsOfService} / 18 Yrs`}
          </div>
          <div className="kpi-desc">
            {isAdvanceEligible ? 'Completed milestone on 15-Mar-2022' : 'Advance available after 18 years'}
          </div>
        </div>
      </div>

      {/* QUICK TILES & SUMMARY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Quick Action Tiles */}
        <div className="card" style={{ padding: '20px' }}>
          <div className="card-title" style={{ marginBottom: '14px' }}>Self-Service Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '8px',
                background: '#F8FAFC',
                border: '1px solid var(--color-border-subtle)',
                cursor: 'pointer',
              }}
              onClick={() => setActivePage('my-contributions')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CircleDollarSign size={18} color="var(--color-navy-700)" />
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                    My Monthly Contributions
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                    Review August 2026 payroll deduction credit and history
                  </div>
                </div>
              </div>
              <ChevronRight size={16} color="var(--color-text-muted)" />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '8px',
                background: '#F8FAFC',
                border: '1px solid var(--color-border-subtle)',
                cursor: 'pointer',
              }}
              onClick={() => setActivePage('my-loans')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CreditCard size={18} color="var(--color-burgundy-700)" />
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                    Loan Account & Borrowing Limit
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                    Available headroom: {formatCurrency(remainingBorrowingCapacity)}
                  </div>
                </div>
              </div>
              <ChevronRight size={16} color="var(--color-text-muted)" />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '8px',
                background: '#F8FAFC',
                border: '1px solid var(--color-border-subtle)',
                cursor: 'pointer',
              }}
              onClick={() => setActivePage('my-advance')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Award size={18} color="#059669" />
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                    18-Year Service Advance Tracker
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                    Qualifies for one-time interest-free advance up to 50%
                  </div>
                </div>
              </div>
              <ChevronRight size={16} color="var(--color-text-muted)" />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '8px',
                background: '#F8FAFC',
                border: '1px solid var(--color-border-subtle)',
                cursor: 'pointer',
              }}
              onClick={() => setActivePage('my-nominee')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Users size={18} color="#D97706" />
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                    Registered Nominee
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                    Ningthoujam Tombisana Devi (Spouse - 100% Share)
                  </div>
                </div>
              </div>
              <ChevronRight size={16} color="var(--color-text-muted)" />
            </div>
          </div>
        </div>

        {/* Retirement Projection Snapshot */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-title">Retirement Superannuation Projection</div>
            <div className="card-subtitle" style={{ marginBottom: '16px' }}>
              Target retirement at age 60 (August 2034)
            </div>

            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Years Remaining:</span>
                <span style={{ fontWeight: 700, color: 'var(--color-navy-900)' }}>8 Years (~96 months)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Projected Own Contributions:</span>
                <span style={{ fontWeight: 600 }} className="num">{formatCurrency(1305800 + 96 * 8400)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Estimated Corpus at 60 (7.5% p.a.):</span>
                <span style={{ fontWeight: 800, color: 'var(--color-burgundy-700)' }} className="num">
                  {formatCurrency(3650000)}
                </span>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              Includes compound dividend distribution from IUCB fixed deposit bank reserves. Settlement includes total principal + accrued interest minus outstanding loan obligations.
            </div>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', marginTop: '14px', justifyContent: 'center' }}
            onClick={() => setActivePage('my-retirement')}
          >
            <span>View Full Superannuation Breakdown</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* RECENT PERSONAL TRANSACTIONS */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Recent Passbook Activity</div>
            <div className="card-subtitle">Showing latest credits and deductions posted to your personal account</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setActivePage('my-ledger')}>
            View All ({memberLedger.length})
          </button>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Voucher Reference</th>
                <th>Transaction Type</th>
                <th>Description</th>
                <th className="align-right">Credit (₹)</th>
                <th className="align-right">Debit (₹)</th>
                <th className="align-right">Running Balance (₹)</th>
              </tr>
            </thead>
            <tbody>
              {memberLedger.slice(0, 5).map((entry) => (
                <tr key={entry.id}>
                  <td style={{ fontWeight: 500 }}>{entry.date}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600 }}>{entry.referenceNo}</td>
                  <td>
                    <span className="badge badge-neutral">{entry.transactionType}</span>
                  </td>
                  <td>{entry.description}</td>
                  <td className="align-right num td-credit" style={{ fontWeight: 600 }}>
                    {entry.credit > 0 ? `+${formatCurrency(entry.credit)}` : '—'}
                  </td>
                  <td className="align-right num td-debit" style={{ fontWeight: 600 }}>
                    {entry.debit > 0 ? `-${formatCurrency(entry.debit)}` : '—'}
                  </td>
                  <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-navy-900)' }}>
                    {formatCurrency(entry.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // VIEW 2: MY ACCOUNT
  // ==========================================
  const renderAccount = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--color-burgundy-700)',
                color: '#FFFFFF',
                fontSize: '1.5rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              NJ
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-navy-900)' }}>
                  {currentMember.fullName}
                </h2>
                <span className="badge badge-approved">Active Member</span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                Employee ID: <strong style={{ color: 'var(--color-burgundy-700)' }}>{currentMember.id}</strong> • Senior Manager
              </div>
            </div>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => alert('Download requested: Official IUCB Employee Trust Membership Certificate PDF generated.')}
          >
            <Download size={14} />
            <span>Download Member Certificate</span>
          </button>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
          <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
              Department & Branch
            </span>
            <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
              {currentMember.department}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
              Head Office, MG Avenue, Imphal
            </span>
          </div>

          <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
              Date of Joining & Service
            </span>
            <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
              {currentMember.dateOfJoining}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#059669', display: 'block', fontWeight: 600 }}>
              {yearsOfService} Years Unbroken Service
            </span>
          </div>

          <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
              Basic Salary
            </span>
            <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-navy-900)' }} className="num">
              {formatCurrency(currentMember.salary)}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
              Per Bank Payroll Structure
            </span>
          </div>

          <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
              PF Deduction Rate
            </span>
            <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-burgundy-700)' }}>
              {currentMember.contributionPercentage}% Monthly
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
              {formatCurrency(monthlyDeduction)} / month
            </span>
          </div>

          <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
              Date of Birth & Age
            </span>
            <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
              {currentMember.dob} (Age 52)
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
              Gender: {currentMember.gender}
            </span>
          </div>

          <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
              Official Contact
            </span>
            <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
              {currentMember.contactNumber}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
              {currentMember.email}
            </span>
          </div>
        </div>

        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
            Need to update your contact details or salary grade? Submit a formal request to the Trust Committee Secretariat.
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => alert('Correction ticket logged with Trust Secretariat (Desk Reference: REQ-2026-0922-01).')}
          >
            Request Profile Correction
          </button>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // VIEW 3: MY CONTRIBUTIONS
  // ==========================================
  const renderContributions = () => {
    const filtered = memberContributions.filter((c) => {
      const matchSearch =
        contribSearch.trim() === '' ||
        c.month.toLowerCase().includes(contribSearch.toLowerCase()) ||
        c.id.toLowerCase().includes(contribSearch.toLowerCase());
      const matchYear = contribYearFilter === 'All' || c.month.includes(contribYearFilter);
      return matchSearch && matchYear;
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* KPI Strip */}
        <div className="kpi-grid">
          <div className="kpi-card accent-burgundy">
            <div className="kpi-header">
              <span className="kpi-label">TOTAL PRINCIPAL CONTRIBUTED</span>
              <div className="kpi-icon-wrap" style={{ background: 'var(--color-burgundy-50)', color: 'var(--color-burgundy-700)' }}>
                <CircleDollarSign size={18} />
              </div>
            </div>
            <div className="kpi-value num">{formatCurrency(currentMember.totalContribution)}</div>
            <div className="kpi-desc">Lifetime employee payroll deductions</div>
          </div>

          <div className="kpi-card accent-navy">
            <div className="kpi-header">
              <span className="kpi-label">CURRENT DEDUCTION RATE</span>
              <div className="kpi-icon-wrap" style={{ background: '#EFF6FF', color: 'var(--color-navy-700)' }}>
                <TrendingUp size={18} />
              </div>
            </div>
            <div className="kpi-value num">{currentMember.contributionPercentage}%</div>
            <div className="kpi-desc">{formatCurrency(monthlyDeduction)} / month from basic salary</div>
          </div>

          <div className="kpi-card accent-emerald">
            <div className="kpi-header">
              <span className="kpi-label">POSTED VOUCHERS</span>
              <div className="kpi-icon-wrap" style={{ background: '#ECFDF5', color: '#059669' }}>
                <FileCheck size={18} />
              </div>
            </div>
            <div className="kpi-value num">{memberContributions.length}</div>
            <div className="kpi-desc">Consolidated monthly contributions</div>
          </div>
        </div>

        {/* Table Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">My Monthly Contribution Ledger</div>
              <div className="card-subtitle">Monthly payroll deduction records credited to your individual PF account</div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => alert('Exporting John\'s monthly contribution history as CSV...')}
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Compact horizontal table-toolbar */}
          <div className="table-toolbar">
            <div className="toolbar-search">
              <Search className="toolbar-search-icon" size={15} />
              <input
                type="text"
                placeholder="Search contributions by month or record ID..."
                className="toolbar-search-input"
                value={contribSearch}
                onChange={(e) => setContribSearch(e.target.value)}
              />
            </div>
            <div className="toolbar-filters">
              <select
                className="toolbar-select"
                value={contribYearFilter}
                onChange={(e) => setContribYearFilter(e.target.value)}
              >
                <option value="All">All Financial Years</option>
                <option value="2026">FY 2026-27</option>
                <option value="2025">FY 2025-26</option>
              </select>
            </div>
          </div>

          <div className="table-container" style={{ border: 'none' }}>
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Voucher ID</th>
                  <th>Salary Month</th>
                  <th className="align-right">Basic Salary (₹)</th>
                  <th className="align-right">Rate (%)</th>
                  <th className="align-right">PF Contribution (₹)</th>
                  <th>Status</th>
                  <th>Posting Date</th>
                  <th>Verified By</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                      {item.id}
                    </td>
                    <td style={{ fontWeight: 600 }}>{item.month}</td>
                    <td className="align-right num">{formatCurrency(item.salary)}</td>
                    <td className="align-right num">{item.contributionPercentage}%</td>
                    <td className="align-right num td-credit" style={{ fontWeight: 700 }}>
                      +{formatCurrency(item.contributionAmount)}
                    </td>
                    <td>
                      <StatusBadge status={item.entryStatus} size="sm" />
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.enteredDate}</td>
                    <td style={{ fontSize: '0.75rem' }}>{item.approvedBy || item.enteredBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEW 4: MY ACCOUNT LEDGER / PASSBOOK
  // ==========================================
  const renderLedger = () => {
    const filtered = memberLedger.filter((entry) => {
      const matchSearch =
        ledgerSearch.trim() === '' ||
        entry.referenceNo.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        entry.description.toLowerCase().includes(ledgerSearch.toLowerCase());
      const matchType = ledgerTypeFilter === 'All' || entry.transactionType === ledgerTypeFilter;
      return matchSearch && matchType;
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">My Account Passbook / Ledger</div>
              <div className="card-subtitle">
                Official statement of account for Ningthoujam John (IUCB-0001)
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => window.print()}
              >
                <Printer size={14} />
                <span>Print Passbook</span>
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => alert('Official sealed PDF statement downloaded.')}
              >
                <Download size={14} />
                <span>Official PDF</span>
              </button>
            </div>
          </div>

          {/* Compact horizontal table-toolbar */}
          <div className="table-toolbar">
            <div className="toolbar-search">
              <Search className="toolbar-search-icon" size={15} />
              <input
                type="text"
                placeholder="Search ledger entries by voucher reference or description..."
                className="toolbar-search-input"
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
              />
            </div>
            <div className="toolbar-filters">
              <select
                className="toolbar-select"
                value={ledgerTypeFilter}
                onChange={(e) => setLedgerTypeFilter(e.target.value)}
              >
                <option value="All">All Transaction Types</option>
                <option value="Contribution">Contributions Only</option>
                <option value="Interest">Interest Allocations Only</option>
                <option value="Loan Disbursal">Loan Disbursals</option>
                <option value="Advance">Advances</option>
              </select>
            </div>
          </div>

          <div className="table-container" style={{ border: 'none' }}>
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Voucher Date</th>
                  <th>Reference No.</th>
                  <th>Type</th>
                  <th>Particulars / Description</th>
                  <th className="align-right">Credit (₹)</th>
                  <th className="align-right">Debit (₹)</th>
                  <th className="align-right">Running Balance (₹)</th>
                  <th>Verified By</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 500 }}>{item.date}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600 }}>{item.referenceNo}</td>
                    <td>
                      <span className="badge badge-neutral">{item.transactionType}</span>
                    </td>
                    <td>{item.description}</td>
                    <td className="align-right num td-credit" style={{ fontWeight: 600 }}>
                      {item.credit > 0 ? `+${formatCurrency(item.credit)}` : '—'}
                    </td>
                    <td className="align-right num td-debit" style={{ fontWeight: 600 }}>
                      {item.debit > 0 ? `-${formatCurrency(item.debit)}` : '—'}
                    </td>
                    <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-navy-900)' }}>
                      {formatCurrency(item.balance)}
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.enteredBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEW 5: MY LOANS
  // ==========================================
  const renderLoans = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Active Loan Details Card */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="card-title">Active Loan Account</div>
              <span className="badge badge-pending">Active in Repayment</span>
            </div>
            <div className="card-subtitle">Loan Ref: <strong>LN-2026-0021</strong> • Sanctioned under IUCB Trust Loan Policy</div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setIsLoanModalOpen(true)}
          >
            <Plus size={14} />
            <span>Apply for Additional Loan</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
              Sanctioned Loan Principal
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy-900)' }} className="num">
              {formatCurrency(85000)}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
              Disbursed on 18-Sep-2026
            </span>
          </div>

          <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
              Interest Rate
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-burgundy-700)' }}>
              6.5% p.a.
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
              Subsidized employee rate
            </span>
          </div>

          <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
              Outstanding Balance
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#D97706' }} className="num">
              {formatCurrency(85000)}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
              Current liability
            </span>
          </div>

          <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
              Monthly Payroll Recovery
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }} className="num">
              {formatCurrency(5200)}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
              Next EMI due: 30-Sep-2026
            </span>
          </div>
        </div>

        {/* Borrowing Limit Policy Note */}
        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
              Loan Headroom & Borrowing Limit (Rule 14-B)
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-navy-800)', marginTop: '2px' }}>
              Employees may borrow up to <strong>75% of total accumulated PF balance</strong> ({formatCurrency(maxBorrowingLimit)}). Your current remaining borrowing capacity is <strong>{formatCurrency(remainingBorrowingCapacity)}</strong>.
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            style={{ background: 'var(--color-navy-900)', borderColor: 'var(--color-navy-900)' }}
            onClick={() => setIsLoanModalOpen(true)}
          >
            Calculate Loan Eligibility
          </button>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // VIEW 6: MY 18-YEAR ADVANCE
  // ==========================================
  const renderAdvance = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="card-title">18-Year Service Milestone Tracker</div>
              <span className="badge badge-approved">Eligible</span>
            </div>
            <div className="card-subtitle">
              Autonomous Trust Special Benefit: One-time interest-free advance after 18 years of uninterrupted service
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            style={{ background: '#059669', borderColor: '#059669' }}
            onClick={() => setIsAdvanceModalOpen(true)}
          >
            <Award size={14} />
            <span>Submit Advance Request</span>
          </button>
        </div>

        {/* Milestone Meter */}
        <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8125rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>Continuous Service Completion</span>
            <span style={{ fontWeight: 700, color: '#059669' }}>22 Years (100% Achieved)</span>
          </div>

          <div style={{ height: '12px', background: '#E2E8F0', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, var(--color-navy-700), #059669)' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
            <span>Joined: 15-Mar-2004</span>
            <span style={{ fontWeight: 700, color: '#059669' }}>18-Year Threshold Reached (15-Mar-2022)</span>
            <span>Current: 22 Years (2026)</span>
          </div>
        </div>

        {/* Advance Terms */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', background: '#FFFFFF' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-navy-900)', marginBottom: '6px' }}>
              Maximum Claim Amount
            </div>
            <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-burgundy-700)' }} className="num">
              {formatCurrency(Math.round(currentMember.totalContribution * 0.5))}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Up to 50% of own contribution balance ({formatCurrency(currentMember.totalContribution)})
            </div>
          </div>

          <div style={{ padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', background: '#FFFFFF' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-navy-900)', marginBottom: '6px' }}>
              Interest Rate & Terms
            </div>
            <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#059669' }}>
              0% (Interest-Free)
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Non-refundable advance adjusted against final superannuation settlement
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // VIEW 7: MY RETIREMENT
  // ==========================================
  const renderRetirement = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ padding: '24px' }}>
        <div className="card-title">Retirement Superannuation Settlement Forecast</div>
        <div className="card-subtitle" style={{ marginBottom: '20px' }}>
          Personal retirement projections per IUCB Autonomous Provident Fund Scheme Bylaws
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
              Projected Superannuation Date
            </span>
            <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-navy-900)' }}>
              31-Aug-2034
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
              On reaching age 60
            </span>
          </div>

          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
              Remaining Service Period
            </span>
            <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-navy-900)' }}>
              8 Years (96 Months)
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
              Approx. 96 remaining payroll cycles
            </span>
          </div>

          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
              Estimated Corpus at Retirement
            </span>
            <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-burgundy-700)' }} className="num">
              {formatCurrency(3650000)}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#059669', display: 'block', fontWeight: 600 }}>
              Based on 7.5% annual compounding
            </span>
          </div>
        </div>

        {/* Settlement Roadmap */}
        <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '20px' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy-900)', marginBottom: '12px' }}>
            Retirement Settlement Checklist (3 Months Prior to Superannuation)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8125rem', color: 'var(--color-text-primary)' }}>
              <Check size={16} color="#059669" />
              <span>Service Book & Entry verification by Audit & Inspection Department</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8125rem', color: 'var(--color-text-primary)' }}>
              <Check size={16} color="#059669" />
              <span>Full recovery / clearance of outstanding loan balance (Current: {formatCurrency(currentMember.outstandingLoan)})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8125rem', color: 'var(--color-text-primary)' }}>
              <Check size={16} color="#059669" />
              <span>Nominee KYC mandate & registered bank account verification</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8125rem', color: 'var(--color-text-primary)' }}>
              <Check size={16} color="#059669" />
              <span>Final sign-off by Trust Committee & Board of Directors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // VIEW 8: MY NOMINEE
  // ==========================================
  const renderNominee = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div className="card-title">Registered Nominee & Beneficiary</div>
            <div className="card-subtitle">
              Legal beneficiary designated to receive trust fund proceeds in accordance with Trust Rules
            </div>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsNomineeModalOpen(true)}
          >
            <span>Request Nominee Modification</span>
          </button>
        </div>

        {currentMember.nominees.map((nom) => (
          <div
            key={nom.id}
            style={{
              background: '#F8FAFC',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: '8px',
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                Nominee Full Name
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
                {nom.name}
              </span>
              <span className="badge badge-approved" style={{ marginTop: '6px' }}>
                Primary Beneficiary (Active)
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                Relationship & Share %
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-burgundy-700)' }}>
                {nom.relationship} — {nom.sharePercentage}% Share
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '2px' }}>
                Full entitlement
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                Contact Number
              </span>
              <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                {nom.contactNumber}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                Permanent Residential Address
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                {nom.address}
              </span>
            </div>
          </div>
        ))}

        <div style={{ marginTop: '20px', padding: '14px 16px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '6px', fontSize: '0.75rem', color: '#92400E' }}>
          <strong>Notice:</strong> To comply with banking trust compliance regulations, any modification to your registered nominee requires submission of physical Form 2 accompanied by a verified government ID proof of the nominee at the Trust Secretariat.
        </div>
      </div>
    </div>
  );

  // ==========================================
  // VIEW 9: NOTIFICATIONS
  // ==========================================
  const renderNotifications = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card">
        <div className="card-header">
          <div className="card-title">My Notifications & Circulars</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Official trust alerts & transaction credit advices
          </span>
        </div>

        <div style={{ padding: '8px 0' }}>
          {notifications.map((item) => (
            <div
              key={item.id}
              style={{
                padding: '14px 20px',
                borderBottom: '1px solid var(--color-border-subtle)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: item.type === 'loan' ? '#EFF6FF' : '#ECFDF5',
                  color: item.type === 'loan' ? 'var(--color-navy-700)' : '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Bell size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                    {item.title}
                  </span>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>{item.timestamp}</span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ==========================================
  // VIEW 10: HELP / SUPPORT
  // ==========================================
  const renderSupport = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ padding: '24px' }}>
        <div className="card-title">Trust Secretariat Help & Support</div>
        <div className="card-subtitle" style={{ marginBottom: '20px' }}>
          Contact details and operational assistance for IUCB Employee Trust Fund members
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '24px' }}>
          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Building2 size={18} color="var(--color-navy-700)" />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
                Office Location
              </span>
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              IUCB Employee Trust Secretariat<br />
              2nd Floor, Head Office Building<br />
              MG Avenue, Imphal West, Manipur - 795001
            </div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Phone size={18} color="#059669" />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
                Official Enquiries
              </span>
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              Direct: +91 385 245 1042<br />
              EPABX Ext: 204 (Trust Section)<br />
              Mon – Sat: 10:00 AM – 4:30 PM
            </div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Mail size={18} color="var(--color-burgundy-700)" />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
                Official Correspondence
              </span>
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              trust.committee@iucb.co.in<br />
              pf.secretariat@iucb.co.in<br />
              Queries answered within 2 working days
            </div>
          </div>
        </div>

        {/* Downloadable Physical Forms */}
        <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '20px' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy-900)', marginBottom: '12px' }}>
            Downloadable Physical Application Forms
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', padding: '10px 14px' }}
              onClick={() => alert('Downloaded: Form 2 - Nominee Registration / Modification.pdf')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} />
                <span>Form 2: Nominee Registration & Change</span>
              </div>
              <Download size={14} />
            </button>

            <button
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', padding: '10px 14px' }}
              onClick={() => alert('Downloaded: Form 4 - PF Loan Application Form.pdf')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} />
                <span>Form 4: PF Loan Claim Application</span>
              </div>
              <Download size={14} />
            </button>

            <button
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', padding: '10px 14px' }}
              onClick={() => alert('Downloaded: Form 7 - 18-Year Service Advance Claim.pdf')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} />
                <span>Form 7: 18-Year Service Advance Claim</span>
              </div>
              <Download size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Router for MemberPortal sub-views
  const renderCurrentSubView = () => {
    switch (activePage) {
      case 'my-dashboard':
        return renderDashboard();
      case 'my-account':
        return renderAccount();
      case 'my-contributions':
        return renderContributions();
      case 'my-ledger':
        return renderLedger();
      case 'my-loans':
        return renderLoans();
      case 'my-advance':
        return renderAdvance();
      case 'my-retirement':
        return renderRetirement();
      case 'my-nominee':
        return renderNominee();
      case 'my-notifications':
        return renderNotifications();
      case 'my-support':
        return renderSupport();
      default:
        return renderDashboard();
    }
  };

  return (
    <>
      {renderCurrentSubView()}

      {/* LOAN APPLICATION MODAL */}
      {isLoanModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsLoanModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Apply for Loan Claim (Self-Service)</div>
              <button className="btn-close" onClick={() => setIsLoanModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleApplyLoan}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '10px 14px', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--color-navy-900)' }}>
                  Eligible borrowing limit (75% of PF balance): <strong>{formatCurrency(maxBorrowingLimit)}</strong> • Available headroom: <strong>{formatCurrency(remainingBorrowingCapacity)}</strong>
                </div>

                <div className="form-group">
                  <label className="form-label">Applicant Employee</label>
                  <input
                    type="text"
                    className="form-input"
                    disabled
                    value={`${currentMember.fullName} (${currentMember.id}) — ${currentMember.department}`}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Requested Loan Amount (₹) *</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    min={10000}
                    max={remainingBorrowingCapacity}
                    step={5000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                  />
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    Allowed range: ₹10,000 to {formatCurrency(remainingBorrowingCapacity)}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Purpose / Reason *</label>
                  <select
                    className="form-select"
                    value={loanReason}
                    onChange={(e) => setLoanReason(e.target.value)}
                  >
                    <option value="Medical treatment / Family requirement">Medical treatment / Family requirement</option>
                    <option value="Higher education for dependent children">Higher education for dependent children</option>
                    <option value="House repair / Renovation">House repair / Renovation</option>
                    <option value="Marriage ceremony / Social obligations">Marriage ceremony / Social obligations</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Repayment Tenure</label>
                  <select
                    className="form-select"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(Number(e.target.value))}
                  >
                    <option value={12}>12 Months (1 Year)</option>
                    <option value={24}>24 Months (2 Years)</option>
                    <option value={36}>36 Months (3 Years)</option>
                    <option value={48}>48 Months (4 Years)</option>
                  </select>
                </div>

                <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  Estimated Monthly EMI deduction: <strong>{formatCurrency(Math.round(loanAmount / loanTenure + (loanAmount * 0.065) / 12))} / month</strong> at 6.5% interest.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsLoanModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Loan Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 18-YEAR ADVANCE MODAL */}
      {isAdvanceModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAdvanceModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Submit 18-Year Advance Claim</div>
              <button className="btn-close" onClick={() => setIsAdvanceModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleApplyAdvance}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '10px 14px', borderRadius: '6px', fontSize: '0.75rem', color: '#065F46' }}>
                  <strong>Milestone Verified:</strong> You have completed 22 continuous years of service (Threshold: 18 years). Maximum entitlement: <strong>{formatCurrency(Math.round(currentMember.totalContribution * 0.5))}</strong> (50% of own contribution).
                </div>

                <div className="form-group">
                  <label className="form-label">Employee ID & Service</label>
                  <input
                    type="text"
                    className="form-input"
                    disabled
                    value={`${currentMember.fullName} (DOJ: ${currentMember.dateOfJoining} • 22 Yrs)`}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Claim Amount (₹) *</label>
                  <input
                    type="number"
                    className="form-input"
                    defaultValue={300000}
                    max={Math.round(currentMember.totalContribution * 0.5)}
                    step={10000}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Declaration</label>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    I hereby affirm that this is my first and one-time claim under the 18-Year Service Advance Scheme. I understand that this amount will be adjusted without interest against my final retirement corpus.
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAdvanceModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: '#059669', borderColor: '#059669' }}>
                  Confirm & Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NOMINEE MODIFICATION MODAL */}
      {isNomineeModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsNomineeModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Request Nominee Modification</div>
              <button className="btn-close" onClick={() => setIsNomineeModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleNomineeUpdate}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '10px 14px', borderRadius: '6px', fontSize: '0.75rem', color: '#92400E' }}>
                  Online submission registers a formal request. You must submit physical Form 2 with nominee ID proof to the Secretariat to complete legal execution.
                </div>

                <div className="form-group">
                  <label className="form-label">Nominee Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    defaultValue="Ningthoujam Tombisana Devi"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Relationship *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    defaultValue="Spouse"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Share Percentage (100%) *</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    min={1}
                    max={100}
                    defaultValue={100}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone & Address *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    defaultValue="+91 98621 55432, Uripok Achom Leikai, Imphal"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsNomineeModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Modification Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
