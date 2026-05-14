import Link from 'next/link';
import { Inter } from 'next/font/google';
import {
  Sparkles, PlusCircle, LayoutDashboard, FileText, CheckCircle, Lock, ArrowRight,
  Star, DollarSign, Clock, Users, ShieldCheck, BarChart2, Zap, SlidersHorizontal, Send, ClipboardList
} from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const inter = Inter({ subsets: ['latin'] });

// Utility to combine Tailwind classes
function cn(...inputs: Parameters<typeof clsx>): string {
  return twMerge(clsx(inputs));
}

export const metadata = {
  title: 'Creator Sponsor Pipeline — Streamline Your Deals',
  description: 'A centralized, lightweight platform for independent creators and managers to intake sponsor leads, manage active deal pipelines, and generate client-ready performance reports.',
};

export default function LandingPage() {
  return (
    <div className={cn("min-h-screen", inter.className)}>
      {/* 1. NAV BAR */}
      <nav className="fixed top-8 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm border-b border-zinc-100 py-4 shadow-sm">
        <div className="max-w-7xl mx-