import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const DefaultBox = () => {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <Typography variant="h5">Hello, this is inside a Box!</Typography>
      </Box>
    );
  };
  
  export default DefaultBox;