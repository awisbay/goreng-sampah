/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Send, AlertCircle, CheckCircle2, TrendingUp, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function RTDashboard() {
  const handleBroadcast = () => {
    toast.success("Template pesan WhatsApp siap dikirim!");
    const text = encodeURIComponent("Warga Pak RT, RT kita peringkat 4! Tinggal 1 hari lagi, ayo setor sampah terutama B3 (poin x5) biar kita naik peringkat!");
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
          Dashboard Ketua RT
        </Badge>
        <h2 className="text-3xl font-black tracking-tighter italic uppercase underline decoration-blue-500 decoration-8 underline-offset-[-2px]">DASHBOARD <span className="text-blue-600">RT 01</span></h2>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-slate-900 text-white border-none rounded-3xl p-4 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Skor RT Minggu Ini</p>
          <div>
            <h4 className="text-3xl font-black leading-none">1.250</h4>
            <p className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +12% vs Minggu Lalu
            </p>
          </div>
        </Card>
        <Card className="bg-white border-slate-100 rounded-3xl p-4 space-y-4 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Peringkat di RW</p>
          <div>
            <h4 className="text-3xl font-black leading-none text-slate-900">4 <span className="text-xs text-slate-300 italic font-medium">/ 6 RT</span></h4>
            <p className="text-[10px] font-bold text-red-500 mt-1 uppercase">Kalah 23 poin dari RT 04</p>
          </div>
        </Card>
      </div>

      {/* Quick Action: Broadcast */}
      <Button 
        onClick={handleBroadcast}
        className="w-full h-16 rounded-3xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg gap-3 shadow-xl shadow-emerald-100"
      >
        <MessageSquare className="w-6 h-6 fill-white" />
        BROADCAST WA GRUP
      </Button>

      {/* Validation Queue */}
      <div className="space-y-4">
        <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
          Perlu Validasi <Badge className="bg-red-500 rounded-full h-5 w-5 p-0 flex items-center justify-center text-[10px]">3</Badge>
        </h3>
        
        <div className="space-y-3">
          <Card className="rounded-2xl border-amber-100 bg-amber-50/50 p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900">Setoran Mencurigakan</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Warga: Budi (RT 01)</p>
                </div>
              </div>
              <Badge variant="outline" className="border-amber-200 text-amber-700 text-[8px] font-black uppercase">Review</Badge>
            </div>
            <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
              Klaim 18kg sampah organik dalam satu hari. Mohon validasi fisik di drop point.
            </p>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 bg-white text-slate-900 border-slate-200 hover:bg-slate-50 h-8 text-[10px] font-bold rounded-lg shadow-sm">Tandai Aman</Button>
              <Button size="sm" className="flex-1 bg-red-600 text-white hover:bg-red-700 h-8 text-[10px] font-bold rounded-lg shadow-sm">Gagalkan</Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Reports Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
            Laporan Pelanggaran <Badge className="bg-red-500 rounded-full h-5 w-5 p-0 flex items-center justify-center text-[10px]">2</Badge>
          </h3>
        </div>
        
        <Card className="rounded-3xl border-none bg-white shadow-sm overflow-hidden">
          <CardContent className="p-0">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 border-b border-slate-50 last:border-0 flex gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-slate-200 overflow-hidden flex-shrink-0">
                  <img src={`https://picsum.photos/seed/report${i}/100/100`} alt="Violation" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-slate-900 truncate">Pembakaran Sampah</p>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">14:20</span>
                  </div>
                  <p className="text-[10px] font-medium text-slate-500 mt-0.5">Jl. Melati No. 12 • Warga: Budi</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" className="h-7 text-[10px] font-bold rounded-lg border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200">Verifikasi</Button>
                    <Button size="sm" variant="ghost" className="h-7 text-[10px] font-bold rounded-lg text-slate-400">Abaikan</Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Active Citizens */}
      <div className="space-y-4">
        <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Warga Paling Aktif</h3>
        <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-400 italic">#{i+1}</div>
                  <div>
                    <h5 className="font-bold text-sm">Citizen Name {i+1}</h5>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">8 Setoran • Streak 12 Hari</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-emerald-600">840</p>
                  <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Poin</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
