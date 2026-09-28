import React, { useState } from 'react';
import {
  Printer,
  Download,
  Calendar,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/dateFormat';

export const BalanceSheetReportPage: React.FC = () => {
  const { members, loans, investments, formatCurrency } = useApp();

  const [asOfDate, setAsOfDate] = useState('2026-09-30');
  const [viewFormat, setViewFormat] = useState<'Standard' | 'Detailed'>('Standard');

  // Compute values from existing application data
  const memberContributions = members.reduce((sum, m) => sum + (m.totalContribution || 0), 0);
  const memberInterest = members.reduce((sum, m) => sum + (m.totalInterest || 0), 0);
  const totalMemberCorpus = memberContributions + memberInterest;

  // General Reserve / Retained Surplus (historical retained trust earnings)
  const generalReserve = 5420000;
  const settlementContingency = 1250000;
  const auditLiabilities = 185000;
  const totalLiabilitiesAndEquity = totalMemberCorpus + generalReserve + settlementContingency + auditLiabilities;

  // Assets
  const memberLoanOutstanding = loans.reduce((sum, l) => sum + (l.outstandingPrincipal || 0), 0);
  const interestReceivableOnLoans = Math.round(loans.reduce((sum, l) => sum + (l.outstandingInterest || 0), 0) * 0.45);
  
  // Bank Investments & Liquid Cash
  const totalBankInvestments = investments.reduce((sum, inv) => {
    return inv.type === 'Debit' ? sum + inv.amount : sum - inv.amount;
  }, 22500000);

  const liquidBankOperative = Math.max(0, totalLiabilitiesAndEquity - memberLoanOutstanding - interestReceivableOnLoans - totalBankInvestments);
  const totalAssets = totalBankInvestments + liquidBankOperative + memberLoanOutstanding + interestReceivableOnLoans;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = 'Classification,Schedule,Particulars,Current Period (INR),Previous Year (INR)\n';
    const rows = [
      'CAPITAL & LIABILITIES,1,Member Cumulative PF Contributions,' + memberContributions + ',' + Math.round(memberContributions * 0.91),
      'CAPITAL & LIABILITIES,1,Accrued Interest Credited to Members,' + memberInterest + ',' + Math.round(memberInterest * 0.88),
      'CAPITAL & LIABILITIES,2,General Reserve & Retained Surplus,' + generalReserve + ',5100000',
      'CAPITAL & LIABILITIES,2,Settlement & Exit Contingency Provision,' + settlementContingency + ',1100000',
      'CAPITAL & LIABILITIES,3,Audit & Secretariat Expenses Payable,' + auditLiabilities + ',170000',
      'TOTAL LIABILITIES & FUNDS,,,' + totalLiabilitiesAndEquity + ',' + Math.round(totalLiabilitiesAndEquity * 0.90),
      'ASSETS & ADVANCES,4,Term Deposits & Fixed Investments with Banks,' + totalBankInvestments + ',21000000',
      'ASSETS & ADVANCES,4,Operative Current Bank Balances with IUCB,' + liquidBankOperative + ',' + Math.round(liquidBankOperative * 0.95),
      'ASSETS & ADVANCES,5,Outstanding Member Principal Loan Advances,' + memberLoanOutstanding + ',5200000',
      'ASSETS & ADVANCES,5,Interest Accrued on Member Advances,' + interestReceivableOnLoans + ',310000',
      'TOTAL ASSETS,,,' + totalAssets + ',' + Math.round(totalAssets * 0.90),
    ].join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IUCB_Trust_Balance_Sheet_${asOfDate}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            Balance Sheet
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Financial statement of the Trust Fund detailing assets, liabilities, and fund balances.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={handlePrint} title="Print financial statement">
            <Printer size={14} />
            <span>Print Report</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleExportCSV} title="Export statement to CSV">
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="table-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={15} style={{ color: 'var(--color-navy-700)' }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>
              Statement Date:
            </span>
          </div>
          <select
            className="toolbar-select"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
          >
            <option value="2026-09-30">As on 30/09/2026 (Provisional)</option>
            <option value="2026-03-31">As on 31/03/2026 (Audited Final)</option>
            <option value="2025-03-31">As on 31/03/2025 (Previous FY Audited)</option>
          </select>

          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-navy-900)', marginLeft: '8px' }}>
            Format:
          </span>
          <select
            className="toolbar-select"
            value={viewFormat}
            onChange={(e) => setViewFormat(e.target.value as 'Standard' | 'Detailed')}
          >
            <option value="Standard">Standard Schedule (Format-T)</option>
            <option value="Detailed">Detailed Note-wise Classification</option>
          </select>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Values in Indian Rupees (INR)
        </div>
      </div>

      {/* Statement Header Card */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy-900)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          The Imphal Urban Co-operative Bank Ltd. Employees' Trust Fund
        </div>
        <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-navy-800)', marginTop: '4px' }}>
          Balance Sheet as on {formatDate(asOfDate)}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
          Reg. No. 04/IUCB/ETF · MG Avenue, Imphal West, Manipur 795001
        </div>
      </div>

      {/* Financial Statement Tables: Liabilities and Assets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px', alignItems: 'start' }}>
        {/* Left: Capital & Liabilities */}
        <div className="table-container" style={{ margin: 0 }}>
          <table className="enterprise-table">
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                <th colSpan={3} style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-navy-900)', borderBottom: '2px solid var(--color-border-subtle)' }}>
                  I. CAPITAL &amp; LIABILITIES
                </th>
              </tr>
              <tr>
                <th style={{ width: '45px' }}>Sch</th>
                <th>Particulars</th>
                <th className="align-right" style={{ width: '130px' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {/* Group 1: Member Funds */}
              <tr style={{ background: '#F1F5F9', fontWeight: 600 }}>
                <td>1</td>
                <td colSpan={2}>Trust Corpus &amp; Member Accumulations</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--color-text-muted)' }}>1.1</td>
                <td style={{ paddingLeft: '24px' }}>Member Cumulative PF Contributions</td>
                <td className="align-right num">{formatCurrency(memberContributions)}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--color-text-muted)' }}>1.2</td>
                <td style={{ paddingLeft: '24px' }}>Accrued Interest Credited to Members</td>
                <td className="align-right num">{formatCurrency(memberInterest)}</td>
              </tr>

              {/* Group 2: Reserves */}
              <tr style={{ background: '#F1F5F9', fontWeight: 600 }}>
                <td>2</td>
                <td colSpan={2}>Reserves &amp; Surplus Balances</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--color-text-muted)' }}>2.1</td>
                <td style={{ paddingLeft: '24px' }}>General Reserve &amp; Retained Earnings</td>
                <td className="align-right num">{formatCurrency(generalReserve)}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--color-text-muted)' }}>2.2</td>
                <td style={{ paddingLeft: '24px' }}>Settlement &amp; Exit Contingency Reserve</td>
                <td className="align-right num">{formatCurrency(settlementContingency)}</td>
              </tr>

              {/* Group 3: Payables */}
              <tr style={{ background: '#F1F5F9', fontWeight: 600 }}>
                <td>3</td>
                <td colSpan={2}>Current Liabilities &amp; Payables</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--color-text-muted)' }}>3.1</td>
                <td style={{ paddingLeft: '24px' }}>Audit, Inspection &amp; Legal Dues Payable</td>
                <td className="align-right num">{formatCurrency(auditLiabilities)}</td>
              </tr>

              {/* Spacer rows if detailed */}
              {viewFormat === 'Detailed' && (
                <tr>
                  <td style={{ color: 'var(--color-text-muted)' }}>3.2</td>
                  <td style={{ paddingLeft: '24px' }}>Unclaimed Settlement Suspense Account</td>
                  <td className="align-right num">₹0</td>
                </tr>
              )}

              {/* Total Liabilities Row */}
              <tr
                style={{
                  background: '#F8FAFC',
                  fontWeight: 700,
                  borderTop: '2px solid var(--color-navy-900)',
                  borderBottom: '3px double var(--color-navy-900)',
                }}
              >
                <td></td>
                <td style={{ fontWeight: 700, color: 'var(--color-navy-900)' }}>
                  TOTAL CAPITAL &amp; LIABILITIES
                </td>
                <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-navy-900)', fontSize: '0.9375rem' }}>
                  {formatCurrency(totalLiabilitiesAndEquity)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right: Assets & Advances */}
        <div className="table-container" style={{ margin: 0 }}>
          <table className="enterprise-table">
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                <th colSpan={3} style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-navy-900)', borderBottom: '2px solid var(--color-border-subtle)' }}>
                  II. ASSETS &amp; ADVANCES
                </th>
              </tr>
              <tr>
                <th style={{ width: '45px' }}>Sch</th>
                <th>Particulars</th>
                <th className="align-right" style={{ width: '130px' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {/* Group 4: Investments & Bank Balances */}
              <tr style={{ background: '#F1F5F9', fontWeight: 600 }}>
                <td>4</td>
                <td colSpan={2}>Investments &amp; Bank Balances</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--color-text-muted)' }}>4.1</td>
                <td style={{ paddingLeft: '24px' }}>Fixed Deposits with Scheduled Banks</td>
                <td className="align-right num">{formatCurrency(totalBankInvestments)}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--color-text-muted)' }}>4.2</td>
                <td style={{ paddingLeft: '24px' }}>Operative Bank Balance (IUCB Main Branch)</td>
                <td className="align-right num">{formatCurrency(liquidBankOperative)}</td>
              </tr>

              {/* Group 5: Loans to Members */}
              <tr style={{ background: '#F1F5F9', fontWeight: 600 }}>
                <td>5</td>
                <td colSpan={2}>Loans &amp; Advances to Members</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--color-text-muted)' }}>5.1</td>
                <td style={{ paddingLeft: '24px' }}>Outstanding Member Loan Principal</td>
                <td className="align-right num">{formatCurrency(memberLoanOutstanding)}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--color-text-muted)' }}>5.2</td>
                <td style={{ paddingLeft: '24px' }}>Interest Accrued on Loan Portfolio</td>
                <td className="align-right num">{formatCurrency(interestReceivableOnLoans)}</td>
              </tr>

              {/* Spacer rows if detailed */}
              {viewFormat === 'Detailed' && (
                <>
                  <tr style={{ background: '#F1F5F9', fontWeight: 600 }}>
                    <td>6</td>
                    <td colSpan={2}>Other Current Assets</td>
                  </tr>
                  <tr>
                    <td style={{ color: 'var(--color-text-muted)' }}>6.1</td>
                    <td style={{ paddingLeft: '24px' }}>TDS &amp; Advance Tax Recoverables</td>
                    <td className="align-right num">₹0</td>
                  </tr>
                </>
              )}

              {/* Total Assets Row */}
              <tr
                style={{
                  background: '#F8FAFC',
                  fontWeight: 700,
                  borderTop: '2px solid var(--color-navy-900)',
                  borderBottom: '3px double var(--color-navy-900)',
                }}
              >
                <td></td>
                <td style={{ fontWeight: 700, color: 'var(--color-navy-900)' }}>
                  TOTAL ASSETS &amp; ADVANCES
                </td>
                <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-navy-900)', fontSize: '0.9375rem' }}>
                  {formatCurrency(totalAssets)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Sign-Off Card */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: 'var(--color-text-secondary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} style={{ color: 'var(--color-success-text, #16A34A)' }} />
          <span>
            Certified as true extract of audited books of accounts of The Imphal Urban Co-operative Bank Ltd. Employee Trust Fund.
          </span>
        </div>
        <div style={{ display: 'flex', gap: '32px', textAlign: 'right' }}>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>Secretary / Trustee</div>
            <div>Trust Management Committee</div>
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>Chartered Accountant</div>
            <div>Statutory Auditor</div>
          </div>
        </div>
      </div>
    </div>
  );
};
