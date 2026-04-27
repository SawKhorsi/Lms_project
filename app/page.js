"use client"
import React, { useState } from 'react'
import Link from 'next/link'

export default function page() {
  const [hoveredCard, setHoveredCard] = useState(null)

  const features = [
    {
      icon: '📚',
      title: 'Comprehensive Courses',
      description: 'Access thousands of high-quality courses across multiple subjects and skill levels.'
    },
    {
      icon: '👨‍🏫',
      title: 'Expert Instructors',
      description: 'Learn from industry professionals and experienced educators dedicated to your success.'
    },
    {
      icon: '🎯',
      title: 'Personalized Learning',
      description: 'Customize your learning path based on your goals, pace, and learning style.'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Monitor your progress with detailed analytics and performance insights.'
    },
    {
      icon: '🏆',
      title: 'Certifications',
      description: 'Earn recognized certifications to showcase your skills to employers.'
    },
    {
      icon: '🌍',
      title: 'Global Community',
      description: 'Connect with learners worldwide and expand your professional network.'
    }
  ]

  return (
    <div className="container">
      {/* Navigation */}
      <nav className="navbar">
        <Link href="/" className="logo">
          <div className="logo-icon">L</div>
          <div className="logo-text">EduHub</div>
        </Link>
        
        <div className="nav-buttons">
          <Link href="/login" className="nav-btn">Log In</Link>
          <Link href="/register" className="nav-btn nav-btn-primary">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-blob hero-blob-1"></div>
        <div className="hero-blob hero-blob-2"></div>
        
        <div className="hero-content">
          <h1 className="hero-title">Welcome to EduHub</h1>
          
          <p className="hero-subtitle">Transform your learning experience. Explore courses, master new skills, and achieve your educational goals with our innovative learning platform.</p>

          <div className="hero-buttons">
            <Link href="/login" className="hero-btn hero-btn-primary">Sign In Now</Link>
            <Link href="/register" className="hero-btn hero-btn-secondary">Create Account</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2 className="features-title">Why Choose EduHub?</h2>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`feature-card ${hoveredCard === index ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 EduHub. All rights reserved. | Ready to start learning?</p>
      </footer>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #1a1a1a;
        }

        /* Navigation */
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          background-color: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: #1a1a1a;
          cursor: pointer;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 20px;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .logo-text {
          font-size: 20px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-buttons {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .nav-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          border: 1px solid #ddd;
          background-color: transparent;
          color: #1a1a1a;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .nav-btn:hover {
          background-color: #f5f5f5;
          border-color: #999;
        }

        .nav-btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .nav-btn-primary:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        /* Hero Section */
        .hero {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          position: relative;
          overflow: hidden;
          min-height: 70vh;
        }

        .hero-blob {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
          animation: float 6s ease-in-out infinite;
        }

        .hero-blob-1 {
          width: 400px;
          height: 400px;
          top: -50px;
          left: -50px;
        }

        .hero-blob-2 {
          width: 300px;
          height: 300px;
          bottom: -30px;
          right: -30px;
          animation: float 8s ease-in-out infinite;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 700px;
          text-align: center;
          color: white;
          animation: slideInUp 0.8s ease-out;
        }

        .hero-title {
          font-size: clamp(2.5rem, 8vw, 3.5rem);
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          letter-spacing: -1px;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.95;
          line-height: 1.6;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .hero-btn {
          padding: 1rem 2.5rem;
          border-radius: 8px;
          border: none;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .hero-btn-primary {
          background-color: white;
          color: #667eea;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .hero-btn-primary:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        }

        .hero-btn-secondary {
          background-color: rgba(255, 255, 255, 0.2);
          border: 2px solid white;
          color: white;
        }

        .hero-btn-secondary:hover {
          background-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-4px);
        }

        /* Features Section */
        .features {
          padding: 4rem 2rem;
          background-color: #f9f9f9;
        }

        .features-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .features-title {
          font-size: clamp(2rem, 6vw, 2.5rem);
          font-weight: 700;
          text-align: center;
          margin-bottom: 3rem;
          color: #1a1a1a;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background-color: white;
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid #eee;
          transition: all 0.3s ease;
          cursor: pointer;
          animation: fadeIn 0.6s ease-out backwards;
        }

        .feature-card:nth-child(1) { animation-delay: 0.1s; }
        .feature-card:nth-child(2) { animation-delay: 0.2s; }
        .feature-card:nth-child(3) { animation-delay: 0.3s; }
        .feature-card:nth-child(4) { animation-delay: 0.4s; }
        .feature-card:nth-child(5) { animation-delay: 0.5s; }
        .feature-card:nth-child(6) { animation-delay: 0.6s; }

        .feature-card.hovered {
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.15);
          transform: translateY(-5px);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .feature-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #1a1a1a;
        }

        .feature-description {
          font-size: 0.95rem;
          color: #666;
          line-height: 1.6;
        }

        /* Footer */
        .footer {
          padding: 2rem;
          background-color: #1a1a1a;
          color: white;
          text-align: center;
          font-size: 0.9rem;
        }

        .footer p {
          margin: 0;
        }

        /* Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .navbar {
            padding: 1rem 1.5rem;
          }

          .nav-buttons {
            gap: 0.5rem;
          }

          .nav-btn {
            padding: 0.5rem 1rem;
            font-size: 13px;
          }

          .hero-content {
            padding: 0 1rem;
          }

          .hero-title {
            margin-bottom: 1rem;
          }

          .hero-subtitle {
            font-size: 1rem;
            margin-bottom: 1.5rem;
          }

          .hero-btn {
            padding: 0.75rem 1.5rem;
            font-size: 14px;
          }

          .features {
            padding: 3rem 1.5rem;
          }

          .features-title {
            margin-bottom: 2rem;
          }

          .features-grid {
            gap: 1.5rem;
          }

          .feature-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}
