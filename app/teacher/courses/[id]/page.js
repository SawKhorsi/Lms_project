"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import "./teacher-course.css";

export default function TeacherCoursePage() {
    const params = useParams();
    const router = useRouter();
    const courseId = Number(params.id);

    const [user, setUser] = useState(null);
    const [course, setCourse] = useState(null);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [lectures, setLectures] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));

        if (!userData || userData.role !== "teacher") {
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
                setPageLoading(false);
                return;
            }

            if (data.course) {
                setCourse(data.course);
            }

            setLectures(data.lectures || data || []);
        } catch (err) {
            console.error("Failed to fetch course:", err);
            setError("Failed to load course");
        } finally {
            setPageLoading(false);
        }
    }

    async function uploadLecture(e) {
        e.preventDefault();

        if (!file) {
            setError("Please select a file");
            return;
        }

        if (!title.trim()) {
            setError("Please enter a lecture title");
            return;
        }

        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const userData = JSON.parse(localStorage.getItem("user"));

            if (!userData) {
                router.push("/login");
                return;
            }

            // Step 1: Upload file
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const uploadData = await uploadRes.json();

            if (!uploadRes.ok || uploadData.error) {
                setError(uploadData.error || "Failed to upload file");
                setIsLoading(false);
                return;
            }

            // Step 2: Save lecture to database
            const lectureRes = await fetch("/api/lectures", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    file_url: uploadData.file_url,
                    course_id: courseId,
                    teacher_id: userData.id,
                }),
            });

            const lectureData = await lectureRes.json();

            if (!lectureRes.ok || lectureData.error) {
                setError(lectureData.error || "Failed to save lecture");
                setIsLoading(false);
                return;
            }

            setSuccess("Lecture uploaded successfully!");
            setTitle("");
            setDescription("");
            setFile(null);

            setTimeout(() => {
                fetchCourseDetails();
                setSuccess("");
            }, 1500);

        } catch (err) {
            console.error("Upload error:", err);
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    }

    if (pageLoading) {
        return (
            <div className="teacher-course-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading course...</p>
                </div>
            </div>
        );
    }

    if (error && !lectures.length) {
        return (
            <div className="teacher-course-container">
                <div className="error-state">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 7v5M12 16h.01" fill="white"/>
                    </svg>
                    <h2>{error}</h2>
                    <button 
                        className="back-button"
                        onClick={() => router.push("/teacher")}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="teacher-course-container">
            {/* HEADER */}
            <div className="teacher-course-header">
                <button 
                    className="back-button-header"
                    onClick={() => router.push("/teacher")}
                    title="Back to teacher dashboard"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                    Back
                </button>
                <div className="header-content">
                    <h1>{course?.title || "Course Management"}</h1>
                    {course?.course_code && (
                        <p className="course-code-display">{course.course_code}</p>
                    )}
                </div>
            </div>

            {/* CONTENT */}
            <div className="teacher-course-content">
                {/* UPLOAD SECTION */}
                <section className="upload-section">
                    <div className="section-header">
                        <h2>Upload Lecture Material</h2>
                        <p>Add course content for your students</p>
                    </div>

                    <form onSubmit={uploadLecture} className="upload-form">
                        <div className="form-group">
                            <label htmlFor="title">Lecture Title</label>
                            <input
                                id="title"
                                type="text"
                                placeholder="e.g., Introduction to Variables"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    setError("");
                                }}
                                disabled={isLoading}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description (Optional)</label>
                            <textarea
                                id="description"
                                placeholder="Add notes or description for this lecture..."
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    setError("");
                                }}
                                disabled={isLoading}
                                className="form-textarea"
                                rows={3}
                            />
                        </div>

                        <div className="file-input-wrapper">
                            <label htmlFor="file">Select File</label>
                            <div 
                                className="file-input-custom"
                                onClick={() => document.getElementById('file')?.click()}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="17 8 12 3 7 8"/>
                                    <line x1="12" y1="3" x2="12" y2="15"/>
                                </svg>
                                <input
                                    id="file"
                                    type="file"
                                    onChange={(e) => {
                                        setFile(e.target.files[0]);
                                        setError("");
                                    }}
                                    disabled={isLoading}
                                    className="file-input-hidden"
                                />
                                <span className="file-label">
                                    {file ? file.name : "Click to select file or drag and drop"}
                                </span>
                            </div>
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

                        <button type="submit" className="upload-button" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="button-spinner"></span>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                        <polyline points="17 8 12 3 7 8"/>
                                        <line x1="12" y1="3" x2="12" y2="15"/>
                                    </svg>
                                    Upload Lecture
                                </>
                            )}
                        </button>
                    </form>
                </section>

                {/* LECTURES SECTION */}
                <section className="lectures-section">
                    <div className="section-header">
                        <h2>Course Materials</h2>
                        <p>{lectures.length} lecture{lectures.length !== 1 ? "s" : ""} uploaded</p>
                    </div>

                    {lectures.length === 0 ? (
                        <div className="empty-state">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                            </svg>
                            <h3>No lectures yet</h3>
                            <p>Upload your first lecture using the form above</p>
                        </div>
                    ) : (
                        <div className="lectures-grid">
                            {lectures.map((lec, index) => (
                                <div 
                                    key={lec.id || index} 
                                    className="lecture-card"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="lecture-header">
                                        <div className="lecture-number">{index + 1}</div>
                                        <div className="lecture-title-wrapper">
                                            <h3>{lec.title}</h3>
                                            {lec.created_at && (
                                                <p className="lecture-date">
                                                    {new Date(lec.created_at).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {lec.description && (
                                        <p className="lecture-description">{lec.description}</p>
                                    )}

                                    {lec.file_url && (
                                        <a 
                                            href={lec.file_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="lecture-link-teacher"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                <polyline points="7 10 12 15 17 10"/>
                                                <line x1="12" y1="15" x2="12" y2="3"/>
                                            </svg>
                                            Open File
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