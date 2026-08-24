import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Warehouse, MapPin, ClipboardList, CheckCircle, Package, X } from "lucide-react";
import { useProducts } from "../ProductContext";

export default function WarehouseRacks({ warehouses }) {
  const { products } = useProducts();
  const [selectedWh, setSelectedWh] = useState("LHR-FAC");
  const [previewImage, setPreviewImage] = useState(null);

  // Scroll lock effect when modal opens
  useEffect(() => {
    if (previewImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [previewImage]);

  // Esc key closes preview modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setPreviewImage(null);
      }
    };
    if (previewImage) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [previewImage]);

  // Calculate stats for current warehouse
  const totalSkuCount = products.filter(p => (p.stock[selectedWh] || 0) > 0).length;
  const totalStockQty = products.reduce((sum, p) => sum + (p.stock[selectedWh] || 0), 0);
  const totalStockValue = products.reduce((sum, p) => sum + ((p.stock[selectedWh] || 0) * p.wholesalePrice), 0);

  // Products filtered by current warehouse
  const whProducts = products.filter(p => (p.stock[selectedWh] || 0) > 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight transition-colors">Warehouse & Rack Management</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Monitor multi-location inventory bins, safety thresholds, and localized wholesale valuations.</p>
      </div>

      {/* Warehouse Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {warehouses.map((wh) => {
          const isActive = selectedWh === wh.code;
          
          // Calculate stock for card
          const qty = products.reduce((sum, p) => sum + (p.stock[wh.code] || 0), 0);
          const skus = products.filter(p => (p.stock[wh.code] || 0) > 0).length;

          return (
            <button
              key={wh.id}
              onClick={() => setSelectedWh(wh.code)}
              className={`p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between h-[155px] ${
                isActive 
                  ? "bg-white/90 dark:bg-[#111827]/90 border-cyan-500/50 shadow-lg shadow-cyan-500/10 ring-2 ring-cyan-500/15" 
                  : "bg-white/70 dark:bg-[#111827]/80 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm"
              }`}
            >
              <div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  isActive ? "bg-cyan-500/10 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400 border-cyan-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent"
                }`}>
                  Code: {wh.code}
                </span>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-2 block">{wh.name}</h3>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1 mt-1">
                  <MapPin size={12} /> {wh.address}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800/80 pt-3 mt-3 w-full">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{skus} Active SKUs</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{qty.toLocaleString()} Units</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Location Summary Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 bg-white/70 dark:bg-[#111827]/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-lg transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-400 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(6,182,212,0.3)]">
            <Warehouse size={20} />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Active Stock In Warehouse</span>
            <span className="text-base font-black text-slate-700 dark:text-slate-200 dark:drop-shadow-[0_0_8px_rgba(34,211,238,0.25)]">{totalStockQty.toLocaleString()} Pcs</span>
          </div>
        </div>
        <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800/80 pt-3 sm:pt-0 sm:pl-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(16,185,129,0.3)]">
            <ClipboardList size={20} />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Total SKUs Stored</span>
            <span className="text-base font-black text-slate-700 dark:text-slate-200 dark:drop-shadow-[0_0_8px_rgba(52,211,153,0.25)]">{totalSkuCount} SKUs</span>
          </div>
        </div>
        <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800/80 pt-3 sm:pt-0 sm:pl-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-400 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(79,70,229,0.3)]">
            <CheckCircle size={20} />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Wholesale Valuation</span>
            <span className="text-base font-black text-slate-700 dark:text-slate-200 dark:drop-shadow-[0_0_8px_rgba(129,140,248,0.25)]">${totalStockValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Stored Products Table */}
      <div className="bg-white dark:bg-[#111827]/90 border border-slate-200 dark:border-slate-800/80 shadow-sm rounded-2xl overflow-hidden transition-colors">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 text-left">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Stored Product Allocations & Shelf References</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-slate-100/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider">
              <tr className="select-none">
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4 text-center">Shelf / Bin ID</th>
                <th className="py-3 px-4 text-right">Units Stored</th>
                <th className="py-3 px-4 text-right">Unit Wholesale</th>
                <th className="py-3 px-4 text-right">Total Value</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-600 dark:text-slate-300 font-medium animate-slide-up">
              {whProducts.map((p) => {
                const qty = p.stock[selectedWh] || 0;
                const value = qty * p.wholesalePrice;
                const isLow = qty <= p.minThreshold;

                return (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage({
                            url: p.image || "/media/products/dust_mop.jpg",
                            name: p.name,
                            sku: p.sku,
                            shelfId: p.shelfId
                          });
                        }}
                        title="Click to zoom image"
                        className="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-800/60 p-1 border border-slate-200 dark:border-slate-700/50 flex items-center justify-center cursor-zoom-in hover:scale-105 transition-transform"
                      >
                        <img 
                          src={p.image || "/media/products/dust_mop.jpg"} 
                          alt={p.name} 
                          className="w-full h-full object-contain pointer-events-none"
                          onError={(e) => {
                            e.target.src = "/media/products/dust_mop.jpg";
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0284C7] font-mono">{p.sku}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">{p.name}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-500 dark:text-slate-400">{p.shelfId || "—"}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-slate-100">{qty.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-slate-550 dark:text-slate-400">${p.wholesalePrice.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-slate-100">${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isLow ? "bg-amber-500/10 text-amber-555 dark:text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      }`}>
                        <span className={`relative flex h-1.5 w-1.5 rounded-full ${isLow ? "bg-amber-500" : "bg-emerald-500"}`}>
                          {!isLow && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          )}
                        </span>
                        {isLow ? "Low Stock" : "Healthy"}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {whProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <Package size={24} className="mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                    No products stored at this location.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Image Zoom Modal */}
      {previewImage && createPortal(
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed top-0 left-0 w-screen h-screen z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm m-0 p-4 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-slate-900 border border-slate-700/80 rounded-2xl p-4 max-w-sm sm:max-w-md w-full shadow-2xl flex flex-col items-center justify-between animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Close Button */}
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
            >
              <X size={18} />
            </button>
            
            {/* Centered Image */}
            <div className="w-full mt-4 flex items-center justify-center bg-slate-955 rounded-xl p-2 border border-slate-800">
              <img 
                src={previewImage.url} 
                alt={previewImage.name} 
                className="max-h-[45vh] w-auto object-contain rounded-lg cursor-zoom-out"
                onClick={() => setPreviewImage(null)}
              />
            </div>

            {/* Bottom info badge */}
            <div className="mt-4 w-full flex flex-col gap-1 p-3 bg-slate-950/80 rounded-xl border border-slate-850">
              <h4 className="font-bold text-sm text-slate-200">{previewImage.name}</h4>
              <div className="flex gap-4 text-xs font-semibold text-slate-400 mt-1">
                <span>SKU: <strong className="text-[#0284C7]">{previewImage.sku}</strong></span>
                <span>Shelf ID: <strong className="font-mono text-slate-300">{previewImage.shelfId || "—"}</strong></span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
