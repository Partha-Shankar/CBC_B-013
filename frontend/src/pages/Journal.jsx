import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.MODE === "development"
    ? "http://localhost:8000/api/users"
    : "/api/users";

const MOOD_LEVELS = [
    { rating: 1, label: "Very Low" },
    { rating: 2, label: "Low" },
    { rating: 3, label: "Below Average" },
    { rating: 4, label: "Slightly Low" },
    { rating: 5, label: "Neutral" },
    { rating: 6, label: "Okay" },
    { rating: 7, label: "Good" },
    { rating: 8, label: "Great" },
    { rating: 9, label: "Excellent" },
    { rating: 10, label: "Outstanding" },
];

function getMoodLabel(rating) {
    return MOOD_LEVELS.find(m => m.rating === rating)?.label || "Neutral";
}

function getMoodColor(rating) {
    if (rating >= 8) return "text-emerald-600 bg-emerald-50";
    if (rating >= 5) return "text-amber-600 bg-amber-50";
    return "text-rose-600 bg-rose-50";
}

function Journal() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ text: "", moodRating: 5 });
    const [submitting, setSubmitting] = useState(false);

    const fetchEntries = async () => {
        try {
            const res = await axios.get(`${API_URL}/journal`);
            setEntries(res.data.data || []);
        } catch {
            console.error("Could not fetch journal entries");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEntries(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.text.trim()) { toast.error("Write something before saving"); return; }
        setSubmitting(true);
        try {
            await axios.post(`${API_URL}/journal`, {
                text: form.text,
                moodRating: form.moodRating,
                emoji: "",
            });
            toast.success("Journal entry saved.");
            setForm({ text: "", moodRating: 5 });
            fetchEntries();
        } catch {
            toast.error("Failed to save entry");
        } finally {
            setSubmitting(false);
        }
    };

    const chartData = entries.slice(0, 7).reverse();

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Wellness Journal</h1>
                        <p className="text-slate-500">Daily reflection keeps your mind healthy. Write freely — it's just for you.</p>
                    </div>

                    {/* New Entry */}
                    <div className="card-premium p-8 mb-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Today's Entry</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Mood Slider */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="input-label" htmlFor="mood-slider">How are you feeling?</label>
                                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getMoodColor(form.moodRating)}`}>
                                        {form.moodRating}/10 — {getMoodLabel(form.moodRating)}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    id="mood-slider"
                                    min={1}
                                    max={10}
                                    value={form.moodRating}
                                    onChange={(e) => setForm({ ...form, moodRating: Number(e.target.value) })}
                                    className="w-full accent-indigo-600"
                                />
                                <div className="flex justify-between text-xs text-slate-400 mt-1">
                                    <span>Very Low</span>
                                    <span>Outstanding</span>
                                </div>
                            </div>

                            {/* Text */}
                            <div>
                                <label className="input-label" htmlFor="journal-text">Write your thoughts</label>
                                <textarea
                                    id="journal-text"
                                    value={form.text}
                                    onChange={(e) => setForm({ ...form, text: e.target.value })}
                                    className="input-field h-36 resize-none"
                                    placeholder="How was your day? What's on your mind? Any wins or struggles you want to capture?"
                                />
                            </div>

                            <button id="save-journal-btn" type="submit" className="btn-primary w-full" disabled={submitting}>
                                {submitting ? "Saving..." : "Save Entry"}
                            </button>
                        </form>
                    </div>

                    {/* Trend Chart */}
                    {chartData.length > 1 && (
                        <div className="card-premium p-8 mb-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Mood Trend — Last 7 Days</h2>
                            <div className="flex items-end gap-2 h-32 px-2">
                                {chartData.map((entry, i) => {
                                    const h = (entry.moodRating / 10) * 100;
                                    const color = entry.moodRating >= 7 ? 'bg-emerald-400' : entry.moodRating >= 4 ? 'bg-amber-400' : 'bg-rose-400';
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                            <span className="text-xs font-bold text-slate-500">{entry.moodRating}</span>
                                            <div className={`w-full rounded-t-lg ${color} transition-all duration-500`} style={{ height: `${h}%`, minHeight: '8px' }} title={`${entry.moodRating}/10`} />
                                            <span className="text-xs text-slate-400">
                                                {new Date(entry.date || entry.createdAt).toLocaleDateString('en', { weekday: 'short' })}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Past Entries */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Previous Entries</h2>
                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="card-premium p-6 animate-pulse">
                                        <div className="h-4 bg-slate-200 rounded w-1/3 mb-3" />
                                        <div className="h-3 bg-slate-100 rounded w-full mb-2" />
                                        <div className="h-3 bg-slate-100 rounded w-2/3" />
                                    </div>
                                ))}
                            </div>
                        ) : entries.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <p className="text-slate-400">No journal entries yet. Write your first one above.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {entries.map((entry, i) => (
                                    <div key={i} id={`journal-entry-${i}`} className="card-premium p-6 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getMoodColor(entry.moodRating)}`}>
                                                {entry.moodRating}/10 — {getMoodLabel(entry.moodRating)}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {new Date(entry.date || entry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 leading-relaxed">{entry.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default Journal;
