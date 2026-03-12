'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Camera, RefreshCw, Send, X } from 'lucide-react';
import { presensiMasuk, presensiKeluar } from '@/lib/presensi-api';

interface Props {
  open: boolean;
  type: 'masuk' | 'keluar';
  onClose: () => void;
}

export function PresensiModal({ open, type, onClose }: Props) {
  const queryClient = useQueryClient();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);

  const [step, setStep] = useState<'camera' | 'preview'>('camera');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [camError, setCamError] = useState<string | null>(null);

  const { mutate, isPending, error, reset } = useMutation({
    mutationFn: () => {
      if (!capturedBlob) throw new Error('Tidak ada foto');
      return type === 'masuk' ? presensiMasuk(capturedBlob) : presensiKeluar(capturedBlob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presensi', 'today'] });
      handleClose();
    },
  });

  useEffect(() => {
    mountedRef.current = true;
    if (open && step === 'camera') {
      startCamera();
    }
    return () => {
      mountedRef.current = false;
      stopCamera();
    };
  }, [open]);

  async function startCamera() {
    setCamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      if (!mountedRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCamError('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.');
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        stopCamera();
        setCapturedBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
        setStep('preview');
      },
      'image/jpeg',
      0.85,
    );
  }

  function retake() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setCapturedBlob(null);
    setStep('camera');
    reset();
    startCamera();
  }

  function handleClose() {
    stopCamera();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setCapturedBlob(null);
    setStep('camera');
    reset();
    onClose();
  }

  if (!open) return null;

  const title = type === 'masuk' ? 'Absen Masuk' : 'Absen Keluar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
      <div className="relative w-full max-w-md rounded-xl bg-white shadow-xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <button onClick={handleClose} className="rounded-lg p-1 text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {camError && step === 'camera' && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 mb-4">
              {camError}
            </div>
          )}

          {/* Camera / Preview */}
          <div className="relative overflow-hidden rounded-xl bg-gray-900" style={{ aspectRatio: '4/3' }}>
            {step === 'camera' ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
              />
            ) : (
              previewUrl && (
                <img src={previewUrl} alt="preview" className="h-full w-full object-cover" />
              )
            )}

            {/* Overlay guide */}
            {step === 'camera' && !camError && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-48 w-36 rounded-full border-2 border-white/50" />
              </div>
            )}
          </div>

          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error.message}
            </p>
          )}

          {/* Actions */}
          <div className="mt-4 flex gap-3">
            {step === 'camera' ? (
              <>
                <button
                  onClick={handleClose}
                  className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={capturePhoto}
                  disabled={!!camError}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-sky-500 py-2.5 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-50"
                >
                  <Camera size={16} />
                  Ambil Foto
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={retake}
                  disabled={isPending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  <RefreshCw size={15} />
                  Ulangi
                </button>
                <button
                  onClick={() => mutate()}
                  disabled={isPending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-sky-500 py-2.5 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-50"
                >
                  <Send size={15} />
                  {isPending ? 'Mengirim...' : 'Kirim'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
