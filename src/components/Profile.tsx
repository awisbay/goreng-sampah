/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Settings, History, Shield, Heart } from 'lucide-react';

export default function Profile({ onSignOut }: { onSignOut: () => void }) {
  const { user, signOut, updateProfile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onSignOut();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="relative">
          <img src={user?.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} alt="Profile" className="w-24 h-24 rounded-[32px] border-4 border-card shadow-xl" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-xl border-4 border-card flex items-center justify-center shadow-lg">
            <span className="text-primary-foreground text-[10px] font-bold">VIP</span>
          </div>
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-2xl font-black tracking-tight">{user?.name}</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Warga Berprestasi</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-4 border-b border-border">
        <div className="text-center p-4 bg-card rounded-3xl shadow-sm border border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Poin</p>
          <p className="text-2xl font-black text-foreground">4.250</p>
        </div>
        <div className="text-center p-4 bg-card rounded-3xl shadow-sm border border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Kelola</p>
          <p className="text-2xl font-black text-foreground">128 kg</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-3">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Rincian Per Kategori (kg)</p>
        <div className="grid grid-cols-4 gap-2">
          <CategoryStat label="Org" value="45.2" color="bg-primary" />
          <CategoryStat label="Daur" value="62.8" color="bg-secondary" />
          <CategoryStat label="B3" value="12.5" color="bg-destructive" />
          <CategoryStat label="Res" value="7.5" color="bg-muted" />
        </div>
      </div>

      {/* Demo Only: Role Switcher */}
      <div className="space-y-3 p-4 bg-accent/10 border border-accent/20 rounded-3xl">
        <p className="text-[10px] font-black text-accent uppercase tracking-widest text-center">Demo Mode: Ganti Peran</p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="text-[10px] h-8 font-bold border-accent/20 bg-background" onClick={() => updateProfile({ role: 'citizen' })}>Citizen</Button>
          <Button variant="outline" size="sm" className="text-[10px] h-8 font-bold border-accent/20 bg-background" onClick={() => updateProfile({ role: 'rt_leader' })}>Ketua RT</Button>
          <Button variant="outline" size="sm" className="text-[10px] h-8 font-bold border-accent/20 bg-background" onClick={() => updateProfile({ role: 'lurah' })}>Lurah</Button>
          <Button variant="outline" size="sm" className="text-[10px] h-8 font-bold border-accent/20 bg-background" onClick={() => updateProfile({ role: 'sponsor' })}>Sponsor</Button>
          <Button variant="outline" size="sm" className="text-[10px] h-8 font-bold border-accent/20 bg-background col-span-2" onClick={() => updateProfile({ role: 'officer' })}>Petugas Sampah</Button>
        </div>
      </div>

      <div className="space-y-2">
        <MenuButton icon={History} label="Riwayat Setoran" secondary="24 Transaksi" />
        <MenuButton icon={Shield} label="Badge Koleksi" secondary="8 Badge" />
        <MenuButton icon={Heart} label="Kontribusi Karbon" secondary="12.5 ton CO2" />
        <MenuButton icon={Settings} label="Pengaturan Akun" />
      </div>

      <div className="pt-6">
        <Button variant="ghost" className="w-full h-14 rounded-2xl text-red-500 font-bold hover:bg-red-50 hover:text-red-600" onClick={handleSignOut}>
          <LogOut className="w-5 h-5 mr-3" />
          Keluar dari Aplikasi
        </Button>
      </div>

      <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest">GORENG v2.0</p>
    </div>
  );
}

function CategoryStat({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-2 text-center shadow-sm">
      <div className={`w-full h-1 rounded-full ${color} mb-2`} />
      <p className="text-lg font-black text-foreground leading-none">{value}</p>
      <p className="text-[8px] font-bold text-muted-foreground uppercase mt-1">{label}</p>
    </div>
  );
}

function MenuButton({ icon: Icon, label, secondary }: { icon: any, label: string, secondary?: string }) {
  return (
    <button className="w-full flex items-center justify-between p-4 bg-card hover:bg-muted/10 border border-border rounded-2xl transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-muted/10 text-muted-foreground rounded-xl flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-bold text-sm text-foreground">{label}</span>
      </div>
      {secondary && <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{secondary}</span>}
    </button>
  );
}
