import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                                MindBridge
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            AI-powered mental health platform connecting patients and doctors with real ML-based assessment and Gemini-powered insights.
                        </p>
                    </div>

                    {/* Platform */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Platform</h3>
                        <ul className="space-y-3">
                            {[
                                { to: "/model", label: "AI Assessment" },
                                { to: "/book-appointment", label: "Find a Doctor" },
                                { to: "/journal", label: "Wellness Journal" },
                                { to: "/chatbot", label: "AI Chatbot" },
                                { to: "/history", label: "My History" },
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Resources</h3>
                        <ul className="space-y-3">
                            {[
                                { to: "/resources", label: "Wellness Library" },
                                { to: "/aboutus", label: "About Us" },
                                { to: "/contactus", label: "Contact" },
                                { to: "/profile", label: "My Profile" },
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Emergency */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Emergency Help</h3>
                        <ul className="space-y-3">
                            <li className="text-sm">
                                <span className="text-slate-300 font-medium">iCall</span>
                                <a href="tel:9152987821" className="block text-emerald-400 hover:underline">9152987821</a>
                            </li>
                            <li className="text-sm">
                                <span className="text-slate-300 font-medium">Vandrevala Foundation</span>
                                <a href="tel:18002662345" className="block text-emerald-400 hover:underline">1860-2662-345</a>
                            </li>
                            <li className="text-sm">
                                <span className="text-slate-300 font-medium">NIMHANS</span>
                                <a href="tel:08046110007" className="block text-emerald-400 hover:underline">080-46110007</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr className="border-slate-800 mb-6" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-xs">
                        &copy; 2025 MindBridge — Academic Project. All Rights Reserved.
                    </p>
                    <p className="text-slate-600 text-xs">
                        Not a substitute for professional medical advice.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
