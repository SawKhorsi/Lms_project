"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./course.css";

export default function StudentCoursePage() {
    const params = useParams();
    const router = useRouter();
    const courseId = Number(params.id);

    const [user, setUser] = useState(null);
    const [course, setCourse] = useState(null);
    const [lectures, setLectures] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));

        if (!userData || userData.role !== "student") {
            router.push("/login");
            return;
        }

        setUser(userData);
        fetchCourseDetails();
    }, [courseId, router]);

    async function fetchCourseDetails() {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));

            if (!userData) {
                router.push("/login");
                return;
            }

            const res = await fetch(
                `/api/lectures?course_id=${courseId}&user_id=${userData.id}&role=${userData.role}`
            );

            const data = await res.json();

            if (data.error) {
                setError(data.error);
                setIsLoading(false);
                return;
            }

            // Set course info from first lecture or from separate endpoint
            if (data.course) {
                setCourse(data.course);
            }

            setLectures(data.lectures || data || []);
        } catch (err) {
            console.error("Failed to fetch lectures:", err);
            setError("Failed to load course lectures");
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <div className="course-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading course...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="course-container">
                <div className="error-state">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 7v5M12 16h.01" fill="white"/>
                    </svg>
                    <h2>{error}</h2>
                    <button 
                        className="back-button"
                        onClick={() => router.push("/student")}
                    >
                        Back to Courses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="course-container">
            {/* HEADER */}
            <div className="course-header">
                <button 
                    className="back-button-header"
                    onClick={() => router.push("/student")}
                    title="Back to student dashboard"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                    Back
                </button>
                <div className="header-content">
                    <h1>{course?.title || "Course Lectures"}</h1>
                    {course?.code && (
                        <p className="course-code-badge">{course.code}</p>
                    )}
                </div>
                {course?.description && (
                    <p className="course-description">{course.description}</p>
                )}
            </div>

            {/* CONTENT */}
            <div className="course-content">
                <section className="lectures-section">
                    <div className="section-header">
                        <h2>Course Materials</h2>
                        <p>{lectures.length} lecture{lectures.length !== 1 ? "s" : ""}</p>
                    </div>

                    {lectures.length === 0 ? (
                        <div className="empty-state">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                            </svg>
                            <h3>No lectures available</h3>
                            <p>Your instructor hasn't uploaded any materials yet</p>
                        </div>
                    ) : (
                        <div className="lectures-list">
                            {lectures.map((lec, index) => (
                                <div 
                                    key={lec.id || index} 
                                    className="lecture-item"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="lecture-number">{index + 1}</div>
                                    <div className="lecture-content">
                                        <h3>{lec.title}</h3>
                                        {lec.description && (
                                            <p className="lecture-description">{lec.description}</p>
                                        )}
                                        <div className="lecture-meta">
                                            {lec.created_at && (
                                                <span className="meta-item">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                                        <line x1="16" y1="2" x2="16" y2="6"/>
                                                        <line x1="8" y1="2" x2="8" y2="6"/>
                                                        <line x1="3" y1="10" x2="21" y2="10"/>
                                                    </svg>
                                                    {new Date(lec.created_at).toLocaleDateString()}
                                                </span>
                                            )}
                                            {lec.file_size && (
                                                <span className="meta-item">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                                                        <polyline points="13 2 13 9 20 9"/>
                                                    </svg>
                                                    {lec.file_size}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {lec.file_url && (
                                        <a 
                                            href={lec.file_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="lecture-link"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                <polyline points="7 10 12 15 17 10"/>
                                                <line x1="12" y1="15" x2="12" y2="3"/>
                                            </svg>
                                            Download
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}