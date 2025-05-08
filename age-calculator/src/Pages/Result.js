import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Result.css";

const Result = ({ userName }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dob, ageDate ,error} = location.state || {};

  if (error) {
    return (
      <div>
        <Navbar userName={userName} />
        <h2>{error}</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
        <Footer />
      </div>
    );
  }

  if (!dob || !ageDate) {
    return (
      <div>
        <h2>Invalid Access</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const calculateAge = () => {
    const dobDate = new Date(dob);
    const current = new Date(ageDate);

    let years = current.getFullYear() - dobDate.getFullYear();
    let months = current.getMonth() - dobDate.getMonth();
    let days = current.getDate() - dobDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(current.getFullYear(), current.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalMonths = years * 12 + months;
    const totalDays = Math.floor((current - dobDate) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    return { years, months, days, totalMonths, totalWeeks, totalDays, totalHours, totalMinutes, totalSeconds };
  };

  const result = calculateAge();

  return (
    <div className="main-container">
      <Navbar userName={userName} />
      <main className="main-content">
      <div className="content-box">
        <h2>Age Result</h2>

        <div className="result-section">
          <p><strong>Age:</strong> {result.years} years {result.months} months {result.days} days</p>
          <p>or {result.totalMonths} months</p>
          <p>or {result.totalWeeks} weeks</p>
          <p>or {result.totalDays} days</p>
          <p>or {result.totalHours} hours</p>
          <p>or {result.totalMinutes} minutes</p>
          <p>or {result.totalSeconds} seconds</p>
        </div>

        <button onClick={() => navigate(-1)}>👈Calculate Again</button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Result;
