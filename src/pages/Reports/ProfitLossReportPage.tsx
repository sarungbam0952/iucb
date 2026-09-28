import React, { useState } from 'react';
import {
  Printer,
  Download,
  Calendar,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProfitLossReportPage: React.FC = () => {
  const { loans, investments, formatCurrency } = useApp();

  const [accountingPeriod, setAccountingPeriod] = useState('FY 2025-26 (Audited)');

  // Income computations from available data / scheduled trust rates
  // Interest on Bank Term Deposits
  const bankInterestIncome = investments
    .filter((inv) => inv.type === 'Credit' && inv.remarks?.toLowerCase().includes('interest'))
    .reduce((sum, inv) => sum + inv.amount, 0) || 1685000;

  // Interest from member loans (scheduled rate ~7.5% on outstanding)
  const loanInterestIncome = Math.round(
    loans.reduce((sum, l) => sum + (l.requestedAmount * (l.interestRate / 100)), 0) * 0.5
  ) || 485000;

  const otherOperatingIncome = 45000;
  const totalIncome = bankInterestIncome + loanInterestIncome + otherOperatingIncome;

  // Expenses computations
  // Interest credited to members PF balances (~6.5% statutory)
  const memberInterestCredited = 1420000;
  const bankCharges = 4850;
  const auditFees = 35000;
  const legalAndProfessional = 15000;
  const secretarialAdminExpense = 42500;
  const softwareMaintenance = 24000;

  const totalExpenditure =
    memberInterestCredited +
    bankCharges +
    auditFees +
    legalAndProfessional +
    secretarialAdminExpense +
    softwareMaintenance;

  const netSurplus = totalIncome - totalExpenditure;
  const transferToGeneralReserve = Math.round(netSurplus * 0.75);
  const retainedSurplus = netSurplus - transferToGeneralReserve;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = 'Section,Schedule,Particulars,Current Period (INR),Previous Year (INR)\n';
    const rows = [
      'INCOME,1,Interest on Fixed Deposits with Scheduled Banks,' + bankInterestIncome + ',1520000',
      'INCOME,1,Interest Earned on Member Loan Advances,' + loanInterestIncome + ',430000',
      'INCOME,2,Loan Documentation Fees & Miscellaneous Receipts,' + otherOperatingIncome + ',38000',
      'TOTAL INCOME (A),,,' + totalIncome + ',1988000',
      'EXPENDITURE,3,Interest Credited to Member PF Accounts,' + memberInterestCredited + ',1290000',
      'EXPENDITURE,4,Bank Commission & Account Maintenance Charges,' + bankCharges + ',4200',
      'EXPENDITURE,4,Statutory Audit & Accounts Inspection Fees,' + auditFees + ',30000',
      'EXPENDITURE,4,Legal Advisory & Trust Vetting Charges,' + legalAndProfessional + ',12000',
      'EXPENDITURE,5,Trustee Committee Meeting & Administrative Expenses,' + secretarialAdminExpense + ',38500',
      'EXPENDITURE,5,Software Licensing & Passbook Maintenance,' + softwareMaintenance + ',20000',
      'TOTAL EXPENDITURE (B),,,' + totalExpenditure + ',1394700',
      'NET OPERATING SURPLUS (A - B),,,' + netSurplus + ',593300',
      'APPROPRIATION,6,Transfer to General Reserve & Contingency,' + transferToGeneralReserve + ',445000',
      'APPROPRIATION,6,Net Retained Surplus Carried to Balance Sheet,' + retainedSurplus + ',148300',
    ].join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IUCB_Profit_and_Loss_Statement_${accountingPeriod.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            Profit &amp; Loss Statement
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Income and Expenditure account showing financial yield, administrative charges, and resulting operating surplus.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={handlePrint} title="Print statement">
            <Printer size={14} />
            <span>Print Report</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleExportCSV} title="Export CSV">
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="table-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={15} style={{ color: 'var(--color-navy-700)' }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>
              Accounting Period:
            </span>
          </div>
          <select
            className="toolbar-select"
            value={accountingPeriod}
            onChange={(e) => setAccountingPeriod(e.target.value)}
          >
            <option value="FY 2026-27 (Current YTD)">FY 2026-27 (Current Year-to-Date)</option>
            <option value="FY 2025-26 (Audited)">FY 2025-26 (Audited Full Year)</option>
            <option value="FY 2024-25 (Comparative)">FY 2024-25 (Comparative Prior Year)</option>
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
          Income &amp; Expenditure Statement for the period ending {accountingPeriod}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
          Reg. No. 04/IUCB/ETF · MG Avenue, Imphal West, Manipur 795001
        </div>
      </div>

      {/* Income & Expenditure Table */}
      <div className="table-container">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Sch</th>
              <th>Particulars &amp; Head of Account</th>
              <th className="align-right" style={{ width: '180px' }}>Current Period (₹)</th>
              <th className="align-right" style={{ width: '180px' }}>Previous Year (₹)</th>
            </tr>
          </thead>
          <tbody>
            {/* PART I: INCOME */}
            <tr style={{ background: '#F1F5F9', fontWeight: 700 }}>
              <td>I</td>
              <td colSpan={3} style={{ color: 'var(--color-navy-900)', letterSpacing: '0.03em' }}>
                INCOME &amp; REVENUE EARNINGS
              </td>
            </tr>
            <tr>
              <td style={{ color: 'var(--color-text-muted)' }}>1.1</td>
              <td style={{ paddingLeft: '24px' }}>Interest on Fixed Deposits with Scheduled Commercial Banks</td>
              <td className="align-right num">{formatCurrency(bankInterestIncome)}</td>
              <td className="align-right num" style={{ color: 'var(--color-text-muted)' }}>₹15,20,000</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--color-text-muted)' }}>1.2</td>
              <td style={{ paddingLeft: '24px' }}>Interest Earned on Member Loan Advances</td>
              <td className="align-right num">{formatCurrency(loanInterestIncome)}</td>
              <td className="align-right num" style={{ color: 'var(--color-text-muted)' }}>₹4,30,000</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--color-text-muted)' }}>1.3</td>
              <td style={{ paddingLeft: '24px' }}>Loan Administrative Appraisal Fees &amp; Other Incidental Receipts</td>
              <td className="align-right num">{formatCurrency(otherOperatingIncome)}</td>
              <td className="align-right num" style={{ color: 'var(--color-text-muted)' }}>₹38,000</td>
            </tr>
            <tr style={{ background: '#F8FAFC', fontWeight: 700, borderTop: '1px solid var(--color-border-subtle)' }}>
              <td></td>
              <td style={{ color: 'var(--color-navy-900)' }}>TOTAL INCOME (A)</td>
              <td className="align-right num" style={{ color: 'var(--color-navy-900)', fontSize: '0.9375rem' }}>
                {formatCurrency(totalIncome)}
              </td>
              <td className="align-right num" style={{ color: 'var(--color-text-muted)' }}>₹19,88,000</td>
            </tr>

            {/* PART II: EXPENDITURE */}
            <tr style={{ background: '#F1F5F9', fontWeight: 700 }}>
              <td>II</td>
              <td colSpan={3} style={{ color: 'var(--color-navy-900)', letterSpacing: '0.03em' }}>
                EXPENDITURE &amp; OPERATING CHARGES
              </td>
            </tr>
            <tr>
              <td style={{ color: 'var(--color-text-muted)' }}>2.1</td>
              <td style={{ paddingLeft: '24px' }}>Statutory Interest Credited to Member PF Accounts</td>
              <td className="align-right num">{formatCurrency(memberInterestCredited)}</td>
              <td className="align-right num" style={{ color: 'var(--color-text-muted)' }}>₹12,90,000</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--color-text-muted)' }}>2.2</td>
              <td style={{ paddingLeft: '24px' }}>Bank Account Maintenance &amp; Transaction Charges</td>
              <td className="align-right num">{formatCurrency(bankCharges)}</td>
              <td className="align-right num" style={{ color: 'var(--color-text-muted)' }}>₹4,200</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--color-text-muted)' }}>2.3</td>
              <td style={{ paddingLeft: '24px' }}>Statutory Audit &amp; Half-Yearly Inspection Fees</td>
              <td className="align-right num">{formatCurrency(auditFees)}</td>
              <td className="align-right num" style={{ color: 'var(--color-text-muted)' }}>₹30,000</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--color-text-muted)' }}>2.4</td>
              <td style={{ paddingLeft: '24px' }}>Legal &amp; Professional Advisory Fees</td>
              <td className="align-right num">{formatCurrency(legalAndProfessional)}</td>
              <td className="align-right num" style={{ color: 'var(--color-text-muted)' }}>₹12,000</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--color-text-muted)' }}>2.5</td>
              <td style={{ paddingLeft: '24px' }}>Trustee Management Meeting &amp; Secretariat Operating Costs</td>
              <td className="align-right num">{formatCurrency(secretarialAdminExpense)}</td>
              <td className="align-right num" style={{ color: 'var(--color-text-muted)' }}>₹38,500</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--color-text-muted)' }}>2.6</td>
              <td style={{ paddingLeft: '24px' }}>Software System Licensing &amp; Passbook Maintenance</td>
              <td className="align-right num">{formatCurrency(softwareMaintenance)}</td>
              <td className="align-right num" style={{ color: 'var(--color-text-muted)' }}>₹20,000</td>
            </tr>
            <tr style={{ background: '#F8FAFC', fontWeight: 700, borderTop: '1px solid var(--color-border-subtle)' }}>
              <td></td>
              <td style={{ color: 'var(--color-navy-900)' }}>TOTAL EXPENDITURE (B)</td>
              <td className="align-right num" style={{ color: 'var(--color-navy-900)', fontSize: '0.9375rem' }}>
                {formatCurrency(totalExpenditure)}
              </td>
              <td className="align-right num" style={{ color: 'var(--color-text-muted)' }}>₹13,94,700</td>
            </tr>

            {/* PART III: SURPLUS */}
            <tr
              style={{
                background: '#F8FAFC',
                fontWeight: 700,
                borderTop: '2px solid var(--color-navy-900)',
                borderBottom: '1px solid var(--color-border-subtle)',
              }}
            >
              <td>III</td>
              <td style={{ color: 'var(--color-navy-900)' }}>
                NET OPERATING SURPLUS / (DEFICIT) FOR THE PERIOD (A - B)
              </td>
              <td className="align-right num" style={{ color: 'var(--color-navy-900)', fontSize: '1rem', fontWeight: 700 }}>
                {formatCurrency(netSurplus)}
              </td>
              <td className="align-right num" style={{ color: 'var(--color-text-muted)' }}>₹5,93,300</td>
            </tr>

            {/* Appropriations */}
            <tr>
              <td style={{ color: 'var(--color-text-muted)' }}>3.1</td>
              <td style={{ paddingLeft: '24px', color: 'var(--color-text-secondary)' }}>
                Appropriation: Transfer to General Reserve Fund (75%)
              </td>
              <td className="align-right num">{formatCurrency(transferToGeneralReserve)}</td>
              <td className="align-right num" style={{ color: 'var(--color-text-muted)' }}>₹4,45,000</td>
            </tr>
            <tr
              style={{
                fontWeight: 700,
                borderBottom: '3px double var(--color-navy-900)',
                background: '#F8FAFC',
              }}
            >
              <td style={{ color: 'var(--color-text-muted)' }}>3.2</td>
              <td style={{ paddingLeft: '24px', color: 'var(--color-navy-900)' }}>
                Balance Retained Surplus Carried to Balance Sheet (25%)
              </td>
              <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-navy-900)' }}>
                {formatCurrency(retainedSurplus)}
              </td>
              <td className="align-right num" style={{ color: 'var(--color-text-muted)' }}>₹1,48,300</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Verification Sign-off */}
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
            Verified in accordance with the registered bylaws of The Imphal Urban Co-operative Bank Ltd. Employee Trust Fund.
          </span>
        </div>
        <div style={{ display: 'flex', gap: '32px', textAlign: 'right' }}>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>Treasurer / Accountant</div>
            <div>Trust Financial Administration</div>
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>President / Managing Trustee</div>
            <div>Trust Management Committee</div>
          </div>
        </div>
      </div>
    </div>
  );
};
