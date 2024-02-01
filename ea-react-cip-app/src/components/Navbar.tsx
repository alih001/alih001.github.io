// Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

const CustomSidebar = () => {
  return (
    <Sidebar style={{ height: "100vh" }}>
      <Menu
        menuItemStyles={{
          button: {
            [`&.active`]: {
              backgroundColor: '#13395e',
              color: '#b6c8d9',
            },
          },
        }}
      >
        <MenuItem component={<Link to="/" />}> Home Page</MenuItem>
        <MenuItem component={<Link to="/Tables" />}> Tables</MenuItem>
        <MenuItem component={<Link to="/SystemsThinking" />}> Systems Thinking</MenuItem>
        <SubMenu label = "Dashboards">
          <MenuItem component={<Link to="/AssetDashboard" />}> Asset Dashboard</MenuItem>
          <MenuItem component={<Link to="/CostDashboard" />}> Cost Dashboard</MenuItem>
          <MenuItem component={<Link to="/SystemDashboard" />}> System Dashboard</MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
};

export default CustomSidebar;
