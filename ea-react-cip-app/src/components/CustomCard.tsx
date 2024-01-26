import React from 'react';
import styled from 'styled-components';

const MainContainer = styled.div`
  width: 400px;
  background-color: white;
  color: gray-200; /* Adjust for dark mode. */
  border-radius: 15px;
  padding: 6px;
  margin: 3px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  &:hover {
    drop-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
  }
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
`;

const IconButton = styled.button`
  font-size: 1.5rem;
  font-weight: 600;
  color: gray-500;
  background: none;
  border: none;
  cursor: pointer;
`;

const ImageContainer = styled.div`
  margin-top: 2.5rem;
`;

const Image = styled.img`
  width: 24rem; /* Adjust for md:w-96 */
  height: 50px;
`;

const ContentContainer = styled.div`
  margin-top: 2rem;
`;

const ContentTitle = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
`;

const Description = styled.p`
  color: gray-400;
`;

interface CardProps {
    title: string;
    contentTitle: string;
    description: string;
    imageSrc?: string;
}

const CardComponent: React.FC<CardProps> = ({ title, contentTitle, description, imageSrc }) => {
    return (
        <MainContainer>
            <FlexContainer>
                <Title>{title}</Title>
                <IconButton>
                    {/* SVG icon can be added here */}
                </IconButton>
            </FlexContainer>
            <ImageContainer>
                {imageSrc && <Image src={imageSrc} alt="Card Image" />}
                <ContentContainer>
                    <ContentTitle>{contentTitle}</ContentTitle>
                    <Description>{description}</Description>
                </ContentContainer>
            </ImageContainer>
        </MainContainer>
    );
};

export default CardComponent;
