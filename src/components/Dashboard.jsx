import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  FolderLock, 
  FileSpreadsheet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RotateCw,
  PackageMinus
} from "lucide-react";
import { Bar, Doughnut } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement
);

// Advanced Quad Ease-Out Numerical Pulse Counter Component
function PulseCounter({ value, prefix = "", suffix = "", decimals = 0 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(value) || 0;
    if (end === 0) {
      setCount(0);
      return;
    }
    
    const duration = 850; // milliseconds
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Quadratic ease out
      const ease = progress * (2 - progress);
      const current = start + (end - start) * ease;
      
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span className="font-extrabold text-2xl tracking-tight text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {prefix}{count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  );
}

export default function Dashboard({ products, transactions, onRefresh }) {
  // 1. Calculate KPI Metrics
  const totalActiveSkus = products.length;
  
  let totalStockValueCost = 0;
  let totalStockValueWholesale = 0;
  let lowStockAlertCount = 0;
  let outOfStockCount = 0;

  products.forEach(p => {
    const totalStockQty = Object.values(p.stock).reduce((a, b) => a + b, 0);
    totalStockValueCost += totalStockQty * p.costPrice;
    totalStockValueWholesale += totalStockQty * p.wholesalePrice;

    if (totalStockQty === 0) {
      outOfStockCount++;
    } else if (totalStockQty <= p.minThreshold) {
      lowStockAlertCount++;
    }
  });

  const locationTotals = {
    "LHR-FAC": 0,
    "LHR-HQ": 0,
    "KSA-HUB": 0
  };
  products.forEach(p => {
    locationTotals["LHR-FAC"] += p.stock["LHR-FAC"] || 0;
    locationTotals["LHR-HQ"] += p.stock["LHR-HQ"] || 0;
    locationTotals["KSA-HUB"] += p.stock["KSA-HUB"] || 0;
  });

  // 2. Prepare Chart Data with Canvas Gradients
  const categories = [...new Set(products.map(p => p.category))];
  const stockPerCategory = categories.map(cat => {
    return products
      .filter(p => p.category === cat)
      .reduce((sum, p) => sum + Object.values(p.stock).reduce((a, b) => a + b, 0), 0);
  });

  const barChartData = {
    labels: categories,
    datasets: [
      {
        label: "Total Units In-Stock",
        data: stockPerCategory,
        // High-fidelity glowing linear gradients
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, "rgba(2, 132, 199, 0.2)"); // Translucent sky blue bottom
          gradient.addColorStop(1, "#0284C7");               // Solid sky blue top
          return gradient;
        },
        hoverBackgroundColor: "#0D9488",
        borderRadius: 8,
        barThickness: 34,
      }
    ]
  };

  const isDarkTheme = document.documentElement.classList.contains("dark");

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)", // slate-900 with opacity
        borderColor: "rgba(51, 65, 85, 0.5)",     // slate-700 border
        borderWidth: 1,
        titleColor: "#0284C7",
        bodyColor: "#F8FAFC",
        titleFont: { size: 12, weight: "bold" },
        bodyFont: { size: 11 },
        padding: 10,
        borderRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: { 
        grid: { display: false },
        ticks: { color: isDarkTheme ? "#94A3B8" : "#64748B" }
      },
      y: { 
        grid: { 
          borderDash: [4, 4], 
          color: isDarkTheme ? "#334155" : "#E2E8F0" 
        },
        ticks: { color: isDarkTheme ? "#94A3B8" : "#64748B" }
      }
    }
  };

  const valuationPerCategory = categories.map(cat => {
    return products
      .filter(p => p.category === cat)
      .reduce((sum, p) => sum + (Object.values(p.stock).reduce((a, b) => a + b, 0) * p.wholesalePrice), 0);
  });

  const doughnutChartData = {
    labels: categories,
    datasets: [
      {
        data: valuationPerCategory,
        backgroundColor: ["#0284C7", "#0D9488", "#6366F1", "#F59E0B", "#EC4899"],
        borderWidth: isDarkTheme ? 3 : 2,
        borderColor: isDarkTheme ? "#0F172A" : "#FFFFFF",
        hoverOffset: 6
      }
    ]
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
          padding: 14,
          font: { size: 10, weight: "600" },
          color: isDarkTheme ? "#94A3B8" : "#64748B"
        }
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)", // slate-900 with opacity
        borderColor: "rgba(51, 65, 85, 0.5)",     // slate-700 border
        borderWidth: 1,
        titleColor: "#0284C7",
        bodyColor: "#F8FAFC",
        titleFont: { size: 12, weight: "bold" },
        bodyFont: { size: 11 },
        padding: 10,
        borderRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const val = context.raw;
            return ` Value: $${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
          }
        }
      }
    },
    cutout: "75%"
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.4 
      } 
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 relative min-h-screen text-slate-100 transition-colors duration-200 z-10"
    >
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.06] pointer-events-none z-0" />

      {/* Page Header */}
      <motion.div variants={cardVariants} className="flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 transition-colors duration-200">Operational Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Real-time summary of Lonetex textile inventory and dispatches.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center" title="Live Connection Active">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
          >
            <RotateCw size={16} />
            Refresh Stats
          </button>
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
        {/* Total Stock Value */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white/70 dark:bg-[#111827]/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-cyan-500/5 hover:border-cyan-500/20"
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 max-w-[65%] leading-snug text-left">
              Stock Value (Wholesale)
            </div>
            <span className="shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap self-start bg-emerald-500/10 text-emerald-450 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
              <ArrowUpRight size={10} /> +4.8% MoM
            </span>
          </div>
          
          <div className="space-y-1 text-left">
            <div className="block">
              <PulseCounter value={totalStockValueWholesale} prefix="$" decimals={2} />
            </div>
            <span className="text-[10px] text-slate-400/80 dark:text-slate-500 block mt-1">Cost valuation: ${totalStockValueCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          
          <div className="mt-4 flex justify-end">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-400 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(6,182,212,0.3)]">
              <DollarSign size={20} />
            </div>
          </div>
        </motion.div>

        {/* Low Stock Warnings */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white/70 dark:bg-[#111827]/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-amber-500/5 hover:border-amber-500/20"
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 max-w-[65%] leading-snug text-left">
              Low Stock Alerts
            </div>
            <span className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap self-start border ${
              lowStockAlertCount > 0 
                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" 
                : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
            }`}>
              {lowStockAlertCount > 0 ? "Attention Needed" : "Optimal"}
            </span>
          </div>

          <div className="space-y-1 text-left">
            <div className="block">
              <PulseCounter value={lowStockAlertCount} decimals={0} />
            </div>
            {lowStockAlertCount > 0 ? (
              <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1 mt-1">
                <AlertTriangle size={12} className="animate-pulse" /> Requires attention
              </span>
            ) : (
              <span className="text-[10px] font-bold text-emerald-500 block mt-1">All stock limits healthy</span>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(245,158,11,0.3)]">
              <AlertTriangle size={20} />
            </div>
          </div>
        </motion.div>

        {/* Out of Stock Items */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white/70 dark:bg-[#111827]/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-rose-500/5 hover:border-rose-500/20"
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 max-w-[65%] leading-snug text-left">
              Out of Stock Items
            </div>
            <span className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap self-start border ${
              outOfStockCount > 0 
                ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" 
                : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
            }`}>
              {outOfStockCount > 0 ? "Understocked" : "All Available"}
            </span>
          </div>

          <div className="space-y-1 text-left">
            <div className="block">
              <PulseCounter value={outOfStockCount} decimals={0} />
            </div>
            {outOfStockCount > 0 ? (
              <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1 mt-1">
                <PackageMinus size={12} /> SKUs unavailable
              </span>
            ) : (
              <span className="text-[10px] font-bold text-slate-400/80 dark:text-slate-500 block mt-1">Zero unavailable items</span>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-400 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(239,68,68,0.3)]">
              <FolderLock size={20} />
            </div>
          </div>
        </motion.div>

        {/* Active SKUs */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white/70 dark:bg-[#111827]/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-emerald-500/5 hover:border-emerald-500/20"
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 max-w-[65%] leading-snug text-left">
              Active Catalog SKUs
            </div>
            <span className="shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap self-start bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Optimal Capacity
            </span>
          </div>

          <div className="space-y-1 text-left">
            <div className="block">
              <PulseCounter value={totalActiveSkus} decimals={0} />
            </div>
            <span className="text-[10px] text-slate-400/80 dark:text-slate-500 block mt-1">5 core categories pre-seeded</span>
          </div>

          <div className="mt-4 flex justify-end">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(16,185,129,0.3)]">
              <FileSpreadsheet size={20} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Location Stock Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
        {/* Lahore Factory */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white/70 dark:bg-[#111827]/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden shadow-lg"
        >
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-inner">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Lahore Factory Stock</span>
            <span className="text-lg font-black text-slate-700 dark:text-slate-100">{locationTotals["LHR-FAC"].toLocaleString()} Pcs</span>
          </div>
        </motion.div>

        {/* Lahore Gulberg HQ */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white/70 dark:bg-[#111827]/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden shadow-lg"
        >
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shadow-inner">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Lahore Gulberg HQ Stock</span>
            <span className="text-lg font-black text-slate-700 dark:text-slate-100">{locationTotals["LHR-HQ"].toLocaleString()} Pcs</span>
          </div>
        </motion.div>

        {/* Dammam Port Hub (KSA) */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white/70 dark:bg-[#111827]/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden shadow-lg"
        >
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-inner">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V10a2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Dammam Port Hub (KSA)</span>
            <span className="text-lg font-black text-slate-700 dark:text-slate-100">{locationTotals["KSA-HUB"].toLocaleString()} Pcs</span>
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <motion.div variants={cardVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Category Stock Bar Chart */}
        <div className="bg-white dark:bg-[#111827]/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-lg lg:col-span-2 flex flex-col h-[380px]">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4 text-left">Stock Quantities by Product Line</h2>
          <div className="flex-1 min-h-0 relative">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Category Valuation Doughnut */}
        <div className="bg-white dark:bg-[#111827]/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col h-[380px]">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4 text-left">Valuation Share by Category</h2>
          <div className="flex-1 min-h-0 relative">
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          </div>
        </div>
      </motion.div>

      {/* Recent Activity Log */}
      <motion.div variants={cardVariants} className="bg-white dark:bg-[#111827]/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-lg relative z-10">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4 text-left">Recent Stock Movement Activity Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">SKU / Item</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-55 dark:divide-slate-900/60 text-slate-655 dark:text-slate-300 font-medium">
              {transactions.slice(0, 5).map((tx) => {
                const isStockIn = tx.type === "Stock In";
                const isStockOut = tx.type === "Stock Out";
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-4 text-slate-400 dark:text-slate-500">{new Date(tx.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isStockIn 
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                          : isStockOut 
                            ? "bg-sky-500/10 text-[#0284C7] border border-sky-500/20" 
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      }`}>
                        {isStockIn ? <ArrowDownLeft size={10} /> : <ArrowUpRight size={10} />}
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{tx.productName}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{tx.sku}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold">{tx.warehouseCode}</td>
                    <td className={`py-3 px-4 text-right font-bold ${isStockIn ? "text-emerald-500" : isStockOut ? "text-rose-500" : "text-amber-500"}`}>
                      {tx.qty > 0 ? `+${tx.qty}` : tx.qty}
                    </td>
                    <td className="py-3 px-4 text-slate-400 dark:text-slate-500 italic max-w-[200px] truncate" title={tx.remarks}>
                      {tx.remarks}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Floating Bottom-left Dispatch Ticker */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 80 }}
        className="fixed bottom-6 left-6 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-full flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xl shadow-black/20 hover:border-[#0284C7]/50 hover:scale-102 transition-all duration-300 select-none cursor-pointer"
      >
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0284C7] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0284C7]"></span>
        </span>
        <span>🚚 Dispatch LHR-D-334: Microfiber Mops - 50 Pcs &gt;</span>
      </motion.div>
    </motion.div>
  );
}
