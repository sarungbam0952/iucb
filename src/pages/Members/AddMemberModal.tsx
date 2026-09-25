import React, { useState } from 'react';
import { X, UserPlus, CheckCircle, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Department } from '../../types';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose }) => {
  const { addMember, members } = useApp();

  const nextId = `IUCB-${String(members.length + 1).padStart(4, '0')}`;

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '1985-05-15',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    contactNumber: '+91 ',
    email: '',
    department: 'Accounts & Finance' as Department,
    designation: 'Assistant Manager',
    dateOfJoining: '2015-04-01',
    salary: 65000,
    employmentStatus: 'Permanent' as 'Permanent' | 'Probation',
    contributionPercentage: 10,
    pfStartDate: '2015-04-01',
    accountStatus: 'Active' as 'Active' | 'Draft',
    // Nominee info
    nomineeName: '',
    nomineeRel: 'Spouse',
    nomineeContact: '+91 ',
    nomineeShare: 100,
    nomineeAddress: 'Imphal, Manipur',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.salary || formData.salary <= 0) errs.salary = 'Valid monthly salary required';
    if (!formData.nomineeName.trim()) errs.nomineeName = 'Nominee Name is required for trust scheme registration';
    if (formData.nomineeShare <= 0 || formData.nomineeShare > 100) errs.nomineeShare = 'Share must be between 1% and 100%';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (status: 'Active' | 'Draft') => {
    if (!validate()) return;

    addMember({
      fullName: formData.fullName,
      dob: formData.dob,
      gender: formData.gender,
      contactNumber: formData.contactNumber,
      email: formData.email || `${formData.fullName.toLowerCase().replace(/[^a-z]/g, '.')}@iucb.co.in`,
      department: formData.department,
      designation: formData.designation,
      dateOfJoining: formData.dateOfJoining,
      salary: Number(formData.salary),
      employmentStatus: formData.employmentStatus,
      contributionPercentage: Number(formData.contributionPercentage),
      pfStartDate: formData.pfStartDate,
      accountStatus: status,
      nominees: [
        {
          id: `NOM-${nextId}-1`,
          name: formData.nomineeName,
          relationship: formData.nomineeRel,
          contactNumber: formData.nomineeContact,
          sharePercentage: Number(formData.nomineeShare),
          address: formData.nomineeAddress,
          status: 'Active',
          lastUpdated: new Date().toISOString().split('T')[0],
        },
      ],
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog lg"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--color-navy-800)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserPlus size={18} />
            </div>
            <div>
              <div className="modal-title">New Trust Member Registration</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Register employee in Autonomous Provident Fund Scheme • Assigned ID: <strong style={{ color: 'var(--color-burgundy-700)' }}>{nextId}</strong>
              </div>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Section 1: Personal Information */}
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-navy-900)', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '6px', marginBottom: '12px', letterSpacing: '0.04em' }}>
              1. Personal Information
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ningthoujam Tomba Singh"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
                {errors.fullName && <span className="form-error">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Contact Mobile</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+91 9862000000"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Bank Official Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. tomba.n@iucb.co.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Employment Information */}
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-navy-900)', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '6px', marginBottom: '12px', letterSpacing: '0.04em' }}>
              2. Bank Employment Details
            </div>
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })}
                >
                  <option value="Accounts & Finance">Accounts & Finance</option>
                  <option value="Loans & Advances">Loans & Advances</option>
                  <option value="Audit & Inspection">Audit & Inspection</option>
                  <option value="Cash & Operations">Cash & Operations</option>
                  <option value="IT & Systems">IT & Systems</option>
                  <option value="General Administration">General Administration</option>
                  <option value="Executive Office">Executive Office</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Designation</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date of Joining Bank</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.dateOfJoining}
                  onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value, pfStartDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Monthly Basic Salary (₹) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                />
                {errors.salary && <span className="form-error">{errors.salary}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Employment Status</label>
                <select
                  className="form-select"
                  value={formData.employmentStatus}
                  onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value as any })}
                >
                  <option value="Permanent">Permanent</option>
                  <option value="Probation">Probation</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Monthly PF Deduction</label>
                <div style={{ padding: '8px 12px', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--color-border-subtle)', fontWeight: 700, color: 'var(--color-navy-900)' }}>
                  ₹{Math.round(formData.salary * (formData.contributionPercentage / 100)).toLocaleString('en-IN')}/mo
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Trust Scheme Information */}
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-navy-900)', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '6px', marginBottom: '12px', letterSpacing: '0.04em' }}>
              3. Trust Scheme Parameters
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Contribution Rate (%)</label>
                <select
                  className="form-select"
                  value={formData.contributionPercentage}
                  onChange={(e) => setFormData({ ...formData, contributionPercentage: Number(e.target.value) })}
                >
                  <option value={8}>8% of basic salary</option>
                  <option value={10}>10% of basic salary (Standard)</option>
                  <option value={12}>12% of basic salary (Voluntary high)</option>
                </select>
                <span className="form-hint">Deducted from monthly payroll via existing manual bank payroll process.</span>
              </div>

              <div className="form-group">
                <label className="form-label">PF Account Start Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.pfStartDate}
                  onChange={(e) => setFormData({ ...formData, pfStartDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Nominee Information */}
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-navy-900)', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '6px', marginBottom: '12px', letterSpacing: '0.04em' }}>
              4. Nominee Information (Mandatory)
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">
                  Nominee Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ningthoujam Anandi Devi"
                  value={formData.nomineeName}
                  onChange={(e) => setFormData({ ...formData, nomineeName: e.target.value })}
                />
                {errors.nomineeName && <span className="form-error">{errors.nomineeName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Relationship with Member</label>
                <select
                  className="form-select"
                  value={formData.nomineeRel}
                  onChange={(e) => setFormData({ ...formData, nomineeRel: e.target.value })}
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Nominee Share Percentage (%)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.nomineeShare}
                  onChange={(e) => setFormData({ ...formData, nomineeShare: Number(e.target.value) })}
                  min={1}
                  max={100}
                />
                {errors.nomineeShare && <span className="form-error">{errors.nomineeShare}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Nominee Contact Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.nomineeContact}
                  onChange={(e) => setFormData({ ...formData, nomineeContact: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Nominee Residential Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.nomineeAddress}
                  onChange={(e) => setFormData({ ...formData, nomineeAddress: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleSave('Draft')}
          >
            Save Draft
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleSave('Active')}
          >
            <CheckCircle size={16} />
            <span>Save & Submit Record</span>
          </button>
        </div>
      </div>
    </div>
  );
};
