import React from "react";
import "./Contributors.css";

const Contributors = () => {
  const contributors = [
    {
      name: "Professor Jaime Davila",
      title: "Professor & Project Advisor",
      role: "Computer Science Department",
      contact: "https://www.linkedin.com/in/jaime-davila-379a9277/",
      image: "/images/jaime.jpeg",
    },
    {
      name: "Fuming Zhang",
      title: "Lead Software Engineer",
      contact: "https://www.linkedin.com/in/fuming-zhang-951a09290/",
      image: "/images/fuming.png",
    },
    {
      name: "Marco Diaz Moore",
      title: "Cloud Consultant",
      contact: "https://www.linkedin.com/in/marco-diaz-moore-9a7188221/",
      image: "/images/marco.png",
    },
    {
      name: "Eduardo Shibata",
      title: "Lead Backend Developer",
      contact: "http://linkedin.com/in/eduardo-shibata-6555b2256/",
      image: "/images/eduardo.png",
    },
    {
      name: "Atharve Pandey",
      title: "Backend Developer",
      contact: "https://www.linkedin.com/in/atharve-pandey-359ab8200/",
      image: "/images/atharve.png",
    },
    {
      name: "Brian Nguyen",
      title: "Backend Developer",
      contact: "https://www.linkedin.com/in/brian-nguyen-040915254/",
      image: "/images/brian2.jpeg",
    },
    {
      name: "Sahil",
      title: "Backend Developer",
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
