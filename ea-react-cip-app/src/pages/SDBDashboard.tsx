import React from "react";
import styled from "styled-components";
import { Button } from "react-bootstrap";
import SDBExcelFileUpload from "../components/sdb_components/SDBFileUpload";

const HeroSection = styled.section`
  background-position: center, bottom left;
  background-size: cover, cover;
  height: fit-content;
  color: #3c474b;
  padding: 3rem 23rem 1rem;
  .heroInner {
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
  }
  span {
    max-width: 80%;
  }
  h1 {
    font-weight: 900;
    font-size: clamp(2rem, 5.5vw, 3.25rem);
    line-height: 1.2;
    margin-bottom: 1.5rem;
  }
`;

const Background = styled.div`
  background-image: url("./src/assets/images/home_page_background.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 100vh;
`;

const DashboardSection = styled.div`
  background-color: rgba(255, 255, 255, 1);
  border-radius: 15px;
  margin-top: 1.5rem;
`;

const SDBDashboard: React.FC = () => {
  return (
    <div>
      <Background>
        <HeroSection className="light hero">
          <div className="heroInner">
            <span>
              <h1>Supply-Demand Dashboard</h1>
            </span>
          </div>
        </HeroSection>

        <DashboardSection>
          <SDBExcelFileUpload />
          {/* <Button variant="primary">View Data</Button> */}
        </DashboardSection>
      </Background>
    </div>
  );
};

export default SDBDashboard;
