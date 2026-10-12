import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  FileSpreadsheet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RotateCw,
  PackageMinus,
  Warehouse,
  Layers,
  MapPin
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
function PulseCounter({ value, prefix = "", suffix = "", decimals = 0, className = "" }) {
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
    <span className={className || "text-3xl font-extrabold font-mono tracking-tight text-white drop-shadow-sm"}>
      {prefix}{count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  );
}

export default function Dashboard({ products, transactions, onRefresh }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsRefreshing(false), 650);
  };

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

  // Warehouse breakdown facility cards data
  const warehouseFacilities = [
    {
      code: "LHR-FAC",
      name: "Lahore Factory",
      subtitle: "Main Production Plant",
      stock: locationTotals["LHR-FAC"],
      maxCapacity: 8000,
      icon: Warehouse
    },
    {
      code: "LHR-HQ",
      name: "Lahore Gulberg HQ",
      subtitle: "Head Office & Showroom",
      stock: locationTotals["LHR-HQ"],
      maxCapacity: 5000,
      icon: Layers
    },
    {
      code: "KSA-HUB",
      name: "Dammam Port Hub",
      subtitle: "KSA Distribution Center",
      stock: locationTotals["KSA-HUB"],
      maxCapacity: 3000,
      icon: MapPin
    }
  ];

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
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(14, 165, 233, 0.7)";
          
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, "rgba(14, 165, 233, 0.12)");
          gradient.addColorStop(1, "rgba(14, 165, 233, 0.9)");
          return gradient;
        },
        hoverBackgroundColor: "#38BDF8",
        borderRadius: 8,
        barThickness: 32,
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(17, 22, 34, 0.95)",
        borderColor: "rgba(51, 65, 85, 0.8)",
        borderWidth: 1,
        titleColor: "#38BDF8",
        bodyColor: "#F8FAFC",
        titleFont: { size: 12, weight: "bold", family: "monospace" },
        bodyFont: { size: 11, family: "monospace" },
        padding: 10,
        borderRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: { 
        grid: { display: false },
        ticks: { color: "#94A3B8", font: { size: 11, weight: "500" } }
      },
      y: { 
        grid: { 
          borderDash: [4, 4], 
          color: "rgba(51, 65, 85, 0.3)" 
        },
        ticks: { color: "#94A3B8", font: { size: 11 } }
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
        backgroundColor: ["#0EA5E9", "#10B981", "#6366F1", "#F59E0B", "#EC4899"],
        borderWidth: 2,
        borderColor: "#111622",
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
          boxHeight: 10,
          borderRadius: 2,
          padding: 14,
          font: { size: 10, weight: "600" },
          color: "#94A3B8"
        }
      },
      tooltip: {
        backgroundColor: "rgba(17, 22, 34, 0.95)",
        borderColor: "rgba(51, 65, 85, 0.8)",
        borderWidth: 1,
        titleColor: "#38BDF8",
        bodyColor: "#F8FAFC",
        titleFont: { size: 12, weight: "bold", family: "monospace" },
        bodyFont: { size: 11, family: "monospace" },
        padding: 10,
        borderRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const val = context.raw;
            return ` Valuation: $${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
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
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.05] pointer-events-none z-0" />

      {/* Top Header Bar */}
      <motion.div variants={cardVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">Operational Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-xs text-slate-400 font-medium">
              Real-time summary of warehouse stock, valuations, and dispatches.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2 border border-slate-700/80 bg-[#111622]/80 hover:bg-slate-800/90 hover:border-cyan-500/40 text-slate-200 text-xs font-semibold rounded-xl shadow-lg shadow-black/20 hover:shadow-cyan-500/10 transition-all duration-200 cursor-pointer backdrop-blur-md group disabled:opacity-60"
          >
            <RotateCw 
              size={14} 
              className={isRefreshing ? "animate-spin text-cyan-400" : "text-slate-400 group-hover:text-cyan-300 group-hover:rotate-180 transition-transform duration-500"} 
            />
            <span>Refresh Stats</span>
          </button>
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
        {/* Total Stock Value */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="bg-[#111622]/70 backdrop-blur-xl border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 shadow-lg shadow-black/20 rounded-2xl p-5 relative overflow-hidden group flex flex-col justify-between"
        >
          <div className="group-hover:opacity-100 opacity-0 pointer-events-none transition-opacity duration-500 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.08),transparent_50%)] absolute inset-0" />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="text-slate-400 font-medium text-xs tracking-wider uppercase">
                Stock Value (Wholesale)
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-cyan-400 group-hover:scale-105 group-hover:text-cyan-300 transition-transform shrink-0">
                <DollarSign size={18} />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <div className="block">
                <PulseCounter value={totalStockValueWholesale} prefix="$" decimals={2} />
              </div>
              <div className="text-xs text-slate-400">
                Cost valuation: <span className="text-slate-300 font-medium">${totalStockValueCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="text-xs text-emerald-400 font-medium flex items-center gap-1 pt-0.5">
                <ArrowUpRight size={13} /> +4.8% this month
              </div>
            </div>
          </div>
        </motion.div>

        {/* Low Stock Warnings */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="bg-[#111622]/70 backdrop-blur-xl border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 shadow-lg shadow-black/20 rounded-2xl p-5 relative overflow-hidden group flex flex-col justify-between"
        >
          <div className="group-hover:opacity-100 opacity-0 pointer-events-none transition-opacity duration-500 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.08),transparent_50%)] absolute inset-0" />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="text-slate-400 font-medium text-xs tracking-wider uppercase">
                Low Stock Alerts
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-cyan-400 group-hover:scale-105 group-hover:text-cyan-300 transition-transform shrink-0">
                <AlertTriangle size={18} />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <div className="block">
                <PulseCounter value={lowStockAlertCount} decimals={0} />
              </div>
              <div className="text-xs text-slate-400">
                {lowStockAlertCount > 0 ? (
                  <span className="text-amber-400 font-medium">{lowStockAlertCount} items below safety threshold</span>
                ) : (
                  "All items above minimum safety level"
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Out of Stock Items */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="bg-[#111622]/70 backdrop-blur-xl border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 shadow-lg shadow-black/20 rounded-2xl p-5 relative overflow-hidden group flex flex-col justify-between"
        >
          <div className="group-hover:opacity-100 opacity-0 pointer-events-none transition-opacity duration-500 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.08),transparent_50%)] absolute inset-0" />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="text-slate-400 font-medium text-xs tracking-wider uppercase">
                Out of Stock Items
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-cyan-400 group-hover:scale-105 group-hover:text-cyan-300 transition-transform shrink-0">
                <PackageMinus size={18} />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <div className="block">
                <PulseCounter value={outOfStockCount} decimals={0} />
              </div>
              <div className="text-xs text-slate-400">
                {outOfStockCount > 0 ? (
                  <span className="text-rose-400 font-medium">{outOfStockCount} items out of stock</span>
                ) : (
                  "Zero items out of stock"
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Active SKUs */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="bg-[#111622]/70 backdrop-blur-xl border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 shadow-lg shadow-black/20 rounded-2xl p-5 relative overflow-hidden group flex flex-col justify-between"
        >
          <div className="group-hover:opacity-100 opacity-0 pointer-events-none transition-opacity duration-500 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.08),transparent_50%)] absolute inset-0" />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="text-slate-400 font-medium text-xs tracking-wider uppercase">
                Active Catalog SKUs
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-cyan-400 group-hover:scale-105 group-hover:text-cyan-300 transition-transform shrink-0">
                <FileSpreadsheet size={18} />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <div className="block">
                <PulseCounter value={totalActiveSkus} decimals={0} />
              </div>
              <div className="text-xs text-slate-400">
                {totalActiveSkus} Active Products across {categories.length} categories
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Warehouse Facilities Breakdown Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
        {warehouseFacilities.map((wh) => {
          const IconComponent = wh.icon;
          const capacityPercent = Math.min(100, Math.max(0, Math.round((wh.stock / wh.maxCapacity) * 100)));

          return (
            <motion.div
              key={wh.code}
              variants={cardVariants}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-[#111622]/70 backdrop-blur-xl border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 shadow-lg shadow-black/20 rounded-2xl p-5 relative overflow-hidden group cursor-default flex flex-col justify-between"
            >
              <div className="group-hover:opacity-100 opacity-0 pointer-events-none transition-opacity duration-500 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.08),transparent_50%)] absolute inset-0" />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-cyan-400 group-hover:scale-105 group-hover:text-cyan-300 transition-transform shrink-0">
                      <IconComponent size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white tracking-wide">{wh.name}</span>
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700/80 text-cyan-400">
                          {wh.code}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium block mt-0.5">{wh.subtitle}</span>
                    </div>
                  </div>
                </div>

                <div className="my-3 text-left">
                  <PulseCounter 
                    value={wh.stock} 
                    suffix=" Pcs" 
                    className="text-2xl lg:text-3xl font-extrabold font-mono tracking-tight text-white drop-shadow-sm" 
                  />
                  <div className="text-xs text-slate-400 mt-1 font-medium">Healthy stock level</div>
                </div>
              </div>

              <div className="relative z-10 pt-3 border-t border-slate-800/60 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Capacity Utilization</span>
                  <span className="text-cyan-400 font-semibold">{capacityPercent}%</span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-700" 
                    style={{ width: `${capacityPercent}%` }} 
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <motion.div variants={cardVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Category Stock Bar Chart */}
        <div className="bg-[#111622]/70 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 shadow-lg shadow-black/20 lg:col-span-2 flex flex-col h-[380px] relative overflow-hidden group">
          <div className="group-hover:opacity-100 opacity-0 pointer-events-none transition-opacity duration-500 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.05),transparent_50%)] absolute inset-0" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div>
              <h2 className="text-sm font-bold tracking-wider uppercase text-slate-200">Stock Quantities by Product Line</h2>
              <p className="text-[11px] text-slate-400">Total units allocated across warehouses</p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              Units
            </span>
          </div>
          <div className="flex-1 min-h-0 relative z-10">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Category Valuation Doughnut */}
        <div className="bg-[#111622]/70 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 shadow-lg shadow-black/20 flex flex-col h-[380px] relative overflow-hidden group">
          <div className="group-hover:opacity-100 opacity-0 pointer-events-none transition-opacity duration-500 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.05),transparent_50%)] absolute inset-0" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div>
              <h2 className="text-sm font-bold tracking-wider uppercase text-slate-200">Valuation Share by Category</h2>
              <p className="text-[11px] text-slate-400">Wholesale portfolio weight</p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              USD ($)
            </span>
          </div>
          <div className="flex-1 min-h-0 relative z-10">
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          </div>
        </div>
      </motion.div>

      {/* Recent Activity Log */}
      <motion.div variants={cardVariants} className="bg-[#111622]/70 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 shadow-lg shadow-black/20 relative overflow-hidden group z-10">
        <div className="group-hover:opacity-100 opacity-0 pointer-events-none transition-opacity duration-500 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.04),transparent_50%)] absolute inset-0" />
        
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div>
            <h2 className="text-sm font-bold tracking-wider uppercase text-slate-200">Recent Stock Movement Activity Log</h2>
            <p className="text-[11px] text-slate-400">Audited inventory transaction ledger</p>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
            Latest 5 Operations
          </span>
        </div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">SKU / Item</th>
                <th className="py-3 px-4">Facility</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
              {transactions.slice(0, 5).map((tx) => {
                const isStockIn = tx.type === "Stock In";
                const isStockOut = tx.type === "Stock Out";
                return (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        isStockIn 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : isStockOut 
                            ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" 
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {isStockIn ? <ArrowDownLeft size={10} /> : <ArrowUpRight size={10} />}
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{tx.productName}</div>
                      <div className="text-[10px] text-cyan-400/90 font-mono">{tx.sku}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-[11px]">
                        {tx.warehouseCode}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-right font-mono font-bold ${
                      isStockIn ? "text-emerald-400" : isStockOut ? "text-rose-400" : "text-amber-400"
                    }`}>
                      {tx.qty > 0 ? `+${tx.qty}` : tx.qty}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px] max-w-[200px] truncate" title={tx.remarks}>
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
        className="fixed bottom-6 left-6 z-40 bg-[#111622]/90 backdrop-blur-md border border-slate-800/90 px-4 py-2.5 rounded-full flex items-center gap-2.5 text-xs font-mono font-semibold text-slate-200 shadow-xl shadow-black/40 hover:border-cyan-500/40 hover:scale-[1.02] transition-all duration-300 select-none cursor-pointer"
      >
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
        </span>
        <span>🚚 Dispatch LHR-D-334: Microfiber Mops - 50 Pcs &gt;</span>
      </motion.div>
    </motion.div>
  );
}
