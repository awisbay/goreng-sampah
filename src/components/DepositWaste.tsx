/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, MapPin, QrCode, CheckCircle2, ChevronLeft, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { classifyWaste, ClassificationResult } from '../services/geminiService';
import { MOCK_DROP_POINTS } from '../lib/mockData';
import { toast } from 'sonner';

type Step = 'capture' | 'classify' | 'location' | 'qr' | 'success';

export default function DepositWaste({ onComplete, onCancel }: { onComplete: () => void, onCancel: () => void }) {
  const [step, setStep] = useState<Step>('capture');
  const [image, setImage] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<ClassificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDP, setSelectedDP] = useState<string | null>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setStep('classify');
        runAI(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAI = async (base64: string) => {
    setLoading(true);
    try {
      // Remove data:image/jpeg;base64, prefix
      const pureBase64 = base64.split(',')[1];
      const result = await classifyWaste(pureBase64);
      setAiResult(result);
    } catch (error) {
      console.error(error);
      toast.error("Gagal klasifikasi AI, silahkan input manual");
      setAiResult({ category: 'organik', explanation: 'Gagal mendeteksi, asumsi organik.', confidence: 0.5 });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 'classify') setStep('location');
    else if (step === 'location') setStep('qr');
  };

  const simulateConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      toast.success("+45 Poin! RT kamu naik ke peringkat 3!");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-xl font-black italic uppercase tracking-tight">Setor Sampah</h2>
      </div>

      <AnimatePresence mode="wait">
        {step === 'capture' && (
          <motion.div 
            key="step-capture"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-8 py-10 flex flex-col items-center"
          >
            <div className="w-32 h-32 bg-primary/10 text-primary rounded-full flex items-center justify-center relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              <Camera className="w-16 h-16 relative z-10" />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black tracking-tight">FOTO SAMPAHMU</h3>
              <p className="text-sm text-muted-foreground font-medium px-10">
                AI kami akan mendeteksi kategori sampahmu supaya pemilahan makin akurat.
              </p>
            </div>

            <div className="w-full space-y-4 pt-10">
              <input type="file" accept="image/*" capture="environment" id="camera-input" className="hidden" onChange={handleCapture} />
              <Button 
                onClick={() => document.getElementById('camera-input')?.click()} 
                className="w-full h-16 rounded-3xl bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold shadow-xl shadow-primary/20"
              >
                Ambil Foto Sekarang
              </Button>
              <Button variant="ghost" onClick={onCancel} className="w-full text-muted-foreground font-bold">Batal</Button>
            </div>
          </motion.div>
        )}

        {step === 'classify' && (
          <motion.div 
            key="step-classify"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="aspect-square rounded-3xl overflow-hidden bg-muted relative border-4 border-card shadow-xl">
              <img src={image!} alt="Captured" className="w-full h-full object-cover" />
              {loading && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p className="font-black text-xs uppercase tracking-widest animate-pulse">Menghitung Poin AI...</p>
                </div>
              )}
            </div>

            {aiResult && (
              <Card className="rounded-3xl border-none bg-card shadow-xl overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-none px-3 py-1 font-black italic rounded-lg">
                      <Sparkles className="w-3 h-3 mr-1" />
                      HASIL AI
                    </Badge>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Akurasi {Math.round(aiResult.confidence * 100)}%</span>
                  </div>
                  
                  <div className="space-y-1 text-foreground">
                    <h4 className="text-2xl font-black capitalize">{aiResult.category.replace('_', ' ')}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed italic font-medium">"{aiResult.explanation}"</p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button onClick={handleNext} className="w-full h-14 rounded-2xl bg-foreground text-background group">
                      Lanjutkan ke Drop Point
                      <ChevronLeft className="ml-2 w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {step === 'location' && (
          <motion.div 
            key="step-location"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
             <div className="text-center space-y-1">
              <h3 className="text-2xl font-black tracking-tighter">PILIH DROP POINT</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Bank Sampah Terdekat</p>
            </div>

            <div className="space-y-4">
              {MOCK_DROP_POINTS.map((dp) => (
                <button 
                  key={dp.id}
                  onClick={() => setSelectedDP(dp.id)}
                  className={`w-full text-left p-5 rounded-3xl border-2 transition-all ${selectedDP === dp.id ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-border bg-card hover:border-primary/20'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedDP === dp.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="text-foreground">
                        <h4 className="font-black text-sm">{dp.name}</h4>
                        <p className="text-xs text-muted-foreground font-medium">800m dari lokasi Anda</p>
                        <div className="flex gap-1 mt-2">
                          {dp.accepts.slice(0, 2).map((cat, idx) => (
                            <Badge key={`${cat}-${idx}`} variant="secondary" className="text-[8px] px-1 py-0 uppercase bg-secondary/10 text-secondary border-none">{cat}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    {selectedDP === dp.id && <CheckCircle2 className="w-6 h-6 text-primary" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <Button onClick={handleNext} disabled={!selectedDP} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/10 font-bold text-lg">
                Dapatkan Kode QR
              </Button>
              <div className="flex items-center justify-center gap-2 text-[10px] text-accent font-bold bg-accent/10 py-2 rounded-xl">
                <AlertTriangle className="w-3 h-3" />
                Datang ke bank sampah untuk validasi berat
              </div>
            </div>
          </motion.div>
        )}

        {step === 'qr' && (
          <motion.div 
            key="step-qr"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8 flex flex-col items-center py-6"
          >
            <div className="text-center space-y-1">
              <h3 className="text-2xl font-black tracking-tighter uppercase text-foreground">Tunjukkan QR Ini</h3>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Berikan ke petugas bank sampah</p>
            </div>

            <div className="p-8 bg-card rounded-[40px] shadow-2xl shadow-primary/5 border-8 border-primary/10">
              <div className="w-48 h-48 bg-background rounded-2xl flex items-center justify-center border-2 border-dashed border-border">
                <QrCode className="w-32 h-32 text-foreground" />
              </div>
            </div>

            <div className="space-y-6 w-full text-center">
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Estimasi Skor</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-black text-primary">+45</span>
                  <p className="text-xs font-bold text-muted-foreground text-left leading-tight">POIN <br/>PERINGKAT</p>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-[10px] text-muted-foreground font-bold mb-4 uppercase">Demo Only: Simulasi konfirmasi petugas</p>
                <Button onClick={simulateConfirm} disabled={loading} className="w-full h-14 rounded-2xl bg-foreground text-background shadow-xl shadow-foreground/10">
                  {loading ? <Loader2 className="animate-spin" /> : "Konfirmasi Petugas"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div 
            key="step-success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-10 flex flex-col items-center py-10"
          >
            <motion.div 
              initial={{ rotate: -20, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-32 h-32 bg-primary text-primary-foreground rounded-[40px] flex items-center justify-center shadow-2xl shadow-primary/20"
            >
              <CheckCircle2 className="w-20 h-20" />
            </motion.div>

            <div className="text-center space-y-4 text-foreground">
              <div className="space-y-1">
                <h3 className="text-4xl font-black tracking-tighter uppercase italic text-primary">BERHASIL!</h3>
                <p className="text-lg font-bold leading-tight px-10">
                  Satu langkah besar untuk RT-mu, satu aksi nyata untuk bumi.
                </p>
              </div>
              
              <Card className="rounded-3xl border-none bg-primary/10 overflow-hidden w-full">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-primary/20">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">HASIL SETORAN (KG)</p>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-primary/60 uppercase">Total Poin</p>
                      <p className="text-lg font-black text-foreground leading-none">+45</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center p-2 bg-card rounded-2xl shadow-sm border border-primary/10">
                      <p className="text-lg font-black text-primary">0.5</p>
                      <p className="text-[7px] font-black text-muted-foreground uppercase">Organik</p>
                    </div>
                    <div className="text-center p-2 bg-card rounded-2xl shadow-sm border border-primary/10">
                      <p className="text-lg font-black text-secondary">0.4</p>
                      <p className="text-[7px] font-black text-muted-foreground uppercase">Daur</p>
                    </div>
                    <div className="text-center p-2 bg-card rounded-2xl shadow-sm border border-primary/10">
                      <p className="text-lg font-black text-destructive">0.2</p>
                      <p className="text-[7px] font-black text-muted-foreground uppercase">B3</p>
                    </div>
                    <div className="text-center p-2 bg-card rounded-2xl shadow-sm border border-primary/10">
                      <p className="text-lg font-black text-muted-foreground">0.1</p>
                      <p className="text-[7px] font-black text-muted-foreground uppercase">Residu</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
