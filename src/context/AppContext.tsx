import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Member,
  ContributionRecord,
  AccountLedgerEntry,
  LoanRecord,
  ServiceAdvance18,
  RetirementSettlement,
  AuditLog,
  SystemUser,
  SystemSettings,
  NotificationItem,
  UserRole,
  Nominee,
} from '../types';
import {
  initialMembers,
  initialContributions,
  initialLoans,
  initialAdvances,
  initialRetirements,
  initialLedgerEntries,
  initialAuditLogs,
  initialUsers,
  initialSystemSettings,
  initialNotifications,
} from '../data/mockData';

export type NavigationPage =
  | 'dashboard'
  | 'members-all'
  | 'member-profile'
  | 'contributions'
  | 'ledger'
  | 'nominees'
  | 'fund-pool'
  | 'loans'
  | 'advances'
  | 'retirement'
  | 'approvals'
  | 'reports'
  | 'reports-fund-pool'
  | 'reports-member-statements'
  | 'reports-loan-register'
  | 'reports-18-year-advance'
  | 'reports-retirement-pipeline'
  | 'reports-audit-trail'
  | 'audit-trail'
  | 'users-roles'
  | 'system-settings'
  // Member / Employee Self-Service Navigation
  | 'my-dashboard'
  | 'my-account'
  | 'my-contributions'
  | 'my-ledger'
  | 'my-loans'
  | 'my-advance'
  | 'my-retirement'
  | 'my-nominee'
  | 'my-notifications'
  | 'my-support';

export const PAGE_TO_ROUTE: Record<NavigationPage, string> = {
  'dashboard': '/dashboard',
  'members-all': '/members',
  'member-profile': '/members/profile',
  'contributions': '/members/contributions',
  'ledger': '/members/ledger',
  'nominees': '/members/nominees',
  'fund-pool': '/fund-pool',
  'loans': '/loans',
  'advances': '/advances',
  'retirement': '/retirement',
  'approvals': '/approvals',
  'reports': '/reports',
  'reports-fund-pool': '/reports/fund-pool',
  'reports-member-statements': '/reports/member-statements',
  'reports-loan-register': '/reports/loan-register',
  'reports-18-year-advance': '/reports/18-year-advance',
  'reports-retirement-pipeline': '/reports/retirement-pipeline',
  'reports-audit-trail': '/reports/audit-trail',
  'audit-trail': '/audit-trail',
  'users-roles': '/users-roles',
  'system-settings': '/system-settings',
  'my-dashboard': '/my-dashboard',
  'my-account': '/my-account',
  'my-contributions': '/my-contributions',
  'my-ledger': '/my-ledger',
  'my-loans': '/my-loans',
  'my-advance': '/my-advance',
  'my-retirement': '/my-retirement',
  'my-nominee': '/my-nominee',
  'my-notifications': '/my-notifications',
  'my-support': '/my-support',
};

export const parsePathToPage = (pathname: string): NavigationPage => {
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  
  // Direct exact route checks for dedicated reports
  if (cleanPath === '/reports/fund-pool') return 'reports-fund-pool';
  if (cleanPath === '/reports/member-statements') return 'reports-member-statements';
  if (cleanPath === '/reports/loan-register') return 'reports-loan-register';
  if (cleanPath === '/reports/18-year-advance' || cleanPath === '/reports/18-yr-advance') return 'reports-18-year-advance';
  if (cleanPath === '/reports/retirement-pipeline') return 'reports-retirement-pipeline';
  if (cleanPath === '/reports/audit-trail') return 'reports-audit-trail';
  if (cleanPath === '/reports') return 'reports';

  // Check matching reverse routes
  for (const [page, route] of Object.entries(PAGE_TO_ROUTE)) {
    if (cleanPath === route) {
      return page as NavigationPage;
    }
  }

  return 'dashboard';
};

interface AppContextType {
  // Navigation & Role
  activePage: NavigationPage;
  setActivePage: (page: NavigationPage) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  selectedMemberId: string;
  setSelectedMemberId: (id: string) => void;
  selectedLoanId: string | null;
  setSelectedLoanId: (id: string | null) => void;

