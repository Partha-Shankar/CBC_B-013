import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const Signup = () => {
    const navigate = useNavigate();
    const { signup, isLoading, error } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        role: "patient",
        speciality: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { email, password, name, mobile, role, speciality } = formData;
            await signup(email, password, name, mobile, role, speciality);
            toast.success("Account created! Please verify your email.");
            navigate("/verify-email");
        } catch {
            // error handled by store
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left panel */}
            <div
                className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #10B981 0%, #4F46E5 100%)" }}
            >
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-32 -translate-y-32" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-32 translate-y-32" />

                <div className="relative z-10 text-center text-white max-w-md">
                    <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-extrabold mb-4">Start Your Journey</h2>
                    <p className="text-emerald-100 text-lg leading-relaxed">
                        Join MindBridge and take the first step towards better mental health. AI-guided, doctor-connected, always private.
                    </p>
                    <div className="mt-10 space-y-2 text-left">
                        {[
                            "Free AI mental health assessment",
                            "Connect with verified doctors",
                            "Daily mood journaling",
                            "100% secure and confidential",
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-white/90 text-sm">
                                <svg className="w-4 h-4 text-emerald-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 overflow-y-auto">
                <div className="w-full max-w-md">
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold gradient-text">MindBridge</h1>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10">
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Create account</h2>
                        <p className="text-slate-500 mb-8">Sign up for free — no credit card required</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Role selector */}
                            <div>
                                <label className="input-label">I am a</label>
                                <div className="grid grid-cols-2 gap-3 mt-1">
                                    <button
                                        type="button"
                                        id="role-patient-btn"
                                        onClick={() => setFormData({ ...formData, role: "patient", speciality: "" })}
                                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                                            formData.role === "patient"
                                                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                                : "border-slate-200 text-slate-500 hover:border-slate-300"
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Patient
                                    </button>
                                    <button
                                        type="button"
                                        id="role-doctor-btn"
                                        onClick={() => setFormData({ ...formData, role: "doctor" })}
                                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                                            formData.role === "doctor"
                                                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                                : "border-slate-200 text-slate-500 hover:border-slate-300"
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Doctor
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="input-label" htmlFor="signup-name">Full Name</label>
                                <input type="text" id="signup-name" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="Your full name" required />
                            </div>

                            <div>
                                <label className="input-label" htmlFor="signup-email">Email address</label>
                                <input type="email" id="signup-email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="you@example.com" required />
                            </div>

                            <div>
                                <label className="input-label" htmlFor="signup-mobile">Mobile Number</label>
                                <input type="tel" id="signup-mobile" name="mobile" value={formData.mobile} onChange={handleChange} className="input-field" placeholder="10-digit mobile number" minLength={10} maxLength={10} required />
                            </div>

                            {formData.role === "doctor" && (
                                <div className="animate-fade-in">
                                    <label className="input-label" htmlFor="signup-speciality">Speciality</label>
                                    <input type="text" id="signup-speciality" name="speciality" value={formData.speciality} onChange={handleChange} className="input-field" placeholder="e.g. Psychiatry, Clinical Psychology" required={formData.role === "doctor"} />
                                </div>
                            )}

                            <div>
                                <label className="input-label" htmlFor="signup-password">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="signup-password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="input-field pr-12"
                                        placeholder="Minimum 8 characters"
                                        minLength={8}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 flex items-start gap-2">
                                    <svg className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    <p className="text-rose-700 text-sm">{error}</p>
                                </div>
                            )}

                            <button id="signup-submit-btn" type="submit" className="btn-primary w-full text-base" disabled={isLoading}>
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Creating account...
                                    </div>
                                ) : "Create Account"}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-slate-500 text-sm">
                                Already have an account?{" "}
                                <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign in</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
