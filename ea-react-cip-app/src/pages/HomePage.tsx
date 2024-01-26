import React from 'react';
import CardComponent from "../components/CustomCard";
import styled from 'styled-components';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const HomePage: React.FC = () => {
  return (
    <>
    <CardComponent 
        title="Another Title" 
        contentTitle="Stage 2" 
        description="Another description here." 
        imageSrc="./path/to/another/image.jpg"
    />

    <GridContainer>
        <CardComponent 
            title="Another Title" 
            contentTitle="Stage 2" 
            description="Another description here." 
            imageSrc="./path/to/another/image.jpg"
        />
        <CardComponent 
            title="Another Title" 
            contentTitle="Stage 2" 
            description="Another description here." 
            imageSrc="./path/to/another/image.jpg"
        />
        <CardComponent 
            title="Another Title" 
            contentTitle="Stage 2" 
            description="Another description here." 
            imageSrc="./path/to/another/image.jpg"
        />
        <CardComponent 
            title="Another Title" 
            contentTitle="Stage 2" 
            description="Another description here." 
            imageSrc="./path/to/another/image.jpg"
        />
    </GridContainer>
    </>
  );
};

export default HomePage;

  
