import React, { useState, useRef, useEffect } from 'react';
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
  MoreVertical,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { KpiCard } from '../../components/common/KpiCard';
import { ContributionRecord } from '../../types';
import { formatDate } from '../../utils/dateFormat';

export const ContributionsPage: React.FC = () => {
  const {
    contributions,
    members,
    formatCurrency,
    addContribution,
    approveContribution,
    rejectContribution,
    updateContribution,
    cancelContribution,
    currentRole,
    setSelectedMemberId,
    setActivePage,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [entryTypeFilter, setEntryTypeFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Date Range Filter State
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | '3months' | '6months' | 'custom'>('all');
  const [customFromDate, setCustomFromDate] = useState('');
  const [customToDate, setCustomToDate] = useState('');

  // Row Action Modals State
  const [viewingRecord, setViewingRecord] = useState<ContributionRecord | null>(null);

  const [editingRecord, setEditingRecord] = useState<ContributionRecord | null>(null);
  const [editSalary, setEditSalary] = useState<number>(0);
  const [editRate, setEditRate] = useState<number>(10);
  const [editMonth, setEditMonth] = useState<string>('August 2026');
  const [editRemarks, setEditRemarks] = useState<string>('');

  const [cancellingRecord, setCancellingRecord] = useState<ContributionRecord | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');

  // 3-dot overflow menu state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const handleOutsideClick = () => {
      setOpenMenuId(null);
    };
    if (openMenuId) {
      window.addEventListener('click', handleOutsideClick);
      return () => window.removeEventListener('click', handleOutsideClick);
    }
  }, [openMenuId]);

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
  const lastDate = '02/09/2026';

  // Dynamic month title generator for Pending Entries KPI
  const getPendingEntriesTitle = (entries: ContributionRecord[]) => {
    const months = Array.from(new Set(entries.map((c) => c.month))).filter(Boolean);
    if (months.length === 0) return 'PENDING ENTRIES';
    if (months.length === 1) {
      const parts = months[0].split(' ');
      const abbr = parts[0].slice(0, 3).toUpperCase();
      return `PENDING ENTRIES (${abbr} ${parts[1] || ''})`.trim();
    }
    const monthAbbrs = months.map((m) => {
      const parts = m.split(' ');
      return { name: parts[0].slice(0, 3).toUpperCase(), year: parts[1] || '' };
    });
    const allSameYear = monthAbbrs.every((m) => m.year === monthAbbrs[0].year);
    if (allSameYear && monthAbbrs[0].year) {
      return `PENDING ENTRIES (${monthAbbrs.map((m) => m.name).join(', ')} ${monthAbbrs[0].year})`;
    }
    return `PENDING ENTRIES (${monthAbbrs.map((m) => `${m.name} ${m.year}`).join(', ')})`;
  };

  const filtered = contributions.filter((c) => {
    const matchesSearch =
      c.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.memberId.toLowerCase().includes(searchTerm.toLowerCase());
    const recordEntryType =
      c.entryType ||
      (c.remarks?.toLowerCase().includes('import') || c.enteredBy?.toLowerCase().includes('import')
        ? 'Imported'
        : 'Manual Entry');
    const matchesEntryType = entryTypeFilter === 'All' || recordEntryType === entryTypeFilter;
    const matchesDept = deptFilter === 'All' || c.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || c.entryStatus === statusFilter;

    let matchesDateRange = true;
    if (dateRangeFilter === 'all') {
      matchesDateRange = true;
    } else if (dateRangeFilter === '3months') {
      const now = new Date();
      const baseYear = Math.max(now.getFullYear(), 2026);
      const baseDate = new Date(baseYear, 8, 30);
      const d3 = new Date(baseDate);
      d3.setMonth(d3.getMonth() - 3);
      const d3Str = d3.toISOString().split('T')[0];
      matchesDateRange = c.enteredDate >= d3Str;
    } else if (dateRangeFilter === '6months') {
      const now = new Date();
      const baseYear = Math.max(now.getFullYear(), 2026);
      const baseDate = new Date(baseYear, 8, 30);
      const d6 = new Date(baseDate);
      d6.setMonth(d6.getMonth() - 6);
      const d6Str = d6.toISOString().split('T')[0];
      matchesDateRange = c.enteredDate >= d6Str;
    } else if (dateRangeFilter === 'custom') {
      if (customFromDate && c.enteredDate < customFromDate) matchesDateRange = false;
      if (customToDate && c.enteredDate > customToDate) matchesDateRange = false;
    }

    return matchesSearch && matchesEntryType && matchesDept && matchesStatus && matchesDateRange;
  });

  const handleOpenEdit = (rec: ContributionRecord) => {
    setEditingRecord(rec);
    setEditSalary(rec.salary);
    setEditRate(rec.contributionPercentage);
    setEditMonth(rec.month);
    setEditRemarks(rec.remarks || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    const newAmount = Math.round(editSalary * (editRate / 100));
    updateContribution(editingRecord.id, {
      salary: editSalary,
      contributionPercentage: editRate,
      contributionAmount: newAmount,
      month: editMonth,
      remarks: editRemarks,
    });
    setEditingRecord(null);
  };

  const handleConfirmCancel = () => {
    if (!cancellingRecord) return;
    cancelContribution(cancellingRecord.id, cancelReason);
    setCancellingRecord(null);
    setCancelReason('');
  };

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
      entryType: 'Manual Entry',
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
      const targetMember = members.find((m) => m.id === 'IUCB-0005') || members[0];
      if (targetMember) {
        addContribution({
          month: 'August 2026',
          memberId: targetMember.id,
          memberName: targetMember.fullName,
          department: targetMember.department,
          salary: targetMember.salary,
          contributionPercentage: targetMember.contributionPercentage,
          contributionAmount: Math.round(targetMember.salary * (targetMember.contributionPercentage / 100)),
          entryType: 'Imported',
          enteredBy: 'Kh. Tombi (Excel Import)',
          remarks: `Batch import from ${selectedFile.name}`,
        });
      }
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
          {currentRole !== 'Trust Committee' && (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* 4 SUMMARY METRIC CARDS */}
      <div className="kpi-grid">
        <KpiCard
          label="Total Contributions"
          value={formatCurrency(39200000)}
          icon={PiggyBank}
          desc="Recorded cumulative member corpus"
        />

        <KpiCard
          label="This Month (Aug 2026)"
          value={formatCurrency(33000)}
          icon={Calendar}
          desc="Posted payroll deductions this cycle"
        />

        <KpiCard
          label={getPendingEntriesTitle(pendingEntries)}
          value={pendingEntries.length}
          icon={Clock}
          desc="Awaiting Admin ledger credit verification"
        />

        <KpiCard
          label="Last Contribution Date"
          value={lastDate}
          icon={CheckCircle2}
          desc="Batch verification posted"
        />
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

        <div className="toolbar-filters" style={{ flexWrap: 'wrap' }}>
          <select
            className="toolbar-select"
            value={entryTypeFilter}
            onChange={(e) => setEntryTypeFilter(e.target.value)}
          >
            <option value="All">All Entry Types</option>
            <option value="Manual Entry">Manual Entry</option>
            <option value="Imported">Imported</option>
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
            <option value="Executive Office">Executive Office</option>
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
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Statement Period Date-Range Filter Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-navy-900)', whiteSpace: 'nowrap' }}>
              Statement Period:
            </label>
            <select
              className="form-select"
              style={{
                width: 'auto',
                minWidth: '135px',
                height: '32px',
                padding: '4px 28px 4px 10px',
                fontSize: '0.75rem',
                fontWeight: 500,
                backgroundColor: '#FFFFFF',
              }}
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value as any)}
            >
              <option value="all">All</option>
              <option value="3months">3 Months</option>
              <option value="6months">6 Months</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {dateRangeFilter === 'custom' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>From:</label>
                <input
                  type="date"
                  className="form-input"
                  style={{ width: '130px', height: '32px', padding: '4px 8px', fontSize: '0.75rem' }}
                  value={customFromDate}
                  onChange={(e) => setCustomFromDate(e.target.value)}
                  placeholder="From"
                  title="From Date"
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>To:</label>
                <input
                  type="date"
                  className="form-input"
                  style={{ width: '130px', height: '32px', padding: '4px 8px', fontSize: '0.75rem' }}
                  value={customToDate}
                  onChange={(e) => setCustomToDate(e.target.value)}
                  placeholder="To"
                  title="To Date"
                />
              </div>
              {(customFromDate || customToDate) && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '2px 8px', fontSize: '0.6875rem', height: '32px' }}
                  onClick={() => {
                    setCustomFromDate('');
                    setCustomToDate('');
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          )}
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
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-navy-900)', cursor: 'pointer' }}
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
                  <td style={{ fontSize: '0.75rem' }}>{formatDate(c.enteredDate)}</td>
                  <td className="align-right">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setViewingRecord(c)}
                        title="View Details"
                      >
                        <Eye size={13} />
                        <span>View</span>
                      </button>

                      {currentRole !== 'Trust Committee' && (
                        <div style={{ position: 'relative' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{
                              padding: '0 8px',
                              height: '28px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === c.id ? null : c.id);
                            }}
                            title="More actions"
                            aria-label="More actions"
                          >
                            <MoreVertical size={14} />
                          </button>

                          {openMenuId === c.id && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 'calc(100% + 4px)',
                                right: 0,
                                minWidth: '130px',
                                background: '#FFFFFF',
                                borderRadius: '6px',
                                boxShadow: 'var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.12))',
                                border: '1px solid var(--color-border-subtle)',
                                padding: '4px',
                                zIndex: 50,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px',
                                textAlign: 'left',
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  width: '100%',
                                  padding: '7px 10px',
                                  background: 'none',
                                  border: 'none',
                                  borderRadius: '4px',
                                  fontSize: '0.8125rem',
                                  color: 'var(--color-navy-900)',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  fontWeight: 500,
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#F1F5F9')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                                onClick={() => {
                                  setOpenMenuId(null);
                                  handleOpenEdit(c);
                                }}
                              >
                                <Edit size={13} color="var(--color-text-secondary)" />
                                <span>Edit</span>
                              </button>

                              <button
                                type="button"
                                disabled={c.entryStatus === 'Cancelled'}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  width: '100%',
                                  padding: '7px 10px',
                                  background: 'none',
                                  border: 'none',
                                  borderRadius: '4px',
                                  fontSize: '0.8125rem',
                                  color: c.entryStatus === 'Cancelled' ? 'var(--color-text-muted)' : 'var(--color-burgundy-700)',
                                  cursor: c.entryStatus === 'Cancelled' ? 'not-allowed' : 'pointer',
                                  textAlign: 'left',
                                  fontWeight: 500,
                                }}
                                onMouseEnter={(e) => {
                                  if (c.entryStatus !== 'Cancelled') e.currentTarget.style.background = '#FEF2F2';
                                }}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                                onClick={() => {
                                  setOpenMenuId(null);
                                  setCancellingRecord(c);
                                  setCancelReason('');
                                }}
                              >
                                <X size={13} />
                                <span>Cancel</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
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
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#F1F5F9', color: 'var(--color-navy-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

      {/* VIEW CONTRIBUTION DETAILS MODAL */}
      {viewingRecord && (
        <div className="modal-backdrop" onClick={() => setViewingRecord(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
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
                  <Eye size={18} />
                </div>
                <div>
                  <div className="modal-title">Contribution Record Details</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Record ID: <strong style={{ color: 'var(--color-navy-900)', fontFamily: 'var(--font-mono)' }}>{viewingRecord.id}</strong> • Cycle: {viewingRecord.month}
                  </div>
                </div>
              </div>
              <button className="btn-close" onClick={() => setViewingRecord(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: '#F8FAFC',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Contribution Amount</div>
                  <div className="num" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
                    {formatCurrency(viewingRecord.contributionAmount)}
                  </div>
                </div>
                <StatusBadge status={viewingRecord.entryStatus} size="sm" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.8125rem' }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Member Name</span>
                  <strong style={{ color: 'var(--color-navy-900)' }}>{viewingRecord.memberName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Employee ID</span>
                  <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-burgundy-700)' }}>{viewingRecord.memberId}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Department</span>
                  <strong style={{ color: 'var(--color-navy-900)' }}>{viewingRecord.department}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Month Cycle</span>
                  <strong style={{ color: 'var(--color-navy-900)' }}>{viewingRecord.month}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Basic Monthly Salary</span>
                  <strong className="num" style={{ color: 'var(--color-navy-900)' }}>{formatCurrency(viewingRecord.salary)}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Contribution Rate</span>
                  <strong style={{ color: 'var(--color-navy-900)' }}>{viewingRecord.contributionPercentage}%</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Entered By</span>
                  <strong style={{ color: 'var(--color-text-secondary)' }}>{viewingRecord.enteredBy}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Entered Date</span>
                  <strong style={{ color: 'var(--color-navy-900)' }}>{formatDate(viewingRecord.enteredDate)}</strong>
                </div>
                {viewingRecord.approvedBy && (
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Approved By</span>
                    <strong style={{ color: 'var(--color-text-secondary)' }}>{viewingRecord.approvedBy}</strong>
                  </div>
                )}
                {viewingRecord.approvedDate && (
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Approved Date</span>
                    <strong style={{ color: 'var(--color-navy-900)' }}>{viewingRecord.approvedDate}</strong>
                  </div>
                )}
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Remarks / Notes</span>
                  <div
                    style={{
                      background: '#F8FAFC',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid var(--color-border-subtle)',
                      color: 'var(--color-navy-900)',
                    }}
                  >
                    {viewingRecord.remarks || 'No remarks recorded'}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setViewingRecord(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT CONTRIBUTION MODAL */}
      {editingRecord && (
        <div className="modal-backdrop" onClick={() => setEditingRecord(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
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
                  <Edit size={18} />
                </div>
                <div>
                  <div className="modal-title">Edit Contribution Entry</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Modify record <strong style={{ color: 'var(--color-navy-900)', fontFamily: 'var(--font-mono)' }}>{editingRecord.id}</strong> • {editingRecord.memberName} ({editingRecord.memberId})
                  </div>
                </div>
              </div>
              <button className="btn-close" onClick={() => setEditingRecord(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Contribution Month *</label>
                  <select
                    className="form-select"
                    value={editMonth}
                    onChange={(e) => setEditMonth(e.target.value)}
                  >
                    <option value="August 2026">August 2026</option>
                    <option value="July 2026">July 2026</option>
                    <option value="June 2026">June 2026</option>
                    <option value="September 2026">September 2026</option>
                  </select>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Basic Monthly Salary (₹) *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={editSalary}
                      onChange={(e) => setEditSalary(Number(e.target.value))}
                      min="0"
                      step="500"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contribution Rate (%) *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={editRate}
                      onChange={(e) => setEditRate(Number(e.target.value))}
                      min="1"
                      max="100"
                      required
                    />
                  </div>
                </div>

                <div
                  style={{
                    background: '#F8FAFC',
                    padding: '12px 14px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                    Calculated Monthly Amount:
                  </span>
                  <span className="num" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
                    {formatCurrency(Math.round(editSalary * (editRate / 100)))}
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Remarks / Adjustment Reason</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Enter reason for modifying entry..."
                    value={editRemarks}
                    onChange={(e) => setEditRemarks(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingRecord(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANCEL CONFIRMATION DIALOG */}
      {cancellingRecord && (
        <div className="modal-backdrop" onClick={() => setCancellingRecord(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    background: 'var(--color-burgundy-700)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={18} />
                </div>
                <div>
                  <div className="modal-title">Cancel Contribution Entry</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Entry ID: <strong style={{ fontFamily: 'var(--font-mono)' }}>{cancellingRecord.id}</strong>
                  </div>
                </div>
              </div>
              <button className="btn-close" onClick={() => setCancellingRecord(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-primary)', lineHeight: '1.5', margin: 0 }}>
                Are you sure you want to cancel the contribution entry of{' '}
                <strong style={{ color: 'var(--color-navy-900)' }}>{formatCurrency(cancellingRecord.contributionAmount)}</strong> for{' '}
                <strong>{cancellingRecord.memberName}</strong> ({cancellingRecord.memberId}) for{' '}
                <strong>{cancellingRecord.month}</strong>?
              </p>

              <div
                style={{
                  background: '#F8FAFC',
                  padding: '12px 14px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border-subtle)',
                  fontSize: '0.75rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.45',
                }}
              >
                <strong style={{ color: 'var(--color-navy-900)', display: 'block', marginBottom: '2px' }}>
                  Compliance & Audit Notice:
                </strong>
                This contribution record will <strong>NOT be deleted</strong> from the database. It will be preserved for audit and historical reconciliation, but its status will be updated to <strong>Cancelled</strong>.
              </div>

              <div className="form-group">
                <label className="form-label">Cancellation Reason (Optional)</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="e.g. Duplicate payroll record entered by mistake"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setCancellingRecord(null)}
              >
                Keep Record
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleConfirmCancel}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
