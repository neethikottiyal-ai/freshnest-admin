import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell, CalendarDays, CheckCircle2, ClipboardList, CreditCard, IndianRupee,
  LayoutDashboard, MapPin, Moon, Package, Phone, Plus, ReceiptText, Search,
  Settings, Sparkles, Sun, TrendingUp, UserCheck, Users, Wallet, X,
  ChevronLeft, ChevronRight, Edit3, Trash2, FileText
} from "lucide-react";

const START_SERVICES = [
  { id: 1, name: "Sofa Shampooing", rate: 550, unit: "seat", icon: "🛋️", category: "Shampooing" },
  { id: 2, name: "Mattress Shampooing - Single", rate: 950, unit: "unit", icon: "🛏️", category: "Mattress" },
  { id: 3, name: "Mattress Shampooing - Double", rate: 1100, unit: "unit", icon: "🛏️", category: "Mattress" },
  { id: 4, name: "Mattress Shampooing - King/Queen", rate: 1200, unit: "unit", icon: "👑", category: "Mattress" },
  { id: 5, name: "Furnished Deep Cleaning", rate: 8.5, unit: "sq.ft", icon: "🏠", category: "Deep Cleaning" },
  { id: 6, name: "Unfurnished Deep Cleaning", rate: 7.5, unit: "sq.ft", icon: "🧹", category: "Deep Cleaning" },
  { id: 7, name: "Water Tank Cleaning", rate: 2, unit: "litre", icon: "💧", category: "Tank" },
  { id: 8, name: "Carpet Shampooing", rate: 30, unit: "sq.ft", icon: "🧶", category: "Shampooing" },
  { id: 9, name: "General Pest Control", rate: 3000, unit: "starting", icon: "🐜", category: "Pest Control" },
  { id: 10, name: "Termite Pest Control", rate: 14, unit: "sq.ft", icon: "🛡️", category: "Pest Control" },
  { id: 11, name: "AC Filter Cleaning", rate: 350, unit: "unit", icon: "🌬️", category: "Appliance" },
  { id: 12, name: "Balance Work", rate: 0, unit: "custom", icon: "➕", category: "Extra Work" },
];

const START_BOOKINGS = [
  { id: "FN-1001", customer: "Arun Kumar", phone: "9876543210", area: "Thillai Nagar", address: "12, North Street, Trichy", service: "Sofa Shampooing", qty: 4, amount: 2200, date: "2026-05-19", time: "10:30 AM", staff: "Ravi Kumar", status: "Pending", payment: "Pending", source: "WhatsApp", startKm: "", pickupKm: "", siteKm: "", returnKm: "", balanceWork: "" },
  { id: "FN-1002", customer: "Priya S", phone: "9840012345", area: "Cantonment", address: "8, Main Road, Trichy", service: "Furnished Deep Cleaning", qty: 1000, amount: 8500, date: "2026-05-19", time: "12:00 PM", staff: "Selva Kumar", status: "On The Way", payment: "Advance Paid", source: "Instagram", startKm: "65000", pickupKm: "65004", siteKm: "65018", returnKm: "", balanceWork: "Kitchen grease extra" },
  { id: "FN-1003", customer: "Mohammed Ali", phone: "9123456789", area: "Srirangam", address: "22, Temple Road", service: "Termite Pest Control", qty: 450, amount: 6300, date: "2026-06-08", time: "04:00 PM", staff: "Amit Singh", status: "Completed", payment: "Paid", source: "Google", startKm: "12000", pickupKm: "12003", siteKm: "12014", returnKm: "12028", balanceWork: "" },
];

const START_STAFF = [
  { id: 1, name: "Selva Kumar", role: "Supervisor", status: "Present", salary: 28000, advance: 2000 },
  { id: 2, name: "Ravi Kumar", role: "Cleaner", status: "Present", salary: 22000, advance: 1000 },
  { id: 3, name: "Amit Singh", role: "Pest Expert", status: "Present", salary: 26000, advance: 0 },
  { id: 4, name: "Manoj Kumar", role: "Cleaner", status: "Absent", salary: 20000, advance: 0 },
];

const START_INVENTORY = [
  { id: 1, item: "Shampoo Chemical", stock: 12, min: 10, unit: "L" },
  { id: 2, item: "Microfiber Cloth", stock: 45, min: 20, unit: "pcs" },
  { id: 3, item: "Pest Spray", stock: 4, min: 8, unit: "L" },
  { id: 4, item: "Gloves", stock: 18, min: 25, unit: "pair" },
];

const START_PAYROLL = [
  { id: 1, name: "Selva Kumar", salary: 28000, advance: 2000, bonus: 1000 },
  { id: 2, name: "Ravi Kumar", salary: 22000, advance: 1000, bonus: 500 },
];

function cn(...classes) { return classes.filter(Boolean).join(" "); }

function Card({ children, className = "" }) {
  return <div className={cn("rounded-3xl border p-5 shadow-sm", "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900", className)}>{children}</div>;
}

function Badge({ children }) {
  const style = {
    Pending: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200",
    "On The Way": "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200",
    "Work Started": "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-200",
    Completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
    Cancelled: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200",
    Paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
    Present: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
    Absent: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200",
  }[children] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";
  return <span className={cn("rounded-full px-3 py-1 text-xs font-bold", style)}>{children}</span>;
}

function Field({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <label className="grid gap-1 text-sm font-bold text-slate-700 dark:text-slate-200">
      {label}
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#d4af37] dark:border-slate-700 dark:bg-slate-950"
      />
    </label>
  );
}

