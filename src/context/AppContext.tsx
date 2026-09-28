import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Member,
  ContributionRecord,
  AccountLedgerEntry,
  LoanRecord,
  LoanRepayment,
  ServiceAdvance18,
  RetirementSettlement,
  AuditLog,
  SystemUser,
  SystemSettings,
  NotificationItem,
  UserRole,
  Nominee,
  WithdrawalRecord,
  InvestmentRecord,
} from '../types';
import {
  initialMembers,
  initialContributions,
  initialWithdrawals,
  initialLoans,
  initialAdvances,
  initialRetirements,
  initialLedgerEntries,
  initialAuditLogs,
  initialUsers,
  initialSystemSettings,
  initialNotifications,
  initialInvestments,
} from '../data/mockData';
import { formatDateTime } from '../utils/dateFormat';

export type NavigationPage =
  | 'dashboard'
  | 'members-all'
  | 'member-profile'
  | 'contributions'
  | 'withdrawals'
  | 'ledger'
  | 'nominees'
  | 'fund-pool'
  | 'loans'
  | 'loan-details'
  | 'advances'
  | 'retirement'
  | 'investments'
  | 'reports'
  | 'reports-fund-pool'
  | 'reports-member-statements'
  | 'reports-loan-register'
  | 'reports-18-year-advance'
  | 'reports-retirement-pipeline'
  | 'reports-trust-fund-journal'
  | 'reports-audit-trail'
  | 'reports-balance-sheet'
  | 'reports-charge-analysis'
  | 'reports-profit-loss'
  | 'reports-loan-report'
  | 'reports-account-statement'
  | 'reports-transfer-scroll'
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
  'withdrawals': '/members/withdrawals',
  'ledger': '/members/ledger',
  'nominees': '/members/nominees',
  'fund-pool': '/fund-pool',
  'loans': '/loans',
  'loan-details': '/loans/details',
  'advances': '/fund-pool',
  'retirement': '/retirement',
  'investments': '/investments',
  'reports': '/reports/fund-pool',
  'reports-fund-pool': '/reports/fund-pool',
  'reports-member-statements': '/reports/member-statements',
  'reports-loan-register': '/reports/loan-register',
  'reports-18-year-advance': '/reports/fund-pool',
  'reports-retirement-pipeline': '/reports/retirement-pipeline',
  'reports-trust-fund-journal': '/reports/trust-fund-journal',
  'reports-audit-trail': '/reports/audit-trail',
  'reports-balance-sheet': '/reports/balance-sheet',
  'reports-charge-analysis': '/reports/charge-analysis',
  'reports-profit-loss': '/reports/profit-loss',
  'reports-loan-report': '/reports/loan-report',
  'reports-account-statement': '/reports/account-statement',
  'reports-transfer-scroll': '/reports/transfer-scroll',
  'audit-trail': '/audit-trail',
  'users-roles': '/users-roles',
  'system-settings': '/system-settings',
  'my-dashboard': '/my-dashboard',
  'my-account': '/my-account',
  'my-contributions': '/my-contributions',
  'my-ledger': '/my-ledger',
  'my-loans': '/my-loans',
  'my-advance': '/my-dashboard',
  'my-retirement': '/my-retirement',
  'my-nominee': '/my-nominee',
  'my-notifications': '/my-notifications',
  'my-support': '/my-support',
};

