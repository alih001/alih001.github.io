// components/Navbar.tsx
import React from 'react';
import '../styles/Navbar.css'

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar__container">
        <a href="#home" id="navbar__logo"><b>Thames Weirs CIP 2023</b></a>
        <ul className="navbar__menu">
          <li className="navbar__item">
            <a href="#guide" className="navbar__links" id="guide-page">Guide</a>
          </li>
          <li className="navbar__item">
            <a href="#table-link" className="navbar__links" id="table-link-page">All Weirs</a>
          </li>
          <li className="navbar__item">
            <a href="#factors" className="navbar__links" id="factors-page">Factors</a>
          </li>
          <li className="navbar__item">
            <a href="#top10" className="navbar__links" id="top10-page">Top 10</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
