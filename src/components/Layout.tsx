/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Home, Trophy, Recycle, User, LayoutDashboard, Building2, Landmark, AlertCircle, Leaf, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
    { id: 'deposit', icon: Recycle, label: 'Setor', primary: true },
    { id: 'marketplace', icon: Gift, label: 'Reward' },
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
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/90 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => onViewChange('home')}>
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-md shadow-primary/20 transition-transform group-active:scale-95">
            <Leaf className="text-white w-5 h-5" />
          </div>
          <h1 className="font-bold text-xl tracking-tight text-foreground">Go<span className="text-primary">reng</span></h1>
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden xs:block">
              <p className="text-sm font-semibold text-foreground">{user.name}</p>
              <p className="text-[11px] text-muted-foreground font-medium leading-none mt-0.5">
                {user.role === 'rt_leader' ? 'Ketua RT' : 
                 user.role === 'lurah' ? 'Lurah' : 
                 user.role === 'sponsor' ? 'Sponsor' : 
                 user.role === 'officer' ? 'Petugas' : 'Warga'}
              </p>
            </div>
            <Avatar className="w-10 h-10 border-2 border-primary/20 shadow-md">
              <AvatarImage src={user.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} />
              <AvatarFallback className="font-bold text-xs">{user.name.substring(0,2)}</AvatarFallback>
            </Avatar>
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
      <nav className="fixed bottom-4 left-4 right-4 z-40 bg-card/90 backdrop-blur-xl border border-border/50 px-2 py-2 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-[calc(100%-2rem)] md:max-w-md mx-auto">
        <div className="flex items-center justify-between gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200 min-w-[64px]",
                currentView === item.id 
                  ? "text-primary bg-primary/10 font-bold" 
                  : "text-muted-foreground hover:bg-muted/5",
                item.primary && "relative -top-6 bg-secondary text-white hover:bg-black shadow-2xl shadow-secondary/30 rounded-[24px] w-16 h-16 border-4 border-background"
              )}
            >
              <item.icon className={cn(item.primary ? "w-7 h-7" : "w-5 h-5 mb-1")} />
              {!item.primary && <span className="text-[11px] font-semibold">{item.label}</span>}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
