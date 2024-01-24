// Sidebar.tsx
import React from 'react';
import styled from 'styled-components';
import {AiFillDashboard, AiOutlineMessage, AiOutlineCloseCircle } from "react-icons/ai"; // Example icons
import { TbUniverse } from "react-icons/tb";
import '../styles/sidebar.css'

const Sidebar = ({ activeOption, setActiveOption, onClose }) => {
  return (
    <div className='sidebar-section'>
      <div className="top">
        <div className="brand">
          <AiFillDashboard />
          <span>Overview</span>
        </div>
        <div className="links">
          <ul>
            <li
              className={activeOption === 'text' ? "active" : ""}
              onClick={() => setActiveOption('text')}
            >
              <a href="#">
                <AiOutlineMessage />
                <span>Summary Outputs</span>
              </a>
            </li>
            <li
              className={activeOption === 'nodes' ? "active" : ""}
              onClick={() => setActiveOption('nodes')}
            >
              <a href="#">
              <TbUniverse />
                <span>Systems thinking</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div onClick={onClose} className="logout">
            <a href="#">
            <AiOutlineCloseCircle />
                <span>Close Dashboard</span>
            </a>
        </div>
    </div>
  );
};

export default Sidebar;
