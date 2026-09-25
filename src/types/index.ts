export type Department =
  | 'Accounts & Finance'
  | 'Loans & Advances'
  | 'Audit & Inspection'
  | 'Cash & Operations'
  | 'IT & Systems'
  | 'General Administration'
  | 'Executive Office';

export type UserRole = 'Admin' | 'Data Entry' | 'Trust Committee' | 'Member / Employee';

export interface Nominee {
  id: string;
  name: string;
  relationship: string;
  contactNumber: string;
  sharePercentage: number;
  address: string;
  status: 'Active' | 'Inactive';
  lastUpdated: string;
}

export interface Member {
  id: string; // e.g. "IUCB-0001"
  fullName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  contactNumber: string;
  email: string;
  department: Department;
  designation: string;
  dateOfJoining: string;
  salary: number;
  employmentStatus: 'Permanent' | 'Probation';
  contributionPercentage: number;
  pfStartDate: string;
  accountStatus: 'Active' | 'Suspended' | 'Settled' | 'Draft';
  currentBalance: number;
  totalContribution: number;
  totalInterest: number;
  outstandingLoan: number;
  hasLoan: boolean;
  nominees: Nominee[];
}

export interface ContributionRecord {
  id: string;
  month: string; // e.g. "August 2026"
  memberId: string;
  memberName: string;
  department: Department;
  salary: number;
  contributionPercentage: number;
  contributionAmount: number;
  entryStatus: 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected';
  enteredBy: string;
  enteredDate: string;
  approvedBy?: string;
  approvedDate?: string;
  remarks?: string;
}

export type TransactionType =
  | 'Contribution'
  | 'Interest'
  | 'Loan Disbursement'
  | 'Loan Repayment'
  | '18-Year Advance'
  | 'Retirement Settlement';

export interface AccountLedgerEntry {
  id: string; // e.g. "TXN-2026-00482"
  memberId: string;
  memberName?: string;
  date: string;
  transactionType: TransactionType;
  description: string;
  credit: number;
  debit: number;
  balance: number;
  enteredBy: string;
  referenceNo: string;
}

export interface LoanRepayment {
  id: string;
  date: string;
  principal: number;
  interest: number;
  total: number;
  receiptNo: string;
  recordedBy: string;
}

export interface LoanTimelineEvent {
  stage: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
  actor?: string;
  remarks?: string;
}

export interface LoanRecord {
  id: string; // e.g. "LN-2026-0021"
  memberId: string;
  memberName: string;
  department: Department;
  requestedAmount: number;
  eligibleAmount: number;
  approvedAmount?: number;
  interestRate: number; // e.g. 6.5
  tenureMonths: number;
  applicationDate: string;
  purpose: string;
  status:
    | 'Draft'
    | 'Pending Approval'
    | 'Under Committee Review'
    | 'Active'
    | 'Completed'
    | 'Rejected';
  outstandingPrincipal: number;
  outstandingInterest: number;
  totalOutstanding: number;
  committeeDecision?: string;
  committeeNotes?: string;
  adminNotes?: string;
  rejectionReason?: string;
  approvalTimeline: LoanTimelineEvent[];
  repayments: LoanRepayment[];
}

export interface ServiceAdvance18 {
  id: string;
  memberId: string;
  memberName: string;
  department: Department;
  joiningDate: string;
  yearsOfService: number;
  eligibilityDate: string;
  advanceStatus: 'Eligible' | 'Approaching' | 'Granted' | 'Not Eligible';
  eligibleAmount: number;
  grantedAmount?: number;
  grantedDate?: string;
  sanctionOrderNo?: string;
  notes: string;
}

export interface RetirementSettlement {
  id: string;
  memberId: string;
  employeeId: string;
  memberName: string;
  department: Department;
  retirementDate: string;
  totalContribution: number;
  accruedInterest: number;
  settlementAmount: number;
  calculationBasis: string;
  status: 'Upcoming' | 'Calculation Pending' | 'Under Review' | 'Approved' | 'Settled';
  settlementDate?: string;
  approvedBy?: string;
  remarks?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: 'Created' | 'Updated' | 'Approved' | 'Rejected' | 'Deleted' | 'Exported' | 'Configured';
  module:
    | 'Members'
    | 'Contributions'
    | 'Loans'
    | '18-Year Advance'
    | 'Retirement'
    | 'Ledger'
    | 'Administration';
  recordId: string;
  previousValue: string;
  newValue: string;
  details?: string;
}

export interface SystemUser {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  email: string;
  department: string;
}

export interface SystemSettings {
  orgName: string;
  trustName: string;
  regNumber: string;
  bankBranch: string;
  // Open business rule placeholders
  employerContributionEnabled: boolean;
  employerContributionPercentage: number;
  interestCalculationMethod: 'Fixed' | 'Variable (Repo-linked)' | 'Discretionary Annual';
  interestCompounding: 'Simple Annual' | 'Compound Monthly' | 'Compound Quarterly' | 'FD-Maturity Style';
  interestRatePercentage: number;
  maxLoanPercentageOfPF: number;
  maxLoanTenureMonths: number;
  loanInterestRate: number;
  allowSimultaneousLoans: boolean;
  trustCommitteeAccessModel: 'Admin Records on Behalf' | 'Individual Committee Logins';
  memberSelfServiceEnabled: boolean;
  preRetirementExitRule: 'Principal Only' | 'Principal + 50% Interest' | 'Full Settlement Pending Disciplinary Clearance';
  legacyDataMigrationActive: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'loan' | 'contribution' | 'retirement' | 'system';
  linkTarget?: string;
  read: boolean;
}
