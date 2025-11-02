import React from "react";
import Footer from "../components/shared/Footer";
import "./About.css";
import LaptopImage from "../assets/Laptopp.png";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <section className="about-section">
        <div className="about-container">
          <div className="about-text">
            <h1>
              About <span className="highlight">TrackIt</span>
            </h1>
            <p>
              TrackIt is a web-based application designed to help individuals
              manage their personal finances efficiently. It enables users to
              record daily expenses, categorize spending, and set budget goals
              while receiving AI-powered insights that analyze spending patterns
              and suggest smarter money habits.
            </p>
            <p>
              Built for students, employees, and small business owners, the
              system transforms financial management into a clear, data-driven,
              and motivating experience.
            </p>
          </div>
          <div className="about-image">
            <img src={LaptopImage} alt="TrackIt illustration" />
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default About;
