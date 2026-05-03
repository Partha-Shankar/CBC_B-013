import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
    const navigate = useNavigate();
    const { login, isLoading, error } = useAuthStore();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password);
            toast.success("Welcome back!");
            navigate("/");
        } catch {
            // error handled by store
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left panel */}
            <div
                className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 60%, #10B981 100%)" }}
            >
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-32 -translate-y-32" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-32 translate-y-32" />

                <div className="relative z-10 text-center text-white max-w-md">
                    <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .715.27 1.404.752 1.931l4.498 4.498" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-extrabold mb-4">Welcome Back</h2>
                    <p className="text-indigo-100 text-lg leading-relaxed">
                        Continue your mental wellness journey. Your insights, your progress, your health — all in one place.
                    </p>
                    <div className="mt-10 grid grid-cols-2 gap-3 text-left">
                        {[
                            "Fully private and secure",
                            "AI-powered insights",
                            "Verified doctors",
                            "Progress tracking",
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-2 rounded-xl">
                                <svg className="w-4 h-4 text-emerald-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm text-white/90">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
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
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Sign in</h2>
                        <p className="text-slate-500 mb-8">Enter your credentials to continue</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="input-label" htmlFor="login-email">Email address</label>
                                <input
                                    type="email"
                                    id="login-email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="input-label" htmlFor="login-password">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="login-password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="input-field pr-12"
                                        placeholder="••••••••"
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

                            <div className="flex justify-end">
                                <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline font-medium">
                                    Forgot password?
                                </Link>
                            </div>

                            {error && (
                                <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 flex items-start gap-2">
                                    <svg className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    <p className="text-rose-700 text-sm">{error}</p>
                                </div>
                            )}

                            <button
                                id="login-submit-btn"
                                type="submit"
                                className="btn-primary w-full text-base"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Signing in...
                                    </div>
                                ) : "Sign in"}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-slate-500 text-sm">
                                Don't have an account?{" "}
                                <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
                                    Create one free
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
