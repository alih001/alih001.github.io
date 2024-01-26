// routes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Tables from "./pages/Tables";
import HomePage from "./pages/HomePage";
import SummaryDashboard from "./pages/SummaryDashboard";
import SystemsThinking from "./pages/SystemsThinking";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Tables" element={<Tables />} />
            <Route path="/SummaryDashboard" element={<SummaryDashboard />} />
            <Route path="/SystemsThinking" element={<SystemsThinking />} />
        </Routes>
    );
};

export default AppRoutes;
