import React, { useState } from 'react';
import {
  BookOpen,
  Printer,
  Download,
  Calendar,
  Search,
  Filter,
  User,
  CheckCircle,
  FileSpreadsheet,
  Landmark,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TransactionType } from '../../types';

export const IndividualAccountLedger: React.FC = () => {
  const {
    members,
    selectedMemberId,
    setSelectedMemberId,
    ledgerEntries,
    formatCurrency,
  } = useApp();

  const [typeFilter, setTypeFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);

  const member = members.find((m) => m.id === selectedMemberId) || members[0];

  // Specific member ledger entries
  const memberEntries = ledgerEntries.filter((l) => l.memberId === member.id);

  // Financial summary metrics
  const openingBalance = Math.round(member.totalContribution * 0.45);
  const totalContrib = member.totalContribution;
  const totalInterest = member.totalInterest;
  const loanPrincipal = member.hasLoan ? member.outstandingLoan : 0;
  const loanRepayment = member.hasLoan ? 30000 : 0;
  const currentBalance = member.currentBalance;

  const filteredEntries = memberEntries.filter((entry) => {
    const matchesType = typeFilter === 'All' || entry.transactionType === typeFilter;
    const matchesSearch =
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.referenceNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = 'Date,Transaction ID,Type,Description,Credit,Debit,Running Balance,Entered By,Reference\n';
    const rows = filteredEntries.map((e) =>
      `"${e.date}","${e.id}","${e.transactionType}","${e.description}",${e.credit},${e.debit},${e.balance},"${e.enteredBy}","${e.referenceNo}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PF_Passbook_${member.id}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            Individual Account Ledger
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Digital PF passbook system of record. Every credit and debit entry is immutably stamped.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowPrintModal(true)}
          >
            <Printer size={14} />
            <span>Print Official Statement</span>
          </button>
        </div>
      </div>

      {/* Member Selector Bar */}
      <div className="card" style={{ padding: '12px 16px', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-navy-900)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {member.fullName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>{member.fullName}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-burgundy-700)', background: 'var(--color-burgundy-50)', padding: '2px 6px', borderRadius: '4px' }}>
                  {member.id}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                {member.designation} • {member.department} • Joined {member.dateOfJoining}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Switch Member:</span>
            <select
              className="form-select"
              value={member.id}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              style={{ width: '260px' }}
            >
              {members.slice(0, 40).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id} — {m.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 6 PASSBOOK FINANCIAL SUMMARY TILES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
        <div className="card" style={{ padding: '12px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>Opening Bal</span>
          <span className="num" style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>{formatCurrency(openingBalance)}</span>
        </div>
        <div className="card" style={{ padding: '12px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>Total Contrib</span>
          <span className="num td-credit" style={{ fontSize: '1.0625rem', fontWeight: 700 }}>+{formatCurrency(totalContrib)}</span>
        </div>
        <div className="card" style={{ padding: '12px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>Total Interest</span>
          <span className="num td-credit" style={{ fontSize: '1.0625rem', fontWeight: 700 }}>+{formatCurrency(totalInterest)}</span>
        </div>
        <div className="card" style={{ padding: '12px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>Loan Principal</span>
          <span className="num td-debit" style={{ fontSize: '1.0625rem', fontWeight: 700 }}>{loanPrincipal > 0 ? `-${formatCurrency(loanPrincipal)}` : '₹0'}</span>
        </div>
        <div className="card" style={{ padding: '12px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>Loan Repayment</span>
          <span className="num td-credit" style={{ fontSize: '1.0625rem', fontWeight: 700 }}>{loanRepayment > 0 ? `+${formatCurrency(loanRepayment)}` : '₹0'}</span>
        </div>
        <div className="card" style={{ padding: '12px', textAlign: 'center', background: 'var(--color-navy-900)', color: '#FFFFFF' }}>
          <span style={{ fontSize: '0.6875rem', color: '#94A3B8', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>Current Balance</span>
          <span className="num" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#FFFFFF' }}>{formatCurrency(currentBalance)}</span>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="table-toolbar">
        <div className="toolbar-search">
          <div className="toolbar-search-icon">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="toolbar-search-input"
            placeholder="Search transactions by ID, description, or reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="toolbar-filters">
          <select
            className="toolbar-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Transaction Types</option>
            <option value="Contribution">Contribution</option>
            <option value="Interest">Interest</option>
            <option value="Loan Disbursement">Loan Disbursement</option>
            <option value="Loan Repayment">Loan Repayment</option>
            <option value="18-Year Advance">18-Year Advance</option>
            <option value="Retirement Settlement">Retirement Settlement</option>
          </select>
        </div>
      </div>

      {/* TRANSACTION TABLE */}
      <div className="table-container">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Transaction ID</th>
              <th>Type</th>
              <th>Description / Reference</th>
              <th className="align-right">Credit (₹)</th>
              <th className="align-right">Debit (₹)</th>
              <th className="align-right">Running Balance (₹)</th>
              <th>Entered By</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                  No transactions recorded for this criteria.
                </td>
              </tr>
            ) : (
              filteredEntries.map((txn) => (
                <tr key={txn.id}>
                  <td style={{ fontWeight: 500 }}>{txn.date}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                    {txn.id}
                  </td>
                  <td>
                    <span className="badge badge-neutral">{txn.transactionType}</span>
                  </td>
                  <td>
                    <div>{txn.description}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                      Ref: {txn.referenceNo}
                    </div>
                  </td>
                  <td className="align-right num td-credit" style={{ fontWeight: 600 }}>
                    {txn.credit > 0 ? `+${formatCurrency(txn.credit)}` : '—'}
                  </td>
                  <td className="align-right num td-debit" style={{ fontWeight: 600 }}>
                    {txn.debit > 0 ? `-${formatCurrency(txn.debit)}` : '—'}
                  </td>
                  <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-navy-900)' }}>
                    {formatCurrency(txn.balance || member.currentBalance)}
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{txn.enteredBy}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* OFFICIAL PRINT STATEMENT MODAL */}
      {showPrintModal && (
        <div className="modal-backdrop" onClick={() => setShowPrintModal(false)}>
          <div
            className="modal-dialog xl"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '92vh' }}
          >
            <div className="modal-header no-print">
              <div className="modal-title">Official Member PF Passbook Statement</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => window.print()}
                >
                  <Printer size={14} />
                  <span>Print Document</span>
                </button>
                <button className="btn-close" onClick={() => setShowPrintModal(false)}>
                  ✕
                </button>
              </div>
            </div>

            {/* Print Document Sheet */}
            <div
              className="modal-body"
              style={{
                background: '#FFFFFF',
                padding: '36px',
                fontFamily: 'Inter, sans-serif',
                color: '#0F172A',
              }}
            >
              {/* Official Bank Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0A192F', paddingBottom: '16px', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0A192F', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  IMPHAL URBAN CO-OPERATIVE BANK LTD.
                </h1>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-burgundy-700)', marginTop: '2px' }}>
                  EMPLOYEE TRUST — AUTONOMOUS PROVIDENT FUND SCHEME
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: '4px' }}>
                  Head Office: MG Avenue, Imphal West, Manipur - 795001 • Regd. Trust Scheme No. IUCB/ET/AUTONOMOUS-PF-1996/MN
                </p>
                <div style={{ display: 'inline-block', border: '1px solid #0A192F', padding: '3px 12px', borderRadius: '4px', fontSize: '0.8125rem', fontWeight: 700, marginTop: '8px', textTransform: 'uppercase' }}>
                  Official PF Passbook Statement of Account
                </div>
              </div>

              {/* Member Meta Box */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#F8FAFC', padding: '14px', borderRadius: '6px', border: '1px solid #CBD5E1', marginBottom: '24px', fontSize: '0.8125rem' }}>
                <div>
                  <div><span style={{ color: '#64748B' }}>Member Name:</span> <strong>{member.fullName}</strong></div>
                  <div><span style={{ color: '#64748B' }}>Employee ID:</span> <strong>{member.id}</strong></div>
                  <div><span style={{ color: '#64748B' }}>Department:</span> <strong>{member.department}</strong></div>
                  <div><span style={{ color: '#64748B' }}>Designation:</span> <strong>{member.designation}</strong></div>
                </div>
                <div>
                  <div><span style={{ color: '#64748B' }}>Date of Joining:</span> <strong>{member.dateOfJoining}</strong></div>
                  <div><span style={{ color: '#64748B' }}>Contribution Rate:</span> <strong>{member.contributionPercentage}% of Basic Salary</strong></div>
                  <div><span style={{ color: '#64748B' }}>Statement Date:</span> <strong>22 September 2026</strong></div>
                  <div><span style={{ color: '#64748B' }}>Account Status:</span> <strong>{member.accountStatus}</strong></div>
                </div>
              </div>

              {/* Balances Summary Table */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '24px', textAlign: 'center' }}>
                <div style={{ border: '1px solid #CBD5E1', padding: '10px', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B', textTransform: 'uppercase' }}>Total Contributions</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700 }}>{formatCurrency(member.totalContribution)}</div>
                </div>
                <div style={{ border: '1px solid #CBD5E1', padding: '10px', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B', textTransform: 'uppercase' }}>Total Interest Credited</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700 }}>{formatCurrency(member.totalInterest)}</div>
                </div>
                <div style={{ border: '1px solid #CBD5E1', padding: '10px', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B', textTransform: 'uppercase' }}>Outstanding Loan Liability</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#DC2626' }}>{formatCurrency(member.outstandingLoan)}</div>
                </div>
                <div style={{ border: '2px solid #0A192F', padding: '10px', borderRadius: '4px', background: '#F1F5F9' }}>
                  <div style={{ fontSize: '0.6875rem', color: '#0A192F', fontWeight: 700, textTransform: 'uppercase' }}>Closing Net PF Balance</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0A192F' }}>{formatCurrency(member.currentBalance)}</div>
                </div>
              </div>

              {/* Transactions Ledger */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', marginBottom: '32px' }}>
                <thead>
                  <tr style={{ background: '#F1F5F9', borderBottom: '2px solid #0A192F' }}>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Txn Ref</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Particulars / Description</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Credit (₹)</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Debit (₹)</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Balance (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {memberEntries.map((e) => (
                    <tr key={e.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '8px' }}>{e.date}</td>
                      <td style={{ padding: '8px', fontFamily: 'monospace' }}>{e.id}</td>
                      <td style={{ padding: '8px' }}>{e.description}</td>
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600, color: '#059669' }}>
                        {e.credit > 0 ? formatCurrency(e.credit) : '—'}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600, color: '#DC2626' }}>
                        {e.debit > 0 ? formatCurrency(e.debit) : '—'}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700 }}>
                        {formatCurrency(e.balance || member.currentBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Verification & Seal Section */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '48px', paddingTop: '20px', borderTop: '1px dashed #CBD5E1' }}>
                <div style={{ fontSize: '0.6875rem', color: '#64748B', maxWidth: '340px' }}>
                  This is an official computer-generated statement of record issued by the IUCB Employee Trust Committee. Any discrepancy must be reported in writing within 15 days of issue.
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '160px', height: '40px', borderBottom: '1px solid #0A192F', marginBottom: '6px' }}></div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0A192F', display: 'block' }}>
                    Authorised Signatory
                  </span>
                  <span style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                    IUCB Employee Trust Committee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
