import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaTimes  } from 'react-icons/fa';
import "./Navbar.css";  

const Navbar = ({ userName, setUserName }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUserName(parsedUser.userName);
    }
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, [setUserName]);

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        localStorage.setItem("profileImage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfileImage(null);
    localStorage.removeItem("profileImage");
  };

  return (
    <div className="navbar">
      <div className="logo-container">
        <img src="/logo.png" alt="Logo" className="logo" />
      </div>

      <div className="app-name">
        <h1>AGE-CALCULATOR</h1>
      </div>

      <div className="account-section">
        <div className="account-icon" onClick={toggleDropdown}>
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="profile-thumbnail" />
          ) : (
        <FaUserCircle size={30}/>
          )}
        </div>
      
        {showDropdown && (
          <div className="dropdown-menu">
            <FaTimes className="close-icon" onClick={toggleDropdown} />

            <div className="dropdown-profile" onClick={handleIconClick}>
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="profile-icon" />
              ) : (
                <FaUserCircle className="profile-icon" size={40} />
              )}
              <p className="username">{userName || "Welcome User"}</p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />

            {profileImage && (
              <button className="remove-btn" onClick={handleRemovePhoto}>🗑 Remove Photo</button>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;