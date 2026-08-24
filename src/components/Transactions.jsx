import React, { useState, useEffect } from "react";
import { Plus, Search, HelpCircle, ArrowUpRight, ArrowDownLeft, QrCode } from "lucide-react";
import BarcodeScannerModal from "./BarcodeScannerModal";

export default function Transactions({ 
  products, 
  transactions, 
  onAddTransaction, 
  userRole,
  initialPreFilledTx = null,
  onClearPreFilledTx = null
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [whFilter, setWhFilter] = useState("all");

  const [showAddForm, setShowAddForm] = useState(false);
  const [showLocalScanner, setShowLocalScanner] = useState(false);

  // Form Fields State
  const [sku, setSku] = useState("");
  const [type, setType] = useState("Stock In");
  const [warehouseCode, setWarehouseCode] = useState("LHR-FAC");
  const [qty, setQty] = useState(1);
  const [remarks, setRemarks] = useState("");

  // Role Access Rules:
  // Admin -> can do everything
  // Manager -> Stock In / Stock Out only
  // Sales -> View only (cannot create manual transactions)
  const canCreate = userRole === "admin" || userRole === "manager";
  const allowedTypes = userRole === "manager" ? ["Stock In", "Stock Out"] : ["Stock In", "Stock Out", "Stock Adjustment"];

  useEffect(() => {
    if (initialPreFilledTx) {
      setSku(initialPreFilledTx.sku || "");
      setWarehouseCode(initialPreFilledTx.warehouseCode || "LHR-FAC");
      setType("Stock In");
      setQty(1);
      setRemarks("Factory Restock Intake");
      setShowAddForm(true);
      if (onClearPreFilledTx) {
        onClearPreFilledTx();
      }
    }
  }, [initialPreFilledTx, onClearPreFilledTx]);

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canCreate) return;

    const targetProduct = products.find(p => p.sku === sku);
    if (!targetProduct) return;

    let transactionQty = parseInt(qty) || 0;
    
    // Adjust quantity sign based on transaction type
    if (type === "Stock Out") {
      transactionQty = -Math.abs(transactionQty);
    } else if (type === "Stock Adjustment") {
      // Allow positive/negative sign as entered for adjustments
    } else {
      transactionQty = Math.abs(transactionQty);
    }

    const newTx = {
      id: `tx-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type,
      sku,
      productName: targetProduct.name,
      warehouseCode,
      qty: transactionQty,
      remarks: remarks.trim()
    };

    onAddTransaction(newTx);
    
    // Reset Form
    setSku("");
    setQty(1);
    setRemarks("");
    setShowAddForm(false);
  };

  // Filter Logic
  const filteredTxs = transactions.filter(tx => {
    const matchesSearch = 
      tx.productName.toLowerCase().includes(search.toLowerCase()) ||
      tx.sku.toLowerCase().includes(search.toLowerCase()) ||
      tx.remarks.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    const matchesWarehouse = whFilter === "all" || tx.warehouseCode === whFilter;

    return matchesSearch && matchesType && matchesWarehouse;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight transition-colors">Stock Movement & Ledger</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track and execute raw factory inputs, customer dispatches, and warehouse inventory adjustment logs.</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0284C7] hover:bg-[#0270a8] text-white text-sm font-semibold rounded-lg shadow-md shadow-sky-500/10 hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <Plus size={16} />
            {showAddForm ? "Cancel Entry" : "Log Stock Movement"}
          </button>
        )}
      </div>

      {/* Manual Stock Entry Modal Form */}
      {showAddForm && canCreate && (
        <div className="bg-white/80 dark:bg-[#111827]/90 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-2xl max-w-xl transition-colors">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Stock Ledger Input</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Product SKU Selection */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Select SKU *</label>
                <div className="flex items-center gap-2">
                  <select
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="flex-1 min-w-0 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-[#111827]/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 cursor-pointer dark:[&>option]:bg-[#0B0F17]"
                  >
                    <option value="">-- Choose Product --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.sku}>
                        {p.sku} - {p.name.slice(0, 36)}...
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowLocalScanner(true)}
                    title="Scan SKU Barcode"
                    className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-[#111827]/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer transition-colors"
                  >
                    <QrCode size={14} />
                  </button>
                </div>
              </div>

              {/* Transaction Type */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Movement Type *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-[#111827]/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 cursor-pointer dark:[&>option]:bg-[#0B0F17]"
                >
                  {allowedTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Location Select */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Target Location *</label>
                <select
                  value={warehouseCode}
                  onChange={(e) => setWarehouseCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-[#111827]/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 cursor-pointer dark:[&>option]:bg-[#0B0F17]"
                >
                  <option value="LHR-FAC">Lahore Factory (Main Canal Road)</option>
                  <option value="LHR-HQ">Lahore Head Office (Gulberg)</option>
                  <option value="KSA-HUB">International Hub (KSA / Dammam)</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Quantity (Units) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-[#111827]/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Remarks / Reference Info *</label>
              <input
                type="text"
                required
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Factory output batch Canal Road, or Damaged goods count"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-[#111827]/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              />
            </div>

            {/* Save Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0284C7] hover:bg-[#0270a8] text-white text-xs font-semibold rounded-lg shadow cursor-pointer"
              >
                Log Transaction
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ledger Table Section */}
      <div className="space-y-4 animate-slide-up">
        {/* Filter Controls Toolbar */}
        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-4 justify-between transition-colors">
          <div className="flex items-center gap-2 w-full md:w-1/3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ledger by SKU description, remarks..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-slate-50 dark:bg-[#111827]/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#111827]/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 cursor-pointer"
            >
              <option value="all">All Movements</option>
              <option value="Stock In">Stock In (Factory / Purchases)</option>
              <option value="Stock Out">Stock Out (Dispatches)</option>
              <option value="Stock Adjustment">Stock Adjustments (Audits)</option>
            </select>

            {/* Warehouse Filter */}
            <select
              value={whFilter}
              onChange={(e) => setWhFilter(e.target.value)}
              className="border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#111827]/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 cursor-pointer"
            >
              <option value="all">All Warehouses</option>
              <option value="LHR-FAC">Lahore Factory</option>
              <option value="LHR-HQ">Lahore Head Office</option>
              <option value="KSA-HUB">International Hub (KSA)</option>
            </select>
          </div>
        </div>

      {/* Ledger Table */}
      <div className="bg-white dark:bg-[#111827]/90 border border-slate-200 dark:border-slate-800/80 shadow-sm rounded-2xl overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-slate-100/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider">
              <tr className="select-none">
                <th className="py-3 px-4">Transaction Date</th>
                <th className="py-3 px-4">Movement Type</th>
                <th className="py-3 px-4">SKU / Item Description</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-right">Quantity Change</th>
                <th className="py-3 px-4">Reference Remarks / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/85 text-slate-600 dark:text-slate-300 font-medium">
              {filteredTxs.map((tx) => {
                const isStockIn = tx.type === "Stock In";
                const isStockOut = tx.type === "Stock Out";
                return (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/50 transition-colors">
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isStockIn 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                          : isStockOut 
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-455 border border-rose-500/20" 
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-455 border border-amber-500/20"
                      }`}>
                        {isStockIn ? (
                          <ArrowDownLeft size={10} />
                        ) : isStockOut ? (
                          <ArrowUpRight size={10} />
                        ) : (
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                          </svg>
                        )}
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{tx.productName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{tx.sku}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-500 dark:text-slate-400">{tx.warehouseCode}</td>
                    <td className={`py-3 px-4 text-right font-bold ${isStockIn ? "text-emerald-500" : isStockOut ? "text-rose-500" : "text-amber-500"}`}>
                      {tx.qty > 0 ? `+${tx.qty}` : tx.qty}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 italic max-w-[260px] truncate" title={tx.remarks}>
                      {tx.remarks}
                    </td>
                  </tr>
                );
              })}

                {filteredTxs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-slate-500">
                      <HelpCircle size={24} className="mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                      No ledger transactions found matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Local Barcode Scanner Modal overlay */}
      {showLocalScanner && (
        <BarcodeScannerModal 
          onClose={() => setShowLocalScanner(false)} 
          onScanSuccess={(code) => {
            const codeClean = code.trim().toUpperCase();
            const matched = products.find(p => p.sku === codeClean || p.barcode === codeClean);
            if (matched) {
              setSku(matched.sku);
              setShowLocalScanner(false);
            } else {
              alert(`SKU or Barcode "${code}" not found in catalog.`);
            }
          }} 
        />
      )}
    </div>
  );
}
