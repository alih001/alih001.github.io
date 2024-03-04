  import React from 'react';
  import styled from 'styled-components';

  const MainContainer = styled.div`
    width: 400px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 15px;
    padding: 6px;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(0.5rem);
    &:hover {
      box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
    }
`;


  const FlexContainer = styled.div`
    display: flex;
    align-items: center; // Centers items vertically in the container
    justify-content: center; // Centers items horizontally in the container
  `;

  const IconButton = styled.div`
    // Removed margin-top or adjust it as needed
  `;

  const Icon = styled.img`
    width: 5rem;
    height: 5rem;
    margin-right: 10px; // Optional: to give some space between the icon and the title
  `;

  const Title = styled.p`
    font-size: 1.5rem;
    font-weight: 600;
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
      iconUrl?: string;
  }

  const CardComponent: React.FC<CardProps> = ({ title, contentTitle, description, imageSrc, iconUrl }) => {
      return (
          <MainContainer>
            <FlexContainer>
              {iconUrl && (
                <IconButton>
                  <Icon src={iconUrl} alt="Card Icon" />
                </IconButton>
              )}
              <Title>{title}</Title>
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
