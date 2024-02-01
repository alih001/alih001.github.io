import React from 'react';
import styled from 'styled-components';

const HeroSection = styled.section`
  background-position: center, bottom left;
  background-size: cover, cover;
  height: fit-content;
  color: #3C474B;
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
  background-image: url('./src/assets/images/home_page_background.png');
  background-size: cover;
  background-repeat: no-repeat; 
  background-position: center; 
  min-height: 100vh;
`;

const SystemDashboard: React.FC = () => (
	<Background>
		<HeroSection className="light hero">
			<div className="heroInner">
				<span>
				<h1>Systems Dashboard</h1>
				</span>
			</div>
		</HeroSection>
	</Background>
);

export default SystemDashboard;