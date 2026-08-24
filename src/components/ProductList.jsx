import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Plus, Edit2, Trash2, Search, FileDown, Eye, AlertCircle, X, Printer } from "lucide-react";

export default function ProductList({ 
  products, 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct, 
  onPrintLabel,
  userRole 
}) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [whFilter, setWhFilter] = useState("all");
  const [sortCol, setSortCol] = useState("sku");
  const [sortDir, setSortDir] = useState("asc");
  
  // Shimmer skeleton loading effect
  const [isLoading, setIsLoading] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);

  // Scroll lock effect when modal opens
  useEffect(() => {
    if (previewImg) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [previewImg]);

  // Esc key closes the preview modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setPreviewImg(null);
      }
    };
    if (previewImg) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewImg]);

  // Trigger loading effect on filter changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [catFilter, whFilter, search]);

  // Determine if active user can modify product list
  const canModify = userRole === "admin";

  // Filter & Search Logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.subcategory.toLowerCase().includes(search.toLowerCase()) ||
      (p.shelfId && p.shelfId.toLowerCase().includes(search.toLowerCase())) ||
      (p.barcode && p.barcode.includes(search));

    const matchesCategory = catFilter === "all" || p.category === catFilter;
    
    let matchesWarehouse = true;
    if (whFilter !== "all") {
      matchesWarehouse = (p.stock[whFilter] || 0) > 0;
    }

    return matchesSearch && matchesCategory && matchesWarehouse;
  });

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const getVal = (obj, col) => {
      if (col === "totalQty") {
        return Object.values(obj.stock).reduce((x, y) => x + y, 0);
      }
      return obj[col];
    };

    let valA = getVal(a, sortCol);
    let valB = getVal(b, sortCol);

    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  // CSV Export Logic
  const exportToCSV = () => {
    const headers = ["SKU", "Barcode", "Product Name", "Category", "Subcategory", "UOM", "Cost Price", "Wholesale Price", "LHR Factory Qty", "LHR HQ Qty", "KSA Hub Qty", "Total Stock", "Shelf ID"];
    const rows = products.map(p => {
      const totalQty = Object.values(p.stock).reduce((a, b) => a + b, 0);
      return [
        p.sku,
        p.barcode,
        p.name,
        p.category,
        p.subcategory,
        p.uom,
        p.costPrice,
        p.wholesalePrice,
        p.stock["LHR-FAC"] || 0,
        p.stock["LHR-HQ"] || 0,
        p.stock["KSA-HUB"] || 0,
        totalQty,
        p.shelfId
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lonetex_inventory_catalog_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Shimmer Row Loader Template
  const renderSkeletons = () => {
    return Array(5).fill(0).map((_, i) => (
      <tr key={i} className="border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-[#0F172A]">
        {/* 1. Image */}
        <td className="py-4 px-4">
          <div className="w-10 h-10 rounded bg-slate-200 dark:bg-slate-850 shimmer-bg animate-pulse"></div>
        </td>
        {/* 2. SKU */}
        <td className="py-4 px-4">
          <div className="h-4 w-16 bg-slate-200 dark:bg-slate-850 rounded shimmer-bg animate-pulse"></div>
        </td>
        {/* 3. Item Description */}
        <td className="py-4 px-4">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-855 rounded shimmer-bg animate-pulse mb-1"></div>
          <div className="h-3 w-20 bg-slate-150 dark:bg-slate-800 rounded shimmer-bg animate-pulse"></div>
        </td>
        {/* 4. Subcategory */}
        <td className="py-4 px-4">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-855 rounded shimmer-bg animate-pulse"></div>
        </td>
        {/* 5. Wholesale Price */}
        <td className="py-4 px-4 text-right">
          <div className="h-4 w-12 ml-auto bg-slate-200 dark:bg-slate-855 rounded shimmer-bg animate-pulse"></div>
        </td>
        {/* 6. UOM */}
        <td className="py-4 px-4 text-center">
          <div className="h-4 w-8 mx-auto bg-slate-200 dark:bg-slate-855 rounded shimmer-bg animate-pulse"></div>
        </td>
        {/* 7. Shelf ID */}
        <td className="py-4 px-4 text-center">
          <div className="h-4 w-12 mx-auto bg-slate-200 dark:bg-slate-855 rounded shimmer-bg animate-pulse"></div>
        </td>
        {/* 8. Total Stock */}
        <td className="py-4 px-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-10 bg-slate-200 dark:bg-slate-850 rounded shimmer-bg animate-pulse"></div>
            <div className="h-4 w-16 bg-slate-200 dark:bg-slate-850 rounded-full shimmer-bg animate-pulse"></div>
          </div>
        </td>
        {/* 9. LHR Factory */}
        <td className="py-4 px-4 text-right">
          <div className="h-4 w-8 ml-auto bg-slate-200 dark:bg-slate-855 rounded shimmer-bg animate-pulse"></div>
        </td>
        {/* 10. Gulberg HQ */}
        <td className="py-4 px-4 text-right">
          <div className="h-4 w-8 ml-auto bg-slate-200 dark:bg-slate-855 rounded shimmer-bg animate-pulse"></div>
        </td>
        {/* 11. KSA Hub */}
        <td className="py-4 px-4 text-right">
          <div className="h-4 w-8 ml-auto bg-slate-200 dark:bg-slate-855 rounded shimmer-bg animate-pulse"></div>
        </td>
        {/* 12. Actions */}
        <td className="py-4 px-4 text-center">
          <div className="h-4 w-12 mx-auto bg-slate-200 dark:bg-slate-855 rounded shimmer-bg animate-pulse"></div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Products & Inventory Catalog</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage Lonetex catalog items, wholesale pricing structure, and shelf references.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/80 hover:border-cyan-500/30 hover:text-cyan-400 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          >
            <FileDown size={16} />
            Export CSV
          </button>
          
          {canModify && (
            <button
              onClick={onAddProduct}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-tr from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-400 text-white text-sm font-semibold rounded-lg shadow-[0_4px_12px_rgba(6,182,212,0.3)] hover:shadow-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            >
              <Plus size={16} />
              Add Product
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-white/70 dark:bg-[#111827]/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row md:items-center gap-4 justify-between transition-colors">
        <div className="flex items-center gap-2 w-full md:w-1/3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product description, SKU, shelves..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#111827]/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Kentucky / Wet Mops">Kentucky / Wet Mops</option>
            <option value="Flat & Dust Mops">Flat & Dust Mops</option>
            <option value="Practical Cleaning">Practical Cleaning</option>
            <option value="Handles & Frames">Handles & Frames</option>
            <option value="Cloths & Dusters">Cloths & Dusters</option>
          </select>

          {/* Location Filter */}
          <select
            value={whFilter}
            onChange={(e) => setWhFilter(e.target.value)}
            className="border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#111827]/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Locations (Active Stock)</option>
            <option value="LHR-FAC">Lahore Factory</option>
            <option value="LHR-HQ">Lahore Head Office</option>
            <option value="KSA-HUB">KSA / Dammam Hub</option>
          </select>
        </div>
      </div>

      {/* Products High-Density Table */}
      <div className="bg-white dark:bg-[#111827]/90 border border-slate-200 dark:border-slate-800/80 shadow-sm rounded-2xl overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-slate-100/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider">
              <tr className="select-none">
                <th className="py-3 px-4 whitespace-nowrap">Image</th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800/40 transition-colors whitespace-nowrap"
                  onClick={() => handleSort("sku")}
                >
                  SKU / Code {sortCol === "sku" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800/40 transition-colors whitespace-nowrap"
                  onClick={() => handleSort("name")}
                >
                  Item Description {sortCol === "name" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="py-3 px-4 whitespace-nowrap">Subcategory</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Wholesale Price</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">UOM</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Shelf ID</th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800/40 transition-colors whitespace-nowrap"
                  onClick={() => handleSort("totalQty")}
                >
                  Total Stock {sortCol === "totalQty" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="py-3 px-4 text-right whitespace-nowrap">LHR Factory</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Gulberg HQ</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">KSA Hub</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-650 dark:text-slate-300 font-medium">
              {isLoading ? (
                renderSkeletons()
              ) : (
                sortedProducts.map((p) => {
                  const totalStockQty = Object.values(p.stock).reduce((a, b) => a + b, 0);
                  
                  let statusLabel = "";

                  if (totalStockQty < 20) {
                    statusLabel = totalStockQty === 0 ? "Out of Stock" : "Critical";
                  } else if (totalStockQty < 50) {
                    statusLabel = "Low Stock";
                  } else {
                    statusLabel = "In Stock";
                  }

                  return (
                    <tr 
                      key={p.id} 
                      onClick={() => onEditProduct(p)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/50 transition-colors cursor-pointer"
                    >
                      {/* Thumbnail Image */}
                      <td className="py-3 px-4">
                        <img 
                          src={p.image || "/media/products/dust_mop.jpg"} 
                          alt={p.name} 
                          className="w-12 h-12 rounded-lg object-contain bg-slate-800/80 p-1 border border-slate-700/50 cursor-pointer hover:scale-105 transition-transform" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImg(p.image || "/media/products/dust_mop.jpg");
                          }}
                          onError={(e) => {
                            e.target.src = "/media/products/dust_mop.jpg";
                          }}
                        />
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-4 font-bold text-[#0284C7] whitespace-nowrap">{p.sku}</td>

                      {/* Product Name */}
                      <td className="py-3 px-4 min-w-[220px]" title={p.name}>
                        <span className="font-bold text-slate-900 dark:text-slate-100 block text-xs whitespace-normal">{p.name}</span>
                        <span className="text-[10px] text-slate-505 dark:text-slate-400 block mt-0.5 whitespace-nowrap">Barcode: {p.barcode}</span>
                      </td>

                      {/* Category Details */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-slate-700 dark:text-slate-300 block">{p.subcategory}</span>
                        <span className="text-[10px] text-slate-505 dark:text-slate-400 block mt-0.5">{p.category}</span>
                      </td>

                      {/* Wholesale Selling Price */}
                      <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">${p.wholesalePrice.toFixed(2)}</td>

                      {/* Unit of Measurement */}
                      <td className="py-3 px-4 text-center text-slate-500 dark:text-slate-400 whitespace-nowrap">{p.uom}</td>

                      {/* Shelf Location */}
                      <td className="py-3 px-4 text-center font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">{p.shelfId || "—"}</td>

                      {/* Total Stock */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-extrabold text-xs">
                            {totalStockQty.toLocaleString()}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            totalStockQty < 20 
                              ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                              : totalStockQty < 50
                                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          }`}>
                            <span className={`relative flex h-1.5 w-1.5 rounded-full ${
                              totalStockQty < 20 
                                ? "bg-rose-500"
                                : totalStockQty < 50
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                            }`}>
                              {totalStockQty >= 50 && (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              )}
                            </span>
                            {statusLabel}
                          </span>
                        </div>
                      </td>

                      {/* Warehouse Breakdowns */}
                      <td className="py-3 px-4 text-right font-semibold whitespace-nowrap">{p.stock["LHR-FAC"]?.toLocaleString() || 0}</td>
                      <td className="py-3 px-4 text-right font-semibold whitespace-nowrap">{p.stock["LHR-HQ"]?.toLocaleString() || 0}</td>
                      <td className="py-3 px-4 text-right font-semibold whitespace-nowrap">{p.stock["KSA-HUB"]?.toLocaleString() || 0}</td>

                      {/* Actions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {canModify ? (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditProduct(p);
                                }}
                                title="Edit product info"
                                className="p-1 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800 rounded transition-colors duration-200 cursor-pointer"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPrintLabel(p);
                                }}
                                title="Print Barcode Label"
                                className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded transition-colors duration-200 cursor-pointer"
                              >
                                <Printer size={14} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteProduct(p.id);
                                }}
                                title="Delete product catalog SKU"
                                className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 rounded transition-colors duration-200 cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditProduct(p);
                                }}
                                title="View barcode details"
                                className="p-1 text-slate-400 hover:text-[#0D9488] hover:bg-teal-50 dark:hover:bg-slate-800 rounded transition-colors duration-200 cursor-pointer"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPrintLabel(p);
                                }}
                                title="Print Barcode Label"
                                className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded transition-colors duration-200 cursor-pointer"
                              >
                                <Printer size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}

              {!isLoading && sortedProducts.length === 0 && (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <AlertCircle size={24} className="mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                    No products found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Preview Lightbox Overlay Modal */}
      {previewImg && createPortal(
        <div 
          onClick={() => setPreviewImg(null)}
          className="fixed top-0 left-0 w-screen h-screen z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm m-0 p-4 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-slate-900 border border-slate-700/80 rounded-2xl p-4 max-w-sm sm:max-w-md w-full shadow-2xl flex flex-col items-center justify-between animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Close X Button */}
            <button 
              onClick={() => setPreviewImg(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
            >
              <X size={18} />
            </button>
            
            {/* Centered Product Image */}
            <div className="w-full mt-4 flex items-center justify-center bg-slate-955 rounded-xl p-2 border border-slate-800">
              <img 
                src={previewImg} 
                alt="Product Preview Large" 
                className="max-h-[45vh] w-auto object-contain rounded-lg cursor-zoom-out"
                onClick={() => setPreviewImg(null)}
                onError={(e) => {
                  e.target.src = "/media/products/dust_mop.jpg";
                }}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
