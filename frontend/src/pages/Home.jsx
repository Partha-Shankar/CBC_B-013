import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuthStore } from "../store/authStore";

const features = [
    {
        title: "AI Mental Health Assessment",
        desc: "Get screened for five mental health conditions using our machine learning model trained on clinical patterns. Instant, private, and insightful.",
        link: "/model",
        icon: (
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .715.27 1.404.752 1.931l4.498 4.498M14.25 3.104c.251.023.501.05.75.082M19.5 14.5l-4.091-4.091" />
            </svg>
        ),
        color: "from-indigo-500 to-purple-600",
    },
    {
        title: "Connect with Doctors",
        desc: "Search qualified mental health specialists by speciality and book appointments directly through the platform.",
        link: "/book-appointment",
        icon: (
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        color: "from-emerald-500 to-teal-600",
    },
    {
        title: "Daily Wellness Journal",
        desc: "Track your mood and thoughts every day. Visualize your mental health trends over time with progress charts.",
        link: "/journal",
        icon: (
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        ),
        color: "from-amber-500 to-orange-600",
    },
];

const steps = [
    { num: "01", title: "Create Account", desc: "Sign up as a patient or doctor. Verify your email to activate your account." },
    { num: "02", title: "Take Assessment", desc: "Complete our guided three-step AI assessment for mental health screening." },
    { num: "03", title: "Get Support", desc: "Receive AI insights, connect with doctors, and track your progress over time." },
];

const testimonials = [
    { name: "Priya S.", role: "Patient", text: "MindBridge helped me understand my anxiety better. The AI assessment was accurate and the doctor I found was wonderful." },
    { name: "Dr. Arjun M.", role: "Psychiatrist", text: "As a doctor, this platform gives me a clear picture of my patients' self-reported symptoms before our sessions. Highly efficient." },
    { name: "Ravi K.", role: "Patient", text: "The daily journal keeps me accountable. I have noticed real improvement in my mood tracking over the past month." },
];

const stats = [
    { value: "5", label: "Conditions Assessed" },
    { value: "AI", label: "Powered by Gemini" },
    { value: "100%", label: "Secure & Private" },
    { value: "24/7", label: "Always Available" },
];

function Home() {
    const { user } = useAuthStore();
    const isDoctor = user?.role === 1;

    return (
        <>
            <Navbar />
            <main className="pt-16">
                {/* Hero */}
                <section
                    id="hero"
                    className="relative min-h-screen flex items-center justify-center overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #10B981 100%)" }}
                >
                    <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

                    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-6 animate-fade-in">
                            AI-Powered Mental Health Platform
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 animate-fade-in-up">
                            Your Mental Health
                            <span className="block text-emerald-300">Journey Starts Here</span>
                        </h1>
                        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200">
                            Real ML-based mental health assessments, Gemini AI insights, and seamless doctor-patient connections — all in one platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
                            {isDoctor ? (
                                <Link
                                    id="hero-doctor-cta"
                                    to="/doctor-dashboard"
                                    className="bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl shadow-xl hover:bg-indigo-50 transition-all duration-200 text-lg"
                                >
                                    Patient Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        id="hero-assess-cta"
                                        to="/model"
                                        className="bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl shadow-xl hover:bg-indigo-50 transition-all duration-200 text-lg"
                                    >
                                        Take Assessment
                                    </Link>
                                    <Link
                                        id="hero-doctor-search-cta"
                                        to="/book-appointment"
                                        className="border-2 border-white text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all duration-200 text-lg"
                                    >
                                        Find a Doctor
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
                            <div className="w-1 h-3 bg-white/70 rounded-full" />
                        </div>
                    </div>
                </section>

                {/* Stats Bar */}
                <section className="py-8 bg-slate-900">
                    <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((s, i) => (
                            <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="text-3xl font-extrabold text-indigo-400">{s.value}</div>
                                <div className="text-slate-400 text-sm mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Features */}
                <section id="features" className="py-24 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="section-title">Everything You Need</h2>
                            <p className="section-subtitle">Three pillars of mental wellness, seamlessly integrated</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {features.map((f, i) => (
                                <Link
                                    key={i}
                                    to={f.link}
                                    id={`feature-card-${i}`}
                                    className="card-premium p-8 group cursor-pointer animate-fade-in-up"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                >
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        {f.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3">{f.title}</h3>
                                    <p className="text-slate-500 leading-relaxed">{f.desc}</p>
                                    <div className="mt-6 flex items-center text-indigo-600 font-semibold text-sm gap-2 group-hover:gap-3 transition-all">
                                        Learn more
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-24 px-4 bg-gradient-to-br from-indigo-50 to-emerald-50">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="section-title">How It Works</h2>
                            <p className="section-subtitle">Get started in three simple steps</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {steps.map((s, i) => (
                                <div key={i} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.2}s` }}>
                                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-emerald-500 flex flex-col items-center justify-center text-white shadow-lg">
                                        <span className="text-xs font-medium text-indigo-200">{s.num}</span>
                                        <span className="text-2xl font-bold">{i + 1}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3">{s.title}</h3>
                                    <p className="text-slate-500">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-24 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="section-title">What People Say</h2>
                            <p className="section-subtitle">Trusted by patients and clinicians alike</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {testimonials.map((t, i) => (
                                <div key={i} className="card-premium p-8 animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(5)].map((_, j) => (
                                            <svg key={j} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-slate-600 italic mb-6 leading-relaxed">"{t.text}"</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                                            {t.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-800 text-sm">{t.name}</div>
                                            <div className="text-slate-400 text-xs">{t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-emerald-600">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h2 className="text-4xl font-extrabold mb-4">Ready to start your journey?</h2>
                        <p className="text-indigo-100 text-lg mb-8">
                            Take the first step towards better mental health today. Free, private, and takes only a few minutes.
                        </p>
                        <Link
                            id="cta-banner-btn"
                            to="/model"
                            className="bg-white text-indigo-700 font-bold px-10 py-4 rounded-2xl shadow-xl hover:bg-indigo-50 transition-all duration-200 text-lg inline-block"
                        >
                            Start Free Assessment
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default Home;
