import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import ProductList from "./components/ProductList";
import ProductModal from "./components/ProductModal";
import Transactions from "./components/Transactions";

import WarehouseRacks from "./components/WarehouseRacks";
import Settings from "./components/Settings";
import { defaultMockData } from "./mockData";
import BarcodePrintModal from "./components/BarcodePrintModal";
import BarcodeScannerModal from "./components/BarcodeScannerModal";

import { ProductContext } from "./ProductContext";

export default function App() {
  // 1. Initial State Loaders with try-catch safe JSON parsing
  const getStoredItem = (key, fallback) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error(`Error parsing localStorage key: ${key}`, e);
      return fallback;
    }
  };

  const [products, setProducts] = useState(() => 
    getStoredItem("lonetex_products_v4", defaultMockData.products)
  );

  const [transactions, setTransactions] = useState(() => 
    getStoredItem("lonetex_transactions_v4", defaultMockData.transactions)
  );



  const [readNotifications, setReadNotifications] = useState(() => {
    const saved = localStorage.getItem("lonetex_read_notifications");
    return saved ? JSON.parse(saved) : [];
  });
  const [preFilledTx, setPreFilledTx] = useState(null);

  useEffect(() => {
    localStorage.setItem("lonetex_read_notifications", JSON.stringify(readNotifications));
  }, [readNotifications]);

  const notifications = useMemo(() => {
    const list = [];

    // 1. Out of Stock alerts (0 quantity in any warehouse)
    products.forEach(p => {
      Object.entries(p.stock).forEach(([whCode, qty]) => {
        if (qty === 0) {
          const id = `alert-out-${p.sku}-${whCode}`;
          list.push({
            id,
            type: "alert",
            alertType: "out-of-stock",
            sku: p.sku,
            warehouseCode: whCode,
            message: `Out of Stock: ${p.sku} is out of stock (0 units) at ${whCode === "LHR-FAC" ? "Lahore Factory" : whCode === "LHR-HQ" ? "Gulberg HQ" : "KSA Hub"}.`,
            date: new Date().toLocaleDateString(),
            unread: !readNotifications.includes(id)
          });
        }
      });
    });

    // 2. Critical Low Stock alerts (total stock < 50 pcs)
    products.forEach(p => {
      const totalQty = Object.values(p.stock).reduce((a, b) => a + b, 0);
      if (totalQty > 0 && totalQty < 50) {
        const id = `alert-low-${p.sku}`;
        list.push({
          id,
          type: "alert",
          alertType: "low-stock",
          sku: p.sku,
          warehouseCode: p.stock["LHR-FAC"] < 50 ? "LHR-FAC" : Object.keys(p.stock)[0] || "LHR-FAC",
          message: `Critical Low Stock: ${p.sku} has only ${totalQty} units remaining globally.`,
          date: new Date().toLocaleDateString(),
          unread: !readNotifications.includes(id)
        });
      }
    });



    // Sort: unread first, then by date descending
    return list.sort((a, b) => {
      if (a.unread && !b.unread) return -1;
      if (!a.unread && b.unread) return 1;
      return 0;
    });
  }, [products, readNotifications]);

  const handleSetNotifications = (updater) => {
    const updated = typeof updater === "function" ? updater(notifications) : updater;
    const readIds = updated.filter(n => !n.unread).map(n => n.id);
    setReadNotifications(prev => Array.from(new Set([...prev, ...readIds])));
  };
  const [globalSearch, setGlobalSearch] = useState("");
  const [userRole, setUserRole] = useState("admin"); // admin, manager, sales
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Theme State ("light" | "dark" | "system")
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("lonetex_theme") || "system";
  });

  // Animated Toast Notifications Stack
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // View state synced with URL hash
  const [activeView, setActiveView] = useState(() => {
    const hash = window.location.hash.replace("#", "");
    const validViews = ["dashboard", "products", "transactions", "warehouses", "settings"];
    return validViews.includes(hash) ? hash : "dashboard";
  });

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [printProduct, setPrintProduct] = useState(null);

  const handleScanSuccess = (code) => {
    const codeClean = code.trim().toUpperCase();
    const matched = products.find(p => p.sku === codeClean || p.barcode === codeClean);
    
    if (matched) {
      setShowScanner(false);
      setSelectedProduct(matched);
      setShowProductModal(true);
      showToast(`Scanned SKU: ${matched.sku}. Opening details modal.`, "success");
    } else {
      showToast(`No product matched SKU / Barcode: "${code}"`, "error");
    }
  };

  // Sync hash with active view
  useEffect(() => {
    window.location.hash = activeView;
  }, [activeView]);

  // Handle hash change events
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const validViews = ["dashboard", "products", "transactions", "warehouses", "settings"];
      if (validViews.includes(hash)) {
        setActiveView(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Theme Sync effect
  useEffect(() => {
    const root = document.documentElement;
    let activeTheme = theme;
    
    if (theme === "system") {
      activeTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    if (activeTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    localStorage.setItem("lonetex_theme", theme);
  }, [theme]);

  // System theme listener
  useEffect(() => {
    if (theme !== "system") return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e) => {
      const root = document.documentElement;
      if (e.matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [theme]);

  // Keyboard Shortcuts: Ctrl+K / Cmd+K search focus
  useEffect(() => {
    const handleGlobalKeys = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="search"]');
        if (searchInput) {
          searchInput.focus();
          showToast("Search focused via keyboard shortcut!", "info");
        }
      }
    };
    window.addEventListener("keydown", handleGlobalKeys);
    return () => window.removeEventListener("keydown", handleGlobalKeys);
  }, []);

  // 2. Persist State Changes
  useEffect(() => {
    localStorage.setItem("lonetex_products_v4", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("lonetex_transactions_v4", JSON.stringify(transactions));
  }, [transactions]);





  // 4. State Modification Handlers
  const handleSaveProduct = (savedProd) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === savedProd.id);
      if (exists) {
        showToast(`Product ${savedProd.sku} updated successfully.`, "success");
        return prev.map(p => p.id === savedProd.id ? savedProd : p);
      } else {
        showToast(`Product ${savedProd.sku} added to catalog.`, "success");
        return [...prev, savedProd];
      }
    });
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (id) => {
    const prod = products.find(p => p.id === id);
    if (confirm(`Are you sure you want to permanently delete this product SKU (${prod?.sku}) from the Lonetex catalog?`)) {
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast("Product deleted from database.", "warning");
    }
  };

  const handleAddTransaction = (newTx) => {
    setTransactions(prev => [newTx, ...prev]);

    setProducts(prevProducts => {
      return prevProducts.map(p => {
        if (p.sku === newTx.sku) {
          const updatedStock = { ...p.stock };
          updatedStock[newTx.warehouseCode] = (updatedStock[newTx.warehouseCode] || 0) + newTx.qty;
          return { ...p, stock: updatedStock };
        }
        return p;
      });
    });
    showToast(`Stock ledger updated for SKU: ${newTx.sku}`, "success");
  };



  const handleResetDatabase = () => {
    localStorage.removeItem("lonetex_products");
    localStorage.removeItem("lonetex_products_v2");
    localStorage.removeItem("lonetex_products_v4");
    localStorage.removeItem("lonetex_transactions_v2");
    localStorage.removeItem("lonetex_transactions_v4");
    localStorage.removeItem("lonetex_react_products");
    localStorage.removeItem("lonetex_react_transactions");
    localStorage.removeItem("lonetex_theme");
    showToast("Database and settings wiped clean.", "warning");
  };

  // 5. Render Active View Router
  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <Dashboard 
            products={products} 
            transactions={transactions} 
            onRefresh={() => {
              showToast("Dashboard stats refreshed.", "success");
            }} 
          />
        );
      case "products":
        return (
          <ProductList 
            products={products} 
            onAddProduct={() => {
              setSelectedProduct(null);
              setShowProductModal(true);
            }} 
            onEditProduct={(p) => {
              setSelectedProduct(p);
              setShowProductModal(true);
            }} 
            onDeleteProduct={handleDeleteProduct} 
            onPrintLabel={(p) => setPrintProduct(p)}
            userRole={userRole}
          />
        );
      case "transactions":
        return (
          <Transactions 
            products={products} 
            transactions={transactions} 
            onAddTransaction={handleAddTransaction} 
            userRole={userRole}
            initialPreFilledTx={preFilledTx}
            onClearPreFilledTx={() => setPreFilledTx(null)}
          />
        );

      case "warehouses":
        return (
          <WarehouseRacks 
            warehouses={defaultMockData.warehouses} 
          />
        );
      case "settings":
        return (
          <Settings 
            onResetDatabase={handleResetDatabase} 
          />
        );
      default:
        return <div className="p-6 text-slate-500">View not found.</div>;
    }
  };

  return (
    <ProductContext.Provider value={{ products, setProducts, transactions, setTransactions }}>
      <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 font-sans antialiased overflow-hidden transition-colors duration-200">
        {/* Sidebar Navigation */}
        <Sidebar 
          activeView={activeView} 
          setActiveView={setActiveView} 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
        />

        {/* Main Panel Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header Bar */}
          <Navbar 
            globalSearch={globalSearch} 
            setGlobalSearch={setGlobalSearch} 
            notifications={notifications} 
            setNotifications={handleSetNotifications} 
            userRole={userRole} 
            setUserRole={setUserRole}
            theme={theme}
            setTheme={setTheme}
            onOpenScanner={() => setShowScanner(true)}
            onRestockAction={(sku, whCode) => {
              setPreFilledTx({ sku, warehouseCode: whCode });
              setActiveView("transactions");
            }}
          />

          {/* Dynamic Inner Panel Viewport */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="animate-slide-up">
              {renderView()}
            </div>
          </main>
        </div>

        {/* Add/Edit Product Form Dialog */}
        {showProductModal && (
          <ProductModal 
            product={selectedProduct} 
            onClose={() => {
              setShowProductModal(false);
              setSelectedProduct(null);
            }} 
            onSave={handleSaveProduct} 
            onPrintLabel={(p) => setPrintProduct(p)}
            userRole={userRole}
          />
        )}

        {/* Barcode Print Modal */}
        {printProduct && (
          <BarcodePrintModal 
            product={printProduct} 
            onClose={() => setPrintProduct(null)} 
          />
        )}

        {/* Barcode Scanner Modal */}
        {showScanner && (
          <BarcodeScannerModal 
            onClose={() => setShowScanner(false)} 
            onScanSuccess={handleScanSuccess} 
          />
        )}

        {/* Animated Floating Toast Notification Stack */}
        <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm pointer-events-none">
          {toasts.map(t => (
            <div 
              key={t.id} 
              className={`p-4 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-3 animate-toast-in pointer-events-auto ${
                t.type === "error" 
                  ? "bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200"
                  : t.type === "warning"
                    ? "bg-amber-50 dark:bg-amber-955/80 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200"
                    : t.type === "info"
                      ? "bg-sky-50 dark:bg-sky-950/80 border-sky-200 dark:border-sky-900 text-sky-800 dark:text-sky-200"
                      : "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200"
              }`}
            >
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </ProductContext.Provider>
  );
}
