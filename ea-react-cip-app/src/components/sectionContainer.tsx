import React, { ReactNode } from 'react';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles'; 

interface MyComponentProps {
  children: ReactNode; 
}

const CustomContainer = styled(Container)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
  },
  [theme.breakpoints.up('md')]: {
    maxWidth: '100%',
  },
  margin: '0 auto',
}));

const DefaultContainer: React.FC<MyComponentProps> = ({ children }) => {
  return (
      <CustomContainer>
        {children}
      </CustomContainer>
  );
};

export default DefaultContainer;
