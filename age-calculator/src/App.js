import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Main from "./Pages/Main";
import Result from "./Pages/Result"
import "./App.css";
const App = () => {
  const [userName, setUserName] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<Main userName={userName} />} />
        <Route path="/result" element={<Result userName={userName} />} />
      </Routes>
    </Router>
  );
};

export default App;