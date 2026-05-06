/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthProvider, useAuth } from './context/AuthContext';
import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import Home from './components/Home';
import Leaderboard from './components/Leaderboard';
import DepositWaste from './components/DepositWaste';
import Profile from './components/Profile';
import RTDashboard from './components/RTDashboard';
import LurahDashboard from './components/LurahDashboard';
import SponsorDashboard from './components/SponsorDashboard';
import ReportViolation from './components/ReportViolation';
import CollectorDashboard from './components/CollectorDashboard';
import { Toaster } from '@/components/ui/sonner';
import { Layout } from './components/Layout';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'home' | 'leaderboard' | 'deposit' | 'report' | 'profile' | 'rt_dashboard' | 'lurah_dashboard' | 'sponsor_dashboard' | 'collector_dashboard'>('home');

  useEffect(() => {
    if (user) {
      if (user.role === 'rt_leader') setCurrentView('rt_dashboard');
      else if (user.role === 'lurah') setCurrentView('lurah_dashboard');
      else if (user.role === 'sponsor') setCurrentView('sponsor_dashboard');
      else if (user.role === 'officer') setCurrentView('collector_dashboard');
      else setCurrentView('home');
    }
  }, [user?.id, user?.role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  if (!user.rt_id && user.role === 'citizen') {
    return <Onboarding />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'home': return <Home onDepositClick={() => setCurrentView('deposit')} onReportClick={() => setCurrentView('report')} />;
      case 'leaderboard': return <Leaderboard />;
      case 'deposit': return <DepositWaste onComplete={() => setCurrentView('home')} onCancel={() => setCurrentView('home')} />;
      case 'report': return <ReportViolation onComplete={() => setCurrentView('home')} onCancel={() => setCurrentView('home')} />;
      case 'profile': return <Profile onSignOut={() => window.location.reload()} />;
      case 'rt_dashboard': return <RTDashboard />;
      case 'lurah_dashboard': return <LurahDashboard />;
      case 'sponsor_dashboard': return <SponsorDashboard />;
      case 'collector_dashboard': return <CollectorDashboard />;
      default: return <Home onDepositClick={() => setCurrentView('deposit')} onReportClick={() => setCurrentView('report')} />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-center" />
    </AuthProvider>
  );
}
