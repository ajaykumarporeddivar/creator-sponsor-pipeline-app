'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ISponsorshipDeal } from '@/lib/types'; // Assuming ISponsorshipDeal has a status field

/**
 * Custom hook for SSR-safe localStorage interaction.
 *
 * @param key The key to store the value under in localStorage.
 * @param initialValue The initial value if no item is found in localStorage.
 * @returns A tuple containing the stored value and a setter function.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Initialize value from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  // Update localStorage when the state changes
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      setStoredValue((prev) => {
        const newValue = value instanceof Function ? value(prev) : value;
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(newValue));
        }
        return newValue;
      });
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}

/**
 * Custom hook for filtering an array of items by search string and status.
 *
 * @param items The array of items to filter.
 * @param fields An array of keys to search within for the search string.
 * @returns An object containing the filtered items, search string, search setter, status, and status setter.
 */
export function useFilter<T extends Record<string, unknown>>(
  items: T[],
  fields: (keyof T)[]
): { filtered: T[]; search: string; setSearch: (s: string) => void; status: string; setStatus: (s: string) => void } {
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const filtered = items.filter((item) => {
    const matchesSearch = fields.some((field) =>
      String(item[field]).toLowerCase().includes(search.toLowerCase())
    );

    const itemStatus = (item as ISponsorshipDeal).status; // Explicitly cast for status property
    const matchesStatus = status === '' || (typeof itemStatus === 'string' && itemStatus.toLowerCase() === status.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  return { filtered, search, setSearch, status, setStatus };
}

/**
 * Custom hook for managing modal state, including an active item.
 *
 * @returns An object containing `isOpen`, `open` function (accepting an optional item), `close` function, and `activeItem`.
 */
export function useModal<T = unknown>(): {
  isOpen: boolean;
  open: (item?: T) => void;
  close: () => void;
  activeItem: T | null;
} {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<T | null>(null);

  const open = useCallback((item?: T) => {
    setActiveItem(item || null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveItem(null);
  }, []);

  return { isOpen, open, close, activeItem };
}

/**
 * Custom hook for displaying a demo toast notification.
 * The toast auto-hides after 2.5 seconds.
 *
 * @returns An object containing `message`, `type`, `visible`, and a `show` function.
 */
export function useDemoToast(): {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
  show: (msg: string, type?: 'success' | 'error' | 'info') => void;
} {
  const [message, setMessage] = useState<string>('');
  const [type, setType] = useState<'success' | 'error' | 'info'>('info');
  const [visible, setVisible] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const show = useCallback((msg: string, toastType: 'success' | 'error' | 'info' = 'info') => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setMessage(msg);
    setType(toastType);
    setVisible(true);

    timerRef.current = setTimeout(() => {
      setVisible(false);
      setMessage('');
    }, 2500); // Auto-hide after 2.5 seconds
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { message, type, visible, show };
}