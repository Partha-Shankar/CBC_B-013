import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const team = [
    { name: "Team Member 1", role: "Full-Stack Developer", desc: "Backend architecture and Node.js API design" },
    { name: "Team Member 2", role: "ML Engineer", desc: "Python ML models and Gemini AI integration" },
    { name: "Team Member 3", role: "Frontend Developer", desc: "React UI/UX and responsive design" },
    { name: "Team Member 4", role: "Database Architect", desc: "MongoDB schema design and data modeling" },
];

const techStack = [
    { name: "React", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { name: "Node.js", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { name: "Python", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    { name: "MongoDB", color: "bg-green-50 text-green-700 border-green-200" },
    { name: "Gemini AI", color: "bg-purple-50 text-purple-700 border-purple-200" },
    { name: "Scikit-learn", color: "bg-orange-50 text-orange-700 border-orange-200" },
    { name: "Flask", color: "bg-red-50 text-red-700 border-red-200" },
    { name: "Cloudinary", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
];

export default function AboutUs() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Mission */}
                    <section className="text-center mb-20">
                        <h1 className="text-5xl font-extrabold text-slate-800 mb-6 leading-tight">
                            Bridging the gap between
                            <span className="block gradient-text">mental health and technology</span>
                        </h1>
                        <p className="text-slate-500 text-lg leading-relaxed max-w-3xl mx-auto">
                            MindBridge is an AI-powered mental health platform built as a final year project, designed to make mental health screening accessible, private, and insightful. We combine machine learning, Gemini AI, and human-centered design to connect patients with the support they need.
                        </p>
                    </section>

                    {/* Value cards */}
                    <section className="grid md:grid-cols-3 gap-6 mb-20">
                        {[
                            {
                                title: "Our Mission",
                                desc: "To democratize mental health screening and make professional care accessible to every individual, regardless of location or social barriers.",
                                icon: (
                                    <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ),
                            },
                            {
                                title: "Privacy First",
                                desc: "We never share your data. All assessments are confidential, encrypted, and stored securely. Your mental health journey is yours alone.",
                                icon: (
                                    <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                ),
                            },
                            {
                                title: "Human-Centered",
                                desc: "AI is a tool, not a replacement. We bridge the gap between algorithms and empathy, always emphasizing professional human care.",
                                icon: (
                                    <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                ),
                            },
                        ].map((card, i) => (
                            <div key={i} className="card-premium p-8 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-5">
                                    {card.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-3">{card.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
                            </div>
                        ))}
                    </section>

                    {/* Tech Stack */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold text-slate-800 text-center mb-10">Technology Stack</h2>
                        <div className="flex flex-wrap justify-center gap-3">
                            {techStack.map((tech, i) => (
                                <div key={i} className={`px-4 py-2 rounded-full border-2 font-semibold text-sm ${tech.color}`}>
                                    {tech.name}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Team */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-slate-800 text-center mb-10">The Team</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {team.map((member, i) => (
                                <div key={i} className="card-premium p-6 text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-1">{member.name}</h3>
                                    <p className="text-indigo-600 text-sm font-semibold mb-2">{member.role}</p>
                                    <p className="text-slate-400 text-xs">{member.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
                        <p className="text-amber-700 text-sm leading-relaxed">
                            <strong>Disclaimer:</strong> MindBridge is an academic project and does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified mental health professional for medical concerns.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}