"use client";
import { useEffect, useState } from "react";
import "./student.css";

export default function Student() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    code: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (!userData || userData.role !== "student") {
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

      const res = await fetch(`/api/student/courses?student_id=${userData.id}`);
      const data = await res.json();

      setCourses(data || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError("Failed to load courses");
    }
  }

  async function enroll() {
    if (!form.code.trim() || !form.password.trim()) {
      setError("Please fill in all fields");
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

      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: form.code,
          password: form.password,
          student_id: userData.id,
          role: userData.role,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Failed to enroll");
        setIsLoading(false);
      } else {
        setSuccess("Enrolled successfully! Refreshing courses...");
        setForm({ code: "", password: "" });
        
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
      <div className="student-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-container">
      {/* HEADER */}
      <div className="student-header">
        <div className="header-content">
          <div className="header-welcome">
            <h1>Welcome, {user.name}!</h1>
            <p>Manage your courses and learning journey</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-number">{courses.length}</div>
              <div className="stat-label">Active Courses</div>
            </div>
          </div>
        </div>
      </div>

      <div className="student-content">
        {/* ENROLL SECTION */}
        <section className="enroll-section">
          <div className="section-header">
            <h2>Enroll in a Course</h2>
            <p>Enter the course code and password provided by your instructor</p>
          </div>

          <div className="enroll-card">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="code">Course Code</label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  placeholder="e.g., CS101"
                  value={form.code}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Course Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="form-input"
                />
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

            <button
              className="enroll-button"
              onClick={enroll}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="button-spinner"></span>
                  Enrolling...
                </>
              ) : (
                "Enroll Course"
              )}
            </button>
          </div>
        </section>

        {/* COURSES SECTION */}
        <section className="courses-section">
          <div className="section-header">
            <h2>My Courses</h2>
            {courses.length > 0 && (
              <p>{courses.length} course{courses.length !== 1 ? "s" : ""} enrolled</p>
            )}
          </div>

          {courses.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
              <h3>No courses yet</h3>
              <p>Enroll in a course above to get started</p>
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map((course, index) => (
                <div key={course.id} className="course-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="course-header">
                    <h3>{course.title}</h3>
                    <span className="course-code">{course.code}</span>
                  </div>

                  {course.description && (
                    <p className="course-description">{course.description}</p>
                  )}

                  <div className="course-meta">
                    {course.instructor && (
                      <div className="meta-item">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="8" r="4"/>
                          <path d="M12 14c-6 0-8 3-8 3v6h16v-6s-2-3-8-3z"/>
                        </svg>
                        <span>{course.instructor}</span>
                      </div>
                    )}
                  </div>

                  <a href={`/student/course/${course.id}`} className="course-link">
                    <span>View Lectures</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
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