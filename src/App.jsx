import React, { useState } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const sampleData = [
  { name: "Jan", revenue: 12000 },
  { name: "Feb", revenue: 18000 },
  { name: "Mar", revenue: 25000 },
];

export default function App() {
  const [bookings, setBookings] = useState([
    { id: "FN-1001", customer: "Arun", service: "Sofa Shampooing", amount: 2200, confirmed: false, supervisor: "Unassigned" },
    { id: "FN-1002", customer: "Priya", service: "Deep Cleaning", amount: 8500, confirmed: true, supervisor: "Selva Kumar" },
  ]);

  const totalRevenue = bookings.filter(b => b.confirmed).reduce((s,b)=>s+b.amount,0);

  function confirmBooking(id) {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, confirmed: true } : b));
  }

  function assignSupervisor(id, supervisor) {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, supervisor } : b));
  }

  function downloadInvoice(booking) {
    const pdf = new jsPDF();
    pdf.text("FreshNest Invoice", 20, 20);
    pdf.text(`Customer: ${booking.customer}`, 20, 40);
    pdf.text(`Service: ${booking.service}`, 20, 50);
    pdf.text(`Amount: Rs.${booking.amount}`, 20, 60);
    pdf.save(`${booking.id}.pdf`);
  }

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>FreshNest ERP Stable Build</h1>
      <h2>Confirmed Revenue: ₹{totalRevenue}</h2>

      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sampleData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {bookings.map((booking) => (
        <motion.div key={booking.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ border: "1px solid #ccc", padding: 16, marginTop: 16 }}>
          <h3>{booking.customer}</h3>
          <p>{booking.service}</p>
          <p>₹{booking.amount}</p>
          <p>Status: {booking.confirmed ? "Confirmed" : "Pending"}</p>
          <p>Supervisor: {booking.supervisor}</p>

          {!booking.confirmed && (
            <button onClick={() => confirmBooking(booking.id)}>Confirm Booking</button>
          )}

          <button onClick={() => assignSupervisor(booking.id, "Selva Kumar")}>Assign Supervisor</button>
          <button onClick={() => downloadInvoice(booking)}>Invoice PDF</button>
        </motion.div>
      ))}
    </div>
  );
}
