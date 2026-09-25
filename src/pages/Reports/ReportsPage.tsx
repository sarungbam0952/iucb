import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Search,
  Filter,
  Landmark,
  FileText,
  CreditCard,
  Award,
  Calendar,
  History,
  ArrowRight,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const ReportsPage: React.FC = () => {
  const {
    members,
    loans,
    advances,
    retirements,
    auditLogs,
    formatCurrency,
    setSelectedMemberId,
    setActivePage,
  } = useApp();

  const [activeReport, setActiveReport] = useState<
    'fund-pool' | 'member-statements' | 'loan-register' | 'advance-tracker' | 'retirement-pipeline' | 'audit-report'
  >('fund-pool');

  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('FY 2026-27 (Current)');

  // Print Report Handler
  const handlePrint = () => {
    window.print();
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    let headers = '';
    let rows = '';

    if (activeReport === 'fund-pool') {
      headers = 'Component,Recorded Value,Share Percentage,Notes\n';
      rows = [
        `"Liquid Bank Reserves",33450000,"62.8%","In current and term bank accounts"`,
        `"Accrued Interest Receivables",14040000,"26.4%","Calculated FD-maturity returns"`,
        `"Member Loan Principal",5750000,"10.8%","Active borrowing against PF balance"`,
        `"Total Central Pool",53240000,"100%","Consolidated pool as on 22 Sep 2026"`,
      ].join('\n');
    } else if (activeReport === 'loan-register') {
      headers = 'Loan ID,Member Name,Employee ID,Sanctioned Amount,Outstanding Principal,Interest Rate,Application Date,Status,Ageing\n';
      rows = loans.map((l) =>
        `"${l.id}","${l.memberName}","${l.memberId}",${l.requestedAmount},${l.outstandingPrincipal},${l.interestRate}%,"${l.applicationDate}","${l.status}","Standard (Active)"`
      ).join('\n');
    } else if (activeReport === 'member-statements') {
      headers = 'Employee ID,Member Name,Department,Joining Date,Basic Salary,Contrib Rate,Current Balance,Loan Liability\n';
      rows = members.map((m) =>
        `"${m.id}","${m.fullName}","${m.department}","${m.dateOfJoining}",${m.salary},${m.contributionPercentage}%,${m.currentBalance},${m.outstandingLoan}`
      ).join('\n');
    } else if (activeReport === 'advance-tracker') {
      headers = 'Member,Employee ID,Department,Joining Date,Service Years,Eligibility Date,Status,Granted Amount\n';
      rows = advances.map((a) =>
        `"${a.memberName}","${a.memberId}","${a.department}","${a.joiningDate}",${a.yearsOfService},"${a.eligibilityDate}","${a.advanceStatus}",${a.grantedAmount || 0}`
      ).join('\n');
    } else if (activeReport === 'retirement-pipeline') {
      headers = 'Member Name,Employee ID,Department,Superannuation Date,Principal Contributed,Accrued Interest,Estimated Settlement,Status\n';
      rows = retirements.map((r) =>
        `"${r.memberName}","${r.employeeId}","${r.department}","${r.retirementDate}",${r.totalContribution},${r.accruedInterest},${r.settlementAmount},"${r.status}"`
      ).join('\n');
    } else {
      headers = 'Timestamp,User,Role,Action,Module,Record ID,Previous Value,New Value\n';
      rows = auditLogs.map((al) =>
        `"${al.timestamp}","${al.user}","${al.role}","${al.action}","${al.module}","${al.recordId}","${al.previousValue}","${al.newValue}"`
      ).join('\n');
    }

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IUCB_Report_${activeReport}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            Financial Reports & Statements — Overview & Exports
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Central reporting engine for Trust Board, Audit Committee, and Individual Member statements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
            <Printer size={14} />
            <span>Print Report</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleExportCSV}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 6 REPORT SELECTOR TILES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
        {[
          { key: 'fund-pool', target: 'reports-fund-pool', title: 'Fund Pool Overview', icon: Landmark, desc: 'Central corpus balance' },
          { key: 'member-statements', target: 'reports-member-statements', title: 'Member Statements', icon: FileText, desc: 'Passbook summaries' },
          { key: 'loan-register', target: 'reports-loan-register', title: 'Loan Register', icon: CreditCard, desc: 'Ageing & recoveries' },
          { key: 'advance-tracker', target: 'reports-18-year-advance', title: '18-Yr Advance Tracker', icon: Award, desc: 'Unbroken service' },
          { key: 'retirement-pipeline', target: 'reports-retirement-pipeline', title: 'Retirement Pipeline', icon: Calendar, desc: 'Superannuation' },
          { key: 'audit-report', target: 'reports-audit-trail', title: 'Audit Trail Report', icon: History, desc: 'Compliance log' },
        ].map((rep) => {
          const Icon = rep.icon;
          const isSelected = activeReport === rep.key;
          return (
            <div
              key={rep.key}
              onClick={() => setActiveReport(rep.key as any)}
              className="card"
              style={{
                padding: '12px',
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--color-navy-900)' : 'var(--color-border-subtle)',
                background: isSelected ? 'var(--color-navy-900)' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Icon size={16} color={isSelected ? '#60A5FA' : 'var(--color-navy-700)'} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{rep.title}</span>
              </div>
              <span style={{ fontSize: '0.6875rem', color: isSelected ? '#CBD5E1' : 'var(--color-text-muted)' }}>
                {rep.desc}
              </span>
            </div>
          );
        })}
      </div>

      {/* FILTER & DATE CONTROLS */}
      <div className="table-toolbar">
        <div className="toolbar-search">
          <div className="toolbar-search-icon">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="toolbar-search-input"
            placeholder="Search report entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="toolbar-filters">
          <select
            className="toolbar-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="FY 2026-27 (Current)">FY 2026-27 (Current)</option>
            <option value="FY 2025-26">FY 2025-26</option>
            <option value="Last 12 Months">Last 12 Months</option>
            <option value="All Time">All Time</option>
          </select>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              const targetPage =
                activeReport === 'fund-pool' ? 'reports-fund-pool' :
                activeReport === 'member-statements' ? 'reports-member-statements' :
                activeReport === 'loan-register' ? 'reports-loan-register' :
                activeReport === 'advance-tracker' ? 'reports-18-year-advance' :
                activeReport === 'retirement-pipeline' ? 'reports-retirement-pipeline' :
                'reports-audit-trail';
              setActivePage(targetPage as any);
            }}
            title="Open full dedicated report page"
          >
            <ExternalLink size={13} />
            <span>Open Dedicated Page</span>
          </button>
        </div>
      </div>

      {/* REPORT CONTENT TABLES */}
      <div className="card">
        {/* REPORT 1: FUND POOL OVERVIEW */}
        {activeReport === 'fund-pool' && (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Financial Component</th>
                  <th className="align-right">Recorded Value (₹)</th>
                  <th className="align-center">Share (%)</th>
                  <th>Institutional Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>Liquid Bank Reserves & Cash in Bank</td>
                  <td className="align-right num" style={{ fontWeight: 700 }}>{formatCurrency(33450000)}</td>
                  <td className="align-center">62.8%</td>
                  <td>Held in Imphal Urban Co-op Bank term & current trust accounts</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Accrued Interest Receivables</td>
                  <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-burgundy-700)' }}>{formatCurrency(14040000)}</td>
                  <td className="align-center">26.4%</td>
                  <td>Compound interest return yield calculated on FD-maturity basis</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Member Loan Principal Outstanding</td>
                  <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-navy-700)' }}>{formatCurrency(5750000)}</td>
                  <td className="align-center">10.8%</td>
                  <td>Active member borrowing secured against individual PF balances</td>
                </tr>
                <tr style={{ background: '#F8FAFC', fontWeight: 800 }}>
                  <td style={{ color: 'var(--color-navy-900)' }}>TOTAL CONSOLIDATED TRUST FUND POOL</td>
                  <td className="align-right num" style={{ fontSize: '1.0625rem', color: 'var(--color-navy-900)' }}>{formatCurrency(53240000)}</td>
                  <td className="align-center">100.0%</td>
                  <td>Audited closing balance as on 22 Sep 2026</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* REPORT 2: MEMBER STATEMENTS */}
        {activeReport === 'member-statements' && (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Member Name</th>
                  <th>Department</th>
                  <th>Date of Joining</th>
                  <th className="align-right">Basic Salary</th>
                  <th className="align-right">Current PF Balance</th>
                  <th>Loan Status</th>
                  <th className="align-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.slice(0, 15).map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{m.id}</td>
                    <td style={{ fontWeight: 600 }}>{m.fullName}</td>
                    <td>{m.department}</td>
                    <td>{m.dateOfJoining}</td>
                    <td className="align-right num">{formatCurrency(m.salary)}</td>
                    <td className="align-right num" style={{ fontWeight: 700 }}>{formatCurrency(m.currentBalance)}</td>
                    <td>
                      {m.hasLoan ? <span className="badge badge-pending">Active Loan</span> : <span className="badge badge-neutral">No Loan</span>}
                    </td>
                    <td className="align-right">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSelectedMemberId(m.id);
                          setActivePage('ledger');
                        }}
                      >
                        Print Passbook
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORT 3: LOAN REGISTER */}
        {activeReport === 'loan-register' && (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Loan ID</th>
                  <th>Member</th>
                  <th>Department</th>
                  <th className="align-right">Sanction Amount</th>
                  <th className="align-right">Outstanding Principal</th>
                  <th>Sanction Date</th>
                  <th>Interest Rate</th>
                  <th>Ageing / Standing</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((l) => (
                  <tr key={l.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{l.id}</td>
                    <td style={{ fontWeight: 600 }}>{l.memberName}</td>
                    <td>{l.department}</td>
                    <td className="align-right num">{formatCurrency(l.requestedAmount)}</td>
                    <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-danger-text)' }}>
                      {formatCurrency(l.outstandingPrincipal)}
                    </td>
                    <td>{l.applicationDate}</td>
                    <td>{l.interestRate}%</td>
                    <td><span className="badge badge-approved">Standard (No Arrears)</span></td>
                    <td><StatusBadge status={l.status} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORT 4: 18-YEAR ADVANCE TRACKER */}
        {activeReport === 'advance-tracker' && (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Employee ID</th>
                  <th>Joining Date</th>
                  <th>Service Length</th>
                  <th>Eligibility Date</th>
                  <th>Status</th>
                  <th className="align-right">Sanctioned Amount</th>
                </tr>
              </thead>
              <tbody>
                {advances.map((a) => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600 }}>{a.memberName}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{a.memberId}</td>
                    <td>{a.joiningDate}</td>
                    <td>{a.yearsOfService} Years</td>
                    <td>{a.eligibilityDate}</td>
                    <td><StatusBadge status={a.advanceStatus} size="sm" /></td>
                    <td className="align-right num" style={{ fontWeight: 700 }}>
                      {a.grantedAmount ? formatCurrency(a.grantedAmount) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORT 5: RETIREMENT PIPELINE */}
        {activeReport === 'retirement-pipeline' && (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Superannuation Date</th>
                  <th className="align-right">Contributed Corpus</th>
                  <th className="align-right">Accrued Interest</th>
                  <th className="align-right">Total Payable</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {retirements.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.memberName}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{r.employeeId}</td>
                    <td>{r.department}</td>
                    <td style={{ fontWeight: 600 }}>{r.retirementDate}</td>
                    <td className="align-right num">{formatCurrency(r.totalContribution)}</td>
                    <td className="align-right num" style={{ color: 'var(--color-burgundy-700)' }}>{formatCurrency(r.accruedInterest)}</td>
                    <td className="align-right num" style={{ fontWeight: 700 }}>{formatCurrency(r.settlementAmount)}</td>
                    <td><StatusBadge status={r.status} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORT 6: AUDIT TRAIL REPORT */}
        {activeReport === 'audit-report' && (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Action</th>
                  <th>Module</th>
                  <th>Record ID</th>
                  <th>Summary of Change</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((al) => (
                  <tr key={al.id}>
                    <td style={{ fontSize: '0.75rem' }}>{al.timestamp}</td>
                    <td style={{ fontWeight: 600 }}>{al.user}</td>
                    <td><span className="badge badge-neutral">{al.role}</span></td>
                    <td><StatusBadge status={al.action} size="sm" /></td>
                    <td>{al.module}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{al.recordId}</td>
                    <td>{al.details || `${al.previousValue} → ${al.newValue}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
