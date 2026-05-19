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
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 text-center gap-12 max-w-xl mx-auto">
        {/* Modern Logo: GORENG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-primary blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
          <div className="w-28 h-28 bg-gradient-to-br from-primary to-secondary rounded-[40px] flex items-center justify-center shadow-2xl relative overflow-hidden ring-8 ring-white/20">
            <Flame className="w-14 h-14 text-white fill-white/20" />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-4 right-4"
            >
              <Zap className="w-5 h-5 text-accent fill-accent shadow-accent/50 filter drop-shadow-md" />
            </motion.div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-accent border border-white/20 px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-accent-foreground shadow-xl">
            PREMIUM
          </div>
        </motion.div>

        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Eco-Friendly Future</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-7xl font-black tracking-tighter leading-[0.8] uppercase"
          >
            GO<span className="text-primary italic">RENG</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-lg font-medium leading-relaxed max-w-[300px] mx-auto pt-4"
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
            className="w-full h-20 text-xl font-black bg-secondary hover:bg-black text-white transition-all rounded-[32px] shadow-2xl shadow-secondary/20 group active:scale-95 border-b-4 border-black/20"
          >
            {isLoggingIn ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <div className="flex items-center gap-3">
                MULAI SEKARANG
                <motion.span 
                  animate={{ x: [0, 5, 0] }} 
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </div>
            )}
          </Button>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Digital Waste Management V2.0</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 w-full gap-4 pt-4 border-t border-border"
        >
          <div className="flex flex-col items-center gap-1">
            <Trophy className="w-5 h-5 text-accent" />
            <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Rewards</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Users className="w-5 h-5 text-secondary" />
            <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Komunitas</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Building2 className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Kelurahan</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
