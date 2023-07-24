import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

interface MyComponentProps {
  children: ReactNode;
}

const CustomBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100vw', // Set the width to 100% of the viewport width for screens below 'sm' breakpoint
  },
  [theme.breakpoints.up('md')]: {
    width: '100vw', // Set the width to 100% of the viewport width for screens 'md' and above
  },
  margin: '0 auto',
}));

const DefaultBox: React.FC<MyComponentProps> = ({ children }) => {
  return (
    <CustomBox>
      {children}
    </CustomBox>
  );
};

export default DefaultBox;
