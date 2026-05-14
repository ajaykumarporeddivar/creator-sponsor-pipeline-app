'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  Loader2, ChevronUp, ChevronDown, Info, X, PlusCircle, LayoutDashboard, FileText,
  DollarSign, Clock, CheckCircle, AlertTriangle, ArrowRight, TrendingUp, TrendingDown, Eye, Plus,
  Sparkles, Package, ClipboardList, Send, SlidersHorizontal, BarChart2, LineChart as LineIcon
} from 'lucide-react';
import Link from 'next/link';

// --- Utility Functions ---

export function cn(...inputs: Parameters<typeof clsx>): string {
  return twMerge(clsx(inputs));
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-200 text-blue-800', 'bg-green-200 text-green-800', 'bg-red-200 text-red-800',
    'bg-purple-200 text-purple-800', 'bg-yellow-200 text-yellow-800', 'bg-indigo-200 text-indigo-800'
  ];
  const charCode = name.charCodeAt(0) + name.charCodeAt(name.length - 1);
  return colors[charCode % colors.length];
}

// --- Components ---

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  href?: string;
  target?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className,
  href,
  target,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variantClasses = {
    primary: 'bg-zinc-900 text-white hover:bg-zinc-700 focus-visible:ring-zinc-900',
    secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus-visible:ring-zinc-900',
    outline: 'border border-zinc-200 bg-white hover:bg-zinc-100 focus-visible:ring-zinc-900',
    ghost: 'hover:bg-zinc-100 text-zinc-900 focus-visible:ring-zinc-900',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
    link: 'text-zinc-900 hover:text-zinc-700 underline-offset-4 hover:underline focus-visible:ring-zinc-900',
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 py-2 text-base',
    lg: 'h-12 px-6 text-lg',
  };

  const content = (
    <>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? 'Loading...' : children}
    </>
  );

  const buttonClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
    {
      'pointer-events-none': loading,
    }
  );

  if (href) {
    return (
      <Link href={href} target={target} className={buttonClasses} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('bg-white border border-zinc-200 rounded-xl shadow-sm', className)}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)}>{children}</div>;
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h3 className={cn('font-bold text-zinc-900 tracking-tight text-lg', className)}>{children}</h3>;
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('p-6 pt-0', className)}>{children}</div>;
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'indigo';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variantClasses = {
    default: 'text-zinc-700 bg-zinc-50 border-zinc-200',
    success: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    warning: 'text-amber-600 bg-amber-50 border-amber-200',
    error: 'text-red-600 bg-red-50 border-red-200',
    info: 'text-blue-600 bg-blue-50 border-blue-200',
    purple: 'text-purple-600 bg-purple-50 border-purple-200',
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className, id, ...props }: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <div className="relative flex flex-col space-y-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-zinc-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {React.cloneElement(icon as React.ReactElement, { className: 'h-5 w-5 text-zinc-400' })}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            icon ? 'pl-10' : '',
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('h-5 w-5 animate-spin text-zinc-500', className)} />;
}

interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const initials = name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  const colorClasses = getAvatarColor(name);

  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
  };

  return (
    <div
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full items-center justify-center font-medium',
        colorClasses,
        sizeClasses[size],
        className
      )}
    >
      <span className="sr-only">{name}</span>
      {initials}
    </div>
  );
}

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

function Sparkline({ data, color = '#6366f1', width = 40, height = 20 }: SparklineProps) {
  if (!data || data.length < 2) return null;

  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = range === 0 ? height / 2 : height - ((val - minVal) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  sparkline?: number[];
  className?: string;
}

export function StatCard({ title, value, change, changeType = 'neutral', icon, sparkline, className }: StatCardProps) {
  const changeColorClasses = {
    up: 'text-emerald-600',
    down: 'text-red-500',
    neutral: 'text-zinc-500',
  };

  const ChangeIcon = changeType === 'up' ? ChevronUp : ChevronDown;

  return (
    <Card className={cn('p-5 flex flex-col justify-between', className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-zinc-500">{title}</h4>
        {icon && React.cloneElement(icon as React.ReactElement, { className: 'h-4 w-4 text-zinc-400' })}
      </div>
      <div className="mt-1 flex items-end justify-between">
        <p className="text-3xl font-bold text-zinc-900">{value}</p>
        {change && (
          <div className={cn('flex items-center text-sm font-medium', changeColorClasses[changeType])}>
            <ChangeIcon className="h-4 w-4 mr-0.5" />
            {change}
          </div>
        )}
      </div>
      {sparkline && sparkline.length > 1 && (
        <div className="mt-3 flex justify-end">
          <Sparkline data={sparkline} width={80} height={28} color={changeType === 'up' ? '#10B981' : changeType === 'down' ? '#EF4444' : '#71717A'} />
        </div>
      )}
    </Card>
  );
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Modal({ open, onClose, title, children, size = 'md', className }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEscape);
    } else {
      document.removeEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, handleEscape]);

  if (!open) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fadein"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className={cn(
          'bg-white rounded-2xl shadow-xl animate-slideup w-full flex flex-col max-h-[90vh]',
          sizeClasses[size],
          className
        )}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <h3 className="text-xl font-bold text-zinc-900">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-zinc-100 p-1">
            <X className="h-5 w-5 text-zinc-500" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-zinc-200 rounded-xl shadow-sm min-h-[300px]">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 mb-4">
        {React.cloneElement(icon as React.ReactElement, { className: 'h-6 w-6' })}
      </div>
      <h3 className="text-lg font-bold text-zinc-900 mt-2">{title}</h3>
      <p className="text-sm text-zinc-600 mt-1 max-w-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

interface TableProps<T> {
  columns: Array<{ key: string; label: string; render?: (row: T) => React.ReactNode }>;
  data: T[];
  onRowClick?: (row: T) => void;
  className?: string;
}

export function Table<T extends { id?: string | number }>({ columns, data, onRowClick, className }: TableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-zinc-200 shadow-sm bg-white', className)}>
      <table className="min-w-full divide-y divide-zinc-200">
        <thead className="bg-zinc-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 text-center">
                No data available.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className={cn(
                  'hover:bg-zinc-50',
                  onRowClick && 'cursor-pointer',
                  rowIndex % 2 === 0 ? 'bg-white' : 'bg-zinc-50'
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600">
                    {column.render ? column.render(row) : (row as any)[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}