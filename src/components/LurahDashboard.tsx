/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Landmark, Map, Download, FileText, PieChart as PieChartIcon, Users, Leaf } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const RW_DATA = [
    { name: 'RW 1', volume: 850 },
    { name: 'RW 2', volume: 1200 },
    { name: 'RW 3', volume: 600 },
    { name: 'RW 4', volume: 950 },
    { name: 'RW 5', volume: 1100 },
];

export default function LurahDashboard() {
  const handleExport = () => {
    toast.success("Laporan PDF berhasil di-generate untuk Pak Camat!");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Badge className="bg-primary/20 text-primary hover:bg-primary/20 border-none rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
          Dashboard Kelurahan
        </Badge>
        <h2 className="text-3xl font-black tracking-tighter italic uppercase underline decoration-primary decoration-8 underline-offset-[-2px]">KELURAHAN <span className="text-primary">DEPOK JAYA</span></h2>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-primary/10 text-foreground border-primary/20 rounded-3xl p-5 space-y-3 shadow-xl shadow-primary/5 group hover:shadow-primary/10 transition-all">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md mb-2 group-hover:rotate-6 transition-transform">
            <Leaf className="w-7 h-7 text-primary" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-primary leading-none">Total Terpilah</p>
          <h4 className="text-4xl font-black leading-none text-foreground italic tracking-tighter">4.2 <span className="text-xs font-bold uppercase not-italic">Ton</span></h4>
          <p className="text-[10px] font-bold text-primary/60 italic leading-none pt-1">Ekuivalen 2.8 ton CO2</p>
        </Card>
        
        <Card className="bg-card text-foreground border-border rounded-3xl p-5 space-y-3 shadow-sm hover:shadow-md transition-all group">
          <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center shadow-md mb-2 group-hover:scale-110 transition-transform">
            <Users className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none">Warga Aktif</p>
          <h4 className="text-4xl font-black leading-none text-foreground italic tracking-tighter">1,250</h4>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none pt-1">Partisipasi 45%</p>
        </Card>
      </div>

      {/* Performance RW Chart */}
      <Card className="rounded-[40px] border-border bg-card shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            Performa RW (Volume KG)
          </h3>
          <Badge className="bg-accent text-accent-foreground rounded-lg px-2 py-0.5 text-[9px] font-black uppercase">RW 2 Tertinggi</Badge>
        </div>
        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={RW_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E2D8" />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 700, fill: '#2B352D' }} 
                    />
                    <YAxis hide />
                    <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }}
                        cursor={{ fill: '#F8F6F1' }}
                    />
                    <Bar dataKey="volume" radius={[8, 8, 0, 0]}>
                        {RW_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 1 ? '#6F9473' : '#E8E2D8'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
      </Card>

      {/* Heatmap Simulation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
            Status Partisipasi RW
          </h3>
          <Button variant="ghost" className="h-6 text-[10px] font-black uppercase tracking-widest px-2 rounded-lg">Detail Peta <Map className="ml-1 w-3 h-3" /></Button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[1,2,3,4,5,6,7,8].map(i => {
              const bg = i % 3 === 0 ? 'bg-destructive' : (i % 2 === 0 ? 'bg-primary' : 'bg-accent');
              return (
                <div key={`rw-block-${i}`} className="space-y-1">
                    <div className={`h-16 rounded-xl ${bg} opacity-80 hover:opacity-100 transition-opacity flex items-center justify-center font-black text-primary-foreground text-xs italic shadow-sm`}>
                        RW {i}
                    </div>
                </div>
              )
          })}
        </div>
      </div>

      {/* Reward Distribution */}
      <div className="space-y-4">
        <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground">Approval Reward</h3>
        <Card className="rounded-3xl border-border bg-card shadow-sm overflow-hidden">
          <div className="p-4 bg-muted/10 font-black text-[10px] uppercase tracking-widest text-muted-foreground flex justify-between">
            <span>Pemenang Minggu Ini</span>
            <span>Nilai</span>
          </div>
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b border-border hover:bg-muted/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center font-black text-primary">RT 04</div>
                <div className="text-foreground">
                  <h5 className="font-black text-sm">Juara RW 02</h5>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Input: 185kg Sampah Terpilah</p>
                </div>
              </div>
              <Button size="sm" className="bg-primary hover:bg-primary/90 h-8 font-bold text-[10px] rounded-lg">Dístribusi 1jt</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-4 flex flex-col gap-3">
        <Button onClick={handleExport} className="w-full h-16 rounded-[40px] bg-secondary hover:bg-black text-white font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-secondary/20 border-b-4 border-black/20">
          <FileText className="w-6 h-6" />
          EXPORT LAPORAN (PDF)
        </Button>
      </div>
    </div>
  );
}
