import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  FileCheck,
  Eye,
  X,
  ShieldCheck,
  Building2,
  Calculator,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { KpiCard } from '../../components/common/KpiCard';
import { ActionMenu } from '../../components/common/ActionMenu';
import { RetirementSettlement } from '../../types';
import { formatDate } from '../../utils/dateFormat';

export const RetirementSettlementPage: React.FC = () => {
  const { retirements, formatCurrency, currentRole, setSelectedMemberId, setActivePage } = useApp();

  const [activeModalRetirement, setActiveModalRetirement] = useState<RetirementSettlement | null>(null);

  // Summary Metrics
  const upcomingCount = retirements.filter((r) => r.status === 'Upcoming').length;
  const pendingCount = retirements.filter((r) => r.status === 'Calculation Pending' || r.status === 'Under Review').length;
  const completedCount = retirements.filter((r) => r.status === 'Approved' || r.status === 'Settled').length;
  const totalSettlementVal = retirements.reduce((acc, r) => acc + r.settlementAmount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            Retirement Settlement Pipeline
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Superannuation forecast and settlement calculation (Member Contributions + Applicable FD-Maturity Style Interest).
          </p>
        </div>
      </div>

      {/* 4 SUMMARY METRICS */}
      <div className="kpi-grid">
        <KpiCard
          label="Upcoming Retirements"
          value={upcomingCount}
          icon={Calendar}
          desc="Scheduled within next 36 months"
        />

        <KpiCard
          label="Pending Settlements"
          value={pendingCount}
          icon={Clock}
          desc="Awaiting committee certification"
        />

        <KpiCard
          label="Completed Settlements"
          value={completedCount}
          icon={CheckCircle2}
          desc="Approved and finalized records"
        />

        <KpiCard
          label="Total Estimated Settlement"
          value={formatCurrency(totalSettlementVal)}
          icon={Building2}
          desc="Total projected payout pipeline"
        />
      </div>

      {/* OPEN BUSINESS QUESTION ALERT */}
      <div
        style={{
          background: '#F8FAFC',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: '8px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <Calculator size={20} color="var(--color-navy-700)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
          <strong>Settlement Formula Standard:</strong> Per the Trust Scheme SOW, the retirement settlement represents <strong>100% of member's contributed amount plus applicable interest calculated on an FD-maturity-style basis</strong>. Interest parameters are configurable in System Settings pending final client rule confirmation.
        </div>
      </div>

      {/* TABLE */}
      <div className="table-container">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Member Name</th>
              <th>Employee ID</th>
              <th>Department</th>
              <th>Retirement Date</th>
              <th className="align-right">Principal Contribution</th>
              <th className="align-right">Accrued Interest</th>
              <th className="align-right">Settlement Amount</th>
              <th>Status</th>
              <th className="align-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {retirements.map((ret) => (
              <tr key={ret.id}>
                <td style={{ fontWeight: 600 }}>{ret.memberName}</td>
                <td>
                  <span
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-navy-900)', cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedMemberId(ret.memberId);
                      setActivePage('member-profile');
                    }}
                  >
                    {ret.employeeId}
                  </span>
                </td>
                <td>{ret.department}</td>
                <td style={{ fontWeight: 600 }}>{formatDate(ret.retirementDate)}</td>
                <td className="align-right num">{formatCurrency(ret.totalContribution)}</td>
                <td className="align-right num" style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>
                  {formatCurrency(ret.accruedInterest)}
                </td>
                <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-navy-900)' }}>
                  {formatCurrency(ret.settlementAmount)}
                </td>
                <td>
                  <StatusBadge status={ret.status} size="sm" />
                </td>
                <td className="align-right">
                  <ActionMenu
                    primaryAction={{
                      label: 'Breakdown',
                      icon: Eye,
                      onClick: () => setActiveModalRetirement(ret),
                      title: 'Calculation Breakdown',
                    }}
                    secondaryActions={[
                      {
                        label: 'Member Profile',
                        icon: UserCheck,
                        onClick: () => {
                          setSelectedMemberId(ret.memberId);
                          setActivePage('member-profile');
                        },
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SETTLEMENT DETAILS MODAL */}
      {activeModalRetirement && (
        <div className="modal-backdrop" onClick={() => setActiveModalRetirement(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <div className="modal-title">Retirement Settlement Calculation Sheet</div>
              <button className="btn-close" onClick={() => setActiveModalRetirement(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.8125rem' }}>
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '6px', border: '1px solid var(--color-border-subtle)' }}>
                <div><strong>Employee:</strong> {activeModalRetirement.memberName} ({activeModalRetirement.employeeId})</div>
                <div><strong>Department:</strong> {activeModalRetirement.department}</div>
                <div><strong>Effective Superannuation Date:</strong> {formatDate(activeModalRetirement.retirementDate)}</div>
                <div><strong>Status:</strong> <StatusBadge status={activeModalRetirement.status} size="sm" /></div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-navy-900)', marginBottom: '8px' }}>
                  Calculation Breakdown (FD-Maturity Style)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid var(--color-border-subtle)', borderRadius: '6px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>A. Total Accumulated Member Contributions:</span>
                    <strong className="num">{formatCurrency(activeModalRetirement.totalContribution)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>B. Applicable Compound Interest Earnings:</span>
                    <strong className="num" style={{ color: 'var(--color-burgundy-700)' }}>+{formatCurrency(activeModalRetirement.accruedInterest)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '8px', marginTop: '4px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-navy-900)' }}>Total Payable Settlement (A + B):</span>
                    <strong className="num" style={{ fontSize: '1.125rem', color: 'var(--color-navy-900)' }}>
                      {formatCurrency(activeModalRetirement.settlementAmount)}
                    </strong>
                  </div>
                </div>
              </div>

              <div style={{ background: '#FFFBEB', padding: '10px 12px', borderRadius: '6px', border: '1px solid #FDE68A', fontSize: '0.75rem', color: '#92400E' }}>
                <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                <strong>System of Record Boundary:</strong> This record certifies the final calculated entitlement for Trust Board sign-off. Settlement disbursement to the employee's bank account is executed manually through normal bank operations.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setActiveModalRetirement(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
