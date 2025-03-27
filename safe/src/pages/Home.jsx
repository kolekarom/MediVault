import React from "react";
import { Link } from "react-router-dom";

import "./Home.css";
import logo from "../data/logo.svg";
import stethoscope from "../data/stethoscope.png";
import down from "../data/upload.svg";
import user from "../data/user.svg";
import tick from "../data/tick.svg";
import store from "../data/store.png";
import doc from "../data/doc.svg";
import disease from "../data/disease.png";

const servicesData = [
  {
    title: "Register Yourself",
    img: user,
    desc: "Register yourself to the locker, secured by blockchain technology."
  },
  {
    title: "Authenticate Yourself",
    img: tick,
    desc: "Log In with your credentials."
  },
  {
    title: "Upload your Data",
    img: down,
    desc: "Create, update, or view your health record information."
  }
];

const featuresData = [
  {
    title: "Maintaining Medical Records",
    img: store,
    desc: "Keep track of your medical records, enabled by blockchain technology."
  },
  {
    title: "Connect With Doctors",
    img: doc,
    desc: "Share your records with our trusted medical experts, to get a prescription."
  },
  {
    title: "Disease Prediction Model",
    img: disease,
    desc: "Get a quick diagnosis about diseases you might suffer from, based on our ML model."
  }
];

const Home = () => {
  return (
    <div>
      {/* Header Section */}
      <header className="header" id="header">
        <nav className="nav container">
          <div className="logo">
            <img className="logo-img" src={logo} alt="MediVault Logo" />
            <Link to="/" className="nav__logo">
              MediVault
            </Link>
          </div>

          <div className="nav__menu" id="nav-menu">
            <ul className="nav__list">
              {["home", "about", "services", "contact"].map((section) => (
                <li key={section} className="nav__item">
                  <a href={`#${section}`} className="nav__link">
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ display: "flex" }}>
            <Link to="/login" className="button button__header log">
              Log In
            </Link>
            <Link to="/signup" className="button button__header">
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Hero Section */}
        <section className="home section container" id="home">
          <div className="home__container grid">
            <div className="home__data">
              <h1 className="home__title">Health Record System</h1>
              <p className="home__description">
                MediVault is a secure blockchain-based platform for storing
                highly sensitive patient data, shared across multiple facilities
                for effective diagnosis and treatment.
              </p>
              <Link to="/signup" className="button">
                Sign Up Now!
              </Link>
            </div>
            <img className="sto-img" src={stethoscope} alt="Stethoscope" />
          </div>
        </section>

        {/* Get Started Section */}
        <section className="services section container" id="about">
          <h2 className="section__title">Getting started is quick and easy</h2>
          <div className="services__container grid">
            {servicesData.map((service, index) => (
              <div key={index} className="services__data">
                <h3 className="services__subtitle">{service.title}</h3>
                <img className="services__img" src={service.img} alt={service.title} />
                <p className="services__description">{service.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section className="services section container" id="services">
          <h2 className="section__title">Services we deliver</h2>
          <div className="services__container grid">
            {featuresData.map((feature, index) => (
              <div key={index} className="services__data">
                <h3 className="services__subtitle">{feature.title}</h3>
                <img className="services__img" src={feature.img} alt={feature.title} />
                <p className="services__description">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact section container" id="contact">
          <div className="contact__container grid">
            <div className="contact__content">
              <h2 className="section__title-center">Contact Us</h2>
              <p className="contact__description">
                You can contact us via phone, email, or visit us for suggestions and enhancements.
              </p>
            </div>

            <ul className="contact__content grid">
              <li className="contact__address">
                Telephone: <span className="contact__information">+91 9129916977</span>
              </li>
              <li className="contact__address">
                Email: <span className="contact__information">virajchandra51@gmail.com</span>
              </li>
              <li className="contact__address">
                Location:{" "}
                <span className="contact__information">
                  NIT Raipur, Amanaka, Raipur, Chhattisgarh 492010
                </span>
              </li>
            </ul>

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14874.196331166764!2d81.6050291!3d21.2497222!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x21543965c50c43c7!2sNational%20Institute%20of%20Technology(NIT)%2C%20Raipur!5e0!3m2!1sen!2sin!4v1674894759884!5m2!1sen!2sin"
              width="300"
              height="200"
              style={{ border: "0" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="NIT Raipur Map"
            ></iframe>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="footer section">
        <p className="footer__copy">Designed and Developed by The Data-Pirates</p>
        <p className="footer__copy">&#169; MediVault. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
