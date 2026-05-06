/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, TrendingUp, BarChart3, Package, Globe, Share2 } from 'lucide-react';

export default function SponsorDashboard() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
          Partner Dashboard (CSR/EPR)
        </Badge>
        <h2 className="text-3xl font-black tracking-tighter italic uppercase underline decoration-amber-500 decoration-8 underline-offset-[-2px]">BRAND <span className="text-amber-600">IMPACT</span></h2>
      </div>

      {/* Environmental Impact Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="rounded-3xl border-none bg-emerald-900 text-white shadow-xl shadow-emerald-100 p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Globe className="w-12 h-12" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">CO2 Terkurangi</p>
            <h3 className="text-xl font-black italic">1,240<span className="text-[10px] ml-1 font-bold not-italic">kg</span></h3>
            <p className="text-[8px] font-bold text-emerald-300 mt-1 uppercase">Sesuai Target ESG</p>
          </div>
        </Card>
        <Card className="rounded-3xl border-none bg-white shadow-sm p-4 border border-slate-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pohon Setara</p>
          <h3 className="text-xl font-black text-slate-900 italic">52<span className="text-[10px] ml-1 font-bold not-italic">Pohon</span></h3>
          <p className="text-[8px] font-bold text-emerald-500 mt-1 uppercase">+12 Bulan ini</p>
        </Card>
      </div>

      {/* ROI Impact */}
      <Card className="bg-slate-900 text-white border-none rounded-[40px] p-8 space-y-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full translate-x-24 -translate-y-24 blur-[80px] pointer-events-none" />
        
        <div className="space-y-2 text-center uppercase tracking-widest relative z-10">
          <p className="text-[10px] font-black text-slate-400">Dampak Sponsor Minggu Ini</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-5xl font-black italic">1.8</span>
            <span className="text-xl font-bold text-amber-500">Ton</span>
          </div>
          <p className="text-[10px] font-bold text-amber-400">Plastik & Aluminium Terkumpul</p>
        </div>

        <div className="grid grid-cols-3 gap-4 relative z-10">
          <div className="text-center space-y-1">
             <p className="text-[8px] font-black text-slate-500 uppercase">Warga Aktif</p>
             <p className="text-xl font-black">340</p>
          </div>
          <div className="text-center space-y-1">
             <p className="text-[8px] font-black text-slate-500 uppercase">Efisiensi Biaya</p>
             <p className="text-xl font-black text-emerald-400">42%</p>
          </div>
          <div className="text-center space-y-1">
             <p className="text-[8px] font-black text-slate-500 uppercase">ROI / kg</p>
             <p className="text-lg font-black italic">Rp 5.5rb</p>
          </div>
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
         <Button className="w-full h-14 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-lg gap-3">
            <BarChart3 className="w-5 h-5" />
            DOWNLOAD IMPACT REPORT (EPR)
         </Button>
         <Button variant="ghost" className="w-full text-slate-400 font-bold uppercase text-[10px] tracking-widest">
            <Share2 className="w-3 h-3 mr-2" /> Share to Social Media
         </Button>
      </div>
    </div>
  );
}

function BrandCard({ name, weight, vouchers, impact }: { name: string, weight: string, vouchers: string, impact: string }) {
  return (
    <Card className="rounded-3xl border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-sm text-slate-900">{name}</h4>
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{weight} Terkumpul</p>
              <div className="w-1 h-1 rounded-full bg-slate-200" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{vouchers} Voucher</p>
            </div>
          </div>
        </div>
        <Badge className={impact === 'high' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}>
          {impact === 'high' ? 'High Impact' : 'Steady'}
        </Badge>
      </div>
    </Card>
  );
}
