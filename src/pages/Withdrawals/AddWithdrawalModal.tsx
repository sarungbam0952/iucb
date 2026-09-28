import React, { useState } from 'react';
import { X, ArrowDownRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AddWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddWithdrawalModal: React.FC<AddWithdrawalModalProps> = ({ isOpen, onClose }) => {
  const { members, addWithdrawal, formatCurrency } = useApp();

  const activeMembers = members.filter((m) => m.accountStatus === 'Active');
  const defaultMember = activeMembers[0] || members[0];

  const todayStr = new Date().toISOString().split('T')[0];
  const defaultRef = `IUCB/WD/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(10 + Math.random() * 90))}`;

  const [selectedMemberId, setSelectedMemberId] = useState(defaultMember?.id || '');
  const [withdrawalDate, setWithdrawalDate] = useState(todayStr);
  const [withdrawalType, setWithdrawalType] = useState('Partial PF Withdrawal');
  const [customType, setCustomType] = useState('');
  const [amount, setAmount] = useState<number | ''>(50000);
  const [referenceNo, setReferenceNo] = useState(defaultRef);
  const [remarks, setRemarks] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const currentSelectedMember = members.find((m) => m.id === selectedMemberId);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!selectedMemberId) errs.member = 'Please select a member';
    if (!withdrawalDate) errs.date = 'Withdrawal date is required';
    const effectiveType = withdrawalType === 'Other' ? customType.trim() : withdrawalType;
    if (!effectiveType) errs.type = 'Withdrawal type / reason is required';
    if (!amount || Number(amount) <= 0) {
      errs.amount = 'Please enter a valid withdrawal amount greater than zero';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!currentSelectedMember) return;

    const finalType = withdrawalType === 'Other' ? customType.trim() : withdrawalType;

    addWithdrawal({
      date: withdrawalDate,
      memberId: currentSelectedMember.id,
      memberName: currentSelectedMember.fullName,
      department: currentSelectedMember.department,
      withdrawalType: finalType,
      amount: Number(amount),
      referenceNo: referenceNo.trim() || `IUCB/WD/${Date.now().toString().slice(-6)}`,
      remarks: remarks.trim() || undefined,
      enteredBy: 'Admin User',
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '600px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: 'var(--color-navy-800)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowDownRight size={18} />
            </div>
            <div>
              <div className="modal-title">Record Member Withdrawal</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Debit transaction from member trust / PF account
              </div>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Member Selection */}
            <div className="form-group">
              <label className="form-label">
                Member <span className="required">*</span>
              </label>
              <select
                className="form-select"
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.id} - {m.fullName} ({m.department})
                  </option>
                ))}
              </select>
              {errors.member && <span className="form-error">{errors.member}</span>}
              {currentSelectedMember && (
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Current Account Balance: <strong style={{ color: 'var(--color-navy-900)' }}>{formatCurrency(currentSelectedMember.currentBalance)}</strong>
                </div>
              )}
            </div>

            {/* Date & Amount */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">
                  Withdrawal Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={withdrawalDate}
                  onChange={(e) => setWithdrawalDate(e.target.value)}
                />
                {errors.date && <span className="form-error">{errors.date}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Amount (₹) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  step="100"
                  placeholder="e.g. 50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                />
                {errors.amount && <span className="form-error">{errors.amount}</span>}
              </div>
            </div>

            {/* Withdrawal Type / Reason */}
            <div className="form-group">
              <label className="form-label">
                Withdrawal Type / Reason <span className="required">*</span>
              </label>
              <select
                className="form-select"
                value={withdrawalType}
                onChange={(e) => setWithdrawalType(e.target.value)}
              >
                <option value="Partial PF Withdrawal">Partial PF Withdrawal</option>
                <option value="Medical Grounds">Medical Grounds</option>
                <option value="Higher Education Withdrawal">Higher Education Withdrawal</option>
                <option value="Housing / Construction">Housing / Construction</option>
                <option value="Special Contingency">Special Contingency</option>
                <option value="Other">Other (Specify)</option>
              </select>
              {withdrawalType === 'Other' && (
                <input
                  type="text"
                  className="form-input"
                  style={{ marginTop: '8px' }}
                  placeholder="Specify withdrawal reason..."
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                />
              )}
              {errors.type && <span className="form-error">{errors.type}</span>}
            </div>

            {/* Reference Number */}
            <div className="form-group">
              <label className="form-label">Reference Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. IUCB/WD/2026/09-01"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
              />
            </div>

            {/* Remarks */}
            <div className="form-group">
              <label className="form-label">Remarks</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Add optional notes, committee approval note, or justification..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Record Withdrawal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
