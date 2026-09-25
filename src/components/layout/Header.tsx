import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Shield,
  LogOut,
  Sliders,
  CheckCircle,
} from 'lucide-react';
import { useApp, NavigationPage } from '../../context/AppContext';
import { NotificationPanel } from '../common/NotificationPanel';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const {
    activePage,
    currentRole,
    setCurrentRole,
    setIsSearchOpen,
    notifications,
    setActivePage,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Breadcrumbs & page titles
  const getPageMeta = (page: NavigationPage): { title: string; breadcrumb: string[] } => {
    switch (page) {
      case 'dashboard':
        return { title: 'Trust Management Dashboard', breadcrumb: ['Home', 'Dashboard'] };
      case 'members-all':
        return { title: 'Members Directory', breadcrumb: ['Members', 'All Members'] };
      case 'member-profile':
        return { title: 'Member Profile', breadcrumb: ['Members', 'Member Profile'] };
      case 'contributions':
        return { title: 'Monthly Contributions', breadcrumb: ['Members', 'Contributions'] };
      case 'ledger':
        return { title: 'Individual Account Ledger', breadcrumb: ['Members', 'Account Ledger / Passbook'] };
      case 'nominees':
        return { title: 'Nominee Management', breadcrumb: ['Members', 'Nominees'] };
      case 'fund-pool':
        return { title: 'Trust Fund Pool Control Centre', breadcrumb: ['Fund Management', 'Trust Fund Pool'] };
      case 'loans':
        return { title: 'Loan Management', breadcrumb: ['Fund Management', 'Loans'] };
      case 'advances':
        return { title: '18-Year Service Advance Tracker', breadcrumb: ['Fund Management', '18-Year Advance'] };
      case 'retirement':
        return { title: 'Retirement Settlement Pipeline', breadcrumb: ['Fund Management', 'Retirement Settlement'] };
      case 'approvals':
        return { title: 'Central Approvals Queue', breadcrumb: ['Home', 'Approvals'] };
      case 'reports':
        return { title: 'Financial Reports & Statements', breadcrumb: ['Reports', 'Overview & Exports'] };
      case 'reports-fund-pool':
        return { title: 'Fund Pool Overview Report', breadcrumb: ['Reports', 'Fund Pool Overview'] };
      case 'reports-member-statements':
        return { title: 'Member Statements Report', breadcrumb: ['Reports', 'Member Statements'] };
      case 'reports-loan-register':
        return { title: 'Loan Register Report', breadcrumb: ['Reports', 'Loan Register'] };
      case 'reports-18-year-advance':
        return { title: '18-Yr Advance Tracker Report', breadcrumb: ['Reports', '18-Yr Advance Tracker'] };
      case 'reports-retirement-pipeline':
        return { title: 'Retirement Pipeline Report', breadcrumb: ['Reports', 'Retirement Pipeline'] };
      case 'reports-audit-trail':
        return { title: 'Audit Trail Report', breadcrumb: ['Reports', 'Audit Trail'] };
      case 'audit-trail':
        return { title: 'Compliance Audit Trail', breadcrumb: ['Home', 'Audit Trail'] };
      case 'users-roles':
        return { title: 'Users & Access Control', breadcrumb: ['Administration', 'Users & Roles'] };
      case 'system-settings':
        return { title: 'System Configuration & Parameters', breadcrumb: ['Administration', 'System Settings'] };
      case 'my-dashboard':
        return { title: 'Employee Self-Service Portal', breadcrumb: ['My Trust', 'Dashboard'] };
      case 'my-account':
        return { title: 'My Member Account', breadcrumb: ['My Trust', 'My Account'] };
      case 'my-contributions':
        return { title: 'My Monthly PF Contributions', breadcrumb: ['My Trust', 'My Contributions'] };
      case 'my-ledger':
        return { title: 'My Account Ledger / Passbook', breadcrumb: ['My Trust', 'My Account Ledger'] };
      case 'my-loans':
        return { title: 'My Loan Account & Claims', breadcrumb: ['My Trust', 'My Loans'] };
      case 'my-advance':
        return { title: '18-Year Service Advance Tracker', breadcrumb: ['My Trust', '18-Year Advance'] };
      case 'my-retirement':
        return { title: 'Retirement Forecast & Superannuation', breadcrumb: ['My Trust', 'My Retirement'] };
      case 'my-nominee':
        return { title: 'Registered Nominee & Beneficiary', breadcrumb: ['My Trust', 'My Nominee'] };
      case 'my-notifications':
        return { title: 'Notifications & Alerts', breadcrumb: ['Other', 'Notifications'] };
      case 'my-support':
        return { title: 'Help & Secretariat Support', breadcrumb: ['Other', 'Help / Support'] };
      default:
        return { title: 'IUCB Employee Trust', breadcrumb: ['Home'] };
    }
  };

  const meta = getPageMeta(activePage);

  return (
    <>
      <header className="app-header">
        {/* Left: Title & Breadcrumbs */}
        <div className="header-left">
          <div className="header-breadcrumb">
            {meta.breadcrumb.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="breadcrumb-sep">/</span>}
                <span>{crumb}</span>
              </React.Fragment>
            ))}
          </div>
          <div className="header-title-wrap">
            <h1 className="header-title">{meta.title}</h1>
          </div>
        </div>

        {/* Right: Search, Live Role Switcher, Notifications, Profile */}
        <div className="header-right">
          {/* Global Search Button */}
          <div className="search-trigger" onClick={() => setIsSearchOpen(true)}>
            <Search size={15} color="var(--color-text-muted)" />
            <span>Search records...</span>
            <span className="search-shortcut">Ctrl+K</span>
          </div>

          {/* Interactive Role Switcher (Demo Preview Mode) */}
          <div className="role-badge-selector" title="Demo Preview: Switch active simulated role to test RBAC and self-service boundaries">
            <Shield size={14} color="var(--color-navy-700)" />
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.6875rem' }}>ROLE:</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
            >
              <option value="Admin">Admin (Full Access)</option>
              <option value="Data Entry">Data Entry (Operational)</option>
              <option value="Trust Committee">Trust Committee (Decisions)</option>
              <option value="Member / Employee">Member / Employee (Self-Service)</option>
            </select>
          </div>

          {/* Notifications Bell */}
          <button
            className="header-icon-btn"
            onClick={() => setIsNotifOpen(true)}
            title="Internal Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="badge-dot" />}
          </button>

          {/* User Profile */}
          <div style={{ position: 'relative' }}>
            <div
              className="user-profile-badge"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="user-avatar" style={currentRole === 'Member / Employee' ? { background: 'var(--color-burgundy-700)', color: '#FFFFFF' } : undefined}>
                {currentRole === 'Admin' ? 'AD' : currentRole === 'Data Entry' ? 'DE' : currentRole === 'Trust Committee' ? 'TC' : 'NJ'}
              </div>
              <div className="user-info">
                <span className="user-name">
                  {currentRole === 'Admin'
                    ? 'Admin'
                    : currentRole === 'Data Entry'
                    ? 'Kh. Tombi'
                    : currentRole === 'Trust Committee'
                    ? 'N. Joykumar'
                    : 'Ningthoujam John'}
                </span>
                <span className="user-role-label">
                  {currentRole === 'Member / Employee' ? 'Member (IUCB-0001)' : currentRole}
                </span>
              </div>
              <ChevronDown size={14} color="var(--color-text-muted)" />
            </div>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  width: '230px',
                  background: '#FFFFFF',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--color-border-subtle)',
                  padding: '6px',
                  zIndex: 50,
                }}
              >
                <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '4px' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                    {currentRole === 'Member / Employee'
                      ? 'Ningthoujam John'
                      : currentRole === 'Admin'
                      ? 'Administrator'
                      : currentRole}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                    {currentRole === 'Member / Employee'
                      ? 'Accounts & Finance • IUCB-0001'
                      : 'Imphal Urban Co-op Bank Ltd.'}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    if (currentRole === 'Member / Employee') {
                      setActivePage('my-account');
                    } else {
                      setActivePage('system-settings');
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 10px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.8125rem',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Sliders size={14} color="var(--color-navy-700)" />
                  <span>{currentRole === 'Member / Employee' ? 'My Account Profile' : 'System Settings'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setActivePage('users-roles');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 10px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.8125rem',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <User size={14} color="var(--color-text-secondary)" />
                  <span>My Profile</span>
                </button>

                <div style={{ height: '1px', background: 'var(--color-border-subtle)', margin: '4px 0' }} />

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    alert('Signed out securely. On-premise session terminated.');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 10px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.8125rem',
                    color: 'var(--color-danger-text)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-danger-bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notifications Drawer */}
      <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
