import React, { useState, useRef } from 'react';
import {
  PiggyBank,
  Calendar,
  Clock,
  CheckCircle2,
  Plus,
  Search,
  Check,
  X,
  Eye,
  Edit,
  ArrowRight,
  ShieldCheck,
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
  UploadCloud,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ContributionRecord } from '../../types';

export const ContributionsPage: React.FC = () => {
  const {
    contributions,
    members,
    formatCurrency,
    addContribution,
    approveContribution,
    rejectContribution,
    currentRole,
    setSelectedMemberId,
    setActivePage,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Entry Modal State
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(members[0]?.id || '');
  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  const [customSalary, setCustomSalary] = useState(members[0]?.salary || 65000);
  const [customRate, setCustomRate] = useState(members[0]?.contributionPercentage || 10);

  // Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isValidFile, setIsValidFile] = useState(false);
  const [fileValidationError, setFileValidationError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rejection modal
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Aggregates
  const totalContributions = contributions.reduce((acc, c) => acc + c.contributionAmount, 0);
  const thisMonthContributions = contributions
    .filter((c) => c.month.includes('August 2026') && c.entryStatus === 'Approved')
    .reduce((acc, c) => acc + c.contributionAmount, 0);
  const pendingEntries = contributions.filter((c) => c.entryStatus === 'Pending Approval');
  const lastDate = '02 Sep 2026';

  const filtered = contributions.filter((c) => {
    const matchesSearch =
      c.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.memberId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = monthFilter === 'All' || c.month === monthFilter;
    const matchesDept = deptFilter === 'All' || c.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || c.entryStatus === statusFilter;

    return matchesSearch && matchesMonth && matchesDept && matchesStatus;
  });

  const handleMemberSelect = (memId: string) => {
    setSelectedMember(memId);
    const m = members.find((x) => x.id === memId);
    if (m) {
      setCustomSalary(m.salary);
      setCustomRate(m.contributionPercentage);
    }
  };

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mem = members.find((m) => m.id === selectedMember);
    if (!mem) return;

    const amount = Math.round(customSalary * (customRate / 100));

    addContribution({
      month: selectedMonth,
      memberId: mem.id,
      memberName: mem.fullName,
      department: mem.department,
      salary: customSalary,
      contributionPercentage: customRate,
      contributionAmount: amount,
      enteredBy: currentRole === 'Admin' ? 'Admin' : 'Kh. Tombi (Data Entry)',
    });

    setIsEntryModalOpen(false);
  };

  const validateAndSetFile = (file: File) => {
    const validExtensions = ['.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    const hasValidExt = validExtensions.some((ext) => fileName.endsWith(ext));

    setSelectedFile(file);
    setImportSuccess(false);

    if (!hasValidExt) {
      setIsValidFile(false);
      setFileValidationError('Invalid file format. Please upload an Excel spreadsheet (.xlsx or .xls).');
    } else if (file.size > 10 * 1024 * 1024) {
      setIsValidFile(false);
      setFileValidationError('File size exceeds the 10 MB limit.');
    } else {
      setIsValidFile(true);
      setFileValidationError(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleCloseImportModal = () => {
    setIsImportModalOpen(false);
    setSelectedFile(null);
    setIsValidFile(false);
    setFileValidationError(null);
    setImportSuccess(false);
    setIsImporting(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadTemplate = () => {
    const headers = 'Employee ID,Member Name,Department,Month,Basic Salary (INR),Contribution Rate (%),Contribution Amount (INR),Notes\n';
    const sampleRows = [
      `"IUCB-0001","N. Jiten Singh","Secretariat & Accounts","August 2026",72000,10,7200,"Regular monthly payroll deduction"`,
      `"IUCB-0002","Th. Ibomcha Singh","Operations & Cash","August 2026",65000,10,6500,"Regular monthly payroll deduction"`,
      `"IUCB-0003","Kh. Tombi Devi","Loans & Advances","August 2026",58000,10,5800,"Regular monthly payroll deduction"`,
    ].join('\n');

    const blob = new Blob([headers + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'IUCB_Contributions_Import_Template.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExecuteImport = () => {
    if (!selectedFile || !isValidFile) return;
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      setImportSuccess(true);
      setTimeout(() => {
        handleCloseImportModal();
      }, 1200);
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            Monthly Contribution Management
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Record and verify monthly payroll deductions credited to individual PF member accounts.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsImportModalOpen(true)}
            title="Import contribution records from an Excel spreadsheet"
          >
            <Upload size={14} />
            <span>Import Contributions</span>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setIsEntryModalOpen(true)}
          >
            <Plus size={14} />
            <span>Record Monthly Entry</span>
          </button>
        </div>
      </div>

      {/* 4 SUMMARY METRIC CARDS */}
      <div className="kpi-grid">
        <div className="kpi-card accent-emerald">
          <div className="kpi-header">
            <span className="kpi-label">TOTAL CONTRIBUTIONS</span>
            <div className="kpi-icon-wrap" style={{ background: '#ECFDF5', color: '#059669' }}>
              <PiggyBank size={18} />
            </div>
          </div>
          <div className="kpi-value num">{formatCurrency(39200000)}</div>
          <div className="kpi-desc">Recorded cumulative member corpus</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">THIS MONTH (AUG 2026)</span>
            <div className="kpi-icon-wrap">
              <Calendar size={18} />
            </div>
          </div>
          <div className="kpi-value num">{formatCurrency(33000)}</div>
          <div className="kpi-desc">Posted payroll deductions this cycle</div>
        </div>

        <div className="kpi-card accent-amber">
          <div className="kpi-header">
            <span className="kpi-label">PENDING ENTRIES</span>
            <div className="kpi-icon-wrap" style={{ background: '#FFFBEB', color: '#D97706' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value num">{pendingEntries.length}</div>
          <div className="kpi-desc">Awaiting Admin ledger credit verification</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">LAST CONTRIBUTION DATE</span>
            <div className="kpi-icon-wrap">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ fontSize: '1.25rem' }}>{lastDate}</div>
          <div className="kpi-desc">Batch verification posted</div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="table-toolbar">
        <div className="toolbar-search">
          <div className="toolbar-search-icon">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="toolbar-search-input"
            placeholder="Search member or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="toolbar-filters">
          <select
            className="toolbar-select"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          >
            <option value="All">All Months</option>
            <option value="August 2026">August 2026</option>
            <option value="July 2026">July 2026</option>
            <option value="June 2026">June 2026</option>
          </select>

          <select
            className="toolbar-select"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="Accounts & Finance">Accounts & Finance</option>
            <option value="Loans & Advances">Loans & Advances</option>
            <option value="Audit & Inspection">Audit & Inspection</option>
            <option value="Cash & Operations">Cash & Operations</option>
            <option value="IT & Systems">IT & Systems</option>
            <option value="General Administration">General Admin</option>
          </select>

          <select
            className="toolbar-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Draft">Draft</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-container">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Member Name</th>
              <th>Employee ID</th>
              <th>Department</th>
              <th className="align-right">Basic Salary</th>
              <th className="align-center">Contrib %</th>
              <th className="align-right">Amount (₹)</th>
              <th>Status</th>
              <th>Entered By</th>
              <th>Entered Date</th>
              <th className="align-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={11} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                  No contribution records found matching filters.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.month}</td>
                  <td>
                    <span
                      style={{ fontWeight: 600, color: 'var(--color-navy-900)', cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedMemberId(c.memberId);
                        setActivePage('member-profile');
                      }}
                    >
                      {c.memberName}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-burgundy-700)', cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedMemberId(c.memberId);
                        setActivePage('member-profile');
                      }}
                    >
                      {c.memberId}
                    </span>
                  </td>
                  <td>{c.department}</td>
                  <td className="align-right num">{formatCurrency(c.salary)}</td>
                  <td className="align-center">
                    <span className="badge badge-neutral">{c.contributionPercentage}%</span>
                  </td>
                  <td className="align-right num td-credit" style={{ fontWeight: 700 }}>
                    {formatCurrency(c.contributionAmount)}
                  </td>
                  <td>
                    <StatusBadge status={c.entryStatus} size="sm" />
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{c.enteredBy}</td>
                  <td style={{ fontSize: '0.75rem' }}>{c.enteredDate}</td>
                  <td className="align-right">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                      {/* If Admin and Pending Approval, allow quick approve or reject */}
                      {currentRole === 'Admin' && c.entryStatus === 'Pending Approval' && (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => approveContribution(c.id)}
                            title="Approve & Post to Ledger"
                          >
                            <Check size={13} />
                            <span>Approve</span>
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              setRejectId(c.id);
                              setRejectReason('Salary mismatch with payroll sheet');
                            }}
                            title="Reject"
                          >
                            <X size={13} />
                          </button>
                        </>
                      )}

                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSelectedMemberId(c.memberId);
                          setActivePage('ledger');
                        }}
                        title="View Ledger"
                      >
                        <Eye size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* RECORD ENTRY MODAL */}
      {isEntryModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsEntryModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Record Monthly Payroll Contribution</div>
              <button className="btn-close" onClick={() => setIsEntryModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleRecordSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Select Trust Member *</label>
                  <select
                    className="form-select"
                    value={selectedMember}
                    onChange={(e) => handleMemberSelect(e.target.value)}
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.id} — {m.fullName} ({m.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Contribution Month *</label>
                    <select
                      className="form-select"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      <option value="August 2026">August 2026</option>
                      <option value="September 2026">September 2026</option>
                      <option value="July 2026">July 2026</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Basic Salary Recorded (₹) *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={customSalary}
                      onChange={(e) => setCustomSalary(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Contribution Rate (%)</label>
                    <select
                      className="form-select"
                      value={customRate}
                      onChange={(e) => setCustomRate(Number(e.target.value))}
                    >
                      <option value={8}>8%</option>
                      <option value={10}>10% (Standard)</option>
                      <option value={12}>12%</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Calculated Deduction</label>
                    <div style={{ padding: '8px 12px', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--color-border-subtle)', fontWeight: 700, color: 'var(--color-navy-900)' }} className="num">
                      ₹{Math.round(customSalary * (customRate / 100)).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div style={{ background: '#FFFBEB', padding: '10px 12px', borderRadius: '6px', border: '1px solid #FDE68A', fontSize: '0.75rem', color: '#92400E' }}>
                  <strong>Note:</strong> Deductions are made through the existing bank payroll process. This form records and routes the entry into the Trust ledger queue for Admin approval.
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEntryModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT CONFIRMATION MODAL */}
      {rejectId && (
        <div className="modal-backdrop" onClick={() => setRejectId(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <div className="modal-title">Reject Contribution Entry</div>
              <button className="btn-close" onClick={() => setRejectId(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                Please specify the reason for rejecting entry <strong>{rejectId}</strong>.
              </p>
              <div className="form-group">
                <label className="form-label">Rejection Reason *</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setRejectId(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (rejectReason.trim()) {
                    rejectContribution(rejectId, rejectReason);
                    setRejectId(null);
                  }
                }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT CONTRIBUTIONS MODAL */}
      {isImportModalOpen && (
        <div className="modal-backdrop" onClick={handleCloseImportModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileSpreadsheet size={18} />
                </div>
                <div>
                  <div className="modal-title">Import Contributions</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    Bulk upload monthly employee contribution records from Excel
                  </div>
                </div>
              </div>
              <button className="btn-close" onClick={handleCloseImportModal}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Upload an Excel file containing member contribution records. The system will parse employee IDs, monthly basic salaries, and contribution percentages before staging for Trust approval.
              </p>

              {/* Upload Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: isDragging ? '2px dashed var(--color-navy-700)' : '2px dashed var(--color-border-subtle)',
                  borderRadius: '8px',
                  padding: '24px 16px',
                  textAlign: 'center',
                  background: isDragging ? 'rgba(30, 58, 138, 0.04)' : '#F8FAFC',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".xlsx, .xls"
                  style={{ display: 'none' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#EFF6FF', color: 'var(--color-navy-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UploadCloud size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                      Click to choose file
                    </span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      {' '}or drag and drop here
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Supported format: .xlsx and .xls (Microsoft Excel) • Max file size: 10 MB
                  </div>
                </div>
              </div>

              {/* Selected File & Validation State */}
              {selectedFile && (
                <div style={{
                  padding: '12px',
                  borderRadius: '6px',
                  background: isValidFile ? '#F0FDF4' : '#FEF2F2',
                  border: `1px solid ${isValidFile ? '#BBF7D0' : '#FECACA'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {isValidFile ? (
                      <CheckCircle2 size={18} color="#16A34A" />
                    ) : (
                      <AlertCircle size={18} color="#DC2626" />
                    )}
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                        {selectedFile.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: isValidFile ? '#15803D' : '#B91C1C', marginTop: '2px' }}>
                        {isValidFile
                          ? `${(selectedFile.size / 1024).toFixed(1)} KB • Valid Excel file format verified (Ready for import)`
                          : fileValidationError || 'Invalid file format. Only .xlsx and .xls are supported.'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setIsValidFile(false);
                      setFileValidationError(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Import In-Progress or Success Feedback */}
              {importSuccess && (
                <div style={{
                  padding: '10px 12px',
                  borderRadius: '6px',
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  fontSize: '0.8125rem',
                  color: '#065F46',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <Check size={16} />
                  <span>Contribution records validated successfully! Staged for Trust Committee approval queue.</span>
                </div>
              )}

              {/* Download Sample Template Option */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                background: '#FFFFFF',
                borderRadius: '6px',
                border: '1px solid var(--color-border-subtle)',
                fontSize: '0.8125rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileSpreadsheet size={16} color="var(--color-navy-700)" />
                  <span style={{ color: 'var(--color-navy-900)' }}>Download official sample spreadsheet template:</span>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleDownloadTemplate}
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  <Download size={13} />
                  <span>Sample Template (.xlsx)</span>
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseImportModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!selectedFile || !isValidFile || isImporting}
                onClick={handleExecuteImport}
              >
                {isImporting ? 'Importing Records...' : 'Import'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
