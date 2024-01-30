import React from 'react';
import CardComponent from "../components/CustomCard";
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


const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding:2.5rem
`;

const HomePage: React.FC = () => {
  return (
    <>
    <Background>
      <HeroSection className="light hero">
        <div className="heroInner">
          <span>
            <h1>Thames Weirs Capital Investment Platform</h1>
          </span>
        </div>
      </HeroSection>

      <GridContainer>
        <CardComponent 
            title="Asset Management" 
            contentTitle="Keep track of your asset conditions" 
            description="Use the Capital Investment Platforms built-in tables 
                          to upload asset data and make any updates as needed. 
                          The tables will automatically update results to highlight at-risk assets" 
            iconUrl="./src/assets/images/asset_logo.png"
        />
        <CardComponent 
            title="Investment Planning" 
            contentTitle="Assess a variety of investment portfolios" 
            description="The Capital Investment Platform lets you experiment 
                          with investment portfolios to assess the validity
                          and cost of different scenarios."
            iconUrl="./src/assets/images/investment_logo.png"
        />
        <CardComponent 
            title="Systems Thinking" 
            contentTitle="Understand all factors affecting your assets" 
            description="Use the Systems Mapping functionality of the 
                          Capital Investment Platform to create a systems map
                          of all factors affecting your assets." 
            iconUrl="./src/assets/images/systems_logo.png"
        />
      </GridContainer>
    </Background>
    </>
  );
};

export default HomePage;

  
