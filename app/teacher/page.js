"use client";
import { useEffect, useState } from "react";
import "./teacher.css";

export default function Teacher() {
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({
        title: "",
        description: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));

        if (!userData || userData.role !== "teacher") {
            window.location.href = "/login";
            return;
        }

        setUser(userData);
        fetchCourses();
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setError("");
    }

    async function fetchCourses() {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));

            if (!userData) {
                window.location.href = "/login";
                return;
            }

            const res = await fetch(`/api/teacher/courses?teacher_id=${userData.id}`);
            const data = await res.json();

            setCourses(data || []);
        } catch (err) {
            console.error("Failed to fetch courses:", err);
            setError("Failed to load courses");
        }
    }

    async function createCourse() {
        if (!form.title.trim()) {
            setError("Course title is required");
            return;
        }

        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const userData = JSON.parse(localStorage.getItem("user"));

            if (!userData) {
                window.location.href = "/login";
                return;
            }

            const res = await fetch("/api/courses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...form,
                    teacher_id: userData.id,
                }),
            });

            const data = await res.json();

            if (!res.ok || data.error) {
                setError(data.error || "Failed to create course");
                setIsLoading(false);
            } else {
                setSuccess("Course created successfully!");
                setForm({ title: "", description: "" });
                
                setTimeout(() => {
                    fetchCourses();
                    setSuccess("");
                }, 1500);
            }
        } catch (err) {
            setError("Connection failed. Please try again.");
            setIsLoading(false);
        }
    }

    if (!user) {
        return (
            <div className="teacher-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="teacher-container">
            {/* HEADER */}
            <div className="teacher-header">
                <div className="header-content">
                    <div className="header-welcome">
                        <h1>Welcome, {user.name}</h1>
                        <p>Manage your courses and students</p>
                    </div>
                    <div className="header-stats">
                        <div className="stat-card">
                            <div className="stat-number">{courses.length}</div>
                            <div className="stat-label">Courses</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="teacher-content">
                {/* CREATE COURSE SECTION */}
                <section className="create-section">
                    <div className="section-header">
                        <h2>Create New Course</h2>
                        <p>Set up a new course for your students</p>
                    </div>

                    <div className="create-card">
                        <div className="form-group">
                            <label htmlFor="title">Course Title</label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                placeholder="e.g., Advanced Python Programming"
                                value={form.title}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Describe your course content and goals..."
                                value={form.description}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="form-textarea"
                                rows={4}
                            />
                        </div>

                        {error && (
                            <div className="alert alert-error">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M12 7v5M12 16h.01" fill="white"/>
                                </svg>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="alert alert-success">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                                {success}
                            </div>
                        )}

                        <button
                            className="create-button"
                            onClick={createCourse}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="button-spinner"></span>
                                    Creating Course...
                                </>
                            ) : (
                                <>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="12" y1="5" x2="12" y2="19"/>
                                        <line x1="5" y1="12" x2="19" y2="12"/>
                                    </svg>
                                    Create Course
                                </>
                            )}
                        </button>
                    </div>
                </section>

                {/* COURSES SECTION */}
                <section className="courses-section">
                    <div className="section-header">
                        <h2>Your Courses</h2>
                        {courses.length > 0 && (
                            <p>{courses.length} course{courses.length !== 1 ? "s" : ""}</p>
                        )}
                    </div>

                    {courses.length === 0 ? (
                        <div className="empty-state">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                            </svg>
                            <h3>No courses yet</h3>
                            <p>Create a course above to get started</p>
                        </div>
                    ) : (
                        <div className="courses-list">
                            {courses.map((course, index) => (
                                <div key={course.id} className="course-item" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className="course-content">
                                        <div className="course-header">
                                            <h3>{course.title}</h3>
                                            <div className="course-badges">
                                                <span className="badge badge-code">{course.course_code}</span>
                                            </div>
                                        </div>

                                        {course.description && (
                                            <p className="course-desc">{course.description}</p>
                                        )}

                                        <div className="course-info">
                                            <div className="info-item">
                                                <span className="info-label">Course Code:</span>
                                                <span className="info-value font-mono">{course.course_code}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Enrollment Key:</span>
                                                <span className="info-value font-mono">{course.course_password}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <a href={`/teacher/courses/${course.id}`} className="course-action-button">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 5v14M5 12h14"/>
                                        </svg>
                                        Manage Course
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}