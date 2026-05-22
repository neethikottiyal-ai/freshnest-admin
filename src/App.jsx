import React, { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, doc, updateDoc, setDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase.js";

const serviceIcons = {
  "Refrigerator Interior Cleaning": "🧊",
  "AC Filter Cleaning": "❄️",
  "Sofa Shampooing": "🛋️",
  "Bed Shampooing – Single": "🛏️",
  "Bed Shampooing – Double": "🛏️",
  "Bed Shampooing – King or Queen Size": "👑",
  "Carpet Shampooing": "🧶",
  "Water Tank Cleaning": "🚰",
  "Loft Interior Cleaning": "🏠",
  "Exterior Pressure Washing": "💦",
  "Termite Control Treatment": "🐜",
  "General Pest Control Treatment": "🛡️",
  "Furnished Deep Cleaning": "🏡",
  "Unfurnished Deep Cleaning": "🧹",
  "Balance Work": "➕",
};
const staffAvatars = ["👨🏽‍💼", "👷🏽", "🧑🏽‍🔧", "👨🏽‍🔬", "🧑🏽‍💻", "👨🏽‍🚒"];
const quoteOfDay = "Clean space, clear mind — every booking builds FreshNest stronger.";

const masterServices = [
  { name: "Refrigerator Interior Cleaning", rate: 850, unit: "unit" },
  { name: "AC Filter Cleaning", rate: 350, unit: "unit" },
  { name: "Sofa Shampooing", rate: 550, unit: "seat" },
  { name: "Bed Shampooing – Single", rate: 950, unit: "unit" },
  { name: "Bed Shampooing – Double", rate: 1100, unit: "unit" },
  { name: "Bed Shampooing – King or Queen Size", rate: 1200, unit: "unit" },
  { name: "Carpet Shampooing", rate: 30, unit: "sq.ft" },
  { name: "Water Tank Cleaning", rate: 2, unit: "litre" },
  { name: "Loft Interior Cleaning", rate: 300, unit: "room" },
  { name: "Exterior Pressure Washing", rate: 4, unit: "sq.ft" },
  { name: "Termite Control Treatment", rate: 14, unit: "sq.ft" },
  { name: "General Pest Control Treatment", rate: 3000, unit: "starting" },
  { name: "Furnished Deep Cleaning", rate: 8.5, unit: "sq.ft" },
  { name: "Unfurnished Deep Cleaning", rate: 7.5, unit: "sq.ft" },
  { name: "Balance Work", rate: 0, unit: "custom" },
];

const staffSeed = [
  { id: 1, name: "Selva Kumar", role: "Supervisor", status: "Present", salary: 28000, advance: 2000 },
  { id: 2, name: "Ravi Kumar", role: "Cleaner", status: "Present", salary: 22000, advance: 1000 },
  { id: 3, name: "Amit Singh", role: "Pest Expert", status: "Present", salary: 26000, advance: 0 },
  { id: 4, name: "Manoj Kumar", role: "Cleaner", status: "Absent", salary: 20000, advance: 0 },
];

const inventorySeed = [
  { id: 1, item: "Shampoo Chemical", stock: 12, min: 10, unit: "L" },
  { id: 2, item: "Microfiber Cloth", stock: 45, min: 20, unit: "pcs" },
  { id: 3, item: "Pest Spray", stock: 4, min: 8, unit: "L" },
  { id: 4, item: "Gloves", stock: 18, min: 25, unit: "pair" },
];

const expenseSeed = [
  { id: 1, category: "Fuel", amount: 1800, month: "2026-05" },
  { id: 2, category: "Chemical", amount: 2500, month: "2026-05" },
  { id: 3, category: "Machine Maintenance", amount: 1200, month: "2026-05" },
  { id: 4, category: "Van Maintenance", amount: 1600, month: "2026-05" },
  { id: 5, category: "Gloves", amount: 450, month: "2026-05" },
  { id: 6, category: "Stick / Cleaning Things", amount: 700, month: "2026-05" },
  { id: 7, category: "Fiber Cloth", amount: 900, month: "2026-05" },
  { id: 8, category: "Accessories", amount: 600, month: "2026-05" },
  { id: 9, category: "Marketing Expenses", amount: 2000, month: "2026-05" },
  { id: 10, category: "Meta Ads", amount: 1500, month: "2026-05" },
  { id: 11, category: "Instagram Ads", amount: 1200, month: "2026-05" },
  { id: 12, category: "Web Ads", amount: 1000, month: "2026-05" },
];

const bookingSeed = [
  { id: "FN-1001", customer: "Arun Kumar", phone: "9876543210", area: "Thillai Nagar", address: "12, North Street, Trichy", map: "https://maps.google.com/?q=Thillai+Nagar+Trichy", service: "Sofa Shampooing", servicesList: [{ service: "Sofa Shampooing", qty: 4, amount: 2200 }], amount: 2200, date: "2026-05-19", time: "10:30 AM", supervisor: "Ravi Kumar", status: "Pending", confirmed: false, payment: "Pending", lead: "Website Lead", startKm: "", siteKm: "", returnKm: "", notes: "" },
  { id: "FN-1002", customer: "Priya S", phone: "9840012345", area: "Cantonment", address: "8, Main Road, Trichy", map: "", service: "Furnished Deep Cleaning", servicesList: [{ service: "Furnished Deep Cleaning", qty: 1000, amount: 8500 }], amount: 8500, date: "2026-05-19", time: "12:00 PM", supervisor: "Selva Kumar", status: "Confirmed", confirmed: true, payment: "Advance Paid", lead: "App Lead", startKm: "65000", siteKm: "65018", returnKm: "", notes: "Kitchen grease extra" },
  { id: "FN-1003", customer: "Mohammed Ali", phone: "9123456789", area: "Srirangam", address: "22, Temple Road", map: "", service: "Termite Control Treatment", servicesList: [{ service: "Termite Control Treatment", qty: 450, amount: 6300 }], amount: 6300, date: "2026-06-08", time: "04:00 PM", supervisor: "Amit Singh", status: "Completed", confirmed: true, payment: "Paid", lead: "Website Lead", startKm: "12000", siteKm: "12014", returnKm: "12028", notes: "" },
];

function money(n) { return `₹${Number(n || 0).toLocaleString("en-IN")}`; }
function cx(...c) { return c.filter(Boolean).join(" "); }
function Card({ children, className = "" }) { return <div className={cx("rounded-3xl bg-white p-5 shadow-sm border border-slate-200", className)}>{children}</div>; }
function Badge({ children }) { const cls = { Pending: "bg-amber-100 text-amber-800", Confirmed: "bg-emerald-100 text-emerald-800", Completed: "bg-emerald-100 text-emerald-800", Cancelled: "bg-red-100 text-red-800", Paid: "bg-emerald-100 text-emerald-800", "Advance Paid": "bg-blue-100 text-blue-800", Present: "bg-emerald-100 text-emerald-800", Absent: "bg-red-100 text-red-800" }[children] || "bg-slate-100 text-slate-700"; return <span className={cx("inline-flex rounded-full px-3 py-1 text-xs font-bold leading-none", cls)}>{children}</span>; }
function Field({ label, value, onChange, type = "text" }) { return <label className="grid gap-1 text-sm font-bold text-slate-700">{label}<input className="rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-[#d4af37]" type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} /></label>; }
function Stat({ title, value, sub }) { return <Card><p className="text-sm text-slate-500">{title}</p><h3 className="mt-2 text-3xl font-black text-slate-950">{value}</h3><p className="mt-1 text-xs text-slate-500">{sub}</p></Card>; }

function daysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function makeBooking(form, count) { const list = form.servicesList || [{ service: form.service, qty: 1, amount: form.amount || 0 }]; const amount = list.reduce((sum, item) => sum + Number(item.amount || 0), 0); return { id: `FN-${1001 + count}`, customer: form.customer || "New Customer", phone: form.phone || "", area: form.area || "Trichy", address: form.address || form.area || "Trichy", map: form.map || "", service: list.map((item) => item.service).join(" + "), servicesList: list, amount, date: form.date || new Date().toISOString().slice(0, 10), time: form.time || "10:00 AM", supervisor: form.supervisor || "Unassigned", status: "Pending", confirmed: false, payment: "Pending", lead: form.lead || "Manual Lead", startKm: "", siteKm: "", returnKm: "", notes: form.notes || "" }; }

