import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const WELCOME_MSG = {
    role: "assistant",
    content: "Hello, I'm the MindBridge AI support assistant. I'm here to listen, offer coping strategies, and guide you towards professional help when needed. How are you feeling today?",
    time: new Date(),
};

function ChatBot() {
    const { sendChatMessage } = useAuthStore();
    const [messages, setMessages] = useState([WELCOME_MSG]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        const text = input.trim();
        if (!text) return;

        const userMsg = { role: "user", content: text, time: new Date() };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const history = messages.map((m) => ({
                role: m.role === "assistant" ? "model" : "user",
                content: m.content,
            }));
            const reply = await sendChatMessage(text, history);
            setMessages((prev) => [...prev, { role: "assistant", content: reply, time: new Date() }]);
        } catch {
            toast.error("Could not get a response. Please check your connection.");
            setMessages((prev) => [...prev, {
                role: "assistant",
                content: "I am having trouble connecting right now. Please try again in a moment.",
                time: new Date(),
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const quickMessages = [
        "I'm feeling anxious today",
        "I can't sleep at night",
        "I feel overwhelmed",
        "I need some coping tips",
    ];

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-6 min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
                <div className="max-w-3xl mx-auto w-full flex flex-col flex-1">
                    {/* Header */}
                    <div className="card-premium p-5 mb-4 flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .715.27 1.404.752 1.931l4.498 4.498" />
                                </svg>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">MindBridge AI</h1>
                            <p className="text-emerald-600 text-sm font-medium">Online — Powered by Gemini</p>
                        </div>
                        <div className="ml-auto text-xs text-slate-400 text-right hidden sm:block">
                            <p>Confidential session</p>
                            <p>Not a replacement for professional help</p>
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="card-premium flex-1 p-6 overflow-y-auto min-h-96 max-h-[60vh] space-y-4">
                        {messages.map((msg, i) => {
                            const isUser = msg.role === "user";
                            return (
                                <div key={i} id={`chat-msg-${i}`} className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
                                    {!isUser && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className={`max-w-xs sm:max-w-md flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                                        <div className={`px-4 py-3 rounded-2xl ${isUser
                                            ? "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-sm"
                                            : "bg-white border border-slate-100 text-slate-700 rounded-tl-sm shadow-sm"
                                        }`}>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                        <span className="text-xs text-slate-400 mt-1 px-1">{formatTime(msg.time)}</span>
                                    </div>
                                    {isUser && (
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 ml-2 mt-1">
                                            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {isTyping && (
                            <div className="flex items-center gap-2 animate-fade-in">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5" />
                                    </svg>
                                </div>
                                <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Quick Messages */}
                    <div className="flex gap-2 flex-wrap mt-3">
                        {quickMessages.map((qm, i) => (
                            <button
                                key={i}
                                onClick={() => setInput(qm)}
                                className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
                            >
                                {qm}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="mt-3">
                        <div className="card-premium p-3 flex items-center gap-3">
                            <input
                                id="chat-input"
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Share what's on your mind..."
                                className="flex-1 px-4 py-2 bg-slate-50 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                                disabled={isTyping}
                            />
                            <button
                                id="chat-send-btn"
                                type="submit"
                                disabled={!input.trim() || isTyping}
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white hover:from-indigo-700 hover:to-indigo-800 transition-all disabled:opacity-50"
                                aria-label="Send message"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-xs text-slate-400 text-center mt-2">
                            MindBridge AI does not diagnose. Always seek professional help for serious concerns.
                        </p>
                    </form>
                </div>
            </main>
        </>
    );
}

export default ChatBot;
