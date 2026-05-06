/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, User, ChevronRight } from 'lucide-react';
import { MOCK_RTS } from '../lib/mockData';

export default function Onboarding() {
  const { user, updateProfile } = useAuth();
  const [selectedRT, setSelectedRT] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    if (!selectedRT) return;
    setLoading(true);
    await updateProfile({ rt_id: selectedRT });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-emerald-600 text-white pt-10 pb-16 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-2xl" />
          <CardTitle className="text-3xl font-black tracking-tight mb-2">Hampir Selesai!</CardTitle>
          <CardDescription className="text-emerald-100 font-medium">
            Halo {user?.name}, pilih RT kamu untuk mulai mewakili tim-mu di GORENG.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-6 -mt-8 bg-white rounded-t-3xl pt-8 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <MapPin className="text-emerald-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pilih Wilayah</p>
                <Select onValueChange={setSelectedRT}>
                  <SelectTrigger className="border-none bg-transparent p-0 h-auto font-bold text-slate-900 focus:ring-0">
                    <SelectValue placeholder="Pilih RT / RW Anda" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                    {MOCK_RTS.map((rt) => (
                      <SelectItem key={rt.id} value={rt.id} className="py-3 font-medium">
                        {rt.name} - RW 01 (Kel. Depok Jaya)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-60">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <User className="text-slate-400" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Peran Anda</p>
                <p className="font-bold text-slate-900">Warga (Citizen)</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleFinish} 
            disabled={!selectedRT || loading}
            className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-lg font-bold shadow-lg shadow-emerald-200 transition-all"
          >
            {loading ? "Menyimpan..." : "Siap Bertanding!"}
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>

          <p className="text-center text-xs text-slate-400 font-medium px-8">
            Kamu bisa mengubah wilayah di pengaturan profil nanti.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
