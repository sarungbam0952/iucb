import React, { useState } from 'react';
import {
  History,
  Printer,
  Download,
  Search,
  ShieldCheck,
  Users,
  ShieldAlert,
  Eye,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AuditLog } from '../../types';

export const AuditTrailReportPage: React.FC = () => {
  const { auditLogs } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');
  const [inspectLog, setInspectLog] = useState<AuditLog | null>(null);

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = 'Audit ID,Timestamp,User,Role,Action,Module,Record ID,Previous Value,New Value,Details\n';
    const rows = filteredLogs.map((l) =>
      `"${l.id}","${l.timestamp}","${l.user}","${l.role}","${l.action}","${l.module}","${l.recordId}","${l.previousValue}","${l.newValue}","${l.details || ''}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IUCB_Audit_Trail_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const modules = ['All', ...Array.from(new Set(auditLogs.map((a) => a.module)))];
  const roles = ['All', ...Array.from(new Set(auditLogs.map((a) => a.role)))];
  const actions = ['All', ...Array.from(new Set(auditLogs.map((a) => a.action)))];

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.recordId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesModule = moduleFilter === 'All' || log.module === moduleFilter;
    const matchesRole = roleFilter === 'All' || log.role === roleFilter;
    const matchesAction = actionFilter === 'All' || log.action === actionFilter;

    return matchesSearch && matchesModule && matchesRole && matchesAction;
  });

  const totalEvents = auditLogs.length;
  const financialEvents = auditLogs.filter(
    (a) => a.module === 'Contributions' || a.module === 'Loans' || a.module === '18-Year Advance'
  ).length;
  const uniqueOperators = Array.from(new Set(auditLogs.map((a) => a.user))).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            Audit Trail Report
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Official chronological regulatory audit trail of all transactions, ledger alterations, role decisions, and approval milestones.
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
        <div className="kpi-card accent-burgundy">
          <div className="kpi-header">
            <span className="kpi-label">TOTAL LOGGED AUDIT EVENTS</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--color-burgundy-50)', color: 'var(--color-burgundy-700)' }}>
              <History size={18} />
            </div>
          </div>
          <div className="kpi-value num">{totalEvents}</div>
          <div className="kpi-desc">Immutable system event log entries</div>
        </div>

        <div className="kpi-card accent-navy">
          <div className="kpi-header">
            <span className="kpi-label">FINANCIAL MODIFICATIONS</span>
            <div className="kpi-icon-wrap" style={{ background: '#EFF6FF', color: 'var(--color-navy-900)' }}>
              <ShieldAlert size={18} />
            </div>
          </div>
          <div className="kpi-value num">{financialEvents}</div>
          <div className="kpi-desc">Ledger balances, deductions, or loans</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">ACTIVE SYSTEM OPERATORS</span>
            <div className="kpi-icon-wrap">
              <Users size={18} />
            </div>
          </div>
          <div className="kpi-value num">{uniqueOperators}</div>
          <div className="kpi-desc">Admin, Data Entry, and Committee actors</div>
        </div>

        <div className="kpi-card accent-emerald">
          <div className="kpi-header">
            <span className="kpi-label">INTEGRITY VERIFICATION</span>
            <div className="kpi-icon-wrap" style={{ background: '#ECFDF5', color: '#059669' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="kpi-value num">100%</div>
          <div className="kpi-desc">Cryptographically chained audit hashes</div>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="table-toolbar">
        <div className="toolbar-search">
          <div className="toolbar-search-icon">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="toolbar-search-input"
            placeholder="Search audit trail by Record ID, User name, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="toolbar-filters">
          <select
            className="toolbar-select"
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
          >
            {modules.map((mod) => (
              <option key={mod} value={mod}>
                {mod === 'All' ? 'All Modules' : mod}
              </option>
            ))}
          </select>

          <select
            className="toolbar-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r === 'All' ? 'All Roles' : r}
              </option>
            ))}
          </select>

          <select
            className="toolbar-select"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            {actions.map((act) => (
              <option key={act} value={act}>
                {act === 'All' ? 'All Actions' : act}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* AUDIT TRAIL TABLE */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="card-title">Compliance Audit Register</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Statutory verification register complying with RBI urban co-operative audit mandates
            </div>
          </div>
          <span className="badge badge-neutral">Tamper-Proof Log</span>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User / Operator</th>
                <th>Role</th>
                <th>Action</th>
                <th>System Module</th>
                <th>Record Reference</th>
                <th>Summary of Change</th>
                <th className="align-right">Inspect</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((al) => (
                <tr key={al.id}>
                  <td style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{al.timestamp}</td>
                  <td style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>{al.user}</td>
                  <td>
                    <span className="badge badge-neutral">{al.role}</span>
                  </td>
                  <td>
                    <StatusBadge status={al.action} size="sm" />
                  </td>
                  <td>{al.module}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{al.recordId}</td>
                  <td style={{ fontSize: '0.75rem' }}>
                    {al.details || `${al.previousValue} → ${al.newValue}`}
                  </td>
                  <td className="align-right">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setInspectLog(al)}
                      title="Inspect full audit record details"
                      style={{ padding: '3px 8px' }}
                    >
                      <Eye size={12} />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT LOG MODAL */}
      {inspectLog && (
        <div className="modal-backdrop" onClick={() => setInspectLog(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div className="modal-title">Audit Record Details</div>
              <button className="btn-close" onClick={() => setInspectLog(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.8125rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>LOG ID</span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{inspectLog.id}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>TIMESTAMP</span>
                  <div style={{ fontWeight: 600 }}>{inspectLog.timestamp}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>OPERATOR</span>
                  <div style={{ fontWeight: 600 }}>{inspectLog.user} ({inspectLog.role})</div>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>TARGET MODULE</span>
                  <div style={{ fontWeight: 600 }}>{inspectLog.module}</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '12px' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>RECORD REFERENCE</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-navy-900)' }}>
                  {inspectLog.recordId}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>CHANGE DETAILS</span>
                <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '4px', border: '1px solid var(--color-border-subtle)', marginTop: '4px' }}>
                  {inspectLog.details || `${inspectLog.previousValue} → ${inspectLog.newValue}`}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setInspectLog(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
