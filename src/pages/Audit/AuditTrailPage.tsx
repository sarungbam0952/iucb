import React, { useState } from 'react';
import {
  History,
  ShieldAlert,
  Users,
  FileCheck,
  Search,
  Filter,
  Download,
  Eye,
  X,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AuditLog } from '../../types';

export const AuditTrailPage: React.FC = () => {
  const { auditLogs } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');

  const [inspectLog, setInspectLog] = useState<AuditLog | null>(null);

  // Summary Metrics
  const todayChanges = auditLogs.length;
  const usersActive = 3;
  const financialRecordsModified = auditLogs.filter(
    (a) => a.module === 'Contributions' || a.module === 'Loans' || a.module === '18-Year Advance'
  ).length;

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

  const handleExportCSV = () => {
    const headers = 'Audit ID,Timestamp,User,Role,Action,Module,Record ID,Previous Value,New Value,Details\n';
    const rows = filteredLogs.map((l) =>
      `"${l.id}","${l.timestamp}","${l.user}","${l.role}","${l.action}","${l.module}","${l.recordId}","${l.previousValue}","${l.newValue}","${l.details || ''}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IUCB_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            Compliance Audit Trail
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Immutable chronological ledger of all modifications, approvals, parameter changes, and record creations.
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
          <Download size={14} />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* 3 SUMMARY METRIC TILES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        <div className="kpi-card accent-burgundy">
          <div className="kpi-header">
            <span className="kpi-label">TOTAL LOGGED AUDIT EVENTS</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--color-burgundy-50)', color: 'var(--color-burgundy-700)' }}>
              <History size={18} />
            </div>
          </div>
          <div className="kpi-value num">{todayChanges}</div>
          <div className="kpi-desc">Traceable transaction events</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">ACTIVE SYSTEM OPERATORS</span>
            <div className="kpi-icon-wrap">
              <Users size={18} />
            </div>
          </div>
          <div className="kpi-value num">{usersActive}</div>
          <div className="kpi-desc">Admin, Data Entry, Trust Committee</div>
        </div>

        <div className="kpi-card accent-emerald">
          <div className="kpi-header">
            <span className="kpi-label">FINANCIAL RECORDS STAMPED</span>
            <div className="kpi-icon-wrap" style={{ background: '#ECFDF5', color: '#059669' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="kpi-value num">{financialRecordsModified}</div>
          <div className="kpi-desc">With previous/new value verification</div>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="table-toolbar">
        <div className="toolbar-search">
          <div className="toolbar-search-icon">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="toolbar-search-input"
            placeholder="Search by Record ID, User, or Details..."
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
            <option value="All">All Modules</option>
            <option value="Members">Members</option>
            <option value="Contributions">Contributions</option>
            <option value="Loans">Loans</option>
            <option value="18-Year Advance">18-Year Advance</option>
            <option value="Retirement">Retirement</option>
            <option value="Administration">Administration</option>
          </select>

          <select
            className="toolbar-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Data Entry">Data Entry</option>
            <option value="Trust Committee">Trust Committee</option>
          </select>

          <select
            className="toolbar-select"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="All">All Actions</option>
            <option value="Approved">Approved</option>
            <option value="Created">Created</option>
            <option value="Updated">Updated</option>
            <option value="Rejected">Rejected</option>
            <option value="Configured">Configured</option>
          </select>
        </div>
      </div>

      {/* AUDIT LOG TABLE */}
      <div className="table-container">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Role</th>
              <th>Action</th>
              <th>Module</th>
              <th>Record ID</th>
              <th>Previous Value</th>
              <th>New Value</th>
              <th className="align-right">Inspection</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                  No audit log entries matching filters.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                  <td style={{ fontWeight: 600 }}>{log.user}</td>
                  <td>
                    <span className="badge badge-neutral">{log.role}</span>
                  </td>
                  <td>
                    <StatusBadge status={log.action} size="sm" />
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>{log.module}</span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-burgundy-700)' }}>
                    {log.recordId}
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {log.previousValue}
                  </td>
                  <td style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-navy-900)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {log.newValue}
                  </td>
                  <td className="align-right">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setInspectLog(log)}
                      title="Inspect Diff Details"
                    >
                      <Eye size={13} />
                      <span>Diff</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* AUDIT DETAILS INSPECTION MODAL */}
      {inspectLog && (
        <div className="modal-backdrop" onClick={() => setInspectLog(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={18} color="var(--color-burgundy-700)" />
                <span className="modal-title">Audit Record Inspection: {inspectLog.id}</span>
              </div>
              <button className="btn-close" onClick={() => setInspectLog(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.8125rem' }}>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid var(--color-border-subtle)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div><span style={{ color: 'var(--color-text-muted)' }}>Timestamp:</span> <strong>{inspectLog.timestamp}</strong></div>
                <div><span style={{ color: 'var(--color-text-muted)' }}>Operator:</span> <strong>{inspectLog.user}</strong></div>
                <div><span style={{ color: 'var(--color-text-muted)' }}>Role:</span> <span className="badge badge-neutral">{inspectLog.role}</span></div>
                <div><span style={{ color: 'var(--color-text-muted)' }}>Action:</span> <StatusBadge status={inspectLog.action} size="sm" /></div>
                <div><span style={{ color: 'var(--color-text-muted)' }}>Target Module:</span> <strong>{inspectLog.module}</strong></div>
                <div><span style={{ color: 'var(--color-text-muted)' }}>Record ID:</span> <strong style={{ fontFamily: 'var(--font-mono)' }}>{inspectLog.recordId}</strong></div>
              </div>

              {/* Before / After Diff */}
              <div>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                  State Transition Diff
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', padding: '10px' }}>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#991B1B', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      Previous Value
                    </span>
                    <pre style={{ fontSize: '0.75rem', color: '#991B1B', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)' }}>
                      {inspectLog.previousValue}
                    </pre>
                  </div>

                  <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '6px', padding: '10px' }}>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#065F46', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      New Recorded Value
                    </span>
                    <pre style={{ fontSize: '0.75rem', color: '#065F46', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)' }}>
                      {inspectLog.newValue}
                    </pre>
                  </div>
                </div>
              </div>

              {inspectLog.details && (
                <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border-subtle)' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--color-navy-900)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                    Additional Operator Notes & Context
                  </span>
                  <p style={{ color: 'var(--color-text-secondary)' }}>{inspectLog.details}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setInspectLog(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
