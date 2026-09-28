import React, { useState, useMemo } from 'react';
import {
  Printer,
  Download,
  Search,
  ArrowRightLeft,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/dateFormat';

interface TransferScrollItem {
  id: string;
  date: string;
  refNo: string;
  description: string;
  source: string;
  destination: string;
  debit: number;
  credit: number;
  balance: number;
}

export const TransferScrollReportPage: React.FC = () => {
  const {
    contributions,
    withdrawals,
    investments,
    loans,
    ledgerEntries,
    formatCurrency,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Compile scroll entries across Trust operations
  const scrollEntries = useMemo(() => {
    const list: Array<Omit<TransferScrollItem, 'balance'>> = [];

    // Investments transactions
    investments.forEach((inv) => {
      if (inv.type === 'Debit') {
        list.push({
          id: inv.id,
          date: inv.date,
          refNo: inv.id,
          description: inv.remarks || `Transfer to ${inv.bankName} for investment placement`,
          source: 'IUCB Trust Operative Bank A/c',
          destination: `${inv.bankName} (FD/Term Deposit)`,
          debit: inv.amount,
          credit: 0,
        });
      } else {
        list.push({
          id: inv.id,
          date: inv.date,
          refNo: inv.id,
          description: inv.remarks || `Inward credit from ${inv.bankName} to Trust Pool`,
          source: `${inv.bankName} (Term Yield/Deposit)`,
          destination: 'IUCB Trust Operative Bank A/c',
          debit: 0,
          credit: inv.amount,
        });
      }
    });

    // Withdrawals transactions
    withdrawals.forEach((w) => {
      list.push({
        id: w.id,
        date: w.date,
        refNo: w.referenceNo || w.id,
        description: `Member Withdrawal: ${w.withdrawalType} (${w.memberName})`,
        source: 'IUCB Trust Member Fund Pool',
        destination: `Bank Savings A/c (${w.memberId})`,
        debit: w.amount,
        credit: 0,
      });
    });

    // Contribution batches
    contributions
      .filter((c) => c.entryStatus === 'Approved')
      .slice(0, 20)
      .forEach((c) => {
        list.push({
          id: `TR-${c.id}`,
          date: c.enteredDate || '2026-08-01',
          refNo: c.id,
          description: `Monthly PF Recovery (${c.month}) - ${c.memberName}`,
          source: `IUCB Bank Payroll Suspense (${c.department})`,
          destination: 'IUCB Employee Trust Corpus',
          debit: 0,
          credit: c.contributionAmount,
        });
      });

    // Loan disbursements
    loans
      .filter((l) => l.status === 'Active' || l.status === 'Completed')
      .forEach((l) => {
        list.push({
          id: `DISB-${l.id}`,
          date: l.sanctionDate || l.applicationDate,
          refNo: l.id,
          description: `Loan Disbursement: ${l.purpose} (${l.memberName})`,
          source: 'IUCB Trust Loan Facility A/c',
          destination: `Member Bank A/c (${l.memberId})`,
          debit: l.requestedAmount,
          credit: 0,
        });
      });

    // Additional realistic transfer scroll entries
    list.push({
      id: 'TR-2026-0091',
      date: '2026-09-24',
      refNo: 'IUCB/TR/2026/09-41',
      description: 'Monthly loan EMI aggregate payroll recovery',
      source: 'IUCB Salary Clearing Clearing A/c',
      destination: 'IUCB Trust Loan Recovery A/c',
      debit: 0,
      credit: 345000,
    });
    list.push({
      id: 'TR-2026-0090',
      date: '2026-09-15',
      refNo: 'IUCB/TR/2026/09-12',
      description: 'Transfer of surplus funds for liquid bank auto-sweep',
      source: 'IUCB Trust Operative Current A/c',
      destination: 'IUCB High-Yield Liquid Reserve Pool',
      debit: 500000,
      credit: 0,
    });

    // Sort by date ascending to calculate running pool balance, then reverse
    list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let running = 32500000;
    const scrollWithBalance: TransferScrollItem[] = list.map((item) => {
      running += item.credit - item.debit;
      return {
        ...item,
        balance: running,
      };
    });

    return scrollWithBalance.reverse();
  }, [investments, withdrawals, contributions, loans]);

  // Filters
  const filteredScroll = useMemo(() => {
    return scrollEntries.filter((item) => {
      const matchesSearch =
        item.refNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSource =
        sourceFilter === 'All' ||
        item.source.toLowerCase().includes(sourceFilter.toLowerCase()) ||
        item.destination.toLowerCase().includes(sourceFilter.toLowerCase());

      return matchesSearch && matchesSource;
    });
  }, [scrollEntries, searchTerm, sourceFilter]);

  const totalDebits = filteredScroll.reduce((sum, s) => sum + s.debit, 0);
  const totalCredits = filteredScroll.reduce((sum, s) => sum + s.credit, 0);

  const totalPages = Math.ceil(filteredScroll.length / pageSize) || 1;
  const paginatedScroll = filteredScroll.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = 'Date,Reference / Txn ID,Description,Source Account,Destination Account,Debit (INR),Credit (INR),Balance (INR)\n';
    const rows = filteredScroll
      .map(
        (s) =>
          `"${s.date}","${s.refNo}","${s.description.replace(/"/g, '""')}","${s.source.replace(/"/g, '""')}","${s.destination.replace(/"/g, '""')}",${s.debit},${s.credit},${s.balance}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IUCB_Transfer_Scroll_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            Transfer Scroll
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Chronological transfer and settlement register of all Trust Fund transactions across bank and member accounts.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={handlePrint} title="Print transfer scroll">
            <Printer size={14} />
            <span>Print Scroll</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleExportCSV} title="Export scroll CSV">
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
            placeholder="Search by ref, description, source, or destination..."
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
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Transfer Channels</option>
            <option value="Bank">Bank Accounts &amp; Term Deposits</option>
            <option value="Member">Member Accounts &amp; Withdrawals</option>
            <option value="Payroll">Payroll / Salary Deductions</option>
            <option value="Loan">Loan Disbursements &amp; EMI Recoveries</option>
          </select>
        </div>
      </div>

      {/* Transfer Scroll Table */}
      <div className="table-container">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th style={{ width: '105px' }}>Date</th>
              <th style={{ width: '150px' }}>Reference / ID</th>
              <th>Description &amp; Particulars</th>
              <th style={{ width: '180px' }}>Source Account</th>
              <th style={{ width: '180px' }}>Destination Account</th>
              <th className="align-right" style={{ width: '125px' }}>Debit (₹)</th>
              <th className="align-right" style={{ width: '125px' }}>Credit (₹)</th>
              <th className="align-right" style={{ width: '135px' }}>Balance</th>
            </tr>
          </thead>
          <tbody>
            {paginatedScroll.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}
                >
                  No transfer scroll entries matched your search criteria.
                </td>
              </tr>
            ) : (
              paginatedScroll.map((item) => (
                <tr key={item.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                      {formatDate(item.date)}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                      {item.refNo}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--color-navy-900)' }}>
                      {item.description}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                      {item.source}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-navy-800)', fontWeight: 500 }}>
                      {item.destination}
                    </span>
                  </td>
                  <td className="align-right num" style={{ color: item.debit > 0 ? 'var(--color-navy-900)' : 'var(--color-text-muted)', fontWeight: item.debit > 0 ? 600 : 400 }}>
                    {item.debit > 0 ? formatCurrency(item.debit) : '—'}
                  </td>
                  <td className="align-right num" style={{ color: item.credit > 0 ? 'var(--color-navy-900)' : 'var(--color-text-muted)', fontWeight: item.credit > 0 ? 600 : 400 }}>
                    {item.credit > 0 ? formatCurrency(item.credit) : '—'}
                  </td>
                  <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-navy-900)' }}>
                    {formatCurrency(item.balance)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {filteredScroll.length > 0 && (
            <tfoot>
              <tr style={{ background: '#F8FAFC', fontWeight: 700, borderTop: '2px solid var(--color-border-subtle)' }}>
                <td colSpan={5} style={{ textAlign: 'right', color: 'var(--color-navy-900)' }}>
                  Total Filtered Scroll Entries ({filteredScroll.length} records):
                </td>
                <td className="align-right num" style={{ color: 'var(--color-navy-900)' }}>
                  {formatCurrency(totalDebits)}
                </td>
                <td className="align-right num" style={{ color: 'var(--color-navy-900)' }}>
                  {formatCurrency(totalCredits)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>

        {/* Pagination Controls */}
        {filteredScroll.length > 0 && (
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
              Showing {Math.min(filteredScroll.length, (currentPage - 1) * pageSize + 1)} to{' '}
              {Math.min(filteredScroll.length, currentPage * pageSize)} of {filteredScroll.length} transfers
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
