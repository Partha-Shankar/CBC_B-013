import React, { useState } from 'react';
import { useMentalStore } from '../store/useMentalHealthStore.js';
import { useAuthStore } from "../store/authStore.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import toast from 'react-hot-toast';

const STEPS = [
    {
        id: 1,
        title: "Sleep & Energy",
        desc: "How are you sleeping and feeling physically?",
        fields: [
            { key: "sleep_hours", label: "Sleep Hours per Night", min: 0, max: 12, step: 0.5, helpText: "Average hours of sleep per night" },
            { key: "fatigue_level", label: "Fatigue Level", min: 1, max: 10, helpText: "1 = No fatigue, 10 = Completely exhausted" },
        ],
    },
    {
        id: 2,
        title: "Mood & Stress",
        desc: "How has your emotional state been lately?",
        fields: [
            { key: "mood_score", label: "Mood Score", min: 1, max: 10, helpText: "1 = Very low, 10 = Excellent" },
            { key: "stress_level", label: "Stress Level", min: 1, max: 10, helpText: "1 = No stress, 10 = Extremely stressed" },
            { key: "mood_swings", label: "Mood Swings", min: 1, max: 10, helpText: "1 = Very stable, 10 = Frequent extreme swings" },
        ],
    },
    {
        id: 3,
        title: "Social & Behavioral",
        desc: "How are you connecting with the world around you?",
        fields: [
            { key: "social_interaction", label: "Social Interaction", min: 1, max: 10, helpText: "1 = Completely isolated, 10 = Very social" },
            { key: "restlessness_level", label: "Restlessness / Anxiety", min: 1, max: 10, helpText: "1 = Very calm, 10 = Constantly restless" },
            { key: "trauma_history", label: "History of Trauma", min: 0, max: 1, step: 1, helpText: "0 = No trauma history, 1 = Yes" },
        ],
    },
];

const RISK_COLORS = {
    low: "text-emerald-600 bg-emerald-50 border-emerald-200",
    moderate: "text-amber-600 bg-amber-50 border-amber-200",
    high: "text-rose-600 bg-rose-50 border-rose-200",
};

const RISK_LABELS = { low: "Low Risk", moderate: "Moderate Risk", high: "High Risk" };

