import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search, Bell, Moon, Sun, LogOut, LayoutDashboard, CalendarDays, Users,
  MessageSquareWarning, ClipboardList, UserCheck, Wallet, Package, ReceiptText,
  CreditCard, FileBarChart, Settings, Plus, Edit3, X, MapPin, Phone,
  IndianRupee, Sparkles, TrendingUp, Download, Send, ShieldCheck, Star,
  ChevronLeft, ChevronRight, MessageCircle, Image as ImageIcon, UserRound,
  BriefcaseBusiness, HandCoins, CheckCircle2, Clock3
} from "lucide-react";

const SERVICE_PHOTOS = {
  "Sofa Shampooing": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
  "Bed Shampooing – Single": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  "Bed Shampooing – Double": "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=900&q=80",
  "Bed Shampooing – King / Queen": "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=900&q=80",
  "Carpet Shampooing": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
  "Refrigerator Interior Cleaning": "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=900&q=80",
  "AC Filter Cleaning": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80",
  "Water Tank Cleaning": "https://images.unsplash.com/photo-1605292356183-a77d0a9c9d1d?auto=format&fit=crop&w=900&q=80",
  "Loft Interior Cleaning": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
  "Exterior Pressure Washing": "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=900&q=80",
  "Termite Control Treatment": "https://images.unsplash.com/photo-1581579185169-891e36ddf9ba?auto=format&fit=crop&w=900&q=80",
  "General Pest Control": "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=900&q=80",
  "Deep Home Cleaning": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
};

const FN_SERVICES = [
  { id: 1, name: "Sofa Shampooing", rate: 550, unit: "seat", image: "🛋️", photo: SERVICE_PHOTOS["Sofa Shampooing"], category: "Shampooing" },
  { id: 2, name: "Bed Shampooing – Single", rate: 950, unit: "unit", image: "🛏️", photo: SERVICE_PHOTOS["Bed Shampooing – Single"], category: "Shampooing" },
  { id: 3, name: "Bed Shampooing – Double", rate: 1100, unit: "unit", image: "🛏️", photo: SERVICE_PHOTOS["Bed Shampooing – Double"], category: "Shampooing" },
  { id: 4, name: "Bed Shampooing – King / Queen", rate: 1200, unit: "unit", image: "👑", photo: SERVICE_PHOTOS["Bed Shampooing – King / Queen"], category: "Shampooing" },
  { id: 5, name: "Carpet Shampooing", rate: 30, unit: "sq.ft", image: "🧶", photo: SERVICE_PHOTOS["Carpet Shampooing"], category: "Shampooing" },
  { id: 6, name: "Refrigerator Interior Cleaning", rate: 850, unit: "unit", image: "❄️", photo: SERVICE_PHOTOS["Refrigerator Interior Cleaning"], category: "Kitchen" },
  { id: 7, name: "AC Filter Cleaning", rate: 350, unit: "unit", image: "🌬️", photo: SERVICE_PHOTOS["AC Filter Cleaning"], category: "Appliance" },
  { id: 8, name: "Water Tank Cleaning", rate: 2, unit: "litre", image: "💧", photo: SERVICE_PHOTOS["Water Tank Cleaning"], category: "Deep Cleaning" },
  { id: 9, name: "Loft Interior Cleaning", rate: 300, unit: "room", image: "🏠", photo: SERVICE_PHOTOS["Loft Interior Cleaning"], category: "Home" },
  { id: 10, name: "Exterior Pressure Washing", rate: 4, unit: "sq.ft", image: "🚿", photo: SERVICE_PHOTOS["Exterior Pressure Washing"], category: "Exterior" },
  { id: 11, name: "Termite Control Treatment", rate: 14, unit: "sq.ft", image: "🛡️", photo: SERVICE_PHOTOS["Termite Control Treatment"], category: "Pest Control" },
  { id: 12, name: "General Pest Control", rate: 3000, unit: "starting", image: "🐜", photo: SERVICE_PHOTOS["General Pest Control"], category: "Pest Control" },
];

