import React, { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import { QRCodeSVG } from "qrcode.react";
import { X, Printer } from "lucide-react";

// Code-128 high-contrast vector barcode rendering component
export function BarcodeSVG({ value }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current) {
      try {
        JsBarcode(svgRef.current, value, {
          format: "CODE128",
          width: 1.2,
          height: 30,
          displayValue: true,
          fontSize: 8,
          fontOptions: "bold",
          font: "monospace",
          textAlign: "center",
          textPosition: "bottom",
          textMargin: 1,
          margin: 0,
          background: "transparent",
          lineColor: "#000000" // Barcode scanner print line is always black
        });
      } catch (err) {
        console.error("Barcode generation error", err);
      }
    }
  }, [value]);

  return <svg ref={svgRef} className="mx-auto block max-w-full h-auto"></svg>;
}

export default function BarcodePrintModal({ product, onClose }) {
  const [labelSize, setLabelSize] = useState("50x30"); // 50x30, 2x1

  // Handle printer document setup classes
  useEffect(() => {
    document.body.classList.add("print-label-mode");
    return () => {
      document.body.classList.remove("print-label-mode");
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden glass-panel transition-colors duration-200 rounded-xl shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Print Sticker Label</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Preview Area */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Sticker Size Options</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setLabelSize("50x30")}
                className={`py-2 px-3 text-xs font-bold border rounded-lg transition cursor-pointer text-center ${
                  labelSize === "50x30" 
                    ? "bg-sky-50 dark:bg-sky-950/20 border-sky-500 text-sky-600" 
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                50mm x 30mm (Thermal)
              </button>
              <button 
                onClick={() => setLabelSize("2x1")}
                className={`py-2 px-3 text-xs font-bold border rounded-lg transition cursor-pointer text-center ${
                  labelSize === "2x1" 
                    ? "bg-sky-50 dark:bg-sky-950/20 border-sky-500 text-sky-600" 
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                2" x 1" Standard Sticker
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Live Print Preview</span>
            
            {/* Visual Screen Preview Container */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl p-6 flex justify-center items-center">
              <div 
                className="bg-white text-black border border-black p-3 flex flex-col justify-between select-none shadow-sm rounded"
                style={{ 
                  width: labelSize === "50x30" ? "200px" : "210px", 
                  height: labelSize === "50x30" ? "120px" : "105px", 
                  fontFamily: "monospace",
                  lineHeight: "1.1"
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-black pb-0.5 mb-1 text-[8px] font-black">
                  <span>LONETEX - COME CLEAN</span>
                  <span>LOC: {product.shelfId || "—"}</span>
                </div>
                
                {/* Body Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="text-[8px] leading-tight font-extrabold uppercase truncate">
                    {product.name}
                  </div>
                  <div className="flex justify-between items-center text-[7.5px] text-black/80 font-bold">
                    <span>SKU: {product.sku}</span>
                    <span>CAT: {product.category.replace("Kentucky / ", "").replace("Cloths & ", "")}</span>
                  </div>

                  {/* Barcode and QR code side-by-side */}
                  <div className="flex items-center justify-between gap-1.5 py-0.5">
                    <div className="flex-1 overflow-hidden">
                      <BarcodeSVG value={product.sku} />
                    </div>
                    <div className="shrink-0">
                      <QRCodeSVG value={product.sku} size={26} bgColor="#FFFFFF" fgColor="#000000" level="M" />
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="flex justify-between items-center border-t border-black pt-0.5 text-[8.5px] font-black">
                    <span>PRICE: ${product.wholesalePrice.toFixed(2)}</span>
                    <span>UOM: {product.uom}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0284C7] hover:bg-[#0270a8] text-white text-xs font-semibold rounded-lg shadow cursor-pointer"
          >
            <Printer size={14} />
            Print Label
          </button>
        </div>
      </div>

      {/* Hidden container styled specifically for the printer (used by index.css print query) */}
      <div id="printable-label" className="hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black pb-0.5 mb-1" style={{ fontSize: "8px", fontWeight: "bold", width: "100%" }}>
          <span>LONETEX - COME CLEAN</span>
          <span>LOC: {product.shelfId || "—"}</span>
        </div>
        
        {/* Body Content */}
        <div className="flex-1 flex flex-col justify-between" style={{ width: "100%" }}>
          <div className="text-[8px] leading-tight font-extrabold uppercase truncate" style={{ maxHeight: "20px" }}>
            {product.name}
          </div>
          <div className="flex justify-between items-center text-[7.5px] text-black font-bold">
            <span>SKU: {product.sku}</span>
            <span>CAT: {product.category.replace("Kentucky / ", "").replace("Cloths & ", "")}</span>
          </div>

          {/* Barcode and QR code side-by-side */}
          <div className="flex items-center justify-between gap-1.5 py-0.5" style={{ width: "100%" }}>
            <div className="flex-1 overflow-hidden" style={{ maxWidth: "80%" }}>
              <BarcodeSVG value={product.sku} />
            </div>
            <div className="shrink-0" style={{ maxWidth: "20%" }}>
              <QRCodeSVG value={product.sku} size={26} bgColor="#FFFFFF" fgColor="#000000" level="M" />
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex justify-between items-center border-t border-black pt-0.5 text-[8.5px] font-black" style={{ width: "100%" }}>
            <span>PRICE: ${product.wholesalePrice.toFixed(2)}</span>
            <span>UOM: {product.uom}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
