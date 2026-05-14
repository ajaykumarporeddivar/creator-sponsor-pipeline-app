'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  cn, Modal, Button, Badge, Avatar, Input, Kbd,
  ChevronUp, ChevronDown, Search, Check, X, Ban, Trash2, Edit
} from '@/components/ui';
import { format } from 'date-fns';

interface EntityDetailModalProps {
  item: Record<string, unknown> | null;
  open: boolean;
  onClose: () => void;
  title: string;
}

/**
 * Displays full detail of one entity record in a modal.
 * Includes action buttons and formatted display of values.
 */
export function EntityDetailModal({ item, open, onClose, title }: EntityDetailModalProps): React.JSX.Element {
  const getStatusColor = (status: string): 'default' | 'primary' | 'success' | 'warning' | 'error' => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'completed':
      case 'paid':
      case 'in_progress':
        return 'success';
      case 'negotiating':
      case 'proposed':
        return 'primary';
      case 'lead':
      case 'on_hold':
      case 'archived':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatValue = (key: string, value: unknown): React.ReactNode => {
    if (key.includes('Date') && typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      try {
        return format(new Date(value), 'PPP'); // Formats to e.g., "Jul 28, 2024"
      } catch {
        return String(value);
      }
    }
    if (typeof value === 'number' && key.toLowerCase().includes('value')) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return 'None';
      return (
        <ul className="list-disc pl-5 space-y-1">
          {value.map((val, index) => (
            <li key={index} className="text-zinc-700 text-sm">
              {typeof val === 'object' && val !== null ? Object.values(val).join(' - ') : String(val)}
            </li>
          ))}
        </ul>
      );
    }
    if (typeof value === 'string' && value.startsWith('http')) {
      return <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Link</a>;
    }
    return String(value);
  };

  const handleAction = (action: string) => {
    console.log(`Action "${action}" triggered for item:`, item?.id);
    // In a real app, this would dispatch a state update or API call
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      {item ? (
        <div className="space-y-6 p-4 md:p-6">
          {item.status && typeof item.status === 'string' && (
            <div className="flex justify-end -mt-2 -mr-2">
              <Badge variant={getStatusColor(item.status)}>{String(item.status).toUpperCase()}</Badge>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {Object.entries(item)
              .filter(([key]) => key !== 'id' && key !== 'creatorId' && key !== 'sponsorId' && key !== 'notes') // Exclude internal IDs and notes from grid
              .map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-sm font-semibold text-zinc-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-zinc-800 text-base break-words">{formatValue(key, value)}</span>
                </div>
              ))}
          </div>
          {item.notes && typeof item.notes === 'string' && item.notes.length > 0 && (
            <div className="flex flex-col pt-4 border-t border-zinc-200">
              <span className="text-sm font-semibold text-zinc-500">Notes</span>
              <span className="text-zinc-800 text-base">{String(item.notes)}</span>
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-200">
            <Button variant="outline" onClick={() => handleAction('Archive')}>
              <Ban className="h-4 w-4 mr-2" /> Archive
            </Button>
            <Button variant="danger" onClick={() => handleAction('Delete')}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
            <Button variant="success" onClick={() => handleAction('Approve')}>
              <Check className="h-4 w-4 mr-2" /> Approve
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-zinc-600">No item selected.</div>
      )}
    </Modal>
  );
}

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmLabel?: string;
  variant?: 'danger' | 'info';
}

/**
 * Generic confirmation dialog.
 */
export function ConfirmModal({
  open,
  onClose,
  title,
  message,
  onConfirm,
  confirmLabel = 'Confirm',
  variant = 'info',
}: ConfirmModalProps): React.JSX.Element {
  const confirmButtonVariant = variant === 'danger' ? 'danger' : 'primary';

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="p-6">
        <p className="text-zinc-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={confirmButtonVariant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

interface CommandPaletteItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandPaletteItem[];
}

/**
 * Cmd+K search/navigation palette.
 */
export function CommandPalette({ open, onClose, items }: CommandPaletteProps): React.JSX.Element {
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setSearch('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50); // Auto-focus when opened
    }
  }, [open]);

  const filteredItems = items.filter(
    (item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setActiveIndex(0); // Reset active index when filtered items change
  }, [search, filteredItems.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[activeIndex]) {
          router.push(filteredItems[activeIndex].href);
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [open, filteredItems, activeIndex, router, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!open) return <></>;

  return (
    <Modal open={open} onClose={onClose} title="" size="lg" className="p-0 overflow-hidden">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search commands or navigate..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-b border-zinc-200 text-lg focus:ring-0 focus:border-zinc-200"
          autoComplete="off"
        />
      </div>

      <div className="max-h-[min(50vh,400px)] overflow-y-auto py-2">
        {filteredItems.length === 0 ? (
          <p className="text-center text-zinc-500 py-8">No results found.</p>
        ) : (
          <ul className="space-y-1">
            {filteredItems.map((item, index) => (
              <li key={item.href} className="px-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    router.push(item.href);
                    onClose();
                  }}
                  className={cn(
                    'w-full flex items-center justify-start text-left p-2 rounded-lg',
                    'hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-none',
                    index === activeIndex ? 'bg-zinc-100' : ''
                  )}
                >
                  {item.icon && <span className="mr-3 text-zinc-600">{item.icon}</span>}
                  <div className="flex-1">
                    <div className="text-zinc-800 font-medium">{item.label}</div>
                    {item.description && (
                      <div className="text-zinc-500 text-sm mt-0.5">{item.description}</div>
                    )}
                  </div>
                  {index === activeIndex && <Kbd className="ml-auto">↩</Kbd>}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}