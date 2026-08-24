import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Package, 
  ArrowLeftRight, 
  Warehouse, 
  Settings, 
  Menu, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  Maximize2,
  X
} from "lucide-react";

export default function Sidebar({ activeView, setActiveView, isCollapsed, setIsCollapsed }) {
  const [showLogoModal, setShowLogoModal] = useState(false);

  // Esc key closes logo modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowLogoModal(false);
      }
    };
    if (showLogoModal) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showLogoModal]);

  const handleLogoClick = () => {
    setActiveView("dashboard");
  };

  const handleLogoKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveView("dashboard");
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products Catalog", icon: Package },
    { id: "transactions", label: "Stock Ledger", icon: ArrowLeftRight },
    { id: "warehouses", label: "Warehouse Racks", icon: Warehouse },
    { id: "settings", label: "System Settings", icon: Settings },
  ];

  return (
    <aside 
      className={`bg-white dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 flex flex-col h-screen transition-all duration-300 border-r border-slate-200 dark:border-slate-800/80 shrink-0 relative z-50 shadow-2xl ${
        isCollapsed ? "w-[80px]" : "w-[260px]"
      }`}
    >
      {/* Brand Header */}
      <div className="relative group flex items-center justify-center w-full h-[70px] bg-transparent border-none overflow-visible px-4">
        {/* Navigation Link Wrapper */}
        <div
          onClick={handleLogoClick}
          onKeyDown={handleLogoKeyDown}
          tabIndex={0}
          role="button"
          title="Lonetex - Return to Dashboard"
          className="flex-1 flex items-center justify-center cursor-pointer hover:opacity-90 transition-all duration-200 outline-none border-none bg-transparent select-none"
        >
          <svg 
            viewBox="0 0 240 100" 
            className={`drop-shadow-sm transition-all duration-300 ${
              isCollapsed 
                ? "w-10 h-auto scale-90" 
                : "w-36 h-auto hover:scale-105"
            }`} 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Blue Ring Border */}
            <ellipse cx="120" cy="50" rx="112" ry="44" stroke="#1d4ed8" strokeWidth="6" fill="#eab308" />
            {/* Yellow Oval Fill with subtle gradient */}
            <ellipse cx="120" cy="50" rx="108" ry="40" fill="#facc15" />
            {/* Lonetex Bold Italic Typography */}
            <text 
              x="50%" 
              y="52%" 
              dominantBaseline="central" 
              textAnchor="middle" 
              fill="#1e3a8a" 
              fontFamily="Impact, 'Arial Black', sans-serif" 
              fontWeight="900" 
              fontStyle="italic" 
              fontSize="48"
            >
              LONETEX
            </text>
          </svg>
        </div>

        {/* Expand/Preview Button */}
        {!isCollapsed && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowLogoModal(true);
            }}
            title="Inspect Brand Asset"
            className="absolute right-3 p-1 rounded bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          >
            <Maximize2 size={12} />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 pt-8 pb-4 overflow-y-auto px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer border ${
                isActive 
                  ? "bg-sky-50 text-sky-700 border-sky-300 font-semibold shadow-sm dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20 dark:shadow-[0_0_15px_rgba(14,165,233,0.15)]" 
                  : "text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50"
              }`}
            >
              <Icon size={20} className={isActive ? "text-sky-700 dark:text-sky-400" : "text-slate-500 dark:text-slate-450"} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 flex justify-end">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200 cursor-pointer"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Brand Logo Inspection Lightbox Modal */}
      {showLogoModal && (
        <div 
          onClick={() => setShowLogoModal(false)}
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xl max-w-lg w-full p-4 animate-scale-up"
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowLogoModal(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer z-10"
            >
              <X size={16} />
            </button>
            
            {/* Full-size image display */}
            <div className="w-full rounded-lg overflow-hidden bg-slate-900 mt-4 p-8 flex items-center justify-center">
              <svg viewBox="0 0 240 100" className="w-64 h-auto drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Outer Blue Ring Border */}
                <ellipse cx="120" cy="50" rx="112" ry="44" stroke="#1d4ed8" strokeWidth="6" fill="#eab308" />
                {/* Yellow Oval Fill with subtle gradient */}
                <ellipse cx="120" cy="50" rx="108" ry="40" fill="#facc15" />
                {/* Lonetex Bold Italic Typography */}
                <text 
                  x="50%" 
                  y="52%" 
                  dominantBaseline="central" 
                  textAnchor="middle" 
                  fill="#1e3a8a" 
                  fontFamily="Impact, 'Arial Black', sans-serif" 
                  fontWeight="900" 
                  fontStyle="italic" 
                  fontSize="42" 
                  letterSpacing="1.5px"
                >
                  LONETEX
                </text>
              </svg>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
