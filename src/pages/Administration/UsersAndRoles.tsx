import React, { useState } from 'react';
import {
  Users,
  Shield,
  UserPlus,
  CheckCircle,
  XCircle,
  Check,
  X,
  Lock,
  Eye,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { UserRole } from '../../types';

export const UsersAndRoles: React.FC = () => {
  const { users, addUser, currentRole, setCurrentRole } = useApp();

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    email: '',
    role: 'Data Entry' as UserRole,
    department: 'Accounts & Operations',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.username.trim()) return;

    addUser({
      name: newUser.name,
      username: newUser.username,
      email: newUser.email || `${newUser.username}@iucb.co.in`,
      role: newUser.role,
      department: newUser.department,
      status: 'Active',
    });

    setIsAddUserOpen(false);
    setNewUser({
      name: '',
      username: '',
      email: '',
      role: 'Data Entry',
      department: 'Accounts & Operations',
    });
  };

  // Permission Matrix definitions
  const matrix = [
    { module: 'Dashboard & Trust Overview', admin: 'Full View & Export', dataEntry: 'View Only', committee: 'View Only', member: 'Personal Overview Only' },
    { module: 'Member Master Records', admin: 'Create, Edit, Delete', dataEntry: 'Create & Edit (Requires Review)', committee: 'View Only', member: 'Personal Profile (Read / Request Update)' },
    { module: 'Monthly Contributions', admin: 'Approve & Post to Ledger', dataEntry: 'Enter & Submit', committee: 'View Only', member: 'Personal Monthly Deductions Only' },
    { module: 'Loan Claims & Sanctions', admin: 'Final Sanction Posting', dataEntry: 'Enter Loan Claim', committee: 'Review & Record Decision', member: 'Submit Claim & View Own Schedule' },
    { module: '18-Year Service Advance', admin: 'Sanction & Issue Order', dataEntry: 'Verify Service History', committee: 'Review Eligibility', member: 'Check Eligibility & Submit Advance Request' },
    { module: 'Retirement Settlements', admin: 'Final Settlement Sign-off', dataEntry: 'Calculate & Submit Draft', committee: 'Certification', member: 'View Superannuation Projection' },
    { module: 'Audit Trail Inspection', admin: 'Full Unrestricted Access', dataEntry: 'View Personal Activity', committee: 'View Decision Logs', member: 'No Access' },
    { module: 'System & Parameter Config', admin: 'Full Configuration', dataEntry: 'No Access', committee: 'No Access', member: 'No Access' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            RBAC
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Manage authorized bank personnel, operational roles, and segregation of duties.
          </p>
        </div>

        {currentRole === 'Admin' && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setIsAddUserOpen(true)}
          >
            <UserPlus size={14} />
            <span>Add System User</span>
          </button>
        )}
      </div>

      {/* ACTIVE ROLE TESTING SELECTOR CARD */}
      <div
        className="card"
        style={{
          background: '#F8FAFC',
          border: '1px solid var(--color-border-subtle)',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--color-navy-900)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={18} />
          </div>
          <div>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
              Current Active Simulated Session: <strong style={{ color: 'var(--color-burgundy-700)' }}>{currentRole}</strong>
            </span>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Switch roles to verify UI permissions (e.g. Data Entry users cannot see Approve/Reject buttons or Settings).
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {(['Admin', 'Data Entry', 'Trust Committee', 'Member / Employee'] as UserRole[]).map((r) => (
            <button
              key={r}
              className={`btn btn-sm ${currentRole === r ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCurrentRole(r)}
            >
              Simulate {r}
            </button>
          ))}
        </div>
      </div>

      {/* USER DIRECTORY TABLE */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Authorized System Users</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{users.length} operators active</span>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Username</th>
                <th>Assigned Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Last Login</th>
                <th className="align-right">Access Level</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{u.username}</td>
                  <td>
                    <span
                      className={`badge ${u.role === 'Admin'
                        ? 'badge-rejected'
                        : u.role === 'Data Entry'
                          ? 'badge-submitted'
                          : u.role === 'Trust Committee'
                            ? 'badge-pending'
                            : 'badge-neutral'
                        }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>{u.department}</td>
                  <td>
                    <StatusBadge status={u.status} size="sm" />
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{u.lastLogin}</td>
                  <td className="align-right" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    {u.role === 'Admin'
                      ? 'Full System Authority'
                      : u.role === 'Data Entry'
                        ? 'Operational Entry (No Approval)'
                        : u.role === 'Trust Committee'
                          ? 'Recommendation / Review'
                          : 'Self-Service (Restricted to Own Account)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROLE PERMISSION MATRIX */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Granular Role Permission Matrix</div>
            <div className="card-subtitle">Enforces segregation of duties between operational input and executive authorization</div>
          </div>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>System Feature / Module</th>
                <th>ADMIN</th>
                <th>DATA ENTRY</th>
                <th>TRUST COMMITTEE</th>
                <th>MEMBER / EMPLOYEE</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{row.module}</td>
                  <td style={{ color: 'var(--color-success-text)', fontWeight: 600 }}>
                    <Check size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                    {row.admin}
                  </td>
                  <td>
                    {row.dataEntry.includes('No Access') ? (
                      <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                        <X size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                        No Access
                      </span>
                    ) : (
                      <span>{row.dataEntry}</span>
                    )}
                  </td>
                  <td>
                    {row.committee.includes('No Access') ? (
                      <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                        <X size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                        No Access
                      </span>
                    ) : (
                      <span>{row.committee}</span>
                    )}
                  </td>
                  <td>
                    {row.member.includes('No Access') ? (
                      <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                        <X size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                        No Access
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-burgundy-700)', fontWeight: 600 }}>
                        <Check size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                        {row.member}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD USER MODAL */}
      {isAddUserOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddUserOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Create Authorized System User</div>
              <button className="btn-close" onClick={() => setIsAddUserOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="e.g. Heikrujam Ibomcha Singh"
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Username *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                      placeholder="e.g. ibomcha.h"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Role Assignment *</label>
                    <select
                      className="form-select"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                    >
                      <option value="Data Entry">Data Entry</option>
                      <option value="Trust Committee">Trust Committee</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddUserOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
