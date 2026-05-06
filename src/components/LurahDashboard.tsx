/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Landmark, Map, Download, FileText, PieChart, Users, Leaf } from 'lucide-react';
import { toast } from 'sonner';

export default function LurahDashboard() {
  const handleExport = () => {
    toast.success("Laporan PDF berhasil di-generate untuk Pak Camat!");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
          Dashboard Kelurahan
        </Badge>
        <h2 className="text-3xl font-black tracking-tighter italic uppercase underline decoration-emerald-500 decoration-8 underline-offset-[-2px]">KELURAHAN <span className="text-emerald-600">DEPOK JAYA</span></h2>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-emerald-50 text-emerald-900 border-emerald-100 rounded-3xl p-5 space-y-2">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-2">
            <Leaf className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Total Sampah Terpilah</p>
          <h4 className="text-3xl font-black leading-none">4.2 <span className="text-sm font-bold uppercase">Ton</span></h4>
          <p className="text-[10px] font-bold text-emerald-700 italic">Ekuivalen 2.8 ton CO2</p>
        </Card>
        
        <Card className="bg-slate-50 text-slate-900 border-slate-100 rounded-3xl p-5 space-y-2">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-2">
            <Users className="w-6 h-6 text-slate-600" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Warga Aktif</p>
          <h4 className="text-3xl font-black leading-none">1.250</h4>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dari 2.800 KK</p>
        </Card>
      </div>

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
              const bg = i % 3 === 0 ? 'bg-red-500' : (i % 2 === 0 ? 'bg-emerald-500' : 'bg-yellow-400');
              return (
                <div key={i} className="space-y-1">
                    <div className={`h-16 rounded-xl ${bg} opacity-80 hover:opacity-100 transition-opacity flex items-center justify-center font-black text-white text-xs italic shadow-sm`}>
                        RW {i}
                    </div>
                </div>
              )
          })}
        </div>
      </div>

      {/* Reward Distribution */}
      <div className="space-y-4">
        <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Approval Reward</h3>
        <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 font-black text-[10px] uppercase tracking-widest text-slate-500 flex justify-between">
            <span>Pemenang Minggu Ini</span>
            <span>Nilai</span>
          </div>
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center font-black text-emerald-600">RT 04</div>
                <div>
                  <h5 className="font-black text-sm">Juara RW 02</h5>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Input: 185kg Sampah Terpilah</p>
                </div>
              </div>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-8 font-bold text-[10px] rounded-lg">Dístribusi 1jt</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-4 flex flex-col gap-3">
        <Button onClick={handleExport} variant="outline" className="w-full h-14 rounded-2xl border-2 border-slate-100 font-bold flex items-center justify-center gap-3 hover:bg-slate-50">
          <FileText className="w-5 h-5" />
          EXPORT LAPORAN BULANAN (PDF)
        </Button>
      </div>
    </div>
  );
}
