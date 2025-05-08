import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';
import "./Home.css";

import image1 from "../assets/A1.jpg";
import image2 from "../assets/A2.webp";
import image3 from "../assets/A3.webp";

const images = [image1, image2, image3];

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate(); 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
     
      <div className="home-bg" style={{ backgroundImage: `url(${images[currentImage]})` }}></div>

      <div className="home-content">
        <img src={logo} alt="Logo" className="logo" />
        <h1>AGE-<span className="highlight">CALCULATOR</span></h1>
        <p>The Age Calculator can determine the age or interval between two dates. The calculated age will be displayed in years, months, weeks, days, hours, minutes, and seconds.</p>
        <button className="home-button" onClick={() => navigate("/Main")}>
        Calculate Your Age ➔
        </button>
      </div>
      <div className="home-content2">
        <h1></h1>
      </div>
    </div>
  );
};

export default Home;
