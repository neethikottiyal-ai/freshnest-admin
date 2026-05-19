import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  FileText,
  IndianRupee,
  LayoutDashboard,
  Moon,
  Package,
  Phone,
  Plus,
  ReceiptText,
  Search,
  Settings,
  Sparkles,
  Sun,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const SERVICES = [
  { name: "Sofa Shampooing", rate: 550, unit: "seat" },
  { name: "Furnished Deep Cleaning", rate: 8.5, unit: "sq.ft" },
  { name: "Unfurnished Deep Cleaning", rate: 7.5, unit: "sq.ft" },
  { name: "Water Tank Cleaning", rate: 2, unit: "litre" },
  { name: "Termite Pest Control", rate: 14, unit: "sq.ft" },
  { name: "Balance Work", rate: 0, unit: "custom" },
];

const START_BOOKINGS = [
  {
    id: "FN-1001",
    customer: "Arun Kumar",
    phone: "9876543210",
    area: "Thillai Nagar",
    address: "12, North Street, Trichy",
    service: "Sofa Shampooing",
    servicesList: [{ service: "Sofa Shampooing", qty: 4, amount: 2200 }],
    qty: 4,
    amount: 2200,
    date: "2026-05-19",
    time: "10:30 AM",
    staff: "Ravi Kumar",
    supervisorAssigned: "Ravi Kumar",
    status: "Pending",
    confirmed: false,
    payment: "Pending",
    leadSource: "Website Lead",
    startKm: "",
    pickupKm: "",
    siteKm: "",
    returnKm: "",
    balanceWork: "",
  },
  {
    id: "FN-1002",
    customer: "Priya S",
    phone: "9840012345",
    area: "Cantonment",
    address: "8, Main Road, Trichy",
    service: "Furnished Deep Cleaning",
    servicesList: [{ service: "Furnished Deep Cleaning", qty: 1000, amount: 8500 }],
    qty: 1000,
    amount: 8500,
    date: "2026-05-19",
    time: "12:00 PM",
    staff: "Selva Kumar",
    supervisorAssigned: "Selva Kumar",
    status: "Confirmed",
    confirmed: true,
    payment: "Advance Paid",
    leadSource: "App Lead",
    startKm: "65000",
    pickupKm: "65004",
    siteKm: "65018",
    returnKm: "",
    balanceWork: "Kitchen grease extra",
  },
  {
    id: "FN-1003",
    customer: "Mohammed Ali",
    phone: "9123456789",
    area: "Srirangam",
    address: "22, Temple Road",
    service: "Termite Pest Control",
    servicesList: [{ service: "Termite Pest Control", qty: 450, amount: 6300 }],
    qty: 450,
    amount: 6300,
    date: "2026-06-08",
    time: "04:00 PM",
    staff: "Amit Singh",
    supervisorAssigned: "Amit Singh",
    status: "Completed",
    confirmed: true,
    payment: "Paid",
    leadSource: "Website Lead",
    startKm: "12000",
    pickupKm: "12003",
    siteKm: "12014",
    returnKm: "12028",
    balanceWork: "",
  },
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

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Card({ children, className = "" }) {
  return <div className={cn("rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900", className)}>{children}</div>;
}

function Badge({ children }) {
  const style = {
    Pending: "bg-amber-100 text-amber-800",
    Confirmed: "bg-blue-100 text-blue-800",
    Completed: "bg-emerald-100 text-emerald-800",
    Cancelled: "bg-red-100 text-red-800",
    Paid: "bg-emerald-100 text-emerald-800",
    Present: "bg-emerald-100 text-emerald-800",
    Absent: "bg-red-100 text-red-800",
  }[children] || "bg-slate-100 text-slate-700";
  return <span className={cn("rounded-full px-3 py-1 text-xs font-black", style)}>{children}</span>;
}

function Field({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <label className="grid gap-1 text-sm font-bold text-slate-700 dark:text-slate-200">
      {label}
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
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
          <div className="rounded-2xl bg-[#07162a] p-3 text-[#d4af37]"><Icon size={24} /></div>
        </div>
      </Card>
    </motion.div>
  );
}

function makeBooking(raw = {}, count = 0) {
  const servicesList = raw.servicesList?.length ? raw.servicesList : [{ service: raw.service || "Balance Work", qty: Number(raw.qty || 1), amount: Number(raw.amount || 0) }];
  const amount = Number(raw.amount || servicesList.reduce((sum, item) => sum + Number(item.amount || 0), 0));
  return {
    id: raw.id || `FN-${1001 + count}`,
    customer: raw.customer || "New Customer",
    phone: String(raw.phone || "").replace(/[^0-9]/g, ""),
    area: raw.area || "Trichy",
    address: raw.address || raw.area || "Trichy",
    service: raw.service || servicesList.map((item) => item.service).join(" + "),
    servicesList,
    qty: Number(raw.qty || servicesList.reduce((sum, item) => sum + Number(item.qty || 0), 0)),
    amount,
    date: raw.date || new Date().toISOString().slice(0, 10),
    time: raw.time || "10:00 AM",
    staff: raw.staff || raw.supervisorAssigned || "Unassigned",
    supervisorAssigned: raw.supervisorAssigned || raw.staff || "Unassigned",
    status: raw.status || "Pending",
    confirmed: Boolean(raw.confirmed),
    payment: raw.payment || "Pending",
    leadSource: raw.leadSource || (raw.source === "App" ? "App Lead" : raw.source === "Manual" ? "Manual Lead" : "Website Lead"),
    startKm: raw.startKm || "",
    pickupKm: raw.pickupKm || "",
    siteKm: raw.siteKm || "",
    returnKm: raw.returnKm || "",
    balanceWork: raw.balanceWork || "",
  };
}

export default function FreshNestAdminPreview() {
  const [dark, setDark] = useState(false);
  const [loggedIn, setLoggedIn] = useState(true);
  const [active, setActive] = useState("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState(START_BOOKINGS);
  const [staff, setStaff] = useState(START_STAFF);
  const [inventory, setInventory] = useState(START_INVENTORY);
  const [payroll, setPayroll] = useState([
    { id: 1, name: "Selva Kumar", salary: 28000, advance: 2000, bonus: 1000 },
    { id: 2, name: "Ravi Kumar", salary: 22000, advance: 1000, bonus: 500 },
  ]);
  const [services, setServices] = useState(SERVICES);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState("FreshNest ERP ready ✅");
  const [loadingPulse, setLoadingPulse] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 4, 1));
  const [staffForm, setStaffForm] = useState({ name: "", role: "Cleaner", salary: "20000" });
  const [inventoryForm, setInventoryForm] = useState({ item: "", stock: "", min: "", unit: "pcs" });
  const [payrollForm, setPayrollForm] = useState({ name: "", salary: "", advance: "0", bonus: "0" });
  const [complaints, setComplaints] = useState([{ id: 1, customer: "Karthik", issue: "Staff reached late", status: "Open" }]);
  const [complaintForm, setComplaintForm] = useState({ customer: "", issue: "" });
  const [firebaseConfig, setFirebaseConfig] = useState({ apiKey: "", authDomain: "", projectId: "", appId: "" });
  const [syncLog, setSyncLog] = useState(["Preview-safe Firebase layer ready", "Firestore schema guards enabled"]);

  const filteredBookings = useMemo(() => {
    const text = searchQuery.toLowerCase();
    return bookings.filter((booking) => [booking.id, booking.customer, booking.phone, booking.area, booking.service, booking.status, booking.leadSource].join(" ").toLowerCase().includes(text));
  }, [bookings, searchQuery]);

  const confirmedBookings = bookings.filter((booking) => booking.confirmed);
  const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + Number(booking.amount || 0), 0);
  const completedRevenue = bookings.filter((booking) => booking.status === "Completed").reduce((sum, booking) => sum + Number(booking.amount || 0), 0);
  const pending = bookings.filter((booking) => !booking.confirmed).length;
  const totalKm = bookings.reduce((sum, booking) => {
    const start = Number(booking.startKm || 0);
    const end = Number(booking.returnKm || booking.siteKm || booking.pickupKm || 0);
    return sum + Math.max(0, end - start);
  }, 0);
  const fuelExpense = Math.round((totalKm / 16) * 100);
  const lowStock = inventory.filter((item) => Number(item.stock) <= Number(item.min));
  const websiteLeads = bookings.filter((booking) => booking.leadSource === "Website Lead");
  const appLeads = bookings.filter((booking) => booking.leadSource === "App Lead");
  const manualLeads = bookings.filter((booking) => booking.leadSource === "Manual Lead");
  const repeatMap = bookings.reduce((acc, booking) => {
    const key = booking.phone || booking.customer;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const repeatCustomerCount = Object.values(repeatMap).filter((count) => count > 1).length;

  const analyticsData = [
    { name: "Jan", revenue: 12000, expense: 3500, profit: 8500 },
    { name: "Feb", revenue: 18500, expense: 5200, profit: 13300 },
    { name: "Mar", revenue: 24000, expense: 7400, profit: 16600 },
    { name: "Apr", revenue: 31000, expense: 9200, profit: 21800 },
    { name: "May", revenue: totalRevenue, expense: fuelExpense, profit: Math.max(0, totalRevenue - fuelExpense) },
  ];
  const leadChartData = [
    { name: "Website", value: websiteLeads.length || 1 },
    { name: "App", value: appLeads.length || 1 },
    { name: "Manual", value: manualLeads.length || 1 },
  ];
  const staffChartData = staff.map((person) => ({
    name: person.name.split(" ")[0],
    jobs: bookings.filter((booking) => booking.staff === person.name || booking.supervisorAssigned === person.name).length,
    completed: bookings.filter((booking) => (booking.staff === person.name || booking.supervisorAssigned === person.name) && (booking.status === "Completed" || booking.confirmed)).length,
  }));
  const serviceChartData = services.map((service) => {
    const related = bookings.filter((booking) => String(booking.service || "").includes(service.name));
    return { name: service.name.split(" ")[0], revenue: related.reduce((sum, booking) => sum + Number(booking.amount || 0), 0) };
  }).filter((item) => item.revenue > 0);

  const notifications = [
    ...lowStock.map((item) => `Low stock: ${item.item} only ${item.stock} ${item.unit}`),
    `${pending} bookings waiting confirmation`,
    `Confirmed revenue ₹${totalRevenue.toLocaleString()}`,
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

  function notify(message) {
    setToast(message);
    setLoadingPulse(true);
    window.setTimeout(() => setLoadingPulse(false), 700);
  }

  function updateBooking(id, patch) {
    const finalPatch = patch.confirmed ? { ...patch, status: patch.status || "Confirmed" } : patch;
    setBookings((previous) => previous.map((booking) => (booking.id === id ? { ...booking, ...finalPatch } : booking)));
    setSelectedBooking((old) => (old && old.id === id ? { ...old, ...finalPatch } : old));
  }

  function addBooking(form) {
    const next = makeBooking(form, bookings.length);
    setBookings((previous) => [next, ...previous]);
    setSelectedBooking(next);
    setShowAddBooking(false);
    setActive("Live Bookings");
    notify(`Booking saved: ${next.id}`);
  }

  function simulateWebsiteSync() {
    const websiteBooking = makeBooking({
      customer: "Website Auto Lead",
      phone: "9000012345",
      area: "Trichy Website",
      address: "Auto synced website enquiry",
      service: "Furnished Deep Cleaning",
      servicesList: [{ service: "Furnished Deep Cleaning", qty: 850, amount: 7225 }],
      qty: 850,
      amount: 7225,
      leadSource: "Website Lead",
      source: "Website",
    }, bookings.length);
    setBookings((previous) => [websiteBooking, ...previous]);
    setSyncLog((previous) => [`Website booking synced: ${websiteBooking.id}`, ...previous.slice(0, 5)]);
    setActive("Customers CRM");
    notify("Website booking auto synced");
  }

  function openPrintableDocument(title, bodyHtml) {
    const html = `<!doctype html><html><head><meta charset="utf-8" /><title>${title}</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#0f172a}h1{margin:0 0 6px}table{width:100%;border-collapse:collapse;margin-top:16px}td,th{border:1px solid #e2e8f0;padding:10px;text-align:left}.total{font-size:22px;font-weight:800;margin-top:18px}.muted{color:#64748b}</style></head><body>${bodyHtml}</body></html>`;
    const win = window.open("", "_blank");
    if (!win) {
      notify("Popup blocked. Browser popup allow pannunga.");
      return;
    }
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  }

  function downloadInvoicePDF(booking) {
    const rows = (booking.servicesList || []).map((item, index) => `<tr><td>${index + 1}</td><td>${item.service}</td><td>${item.qty}</td><td>Rs.${Number(item.amount || 0).toLocaleString()}</td></tr>`).join("");
    openPrintableDocument(`${booking.id}-FreshNest-Invoice`, `
      <h1>FreshNest Cleaning Services</h1>
      <p class="muted">Trichy • Owners: Neethirajan & Selva Kumar</p>
      <hr />
      <h2>Invoice: ${booking.id}</h2>
      <p><b>Customer:</b> ${booking.customer}</p>
      <p><b>Phone:</b> ${booking.phone}</p>
      <p><b>Address:</b> ${booking.address || booking.area}</p>
      <p><b>Date:</b> ${booking.date} ${booking.time || ""}</p>
      <p><b>Status:</b> ${booking.confirmed ? "Confirmed" : booking.status}</p>
      <table><thead><tr><th>#</th><th>Service</th><th>Qty</th><th>Amount</th></tr></thead><tbody>${rows}</tbody></table>
      <p class="total">Total: Rs.${Number(booking.amount || 0).toLocaleString()}</p>
    `);
    notify("Invoice print / Save as PDF opened");
  }

  function whatsappTemplate(booking, type = "confirm") {
    const total = Number(booking.amount || 0).toLocaleString();
    const templates = {
      confirm: `FreshNest booking confirmed ✅\nCustomer: ${booking.customer}\nService: ${booking.service}\nDate: ${booking.date} ${booking.time || ""}\nAmount: ₹${total}`,
      payment: `FreshNest payment reminder 💰\nHi ${booking.customer}, pending amount ₹${total} for ${booking.service}.`,
      review: `Hi ${booking.customer}, thank you for choosing FreshNest. Please share your review 🙏`,
      completed: `FreshNest work completed ✅\nCustomer: ${booking.customer}\nService: ${booking.service}\nAmount: ₹${total}`,
    };
    notify(templates[type] || templates.confirm);
  }

  function exportBookingsCSV() {
    const headers = ["ID", "Customer", "Phone", "Service", "Date", "Status", "Payment", "Amount", "Lead Source"];
    const rows = bookings.map((booking) => [booking.id, booking.customer, booking.phone, booking.service, booking.date, booking.status, booking.payment, booking.amount, booking.leadSource]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "FreshNest-Bookings-Report.csv";
    link.click();
    URL.revokeObjectURL(url);
    notify("CSV export downloaded");
  }

  function downloadMonthlyMISPDF() {
    openPrintableDocument("FreshNest-Monthly-MIS", `
      <h1>FreshNest Monthly MIS Report</h1>
      <p class="muted">FreshNest Cleaning Services • Trichy</p>
      <hr />
      <table>
        <tbody>
          <tr><th>Total Bookings</th><td>${bookings.length}</td></tr>
          <tr><th>Confirmed Revenue</th><td>Rs.${totalRevenue.toLocaleString()}</td></tr>
          <tr><th>Fuel Expense</th><td>Rs.${fuelExpense}</td></tr>
          <tr><th>Estimated Profit</th><td>Rs.${Math.max(0, totalRevenue - fuelExpense).toLocaleString()}</td></tr>
          <tr><th>Website Leads</th><td>${websiteLeads.length}</td></tr>
          <tr><th>App Leads</th><td>${appLeads.length}</td></tr>
          <tr><th>Repeat Customers</th><td>${repeatCustomerCount}</td></tr>
        </tbody>
      </table>
    `);
    notify("Monthly MIS print / Save as PDF opened");
  }

  function addStaff() {
    if (!staffForm.name.trim()) return;
    const person = { id: Date.now(), name: staffForm.name, role: staffForm.role, status: "Present", salary: Number(staffForm.salary || 0), advance: 0 };
    setStaff((previous) => [...previous, person]);
    setPayroll((previous) => [...previous, { id: Date.now() + 1, name: person.name, salary: person.salary, advance: 0, bonus: 0 }]);
    setStaffForm({ name: "", role: "Cleaner", salary: "20000" });
  }

  function addInventory() {
    if (!inventoryForm.item.trim()) return;
    setInventory((previous) => [...previous, { id: Date.now(), item: inventoryForm.item, stock: Number(inventoryForm.stock || 0), min: Number(inventoryForm.min || 0), unit: inventoryForm.unit || "pcs" }]);
    setInventoryForm({ item: "", stock: "", min: "", unit: "pcs" });
  }

  function addPayroll() {
    if (!payrollForm.name.trim()) return;
    setPayroll((previous) => [...previous, { id: Date.now(), name: payrollForm.name, salary: Number(payrollForm.salary || 0), advance: Number(payrollForm.advance || 0), bonus: Number(payrollForm.bonus || 0) }]);
    setPayrollForm({ name: "", salary: "", advance: "0", bonus: "0" });
  }

  function Login() {
    return (
      <div className="min-h-screen bg-[#07162a] p-5 text-white">
        <div className="mx-auto flex min-h-[90vh] max-w-6xl items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="grid w-full overflow-hidden rounded-[2rem] bg-white/10 shadow-2xl md:grid-cols-2">
            <div className="p-10"><div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-4xl">🧹</div><h1 className="text-5xl font-black">FreshNest Admin ERP</h1><p className="mt-4 max-w-md text-white/70">Premium dashboard for bookings, CRM, staff, invoices, analytics and automation.</p></div>
            <div className="bg-white p-8 text-slate-950"><h2 className="text-3xl font-black">Admin Login</h2><p className="mt-2 text-sm text-slate-500">Demo credentials already filled.</p><div className="mt-8 grid gap-4"><input value="admin@freshnest.in" readOnly className="rounded-2xl border border-slate-200 px-4 py-3" /><input value="freshnest123" readOnly type="password" className="rounded-2xl border border-slate-200 px-4 py-3" /><button onClick={() => setLoggedIn(true)} className="rounded-2xl bg-[#07162a] px-5 py-3 font-black text-[#d4af37]">Login</button></div></div>
          </motion.div>
        </div>
      </div>
    );
  }

  function Shell({ children }) {
    return (
      <div className={dark ? "dark" : ""}>
        <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-[#06111f] dark:text-white">
          {toast && <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="fixed right-4 top-4 z-[90] max-w-sm rounded-2xl bg-[#07162a] p-4 text-sm font-bold text-[#d4af37] shadow-2xl whitespace-pre-line">{toast}</motion.div>}
          <aside className="fixed left-0 top-0 hidden h-full w-72 overflow-y-auto bg-[#07162a] p-4 text-white lg:block">
            <div className="mb-5 flex items-center gap-3 rounded-3xl bg-white/10 p-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl">🧹</div><div><h1 className="font-black">FreshNest</h1><p className="text-xs text-[#d4af37]">Premium ERP</p></div></div>
            <nav className="space-y-1 pb-6">{nav.map(([name, Icon]) => <button key={name} onClick={() => setActive(name)} className={cn("flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold", active === name ? "bg-[#d4af37] text-[#07162a]" : "text-white/75 hover:bg-white/10")}><Icon size={18} /> {name}</button>)}</nav>
          </aside>
          <main className="lg:pl-72">
            <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-[#06111f]/90">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><h2 className="text-2xl font-black">{active}</h2><p className="text-sm text-slate-500 dark:text-slate-400">FreshNest Cleaning Services • Trichy</p></div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative"><Search className="absolute left-3 top-2.5 text-slate-400" size={18} /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search jobs..." className="w-64 rounded-2xl border border-slate-200 bg-white py-2 pl-10 pr-4 outline-none focus:border-[#d4af37] dark:border-slate-700 dark:bg-slate-950" /></div>
                  <button onClick={() => setShowAddBooking(true)} className="rounded-2xl bg-[#07162a] px-4 py-2 text-sm font-black text-[#d4af37] dark:bg-[#d4af37] dark:text-[#07162a]"><Plus size={16} className="inline" /> Add Job</button>
                  <button onClick={() => setDark((value) => !value)} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 font-bold dark:border-[#d4af37] dark:bg-[#d4af37] dark:text-[#07162a]">{dark ? <Sun size={18} /> : <Moon size={18} />} {dark ? "Bright" : "Night"}</button>
                  <div className="relative"><button onClick={() => setShowNotifications((value) => !value)} className="relative rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-950"><Bell /><span className="absolute -right-1 -top-1 rounded-full bg-[#d4af37] px-1 text-[10px] font-black text-[#07162a]">{notifications.length}</span></button>{showNotifications && <div className="absolute right-0 top-12 z-50 w-80 rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-950"><div className="mb-2 flex justify-between"><b>Notifications</b><button onClick={() => setShowNotifications(false)}><X size={16} /></button></div>{notifications.map((note, index) => <div key={index} className="mb-2 rounded-2xl bg-slate-100 p-3 text-sm dark:bg-slate-800">🔔 {note}</div>)}</div>}</div>
                </div>
              </div>
            </header>
            <div className="p-4 pb-24 md:p-6 md:pb-28">{loadingPulse && <div className="mb-4 grid gap-3 md:grid-cols-3"><div className="h-20 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" /><div className="h-20 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" /><div className="h-20 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" /></div>}{children}</div>
          </main>
          {showAddBooking && <AddBookingModal onClose={() => setShowAddBooking(false)} onSave={addBooking} />}
          {selectedBooking && <BookingDrawer booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
        </div>
      </div>
    );
  }

  function Dashboard() {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-gradient-to-r from-[#07162a] to-slate-900 p-5 text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-2xl font-black">Live Premium Control Center</h3><p className="text-sm text-white/70">Booking alert, exports, analytics and automation ready.</p></div><button onClick={() => notify("🔔 New booking alert sound simulated")} className="rounded-2xl bg-[#d4af37] px-4 py-2 font-black text-[#07162a]">Test Alert</button></div>
        </motion.div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><StatCard title="Confirmed Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={IndianRupee} sub="Confirmed bookings only" /><StatCard title="Completed Revenue" value={`₹${completedRevenue.toLocaleString()}`} icon={CheckCircle2} sub="Completed jobs" /><StatCard title="Pending Confirm" value={pending} icon={ClipboardList} sub="Need follow-up" /><StatCard title="Fuel Expense" value={`₹${fuelExpense}`} icon={TrendingUp} sub={`${totalKm} km • 16 km = ₹100`} /></div>
        <div className="grid gap-4 xl:grid-cols-3"><Card className="xl:col-span-2"><div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-black">Live Job Flow</h3><Badge>{bookings.length} Jobs</Badge></div><BookingTable compact /></Card><Card><h3 className="mb-4 text-lg font-black">Notifications</h3>{notifications.map((note, index) => <div key={index} className="mb-2 rounded-2xl bg-slate-100 p-3 text-sm dark:bg-slate-800">🔔 {note}</div>)}</Card></div>
      </div>
    );
  }

  function BookingTable({ compact = false }) {
    const rows = compact ? filteredBookings.slice(0, 5) : filteredBookings;
    return <div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800">{["ID", "Customer", "Service", "Date", "Supervisor", "Status", "Payment", "Lead", "Amount", "Action"].map((heading) => <th key={heading} className="py-3 pr-4">{heading}</th>)}</tr></thead><tbody>{rows.map((booking) => <tr key={booking.id} className="border-b border-slate-100 dark:border-slate-800"><td className="py-3 pr-4 font-black">{booking.id}</td><td className="py-3 pr-4"><b>{booking.customer}</b><p className="flex items-center gap-1 text-xs text-slate-500"><Phone size={12} />{booking.phone}</p></td><td className="py-3 pr-4">{booking.service}<p className="text-xs text-slate-500">Qty: {booking.qty}</p></td><td className="py-3 pr-4">{booking.date}<p className="text-xs text-slate-500">{booking.time}</p></td><td className="py-3 pr-4">{booking.supervisorAssigned}</td><td className="py-3 pr-4"><Badge>{booking.confirmed ? "Confirmed" : booking.status}</Badge></td><td className="py-3 pr-4"><Badge>{booking.payment}</Badge></td><td className="py-3 pr-4 text-xs text-slate-500">{booking.leadSource}</td><td className="py-3 pr-4 font-black">₹{Number(booking.amount).toLocaleString()}</td><td className="py-3 pr-4"><div className="flex gap-2"><button onClick={() => updateBooking(booking.id, { confirmed: true, status: "Confirmed" })} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white">Confirm</button><button onClick={() => setSelectedBooking(booking)} className="rounded-xl bg-[#07162a] px-3 py-2 text-xs font-black text-[#d4af37]">Open</button></div></td></tr>)}</tbody></table></div>;
  }

  function Jobs() { return <Card><div className="mb-4 flex items-center justify-between"><h3 className="text-xl font-black">All Jobs</h3><button onClick={() => setShowAddBooking(true)} className="rounded-2xl bg-[#07162a] px-4 py-2 font-black text-[#d4af37]"><Plus size={16} className="inline" /> Add Job</button></div><BookingTable /></Card>; }
  function SupervisorApp() { return <div className="grid gap-4 xl:grid-cols-2">{filteredBookings.map((booking) => <Card key={booking.id}><div className="flex items-start justify-between gap-3"><div><h3 className="text-xl font-black">{booking.customer}</h3><p className="text-sm text-slate-500">{booking.area} • {booking.service}</p><p className="text-xs text-[#d4af37]">Supervisor: {booking.supervisorAssigned}</p></div><Badge>{booking.confirmed ? "Confirmed" : booking.status}</Badge></div><div className="mt-4 grid gap-2 md:grid-cols-4">{["Pending", "On The Way", "Work Started", "Completed"].map((step) => <button key={step} onClick={() => updateBooking(booking.id, { status: step, confirmed: step !== "Pending" })} className="rounded-2xl bg-slate-100 px-3 py-3 text-sm font-black hover:bg-[#d4af37] dark:bg-slate-800">{step}</button>)}</div><button onClick={() => setSelectedBooking(booking)} className="mt-3 w-full rounded-2xl bg-[#07162a] px-4 py-3 font-black text-[#d4af37]">Open Full Workflow</button></Card>)}</div>; }

  function CalendarView() {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = Array.from({ length: firstDay }, () => null).concat(Array.from({ length: daysInMonth }, (_, index) => index + 1));
    const title = calendarMonth.toLocaleString("default", { month: "long", year: "numeric" });
    const moveMonth = (step) => setCalendarMonth(new Date(year, month + step, 1));
    return <div className="grid gap-4 xl:grid-cols-[1.4fr_.6fr]"><Card><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h3 className="text-2xl font-black">{title}</h3><div className="flex gap-2"><button onClick={() => moveMonth(-1)} className="rounded-2xl border p-2 dark:border-slate-700">Prev</button><button onClick={() => setCalendarMonth(new Date())} className="rounded-2xl bg-[#07162a] px-4 py-2 font-black text-[#d4af37]">Today</button><button onClick={() => moveMonth(1)} className="rounded-2xl border p-2 dark:border-slate-700">Next</button></div></div><div className="grid grid-cols-7 gap-2 text-center text-xs font-black text-slate-500">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((dayName) => <div key={dayName}>{dayName}</div>)}</div><div className="mt-2 grid grid-cols-7 gap-2">{cells.map((day, index) => { if (!day) return <div key={`empty-${index}`} className="min-h-24 rounded-2xl bg-slate-50 dark:bg-slate-800/40" />; const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`; const list = bookings.filter((booking) => booking.confirmed && booking.date === date); return <button key={date} className="min-h-24 rounded-2xl border border-slate-200 p-2 text-left hover:border-[#d4af37] dark:border-slate-800"><b>{day}</b>{list.map((booking) => <p key={booking.id} className="mt-1 truncate rounded-lg bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">{booking.customer}</p>)}</button>; })}</div></Card><Card><h3 className="mb-3 text-xl font-black">Confirmed Month Jobs</h3><div className="space-y-2">{bookings.filter((booking) => booking.confirmed && booking.date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)).map((booking) => <button key={booking.id} onClick={() => setSelectedBooking(booking)} className="w-full rounded-2xl bg-slate-100 p-3 text-left text-sm dark:bg-slate-800"><b>{booking.customer}</b><p className="text-slate-500">{booking.date} • {booking.service}</p></button>)}</div></Card></div>;
  }

  function Services() { return <div className="space-y-4"><Card><div className="flex items-center justify-between"><div><h3 className="text-2xl font-black">Services & Rate Edit</h3><p className="text-sm text-slate-500">Rate edit immediate booking amount calculation use aagum.</p></div><button onClick={() => setServices((previous) => [...previous, { name: "New Service", rate: 0, unit: "unit" }])} className="rounded-2xl bg-[#07162a] px-4 py-2 font-black text-[#d4af37]"><Plus size={16} className="inline" /> Add Service</button></div></Card><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{services.map((service, index) => <Card key={`${service.name}-${index}`}><Sparkles className="text-[#d4af37]" /><Field label="Service Name" value={service.name} onChange={(value) => setServices((previous) => previous.map((item, i) => i === index ? { ...item, name: value } : item))} /><div className="mt-3 grid grid-cols-2 gap-3"><Field label="Rate" type="number" value={service.rate} onChange={(value) => setServices((previous) => previous.map((item, i) => i === index ? { ...item, rate: Number(value || 0) } : item))} /><Field label="Unit" value={service.unit} onChange={(value) => setServices((previous) => previous.map((item, i) => i === index ? { ...item, unit: value } : item))} /></div></Card>)}</div></div>; }
  function Staff() { return <div className="space-y-4"><Card><h3 className="mb-4 text-xl font-black">Add Staff Full Name</h3><div className="grid gap-3 md:grid-cols-4"><input value={staffForm.name} onChange={(event) => setStaffForm((old) => ({ ...old, name: event.target.value }))} placeholder="Full name" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-950 md:col-span-2" /><input value={staffForm.role} onChange={(event) => setStaffForm((old) => ({ ...old, role: event.target.value }))} placeholder="Role" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-950" /><button onClick={addStaff} className="rounded-2xl bg-[#07162a] px-5 py-3 font-black text-[#d4af37]">Add Staff</button></div></Card><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{staff.map((person) => <Card key={person.id}><h3 className="text-xl font-black">{person.name}</h3><p className="text-sm text-slate-500">{person.role}</p><div className="mt-3"><Badge>{person.status}</Badge></div><p className="mt-4 text-sm">Salary: <b>₹{person.salary}</b></p><p className="text-sm">Advance: <b>₹{person.advance}</b></p></Card>)}</div></div>; }
  function Inventory() { return <Card><div className="mb-4 flex items-center justify-between"><h3 className="text-xl font-black">Inventory</h3><button onClick={addInventory} className="rounded-2xl bg-[#07162a] px-4 py-2 font-black text-[#d4af37]"><Plus size={16} className="inline" /> Add Item</button></div><div className="mb-4 grid gap-3 md:grid-cols-5"><input value={inventoryForm.item} onChange={(event) => setInventoryForm((old) => ({ ...old, item: event.target.value }))} placeholder="Item name" className="rounded-2xl border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /><input value={inventoryForm.stock} onChange={(event) => setInventoryForm((old) => ({ ...old, stock: event.target.value }))} placeholder="Stock" type="number" className="rounded-2xl border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /><input value={inventoryForm.min} onChange={(event) => setInventoryForm((old) => ({ ...old, min: event.target.value }))} placeholder="Min" type="number" className="rounded-2xl border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /><input value={inventoryForm.unit} onChange={(event) => setInventoryForm((old) => ({ ...old, unit: event.target.value }))} placeholder="Unit" className="rounded-2xl border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /></div><div className="grid gap-3">{inventory.map((item) => <div key={item.id} className="flex items-center justify-between rounded-2xl bg-slate-100 p-4 dark:bg-slate-800"><div><b>{item.item}</b><p className="text-sm text-slate-500">Min: {item.min} {item.unit}</p></div><div className="text-xl font-black">{item.stock} {item.unit}</div></div>)}</div></Card>; }
  function Payroll() { return <Card><div className="mb-4 flex items-center justify-between"><h3 className="text-2xl font-black">Payroll</h3><button onClick={addPayroll} className="rounded-2xl bg-[#07162a] px-4 py-2 font-black text-[#d4af37]"><Plus size={16} className="inline" /> Add Payroll</button></div><div className="mb-4 grid gap-3 md:grid-cols-4"><input value={payrollForm.name} onChange={(event) => setPayrollForm((old) => ({ ...old, name: event.target.value }))} placeholder="Staff name" className="rounded-2xl border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /><input value={payrollForm.salary} onChange={(event) => setPayrollForm((old) => ({ ...old, salary: event.target.value }))} placeholder="Salary" type="number" className="rounded-2xl border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /><input value={payrollForm.advance} onChange={(event) => setPayrollForm((old) => ({ ...old, advance: event.target.value }))} placeholder="Advance" type="number" className="rounded-2xl border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /><input value={payrollForm.bonus} onChange={(event) => setPayrollForm((old) => ({ ...old, bonus: event.target.value }))} placeholder="Bonus" type="number" className="rounded-2xl border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /></div><div className="grid gap-3">{payroll.map((person) => <div key={person.id} className="grid gap-3 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800 md:grid-cols-5"><b>{person.name}</b><span>Salary ₹{person.salary}</span><span>Advance ₹{person.advance}</span><span>Bonus ₹{person.bonus}</span><span>Balance ₹{Number(person.salary) + Number(person.bonus) - Number(person.advance)}</span></div>)}</div></Card>; }
  function Payments() { return <Card><h3 className="mb-4 text-xl font-black">Payments</h3><div className="grid gap-3">{bookings.map((booking) => <div key={booking.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800"><div><b>{booking.customer}</b><p className="text-sm text-slate-500">{booking.id} • {booking.service}</p></div><b>₹{booking.amount}</b><Badge>{booking.payment}</Badge><button onClick={() => updateBooking(booking.id, { payment: "Paid" })} className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-black text-white">Mark Paid</button></div>)}</div></Card>; }
  function Invoices() { return <div className="space-y-4"><Card><h3 className="text-2xl font-black">Invoices</h3><p className="text-sm text-slate-500">Real PDF invoice download added.</p></Card><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{bookings.map((booking) => <Card key={booking.id}><div className="flex items-start justify-between"><div><h3 className="text-xl font-black">Invoice {booking.id}</h3><p className="text-sm text-slate-500">{booking.customer}</p></div><FileText className="text-[#d4af37]" /></div><div className="mt-4 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800"><p>{booking.service}</p><p>Qty: {booking.qty}</p><p>Payment: {booking.payment}</p><p>Status: {booking.confirmed ? "Confirmed" : booking.status}</p><p className="mt-2 text-2xl font-black">₹{Number(booking.amount).toLocaleString()}</p></div><div className="mt-4 grid gap-2"><button onClick={() => downloadInvoicePDF(booking)} className="w-full rounded-2xl bg-[#07162a] px-4 py-3 font-black text-[#d4af37]">Download PDF Invoice</button><button onClick={() => whatsappTemplate(booking, "confirm")} className="w-full rounded-2xl bg-emerald-600 px-4 py-3 font-black text-white">WhatsApp Invoice Message</button></div></Card>)}</div></div>; }
  function Expenses() { return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><StatCard title="Total KM" value={`${totalKm} km`} icon={TrendingUp} sub="From job KM entries" /><StatCard title="Fuel Expense" value={`₹${fuelExpense}`} icon={ReceiptText} sub="16km = ₹100" /><StatCard title="Low Stock" value={lowStock.length} icon={Package} sub="Purchase needed" /><StatCard title="Pending Jobs" value={pending} icon={ClipboardList} sub="Team payout pending" /></div>; }
  function SettingsView() { return <Card><h3 className="text-xl font-black">Settings</h3><div className="mt-4 grid gap-3 md:grid-cols-2"><input value="FreshNest Cleaning Services" readOnly className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950" /><input value="Trichy" readOnly className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950" /><input value="Owners: Neethirajan & Selva Kumar" readOnly className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950 md:col-span-2" /></div></Card>; }

  function AddBookingModal({ onClose, onSave }) {
    const [form, setForm] = useState({ customer: "", phone: "", area: "Trichy", address: "", service: services[0].name, qty: 1, date: new Date().toISOString().slice(0, 10), time: "10:00 AM", staff: "Unassigned", leadSource: "Manual Lead", balanceWork: "", servicesList: [{ id: 1, service: services[0].name, qty: 1, amount: services[0].rate }] });
    const set = (key, value) => setForm((old) => ({ ...old, [key]: value }));
    const updateServiceRow = (id, key, value) => setForm((old) => ({ ...old, servicesList: old.servicesList.map((row) => row.id === id ? { ...row, [key]: value } : row) }));
    const addServiceRow = () => setForm((old) => ({ ...old, servicesList: [...old.servicesList, { id: Date.now(), service: services[0].name, qty: 1, amount: services[0].rate }] }));
    const removeServiceRow = (id) => setForm((old) => ({ ...old, servicesList: old.servicesList.length === 1 ? old.servicesList : old.servicesList.filter((row) => row.id !== id) }));
    const rowAmount = (row) => { const selected = services.find((service) => service.name === row.service) || services[0]; return selected.name === "Balance Work" ? Number(row.amount || 0) : Math.round(Number(row.qty || 1) * Number(selected.rate || 0)); };
    const calculatedRows = form.servicesList.map((row) => ({ ...row, amount: rowAmount(row) }));
    const totalAmount = calculatedRows.reduce((sum, row) => sum + Number(row.amount || 0), 0);
    return <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm"><motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl dark:bg-slate-950"><div className="mb-4 flex items-center justify-between"><div><h3 className="text-2xl font-black">Add Manual Booking</h3><p className="text-sm text-slate-500">Multiple services + lead source + auto amount.</p></div><button onClick={onClose} className="rounded-2xl border border-slate-200 p-2 dark:border-slate-800"><X /></button></div><div className="grid gap-4 md:grid-cols-2"><Field label="Customer" value={form.customer} onChange={(value) => set("customer", value)} /><Field label="Phone" value={form.phone} onChange={(value) => set("phone", value.replace(/[^0-9]/g, ""))} /><Field label="Area" value={form.area} onChange={(value) => set("area", value)} /><Field label="Address" value={form.address} onChange={(value) => set("address", value)} /><label className="grid gap-1 text-sm font-bold text-slate-700 dark:text-slate-200">Staff<select value={form.staff} onChange={(event) => set("staff", event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"><option>Unassigned</option>{staff.map((person) => <option key={person.id}>{person.name}</option>)}</select></label><label className="grid gap-1 text-sm font-bold text-slate-700 dark:text-slate-200">Lead Source<select value={form.leadSource} onChange={(event) => set("leadSource", event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"><option>Manual Lead</option><option>Website Lead</option><option>App Lead</option></select></label><Field label="Date" type="date" value={form.date} onChange={(value) => set("date", value)} /><Field label="Time" value={form.time} onChange={(value) => set("time", value)} /></div><Card className="mt-5 bg-slate-50 dark:bg-slate-900"><div className="mb-4 flex items-center justify-between"><h4 className="text-lg font-black">Services</h4><button onClick={addServiceRow} className="rounded-2xl bg-[#07162a] px-4 py-2 text-sm font-black text-[#d4af37]"><Plus size={16} className="inline" /> Add Service</button></div><div className="grid gap-3">{form.servicesList.map((row) => { const selected = services.find((service) => service.name === row.service) || services[0]; const amount = rowAmount(row); return <div key={row.id} className="grid gap-3 rounded-2xl bg-white p-3 dark:bg-slate-950 md:grid-cols-[1.5fr_.7fr_.7fr_auto]"><label className="grid gap-1 text-sm font-bold text-slate-700 dark:text-slate-200">Service<select value={row.service} onChange={(event) => updateServiceRow(row.id, "service", event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950">{services.map((service) => <option key={service.name}>{service.name}</option>)}</select></label><Field label={`Qty / ${selected.unit}`} type="number" value={row.qty} onChange={(value) => updateServiceRow(row.id, "qty", value)} /><Field label="Manual Amount" type="number" value={row.amount} onChange={(value) => updateServiceRow(row.id, "amount", value)} placeholder="Balance work" /><div className="flex items-end gap-2"><div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-black dark:bg-slate-800">₹{amount.toLocaleString()}</div><button onClick={() => removeServiceRow(row.id)} className="rounded-2xl border border-red-200 p-2 text-red-600">Remove</button></div></div>; })}</div><Field label="Balance / Extra Work Notes" value={form.balanceWork} onChange={(value) => set("balanceWork", value)} /></Card><div className="mt-5 rounded-3xl bg-slate-100 p-4 dark:bg-slate-800"><p className="text-sm text-slate-500">Total Booking Amount</p><p className="text-3xl font-black">₹{totalAmount.toLocaleString()}</p></div><div className="mt-5 grid gap-3 md:grid-cols-2"><button onClick={onClose} className="rounded-2xl border border-slate-200 px-5 py-3 font-black dark:border-slate-800">Cancel</button><button onClick={() => onSave({ ...form, servicesList: calculatedRows, amount: totalAmount, source: form.leadSource.includes("App") ? "App" : form.leadSource.includes("Manual") ? "Manual" : "Website" })} className="rounded-2xl bg-[#07162a] px-5 py-3 font-black text-[#d4af37]">Save Booking</button></div></motion.div></div>;
  }

  function BookingDrawer({ booking, onClose }) {
    const [draftServices, setDraftServices] = useState(booking.servicesList || [{ service: booking.service, qty: booking.qty, amount: booking.amount }]);
    const draftTotal = draftServices.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const addDraftService = () => setDraftServices((previous) => [...previous, { service: "Balance Work", qty: 1, amount: 0 }]);
    const updateDraftService = (index, key, value) => setDraftServices((previous) => previous.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
    const removeDraftService = (index) => setDraftServices((previous) => previous.length === 1 ? previous : previous.filter((_, itemIndex) => itemIndex !== index));
    const saveDraftServices = () => updateBooking(booking.id, { servicesList: draftServices, service: draftServices.map((item) => item.service).join(" + "), qty: draftServices.reduce((sum, item) => sum + Number(item.qty || 0), 0), amount: draftTotal });
    const kmStart = Number(booking.startKm || 0);
    const kmEnd = Number(booking.returnKm || booking.siteKm || booking.pickupKm || 0);
    const km = Math.max(0, kmEnd - kmStart);
    const expense = Math.round((km / 16) * 100);
    return <div className="fixed inset-0 z-50 flex justify-end bg-black/50 p-3 backdrop-blur-sm"><motion.div initial={{ x: 420, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="h-full w-full max-w-xl overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl dark:bg-slate-950"><div className="sticky top-0 mb-4 flex items-center justify-between bg-white/90 pb-3 backdrop-blur dark:bg-slate-950/90"><div><h3 className="text-2xl font-black">{booking.customer}</h3><p className="text-sm text-slate-500">{booking.id} • {booking.service}</p></div><button onClick={onClose} className="rounded-2xl border border-slate-200 p-2 dark:border-slate-800"><X /></button></div><div className="grid gap-4"><Card><h4 className="mb-3 font-black">Customer Details</h4><p><Phone size={15} className="inline" /> {booking.phone}</p><p>{booking.address}</p><div className="mt-3 grid gap-2 md:grid-cols-2"><button onClick={() => notify(`Call ${booking.phone}`)} className="rounded-2xl bg-emerald-600 px-4 py-3 font-black text-white">Call Customer</button><button onClick={() => whatsappTemplate(booking, "confirm")} className="rounded-2xl bg-[#07162a] px-4 py-3 font-black text-[#d4af37]">WhatsApp Confirm</button></div></Card><Card><div className="mb-3 flex items-center justify-between gap-2"><h4 className="font-black">Booked Services / Confirm Edit</h4><button onClick={addDraftService} className="rounded-xl bg-[#07162a] px-3 py-2 text-xs font-black text-[#d4af37]">+ Extra</button></div><div className="grid gap-2">{draftServices.map((item, index) => <div key={index} className="rounded-2xl bg-slate-100 p-3 text-sm dark:bg-slate-800"><div className="grid gap-2 md:grid-cols-[1.4fr_.5fr_.7fr_auto]"><input value={item.service} onChange={(event) => updateDraftService(index, "service", event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /><input type="number" value={item.qty} onChange={(event) => updateDraftService(index, "qty", event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /><input type="number" value={item.amount} onChange={(event) => updateDraftService(index, "amount", event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /><button onClick={() => removeDraftService(index)} className="rounded-xl border border-red-200 px-3 py-2 text-red-600">Remove</button></div></div>)}</div><div className="mt-3 rounded-2xl bg-emerald-100 p-3 font-black text-emerald-700">Updated Total ₹{draftTotal.toLocaleString()}</div><button onClick={saveDraftServices} className="mt-3 w-full rounded-2xl bg-[#07162a] px-4 py-3 font-black text-[#d4af37]">Save Service Changes</button></Card><Card><h4 className="mb-3 font-black">Booking Confirmation</h4><div className="grid gap-3 md:grid-cols-2"><button onClick={() => { saveDraftServices(); updateBooking(booking.id, { confirmed: true, status: "Confirmed", amount: draftTotal }); }} className="rounded-2xl bg-emerald-600 px-4 py-3 font-black text-white">Confirm Booking</button><button onClick={() => updateBooking(booking.id, { confirmed: false, status: "Cancelled" })} className="rounded-2xl bg-red-600 px-4 py-3 font-black text-white">Cancel Booking</button></div><div className="mt-3 grid gap-3 md:grid-cols-2"><label className="grid gap-1 text-sm font-bold text-slate-700 dark:text-slate-200">Assign Supervisor<select value={booking.supervisorAssigned || booking.staff || "Unassigned"} onChange={(event) => updateBooking(booking.id, { supervisorAssigned: event.target.value, staff: event.target.value })} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"><option>Unassigned</option>{staff.map((person) => <option key={person.id}>{person.name}</option>)}</select></label><Field label="Reschedule Date" type="date" value={booking.date} onChange={(value) => updateBooking(booking.id, { date: value })} /></div></Card><Card><h4 className="mb-3 font-black">Work Status</h4><div className="grid gap-2 md:grid-cols-2">{["Pending", "On The Way", "Work Started", "Completed"].map((status) => <button key={status} onClick={() => updateBooking(booking.id, { status, confirmed: status !== "Pending" })} className="rounded-2xl bg-slate-100 px-4 py-3 font-black hover:bg-[#d4af37] dark:bg-slate-800">{status}</button>)}</div></Card><Card><h4 className="mb-3 font-black">Balance / Extra Work</h4><Field label="Balance Work Notes" value={booking.balanceWork || ""} onChange={(value) => updateBooking(booking.id, { balanceWork: value })} /><div className="mt-3 grid grid-cols-2 gap-3"><Field label="Amount" type="number" value={booking.amount} onChange={(value) => updateBooking(booking.id, { amount: Number(value || 0) })} /><label className="grid gap-1 text-sm font-bold text-slate-700 dark:text-slate-200">Payment<select value={booking.payment} onChange={(event) => updateBooking(booking.id, { payment: event.target.value })} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"><option>Pending</option><option>Advance Paid</option><option>Paid</option></select></label></div></Card><Card><h4 className="mb-3 font-black">KM Workflow</h4><div className="grid gap-3 md:grid-cols-2"><Field label="Start KM" type="number" value={booking.startKm} onChange={(value) => updateBooking(booking.id, { startKm: value })} /><Field label="Pickup KM" type="number" value={booking.pickupKm} onChange={(value) => updateBooking(booking.id, { pickupKm: value })} /><Field label="Site Reach KM" type="number" value={booking.siteKm} onChange={(value) => updateBooking(booking.id, { siteKm: value })} /><Field label="Return / Drop KM" type="number" value={booking.returnKm} onChange={(value) => updateBooking(booking.id, { returnKm: value })} /></div><div className="mt-4 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800"><b>Total:</b> {km} km • <b>Expense:</b> ₹{expense}</div></Card></div></motion.div></div>;
  }

  function LiveBookings() { return <Jobs />; }
  function FirebaseSync() { const connected = firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId; const fields = ["id", "customer", "phone", "servicesList", "amount", "date", "staff", "confirmed", "leadSource", "payment", "createdAt"]; return <div className="grid gap-4 xl:grid-cols-2"><Card><h3 className="text-2xl font-black">Firebase Live Sync</h3><p className="mt-2 text-sm text-slate-500">Preview-safe Firebase layer. Production la firebase.js + env config connect pannina live sync ready.</p><div className="mt-5 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800"><p className="text-sm text-slate-500">Status</p><p className={cn("text-2xl font-black", connected ? "text-emerald-600" : "text-amber-600")}>{connected ? "Production Config Ready" : "Preview Safe Mode"}</p></div><div className="mt-5 grid gap-3 md:grid-cols-2"><button onClick={simulateWebsiteSync} className="rounded-2xl bg-[#07162a] px-5 py-3 font-black text-[#d4af37]">Simulate Website Auto Sync</button><button onClick={() => setSyncLog((previous) => ["Firestore schema validation passed", ...previous.slice(0, 5)])} className="rounded-2xl bg-emerald-600 px-5 py-3 font-black text-white">Test Schema Guard</button></div><div className="mt-5 space-y-2">{syncLog.map((log, index) => <div key={index} className="rounded-xl bg-slate-100 p-2 text-sm dark:bg-slate-800">✅ {log}</div>)}</div></Card><Card><h3 className="text-xl font-black">Connection Details</h3><div className="mt-4 grid gap-3">{Object.keys(firebaseConfig).map((key) => <Field key={key} label={key} value={firebaseConfig[key]} onChange={(value) => setFirebaseConfig((old) => ({ ...old, [key]: value }))} />)}</div></Card><Card className="xl:col-span-2"><h3 className="text-2xl font-black">Firestore Safe Schema</h3><div className="mt-4 grid gap-2 md:grid-cols-4">{fields.map((field) => <div key={field} className="rounded-xl bg-slate-100 p-3 text-sm font-bold dark:bg-slate-800">{field}</div>)}</div></Card></div>; }
  function CustomersCRM() { return <div className="space-y-4"><div className="grid gap-4 md:grid-cols-4"><StatCard title="Website Leads" value={websiteLeads.length} icon={Users} sub="Auto website CRM" /><StatCard title="App Leads" value={appLeads.length} icon={Users} sub="App / online leads" /><StatCard title="Manual Leads" value={manualLeads.length} icon={ClipboardList} sub="Manual bookings" /><StatCard title="Repeat Customers" value={repeatCustomerCount} icon={CheckCircle2} sub="Phone matched" /></div><Card><h3 className="mb-4 text-2xl font-black">Customers CRM</h3><p className="mb-4 text-sm text-slate-500">Website/App/Manual leads automatic customer database la show aagum.</p><BookingTable /></Card></div>; }
  function CustomerHistory() { const phones = [...new Set(bookings.map((booking) => booking.phone))]; return <div className="space-y-4"><Card><h3 className="text-2xl font-black">Lead Details Table</h3><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-slate-500"><th className="py-3 pr-4">Customer</th><th className="py-3 pr-4">Phone</th><th className="py-3 pr-4">Lead Source</th><th className="py-3 pr-4">Service</th><th className="py-3 pr-4">Status</th><th className="py-3 pr-4">Repeat</th></tr></thead><tbody>{bookings.map((booking) => <tr key={booking.id} className="border-b border-slate-100 dark:border-slate-800"><td className="py-3 pr-4 font-black">{booking.customer}</td><td className="py-3 pr-4">{booking.phone}</td><td className="py-3 pr-4"><Badge>{booking.leadSource}</Badge></td><td className="py-3 pr-4">{booking.service}</td><td className="py-3 pr-4"><Badge>{booking.confirmed ? "Confirmed" : booking.status}</Badge></td><td className="py-3 pr-4">{repeatMap[booking.phone] > 1 ? "Repeat" : "New"}</td></tr>)}</tbody></table></div></Card><div className="grid gap-4">{phones.map((phone) => { const list = bookings.filter((booking) => booking.phone === phone); const first = list[0]; return <Card key={phone}><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-xl font-black">{first.customer}</h3><p className="text-sm text-slate-500">{phone} • {list.length} booking(s)</p></div><button onClick={() => notify(`Call ${phone}`)} className="rounded-2xl bg-emerald-600 px-4 py-2 font-black text-white">Call</button></div><div className="mt-4 grid gap-2 md:grid-cols-3">{list.map((booking) => <button key={booking.id} onClick={() => setSelectedBooking(booking)} className="rounded-2xl bg-slate-100 p-3 text-left text-sm dark:bg-slate-800"><b>{booking.id}</b><p>{booking.service}</p><p>₹{booking.amount}</p><p className="text-xs text-slate-500">{booking.date}</p></button>)}</div></Card>; })}</div></div>; }
  function Complaints() { function addComplaint() { if (!complaintForm.customer.trim()) return; setComplaints((previous) => [{ id: Date.now(), customer: complaintForm.customer, issue: complaintForm.issue || "New issue", status: "Open" }, ...previous]); setComplaintForm({ customer: "", issue: "" }); } return <Card><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h3 className="text-2xl font-black">Complaints</h3><button onClick={addComplaint} className="rounded-2xl bg-[#07162a] px-4 py-2 font-black text-[#d4af37]"><Plus size={16} className="inline" /> Add Complaint</button></div><div className="mb-4 grid gap-3 md:grid-cols-2"><input value={complaintForm.customer} onChange={(event) => setComplaintForm((old) => ({ ...old, customer: event.target.value }))} placeholder="Customer" className="rounded-2xl border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /><input value={complaintForm.issue} onChange={(event) => setComplaintForm((old) => ({ ...old, issue: event.target.value }))} placeholder="Issue" className="rounded-2xl border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /></div><div className="grid gap-3">{complaints.map((complaint) => <div key={complaint.id} className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800"><b>{complaint.customer}</b><p className="text-sm text-slate-500">{complaint.issue}</p><div className="mt-2"><Badge>{complaint.status}</Badge></div></div>)}</div></Card>; }
  function StaffPerformance() { return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{staff.map((person) => { const data = staffChartData.find((item) => item.name === person.name.split(" ")[0]); const score = Math.min(100, 70 + (data?.completed || 0) * 10 + (data?.jobs || 0) * 3); return <Card key={person.id}><h3 className="text-xl font-black">{person.name}</h3><p className="text-sm text-slate-500">{person.role}</p><p className="mt-4 text-4xl font-black text-[#07162a] dark:text-white">{score}</p><p className="text-sm text-slate-500">Performance score</p><p className="mt-3 text-xs text-slate-500">Jobs: {data?.jobs || 0} • Completed: {data?.completed || 0}</p></Card>; })}</div>; }
  function Attendance() { return <Card><h3 className="mb-4 text-2xl font-black">Attendance</h3><div className="grid gap-3">{staff.map((person) => <div key={person.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800"><div><b>{person.name}</b><p className="text-sm text-slate-500">{person.role}</p></div><select value={person.status} onChange={(event) => setStaff((previous) => previous.map((item) => item.id === person.id ? { ...item, status: event.target.value } : item))} className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"><option>Present</option><option>Absent</option></select></div>)}</div></Card>; }
  function Reminders() { const pendingPayments = bookings.filter((booking) => booking.payment !== "Paid"); const completedJobs = bookings.filter((booking) => booking.status === "Completed" || booking.confirmed); return <div className="grid gap-4 xl:grid-cols-2"><Card><h3 className="mb-4 text-2xl font-black">Payment Reminders</h3>{pendingPayments.map((booking) => <div key={booking.id} className="mb-3 rounded-2xl bg-slate-100 p-3 dark:bg-slate-800"><div className="flex items-center justify-between gap-3"><div><b>{booking.customer}</b><p className="text-xs text-slate-500">₹{booking.amount} pending</p></div><button onClick={() => whatsappTemplate(booking, "payment")} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white">WhatsApp</button></div></div>)}</Card><Card><h3 className="mb-4 text-2xl font-black">Review / Completion Automation</h3>{completedJobs.map((booking) => <div key={booking.id} className="mb-3 rounded-2xl bg-slate-100 p-3 dark:bg-slate-800"><b>{booking.customer}</b><p className="text-sm text-slate-500">{booking.service}</p><div className="mt-3 grid gap-2 md:grid-cols-2"><button onClick={() => whatsappTemplate(booking, "completed")} className="rounded-xl bg-[#07162a] px-3 py-2 text-xs font-black text-[#d4af37]">Completed Msg</button><button onClick={() => whatsappTemplate(booking, "review")} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white">Review Msg</button></div></div>)}</Card></div>; }
  function Marketing() { const leadRows = [{ name: "Website Lead", count: websiteLeads.length, note: "Website booking form" }, { name: "App Lead", count: appLeads.length, note: "App / Instagram / online leads" }, { name: "Manual Lead", count: manualLeads.length, note: "Admin manual entry" }, { name: "Repeat Customers", count: repeatCustomerCount, note: "Phone number matched" }]; const ideas = ["Before/After sofa reel", "Festival deep cleaning offer", "Water tank safety post", "Referral cashback"]; return <div className="grid gap-4 xl:grid-cols-2"><Card><h3 className="mb-4 text-2xl font-black">Marketing Leads</h3>{leadRows.map((item) => <div key={item.name} className="mb-3 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800"><div className="flex items-center justify-between"><b>{item.name}</b><span className="text-2xl font-black text-[#d4af37]">{item.count}</span></div><p className="text-sm text-slate-500">{item.note}</p></div>)}</Card><Card><h3 className="mb-4 text-2xl font-black">Lead Details</h3><div className="space-y-3">{bookings.slice(0, 8).map((booking) => <button key={booking.id} onClick={() => setSelectedBooking(booking)} className="w-full rounded-2xl bg-slate-100 p-3 text-left dark:bg-slate-800"><b>{booking.customer}</b><p className="text-sm text-slate-500">{booking.leadSource} • {booking.service}</p><p className="text-xs text-slate-500">{booking.phone} • {booking.confirmed ? "Confirmed" : booking.status}</p></button>)}</div></Card><Card><h3 className="mb-4 text-2xl font-black">Campaign Ideas</h3>{ideas.map((item) => <div key={item} className="mb-3 rounded-2xl bg-[#07162a] p-4 font-black text-[#d4af37]">{item}</div>)}</Card></div>; }
  function ProfitAnalysis() { const profitNow = Math.max(0, totalRevenue - fuelExpense); return <div className="space-y-4"><div className="grid gap-4 md:grid-cols-3"><StatCard title="Confirmed Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={IndianRupee} sub="Confirmed bookings only" /><StatCard title="Fuel / Ops Expense" value={`₹${fuelExpense}`} icon={ReceiptText} sub="KM based estimate" /><StatCard title="Estimated Profit" value={`₹${profitNow.toLocaleString()}`} icon={TrendingUp} sub="Revenue - fuel" /></div><Card><h3 className="mb-4 text-2xl font-black">Revenue vs Expense Trend</h3><div className="h-80"><ResponsiveContainer width="100%" height="100%"><LineChart data={analyticsData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={3} /><Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} /><Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} /></LineChart></ResponsiveContainer></div></Card><div className="grid gap-4 xl:grid-cols-2"><Card><h3 className="mb-4 text-2xl font-black">Service Revenue</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={serviceChartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="revenue" fill="#d4af37" radius={[12, 12, 0, 0]} /></BarChart></ResponsiveContainer></div></Card><Card><h3 className="mb-4 text-2xl font-black">Lead Source Split</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={leadChartData} dataKey="value" nameKey="name" outerRadius={95} label>{leadChartData.map((entry, index) => <Cell key={entry.name} fill={["#d4af37", "#3b82f6", "#10b981"][index % 3]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></Card></div></div>; }
  function Reports() { return <div className="space-y-4"><Card><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-2xl font-black">Reports Export & Premium Tools</h3><p className="text-sm text-slate-500">CSV export, monthly MIS PDF, sound alert and loading polish.</p></div><div className="flex flex-wrap gap-2"><button onClick={exportBookingsCSV} className="rounded-2xl bg-[#07162a] px-4 py-2 font-black text-[#d4af37]">Export CSV</button><button onClick={downloadMonthlyMISPDF} className="rounded-2xl bg-emerald-600 px-4 py-2 font-black text-white">MIS PDF</button><button onClick={() => notify("🔔 New booking alert sound simulated")} className="rounded-2xl bg-slate-200 px-4 py-2 font-black text-slate-900 dark:bg-slate-800 dark:text-white">Sound Alert</button></div></div></Card><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><StatCard title="Bookings" value={bookings.length} icon={ClipboardList} sub="Total records" /><StatCard title="Staff" value={staff.length} icon={Users} sub="Workers" /><StatCard title="Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={IndianRupee} sub="Confirmed jobs" /><StatCard title="Fuel" value={`₹${fuelExpense}`} icon={ReceiptText} sub="KM based" /></div><div className="grid gap-4 xl:grid-cols-2"><Card><h3 className="mb-4 text-2xl font-black">Monthly Revenue Analytics</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={analyticsData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="revenue" fill="#d4af37" radius={[12, 12, 0, 0]} /><Bar dataKey="profit" fill="#10b981" radius={[12, 12, 0, 0]} /></BarChart></ResponsiveContainer></div></Card><Card><h3 className="mb-4 text-2xl font-black">Staff Performance Analytics</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={staffChartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="jobs" fill="#3b82f6" radius={[12, 12, 0, 0]} /><Bar dataKey="completed" fill="#10b981" radius={[12, 12, 0, 0]} /></BarChart></ResponsiveContainer></div></Card></div></div>; }
  function AuditLogs() { const logs = ["Dashboard opened", "Booking updated", "Payment marked", "Staff added", "Invoice viewed", "Rate edited"]; return <Card><h3 className="mb-4 text-2xl font-black">Audit Logs</h3>{logs.map((log, index) => <div key={log} className="mb-2 rounded-2xl bg-slate-100 p-3 text-sm dark:bg-slate-800"><b>Owner</b> • {log}<p className="text-xs text-slate-500">Log #{index + 1}</p></div>)}</Card>; }

  function Screen() {
    const map = { Dashboard, Jobs, "Supervisor App": SupervisorApp, "Live Bookings": LiveBookings, "Firebase Sync": FirebaseSync, Calendar: CalendarView, "Customers CRM": CustomersCRM, "Customer History": CustomerHistory, Complaints, Services, "Staff Performance": StaffPerformance, Attendance, Payroll, Inventory, Expenses, Payments, Reminders, Invoices, Marketing, "Profit Analysis": ProfitAnalysis, Reports, "Audit Logs": AuditLogs, Settings: SettingsView };
    const Component = map[active] || Dashboard;
    return <Component />;
  }

  if (!loggedIn) return <Login />;
  return <Shell><Screen /></Shell>;
}
