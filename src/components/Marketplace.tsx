import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Wallet, ChevronRight, Tag, Star, Clock, Coffee, Zap, Ticket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const REWARDS = [
  {
    id: 1,
    title: 'Diskon Belanja Rp 25rb',
    provider: 'Alfamart',
    cost: 500,
    category: 'Voucher',
    icon: ShoppingBag,
    color: 'bg-blue-500',
    expiry: '7 Hari',
    stock: 12
  },
  {
    id: 2,
    title: 'Token Listrik Rp 50rb',
    provider: 'PLN',
    cost: 1200,
    category: 'Utilitas',
    icon: Zap,
    color: 'bg-yellow-500',
    expiry: 'Selamanya',
    stock: 5
  },
  {
    id: 3,
    title: 'Kopi Gratis (Regular)',
    provider: 'Kopi Kenangan',
    cost: 300,
    category: 'Kuliner',
    icon: Coffee,
    color: 'bg-amber-700',
    expiry: '24 Jam',
    stock: 24
  },
  {
    id: 4,
    title: 'Voucher GrabFood 15rb',
    provider: 'Grab',
    cost: 450,
    category: 'Layanan',
    icon: Ticket,
    color: 'bg-emerald-600',
    expiry: '3 Hari',
    stock: 8
  }
];

import { ShoppingBag } from 'lucide-react';

export default function Marketplace() {
  const { user } = useAuth();
  const [redeeming, setRedeeming] = useState<number | null>(null);

  const handleRedeem = (reward: typeof REWARDS[0]) => {
    setRedeeming(reward.id);
    setTimeout(() => {
      toast.success(`Berhasil menukarkan ${reward.title}!`, {
        description: 'Kode voucher telah dikirim ke WhatsApp Anda.'
      });
      setRedeeming(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Wallet Header */}
      <Card className="border-none shadow-2xl bg-secondary text-white rounded-[32px] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full translate-x-12 -translate-y-12 blur-2xl" />
        <CardContent className="p-6 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Saldo Poin Saya</p>
              <h3 className="text-3xl font-black italic tracking-tighter">840 <span className="text-sm font-bold opacity-60 not-italic">PTS</span></h3>
            </div>
          </div>
          <Button variant="ghost" className="h-10 text-[10px] font-black uppercase tracking-tight bg-white/10 hover:bg-white/20 rounded-xl text-white">
            Riwayat
          </Button>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {['Populer', 'Voucher', 'Tagihan', 'Makanan'].map((cat, i) => (
          <Badge
            key={`market-cat-${i}`}
            variant="outline"
            className={`whitespace-nowrap px-4 py-2 rounded-xl font-semibold text-xs border-border bg-card shadow-sm ${i === 0 ? 'bg-primary text-white border-primary' : ''}`}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 gap-4">
        <h3 className="font-semibold text-sm text-foreground flex items-center gap-2 px-1">
          Reward untuk Kamu
        </h3>
        
        <AnimatePresence>
          {REWARDS.map((reward) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reward.id * 0.1 }}
            >
              <Card className="rounded-[28px] border-border bg-card shadow-sm hover:shadow-md transition-all overflow-hidden group">
                <CardContent className="p-4 flex gap-4">
                  <div className={`w-20 h-20 rounded-2xl ${reward.color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>
                    <reward.icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{reward.provider}</p>
                        <Badge variant="outline" className="text-[8px] border-accent/20 text-accent font-black h-4 bg-accent/5">SISA {reward.stock}</Badge>
                      </div>
                      <h4 className="font-black text-sm text-foreground truncate">{reward.title}</h4>
                      <p className="text-[10px] font-medium text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> Berlaku {reward.expiry}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                       <div className="flex items-baseline gap-1">
                          <span className="text-lg font-black italic text-primary">{reward.cost}</span>
                          <span className="text-[8px] font-bold text-muted-foreground uppercase">Pts</span>
                       </div>
                       <Button 
                         onClick={() => handleRedeem(reward)}
                         disabled={redeeming === reward.id}
                         size="sm" 
                         className="h-8 px-4 rounded-xl bg-secondary hover:bg-black text-white font-black text-[10px] uppercase tracking-widest border-b-2 border-black/20"
                       >
                         {redeeming === reward.id ? '...' : 'TUKAR'}
                       </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Referral Banner */}
      <Card className="rounded-[32px] border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center space-y-3">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
          <Star className="text-white fill-white/20" />
        </div>
        <div className="space-y-1">
          <h4 className="font-black italic text-lg uppercase tracking-tight">Cari Poin Ekstra?</h4>
          <p className="text-xs font-medium text-muted-foreground px-4">
            Ajak tetangga kamu bergabung dengan kode referral kamu dan dapatkan 100 PTS!
          </p>
        </div>
        <Button variant="outline" className="w-full h-12 rounded-2xl border-primary/20 text-primary font-black text-xs uppercase tracking-widest">
          SALIN KODE REFERRAL
        </Button>
      </Card>
    </div>
  );
}
