import React, { useState } from 'react';
import {
  Printer,
  Download,
  Search,
  Receipt,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/dateFormat';

interface ChargeRecord {
  id: string;
  date: string;
  chargeRef: string;
  description: string;
  category: 'Bank Charges' | 'Loan Processing' | 'Statutory & Audit' | 'Secretariat & Admin' | 'Electronic Transfer';
  relatedEntity: string;
  rateBasis: string;
  amount: number;
  recoveryStatus: 'Deducted from Pool' | 'Recovered from Member' | 'Direct Bank Debit' | 'Waived';
}

const mockCharges: ChargeRecord[] = [
  {
    id: 'CHG-2026-0041',
    date: '2026-09-18',
    chargeRef: 'IUCB/CHG/2026/09-01',
    description: 'Loan documentation & administrative appraisal fee',
    category: 'Loan Processing',
    relatedEntity: 'Member Loan LN-2026-0021 (Ningthoujam John)',
    rateBasis: '0.50% of Sanctioned Principal',
    amount: 1500,
    recoveryStatus: 'Recovered from Member',
  },
  {
    id: 'CHG-2026-0040',
    date: '2026-09-15',
    chargeRef: 'SBI/DR/2026/0915-08',
    description: 'Quarterly ledger folio & account maintenance charge',
    category: 'Bank Charges',
    relatedEntity: 'State Bank of India (MG Avenue Branch)',
    rateBasis: 'Flat ₹500 + 18% GST',
    amount: 590,
    recoveryStatus: 'Direct Bank Debit',
  },
  {
    id: 'CHG-2026-0039',
    date: '2026-08-31',
    chargeRef: 'AUD/BILL/2026/H1-12',
    description: 'Half-yearly statutory trust inspection & ledger scrutiny fee',
    category: 'Statutory & Audit',
    relatedEntity: 'M/s R.K. & Associates Chartered Accountants',
    rateBasis: 'Contractual Retainer Invoice',
    amount: 35000,
    recoveryStatus: 'Deducted from Pool',
  },
  {
    id: 'CHG-2026-0038',
    date: '2026-08-25',
    chargeRef: 'IUCB/CHG/2026/08-14',
    description: 'Loan administrative appraisal & verification fee',
    category: 'Loan Processing',
    relatedEntity: 'Member Loan LN-2026-0019 (Wahengbam Ratan Singh)',
    rateBasis: '0.50% of Sanctioned Principal',
    amount: 2000,
    recoveryStatus: 'Recovered from Member',
  },
  {
    id: 'CHG-2026-0037',
    date: '2026-08-16',
    chargeRef: 'PNB/NEFT/2026/8912',
    description: 'Bulk RTGS remittance fee for term deposit placement',
    category: 'Electronic Transfer',
    relatedEntity: 'Punjab National Bank (Thangal Bazar Branch)',
    rateBasis: '₹25 per RTGS above ₹5L + GST',
    amount: 295,
    recoveryStatus: 'Direct Bank Debit',
  },
  {
    id: 'CHG-2026-0036',
    date: '2026-07-28',
    chargeRef: 'SEC/EXP/2026/07-04',
    description: 'Annual Trustee Committee meeting secretarial expenditure',
    category: 'Secretariat & Admin',
    relatedEntity: 'IUCB Trust Management Secretariat',
    rateBasis: 'Actual Meeting Minutes Schedule',
    amount: 8400,
    recoveryStatus: 'Deducted from Pool',
  },
  {
    id: 'CHG-2026-0035',
    date: '2026-07-10',
    chargeRef: 'IUCB/CHG/2026/07-02',
    description: 'Loan administrative appraisal & title verification',
    category: 'Loan Processing',
    relatedEntity: 'Member Loan LN-2026-0018 (Heikrujam Ibomcha Singh)',
    rateBasis: '0.50% of Sanctioned Principal',
    amount: 1750,
    recoveryStatus: 'Recovered from Member',
  },
  {
    id: 'CHG-2026-0034',
    date: '2026-06-30',
    chargeRef: 'SBI/DR/2026/0630-11',
    description: 'Quarterly current account service & SMS alert package',
    category: 'Bank Charges',
    relatedEntity: 'State Bank of India (MG Avenue Branch)',
    rateBasis: 'Flat ₹500 + 18% GST',
    amount: 590,
    recoveryStatus: 'Direct Bank Debit',
  },
  {
    id: 'CHG-2026-0033',
    date: '2026-06-15',
    chargeRef: 'LEGAL/FEE/2026/06-01',
    description: 'Legal vetting for Trust Deed amendment & rule update',
    category: 'Statutory & Audit',
    relatedEntity: 'Adv. S. Joykumar Singh (Legal Advisor)',
    rateBasis: 'Per Document Vetting Fee',
    amount: 15000,
    recoveryStatus: 'Deducted from Pool',
  },
  {
    id: 'CHG-2026-0032',
    date: '2026-05-20',
    chargeRef: 'IUCB/CHG/2026/05-08',
    description: 'Passbook duplicate copy replacement fee',
    category: 'Secretariat & Admin',
    relatedEntity: 'Member IUCB-0016 (Elangbam Vidyasagar)',
    rateBasis: 'Scheduled Fee ₹100',
    amount: 100,
    recoveryStatus: 'Waived',
  },
];

export const ChargeAnalysisReportPage: React.FC = () => {
  const { formatCurrency } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = 'Charge Ref,Date,Description,Category,Related Entity,Rate Basis,Amount (INR),Recovery Status\n';
    const rows = filteredCharges
      .map(
        (c) =>
          `"${c.chargeRef}","${c.date}","${c.description}","${c.category}","${c.relatedEntity}","${c.rateBasis}",${c.amount},"${c.recoveryStatus}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IUCB_Charge_Analysis_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredCharges = mockCharges.filter((c) => {
    const matchesSearch =
      c.chargeRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.relatedEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.amount.toString().includes(searchTerm);

    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || c.recoveryStatus === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalChargesAmount = filteredCharges.reduce((sum, c) => sum + c.amount, 0);

  const totalPages = Math.ceil(filteredCharges.length / pageSize) || 1;
  const paginatedCharges = filteredCharges.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getStatusBadgeClass = (status: ChargeRecord['recoveryStatus']) => {
    switch (status) {
      case 'Recovered from Member':
        return 'badge badge-approved';
      case 'Direct Bank Debit':
        return 'badge badge-info';
      case 'Deducted from Pool':
        return 'badge badge-pending';
      case 'Waived':
        return 'badge badge-neutral';
      default:
        return 'badge badge-neutral';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            Charge Analysis
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Audit schedule of institutional fees, administrative charges, bank levies, and operational expenses.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={handlePrint} title="Print report">
            <Printer size={14} />
            <span>Print Report</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleExportCSV} title="Export CSV">
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="table-toolbar">
        <div className="toolbar-search">
          <div className="toolbar-search-icon">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="toolbar-search-input"
            placeholder="Search by charge ref, description, entity, amount..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="toolbar-filters">
          <select
            className="toolbar-select"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Categories</option>
            <option value="Loan Processing">Loan Processing</option>
            <option value="Bank Charges">Bank Charges</option>
            <option value="Statutory & Audit">Statutory &amp; Audit</option>
            <option value="Secretariat & Admin">Secretariat &amp; Admin</option>
            <option value="Electronic Transfer">Electronic Transfer</option>
          </select>

          <select
            className="toolbar-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Recovery Statuses</option>
            <option value="Recovered from Member">Recovered from Member</option>
            <option value="Direct Bank Debit">Direct Bank Debit</option>
            <option value="Deducted from Pool">Deducted from Pool</option>
            <option value="Waived">Waived</option>
          </select>
        </div>
      </div>

      {/* Charge Analysis Table */}
      <div className="table-container">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th style={{ width: '110px' }}>Date</th>
              <th style={{ width: '160px' }}>Charge Ref</th>
              <th>Description &amp; Purpose</th>
              <th style={{ width: '160px' }}>Category</th>
              <th>Related Entity / Account</th>
              <th style={{ width: '170px' }}>Basis / Rate</th>
              <th className="align-right" style={{ width: '120px' }}>Amount</th>
              <th style={{ width: '170px' }}>Recovery Standing</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCharges.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}
                >
                  No charge records matched your search or filter criteria.
                </td>
              </tr>
            ) : (
              paginatedCharges.map((charge) => (
                <tr key={charge.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                      {formatDate(charge.date)}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                      {charge.chargeRef}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>
                      {charge.description}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-navy-800)', fontWeight: 500 }}>
                      {charge.category}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                      {charge.relatedEntity}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {charge.rateBasis}
                    </span>
                  </td>
                  <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-navy-900)' }}>
                    {formatCurrency(charge.amount)}
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(charge.recoveryStatus)}>
                      {charge.recoveryStatus}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {filteredCharges.length > 0 && (
            <tfoot>
              <tr style={{ background: '#F8FAFC', fontWeight: 700, borderTop: '2px solid var(--color-border-subtle)' }}>
                <td colSpan={6} style={{ textAlign: 'right', color: 'var(--color-navy-900)' }}>
                  Total Filtered Charges ({filteredCharges.length} records):
                </td>
                <td className="align-right num" style={{ color: 'var(--color-navy-900)', fontSize: '0.9375rem' }}>
                  {formatCurrency(totalChargesAmount)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>

        {/* Pagination bar */}
        {filteredCharges.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderTop: '1px solid var(--color-border-subtle)',
              fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)',
              background: '#FFFFFF',
            }}
          >
            <span>
              Showing {Math.min(filteredCharges.length, (currentPage - 1) * pageSize + 1)} to{' '}
              {Math.min(filteredCharges.length, currentPage * pageSize)} of {filteredCharges.length} records
            </span>
            {totalPages > 1 && (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  className="btn btn-secondary btn-xs"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span style={{ padding: '4px 8px', fontWeight: 600 }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-secondary btn-xs"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
