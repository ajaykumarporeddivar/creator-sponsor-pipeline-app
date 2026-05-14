'use client';

import { AppSidebar } from '@/components/layout';
import { PlusCircle, LayoutDashboard, FileText } from 'lucide-react';
import React from 'react';

const navItems = [
  { icon: <PlusCircle size={16} />, label: 'Add Deal', href: '/dashboard/intake' },
  { icon: <LayoutDashboard size={16} />, label: 'Pipeline', href: '/dashboard/dashboard' },
  { icon: <FileText size={16} />, label: 'Reports', href: '/dashboard/reports' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <AppSidebar items={navItems} projectName="Creator Sponsor Pipeline" />
      <div className="flex-1 ml-64 flex flex-col min-h-full">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}