const initialBookings = [
  { id: "FN-1001", customer: "Arun Kumar", phone: "9876543210", email: "arun@example.com", address: "12, North Street, Thillai Nagar", service: "Sofa Shampooing", serviceIcon: "🛋️", amount: 2200, workStatus: "Not Started", paymentStatus: "Pending", payout: 1200, teamPayout: 900, fnMargin: 1000, status: "Pending", staff: "Unassigned", team: ["Ravi", "Manoj"], date: "2026-05-17", time: "10:30 AM", area: "Trichy - Thillai Nagar", source: "WhatsApp", notes: "4 seater sofa, shampoo required" },
  { id: "FN-1002", customer: "Priya S", phone: "9840012345", email: "priya@example.com", address: "8, Main Road, Cantonment", service: "Deep Home Cleaning", serviceIcon: "🏠", amount: 4500, workStatus: "Assigned", paymentStatus: "Advance Paid", payout: 2500, teamPayout: 2000, fnMargin: 2000, status: "Assigned", staff: "Selva", team: ["Selva", "Ravi"], date: "2026-05-17", time: "12:00 PM", area: "Trichy - Cantonment", source: "Instagram", notes: "2BHK deep cleaning" },
  { id: "FN-1003", customer: "Mohammed Ali", phone: "9123456789", email: "ali@example.com", address: "22, Temple Road, Srirangam", service: "AC Filter Cleaning", serviceIcon: "🌬️", amount: 700, workStatus: "Completed", paymentStatus: "Paid", payout: 350, teamPayout: 300, fnMargin: 350, status: "Completed", staff: "Ravi", team: ["Ravi"], date: "2026-05-16", time: "04:00 PM", area: "Srirangam", source: "Google", notes: "2 AC filters cleaned" },
  { id: "FN-1004", customer: "Lakshmi", phone: "9000011111", email: "lakshmi@example.com", address: "4, West Car Street, Woraiyur", service: "Water Tank Cleaning", serviceIcon: "💧", amount: 3000, workStatus: "Live", paymentStatus: "Pending", payout: 1700, teamPayout: 1400, fnMargin: 1300, status: "Pending", staff: "Unassigned", team: ["Amit", "Manoj"], date: "2026-05-18", time: "09:00 AM", area: "Woraiyur", source: "App", notes: "1500 litre tank" },
  { id: "FN-1005", customer: "Vignesh", phone: "9888877777", email: "vignesh@example.com", address: "KK Nagar, Trichy", service: "Carpet Shampooing", serviceIcon: "🧶", amount: 1800, workStatus: "Assigned", paymentStatus: "Pending", payout: 900, teamPayout: 750, fnMargin: 900, status: "Assigned", staff: "Selva", team: ["Selva"], date: "2026-06-02", time: "02:00 PM", area: "KK Nagar", source: "App", notes: "60 sq.ft carpet" },
  { id: "FN-1006", customer: "Janani", phone: "9777766666", email: "janani@example.com", address: "BHEL Township, Trichy", service: "Termite Control Treatment", serviceIcon: "🛡️", amount: 6500, workStatus: "Not Started", paymentStatus: "Pending", payout: 3500, teamPayout: 3000, fnMargin: 3000, status: "Pending", staff: "Amit", team: ["Amit", "Ravi"], date: "2026-06-15", time: "11:30 AM", area: "BHEL Township", source: "Google", notes: "Termite treatment full house" },
];

const initialStaff = [
  { id: 1, name: "Selva", role: "Supervisor", status: "Present", jobs: 4, salary: 28000, advance: 2000 },
  { id: 2, name: "Ravi", role: "Cleaner", status: "Present", jobs: 3, salary: 22000, advance: 1000 },
  { id: 3, name: "Manoj", role: "Cleaner", status: "Absent", jobs: 1, salary: 20000, advance: 0 },
  { id: 4, name: "Amit", role: "Pest Expert", status: "Present", jobs: 2, salary: 26000, advance: 1500 },
];

const initialInventory = [
  { id: 1, item: "Shampoo Chemical", stock: 12, min: 10, unit: "L" },
  { id: 2, item: "Microfiber Cloth", stock: 45, min: 20, unit: "pcs" },
  { id: 3, item: "Pest Spray", stock: 4, min: 8, unit: "L" },
  { id: 4, item: "Gloves", stock: 18, min: 25, unit: "pair" },
];

const initialExpenses = [
  { id: 1, title: "Fuel", amount: 1200, date: "2026-05-17", category: "Transport" },
  { id: 2, title: "Chemical purchase", amount: 4200, date: "2026-05-16", category: "Inventory" },
  { id: 3, title: "Instagram ad", amount: 1500, date: "2026-05-15", category: "Marketing" },
];

const initialComplaints = [
  { id: 1, customer: "Karthik", issue: "Staff reached late", priority: "Medium", status: "Open" },
  { id: 2, customer: "Meena", issue: "Sofa stain not fully removed", priority: "High", status: "Reviewing" },
];

const statusStyle = {
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",
  Assigned: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200",
  Completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
  Cancelled: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200",
  Open: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200",
  Reviewing: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",
  Resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
};

function cn(...classes) { return classes.filter(Boolean).join(" "); }
function Card({ children, className = "" }) { return <div className={cn("rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900", className)}>{children}</div>; }
function Badge({ children, tone }) { return <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", statusStyle[tone] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200")}>{children}</span>; }
function DataInput({ value, onChange, className = "", type = "text", disabled = false }) { return <input disabled={disabled} type={type} value={value} onChange={(e) => onChange(e.target.value)} className={cn("w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#d4af37] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:disabled:bg-slate-800", className)} />; }

function StatCard({ title, value, icon: Icon, sub }) {
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}><Card className="relative overflow-hidden"><div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#d4af37]/20" /><div className="flex items-center justify-between"><div><p className="text-sm text-slate-500 dark:text-slate-400">{title}</p><h3 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{value}</h3><p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{sub}</p></div><div className="rounded-2xl bg-[#0b1f3a] p-3 text-[#d4af37] dark:bg-white/10"><Icon size={24} /></div></div></Card></motion.div>;
}

function ServiceVisual({ icon, name, photo, compact = false }) {
  return <div className={cn("relative overflow-hidden rounded-3xl bg-slate-200 shadow-inner dark:bg-slate-800", compact ? "h-14 w-14" : "h-40 w-full")}><img src={photo || SERVICE_PHOTOS[name] || SERVICE_PHOTOS["Deep Home Cleaning"]} alt={name} className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" /><div className={cn("absolute flex items-center justify-center rounded-2xl bg-white/90 shadow-lg", compact ? "bottom-1 left-1 h-8 w-8 text-lg" : "bottom-3 left-3 h-12 w-12 text-2xl")}>{icon || "🧹"}</div>{!compact && <div className="absolute bottom-4 left-20 right-3 text-xs font-bold text-white drop-shadow">{name}</div>}</div>;
}

