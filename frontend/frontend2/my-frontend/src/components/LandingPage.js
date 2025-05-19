import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Contributors from "./Contributors";
import "./LandingPage.css";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { loginRequest } from "../auth-config";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const { instance } = useMsal();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition < 100);

      // Update active section based on scroll position
      const sections = ["hero", "features", "dining-halls", "contributors"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80; // Adjust this value based on your header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const diningHalls = [
    {
      name: "Worcester Commons",
      description:
        "The largest dining commons on campus, featuring diverse culinary options and innovative stations",
      image: "/images/worcestor_dining_hall.jpg",
      link: "https://umassdining.com/locations-menus/worcester",
    },
    {
      name: "Franklin Dining Commons",
      description:
        "Known for its innovative menu, sustainable practices, and fresh local ingredients",
      image: "/images/frank_dining_hall.jpg",
      link: "https://umassdining.com/locations-menus/franklin",
    },
    {
      name: "Hampshire Dining Commons",
      description:
        "Offering fresh, locally-sourced ingredients and international cuisine in a modern setting",
      image: "/images/hampshire _dining_hall.jpg",
      link: "https://umassdining.com/locations-menus/hampshire",
    },
    {
      name: "Berkshire Dining Commons",
      description:
        "Home to the famous UMass Bakery and made-to-order stations with personalized service",
      image: "/images/berkshire _dining_hall.jpg",
      link: "https://umassdining.com/locations-menus/berkshire",
    },
  ];

  const handleLogin = async () => {
    try {
      const response = await instance.loginRedirect(loginRequest);
      const account = response.account;

      // After successful MSAL login, call our backend to create/authenticate user
      const backendResponse = await fetch(
        "http://localhost:8000/api/msal-callback/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            msal_user_id: account.localAccountId,
            email: account.username,
            display_name: account.name,
          }),
        }
      );

      if (!backendResponse.ok) {
        throw new Error("Failed to authenticate with backend");
      }

      const userData = await backendResponse.json();
      console.log("Backend authentication successful:", userData);

      // Navigate to the allergy filter page after successful authentication
      navigate("/allergy-filter");
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const activeAccount = instance.getAllAccounts()[0];

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  return (
    <div className="landing-page">
      <div>
        <AuthenticatedTemplate>
          {activeAccount ? <Navigate to="/allergy-filter" /> : null}
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <button className="login-button" onClick={handleLogin}>
            Login
          </button>
        </UnauthenticatedTemplate>
      </div>

      <nav className="side-nav">
        <ul>
          <li>
            <button
              className={`nav-item ${activeSection === "hero" ? "active" : ""}`}
              onClick={() => scrollToSection("hero")}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className={`nav-item ${
                activeSection === "features" ? "active" : ""
              }`}
              onClick={() => scrollToSection("features")}
            >
              Features
            </button>
          </li>
          <li>
            <button
              className={`nav-item ${
                activeSection === "dining-halls" ? "active" : ""
              }`}
              onClick={() => scrollToSection("dining-halls")}
            >
              Dining Halls
            </button>
          </li>
          <li>
            <button
              className={`nav-item ${
                activeSection === "contributors" ? "active" : ""
              }`}
              onClick={() => scrollToSection("contributors")}
            >
              Contributors
            </button>
          </li>
        </ul>
      </nav>

      <section id="hero" className="hero">
        <div className="hero-content">
          <img
            src="/images/umass_logo.png"
            alt="UMass Logo"
            className="umass-logo"
          />
          <h1>UMass Meal Planner</h1>
          <p>Your personalized dining companion for the UMass Amherst campus</p>
          <button onClick={() => navigate("/login")} className="cta-button">
            Start Planning Your Meals
          </button>
        </div>
        {isVisible && (
          <div
            className="scroll-indicator"
            onClick={() => scrollToSection("features")}
          >
            <span>Scroll to explore</span>
          </div>
        )}
      </section>

      <section id="features" className="features">
        <h2>Why Choose Our Meal Planner?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Smart Meal Planning</h3>
            <p>
              Discover delicious options across all four dining commons with
              personalized suggestions based on your preferences and nutritional
              goals.
            </p>
          </div>
          <div className="feature-card">
            <h3>Allergy Safe</h3>
            <p>
              Stay safe with comprehensive allergen filtering and dietary
              restriction support across all dining locations. Your health is
              our priority.
            </p>
          </div>
          <div className="feature-card">
            <h3>Nutrition Tracking</h3>
            <p>
              Monitor your daily nutritional goals while enjoying the diverse
              culinary options at UMass. Make informed choices about your meals.
            </p>
          </div>
        </div>
      </section>

      <section id="dining-halls" className="dining-halls">
        <h2>Available Dining Locations</h2>
        <div className="dining-halls-grid">
          {diningHalls.map((hall, index) => (
            <a
              key={index}
              href={hall.link}
              target="_blank"
              rel="noopener noreferrer"
              className="dining-hall-card"
            >
              <div className="dining-hall-image">
                <img src={hall.image} alt={hall.name} />
              </div>
              <div className="dining-hall-info">
                <h3>{hall.name}</h3>
                <p>{hall.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <AuthenticatedTemplate>
        <button onClick={handleLogout}>Logout</button>
      </AuthenticatedTemplate>

      <Contributors />
    </div>
  );
};

export default LandingPage;
