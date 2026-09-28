import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye } from 'lucide-react';

export interface ActionMenuItem {
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export interface ActionMenuProps {
  primaryAction?: {
    label: string;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
    onClick: () => void;
    title?: string;
  };
  secondaryActions?: ActionMenuItem[];
  align?: 'right' | 'left';
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  primaryAction,
  secondaryActions = [],
  align = 'right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const hasSecondary = secondaryActions && secondaryActions.length > 0;
  const PrimaryIcon = primaryAction?.icon || Eye;

  return (
    <div className="table-actions-cell" ref={menuRef}>
      {primaryAction && (
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            primaryAction.onClick();
          }}
          title={primaryAction.title || primaryAction.label}
        >
          <PrimaryIcon size={13} />
          <span>{primaryAction.label}</span>
        </button>
      )}

      {hasSecondary && (
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="btn-icon-more"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
            title="More actions"
            aria-label="More actions"
            aria-expanded={isOpen}
          >
            <MoreVertical size={14} />
          </button>

          {isOpen && (
            <div
              className="action-dropdown-menu"
              style={{
                [align === 'right' ? 'right' : 'left']: 0,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {secondaryActions.map((action, idx) => {
                const ActionIcon = action.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={action.disabled}
                    className={`action-dropdown-item ${action.danger ? 'danger' : ''}`}
                    onClick={() => {
                      setIsOpen(false);
                      action.onClick();
                    }}
                  >
                    {ActionIcon && <ActionIcon size={13} />}
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
