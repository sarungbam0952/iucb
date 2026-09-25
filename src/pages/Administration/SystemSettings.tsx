import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Percent,
  TrendingUp,
  CreditCard,
  Shield,
  Save,
  CheckCircle,
  HelpCircle,
  Database,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SystemSettingsPage: React.FC = () => {
  const { settings, updateSettings, currentRole } = useApp();

  const [formState, setFormState] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formState);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (currentRole === 'Data Entry') {
    return (
      <div className="card" style={{ padding: '36px', textAlign: 'center' }}>
        <Lock size={36} color="#94A3B8" style={{ margin: '0 auto 12px auto' }} />
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
          Access Restricted
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Data Entry operators do not have permission to modify system configuration parameters. Please contact the Administrator.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            System Settings & Configurable Parameters
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Configure trust rules, interest calculation schedules, loan limits, and open business parameters.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {savedSuccess && (
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-success-text)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={15} /> Saved successfully
            </span>
          )}
          <button type="submit" className="btn btn-primary btn-sm">
            <Save size={14} />
            <span>Save Parameters</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: TRUST & INSTITUTIONAL IDENTITY */}
      <div className="card">
        <div className="card-header">
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={18} color="var(--color-navy-700)" />
            <span>1. Organization & Trust Identity</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Statutory registration</span>
        </div>

        <div className="card-body">
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Employing Institution</label>
              <input
                type="text"
                className="form-input"
                value={formState.orgName}
                onChange={(e) => setFormState({ ...formState, orgName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Trust Scheme Title</label>
              <input
                type="text"
                className="form-input"
                value={formState.trustName}
                onChange={(e) => setFormState({ ...formState, trustName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Trust Registration Number</label>
              <input
                type="text"
                className="form-input"
                value={formState.regNumber}
                onChange={(e) => setFormState({ ...formState, regNumber: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Principal Office / Branch</label>
              <input
                type="text"
                className="form-input"
                value={formState.bankBranch}
                onChange={(e) => setFormState({ ...formState, bankBranch: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: OPEN BUSINESS RULE - EMPLOYER CONTRIBUTION */}
      <div className="card">
        <div className="card-header">
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Percent size={18} color="var(--color-navy-700)" />
            <span>2. Employer Contribution Policy (Pending Client Confirmation)</span>
          </div>
          <span className="badge badge-pending">Configurable Placeholder</span>
        </div>

        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="employerContrib"
              checked={formState.employerContributionEnabled}
              onChange={(e) => setFormState({ ...formState, employerContributionEnabled: e.target.checked })}
              style={{ width: '16px', height: '16px', accentColor: 'var(--color-navy-900)' }}
            />
            <label htmlFor="employerContrib" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-navy-900)', cursor: 'pointer' }}>
              Enable Employer Matching Contribution in Trust Corpus
            </label>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            The SOW marks employer matching as an open confirmation item. If enabled, the Trust records employer contributions alongside member salary deductions.
          </p>

          {formState.employerContributionEnabled && (
            <div className="form-group" style={{ maxWidth: '300px' }}>
              <label className="form-label">Employer Matching Percentage (%)</label>
              <input
                type="number"
                className="form-input"
                value={formState.employerContributionPercentage}
                onChange={(e) => setFormState({ ...formState, employerContributionPercentage: Number(e.target.value) })}
              />
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: OPEN BUSINESS RULE - INTEREST CALCULATION */}
      <div className="card">
        <div className="card-header">
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--color-navy-700)" />
            <span>3. Trust Interest Calculation Formula (FD-Maturity Style)</span>
          </div>
          <span className="badge badge-pending">Configurable Placeholder</span>
        </div>

        <div className="card-body">
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Calculation Mode</label>
              <select
                className="form-select"
                value={formState.interestCalculationMethod}
                onChange={(e) => setFormState({ ...formState, interestCalculationMethod: e.target.value as any })}
              >
                <option value="Fixed">Fixed Interest Rate</option>
                <option value="Variable (Repo-linked)">Variable (Repo-linked)</option>
                <option value="Discretionary Annual">Trust Board Discretionary</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Compounding Schedule</label>
              <select
                className="form-select"
                value={formState.interestCompounding}
                onChange={(e) => setFormState({ ...formState, interestCompounding: e.target.value as any })}
              >
                <option value="FD-Maturity Style">FD-Maturity Style (Standard)</option>
                <option value="Compound Monthly">Compound Monthly</option>
                <option value="Compound Quarterly">Compound Quarterly</option>
                <option value="Simple Annual">Simple Annual</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Benchmark Annual Interest Rate (%)</label>
              <input
                type="number"
                step="0.05"
                className="form-input"
                value={formState.interestRatePercentage}
                onChange={(e) => setFormState({ ...formState, interestRatePercentage: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: OPEN BUSINESS RULE - LOAN PARAMETERS */}
      <div className="card">
        <div className="card-header">
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={18} color="var(--color-navy-700)" />
            <span>4. Member Loan Borrowing Rules & Caps</span>
          </div>
          <span className="badge badge-approved">Active Controls</span>
        </div>

        <div className="card-body">
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Max Borrowing Limit (% of PF Balance)</label>
              <input
                type="number"
                className="form-input"
                value={formState.maxLoanPercentageOfPF}
                onChange={(e) => setFormState({ ...formState, maxLoanPercentageOfPF: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Repayment Tenure (Months)</label>
              <input
                type="number"
                className="form-input"
                value={formState.maxLoanTenureMonths}
                onChange={(e) => setFormState({ ...formState, maxLoanTenureMonths: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Loan Interest Rate (% per annum)</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={formState.loanInterestRate}
                onChange={(e) => setFormState({ ...formState, loanInterestRate: Number(e.target.value) })}
              />
            </div>
          </div>

          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="simultaneousLoans"
              checked={formState.allowSimultaneousLoans}
              onChange={(e) => setFormState({ ...formState, allowSimultaneousLoans: e.target.checked })}
              style={{ width: '16px', height: '16px', accentColor: 'var(--color-navy-900)' }}
            />
            <label htmlFor="simultaneousLoans" style={{ fontSize: '0.8125rem', color: 'var(--color-navy-900)', cursor: 'pointer' }}>
              Allow multiple simultaneous loans for a single member (Default: Disabled)
            </label>
          </div>
        </div>
      </div>

      {/* SECTION 5: ACCESS MODEL & WORKFLOW POLICIES */}
      <div className="card">
        <div className="card-header">
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="var(--color-navy-700)" />
            <span>5. Operational Governance & Access Model</span>
          </div>
        </div>

        <div className="card-body">
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Trust Committee Decision Access Model</label>
              <select
                className="form-select"
                value={formState.trustCommitteeAccessModel}
                onChange={(e) => setFormState({ ...formState, trustCommitteeAccessModel: e.target.value as any })}
              >
                <option value="Admin Records on Behalf">Admin Records Decisions on Behalf</option>
                <option value="Individual Committee Logins">Individual Committee Logins Required</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Pre-Retirement Exit Rule (Resignation / Termination)</label>
              <select
                className="form-select"
                value={formState.preRetirementExitRule}
                onChange={(e) => setFormState({ ...formState, preRetirementExitRule: e.target.value as any })}
              >
                <option value="Principal + 50% Interest">Principal + 50% Accrued Interest</option>
                <option value="Principal Only">Principal Only (Forfeit Interest)</option>
                <option value="Full Settlement Pending Disciplinary Clearance">Full Settlement Pending Disciplinary Clearance</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--color-border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="selfService"
                checked={formState.memberSelfServiceEnabled}
                onChange={(e) => setFormState({ ...formState, memberSelfServiceEnabled: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: 'var(--color-navy-900)' }}
              />
              <label htmlFor="selfService" style={{ fontSize: '0.8125rem', color: 'var(--color-navy-900)', cursor: 'pointer' }}>
                Enable Member Self-Service Passbook Portal
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="legacyMigration"
                checked={formState.legacyDataMigrationActive}
                onChange={(e) => setFormState({ ...formState, legacyDataMigrationActive: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: 'var(--color-navy-900)' }}
              />
              <label htmlFor="legacyMigration" style={{ fontSize: '0.8125rem', color: 'var(--color-navy-900)', cursor: 'pointer' }}>
                Legacy Historical Data Migration Flag Active
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
