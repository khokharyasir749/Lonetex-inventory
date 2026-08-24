import React, { useState, useEffect } from "react";
import { X, QrCode, Printer } from "lucide-react";

export default function ProductModal({ 
  product, 
  onClose, 
  onSave, 
  onPrintLabel,
  userRole 
}) {
  const isEdit = !!product?.id;
  const isReadOnly = userRole !== "admin";

  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Kentucky / Wet Mops");
  const [subcategory, setSubcategory] = useState("");
  const [uom, setUom] = useState("Pieces");
  const [costPrice, setCostPrice] = useState(0);
  const [wholesalePrice, setWholesalePrice] = useState(0);
  const [minThreshold, setMinThreshold] = useState(50);
  const [shelfId, setShelfId] = useState("");
  const [stockFac, setStockFac] = useState(0);
  const [stockHq, setStockHq] = useState(0);
  const [stockKsa, setStockKsa] = useState(0);

  // Sync state with product prop
  useEffect(() => {
    if (product) {
      setSku(product.sku || "");
      setBarcode(product.barcode || "");
      setName(product.name || "");
      setCategory(product.category || "Kentucky / Wet Mops");
      setSubcategory(product.subcategory || "");
      setUom(product.uom || "Pieces");
      setCostPrice(product.costPrice || 0);
      setWholesalePrice(product.wholesalePrice || 0);
      setMinThreshold(product.minThreshold || 50);
      setShelfId(product.shelfId || "");
      setStockFac(product.stock?.["LHR-FAC"] || 0);
      setStockHq(product.stock?.["LHR-HQ"] || 0);
      setStockKsa(product.stock?.["KSA-HUB"] || 0);
    } else {
      // Clear fields for new item
      setSku("");
      setBarcode("");
      setName("");
      setCategory("Kentucky / Wet Mops");
      setSubcategory("");
      setUom("Pieces");
      setCostPrice(0);
      setWholesalePrice(0);
      setMinThreshold(50);
      setShelfId("");
      setStockFac(0);
      setStockHq(0);
      setStockKsa(0);
    }
  }, [product]);

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isReadOnly) return;

    // Generate random barcode if empty
    const finalBarcode = barcode || Math.floor(100000000000 + Math.random() * 900000000000).toString();

    const savedProduct = {
      id: product?.id || `prod-${Date.now()}`,
      sku: sku.trim().toUpperCase(),
      barcode: finalBarcode,
      name: name.trim(),
      category,
      subcategory: subcategory.trim(),
      uom,
      costPrice: parseFloat(costPrice) || 0,
      wholesalePrice: parseFloat(wholesalePrice) || 0,
      minThreshold: parseInt(minThreshold) || 0,
      shelfId: shelfId.trim().toUpperCase(),
      stock: {
        "LHR-FAC": parseInt(stockFac) || 0,
        "LHR-HQ": parseInt(stockHq) || 0,
        "KSA-HUB": parseInt(stockKsa) || 0
      },
      image: product?.image || "/media/products/dust_mop.jpg"
    };

    onSave(savedProduct);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden my-8 rounded-xl shadow-2xl animate-scale-up glass-panel transition-colors duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
            {isReadOnly ? "View Product Details" : isEdit ? "Modify Product SKU" : "Register Catalog Product"}
          </h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* SKU */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">SKU / Catalog Code *</label>
              <input
                type="text"
                required
                disabled={isReadOnly || isEdit}
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. LTX-KY-COT-01"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 disabled:bg-slate-50 dark:disabled:bg-slate-850 disabled:text-slate-400 dark:disabled:text-slate-500"
              />
            </div>

            {/* Barcode */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Barcode / UPC ID</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Auto-generated if left blank"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 disabled:bg-slate-50 dark:disabled:bg-slate-850 disabled:text-slate-400 dark:disabled:text-slate-500"
              />
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Product Description (Full Name) *</label>
            <input
              type="text"
              required
              disabled={isReadOnly}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Premium Cotton Loop-End Kentucky Mop Head 350g"
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 disabled:bg-slate-50 dark:disabled:bg-slate-850 disabled:text-slate-400 dark:disabled:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Category *</label>
              <select
                disabled={isReadOnly}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 cursor-pointer disabled:bg-slate-50 dark:disabled:bg-slate-850 dark:[&>option]:bg-[#0F172A]"
              >
                <option value="Kentucky / Wet Mops">Kentucky / Wet Mops</option>
                <option value="Flat & Dust Mops">Flat & Dust Mops</option>
                <option value="Practical Cleaning">Practical Cleaning</option>
                <option value="Handles & Frames">Handles & Frames</option>
                <option value="Cloths & Dusters">Cloths & Dusters</option>
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Subcategory *</label>
              <input
                type="text"
                required
                disabled={isReadOnly}
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g. Cotton White Loop-End"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 disabled:bg-slate-50 dark:disabled:bg-slate-850 disabled:text-slate-400 dark:disabled:text-slate-500"
              />
            </div>

            {/* UOM */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Unit of Measurement (UOM) *</label>
              <select
                disabled={isReadOnly}
                value={uom}
                onChange={(e) => setUom(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 cursor-pointer disabled:bg-slate-50 dark:disabled:bg-slate-850 dark:[&>option]:bg-[#0F172A]"
              >
                <option value="Pieces">Pieces</option>
                <option value="Bundles">Bundles</option>
                <option value="Dozens">Dozens</option>
                <option value="Cartons">Cartons</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Cost Price */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Cost Price ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                disabled={isReadOnly}
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 disabled:bg-slate-50 dark:disabled:bg-slate-850 disabled:text-slate-400 dark:disabled:text-slate-500"
              />
            </div>

            {/* Wholesale Price */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Wholesale WSP ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                disabled={isReadOnly}
                value={wholesalePrice}
                onChange={(e) => setWholesalePrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 disabled:bg-slate-50 dark:disabled:bg-slate-850 disabled:text-slate-400 dark:disabled:text-slate-500"
              />
            </div>

            {/* Alert Threshold */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Min Alert Limit *</label>
              <input
                type="number"
                required
                disabled={isReadOnly}
                value={minThreshold}
                onChange={(e) => setMinThreshold(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 disabled:bg-slate-50 dark:disabled:bg-slate-850 disabled:text-slate-400 dark:disabled:text-slate-500"
              />
            </div>

            {/* Shelf ID */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Shelf / Bin ID *</label>
              <input
                type="text"
                required
                disabled={isReadOnly}
                value={shelfId}
                onChange={(e) => setShelfId(e.target.value)}
                placeholder="e.g. A-12-D"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 disabled:bg-slate-50 dark:disabled:bg-slate-850 disabled:text-slate-400 dark:disabled:text-slate-500"
              />
            </div>
          </div>

          {/* Multi-Location Stock Allocations */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-200 dark:border-slate-800/80 rounded-xl space-y-3 transition-colors">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-350">Stock Breakdown by Location</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* LHR Factory */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">LHR Factory (FAC)</label>
                <input
                  type="number"
                  disabled={isReadOnly}
                  value={stockFac}
                  onChange={(e) => setStockFac(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 disabled:bg-slate-100 dark:disabled:bg-slate-850"
                />
              </div>

              {/* LHR HO */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Gulberg HO (HQ)</label>
                <input
                  type="number"
                  disabled={isReadOnly}
                  value={stockHq}
                  onChange={(e) => setStockHq(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 disabled:bg-slate-100 dark:disabled:bg-slate-850"
                />
              </div>

              {/* KSA Hub */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Dammam Hub (KSA)</label>
                <input
                  type="number"
                  disabled={isReadOnly}
                  value={stockKsa}
                  onChange={(e) => setStockKsa(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 disabled:bg-slate-100 dark:disabled:bg-slate-850"
                />
              </div>
            </div>
          </div>

          {/* Barcode Visual Generation */}
          {barcode && (
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
              <div className="flex items-center gap-3">
                <QrCode size={36} className="text-slate-650 dark:text-slate-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Simulated Barcode ID</span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-mono mt-0.5">{barcode}</span>
                </div>
              </div>
              <div className="flex gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded shadow-sm select-none">
                {barcode.split("").map((num, i) => (
                  <span 
                    key={i} 
                    className="w-1.5 bg-slate-900 dark:bg-slate-200" 
                    style={{ 
                      height: "36px", 
                      opacity: parseInt(num) % 2 === 0 ? "0.9" : "0.2" 
                    }}
                  ></span>
                ))}
              </div>
            </div>
          )}

          {/* Actions Footer */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            {product && (
              <button
                type="button"
                onClick={() => onPrintLabel(product)}
                className="mr-auto flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 bg-emerald-50 hover:bg-emerald-105 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <Printer size={14} />
                Print Label
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            {!isReadOnly && (
              <button
                type="submit"
                className="px-4 py-2 bg-[#0284C7] hover:bg-[#0270a8] text-white text-xs font-semibold rounded-lg shadow transition-all cursor-pointer"
              >
                Save Details
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
