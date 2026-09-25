import React from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Check,
  FileEdit,
  ShieldCheck,
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toLowerCase();

  let className = 'badge-neutral';
  let Icon = Clock;

  if (
    normalized.includes('approved') ||
    normalized.includes('active') ||
    normalized.includes('completed') ||
    normalized.includes('settled') ||
    normalized.includes('granted')
  ) {
    className = 'badge-approved';
    Icon = CheckCircle2;
  } else if (
    normalized.includes('pending') ||
    normalized.includes('approaching') ||
    normalized.includes('draft') ||
    normalized.includes('review')
  ) {
    className = 'badge-pending';
    Icon = Clock;
  } else if (
    normalized.includes('rejected') ||
    normalized.includes('suspended') ||
    normalized.includes('cancelled')
  ) {
    className = 'badge-rejected';
    Icon = XCircle;
  } else if (
    normalized.includes('submitted') ||
    normalized.includes('eligible') ||
    normalized.includes('upcoming')
  ) {
    className = 'badge-submitted';
    Icon = ShieldCheck;
  }

  return (
    <span className={`badge ${className} ${size === 'sm' ? 'btn-sm' : ''}`}>
      <Icon size={12} strokeWidth={2.2} />
      <span>{status}</span>
    </span>
  );
};
