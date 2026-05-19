/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, MapPin, AlertTriangle, CheckCircle2, ChevronLeft, Loader2, MapPinned, Video, Image as ImageIcon, UserSearch } from 'lucide-react';
import { toast } from 'sonner';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export default function ReportViolation({ onComplete, onCancel }: { onComplete: () => void, onCancel: () => void }) {
  const { user } = useAuth();
  const [step, setStep] = useState<'capture' | 'details' | 'success'>('capture');
  const [media, setMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [locationName, setLocationName] = useState('');
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [category, setCategory] = useState<'Sampah Liar' | 'Pembakaran'>('Sampah Liar');
  const [loading, setLoading] = useState(false);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      setMediaType(isVideo ? 'video' : 'image');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setMedia(reader.result as string);
        setStep('details');
      };
      reader.readAsDataURL(file);
    }
  };

  const submitReport = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'violation_reports'), {
        reporter_id: user.id,
        reporter_name: user.name,
        rt_id: user.rt_id || 'RT01',
        type: category,
        location_name: locationName,
        evidence_description: evidenceDesc,
        evidence_media_url: media, // Using base64 for demo
        status: 'pending',
        created_at: serverTimestamp()
      });
      setStep('success');
      toast.success("Laporan terkirim ke Pak RT! +10 Poin Insentif.");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'violation_reports');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-xl font-black italic uppercase tracking-tight">Lapor Pelanggaran</h2>
      </div>

      <AnimatePresence mode="wait">
        {step === 'capture' && (
          <motion.div 
            key="step-capture"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8 py-10 flex flex-col items-center"
          >
            <div className="w-32 h-32 bg-destructive/10 text-destructive rounded-full flex items-center justify-center relative">
              <div className="absolute inset-0 bg-destructive/20 rounded-full animate-ping" />
              <Camera className="w-16 h-16 relative z-10" />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black tracking-tight uppercase text-foreground">Upload Bukti</h3>
              <p className="text-sm text-muted-foreground font-medium px-10">
                Foto atau video pembakaran sampah/sampah liar dari galeri atau kamera.
              </p>
            </div>

            <div className="w-full grid grid-cols-2 gap-3 pt-10">
              <input type="file" accept="image/*,video/*" id="report-media" className="hidden" onChange={handleMediaUpload} />
              <Button 
                onClick={() => document.getElementById('report-media')?.click()} 
                className="h-20 rounded-3xl bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm font-black flex flex-col gap-1 shadow-xl shadow-destructive/20 uppercase tracking-widest"
              >
                <Camera className="w-5 h-5 mb-1" />
                Kamera
              </Button>
              <Button 
                onClick={() => document.getElementById('report-media')?.click()} 
                variant="outline" 
                className="h-20 rounded-3xl border-2 border-destructive/10 text-destructive hover:bg-destructive/10 text-sm font-black flex flex-col gap-1 uppercase tracking-widest"
              >
                <ImageIcon className="w-5 h-5 mb-1" />
                Galeri
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'details' && (
          <motion.div 
            key="step-details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="aspect-video rounded-3xl overflow-hidden bg-muted relative border-4 border-card shadow-xl">
              {mediaType === 'image' ? (
                <img src={media!} alt="Violation" className="w-full h-full object-cover" />
              ) : (
                <video src={media!} controls className="w-full h-full object-cover" />
              )}
            </div>

            <Card className="rounded-3xl border-none bg-card shadow-xl overflow-hidden">
              <CardContent className="p-6 space-y-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Lokasi Kejadian</Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <Input 
                        placeholder="Contoh: Depan Gapura RT 01" 
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        className="h-12 pl-10 rounded-2xl bg-background border-none font-bold focus-visible:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Keterangan / Orang Mencurigakan</Label>
                    <div className="relative">
                      <UserSearch className="absolute left-4 top-4 w-4 h-4 text-primary" />
                      <Textarea 
                        placeholder="Ciri-ciri pelaku atau detail sampah..." 
                        value={evidenceDesc}
                        onChange={(e) => setEvidenceDesc(e.target.value)}
                        className="min-h-[100px] pl-10 pt-3 rounded-2xl bg-background border-none font-bold focus-visible:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kategori Laporan</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <Button 
                        type="button"
                        variant={category === 'Sampah Liar' ? 'default' : 'outline'} 
                        onClick={() => setCategory('Sampah Liar')}
                        className={cn(
                          "h-10 text-[10px] rounded-xl font-black uppercase tracking-widest",
                          category === 'Sampah Liar' ? "bg-destructive" : "border-border bg-background text-muted-foreground"
                        )}
                      >
                        Sampah Liar
                      </Button>
                      <Button 
                        type="button"
                        variant={category === 'Pembakaran' ? 'default' : 'outline'} 
                        onClick={() => setCategory('Pembakaran')}
                        className={cn(
                          "h-10 text-[10px] rounded-xl font-black uppercase tracking-widest",
                          category === 'Pembakaran' ? "bg-destructive" : "border-border bg-background text-muted-foreground"
                        )}
                      >
                        Pembakaran
                      </Button>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={submitReport} 
                  disabled={loading || !locationName} 
                  className="w-full h-14 rounded-2xl bg-foreground text-background hover:bg-black shadow-lg shadow-foreground/10 uppercase font-black tracking-widest"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Kirim Laporan"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div 
            key="step-success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-10 flex flex-col items-center py-10 text-center"
          >
            <div className="w-32 h-32 bg-primary text-primary-foreground rounded-[40px] flex items-center justify-center shadow-2xl shadow-primary/20">
              <CheckCircle2 className="w-20 h-20" />
            </div>

            <div className="space-y-2">
              <h3 className="text-3xl font-black tracking-tighter uppercase italic text-primary">LAPORAN DITERIMA</h3>
              <p className="text-lg font-bold text-foreground leading-tight px-10">
                Terima kasih sudah menjaga lingkungan tetap asri!
              </p>
              <div className="pt-4 flex items-center justify-center gap-2">
                <span className="text-3xl font-black text-primary">+10</span>
                <p className="text-xs font-bold text-muted-foreground text-left leading-tight uppercase">POIN <br/>INSENTIF</p>
              </div>
            </div>

            <Button onClick={onComplete} className="w-full h-16 rounded-3xl bg-foreground text-background font-black text-lg">
              Kembali ke Beranda
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
