import React from "react";
import { Trash2, ShieldAlert, Settings as SettingsIcon, Info, Phone, Mail, Building } from "lucide-react";

export default function Settings({ onResetDatabase }) {
  const handleReset = () => {
    if (confirm("Warning! This will clear all added products and manual stock logs, and reload the database to original mock data defaults. Proceed?")) {
      onResetDatabase();
      alert("Database reset completed successfully!");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight transition-colors">System Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Configure Lonetex developers preferences, database tools, and business contact points.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preferences */}
        <div className="bg-white/70 dark:bg-[#111827]/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-lg lg:col-span-2 space-y-6 transition-colors">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <SettingsIcon className="text-[#0284C7]" size={20} />
            <h2 className="font-bold text-sm text-slate-800 dark:text-slate-200">System Preferences</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200/50 dark:border-slate-800/80">
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Local Storage Persistence</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">Persist products list and transaction states in browser local storage.</span>
              </div>
              <label className="relative inline-flex items-center cursor-not-allowed">
                <input type="checkbox" checked disabled className="sr-only peer" />
                <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-slate-950 after:border-slate-300 dark:after:border-slate-800 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0284C7]"></div>
              </label>
            </div>


            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200/50 dark:border-slate-800/80">
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Low Stock Threshold Warnings</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">Highlight stats on dashboard if quantity drops below minimum SKU limit.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-slate-950 after:border-slate-300 dark:after:border-slate-800 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0284C7]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Admin controls */}
        <div className="bg-white/70 dark:bg-[#111827]/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-6 transition-colors">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 text-rose-500">
            <ShieldAlert size={20} />
            <h2 className="font-bold text-sm">Administrative Controls</h2>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Reset database will wipe out local cache edits and reload the initial Lonetex product seeds.</p>
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 text-xs font-bold rounded-lg cursor-pointer transition duration-150 shadow-sm"
            >
              <Trash2 size={16} />
              Reset Store Database
            </button>
          </div>
        </div>
      </div>

      {/* Corporate Info */}
      <div className="bg-white/70 dark:bg-[#111827]/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-4 transition-colors">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Info className="text-indigo-500" size={20} />
          <h2 className="font-bold text-sm text-slate-800 dark:text-slate-200">Lonetex Corporate Directory</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-300">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
              <Building size={14} className="text-[#0D9488]" />
              <span>Lahore Factory Location</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 pl-6 leading-relaxed">Main Canal Road, Near Harbanspura Interchange, Lahore, Pakistan.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
              <Building size={14} className="text-[#0284C7]" />
              <span>Lahore Head Office</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 pl-6 leading-relaxed">2nd Floor, Commercial Block, Gulberg III, Lahore, Pakistan.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
              <Phone size={14} className="text-indigo-500" />
              <span>Contact & Support</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 pl-6">Email: info@lonetex.co</p>
            <p className="text-slate-500 dark:text-slate-400 pl-6">WhatsApp WSP Support: +92 42 111-LONETEX</p>
          </div>
        </div>
      </div>
    </div>
  );
}
