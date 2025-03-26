import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaChartLine,
  FaTable,
  FaProjectDiagram,
  FaCogs,
} from "react-icons/fa";

const SidebarContainer = styled.div`
  height: calc(100vh - 40px);
  width: 240px;
  background-color: #222; /* slightly less intense black */
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
`;

const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
`;

const MenuItem = styled.li`
  margin: 8px 12px; /* provides some spacing around the item */

  a {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px; /* inner padding so the blue highlight doesn't run edge-to-edge */
    color: #fff;
    text-decoration: none;
    border-radius: 6px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #3498db; /* blue on hover */
    }

    ${({ active }) =>
      active &&
      `
        background-color: #3498db; /* blue when active */
      `}
  }
`;

const CustomSidebar = () => {
  const location = useLocation();

  return (
    <SidebarContainer>
      <MenuList>
        <MenuItem active={location.pathname === "/"}>
          <Link to="/">
            <FaHome />
            Home Page
          </Link>
        </MenuItem>
        <MenuItem active={location.pathname === "/SDBDashboard"}>
          <Link to="/SDBDashboard">
            <FaChartLine />
            Supply-Demand Dashboard
          </Link>
        </MenuItem>
        <MenuItem active={location.pathname === "/Tables"}>
          <Link to="/Tables">
            <FaTable />
            Tables
          </Link>
        </MenuItem>
        <MenuItem active={location.pathname === "/SystemsThinking"}>
          <Link to="/SystemsThinking">
            <FaProjectDiagram />
            Systems Thinking
          </Link>
        </MenuItem>
        <MenuItem active={location.pathname === "/AssetDashboard"}>
          <Link to="/AssetDashboard">
            <FaCogs />
            Asset Dashboard
          </Link>
        </MenuItem>
        {/* Add additional menu items as needed */}
      </MenuList>
    </SidebarContainer>
  );
};

export default CustomSidebar;
