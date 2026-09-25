import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ChevronDown,
  ChevronRight,
  Landmark,
  FileCheck2,
  FileSpreadsheet,
  Shield,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  CircleDollarSign,
  Briefcase,
  Award,
  UserCheck,
  Building2,
  BookOpen,
  Bell,
  HelpCircle,
  CreditCard,
} from 'lucide-react';
import { useApp, NavigationPage } from '../../context/AppContext';

import iucbLogo from '../../assets/iucb-logo.png';

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, loans, contributions, currentRole, notifications } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [membersOpen, setMembersOpen] = useState(true);
  const [fundOpen, setFundOpen] = useState(true);
  const isReportsPage = activePage === 'reports' || activePage.startsWith('reports-');
  const [reportsOpen, setReportsOpen] = useState(isReportsPage);
  const [adminOpen, setAdminOpen] = useState(false);

  React.useEffect(() => {
    if (isReportsPage) {
      setReportsOpen(true);
    }
  }, [isReportsPage]);

  // Compute pending approvals count for badge
  const pendingLoans = loans.filter((l) => l.status === 'Pending Approval' || l.status === 'Under Committee Review').length;
  const pendingContributions = contributions.filter((c) => c.entryStatus === 'Pending Approval').length;
  const totalPendingApprovals = pendingLoans + pendingContributions;

  const navigateTo = (page: NavigationPage) => {
    setActivePage(page);
  };

  return (
    <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className={`sidebar-header ${collapsed ? 'collapsed-header' : ''}`}>
        {!collapsed ? (
          <>
            <div className="brand-badge">
              <div className="brand-logo-wrap">
                <img
                  src={iucbLogo}
                  alt="The Imphal Urban Co-operative Bank Ltd."
                  className="brand-official-logo"
                />
              </div>
              <div className="brand-meta">
                <span className="brand-title">IUCB Employee Trust</span>
                <span className="brand-subtitle">Fund Management</span>
              </div>
            </div>

            <button
              className="sidebar-toggle-btn"
              onClick={() => setCollapsed(true)}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose size={17} strokeWidth={1.75} />
            </button>
          </>
        ) : (
          <button
            className="sidebar-toggle-btn-collapsed"
            onClick={() => setCollapsed(false)}
            title="Expand sidebar"
            aria-label="Expand sidebar"
            data-tooltip="Expand sidebar"
          >
            <div className="logo-face">
              <img
                src={iucbLogo}
                alt="The Imphal Urban Co-operative Bank Ltd."
                className="brand-official-logo"
              />
            </div>
            <div className="toggle-face">
              <PanelLeftOpen size={18} strokeWidth={1.75} />
            </div>
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="sidebar-nav">
        {currentRole === 'Member / Employee' ? (
          <>
            {/* Group: MY TRUST */}
            {!collapsed && <div className="sidebar-group-label">MY TRUST</div>}

            <button
              className={`sidebar-item ${activePage === 'my-dashboard' ? 'active' : ''}`}
              onClick={() => navigateTo('my-dashboard')}
              title="Dashboard"
            >
              <LayoutDashboard className="item-icon" />
              {!collapsed && <span className="item-label">Dashboard</span>}
            </button>

            <button
              className={`sidebar-item ${activePage === 'my-account' ? 'active' : ''}`}
              onClick={() => navigateTo('my-account')}
              title="My Account"
            >
              <UserCheck className="item-icon" />
              {!collapsed && <span className="item-label">My Account</span>}
            </button>

            <button
              className={`sidebar-item ${activePage === 'my-contributions' ? 'active' : ''}`}
              onClick={() => navigateTo('my-contributions')}
              title="My Contributions"
            >
              <CircleDollarSign className="item-icon" />
              {!collapsed && <span className="item-label">My Contributions</span>}
            </button>

            <button
              className={`sidebar-item ${activePage === 'my-ledger' ? 'active' : ''}`}
              onClick={() => navigateTo('my-ledger')}
              title="My Account Ledger"
            >
              <BookOpen className="item-icon" />
              {!collapsed && <span className="item-label">My Account Ledger</span>}
            </button>

            <button
              className={`sidebar-item ${activePage === 'my-loans' ? 'active' : ''}`}
              onClick={() => navigateTo('my-loans')}
              title="My Loans"
            >
              <CreditCard className="item-icon" />
              {!collapsed && <span className="item-label">My Loans</span>}
            </button>

            <button
              className={`sidebar-item ${activePage === 'my-advance' ? 'active' : ''}`}
              onClick={() => navigateTo('my-advance')}
              title="My 18-Year Advance"
            >
              <Award className="item-icon" />
              {!collapsed && <span className="item-label">My 18-Year Advance</span>}
            </button>

            <button
              className={`sidebar-item ${activePage === 'my-retirement' ? 'active' : ''}`}
              onClick={() => navigateTo('my-retirement')}
              title="My Retirement"
            >
              <Landmark className="item-icon" />
              {!collapsed && <span className="item-label">My Retirement</span>}
            </button>

            <button
              className={`sidebar-item ${activePage === 'my-nominee' ? 'active' : ''}`}
              onClick={() => navigateTo('my-nominee')}
              title="My Nominee"
            >
              <Users className="item-icon" />
              {!collapsed && <span className="item-label">My Nominee</span>}
            </button>

            {/* Group: OTHER */}
            {!collapsed ? (
              <div className="sidebar-group-label" style={{ marginTop: '16px' }}>OTHER</div>
            ) : (
              <div className="sidebar-group-divider" />
            )}

            <button
              className={`sidebar-item ${activePage === 'my-notifications' ? 'active' : ''}`}
              onClick={() => navigateTo('my-notifications')}
              title="Notifications"
            >
              <Bell className="item-icon" />
              {!collapsed && (
                <>
                  <span className="item-label">Notifications</span>
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="item-badge">{notifications.filter((n) => !n.read).length}</span>
                  )}
                </>
              )}
            </button>

            <button
              className={`sidebar-item ${activePage === 'my-support' ? 'active' : ''}`}
              onClick={() => navigateTo('my-support')}
              title="Help / Support"
            >
              <HelpCircle className="item-icon" />
              {!collapsed && <span className="item-label">Help / Support</span>}
            </button>
          </>
        ) : (
          <>
            {/* Dashboard */}
            <button
              className={`sidebar-item ${activePage === 'dashboard' ? 'active' : ''}`}
              onClick={() => navigateTo('dashboard')}
              title="Dashboard"
            >
              <LayoutDashboard className="item-icon" />
              {!collapsed && <span className="item-label">Dashboard</span>}
            </button>

            {collapsed && <div className="sidebar-group-divider" />}

            {/* Members Module */}
            {!collapsed ? (
              <div>
                <div
                  className="sidebar-group-label"
                  onClick={() => setMembersOpen(!membersOpen)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <span>Members</span>
                  {membersOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>
                {membersOpen && (
                  <div className="sidebar-subnav">
                    <button
                      className={`sidebar-subitem ${activePage === 'members-all' ? 'active' : ''}`}
                      onClick={() => navigateTo('members-all')}
                    >
                      All Members
                    </button>
                    <button
                      className={`sidebar-subitem ${activePage === 'contributions' ? 'active' : ''}`}
                      onClick={() => navigateTo('contributions')}
                    >
                      Contributions
                    </button>
                    <button
                      className={`sidebar-subitem ${activePage === 'ledger' ? 'active' : ''}`}
                      onClick={() => navigateTo('ledger')}
                    >
                      Member Accounts
                    </button>
                    <button
                      className={`sidebar-subitem ${activePage === 'nominees' ? 'active' : ''}`}
                      onClick={() => navigateTo('nominees')}
                    >
                      Nominees
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className={`sidebar-item ${['members-all', 'contributions', 'ledger', 'nominees'].includes(activePage) ? 'active' : ''}`}
                onClick={() => navigateTo('members-all')}
                title="Members"
              >
                <Users className="item-icon" />
              </button>
            )}

            {/* Fund Management Module */}
            {!collapsed ? (
              <div>
                <div
                  className="sidebar-group-label"
                  onClick={() => setFundOpen(!fundOpen)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <span>Fund Management</span>
                  {fundOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>
                {fundOpen && (
                  <div className="sidebar-subnav">
                    <button
                      className={`sidebar-subitem ${activePage === 'fund-pool' ? 'active' : ''}`}
                      onClick={() => navigateTo('fund-pool')}
                    >
                      Trust Fund Pool
                    </button>
                    <button
                      className={`sidebar-subitem ${activePage === 'loans' ? 'active' : ''}`}
                      onClick={() => navigateTo('loans')}
                    >
                      Loans
                    </button>
                    <button
                      className={`sidebar-subitem ${activePage === 'advances' ? 'active' : ''}`}
                      onClick={() => navigateTo('advances')}
                    >
                      18-Year Advance
                    </button>
                    <button
                      className={`sidebar-subitem ${activePage === 'retirement' ? 'active' : ''}`}
                      onClick={() => navigateTo('retirement')}
                    >
                      Retirement Settlement
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className={`sidebar-item ${['fund-pool', 'loans', 'advances', 'retirement'].includes(activePage) ? 'active' : ''}`}
                onClick={() => navigateTo('fund-pool')}
                title="Fund Management"
              >
                <Landmark className="item-icon" />
              </button>
            )}

            {/* Central Approvals Queue */}
            <button
              className={`sidebar-item ${activePage === 'approvals' ? 'active' : ''}`}
              onClick={() => navigateTo('approvals')}
              title="Approvals"
            >
              <FileCheck2 className="item-icon" />
              {!collapsed && (
                <>
                  <span className="item-label">Approvals</span>
                  {totalPendingApprovals > 0 && (
                    <span className="item-badge">{totalPendingApprovals}</span>
                  )}
                </>
              )}
            </button>

            {collapsed && <div className="sidebar-group-divider" />}

            {/* Reports Module */}
            {!collapsed ? (
              <div>
                <div
                  className="sidebar-group-label"
                  onClick={() => setReportsOpen(!reportsOpen)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <span>Reports</span>
                  {reportsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>
                {reportsOpen && (
                  <div className="sidebar-subnav">
                    <button
                      className={`sidebar-subitem ${activePage === 'reports' ? 'active' : ''}`}
                      onClick={() => navigateTo('reports')}
                    >
                      Overview & Exports
                    </button>
                    <button
                      className={`sidebar-subitem ${activePage === 'reports-fund-pool' ? 'active' : ''}`}
                      onClick={() => navigateTo('reports-fund-pool')}
                    >
                      Fund Pool Overview
                    </button>
                    <button
                      className={`sidebar-subitem ${activePage === 'reports-member-statements' ? 'active' : ''}`}
                      onClick={() => navigateTo('reports-member-statements')}
                    >
                      Member Statements
                    </button>
                    <button
                      className={`sidebar-subitem ${activePage === 'reports-loan-register' ? 'active' : ''}`}
                      onClick={() => navigateTo('reports-loan-register')}
                    >
                      Loan Register
                    </button>
                    <button
                      className={`sidebar-subitem ${activePage === 'reports-18-year-advance' ? 'active' : ''}`}
                      onClick={() => navigateTo('reports-18-year-advance')}
                    >
                      18-Yr Advance Tracker
                    </button>
                    <button
                      className={`sidebar-subitem ${activePage === 'reports-retirement-pipeline' ? 'active' : ''}`}
                      onClick={() => navigateTo('reports-retirement-pipeline')}
                    >
                      Retirement Pipeline
                    </button>
                    <button
                      className={`sidebar-subitem ${activePage === 'reports-audit-trail' || activePage === 'audit-trail' ? 'active' : ''}`}
                      onClick={() => navigateTo('reports-audit-trail')}
                    >
                      Audit Trail
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className={`sidebar-item ${activePage === 'reports' || activePage.startsWith('reports-') || activePage === 'audit-trail' ? 'active' : ''}`}
                onClick={() => navigateTo('reports')}
                title="Reports"
              >
                <FileSpreadsheet className="item-icon" />
              </button>
            )}

            {collapsed && <div className="sidebar-group-divider" />}

            {/* Administration */}
            {!collapsed ? (
              <div>
                <div
                  className="sidebar-group-label"
                  onClick={() => setAdminOpen(!adminOpen)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <span>Administration</span>
                  {adminOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>
                {adminOpen && (
                  <div className="sidebar-subnav">
                    <button
                      className={`sidebar-subitem ${activePage === 'users-roles' ? 'active' : ''}`}
                      onClick={() => navigateTo('users-roles')}
                    >
                      Users & Roles
                    </button>
                    <button
                      className={`sidebar-subitem ${activePage === 'system-settings' ? 'active' : ''}`}
                      onClick={() => navigateTo('system-settings')}
                    >
                      System Settings
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className={`sidebar-item ${['users-roles', 'system-settings'].includes(activePage) ? 'active' : ''}`}
                onClick={() => navigateTo('users-roles')}
                title="Administration"
              >
                <Settings className="item-icon" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Footer / Profile */}
      <div className="sidebar-footer">
        {!collapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: currentRole === 'Member / Employee' ? 'var(--color-burgundy-700)' : 'var(--color-navy-800)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                }}
              >
                {currentRole === 'Member / Employee'
                  ? 'NJ'
                  : currentRole === 'Admin'
                  ? 'AD'
                  : currentRole === 'Data Entry'
                  ? 'DE'
                  : 'TC'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#F8FAFC' }}>
                  {currentRole === 'Member / Employee'
                    ? 'Ningthoujam John'
                    : currentRole === 'Admin'
                    ? 'Admin'
                    : currentRole === 'Data Entry'
                    ? 'Kh. Tombi'
                    : 'N. Joykumar'}
                </span>
                <span style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>
                  {currentRole === 'Member / Employee'
                    ? 'IUCB-0001 • Accounts'
                    : currentRole === 'Admin'
                    ? 'Administrator'
                    : currentRole}
                </span>
              </div>
            </div>
            <button
              onClick={() => alert('Signed out securely. In production on-premise deployment, session cookies are invalidated.')}
              style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div style={{ margin: '0 auto' }}>
            <button
              onClick={() => alert('Signed out securely.')}
              style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
