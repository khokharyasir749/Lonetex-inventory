import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X, Camera, Keyboard } from "lucide-react";

export default function BarcodeScannerModal({ onClose, onScanSuccess }) {
  const [scanType, setScanType] = useState("camera"); // camera or manual
  const [manualInput, setManualInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const scannerRef = useRef(null);
  const inputRef = useRef(null);

  // USB Keyboard Scanner Auto-Focus
  useEffect(() => {
    if (scanType === "manual" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [scanType]);

  // Camera QR/Barcode Scanning Setup
  useEffect(() => {
    if (scanType !== "camera") return;

    let html5QrCode;
    try {
      html5QrCode = new Html5Qrcode("reader-element");
    } catch (err) {
      console.error("Html5Qrcode initialization error", err);
      setErrorMessage("Failed to initialize camera scanner.");
      return;
    }

    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          (decodedText) => {
            // Stop scanning and trigger success callback
            html5QrCode.stop().then(() => {
              onScanSuccess(decodedText);
            }).catch(err => {
              console.error("Error stopping scanner on success", err);
              onScanSuccess(decodedText); // Proceed anyway
            });
          },
          (errorMessage) => {
            // Quietly ignore scan match failure messages
          }
        );
      } catch (err) {
        console.error("Failed to start camera scanner", err);
        setErrorMessage("Camera access is blocked or unavailable. Switch to manual/USB input.");
      }
    };

    // Small delay to ensure reader-element is in DOM
    const timer = setTimeout(() => {
      startScanner();
    }, 150);

    return () => {
      clearTimeout(timer);
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => console.error("Error stopping scanner on unmount", err));
      }
    };
  }, [scanType]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScanSuccess(manualInput.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden glass-panel transition-colors duration-200 rounded-xl shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Scan Barcode / QR Code</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-150 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20">
          <button
            onClick={() => setScanType("camera")}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 cursor-pointer transition ${
              scanType === "camera" 
                ? "border-sky-500 text-sky-600 dark:text-sky-400" 
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Camera size={14} /> Live Camera Scan
          </button>
          <button
            onClick={() => setScanType("manual")}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 cursor-pointer transition ${
              scanType === "manual" 
                ? "border-sky-500 text-sky-600 dark:text-sky-400" 
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Keyboard size={14} /> USB Scanner / Manual
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {scanType === "camera" ? (
            <div className="space-y-4">
              {errorMessage ? (
                <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-955/20 border border-rose-150 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 leading-relaxed text-center">
                  {errorMessage}
                </div>
              ) : (
                <div className="relative mx-auto w-full max-w-[280px] aspect-square rounded-xl overflow-hidden bg-slate-955 border border-slate-850 shadow-inner flex items-center justify-center">
                  {/* Camera Element */}
                  <div id="reader-element" className="w-full h-full object-cover"></div>
                  
                  {/* Visual Laser/Scope Line */}
                  <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-rose-500/80 shadow shadow-rose-500 animate-pulse pointer-events-none z-10"></div>
                </div>
              )}
              <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 font-medium">
                Align the Code-128 product barcode or QR code within the camera frame to scan.
              </p>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Scan SKU or input numeric barcode *
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  required
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="e.g. LTX-KY-COT-01 or WA-LTX-1294"
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-mono"
                />
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed space-y-1">
                <span className="font-bold text-slate-500 dark:text-slate-400 block">Hardware USB Scanner:</span>
                <p>Set focus on the field above and scan. The hardware scanner will automatically input the data and hit 'Enter' to submit.</p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-[#0284C7] hover:bg-[#0270a8] text-white text-xs font-semibold rounded-lg shadow cursor-pointer text-center"
                >
                  Lookup Product / Code
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
