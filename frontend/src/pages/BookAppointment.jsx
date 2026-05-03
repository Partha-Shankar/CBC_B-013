import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

function BookAppointment() {
    const { searchDoctors, bookAppointment, isLoading } = useAuthStore();
    const [query, setQuery] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [form, setForm] = useState({ symptoms: "", diseaseName: "", bookingDate: "" });
    const [confirmed, setConfirmed] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setSearching(true);
        try {
            const results = await searchDoctors(query);
            setDoctors(results);
            if (results.length === 0) toast("No doctors found for that speciality");
        } catch {
            toast.error("Search failed");
        } finally {
            setSearching(false);
        }
    };

    const handleBook = async (e) => {
        e.preventDefault();
        if (!selectedDoctor) { toast.error("Please select a doctor first"); return; }
        if (!form.bookingDate) { toast.error("Please pick a booking date"); return; }
        try {
            await bookAppointment({
                doctorToConsult: selectedDoctor.name,
                diseaseName: form.diseaseName,
                symptoms: form.symptoms,
                bookingDate: form.bookingDate,
            });
            setConfirmed(true);
            toast.success(`Appointment booked with Dr. ${selectedDoctor.name}`);
        } catch {
            toast.error("Booking failed. Please try again.");
        }
    };

    if (confirmed) {
        return (
            <>
                <Navbar />
                <main className="pt-24 pb-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-indigo-50 px-4">
                    <div className="card-premium p-12 text-center max-w-md mx-auto animate-fade-in-up">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                            <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-3">Appointment Confirmed</h2>
                        <p className="text-slate-500 mb-2">
                            Your appointment with <strong className="text-indigo-700">Dr. {selectedDoctor?.name}</strong> has been booked.
                        </p>
                        <p className="text-slate-500 mb-8">
                            Date: <strong>{new Date(form.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                        </p>
                        <div className="flex gap-3 justify-center">
                            <a href="/" className="btn-primary px-6 py-2">Go Home</a>
                            <button onClick={() => { setConfirmed(false); setSelectedDoctor(null); setForm({ symptoms: "", diseaseName: "", bookingDate: "" }); }} className="btn-ghost px-6 py-2">
                                Book Another
                            </button>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Book an Appointment</h1>
                        <p className="text-slate-500">Search for a specialist and book your appointment in seconds</p>
                    </div>

                    {/* Step 1 */}
                    <div className="card-premium p-8 mb-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Step 1 — Find a Doctor</h2>
                        <form onSubmit={handleSearch} className="flex gap-3">
                            <div className="relative flex-1">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    id="doctor-search-input"
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search by speciality (e.g. Psychiatry, Psychology...)"
                                    className="input-field pl-10"
                                />
                            </div>
                            <button id="doctor-search-btn" type="submit" className="btn-primary px-6 whitespace-nowrap" disabled={searching}>
                                {searching ? "Searching..." : "Search"}
                            </button>
                        </form>

                        {doctors.length > 0 && (
                            <div className="mt-6 grid md:grid-cols-2 gap-4">
                                {doctors.map((doc, i) => (
                                    <div
                                        key={i}
                                        id={`doctor-card-${i}`}
                                        onClick={() => setSelectedDoctor(doc)}
                                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                                            selectedDoctor?._id === doc._id
                                                ? "border-indigo-600 bg-indigo-50"
                                                : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                                                {doc.name?.[0]?.toUpperCase() || "D"}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 capitalize">Dr. {doc.name}</h3>
                                                <p className="text-indigo-600 text-sm font-medium">{doc.speciality}</p>
                                            </div>
                                            {selectedDoctor?._id === doc._id && (
                                                <div className="ml-auto w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                                                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Step 2 */}
                    {selectedDoctor && (
                        <div className="card-premium p-8 animate-fade-in">
                            <h2 className="text-xl font-bold text-slate-800 mb-1">Step 2 — Appointment Details</h2>
                            <p className="text-slate-500 mb-6 text-sm">
                                Booking with <strong className="text-indigo-700">Dr. {selectedDoctor.name}</strong> — {selectedDoctor.speciality}
                            </p>
                            <form onSubmit={handleBook} className="space-y-5">
                                <div>
                                    <label className="input-label" htmlFor="condition">Condition / Reason for Visit</label>
                                    <input id="condition" type="text" value={form.diseaseName} onChange={(e) => setForm({ ...form, diseaseName: e.target.value })} className="input-field" placeholder="e.g. Anxiety, Depression, Sleep Issues..." required />
                                </div>
                                <div>
                                    <label className="input-label" htmlFor="symptoms">Describe Your Symptoms</label>
                                    <textarea id="symptoms" value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} className="input-field h-28 resize-none" placeholder="Please describe what you are experiencing..." required />
                                </div>
                                <div>
                                    <label className="input-label" htmlFor="booking-date">Preferred Date</label>
                                    <input id="booking-date" type="date" value={form.bookingDate} onChange={(e) => setForm({ ...form, bookingDate: e.target.value })} min={new Date().toISOString().split('T')[0]} className="input-field" required />
                                </div>
                                <button id="book-submit-btn" type="submit" className="btn-secondary w-full" disabled={isLoading}>
                                    {isLoading ? "Booking..." : "Confirm Appointment"}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}

export default BookAppointment;
