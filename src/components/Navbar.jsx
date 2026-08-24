import React, { useState } from "react";
import { Bell, Search, ShieldAlert, CheckCircle, UserCheck, Sun, Moon, Monitor, QrCode } from "lucide-react";

export default function Navbar({ 
  globalSearch, 
  setGlobalSearch, 
  notifications, 
  setNotifications, 
  userRole, 
  setUserRole,
  theme,
  setTheme,
  onOpenScanner,
  onRestockAction
}) {
  const [showNotif, setShowNotif] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const getRoleLabel = (role) => {
    switch(role) {
      case "admin": return "Administrator (Full)";
      case "manager": return "Warehouse Manager (Stock)";
      case "sales": return "Inventory Auditor";
      default: return "Guest";
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light": return <Sun className="text-amber-500" size={18} />;
      case "dark": return <Moon className="text-sky-400" size={18} />;
      default: return <Monitor className="text-slate-400 dark:text-slate-300" size={18} />;
    }
  };

  return (
    <header className="bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800/80 h-[70px] flex items-center justify-between px-6 shrink-0 relative z-40 transition-colors duration-200">
      {/* Global Search */}
      <div className="flex items-center gap-3 w-1/3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Global search SKU, yarn, subcategory, shelfs..."
            className="w-full pl-10 pr-20 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 dark:focus:border-sky-500 transition-all duration-200"
          />
          {/* Scan Barcode button */}
          <button
            onClick={onOpenScanner}
            title="Scan Barcode / QR Code"
            className="absolute right-12 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-350 transition-colors cursor-pointer"
          >
            <QrCode size={16} />
          </button>
          {/* Ctrl+K search hotkey indicator */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 pointer-events-none select-none bg-slate-200/50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-300/30">
            <span>⌘</span><span>K</span>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="flex items-center gap-5">
        
        {/* Dynamic Theme Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 transition-colors duration-200 cursor-pointer flex items-center justify-center"
            title="Switch Visual Theme"
          >
            {getThemeIcon()}
          </button>
          
          {showThemeMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowThemeMenu(false)}></div>
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                <button
                  onClick={() => { setTheme("light"); setShowThemeMenu(false); }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer ${theme === "light" ? "text-amber-500" : "text-slate-600 dark:text-slate-300"}`}
                >
                  <Sun size={14} /> Light Mode
                </button>
                <button
                  onClick={() => { setTheme("dark"); setShowThemeMenu(false); }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer ${theme === "dark" ? "text-sky-400" : "text-slate-600 dark:text-slate-300"}`}
                >
                  <Moon size={14} /> Dark Mode
                </button>
                <button
                  onClick={() => { setTheme("system"); setShowThemeMenu(false); }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer ${theme === "system" ? "text-sky-500" : "text-slate-600 dark:text-slate-300"}`}
                >
                  <Monitor size={14} /> System Default
                </button>
              </div>
            </>
          )}
        </div>

        {/* Role Access Control Switcher */}
        <div className="flex items-center gap-2 bg-sky-50 dark:bg-slate-900/50 border border-sky-100 dark:border-slate-800/80 rounded-lg px-3 py-1.5 transition-colors duration-200">
          <UserCheck size={16} className="text-[#0284C7]" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mr-1">Role:</span>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            className="text-xs font-bold text-[#0284C7] bg-transparent focus:outline-none cursor-pointer dark:[&>option]:bg-[#0F172A] dark:[&>option]:text-slate-200"
          >
            <option value="admin">Admin (All Controls)</option>
            <option value="manager">Warehouse Manager</option>
            <option value="sales">Inventory Auditor</option>
          </select>
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotif(!showNotif)}
            className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 transition-colors duration-200 cursor-pointer relative flex items-center justify-center"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotif(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-[340px] bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 flex flex-col max-h-[400px] overflow-hidden animate-slide-up">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/20">
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Alerts & Notifications</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllRead}
                      className="text-xs font-bold text-[#0284C7] hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500">No active alerts.</div>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-4 flex flex-col gap-2 text-xs leading-relaxed transition-colors duration-200 ${n.unread ? 'bg-teal-50/50 dark:bg-teal-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-850/40'}`}
                      >
                        <div className="flex gap-3">
                          <div className="shrink-0 mt-0.5">
                            {n.type === "alert" ? (
                              <ShieldAlert className="text-amber-500" size={16} />
                            ) : (
                              <CheckCircle className="text-emerald-500" size={16} />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-700 dark:text-slate-300">{n.message}</p>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">{n.date}</span>
                          </div>
                        </div>
                        {n.alertType && (n.alertType === "out-of-stock" || n.alertType === "low-stock") && (
                          <div className="pl-7 mt-1">
                            <button
                              onClick={() => {
                                onRestockAction(n.sku, n.warehouseCode);
                                setShowNotif(false);
                              }}
                              className="px-2.5 py-1 bg-[#0284C7] hover:bg-[#0270a8] text-white text-[10px] font-bold rounded cursor-pointer transition shadow-sm"
                            >
                              Restock / Add Inward
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-5">
          <div className="w-9 h-9 rounded-full bg-[#0D9488] text-white flex items-center justify-center font-bold text-sm shadow-inner shadow-black/10">
            LX
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Robert Chen</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{getRoleLabel(userRole)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
