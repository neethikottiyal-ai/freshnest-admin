import React, { useMemo, useState } from "react";

const servicesSeed = [
  { name: "Sofa Shampooing", rate: 550, unit: "seat" },
  { name: "Furnished Deep Cleaning", rate: 8.5, unit: "sq.ft" },
  { name: "Unfurnished Deep Cleaning", rate: 7.5, unit: "sq.ft" },
  { name: "Water Tank Cleaning", rate: 2, unit: "litre" },
  { name: "Termite Pest Control", rate: 14, unit: "sq.ft" },
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

const bookingSeed = [
  {
    id: "FN-1001",
    customer: "Arun Kumar",
    phone: "9876543210",
    area: "Thillai Nagar",
    address: "12, North Street, Trichy",
    service: "Sofa Shampooing",
    servicesList: [{ service: "Sofa Shampooing", qty: 4, amount: 2200 }],
    amount: 2200,
    date: "2026-05-19",
    time: "10:30 AM",
    supervisor: "Ravi Kumar",
    status: "Pending",
    confirmed: false,
    payment: "Pending",
    lead: "Website Lead",
    startKm: "",
    siteKm: "",
    returnKm: "",
    notes: "",
  },
  {
    id: "FN-1002",
    customer: "Priya S",
    phone: "9840012345",
    area: "Cantonment",
    address: "8, Main Road, Trichy",
    service: "Furnished Deep Cleaning",
    servicesList: [{ service: "Furnished Deep Cleaning", qty: 1000, amount: 8500 }],
    amount: 8500,
    date: "2026-05-19",
    time: "12:00 PM",
    supervisor: "Selva Kumar",
    status: "Confirmed",
    confirmed: true,
    payment: "Advance Paid",
    lead: "App Lead",
    startKm: "65000",
    siteKm: "65018",
    returnKm: "",
    notes: "Kitchen grease extra",
  },
  {
    id: "FN-1003",
    customer: "Mohammed Ali",
    phone: "9123456789",
    area: "Srirangam",
    address: "22, Temple Road",
    service: "Termite Pest Control",
    servicesList: [{ service: "Termite Pest Control", qty: 450, amount: 6300 }],
    amount: 6300,
    date: "2026-06-08",
    time: "04:00 PM",
    supervisor: "Amit Singh",
    status: "Completed",
    confirmed: true,
    payment: "Paid",
    lead: "Website Lead",
    startKm: "12000",
    siteKm: "12014",
    returnKm: "12028",
    notes: "",
  },
];

function money(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

function Card({ children, className = "" }) {
  return <div className={`rounded-3xl bg-white p-5 shadow-sm border border-slate-200 ${className}`}>{children}</div>;
}

function Badge({ children }) {
  const cls = {
    Pending: "bg-amber-100 text-amber-800",
    Confirmed: "bg-blue-100 text-blue-800",
    Completed: "bg-emerald-100 text-emerald-800",
    Cancelled: "bg-red-100 text-red-800",
    Paid: "bg-emerald-100 text-emerald-800",
    "Advance Paid": "bg-blue-100 text-blue-800",
    Present: "bg-emerald-100 text-emerald-800",
    Absent: "bg-red-100 text-red-800",
  }[children] || "bg-slate-100 text-slate-700";
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${cls}`}>{children}</span>;
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="grid gap-1 text-sm font-bold text-slate-700">
      {label}
      <input className="rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-[#d4af37]" type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Stat({ title, value, sub }) {
  return (
    <Card>
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-2 text-3xl font-black text-slate-950">{value}</h3>
      <p className="mt-1 text-xs text-slate-500">{sub}</p>
    </Card>
  );
}

function makeBooking(form, count) {
  const list = form.servicesList || [{ service: form.service, qty: 1, amount: form.amount || 0 }];
  const amount = list.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  return {
    id: `FN-${1001 + count}`,
    customer: form.customer || "New Customer",
    phone: form.phone || "",
    area: form.area || "Trichy",
    address: form.address || form.area || "Trichy",
    service: list.map((item) => item.service).join(" + "),
    servicesList: list,
    amount,
    date: form.date || new Date().toISOString().slice(0, 10),
    time: form.time || "10:00 AM",
    supervisor: form.supervisor || "Unassigned",
    status: "Pending",
    confirmed: false,
    payment: "Pending",
    lead: form.lead || "Manual Lead",
    startKm: "",
    siteKm: "",
    returnKm: "",
    notes: form.notes || "",
  };
}

export default function FreshNestFullERP() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [active, setActive] = useState("Dashboard");
  const [bookings, setBookings] = useState(bookingSeed);
  const [staff, setStaff] = useState(staffSeed);
  const [inventory, setInventory] = useState(inventorySeed);
  const [services, setServices] = useState(servicesSeed);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("FreshNest ERP ready ✅");
  const [staffForm, setStaffForm] = useState({ name: "", role: "Cleaner", salary: "20000" });
  const [invForm, setInvForm] = useState({ item: "", stock: "", min: "", unit: "pcs" });
  const [complaints, setComplaints] = useState([{ id: 1, customer: "Karthik", issue: "Staff reached late", status: "Open" }]);
  const [complaintForm, setComplaintForm] = useState({ customer: "", issue: "" });

  const filtered = useMemo(() => {
    const t = query.toLowerCase();
    return bookings.filter((b) => [b.id, b.customer, b.phone, b.service, b.status, b.lead].join(" ").toLowerCase().includes(t));
  }, [bookings, query]);

  const confirmed = bookings.filter((b) => b.confirmed);
  const revenue = confirmed.reduce((s, b) => s + Number(b.amount || 0), 0);
  const pending = bookings.filter((b) => !b.confirmed).length;
  const website = bookings.filter((b) => b.lead === "Website Lead").length;
  const app = bookings.filter((b) => b.lead === "App Lead").length;
  const manual = bookings.filter((b) => b.lead === "Manual Lead").length;
  const km = bookings.reduce((s, b) => s + Math.max(0, Number(b.returnKm || b.siteKm || 0) - Number(b.startKm || 0)), 0);
  const fuel = Math.round((km / 16) * 100);
  const profit = Math.max(0, revenue - fuel);
  const repeatMap = bookings.reduce((a, b) => ({ ...a, [b.phone]: (a[b.phone] || 0) + 1 }), {});
  const repeat = Object.values(repeatMap).filter((n) => n > 1).length;

  const nav = ["Dashboard", "Bookings", "Supervisor", "Calendar", "CRM", "Customer History", "Marketing", "Services", "Staff", "Attendance", "Payroll", "Inventory", "Expenses", "Payments", "Reminders", "Invoices", "Complaints", "Profit Analysis", "Reports", "Firebase Sync", "Settings"];

  function updateBooking(id, patch) {
    const finalPatch = patch.confirmed ? { ...patch, status: patch.status || "Confirmed" } : patch;
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...finalPatch } : b)));
    setSelected((old) => (old && old.id === id ? { ...old, ...finalPatch } : old));
  }

  function addBooking(form) {
    const next = makeBooking(form, bookings.length);
    setBookings((prev) => [next, ...prev]);
    setSelected(next);
    setShowAdd(false);
    setActive("Bookings");
    setToast(`Booking saved: ${next.id}`);
  }

  function addStaff() {
    if (!staffForm.name.trim()) return;
    setStaff((prev) => [...prev, { id: Date.now(), name: staffForm.name, role: staffForm.role, status: "Present", salary: Number(staffForm.salary || 0), advance: 0 }]);
    setStaffForm({ name: "", role: "Cleaner", salary: "20000" });
  }

  function addInventory() {
    if (!invForm.item.trim()) return;
    setInventory((prev) => [...prev, { id: Date.now(), item: invForm.item, stock: Number(invForm.stock || 0), min: Number(invForm.min || 0), unit: invForm.unit || "pcs" }]);
    setInvForm({ item: "", stock: "", min: "", unit: "pcs" });
  }

  function simulateWebsiteBooking() {
    addBooking({
      customer: "Website Auto Lead",
      phone: "9000012345",
      area: "Trichy Website",
      address: "Website form enquiry",
      supervisor: "Unassigned",
      lead: "Website Lead",
      servicesList: [{ service: "Furnished Deep Cleaning", qty: 850, amount: 7225 }],
    });
    setToast("Website booking auto synced to CRM");
  }

  function invoiceText(b) {
    const lines = [
      "FreshNest Cleaning Services",
      `Invoice: ${b.id}`,
      `Customer: ${b.customer}`,
      `Phone: ${b.phone}`,
      `Service: ${b.service}`,
      `Date: ${b.date} ${b.time}`,
      `Total: ${money(b.amount)}`,
      "Thank you for choosing FreshNest.",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${b.id}-invoice.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setToast("Invoice downloaded");
  }

  function exportCSV() {
    const rows = [["ID", "Customer", "Phone", "Service", "Amount", "Status", "Lead"], ...bookings.map((b) => [b.id, b.customer, b.phone, b.service, b.amount, b.status, b.lead])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "freshnest-report.csv";
    a.click();
    URL.revokeObjectURL(url);
    setToast("CSV exported");
  }

  function Login() {
    return (
      <div className="min-h-screen bg-[#07162a] p-6 text-white grid place-items-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white/10 md:grid-cols-2 shadow-2xl">
          <div className="p-10"><div className="text-5xl">🧹</div><h1 className="mt-4 text-5xl font-black">FreshNest Admin ERP</h1><p className="mt-4 text-white/70">Premium business dashboard for Trichy cleaning services.</p></div>
          <div className="bg-white p-8 text-slate-950"><h2 className="text-3xl font-black">Admin Login</h2><p className="mt-2 text-slate-500">Demo login ready</p><input value="admin@freshnest.in" readOnly className="mt-6 w-full rounded-2xl border p-3" /><input value="freshnest123" type="password" readOnly className="mt-3 w-full rounded-2xl border p-3" /><button onClick={() => setLoggedIn(true)} className="mt-5 w-full rounded-2xl bg-[#07162a] p-3 font-black text-[#d4af37]">Login</button></div>
        </div>
      </div>
    );
  }

  function Layout({ children }) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-950">
        {toast && <div className="fixed right-4 top-4 z-50 max-w-sm rounded-2xl bg-[#07162a] p-4 text-sm font-bold text-[#d4af37] shadow-2xl">{toast}</div>}
        <aside className="fixed left-0 top-0 hidden h-full w-72 overflow-y-auto bg-[#07162a] p-4 text-white lg:block">
          <div className="mb-4 rounded-3xl bg-white/10 p-4"><div className="text-3xl">🧹</div><h1 className="mt-2 font-black">FreshNest ERP</h1><p className="text-xs text-[#d4af37]">Neethirajan + Selva Kumar</p></div>
          <nav className="space-y-1 pb-8">{nav.map((n) => <button key={n} onClick={() => setActive(n)} className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-bold ${active === n ? "bg-[#d4af37] text-[#07162a]" : "text-white/70 hover:bg-white/10"}`}>{n}</button>)}</nav>
        </aside>
        <main className="lg:pl-72">
          <header className="sticky top-0 z-20 border-b bg-white/90 p-4 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="text-2xl font-black">{active}</h2><p className="text-sm text-slate-500">FreshNest Cleaning Services • Trichy</p></div>
              <div className="flex flex-wrap gap-2"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search bookings..." className="rounded-2xl border px-4 py-2" /><button onClick={() => setShowAdd(true)} className="rounded-2xl bg-[#07162a] px-4 py-2 font-black text-[#d4af37]">+ Add Job</button><button onClick={() => setToast("🔔 New booking alert simulated")} className="rounded-2xl bg-white px-4 py-2 font-bold shadow">Bell</button></div>
            </div>
          </header>
          <div className="p-4 md:p-6">{children}</div>
        </main>
        {showAdd && <AddBookingModal onClose={() => setShowAdd(false)} onSave={addBooking} />}
        {selected && <BookingDrawer booking={selected} onClose={() => setSelected(null)} />}
      </div>
    );
  }

  function Dashboard() {
    return <div className="space-y-6"><Card className="bg-gradient-to-r from-[#07162a] to-slate-900 text-white"><h3 className="text-3xl font-black">Live Premium Control Center</h3><p className="mt-2 text-white/70">Booking, CRM, finance, staff, inventory and reports in one place.</p></Card><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Stat title="Confirmed Revenue" value={money(revenue)} sub="Confirmed bookings only" /><Stat title="Pending Confirm" value={pending} sub="Need follow-up" /><Stat title="Fuel Expense" value={money(fuel)} sub={`${km} km estimated`} /><Stat title="Profit" value={money(profit)} sub="Revenue - fuel" /></div><div className="grid gap-4 xl:grid-cols-3"><Card className="xl:col-span-2"><h3 className="mb-4 text-xl font-black">Live Bookings</h3><BookingTable compact /></Card><Card><h3 className="mb-4 text-xl font-black">Notifications</h3><div className="space-y-2"><div className="rounded-2xl bg-slate-100 p-3">{pending} bookings waiting confirmation</div><div className="rounded-2xl bg-slate-100 p-3">Website Leads: {website}</div><div className="rounded-2xl bg-slate-100 p-3">Low Stock: {inventory.filter((i) => i.stock <= i.min).length}</div></div></Card></div></div>;
  }

  function BookingTable({ compact = false }) {
    const rows = compact ? filtered.slice(0, 5) : filtered;
    return <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead><tr className="border-b text-slate-500">{["ID", "Customer", "Service", "Date", "Supervisor", "Status", "Payment", "Lead", "Amount", "Action"].map((h) => <th key={h} className="py-3 pr-4">{h}</th>)}</tr></thead><tbody>{rows.map((b) => <tr key={b.id} className="border-b"><td className="py-3 pr-4 font-black">{b.id}</td><td className="py-3 pr-4"><b>{b.customer}</b><p className="text-xs text-slate-500">{b.phone}</p></td><td className="py-3 pr-4">{b.service}</td><td className="py-3 pr-4">{b.date}<p className="text-xs text-slate-500">{b.time}</p></td><td className="py-3 pr-4">{b.supervisor}</td><td className="py-3 pr-4"><Badge>{b.confirmed ? "Confirmed" : b.status}</Badge></td><td className="py-3 pr-4"><Badge>{b.payment}</Badge></td><td className="py-3 pr-4">{b.lead}</td><td className="py-3 pr-4 font-black">{money(b.amount)}</td><td className="py-3 pr-4"><div className="flex gap-2"><button onClick={() => updateBooking(b.id, { confirmed: true, status: "Confirmed" })} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white">Confirm</button><button onClick={() => setSelected(b)} className="rounded-xl bg-[#07162a] px-3 py-2 text-xs font-bold text-[#d4af37]">Open</button></div></td></tr>)}</tbody></table></div>;
  }

  function Bookings() { return <Card><div className="mb-4 flex justify-between"><h3 className="text-xl font-black">All Bookings</h3><button onClick={() => setShowAdd(true)} className="rounded-2xl bg-[#07162a] px-4 py-2 font-bold text-[#d4af37]">Add Job</button></div><BookingTable /></Card>; }
  function Supervisor() { return <div className="grid gap-4 xl:grid-cols-2">{filtered.map((b) => <Card key={b.id}><div className="flex justify-between"><div><h3 className="text-xl font-black">{b.customer}</h3><p className="text-sm text-slate-500">{b.area} • {b.service}</p><p className="text-xs text-[#d4af37]">Supervisor: {b.supervisor}</p></div><Badge>{b.confirmed ? "Confirmed" : b.status}</Badge></div><div className="mt-4 grid gap-2 md:grid-cols-4">{["Pending", "On The Way", "Work Started", "Completed"].map((s) => <button key={s} onClick={() => updateBooking(b.id, { status: s, confirmed: s !== "Pending" })} className="rounded-2xl bg-slate-100 px-3 py-3 text-sm font-black hover:bg-[#d4af37]">{s}</button>)}</div><button onClick={() => setSelected(b)} className="mt-3 w-full rounded-2xl bg-[#07162a] px-4 py-3 font-black text-[#d4af37]">Open Full Workflow</button></Card>)}</div>; }
  function Calendar() { const monthJobs = bookings.filter((b) => b.confirmed); return <div className="grid gap-4 xl:grid-cols-2"><Card><h3 className="text-2xl font-black">Confirmed Calendar</h3><p className="text-sm text-slate-500">Confirmed bookings only show here.</p><div className="mt-4 grid gap-3">{monthJobs.map((b) => <button key={b.id} onClick={() => setSelected(b)} className="rounded-2xl bg-slate-100 p-4 text-left"><b>{b.date}</b><p>{b.customer} • {b.service}</p></button>)}</div></Card><Card><h3 className="text-2xl font-black">Schedule Summary</h3><div className="mt-4 space-y-3"><div className="rounded-2xl bg-slate-100 p-4">Confirmed: {confirmed.length}</div><div className="rounded-2xl bg-slate-100 p-4">Pending: {pending}</div><div className="rounded-2xl bg-slate-100 p-4">Completed: {bookings.filter((b) => b.status === "Completed").length}</div></div></Card></div>; }
  function CRM() { return <div className="space-y-4"><div className="grid gap-4 md:grid-cols-4"><Stat title="Website Leads" value={website} sub="Website forms" /><Stat title="App Leads" value={app} sub="App / Instagram" /><Stat title="Manual Leads" value={manual} sub="Manual entry" /><Stat title="Repeat" value={repeat} sub="Phone matched" /></div><Card><h3 className="mb-4 text-2xl font-black">CRM Database</h3><BookingTable /></Card></div>; }
  function CustomerHistory() { const phones = [...new Set(bookings.map((b) => b.phone))]; return <div className="space-y-4"><Card><h3 className="text-2xl font-black">Lead Details</h3><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead><tr className="border-b text-slate-500"><th className="py-3 pr-4">Customer</th><th>Phone</th><th>Lead</th><th>Service</th><th>Status</th><th>Repeat</th></tr></thead><tbody>{bookings.map((b) => <tr key={b.id} className="border-b"><td className="py-3 pr-4 font-bold">{b.customer}</td><td>{b.phone}</td><td>{b.lead}</td><td>{b.service}</td><td><Badge>{b.confirmed ? "Confirmed" : b.status}</Badge></td><td>{repeatMap[b.phone] > 1 ? "Repeat" : "New"}</td></tr>)}</tbody></table></div></Card><div className="grid gap-4">{phones.map((p) => { const list = bookings.filter((b) => b.phone === p); return <Card key={p}><h3 className="text-xl font-black">{list[0].customer}</h3><p className="text-sm text-slate-500">{p} • {list.length} booking(s)</p><div className="mt-3 grid gap-2 md:grid-cols-3">{list.map((b) => <button key={b.id} onClick={() => setSelected(b)} className="rounded-2xl bg-slate-100 p-3 text-left"><b>{b.id}</b><p>{b.service}</p><p>{money(b.amount)}</p></button>)}</div></Card>; })}</div></div>; }
  function Marketing() { const rows = [{ name: "Website Lead", count: website }, { name: "App Lead", count: app }, { name: "Manual Lead", count: manual }, { name: "Repeat Customer", count: repeat }]; return <div className="grid gap-4 xl:grid-cols-2"><Card><h3 className="mb-4 text-2xl font-black">Marketing Leads</h3>{rows.map((r) => <div key={r.name} className="mb-3 rounded-2xl bg-slate-100 p-4 flex justify-between"><b>{r.name}</b><span className="text-2xl font-black text-[#d4af37]">{r.count}</span></div>)}</Card><Card><h3 className="mb-4 text-2xl font-black">Campaign Ideas</h3>{["Before/After reel", "Festival deep clean offer", "Water tank safety post", "Referral cashback"].map((i) => <div key={i} className="mb-3 rounded-2xl bg-[#07162a] p-4 font-black text-[#d4af37]">{i}</div>)}</Card></div>; }
  function Services() { return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{services.map((s, i) => <Card key={i}><h3 className="text-xl font-black">{s.name}</h3><p className="text-slate-500">Rate: {money(s.rate)} / {s.unit}</p><div className="mt-3 grid grid-cols-2 gap-2"><Field label="Rate" type="number" value={s.rate} onChange={(v) => setServices((prev) => prev.map((x, idx) => idx === i ? { ...x, rate: Number(v || 0) } : x))} /><Field label="Unit" value={s.unit} onChange={(v) => setServices((prev) => prev.map((x, idx) => idx === i ? { ...x, unit: v } : x))} /></div></Card>)}</div>; }
  function Staff() { return <div className="space-y-4"><Card><h3 className="mb-4 text-xl font-black">Add Staff</h3><div className="grid gap-3 md:grid-cols-4"><input value={staffForm.name} onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })} placeholder="Full name" className="rounded-2xl border p-3 md:col-span-2" /><input value={staffForm.role} onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })} placeholder="Role" className="rounded-2xl border p-3" /><button onClick={addStaff} className="rounded-2xl bg-[#07162a] p-3 font-black text-[#d4af37]">Add</button></div></Card><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{staff.map((s) => <Card key={s.id}><h3 className="text-xl font-black">{s.name}</h3><p className="text-slate-500">{s.role}</p><Badge>{s.status}</Badge><p className="mt-3">Salary: <b>{money(s.salary)}</b></p></Card>)}</div></div>; }
  function Attendance() { return <Card><h3 className="mb-4 text-2xl font-black">Attendance</h3>{staff.map((s) => <div key={s.id} className="mb-3 flex justify-between rounded-2xl bg-slate-100 p-4"><div><b>{s.name}</b><p className="text-sm text-slate-500">{s.role}</p></div><select value={s.status} onChange={(e) => setStaff((prev) => prev.map((x) => x.id === s.id ? { ...x, status: e.target.value } : x))} className="rounded-xl border p-2"><option>Present</option><option>Absent</option></select></div>)}</Card>; }
  function Payroll() { return <Card><h3 className="mb-4 text-2xl font-black">Payroll</h3>{staff.map((s) => <div key={s.id} className="mb-3 grid gap-3 rounded-2xl bg-slate-100 p-4 md:grid-cols-4"><b>{s.name}</b><span>Salary {money(s.salary)}</span><span>Advance {money(s.advance)}</span><span>Balance {money(s.salary - s.advance)}</span></div>)}</Card>; }
  function Inventory() { return <Card><div className="mb-4 flex justify-between"><h3 className="text-2xl font-black">Inventory</h3><button onClick={addInventory} className="rounded-2xl bg-[#07162a] px-4 py-2 font-black text-[#d4af37]">Add Item</button></div><div className="mb-4 grid gap-3 md:grid-cols-4"><input value={invForm.item} onChange={(e) => setInvForm({ ...invForm, item: e.target.value })} placeholder="Item" className="rounded-2xl border p-3" /><input value={invForm.stock} onChange={(e) => setInvForm({ ...invForm, stock: e.target.value })} placeholder="Stock" className="rounded-2xl border p-3" /><input value={invForm.min} onChange={(e) => setInvForm({ ...invForm, min: e.target.value })} placeholder="Min" className="rounded-2xl border p-3" /><input value={invForm.unit} onChange={(e) => setInvForm({ ...invForm, unit: e.target.value })} placeholder="Unit" className="rounded-2xl border p-3" /></div>{inventory.map((i) => <div key={i.id} className="mb-3 flex justify-between rounded-2xl bg-slate-100 p-4"><div><b>{i.item}</b><p className="text-sm text-slate-500">Min {i.min} {i.unit}</p></div><b>{i.stock} {i.unit}</b></div>)}</Card>; }
  function Expenses() { return <div className="grid gap-4 md:grid-cols-4"><Stat title="Total KM" value={`${km} km`} sub="From jobs" /><Stat title="Fuel" value={money(fuel)} sub="16 km = ₹100" /><Stat title="Low Stock" value={inventory.filter((i) => i.stock <= i.min).length} sub="Purchase needed" /><Stat title="Pending" value={pending} sub="Team follow-up" /></div>; }
  function Payments() { return <Card><h3 className="mb-4 text-2xl font-black">Payments</h3>{bookings.map((b) => <div key={b.id} className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-100 p-4"><div><b>{b.customer}</b><p>{b.service}</p></div><b>{money(b.amount)}</b><Badge>{b.payment}</Badge><button onClick={() => updateBooking(b.id, { payment: "Paid" })} className="rounded-xl bg-emerald-600 px-3 py-2 font-bold text-white">Mark Paid</button></div>)}</Card>; }
  function Reminders() { return <div className="grid gap-4 xl:grid-cols-2"><Card><h3 className="mb-4 text-2xl font-black">Payment Reminders</h3>{bookings.filter((b) => b.payment !== "Paid").map((b) => <div key={b.id} className="mb-3 flex justify-between rounded-2xl bg-slate-100 p-4"><div><b>{b.customer}</b><p>{money(b.amount)} pending</p></div><button onClick={() => setToast(`Payment reminder WhatsApp:\nHi ${b.customer}, pending amount ${money(b.amount)} for ${b.service}.`)} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white">WhatsApp</button></div>)}</Card><Card><h3 className="mb-4 text-2xl font-black">Review Requests</h3>{confirmed.map((b) => <div key={b.id} className="mb-3 rounded-2xl bg-slate-100 p-4"><b>{b.customer}</b><p>{b.service}</p><button onClick={() => setToast(`Review request WhatsApp sent to ${b.customer}`)} className="mt-2 rounded-xl bg-[#07162a] px-3 py-2 text-xs font-bold text-[#d4af37]">Review Msg</button></div>)}</Card></div>; }
  function Invoices() { return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{bookings.map((b) => <Card key={b.id}><h3 className="text-xl font-black">Invoice {b.id}</h3><p className="text-slate-500">{b.customer}</p><div className="mt-4 rounded-2xl bg-slate-100 p-4"><p>{b.service}</p><p>{b.payment}</p><p className="mt-2 text-2xl font-black">{money(b.amount)}</p></div><button onClick={() => invoiceText(b)} className="mt-4 w-full rounded-2xl bg-[#07162a] p-3 font-black text-[#d4af37]">Download Invoice</button></Card>)}</div>; }
  function Complaints() { return <Card><div className="mb-4 flex justify-between"><h3 className="text-2xl font-black">Complaints</h3><button onClick={() => { if (complaintForm.customer) setComplaints((prev) => [{ id: Date.now(), customer: complaintForm.customer, issue: complaintForm.issue, status: "Open" }, ...prev]); }} className="rounded-2xl bg-[#07162a] px-4 py-2 text-[#d4af37] font-bold">Add</button></div><div className="mb-4 grid gap-3 md:grid-cols-2"><input value={complaintForm.customer} onChange={(e) => setComplaintForm({ ...complaintForm, customer: e.target.value })} placeholder="Customer" className="rounded-2xl border p-3" /><input value={complaintForm.issue} onChange={(e) => setComplaintForm({ ...complaintForm, issue: e.target.value })} placeholder="Issue" className="rounded-2xl border p-3" /></div>{complaints.map((c) => <div key={c.id} className="mb-3 rounded-2xl bg-slate-100 p-4"><b>{c.customer}</b><p>{c.issue}</p><Badge>{c.status}</Badge></div>)}</Card>; }
  function ProfitAnalysis() { return <div className="space-y-4"><div className="grid gap-4 md:grid-cols-3"><Stat title="Revenue" value={money(revenue)} sub="Confirmed" /><Stat title="Fuel" value={money(fuel)} sub="Expense" /><Stat title="Profit" value={money(profit)} sub="Estimate" /></div><Card><h3 className="text-2xl font-black">Analytics</h3><div className="mt-4 grid gap-4 md:grid-cols-3">{[{ label: "Website", val: website }, { label: "App", val: app }, { label: "Manual", val: manual }].map((x) => <div key={x.label} className="rounded-2xl bg-slate-100 p-5"><b>{x.label}</b><div className="mt-3 h-3 rounded-full bg-slate-200"><div className="h-3 rounded-full bg-[#d4af37]" style={{ width: `${Math.min(100, x.val * 25)}%` }} /></div><p className="mt-2 text-2xl font-black">{x.val}</p></div>)}</div></Card></div>; }
  function Reports() { return <div className="space-y-4"><Card><div className="flex flex-wrap justify-between gap-3"><div><h3 className="text-2xl font-black">Reports</h3><p className="text-slate-500">CSV export + MIS summary</p></div><button onClick={exportCSV} className="rounded-2xl bg-[#07162a] px-4 py-2 text-[#d4af37] font-bold">Export CSV</button></div></Card><div className="grid gap-4 md:grid-cols-4"><Stat title="Bookings" value={bookings.length} sub="Total" /><Stat title="Staff" value={staff.length} sub="Workers" /><Stat title="Revenue" value={money(revenue)} sub="Confirmed" /><Stat title="Profit" value={money(profit)} sub="Estimate" /></div></div>; }
  function FirebaseSync() { return <div className="grid gap-4 xl:grid-cols-2"><Card><h3 className="text-2xl font-black">Firebase Sync</h3><p className="mt-2 text-slate-500">Preview-safe structure. Real Firebase connect later.</p><button onClick={simulateWebsiteBooking} className="mt-5 rounded-2xl bg-[#07162a] px-5 py-3 font-black text-[#d4af37]">Simulate Website Booking</button></Card><Card><h3 className="text-2xl font-black">Safe Schema</h3>{["id", "customer", "phone", "service", "servicesList", "amount", "date", "supervisor", "confirmed", "payment", "lead"].map((f) => <div key={f} className="mb-2 rounded-xl bg-slate-100 p-2 font-bold">{f}</div>)}</Card></div>; }
  function Settings() { return <Card><h3 className="text-2xl font-black">Settings</h3><div className="mt-4 grid gap-3 md:grid-cols-2"><input readOnly value="FreshNest Cleaning Services" className="rounded-2xl border p-3" /><input readOnly value="Trichy" className="rounded-2xl border p-3" /><input readOnly value="Owners: Neethirajan & Selva Kumar" className="rounded-2xl border p-3 md:col-span-2" /></div></Card>; }

  function AddBookingModal({ onClose, onSave }) {
    const [form, setForm] = useState({ customer: "", phone: "", area: "Trichy", address: "", date: new Date().toISOString().slice(0, 10), time: "10:00 AM", supervisor: "Unassigned", lead: "Manual Lead", notes: "", servicesList: [{ id: 1, service: services[0].name, qty: 1, amount: services[0].rate }] });
    const updateRow = (id, key, value) => setForm((old) => ({ ...old, servicesList: old.servicesList.map((r) => r.id === id ? { ...r, [key]: value } : r) }));
    const rowAmount = (row) => { const found = services.find((s) => s.name === row.service) || services[0]; return found.name === "Balance Work" ? Number(row.amount || 0) : Number(row.qty || 1) * Number(found.rate || 0); };
    const rows = form.servicesList.map((r) => ({ ...r, amount: rowAmount(r) }));
    const total = rows.reduce((s, r) => s + Number(r.amount || 0), 0);
    return <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"><div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl"><div className="flex justify-between"><h3 className="text-2xl font-black">Add Booking</h3><button onClick={onClose}>✕</button></div><div className="mt-4 grid gap-4 md:grid-cols-2"><Field label="Customer" value={form.customer} onChange={(v) => setForm({ ...form, customer: v })} /><Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v.replace(/[^0-9]/g, "") })} /><Field label="Area" value={form.area} onChange={(v) => setForm({ ...form, area: v })} /><Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} /><label className="grid gap-1 text-sm font-bold">Supervisor<select value={form.supervisor} onChange={(e) => setForm({ ...form, supervisor: e.target.value })} className="rounded-2xl border p-2"><option>Unassigned</option>{staff.map((s) => <option key={s.id}>{s.name}</option>)}</select></label><label className="grid gap-1 text-sm font-bold">Lead<select value={form.lead} onChange={(e) => setForm({ ...form, lead: e.target.value })} className="rounded-2xl border p-2"><option>Manual Lead</option><option>Website Lead</option><option>App Lead</option></select></label><Field label="Date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} /><Field label="Time" value={form.time} onChange={(v) => setForm({ ...form, time: v })} /></div><Card className="mt-5 bg-slate-50"><div className="flex justify-between"><h4 className="font-black">Services</h4><button onClick={() => setForm((old) => ({ ...old, servicesList: [...old.servicesList, { id: Date.now(), service: services[0].name, qty: 1, amount: services[0].rate }] }))} className="rounded-xl bg-[#07162a] px-3 py-2 text-[#d4af37] font-bold">+ Add</button></div>{form.servicesList.map((r) => <div key={r.id} className="mt-3 grid gap-2 md:grid-cols-[1fr_.5fr_.6fr_auto]"><select value={r.service} onChange={(e) => updateRow(r.id, "service", e.target.value)} className="rounded-2xl border p-2">{services.map((s) => <option key={s.name}>{s.name}</option>)}</select><input type="number" value={r.qty} onChange={(e) => updateRow(r.id, "qty", e.target.value)} className="rounded-2xl border p-2" /><input type="number" value={r.amount} onChange={(e) => updateRow(r.id, "amount", e.target.value)} className="rounded-2xl border p-2" /><button onClick={() => setForm((old) => ({ ...old, servicesList: old.servicesList.length === 1 ? old.servicesList : old.servicesList.filter((x) => x.id !== r.id) }))} className="rounded-2xl border p-2 text-red-600">Remove</button></div>)}</Card><div className="mt-5 rounded-3xl bg-slate-100 p-4"><p>Total Amount</p><h3 className="text-3xl font-black">{money(total)}</h3></div><div className="mt-5 grid gap-3 md:grid-cols-2"><button onClick={onClose} className="rounded-2xl border p-3 font-bold">Cancel</button><button onClick={() => onSave({ ...form, servicesList: rows })} className="rounded-2xl bg-[#07162a] p-3 font-black text-[#d4af37]">Save Booking</button></div></div></div>;
  }

  function BookingDrawer({ booking, onClose }) {
    const [draft, setDraft] = useState(booking.servicesList || []);
    const total = draft.reduce((s, i) => s + Number(i.amount || 0), 0);
    return <div className="fixed inset-0 z-50 flex justify-end bg-black/50 p-3"><div className="h-full w-full max-w-xl overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl"><div className="sticky top-0 mb-4 flex justify-between bg-white pb-3"><div><h3 className="text-2xl font-black">{booking.customer}</h3><p className="text-sm text-slate-500">{booking.id} • {booking.service}</p></div><button onClick={onClose}>✕</button></div><div className="grid gap-4"><Card><h4 className="font-black">Customer</h4><p>{booking.phone}</p><p>{booking.address}</p><div className="mt-3 grid gap-2 md:grid-cols-2"><button onClick={() => setToast(`Call ${booking.phone}`)} className="rounded-2xl bg-emerald-600 p-3 font-bold text-white">Call</button><button onClick={() => setToast(`WhatsApp confirm sent to ${booking.customer}`)} className="rounded-2xl bg-[#07162a] p-3 font-bold text-[#d4af37]">WhatsApp</button></div></Card><Card><div className="flex justify-between"><h4 className="font-black">Service Edit Before Confirm</h4><button onClick={() => setDraft((p) => [...p, { service: "Balance Work", qty: 1, amount: 0 }])} className="rounded-xl bg-[#07162a] px-3 py-2 text-[#d4af37] font-bold">+ Extra</button></div>{draft.map((r, i) => <div key={i} className="mt-3 grid gap-2 md:grid-cols-[1fr_.5fr_.6fr_auto]"><input value={r.service} onChange={(e) => setDraft((p) => p.map((x, idx) => idx === i ? { ...x, service: e.target.value } : x))} className="rounded-2xl border p-2" /><input type="number" value={r.qty} onChange={(e) => setDraft((p) => p.map((x, idx) => idx === i ? { ...x, qty: e.target.value } : x))} className="rounded-2xl border p-2" /><input type="number" value={r.amount} onChange={(e) => setDraft((p) => p.map((x, idx) => idx === i ? { ...x, amount: e.target.value } : x))} className="rounded-2xl border p-2" /><button onClick={() => setDraft((p) => p.length === 1 ? p : p.filter((_, idx) => idx !== i))} className="rounded-2xl border p-2 text-red-600">Remove</button></div>)}<div className="mt-3 rounded-2xl bg-emerald-100 p-3 font-black text-emerald-700">Updated Total {money(total)}</div><button onClick={() => updateBooking(booking.id, { servicesList: draft, service: draft.map((x) => x.service).join(" + "), amount: total })} className="mt-3 w-full rounded-2xl bg-[#07162a] p-3 font-black text-[#d4af37]">Save Changes</button></Card><Card><h4 className="mb-3 font-black">Confirm / Assign / Reschedule</h4><div className="grid gap-3 md:grid-cols-2"><button onClick={() => updateBooking(booking.id, { confirmed: true, status: "Confirmed", servicesList: draft, amount: total })} className="rounded-2xl bg-emerald-600 p-3 font-bold text-white">Confirm Booking</button><button onClick={() => updateBooking(booking.id, { confirmed: false, status: "Cancelled" })} className="rounded-2xl bg-red-600 p-3 font-bold text-white">Cancel</button><select value={booking.supervisor} onChange={(e) => updateBooking(booking.id, { supervisor: e.target.value })} className="rounded-2xl border p-3"><option>Unassigned</option>{staff.map((s) => <option key={s.id}>{s.name}</option>)}</select><input type="date" value={booking.date} onChange={(e) => updateBooking(booking.id, { date: e.target.value })} className="rounded-2xl border p-3" /></div></Card><Card><h4 className="mb-3 font-black">Work + KM</h4><div className="grid gap-2 md:grid-cols-2">{["Pending", "On The Way", "Work Started", "Completed"].map((s) => <button key={s} onClick={() => updateBooking(booking.id, { status: s, confirmed: s !== "Pending" })} className="rounded-2xl bg-slate-100 p-3 font-bold">{s}</button>)}<Field label="Start KM" value={booking.startKm} onChange={(v) => updateBooking(booking.id, { startKm: v })} /><Field label="Site KM" value={booking.siteKm} onChange={(v) => updateBooking(booking.id, { siteKm: v })} /><Field label="Return KM" value={booking.returnKm} onChange={(v) => updateBooking(booking.id, { returnKm: v })} /><label className="grid gap-1 text-sm font-bold">Payment<select value={booking.payment} onChange={(e) => updateBooking(booking.id, { payment: e.target.value })} className="rounded-2xl border p-2"><option>Pending</option><option>Advance Paid</option><option>Paid</option></select></label></div></Card></div></div></div>;
  }

  function Screen() {
    const screens = { Dashboard, Bookings, Supervisor, Calendar, CRM, "Customer History": CustomerHistory, Marketing, Services, Staff, Attendance, Payroll, Inventory, Expenses, Payments, Reminders, Invoices, Complaints, "Profit Analysis": ProfitAnalysis, Reports, "Firebase Sync": FirebaseSync, Settings };
    const Comp = screens[active] || Dashboard;
    return <Comp />;
  }

  if (!loggedIn) return <Login />;
  return <Layout><Screen /></Layout>;
}
