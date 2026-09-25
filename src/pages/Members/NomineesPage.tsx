import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Search,
  Eye,
  Download,
  AlertCircle,
  Phone,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const NomineesPage: React.FC = () => {
  const { members, setSelectedMemberId, setActivePage } = useApp();

  const [searchTerm, setSearchTerm] = useState('');

  // Flatten all registered nominees
  const allNominees = members.flatMap((m) =>
    (m.nominees || []).map((nom) => ({
      ...nom,
      memberId: m.id,
      memberName: m.fullName,
      memberDept: m.department,
    }))
  );

  const filtered = allNominees.filter((n) => {
    const term = searchTerm.toLowerCase();
    return (
      n.name.toLowerCase().includes(term) ||
      n.memberName.toLowerCase().includes(term) ||
      n.memberId.toLowerCase().includes(term) ||
      n.relationship.toLowerCase().includes(term)
    );
  });

  const handleExportCSV = () => {
    const headers = 'Member ID,Member Name,Department,Nominee Name,Relationship,Share %,Contact,Status,Last Updated\n';
    const rows = filtered
      .map(
        (n) =>
          `"${n.memberId}","${n.memberName}","${n.memberDept}","${n.name}","${n.relationship}",${n.sharePercentage}%,"${n.contactNumber}","${n.status}","${n.lastUpdated}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IUCB_Trust_Nominees_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            Registered Nominees Master Index
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Comprehensive register of beneficiaries designated across all {members.length} Trust member accounts.
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
          <Download size={14} />
          <span>Export Nominees</span>
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="table-toolbar">
        <div className="toolbar-search">
          <div className="toolbar-search-icon">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="toolbar-search-input"
            placeholder="Search by Nominee name, Member name, Employee ID, or Relationship..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="table-container">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Nominee Name</th>
              <th>Relationship</th>
              <th>Trust Member</th>
              <th>Employee ID</th>
              <th>Department</th>
              <th className="align-center">Share %</th>
              <th>Contact Phone</th>
              <th>Status</th>
              <th>Last Certified</th>
              <th className="align-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                  No nominees match your search criteria.
                </td>
              </tr>
            ) : (
              filtered.map((nom) => (
                <tr key={nom.id}>
                  <td style={{ fontWeight: 600 }}>{nom.name}</td>
                  <td>{nom.relationship}</td>
                  <td>
                    <span
                      style={{ fontWeight: 600, color: 'var(--color-navy-900)', cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedMemberId(nom.memberId);
                        setActivePage('member-profile');
                      }}
                    >
                      {nom.memberName}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-burgundy-700)', cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedMemberId(nom.memberId);
                        setActivePage('member-profile');
                      }}
                    >
                      {nom.memberId}
                    </span>
                  </td>
                  <td>{nom.memberDept}</td>
                  <td className="align-center">
                    <span className="badge badge-neutral" style={{ fontWeight: 700, color: 'var(--color-burgundy-700)' }}>
                      {nom.sharePercentage}%
                    </span>
                  </td>
                  <td style={{ fontSize: '0.75rem' }}>{nom.contactNumber}</td>
                  <td>
                    <StatusBadge status={nom.status} size="sm" />
                  </td>
                  <td style={{ fontSize: '0.75rem' }}>{nom.lastUpdated}</td>
                  <td className="align-right">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setSelectedMemberId(nom.memberId);
                        setActivePage('member-profile');
                      }}
                      title="View Member Profile"
                    >
                      <Eye size={13} />
                      <span>Member Profile</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