export const parsePathToPage = (pathname: string): NavigationPage => {
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  
  // Direct exact route checks for dedicated reports
  if (cleanPath === '/reports' || cleanPath === '/reports/fund-pool') return 'reports-fund-pool';
  if (cleanPath === '/reports/member-statements') return 'reports-member-statements';
  if (cleanPath === '/reports/loan-register') return 'reports-loan-register';
  if (cleanPath === '/reports/retirement-pipeline') return 'reports-retirement-pipeline';
  if (cleanPath === '/reports/trust-fund-journal' || cleanPath === '/reports/activity-journal') return 'reports-trust-fund-journal';
  if (cleanPath === '/reports/audit-trail') return 'reports-audit-trail';
  if (cleanPath === '/reports/balance-sheet') return 'reports-balance-sheet';
  if (cleanPath === '/reports/charge-analysis') return 'reports-charge-analysis';
  if (cleanPath === '/reports/profit-loss' || cleanPath === '/reports/pnl') return 'reports-profit-loss';
  if (cleanPath === '/reports/loan-report') return 'reports-loan-report';
  if (cleanPath === '/reports/account-statement') return 'reports-account-statement';
  if (cleanPath === '/reports/transfer-scroll') return 'reports-transfer-scroll';
  if (cleanPath === '/investments') return 'investments';
  if (cleanPath === '/loans/details' || (cleanPath.startsWith('/loans/') && cleanPath !== '/loans')) return 'loan-details';

  // Fallback for retired advance and approvals routes so no broken routes exist
  if (cleanPath === '/advances' || cleanPath === '/reports/18-year-advance' || cleanPath === '/reports/18-yr-advance' || cleanPath === '/approvals') {
    return 'fund-pool';
  }

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
  withdrawals: WithdrawalRecord[];
  loans: LoanRecord[];
  advances: ServiceAdvance18[];
  retirements: RetirementSettlement[];
  investments: InvestmentRecord[];
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
  updateContribution: (id: string, updates: Partial<ContributionRecord>) => void;
  cancelContribution: (id: string, reason?: string) => void;

  addWithdrawal: (record: Omit<WithdrawalRecord, 'id' | 'status' | 'enteredDate'>) => void;

  addInvestment: (record: Omit<InvestmentRecord, 'id' | 'createdAt'>) => void;
  updateInvestment: (id: string, updates: Partial<InvestmentRecord>) => void;

  submitLoan: (loan: Omit<LoanRecord, 'id' | 'status' | 'outstandingPrincipal' | 'outstandingInterest' | 'totalOutstanding' | 'approvalTimeline' | 'repayments'>) => void;
  addLoanRepayment: (
    loanId: string,
    repayment: {
      amount: number;
      principal: number;
      interest: number;
      date: string;
      receiptNo?: string;
      remarks?: string;
      isForeclosure?: boolean;
    }
  ) => void;

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

  const [currentRole, setCurrentRole] = useState<UserRole>('Admin');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('IUCB-0001');
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const match = window.location.pathname.match(/\/loans\/([A-Za-z0-9-]+)/);
      if (match && match[1] && match[1] !== 'details') {
        return match[1];
      }
    }
    return 'LN-2026-0021';
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const setActivePage = (page: NavigationPage) => {
    setActivePageState(page);
    if (typeof window !== 'undefined') {
      const targetRoute =
        page === 'loan-details' && selectedLoanId
          ? `/loans/${selectedLoanId}`
          : (PAGE_TO_ROUTE[page] || '/dashboard');
      if (window.location.pathname !== targetRoute) {
        window.history.pushState({ page }, '', targetRoute);
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const match = window.location.pathname.match(/\/loans\/([A-Za-z0-9-]+)/);
      if (match && match[1] && match[1] !== 'details') {
        setSelectedLoanId(match[1]);
      }
      const page = parsePathToPage(window.location.pathname);
      setActivePageState(page);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(() => {
    const saved = localStorage.getItem('iucb_withdrawals');
    return saved ? JSON.parse(saved) : initialWithdrawals;
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

  const [investments, setInvestments] = useState<InvestmentRecord[]>(() => {
    const saved = localStorage.getItem('iucb_investments');
    return saved ? JSON.parse(saved) : initialInvestments;
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
    localStorage.setItem('iucb_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem('iucb_loans', JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem('iucb_investments', JSON.stringify(investments));
  }, [investments]);

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
      timestamp: formatDateTime(new Date()),
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
    if (currentRole === 'Trust Committee' || currentRole === 'Member / Employee') {
      console.warn(`[RBAC] Action not permitted for role: ${currentRole}`);
      return;
    }
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
    if (currentRole === 'Trust Committee' || currentRole === 'Member / Employee') {
      console.warn(`[RBAC] Action not permitted for role: ${currentRole}`);
      return;
    }
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    logAudit('Updated', 'Members', id, 'Existing Profile', JSON.stringify(updates), `Updated member ${id}`);
  };

  const addNominee = (memberId: string, nomineeData: Omit<Nominee, 'id' | 'lastUpdated'>) => {
    if (currentRole === 'Trust Committee' || currentRole === 'Member / Employee') {
      console.warn(`[RBAC] Action not permitted for role: ${currentRole}`);
      return;
    }
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
    if (currentRole === 'Trust Committee' || currentRole === 'Member / Employee') {
      console.warn(`[RBAC] Action not permitted for role: ${currentRole}`);
      return;
    }
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
    if (currentRole === 'Trust Committee' || currentRole === 'Member / Employee') {
      console.warn(`[RBAC] Action not permitted for role: ${currentRole}`);
      return;
    }
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

  const updateContribution = (id: string, updates: Partial<ContributionRecord>) => {
    if (currentRole === 'Trust Committee' || currentRole === 'Member / Employee') {
      console.warn(`[RBAC] Action not permitted for role: ${currentRole}`);
      return;
    }
    setContributions((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          if (c.entryStatus === 'Approved' && updates.contributionAmount !== undefined && updates.contributionAmount !== c.contributionAmount) {
            const diff = updates.contributionAmount - c.contributionAmount;
            setMembers((mList) =>
              mList.map((m) => {
                if (m.id === c.memberId) {
                  return {
                    ...m,
                    currentBalance: Math.max(0, m.currentBalance + diff),
                    totalContribution: Math.max(0, m.totalContribution + diff),
                  };
                }
                return m;
              })
            );
          }
          return { ...c, ...updates };
        }
        return c;
      })
    );
    logAudit('Updated', 'Contributions', id, 'Existing', 'Modified contribution record');
  };

  const cancelContribution = (id: string, reason?: string) => {
    if (currentRole === 'Trust Committee' || currentRole === 'Member / Employee') {
      console.warn(`[RBAC] Action not permitted for role: ${currentRole}`);
      return;
    }
    setContributions((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          if (c.entryStatus === 'Approved') {
            setMembers((mList) =>
              mList.map((m) => {
                if (m.id === c.memberId) {
                  return {
                    ...m,
                    currentBalance: Math.max(0, m.currentBalance - c.contributionAmount),
                    totalContribution: Math.max(0, m.totalContribution - c.contributionAmount),
                  };
                }
                return m;
              })
            );
          }
          return {
            ...c,
            entryStatus: 'Cancelled',
            remarks: reason ? `[Cancelled] ${reason}` : (c.remarks ? `[Cancelled] ${c.remarks}` : '[Cancelled] Entry cancelled by admin'),
          };
        }
        return c;
      })
    );
    logAudit('Updated', 'Contributions', id, 'Active', 'Cancelled', reason || 'Entry cancelled by admin');
  };

  // Withdrawals mutations
  const addWithdrawal = (data: Omit<WithdrawalRecord, 'id' | 'status' | 'enteredDate'>) => {
    if (currentRole === 'Trust Committee' || currentRole === 'Member / Employee') {
      console.warn(`[RBAC] Action not permitted for role: ${currentRole}`);
      return;
    }
    const newId = `WD-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const newEntry: WithdrawalRecord = {
      ...data,
      id: newId,
      status: 'Approved',
      enteredDate: new Date().toISOString().split('T')[0],
      enteredBy: currentRole === 'Admin' ? 'Admin (IUCB)' : 'Kh. Tombi (Data Entry)',
    };

    setWithdrawals((prev) => [newEntry, ...prev]);

    // Deduct from member currentBalance
    setMembers((mList) =>
      mList.map((m) => {
        if (m.id === data.memberId) {
          return {
            ...m,
            currentBalance: Math.max(0, m.currentBalance - data.amount),
          };
        }
        return m;
      })
    );

    // Add outgoing debit entry to Account Ledger
    const ledgerEntry: AccountLedgerEntry = {
      id: `TXN-${Date.now().toString().slice(-5)}`,
      memberId: data.memberId,
      memberName: data.memberName,
      date: data.date,
      transactionType: 'Withdrawal',
      description: `${data.withdrawalType}${data.remarks ? ' - ' + data.remarks : ''}`,
      credit: 0,
      debit: data.amount,
      balance: 0,
      enteredBy: currentRole === 'Admin' ? 'Admin (IUCB)' : 'Kh. Tombi (Data Entry)',
      referenceNo: data.referenceNo || newId,
    };
    setLedgerEntries((l) => [ledgerEntry, ...l]);

    logAudit(
      'Created',
      'Ledger',
      newId,
      'None',
      `Recorded withdrawal ₹${data.amount} for ${data.memberName}`,
      `Reason: ${data.withdrawalType} (Ref: ${data.referenceNo})`
    );
  };

  // Investments mutations (Standalone Investment Register)
  const addInvestment = (data: Omit<InvestmentRecord, 'id' | 'createdAt'>) => {
    if (currentRole === 'Trust Committee' || currentRole === 'Member / Employee') {
      console.warn(`[RBAC] Action not permitted for role: ${currentRole}`);
      return;
    }
    const newId = `INV-2026-${String(investments.length + 1).padStart(4, '0')}`;
    const newEntry: InvestmentRecord = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    setInvestments((prev) => [newEntry, ...prev]);

    logAudit(
      'Created',
      'Investments',
      newId,
      'None',
      `${data.type} of ₹${data.amount.toLocaleString('en-IN')} - ${data.bankName}`,
      data.remarks ? `Remarks: ${data.remarks}` : undefined
    );
  };

  const updateInvestment = (id: string, updates: Partial<InvestmentRecord>) => {
    if (currentRole === 'Trust Committee' || currentRole === 'Member / Employee') {
      console.warn(`[RBAC] Action not permitted for role: ${currentRole}`);
      return;
    }
    setInvestments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item))
    );

    logAudit(
      'Updated',
      'Investments',
      id,
      'Existing',
      `Updated investment record: ${updates.bankName || 'bank'} (${updates.type || 'entry'})`,
      updates.remarks ? `Remarks: ${updates.remarks}` : undefined
    );
  };

  // Loans mutations
  const submitLoan = (data: Omit<LoanRecord, 'id' | 'status' | 'outstandingPrincipal' | 'outstandingInterest' | 'totalOutstanding' | 'approvalTimeline' | 'repayments'>) => {
    if (currentRole === 'Trust Committee' || currentRole === 'Member / Employee') {
      console.warn(`[RBAC] Action not permitted for role: ${currentRole}`);
      return;
    }
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
        { stage: 'Admin Verification', status: 'current' },
        { stage: 'Recorded', status: 'pending' },
      ],
      repayments: [],
    };

    setLoans((prev) => [newLoan, ...prev]);
    logAudit('Created', 'Loans', newId, 'None', `Submitted loan application ₹${data.requestedAmount} for ${data.memberName}`, `Purpose: ${data.purpose}`);
  };

  const addLoanRepayment = (
    loanId: string,
    repayment: {
      amount: number;
      principal: number;
      interest: number;
      date: string;
      receiptNo?: string;
      remarks?: string;
      isForeclosure?: boolean;
    }
  ) => {
    if (currentRole === 'Trust Committee' || currentRole === 'Member / Employee') {
      console.warn(`[RBAC] Action not permitted for role: ${currentRole}`);
      return;
    }
    setLoans((prev) =>
      prev.map((l) => {
        if (l.id === loanId) {
          const isForeclosing = repayment.isForeclosure || (l.outstandingPrincipal - repayment.principal <= 0);
          const newPrincipal = isForeclosing ? 0 : Math.max(0, l.outstandingPrincipal - repayment.principal);
          const newInterest = isForeclosing ? 0 : Math.max(0, l.outstandingInterest - repayment.interest);
          const newTotal = newPrincipal + newInterest;
          const newStatus = (isForeclosing || newTotal === 0) ? 'Completed' : l.status;

          const newRepRecord: LoanRepayment = {
            id: `REP-${Date.now().toString().slice(-6)}`,
            date: repayment.date,
            principal: repayment.principal,
            interest: repayment.interest,
            total: repayment.amount,
            receiptNo: repayment.receiptNo || `RCP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
            recordedBy: currentRole === 'Admin' ? 'Admin (IUCB)' : 'Kh. Tombi (Data Entry)',
          };

          // Update member loan balance
          setMembers((mList) =>
            mList.map((m) => {
              if (m.id === l.memberId) {
                const remainingLoan = Math.max(0, (m.outstandingLoan || 0) - repayment.principal);
                return {
                  ...m,
                  outstandingLoan: remainingLoan,
                  hasLoan: remainingLoan > 0,
                };
              }
              return m;
            })
          );

          // Add ledger entry
          const ledgerEntry: AccountLedgerEntry = {
            id: `TXN-${Date.now().toString().slice(-5)}`,
            memberId: l.memberId,
            memberName: l.memberName,
            date: repayment.date,
            transactionType: 'Loan Repayment',
            description: repayment.isForeclosure
              ? `Full Loan Foreclosure Settlement (${l.id}) - Principal ₹${repayment.principal} + Interest ₹${repayment.interest}`
              : `Loan Repayment Recovery (${l.id}) - Principal ₹${repayment.principal} + Interest ₹${repayment.interest}`,
            credit: repayment.amount,
            debit: 0,
            balance: 0,
            enteredBy: currentRole === 'Admin' ? 'Admin' : 'Data Entry',
            referenceNo: newRepRecord.receiptNo,
          };
          setLedgerEntries((entries) => [ledgerEntry, ...entries]);

          return {
            ...l,
            status: newStatus,
            outstandingPrincipal: newPrincipal,
            outstandingInterest: newInterest,
            totalOutstanding: newTotal,
            repayments: [newRepRecord, ...(l.repayments || [])],
          };
        }
        return l;
      })
    );

    logAudit(
      'Updated',
      'Loans',
      loanId,
      'Active',
      repayment.isForeclosure ? 'Completed' : 'Repayment Posted',
      `Repayment ₹${repayment.amount} recorded${repayment.isForeclosure ? ' (Full Foreclosure Settlement)' : ''}`
    );
  };

  const grant18YearAdvance = (advanceId: string, amount: number, orderNo: string) => {
    if (currentRole !== 'Admin') {
      console.warn(`[RBAC] Action not permitted for role: ${currentRole}`);
      return;
    }
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
    if (currentRole !== 'Admin') {
      console.warn(`[RBAC] Action not permitted for role: ${currentRole}`);
      return;
    }
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
    if (currentRole !== 'Admin') {
      console.warn(`[RBAC] Action not permitted for role: ${currentRole}`);
      return;
    }
    setSettings((prev) => ({ ...prev, ...newSettings }));
    logAudit('Configured', 'Administration', 'SYS-CONFIG', 'Previous Settings', JSON.stringify(newSettings), 'Updated system configuration parameters');
  };

  const addUser = (userData: Omit<SystemUser, 'id' | 'lastLogin'>) => {
    if (currentRole !== 'Admin') {
      console.warn(`[RBAC] Action not permitted for role: ${currentRole}`);
      return;
    }
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
        withdrawals,
        loans,
        advances,
        retirements,
        investments,
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
        updateContribution,
        cancelContribution,
        addWithdrawal,
        addInvestment,
        updateInvestment,
        submitLoan,
        addLoanRepayment,
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
