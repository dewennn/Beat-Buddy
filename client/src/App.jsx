import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Main from "./components/Main";
import AboutUs from "./components/AboutUs";

function App(){

    return(
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/about-this" element={<AboutUs />} />
        </Routes>
      </Router>
    )
}

export default App