// Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

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
