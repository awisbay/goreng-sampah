/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Timer, Trophy, TrendingUp, HelpCircle, ArrowRight, Zap, AlertCircle, Truck, Loader2, Search, Bell, MessageCircle, Heart, Share2, Star } from 'lucide-react';
import { MOCK_RTS, MOCK_SEASON } from '../lib/mockData';
import { cn } from '@/lib/utils';

import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const WASTE_CATEGORIES = [
  { id: 'organik', label: 'Organik', icon: '🍃', color: 'bg-primary' },
  { id: 'daur_ulang', label: 'Daur Ulang', icon: '♻️', color: 'bg-secondary' },
  { id: 'b3', label: 'B3', icon: '⚠️', color: 'bg-destructive' },
  { id: 'residu', label: 'Residu', icon: '🗑️', color: 'bg-muted' },
];

export default function Home({ onDepositClick, onReportClick }: { onDepositClick: () => void, onReportClick: () => void }) {
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState('');
  const [requestingPickup, setRequestingPickup] = useState(false);
  const [isPickupDialogOpen, setIsPickupDialogOpen] = useState(false);
  const [weight, setWeight] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const RECENT_ACTIVITIES = [
    { id: 1, user: 'Siti Aminah', type: 'Setoran', amount: '4.2kg', points: '+120 Pts', time: '5m', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti' },
    { id: 2, user: 'Budi Santoso', type: 'Laporan', amount: 'Sampah Liar', points: '+50 Pts', time: '12m', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi' },
    { id: 3, user: 'Agus Salim', type: 'Setoran', amount: '12.5kg', points: '+340 Pts', time: '1h', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agus' },
  ];

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleRequestPickup = async () => {
    if (!user) return;
    
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      toast.error("Masukkan berat yang valid (lebih dari 0 kg)");
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error("Pilih setidaknya satu kategori sampah");
      return;
    }
    
    setRequestingPickup(true);
    try {
      const path = 'pickup_requests';
      await addDoc(collection(db, path), {
        user_id: user.id,
        user_name: user.name,
        address: "Jl. Melati No. 12, RT 01/RW 01", // Mocked address from profile/context in real app
        rt_id: user.rt_id || 'RT01',
        weight: weightNum,
        categories: selectedCategories,
        status: 'pending',
        created_at: serverTimestamp()
      });
      toast.success("Petugas sedang menuju rumahmu!");
      setIsPickupDialogOpen(false);
      setWeight('');
      setSelectedCategories([]);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'pickup_requests');
    } finally {
      setRequestingPickup(false);
    }
  };
  
  const userRT = MOCK_RTS.find(rt => rt.id === user?.rt_id) || MOCK_RTS[0];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(MOCK_SEASON.end_at);
      const diff = end.getTime() - now.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      
      setTimeLeft(`${days}h ${hours}j ${minutes}m`);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Search & Notifications */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Cari info sampah..." 
            className="h-12 w-full rounded-2xl bg-card border-none pl-11 shadow-sm placeholder:text-[10px] placeholder:font-black placeholder:uppercase placeholder:tracking-widest" 
          />
        </div>
        <Button variant="outline" className="w-12 h-12 rounded-2xl border-none bg-card shadow-sm p-0 flex items-center justify-center relative">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-destructive rounded-full border-2 border-card" />
        </Button>
      </div>

      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            Minggu Ke-{MOCK_SEASON.week_number}
          </Badge>
          <h2 className="text-2xl font-black tracking-tight leading-none italic">
            MUSIM <span className="text-primary">GORENG</span>
          </h2>
        </div>
        <div className="bg-foreground text-background px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-lg">
          <Timer className="w-4 h-4 text-accent" />
          <span className="text-xs font-black font-mono">{timeLeft}</span>
        </div>
      </div>

      {/* Main Stats Card */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="border-none shadow-2xl bg-gradient-to-br from-primary via-primary/90 to-secondary text-primary-foreground rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full translate-x-12 -translate-y-12 blur-3xl pointer-events-none" />
          <CardContent className="p-6 space-y-6 relative z-10">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-primary-foreground/90 text-[10px] font-black uppercase tracking-widest leading-none drop-shadow-sm">Personal Progress • {userRT.name}</p>
                <h3 className="text-5xl font-black italic tracking-tighter leading-none mt-1">Ke-11 <span className="text-lg font-medium opacity-70 italic not-italic">/ 28</span></h3>
              </div>
              <div className="w-14 h-14 bg-accent text-accent-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20 rotate-3 transition-transform">
                <Trophy className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
                  <span>Level Saya</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full">GOLD CITIZEN</span>
                </div>
                <div className="h-3 w-full bg-black/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.6)] rounded-full"
                  />
                </div>
                <p className="text-[10px] text-primary-foreground/90 font-medium italic">🔥 50 poin lagi untuk naik ke peringkat 10!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strategic Improvement: RT Season Collective Goal */}
        <Card className="border-none bg-card shadow-sm border border-border rounded-3xl overflow-hidden group">
          <CardContent className="p-5 flex gap-4">
            <div className="w-14 h-14 shrink-0 bg-secondary/10 text-secondary rounded-[20px] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star className="w-7 h-7 fill-secondary opacity-50" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Target RT Musim Ini</p>
                  <h4 className="text-sm font-black text-foreground">Wifi Gratis Taman RT</h4>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black text-[8px] uppercase tracking-tighter">85% TERCAPAI</Badge>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: '85%' }}
                   className="h-full bg-gradient-to-r from-secondary to-emerald-500 rounded-full"
                />
              </div>
              <p className="text-[9px] text-muted-foreground font-medium leading-tight">
                Tinggal <span className="font-bold text-foreground">140kg</span> sampah terpilah lagi untuk mencapai target bersama!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Button 
          onClick={onDepositClick}
          className="w-full h-20 rounded-[32px] bg-secondary hover:bg-black text-white font-black text-xl shadow-2xl shadow-secondary/20 group active:scale-[0.98] transition-all border-b-4 border-black/20"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-black/20 inset-shadow-sm">
              <Zap className="w-7 h-7 fill-white text-white" />
            </div>
            <div className="text-left leading-none">
                <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">Aksi Cepat</p>
                <p>SETOR SAMPAH</p>
            </div>
            <ArrowRight className="w-6 h-6 opacity-40 group-hover:translate-x-1 transition-transform ml-2" />
          </div>
        </Button>

        <div className="grid grid-cols-2 gap-3">
            <Button 
                onClick={onReportClick}
                variant="outline"
                className="h-16 rounded-3xl border-2 border-destructive/20 bg-white text-destructive hover:bg-destructive/5 font-black text-xs gap-2 active:scale-95 transition-all flex flex-col items-center justify-center uppercase tracking-widest"
            >
                <AlertCircle className="w-5 h-5 mb-0.5" />
                Lapor Sampah
            </Button>

            <Button 
                onClick={() => setIsPickupDialogOpen(true)}
                variant="outline"
                className="h-16 rounded-3xl border-2 border-primary/20 bg-white text-primary hover:bg-primary/5 font-black text-xs gap-2 active:scale-95 transition-all flex flex-col items-center justify-center uppercase tracking-widest"
            >
                <Truck className="w-5 h-5 mb-0.5" />
                Pesan Jemput
            </Button>
        </div>
      </div>

      {/* Pickup Request Dialog */}
      <Dialog open={isPickupDialogOpen} onOpenChange={setIsPickupDialogOpen}>
        <DialogContent className="rounded-[40px] border-none shadow-2xl p-8 max-w-[90vw] sm:max-w-[400px]">
          <DialogHeader className="space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-[24px] flex items-center justify-center mx-auto">
              <Truck className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center space-y-1">
              <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Pesan <span className="text-primary">Jemput</span></DialogTitle>
              <DialogDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Petugas akan datang ke rumahmu
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="py-6 space-y-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Jenis Sampah
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {WASTE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest text-left",
                      selectedCategories.includes(cat.id)
                        ? `${cat.color} text-primary-foreground border-transparent shadow-lg`
                        : "bg-muted/10 border-transparent text-muted-foreground"
                    )}
                  >
                    <span className="text-sm">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Estimasi Berat (KG)
              </Label>
              <div className="relative">
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="Contoh: 1.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="h-14 rounded-2xl bg-muted/10 border-none px-5 font-bold text-lg focus-visible:ring-primary"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-muted-foreground italic">KG</span>
              </div>
              <p className="text-[8px] font-bold text-muted-foreground uppercase italic ml-1">* Minimal 0.1 kg</p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button 
              variant="ghost" 
              onClick={() => setIsPickupDialogOpen(false)}
              className="h-12 rounded-2xl font-black text-xs uppercase tracking-widest text-muted-foreground"
            >
              Batal
            </Button>
            <Button 
              onClick={handleRequestPickup}
              disabled={requestingPickup || !weight || selectedCategories.length === 0}
              className="h-14 flex-1 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/10"
            >
              {requestingPickup ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {requestingPickup ? "MEMPROSES..." : "KONFIRMASI JEMPUT"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rewards Highlight */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground">Hadiah Minggu Ini</h3>
          <HelpCircle className="w-4 h-4 text-muted-foreground/40" />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-none bg-card shadow-sm rounded-2xl p-4 flex flex-col items-center gap-2 text-center group hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-accent/20 text-accent rounded-xl flex items-center justify-center font-bold text-lg mb-1 group-hover:scale-110 transition-transform shadow-sm">1</div>
            <div>
              <p className="text-[10px] font-bold text-foreground leading-tight">Voucher Indomaret 150rb</p>
              <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter">Top 3 Warga</p>
            </div>
          </Card>

          <Card className="border-none bg-card shadow-sm rounded-2xl p-4 flex flex-col items-center gap-2 text-center group hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-secondary/20 text-secondary rounded-xl flex items-center justify-center font-bold text-xl mb-1 group-hover:scale-110 transition-transform italic underline font-black">RT</div>
            <div>
              <p className="text-[10px] font-bold text-foreground leading-tight">Dana Operasional 1jt</p>
              <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter">RT Juara RW</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Tip of the day */}
      <div className="bg-primary/10 border border-primary/20 rounded-3xl p-4 flex items-start gap-4">
        <TrendingUp className="w-5 h-5 text-primary shrink-0 mt-1" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-primary italic">Tips Pro Jagoan Sampah</p>
          <p className="text-[10px] text-primary leading-relaxed font-medium">
            Setor sampah jenis B3 (Baterai, Elektronik) memberi skor 5x lipat lebih besar dibanding sampah plastik! 
          </p>
        </div>
      </div>

      {/* Community Feed */}
      <div className="space-y-4 pt-2 pb-8">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            Aktivitas Tetangga <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </h3>
          <Button variant="ghost" className="text-[10px] font-black uppercase tracking-tight text-primary">Lihat Web RW</Button>
        </div>

        <div className="space-y-3">
          {RECENT_ACTIVITIES.map((activity, i) => (
            <motion.div
              key={`activity-${activity.id}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <Card className="rounded-[28px] border-border bg-card shadow-sm overflow-hidden p-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-muted relative overflow-hidden shrink-0 border-2 border-white shadow-sm">
                    <img src={activity.avatar} alt={activity.user} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-black text-foreground truncate">{activity.user}</h4>
                      <span className="text-[10px] font-bold text-muted-foreground font-mono">{activity.time}</span>
                    </div>
                    <p className="text-[10px] font-medium text-muted-foreground mt-0.5">
                      Berhasil melakukan <span className="font-black text-primary">{activity.type}</span>: {activity.amount}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                       <Badge className="bg-primary/10 text-primary border-none font-black text-[9px] px-2 py-0.5 rounded-lg italic">
                         {activity.points}
                       </Badge>
                       <div className="flex items-center gap-3">
                          <button className="flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors">
                            <Heart className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold font-mono">12</span>
                          </button>
                          <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold font-mono">4</span>
                          </button>
                          <button className="text-muted-foreground hover:text-foreground transition-colors">
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                       </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
