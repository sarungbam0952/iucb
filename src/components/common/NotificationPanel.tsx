import React from 'react';
import { Bell, Check, X, ArrowRight, ShieldCheck, FileCheck, Users, Info } from 'lucide-react';
import { useApp, NavigationPage } from '../../context/AppContext';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, clearAllNotifications, setActivePage } = useApp();

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleItemClick = (notifId: string, linkTarget?: string) => {
    markNotificationRead(notifId);
    if (linkTarget) {
      if (linkTarget === 'loans') setActivePage('loans');
      else if (linkTarget === 'contributions') setActivePage('contributions');
      else if (linkTarget === 'retirement') setActivePage('retirement');
      else if (linkTarget === 'advances') setActivePage('advances');
      else setActivePage('dashboard');
    }
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'loan':
        return <FileCheck size={16} color="var(--color-burgundy-700)" />;
      case 'contribution':
        return <Check size={16} color="var(--color-navy-700)" />;
      case 'retirement':
        return <Users size={16} color="#B45309" />;
      default:
        return <Info size={16} color="#2563EB" />;
    }
  };

  return (
    <div className="drawer-container" onClick={onClose}>
      <div
        className="drawer-panel"
        style={{ width: '420px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header" style={{ background: '#FFFFFF', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <Bell size={18} color="var(--color-navy-900)" />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-6px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'var(--color-burgundy-600)',
                    color: '#FFFFFF',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-navy-900)' }}>
                System Notifications
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Internal Trust system events & action items
              </div>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '8px 16px', background: '#F8FAFC', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
            {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
          </span>
          {unreadCount > 0 && (
            <button
              onClick={clearAllNotifications}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-navy-700)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Mark all as read
            </button>
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--color-text-muted)' }}>
              <ShieldCheck size={32} style={{ margin: '0 auto 12px auto', color: '#94A3B8' }} />
              <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>All caught up</p>
              <span style={{ fontSize: '0.75rem' }}>No pending internal notifications.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleItemClick(n.id, n.linkTarget)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: n.read ? 'var(--color-border-subtle)' : '#BFDBFE',
                    background: n.read ? '#FFFFFF' : '#F0F9FF',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#FFFFFF', border: '1px solid var(--color-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {getIcon(n.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: n.read ? 600 : 700, color: 'var(--color-navy-900)' }}>
                          {n.title}
                        </span>
                        {!n.read && (
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--color-burgundy-600)' }} />
                        )}
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.4, margin: '2px 0 6px 0' }}>
                        {n.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                        <span>{n.timestamp}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--color-navy-700)', fontWeight: 600 }}>
                          View Record <ArrowRight size={11} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '12px 16px', background: '#F8FAFC', borderTop: '1px solid var(--color-border-subtle)', textAlign: 'center', fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
          System of Record notifications only. No SMS or external gateway active.
        </div>
      </div>
    </div>
  );
};
