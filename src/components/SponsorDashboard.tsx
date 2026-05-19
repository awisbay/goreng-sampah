/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, TrendingUp, BarChart3, Package, Globe, Share2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DATA = [
  { name: 'Sen', value: 120 },
  { name: 'Sel', value: 180 },
  { name: 'Rab', value: 150 },
  { name: 'Kam', value: 240 },
  { name: 'Jum', value: 210 },
  { name: 'Sab', value: 380 },
  { name: 'Min', value: 320 },
];

export default function SponsorDashboard() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Badge className="bg-accent/20 text-accent hover:bg-accent/20 border-none rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
          Partner Dashboard (CSR/EPR)
        </Badge>
        <h2 className="text-3xl font-black tracking-tighter italic uppercase underline decoration-accent decoration-8 underline-offset-[-2px]">BRAND <span className="text-accent">IMPACT</span></h2>
      </div>

      {/* Environmental Impact Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="rounded-3xl border-none bg-secondary text-white shadow-xl shadow-secondary/10 p-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Globe className="w-12 h-12" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/60">CO2 Terkurangi</p>
            <h3 className="text-2xl font-black italic">1,240<span className="text-[10px] ml-1 font-bold not-italic">kg</span></h3>
            <p className="text-[8px] font-bold text-primary-foreground/40 mt-1 uppercase">Sesuai Target ESG</p>
          </div>
        </Card>
        <Card className="rounded-3xl border-none bg-card shadow-sm p-4 border border-border group">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Pohon Setara</p>
          <h3 className="text-2xl font-black text-foreground italic">52<span className="text-[10px] ml-1 font-bold not-italic group-hover:ml-2 transition-all">Pohon</span></h3>
          <p className="text-[8px] font-bold text-primary mt-1 uppercase">+12 Bulan ini</p>
        </Card>
      </div>

      {/* ROI Impact */}
      <Card className="bg-secondary text-white border-none rounded-[40px] p-8 space-y-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/30 rounded-full translate-x-24 -translate-y-24 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/20 rounded-full -translate-x-12 translate-y-12 blur-[60px] pointer-events-none" />
        
        <div className="space-y-4 text-center uppercase tracking-widest relative z-10">
          <p className="text-[10px] font-black text-white/40">Dampak Sponsor Minggu Ini</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-6xl font-black italic tracking-tighter">1.8</span>
            <div className="flex flex-col items-start leading-none">
                <span className="text-2xl font-black text-accent drop-shadow-sm">TON</span>
                <span className="text-[10px] font-bold text-white/60">COLLECTED</span>
            </div>
          </div>
          <p className="text-[10px] font-bold text-accent tracking-[0.2em]">Plastik & Aluminium Terkumpul</p>
        </div>

        <div className="grid grid-cols-3 gap-4 relative z-10 text-white pt-4 border-t border-white/10">
          <div className="text-center space-y-1">
             <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Warga Aktif</p>
             <p className="text-2xl font-black italic">340</p>
          </div>
          <div className="text-center space-y-1">
             <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Efisiensi</p>
             <p className="text-2xl font-black text-primary italic">42%</p>
          </div>
          <div className="text-center space-y-1">
             <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">ROI / kg</p>
             <p className="text-xl font-black italic">Rp 5.5k</p>
          </div>
        </div>
      </Card>

      {/* Monthly Trend Chart */}
      <Card className="rounded-[32px] border-border bg-card shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            Volume Sampah Harian (KG)
          </h3>
          <Badge variant="outline" className="text-[8px] font-black uppercase text-primary border-primary/20">+24% vs LALU</Badge>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DATA}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6F9473" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6F9473" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E2D8" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#6F9473' }} 
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }}
                cursor={{ stroke: '#6F9473', strokeWidth: 2 }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#6F9473" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Detailed Metrics */}
      <div className="space-y-4">
        <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
          Breakdown Per Brand
        </h3>
        
        <div className="space-y-3">
          <BrandCard name="Indomaret" weight="850kg" vouchers="250" impact="high" />
          <BrandCard name="Coca-Cola" weight="420kg" vouchers="120" impact="medium" />
          <BrandCard name="Aqua" weight="530kg" vouchers="180" impact="high" />
        </div>
      </div>

      <div className="pt-4 space-y-3">
         <Button className="w-full h-16 rounded-[28px] bg-secondary hover:bg-black text-white font-black text-lg gap-3 shadow-xl shadow-secondary/20 border-b-4 border-black/20">
            <BarChart3 className="w-6 h-6" />
            DOWNLOAD IMPACT REPORT
         </Button>
         <Button variant="ghost" className="w-full text-muted-foreground font-black uppercase text-[10px] tracking-[0.2em] h-12">
            <Share2 className="w-4 h-4 mr-2" /> Share to Social Media
         </Button>
      </div>
    </div>
  );
}

function BrandCard({ name, weight, vouchers, impact }: { name: string, weight: string, vouchers: string, impact: string }) {
  return (
    <Card className="rounded-3xl border-border bg-card shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-muted/10 text-muted-foreground rounded-2xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div className="text-foreground">
            <h4 className="font-black text-sm">{name}</h4>
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{weight} Terkumpul</p>
              <div className="w-1 h-1 rounded-full bg-border" />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{vouchers} Voucher</p>
            </div>
          </div>
        </div>
        <Badge className={impact === 'high' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}>
          {impact === 'high' ? 'High Impact' : 'Steady'}
        </Badge>
      </div>
    </Card>
  );
}
