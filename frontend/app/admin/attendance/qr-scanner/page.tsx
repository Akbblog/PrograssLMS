"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AdminPageLayout from "@/components/layouts/AdminPageLayout";
import { Button } from "@/components/ui/button";
import api from "@/lib/api/endpoints";

type ScanResult = {
  status?: string;
  message?: string;
  data?: any;
};

export default function AttendanceQrScannerPage() {
  const [cameraPermission, setCameraPermission] = useState<"unknown" | "granted" | "denied">("unknown");
  const [isStarting, setIsStarting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const html5QrcodeRef = useRef<any>(null);
  const scannerContainerId = useMemo(() => "qr-reader", []);

  useEffect(() => {
    return () => {
      const stop = async () => {
        try {
          if (html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
            await html5QrcodeRef.current.stop();
          }
        } catch {
          // ignore
        }
        try {
          html5QrcodeRef.current?.clear?.();
        } catch {
          // ignore
        }
        html5QrcodeRef.current = null;
      };

      stop();
    };
  }, []);

  const sendScan = async (qrData: string) => {
    try {
      const data = (await api.post("/attendance/qr/scan", { qrData })) as any;
      setLastScan(data);
      setError(null);
    } catch (e: any) {
      const data = e?.response?.data as ScanResult | undefined;
      setLastScan(data || { status: "fail", message: e?.message, data: null });
      setError(data?.message || e?.message || "Failed to record attendance.");
    }
  };

  const startScanner = async () => {
    setError(null);
    setIsStarting(true);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");

      const scanner = new Html5Qrcode(scannerContainerId);
      html5QrcodeRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText: string) => {
          try {
            await sendScan(decodedText);
          } catch (e: any) {
            setError(e?.message || "Failed to submit scan.");
          }
        },
        () => {
          // ignore per-frame decode errors
        }
      );

      setCameraPermission("granted");
      setIsRunning(true);
    } catch (e: any) {
      const msg = e?.message || "Unable to start camera.";
      setError(msg);

      // Heuristic: most start() failures here are permission/camera issues.
      setCameraPermission("denied");
      setIsRunning(false);
    } finally {
      setIsStarting(false);
    }
  };

  const stopScanner = async () => {
    setError(null);

    try {
      if (html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
        await html5QrcodeRef.current.stop();
      }
      try {
        html5QrcodeRef.current?.clear?.();
      } catch {
        // ignore
      }
      html5QrcodeRef.current = null;
      setIsRunning(false);
    } catch (e: any) {
      setError(e?.message || "Failed to stop scanner.");
    }
  };

  return (
    <AdminPageLayout title="QR Attendance Scanner" description="Scan student QR codes to record attendance">
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Camera Scanner</h2>
          <p className="text-sm text-slate-500">Allow camera access to scan QR codes.</p>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div id={scannerContainerId} className="w-full" />

          <div className="mt-4 flex flex-wrap gap-2">
            {!isRunning ? (
              <Button onClick={startScanner} disabled={isStarting}>
                {isStarting ? "Starting..." : "Start Scanner"}
              </Button>
            ) : (
              <Button variant="outline" onClick={stopScanner}>
                Stop Scanner
              </Button>
            )}

            {cameraPermission === "denied" && (
              <span className="text-sm text-destructive">Camera permission denied.</span>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {lastScan && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Last Scan Result</h3>
            <pre className="bg-slate-50 p-4 rounded overflow-auto text-xs">{JSON.stringify(lastScan, null, 2)}</pre>
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
}