  // Data Collections
  members: Member[];
  contributions: ContributionRecord[];
  loans: LoanRecord[];
  advances: ServiceAdvance18[];
  retirements: RetirementSettlement[];
  ledgerEntries: AccountLedgerEntry[];
  auditLogs: AuditLog[];
  users: SystemUser[];
  settings: SystemSettings;
  notifications: NotificationItem[];

  // Mutators & Workflows
  addMember: (member: Omit<Member, 'id' | 'currentBalance' | 'totalContribution' | 'totalInterest' | 'outstandingLoan' | 'hasLoan'>) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  addNominee: (memberId: string, nominee: Omit<Nominee, 'id' | 'lastUpdated'>) => void;
  removeNominee: (memberId: string, nomineeId: string) => void;

  addContribution: (record: Omit<ContributionRecord, 'id' | 'entryStatus' | 'enteredDate'>) => void;
  approveContribution: (id: string) => void;
  rejectContribution: (id: string, reason: string) => void;

  submitLoan: (loan: Omit<LoanRecord, 'id' | 'status' | 'outstandingPrincipal' | 'outstandingInterest' | 'totalOutstanding' | 'approvalTimeline' | 'repayments'>) => void;
  committeeRecommendLoan: (loanId: string, notes: string) => void;
  approveLoan: (loanId: string, adminNotes?: string) => void;
  rejectLoan: (loanId: string, reason: string) => void;

