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

  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [lastCompletedReq, setLastCompletedReq] = useState<any>(null);

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
      const req = requests.find(r => r.id === requestId);
      setLastCompletedReq(req);
      await updateDoc(doc(db, 'pickup_requests', requestId), {
        status: 'completed',
        completed_at: serverTimestamp()
      });
      setIsSuccessDialogOpen(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `pickup_requests/${requestId}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-black tracking-tighter italic uppercase text-foreground">DASHBOARD <span className="text-primary">PETUGAS</span></h2>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Petugas: {user?.name} • Shift Pagi</p>
      </div>

      <div className="flex gap-2 p-1.5 bg-card border border-border rounded-3xl shadow-sm">
        <button 
          onClick={() => setActiveTab('roaming')}
          className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'roaming' ? 'bg-secondary text-white shadow-xl shadow-secondary/20' : 'text-muted-foreground hover:bg-muted/5'}`}
        >
          Tugas Jemput
        </button>
        <button 
          onClick={() => setActiveTab('station')}
          className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'station' ? 'bg-secondary text-white shadow-xl shadow-secondary/20' : 'text-muted-foreground hover:bg-muted/5'}`}
        >
          Standby Pos
        </button>
      </div>

      {activeTab === 'roaming' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground">Permintaan Jemput</h3>
            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter border-primary/20 text-primary bg-primary/10">
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
                    req.status === 'accepted' ? "bg-primary/10 ring-2 ring-primary" : "bg-card"
                  )}>
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                          req.status === 'accepted' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}>
                          {req.status === 'accepted' ? <Navigation className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-black text-foreground">{req.user_name || 'Warga'}</p>
                            <span className="text-[10px] font-bold text-muted-foreground font-mono">
                              {req.created_at?.toDate?.() ? new Date(req.created_at.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Baru' }
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter truncate flex-1">{req.address}</p>
                             <Badge variant="outline" className="h-4 px-1 rounded-sm border-border text-[8px] font-black italic bg-muted/10 text-muted-foreground shrink-0">
                               {req.weight || 0} KG
                             </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex gap-1">
                          {req.categories?.map((t: string, idx: number) => (
                            <Badge key={`${t}-${idx}`} className="text-[8px] bg-background/50 text-muted-foreground border-border font-bold uppercase py-0 leading-none h-4">{t}</Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          {req.status === 'pending' ? (
                            <Button 
                              onClick={() => handleAccept(req.id)}
                              size="sm" 
                              className="h-9 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/10 px-5 text-[10px] font-black uppercase tracking-widest"
                            >
                              TERIMA TUGAS
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => handleComplete(req.id)}
                              size="sm" 
                              className="h-9 rounded-2xl bg-secondary text-white hover:bg-black shadow-lg shadow-secondary/10 px-5 text-[10px] font-black uppercase tracking-widest border-b-2 border-black/20"
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
                   <div className="w-16 h-16 bg-muted/10 rounded-full flex items-center justify-center mx-auto">
                     <Check className="text-muted-foreground/40 w-8 h-8" />
                   </div>
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Semua Tugas Sudah Beres!</p>
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
          <div className="w-48 h-48 bg-primary/10 rounded-[60px] flex items-center justify-center relative">
            <div className="absolute inset-0 bg-primary/10 rounded-[60px] animate-pulse" />
            <div className="bg-card p-6 rounded-[40px] shadow-2xl relative z-10">
              <QrCode className="w-24 h-24 text-primary" />
            </div>
            <div className="absolute -bottom-2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
              SCAN MODE
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-foreground">STANDBY <span className="text-primary">POS</span></h3>
            <p className="text-xs font-bold text-muted-foreground px-10">
              Arahkan kamera ke QR Code warga untuk verifikasi setoran drop point secara manual.
            </p>
          </div>

          <Button className="w-full h-16 rounded-3xl bg-foreground text-background group shadow-2xl shadow-foreground/10">
            <div className="flex items-center gap-3">
              <ScanLine className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span className="font-black text-lg">AKTIFKAN SCANNER</span>
            </div>
          </Button>

          <Card className="w-full rounded-3xl border-2 border-dashed border-border bg-muted/10">
             <CardContent className="p-6 text-center">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Total Setoran Hari Ini</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-black text-foreground">124<span className="text-xs ml-1">kg</span></p>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase">Volume Sampah</p>
                  </div>
                   <div>
                    <p className="text-2xl font-black text-primary">42</p>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase">Warga Terlayani</p>
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

      {/* Success Summary Dialog */}
      {isSuccessDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card w-full max-w-sm rounded-[40px] p-8 shadow-2xl relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full translate-x-12 -translate-y-12 blur-2xl" />
             
             <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-[32px] flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">DATA TERKIRIM</h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-tight">Bukti setoran digital telah divalidasi</p>
                </div>

                <Card className="w-full bg-muted/20 border-none rounded-3xl p-4 grid grid-cols-2 gap-4">
                  <div className="text-left">
                     <p className="text-[8px] font-black text-muted-foreground uppercase">PELANGGAN</p>
                     <p className="font-bold text-xs truncate">{lastCompletedReq?.user_name}</p>
                  </div>
                  <div className="text-left">
                     <p className="text-[8px] font-black text-muted-foreground uppercase">BERAT VALID</p>
                     <p className="font-bold text-xs">{lastCompletedReq?.weight} KG</p>
                  </div>
                   <div className="text-left">
                     <p className="text-[8px] font-black text-muted-foreground uppercase">POIN WARGA</p>
                     <p className="font-black text-xs text-primary">+{Math.round((lastCompletedReq?.weight || 0) * 100)} PTS</p>
                  </div>
                  <div className="text-left">
                     <p className="text-[8px] font-black text-muted-foreground uppercase">EST. CO2</p>
                     <p className="font-bold text-xs text-secondary">{(lastCompletedReq?.weight * 1.2).toFixed(1)} KG</p>
                  </div>
                </Card>

                <Button 
                  onClick={() => setIsSuccessDialogOpen(false)}
                  className="w-full h-14 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest shadow-xl shadow-foreground/10"
                >
                  LANJUT TUGAS BERIKUTNYA
                </Button>
             </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
