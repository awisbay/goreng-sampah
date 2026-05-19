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
        <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/20 border-none rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
          Dashboard Ketua RT
        </Badge>
        <h2 className="text-3xl font-black tracking-tighter italic uppercase underline decoration-secondary decoration-8 underline-offset-[-2px]">DASHBOARD <span className="text-secondary">RT 01</span></h2>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-secondary text-white border-none rounded-3xl p-5 space-y-4 shadow-2xl shadow-secondary/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full translate-x-8 -translate-y-8 blur-2xl group-hover:bg-primary/30 transition-colors" />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/60 leading-none">Skor RT Musim Ini</p>
            <h4 className="text-4xl font-black leading-none mt-2 italic tracking-tighter">1,250</h4>
            <p className="text-[10px] font-black text-primary bg-white/10 w-fit px-2 py-0.5 rounded-full flex items-center gap-1 mt-2 uppercase">
              <TrendingUp className="w-3 h-3" /> +12%
            </p>
          </div>
        </Card>
        <Card className="bg-card border-border rounded-3xl p-5 space-y-4 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-full translate-x-8 -translate-y-8 blur-xl" />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Peringkat RW</p>
            <div className="text-foreground mt-2">
              <h4 className="text-4xl font-black leading-none italic tracking-tighter">#4 <span className="text-xs text-muted-foreground/40 italic font-medium not-italic">/ 6 RT</span></h4>
              <p className="text-[9px] font-black text-destructive mt-2 uppercase tracking-wide">Tertinggal 23 PTS dari RT 04</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Action: Broadcast */}
      <Button 
        onClick={handleBroadcast}
        className="w-full h-16 rounded-[32px] bg-secondary hover:bg-black text-white font-black text-lg gap-3 shadow-xl shadow-secondary/20 border-b-4 border-black/20 group active:scale-95"
      >
        <MessageSquare className="w-6 h-6 fill-white opacity-80 group-hover:scale-110 transition-transform" />
        BROADCAST WA GRUP
      </Button>

      {/* Validation Queue */}
      <div className="space-y-4">
        <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          Perlu Validasi <Badge className="bg-destructive rounded-full h-5 w-5 p-0 flex items-center justify-center text-[10px] text-destructive-foreground">3</Badge>
        </h3>
        
        <div className="space-y-3">
          <Card className="rounded-2xl border-accent/20 bg-accent/5 p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shadow-sm">
                  <AlertCircle className="w-6 h-6 text-accent" />
                </div>
                <div className="text-foreground">
                  <h4 className="font-black text-sm">Setoran Mencurigakan</h4>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Warga: Budi (RT 01)</p>
                </div>
              </div>
              <Badge variant="outline" className="border-accent/20 text-accent text-[8px] font-black uppercase bg-background">Review</Badge>
            </div>
            <p className="text-[10px] text-accent/80 leading-relaxed font-medium">
              Klaim 18kg sampah organik dalam satu hari. Mohon validasi fisik di drop point.
            </p>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 bg-card text-foreground border-border hover:bg-muted/10 h-8 text-[10px] font-bold rounded-lg shadow-sm">Tandai Aman</Button>
              <Button size="sm" className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-8 text-[10px] font-bold rounded-lg shadow-sm">Gagalkan</Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Reports Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            Laporan Pelanggaran <Badge className="bg-destructive rounded-full h-5 w-5 p-0 flex items-center justify-center text-[10px] text-destructive-foreground">2</Badge>
          </h3>
        </div>
        
        <Card className="rounded-3xl border-border bg-card shadow-sm overflow-hidden">
          <CardContent className="p-0">
            {[1, 2].map((i) => (
              <div key={`report-${i}`} className="p-4 border-b border-border last:border-0 flex gap-4 hover:bg-muted/10 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-muted relative overflow-hidden flex-shrink-0">
                  <img src={`https://picsum.photos/seed/report${i}/100/100`} alt="Violation" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-foreground truncate">Pembakaran Sampah</p>
                    <span className="text-[10px] font-bold text-muted-foreground font-mono">14:20</span>
                  </div>
                  <p className="text-[10px] font-medium text-muted-foreground mt-0.5">Jl. Melati No. 12 • Warga: Budi</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" className="h-7 text-[10px] font-bold rounded-lg border-border hover:bg-primary/20 hover:text-primary hover:border-primary/40 text-foreground">Verifikasi</Button>
                    <Button size="sm" variant="ghost" className="h-7 text-[10px] font-bold rounded-lg text-muted-foreground">Abaikan</Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Active Citizens */}
      <div className="space-y-4">
        <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground">Warga Paling Aktif</h3>
        <Card className="rounded-3xl border-border bg-card shadow-sm overflow-hidden">
          <CardContent className="p-0">
            {[1, 2, 3].map((_, i) => (
              <div key={`citizen-${i}`} className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted/20 flex items-center justify-center font-black text-muted-foreground italic text-xs">#{i+1}</div>
                  <div className="text-foreground">
                    <h5 className="font-bold text-sm">Citizen Name {i+1}</h5>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">8 Setoran • Streak 12 Hari</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-primary">840</p>
                  <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Poin</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
