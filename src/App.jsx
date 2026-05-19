import React, { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Phone,
  Clock3,
  Camera,
  Home,
  ClipboardList,
  UserRound,
  Plus,
  CheckCircle2,
  IndianRupee,
  ArrowLeft,
  Navigation,
  ShieldCheck,
  Trash2,
  AlertTriangle,
  Send,
} from "lucide-react";
import { motion } from "framer-motion";

const SERVICE_PHOTOS = {
  "Deep Home Cleaning": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
  "Sofa Shampooing": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
  "Mattress Shampooing": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  "Carpet Shampooing": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
};

const EXTRA_WORKS = [
  { name: "Sofa Shampooing", amount: 550, unit: "/ seat", inputLabel: "Seats" },
  { name: "Bed Shampooing - Single", amount: 950, unit: "/ unit", inputLabel: "Units" },
  { name: "Bed Shampooing - Double", amount: 1100, unit: "/ unit", inputLabel: "Units" },
  { name: "Bed Shampooing - King / Queen", amount: 1200, unit: "/ unit", inputLabel: "Units" },
  { name: "Carpet Shampooing", amount: 30, unit: "/ sq.ft", inputLabel: "Sq.ft" },
  { name: "Refrigerator Interior Cleaning", amount: 850, unit: "/ unit", inputLabel: "Units" },
  { name: "AC Filter Cleaning", amount: 350, unit: "/ unit", inputLabel: "Units" },
  { name: "Water Tank Cleaning", amount: 2, unit: "/ litre", inputLabel: "Litres" },
  { name: "Loft Interior Cleaning", amount: 300, unit: "/ room", inputLabel: "Rooms" },
  { name: "Exterior Pressure Washing", amount: 4, unit: "/ sq.ft", inputLabel: "Sq.ft" },
  { name: "Termite Control Treatment", amount: 14, unit: "/ sq.ft", inputLabel: "Sq.ft" },
  { name: "Deep Clean - Furnished", amount: 8.5, unit: "/ sq.ft", inputLabel: "Sq.ft" },
  { name: "Deep Clean - Unfurnished", amount: 7.5, unit: "/ sq.ft", inputLabel: "Sq.ft" },
  { name: "General Pest Control", amount: 3000, unit: "starting", inputLabel: "Units" },
];

const MACHINE_ITEMS = [
  "Vacuum machine",
  "Shampoo machine",
  "Brush set",
  "Chemical can",
  "Extension box",
  "Microfiber cloth",
];

const DEFAULT_STAFF = ["Selva", "Ravi", "Manoj", "Amit"];

const TODAY_JOBS = [
  {
    id: "FN-1001",
    customer: "Arun Kumar",
    phone: "9876543210",
    address: "Thillai Nagar, Trichy",
    service: "Deep Home Cleaning",
    icon: "🏠",
    amount: 4500,
    time: "10:30 AM",
    status: "Assigned",
  },
  {
    id: "FN-1002",
    customer: "Lakshmi",
    phone: "9000011111",
    address: "Woraiyur, Trichy",
    service: "Sofa Shampooing",
    icon: "🛋️",
    amount: 2200,
    time: "12:00 PM",
    status: "Assigned",
  },
  {
    id: "FN-1003",
    customer: "Vignesh",
    phone: "9888812345",
    address: "Srirangam, Trichy",
    service: "Carpet Shampooing",
    icon: "🧼",
    amount: 1800,
    time: "03:00 PM",
    status: "Pending",
  },
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function money(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function getNowTime() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function displayTime(value) {
  if (!value) return "";
  const [h, m] = value.split(":");
  const d = new Date();
  d.setHours(Number(h || 0), Number(m || 0));
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function Card({ children, className = "" }) {
  return <div className={cn("rounded-[1.75rem] border border-white/60 bg-white p-4 shadow-xl shadow-slate-200/70", className)}>{children}</div>;
}

function TextInput({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <label className="block rounded-3xl border border-slate-100 bg-slate-50 p-4">
      <span className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      <input
        inputMode={type === "number" ? "numeric" : undefined}
        type={type === "number" ? "text" : type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value.replace(type === "number" ? /[^0-9.]/g : /$^/g, ""))}
        placeholder={placeholder}
        className="mt-1 w-full bg-transparent text-lg font-black text-slate-900 outline-none placeholder:text-slate-300"
      />
    </label>
  );
}

function Pill({ children, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl px-4 py-3 text-sm font-black transition active:scale-95",
        active ? "bg-[#07162a] text-[#d4af37] shadow-lg" : "bg-slate-100 text-slate-600"
      )}
    >
      {children}
    </button>
  );
}

