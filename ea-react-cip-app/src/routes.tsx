// routes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Tables from "./pages/Tables";
import HomePage from "./pages/HomePage";
import AssetDashboard from "./pages/AssetDashboard";
import CostDashboard from "./pages/CostDashboard";
import SystemDashboard from "./pages/SystemDashboard";
import SystemsThinking from "./pages/SystemsThinking";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Tables" element={<Tables />} />
            <Route path="/SystemsThinking" element={<SystemsThinking />} />
            <Route path="/AssetDashboard" element={<AssetDashboard />} />
            <Route path="/CostDashboard" element={<CostDashboard />} />
            <Route path="/SystemDashboard" element={<SystemDashboard />} />
        </Routes>
    );
};

export default AppRoutes;
