import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CATEGORIES = ["All", "Breathing", "Meditation", "CBT", "Helplines"];

const RESOURCES = [
    {
        category: "Breathing",
        title: "4-7-8 Breathing Technique",
        desc: "A calming exercise: inhale for 4 counts, hold for 7, exhale for 8. Reduces anxiety in minutes.",
        tag: "3 min",
        link: "https://www.youtube.com/watch?v=YRPh_GaiL8s",
    },
    {
        category: "Breathing",
        title: "Box Breathing (Navy SEAL Technique)",
        desc: "Used to manage stress under pressure. 4 counts inhale, hold, exhale, hold — a simple cycle.",
        tag: "5 min",
        link: "https://www.youtube.com/watch?v=tEmt1Znux58",
    },
    {
        category: "Meditation",
        title: "Guided Mindfulness Meditation",
        desc: "A gentle 10-minute body scan to ground yourself in the present moment and reduce rumination.",
        tag: "10 min",
        link: "https://www.youtube.com/watch?v=inpok4MKVLM",
    },
    {
        category: "Meditation",
        title: "Sleep Meditation",
        desc: "Calm your racing mind before bed with this guided relaxation to improve sleep quality.",
        tag: "20 min",
        link: "https://www.youtube.com/watch?v=lTFlT6KO9Lw",
    },
    {
        category: "CBT",
        title: "Cognitive Restructuring Worksheet",
        desc: "Identify and challenge negative thought patterns using this CBT technique. Break the anxiety-thought cycle.",
        tag: "Exercise",
        link: "https://www.therapistaid.com/therapy-worksheets/cbt/none",
    },
    {
        category: "CBT",
        title: "Thought Record Journal",
        desc: "Track automatic negative thoughts and reframe them with balanced, evidence-based alternatives.",
        tag: "Daily",
        link: "https://www.therapistaid.com/therapy-worksheets/thought-record",
    },
    {
        category: "Meditation",
        title: "Progressive Muscle Relaxation",
        desc: "Release physical tension by systematically tensing and relaxing each muscle group in sequence.",
        tag: "15 min",
        link: "https://www.youtube.com/watch?v=1nZEdqcGVzo",
    },
    {
        category: "CBT",
        title: "5-4-3-2-1 Grounding Technique",
        desc: "Ground yourself during a panic attack by engaging all 5 senses. Provides immediate anxiety relief.",
        tag: "2 min",
        link: "https://www.therapistaid.com/therapy-worksheets/grounding-techniques",
    },
];

const HELPLINES = [
    { name: "iCall", number: "9152987821", desc: "Psychologists trained in emotional support", hours: "Mon–Sat, 8am–10pm" },
    { name: "Vandrevala Foundation", number: "1860-2662-345", desc: "24/7 mental health support across India", hours: "24 hours, 7 days" },
    { name: "NIMHANS", number: "080-46110007", desc: "National Institute of Mental Health helpline", hours: "24 hours, 7 days" },
    { name: "iCall WhatsApp", number: "9152987821", desc: "WhatsApp support for mental health queries", hours: "Mon–Sat, 8am–10pm" },
];

function Resources() {
    const [activeCategory, setActiveCategory] = useState("All");
    const filtered = RESOURCES.filter(r => activeCategory === "All" || r.category === activeCategory);

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-teal-50 via-white to-indigo-50 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Wellness Resource Library</h1>
                        <p className="text-slate-500 text-lg">Evidence-based tools, techniques, and support resources</p>
                    </div>

                    {/* Emergency contacts */}
                    <div className="card-premium p-8 mb-10 border-l-4 border-rose-400">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Emergency Contacts</h2>
                            <p className="text-slate-500 text-sm mt-1">If you are in crisis, please reach out immediately</p>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {HELPLINES.map((h, i) => (
                                <div key={i} id={`helpline-${i}`} className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        </div>
                                        <span className="font-bold text-slate-800 text-sm">{h.name}</span>
                                    </div>
                                    <a href={`tel:${h.number}`} className="text-rose-600 font-bold text-lg block mb-1 hover:underline">{h.number}</a>
                                    <p className="text-slate-500 text-xs mb-1">{h.desc}</p>
                                    <span className="text-xs text-emerald-600 font-medium">{h.hours}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Category filter */}
                    <div className="flex flex-wrap gap-3 mb-8">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                id={`filter-${cat.toLowerCase()}`}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all ${
                                    activeCategory === cat
                                        ? "bg-indigo-600 text-white shadow-lg"
                                        : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Resource cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((r, i) => (
                            <div key={i} id={`resource-card-${i}`} className="card-premium p-6 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-semibold">{r.tag}</span>
                                </div>
                                <span className="text-xs text-emerald-600 font-medium uppercase tracking-wide">{r.category}</span>
                                <h3 className="text-lg font-bold text-slate-800 mt-1 mb-2">{r.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-5">{r.desc}</p>
                                <a href={r.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:gap-3 transition-all">
                                    Open resource
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </a>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
                        <p className="text-amber-700 text-sm">
                            These resources are for general wellness support only. If you are experiencing a mental health crisis, contact one of the helplines above or visit your nearest emergency room.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default Resources;