function BottomNav({ tab, setTab }) {
  const tabs = [
    ["Home", Home],
    ["Jobs", ClipboardList],
    ["Profile", UserRound],
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/60 bg-white/90 p-3 backdrop-blur-xl">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        {tabs.map(([name, Icon]) => (
          <button
            key={name}
            onClick={() => setTab(name)}
            className={cn(
              "rounded-3xl px-3 py-3 text-xs font-black transition active:scale-95",
              tab === name ? "bg-[#07162a] text-[#d4af37] shadow-lg" : "bg-slate-100 text-slate-500"
            )}
          >
            <Icon className="mx-auto mb-1" size={18} />
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

function SwipeButton({ children, onClick, disabled = false, green = false }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "mt-4 w-full rounded-full px-5 py-4 text-center text-base font-black shadow-xl transition active:scale-[0.98]",
        disabled ? "bg-slate-300 text-slate-500" : green ? "bg-emerald-600 text-white" : "bg-[#07162a] text-[#d4af37]"
      )}
    >
      {children}
    </button>
  );
}

function UploadBox({ label, value, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-4">
      <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", value ? "bg-emerald-100 text-emerald-700" : "bg-white text-slate-500")}>
        {value ? <CheckCircle2 size={22} /> : <Camera size={22} />}
      </div>
      <div className="flex-1">
        <p className="font-black text-slate-900">{label}</p>
        <p className="text-xs font-bold text-slate-500">{value ? value : "Tap to upload proof"}</p>
      </div>
      <input className="hidden" type="file" accept="image/*" onChange={(e) => onChange(e.target.files?.[0]?.name || "Uploaded photo")} />
    </label>
  );
}

function ServiceImage({ job }) {
  return (
    <div className="relative h-40 overflow-hidden rounded-[1.75rem] bg-slate-200 shadow-xl">
      <img src={SERVICE_PHOTOS[job.service] || SERVICE_PHOTOS["Deep Home Cleaning"]} alt={job.service} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
        <div>
          <p className="text-3xl">{job.icon}</p>
          <h2 className="text-2xl font-black">{job.service}</h2>
        </div>
        <div className="rounded-2xl bg-white/95 px-3 py-2 text-sm font-black text-slate-900">{money(job.amount)}</div>
      </div>
    </div>
  );
}

