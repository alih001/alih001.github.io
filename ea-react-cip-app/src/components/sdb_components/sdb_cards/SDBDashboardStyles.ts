import styled from "styled-components";

interface MainCardProps {
  $customwidth?: string;
  $customleft?: string;
}

interface SubCardProps {
  $customwidth?: string;
}

// Container for the entire dashboard (Header, Main Content, Footer)
export const DashboardContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
`;

// Header section (full width)
export const Header = styled.header`
  background: #333;
  color: #fff;
  padding: 1rem;
  text-align: center;
`;

// Footer section (full width)
export const Footer = styled.footer`
  background: #333;
  color: #fff;
  padding: 1rem;
  text-align: center;
`;

// Main content area using a grid layout for MainCards
export const MainContent = styled.main`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px;
`;

// A MainCard that can be used for Controls, Charts, or Asset Overview
export const MainCard = styled.div<MainCardProps>`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  width: ${(props) => props.$customwidth || "auto"};
  margin-left: ${(props) => props.$customleft || "0"};
`;

// A grid container for SubCards, e.g., a 2-column layout for asset details
export const ControlsSubCardGrid = styled.div<SubCardProps>`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 12px;
  width: ${(props) => props.$customwidth || "auto"};
`;

export const AssetsSubCardGrid = styled.div<SubCardProps>`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: ${(props) => props.$customwidth || "auto"};
`;

// A SubCard for displaying individual pieces of information (e.g., an asset card)
export const SubCard = styled.div<SubCardProps>`
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  width: ${(props) => props.$customwidth || "auto"};
`;
