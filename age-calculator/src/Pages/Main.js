import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import "./Main.css";

const Main = ({ userName, setUserName }) => {
  const [dob, setDob] = useState(null);
  const [ageDate, setAgeDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser && loggedInUser.name && !userName) {
      setUserName(loggedInUser.name);
    }
  }, [userName, setUserName]);

  const handleCalculate = () => {
    if (!dob) {
      alert(" ⚠️ Please select your Date of Birth!");
      return;
    }

    const isLeapYear = (year) => {
      return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    };

    const currentDate = new Date();
    if (dob > currentDate) {
      navigate("/result", { state: { error: "❌ Date of Birth cannot be in the future!" } });
      return;
    }

    if (!ageDate) {
      alert("⚠️ Please select the date to calculate your age!");
      return;
    }
  
    const selectedYear = dob.getFullYear();

    if (dob.getMonth() === 1 && dob.getDate() === 29 && !isLeapYear(selectedYear)) {
      const adjustedDob = new Date(dob);
      adjustedDob.setDate(28); 
      alert("ℹ️ You selected February 29th in a non-leap year. It has been adjusted to February 28th.");
      setDob(adjustedDob); 
    }

    navigate("/result", { state: { dob, ageDate } });
  };

  return (
    <div className="main-container">
      <Navbar userName={userName} setUserName={setUserName} />

      <main className="main-content">
       <div className="content-box">
        <h2>Welcome {userName || "Guest"}!</h2>
        <p className="sub-heading">Find your exact age in years, months, days and more</p>

        <div className="form-group">
          <label>Date of Birth:</label>
          <DatePicker
            selected={dob}
            onChange={(date) => setDob(date)}
            dateFormat="MMMM d, yyyy"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            placeholderText="Select DOB"
            maxDate={new Date()}
          />
        </div>

        <div className="form-group">
          <label>Age at the Date of:</label>
          <DatePicker
            selected={ageDate}
            onChange={(date) => setAgeDate(date)}
            dateFormat="MMMM d, yyyy"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            placeholderText="Select a date"
          />
        </div>

        <button className="calculate-btn" onClick={handleCalculate}>
        ➕ Calculate Age
        </button>
      </div>   
    </main>
    <Footer />
  </div>
  );
};

export default Main;