export default function FreshNestSupervisorPremiumApp() {
  const [tab, setTab] = useState("Home");
  const [selectedJob, setSelectedJob] = useState(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({});
  const [query, setQuery] = useState("");
  const [staffList, setStaffList] = useState(DEFAULT_STAFF);
  const [newStaff, setNewStaff] = useState("");
  const [customExtra, setCustomExtra] = useState({ name: "", rate: "", qty: "" });
  const [completedJobs, setCompletedJobs] = useState([]);
  const [adminUpdates, setAdminUpdates] = useState([]);
  const [jobStatusMap, setJobStatusMap] = useState({});
  const [kmRate, setKmRate] = useState("10");

  const jobs = useMemo(() => {
    return TODAY_JOBS.map((job) => ({ ...job, status: jobStatusMap[job.id] || job.status })).filter((j) =>
      `${j.customer} ${j.service} ${j.id} ${j.address}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, jobStatusMap]);

  const baseAmount = Number(form.baseAmount || selectedJob?.amount || 0);
  const extraTotal = (form.extraWorks || []).reduce((sum, work) => sum + Number(work.amount || 0) * Number(work.qty || 0), 0);
  const totalAmount = baseAmount + extraTotal;
  const collected = completedJobs.reduce((sum, job) => sum + Number(job.total || 0), 0);
  const dailyKm = useMemo(() => {
    return completedJobs.reduce((sum, item) => sum + Number(item.totalKm || 0), 0);
  }, [completedJobs]);
  const dailyKmExpense = dailyKm * Number(kmRate || 0);

  function openJob(job) {
    setSelectedJob(job);
    setStep(0);
    setForm({
      jobId: job.id,
      baseAmount: job.amount,
      selectedStaff: [],
      extraWorks: [],
      machines: {},
      status: job.status || "Assigned",
      issueText: "",
      paymentMode: "",
    });
  }

  function pushAdminUpdate(job, status, note = "") {
    const updateItem = {
      id: Date.now() + Math.random(),
      jobId: job.id,
      customer: job.customer,
      phone: job.phone,
      service: job.service,
      status,
      note,
      time: getNowTime(),
      total: totalAmount,
    };
    setAdminUpdates((old) => [updateItem, ...old]);
    setJobStatusMap((old) => ({ ...old, [job.id]: status }));
    setSelectedJob((old) => (old ? { ...old, status } : old));
    setForm((old) => ({ ...old, status }));
  }

  function update(key, value) {
    setForm((old) => ({ ...old, [key]: value }));
  }

  function next() {
    setStep((old) => Math.min(old + 1, 9));
  }

  function back() {
    setStep((old) => Math.max(old - 1, 0));
  }

  function toggleStaff(name) {
    setForm((old) => {
      const selected = old.selectedStaff || [];
      return {
        ...old,
        selectedStaff: selected.includes(name) ? selected.filter((x) => x !== name) : [...selected, name],
      };
    });
  }

  function toggleMachine(name) {
    setForm((old) => ({
      ...old,
      machines: { ...(old.machines || {}), [name]: !old.machines?.[name] },
    }));
  }

  function addExtra(work) {
    setForm((old) => {
      const existing = (old.extraWorks || []).find((item) => item.name === work.name);
      if (existing) {
        return {
          ...old,
          extraWorks: (old.extraWorks || []).map((item) =>
            item.name === work.name ? { ...item, qty: Number(item.qty || 1) + 1 } : item
          ),
        };
      }
      return {
        ...old,
        extraWorks: [...(old.extraWorks || []), { ...work, qty: 1, lineId: Date.now() + Math.random() }],
      };
    });
  }

  function updateExtraQty(lineId, qty) {
    const safeQty = Math.max(0, Number(qty || 0));
    setForm((old) => ({
      ...old,
      extraWorks: (old.extraWorks || []).map((item) =>
        item.lineId === lineId ? { ...item, qty: safeQty } : item
      ),
    }));
  }

  function removeExtra(lineId) {
    setForm((old) => ({ ...old, extraWorks: (old.extraWorks || []).filter((w) => w.lineId !== lineId) }));
  }

  function addCustomExtra() {
    const name = customExtra.name.trim();
    const rate = Number(customExtra.rate || 0);
    const qty = Number(customExtra.qty || 0);
    if (!name || !rate || !qty) return;
    setForm((old) => ({
      ...old,
      extraWorks: [
        ...(old.extraWorks || []),
        { name, amount: rate, unit: "/ custom", inputLabel: "Qty", qty, lineId: Date.now() + Math.random() },
      ],
    }));
    setCustomExtra({ name: "", rate: "", qty: "" });
  }

  function addStaffName() {
    const name = newStaff.trim();
    if (!name) return;
    setStaffList((old) => (old.includes(name) ? old : [...old, name]));
    setNewStaff("");
  }

  function finishJob() {
    const startKm = Number(form.vehicleKm || 0);
    const endKm = Number(form.returnKm || form.staffDropKm || 0);
    const totalKm = Math.max(0, endKm - startKm);
    const expense = totalKm * Number(kmRate || 0);
    pushAdminUpdate(selectedJob, "Completed", `Payment: ${form.paymentMode} | Total: ${money(totalAmount)} | KM: ${totalKm} | Expense: ${money(expense)}`);
    setCompletedJobs((old) => [...old, { id: selectedJob.id, customer: selectedJob.customer, total: totalAmount, totalKm, expense }]);
    setSelectedJob(null);
    setTab("Home");
  }

  const canNext = {
    0: !!form.startKm,
    1: (form.selectedStaff || []).length > 0 && !!form.pickupKm && !!form.pickupTime,
    2: !!form.siteKm && !!form.siteTime && !!form.siteSelfie && !!form.machinePhoto,
    3: true,
    4: true,
    5: !!form.finishPhoto,
    6: !!form.paymentMode,
    7: MACHINE_ITEMS.every((item) => form.machines?.[item]),
    8: !!form.siteLeaveKm,
    9: !!form.staffDropKm && !!form.staffDropTime,
  };

  function HomeScreen() {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f7d774,transparent_28%),linear-gradient(135deg,#f8fafc,#dbeafe,#07162a)] p-4 pb-28">
        <div className="mx-auto max-w-md space-y-4">
          <Card className="relative overflow-hidden border-0 bg-white/95 shadow-2xl">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#d4af37]/30" />
            <div className="relative flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black text-blue-700">FreshNest Supervisor</p>
                <h1 className="mt-1 text-4xl font-black leading-tight text-slate-950">Today's Assignments</h1>
                <p className="mt-2 text-sm font-bold text-slate-500">Premium field control app</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#07162a] text-3xl shadow-xl">🧹</div>
            </div>
            <div className="relative mt-5 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-3xl bg-blue-50 p-3"><b className="text-2xl">{TODAY_JOBS.length}</b><p className="text-xs font-bold text-slate-500">Works</p></div>
              <div className="rounded-3xl bg-emerald-50 p-3"><b className="text-2xl">{money(collected)}</b><p className="text-xs font-bold text-slate-500">Collected</p></div>
              <div className="rounded-3xl bg-amber-50 p-3"><b className="text-2xl">{Math.max(0, TODAY_JOBS.length - completedJobs.length)}</b><p className="text-xs font-bold text-slate-500">Pending</p></div>
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-950">Daily KM Expense</h3>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">Auto</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-3xl bg-slate-50 p-3"><b className="text-xl">{dailyKm}</b><p className="text-xs font-bold text-slate-500">Total KM</p></div>
              <div className="rounded-3xl bg-slate-50 p-3"><b className="text-xl">₹{kmRate}</b><p className="text-xs font-bold text-slate-500">Per KM</p></div>
              <div className="rounded-3xl bg-slate-50 p-3"><b className="text-xl">{money(dailyKmExpense)}</b><p className="text-xs font-bold text-slate-500">Expense</p></div>
            </div>
            <div className="mt-3 rounded-2xl bg-slate-50 p-3">
              <p className="mb-1 text-xs font-black uppercase tracking-wide text-slate-400">KM Rate</p>
              <input inputMode="decimal" value={kmRate} onChange={(e) => setKmRate(e.target.value.replace(/[^0-9.]/g, ""))} className="w-full bg-transparent text-lg font-black outline-none" placeholder="Ex: 10" />
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-950">Admin Dashboard Updates</h3>
              <span className="rounded-full bg-[#07162a] px-3 py-1 text-xs font-black text-[#d4af37]">Live</span>
            </div>
            {adminUpdates.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-500">No updates yet.</p>
            ) : (
              <div className="space-y-2">
                {adminUpdates.slice(0, 5).map((item) => (
                  <div key={item.id} className="rounded-2xl bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <b className="text-sm">{item.jobId} - {item.customer}</b>
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-black text-blue-700">{item.status}</span>
                    </div>
                    <p className="mt-1 text-xs font-bold text-slate-500">{item.time} • {item.service}</p>
                    {item.note && <p className="mt-1 text-xs font-bold text-slate-700">{item.note}</p>}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <button onClick={() => setTab("Jobs")} className="w-full rounded-[1.75rem] bg-[#07162a] p-5 text-left text-[#d4af37] shadow-2xl active:scale-[0.98]">
            <p className="text-sm font-black text-white/70">Start field work</p>
            <h2 className="mt-1 text-2xl font-black">Open Jobs →</h2>
          </button>

          <Card>
            <h3 className="text-lg font-black text-slate-950">Field Guidelines</h3>
            <div className="mt-3 grid gap-2 text-sm font-semibold text-slate-700">
              <p className="rounded-2xl bg-amber-50 p-3">💡 Site reach selfie + machine proof compulsory.</p>
              <p className="rounded-2xl bg-blue-50 p-3">💡 Additional work add pannina total amount auto update aagum.</p>
              <p className="rounded-2xl bg-emerald-50 p-3">💡 Payment mode select pannama job close panna mudiyathu.</p>
            </div>
          </Card>
        </div>
        <BottomNav tab={tab} setTab={setTab} />
      </div>
    );
  }

  function JobsScreen() {
    return (
      <div className="min-h-screen bg-slate-100 p-4 pb-28">
        <div className="mx-auto max-w-md space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-4 text-slate-400" size={18} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search work, customer, area..." className="w-full rounded-3xl border-0 bg-white py-4 pl-11 pr-4 font-bold shadow-xl outline-none" />
          </div>
          {jobs.map((job) => (
            <button key={job.id} onClick={() => openJob(job)} className="w-full text-left">
              <Card className="overflow-hidden border-0 p-0 shadow-2xl transition active:scale-[0.99]">
                <div className="relative h-44">
                  <img src={SERVICE_PHOTOS[job.service] || SERVICE_PHOTOS["Deep Home Cleaning"]} className="h-full w-full object-cover" alt={job.service} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-black text-blue-700">{job.status}</div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-black">{job.customer}</h3>
                    <p className="text-sm font-semibold text-white/85">{job.icon} {job.service}</p>
                    <p className="mt-1 inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-black text-slate-900">{job.status}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-500">
                    <p className="rounded-2xl bg-slate-50 p-3"><Clock3 size={13} className="inline" /> {job.time}</p>
                    <p className="rounded-2xl bg-slate-50 p-3"><Phone size={13} className="inline" /> {job.phone}</p>
                  </div>
                  <p className="mt-2 truncate rounded-2xl bg-slate-50 p-3 text-xs font-bold text-slate-500"><MapPin size={13} className="inline" /> {job.address}</p>
                </div>
              </Card>
            </button>
          ))}
        </div>
        <BottomNav tab={tab} setTab={setTab} />
      </div>
    );
  }

  function ProfileScreen() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 p-4 pb-28">
        <div className="mx-auto max-w-md space-y-4">
          <Card className="border-0 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#07162a] text-3xl text-[#d4af37]">👨‍💼</div>
              <div>
                <h1 className="text-2xl font-black">Selva Supervisor</h1>
                <p className="font-semibold text-slate-500">FreshNest Field Lead</p>
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-black">Add Staff</h3>
            <div className="mt-3 flex gap-2">
              <input value={newStaff} onChange={(e) => setNewStaff(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addStaffName(); }} placeholder="Staff name" className="min-w-0 flex-1 rounded-2xl bg-slate-100 px-4 py-3 font-bold outline-none" />
              <button type="button" onClick={addStaffName} className="rounded-2xl bg-[#07162a] px-5 py-3 font-black text-[#d4af37]">Add</button>
            </div>
            <div className="mt-4 space-y-2">{staffList.map((staff, index) => <div key={`${staff}-${index}`} className="rounded-2xl bg-slate-50 p-3 font-bold">👷 {staff}</div>)}</div>
          </Card>
        </div>
        <BottomNav tab={tab} setTab={setTab} />
      </div>
    );
  }

  if (!selectedJob) {
    if (tab === "Jobs") return <JobsScreen />;
    if (tab === "Profile") return <ProfileScreen />;
    return <HomeScreen />;
  }

  const StepHeader = ({ title, sub }) => (
    <div className="mb-4 rounded-[1.5rem] bg-[#07162a] p-4 text-white">
      <p className="text-xs font-black text-[#d4af37]">Step {step + 1} / 10</p>
      <h3 className="mt-1 text-xl font-black">{title}</h3>
      <p className="mt-1 text-xs font-bold text-white/65">{sub}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 p-3 pb-6">
      <div className="mx-auto max-w-md">
        <div className="mb-3 flex items-center justify-between rounded-3xl bg-white p-4 shadow-xl">
          <button onClick={() => setSelectedJob(null)} className="rounded-2xl bg-slate-100 p-3"><ArrowLeft size={18} /></button>
          <div className="text-center">
            <h2 className="text-2xl font-black">{selectedJob.id}</h2>
            <p className="text-xs font-bold text-slate-500">{form.status || selectedJob.status || "Assigned"}</p>
          </div>
          <div className="text-right">
            <div className="rounded-2xl bg-amber-50 px-3 py-2 text-sm font-black text-amber-700">{money(totalAmount)}</div>
            <p className="mt-1 rounded-full bg-blue-50 px-2 py-1 text-[10px] font-black text-blue-700">{form.status || selectedJob.status}</p>
          </div>
        </div>

        <ServiceImage job={selectedJob} />

        {step < 3 && (
          <Card className="mt-4 border-0 bg-white shadow-xl">
            <p className="mb-3 text-sm font-black text-slate-600">Today Work Status Update</p>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => { update("status", "On the Way"); pushAdminUpdate(selectedJob, "On the Way", "Supervisor started to customer location"); }} className="rounded-2xl bg-blue-50 p-3 text-sm font-black text-blue-700"><Navigation size={16} className="inline" /> On the Way</button>
              <button type="button" onClick={() => { update("status", "Customer Delay"); pushAdminUpdate(selectedJob, "Customer Delay", "Customer delayed / waiting at site"); }} className="rounded-2xl bg-amber-50 p-3 text-sm font-black text-amber-700"><Clock3 size={16} className="inline" /> Delay</button>
              <button type="button" onClick={() => { update("status", "Work Started"); pushAdminUpdate(selectedJob, "Work Started", "Work started at site"); if (step < 3) setStep(3); }} className="rounded-2xl bg-emerald-50 p-3 text-sm font-black text-emerald-700"><Send size={16} className="inline" /> Work Start</button>
              <button type="button" onClick={() => { update("status", "Issue"); pushAdminUpdate(selectedJob, "Issue", form.issueText || "Supervisor reported an issue"); }} className="rounded-2xl bg-red-50 p-3 text-sm font-black text-red-700"><AlertTriangle size={16} className="inline" /> Issue</button>
            </div>
            <input
              value={form.issueText || ""}
              onChange={(e) => update("issueText", e.target.value)}
              placeholder="Type issue note..."
              className="mt-3 w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold outline-none"
            />
            <p className="mt-2 text-xs font-bold text-slate-400">Status controls hide after work starts.</p>
          </Card>
        )}

        <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          <Card>
            {step === 0 && (
              <>
                <StepHeader title="Customer Details" sub="Enter starting vehicle KM before pickup." />
                <div className="space-y-3">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <h3 className="text-xl font-black">{selectedJob.customer}</h3>
                    <a href={`tel:${selectedJob.phone}`} className="mt-1 block text-sm font-bold text-blue-700 active:scale-[0.98]"><Phone size={14} className="inline" /> {selectedJob.phone} - Touch to Call</a>
                    <p className="mt-1 text-sm font-bold text-slate-500"><MapPin size={14} className="inline" /> {selectedJob.address}</p>
                  </div>
                  <TextInput label="Start KM" value={form.vehicleKm} onChange={(v) => update("vehicleKm", v)} placeholder="Example: 15240" type="number" />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <StepHeader title="Staff Pickup" sub="Staff select pannitu pickup KM/time enter pannunga." />
                <p className="mb-2 text-sm font-black text-slate-600">Select Staff</p>
                <div className="mb-4 flex flex-wrap gap-2">{staffList.map((staff) => <Pill key={staff} active={(form.selectedStaff || []).includes(staff)} onClick={() => toggleStaff(staff)}>{staff}</Pill>)}</div>
                <div className="grid gap-3">
                  <TextInput label="Pickup KM" value={form.pickupKm} onChange={(v) => update("pickupKm", v)} type="number" />
                  <TextInput label="Pickup Time" value={form.pickupTime} onChange={(v) => update("pickupTime", v)} type="time" />
                  <button type="button" onClick={() => update("pickupTime", getNowTime())} className="rounded-2xl bg-blue-50 p-3 text-sm font-black text-blue-700">Use Current Time {form.pickupTime ? `• ${displayTime(form.pickupTime)}` : ""}</button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <StepHeader title="Site Reached" sub="Site KM/time + staff selfie + machine photo upload pannunga." />
                <div className="grid gap-3">
                  <TextInput label="Site Reach KM" value={form.siteKm} onChange={(v) => update("siteKm", v)} type="number" />
                  <TextInput label="Site Reach Time" value={form.siteTime} onChange={(v) => update("siteTime", v)} type="time" />
                  <button type="button" onClick={() => update("siteTime", getNowTime())} className="rounded-2xl bg-blue-50 p-3 text-sm font-black text-blue-700">Use Current Time {form.siteTime ? `• ${displayTime(form.siteTime)}` : ""}</button>
                  <UploadBox label="Staff / Supervisor Selfie" value={form.siteSelfie} onChange={(v) => update("siteSelfie", v)} />
                  <UploadBox label="Machine Proof Photo" value={form.machinePhoto} onChange={(v) => update("machinePhoto", v)} />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <StepHeader title="Work Start" sub="Customer permission confirm pannitu work start pannunga." />
                <div className="rounded-3xl bg-emerald-50 p-5 text-center">
                  <ShieldCheck className="mx-auto text-emerald-600" size={44} />
                  <h3 className="mt-2 text-2xl font-black text-emerald-800">Ready to Start</h3>
                  <p className="mt-1 text-sm font-bold text-emerald-700">All initial proof collected.</p>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <StepHeader title="Booked + Additional Work" sub="Extra work add pannina total amount auto increase aagum." />
                <div className="mb-4 rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs font-black text-slate-500">Booked Work</p>
                  <div className="mt-1 flex items-center justify-between">
                    <h3 className="font-black">{selectedJob.service}</h3>
                    <b>{money(baseAmount)}</b>
                  </div>
                </div>
                <div className="grid gap-2">
                  {EXTRA_WORKS.map((work) => (
                    <button type="button" key={work.name} onClick={() => addExtra(work)} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-left active:scale-[0.99]">
                      <div>
                        <p className="font-black">{work.name}</p>
                        <p className="text-xs font-bold text-slate-500">{money(work.amount)} {work.unit}</p>
                      </div>
                      <Plus className="text-blue-700" />
                    </button>
                  ))}
                </div>

                <div className="mt-4 rounded-3xl bg-amber-50 p-3">
                  <p className="mb-2 text-sm font-black text-amber-900">Manual Additional Work</p>
                  <div className="grid gap-2">
                    <input value={customExtra.name} onChange={(e) => setCustomExtra({ ...customExtra, name: e.target.value })} placeholder="Work name ex: Balcony cleaning" className="rounded-2xl bg-white px-4 py-3 text-sm font-black outline-none" />
                    <div className="grid grid-cols-2 gap-2">
                      <input inputMode="decimal" value={customExtra.rate} onChange={(e) => setCustomExtra({ ...customExtra, rate: e.target.value.replace(/[^0-9.]/g, "") })} placeholder="Rate ex: 8.5" className="rounded-2xl bg-white px-4 py-3 text-sm font-black outline-none" />
                      <input inputMode="decimal" value={customExtra.qty} onChange={(e) => setCustomExtra({ ...customExtra, qty: e.target.value.replace(/[^0-9.]/g, "") })} placeholder="Qty ex: 1000" className="rounded-2xl bg-white px-4 py-3 text-sm font-black outline-none" />
                    </div>
                    <button type="button" onClick={addCustomExtra} className="rounded-2xl bg-[#07162a] p-3 text-sm font-black text-[#d4af37]">Add Manual: {customExtra.rate && customExtra.qty ? money(Number(customExtra.rate) * Number(customExtra.qty)) : "₹0"}</button>
                  </div>
                </div>
                {(form.extraWorks || []).length > 0 && (
                  <div className="mt-4 rounded-3xl bg-blue-50 p-3">
                    <p className="mb-2 text-sm font-black text-blue-900">Added Extra Works</p>
                    {(form.extraWorks || []).map((work) => (
                      <div key={work.lineId} className="mb-2 rounded-2xl bg-white p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="font-black">{work.name}</p>
                            <p className="text-xs font-bold text-slate-500">{money(work.amount)} {work.unit}</p>
                          </div>
                          <button onClick={() => removeExtra(work.lineId)} className="rounded-xl bg-red-50 p-2 text-red-600"><Trash2 size={16} /></button>
                        </div>
                        <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={work.qty || ""}
                            onChange={(e) => updateExtraQty(work.lineId, e.target.value)}
                            placeholder={work.inputLabel || "Qty"}
                            className="rounded-2xl bg-slate-50 px-4 py-3 font-black outline-none"
                          />
                          <div className="rounded-2xl bg-[#07162a] px-4 py-3 text-sm font-black text-[#d4af37]">
                            {money(Number(work.amount || 0) * Number(work.qty || 0))}
                          </div>
                        </div>
                        <p className="mt-1 text-xs font-bold text-slate-400">
                          {work.inputLabel}: {work.qty || 0} × {money(work.amount)} = {money(Number(work.amount || 0) * Number(work.qty || 0))}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 rounded-3xl bg-[#07162a] p-4 text-white">
                  <p className="text-sm font-bold text-white/60">Final Total</p>
                  <h2 className="text-4xl font-black text-[#d4af37]">{money(totalAmount)}</h2>
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <StepHeader title="Work End Proof" sub="Finish photo upload pannunga." />
                <UploadBox label="Final Work Completed Photo" value={form.finishPhoto} onChange={(v) => update("finishPhoto", v)} />
              </>
            )}

            {step === 6 && (
              <>
                <StepHeader title="Payment" sub="Hand Cash / UPI select pannunga." />
                <div className="rounded-3xl bg-[#07162a] p-5 text-center text-white">
                  <IndianRupee className="mx-auto text-[#d4af37]" size={38} />
                  <p className="mt-2 text-sm font-bold text-white/60">Collect Amount</p>
                  <h2 className="text-5xl font-black text-[#d4af37]">{money(totalAmount)}</h2>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Pill active={form.paymentMode === "Hand Cash"} onClick={() => update("paymentMode", "Hand Cash")}>💵 Hand Cash</Pill>
                  <Pill active={form.paymentMode === "UPI"} onClick={() => update("paymentMode", "UPI")}>📲 UPI</Pill>
                </div>
              </>
            )}

            {step === 7 && (
              <>
                <StepHeader title="Machine Checklist" sub="All machines/things return confirm pannunga." />
                <div className="grid gap-2">{MACHINE_ITEMS.map((item) => <button key={item} onClick={() => toggleMachine(item)} className={cn("flex items-center justify-between rounded-2xl p-4 font-black", form.machines?.[item] ? "bg-emerald-50 text-emerald-800" : "bg-slate-50 text-slate-700")}><span>{item}</span>{form.machines?.[item] && <CheckCircle2 size={20} />}</button>)}</div>
              </>
            )}

            {step === 8 && (
              <>
                <StepHeader title="Staff Drop & Final Summary" sub="Site Leave KM + staff drop KM/time fill pannitu complete pannunga." />
                <div className="grid gap-3">
                  <TextInput label="Return KM" value={form.returnKm} onChange={(v) => update("returnKm", v)} type="number" />
                  <TextInput label="Staff Drop KM" value={form.staffDropKm} onChange={(v) => update("staffDropKm", v)} type="number" />
                  <TextInput label="Staff Drop Time" value={form.staffDropTime} onChange={(v) => update("staffDropTime", v)} type="time" />
                  <button type="button" onClick={() => update("staffDropTime", getNowTime())} className="rounded-2xl bg-blue-50 p-3 text-sm font-black text-blue-700">Use Current Time {form.staffDropTime ? `• ${displayTime(form.staffDropTime)}` : ""}</button>
                </div>
                <div className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm font-bold text-slate-600">
                  <p>Customer: <b className="text-slate-950">{selectedJob.customer}</b></p>
                  <p>Staff: <b className="text-slate-950">{(form.selectedStaff || []).join(", ")}</b></p>
                  <p>Payment: <b className="text-slate-950">{form.paymentMode}</b></p>
                  <p>Total: <b className="text-slate-950">{money(totalAmount)}</b></p>
                </div>
              </>
            )}

            <div className="mt-4 flex gap-3">
              {step > 0 && <button onClick={back} className="rounded-full bg-slate-100 px-5 py-4 font-black text-slate-700">Back</button>}
              {step < 8 ? (
                <SwipeButton disabled={!canNext[step]} onClick={next}>Swipe / Continue →</SwipeButton>
              ) : (
                <SwipeButton disabled={!canNext[step]} green onClick={finishJob}>Work Complete ✅</SwipeButton>
              )}
            </div>
          </Card>
        </motion.div>

        {step < 3 && (
          <button type="button" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedJob.address)}`, "_blank")} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-4 font-black text-blue-700 shadow-xl">
            <Navigation size={18} /> Open Customer Location
          </button>
        )}
      </div>
    </div>
  );
}
