import React, { useState } from 'react';
import {
  Landmark,
  Printer,
  Download,
  Search,
  Building2,
  PieChart,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FundPoolReportPage: React.FC = () => {
  const { formatCurrency } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('FY 2026-27 (Current)');

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = 'Component,Category,Recorded Value (INR),Share (%),Institutional Notes,Liquidity Status\n';
    const rows = [
      `"Liquid Bank Reserves & Cash in Bank","Liquid Assets",33450000,"62.8%","Held in Imphal Urban Co-op Bank term & current trust accounts","Immediate (T+0)"`,
      `"Accrued Interest Receivables","Yield Accrual",14040000,"26.4%","Compound interest return yield calculated on FD-maturity basis","On Maturity"`,
      `"Member Loan Principal Outstanding","Member Credit",5750000,"10.8%","Active member borrowing secured against individual PF balances","Monthly EMI"`,
      `"TOTAL CONSOLIDATED TRUST FUND POOL","Total Corpus",53240000,"100.0%","Audited closing balance as on 22 Sep 2026","Consolidated"`,
    ].join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IUCB_Fund_Pool_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const poolComponents = [
    {
      id: 'COMP-01',
      name: 'Liquid Bank Reserves & Term Deposits',
      category: 'Liquid Assets',
      value: 33450000,
      share: '62.8%',
      institution: 'The Imphal Urban Co-operative Bank Ltd. (Main Branch)',
      accountNo: 'CA-9901024 / FD-Series-2024',
      liquidity: 'Immediate & Term',
      badgeColor: 'badge-approved',
      notes: 'Held in designated Trustee accounts across short-term liquid and cumulative fixed deposit certificates.',
    },
    {
      id: 'COMP-02',
      name: 'Accrued Interest Receivables',
      category: 'Compound Yield',
      value: 14040000,
      share: '26.4%',
      institution: 'Scheduled Co-operative & Commercial Banks',
      accountNo: 'Accrual Portfolio 2024-2027',
      liquidity: 'Accrued (Half-Yearly)',
      badgeColor: 'badge-pending',
      notes: 'Compound interest return yield accrued pro-rata on fixed deposit maturity schedules at 7.75% avg.',
    },
    {
      id: 'COMP-03',
      name: 'Member Loan Principal Outstanding',
      category: 'Trust Loan Asset',
      value: 5750000,
      share: '10.8%',
      institution: 'Internal Member Trust Credit Facility',
      accountNo: 'PF-Secured Collateral Portfolio',
      liquidity: 'Active Monthly Payroll Recovery',
      badgeColor: 'badge-active',
      notes: 'Direct personal and festival loans issued to active employees, fully backed by accumulated PF balances.',
    },
  ];

  const filteredComponents = poolComponents.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            Fund Pool Overview Report
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Consolidated valuation of central Provident Fund corpus, liquid bank reserves, and investment assets.
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

      {/* 4 SUMMARY METRIC CARDS */}
      <div className="kpi-grid">
        <div className="kpi-card accent-navy">
          <div className="kpi-header">
            <span className="kpi-label">TOTAL CONSOLIDATED POOL</span>
            <div className="kpi-icon-wrap" style={{ background: '#EFF6FF', color: 'var(--color-navy-900)' }}>
              <Landmark size={18} />
            </div>
          </div>
          <div className="kpi-value num">{formatCurrency(53240000)}</div>
          <div className="kpi-desc">100.0% of audited Trust corpus as of FY 2026-27</div>
        </div>

        <div className="kpi-card accent-emerald">
          <div className="kpi-header">
            <span className="kpi-label">LIQUID BANK RESERVES</span>
            <div className="kpi-icon-wrap" style={{ background: '#ECFDF5', color: '#059669' }}>
              <Building2 size={18} />
            </div>
          </div>
          <div className="kpi-value num">{formatCurrency(33450000)}</div>
          <div className="kpi-desc">62.8% in operational and fixed term accounts</div>
        </div>

        <div className="kpi-card accent-burgundy">
          <div className="kpi-header">
            <span className="kpi-label">ACCRUED INTEREST RECEIVABLES</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--color-burgundy-50)', color: 'var(--color-burgundy-700)' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="kpi-value num">{formatCurrency(14040000)}</div>
          <div className="kpi-desc">26.4% yield return on term deposits</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">MEMBER LOAN ASSETS</span>
            <div className="kpi-icon-wrap">
              <PieChart size={18} />
            </div>
          </div>
          <div className="kpi-value num">{formatCurrency(5750000)}</div>
          <div className="kpi-desc">10.8% active borrowings secured against PF</div>
        </div>
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
            placeholder="Search financial components or banking accounts..."
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
            <option value="FY 2024-25">FY 2024-25</option>
            <option value="All Time">All Time Valuation</option>
          </select>
        </div>
      </div>

      {/* FUND COMPONENT ALLOCATION TABLE */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="card-title">Fund Allocation Schedule by Asset Class</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Quarterly balance verification endorsed by the Trust Investment Committee
            </div>
          </div>
          <span className="badge badge-neutral">Audited Corpus</span>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Component Code</th>
                <th>Asset Component</th>
                <th>Depository Institution / Account</th>
                <th className="align-right">Recorded Value (₹)</th>
                <th className="align-center">Corpus Share (%)</th>
                <th>Liquidity Standing</th>
              </tr>
            </thead>
            <tbody>
              {filteredComponents.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{item.id}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>{item.name}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{item.notes}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{item.institution}</div>
                    <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
                      {item.accountNo}
                    </div>
                  </td>
                  <td className="align-right num" style={{ fontWeight: 700, fontSize: '0.9375rem' }}>
                    {formatCurrency(item.value)}
                  </td>
                  <td className="align-center" style={{ fontWeight: 600 }}>
                    {item.share}
                  </td>
                  <td>
                    <span className={`badge ${item.badgeColor}`}>
                      {item.liquidity}
                    </span>
                  </td>
                </tr>
              ))}
              <tr style={{ background: '#F8FAFC', fontWeight: 800 }}>
                <td style={{ fontFamily: 'var(--font-mono)' }}>TOTAL</td>
                <td colSpan={2} style={{ color: 'var(--color-navy-900)' }}>
                  CONSOLIDATED TRUST POOL CORPUS (AS ON 22 SEP 2026)
                </td>
                <td className="align-right num" style={{ fontSize: '1.0625rem', color: 'var(--color-navy-900)' }}>
                  {formatCurrency(53240000)}
                </td>
                <td className="align-center" style={{ color: 'var(--color-navy-900)' }}>
                  100.0%
                </td>
                <td>
                  <span className="badge badge-approved">Fully Collateralized</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* STATUTORY BANK DEPOSITS BREAKDOWN */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Institutional Bank Accounts & Liquidity Details</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Primary bank deposit accounts held at The Imphal Urban Co-operative Bank Ltd.
          </div>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Bank Account No.</th>
                <th>Branch & Description</th>
                <th>Interest Rate</th>
                <th>Maturity / Renewal</th>
                <th className="align-right">Current Book Balance (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>IUCB-TR-CA-00109</td>
                <td>IUCB Main Branch — Operational Current Account (Payroll Inflows & Loan Disbursements)</td>
                <td>N/A (Current)</td>
                <td>Daily Operating</td>
                <td className="align-right num" style={{ fontWeight: 700 }}>{formatCurrency(4450000)}</td>
              </tr>
              <tr>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>IUCB-TR-FD-9921</td>
                <td>IUCB Main Branch — 3-Year Fixed Deposit Corpus Certificate (Tranche A)</td>
                <td>7.85% p.a.</td>
                <td>14 March 2027</td>
                <td className="align-right num" style={{ fontWeight: 700 }}>{formatCurrency(15000000)}</td>
              </tr>
              <tr>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>IUCB-TR-FD-9945</td>
                <td>IUCB Singjamei Branch — 2-Year Fixed Deposit Corpus Certificate (Tranche B)</td>
                <td>7.70% p.a.</td>
                <td>08 October 2027</td>
                <td className="align-right num" style={{ fontWeight: 700 }}>{formatCurrency(14000000)}</td>
              </tr>
              <tr style={{ background: '#F8FAFC', fontWeight: 700 }}>
                <td colSpan={4} style={{ color: 'var(--color-navy-900)' }}>Subtotal: Bank Deposits & Reserves</td>
                <td className="align-right num" style={{ color: 'var(--color-navy-900)' }}>{formatCurrency(33450000)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
