import React from 'react';
import styled from 'styled-components';

const MainContainer = styled.div`

  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  padding: 6px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(0.5rem);
  margin-left: ${props => props.left ? `${props.left}rem` : 'auto'};
  margin-top: ${props => props.top ? `${props.top}rem` : 'auto'};
  width: ${props => props.width ? `${props.width}rem` : 'auto'};
  height: ${props => props.height ? `${props.height}rem` : 'auto'};  
  &:hover {
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
    
  }
`;

const Title = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  textAlign: center;
`;

const ContentContainer = styled.div`
  display: grid;
  align-items: center; // Centers items vertically in the container
  justify-content: center; // Centers items horizontally in the container

`;

interface DashboardCardProps {
    title: string;
    children?: React.ReactNode;
    width: number;
    height: number;
    left: number;
    top: number;
}

const DashboardCardComponent: React.FC<DashboardCardProps> = ({ title, width, height, left, top, children }) => {
    return (
        <MainContainer width={width} height={height} left={left} top={top}>
          <ContentContainer>
            <Title>{title}</Title>
            {children}
          </ContentContainer>
        </MainContainer>
    );
};

export default DashboardCardComponent;
