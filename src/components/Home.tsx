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
import { Timer, Trophy, TrendingUp, HelpCircle, ArrowRight, Zap, AlertCircle, Truck, Loader2 } from 'lucide-react';
import { MOCK_RTS, MOCK_SEASON } from '../lib/mockData';
import { cn } from '@/lib/utils';

import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const WASTE_CATEGORIES = [
  { id: 'organik', label: 'Organik', icon: '🍃', color: 'bg-emerald-500' },
  { id: 'daur_ulang', label: 'Daur Ulang', icon: '♻️', color: 'bg-blue-500' },
  { id: 'b3', label: 'B3', icon: '⚠️', color: 'bg-red-500' },
  { id: 'residu', label: 'Residu', icon: '🗑️', color: 'bg-slate-50' },
];

export default function Home({ onDepositClick, onReportClick }: { onDepositClick: () => void, onReportClick: () => void }) {
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState('');
  const [requestingPickup, setRequestingPickup] = useState(false);
  const [isPickupDialogOpen, setIsPickupDialogOpen] = useState(false);
  const [weight, setWeight] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            Minggu Ke-{MOCK_SEASON.week_number}
          </Badge>
          <h2 className="text-2xl font-black tracking-tight leading-none italic">
            MUSIM <span className="text-emerald-600">GORENG</span>
          </h2>
        </div>
        <div className="bg-slate-900 text-white px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-lg">
          <Timer className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-black font-mono">{timeLeft}</span>
        </div>
      </div>

      {/* Main Stats Card */}
      <Card className="border-none shadow-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-12 -translate-y-12 blur-3xl pointer-events-none" />
        <CardContent className="p-6 space-y-6 relative z-10">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest opacity-80">Rank Saya di {userRT.name}</p>
              <h3 className="text-4xl font-black leading-none">Ke-11 <span className="text-lg font-medium opacity-60 italic">/ 28</span></h3>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Trophy className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase">
                <span>Progres Saya</span>
                <span>350 Poin</span>
              </div>
              <Progress value={65} className="h-3 bg-white/20" indicatorClassName="bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              <p className="text-[10px] text-emerald-100 italic">50 poin lagi untuk naik ke peringkat 10!</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase">
                <span>Progres {userRT.name}</span>
                <span>1.250 Poin</span>
              </div>
              <Progress value={85} className="h-3 bg-white/20" indicatorClassName="bg-yellow-400" />
              <p className="text-[10px] text-emerald-100 italic">{userRT.name} sedang di posisi ke-4 dari 6 RT.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Button 
          onClick={onDepositClick}
          className="w-full h-16 rounded-3xl bg-slate-900 hover:bg-black text-white font-black text-xl shadow-xl shadow-slate-200 group active:scale-95 transition-all"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-500/20">
              <Zap className="w-6 h-6 fill-white text-white" />
            </div>
            SETOR SAMPAH
            <ArrowRight className="w-5 h-5 opacity-40 group-hover:translate-x-1 transition-transform" />
          </div>
        </Button>

        <Button 
          onClick={onReportClick}
          variant="outline"
          className="w-full h-14 rounded-2xl border-2 border-red-50 text-red-600 hover:bg-red-50 font-bold gap-2 active:scale-95 transition-all"
        >
          <AlertCircle className="w-5 h-5" />
          LAPOR PELANGGARAN
        </Button>

        <Button 
          onClick={() => setIsPickupDialogOpen(true)}
          variant="ghost"
          className="w-full h-12 rounded-2xl text-slate-400 font-bold gap-2"
        >
          <Truck className="w-4 h-4" />
          PESAN JEMPUT (DI RUMAH)
        </Button>
      </div>

      {/* Pickup Request Dialog */}
      <Dialog open={isPickupDialogOpen} onOpenChange={setIsPickupDialogOpen}>
        <DialogContent className="rounded-[40px] border-none shadow-2xl p-8 max-w-[90vw] sm:max-w-[400px]">
          <DialogHeader className="space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-[24px] flex items-center justify-center mx-auto">
              <Truck className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="text-center space-y-1">
              <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Pesan <span className="text-emerald-600">Jemput</span></DialogTitle>
              <DialogDescription className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Petugas akan datang ke rumahmu
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="py-6 space-y-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Jenis Sampah
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {WASTE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-2xl border-2 transition-all transition-all font-black text-[10px] uppercase tracking-widest text-left",
                      selectedCategories.includes(cat.id)
                        ? `${cat.color} text-white border-transparent shadow-lg`
                        : "bg-slate-50 border-transparent text-slate-400"
                    )}
                  >
                    <span className="text-sm">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
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
                  className="h-14 rounded-2xl bg-slate-50 border-none px-5 font-bold text-lg focus-visible:ring-emerald-500"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-300 italic">KG</span>
              </div>
              <p className="text-[8px] font-bold text-slate-400 uppercase italic ml-1">* Minimal 0.1 kg</p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button 
              variant="ghost" 
              onClick={() => setIsPickupDialogOpen(false)}
              className="h-12 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400"
            >
              Batal
            </Button>
            <Button 
              onClick={handleRequestPickup}
              disabled={requestingPickup || !weight || selectedCategories.length === 0}
              className="h-14 flex-1 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-100"
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
          <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Hadiah Minggu Ini</h3>
          <HelpCircle className="w-4 h-4 text-slate-300" />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-none bg-white shadow-sm rounded-2xl p-4 flex flex-col items-center gap-2 text-center group hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold text-lg mb-1 group-hover:scale-110 transition-transform">1</div>
            <div>
              <p className="text-[10px] font-bold text-slate-900 leading-tight">Voucher Indomaret 150rb</p>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Top 3 Warga</p>
            </div>
          </Card>

          <Card className="border-none bg-white shadow-sm rounded-2xl p-4 flex flex-col items-center gap-2 text-center group hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl mb-1 group-hover:scale-110 transition-transform italic underline font-black">RT</div>
            <div>
              <p className="text-[10px] font-bold text-slate-900 leading-tight">Dana Operasional 1jt</p>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">RT Juara RW</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Tip of the day */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-4 flex items-start gap-4">
        <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-emerald-900 italic">Tips Pro Jagoan Sampah</p>
          <p className="text-[10px] text-emerald-700 leading-relaxed font-medium">
            Setor sampah jenis B3 (Baterai, Elektronik) memberi skor 5x lipat lebih besar dibanding sampah plastik! 
          </p>
        </div>
      </div>
    </div>
  );
}