export default function FreshNestFullERP() {
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem("fn_admin_logged_in") === "yes");
  const [loginForm, setLoginForm] = useState({ email: "admin@freshnest.in", password: "" });
  const [loginError, setLoginError] = useState("");
  const [active, setActive] = useState("Dashboard");
  const [bookings, setBookings] = useState(bookingSeed);
  const [liveFeed, setLiveFeed] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "bookings"), (snapshot) => {
      const liveBookings = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          firebaseId: doc.id,
          id: data.id || doc.id,
          customer: data.customer || data.name || "Website Customer",
          phone: data.phone || data.mobile || "",
          area: data.area || "Trichy",
          address: data.address || data.area || "",
          map: data.map || data.locationUrl || "",
          service: data.service || (Array.isArray(data.servicesList) ? data.servicesList.map((x) => x.service).join(" + ") : "Website Booking"),
          servicesList: Array.isArray(data.servicesList) ? data.servicesList : [{ service: data.service || "Website Booking", qty: Number(data.qty || 1), amount: Number(data.amount || 0) }],
          amount: Number(data.amount || 0),
          date: data.date || new Date().toISOString().slice(0, 10),
          time: data.time || "10:00 AM",
          supervisor: data.supervisor || data.supervisorAssigned || "Unassigned",
          status: data.status || "Pending",
          confirmed: Boolean(data.confirmed),
          payment: data.payment || "Pending",
          lead: data.lead || data.leadSource || "Website Lead",
          startKm: data.startKm || "",
          siteKm: data.siteKm || "",
          returnKm: data.returnKm || "",
          notes: data.notes || "",
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      });
   setBookings((old) => {
  const websiteData = liveBookings.length ? liveBookings : bookingSeed;
  const map = new Map();

  [...old, ...websiteData].forEach((b) => {
    const key = b.id || b.jobId || b.bookingId || b.firebaseId;
    map.set(key, b);
  });

  return Array.from(map.values());
});
    });
    return () => unsub();
  }, []);
  useEffect(() => {
  const unsubscribers = [];

  const mergeLive = (incoming) => {
    setBookings((old) => {
      const map = new Map();

      [...old, ...incoming].forEach((b) => {
        const key = b.id || b.jobId || b.bookingId || b.firebaseId;
        const oldItem = map.get(key);
        map.set(key, { ...(oldItem || {}), ...b });
      });

      return Array.from(map.values());
    });
  };

  const normalize = (data, source, firebaseId) => ({
    firebaseId,
    source,
    id: data.id || data.jobId || data.bookingId || firebaseId,
    customer: data.customer || data.name || data.customerName || "Customer",
    phone: data.phone || data.mobile || data.customerPhone || "",
    area: data.area || data.location || "Trichy",
    address: data.address || data.area || data.location || "",
    map: data.map || data.locationUrl || "",
    service: data.service || data.work || data.type || "Supervisor Update",
    servicesList: Array.isArray(data.servicesList)
      ? data.servicesList
      : [{ service: data.service || data.type || "Supervisor Update", qty: 1, amount: Number(data.amount || data.total || 0) }],
    amount: Number(data.amount || data.total || 0),
    date: data.date || data.preferredDate || new Date().toISOString().slice(0, 10),
    time: data.time || data.preferredTime || data.syncedAt || "",
    supervisor: data.supervisor || data.supervisorAssigned || data.userEmail || "Supervisor",
    status: data.status || "Updated",
    confirmed: Boolean(data.confirmed) || ["Confirmed", "Booked", "On The Way", "Work Started", "Completed"].includes(data.status),
    payment: data.payment || data.paymentMode || data.paymentStatus || "Pending",
    lead: data.lead || data.leadSource || (source === "freshnest_sync" ? "Supervisor App" : source),
    notes: data.note || data.notes || "",
location: data.location || data.map || data.gpsLocation || "",
photoUrl: data.photoUrl || data.selfieUrl || data.workPhoto || "",
paymentMethod: data.paymentMethod || data.paymentType || "",
startKm: data.startKm || data.pickupKm || "",
siteKm: data.siteKm || "",
returnKm: data.returnKm || "",
workStartedAt: data.workStartedAt || "",
workEndedAt: data.workEndedAt || "",
  });

  ["jobs", "leads"].forEach((collectionName) => {
    const unsub = onSnapshot(collection(db, collectionName), (snapshot) => {
      const incoming = snapshot.docs.map((docItem) =>
        normalize(docItem.data(), collectionName, docItem.id)
      );
      mergeLive(incoming);
    });
    unsubscribers.push(unsub);
  });

 const unsubSync = onSnapshot(collection(db, "freshnest_sync"), (snapshot) => {
  console.log("SYNC SNAPSHOT SIZE:", snapshot.size);
  const feedRows = snapshot.docs.map((docItem) => ({ firebaseId: docItem.id, ...docItem.data() }));
 setLiveFeed(feedRows);

if (feedRows.length > 0) {
  const latest = feedRows[0];
  setToast(
    `🔔 Supervisor Update: ${latest.type || latest.status || "Update"}\n${latest.jobId || latest.bookingId || ""} ${latest.staff || latest.customer || ""}`
  );
}


  const supervisorJobs = feedRows
    .filter((x) => x.type || x.jobId || x.bookingId || x.customer || x.staff || x.status)
    .map((x) =>
      normalize(
        {
          ...x,
          id: x.jobId || x.bookingId || `SYNC-${x.firebaseId}`,
          customer: x.customer || x.staff || "Supervisor Update",
          amount: x.total || x.amount || 0,
          service: x.service || x.type || "Supervisor Update",
       status:
x.status ||
(x.type === "work_started"
  ? "Work Started"
  : x.type === "work_completed"
  ? "Completed"
  : x.type === "on_the_way"
  ? "On The Way"
  : x.type === "site_reached"
  ? "Site Reached"
  : x.type === "pause_work"
  ? "Paused"
  : x.type === "resume_work"
  ? "Work Started"
  : x.type === "final_close"
  ? "Completed"
  : x.type === "payment_paid"
  ? "Completed"
  : x.type === "staff_attendance"
  ? "Updated"
  : "Updated"),
        },
        "freshnest_sync",
        x.firebaseId
      )
    );

  mergeLive(supervisorJobs);
});


  unsubscribers.push(unsubSync);

  return () => unsubscribers.forEach((unsub) => unsub && unsub());
}, []);
  const [staff, setStaff] = useState(staffSeed);
  const [inventory, setInventory] = useState(inventorySeed);
  const [services, setServices] = useState(masterServices);
  const [expenses, setExpenses] = useState(expenseSeed);
  const [selected, setSelected] = useState(null);
  const [seenBookingIds, setSeenBookingIds] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [staffForm, setStaffForm] = useState({ name: "", role: "Cleaner", salary: "20000" });
  const [invForm, setInvForm] = useState({ item: "", stock: "", min: "", unit: "pcs" });
  const [expenseForm, setExpenseForm] = useState({ category: "Fuel", amount: "", month: "2026-05" });
  const [complaints, setComplaints] = useState([{ id: 1, customer: "Karthik", issue: "Staff reached late", status: "Open" }]);
  const [complaintForm, setComplaintForm] = useState({ customer: "", issue: "" });
  const [calendarMonth, setCalendarMonth] = useState("2026-05");
  const [attendanceDate, setAttendanceDate] = useState("2026-05-19");

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      const at = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(`${a.date || "2000-01-01"} ${a.time || "00:00"}`).getTime();
      const bt = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(`${b.date || "2000-01-01"} ${b.time || "00:00"}`).getTime();
      return bt - at;
    });
  }, [bookings]);
  const filtered = useMemo(() => { const t = query.toLowerCase(); return sortedBookings.filter((b) => [b.id, b.customer, b.phone, b.service, b.status, b.lead].join(" ").toLowerCase().includes(t)); }, [sortedBookings, query]);
  const confirmed = bookings.filter((b) => b.confirmed === true || b.status === "Confirmed" || b.status === "Completed");
  const revenue = confirmed.reduce((s, b) => s + Number(b.amount || 0), 0);
  const pending = bookings.filter((b) => !b.confirmed).length;
  const website = bookings.filter((b) => b.lead === "Website Lead").length;
  const app = bookings.filter((b) => b.lead === "App Lead").length;
  const manual = bookings.filter((b) => b.lead === "Manual Lead").length;
  const km = bookings.reduce((s, b) => s + Math.max(0, Number(b.returnKm || b.siteKm || 0) - Number(b.startKm || 0)), 0);
  const autoFuel = Math.round((km / 16) * 100);
  const monthlyExpense = expenses.reduce((s, e) => s + Number(e.amount || 0), 0) + autoFuel;
  const profit = Math.max(0, revenue - monthlyExpense);
  const repeatMap = bookings.reduce((a, b) => ({ ...a, [b.phone]: (a[b.phone] || 0) + 1 }), {});
  const repeat = Object.values(repeatMap).filter((n) => n > 1).length;
  const nav = ["Dashboard", "Bookings", "Supervisor","Supervisor A-Z Sync", "Operations Advanced", "Customer Portal", "Marketing Automation", "Calendar", "CRM", "Customer History", "Marketing", "Services", "Staff", "Attendance", "Payroll", "Inventory", "Expenses", "Payments", "Reminders", "Invoices", "Complaints", "Profit Analysis", "Reports", "Firebase Sync", "Settings"];

  function statusDot(b) {
    if (b.status === "Cancelled") return "bg-red-500";
    if (b.confirmed || b.status === "Confirmed" || b.status === "Completed") return "bg-emerald-500";
    return "bg-yellow-400";
  }
  function openBooking(b) {
    const key = b.firebaseId || b.id;
    setSeenBookingIds((prev) => prev.includes(key) ? prev : [...prev, key]);
    setSelected(b);
  }
  async function updateBooking(id, patch) {
    const finalPatch = {
      ...patch,
      confirmed: patch.confirmed === true || patch.status === "Confirmed" || patch.status === "Completed" ? true : patch.confirmed === false ? false : undefined,
      status: patch.status || (patch.confirmed ? "Confirmed" : undefined),
      updatedAt: new Date().toISOString(),
    };

    Object.keys(finalPatch).forEach((key) => finalPatch[key] === undefined && delete finalPatch[key]);

    const current = bookings.find((b) => b.id === id || b.firebaseId === id || (b.firebaseId || b.id) === id);
    const firebaseDocId = current?.firebaseId || id;

    setBookings((prev) => prev.map((b) => {
      const key = b.firebaseId || b.id;
      return key === id || b.id === id || b.firebaseId === id ? { ...b, ...finalPatch } : b;
    }));

    setSelected((old) => {
      if (!old) return old;
      const key = old.firebaseId || old.id;
      return key === id || old.id === id || old.firebaseId === id ? { ...old, ...finalPatch } : old;
    });

    try {
     await setDoc(doc(db, "bookings", firebaseDocId), finalPatch, { merge: true });
      setToast("Booking updated ✅");
      setTimeout(() => setToast(""), 2200);
    } catch (error) {
      setToast("Firebase update failed: " + (error?.message || error));
      setTimeout(() => setToast(""), 5000);
    }
  }
  async function addBooking(form) { const next = makeBooking(form, bookings.length); setBookings((prev) => [next, ...prev]); setShowAdd(false); setActive("Dashboard"); setToast(`New booking received: ${next.customer}`); setTimeout(() => setToast(""), 3500); try { await addDoc(collection(db, "bookings"), { ...next, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }); } catch (error) { setToast("Firebase add failed: " + (error?.message || error)); } }
  function addStaff() { const typedName = document.getElementById("staff-name-input")?.value || staffForm.name; if (!typedName.trim()) return; setStaff((prev) => [...prev, { id: Date.now(), name: typedName.trim(), role: staffForm.role, status: "Present", salary: Number(staffForm.salary || 0), advance: 0, currentLat: "10.7905", currentLng: "78.7047" }]); const el = document.getElementById("staff-name-input"); if (el) el.value = ""; setStaffForm({ name: "", role: "Cleaner", salary: "20000" }); }
  function addInventory() { if (!invForm.item.trim()) return; setInventory((prev) => [...prev, { id: Date.now(), item: invForm.item, stock: Number(invForm.stock || 0), min: Number(invForm.min || 0), unit: invForm.unit || "pcs" }]); setInvForm({ item: "", stock: "", min: "", unit: "pcs" }); }
  function addExpense() { if (!expenseForm.amount) return; setExpenses((prev) => [...prev, { id: Date.now(), category: expenseForm.category, amount: Number(expenseForm.amount || 0), month: expenseForm.month }]); setExpenseForm({ category: "Fuel", amount: "", month: "2026-05" }); }
  function simulateWebsiteBooking() {
    const next = makeBooking({
      customer: "Website Auto Lead",
      phone: "9000012345",
      area: "Trichy Website",
      address: "Website form enquiry",
      map: "https://maps.google.com/?q=Trichy",
      supervisor: "Unassigned",
      lead: "Website Lead",
      servicesList: [{ service: "Furnished Deep Cleaning", qty: 850, amount: 7225 }]
    }, bookings.length);
    setBookings((prev) => [next, ...prev]);
    setSelected(next);
    setShowAdd(false);
    setActive("Dashboard");
    setToast("🌐 Website booking received and added to dashboard");
  }
  function invoiceText(b) { const lines = ["FreshNest Cleaning Services", `Invoice: ${b.id}`, `Customer: ${b.customer}`, `Phone: ${b.phone}`, `Service: ${b.service}`, `Date: ${b.date} ${b.time}`, `Total: ${money(b.amount)}`, "Thank you for choosing FreshNest."]; const blob = new Blob([lines.join("\n")], { type: "text/plain" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${b.id}-invoice.txt`; a.click(); URL.revokeObjectURL(url); setToast("Invoice downloaded"); }
  function exportCSV() { const rows = [["ID", "Customer", "Phone", "Service", "Amount", "Status", "Lead"], ...bookings.map((b) => [b.id, b.customer, b.phone, b.service, b.amount, b.status, b.lead])]; const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n"); const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "freshnest-report.csv"; a.click(); URL.revokeObjectURL(url); setToast("CSV exported"); }

  function handleLogin() {
    if (loginForm.email === "admin@freshnest.in" && loginForm.password === "freshnest123") {
      setLoggedIn(true);
      localStorage.setItem("fn_admin_logged_in", "yes");
      setLoginError("");
      setToast("");
    } else {
      setLoginError("Wrong email or password");
    }
  }

  function LoginScreen() {
    return <div className="grid min-h-screen place-items-center bg-[#07162a] p-5 text-white"><div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white/10 shadow-2xl md:grid-cols-2"><div className="p-8 md:p-10"><div className="grid h-20 w-20 place-items-center rounded-3xl bg-white text-4xl">🧹</div><h1 className="mt-5 text-5xl font-black">FreshNest Admin ERP</h1><p className="mt-4 max-w-md text-white/70">Admin login setup. Dashboard, bookings, CRM, staff, finance and Firebase sync protected.</p><div className="mt-8 grid gap-3 text-sm text-white/80"><div>✅ Admin access</div><div>✅ Supervisor/staff role ready</div><div>✅ Firebase Auth connect-ready</div></div></div><div className="bg-white p-8 text-slate-950 md:p-10"><p className="text-sm font-black text-[#d4af37]">SECURE LOGIN</p><h2 className="mt-2 text-3xl font-black">Admin Sign In</h2><p className="mt-2 text-sm text-slate-500">Demo password: freshnest123</p><div className="mt-6 grid gap-4"><label className="grid gap-1 text-sm font-bold">Email<input value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} className="rounded-2xl border border-slate-200 p-3 outline-none focus:border-[#d4af37]" /></label><label className="grid gap-1 text-sm font-bold">Password<input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }} className="rounded-2xl border border-slate-200 p-3 outline-none focus:border-[#d4af37]" placeholder="Enter password" /></label>{loginError && <div className="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{loginError}</div>}<button onClick={handleLogin} className="rounded-2xl bg-[#07162a] p-3 font-black text-[#d4af37]">Login</button><button onClick={() => { setLoginForm({ email: "admin@freshnest.in", password: "freshnest123" }); setLoginError(""); }} className="rounded-2xl bg-slate-100 p-3 font-black text-slate-700">Use Demo Login</button></div></div></div></div>;
  }

  function Layout({ children }) { return <div className="mobile-desktop-wrap"><div className="desktop-shell min-h-screen bg-slate-100 text-slate-950"><style>{`html,body,#root{height:100%;overflow:hidden}.desktop-shell{min-width:1280px}.app-main{height:100vh;overflow:auto}.drawer-scroll{height:calc(100vh - 24px);overflow:auto}.desktop-table{min-width:1120px}@media(max-width:1023px){.mobile-desktop-wrap{width:100vw;height:100vh;overflow:auto}.desktop-shell{min-width:1280px}.force-sidebar{display:block!important}.force-main{padding-left:18rem!important}.phone-card-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important}.drawer-scroll{width:900px!important;max-width:900px!important}}`}</style>{toast && <div className="fixed right-4 top-4 z-50 max-w-sm rounded-2xl bg-[#07162a] p-4 text-sm font-bold text-[#d4af37] shadow-2xl whitespace-pre-line">{toast}</div>}<aside className="force-sidebar fixed left-0 top-0 hidden h-full w-72 overflow-y-auto bg-[#07162a] p-4 text-white lg:block"><div className="mb-4 rounded-3xl bg-white/10 p-4"><div className="text-3xl">🧹</div><h1 className="mt-2 font-black">FreshNest ERP</h1><p className="text-xs text-[#d4af37]">Neethirajan + Selva Kumar</p></div><nav className="space-y-1 pb-8">{nav.map((n) => <button key={n} onClick={() => setActive(n)} className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-bold ${active === n ? "bg-[#d4af37] text-[#07162a]" : "text-white/70 hover:bg-white/10"}`}>{n}</button>)}</nav></aside><main className="force-main app-main lg:pl-72"><header className="sticky top-0 z-20 border-b bg-white/90 p-4 backdrop-blur"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-black">{active}</h2><p className="text-sm text-slate-500">FreshNest Cleaning Services • Trichy</p></div><div className="flex flex-wrap gap-2"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search bookings..." className="rounded-2xl border px-4 py-2" /><button onClick={() => setShowAdd(true)} className="rounded-2xl bg-[#07162a] px-4 py-2 font-black text-[#d4af37]">+ Add Booking</button><button onClick={simulateWebsiteBooking} className="rounded-2xl bg-white px-4 py-2 font-bold shadow">🔔 Bell Sync</button><span className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 shadow">Admin</span><button onClick={() => { localStorage.removeItem('fn_admin_logged_in'); setLoggedIn(false); setLoginForm({ email: 'admin@freshnest.in', password: '' }); setActive('Dashboard'); setToast(''); }} className="rounded-2xl bg-red-50 px-4 py-2 font-bold text-red-700 shadow">Logout</button></div></div></header><div className="p-4 md:p-6">{children}</div></main>{showAdd && <AddBookingModal onClose={() => setShowAdd(false)} onSave={addBooking} />}{selected && <BookingDrawer booking={selected} onClose={() => setSelected(null)} />}</div></div>; }

function Dashboard() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-[#07162a] to-slate-900 text-white">
        <div className="flex items-center gap-5">
          <div className="grid h-20 w-20 place-items-center rounded-3xl bg-[#d4af37] text-4xl">✨</div>
          <div>
            <p className="text-sm font-black text-[#d4af37]">Daily Positive Quote</p>
            <h3 className="text-3xl font-black">{quoteOfDay}</h3>
            <p className="mt-2 text-white/70">FreshNest team motivation board</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <Stat title="Confirmed Revenue" value={money(revenue)} sub="Confirmed bookings only" />
        <Stat title="Pending Confirm" value={pending} sub="Need follow-up" />
        <Stat title="Active Jobs" value={bookings.filter((b) => ["On The Way", "Work Started"].includes(b.status)).length} sub="field work" />
        <Stat title="Completed" value={bookings.filter((b) => b.status === "Completed").length} sub="done" />
        <Stat title="Monthly Expense" value={money(monthlyExpense)} sub="Fuel + all expense" />
        <Stat title="Profit" value={money(profit)} sub="Revenue - expense" />
      </div>

      <Card>
        <h3 className="mb-4 text-xl font-black">Latest Supervisor Updates</h3>
        <div className="space-y-2">
          {liveFeed.slice(0, 6).map((item) => (
            <div key={item.firebaseId || item.id} className="rounded-2xl bg-slate-100 p-3">
              <div className="flex justify-between">
                <b>{item.jobId || item.bookingId || item.type || "Update"}</b>
                <Badge>{item.status || item.type || "Live"}</Badge>
              </div>
              <p className="text-xs text-slate-500">
                {item.customer || item.staff || item.userEmail || "FreshNest"} • {item.note || item.service || item.syncedAt || ""}
              </p>
            </div>
          ))}
          {liveFeed.length === 0 && (
            <div className="rounded-2xl bg-slate-100 p-3 text-sm text-slate-500">
              No supervisor updates yet
            </div>
          )}
        </div>
      </Card>

      <div className="grid gap-4">
        <Card>
          <h3 className="mb-4 text-xl font-black">Live Bookings</h3>
          <BookingTable compact />
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-xl font-black">Dashboard Calendar</h3>
          <div className="grid gap-2">
            {confirmed.slice(0, 5).map((b) => (
              <button key={b.firebaseId || b.id} onClick={() => openBooking(b)} className="flex items-center justify-between rounded-2xl bg-slate-100 p-3 text-left">
                <span>
                  <b>{b.customer}</b>
                  <p className="text-xs text-slate-500">{b.date} • {b.service}</p>
                </span>
                <span className={`h-3 w-3 rounded-full ${statusDot(b)}`} />
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-xl font-black">Stock Alert</h3>
          <div className="grid gap-2">
            {inventory.filter((i) => Number(i.stock) <= Number(i.min)).map((i) => (
              <div key={i.id} className="rounded-2xl bg-red-50 p-3 text-red-700">
                <b>{i.item}</b>
                <p className="text-xs">Stock {i.stock} {i.unit} • Min {i.min}</p>
              </div>
            ))}
            {inventory.filter((i) => Number(i.stock) <= Number(i.min)).length === 0 && (
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">All stock safe ✅</div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <h3 className="mb-4 text-xl font-black">Notifications</h3>
          <div className="space-y-2">
            <button onClick={simulateWebsiteBooking} className="w-full rounded-2xl bg-[#07162a] p-3 text-left font-black text-[#d4af37]">
              🌐 Test Website Booking Sync
            </button>
            <div className="rounded-2xl bg-slate-100 p-3">{pending} bookings waiting confirmation</div>
            <div className="rounded-2xl bg-slate-100 p-3">Website Leads: {website}</div>
            <div className="rounded-2xl bg-slate-100 p-3">Supervisor Live Events: {liveFeed.length}</div>
            <div className="rounded-2xl bg-slate-100 p-3">Low Stock: {inventory.filter((i) => i.stock <= i.min).length}</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
  function BookingTable({ compact = false, onlyConfirmed = false }) {
    const baseRows = onlyConfirmed ? filtered.filter((b) => b.confirmed || b.status === "Confirmed" || b.status === "Completed") : filtered;
    const rows = compact ? baseRows.slice(0, 5) : baseRows;
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead>
            <tr className="border-b text-slate-500">
              {["ID", "Customer", "Service", "Date", "Supervisor", "Status", "Payment", "Lead", "Amount", "Action"].map((h) => (
                <th key={h} className="py-3 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => {
              const isBooked = b.confirmed || b.status === "Confirmed" || b.status === "Completed";
              const key = b.firebaseId || b.id;
              return (
                <tr key={key} className={`border-b ${!seenBookingIds.includes(key) ? "bg-yellow-50" : ""}`}>
                  <td className="py-3 pr-4 font-black">{b.id}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className={`h-3 w-3 rounded-full ${statusDot(b)}`} />
                      <b>{b.customer}</b>
                      {!seenBookingIds.includes(key) && <span className="rounded-full bg-[#d4af37] px-2 py-0.5 text-[10px] font-black text-[#07162a]">NEW</span>}
                    </div>
                    <p className="text-xs text-slate-500">{b.phone}</p>
                  </td>
                  <td className="py-3 pr-4">{b.service}</td>
                  <td className="py-3 pr-4">{b.date}<p className="text-xs text-slate-500">{b.time}</p></td>
                  <td className="py-3 pr-4">{b.supervisor}</td>
                  <td className="py-3 pr-4"><Badge>{b.status === "Cancelled" ? "Cancelled" : isBooked ? "Booked" : "Pending"}</Badge></td>
                  <td className="py-3 pr-4"><Badge>{b.payment}</Badge></td>
                  <td className="py-3 pr-4">{b.lead}</td>
                  <td className="py-3 pr-4 font-black">{money(b.amount)}</td>
                  <td className="py-3 pr-4">
                    <div className="flex gap-2">
                      {!isBooked && (
                        <button onClick={() => updateBooking(key, { confirmed: true, status: "Confirmed", payment: b.payment || "Pending" })} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white">
                          Book
                        </button>
                      )}
                      <button onClick={() => openBooking(b)} className="rounded-xl bg-[#07162a] px-3 py-2 text-xs font-bold text-[#d4af37]">
                        Open
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  function Bookings() { return <Card><div className="mb-4 flex justify-between"><h3 className="text-xl font-black">All Bookings</h3><button onClick={() => setShowAdd(true)} className="rounded-2xl bg-[#07162a] px-4 py-2 font-bold text-[#d4af37]">Add Booking</button></div><BookingTable /></Card>; }
  function Supervisor() { return <div className="space-y-4"><Card className="bg-gradient-to-r from-[#07162a] to-slate-900 text-white"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-2xl font-black">Supervisor Firebase Web Sync</h3><p className="text-white/70">Website booking → Firebase sync → supervisor app workflow update ready.</p></div><button onClick={simulateWebsiteBooking} className="rounded-2xl bg-[#d4af37] px-4 py-2 font-black text-[#07162a]">Sync Website Booking</button></div></Card><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{filtered.map((b) => <Card key={b.firebaseId || b.id} className="p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex items-center gap-2"><span className={`h-3 w-3 shrink-0 rounded-full ${statusDot(b)}`} /><h3 className="truncate text-base font-black">{b.customer}</h3></div><p className="mt-1 truncate text-xs text-slate-500">{b.area} • {b.service}</p><p className="truncate text-xs text-[#d4af37]">Supervisor: {b.supervisor}</p></div><div className="shrink-0"><Badge>{b.status === "Cancelled" ? "Cancelled" : b.confirmed || b.status === "Confirmed" || b.status === "Completed" ? "Booked" : "Pending"}</Badge></div></div><div className="mt-3 grid grid-cols-2 gap-2">{["Pending", "On The Way", "Work Started", "Completed"].map((s) => <button key={s} onClick={() => updateBooking(b.firebaseId || b.id, { status: s, confirmed: s !== "Pending" })} className="rounded-xl bg-slate-100 px-2 py-2 text-xs font-black hover:bg-[#d4af37]">{s}</button>)}</div><button onClick={() => openBooking(b)} className="mt-3 w-full rounded-2xl bg-[#07162a] px-4 py-2 text-sm font-black text-[#d4af37]">Open Workflow</button></Card>)}</div></div>; }
  function SupervisorAZSync() {
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-[#07162a] to-slate-900 text-white">
        <h3 className="text-2xl font-black">Supervisor A-Z Sync</h3>
        <p className="text-white/70">All supervisor app updates from Firebase freshnest_sync.</p>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Stat title="Live Events" value={liveFeed.length} sub="freshnest_sync docs" />
        <Stat title="Live Jobs" value={bookings.length} sub="bookings + supervisor" />
        <Stat title="Active Jobs" value={bookings.filter(b => ["On The Way", "Work Started"].includes(b.status)).length} sub="field work" />
        <Stat title="Completed" value={bookings.filter(b => b.status === "Completed").length} sub="done" />
      </div>

      <Card>
  <h3 className="mb-4 text-xl font-black">Live Timeline</h3>

  <div className="space-y-3 max-h-[520px] overflow-y-auto">
    {liveFeed.length === 0 ? (
      <div className="rounded-2xl bg-slate-100 p-6 text-center text-slate-500">
        No supervisor live updates yet
      </div>
    ) : (
      liveFeed
        .sort((a, b) =>
          new Date(b.updatedAt || b.createdAt || 0) -
          new Date(a.updatedAt || a.createdAt || 0)
        )
        .map((item) => (
          <div
            key={item.firebaseId || item.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">
                  {item.type || "Supervisor Update"}
                </div>
                <div className="text-lg font-black">
                  {item.jobId || item.bookingId || item.id}
                </div>
              </div>

              <Badge className={
  item.status === "Completed"
    ? "bg-green-500 text-white"
    : item.status === "Work Started"
    ? "bg-blue-500 text-white"
    : "bg-yellow-500 text-black"
}>
  {item.status || "Live"}
</Badge>
            </div>

            <div className="mt-3 grid gap-2 md:grid-cols-2 text-sm">
              <div><b>Staff:</b> {item.staff || "-"}</div>
              <div><b>Customer:</b> {item.customer || "-"}</div>
           <div><b>Service:</b> {item.service || "-"}</div>
<div><b>Payment:</b> {item.payment || "-"}</div>
<div>
  <b>GPS:</b>{" "}
  {item.location || item.map ? (
    <a
      href={item.map || `https://maps.google.com/?q=${item.location}`}
      target="_blank"
      rel="noreferrer"
      className="font-bold text-blue-600"
    >
      Open Map
    </a>
  ) : "-"}
</div>
<div>
  <b>Selfie:</b>{" "}
  {item.photoUrl ? (
    <a href={item.photoUrl} target="_blank" rel="noreferrer" className="text-blue-600 font-bold">
      View Photo
    </a>
  ) : "-"}
</div>
<div><b>Payment Method:</b> {item.paymentMethod || "-"}</div>

<div><b>Amount:</b> {item.amount ? money(item.amount) : "-"}</div>

<div>
  <b>Payment Proof:</b>{" "}
  {item.paymentProofUrl ? (
    <a
      href={item.paymentProofUrl}
      target="_blank"
      rel="noreferrer"
      className="font-bold text-blue-600"
    >
      View Proof
    </a>
  ) : "-"}
</div>

<div><b>KM:</b> {item.startKm || item.returnKm || "-"}</div>
            </div>

            <div className="mt-3 text-xs text-slate-500">
             {item.syncedAt || item.updatedAt?.toDate?.()?.toLocaleString?.() || item.createdAt?.toDate?.()?.toLocaleString?.() || ""}
            </div>
          </div>
        ))
    )}
  </div>
</Card>
    </div>
  );
}function OperationsAdvanced() { const machines = ["Vacuum", "Pressure Washer", "Shampoo Machine", "Pest Kit", "Ladder", "PPE", "Gloves", "Chemicals"]; const stockRules = [{ service: "Sofa Shampooing", reduce: "Shampoo Chemical - 0.25L / seat" }, { service: "Water Tank Cleaning", reduce: "Gloves + Chemical by litre" }, { service: "Pest Control", reduce: "Pest Spray by sq.ft / treatment" }, { service: "Deep Cleaning", reduce: "Microfiber + chemical by sq.ft" }]; return <div className="space-y-4"><div className="grid gap-4 md:grid-cols-3"><Stat title="Live GPS Staff" value={staff.length} sub="Coordinates sync ready" /><Stat title="Checklist Items" value={machines.length} sub="Machine/PPE" /><Stat title="Auto Stock Rules" value={stockRules.length} sub="Consumables reduce" /></div><Card><h3 className="text-2xl font-black">Live GPS Staff Tracking</h3><div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{staff.map((s, i) => <div key={s.id} className="rounded-2xl bg-slate-100 p-4"><div className="text-3xl">{staffAvatars[i % staffAvatars.length]}</div><b>{s.name}</b><p className="text-sm text-slate-500">Lat: {s.currentLat || "10.7905"}</p><p className="text-sm text-slate-500">Lng: {s.currentLng || "78.7047"}</p><p className="mt-2 rounded-xl bg-white p-2 text-xs font-bold">Firebase: liveTracking/{s.id}</p></div>)}</div></Card><Card><h3 className="text-2xl font-black">Machine Checklist</h3><div className="mt-4 grid gap-3 md:grid-cols-4">{machines.map((m) => <label key={m} className="rounded-2xl bg-slate-100 p-4 font-bold"><input type="checkbox" className="mr-2" /> {m}</label>)}</div></Card><Card><h3 className="text-2xl font-black">Consumables Auto Stock Reduce</h3><div className="mt-4 grid gap-3 md:grid-cols-2">{stockRules.map((r) => <div key={r.service} className="rounded-2xl bg-slate-100 p-4"><b>{r.service}</b><p className="text-sm text-slate-500">{r.reduce}</p></div>)}</div><button onClick={() => setToast("Stock auto reduce simulated after job complete")} className="mt-4 rounded-2xl bg-[#07162a] px-4 py-3 font-black text-[#d4af37]">Simulate Job Complete Stock Reduce</button></Card><Card><h3 className="text-2xl font-black">Before / After Photo Upload Placeholder</h3><div className="mt-4 grid gap-3 md:grid-cols-2"><div className="rounded-2xl border-2 border-dashed p-8 text-center">📷 Before Photo Upload</div><div className="rounded-2xl border-2 border-dashed p-8 text-center">✅ After Photo Upload</div></div></Card></div>; }
  function CustomerPortal() { const repeatCustomers = Object.entries(bookings.reduce((acc,b)=>{ if(!acc[b.phone]) acc[b.phone]={name:b.customer,count:0,total:0,services:{},last:b.date}; acc[b.phone].count +=1; acc[b.phone].total += Number(b.amount||0); acc[b.phone].services[b.service]=(acc[b.phone].services[b.service]||0)+1; if(b.date > acc[b.phone].last) acc[b.phone].last=b.date; return acc; },{})).map(([phone,data])=>({ phone, ...data, preferred:Object.entries(data.services).sort((a,b)=>b[1]-a[1])[0]?.[0] || '-' })); return <div className="space-y-4"><div className="grid gap-4 md:grid-cols-3"><Stat title="Customer Portal" value="OTP" sub="Firebase auth ready" /><Stat title="Repeat Customers" value={repeatCustomers.filter(c=>c.count>1).length} sub="Returning clients" /><Stat title="Portal Access" value={bookings.length} sub="Eligible customers" /></div><Card className="bg-gradient-to-r from-[#07162a] to-slate-900 text-white"><h3 className="text-2xl font-black">Customer Login / Signup</h3><p className="mt-2 text-white/70">Phone OTP / Firebase auth customer portal preview.</p><div className="mt-4 grid gap-3 md:grid-cols-3"><input placeholder="Phone Number" className="rounded-2xl p-3 text-black" /><button className="rounded-2xl bg-[#d4af37] p-3 font-black text-[#07162a]">Send OTP</button><button className="rounded-2xl bg-white p-3 font-black text-[#07162a]">Customer Login</button></div></Card><Card><h3 className="text-2xl font-black">Repeat Customer Intelligence</h3><div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{repeatCustomers.map((c)=> <div key={c.phone} className="rounded-2xl bg-slate-100 p-4"><div className="flex items-center justify-between"><b>{c.name}</b>{c.count>1 && <span className="rounded-full bg-[#d4af37] px-3 py-1 text-xs font-black">Repeat</span>}</div><p className="text-sm text-slate-500">{c.phone}</p><p className="mt-2">Total Spend: <b>{money(c.total)}</b></p><p>Preferred: <b>{c.preferred}</b></p><p>Last Booking: <b>{c.last}</b></p></div>)}</div></Card></div>; }

function MarketingAutomation() {
  const leads = [
    { source: 'Website', total: website, confirmed: bookings.filter((b) => b.lead === 'Website Lead' && b.confirmed).length, paid: bookings.filter((b) => b.lead === 'Website Lead' && b.payment === 'Paid').length },
    { source: 'App', total: app, confirmed: bookings.filter((b) => b.lead === 'App Lead' && b.confirmed).length, paid: bookings.filter((b) => b.lead === 'App Lead' && b.payment === 'Paid').length },
    { source: 'Manual', total: manual, confirmed: bookings.filter((b) => b.lead === 'Manual Lead' && b.confirmed).length, paid: bookings.filter((b) => b.lead === 'Manual Lead' && b.payment === 'Paid').length },
    { source: 'Referral', total: repeat, confirmed: repeat, paid: repeat },
  ];
  const templates = ['Booking Confirm', 'On The Way', 'Work Started', 'Completed', 'Payment Reminder', 'Review Request', 'AMC Renewal'];
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Stat title="Website Leads" value={website} sub="Tracked" />
        <Stat title="App Leads" value={app} sub="Tracked" />
        <Stat title="Manual Leads" value={manual} sub="Tracked" />
        <Stat title="Repeat / Referral" value={repeat} sub="Referral potential" />
      </div>
      <Card>
        <h3 className="text-2xl font-black">Lead Conversion Funnel</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {leads.map((lead) => (
            <div key={lead.source} className="rounded-2xl bg-slate-100 p-4">
              <b>{lead.source}</b>
              <div className="mt-3 space-y-2">
                <div>Total: {lead.total}</div>
                <div>Confirmed: {lead.confirmed}</div>
                <div>Paid: {lead.paid}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="text-2xl font-black">Campaign Tracking</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl bg-slate-100 p-4 font-black">📘 Meta Ads</div>
          <div className="rounded-2xl bg-slate-100 p-4 font-black">📸 Instagram</div>
          <div className="rounded-2xl bg-slate-100 p-4 font-black">🌐 Website</div>
          <div className="rounded-2xl bg-slate-100 p-4 font-black">🤝 Referral</div>
        </div>
      </Card>
      <Card>
        <h3 className="text-2xl font-black">WhatsApp Automation Templates</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {templates.map((template) => (
            <button key={template} onClick={() => setToast('WhatsApp template ready: ' + template)} className="rounded-2xl bg-[#07162a] p-4 font-black text-[#d4af37]">
              {template}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Calendar() { const [year, month] = calendarMonth.split("-").map(Number); const blank = new Date(year, month - 1, 1).getDay(); const days = daysInMonth(year, month - 1); const cells = [...Array(blank).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]; return <div className="space-y-4"><Card><div className="flex flex-wrap justify-between gap-3"><h3 className="text-2xl font-black">Monthly Calendar</h3><input type="month" value={calendarMonth} onChange={(e) => setCalendarMonth(e.target.value)} className="rounded-2xl border p-2" /></div><div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-black text-slate-500">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d}>{d}</div>)}</div><div className="mt-2 grid grid-cols-7 gap-2">{cells.map((d, i) => { if (!d) return <div key={`b-${i}`} className="min-h-28 rounded-2xl bg-slate-50" />; const date = `${year}-${String(month).padStart(2,"0")}-${String(d).padStart(2,"0")}`; const list = bookings.filter(b => b.confirmed && b.date === date); return <div key={date} className="min-h-28 rounded-2xl border p-2"><b>{d}</b>{list.map(b => <button key={b.id} onClick={() => openBooking(b)} className="mt-1 w-full truncate rounded-lg bg-[#07162a] px-2 py-1 text-left text-xs text-[#d4af37]">{b.customer}</button>)}</div>; })}</div></Card></div>; }
  function CRM() { return <div className="space-y-4"><div className="grid gap-4 md:grid-cols-4"><Stat title="🌐 Website Leads" value={website} sub="Website forms" /><Stat title="📱 App Leads" value={app} sub="App / Instagram" /><Stat title="📝 Manual Leads" value={manual} sub="Manual entry" /><Stat title="🔁 Repeat" value={repeat} sub="Phone matched" /></div><Card><h3 className="mb-4 text-2xl font-black">CRM Database - Confirmed Bookings Only</h3><BookingTable onlyConfirmed /></Card></div>; }
  function CustomerHistory() { const phones = [...new Set(bookings.map((b) => b.phone))]; return <div className="grid gap-4 md:grid-cols-2">{phones.map((p) => { const list = bookings.filter((b) => b.phone === p); return <Card key={p}><div className="flex justify-between"><div><h3 className="text-xl font-black">{list[0].customer}</h3><p className="text-sm text-slate-500">{p} • {list.length} booking(s)</p></div><Badge>{repeatMap[p] > 1 ? "Repeat" : "New"}</Badge></div><div className="mt-3 space-y-2">{list.map(b => <button key={b.id} onClick={() => openBooking(b)} className="w-full rounded-2xl bg-slate-100 p-3 text-left"><b>{b.id}</b><p>{b.service}</p><p>{money(b.amount)} • {b.date}</p></button>)}</div></Card>; })}</div>; }
  function Marketing() { const rows = [{ name: "🌐 Website Lead", count: website }, { name: "📱 App Lead", count: app }, { name: "📝 Manual Lead", count: manual }, { name: "🔁 Repeat Customer", count: repeat }]; return <div className="grid gap-4 xl:grid-cols-2"><Card><h3 className="mb-4 text-2xl font-black">Marketing Leads</h3>{rows.map((r) => <div key={r.name} className="mb-3 rounded-2xl bg-slate-100 p-4 flex justify-between"><b>{r.name}</b><span className="text-2xl font-black text-[#d4af37]">{r.count}</span></div>)}</Card><Card><h3 className="mb-4 text-2xl font-black">Campaign Ideas</h3>{["Before/After reel", "Festival deep clean offer", "Water tank safety post", "Referral cashback"].map((i) => <div key={i} className="mb-3 rounded-2xl bg-[#07162a] p-4 font-black text-[#d4af37]">{i}</div>)}</Card></div>; }
  function Services() { return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{services.map((s, i) => <Card key={i}><div className="mb-3 flex items-center gap-3"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-3xl">{serviceIcons[s.name] || "✨"}</div><h3 className="text-xl font-black">{s.name}</h3></div><p className="text-slate-500">Rate: {money(s.rate)} / {s.unit}</p><div className="mt-3 grid grid-cols-2 gap-2"><Field label="Rate" type="number" value={s.rate} onChange={(v) => setServices((prev) => prev.map((x, idx) => idx === i ? { ...x, rate: Number(v || 0) } : x))} /><Field label="Unit" value={s.unit} onChange={(v) => setServices((prev) => prev.map((x, idx) => idx === i ? { ...x, unit: v } : x))} /></div></Card>)}</div>; }
  function Staff() { return <div className="space-y-4"><Card><h3 className="mb-4 text-xl font-black">Add Staff</h3><div className="grid gap-3 md:grid-cols-4"><input id="staff-name-input" defaultValue="" placeholder="Full name type pannunga" className="rounded-2xl border p-3 md:col-span-2" /><input value={staffForm.role} onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })} placeholder="Role" className="rounded-2xl border p-3" /><button onClick={addStaff} className="rounded-2xl bg-[#07162a] p-3 font-black text-[#d4af37]">Add</button></div></Card><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{staff.map((s, index) => <Card key={s.id}><div className="mb-3 flex items-center gap-3"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#07162a] text-3xl">{staffAvatars[index % staffAvatars.length]}</div><div><h3 className="text-xl font-black">{s.name}</h3><p className="text-slate-500">{s.role}</p></div></div><Badge>{s.status}</Badge><div className="mt-3"><Field label="Salary Edit" type="number" value={s.salary} onChange={(v) => setStaff(prev => prev.map(x => x.id === s.id ? { ...x, salary: Number(v || 0) } : x))} /></div></Card>)}</div></div>; }
  function Attendance() { const [y, m] = attendanceDate.slice(0,7).split("-").map(Number); const days = daysInMonth(y, m - 1); return <Card><div className="mb-4 flex flex-wrap justify-between gap-3"><h3 className="text-2xl font-black">Attendance Monthly Calendar</h3><input type="month" value={attendanceDate.slice(0,7)} onChange={(e) => setAttendanceDate(`${e.target.value}-01`)} className="rounded-2xl border p-2" /></div><div className="grid grid-cols-7 gap-2">{Array.from({length: days}, (_,i)=>i+1).map(d => { const date = `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`; return <button key={date} onClick={() => setAttendanceDate(date)} className={`rounded-2xl p-3 text-left ${attendanceDate === date ? "bg-[#07162a] text-[#d4af37]" : "bg-slate-100"}`}><b>{d}</b><p className="text-xs">P:{staff.filter(s=>s.status==='Present').length} A:{staff.filter(s=>s.status==='Absent').length}</p></button>; })}</div><div className="mt-5 grid gap-3">{staff.map((s) => <div key={s.id} className="flex justify-between rounded-2xl bg-slate-100 p-4"><div><b>{s.name}</b><p className="text-sm text-slate-500">{attendanceDate}</p></div><select value={s.status} onChange={(e) => setStaff(prev => prev.map(x => x.id===s.id ? { ...x, status:e.target.value } : x))} className="rounded-xl border p-2"><option>Present</option><option>Absent</option></select></div>)}</div></Card>; }
  function Payroll() { return <Card><h3 className="mb-4 text-2xl font-black">Payroll Edit</h3>{staff.map((s) => <div key={s.id} className="mb-3 grid gap-3 rounded-2xl bg-slate-100 p-4 md:grid-cols-4"><b>{s.name}</b><input type="number" value={s.salary} onChange={(e)=>setStaff(prev=>prev.map(x=>x.id===s.id?{...x,salary:Number(e.target.value||0)}:x))} className="rounded-xl border p-2" /><input type="number" value={s.advance} onChange={(e)=>setStaff(prev=>prev.map(x=>x.id===s.id?{...x,advance:Number(e.target.value||0)}:x))} className="rounded-xl border p-2" /><span>Balance {money(s.salary - s.advance)}</span></div>)}</Card>; }
  function Inventory() { return <Card><div className="mb-4 flex justify-between"><h3 className="text-2xl font-black">Inventory</h3><button onClick={addInventory} className="rounded-2xl bg-[#07162a] px-4 py-2 font-black text-[#d4af37]">Add Item</button></div><div className="mb-4 grid gap-3 md:grid-cols-4"><input value={invForm.item} onChange={(e) => setInvForm({ ...invForm, item: e.target.value })} placeholder="Item" className="rounded-2xl border p-3" /><input value={invForm.stock} onChange={(e) => setInvForm({ ...invForm, stock: e.target.value })} placeholder="Stock" className="rounded-2xl border p-3" /><input value={invForm.min} onChange={(e) => setInvForm({ ...invForm, min: e.target.value })} placeholder="Min" className="rounded-2xl border p-3" /><input value={invForm.unit} onChange={(e) => setInvForm({ ...invForm, unit: e.target.value })} placeholder="Unit" className="rounded-2xl border p-3" /></div>{inventory.map((i) => <div key={i.id} className="mb-3 flex justify-between rounded-2xl bg-slate-100 p-4"><div><b>{i.item}</b><p className="text-sm text-slate-500">Min {i.min} {i.unit}</p></div><b>{i.stock} {i.unit}</b></div>)}</Card>; }
  function Expenses() { const categories = ["Fuel", "Chemical", "Machine Maintenance", "Van Maintenance", "Gloves", "Stick / Cleaning Things", "Fiber Cloth", "Accessories", "Marketing Expenses", "Meta Ads", "Instagram Ads", "Web Ads"]; return <div className="space-y-4"><div className="grid gap-4 md:grid-cols-4"><Stat title="Auto Fuel" value={money(autoFuel)} sub={`${km} km`} /><Stat title="Manual Expenses" value={money(expenses.reduce((s,e)=>s+Number(e.amount||0),0))} sub="All categories" /><Stat title="Monthly Total" value={money(monthlyExpense)} sub="Auto + manual" /><Stat title="Profit After Expense" value={money(profit)} sub="Revenue - expense" /></div><Card><h3 className="mb-4 text-2xl font-black">Add / Edit Expenses</h3><div className="grid gap-3 md:grid-cols-4"><select value={expenseForm.category} onChange={(e)=>setExpenseForm({...expenseForm,category:e.target.value})} className="rounded-2xl border p-3">{categories.map(c=><option key={c}>{c}</option>)}</select><input type="number" value={expenseForm.amount} onChange={(e)=>setExpenseForm({...expenseForm,amount:e.target.value})} placeholder="Amount" className="rounded-2xl border p-3" /><input type="month" value={expenseForm.month} onChange={(e)=>setExpenseForm({...expenseForm,month:e.target.value})} className="rounded-2xl border p-3" /><button onClick={addExpense} className="rounded-2xl bg-[#07162a] p-3 font-bold text-[#d4af37]">Add Expense</button></div><div className="mt-4 grid gap-3">{expenses.map(e=><div key={e.id} className="grid gap-3 rounded-2xl bg-slate-100 p-4 md:grid-cols-4"><b>{e.category}</b><input type="number" value={e.amount} onChange={(ev)=>setExpenses(prev=>prev.map(x=>x.id===e.id?{...x,amount:Number(ev.target.value||0)}:x))} className="rounded-xl border p-2" /><span>{e.month}</span><b>{money(e.amount)}</b></div>)}</div></Card></div>; }
  function Payments() { return <Card><h3 className="mb-4 text-2xl font-black">Payments</h3>{bookings.map((b) => <div key={b.id} className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-100 p-4"><div><b>{b.customer}</b><p>{b.service}</p></div><b>{money(b.amount)}</b><Badge>{b.payment}</Badge><button onClick={() => updateBooking(b.firebaseId || b.id, { payment: "Paid" })} className="rounded-xl bg-emerald-600 px-3 py-2 font-bold text-white">Mark Paid</button></div>)}</Card>; }
  function Reminders() { return <div className="grid gap-4 xl:grid-cols-2"><Card><h3 className="mb-4 text-2xl font-black">Payment Reminders</h3>{bookings.filter((b) => b.payment !== "Paid").map((b) => <div key={b.id} className="mb-3 flex justify-between rounded-2xl bg-slate-100 p-4"><div><b>{b.customer}</b><p>{money(b.amount)} pending</p></div><button onClick={() => setToast(`Payment reminder WhatsApp:\nHi ${b.customer}, pending amount ${money(b.amount)} for ${b.service}.`)} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white">WhatsApp</button></div>)}</Card><Card><h3 className="mb-4 text-2xl font-black">Review Requests</h3>{confirmed.map((b) => <div key={b.id} className="mb-3 rounded-2xl bg-slate-100 p-4"><b>{b.customer}</b><p>{b.service}</p><button onClick={() => setToast(`Review request WhatsApp sent to ${b.customer}`)} className="mt-2 rounded-xl bg-[#07162a] px-3 py-2 text-xs font-bold text-[#d4af37]">Review Msg</button></div>)}</Card></div>; }
  function Invoices() { return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{bookings.map((b) => <Card key={b.id}><h3 className="text-xl font-black">Invoice {b.id}</h3><p className="text-slate-500">{b.customer}</p><div className="mt-4 rounded-2xl bg-slate-100 p-4"><p>{b.service}</p><p>{b.payment}</p><p className="mt-2 text-2xl font-black">{money(b.amount)}</p></div><button onClick={() => invoiceText(b)} className="mt-4 w-full rounded-2xl bg-[#07162a] p-3 font-black text-[#d4af37]">Download Invoice</button></Card>)}</div>; }
  function Complaints() { return <Card><div className="mb-4 flex justify-between"><h3 className="text-2xl font-black">Complaints</h3><button onClick={() => { if (complaintForm.customer) setComplaints((prev) => [{ id: Date.now(), customer: complaintForm.customer, issue: complaintForm.issue, status: "Open" }, ...prev]); }} className="rounded-2xl bg-[#07162a] px-4 py-2 text-[#d4af37] font-bold">Add</button></div><div className="mb-4 grid gap-3 md:grid-cols-2"><input value={complaintForm.customer} onChange={(e) => setComplaintForm({ ...complaintForm, customer: e.target.value })} placeholder="Customer" className="rounded-2xl border p-3" /><input value={complaintForm.issue} onChange={(e) => setComplaintForm({ ...complaintForm, issue: e.target.value })} placeholder="Issue" className="rounded-2xl border p-3" /></div>{complaints.map((c) => <div key={c.id} className="mb-3 rounded-2xl bg-slate-100 p-4"><b>{c.customer}</b><p>{c.issue}</p><Badge>{c.status}</Badge></div>)}</Card>; }
  function ProfitAnalysis() { return <div className="space-y-4"><div className="grid gap-4 md:grid-cols-4"><Stat title="Total Revenue" value={money(revenue)} sub="Confirmed" /><Stat title="Total Expense" value={money(monthlyExpense)} sub="All expenses" /><Stat title="Profit" value={money(profit)} sub="Revenue - expense" /><Stat title="Fuel Auto" value={money(autoFuel)} sub="KM based" /></div><Card><h3 className="text-2xl font-black">Expense Breakdown</h3><div className="mt-4 grid gap-3 md:grid-cols-3">{expenses.map(e=><div key={e.id} className="rounded-2xl bg-slate-100 p-4"><b>{e.category}</b><div className="mt-3 h-3 rounded-full bg-slate-200"><div className="h-3 rounded-full bg-[#d4af37]" style={{width:`${Math.min(100, Number(e.amount || 0) / 50)}%`}} /></div><p className="mt-2 text-xl font-black">{money(e.amount)}</p></div>)}</div></Card></div>; }
  function Reports() { return <div className="space-y-4"><Card><div className="flex flex-wrap justify-between gap-3"><div><h3 className="text-2xl font-black">Reports</h3><p className="text-slate-500">CSV export + MIS summary</p></div><button onClick={exportCSV} className="rounded-2xl bg-[#07162a] px-4 py-2 text-[#d4af37] font-bold">Export CSV</button></div></Card><div className="grid gap-4 md:grid-cols-4"><Stat title="Bookings" value={bookings.length} sub="Total" /><Stat title="Staff" value={staff.length} sub="Workers" /><Stat title="Revenue" value={money(revenue)} sub="Confirmed" /><Stat title="Profit" value={money(profit)} sub="Estimate" /></div></div>; }
  function FirebaseSync() {
  const firebaseCollections = {
    authUsers: ["uid", "name", "phone", "email", "role", "isActive", "lastLoginAt", "createdAt"],
    rolePermissions: ["role", "canViewDashboard", "canEditBookings", "canConfirmBooking", "canAssignSupervisor", "canViewFinance", "canManageStaff", "canManageInventory", "canViewReports"],
    bookings: ["firebaseId", "id", "customer", "phone", "area", "address", "map", "service", "servicesList", "amount", "date", "time", "supervisor", "confirmed", "status", "payment", "lead", "startKm", "siteKm", "returnKm", "notes", "createdAt", "updatedAt", "invoiceUrl", "beforePhotoUrls", "afterPhotoUrls", "documentUrls", "paymentTimestamp", "serviceEditHistory"],
    customers: ["customerId", "name", "phone", "addresses", "bookingIds", "totalSpend", "repeatCount", "lastBookingDate", "leadSource", "portalEnabled"],
    services: ["serviceId", "name", "rate", "unit", "category", "icon", "isActive", "stockDeductionRules"],
    staff: ["staffId", "uid", "name", "role", "status", "salary", "advance", "phone", "assignedBookingIds", "performanceScore", "currentLat", "currentLng", "lastLocationAt"],
    attendance: ["date", "staffId", "name", "status", "checkIn", "checkOut", "notes", "photoUrl"],
    payroll: ["month", "staffId", "salary", "advance", "bonus", "deduction", "balance", "paidStatus"],
    inventory: ["itemId", "item", "stock", "min", "unit", "purchaseHistory", "autoReduceHistory", "updatedAt"],
    expenses: ["expenseId", "category", "amount", "month", "notes", "billUrl", "createdAt"],
    payments: ["paymentId", "bookingId", "customer", "amount", "method", "status", "timestamp", "proofUrl"],
    complaints: ["complaintId", "customer", "phone", "issue", "status", "bookingId", "resolution", "photoUrls"],
    mediaStorage: ["fileId", "bookingId", "customerId", "type", "url", "uploadedBy", "uploadedAt"],
    auditLogs: ["logId", "userId", "role", "action", "module", "recordId", "before", "after", "timestamp"],
    notificationQueue: ["notificationId", "type", "to", "message", "status", "scheduledAt", "sentAt", "bookingId"],
    chatMessages: ["messageId", "threadId", "fromUid", "toUid", "role", "message", "attachmentUrl", "createdAt", "readAt"],
    liveTracking: ["trackingId", "staffId", "bookingId", "lat", "lng", "accuracy", "speed", "battery", "timestamp"],
    reminders: ["reminderId", "bookingId", "type", "message", "sentStatus", "scheduledAt"],
    reports: ["reportId", "month", "revenue", "expenses", "profit", "bookingCount", "leadSummary", "staffSummary"],
  };
  const roles = [
    { role: "Admin", access: "Full ERP access" },
    { role: "Supervisor", access: "Bookings, staff workflow, GPS, checklist" },
    { role: "Staff", access: "Assigned jobs, attendance, upload photos" },
    { role: "Accountant", access: "Payments, expenses, payroll, reports" },
    { role: "Customer", access: "Portal, invoice, booking status, complaints" },
  ];
  return <div className="space-y-4"><div className="grid gap-4 xl:grid-cols-2"><Card><h3 className="text-2xl font-black">Firebase Phase 1 — Full ERP Sync</h3><p className="mt-2 text-slate-500">Auth users, role permissions, media storage, audit logs, notification queue, chat messages, live GPS coordinates ellam sync schema ready.</p><button onClick={simulateWebsiteBooking} className="mt-5 rounded-2xl bg-[#07162a] px-5 py-3 font-black text-[#d4af37]">Simulate Website Booking Sync</button><div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-emerald-700"><b>Full Sync:</b> bookings + customers + staff + attendance + payroll + inventory + expenses + payments + media + audit + chat + live tracking</div></Card><Card><h3 className="text-2xl font-black">Auth Roles</h3><div className="mt-4 grid gap-3">{roles.map((r) => <div key={r.role} className="rounded-2xl bg-slate-100 p-4"><b>{r.role}</b><p className="text-sm text-slate-500">{r.access}</p></div>)}</div></Card></div><Card><h3 className="text-2xl font-black">Firebase Collections</h3><div className="mt-4 grid gap-2 md:grid-cols-3 xl:grid-cols-4">{Object.keys(firebaseCollections).map((name) => <div key={name} className="rounded-xl bg-slate-100 p-3 font-bold">🔥 {name}</div>)}</div></Card><Card><h3 className="text-2xl font-black">Full Sync Fields</h3><div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Object.entries(firebaseCollections).map(([name, fields]) => <div key={name} className="rounded-2xl bg-slate-100 p-4"><h4 className="font-black text-[#07162a]">{name}</h4><div className="mt-2 flex flex-wrap gap-2">{fields.map((f) => <span key={f} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">{f}</span>)}</div></div>)}</div></Card><Card><h3 className="text-2xl font-black">Production Firebase Modules Needed Later</h3><div className="mt-4 grid gap-3 md:grid-cols-3"><div className="rounded-2xl bg-slate-100 p-4"><b>Authentication</b><p className="text-sm text-slate-500">Firebase Auth role based login</p></div><div className="rounded-2xl bg-slate-100 p-4"><b>Firestore</b><p className="text-sm text-slate-500">All ERP collections live sync</p></div><div className="rounded-2xl bg-slate-100 p-4"><b>Storage</b><p className="text-sm text-slate-500">Photos, invoices, documents</p></div></div></Card></div>;
  }

  function Settings() { return <div className="space-y-4"><Card className="bg-gradient-to-r from-[#07162a] to-slate-900 text-white"><p className="text-sm font-black text-[#d4af37]">FreshNest Owners</p><h3 className="mt-2 text-4xl font-black">Neethirajan — CEO / Founder • Selva Kumar — Co-Founder</h3><p className="mt-2 text-white/70">Premium cleaning services ERP • Trichy</p></Card><div className="grid gap-4 md:grid-cols-2"><Card><div className="text-5xl">👑</div><h3 className="mt-3 text-2xl font-black">Neethirajan</h3><p className="text-slate-500">CEO / Founder</p></Card><Card><div className="text-5xl">🛡️</div><h3 className="mt-3 text-2xl font-black">Selva Kumar</h3><p className="text-slate-500">Co-Founder</p></Card></div></div>; }

  function AddBookingModal({ onClose, onSave }) { const [form, setForm] = useState({ customer: "", phone: "", area: "Trichy", address: "", map: "", date: new Date().toISOString().slice(0, 10), time: "10:00 AM", supervisor: "Unassigned", lead: "Manual Lead", notes: "", servicesList: [] }); const addService = (svc) => { const amount = svc.name === "Balance Work" ? 0 : svc.rate; setForm(old => ({...old, servicesList:[...old.servicesList,{id:Date.now()+Math.random(), service:svc.name, qty:1, amount}]})); }; const updateRow = (id, key, value) => setForm((old) => ({ ...old, servicesList: old.servicesList.map((r) => r.id === id ? { ...r, [key]: value } : r) })); const rowAmount = (row) => { const found = services.find((s) => s.name === row.service) || services[0]; return found.name === "Balance Work" ? Number(row.amount || 0) : Number(row.qty || 1) * Number(found.rate || 0); }; const rows = form.servicesList.map((r) => ({ ...r, amount: rowAmount(r) })); const total = rows.reduce((s, r) => s + Number(r.amount || 0), 0); return <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"><div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl"><div className="flex justify-between"><h3 className="text-2xl font-black">Add Booking</h3><button onClick={onClose}>✕</button></div><div className="mt-4 grid gap-4 md:grid-cols-2"><Field label="Customer" value={form.customer} onChange={(v) => setForm({ ...form, customer: v })} /><Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v.replace(/[^0-9]/g, "") })} /><Field label="Area" value={form.area} onChange={(v) => setForm({ ...form, area: v })} /><Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} /><Field label="Map Link / Location" value={form.map} onChange={(v) => setForm({ ...form, map: v })} /><label className="grid gap-1 text-sm font-bold">Supervisor<select value={form.supervisor} onChange={(e) => setForm({ ...form, supervisor: e.target.value })} className="rounded-2xl border p-2"><option>Unassigned</option>{staff.map((s) => <option key={s.id}>{s.name}</option>)}</select></label><label className="grid gap-1 text-sm font-bold">Lead<select value={form.lead} onChange={(e) => setForm({ ...form, lead: e.target.value })} className="rounded-2xl border p-2"><option>Manual Lead</option><option>Website Lead</option><option>App Lead</option></select></label><Field label="Date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} /><Field label="Time" value={form.time} onChange={(v) => setForm({ ...form, time: v })} /></div><Card className="mt-5 bg-slate-50"><h4 className="font-black">Select Services</h4><div className="mt-3 grid gap-2 md:grid-cols-3">{services.map(svc=><button key={svc.name} onClick={()=>addService(svc)} className="rounded-2xl border bg-white p-3 text-left hover:border-[#d4af37]"><b>{svc.name}</b><p className="text-sm text-slate-500">{money(svc.rate)} / {svc.unit}</p></button>)}</div><h4 className="mt-5 font-black">Added Services</h4>{form.servicesList.length === 0 && <p className="mt-2 text-sm text-slate-500">Service click panna add aagum.</p>}{form.servicesList.map((r) => <div key={r.id} className="mt-3 grid gap-2 md:grid-cols-[1fr_.5fr_.6fr_auto]"><input value={r.service} onChange={(e) => updateRow(r.id, "service", e.target.value)} className="rounded-2xl border p-2" /><input type="number" value={r.qty} onChange={(e) => updateRow(r.id, "qty", e.target.value)} className="rounded-2xl border p-2" /><input type="number" value={r.amount} onChange={(e) => updateRow(r.id, "amount", e.target.value)} className="rounded-2xl border p-2" /><button onClick={() => setForm((old) => ({ ...old, servicesList: old.servicesList.filter((x) => x.id !== r.id) }))} className="rounded-2xl border p-2 text-red-600">Remove</button></div>)}</Card><div className="mt-5 rounded-3xl bg-slate-100 p-4"><p>Total Amount</p><h3 className="text-3xl font-black">{money(total)}</h3></div><div className="mt-5 grid gap-3 md:grid-cols-2"><button onClick={onClose} className="rounded-2xl border p-3 font-bold">Cancel</button><button onClick={() => onSave({ ...form, servicesList: rows })} className="rounded-2xl bg-[#07162a] p-3 font-black text-[#d4af37]">Save Booking</button></div></div></div>; }
  function BookingDrawer({ booking, onClose }) { const [draft, setDraft] = useState(booking.servicesList || []); const [showExtraServices, setShowExtraServices] = useState(false); const total = draft.reduce((s, i) => s + Number(i.amount || 0), 0); const addExtraService = (svc) => setDraft((p) => [...p, { service: svc.name, qty: 1, amount: svc.name === "Balance Work" ? 0 : svc.rate }]); return <div className="fixed inset-0 z-50 flex justify-end bg-black/50 p-3"><div className="drawer-scroll w-full max-w-4xl rounded-[2rem] bg-white p-5 shadow-2xl"><div className="sticky top-0 z-10 mb-4 flex justify-between bg-white pb-3"><div><h3 className="text-2xl font-black">{booking.customer}</h3><p className="text-sm text-slate-500">{booking.id} • {booking.service}</p></div><button onClick={onClose}>✕</button></div><div className="grid gap-4 lg:grid-cols-2"><Card><h4 className="font-black">Customer Details</h4><div className="mt-3 grid gap-2"><p><b>Phone:</b> {booking.phone}</p><p><b>Address:</b> {booking.address}</p><p><b>Map:</b> {booking.map || "-"}</p><p><b>Lead:</b> {booking.lead}</p></div><div className="mt-3 grid gap-2 md:grid-cols-2"><a href={`tel:${booking.phone}`} className="rounded-2xl bg-emerald-600 p-3 text-center font-bold text-white">Call</a><a href={`https://wa.me/91${String(booking.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('FreshNest booking update for ' + booking.customer)}`} target="_blank" rel="noreferrer" className="rounded-2xl bg-[#07162a] p-3 text-center font-bold text-[#d4af37]">WhatsApp</a></div></Card><Card><h4 className="font-black">Confirm / Assign / Reschedule</h4><div className="mt-3 grid gap-3 md:grid-cols-2">{!(booking.confirmed || booking.status === "Confirmed" || booking.status === "Completed") && <button onClick={() => updateBooking(booking.firebaseId || booking.id, { confirmed: true, status: "Confirmed", servicesList: draft, service: draft.map((x) => x.service).join(" + "), amount: total, payment: booking.payment || "Pending" })} className="rounded-2xl bg-emerald-600 p-3 font-bold text-white">Book Service</button>}<button onClick={() => updateBooking(booking.firebaseId || booking.id, { confirmed: false, status: "Cancelled" })} className="rounded-2xl bg-red-600 p-3 font-bold text-white">Cancel</button><select value={booking.supervisor} onChange={(e) => updateBooking(booking.firebaseId || booking.id, { supervisor: e.target.value })} className="rounded-2xl border p-3"><option>Unassigned</option>{staff.map((s) => <option key={s.id}>{s.name}</option>)}</select><input type="date" value={booking.date} onChange={(e) => updateBooking(booking.firebaseId || booking.id, { date: e.target.value })} className="rounded-2xl border p-3" /></div></Card><Card className="lg:col-span-2"><div className="flex justify-between"><h4 className="font-black">Service Edit Before Confirm</h4><button onClick={() => setShowExtraServices((v) => !v)} className="rounded-xl bg-[#07162a] px-3 py-2 text-[#d4af37] font-bold">+ Extras / Services</button></div>{showExtraServices && <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">{services.map((svc) => <button key={svc.name} onClick={() => addExtraService(svc)} className="rounded-2xl border bg-slate-50 p-3 text-left hover:border-[#d4af37]"><b>{serviceIcons[svc.name] || "✨"} {svc.name}</b><p className="text-sm text-slate-500">{money(svc.rate)} / {svc.unit}</p></button>)}</div>}{draft.map((r, i) => <div key={i} className="mt-3 grid gap-2 md:grid-cols-[1fr_.5fr_.6fr_auto]"><input value={r.service} onChange={(e) => setDraft((p) => p.map((x, idx) => idx === i ? { ...x, service: e.target.value } : x))} className="rounded-2xl border p-2" /><input type="number" value={r.qty} onChange={(e) => setDraft((p) => p.map((x, idx) => idx === i ? { ...x, qty: e.target.value } : x))} className="rounded-2xl border p-2" /><input type="number" value={r.amount} onChange={(e) => setDraft((p) => p.map((x, idx) => idx === i ? { ...x, amount: e.target.value } : x))} className="rounded-2xl border p-2" /><button onClick={() => setDraft((p) => p.length === 1 ? p : p.filter((_, idx) => idx !== i))} className="rounded-2xl border p-2 text-red-600">Remove</button></div>)}<div className="mt-3 rounded-2xl bg-emerald-100 p-3 font-black text-emerald-700">Updated Total {money(total)}</div><button onClick={() => updateBooking(booking.firebaseId || booking.id, { servicesList: draft, service: draft.map((x) => x.service).join(" + "), amount: total })} className="mt-3 w-full rounded-2xl bg-[#07162a] p-3 font-black text-[#d4af37]">Save Changes</button></Card><Card className="lg:col-span-2"><h4 className="mb-3 font-black">Work + KM</h4><div className="grid gap-2 md:grid-cols-4">{["Pending", "On The Way", "Work Started", "Completed"].map((s) => <button key={s} onClick={() => updateBooking(booking.firebaseId || booking.id, { status: s, confirmed: s !== "Pending" })} className="rounded-2xl bg-slate-100 p-3 font-bold">{s}</button>)}</div><div className="mt-3 grid gap-3 md:grid-cols-4"><Field label="Start KM" value={booking.startKm} onChange={(v) => updateBooking(booking.firebaseId || booking.id, { startKm: v })} /><Field label="Site KM" value={booking.siteKm} onChange={(v) => updateBooking(booking.firebaseId || booking.id, { siteKm: v })} /><Field label="Return KM" value={booking.returnKm} onChange={(v) => updateBooking(booking.firebaseId || booking.id, { returnKm: v })} /><label className="grid gap-1 text-sm font-bold">Payment<select value={booking.payment} onChange={(e) => updateBooking(booking.firebaseId || booking.id, { payment: e.target.value })} className="rounded-2xl border p-2"><option>Pending</option><option>Advance Paid</option><option>Paid</option></select></label></div></Card></div></div></div>; }

  function Screen() { const screens = { Dashboard, Bookings, Supervisor,"Supervisor A-Z Sync": SupervisorAZSync, "Operations Advanced": OperationsAdvanced, "Customer Portal": CustomerPortal, "Marketing Automation": MarketingAutomation, Calendar, CRM, "Customer History": CustomerHistory, Marketing, Services, Staff, Attendance, Payroll, Inventory, Expenses, Payments, Reminders, Invoices, Complaints, "Profit Analysis": ProfitAnalysis, Reports, "Firebase Sync": FirebaseSync, Settings }; const Comp = screens[active] || Dashboard; return <Comp />; }
  if (!loggedIn) return <LoginScreen />;
  return <Layout><Screen /></Layout>;
}
