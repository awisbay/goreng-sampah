/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Home, Trophy, PlusCircle, User, LayoutDashboard, Building2, Landmark, AlertCircle, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: any) => void;
}

export function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const { user } = useAuth();

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'leaderboard', icon: Trophy, label: 'Peringkat' },
    { id: 'deposit', icon: PlusCircle, label: 'Setor', primary: true },
    { id: 'report', icon: AlertCircle, label: 'Lapor' },
  ];

  if (user?.role === 'rt_leader') {
    navItems.push({ id: 'rt_dashboard', icon: LayoutDashboard, label: 'RT' });
  } else if (user?.role === 'lurah') {
    navItems.push({ id: 'lurah_dashboard', icon: Landmark, label: 'Lurah' });
  } else if (user?.role === 'sponsor') {
    navItems.push({ id: 'sponsor_dashboard', icon: Building2, label: 'Sponsor' });
  } else if (user?.role === 'officer') {
    navItems.push({ id: 'collector_dashboard', icon: LayoutDashboard, label: 'Petugas' });
  }

  navItems.push({ id: 'profile', icon: User, label: 'Profil' });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Flame className="text-white w-5 h-5 fill-white/10" />
          </div>
          <h1 className="font-black text-xl tracking-tighter uppercase italic">GO<span className="text-emerald-600">RENG</span></h1>
        </div>
        {user && (
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium">{user.name}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                {user.role === 'rt_leader' ? 'Ketua RT' : 
                 user.role === 'lurah' ? 'Lurah' : 
                 user.role === 'sponsor' ? 'Sponsor' : 
                 user.role === 'officer' ? 'Petugas' : 'Warga'}
              </p>
            </div>
            <img src={user.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-200" />
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden pt-4 pb-24 px-4 max-w-lg mx-auto w-full">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t px-2 py-1 pb-safe max-w-lg mx-auto">
        <div className="flex items-center justify-between gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 min-w-16",
                currentView === item.id 
                  ? "text-emerald-600 bg-emerald-50" 
                  : "text-slate-500 hover:bg-slate-50",
                item.primary && "relative -top-4 bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 rounded-full w-14 h-14"
              )}
            >
              <item.icon className={cn(item.primary ? "w-7 h-7" : "w-5 h-5 mb-0.5")} />
              {!item.primary && <span className="text-[10px] font-medium">{item.label}</span>}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
