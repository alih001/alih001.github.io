import React, { useState } from 'react';
import NetworkLinks from '../components/NetworkLinks';
import { useData } from '../contexts/DataContext';
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

const SystemsThinking = () => {

  const { nodes, setNodes } = useData();

  const handleAddNode = (x: number, y: number) => {
      setNodes(prevNodes => [
        ...prevNodes, 
        { id: `node-${prevNodes.length + 1}`, name: `Node ${prevNodes.length + 1}`, x, y }
      ]);
    };
    
  return (

	<div>
    <Background>
      <HeroSection className="light hero">
        <div className="heroInner">
          <span>
            <h1>Systems Planning</h1>
          </span>
        </div>
      </HeroSection>
      <NetworkLinks
          nodes={nodes}
          onAddNode={handleAddNode}
          updateNodes={setNodes}
      />
    </Background>
	</div>
);
}

export default SystemsThinking;