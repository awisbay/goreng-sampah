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

  // Sort mock data for rankings
  const rankedUsers = [...MOCK_USERS].sort((a, b) => (Math.random() > 0.5 ? 1 : -1)); // Random for demo feel
  const rankedRTs = [...MOCK_RTS].sort((a, b) => b.total_score - a.total_score);

  const categories = [
    { id: 'total', label: 'Semua', color: 'bg-slate-900' },
    { id: 'organik', label: 'Org', color: 'bg-emerald-500' },
    { id: 'daur-ulang', label: 'Daur', color: 'bg-blue-500' },
    { id: 'b3', label: 'B3', color: 'bg-red-500' },
    { id: 'residu', label: 'Res', color: 'bg-slate-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-black tracking-tighter italic uppercase text-slate-900 leading-none">Papan <span className="text-emerald-600">Skor</span></h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Status: Minggu ke-12, Musim 2026</p>
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
        <TabsList className="w-full h-12 rounded-2xl bg-white border p-1 shadow-sm mb-6">
          <TabsTrigger value="warga" className="flex-1 rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-black text-xs transition-all uppercase tracking-tight">Warga RT</TabsTrigger>
          <TabsTrigger value="rw" className="flex-1 rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-black text-xs transition-all uppercase tracking-tight">Peringkat RW</TabsTrigger>
          <TabsTrigger value="kelurahan" className="flex-1 rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-black text-xs transition-all uppercase tracking-tight">Kelurahan</TabsTrigger>
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
      case 1: return "bg-yellow-50 text-yellow-600 border-yellow-200 ring-yellow-400";
      case 2: return "bg-slate-50 text-slate-500 border-slate-200 ring-slate-300";
      case 3: return "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500";
      default: return "bg-white text-slate-400 border-slate-100 ring-transparent";
    }
  };

  const getRankIcon = (r: number) => {
    switch (r) {
      case 1: return <Crown className="w-4 h-4" />;
      case 2: return <Medal className="w-4 h-4" />;
      case 3: return <Medal className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <motion.div
      layout
      className={cn(
        "group relative flex items-center gap-4 p-4 rounded-3xl border transition-all duration-300",
        isSelf ? "bg-emerald-50 border-emerald-200 shadow-lg shadow-emerald-100 z-10" : "bg-white border-slate-100 hover:border-slate-200"
      )}
    >
      {/* Rank Indicator */}
      <div className={cn(
        "w-10 h-10 shrink-0 flex items-center justify-center rounded-2xl border-2 font-black text-lg italic shadow-sm",
        getRankStyle(rank)
      )}>
        {rank}
      </div>

      <div className="flex-1 flex items-center gap-3">
        <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
          <AvatarImage src={image} />
          <AvatarFallback>{title.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <h4 className="font-black text-sm text-slate-900">{title}</h4>
            {getRankIcon(rank)}
            {isSelf && (
              <Badge className="bg-emerald-600 text-[8px] font-black h-4 px-1 border-none uppercase">Saya</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{subtitle}</p>
            {extra && (
              <>
                <div className="w-1 h-1 rounded-full bg-slate-200" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{extra}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1 text-[8px] font-black text-emerald-600 uppercase">
          <TrendingUp className="w-2.5 h-2.5" />
          Naik 2
        </div>
      </div>
    </motion.div>
  );
}
