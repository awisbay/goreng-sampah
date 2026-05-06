/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Building2, Flame, Zap, Sparkles, Loader2 } from 'lucide-react';

export default function LandingPage() {
  const { signIn } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      await signIn();
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 text-center gap-12 max-w-xl mx-auto">
        {/* Modern Logo: GORENG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-[32px] flex items-center justify-center shadow-2xl relative overflow-hidden ring-4 ring-white/5">
            <Flame className="w-12 h-12 text-white fill-white/20" />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-3 right-3"
            >
              <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </motion.div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-emerald-400 shadow-xl">
            APPS
          </div>
        </motion.div>

        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Eco-Friendly Future</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-7xl font-black tracking-tighter leading-[0.8] uppercase"
          >
            GO<span className="text-emerald-500 italic">RENG</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 text-lg font-medium leading-relaxed max-w-[300px] mx-auto pt-4"
          >
            Gerakan Orang Peduli Lingkungan.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full space-y-4"
        >
          <Button 
            onClick={handleSignIn} 
            disabled={isLoggingIn}
            size="lg" 
            className="w-full h-16 text-lg font-black bg-emerald-600 hover:bg-emerald-500 text-white transition-all rounded-3xl shadow-xl shadow-emerald-500/20 group active:scale-95"
          >
            {isLoggingIn ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Masuk untuk Mendapatkan Hadiah
                <motion.span 
                  animate={{ x: [0, 5, 0] }} 
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="ml-3"
                >
                  →
                </motion.span>
              </>
            )}
          </Button>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Digital Waste Management V2.0</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 w-full gap-4 pt-4 border-t border-white/10"
        >
          <div className="flex flex-col items-center gap-1">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Rewards</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Komunitas</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Building2 className="w-5 h-5 text-emerald-500" />
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Kelurahan</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
