import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { WithdrawalRecord } from '../../types';
import { formatDate } from '../../utils/dateFormat';

interface WithdrawalDetailsProps {
  withdrawal: WithdrawalRecord;
  onBack: () => void;
}

export const WithdrawalDetails: React.FC<WithdrawalDetailsProps> = ({ withdrawal, onBack }) => {
  const { members, formatCurrency } = useApp();

  const member = members.find((m) => m.id === withdrawal.memberId);

  // Financial context values consistent with mock data
  const balanceAfter = member ? member.currentBalance : 450000;
  const balanceBefore = balanceAfter + withdrawal.amount;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onBack}
            title="Return to Withdrawals Register"
          >
            <ArrowLeft size={14} />
            <span>Back to Withdrawals</span>
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
                Withdrawal Details
              </h2>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--color-burgundy-700)',
                  background: 'var(--color-burgundy-50)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--color-burgundy-100)',
                  fontSize: '0.8125rem',
                }}
              >
                {withdrawal.referenceNo}
              </span>
              <StatusBadge status={withdrawal.status} size="sm" />
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              {withdrawal.memberName} • {withdrawal.memberId} • Transaction ID: {withdrawal.id}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Financial Context */}
      <div className="card" style={{ padding: '20px' }}>
        <div
          style={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: 'var(--color-navy-900)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '14px',
            borderBottom: '1px solid var(--color-border-subtle)',
            paddingBottom: '8px',
          }}
        >
          Transaction Financial Context
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div
            style={{
              background: '#F8FAFC',
              padding: '14px 16px',
              borderRadius: '6px',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                display: 'block',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                fontWeight: 600,
              }}
            >
              Withdrawal Amount
            </span>
            <strong
              className="num"
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-navy-900)',
                marginTop: '6px',
                display: 'block',
              }}
            >
              {formatCurrency(withdrawal.amount)}
            </strong>
          </div>

          <div
            style={{
              background: '#F8FAFC',
              padding: '14px 16px',
              borderRadius: '6px',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                display: 'block',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                fontWeight: 600,
              }}
            >
              PF Balance Before Withdrawal
            </span>
            <strong
              className="num"
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-navy-900)',
                marginTop: '6px',
                display: 'block',
              }}
            >
              {formatCurrency(balanceBefore)}
            </strong>
          </div>

          <div
            style={{
              background: '#F8FAFC',
              padding: '14px 16px',
              borderRadius: '6px',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                display: 'block',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                fontWeight: 600,
              }}
            >
              PF Balance After Withdrawal
            </span>
            <strong
              className="num"
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-navy-900)',
                marginTop: '6px',
                display: 'block',
              }}
            >
              {formatCurrency(balanceAfter)}
            </strong>
          </div>
        </div>
      </div>

      {/* Main Details Grid: Withdrawal Information & Member Information */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Section 1: Withdrawal Information */}
        <div className="card" style={{ padding: '20px' }}>
          <div
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--color-navy-900)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '16px',
              borderBottom: '1px solid var(--color-border-subtle)',
              paddingBottom: '8px',
            }}
          >
            Withdrawal Information
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              fontSize: '0.8125rem',
            }}
          >
            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Withdrawal Amount
              </span>
              <strong className="num" style={{ fontSize: '1rem', color: 'var(--color-navy-900)' }}>
                {formatCurrency(withdrawal.amount)}
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Withdrawal Type / Reason
              </span>
              <strong style={{ color: 'var(--color-navy-900)' }}>{withdrawal.withdrawalType}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Withdrawal Date
              </span>
              <strong style={{ color: 'var(--color-navy-900)' }}>{formatDate(withdrawal.date)}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Reference / Transaction ID
              </span>
              <strong
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-navy-900)',
                }}
              >
                {withdrawal.referenceNo}
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Status
              </span>
              <StatusBadge status={withdrawal.status} size="sm" />
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                System Record ID
              </span>
              <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
                {withdrawal.id}
              </strong>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Remarks
              </span>
              <div
                style={{
                  background: '#F8FAFC',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border-subtle)',
                  color: 'var(--color-navy-900)',
                  lineHeight: '1.5',
                }}
              >
                {withdrawal.remarks || 'No remarks recorded for this transaction.'}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Member Information */}
        <div className="card" style={{ padding: '20px' }}>
          <div
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--color-navy-900)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '16px',
              borderBottom: '1px solid var(--color-border-subtle)',
              paddingBottom: '8px',
            }}
          >
            Member Information
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              fontSize: '0.8125rem',
            }}
          >
            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Employee ID
              </span>
              <strong
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-burgundy-700)',
                }}
              >
                {member?.id || withdrawal.memberId}
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Member Name
              </span>
              <strong style={{ color: 'var(--color-navy-900)' }}>
                {member?.fullName || withdrawal.memberName}
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Department
              </span>
              <strong style={{ color: 'var(--color-navy-900)' }}>
                {member?.department || withdrawal.department}
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Designation
              </span>
              <strong style={{ color: 'var(--color-navy-900)' }}>
                {member?.designation || 'Staff Member'}
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Date of Joining
              </span>
              <strong style={{ color: 'var(--color-navy-900)' }}>
                {member?.dateOfJoining ? formatDate(member.dateOfJoining) : '—'}
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                PF Membership Number
              </span>
              <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-navy-900)' }}>
                {member?.id ? `PF-${member.id}` : `PF-${withdrawal.memberId}`}
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Contribution Percentage
              </span>
              <strong style={{ color: 'var(--color-navy-900)' }}>
                {member?.contributionPercentage ?? 10}%
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Current PF Balance
              </span>
              <strong
                className="num"
                style={{
                  fontSize: '1rem',
                  color: 'var(--color-navy-900)',
                }}
              >
                {formatCurrency(balanceAfter)}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
