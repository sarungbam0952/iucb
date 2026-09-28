import React, { useState } from 'react';
import {
  Plus,
  Search,
  Download,
  Edit2,
  X,
  TrendingUp,
  Building2,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KpiCard } from '../../components/common/KpiCard';
import { ActionMenu } from '../../components/common/ActionMenu';
import { InvestmentRecord } from '../../types';
import { formatDate } from '../../utils/dateFormat';

export const InvestmentsPage: React.FC = () => {
  const { investments, addInvestment, updateInvestment, formatCurrency, currentRole } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Credit' | 'Debit'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<InvestmentRecord | null>(null);

  // Form states
  const [formDate, setFormDate] = useState('');
  const [formBankName, setFormBankName] = useState('');
  const [formAmount, setFormAmount] = useState<number | ''>('');
  const [formType, setFormType] = useState<'Credit' | 'Debit'>('Debit');
  const [formRemarks, setFormRemarks] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered investments
  const filteredInvestments = investments.filter((inv) => {
    const matchesSearch =
      inv.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.remarks && inv.remarks.toLowerCase().includes(searchTerm.toLowerCase())) ||
      inv.amount.toString().includes(searchTerm) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'All' || inv.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredInvestments.length / pageSize) || 1;
  const paginatedInvestments = filteredInvestments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpenCreateModal = () => {
    setEditingRecord(null);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormBankName('');
    setFormAmount('');
    setFormType('Debit');
    setFormRemarks('');
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record: InvestmentRecord) => {
    setEditingRecord(record);
    setFormDate(record.date);
    setFormBankName(record.bankName);
    setFormAmount(record.amount);
    setFormType(record.type);
    setFormRemarks(record.remarks || '');
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formDate.trim()) {
      errors.date = 'Date of the transaction is required.';
    }
    if (!formBankName.trim()) {
      errors.bankName = 'Bank / Institution Name is required.';
    }
    if (formAmount === '' || Number(formAmount) <= 0) {
      errors.amount = 'A valid positive transaction amount is required.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingRecord) {
      updateInvestment(editingRecord.id, {
        date: formDate,
        bankName: formBankName.trim(),
        amount: Number(formAmount),
        type: formType,
        remarks: formRemarks.trim() || undefined,
      });
    } else {
      addInvestment({
        date: formDate,
        bankName: formBankName.trim(),
        amount: Number(formAmount),
        type: formType,
        remarks: formRemarks.trim() || undefined,
      });
    }

    handleCloseModal();
  };

  const handleExportCSV = () => {
    const headers = 'Transaction ID,Date,Bank / Institution,Transaction Type,Amount (INR),Remarks\n';
    const rows = filteredInvestments
      .map(
        (inv) =>
          `"${inv.id}","${inv.date}","${inv.bankName.replace(/"/g, '""')}","${inv.type}",${inv.amount},"${(inv.remarks || '').replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IUCB_Investment_Register_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const totalCredits = investments.filter((i) => i.type === 'Credit').reduce((sum, i) => sum + i.amount, 0);
  const totalDebits = investments.filter((i) => i.type === 'Debit').reduce((sum, i) => sum + i.amount, 0);
  const totalTransactions = investments.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            Investment Register
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Track Trust Fund investment-related transactions with banks and financial institutions.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV} title="Export investment records to CSV">
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          {currentRole !== 'Trust Committee' && (
            <button
              className="btn btn-primary btn-sm"
              onClick={handleOpenCreateModal}
              id="btn-create-investment"
            >
              <Plus size={14} />
              <span>Create New</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 SUMMARY METRIC CARDS */}
      <div className="kpi-grid">
        <KpiCard
          label="Total Placements (Debits)"
          value={formatCurrency(totalDebits)}
          icon={ArrowUpRight}
          desc="Outflow into term deposits & bonds"
        />

        <KpiCard
          label="Total Returns (Credits)"
          value={formatCurrency(totalCredits)}
          icon={ArrowDownLeft}
          desc="FD interest & maturity proceeds"
        />

        <KpiCard
          label="Total Transactions"
          value={totalTransactions}
          icon={Building2}
          desc="Recorded institutional banking entries"
        />

        <KpiCard
          label="Net Invested Volume"
          value={formatCurrency(Math.abs(totalDebits - totalCredits))}
          icon={TrendingUp}
          desc="Cumulative institutional portfolio"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="table-toolbar">
        <div className="toolbar-search">
          <div className="toolbar-search-icon">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="toolbar-search-input"
            placeholder="Search by bank / institution, remarks, or amount..."
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
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as 'All' | 'Credit' | 'Debit');
              setCurrentPage(1);
            }}
          >
            <option value="All">All Transaction Types</option>
            <option value="Credit">Credit</option>
            <option value="Debit">Debit</option>
          </select>
        </div>
      </div>

      {/* Investment Register Table */}
      <div className="table-container">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th style={{ width: '130px' }}>Date</th>
              <th>Bank / Institution</th>
              <th style={{ width: '150px' }}>Transaction Type</th>
              <th className="align-right" style={{ width: '160px' }}>Amount</th>
              <th>Remarks</th>
              {currentRole !== 'Trust Committee' && <th className="align-right" style={{ width: '100px' }}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedInvestments.length === 0 ? (
              <tr>
                <td
                  colSpan={currentRole !== 'Trust Committee' ? 6 : 5}
                  style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}
                >
                  No investment records matched your search or filter criteria.
                </td>
              </tr>
            ) : (
              paginatedInvestments.map((record) => (
                <tr key={record.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-navy-800)' }}>
                      {formatDate(record.date)}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '4px',
                          background: 'var(--color-bg-subtle, #F1F5F9)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-navy-700)',
                          flexShrink: 0,
                        }}
                      >
                        <Building2 size={14} />
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>
                        {record.bankName}
                      </span>
                    </div>
                  </td>
                  <td>
                    {record.type === 'Credit' ? (
                      <span
                        className="badge badge-approved"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <ArrowDownLeft size={12} strokeWidth={2.5} />
                        <span>Credit</span>
                      </span>
                    ) : (
                      <span
                        className="badge badge-info"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <ArrowUpRight size={12} strokeWidth={2.5} />
                        <span>Debit</span>
                      </span>
                    )}
                  </td>
                  <td className="align-right num" style={{ fontWeight: 700, color: 'var(--color-navy-900)' }}>
                    {formatCurrency(record.amount)}
                  </td>
                  <td>
                    <span style={{ color: record.remarks ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>
                      {record.remarks || '—'}
                    </span>
                  </td>
                  {currentRole !== 'Trust Committee' && (
                    <td className="align-right">
                      <ActionMenu
                        primaryAction={{
                          label: 'Edit',
                          icon: Edit2,
                          onClick: () => handleOpenEditModal(record),
                          title: 'Edit investment record',
                        }}
                      />
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Table Footer / Pagination */}
        {filteredInvestments.length > 0 && (
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
              Showing {Math.min(filteredInvestments.length, (currentPage - 1) * pageSize + 1)} to{' '}
              {Math.min(filteredInvestments.length, currentPage * pageSize)} of {filteredInvestments.length} records
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

      {/* Create / Edit Investment Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '560px' }}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    background: 'var(--color-navy-800)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TrendingUp size={18} />
                </div>
                <div>
                  <div className="modal-title">
                    {editingRecord ? 'Edit Investment Record' : 'Create New Investment'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {editingRecord
                      ? `Modify transaction record ${editingRecord.id}`
                      : 'Record bank or financial institution investment transaction'}
                  </div>
                </div>
              </div>
              <button className="btn-close" onClick={handleCloseModal} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Date Field */}
                <div className="form-group">
                  <label className="form-label" htmlFor="investment-date">
                    Date <span className="required">*</span>
                  </label>
                  <input
                    id="investment-date"
                    type="date"
                    className={`form-input ${formErrors.date ? 'error' : ''}`}
                    value={formDate}
                    onChange={(e) => {
                      setFormDate(e.target.value);
                      if (formErrors.date) setFormErrors((prev) => ({ ...prev, date: '' }));
                    }}
                    required
                  />
                  {formErrors.date && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-danger-text, #DC2626)', marginTop: '4px' }}>
                      {formErrors.date}
                    </span>
                  )}
                </div>

                {/* Bank / Institution Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="investment-bank">
                    Bank / Institution Name <span className="required">*</span>
                  </label>
                  <input
                    id="investment-bank"
                    type="text"
                    className={`form-input ${formErrors.bankName ? 'error' : ''}`}
                    placeholder="e.g. State Bank of India, Punjab National Bank, ICICI Bank"
                    value={formBankName}
                    onChange={(e) => {
                      setFormBankName(e.target.value);
                      if (formErrors.bankName) setFormErrors((prev) => ({ ...prev, bankName: '' }));
                    }}
                    required
                  />
                  {formErrors.bankName && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-danger-text, #DC2626)', marginTop: '4px' }}>
                      {formErrors.bankName}
                    </span>
                  )}
                </div>

                {/* Amount and Transaction Type in a 2-column grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* Amount Field */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="investment-amount">
                      Amount (₹) <span className="required">*</span>
                    </label>
                    <input
                      id="investment-amount"
                      type="number"
                      min="1"
                      step="any"
                      className={`form-input ${formErrors.amount ? 'error' : ''}`}
                      placeholder="e.g. 1000000"
                      value={formAmount}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormAmount(val === '' ? '' : Number(val));
                        if (formErrors.amount) setFormErrors((prev) => ({ ...prev, amount: '' }));
                      }}
                      required
                    />
                    {formErrors.amount && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-danger-text, #DC2626)', marginTop: '4px' }}>
                        {formErrors.amount}
                      </span>
                    )}
                  </div>

                  {/* Transaction Type Field */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="investment-type">
                      Transaction Type <span className="required">*</span>
                    </label>
                    <select
                      id="investment-type"
                      className="form-select"
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as 'Credit' | 'Debit')}
                      required
                    >
                      <option value="Credit">Credit</option>
                      <option value="Debit">Debit</option>
                    </select>
                  </div>
                </div>

                {/* Remarks Field */}
                <div className="form-group">
                  <label className="form-label" htmlFor="investment-remarks">
                    Remarks
                  </label>
                  <textarea
                    id="investment-remarks"
                    className="form-textarea"
                    rows={3}
                    placeholder="e.g. FD investment, Transfer to investment account, Interest received, FD maturity proceeds"
                    value={formRemarks}
                    onChange={(e) => setFormRemarks(e.target.value)}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    Optional details regarding fixed deposits, interest receipts, transfers, or maturity terms.
                  </span>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  id="btn-save-investment"
                >
                  {editingRecord ? 'Save Changes' : 'Save Investment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