function StatCard({ title, value, icon: Icon, sub }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="relative overflow-hidden">
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#d4af37]/20" />
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
            <h3 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{value}</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{sub}</p>
          </div>
          <div className="rounded-2xl bg-[#07162a] p-3 text-[#d4af37] dark:bg-white/10"><Icon size={24} /></div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function FreshNestAdminPreview() {
  const [dark, setDark] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const [query, setQuery] = useState("");
  const [bookings, setBookings] = useState(START_BOOKINGS);
  const [staff, setStaff] = useState(START_STAFF);
  const [inventory, setInventory] = useState(START_INVENTORY);
  const [payroll, setPayroll] = useState(START_PAYROLL);
  const [services, setServices] = useState(START_SERVICES);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [firebaseConfig, setFirebaseConfig] = useState({ apiKey: "", authDomain: "", projectId: "", appId: "" });
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 4, 1));
  const [staffForm, setStaffForm] = useState({ name: "", role: "Cleaner", salary: "20000" });
  const [inventoryForm, setInventoryForm] = useState({ item: "", stock: "", min: "", unit: "pcs" });
  const [payrollForm, setPayrollForm] = useState({ name: "", salary: "", advance: "0", bonus: "0" });

  const filteredBookings = useMemo(() => {
    const q = query.toLowerCase();
    return bookings.filter((b) => [b.id, b.customer, b.phone, b.area, b.service, b.status].join(" ").toLowerCase().includes(q));
  }, [bookings, query]);

  const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.amount || 0), 0);
  const completedRevenue = bookings.filter((b) => b.status === "Completed").reduce((sum, b) => sum + Number(b.amount || 0), 0);
  const pending = bookings.filter((b) => b.status !== "Completed").length;
  const totalKm = bookings.reduce((sum, b) => {
    const start = Number(b.startKm || 0);
    const end = Number(b.returnKm || b.siteKm || b.pickupKm || 0);
    return sum + Math.max(0, end - start);
  }, 0);
  const fuelExpense = Math.round((totalKm / 16) * 100);
  const lowStock = inventory.filter((item) => Number(item.stock) <= Number(item.min));
  const notifications = [
    ...lowStock.map((i) => `Low stock: ${i.item} only ${i.stock} ${i.unit}`),
    `${pending} jobs pending / running`,
    `Today revenue ₹${totalRevenue.toLocaleString()}`,
  ];

  const nav = [
    ["Dashboard", LayoutDashboard],
    ["Supervisor App", UserCheck],
    ["Live Bookings", ClipboardList],
    ["Firebase Sync", Bell],
    ["Calendar", CalendarDays],
    ["Customers CRM", Users],
    ["Customer History", Users],
    ["Complaints", ReceiptText],
    ["Services", Sparkles],
    ["Staff Performance", TrendingUp],
    ["Attendance", UserCheck],
    ["Payroll", Wallet],
    ["Inventory", Package],
    ["Expenses", ReceiptText],
    ["Payments", CreditCard],
    ["Reminders", Bell],
    ["Invoices", FileText],
    ["Marketing", TrendingUp],
    ["Profit Analysis", TrendingUp],
    ["Reports", ClipboardList],
    ["Audit Logs", CheckCircle2],
    ["Settings", Settings],
  ];

  function updateBooking(id, patch) {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    setSelectedBooking((old) => (old && old.id === id ? { ...old, ...patch } : old));
  }

  function addBooking(form) {
    const selectedItems = form.servicesList && form.servicesList.length ? form.servicesList : [{ service: form.service, qty: form.qty, amount: form.amount }];
    const calculatedItems = selectedItems.map((item) => {
      const service = services.find((s) => s.name === item.service) || services[0];
      const qty = Math.max(1, Number(item.qty || 1));
      const amount = service.name === "Balance Work" ? Number(item.amount || 0) : qty * Number(service.rate || 0);
      return { service: service.name, qty, rate: service.rate, unit: service.unit, amount: Math.round(amount) };
    });
    const totalAmount = calculatedItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const next = {
      id: `FN-${1001 + bookings.length}`,
      customer: form.customer || "New Customer",
      phone: form.phone || "",
      area: form.area || "Trichy",
      address: form.address || form.area || "Trichy",
      locationUrl: form.locationUrl || "",
      service: calculatedItems.map((x) => x.service).join(" + "),
      servicesList: calculatedItems,
      qty: calculatedItems.reduce((sum, item) => sum + Number(item.qty || 0), 0),
      amount: totalAmount,
      date: form.date || new Date().toISOString().slice(0, 10),
      time: form.time || "10:00 AM",
      staff: form.staff || "Unassigned",
      status: "Pending",
      payment: "Pending",
      source: "Call",
      startKm: "", pickupKm: "", siteKm: "", returnKm: "",
      balanceWork: form.balanceWork || "",
    };
    setBookings((prev) => [next, ...prev]);
    setSelectedBooking(next);
    setShowAddBooking(false);
    setActive("Jobs");
  }

  function addStaff() {
    const name = staffForm.name.trim();
    if (!name) return;
    const newPerson = { id: Date.now(), name, role: staffForm.role || "Cleaner", status: "Present", salary: Number(staffForm.salary || 0), advance: 0 };
    setStaff((prev) => [...prev, newPerson]);
    setPayroll((prev) => [...prev, { id: Date.now() + 1, name, salary: Number(staffForm.salary || 0), advance: 0, bonus: 0 }]);
    setStaffForm({ name: "", role: "Cleaner", salary: "20000" });
  }

  function addInventory() {
    if (!inventoryForm.item.trim()) return;
    setInventory((prev) => [...prev, { id: Date.now(), item: inventoryForm.item, stock: Number(inventoryForm.stock || 0), min: Number(inventoryForm.min || 0), unit: inventoryForm.unit || "pcs" }]);
    setInventoryForm({ item: "", stock: "", min: "", unit: "pcs" });
  }

  function addPayroll() {
    if (!payrollForm.name.trim()) return;
    setPayroll((prev) => [...prev, { id: Date.now(), name: payrollForm.name, salary: Number(payrollForm.salary || 0), advance: Number(payrollForm.advance || 0), bonus: Number(payrollForm.bonus || 0) }]);
    setPayrollForm({ name: "", salary: "", advance: "0", bonus: "0" });
  }

  function Login() {
    return (
      <div className="min-h-screen bg-[#07162a] p-5 text-white">
        <div className="mx-auto flex min-h-[90vh] max-w-6xl items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="grid w-full overflow-hidden rounded-[2rem] bg-white/10 shadow-2xl md:grid-cols-2">
            <div className="p-10">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-4xl">🧹</div>
              <h1 className="text-5xl font-black">FreshNest Admin ERP</h1>
              <p className="mt-4 max-w-md text-white/70">Premium dashboard preview for jobs, staff, supervisor workflow, payments, stock, calendar and invoices.</p>
            </div>
            <div className="bg-white p-8 text-slate-950">
              <h2 className="text-3xl font-black">Admin Login</h2>
              <p className="mt-2 text-sm text-slate-500">Demo credentials already filled.</p>
              <div className="mt-8 grid gap-4">
                <input value="admin@freshnest.in" readOnly className="rounded-2xl border border-slate-200 px-4 py-3" />
                <input value="freshnest123" readOnly type="password" className="rounded-2xl border border-slate-200 px-4 py-3" />
                <button onClick={() => setLoggedIn(true)} className="rounded-2xl bg-[#07162a] px-5 py-3 font-black text-[#d4af37]">Login</button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  function Shell({ children }) {
    return (
      <div className={dark ? "dark" : ""}>
        <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-[#06111f] dark:text-white">
          <aside className="fixed left-0 top-0 hidden h-full w-72 overflow-y-auto bg-[#07162a] p-4 text-white lg:block">
            <div className="mb-5 flex items-center gap-3 rounded-3xl bg-white/10 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl">🧹</div>
              <div><h1 className="font-black">FreshNest</h1><p className="text-xs text-[#d4af37]">Admin ERP</p></div>
            </div>
            <nav className="space-y-1 pb-6">
              {nav.map(([name, Icon]) => <button key={name} onClick={() => setActive(name)} className={cn("flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold", active === name ? "bg-[#d4af37] text-[#07162a]" : "text-white/75 hover:bg-white/10")}><Icon size={18} /> {name}</button>)}
            </nav>
          </aside>
          <main className="lg:pl-72">
            <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-[#06111f]/90">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><h2 className="text-2xl font-black">{active}</h2><p className="text-sm text-slate-500 dark:text-slate-400">FreshNest Cleaning Services • Trichy</p></div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative"><Search className="absolute left-3 top-2.5 text-slate-400" size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search jobs..." className="w-64 rounded-2xl border border-slate-200 bg-white py-2 pl-10 pr-4 outline-none focus:border-[#d4af37] dark:border-slate-700 dark:bg-slate-950" /></div>
                  <button onClick={() => setShowAddBooking(true)} className="rounded-2xl bg-[#07162a] px-4 py-2 text-sm font-black text-[#d4af37] dark:bg-[#d4af37] dark:text-[#07162a]"><Plus size={16} className="inline" /> Add Job</button>
                  <button onClick={() => setDark((v) => !v)} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 font-bold dark:border-[#d4af37] dark:bg-[#d4af37] dark:text-[#07162a]">{dark ? <Sun size={18} /> : <Moon size={18} />} {dark ? "Bright" : "Night"}</button>
                  <div className="relative">
                    <button onClick={() => setShowNotifications((v) => !v)} className="relative rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-950"><Bell /><span className="absolute -right-1 -top-1 rounded-full bg-[#d4af37] px-1 text-[10px] font-black text-[#07162a]">{notifications.length}</span></button>
                    {showNotifications && <div className="absolute right-0 top-12 z-50 w-80 rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-950"><div className="mb-2 flex justify-between"><b>Notifications</b><button onClick={() => setShowNotifications(false)}><X size={16} /></button></div>{notifications.map((n, i) => <div key={i} className="mb-2 rounded-2xl bg-slate-100 p-3 text-sm dark:bg-slate-800">🔔 {n}</div>)}</div>}
                  </div>
                </div>
              </div>
            </header>
            <div className="p-4 pb-24 md:p-6 md:pb-28">{children}</div>
          </main>
          {showAddBooking && <AddBookingModal onClose={() => setShowAddBooking(false)} onSave={addBooking} />}
          {selectedBooking && <BookingDrawer booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
        </div>
      </div>
    );
  }

  function Dashboard() {
    return <div className="space-y-6"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={IndianRupee} sub="All bookings" /><StatCard title="Completed Revenue" value={`₹${completedRevenue.toLocaleString()}`} icon={CheckCircle2} sub="Paid/completed flow" /><StatCard title="Pending Jobs" value={pending} icon={ClipboardList} sub="Need follow-up" /><StatCard title="Fuel Expense" value={`₹${fuelExpense}`} icon={TrendingUp} sub={`${totalKm} km • 16 km = ₹100`} /></div><div className="grid gap-4 xl:grid-cols-3"><Card className="xl:col-span-2"><div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-black">Live Job Flow</h3><Badge>{bookings.length} Jobs</Badge></div><BookingTable compact /></Card><Card><h3 className="mb-4 text-lg font-black">Notifications</h3>{notifications.map((n, i) => <div key={i} className="mb-2 rounded-2xl bg-slate-100 p-3 text-sm dark:bg-slate-800">🔔 {n}</div>)}</Card></div></div>;
  }

  function BookingTable({ compact = false }) {
    const rows = compact ? filteredBookings.slice(0, 5) : filteredBookings;
    return <div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800">{["ID", "Customer", "Service", "Date", "Staff", "Status", "Payment", "Balance Work", "Amount", "Action"].map((h) => <th key={h} className="py-3 pr-4">{h}</th>)}</tr></thead><tbody>{rows.map((b) => <tr key={b.id} className="border-b border-slate-100 dark:border-slate-800"><td className="py-3 pr-4 font-black">{b.id}</td><td className="py-3 pr-4"><b>{b.customer}</b><p className="flex items-center gap-1 text-xs text-slate-500"><Phone size={12} />{b.phone}</p></td><td className="py-3 pr-4">{b.service}<p className="text-xs text-slate-500">Qty: {b.qty}</p></td><td className="py-3 pr-4">{b.date}<p className="text-xs text-slate-500">{b.time}</p></td><td className="py-3 pr-4">{b.staff}</td><td className="py-3 pr-4"><Badge>{b.status}</Badge></td><td className="py-3 pr-4"><Badge>{b.payment}</Badge></td><td className="py-3 pr-4 text-xs text-slate-500">{b.balanceWork || "-"}</td><td className="py-3 pr-4 font-black">₹{Number(b.amount).toLocaleString()}</td><td className="py-3 pr-4"><button onClick={() => setSelectedBooking(b)} className="rounded-xl bg-[#07162a] px-3 py-2 text-xs font-black text-[#d4af37]">Open</button></td></tr>)}</tbody></table></div>;
  }

  function Jobs() { return <Card><div className="mb-4 flex items-center justify-between"><h3 className="text-xl font-black">All Jobs</h3><button onClick={() => setShowAddBooking(true)} className="rounded-2xl bg-[#07162a] px-4 py-2 font-black text-[#d4af37]"><Plus size={16} className="inline" /> Add Job</button></div><BookingTable /></Card>; }

  function SupervisorApp() { return <div className="grid gap-4 xl:grid-cols-2">{filteredBookings.map((b) => <Card key={b.id}><div className="flex items-start justify-between gap-3"><div><h3 className="text-xl font-black">{b.customer}</h3><p className="text-sm text-slate-500"><MapPin size={14} className="inline" /> {b.area} • {b.service}</p></div><Badge>{b.status}</Badge></div><div className="mt-4 grid gap-2 md:grid-cols-4">{["Pending", "On The Way", "Work Started", "Completed"].map((step) => <button key={step} onClick={() => updateBooking(b.id, { status: step })} className="rounded-2xl bg-slate-100 px-3 py-3 text-sm font-black hover:bg-[#d4af37] dark:bg-slate-800">{step}</button>)}</div><button onClick={() => setSelectedBooking(b)} className="mt-3 w-full rounded-2xl bg-[#07162a] px-4 py-3 font-black text-[#d4af37]">Open Full Workflow</button></Card>)}</div>; }

  function CalendarView() {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = Array.from({ length: firstDay }, () => null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
    const title = calendarMonth.toLocaleString("default", { month: "long", year: "numeric" });
    const moveMonth = (step) => setCalendarMonth(new Date(year, month + step, 1));
    return <div className="grid gap-4 xl:grid-cols-[1.4fr_.6fr]"><Card><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h3 className="text-2xl font-black">{title}</h3><div className="flex gap-2"><button onClick={() => moveMonth(-1)} className="rounded-2xl border p-2 dark:border-slate-700"><ChevronLeft /></button><button onClick={() => setCalendarMonth(new Date(2026, 4, 1))} className="rounded-2xl bg-[#07162a] px-4 py-2 font-black text-[#d4af37]">Today</button><button onClick={() => moveMonth(1)} className="rounded-2xl border p-2 dark:border-slate-700"><ChevronRight /></button></div></div><div className="grid grid-cols-7 gap-2 text-center text-xs font-black text-slate-500">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d}>{d}</div>)}</div><div className="mt-2 grid grid-cols-7 gap-2">{cells.map((day, index) => { if (!day) return <div key={`empty-${index}`} className="min-h-24 rounded-2xl bg-slate-50 dark:bg-slate-800/40" />; const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`; const list = bookings.filter((b) => b.date === date); return <button key={date} className="min-h-24 rounded-2xl border border-slate-200 p-2 text-left hover:border-[#d4af37] dark:border-slate-800"><b>{day}</b>{list.map((b) => <p key={b.id} className="mt-1 truncate rounded-lg bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">{b.customer}</p>)}</button>; })}</div></Card><Card><h3 className="mb-3 text-xl font-black">Month Jobs</h3><div className="space-y-2">{bookings.filter((b) => b.date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)).map((b) => <button key={b.id} onClick={() => setSelectedBooking(b)} className="w-full rounded-2xl bg-slate-100 p-3 text-left text-sm dark:bg-slate-800"><b>{b.customer}</b><p className="text-slate-500">{b.date} • {b.service}</p></button>)}</div></Card></div>;
  }

  function Services() { return <div className="space-y-4"><Card><div className="flex items-center justify-between"><div><h3 className="text-2xl font-black">Services & Rate Edit</h3><p className="text-sm text-slate-500">Rate edit panna immediate booking amount calculation use aagum.</p></div><button onClick={() => setServices((prev) => [...prev, { id: Date.now(), name: "New Service", rate: 0, unit: "unit", icon: "✨", category: "Custom" }])} className="rounded-2xl bg-[#07162a] px-4 py-2 font-black text-[#d4af37]"><Plus size={16} className="inline" /> Add Service</button></div></Card><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{services.map((s) => <Card key={s.id}><div className="text-5xl">{s.icon}</div><Field label="Service Name" value={s.name} onChange={(v) => setServices((prev) => prev.map((x) => x.id === s.id ? { ...x, name: v } : x))} /><div className="mt-3 grid grid-cols-2 gap-3"><Field label="Rate" type="number" value={s.rate} onChange={(v) => setServices((prev) => prev.map((x) => x.id === s.id ? { ...x, rate: Number(v || 0) } : x))} /><Field label="Unit" value={s.unit} onChange={(v) => setServices((prev) => prev.map((x) => x.id === s.id ? { ...x, unit: v } : x))} /></div><p className="mt-3 text-sm text-slate-500">{s.category}</p></Card>)}</div></div>; }

  function Staff() { return <div className="space-y-4"><Card><h3 className="mb-4 text-xl font-black">Add Staff Full Name</h3><div className="grid gap-3 md:grid-cols-4"><input value={staffForm.name} onChange={(e) => setStaffForm((old) => ({ ...old, name: e.target.value }))} placeholder="Full name type pannunga" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-950 md:col-span-2" /><input value={staffForm.role} onChange={(e) => setStaffForm((old) => ({ ...old, role: e.target.value }))} placeholder="Role" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-950" /><button onClick={addStaff} className="rounded-2xl bg-[#07162a] px-5 py-3 font-black text-[#d4af37]">Add Staff</button></div></Card><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{staff.map((s) => <Card key={s.id}><h3 className="text-xl font-black">{s.name}</h3><p className="text-sm text-slate-500">{s.role}</p><div className="mt-3"><Badge>{s.status}</Badge></div><p className="mt-4 text-sm">Salary: <b>₹{s.salary}</b></p><p className="text-sm">Advance: <b>₹{s.advance}</b></p></Card>)}</div></div>; }

  function Inventory() { return <Card><div className="mb-4 flex items-center justify-between"><h3 className="text-xl font-black">Inventory</h3><button onClick={addInventory} className="rounded-2xl bg-[#07162a] px-4 py-2 font-black text-[#d4af37]"><Plus size={16} className="inline" /> Add Item</button></div><div className="mb-4 grid gap-3 md:grid-cols-5"><input value={inventoryForm.item} onChange={(e) => setInventoryForm((o) => ({ ...o, item: e.target.value }))} placeholder="Item name" className="rounded-2xl border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /><input value={inventoryForm.stock} onChange={(e) => setInventoryForm((o) => ({ ...o, stock: e.target.value }))} placeholder="Stock" type="number" className="rounded-2xl border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /><input value={inventoryForm.min} onChange={(e) => setInventoryForm((o) => ({ ...o, min: e.target.value }))} placeholder="Min" type="number" className="rounded-2xl border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /><input value={inventoryForm.unit} onChange={(e) => setInventoryForm((o) => ({ ...o, unit: e.target.value }))} placeholder="Unit" className="rounded-2xl border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /></div><div className="grid gap-3">{inventory.map((item) => <div key={item.id} className="flex items-center justify-between rounded-2xl bg-slate-100 p-4 dark:bg-slate-800"><div><b>{item.item}</b><p className="text-sm text-slate-500">Min: {item.min} {item.unit}</p></div><div className="text-xl font-black">{item.stock} {item.unit}</div></div>)}</div></Card>; }

  function Payroll() { return <Card><div className="mb-4 flex items-center justify-between"><h3 className="text-2xl font-black">Payroll</h3><button onClick={addPayroll} className="rounded-2xl bg-[#07162a] px-4 py-2 font-black text-[#d4af37]"><Plus size={16} className="inline" /> Add Payroll</button></div><div className="mb-4 grid gap-3 md:grid-cols-4"><input value={payrollForm.name} onChange={(e) => setPayrollForm((o) => ({ ...o, name: e.target.value }))} placeholder="Staff name" className="rounded-2xl border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /><input value={payrollForm.salary} onChange={(e) => setPayrollForm((o) => ({ ...o, salary: e.target.value }))} placeholder="Salary" type="number" className="rounded-2xl border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /><input value={payrollForm.advance} onChange={(e) => setPayrollForm((o) => ({ ...o, advance: e.target.value }))} placeholder="Advance" type="number" className="rounded-2xl border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /><input value={payrollForm.bonus} onChange={(e) => setPayrollForm((o) => ({ ...o, bonus: e.target.value }))} placeholder="Bonus" type="number" className="rounded-2xl border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /></div><div className="grid gap-3">{payroll.map((p) => <div key={p.id} className="grid gap-3 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800 md:grid-cols-5"><b>{p.name}</b><span>Salary ₹{p.salary}</span><span>Advance ₹{p.advance}</span><span>Bonus ₹{p.bonus}</span><span>Balance ₹{Number(p.salary) + Number(p.bonus) - Number(p.advance)}</span></div>)}</div></Card>; }

  function Payments() { return <Card><h3 className="mb-4 text-xl font-black">Payments</h3><div className="grid gap-3">{bookings.map((b) => <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800"><div><b>{b.customer}</b><p className="text-sm text-slate-500">{b.id} • {b.service}</p></div><b>₹{b.amount}</b><Badge>{b.payment}</Badge><button onClick={() => updateBooking(b.id, { payment: "Paid" })} className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-black text-white">Mark Paid</button></div>)}</div></Card>; }

  function Invoices() { return <div className="space-y-4"><Card><h3 className="text-2xl font-black">Invoices</h3><p className="text-sm text-slate-500">Keela full invoice list scroll aagum. Bottom padding fix panniten.</p></Card><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{bookings.map((b) => <Card key={b.id}><div className="flex items-start justify-between"><div><h3 className="text-xl font-black">Invoice {b.id}</h3><p className="text-sm text-slate-500">{b.customer}</p></div><FileText className="text-[#d4af37]" /></div><div className="mt-4 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800"><p>{b.service}</p><p>Qty: {b.qty}</p><p>Payment: {b.payment}</p><p className="mt-2 text-2xl font-black">₹{Number(b.amount).toLocaleString()}</p></div><button className="mt-4 w-full rounded-2xl bg-[#07162a] px-4 py-3 font-black text-[#d4af37]">Download / Share Invoice</button></Card>)}</div><Card><h3 className="text-xl font-black">Invoice Settings</h3><p className="mt-2 text-sm text-slate-500">GST optional, company address, WhatsApp share and PDF download next connect pannalam.</p></Card></div>; }

  function Expenses() { return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><StatCard title="Total KM" value={`${totalKm} km`} icon={TrendingUp} sub="From job KM entries" /><StatCard title="Fuel Expense" value={`₹${fuelExpense}`} icon={ReceiptText} sub="16km = ₹100" /><StatCard title="Low Stock" value={lowStock.length} icon={Package} sub="Purchase needed" /><StatCard title="Pending Jobs" value={pending} icon={ClipboardList} sub="Team payout pending" /></div>; }

  function SettingsView() { return <Card><h3 className="text-xl font-black">Settings</h3><div className="mt-4 grid gap-3 md:grid-cols-2"><input value="FreshNest Cleaning Services" readOnly className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950" /><input value="Trichy" readOnly className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950" /><input value="Owners: Neethirajan & Selva Kumar" readOnly className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950 md:col-span-2" /></div></Card>; }

  function AddBookingModal({ onClose, onSave }) {
    const [form, setForm] = useState({ customer: "", phone: "", area: "Trichy", address: "", locationUrl: "", service: services[0].name, qty: 1, amount: "", date: new Date().toISOString().slice(0, 10), time: "10:00 AM", staff: "Unassigned", balanceWork: "", servicesList: [{ id: 1, service: services[0].name, qty: 1, amount: "" }] });
    const set = (key, value) => setForm((old) => ({ ...old, [key]: value }));
    const updateServiceRow = (id, key, value) => setForm((old) => ({ ...old, servicesList: old.servicesList.map((row) => row.id === id ? { ...row, [key]: value } : row) }));
    const addServiceRow = () => setForm((old) => ({ ...old, servicesList: [...old.servicesList, { id: Date.now(), service: services[0].name, qty: 1, amount: "" }] }));
    const removeServiceRow = (id) => setForm((old) => ({ ...old, servicesList: old.servicesList.length === 1 ? old.servicesList : old.servicesList.filter((row) => row.id !== id) }));
    const rowAmount = (row) => {
      const selected = services.find((s) => s.name === row.service) || services[0];
      return selected.name === "Balance Work" ? Number(row.amount || 0) : Math.round(Number(row.qty || 1) * Number(selected.rate || 0));
    };
    const totalAmount = form.servicesList.reduce((sum, row) => sum + rowAmount(row), 0);
    return <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm"><motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl dark:bg-slate-950"><div className="mb-4 flex items-center justify-between"><div><h3 className="text-2xl font-black">Add Manual Booking</h3><p className="text-sm text-slate-500">Multiple services + Google Map location URL support.</p></div><button onClick={onClose} className="rounded-2xl border border-slate-200 p-2 dark:border-slate-800"><X /></button></div><div className="grid gap-4 md:grid-cols-2"><Field label="Customer" value={form.customer} onChange={(v) => set("customer", v)} /><Field label="Phone" value={form.phone} onChange={(v) => set("phone", v.replace(/[^0-9]/g, ""))} /><Field label="Area" value={form.area} onChange={(v) => set("area", v)} /><Field label="Address" value={form.address} onChange={(v) => set("address", v)} /><Field label="Google Map Location URL" value={form.locationUrl} onChange={(v) => set("locationUrl", v)} placeholder="https://maps.google.com/..." /><label className="grid gap-1 text-sm font-bold text-slate-700 dark:text-slate-200">Staff<select value={form.staff} onChange={(e) => set("staff", e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"><option>Unassigned</option>{staff.map((s) => <option key={s.id}>{s.name}</option>)}</select></label><Field label="Date" type="date" value={form.date} onChange={(v) => set("date", v)} /><Field label="Time" value={form.time} onChange={(v) => set("time", v)} /></div><Card className="mt-5 bg-slate-50 dark:bg-slate-900"><div className="mb-4 flex items-center justify-between"><h4 className="text-lg font-black">Services</h4><button onClick={addServiceRow} className="rounded-2xl bg-[#07162a] px-4 py-2 text-sm font-black text-[#d4af37]"><Plus size={16} className="inline" /> Add Service</button></div><div className="grid gap-3">{form.servicesList.map((row, index) => { const selected = services.find((s) => s.name === row.service) || services[0]; const amount = rowAmount(row); return <div key={row.id} className="grid gap-3 rounded-2xl bg-white p-3 dark:bg-slate-950 md:grid-cols-[1.5fr_.7fr_.7fr_auto]"><label className="grid gap-1 text-sm font-bold text-slate-700 dark:text-slate-200">Service<select value={row.service} onChange={(e) => updateServiceRow(row.id, "service", e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950">{services.map((s) => <option key={s.id}>{s.name}</option>)}</select></label><Field label={`Qty / ${selected.unit}`} type="number" value={row.qty} onChange={(v) => updateServiceRow(row.id, "qty", v)} /><Field label="Manual Amount" type="number" value={row.amount} onChange={(v) => updateServiceRow(row.id, "amount", v)} placeholder="Balance work" /><div className="flex items-end gap-2"><div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-black dark:bg-slate-800">₹{amount.toLocaleString()}</div><button onClick={() => removeServiceRow(row.id)} className="rounded-2xl border border-red-200 p-2 text-red-600"><Trash2 size={18} /></button></div></div>; })}</div><Field label="Balance / Extra Work Notes" value={form.balanceWork} onChange={(v) => set("balanceWork", v)} /></Card><div className="mt-5 rounded-3xl bg-slate-100 p-4 dark:bg-slate-800"><p className="text-sm text-slate-500">Total Booking Amount</p><p className="text-3xl font-black">₹{totalAmount.toLocaleString()}</p></div><div className="mt-5 grid gap-3 md:grid-cols-2"><button onClick={onClose} className="rounded-2xl border border-slate-200 px-5 py-3 font-black dark:border-slate-800">Cancel</button><button onClick={() => onSave({ ...form, amount: totalAmount })} className="rounded-2xl bg-[#07162a] px-5 py-3 font-black text-[#d4af37]">Save Booking</button></div></motion.div></div>;
  }

  function BookingDrawer({ booking, onClose }) {
    const kmStart = Number(booking.startKm || 0);
    const kmEnd = Number(booking.returnKm || booking.siteKm || booking.pickupKm || 0);
    const km = Math.max(0, kmEnd - kmStart);
    const expense = Math.round((km / 16) * 100);

    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-black/50 p-3 backdrop-blur-sm">
        <motion.div
          initial={{ x: 420, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="h-full w-full max-w-xl overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl dark:bg-slate-950"
        >
          <div className="sticky top-0 mb-4 flex items-center justify-between bg-white/90 pb-3 backdrop-blur dark:bg-slate-950/90">
            <div>
              <h3 className="text-2xl font-black">{booking.customer}</h3>
              <p className="text-sm text-slate-500">{booking.id} • {booking.service}</p>
            </div>
            <button onClick={onClose} className="rounded-2xl border border-slate-200 p-2 dark:border-slate-800">
              <X />
            </button>
          </div>

          <div className="grid gap-4">
            <Card>
              <h4 className="mb-3 font-black">Customer Details</h4>
              <p><Phone size={15} className="inline" /> {booking.phone}</p>
              <p><MapPin size={15} className="inline" /> {booking.address}</p>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                <button
                  onClick={() => window.open(`tel:${booking.phone}`)}
                  className="rounded-2xl bg-emerald-600 px-4 py-3 font-black text-white"
                >
                  Call Customer
                </button>
                {booking.locationUrl && (
                  <button
                    onClick={() => window.open(booking.locationUrl, "_blank", "noopener,noreferrer")}
                    className="rounded-2xl bg-blue-600 px-4 py-3 font-black text-white"
                  >
                    Open Google Map
                  </button>
                )}
              </div>
            </Card>

            <Card>
              <h4 className="mb-3 font-black">Booked Services</h4>
              <div className="grid gap-2">
                {(booking.servicesList || [{ service: booking.service, qty: booking.qty, amount: booking.amount }]).map((item, index) => (
                  <div key={index} className="rounded-2xl bg-slate-100 p-3 text-sm dark:bg-slate-800">
                    <b>{item.service}</b>
                    <p className="text-slate-500">Qty: {item.qty} • ₹{Number(item.amount || 0).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h4 className="mb-3 font-black">Work Status</h4>
              <div className="grid gap-2 md:grid-cols-2">
                {["Pending", "On The Way", "Work Started", "Completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateBooking(booking.id, { status })}
                    className="rounded-2xl bg-slate-100 px-4 py-3 font-black hover:bg-[#d4af37] dark:bg-slate-800"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <h4 className="mb-3 font-black">Balance / Extra Work</h4>
              <Field
                label="Balance Work Notes"
                value={booking.balanceWork || ""}
                onChange={(value) => updateBooking(booking.id, { balanceWork: value })}
              />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Field
                  label="Amount"
                  type="number"
                  value={booking.amount}
                  onChange={(value) => updateBooking(booking.id, { amount: Number(value || 0) })}
                />
                <label className="grid gap-1 text-sm font-bold text-slate-700 dark:text-slate-200">
                  Payment
                  <select
                    value={booking.payment}
                    onChange={(event) => updateBooking(booking.id, { payment: event.target.value })}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                  >
                    <option>Pending</option>
                    <option>Advance Paid</option>
                    <option>Paid</option>
                  </select>
                </label>
              </div>
            </Card>

            <Card>
              <h4 className="mb-3 font-black">KM Workflow</h4>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Start KM" type="number" value={booking.startKm} onChange={(value) => updateBooking(booking.id, { startKm: value })} />
                <Field label="Pickup KM" type="number" value={booking.pickupKm} onChange={(value) => updateBooking(booking.id, { pickupKm: value })} />
                <Field label="Site Reach KM" type="number" value={booking.siteKm} onChange={(value) => updateBooking(booking.id, { siteKm: value })} />
                <Field label="Return / Drop KM" type="number" value={booking.returnKm} onChange={(value) => updateBooking(booking.id, { returnKm: value })} />
              </div>
              <div className="mt-4 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                <b>Total:</b> {km} km • <b>Expense:</b> ₹{expense}
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    );
  }

  function LiveBookings() {
    return <Jobs />;
  }

  function FirebaseSync() {
    const updateConfig = (key, value) => setFirebaseConfig((old) => ({ ...old, [key]: value }));
    const connected = firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId;

    return (
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="text-2xl font-black">Firebase Sync</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Website/App booking Firebase database la irundhu admin dashboard ku sync aagura setup.
          </p>
          <div className="mt-5 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
            <p className="text-sm text-slate-500">Status</p>
            <p className={cn("text-2xl font-black", connected ? "text-emerald-600" : "text-amber-600")}>
              {connected ? "Config Ready" : "Config Pending"}
            </p>
          </div>
          <button
            onClick={() => addBooking({
              customer: "Website Lead Customer",
              phone: "9666677777",
              area: "KK Nagar",
              address: "Website booking address",
              locationUrl: "https://maps.google.com/?q=KK+Nagar+Trichy",
              servicesList: [{ service: "Water Tank Cleaning", qty: 1500, amount: "" }],
              staff: "Unassigned",
              date: new Date().toISOString().slice(0, 10),
              time: "11:00 AM",
            })}
            className="mt-5 rounded-2xl bg-[#07162a] px-5 py-3 font-black text-[#d4af37]"
          >
            Simulate Website Booking
          </button>
        </Card>

        <Card>
          <h3 className="text-xl font-black">Connection Details</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Firebase config paste panna editable space.</p>
          <div className="mt-4 grid gap-3">
            <Field label="apiKey" value={firebaseConfig.apiKey} onChange={(value) => updateConfig("apiKey", value)} placeholder="Paste Firebase apiKey" />
            <Field label="authDomain" value={firebaseConfig.authDomain} onChange={(value) => updateConfig("authDomain", value)} placeholder="project.firebaseapp.com" />
            <Field label="projectId" value={firebaseConfig.projectId} onChange={(value) => updateConfig("projectId", value)} placeholder="freshnest-project" />
            <Field label="appId" value={firebaseConfig.appId} onChange={(value) => updateConfig("appId", value)} placeholder="Firebase appId" />
          </div>
          <button
            onClick={() => alert(connected ? "Firebase config saved simulation" : "Fill all Firebase config fields")}
            className="mt-5 w-full rounded-2xl bg-[#07162a] px-4 py-3 font-black text-[#d4af37]"
          >
            Save Firebase Config
          </button>
        </Card>
      </div>
    );
  }

  function CustomersCRM() {
    return (
      <Card>
        <h3 className="mb-4 text-2xl font-black">Customers CRM</h3>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Customer, phone, address, service history ellam one table la.</p>
        <BookingTable />
      </Card>
    );
  }

  function CustomerHistory() {
    const phones = [...new Set(bookings.map((booking) => booking.phone))];
    return (
      <div className="grid gap-4">
        {phones.map((phone) => {
          const list = bookings.filter((booking) => booking.phone === phone);
          const first = list[0];
          return (
            <Card key={phone}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black">{first.customer}</h3>
                  <p className="text-sm text-slate-500">{phone} • {list.length} booking(s)</p>
                </div>
                <button onClick={() => window.open(`tel:${phone}`)} className="rounded-2xl bg-emerald-600 px-4 py-2 font-black text-white">Call</button>
              </div>
              <div className="mt-4 grid gap-2 md:grid-cols-3">
                {list.map((booking) => (
                  <button key={booking.id} onClick={() => setSelectedBooking(booking)} className="rounded-2xl bg-slate-100 p-3 text-left text-sm dark:bg-slate-800">
                    <b>{booking.id}</b>
                    <p>{booking.service}</p>
                    <p>₹{booking.amount}</p>
                    <p className="text-xs text-slate-500">{booking.date}</p>
                  </button>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    );
  }

  function Complaints() {
    const [complaints, setComplaints] = useState([
      { id: 1, customer: "Karthik", issue: "Staff reached late", status: "Open" },
      { id: 2, customer: "Meena", issue: "Sofa stain not fully removed", status: "Reviewing" },
    ]);
    const [form, setForm] = useState({ customer: "", issue: "" });

    function addComplaint() {
      if (!form.customer.trim()) return;
      setComplaints((previous) => [{ id: Date.now(), customer: form.customer, issue: form.issue || "New issue", status: "Open" }, ...previous]);
      setForm({ customer: "", issue: "" });
    }

    return (
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-2xl font-black">Complaints</h3>
          <button onClick={addComplaint} className="rounded-2xl bg-[#07162a] px-4 py-2 font-black text-[#d4af37]"><Plus size={16} className="inline" /> Add Complaint</button>
        </div>
        <div className="mb-4 grid gap-3 md:grid-cols-2">
          <input value={form.customer} onChange={(event) => setForm((old) => ({ ...old, customer: event.target.value }))} placeholder="Customer" className="rounded-2xl border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
          <input value={form.issue} onChange={(event) => setForm((old) => ({ ...old, issue: event.target.value }))} placeholder="Issue" className="rounded-2xl border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
        </div>
        <div className="grid gap-3">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
              <b>{complaint.customer}</b>
              <p className="text-sm text-slate-500">{complaint.issue}</p>
              <div className="mt-2"><Badge>{complaint.status}</Badge></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  function StaffPerformance() {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {staff.map((person) => {
          const count = bookings.filter((booking) => booking.staff === person.name).length;
          const completed = bookings.filter((booking) => booking.staff === person.name && booking.status === "Completed").length;
          const score = Math.min(100, 70 + completed * 10 + count * 3);
          return (
            <Card key={person.id}>
              <h3 className="text-xl font-black">{person.name}</h3>
              <p className="text-sm text-slate-500">{person.role}</p>
              <p className="mt-4 text-4xl font-black text-[#07162a] dark:text-white">{score}</p>
              <p className="text-sm text-slate-500">Performance score</p>
              <p className="mt-3 text-xs text-slate-500">Jobs: {count} • Completed: {completed}</p>
            </Card>
          );
        })}
      </div>
    );
  }

  function Attendance() {
    return (
      <Card>
        <h3 className="mb-4 text-2xl font-black">Attendance</h3>
        <div className="grid gap-3">
          {staff.map((person) => (
            <div key={person.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
              <div>
                <b>{person.name}</b>
                <p className="text-sm text-slate-500">{person.role}</p>
              </div>
              <select
                value={person.status}
                onChange={(event) => setStaff((previous) => previous.map((item) => item.id === person.id ? { ...item, status: event.target.value } : item))}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              >
                <option>Present</option>
                <option>Absent</option>
              </select>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  function Reminders() {
    const pendingPayments = bookings.filter((booking) => booking.payment !== "Paid");
    const completedJobs = bookings.filter((booking) => booking.status === "Completed");
    return (
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-2xl font-black">Payment Reminders</h3>
          {pendingPayments.map((booking) => (
            <div key={booking.id} className="mb-3 flex items-center justify-between gap-3 rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">
              <div><b>{booking.customer}</b><p className="text-xs text-slate-500">₹{booking.amount} pending</p></div>
              <button onClick={() => window.open(`https://wa.me/91${booking.phone}`)} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white">WhatsApp</button>
            </div>
          ))}
        </Card>
        <Card>
          <h3 className="mb-4 text-2xl font-black">Review Follow-ups</h3>
          {completedJobs.map((booking) => (
            <div key={booking.id} className="mb-3 rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">
              <b>{booking.customer}</b>
              <p className="text-sm text-slate-500">Ask review for {booking.service}</p>
            </div>
          ))}
        </Card>
      </div>
    );
  }

  function Marketing() {
    return (
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-2xl font-black">Marketing Leads</h3>
          {["Instagram", "Google Business", "WhatsApp", "Referral"].map((item, index) => (
            <div key={item} className="mb-3 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
              <b>{item}</b>
              <p className="text-sm text-slate-500">{index + 2} leads this week</p>
            </div>
          ))}
        </Card>
        <Card>
          <h3 className="mb-4 text-2xl font-black">Campaign Ideas</h3>
          {["Before/After sofa reel", "Festival deep cleaning offer", "Water tank safety post", "Referral cashback"].map((item) => (
            <div key={item} className="mb-3 rounded-2xl bg-[#07162a] p-4 font-black text-[#d4af37]">{item}</div>
          ))}
        </Card>
      </div>
    );
  }

  function ProfitAnalysis() {
    const byService = services
      .map((service) => {
        const list = bookings.filter((booking) => booking.service.includes(service.name));
        const revenue = list.reduce((sum, booking) => sum + Number(booking.amount || 0), 0);
        return { ...service, count: list.length, revenue };
      })
      .filter((item) => item.count);

    return (
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-2xl font-black">Service Profit Analysis</h3>
          {byService.map((item) => (
            <div key={item.id} className="mb-3 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
              <div className="flex justify-between"><b>{item.name}</b><b>₹{item.revenue}</b></div>
              <p className="text-sm text-slate-500">{item.count} booking(s)</p>
            </div>
          ))}
        </Card>
        <Card>
          <h3 className="mb-4 text-2xl font-black">Expense Analysis</h3>
          <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
            <b>Fuel</b>
            <p>16 km = ₹100 automatic estimate</p>
            <p className="mt-2 text-2xl font-black">₹{fuelExpense}</p>
          </div>
        </Card>
      </div>
    );
  }

  function Reports() {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Bookings" value={bookings.length} icon={ClipboardList} sub="Total records" />
        <StatCard title="Staff" value={staff.length} icon={Users} sub="Workers" />
        <StatCard title="Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={IndianRupee} sub="All jobs" />
        <StatCard title="Fuel" value={`₹${fuelExpense}`} icon={ReceiptText} sub="KM based" />
      </div>
    );
  }

  function AuditLogs() {
    const logs = ["Dashboard opened", "Booking updated", "Payment marked", "Staff added", "Invoice viewed", "Rate edited"];
    return (
      <Card>
        <h3 className="mb-4 text-2xl font-black">Audit Logs</h3>
        {logs.map((log, index) => (
          <div key={log} className="mb-2 rounded-2xl bg-slate-100 p-3 text-sm dark:bg-slate-800">
            <b>Owner</b> • {log}
            <p className="text-xs text-slate-500">Log #{index + 1}</p>
          </div>
        ))}
      </Card>
    );
  }

  function Screen() {
    const map = {
      Dashboard,
      Jobs,
      "Supervisor App": SupervisorApp,
      "Live Bookings": LiveBookings,
      "Firebase Sync": FirebaseSync,
      Calendar: CalendarView,
      "Customers CRM": CustomersCRM,
      "Customer History": CustomerHistory,
      Complaints,
      Services,
      "Staff Performance": StaffPerformance,
      Attendance,
      Payroll,
      Inventory,
      Expenses,
      Payments,
      Reminders,
      Invoices,
      Marketing,
      "Profit Analysis": ProfitAnalysis,
      Reports,
      "Audit Logs": AuditLogs,
      Settings: SettingsView,
    };
    const Component = map[active] || Dashboard;
    return <Component />;
  }

  if (!loggedIn) return <Login />;
  return <Shell><Screen /></Shell>;
}
