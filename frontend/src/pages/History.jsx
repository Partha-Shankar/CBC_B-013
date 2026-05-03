import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useMentalStore } from "../store/useMentalHealthStore";
import { Link } from "react-router-dom";

const RISK_COLORS = {
    low: { border: "border-emerald-400", badge: "bg-emerald-100 text-emerald-700 border-emerald-200", bar: "bg-emerald-400" },
    moderate: { border: "border-amber-400", badge: "bg-amber-100 text-amber-700 border-amber-200", bar: "bg-amber-400" },
    high: { border: "border-rose-400", badge: "bg-rose-100 text-rose-700 border-rose-200", bar: "bg-rose-400" },
};

const RISK_LABELS = { low: "Low Risk", moderate: "Moderate Risk", high: "High Risk" };

const CONDITIONS = ["depression", "anxiety", "bipolar", "schizophrenia", "ptsd"];

function History() {
    const { getAssessmentHistory, isLoading } = useMentalStore();
    const [history, setHistory] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            const data = await getAssessmentHistory();
            setHistory(data || []);
            setLoaded(true);
        };
        fetch();
    }, []);

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Assessment History</h1>
                        <p className="text-slate-500">Track your mental health trends over time</p>
                    </div>

                    {!loaded ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="card-premium p-6 animate-pulse">
                                    <div className="h-5 bg-slate-200 rounded w-1/4 mb-4" />
                                    <div className="space-y-2">
                                        {[...Array(5)].map((_, j) => <div key={j} className="h-3 bg-slate-100 rounded" />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 flex items-center justify-center">
                                <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-600 mb-2">No assessments yet</h3>
                            <p className="text-slate-400 mb-8">Take your first assessment to start tracking your mental health trends</p>
                            <Link to="/model" className="btn-primary px-8 py-3">Start Assessment</Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {history.map((entry, i) => {
                                const risk = entry.overallRisk || 'low';
                                const colors = RISK_COLORS[risk];
                                const positiveCount = Object.values(entry.scores || {}).filter(v => v === 1).length;

                                return (
                                    <div key={i} id={`history-entry-${i}`} className={`card-premium p-6 border-l-4 ${colors.border} animate-fade-in-up`} style={{ animationDelay: `${i * 0.1}s` }}>
                                        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-lg">Assessment #{history.length - i}</h3>
                                                <p className="text-slate-400 text-sm">
                                                    {new Date(entry.date || entry.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric', month: 'long', year: 'numeric',
                                                        hour: '2-digit', minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${colors.badge}`}>
                                                {RISK_LABELS[risk]}
                                            </span>
                                        </div>

                                        <p className="text-sm text-slate-500 mb-4">
                                            {positiveCount === 0
                                                ? "No significant signs detected"
                                                : `${positiveCount} condition${positiveCount > 1 ? "s" : ""} flagged`}
                                        </p>

                                        <div className="grid sm:grid-cols-5 gap-3">
                                            {CONDITIONS.map((cond) => {
                                                const positive = entry.scores?.[cond] === 1;
                                                return (
                                                    <div key={cond} className="text-center">
                                                        <div className="h-10 flex items-center justify-center">
                                                            <svg className={`w-6 h-6 ${positive ? 'text-rose-500' : 'text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .715.27 1.404.752 1.931l4.498 4.498" />
                                                            </svg>
                                                        </div>
                                                        <div className="text-xs font-semibold text-slate-600 capitalize">{cond}</div>
                                                        <div className={`mt-1 text-xs font-bold px-2 py-0.5 rounded-full ${positive ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                            {positive ? 'Likely' : 'Clear'}
                                                        </div>
                                                    </div>
                                                );
                                            })}
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

export default History;
