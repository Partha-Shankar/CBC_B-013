import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

function Navbar() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
            navigate("/login");
        } catch {
            toast.error("Logout failed");
        }
        setDropdownOpen(false);
        setMenuOpen(false);
    };

    const isDoctor = user?.role === 1;
    const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : "MB";

    const navLinks = isDoctor
        ? [
            { to: "/", label: "Home" },
            { to: "/doctor-dashboard", label: "My Patients" },
            { to: "/resources", label: "Resources" },
            { to: "/aboutus", label: "About" },
        ]
        : [
            { to: "/", label: "Home" },
            { to: "/model", label: "Assess" },
            { to: "/journal", label: "Journal" },
            { to: "/resources", label: "Resources" },
            { to: "/aboutus", label: "About" },
        ];

    return (
        <nav
            id="navbar"
            className={`fixed w-full z-50 top-0 transition-all duration-300 ${
                scrolled
                    ? "bg-white shadow-md border-b border-slate-100"
                    : "bg-white/90 backdrop-blur-md border-b border-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2" id="navbar-logo">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.357 2.059l.182.089M14.25 3.104c.251.023.501.05.75.082M19.5 14.5l-4.091-4.091a2.25 2.25 0 00-1.591-.659H10.5" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
                            MindBridge
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link key={link.to} to={link.to} className="nav-link px-4 py-2 rounded-lg text-sm">
                                {link.label}
                            </Link>
                        ))}
                        {isAuthenticated && !isDoctor && (
                            <Link to="/chatbot" className="nav-link px-4 py-2 rounded-lg text-sm">
                                AI Chat
                            </Link>
                        )}
                    </div>

                    {/* Auth Section */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    id="navbar-avatar-btn"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-colors duration-200"
                                >
                                    {user?.image ? (
                                        <img src={user.image} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                                            {initials}
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-slate-700 capitalize">
                                        {user?.name?.split(" ")[0]}
                                    </span>
                                    <svg className={`w-4 h-4 text-slate-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-fade-in z-50">
                                        <div className="px-4 py-2 border-b border-slate-100 mb-1">
                                            <p className="text-xs text-slate-400">Signed in as</p>
                                            <p className="text-sm font-semibold text-slate-700 capitalize truncate">{user?.name}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${isDoctor ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
                                                {isDoctor ? "Doctor" : "Patient"}
                                            </span>
                                        </div>
                                        <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            Profile
                                        </Link>
                                        {isDoctor ? (
                                            <Link to="/doctor-dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                                Dashboard
                                            </Link>
                                        ) : (
                                            <Link to="/history" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                                My History
                                            </Link>
                                        )}
                                        <hr className="my-1 border-slate-100" />
                                        <button
                                            id="navbar-logout-btn"
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-3 py-2" id="navbar-login-link">
                                    Sign in
                                </Link>
                                <Link to="/signup" id="navbar-signup-btn" className="btn-primary text-sm px-5 py-2">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        id="navbar-mobile-menu-btn"
                        className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 shadow-lg animate-fade-in">
                    <div className="px-4 py-4 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMenuOpen(false)}
                                className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        {isAuthenticated && !isDoctor && (
                            <Link to="/chatbot" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors">
                                AI Chat
                            </Link>
                        )}
                        <hr className="border-slate-100 my-2" />
                        {isAuthenticated ? (
                            <>
                                <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-indigo-50 font-medium transition-colors">
                                    Profile
                                </Link>
                                <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 font-medium transition-colors">
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors">
                                    Sign in
                                </Link>
                                <Link to="/signup" onClick={() => setMenuOpen(false)} className="block btn-primary text-center mt-1">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
