import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const statusBadge = (bookingDate) => {
    if (!bookingDate) return { label: "No date", cls: "bg-slate-100 text-slate-500" };
    const date = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date < today) return { label: "Past", cls: "bg-slate-100 text-slate-500" };
    if (date >= today && date < tomorrow) return { label: "Today", cls: "bg-emerald-100 text-emerald-700" };
    return { label: "Upcoming", cls: "bg-indigo-100 text-indigo-700" };
};

function DoctorDashboard() {
    const { getPatients, user } = useAuthStore();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await getPatients();
                setPatients(data || []);
            } catch {
                toast.error("Failed to load patient data");
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const filtered = patients.filter((p) => {
        const q = search.toLowerCase();
        return p.name?.toLowerCase().includes(q) || p.diseaseName?.toLowerCase().includes(q);
    });

    const statItems = [
        { label: "Total Patients", value: patients.length },
        { label: "Upcoming", value: patients.filter(p => statusBadge(p.bookingDate).label === "Upcoming").length },
        { label: "Today", value: patients.filter(p => statusBadge(p.bookingDate).label === "Today").length },
        { label: "Past", value: patients.filter(p => statusBadge(p.bookingDate).label === "Past").length },
    ];

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-extrabold text-slate-800">
                            Dr. {user?.name?.charAt(0).toUpperCase() + user?.name?.slice(1)}'s Dashboard
                        </h1>
                        <p className="text-slate-500 mt-1">{user?.speciality || "Mental Health Specialist"}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {statItems.map((s, i) => (
                            <div key={i} className="card-premium p-5 text-center">
                                <div className="text-3xl font-extrabold text-indigo-600">{s.value}</div>
                                <div className="text-slate-500 text-sm mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="mb-6 relative max-w-md">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            id="patient-search"
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or condition..."
                            className="input-field pl-10"
                        />
                    </div>

                    {/* Patients */}
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="card-premium p-6 animate-pulse">
                                    <div className="h-4 bg-slate-200 rounded mb-3 w-3/4" />
                                    <div className="h-3 bg-slate-100 rounded mb-2 w-1/2" />
                                    <div className="h-3 bg-slate-100 rounded w-2/3" />
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-600 mb-2">
                                {search ? "No patients match your search" : "No patients booked yet"}
                            </h3>
                            <p className="text-slate-400">
                                {search ? "Try a different search term" : "Patients will appear here once they book an appointment with you"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((patient, i) => {
                                const status = statusBadge(patient.bookingDate);
                                return (
                                    <div key={i} id={`patient-card-${i}`} className="card-premium p-6 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                                                    {patient.name?.[0]?.toUpperCase() || "P"}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-800 capitalize">{patient.name}</h3>
                                                    <p className="text-slate-400 text-xs">{patient.email}</p>
                                                </div>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${status.cls}`}>
                                                {status.label}
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                {patient.mobile || "N/A"}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                                                <span className="font-medium text-slate-700 capitalize">{patient.diseaseName || "Not specified"}</span>
                                            </div>
                                            {patient.symptoms && (
                                                <div className="bg-slate-50 rounded-xl p-3 mt-2">
                                                    <p className="text-xs text-slate-500 font-medium mb-1">Reported symptoms:</p>
                                                    <p className="text-slate-600 text-xs">{patient.symptoms}</p>
                                                </div>
                                            )}
                                            {patient.bookingDate && (
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    {new Date(patient.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}

export default DoctorDashboard;
