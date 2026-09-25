import React, { useState, useEffect } from 'react';
import { Search, User, CreditCard, Receipt, FileText, ShieldAlert, ArrowRight, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CommandPalette: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    members,
    loans,
    ledgerEntries,
    auditLogs,
    setActivePage,
    setSelectedMemberId,
    setSelectedLoanId,
    formatCurrency,
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener Ctrl+K / Cmd+K / Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Search across Members
  const matchedMembers = cleanQuery
    ? members.filter(
        (m) =>
          m.fullName.toLowerCase().includes(cleanQuery) ||
          m.id.toLowerCase().includes(cleanQuery) ||
          m.department.toLowerCase().includes(cleanQuery)
      ).slice(0, 4)
    : [];

  // Search across Loans
  const matchedLoans = cleanQuery
    ? loans.filter(
        (l) =>
          l.id.toLowerCase().includes(cleanQuery) ||
          l.memberName.toLowerCase().includes(cleanQuery) ||
          l.purpose.toLowerCase().includes(cleanQuery)
      ).slice(0, 3)
    : [];

  // Search across Transactions
  const matchedTransactions = cleanQuery
    ? ledgerEntries.filter(
        (t) =>
          t.id.toLowerCase().includes(cleanQuery) ||
          t.description.toLowerCase().includes(cleanQuery) ||
          t.transactionType.toLowerCase().includes(cleanQuery) ||
          (t.memberName && t.memberName.toLowerCase().includes(cleanQuery))
      ).slice(0, 3)
    : [];

  // Search across Audit logs
  const matchedAudits = cleanQuery
    ? auditLogs.filter(
        (a) =>
          a.recordId.toLowerCase().includes(cleanQuery) ||
          a.action.toLowerCase().includes(cleanQuery) ||
          a.module.toLowerCase().includes(cleanQuery) ||
          (a.details && a.details.toLowerCase().includes(cleanQuery))
      ).slice(0, 3)
    : [];

  const hasResults =
    matchedMembers.length > 0 ||
    matchedLoans.length > 0 ||
    matchedTransactions.length > 0 ||
    matchedAudits.length > 0;

  return (
    <div className="modal-backdrop" onClick={() => setIsSearchOpen(false)}>
      <div
        className="modal-dialog"
        style={{ maxWidth: '640px', marginTop: '40px', maxHeight: '80vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)', background: '#FFFFFF' }}>
          <Search size={20} color="var(--color-navy-700)" style={{ marginRight: '12px' }} />
          <input
            type="text"
            placeholder="Search Members, Employee IDs (e.g. IUCB-0042), Loans, Transactions, Audit..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: 'var(--color-navy-900)',
              background: 'transparent',
            }}
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ maxHeight: '450px', overflowY: 'auto', padding: '12px' }}>
          {!cleanQuery && (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>Type any employee name, ID (e.g. <code>IUCB-0001</code>), loan ID, or reference number.</p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
                <span className="badge badge-neutral" style={{ cursor: 'pointer' }} onClick={() => setQuery('IUCB-0001')}>IUCB-0001</span>
                <span className="badge badge-neutral" style={{ cursor: 'pointer' }} onClick={() => setQuery('Ningthoujam')}>Ningthoujam</span>
                <span className="badge badge-neutral" style={{ cursor: 'pointer' }} onClick={() => setQuery('LN-2026')}>LN-2026</span>
                <span className="badge badge-neutral" style={{ cursor: 'pointer' }} onClick={() => setQuery('TXN')}>TXN</span>
              </div>
            </div>
          )}

          {cleanQuery && !hasResults && (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <p style={{ fontSize: '0.875rem' }}>No matching records found for "{query}".</p>
              <span style={{ fontSize: '0.75rem' }}>Try searching by Employee ID, Name, Department, or Loan ID.</span>
            </div>
          )}

          {/* Members Group */}
          {matchedMembers.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', padding: '4px 8px', letterSpacing: '0.05em' }}>
                Members ({matchedMembers.length})
              </div>
              {matchedMembers.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedMemberId(m.id);
                    setActivePage('member-profile');
                    setIsSearchOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: 'var(--color-navy-800)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                      <User size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                        <span style={{ color: 'var(--color-burgundy-700)', marginRight: '6px' }}>{m.id}</span>
                        {m.fullName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {m.designation} • {m.department} • PF Bal: {formatCurrency(m.currentBalance)}
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={16} color="var(--color-text-subtle)" />
                </div>
              ))}
            </div>
          )}

          {/* Loans Group */}
          {matchedLoans.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', padding: '4px 8px', letterSpacing: '0.05em' }}>
                Loans ({matchedLoans.length})
              </div>
              {matchedLoans.map((l) => (
                <div
                  key={l.id}
                  onClick={() => {
                    setSelectedLoanId(l.id);
                    setActivePage('loans');
                    setIsSearchOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: 'var(--color-burgundy-100)', color: 'var(--color-burgundy-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CreditCard size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                        <span style={{ color: 'var(--color-burgundy-700)', marginRight: '6px' }}>{l.id}</span>
                        {l.memberName} — {formatCurrency(l.requestedAmount)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Status: {l.status} • Purpose: {l.purpose}
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={16} color="var(--color-text-subtle)" />
                </div>
              ))}
            </div>
          )}

          {/* Transactions Group */}
          {matchedTransactions.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', padding: '4px 8px', letterSpacing: '0.05em' }}>
                Transactions ({matchedTransactions.length})
              </div>
              {matchedTransactions.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    setSelectedMemberId(t.memberId);
                    setActivePage('ledger');
                    setIsSearchOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: '#EFF6FF', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Receipt size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                        {t.id} — {t.transactionType}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {t.description} • {t.credit > 0 ? `+${formatCurrency(t.credit)}` : `-${formatCurrency(t.debit)}`}
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={16} color="var(--color-text-subtle)" />
                </div>
              ))}
            </div>
          )}

          {/* Audit Logs Group */}
          {matchedAudits.length > 0 && (
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', padding: '4px 8px', letterSpacing: '0.05em' }}>
                Audit Records ({matchedAudits.length})
              </div>
              {matchedAudits.map((a) => (
                <div
                  key={a.id}
                  onClick={() => {
                    setActivePage('audit-trail');
                    setIsSearchOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: '#FEF2F2', color: '#B91C1C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShieldAlert size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                        {a.id} — {a.action} ({a.module})
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {a.details} • {a.timestamp}
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={16} color="var(--color-text-subtle)" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '8px 16px', background: '#F8FAFC', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <span>Navigate with mouse or arrow keys</span>
          <span>Press <code>ESC</code> to close</span>
        </div>
      </div>
    </div>
  );
};
