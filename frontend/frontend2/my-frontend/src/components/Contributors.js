import React from "react";
import "./Contributors.css";

const Contributors = () => {
  const contributors = [
    {
      name: "Professor Jaime Davila",
      title: "Professor & Project Advisor",
      role: "Computer Science Department",
      contact: "contact",
      image: "/images/professor.png",
    },
    {
      name: "Fuming Zhang",
      title: "Lead Software Engineer",
      role: "role",
      contact: "https://www.linkedin.com/in/fuming-zhang-951a09290/",
      image: "/images/fuming.png",
    },
    {
      name: "Arvind Udayabanu",
      title: "Frontend Developer",
      role: "role",
      contact: "contact",
      image: "/images/arvind.png",
    },
    {
      name: "Eduardo Shibata",
      title: "Lead Backend Developer",
      role: "role",
      contact: "contact",
      image: "/images/eduardo.png",
    },
    {
      name: "Atharve Pandey",
      title: "Backend Developer",
      role: "role",
      contact: "https://www.linkedin.com/in/atharve-pandey-359ab8200/",
      image: "/images/atharve.png",
    },
    {
      name: "Brian Nguyen",
      title: "Backend Developer",
      role: "role",
      contact: "https://www.linkedin.com/in/brian-nguyen-040915254/",
      image: "/images/brian.png",
    },
    {
      name: "Sahil",
      title: "Backend Developer",
      role: "role",
      contact: "https://www.linkedin.com/in/sahil-gulati-b991a62a2/",
      image: "/images/sashil.png",
    },
  ];

  const handleContactClick = (contact) => {
    if (contact !== "contact") {
      window.open(contact, "_blank");
    }
  };

  return (
    <section id="contributors" className="contributors-section">
      <div className="contributors-container">
        <h2>Contributors!</h2>
        <div className="contributors-grid">
          {contributors.map((contributor, index) => (
            <div key={index} className="contributor-card">
              <div className="contributor-image-container">
                <div className="contributor-image-circle">
                  <img
                    src={contributor.image}
                    alt={contributor.name}
                    className="contributor-image"
                  />
                </div>
              </div>
              <div className="contributor-info">
                <h3>{contributor.name}</h3>
                <p className="title">{contributor.title}</p>
                <p className="role">{contributor.role}</p>
                <p
                  className={`contact ${
                    contributor.contact !== "contact" ? "clickable" : ""
                  }`}
                  onClick={() => handleContactClick(contributor.contact)}
                >
                  {contributor.contact === "contact"
                    ? "Contact"
                    : "LinkedIn Profile"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contributors;
