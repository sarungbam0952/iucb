import React, { useState } from 'react';
import {
  ArrowLeft,
  CreditCard,
  Plus,
  Receipt,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  X,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoanRecord } from '../../types';
import { formatDate } from '../../utils/dateFormat';

export const LoanDetailsPage: React.FC = () => {
  const {
    loans,
    selectedLoanId,
    setSelectedLoanId,
    setActivePage,
    formatCurrency,
    addLoanRepayment,
    currentRole,
  } = useApp();

  // Find the selected loan, or default to the first active loan
  const loan = loans.find((l) => l.id === selectedLoanId) || loans[0];

  // Add Repayment Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [repaymentAmount, setRepaymentAmount] = useState<string>('');
  const [principalComponent, setPrincipalComponent] = useState<string>('');
  const [interestComponent, setInterestComponent] = useState<string>('');
  const [repaymentDate, setRepaymentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [referenceNo, setReferenceNo] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [isForeclosure, setIsForeclosure] = useState<boolean>(false);
  const [foreclosureConfirmed, setForeclosureConfirmed] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!loan) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button
          className="btn btn-secondary btn-sm"
          style={{ width: 'fit-content' }}
          onClick={() => {
            setSelectedLoanId(null);
            setActivePage('loans');
          }}
        >
          <ArrowLeft size={14} />
          <span>Back to Loans</span>
        </button>
        <div className="card" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          No loan account selected or found.
        </div>
      </div>
    );
  }

  // Derive Dates from approval timeline or fallback
  const sanctionDate =
    loan.approvalTimeline?.find((t) => t.stage === 'Admin Approval')?.date ||
    loan.applicationDate;

  const disbursementDate =
    loan.approvalTimeline?.find((t) => t.stage === 'Recorded')?.date ||
    sanctionDate;

  // Repayment calculations
  const originalPrincipal = loan.approvedAmount || loan.requestedAmount;
  const repaymentsList = loan.repayments || [];

  const principalRepaid = repaymentsList.reduce((sum, r) => sum + (r.principal || 0), 0);
  const interestPaid = repaymentsList.reduce((sum, r) => sum + (r.interest || 0), 0);
  const totalRepaid = repaymentsList.reduce((sum, r) => sum + (r.total || 0), 0);

  // Compute running outstanding balance for each repayment (newest first)
  // 1. Sort repayments chronologically to calculate running balance
  const chronologicalRepayments = [...repaymentsList].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let runningPrincipal = originalPrincipal;
  const repaymentWithOutstanding = chronologicalRepayments.map((rep) => {
    runningPrincipal = Math.max(0, runningPrincipal - rep.principal);
    return {
      ...rep,
      outstandingAtTime: runningPrincipal,
    };
  });

  // 2. Newest repayment first as required
  const displayRepayments = [...repaymentWithOutstanding].reverse();

  // Open Repayment Modal handler
  const handleOpenRepaymentModal = () => {
    setValidationError(null);
    setIsForeclosure(false);
    setForeclosureConfirmed(false);
    setRepaymentDate(new Date().toISOString().split('T')[0]);
    setReferenceNo('');
    setRemarks('');

    // Pre-calculate suggested monthly recovery (if applicable)
    if (loan.outstandingPrincipal > 0) {
      const remainingTenure = Math.max(1, loan.tenureMonths - repaymentsList.length);
      const estPrincipal = Math.min(
        loan.outstandingPrincipal,
        Math.round(loan.outstandingPrincipal / remainingTenure)
      );
      const estInterest = Math.min(
        loan.outstandingInterest,
        Math.round(loan.outstandingInterest / remainingTenure)
      );
      setPrincipalComponent(String(estPrincipal));
      setInterestComponent(String(estInterest));
      setRepaymentAmount(String(estPrincipal + estInterest));
    } else {
      setPrincipalComponent('0');
      setInterestComponent('0');
      setRepaymentAmount('0');
    }

    setIsModalOpen(true);
  };

  // Toggle Foreclosure handler
  const handleForeclosureChange = (checked: boolean) => {
    setIsForeclosure(checked);
    setValidationError(null);
    if (checked) {
      // Set to full outstanding
      setPrincipalComponent(String(loan.outstandingPrincipal));
      setInterestComponent(String(loan.outstandingInterest));
      setRepaymentAmount(String(loan.outstandingPrincipal + loan.outstandingInterest));
      setForeclosureConfirmed(false);
    }
  };

  // Submit Repayment handler
  const handleSubmitRepayment = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const amt = Number(repaymentAmount);
    const pComp = Number(principalComponent);
    const iComp = Number(interestComponent);

    if (isNaN(amt) || amt <= 0) {
      setValidationError('Repayment amount must be greater than zero.');
      return;
    }

    if (isNaN(pComp) || pComp < 0 || isNaN(iComp) || iComp < 0) {
      setValidationError('Principal and Interest components cannot be negative.');
      return;
    }

    if (pComp + iComp !== amt) {
      setValidationError(
        `Principal component (₹${pComp.toLocaleString('en-IN')}) + Interest component (₹${iComp.toLocaleString('en-IN')}) must equal Repayment Amount (₹${amt.toLocaleString('en-IN')}).`
      );
      return;
    }

    if (pComp > loan.outstandingPrincipal) {
      setValidationError(
        `Principal component cannot exceed remaining outstanding principal (₹${loan.outstandingPrincipal.toLocaleString('en-IN')}).`
      );
      return;
    }

    if (iComp > loan.outstandingInterest && loan.outstandingInterest > 0 && !isForeclosure) {
      setValidationError(
        `Interest component cannot exceed current outstanding interest (₹${loan.outstandingInterest.toLocaleString('en-IN')}).`
      );
      return;
    }

    if (isForeclosure && !foreclosureConfirmed) {
      setValidationError('Please confirm full loan settlement before proceeding with foreclosure.');
      return;
    }

    // Call store mutation
    addLoanRepayment(loan.id, {
      amount: amt,
      principal: pComp,
      interest: iComp,
      date: repaymentDate,
      receiptNo: referenceNo.trim() || undefined,
      remarks: remarks.trim() || undefined,
      isForeclosure,
    });

    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSelectedLoanId(null);
              setActivePage('loans');
            }}
            title="Return to Loans Register"
          >
            <ArrowLeft size={14} />
            <span>Back to Loans</span>
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
                Loan Details
              </h2>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--color-navy-900)',
                  background: '#F6F8FA',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--color-border-subtle)',
                  fontSize: '0.8125rem',
                }}
              >
                {loan.id}
              </span>
              <StatusBadge status={loan.status} size="sm" />
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              {loan.memberName} • {loan.memberId} • {loan.department}
            </div>
          </div>
        </div>

        <div>
          {loan.status === 'Completed' ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-navy-900)',
                background: '#F6F8FA',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <CheckCircle2 size={16} />
              <span>Loan Account Fully Settled</span>
            </span>
          ) : (
            currentRole !== 'Trust Committee' && (
              <button
                className="btn btn-primary btn-sm"
                onClick={handleOpenRepaymentModal}
                title="Record a loan installment or foreclosure settlement"
              >
                <Plus size={14} />
                <span>Add Repayment</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Two-Column Grid: Loan Information & Repayment Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Card 1: Loan Information */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Loan Information</div>
              <div className="card-subtitle">Master account parameters and sanction record</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.8125rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Loan ID</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-navy-900)' }}>
                {loan.id}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Account Status</span>
              <div style={{ marginTop: '2px' }}>
                <StatusBadge status={loan.status} size="sm" />
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Member Name</span>
              <span style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>{loan.memberName}</span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Employee ID</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{loan.memberId}</span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Department</span>
              <span style={{ fontWeight: 500 }}>{loan.department}</span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Loan Purpose</span>
              <span style={{ fontWeight: 500 }}>{loan.purpose}</span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Sanctioned Principal</span>
              <span style={{ fontWeight: 700, color: 'var(--color-navy-900)' }} className="num">
                {formatCurrency(originalPrincipal)}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Interest Rate</span>
              <span style={{ fontWeight: 600 }}>{loan.interestRate}% per annum</span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Sanctioned Tenure</span>
              <span style={{ fontWeight: 600 }}>{loan.tenureMonths} Months</span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Monthly EMI</span>
              <span style={{ fontWeight: 600 }} className="num">
                {formatCurrency(
                  loan.monthlyEmi ||
                    Math.round(
                      (loan.requestedAmount * (1 + loan.interestRate / 100)) / (loan.tenureMonths || 24)
                    )
                )}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Application Date</span>
              <span style={{ fontWeight: 500 }}>{formatDate(loan.applicationDate)}</span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Sanction Date</span>
              <span style={{ fontWeight: 500 }}>{formatDate(sanctionDate)}</span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Disbursement Date</span>
              <span style={{ fontWeight: 500 }}>{formatDate(disbursementDate)}</span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Current Outstanding Principal</span>
              <span style={{ fontWeight: 700, color: loan.outstandingPrincipal > 0 ? 'var(--color-navy-900)' : 'inherit' }} className="num">
                {formatCurrency(loan.outstandingPrincipal)}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Current Outstanding Interest</span>
              <span style={{ fontWeight: 700, color: loan.outstandingInterest > 0 ? 'var(--color-navy-900)' : 'inherit' }} className="num">
                {formatCurrency(loan.outstandingInterest)}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Repayment Summary (Compact Financial Table) */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Repayment Summary</div>
              <div className="card-subtitle">Cumulative repayment position and liability standing</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: '#F8FAFC',
                borderRadius: '6px',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                Original Principal
              </span>
              <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-navy-900)' }} className="num">
                {formatCurrency(originalPrincipal)}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                Principal Repaid
              </span>
              <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-navy-900)' }} className="num">
                {formatCurrency(principalRepaid)}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                Interest Paid
              </span>
              <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-navy-900)' }} className="num">
                {formatCurrency(interestPaid)}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: '#F8FAFC',
                borderRadius: '6px',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                Total Repaid
              </span>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-navy-900)' }} className="num">
                {formatCurrency(totalRepaid)}
              </span>
            </div>

            <div style={{ height: '1px', background: 'var(--color-border-subtle)', margin: '4px 0' }} />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                Outstanding Principal
              </span>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-navy-900)' }} className="num">
                {formatCurrency(loan.outstandingPrincipal)}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                Outstanding Interest
              </span>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-navy-900)' }} className="num">
                {formatCurrency(loan.outstandingInterest)}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                background: '#F1F5F9',
                borderRadius: '6px',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
                Total Outstanding Balance
              </span>
              <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-navy-900)' }} className="num">
                {formatCurrency(loan.totalOutstanding)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Repayment History Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Repayment History</div>
            <div className="card-subtitle">Chronological ledger of recoveries and outstanding balance reduction</div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Showing {displayRepayments.length} recorded recoveries (newest first)
          </span>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Reference</th>
                <th className="align-right">Principal</th>
                <th className="align-right">Interest</th>
                <th className="align-right">Total Repayment</th>
                <th className="align-right">Outstanding</th>
              </tr>
            </thead>
            <tbody>
              {displayRepayments.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                    No repayment transactions recorded yet for this loan account.
                  </td>
                </tr>
              ) : (
                displayRepayments.map((rep) => (
                  <tr key={rep.id}>
                    <td style={{ fontWeight: 500 }}>{formatDate(rep.date)}</td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600 }}>
                        {rep.receiptNo}
                      </span>
                    </td>
                    <td className="align-right num">{formatCurrency(rep.principal)}</td>
                    <td className="align-right num">{formatCurrency(rep.interest)}</td>
                    <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-navy-900)' }}>
                      {formatCurrency(rep.total)}
                    </td>
                    <td className="align-right num" style={{ fontWeight: 600 }}>
                      {formatCurrency(rep.outstandingAtTime)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD REPAYMENT MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-dialog"
            style={{ maxWidth: '520px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <div className="modal-title">Record Loan Repayment</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {loan.id} • {loan.memberName} ({loan.memberId})
                </div>
              </div>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitRepayment}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Current Outstanding Status Box */}
                <div
                  style={{
                    background: '#F8FAFC',
                    padding: '12px 14px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border-subtle)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>
                      Remaining Principal
                    </span>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-navy-900)' }} className="num">
                      {formatCurrency(loan.outstandingPrincipal)}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>
                      Remaining Interest
                    </span>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-navy-900)' }} className="num">
                      {formatCurrency(loan.outstandingInterest)}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>
                      Total Payoff Balance
                    </span>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-navy-900)' }} className="num">
                      {formatCurrency(loan.totalOutstanding)}
                    </span>
                  </div>
                </div>

                {/* Validation Error Message */}
                {validationError && (
                  <div
                    style={{
                      background: '#FEF2F2',
                      border: '1px solid #FECACA',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8125rem',
                      color: '#991B1B',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                    }}
                  >
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{validationError}</span>
                  </div>
                )}

                {/* Foreclosure Checkbox */}
                <div
                  style={{
                    padding: '10px 12px',
                    background: isForeclosure ? '#F8FAFC' : '#FFFFFF',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border-subtle)',
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--color-navy-900)',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isForeclosure}
                      onChange={(e) => handleForeclosureChange(e.target.checked)}
                    />
                    <span>Foreclosure / Full Settlement</span>
                  </label>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px', margin: 0, paddingLeft: '22px' }}>
                    Select this option to fully close the loan account in a single transaction.
                  </p>
                </div>

                {/* Full Settlement Confirmation Box */}
                {isForeclosure && (
                  <div
                    style={{
                      background: '#F1F5F9',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: '6px',
                      padding: '12px 14px',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-navy-900)' }}>
                      Full Loan Settlement
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '4px', margin: 0 }}>
                      The entered repayment of {formatCurrency(loan.totalOutstanding)} will fully close this loan and set remaining principal and interest to zero once recorded.
                    </p>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '10px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: 'var(--color-navy-900)',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={foreclosureConfirmed}
                        onChange={(e) => {
                          setForeclosureConfirmed(e.target.checked);
                          setValidationError(null);
                        }}
                      />
                      <span>I confirm full settlement and closure of loan {loan.id}</span>
                    </label>
                  </div>
                )}

                {/* Form Fields: Repayment Amount */}
                <div className="form-group">
                  <label className="form-label">
                    Repayment Amount (₹) <span style={{ color: 'var(--color-danger-text)' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    value={repaymentAmount}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRepaymentAmount(val);
                      // If user hasn't split it yet or if foreclosure, keep synced
                      if (isForeclosure) {
                        setPrincipalComponent(String(loan.outstandingPrincipal));
                        setInterestComponent(String(loan.outstandingInterest));
                      }
                    }}
                    required
                    placeholder="Enter total amount paid"
                  />
                </div>

                {/* Form Fields: Principal & Interest Split */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">
                      Principal Component (₹) <span style={{ color: 'var(--color-danger-text)' }}>*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-input"
                      value={principalComponent}
                      disabled={isForeclosure}
                      onChange={(e) => {
                        const pVal = e.target.value;
                        setPrincipalComponent(pVal);
                        const pNum = Number(pVal) || 0;
                        const totalNum = Number(repaymentAmount) || 0;
                        if (totalNum >= pNum) {
                          setInterestComponent(String(totalNum - pNum));
                        }
                      }}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Interest Component (₹) <span style={{ color: 'var(--color-danger-text)' }}>*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-input"
                      value={interestComponent}
                      disabled={isForeclosure}
                      onChange={(e) => {
                        const iVal = e.target.value;
                        setInterestComponent(iVal);
                        const iNum = Number(iVal) || 0;
                        const totalNum = Number(repaymentAmount) || 0;
                        if (totalNum >= iNum) {
                          setPrincipalComponent(String(totalNum - iNum));
                        }
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Form Fields: Date & Reference */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">
                      Repayment Date <span style={{ color: 'var(--color-danger-text)' }}>*</span>
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      value={repaymentDate}
                      onChange={(e) => setRepaymentDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Reference / Transaction ID</label>
                    <input
                      type="text"
                      className="form-input"
                      value={referenceNo}
                      onChange={(e) => setReferenceNo(e.target.value)}
                      placeholder="e.g. RCP-2026-881 / UTR-9821"
                    />
                  </div>
                </div>

                {/* Remarks */}
                <div className="form-group">
                  <label className="form-label">Remarks (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="e.g. Monthly payroll deduction recovery"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>Save Repayment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