function SliderInput({ field, value, onChange }) {
    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-700">{field.label}</label>
                <span className="text-lg font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full min-w-[48px] text-center">
                    {value}
                </span>
            </div>
            <input
                type="range"
                min={field.min}
                max={field.max}
                step={field.step || 1}
                value={value}
                onChange={(e) => onChange(field.key, Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>{field.min}</span>
                <span className="italic text-center max-w-xs">{field.helpText}</span>
                <span>{field.max}</span>
            </div>
        </div>
    );
}

const Model = () => {
    const { inputData, prediction, predictionData, suggestions, isLoading, setInputValue, predict, generateSuggestions, saveAssessment } = useMentalStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [predicted, setPredicted] = useState(false);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);

    const step = STEPS[currentStep];
    const progress = ((currentStep + 1) / STEPS.length) * 100;

    const handleNext = () => { if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1); };
    const handleBack = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

    const handlePredict = async () => {
        if (currentStep < STEPS.length - 1) { toast.error("Please complete all steps first"); return; }
        try {
            const result = await predict(inputData);
            setPredicted(true);
            if (result?.predictions) {
                await saveAssessment(result.predictions, result.overall_risk || 'low');
            }
            toast.success("Assessment complete.");
        } catch {
            toast.error("Failed to get prediction. Is the Python ML server running on port 5000?");
        }
    };

    const handleGetSuggestions = async () => {
        setSuggestionsLoading(true);
        try {
            const { predictionData: pd } = useMentalStore.getState();
            await generateSuggestions({ ...inputData, predictions: pd?.predictions });
        } catch {
            toast.error("Could not generate suggestions. Ensure the Gemini API key is set.");
        } finally {
            setSuggestionsLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Mental Health Assessment</h1>
                        <p className="text-slate-500">Answer honestly — this is private and confidential. Takes about two minutes.</p>
                    </div>

                    {/* Progress */}
                    <div className="mb-8">
                        <div className="flex justify-between text-sm font-medium mb-2">
                            {STEPS.map((s, i) => (
                                <span key={s.id} className={`flex items-center gap-1.5 ${i <= currentStep ? 'text-indigo-600' : 'text-slate-400'}`}>
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i <= currentStep ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                        {i < currentStep ? (
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        ) : (i + 1)}
                                    </span>
                                    <span className="hidden sm:inline">{s.title}</span>
                                </span>
                            ))}
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="text-right text-xs text-slate-400 mt-1">Step {currentStep + 1} of {STEPS.length}</p>
                    </div>

                    {/* Step Card */}
                    {!predicted && (
                        <div className="card-premium p-8 animate-fade-in">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">{step.title}</h2>
                                <p className="text-slate-500 text-sm mt-1">{step.desc}</p>
                            </div>
                            <hr className="mb-6 border-slate-100" />

                            {step.fields.map((field) => (
                                <SliderInput key={field.key} field={field} value={inputData[field.key]} onChange={setInputValue} />
                            ))}

                            <div className="flex gap-3 mt-8">
                                {currentStep > 0 && (
                                    <button onClick={handleBack} id="step-back-btn" className="btn-ghost flex-1">
                                        Back
                                    </button>
                                )}
                                {currentStep < STEPS.length - 1 ? (
                                    <button onClick={handleNext} id="step-next-btn" className="btn-primary flex-1">
                                        Continue
                                    </button>
                                ) : (
                                    <button onClick={handlePredict} id="predict-btn" className="btn-primary flex-1" disabled={isLoading}>
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Analyzing...
                                            </span>
                                        ) : "Get Assessment"}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    {predicted && predictionData && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="card-premium p-8">
                                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                                    <h2 className="text-2xl font-bold text-slate-800">Assessment Results</h2>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${RISK_COLORS[predictionData.overall_risk || 'low']}`}>
                                        {RISK_LABELS[predictionData.overall_risk || 'low']}
                                    </span>
                                </div>

                                <div className="bg-indigo-50 rounded-2xl p-5 mb-6">
                                    <p className="text-slate-700 leading-relaxed font-medium">{prediction}</p>
                                </div>

                                {predictionData.raw_scores && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-700 mb-4">Condition-wise Analysis</h3>
                                        <div className="space-y-3">
                                            {Object.entries(predictionData.raw_scores).map(([condition, score]) => {
                                                const pos = predictionData.predictions?.[condition];
                                                const pct = Math.round(score);
                                                const barColor = pct > 60 ? 'bg-rose-400' : pct > 40 ? 'bg-amber-400' : 'bg-emerald-400';
                                                return (
                                                    <div key={condition} className="flex items-center gap-3">
                                                        <span className="text-sm font-semibold text-slate-600 w-28 capitalize">{condition}</span>
                                                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className={`h-full ${barColor} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-600 w-12 text-right">{pct}%</span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-16 text-center ${pos ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                            {pos ? 'Likely' : 'Unlikely'}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Suggestions */}
                            <div className="card-premium p-6">
                                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">AI-Generated Suggestions</h3>
                                        <p className="text-slate-500 text-sm">Personalized mental health tips powered by Gemini AI</p>
                                    </div>
                                    <button id="get-suggestions-btn" onClick={handleGetSuggestions} disabled={suggestionsLoading} className="btn-secondary px-5 py-2 text-sm">
                                        {suggestionsLoading ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Generating...
                                            </span>
                                        ) : "Generate Suggestions"}
                                    </button>
                                </div>

                                {suggestions && suggestions.length > 0 && (
                                    <div className="space-y-3 animate-fade-in">
                                        {suggestions.map((s, i) => (
                                            <div key={i} className="flex items-start gap-3 bg-emerald-50 rounded-xl p-4">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                                <p className="text-slate-700 text-sm leading-relaxed">{s}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-4">
                                <button id="retake-btn" onClick={() => { setPredicted(false); setCurrentStep(0); }} className="btn-ghost text-sm py-3">
                                    Retake Assessment
                                </button>
                                <a href="/book-appointment" id="book-doctor-btn" className="btn-secondary text-sm py-3 text-center">
                                    Book a Doctor
                                </a>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                                <p className="text-amber-700 text-xs leading-relaxed">
                                    <strong>Disclaimer:</strong> This AI assessment is for informational purposes only and does not constitute a medical diagnosis. Please consult a qualified mental health professional for proper evaluation and treatment.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Model;