  grant18YearAdvance: (advanceId: string, amount: number, orderNo: string) => void;
  approveRetirementSettlement: (settlementId: string) => void;

  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  addUser: (user: Omit<SystemUser, 'id' | 'lastLogin'>) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Global search trigger
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Utility formatters
  formatCurrency: (amount: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePageState] = useState<NavigationPage>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash ? window.location.hash.replace(/^#/, '') : '';
      if (hash) {
        return parsePathToPage(hash);
      }
      return parsePathToPage(window.location.pathname);
    }
    return 'dashboard';
  });

  const setActivePage = (page: NavigationPage) => {
    setActivePageState(page);
    if (typeof window !== 'undefined') {
      const targetRoute = PAGE_TO_ROUTE[page] || '/dashboard';
      if (window.location.pathname !== targetRoute) {
        window.history.pushState({ page }, '', targetRoute);
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const page = parsePathToPage(window.location.pathname);
      setActivePageState(page);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [currentRole, setCurrentRole] = useState<UserRole>('Admin');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('IUCB-0001');
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>('LN-2026-0021');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSetCurrentRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'Member / Employee') {
      setSelectedMemberId('IUCB-0001');
      setActivePage('my-dashboard');
    } else {
      if (activePage.startsWith('my-')) {
        setActivePage('dashboard');
      }
    }
  };

  // Reactive state initialized from mock data / localStorage if available
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('iucb_members');
    return saved ? JSON.parse(saved) : initialMembers;
  });

  const [contributions, setContributions] = useState<ContributionRecord[]>(() => {
    const saved = localStorage.getItem('iucb_contributions');
    return saved ? JSON.parse(saved) : initialContributions;
  });

  const [loans, setLoans] = useState<LoanRecord[]>(() => {
    const saved = localStorage.getItem('iucb_loans');
    return saved ? JSON.parse(saved) : initialLoans;
  });

  const [advances, setAdvances] = useState<ServiceAdvance18[]>(() => {
    const saved = localStorage.getItem('iucb_advances');
    return saved ? JSON.parse(saved) : initialAdvances;
  });

  const [retirements, setRetirements] = useState<RetirementSettlement[]>(() => {
    const saved = localStorage.getItem('iucb_retirements');
    return saved ? JSON.parse(saved) : initialRetirements;
  });

  const [ledgerEntries, setLedgerEntries] = useState<AccountLedgerEntry[]>(() => {
    const saved = localStorage.getItem('iucb_ledger');
    return saved ? JSON.parse(saved) : initialLedgerEntries;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('iucb_audit');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [users, setUsers] = useState<SystemUser[]>(() => {
    const saved = localStorage.getItem('iucb_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('iucb_settings');
    return saved ? JSON.parse(saved) : initialSystemSettings;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('iucb_notifs');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('iucb_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('iucb_contributions', JSON.stringify(contributions));
  }, [contributions]);

  useEffect(() => {
    localStorage.setItem('iucb_loans', JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem('iucb_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Helper for logging audit trail
  const logAudit = (
    action: AuditLog['action'],
    module: AuditLog['module'],
    recordId: string,
    previousValue: string,
    newValue: string,
    details?: string
  ) => {
    const newLog: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      user: currentRole === 'Admin' ? 'Admin (IUCB)' : currentRole === 'Data Entry' ? 'Kh. Tombi (Data Entry)' : 'Trust Committee Secy',
      role: currentRole,
      action,
      module,
      recordId,
      previousValue,
      newValue,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Indian Rupee currency formatter
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Members mutations
  const addMember = (data: Omit<Member, 'id' | 'currentBalance' | 'totalContribution' | 'totalInterest' | 'outstandingLoan' | 'hasLoan'>) => {
    const nextNum = members.length + 1;
    const newId = `IUCB-${String(nextNum).padStart(4, '0')}`;
    const newMember: Member = {
      ...data,
      id: newId,
      currentBalance: 0,
      totalContribution: 0,
      totalInterest: 0,
      outstandingLoan: 0,
      hasLoan: false,
    };

    setMembers((prev) => [newMember, ...prev]);
    logAudit('Created', 'Members', newId, 'None', `Created member record for ${data.fullName}`, `Designation: ${data.designation}, Salary: ₹${data.salary}`);
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    logAudit('Updated', 'Members', id, 'Existing Profile', JSON.stringify(updates), `Updated member ${id}`);
  };

  const addNominee = (memberId: string, nomineeData: Omit<Nominee, 'id' | 'lastUpdated'>) => {
    const newNominee: Nominee = {
      ...nomineeData,
      id: `NOM-${memberId}-${Date.now().toString().slice(-4)}`,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            nominees: [...m.nominees, newNominee],
          };
        }
        return m;
      })
    );

    logAudit('Created', 'Members', memberId, 'Nominee record', `Added nominee ${nomineeData.name} (${nomineeData.sharePercentage}%)`);
  };

  const removeNominee = (memberId: string, nomineeId: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            nominees: m.nominees.filter((n) => n.id !== nomineeId),
          };
        }
        return m;
      })
    );

    logAudit('Deleted', 'Members', memberId, `Nominee ${nomineeId}`, 'Removed nominee', 'Nominee record removed from member account');
  };

  // Contributions mutations
  const addContribution = (data: Omit<ContributionRecord, 'id' | 'entryStatus' | 'enteredDate'>) => {
    const newId = `CT-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const newEntry: ContributionRecord = {
      ...data,
      id: newId,
      entryStatus: 'Pending Approval',
      enteredDate: new Date().toISOString().split('T')[0],
      enteredBy: currentRole === 'Admin' ? 'Admin' : 'Kh. Tombi (Data Entry)',
    };

    setContributions((prev) => [newEntry, ...prev]);
    logAudit('Created', 'Contributions', newId, 'None', `Submitted ₹${data.contributionAmount} for ${data.memberName}`, `Month: ${data.month}`);
  };

  const approveContribution = (id: string) => {
    setContributions((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          // Also credit member balance and add ledger entry!
          setMembers((mList) =>
            mList.map((m) => {
              if (m.id === c.memberId) {
                return {
                  ...m,
                  currentBalance: m.currentBalance + c.contributionAmount,
                  totalContribution: m.totalContribution + c.contributionAmount,
                };
              }
              return m;
            })
          );

          // Add to account ledger
          const ledgerEntry: AccountLedgerEntry = {
            id: `TXN-${Date.now().toString().slice(-5)}`,
            memberId: c.memberId,
            memberName: c.memberName,
            date: new Date().toISOString().split('T')[0],
            transactionType: 'Contribution',
            description: `Monthly payroll PF contribution - ${c.month}`,
            credit: c.contributionAmount,
            debit: 0,
            balance: 0, // updated in view
            enteredBy: 'Admin (Posted)',
            referenceNo: `SAL-${c.id}`,
          };
          setLedgerEntries((l) => [ledgerEntry, ...l]);

          return {
            ...c,
            entryStatus: 'Approved',
            approvedBy: 'Admin (IUCB)',
            approvedDate: new Date().toISOString().split('T')[0],
          };
        }
        return c;
      })
    );

    logAudit('Approved', 'Contributions', id, 'Pending Approval', 'Approved', 'Approved and credited contribution to member account ledger');
  };

  const rejectContribution = (id: string, reason: string) => {
    setContributions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, entryStatus: 'Rejected', remarks: reason } : c))
    );
    logAudit('Rejected', 'Contributions', id, 'Pending Approval', 'Rejected', `Reason: ${reason}`);
  };

  // Loans mutations
  const submitLoan = (data: Omit<LoanRecord, 'id' | 'status' | 'outstandingPrincipal' | 'outstandingInterest' | 'totalOutstanding' | 'approvalTimeline' | 'repayments'>) => {
    const newId = `LN-2026-${String(Math.floor(100 + Math.random() * 900))}`;
    const newLoan: LoanRecord = {
      ...data,
      id: newId,
      status: 'Pending Approval',
      outstandingPrincipal: data.requestedAmount,
      outstandingInterest: Math.round(data.requestedAmount * (data.interestRate / 100)),
      totalOutstanding: Math.round(data.requestedAmount * (1 + data.interestRate / 100)),
      approvalTimeline: [
        { stage: 'Submitted', status: 'completed', date: new Date().toISOString().split('T')[0], actor: currentRole },
        { stage: 'Reviewed', status: 'completed', date: new Date().toISOString().split('T')[0], actor: 'Verification Officer' },
        { stage: 'Trust Committee Decision', status: 'current' },
        { stage: 'Admin Approval', status: 'pending' },
        { stage: 'Recorded', status: 'pending' },
      ],
      repayments: [],
    };

    setLoans((prev) => [newLoan, ...prev]);
    logAudit('Created', 'Loans', newId, 'None', `Submitted loan application ₹${data.requestedAmount} for ${data.memberName}`, `Purpose: ${data.purpose}`);
  };

  const committeeRecommendLoan = (loanId: string, notes: string) => {
    setLoans((prev) =>
      prev.map((l) => {
        if (l.id === loanId) {
          const updatedTimeline = l.approvalTimeline.map((item) => {
            if (item.stage === 'Trust Committee Decision') {
              return { ...item, status: 'completed' as const, date: new Date().toISOString().split('T')[0], remarks: notes };
            }
            if (item.stage === 'Admin Approval') {
              return { ...item, status: 'current' as const };
            }
            return item;
          });

          return {
            ...l,
            committeeDecision: 'Recommended by Trust Committee',
            committeeNotes: notes,
            approvalTimeline: updatedTimeline,
          };
        }
        return l;
      })
    );

    logAudit('Updated', 'Loans', loanId, 'Under Committee Review', 'Recommended', `Committee notes: ${notes}`);
  };

  const approveLoan = (loanId: string, adminNotes?: string) => {
    setLoans((prev) =>
      prev.map((l) => {
        if (l.id === loanId) {
          const updatedTimeline = l.approvalTimeline.map((item) => {
            if (item.stage === 'Admin Approval' || item.stage === 'Recorded') {
              return { ...item, status: 'completed' as const, date: new Date().toISOString().split('T')[0], actor: 'Admin' };
            }
            return item;
          });

          // Update member loan status
          setMembers((mList) =>
            mList.map((m) => {
              if (m.id === l.memberId) {
                return {
                  ...m,
                  hasLoan: true,
                  outstandingLoan: (m.outstandingLoan || 0) + l.requestedAmount,
                };
              }
              return m;
            })
          );

          // Add disbursement ledger entry
          const ledgerEntry: AccountLedgerEntry = {
            id: `TXN-${Date.now().toString().slice(-5)}`,
            memberId: l.memberId,
            memberName: l.memberName,
            date: new Date().toISOString().split('T')[0],
            transactionType: 'Loan Disbursement',
            description: `Loan sanctioned (${l.id}) - Principal disbursed against PF record`,
            credit: 0,
            debit: l.requestedAmount,
            balance: 0,
            enteredBy: 'Admin (IUCB)',
            referenceNo: l.id,
          };
          setLedgerEntries((entries) => [ledgerEntry, ...entries]);

          return {
            ...l,
            status: 'Active',
            approvedAmount: l.requestedAmount,
            adminNotes: adminNotes || 'Approved by Trust Admin under standard scheme guidelines',
            approvalTimeline: updatedTimeline,
          };
        }
        return l;
      })
    );

    logAudit('Approved', 'Loans', loanId, 'Pending Approval', 'Active', `Admin sanctioned loan ${loanId}`);
  };

  const rejectLoan = (loanId: string, reason: string) => {
    setLoans((prev) =>
      prev.map((l) => {
        if (l.id === loanId) {
          return {
            ...l,
            status: 'Rejected',
            rejectionReason: reason,
            approvalTimeline: l.approvalTimeline.map((t) =>
              t.stage === 'Admin Approval' ? { ...t, status: 'completed', remarks: `Rejected: ${reason}` } : t
            ),
          };
        }
        return l;
      })
    );

    logAudit('Rejected', 'Loans', loanId, 'Pending Approval', 'Rejected', `Rejection reason: ${reason}`);
  };

  const grant18YearAdvance = (advanceId: string, amount: number, orderNo: string) => {
    setAdvances((prev) =>
      prev.map((adv) => {
        if (adv.id === advanceId) {
          // Ledger entry
          const ledgerEntry: AccountLedgerEntry = {
            id: `TXN-${Date.now().toString().slice(-5)}`,
            memberId: adv.memberId,
            memberName: adv.memberName,
            date: new Date().toISOString().split('T')[0],
            transactionType: '18-Year Advance',
            description: `18-Year Service Advance (Interest-Free) Order #${orderNo}`,
            credit: 0,
            debit: amount,
            balance: 0,
            enteredBy: 'Admin (IUCB)',
            referenceNo: orderNo,
          };
          setLedgerEntries((l) => [ledgerEntry, ...l]);

          return {
            ...adv,
            advanceStatus: 'Granted',
            grantedAmount: amount,
            grantedDate: new Date().toISOString().split('T')[0],
            sanctionOrderNo: orderNo,
          };
        }
        return adv;
      })
    );

    logAudit('Approved', '18-Year Advance', advanceId, 'Eligible', 'Granted', `Interest-free advance ₹${amount} granted under Order ${orderNo}`);
  };

  const approveRetirementSettlement = (settlementId: string) => {
    setRetirements((prev) =>
      prev.map((ret) => {
        if (ret.id === settlementId) {
          return {
            ...ret,
            status: 'Approved',
            settlementDate: new Date().toISOString().split('T')[0],
            approvedBy: 'Admin (IUCB)',
          };
        }
        return ret;
      })
    );

    logAudit('Approved', 'Retirement', settlementId, 'Under Review', 'Approved', 'Retirement settlement approved for final manual banking disbursement');
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    logAudit('Configured', 'Administration', 'SYS-CONFIG', 'Previous Settings', JSON.stringify(newSettings), 'Updated system configuration parameters');
  };

  const addUser = (userData: Omit<SystemUser, 'id' | 'lastLogin'>) => {
    const newUser: SystemUser = {
      ...userData,
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      lastLogin: 'Never',
    };
    setUsers((prev) => [...prev, newUser]);
    logAudit('Created', 'Administration', newUser.id, 'None', `Created user ${userData.name} (${userData.role})`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        currentRole,
        setCurrentRole: handleSetCurrentRole,
        selectedMemberId,
        setSelectedMemberId,
        selectedLoanId,
        setSelectedLoanId,
        members,
        contributions,
        loans,
        advances,
        retirements,
        ledgerEntries,
        auditLogs,
        users,
        settings,
        notifications,
        addMember,
        updateMember,
        addNominee,
        removeNominee,
        addContribution,
        approveContribution,
        rejectContribution,
        submitLoan,
        committeeRecommendLoan,
        approveLoan,
        rejectLoan,
        grant18YearAdvance,
        approveRetirementSettlement,
        updateSettings,
        addUser,
        markNotificationRead,
        clearAllNotifications,
        isSearchOpen,
        setIsSearchOpen,
        formatCurrency,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
