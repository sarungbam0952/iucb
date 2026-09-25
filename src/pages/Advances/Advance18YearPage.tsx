import React, { useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Check,
  Eye,
  X,
  FileCheck,
  ShieldCheck,
  Building2,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ServiceAdvance18 } from '../../types';

export const Advance18YearPage: React.FC = () => {
  const { advances, formatCurrency, grant18YearAdvance, currentRole, setSelectedMemberId, setActivePage } = useApp();

  const [selectedAdvance, setSelectedAdvance] = useState<ServiceAdvance18 | null>(null);
  const [grantModalAdvance, setGrantModalAdvance] = useState<ServiceAdvance18 | null>(null);
  const [grantAmount, setGrantAmount] = useState(300000);
  const [sanctionOrder, setSanctionOrder] = useState(`IUCB/ET/ADV/2026-${Math.floor(10 + Math.random() * 90)}`);

  // Summary Metrics
  const eligibleCount = advances.filter((a) => a.advanceStatus === 'Eligible').length;
  const approachingCount = advances.filter((a) => a.advanceStatus === 'Approaching').length;
  const grantedCount = advances.filter((a) => a.advanceStatus === 'Granted').length;
  const totalGrantedAmount = advances
    .filter((a) => a.advanceStatus === 'Granted')
    .reduce((sum, a) => sum + (a.grantedAmount || 0), 0);

  const handleGrantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantModalAdvance) return;

    grant18YearAdvance(grantModalAdvance.id, Number(grantAmount), sanctionOrder);
    setGrantModalAdvance(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            18-Year Service Advance Tracker
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Autonomous one-time interest-free special advance granted upon completion of 18 continuous years of banking service.
          </p>
        </div>
      </div>

      {/* 4 SUMMARY METRICS */}
      <div className="kpi-grid">
        <div className="kpi-card accent-emerald">
          <div className="kpi-header">
            <span className="kpi-label">ELIGIBLE MEMBERS</span>
            <div className="kpi-icon-wrap" style={{ background: '#ECFDF5', color: '#059669' }}>
              <Award size={18} />
            </div>
          </div>
          <div className="kpi-value num">{eligibleCount}</div>
          <div className="kpi-desc">Completed 18+ years • Unclaimed</div>
        </div>

        <div className="kpi-card accent-amber">
          <div className="kpi-header">
            <span className="kpi-label">APPROACHING ELIGIBILITY</span>
            <div className="kpi-icon-wrap" style={{ background: '#FFFBEB', color: '#D97706' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value num">{approachingCount}</div>
          <div className="kpi-desc">Reaching milestone within current financial year</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">ADVANCES GRANTED</span>
            <div className="kpi-icon-wrap">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="kpi-value num">{grantedCount}</div>
          <div className="kpi-desc">Lifetime one-time benefit utilized</div>
        </div>

        <div className="kpi-card accent-burgundy">
          <div className="kpi-header">
            <span className="kpi-label">TOTAL ADVANCE AMOUNT</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--color-burgundy-50)', color: 'var(--color-burgundy-700)' }}>
              <Building2 size={18} />
            </div>
          </div>
          <div className="kpi-value num">{formatCurrency(totalGrantedAmount)}</div>
          <div className="kpi-desc">Disbursed interest-free pool capital</div>
        </div>
      </div>

      {/* POLICY CALLOUT BANNER */}
      <div
        style={{
          background: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: '8px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <ShieldCheck size={22} color="#1D4ED8" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.8125rem', color: '#1E3A8A' }}>
          <strong>Trust Statutory Rule 14(b):</strong> The 18-year service advance is strictly a <strong>ONE-TIME, INTEREST-FREE</strong> entitlement granted to bank employees with at least 18 years of uninterrupted service. Unlike regular loans, it carries no interest and no ongoing monthly repayment schedule.
        </div>
      </div>

      {/* TABLE */}
      <div className="table-container">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Member Name</th>
              <th>Employee ID</th>
              <th>Department</th>
              <th>Joining Date</th>
              <th>Years of Service</th>
              <th>Eligibility Date</th>
              <th>Advance Status</th>
              <th className="align-right">Sanctioned Amount</th>
              <th className="align-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {advances.map((adv) => (
              <tr key={adv.id}>
                <td style={{ fontWeight: 600 }}>{adv.memberName}</td>
                <td>
                  <span
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-burgundy-700)', cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedMemberId(adv.memberId);
                      setActivePage('member-profile');
                    }}
                  >
                    {adv.memberId}
                  </span>
                </td>
                <td>{adv.department}</td>
                <td>{adv.joiningDate}</td>
                <td>
                  <span style={{ fontWeight: 700, color: 'var(--color-navy-900)' }}>{adv.yearsOfService}</span> Years
                </td>
                <td>{adv.eligibilityDate}</td>
                <td>
                  <StatusBadge status={adv.advanceStatus} size="sm" />
                </td>
                <td className="align-right num" style={{ fontWeight: 700 }}>
                  {adv.grantedAmount ? formatCurrency(adv.grantedAmount) : '—'}
                </td>
                <td className="align-right">
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                    {/* Admin Grant Action */}
                    {currentRole === 'Admin' && adv.advanceStatus === 'Eligible' && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => {
                          setGrantModalAdvance(adv);
                          setGrantAmount(adv.eligibleAmount);
                        }}
                        title="Grant One-Time Advance"
                      >
                        <Check size={13} />
                        <span>Grant</span>
                      </button>
                    )}

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedAdvance(adv)}
                      title="Inspect Details"
                    >
                      <Eye size={13} />
                      <span>Details</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADVANCE DETAILS MODAL */}
      {selectedAdvance && (
        <div className="modal-backdrop" onClick={() => setSelectedAdvance(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">18-Year Service Advance Record</div>
              <button className="btn-close" onClick={() => setSelectedAdvance(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.8125rem' }}>
              <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '6px', border: '1px solid var(--color-border-subtle)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Member Name</span>
                    <strong>{selectedAdvance.memberName}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Employee ID</span>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>{selectedAdvance.memberId}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Date of Joining</span>
                    <strong>{selectedAdvance.joiningDate}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Total Service Completed</span>
                    <strong>{selectedAdvance.yearsOfService} Years</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Eligibility Date</span>
                    <strong>{selectedAdvance.eligibilityDate}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Current Status</span>
                    <StatusBadge status={selectedAdvance.advanceStatus} size="sm" />
                  </div>
                </div>
              </div>

              {selectedAdvance.advanceStatus === 'Granted' ? (
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '12px', borderRadius: '6px', color: '#065F46' }}>
                  <div style={{ fontWeight: 700, marginBottom: '4px' }}>Granted Benefit Details</div>
                  <div>Amount Granted: <strong>{formatCurrency(selectedAdvance.grantedAmount || 0)}</strong></div>
                  <div>Sanction Date: <strong>{selectedAdvance.grantedDate}</strong></div>
                  <div>Sanction Order No: <strong>{selectedAdvance.sanctionOrderNo}</strong></div>
                </div>
              ) : (
                <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '12px', borderRadius: '6px', color: '#1E40AF' }}>
                  <div>Eligible Special Advance Ceiling: <strong>{formatCurrency(selectedAdvance.eligibleAmount)}</strong></div>
                  <div style={{ marginTop: '4px' }}>{selectedAdvance.notes}</div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedAdvance(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GRANT ADVANCE MODAL */}
      {grantModalAdvance && (
        <div className="modal-backdrop" onClick={() => setGrantModalAdvance(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div className="modal-title">Sanction 18-Year Service Advance</div>
              <button className="btn-close" onClick={() => setGrantModalAdvance(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleGrantSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ fontSize: '0.8125rem', background: '#F8FAFC', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-border-subtle)' }}>
                  <div><strong>Member:</strong> {grantModalAdvance.memberName} ({grantModalAdvance.memberId})</div>
                  <div><strong>Service Length:</strong> {grantModalAdvance.yearsOfService} Years</div>
                  <div><strong>Eligible Ceiling:</strong> {formatCurrency(grantModalAdvance.eligibleAmount)}</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Sanction Amount (₹) *</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    max={grantModalAdvance.eligibleAmount}
                    value={grantAmount}
                    onChange={(e) => setGrantAmount(Number(e.target.value))}
                  />
                  <span className="form-hint">Non-repayable advance; interest-free.</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Sanction Order Reference *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={sanctionOrder}
                    onChange={(e) => setSanctionOrder(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setGrantModalAdvance(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={14} />
                  <span>Sanction Advance</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
