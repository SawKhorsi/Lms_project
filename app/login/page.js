"use client";
import { useState, useEffect } from "react";
import "./login.css";

export default function Login() {
    const [isMounted, setIsMounted] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setIsMounted(true);
    }, []);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(""); // Clear error when user starts typing
    }

    async function handleLogin(e) {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (data.error) {
                setError(data.error);
                setIsLoading(false);
            } else {
                localStorage.setItem("user", JSON.stringify(data));
                window.location.href = data.role === "teacher" ? "/teacher" : "/student";
            }
        } catch (err) {
            setError("Connection failed. Please try again.");
            setIsLoading(false);
        }
    }

    return (
        <div className="login-container">
            {isMounted ? (
                <div className="login-card">
                    <div className="login-header">
                        <div className="logo-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                            </svg>
                        </div>
                        <h1>Welcome Back</h1>
                        <p className="subtitle">Sign in to your learning hub</p>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                onChange={handleChange}
                                value={form.email}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                onChange={handleChange}
                                value={form.password}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <div className="error-message">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M12 7v5M12 16h.01" fill="white"/>
                                </svg>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Don't have an account?</p>
                        <button
                            className="register-button"
                            onClick={() => window.location.href = "/register"}
                            disabled={isLoading}
                        >
                            Create Account
                        </button>
                    </div>
                </div>
            ) : null}

            {/* Decorative elements */}
            <div className="gradient-blob blob-1"></div>
            <div className="gradient-blob blob-2"></div>
        </div>
    );
}