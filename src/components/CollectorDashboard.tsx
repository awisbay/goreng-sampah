/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, QrCode, CheckCircle2, Navigation, ClipboardList, ScanLine, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { cn } from '@/lib/utils';

export default function CollectorDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'roaming' | 'station'>('roaming');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'pickup_requests'),
      where('status', 'in', ['pending', 'accepted']),
      orderBy('created_at', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'pickup_requests');
    });

    return () => unsubscribe();
  }, [user]);

  const handleAccept = async (requestId: string) => {
    try {
      await updateDoc(doc(db, 'pickup_requests', requestId), {
        status: 'accepted',
        officer_id: user?.id,
        officer_name: user?.name
      });
      toast.success("Tugas diterima! Segera meluncur.");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `pickup_requests/${requestId}`);
    }
  };

  const handleComplete = async (requestId: string) => {
    try {
      await updateDoc(doc(db, 'pickup_requests', requestId), {
        status: 'completed',
        completed_at: serverTimestamp()
      });
      toast.success("Tugas selesai! Poin warga telah ditambahkan.");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `pickup_requests/${requestId}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-black tracking-tighter italic uppercase">DASHBOARD <span className="text-emerald-600">PETUGAS</span></h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Petugas: {user?.name} • Shift Pagi</p>
      </div>

      <div className="flex gap-2 p-1 bg-white border border-slate-100 rounded-2xl shadow-sm">
        <button 
          onClick={() => setActiveTab('roaming')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'roaming' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400'}`}
        >
          Tugas Jemput
        </button>
        <button 
          onClick={() => setActiveTab('station')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'station' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400'}`}
        >
          Standby Pos
        </button>
      </div>

      {activeTab === 'roaming' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Permintaan Jemput</h3>
            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter border-emerald-200 text-emerald-600 bg-emerald-50">
              {loading ? "MENCARI..." : `${requests.length} AKTIF`}
            </Badge>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {requests.map((req) => (
                <motion.div
                  key={req.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className={cn(
                    "rounded-3xl border-none shadow-sm overflow-hidden transition-all",
                    req.status === 'accepted' ? "bg-emerald-50 ring-2 ring-emerald-500" : "bg-white"
                  )}>
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                          req.status === 'accepted' ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"
                        )}>
                          {req.status === 'accepted' ? <Navigation className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-black text-slate-900">{req.user_name || 'Warga'}</p>
                            <span className="text-[10px] font-bold text-slate-400 font-mono">
                              {req.created_at?.toDate?.() ? new Date(req.created_at.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Baru' }
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter truncate flex-1">{req.address}</p>
                             <Badge variant="outline" className="h-4 px-1 rounded-sm border-slate-200 text-[8px] font-black italic bg-slate-50 text-slate-600 shrink-0">
                               {req.weight || 0} KG
                             </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex gap-1">
                          {req.categories?.map((t: string) => (
                            <Badge key={t} className="text-[8px] bg-white/50 text-slate-500 border-slate-100 font-bold uppercase py-0 leading-none h-4">{t}</Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          {req.status === 'pending' ? (
                            <Button 
                              onClick={() => handleAccept(req.id)}
                              size="sm" 
                              className="h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100 px-4 text-[10px] font-black uppercase tracking-widest"
                            >
                              TERIMA TUGAS
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => handleComplete(req.id)}
                              size="sm" 
                              className="h-8 rounded-xl bg-slate-900 hover:bg-black shadow-lg shadow-slate-100 px-4 text-[10px] font-black uppercase tracking-widest"
                            >
                              SELESAI
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              {!loading && requests.length === 0 && (
                <div className="py-10 text-center space-y-3">
                   <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                     <Check className="text-slate-300 w-8 h-8" />
                   </div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Semua Tugas Sudah Beres!</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 py-10 flex flex-col items-center"
        >
          <div className="w-48 h-48 bg-emerald-50 rounded-[60px] flex items-center justify-center relative">
            <div className="absolute inset-0 bg-emerald-400/10 rounded-[60px] animate-pulse" />
            <div className="bg-white p-6 rounded-[40px] shadow-2xl relative z-10">
              <QrCode className="w-24 h-24 text-emerald-600" />
            </div>
            <div className="absolute -bottom-2 bg-emerald-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
              SCAN MODE
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter">STANDBY <span className="text-emerald-600">POS</span></h3>
            <p className="text-xs font-bold text-slate-500 px-10">
              Arahkan kamera ke QR Code warga untuk verifikasi setoran drop point secara manual.
            </p>
          </div>

          <Button className="w-full h-16 rounded-3xl bg-slate-900 group shadow-2xl shadow-slate-200">
            <div className="flex items-center gap-3">
              <ScanLine className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span className="font-black text-lg">AKTIFKAN SCANNER</span>
            </div>
          </Button>

          <Card className="w-full rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50/50">
             <CardContent className="p-6 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Setoran Hari Ini</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-black text-slate-900">124<span className="text-xs ml-1">kg</span></p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Volume Sampah</p>
                  </div>
                   <div>
                    <p className="text-2xl font-black text-emerald-600">42</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Warga Terlayani</p>
                  </div>
                </div>
             </CardContent>
          </Card>
        </motion.div>
      )}

      <Button variant="ghost" className="w-full text-slate-400 font-bold text-xs gap-2">
        <ClipboardList className="w-4 h-4" />
        LIHAT RIWAYAT TUGAS
      </Button>
    </div>
  );
}
