import React from 'react';
import {
  Landmark,
  Users,
  CreditCard,
  PiggyBank,
  ArrowUpRight,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { KpiCard } from '../../components/common/KpiCard';
import { TrustFundGrowthChart, FundCompositionChart } from '../../components/common/FinancialChart';
import { formatDate, formatDateTime } from '../../utils/dateFormat';

export const Dashboard: React.FC = () => {
  const {
    members,
    loans,
    advances,
    retirements,
    auditLogs,
    formatCurrency,
    setActivePage,
    setSelectedLoanId,
    currentRole,
  } = useApp();

  // Aggregate metrics (intact existing data)
  const totalFundBalance = 53240000;
  const totalContributions = 39200000;
  const totalMembersCount = members.length;
  const activeMembersCount = members.filter((m) => m.accountStatus === 'Active').length;

  const totalOutstandingLoanAmount = loans
    .filter((l) => l.status === 'Active' || l.status === 'Pending Approval')
    .reduce((acc, l) => acc + (l.outstandingPrincipal || l.requestedAmount), 0);

  const pendingLoans = loans.filter((l) => l.status === 'Pending Approval' || l.status === 'Under Committee Review');
  const activeLoans = loans.filter((l) => l.status === 'Active');
  const completedLoans = loans.filter((l) => l.status === 'Completed');

  const eligibleAdvances = advances.filter((a) => a.advanceStatus === 'Eligible');
  const approachingAdvances = advances.filter((a) => a.advanceStatus === 'Approaching');
  const grantedAdvances = advances.filter((a) => a.advanceStatus === 'Granted');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Greeting Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--color-navy-900)', letterSpacing: '-0.02em', margin: 0 }}>
            Good morning, {currentRole === 'Admin' ? 'Admin' : currentRole === 'Data Entry' ? 'Kh. Tombi' : 'Committee Member'}
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '3px', margin: 0 }}>
            Here's an overview of the IUCB Employee Trust. Current recorded pool balance & member activity as of 22/09/2026.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage('reports-fund-pool')}
          >
            Generate Statements
          </button>
        </div>
      </div>

      {/* 4 PRIMARY KPI CARDS - UNIFIED INSTITUTIONAL FINANCIAL SUMMARY */}
      <div className="kpi-grid">
        <KpiCard
          label="Total Trust Fund"
          value={formatCurrency(totalFundBalance)}
          icon={Landmark}
          onClick={() => setActivePage('fund-pool')}
          trend={{ text: '+8.4%', type: 'positive' }}
          desc="Current recorded pool balance"
        />

        <KpiCard
          label="Total Members"
          value={totalMembersCount}
          icon={Users}
          onClick={() => setActivePage('members-all')}
          trend={{ text: '100%', type: 'positive' }}
          desc={`${activeMembersCount} Active Trust members`}
        />

        <KpiCard
          label="Total Contributions"
          value={formatCurrency(totalContributions)}
          icon={PiggyBank}
          onClick={() => setActivePage('contributions')}
          trend={{ text: '₹8.4L/mo', type: 'neutral' }}
          desc="Recorded member contributions"
        />

        <KpiCard
          label="Outstanding Loans"
          value={formatCurrency(totalOutstandingLoanAmount)}
          icon={CreditCard}
          onClick={() => setActivePage('loans')}
          desc={`${activeLoans.length} active • Current principal outstanding`}
        />
      </div>

      {/* CHARTS ROW: TRUST FUND OVERVIEW + FUND COMPOSITION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.65fr 1.15fr', gap: '20px' }}>
        <TrustFundGrowthChart formatCurrency={formatCurrency} />
        <FundCompositionChart formatCurrency={formatCurrency} />
      </div>

      {/* LOAN OVERVIEW SECTION */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Loan Overview & Active Claims</div>
            <div className="card-subtitle">Member loan claims recorded against PF contribution balances</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '2px 8px',
                  background: 'var(--color-warning-bg)',
                  border: '1px solid var(--color-warning-border)',
                  borderRadius: '4px',
                  color: 'var(--color-warning-text)',
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                }}
              >
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--color-warning-icon)' }}></span>
                <span>Pending: <strong>{pendingLoans.length}</strong></span>
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '2px 8px',
                  background: 'var(--color-bg-surface-subtle)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: '4px',
                  color: 'var(--color-navy-900)',
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                }}
              >
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--color-navy-900)' }}></span>
                <span>Active: <strong>{activeLoans.length}</strong></span>
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '2px 8px',
                  background: 'var(--color-success-bg)',
                  border: '1px solid var(--color-success-border)',
                  borderRadius: '4px',
                  color: 'var(--color-success-text)',
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                }}
              >
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--color-success-icon)' }}></span>
                <span>Completed: <strong>{completedLoans.length}</strong></span>
              </span>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActivePage('loans')}
            >
              <span>View All Loans</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Member</th>
                <th>Department</th>
                <th className="align-right">Amount</th>
                <th>Application Date</th>
                <th>Status</th>
                <th className="align-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loans.slice(0, 4).map((loan) => (
                <tr key={loan.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-navy-900)' }}>
                      {loan.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--color-text-primary)' }}>{loan.memberName}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)' }}>{loan.memberId}</div>
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{loan.department}</td>
                  <td className="align-right num" style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--color-text-primary)' }}>
                    {formatCurrency(loan.requestedAmount)}
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{formatDate(loan.applicationDate)}</td>
                  <td>
                    <StatusBadge status={loan.status} />
                  </td>
                  <td className="align-right">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setSelectedLoanId(loan.id);
                        setActivePage('loan-details');
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2 COLUMN SECTION: 18-YEAR ADVANCE & RETIREMENT PIPELINE */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* 18-Year Service Advance Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={17} color="var(--color-navy-700)" />
                <span>18-Year Service Advance</span>
              </div>
              <div className="card-subtitle">One-time interest-free advance qualification tracking</div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActivePage('advances')}
            >
              View Tracker
            </button>
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Stat Counters */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div style={{ padding: '10px 12px', background: '#FFFFFF', borderRadius: '6px', border: '1px solid var(--color-border-subtle)' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Eligible</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy-900)', marginTop: '2px', display: 'block' }} className="num">{eligibleAdvances.length}</span>
              </div>
              <div style={{ padding: '10px 12px', background: '#FFFFFF', borderRadius: '6px', border: '1px solid var(--color-border-subtle)' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Approaching</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy-900)', marginTop: '2px', display: 'block' }} className="num">{approachingAdvances.length}</span>
              </div>
              <div style={{ padding: '10px 12px', background: '#FFFFFF', borderRadius: '6px', border: '1px solid var(--color-border-subtle)' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Granted</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy-900)', marginTop: '2px', display: 'block' }} className="num">{grantedAdvances.length}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Members Approaching / Recently Eligible
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {advances.slice(0, 3).map((adv) => (
                  <div
                    key={adv.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '9px 12px',
                      borderRadius: '6px',
                      background: '#FFFFFF',
                      border: '1px solid var(--color-border-subtle)',
                      transition: 'border-color 0.12s ease',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>{adv.memberName}</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', marginTop: '1px' }}>
                        Joined {formatDate(adv.joiningDate)} • {adv.yearsOfService} Yrs of Service
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <StatusBadge status={adv.advanceStatus} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Retirement Pipeline Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={17} color="var(--color-navy-700)" />
                <span>Retirement Settlement Pipeline</span>
              </div>
              <div className="card-subtitle">Upcoming superannuations & settlement estimates</div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActivePage('retirement')}
            >
              View Pipeline
            </button>
          </div>

          <div className="card-body" style={{ padding: 0 }}>
            <table className="enterprise-table" style={{ border: 'none' }}>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Retirement Date</th>
                  <th className="align-right">Est. Settlement</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {retirements.map((ret) => (
                  <tr key={ret.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--color-text-primary)' }}>{ret.memberName}</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)' }}>{ret.employeeId}</div>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{formatDate(ret.retirementDate)}</td>
                    <td className="align-right num" style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--color-navy-900)' }}>
                      {formatCurrency(ret.settlementAmount)}
                    </td>
                    <td>
                      <StatusBadge status={ret.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY CHRONOLOGICAL FEED */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={17} color="var(--color-navy-700)" />
              <span>Chronological Activity Feed</span>
            </div>
            <div className="card-subtitle">Real-time audit log of contributions, loan claims, and master updates</div>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage('audit-trail')}
          >
            Complete Audit Log
          </button>
        </div>

        <div className="card-body" style={{ padding: '8px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {auditLogs.slice(0, 5).map((log, idx) => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '11px 0',
                  borderBottom: idx < 4 ? '1px solid var(--color-border-subtle)' : 'none',
                }}
              >
                <div style={{ minWidth: '130px', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  {formatDateTime(log.timestamp)}
                </div>
                <div style={{ minWidth: '90px' }}>
                  <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>{log.role}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-primary)' }}>
                    <strong style={{ color: 'var(--color-navy-900)', marginRight: '6px' }}>{log.user}</strong>
                    <span style={{ color: 'var(--color-text-secondary)', marginRight: '6px' }}>{log.action.toLowerCase()}</span>
                    <strong style={{ color: 'var(--color-burgundy-700)' }}>{log.module}</strong> record: <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{log.recordId}</span>
                  </div>
                  {log.details && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      {log.details}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                    {log.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
