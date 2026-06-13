// src/pages/Dashboard/Index.tsx
import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Users,
  TrendingUp,
  Star,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  ChevronDown,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Percent,
  Building2,
} from "lucide-react";
import { Chart, registerables } from "chart.js";
import { reservationService } from "../../services/reservationService";

Chart.register(...registerables);

type ChartGranularity = "day" | "week" | "month";

export default function DashboardIndex() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [filterHotel, setFilterHotel] = useState("all");
  const [chartGranularity, setChartGranularity] = useState<ChartGranularity>("month");

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const totalHotels = hotels.length;
  const totalClients = users.length;

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    const allReservations = reservationService.getAllReservations();
    setReservations(allReservations);

    const storedHotels = localStorage.getItem("hotels_data");
    if (storedHotels) setHotels(JSON.parse(storedHotels));

    const storedUsers = localStorage.getItem("hotel_users");
    if (storedUsers) {
      const allUsers = JSON.parse(storedUsers);
      setUsers(allUsers.filter((u: any) => u.role === "user"));
    }
    setLoading(false);
  };

  // ── Filtrage global des réservations ────────────────────────────────────
  const getFilteredReservations = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return reservations
      .filter((r) => {
        const date = new Date(r.dateReservation);
        if (filterPeriod === "month")
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        if (filterPeriod === "quarter") {
          const quarter = Math.floor(currentMonth / 3);
          return Math.floor(date.getMonth() / 3) === quarter && date.getFullYear() === currentYear;
        }
        if (filterPeriod === "year") return date.getFullYear() === currentYear;
        return true;
      })
      .filter((r) => filterHotel === "all" || r.hotelId === filterHotel);
  };

  const filteredReservations = getFilteredReservations();

  const totalReservations = filteredReservations.length;
  const totalRevenue = filteredReservations.reduce((sum, r) => sum + (r.prixTotal || 0), 0);
  const pendingReservations = filteredReservations.filter((r) => r.statut === "en_attente").length;
  const confirmedReservations = filteredReservations.filter((r) => r.statut === "confirmee").length;
  const completedReservations = filteredReservations.filter((r) => r.statut === "terminee").length;
  const cancelledReservations = filteredReservations.filter((r) => r.statut === "annulee").length;

  const getTopHotels = () => {
    const hotelStats: any = {};
    filteredReservations.forEach((r) => {
      if (!hotelStats[r.hotelId])
        hotelStats[r.hotelId] = { id: r.hotelId, name: r.hotelName, count: 0, revenue: 0 };
      hotelStats[r.hotelId].count++;
      hotelStats[r.hotelId].revenue += r.prixTotal;
    });
    return Object.values(hotelStats)
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5);
  };

  const getStatusDistribution = () => {
    const total = totalReservations || 1;
    return [
      { label: "En attente",  value: pendingReservations,   percent: Math.round((pendingReservations   / total) * 100), color: "bg-yellow-400" },
      { label: "Confirmées",  value: confirmedReservations, percent: Math.round((confirmedReservations / total) * 100), color: "bg-green-500"  },
      { label: "Terminées",   value: completedReservations, percent: Math.round((completedReservations / total) * 100), color: "bg-blue-500"   },
      { label: "Annulées",    value: cancelledReservations, percent: Math.round((cancelledReservations / total) * 100), color: "bg-red-400"    },
    ];
  };

  // ── Données graphique selon la granularité ───────────────────────────────
  const getChartData = (): { labels: string[]; revenue: number[]; count: number[] } => {
    const now = new Date();

    if (chartGranularity === "day") {
      // 30 derniers jours
      const labels: string[] = [];
      const revenue = new Array(30).fill(0);
      const count   = new Array(30).fill(0);

      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        labels.push(
          d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
        );
      }

      filteredReservations.forEach((r) => {
        const rDate = new Date(r.dateReservation);
        const diffMs = now.getTime() - rDate.getTime();
        const diffDays = Math.floor(diffMs / 86_400_000);
        if (diffDays >= 0 && diffDays < 30) {
          const idx = 29 - diffDays;
          revenue[idx] += r.prixTotal || 0;
          count[idx]++;
        }
      });

      return { labels, revenue, count };
    }

    if (chartGranularity === "week") {
      // 12 dernières semaines
      const labels: string[] = [];
      const revenue = new Array(12).fill(0);
      const count   = new Array(12).fill(0);

      // Début de la semaine courante (lundi)
      const startOfCurrentWeek = new Date(now);
      const dayOfWeek = (now.getDay() + 6) % 7; // lundi = 0
      startOfCurrentWeek.setDate(now.getDate() - dayOfWeek);
      startOfCurrentWeek.setHours(0, 0, 0, 0);

      for (let i = 11; i >= 0; i--) {
        const weekStart = new Date(startOfCurrentWeek);
        weekStart.setDate(startOfCurrentWeek.getDate() - i * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        labels.push(
          `${weekStart.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })}`
        );
      }

      filteredReservations.forEach((r) => {
        const rDate = new Date(r.dateReservation);
        rDate.setHours(0, 0, 0, 0);
        const diffMs = startOfCurrentWeek.getTime() - rDate.getTime();
        const diffWeeks = Math.floor(diffMs / (7 * 86_400_000));
        if (diffWeeks >= 0 && diffWeeks < 12) {
          const idx = 11 - diffWeeks;
          revenue[idx] += r.prixTotal || 0;
          count[idx]++;
        }
      });

      return { labels, revenue, count };
    }

    // Par défaut : mensuel (12 mois)
    const monthNames = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
    const revenue = new Array(12).fill(0);
    const count   = new Array(12).fill(0);

    filteredReservations.forEach((r) => {
      const month = new Date(r.dateReservation).getMonth();
      revenue[month] += r.prixTotal || 0;
      count[month]++;
    });

    return { labels: monthNames, revenue, count };
  };

  const { labels: chartLabels, revenue: chartRevenue, count: chartCount } = getChartData();

  // Tendance CA (mois courant vs précédent)
  const monthlyRevenue = (() => {
    const rev = new Array(12).fill(0);
    filteredReservations.forEach((r) => {
      rev[new Date(r.dateReservation).getMonth()] += r.prixTotal || 0;
    });
    return rev;
  })();
  const currentMonthRevenue = monthlyRevenue[new Date().getMonth()];
  const lastMonthRevenue    = monthlyRevenue[new Date().getMonth() - 1] || 0;
  const revenueTrend = lastMonthRevenue
    ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
    : "0";

  const conversionRate = totalReservations
    ? Math.round((confirmedReservations / totalReservations) * 100)
    : 0;
  const avgBasket = totalReservations ? Math.floor(totalRevenue / totalReservations) : 0;

  const topHotels        = getTopHotels();
  const statusDistribution = getStatusDistribution();

  // Libellé sous-titre du graphique
  const chartSubtitle: Record<ChartGranularity, string> = {
    day:   "30 derniers jours — FCFA",
    week:  "12 dernières semaines — FCFA",
    month: "Tendance mensuelle — FCFA",
  };

  // ── Rendu du graphique ───────────────────────────────────────────────────
  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    const isDark     = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const gridColor  = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
    const tickColor  = isDark ? "#a0a09a" : "#73726c";

    chartInstanceRef.current = new Chart(chartRef.current, {
      data: {
        labels: chartLabels,
        datasets: [
          {
            type: "line" as const,
            label: "CA (FCFA)",
            data: chartRevenue,
            borderColor: "#EF9F27",
            backgroundColor: isDark ? "rgba(239,159,39,0.10)" : "rgba(239,159,39,0.08)",
            borderWidth: 2,
            pointBackgroundColor: "#EF9F27",
            pointRadius: chartGranularity === "day" ? 2 : 4,
            pointHoverRadius: 6,
            fill: true,
            tension: 0.4,
            yAxisID: "yCA",
          },
          {
            type: "line" as const,
            label: "Réservations",
            data: chartCount,
            borderColor: "#378ADD",
            backgroundColor: "transparent",
            borderWidth: 2,
            pointBackgroundColor: "#378ADD",
            pointStyle: "circle",
            pointRadius: chartGranularity === "day" ? 2 : 4,
            pointHoverRadius: 6,
            fill: false,
            tension: 0.4,
            yAxisID: "yResa",
            borderDash: [5, 3],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? "#2c2c2a" : "#fff",
            borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
            borderWidth: 1,
            titleColor: isDark ? "#d3d1c7" : "#5f5e5a",
            bodyColor: isDark ? "#f1efe8" : "#2c2c2a",
            padding: 10,
            callbacks: {
              label: (ctx) => {
                if (ctx.datasetIndex === 0)
                  return ` CA : ${(ctx.raw as number).toLocaleString("fr-FR")} FCFA`;
                return ` Réservations : ${ctx.raw}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: {
              color: tickColor,
              font: { size: 10 },
              autoSkip: chartGranularity === "day",
              maxTicksLimit: chartGranularity === "day" ? 10 : undefined,
              maxRotation: chartGranularity === "day" ? 45 : 0,
            },
            border: { display: false },
          },
          yCA: {
            position: "left",
            grid: { color: gridColor },
            ticks: {
              color: tickColor,
              font: { size: 10 },
              callback: (v) => {
                const n = Number(v);
                if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
                if (n >= 1_000)     return (n / 1_000).toFixed(0) + "k";
                return String(n);
              },
            },
            border: { display: false },
          },
          yResa: {
            position: "right",
            grid: { display: false },
            ticks: { color: "#378ADD", font: { size: 10 } },
            border: { display: false },
          },
        },
      },
    });

    return () => { chartInstanceRef.current?.destroy(); };
  }, [chartLabels, chartRevenue, chartCount, chartGranularity]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mx-auto" />
          <p className="text-gray-500 text-sm mt-3">Chargement des données...</p>
        </div>
      </div>
    );
  }

  const granularityOptions: { value: ChartGranularity; label: string }[] = [
    { value: "day",   label: "Jour" },
    { value: "week",  label: "Semaine" },
    { value: "month", label: "Mois" },
  ];

  return (
    <div className="space-y-6">

      {/* ── En-tête ── */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Tableau de bord</h1>
          <p className="text-gray-400 text-sm mt-1">Vue d'ensemble de votre activité hôtelière</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 appearance-none bg-white"
            >
              <option value="all">Toute la période</option>
              <option value="month">Ce mois-ci</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filterHotel}
              onChange={(e) => setFilterHotel(e.target.value)}
              className="pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 appearance-none bg-white"
            >
              <option value="all">Tous les hôtels</option>
              {hotels.map((h: any) => (
                <option key={h.id} value={h.id}>{h.nom}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <RefreshCw size={13} />
            Actualiser
          </button>
        </div>
      </div>

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Réservations</p>
              <p className="text-2xl font-semibold text-gray-800">{totalReservations}</p>
            </div>
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <Calendar size={18} className="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Chiffre d'affaires</p>
              <p className="text-xl font-semibold text-amber-600">
                {totalRevenue.toLocaleString("fr-FR")}
                <span className="text-xs font-normal text-gray-400 ml-1">FCFA</span>
              </p>
            </div>
            <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
              <DollarSign size={18} className="text-amber-500" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className={`flex items-center gap-0.5 font-medium ${Number(revenueTrend) >= 0 ? "text-green-600" : "text-red-500"}`}>
              {Number(revenueTrend) >= 0 ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
              {Math.abs(Number(revenueTrend))}%
            </span>
            <span className="text-gray-400">vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Taux de conversion</p>
              <p className="text-2xl font-semibold text-gray-800">{conversionRate}%</p>
            </div>
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
              <Percent size={18} className="text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Panier moyen</p>
              <p className="text-xl font-semibold text-gray-800">
                {avgBasket.toLocaleString("fr-FR")}
                <span className="text-xs font-normal text-gray-400 ml-1">FCFA</span>
              </p>
            </div>
            <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
              <TrendingUp size={18} className="text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Graphique en courbe ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Évolution du chiffre d'affaires</h3>
            <p className="text-xs text-gray-400 mt-0.5">{chartSubtitle[chartGranularity]}</p>
          </div>

          {/* Sélecteur granularité */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {granularityOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setChartGranularity(opt.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  chartGranularity === opt.value
                    ? "bg-white text-amber-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Légende custom */}
        <div className="flex gap-5 mb-4">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" />
            CA
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span
              className="w-3 h-[2px] inline-block"
              style={{ background: "repeating-linear-gradient(to right,#378ADD 0,#378ADD 4px,transparent 4px,transparent 7px)" }}
            />
            <span className="w-2 h-2 rounded-full bg-blue-400 inline-block -ml-0.5" />
            Réservations
          </span>
        </div>

        <div className="relative h-64">
          <canvas ref={chartRef} />
        </div>
      </div>

      {/* ── Top hôtels + Statuts ── */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Top hôtels</h3>
              <p className="text-xs text-gray-400 mt-0.5">Par nombre de réservations</p>
            </div>
            <Star size={16} className="text-amber-400" />
          </div>
          <div className="space-y-4">
            {topHotels.length === 0 ? (
              <p className="text-center text-gray-300 text-sm py-8">Aucune donnée disponible</p>
            ) : (
              topHotels.map((hotel: any, index: number) => {
                const percent = totalReservations
                  ? Math.round((hotel.count / totalReservations) * 100)
                  : 0;
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 font-semibold text-xs">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-700 font-medium">{hotel.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-amber-600">{hotel.count}</span>
                        <span className="text-xs text-gray-400 ml-1">rés.</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-9 text-right">{percent}%</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">État des réservations</h3>
              <p className="text-xs text-gray-400 mt-0.5">Répartition par statut</p>
            </div>
            <PieChart size={16} className="text-gray-300" />
          </div>
          <div className="space-y-4">
            {statusDistribution.map((s, i) => (
              <div key={i}>
                <div className="flex justify-between items-center text-sm mb-1.5">
                  <span className="text-gray-600 text-xs">{s.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-800 text-sm">{s.value}</span>
                    <span className="text-xs text-gray-400 w-9 text-right">{s.percent}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${s.color} rounded-full transition-all duration-500`}
                    style={{ width: `${s.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-gray-100">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Note moyenne</p>
              <p className="text-lg font-semibold text-gray-800">4.7 <span className="text-sm">⭐</span></p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Taux d'occupation</p>
              <p className="text-lg font-semibold text-gray-800">68%</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Badges indicateurs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-amber-50 rounded-xl p-4">
          <Building2 size={18} className="text-amber-600 mb-2 opacity-80" />
          <p className="text-2xl font-semibold text-amber-900">{totalHotels}</p>
          <p className="text-xs text-amber-700 mt-0.5">Hôtels partenaires</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <Users size={18} className="text-blue-600 mb-2 opacity-80" />
          <p className="text-2xl font-semibold text-blue-900">{totalClients}</p>
          <p className="text-xs text-blue-700 mt-0.5">Clients inscrits</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <Star size={18} className="text-green-600 mb-2 opacity-80" />
          <p className="text-2xl font-semibold text-green-900">4.7</p>
          <p className="text-xs text-green-700 mt-0.5">Note moyenne</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4">
          <Activity size={18} className="text-purple-600 mb-2 opacity-80" />
          <p className="text-2xl font-semibold text-purple-900">68%</p>
          <p className="text-xs text-purple-700 mt-0.5">Taux d'occupation</p>
        </div>
      </div>
    </div>
  );
}