export default function FreshNestAdminERP() {
  const [dark, setDark] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const [query, setQuery] = useState("");
  const [bookings, setBookings] = useState(initialBookings);
  const [services, setServices] = useState(FN_SERVICES);
  const [staff, setStaff] = useState(initialStaff);
  const [inventory, setInventory] = useState(initialInventory);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [complaints, setComplaints] = useState(initialComplaints);
  const [notifications, setNotifications] = useState(["New app booking synced: Water Tank Cleaning", "Low stock alert: Pest Spray", "Payment received for FN-1003"]);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 4, 1));
  const [selectedDate, setSelectedDate] = useState("2026-05-17");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editMode, setEditMode] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);

  const totalRevenue = bookings.filter((b) => b.status === "Completed").reduce((sum, b) => sum + b.amount, 0);
  const pendingCount = bookings.filter((b) => b.status === "Pending").length;
  const completedCount = bookings.filter((b) => b.status === "Completed").length;
  const lowStock = inventory.filter((i) => i.stock <= i.min);
  const stockAlertNotes = lowStock.map((i) => `Low stock alert: ${i.item} only ${i.stock} ${i.unit} left`);
  const allNotifications = [...notifications, ...stockAlertNotes];

  const filteredBookings = useMemo(() => {
    const q = query.toLowerCase();
    return bookings.filter((b) => [b.customer, b.service, b.area, b.status, b.id].join(" ").toLowerCase().includes(q));
  }, [bookings, query]);

  const nav = [["Dashboard", LayoutDashboard], ["Supervisor App", UserCheck], ["Live Bookings", ClipboardList], ["Calendar", CalendarDays], ["Customers CRM", Users], ["Complaints", MessageSquareWarning], ["Services", Sparkles], ["Attendance", UserCheck], ["Payroll", Wallet], ["Inventory", Package], ["Expenses", ReceiptText], ["Payments", CreditCard], ["Invoices", ReceiptText], ["Marketing", TrendingUp], ["Reports", FileBarChart], ["Settings", Settings]];

  function updateBooking(id, key, value) {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, [key]: value, ...(key === "status" ? { workStatus: value === "Pending" ? "Not Started" : value } : {}) } : b)));
  }

  function supervisorUpdate(id, workStatus, paymentStatus = null) {
    setBookings((prev) => prev.map((b) => {
      if (b.id !== id) return b;
      const nextStatus = workStatus === "Completed" ? "Completed" : workStatus === "On The Way" || workStatus === "Live" ? "Assigned" : b.status;
      return { ...b, workStatus, status: nextStatus, paymentStatus: paymentStatus || b.paymentStatus };
    }));
    const target = bookings.find((b) => b.id === id);
    setNotifications((prev) => [`Supervisor update: ${id} ${target?.customer || ""} is ${workStatus}${paymentStatus ? ` / ${paymentStatus}` : ""}`, ...prev]);
  }

  function openWhatsApp(booking) {
    const msg = encodeURIComponent(`Hi ${booking.customer}, FreshNest booking ${booking.id} for ${booking.service} is scheduled on ${booking.date} at ${booking.time}. Status: ${booking.workStatus || booking.status}.`);
    window.open(`https://wa.me/91${booking.phone}?text=${msg}`, "_blank", "noopener,noreferrer");
  }

  function syncAppBooking() {
    const next = { id: `FN-${1000 + bookings.length + 1}`, customer: "New App Customer", phone: "9999988888", email: "appcustomer@example.com", address: "15, Demo Street, KK Nagar, Trichy", service: "Exterior Pressure Washing", serviceIcon: "🚿", amount: 2400, workStatus: "Not Started", paymentStatus: "Pending", payout: 1200, teamPayout: 1000, fnMargin: 1200, status: "Pending", staff: "Unassigned", team: ["Unassigned"], date: "2026-05-19", time: "11:00 AM", area: "Trichy - KK Nagar", source: "App", notes: "Auto synced from app booking simulation" };
    setBookings([next, ...bookings]);
    setNotifications([`New app booking synced: ${next.id}`, ...notifications]);
    setActive("Live Bookings");
  }

  function addRow(type) {
    if (type === "staff") setStaff((prev) => [...prev, { id: Date.now(), name: "New Staff", role: "Cleaner", status: "Present", jobs: 0, salary: 20000, advance: 0 }]);
    if (type === "inventory") setInventory((prev) => [...prev, { id: Date.now(), item: "New Item", stock: 0, min: 5, unit: "pcs" }]);
    if (type === "expense") setExpenses((prev) => [...prev, { id: Date.now(), title: "New Expense", amount: 0, date: "2026-05-18", category: "General" }]);
    if (type === "complaint") setComplaints((prev) => [...prev, { id: Date.now(), customer: "New Customer", issue: "New issue", priority: "Medium", status: "Open" }]);
  }

  function LoginScreen() {
    return <div className="min-h-screen bg-[#07162a] p-5 text-white"><div className="mx-auto flex min-h-[90vh] max-w-6xl items-center justify-center"><motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 shadow-2xl backdrop-blur md:grid-cols-2"><div className="relative hidden p-10 md:block"><div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/30 to-transparent" /><div className="relative z-10"><div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-4xl shadow-xl">🧹</div><h1 className="text-5xl font-black tracking-tight">FreshNest Admin ERP</h1><p className="mt-4 max-w-md text-white/75">Urban-style cleaning business command center for bookings, staff, payments, stock, reports and customer support.</p><div className="mt-10 grid gap-3">{["Live booking sync", "Editable service pricing", "Payroll + attendance", "Inventory alerts"].map((x) => <div key={x} className="flex items-center gap-3 rounded-2xl bg-white/10 p-3"><ShieldCheck className="text-[#d4af37]" /> {x}</div>)}</div></div></div><div className="bg-white p-8 text-slate-950 dark:bg-slate-950 dark:text-white"><h2 className="text-3xl font-black">Admin Login</h2><p className="mt-2 text-sm text-slate-500">Demo login. Click button to enter dashboard.</p><div className="mt-8 space-y-4"><DataInput value="admin@freshnest.in" onChange={() => {}} /><DataInput type="password" value="freshnest123" onChange={() => {}} /><button onClick={() => setLoggedIn(true)} className="w-full rounded-2xl bg-[#0b1f3a] px-5 py-3 font-bold text-[#d4af37] shadow-lg transition hover:scale-[1.01]">Login to ERP</button></div><div className="mt-8 rounded-3xl bg-slate-100 p-4 dark:bg-slate-900"><p className="text-sm font-bold">Owners</p><p className="mt-1 text-sm text-slate-500">Neethirajan & Selva Kumar</p></div></div></motion.div></div></div>;
  }

  function Shell({ children }) {
    return <div className={dark ? "dark" : ""}><div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-[#06111f] dark:text-white"><aside className="fixed left-0 top-0 z-20 hidden h-full w-72 border-r border-slate-200 bg-[#07162a] p-4 text-white dark:border-slate-800 lg:block"><div className="mb-6 flex items-center gap-3 rounded-3xl bg-white/10 p-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl">🧹</div><div><h1 className="font-black leading-tight">FreshNest</h1><p className="text-xs text-[#d4af37]">Admin ERP</p></div></div><nav className="space-y-1 overflow-y-auto pb-4">{nav.map(([name, Icon]) => <button key={name} onClick={() => setActive(name)} className={cn("flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition", active === name ? "bg-[#d4af37] text-[#07162a]" : "text-white/75 hover:bg-white/10 hover:text-white")}><Icon size={18} /> {name}</button>)}</nav></aside><main className="lg:pl-72"><header className="sticky top-0 z-10 border-b border-slate-200 bg-white/85 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-[#06111f]/85"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-black">{active}</h2><p className="text-sm text-slate-500">FN cleaning operations control panel</p></div><div className="flex items-center gap-2"><div className="relative hidden sm:block"><Search className="absolute left-3 top-2.5 text-slate-400" size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search bookings, customers..." className="w-72 rounded-2xl border border-slate-200 bg-white py-2 pl-10 pr-4 outline-none focus:border-[#d4af37] dark:border-slate-700 dark:bg-slate-900" /></div><button onClick={syncAppBooking} className="rounded-2xl bg-[#0b1f3a] px-4 py-2 text-sm font-bold text-[#d4af37]"><Plus size={16} className="inline" /> App Sync</button><button onClick={() => setDark((v) => !v)} className={cn("flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-bold transition", dark ? "border-[#d4af37] bg-[#d4af37] text-[#07162a]" : "border-slate-200 bg-white text-[#0b1f3a]")}>{dark ? <Sun size={18} /> : <Moon size={18} />} {dark ? "Bright" : "Night"}</button><div className="relative"><button onClick={() => setShowNotifications(!showNotifications)} className="relative rounded-2xl border border-slate-200 p-2 dark:border-slate-700"><Bell /><span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-[#d4af37] text-[10px] font-bold text-[#07162a]">{allNotifications.length}</span></button>{showNotifications && <div className="absolute right-0 top-12 z-50 w-80 rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-950"><div className="mb-2 flex items-center justify-between"><b>Notifications</b><button onClick={() => setShowNotifications(false)}><X size={16}/></button></div><div className="max-h-80 space-y-2 overflow-y-auto">{allNotifications.map((n, i) => <div key={i} className="rounded-2xl bg-slate-100 p-3 text-sm dark:bg-slate-800">🔔 {n}</div>)}</div></div>}</div><button onClick={() => setLoggedIn(false)} className="rounded-2xl border border-slate-200 p-2 dark:border-slate-700"><LogOut /></button></div></div></header><div className="p-4 md:p-6">{children}</div></main></div></div>;
  }

  function Dashboard() {
    return <div className="space-y-6"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={IndianRupee} sub="Completed jobs only" /><StatCard title="Pending Bookings" value={pendingCount} icon={Clock3} sub="Need assignment" /><StatCard title="Completed Jobs" value={completedCount} icon={CheckCircle2} sub="This month" /><StatCard title="Low Stock Alerts" value={lowStock.length} icon={Package} sub="Inventory attention" /></div><div className="grid gap-4 xl:grid-cols-3"><Card className="xl:col-span-2"><h3 className="mb-4 text-lg font-black">Live Booking Flow</h3><BookingTable compact /></Card><Card><h3 className="mb-4 text-lg font-black">Notifications + Stock Alerts</h3><div className="space-y-3">{allNotifications.map((n, i) => <div key={i} className="rounded-2xl bg-slate-100 p-3 text-sm dark:bg-slate-800">🔔 {n}</div>)}</div></Card></div></div>;
  }

  function BookingTable({ compact = false }) {
    const rows = compact ? filteredBookings.slice(0, 5) : filteredBookings;
    return <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800">{["ID","Customer","Service","Date","Area","Staff","Status","Amount","Action"].map(h => <th key={h} className="py-3 pr-4">{h}</th>)}</tr></thead><tbody>{rows.map(b => <tr key={b.id} className="border-b border-slate-100 dark:border-slate-800"><td className="py-3 pr-4 font-bold">{b.id}</td><td className="py-3 pr-4"><div className="font-bold">{b.customer}</div><div className="flex items-center gap-1 text-xs text-slate-500"><Phone size={12}/>{b.phone}</div></td><td className="py-3 pr-4">{b.service}</td><td className="py-3 pr-4">{b.date}<br/><span className="text-xs text-slate-500">{b.time}</span></td><td className="py-3 pr-4"><span className="flex items-center gap-1"><MapPin size={14}/>{b.area}</span></td><td className="py-3 pr-4"><select value={b.staff} onChange={(e)=>updateBooking(b.id,"staff",e.target.value)} className="rounded-xl border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-950">{["Unassigned",...staff.map(s=>s.name)].map(x=><option key={x}>{x}</option>)}</select></td><td className="py-3 pr-4"><select value={b.status} onChange={(e)=>updateBooking(b.id,"status",e.target.value)} className="rounded-xl border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-950">{["Pending","Assigned","Completed","Cancelled"].map(x=><option key={x}>{x}</option>)}</select><div className="mt-2"><Badge tone={b.status}>{b.status}</Badge></div></td><td className="py-3 pr-4 font-bold">₹{b.amount}</td><td className="py-3 pr-4"><button onClick={() => setSelectedBooking(b)} className="rounded-xl bg-[#0b1f3a] px-3 py-2 text-xs font-bold text-[#d4af37]">Open</button></td></tr>)}</tbody></table>{selectedBooking && <CustomerDrawer booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}</div>;
  }

  function LiveBookings() { return <Card><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h3 className="text-lg font-black">All Bookings</h3><button onClick={syncAppBooking} className="rounded-2xl bg-[#d4af37] px-4 py-2 font-bold text-[#07162a]"><Plus size={16} className="inline"/> Simulate App Booking</button></div><BookingTable /></Card>; }

  function Services() { return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{services.map(s => { const editing = !!editMode[`service-${s.id}`]; return <Card key={s.id}><ServiceVisual icon={s.image} name={s.name} photo={s.photo} /><div className="mt-4 flex items-start justify-between"><div><h3 className="text-lg font-black">{s.name}</h3><p className="text-sm text-slate-500">{s.category} • {s.unit}</p></div><Badge tone="Assigned">{editing ? "Editing" : "Locked"}</Badge></div><div className="mt-4 flex items-center gap-2"><span className="font-bold">₹</span><DataInput disabled={!editing} type="number" value={s.rate} onChange={(v)=>setServices(prev=>prev.map(x=>x.id===s.id?{...x,rate:Number(v)}:x))}/><span className="text-sm text-slate-500">/{s.unit}</span></div><button onClick={() => setEditMode((m)=>({...m,[`service-${s.id}`]:!editing}))} className="mt-4 rounded-2xl bg-[#0b1f3a] px-4 py-2 text-sm font-bold text-[#d4af37]"><Edit3 size={15} className="inline"/> {editing ? "Lock / Save" : "Edit"}</button></Card>})}</div>; }

  function SimpleEditableTable({ title, rows, columns, setRows, onAdd, addLabel = "Add" }) {
    return <Card><div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-black">{title}</h3>{onAdd && <button onClick={onAdd} className="rounded-2xl bg-[#0b1f3a] px-4 py-2 text-sm font-bold text-[#d4af37]"><Plus size={15} className="inline"/> {addLabel}</button>}</div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800">{columns.map(c=><th className="py-3 pr-4" key={c.key}>{c.label}</th>)}<th>Mode</th></tr></thead><tbody>{rows.map((r,idx)=>{ const rowKey = `${title}-${r.id || idx}`; const editing = !!editMode[rowKey]; return <tr key={r.id || idx} className="border-b border-slate-100 dark:border-slate-800">{columns.map(c=><td className="py-3 pr-4" key={c.key}>{c.edit ? <DataInput disabled={!editing} value={r[c.key]} onChange={(v)=>setRows(prev=>prev.map((x,i)=>i===idx?{...x,[c.key]: c.num?Number(v):v}:x))}/> : c.badge ? <Badge tone={r[c.key]}>{r[c.key]}</Badge> : r[c.key]}</td>)}<td><button onClick={() => setEditMode((m)=>({...m,[rowKey]:!editing}))} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold dark:bg-slate-800"><Edit3 size={14} className="inline"/> {editing ? "Lock" : "Edit"}</button></td></tr>})}</tbody></table></div></Card>;
  }

  function CalendarView() {
    const year = calendarMonth.getFullYear(); const month = calendarMonth.getMonth(); const monthName = calendarMonth.toLocaleString("default", { month: "long", year: "numeric" }); const firstDay = new Date(year, month, 1).getDay(); const daysInMonth = new Date(year, month + 1, 0).getDate(); const cells = Array.from({ length: firstDay }, () => null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1)); const selectedList = bookings.filter((b) => b.date === selectedDate);
    const moveMonth = (step) => { const next = new Date(year, month + step, 1); setCalendarMonth(next); setSelectedDate(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-01`); };
    return <div className="grid gap-5 xl:grid-cols-[1.3fr_.7fr]"><Card><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-xl font-black">Monthly Booking Calendar</h3><p className="text-sm text-slate-500">All months Prev / Next navigate pannalam</p></div><div className="flex items-center gap-2"><button onClick={() => moveMonth(-1)} className="rounded-2xl border border-slate-200 p-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"><ChevronLeft /></button><div className="min-w-48 rounded-2xl bg-[#0b1f3a] px-4 py-2 text-center font-black text-[#d4af37]">{monthName}</div><button onClick={() => moveMonth(1)} className="rounded-2xl border border-slate-200 p-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"><ChevronRight /></button></div></div><div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d} className="py-2">{d}</div>)}</div><div className="grid grid-cols-7 gap-2">{cells.map((day, i) => { if (!day) return <div key={`blank-${i}`} className="min-h-28 rounded-3xl bg-slate-50 dark:bg-slate-900/40" />; const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`; const dayBookings = bookings.filter((b) => b.date === dateKey); const activeDate = selectedDate === dateKey; return <button key={dateKey} onClick={() => setSelectedDate(dateKey)} className={cn("min-h-28 rounded-3xl border p-2 text-left transition hover:scale-[1.01]", activeDate ? "border-[#d4af37] bg-[#d4af37]/15" : "border-slate-200 bg-white hover:border-[#d4af37] dark:border-slate-800 dark:bg-slate-950")}><div className="flex items-center justify-between"><span className="font-black">{day}</span>{dayBookings.length > 0 && <span className="rounded-full bg-[#0b1f3a] px-2 py-1 text-[10px] font-bold text-[#d4af37]">{dayBookings.length} booking</span>}</div><div className="mt-2 space-y-1">{dayBookings.slice(0, 3).map((b) => <div key={b.id} className="truncate rounded-xl bg-slate-100 px-2 py-1 text-[11px] font-semibold dark:bg-slate-800">{b.serviceIcon || "🧹"} {b.customer}</div>)}</div></button>; })}</div></Card><Card><div className="mb-4 flex items-center justify-between"><div><h3 className="text-lg font-black">Date Bookings</h3><p className="text-sm text-slate-500">{selectedDate}</p></div><Badge tone={selectedList.length ? "Assigned" : "Pending"}>{selectedList.length} Jobs</Badge></div><div className="space-y-3">{selectedList.length === 0 && <div className="rounded-3xl bg-slate-100 p-5 text-center text-sm text-slate-500 dark:bg-slate-800">Intha date la bookings illa da.</div>}{selectedList.map((b) => <button key={b.id} onClick={() => setSelectedBooking(b)} className="w-full rounded-3xl border border-slate-200 p-4 text-left transition hover:border-[#d4af37] hover:shadow-md dark:border-slate-800"><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-3"><ServiceVisual compact icon={b.serviceIcon} name={b.service} photo={SERVICE_PHOTOS[b.service]} /><h4 className="font-black">{b.customer}</h4></div><p className="mt-1 text-sm text-slate-500">{b.service}</p><p className="mt-1 text-xs text-slate-500">{b.time} • {b.area}</p></div><Badge tone={b.status}>{b.workStatus || b.status}</Badge></div></button>)}</div></Card>{selectedBooking && <CustomerDrawer booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}</div>;
  }

  function CustomerDrawer({ booking, onClose }) {
    const payoutBalance = Math.max(0, Number(booking.payout || 0) - Number(booking.teamPayout || 0));
    return <div className="fixed inset-0 z-50 flex justify-end bg-black/50 p-3 backdrop-blur-sm"><motion.div initial={{ x: 420, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="h-full w-full max-w-xl overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl dark:bg-slate-950"><div className="sticky top-0 z-10 mb-4 flex items-center justify-between bg-white/90 pb-3 backdrop-blur dark:bg-slate-950/90"><div><h3 className="text-2xl font-black">{booking.customer}</h3><p className="text-sm text-slate-500">{booking.id} full booking drawer</p></div><button onClick={onClose} className="rounded-2xl border border-slate-200 p-2 dark:border-slate-800"><X /></button></div><div className="grid gap-4"><Card className="bg-slate-50 dark:bg-slate-900"><div className="flex items-start gap-4"><ServiceVisual compact icon={booking.serviceIcon} name={booking.service} photo={SERVICE_PHOTOS[booking.service]} /><div className="flex-1"><h4 className="font-black">Customer Full Details</h4><p className="mt-2 text-sm"><UserRound size={15} className="mr-1 inline"/> {booking.customer}</p><p className="mt-1 text-sm"><Phone size={15} className="mr-1 inline"/> {booking.phone}</p><p className="mt-1 text-sm"><MapPin size={15} className="mr-1 inline"/> {booking.address || booking.area}</p></div></div><button onClick={() => openWhatsApp(booking)} className="mt-4 w-full rounded-2xl bg-emerald-600 px-4 py-3 font-bold text-white"><MessageCircle size={18} className="inline"/> WhatsApp Customer</button></Card><Card><h4 className="mb-3 flex items-center gap-2 font-black"><BriefcaseBusiness className="text-[#d4af37]"/> Work / Service Details</h4><div className="grid gap-3 text-sm"><div className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800"><b>Service:</b> <span className="text-xl">{booking.serviceIcon}</span> {booking.service}</div><div className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800"><b>Date & Time:</b> {booking.date} • {booking.time}</div><div className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800"><b>Notes:</b> {booking.notes}</div><div className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800"><ImageIcon size={15} className="mr-1 inline"/><b>Service Image Icon:</b> {booking.serviceIcon || "🧹"} demo icon ready</div></div></Card><Card><h4 className="mb-3 font-black">Status Control</h4><select value={booking.workStatus || booking.status} onChange={(e) => { updateBooking(booking.id, "workStatus", e.target.value); setSelectedBooking({ ...booking, workStatus: e.target.value }); }} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold outline-none dark:border-slate-700 dark:bg-slate-900">{["Not Started","Assigned","Live","Completed"].map((x) => <option key={x}>{x}</option>)}</select><div className="mt-3"><Badge tone={booking.status}>{booking.workStatus || booking.status}</Badge></div></Card><Card><h4 className="mb-3 flex items-center gap-2 font-black"><CreditCard className="text-[#d4af37]"/> Payment Status</h4><div className="grid gap-3 md:grid-cols-2"><div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800"><p className="text-xs text-slate-500">Customer Amount</p><p className="text-2xl font-black">₹{booking.amount}</p></div><div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800"><p className="text-xs text-slate-500">Payment</p><p className="text-xl font-black">{booking.paymentStatus}</p></div></div></Card><Card><h4 className="mb-3 flex items-center gap-2 font-black"><HandCoins className="text-[#d4af37]"/> Payout Details</h4><div className="grid gap-3 md:grid-cols-3"><div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800"><p className="text-xs text-slate-500">Total Payout</p><p className="text-xl font-black">₹{booking.payout}</p></div><div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800"><p className="text-xs text-slate-500">Team Payout</p><p className="text-xl font-black">₹{booking.teamPayout}</p></div><div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800"><p className="text-xs text-slate-500">FN Margin</p><p className="text-xl font-black text-emerald-600">₹{booking.fnMargin}</p></div></div><div className="mt-3 rounded-2xl bg-[#0b1f3a] p-4 text-sm text-white"><b>Team:</b> {(booking.team || []).join(", ")} • <b>Balance payout:</b> ₹{payoutBalance}</div></Card></div></motion.div></div>;
  }

  function SupervisorApp() {
    const supervisorJobs = bookings.filter((b) => b.staff !== "Unassigned" || b.status !== "Completed");
    return <div className="mx-auto max-w-5xl space-y-5"><Card className="bg-[#07162a] text-white"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-2xl font-black">Supervisor Mobile App</h3><p className="text-sm text-white/70">Inga update panna admin dashboard, calendar, booking drawer la live sync aagum.</p></div><Badge tone="Assigned">Live Sync ON</Badge></div></Card><div className="grid gap-4 md:grid-cols-2">{supervisorJobs.map((b) => <Card key={b.id} className="overflow-hidden p-0"><ServiceVisual icon={b.serviceIcon} name={b.service} photo={SERVICE_PHOTOS[b.service]} /><div className="p-5"><div className="flex items-start justify-between gap-3"><div><h4 className="text-xl font-black">{b.customer}</h4><p className="text-sm text-slate-500">{b.id} • {b.service}</p><p className="mt-1 text-sm text-slate-500">{b.date} • {b.time}</p></div><Badge tone={b.status}>{b.workStatus || b.status}</Badge></div><div className="mt-4 grid grid-cols-2 gap-2"><button onClick={() => supervisorUpdate(b.id, "On The Way")} className="rounded-2xl bg-blue-600 px-3 py-3 text-sm font-bold text-white">On The Way</button><button onClick={() => supervisorUpdate(b.id, "Live")} className="rounded-2xl bg-amber-500 px-3 py-3 text-sm font-bold text-[#07162a]">Live</button><button onClick={() => supervisorUpdate(b.id, "Completed")} className="rounded-2xl bg-emerald-600 px-3 py-3 text-sm font-bold text-white">Completed</button><button onClick={() => supervisorUpdate(b.id, b.workStatus || "Completed", "Paid")} className="rounded-2xl bg-[#0b1f3a] px-3 py-3 text-sm font-bold text-[#d4af37]">Paid</button></div><div className="mt-4 rounded-2xl bg-slate-100 p-3 text-sm dark:bg-slate-800"><b>Payment:</b> {b.paymentStatus} • <b>FN Margin:</b> ₹{b.fnMargin}</div></div></Card>)}</div></div>;
  }

  function CustomersCRM() { const customers = bookings.map(b=>({id:b.id, name:b.customer, phone:b.phone, area:b.area, lastService:b.service, source:b.source})); return <SimpleEditableTable title="Customers CRM" rows={customers} setRows={()=>{}} columns={[{key:"name",label:"Customer"},{key:"phone",label:"Phone"},{key:"area",label:"Area"},{key:"lastService",label:"Last Service"},{key:"source",label:"Source"}]} />; }
  function Complaints() { return <SimpleEditableTable title="Complaints Management" rows={complaints} setRows={setComplaints} onAdd={() => addRow("complaint")} addLabel="Add Complaint" columns={[{key:"customer",label:"Customer",edit:true},{key:"issue",label:"Issue",edit:true},{key:"priority",label:"Priority",edit:true},{key:"status",label:"Status",badge:true}]} />; }
  function Inventory() { return <SimpleEditableTable title="Inventory + Stock Alerts" rows={inventory} setRows={setInventory} onAdd={() => addRow("inventory")} addLabel="Add Item" columns={[{key:"item",label:"Item",edit:true},{key:"stock",label:"Stock",edit:true,num:true},{key:"min",label:"Minimum",edit:true,num:true},{key:"unit",label:"Unit",edit:true}]} />; }
  function Expenses() { return <SimpleEditableTable title="Expenses" rows={expenses} setRows={setExpenses} onAdd={() => addRow("expense")} addLabel="Add Expense" columns={[{key:"title",label:"Title",edit:true},{key:"amount",label:"Amount",edit:true,num:true},{key:"date",label:"Date",edit:true},{key:"category",label:"Category",edit:true}]} />; }
  function Attendance() { return <SimpleEditableTable title="Staff Attendance" rows={staff} setRows={setStaff} onAdd={() => addRow("staff")} addLabel="Add Staff" columns={[{key:"name",label:"Name",edit:true},{key:"role",label:"Role",edit:true},{key:"status",label:"Status",edit:true},{key:"jobs",label:"Jobs",edit:true,num:true}]} />; }
  function Payroll() { return <SimpleEditableTable title="Payroll Editable" rows={staff} setRows={setStaff} onAdd={() => addRow("staff")} addLabel="Add Staff" columns={[{key:"name",label:"Staff",edit:true},{key:"role",label:"Role",edit:true},{key:"salary",label:"Salary",edit:true,num:true},{key:"advance",label:"Advance",edit:true,num:true}]} />; }
  function Payments() { return <Card><h3 className="mb-4 text-lg font-black">Payments</h3><BookingTable compact/><div className="mt-4 rounded-3xl bg-slate-100 p-4 dark:bg-slate-800"><p className="font-bold">Payment gateway ready layout</p><p className="text-sm text-slate-500">UPI, cash, card and pending payment tracking can be connected with real backend.</p></div></Card>; }
  function Invoices() { return <Card><h3 className="mb-4 text-lg font-black">Invoices</h3><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{bookings.map(b=><div key={b.id} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800"><div className="flex items-center justify-between"><h4 className="font-black">Invoice {b.id}</h4><ReceiptText className="text-[#d4af37]"/></div><p className="mt-2 text-sm text-slate-500">{b.customer} • {b.service}</p><p className="mt-3 text-2xl font-black">₹{b.amount}</p><button onClick={() => alert(`Invoice ${b.id} download placeholder`)} className="mt-4 rounded-2xl bg-[#0b1f3a] px-4 py-2 text-sm font-bold text-[#d4af37]"><Download size={15} className="inline"/> Download</button></div>)}</div></Card>; }
  function Marketing() { const sources = ["WhatsApp","Instagram","Google","App"]; return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{sources.map(src=>{const count=bookings.filter(b=>b.source===src).length; return <Card key={src}><TrendingUp className="text-[#d4af37]"/><h3 className="mt-4 text-xl font-black">{src}</h3><p className="mt-2 text-3xl font-black">{count}</p><p className="text-sm text-slate-500">Leads / bookings</p></Card>})}</div>; }
  function Reports() { return <div className="grid gap-4 xl:grid-cols-2"><Card><h3 className="text-lg font-black">Monthly Report</h3><div className="mt-4 space-y-3"><p>Revenue: <b>₹{totalRevenue}</b></p><p>Total bookings: <b>{bookings.length}</b></p><p>Completed: <b>{completedCount}</b></p><p>Expenses: <b>₹{expenses.reduce((s,e)=>s+e.amount,0)}</b></p></div></Card><Card><h3 className="text-lg font-black">Service Ratings</h3><div className="mt-4 space-y-3">{["Sofa Cleaning","Deep Cleaning","Pest Control"].map((x,i)=><div key={x} className="flex items-center justify-between rounded-2xl bg-slate-100 p-3 dark:bg-slate-800"><span>{x}</span><span className="flex items-center gap-1 font-bold"><Star size={16} className="text-[#d4af37]"/> {4.9-i/10}</span></div>)}</div></Card></div>; }
  function SettingsView() { return <Card><h3 className="text-lg font-black">Settings</h3><div className="mt-4 grid gap-4 md:grid-cols-2"><DataInput value="FreshNest Cleaning Services" onChange={()=>{}}/><DataInput value="Trichy" onChange={()=>{}}/><DataInput value="neethikottiyal@gmail.com" onChange={()=>{}}/><button className="rounded-2xl bg-[#0b1f3a] px-4 py-2 font-bold text-[#d4af37]"><Send size={16} className="inline"/> Save Settings</button></div></Card>; }

  function Screen() {
    const map = { Dashboard, "Supervisor App": SupervisorApp, "Live Bookings": LiveBookings, Calendar: CalendarView, "Customers CRM": CustomersCRM, Complaints, Services, Attendance, Payroll, Inventory, Expenses, Payments, Invoices, Marketing, Reports, Settings: SettingsView };
    const Component = map[active] || Dashboard;
    return <Component />;
  }

  if (!loggedIn) return <LoginScreen />;
  return <Shell><Screen /></Shell>;
}
