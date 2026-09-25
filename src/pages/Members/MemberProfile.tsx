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
  Printer,
  FileText,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Nominee } from '../../types';

export const MemberProfile: React.FC = () => {
  const {
    members,
    selectedMemberId,
    setActivePage,
    formatCurrency,
    contributions,
    ledgerEntries,
    loans,
    addNominee,
    removeNominee,
    currentRole,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'contributions' | 'ledger' | 'loans' | 'nominees'>('overview');

  // Nominee modal state
  const [isNomineeModalOpen, setIsNomineeModalOpen] = useState(false);
  const [newNominee, setNewNominee] = useState({
    name: '',
    relationship: 'Spouse',
    contactNumber: '+91 ',
    sharePercentage: 100,
    address: 'Imphal, Manipur',
  });

  const member = members.find((m) => m.id === selectedMemberId) || members[0];

  // Specific member data
  const memberContributions = contributions.filter((c) => c.memberId === member.id);
  const memberLedger = ledgerEntries.filter((l) => l.memberId === member.id);
  const memberLoans = loans.filter((l) => l.memberId === member.id);

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
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-burgundy-700)', background: 'var(--color-burgundy-50)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--color-burgundy-100)' }}>
                {member.id}
              </span>
              <StatusBadge status={member.accountStatus} size="sm" />
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              {member.designation} • {member.department} • Joined Bank on {member.dateOfJoining}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setActiveTab('ledger');
              setTimeout(() => window.print(), 200);
            }}
          >
            <Printer size={14} />
            <span>Print Passbook</span>
          </button>
        </div>
      </div>

      {/* 4 SUMMARY METRIC CARDS */}
      <div className="kpi-grid">
        <div className="kpi-card accent-burgundy">
          <div className="kpi-header">
            <span className="kpi-label">CURRENT PF BALANCE</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--color-burgundy-50)', color: 'var(--color-burgundy-700)' }}>
              <PiggyBank size={18} />
            </div>
          </div>
          <div className="kpi-value num">{formatCurrency(member.currentBalance)}</div>
          <div className="kpi-desc">Available net accumulated corpus</div>
        </div>

        <div className="kpi-card accent-emerald">
          <div className="kpi-header">
            <span className="kpi-label">TOTAL CONTRIBUTION</span>
            <div className="kpi-icon-wrap" style={{ background: '#ECFDF5', color: '#059669' }}>
              <Building2 size={18} />
            </div>
          </div>
          <div className="kpi-value num">{formatCurrency(member.totalContribution)}</div>
          <div className="kpi-desc">Deducted from monthly payroll ({member.contributionPercentage}%)</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">TOTAL INTEREST CREDITED</span>
            <div className="kpi-icon-wrap">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="kpi-value num">{formatCurrency(member.totalInterest)}</div>
          <div className="kpi-desc">Compound returns distributed</div>
        </div>

        <div className="kpi-card accent-amber">
          <div className="kpi-header">
            <span className="kpi-label">OUTSTANDING LOAN</span>
            <div className="kpi-icon-wrap" style={{ background: '#FFFBEB', color: '#D97706' }}>
              <CreditCard size={18} />
            </div>
          </div>
          <div className="kpi-value num">{formatCurrency(member.outstandingLoan)}</div>
          <div className="kpi-desc">
            {member.hasLoan ? 'Active loan liability recorded' : 'No active loan against PF'}
          </div>
        </div>
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
            className={`tab-btn ${activeTab === 'contributions' ? 'active' : ''}`}
            onClick={() => setActiveTab('contributions')}
          >
            <PiggyBank size={15} />
            <span>Contributions ({memberContributions.length})</span>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
              {/* Personal & Employment Details */}
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy-900)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Bank Employment & Personal Profile
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8125rem' }}>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Date of Birth</span>
                    <strong>{member.dob}</strong>
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
                    <strong>{member.dateOfJoining}</strong>
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
              </div>

              {/* Trust Membership Details */}
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy-900)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Trust Membership & Standing
                </h4>
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
                    <strong>{member.pfStartDate}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>18-Year Service Milestone</span>
                    <strong>
                      {2026 - parseInt(member.dateOfJoining.substring(0, 4), 10) >= 18 ? (
                        <span style={{ color: 'var(--color-success-text)' }}>Eligible for Interest-Free Advance</span>
                      ) : (
                        <span>Approaching in {parseInt(member.dateOfJoining.substring(0, 4), 10) + 18}</span>
                      )}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Current Loan Borrowing Limit</span>
                    <strong className="num" style={{ color: 'var(--color-burgundy-700)' }}>
                      {formatCurrency(Math.round(member.currentBalance * 0.75))} (75% of PF)
                    </strong>
                  </div>
                </div>
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

        {/* TAB 2: CONTRIBUTIONS */}
        {activeTab === 'contributions' && (
          <div className="card-body" style={{ padding: 0 }}>
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Salary</th>
                  <th>Rate (%)</th>
                  <th className="align-right">Contribution Amount</th>
                  <th>Status</th>
                  <th>Entered By</th>
                  <th>Entered Date</th>
                </tr>
              </thead>
              <tbody>
                {memberContributions.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>
                      No contribution records found for this member.
                    </td>
                  </tr>
                ) : (
                  memberContributions.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600 }}>{c.month}</td>
                      <td className="num">{formatCurrency(c.salary)}</td>
                      <td>{c.contributionPercentage}%</td>
                      <td className="align-right num td-credit">{formatCurrency(c.contributionAmount)}</td>
                      <td>
                        <StatusBadge status={c.entryStatus} size="sm" />
                      </td>
                      <td>{c.enteredBy}</td>
                      <td>{c.enteredDate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: ACCOUNT LEDGER */}
        {activeTab === 'ledger' && (
          <div className="card-body" style={{ padding: 0 }}>
            <div style={{ padding: '12px 16px', background: '#F8FAFC', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                  Digital PF Passbook Ledger
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: '8px' }}>
                  Member: {member.fullName} ({member.id})
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActivePage('ledger')}
                >
                  Open Full Ledger View
                </button>
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
                    <td>{txn.date}</td>
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

        {/* TAB 4: LOANS */}
        {activeTab === 'loans' && (
          <div className="card-body" style={{ padding: 0 }}>
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Loan ID</th>
                  <th>Application Date</th>
                  <th>Purpose</th>
                  <th className="align-right">Requested</th>
                  <th className="align-right">Outstanding Principal</th>
                  <th>Interest Rate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {memberLoans.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>
                      No loan claims recorded for this member.
                    </td>
                  </tr>
                ) : (
                  memberLoans.map((l) => (
                    <tr key={l.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{l.id}</td>
                      <td>{l.applicationDate}</td>
                      <td>{l.purpose}</td>
                      <td className="align-right num">{formatCurrency(l.requestedAmount)}</td>
                      <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-danger-text)' }}>
                        {formatCurrency(l.outstandingPrincipal)}
                      </td>
                      <td>{l.interestRate}% p.a.</td>
                      <td>
                        <StatusBadge status={l.status} size="sm" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: NOMINEES */}
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
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsNomineeModalOpen(true)}
              >
                <Plus size={14} />
                <span>Add Nominee</span>
              </button>
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
                    <th className="align-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(!member.nominees || member.nominees.length === 0) ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>
                        No nominees on record. Click 'Add Nominee' to register.
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
                        <td>{nom.lastUpdated}</td>
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
