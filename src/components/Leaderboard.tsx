/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Crown, TrendingUp, Users } from 'lucide-react';
import { MOCK_USERS, MOCK_RTS } from '../lib/mockData';
import { cn } from '@/lib/utils';

export default function Leaderboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('warga');

  const [category, setCategory] = useState('total');

  // Stable sorting instead of random for better React reconciliation
  const rankedUsers = [...MOCK_USERS].sort((a, b) => a.name.localeCompare(b.name));
  const rankedRTs = [...MOCK_RTS].sort((a, b) => b.total_score - a.total_score);

  const categories = [
    { id: 'total', label: 'Semua', color: 'bg-foreground' },
    { id: 'organik', label: 'Org', color: 'bg-primary' },
    { id: 'daur-ulang', label: 'Daur', color: 'bg-secondary' },
    { id: 'b3', label: 'B3', color: 'bg-destructive' },
    { id: 'residu', label: 'Res', color: 'bg-muted' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-black tracking-tighter italic uppercase text-foreground leading-none">Papan <span className="text-primary">Skor</span></h2>
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none">Status: Minggu ke-12, Musim 2026</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={cn(
              "whitespace-nowrap px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
              category === cat.id 
                ? `${cat.color} text-white shadow-lg` 
                : "bg-white text-slate-400 border border-slate-100"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <Tabs defaultValue="warga" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="w-full h-12 rounded-2xl bg-card border p-1 shadow-sm mb-6">
          <TabsTrigger value="warga" className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black text-xs transition-all uppercase tracking-tight">Warga RT</TabsTrigger>
          <TabsTrigger value="rw" className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black text-xs transition-all uppercase tracking-tight">Peringkat RW</TabsTrigger>
          <TabsTrigger value="kelurahan" className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black text-xs transition-all uppercase tracking-tight">Kelurahan</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="warga" className="mt-0">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {rankedUsers.map((u, i) => (
                <RankItem 
                  key={`user-${u.id}-${i}`}
                  rank={i + 1}
                  title={u.name}
                  subtitle="350 Poin • 8.2 kg"
                  image={u.photo_url}
                  isSelf={u.id === user?.id}
                />
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="rw" className="mt-0">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
               {rankedRTs.map((rt, i) => (
                <RankItem 
                  key={`rt-${rt.id}-${i}`}
                  rank={i + 1}
                  title={rt.name}
                  subtitle={`${rt.total_score} Poin • ${rt.total_weight_kg} kg`}
                  image={`https://api.dicebear.com/7.x/initials/svg?seed=${rt.name}`}
                  isSelf={rt.id === user?.rt_id}
                  extra={`${rt.kk_count} KK Aktif`}
                />
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="kelurahan" className="mt-0">
            <div className="py-20 text-center flex flex-col items-center gap-4 opacity-40">
              <Users className="w-16 h-16 text-slate-300" />
              <p className="font-bold text-slate-400">Klasemen Kelurahan <br/> Segera Hadir di Akhir Bulan!</p>
            </div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}

function RankItem({ rank, title, subtitle, image, isSelf, extra }: { rank: number, title: string, subtitle: string, image?: string, isSelf?: boolean, extra?: string, key?: string }) {
  const getRankStyle = (r: number) => {
    switch (r) {
      case 1: return "bg-accent/20 text-accent border-accent shadow-[0_0_15px_rgba(230,182,85,0.2)]";
      case 2: return "bg-slate-100 text-slate-500 border-slate-200";
      case 3: return "bg-orange-100 text-orange-600 border-orange-200";
      default: return "bg-muted/10 text-muted-foreground border-transparent";
    }
  };

  const getRankIcon = (r: number) => {
    switch (r) {
      case 1: return <Crown className="w-4 h-4 text-accent fill-accent" />;
      case 2: return <Medal className="w-4 h-4 text-slate-400 fill-slate-400" />;
      case 3: return <Medal className="w-4 h-4 text-orange-400 fill-orange-400" />;
      default: return null;
    }
  };

  return (
    <motion.div
      layout
      className={cn(
        "group relative flex items-center gap-4 p-4 rounded-3xl border transition-all duration-300",
        isSelf ? "bg-primary/10 border-primary/20 shadow-xl shadow-primary/5 z-10" : "bg-card border-border hover:border-primary/20 active:scale-[0.98]"
      )}
    >
      {rank === 1 && (
        <div className="absolute inset-0 bg-accent/5 rounded-3xl pointer-events-none" />
      )}
      {/* Rank Indicator */}
      <div className={cn(
        "w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl border-2 font-black text-xl italic shadow-sm relative z-10",
        getRankStyle(rank)
      )}>
        {rank}
      </div>

      <div className="flex-1 flex items-center gap-3">
        <Avatar className="w-10 h-10 border-2 border-background shadow-sm">
          <AvatarImage src={image} />
          <AvatarFallback>{title.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <h4 className="font-black text-sm text-foreground">{title}</h4>
            {getRankIcon(rank)}
            {isSelf && (
              <Badge className="bg-primary text-primary-foreground text-[8px] font-black h-4 px-1 border-none uppercase">Saya</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{subtitle}</p>
            {extra && (
              <>
                <div className="w-1 h-1 rounded-full bg-border" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{extra}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1 text-[8px] font-black text-primary uppercase">
          <TrendingUp className="w-2.5 h-2.5" />
          Naik 2
        </div>
      </div>
    </motion.div>
  );
}
