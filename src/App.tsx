import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CommandPalette } from './components/common/CommandPalette';

// Pages
import { Dashboard } from './pages/Dashboard/Dashboard';
import { MembersList } from './pages/Members/MembersList';
import { MemberProfile } from './pages/Members/MemberProfile';
import { ContributionsPage } from './pages/Contributions/ContributionsPage';
import { IndividualAccountLedger } from './pages/Ledger/IndividualAccountLedger';
import { NomineesPage } from './pages/Members/NomineesPage';
import { TrustFundPoolPage } from './pages/FundPool/TrustFundPoolPage';
import { LoanManagement } from './pages/Loans/LoanManagement';
import { Advance18YearPage } from './pages/Advances/Advance18YearPage';
import { RetirementSettlementPage } from './pages/Retirement/RetirementSettlementPage';
import { ApprovalsPage } from './pages/Approvals/ApprovalsPage';
import { ReportsPage } from './pages/Reports/ReportsPage';
import { FundPoolReportPage } from './pages/Reports/FundPoolReportPage';
import { MemberStatementsReportPage } from './pages/Reports/MemberStatementsReportPage';
import { LoanRegisterReportPage } from './pages/Reports/LoanRegisterReportPage';
import { AdvanceTrackerReportPage } from './pages/Reports/AdvanceTrackerReportPage';
import { RetirementPipelineReportPage } from './pages/Reports/RetirementPipelineReportPage';
import { AuditTrailReportPage } from './pages/Reports/AuditTrailReportPage';
import { AuditTrailPage } from './pages/Audit/AuditTrailPage';
import { UsersAndRoles } from './pages/Administration/UsersAndRoles';
import { SystemSettingsPage } from './pages/Administration/SystemSettings';
import { MemberPortal } from './pages/MemberPortal/MemberPortal';

const AppContent: React.FC = () => {
  const { activePage } = useApp();

  const renderActiveView = () => {
    if (activePage.startsWith('my-')) {
      return <MemberPortal />;
    }

    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'members-all':
        return <MembersList />;
      case 'member-profile':
        return <MemberProfile />;
      case 'contributions':
        return <ContributionsPage />;
      case 'ledger':
        return <IndividualAccountLedger />;
      case 'nominees':
        return <NomineesPage />;
      case 'fund-pool':
        return <TrustFundPoolPage />;
      case 'loans':
        return <LoanManagement />;
      case 'advances':
        return <Advance18YearPage />;
      case 'retirement':
        return <RetirementSettlementPage />;
      case 'approvals':
        return <ApprovalsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'reports-fund-pool':
        return <FundPoolReportPage />;
      case 'reports-member-statements':
        return <MemberStatementsReportPage />;
      case 'reports-loan-register':
        return <LoanRegisterReportPage />;
      case 'reports-18-year-advance':
        return <AdvanceTrackerReportPage />;
      case 'reports-retirement-pipeline':
        return <RetirementPipelineReportPage />;
      case 'reports-audit-trail':
        return <AuditTrailReportPage />;
      case 'audit-trail':
        return <AuditTrailPage />;
      case 'users-roles':
        return <UsersAndRoles />;
      case 'system-settings':
        return <SystemSettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="app-main">
        <Header />
        <main className="app-content">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
