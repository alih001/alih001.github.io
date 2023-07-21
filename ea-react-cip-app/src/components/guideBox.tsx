import React from 'react';
import '../styles/guideBox.css'
import MuiCardComponent from './card';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';

interface HeaderProps {
  className: string;
  imageSrc: string;
  title: string;
  description: string;
  // Sub-header extra props
  imageSrc2?: string;
  title2?: string;
  description2?: string;
}

const MainHeader: React.FC<HeaderProps> = ({imageSrc, title, description}) => {
  return (

    <Box>
      <Grid container spacing={2}>
        <Grid xs={8}>
        <MuiCardComponent
          imageSrc={imageSrc}
          title={title}
          description={description}
        />
        </Grid>
      </Grid>
    </Box>
  );
};

const SubHeader: React.FC<HeaderProps> = ({imageSrc, title, description, imageSrc2, title2, description2 }) => {
  return (

    <Box>
      <Grid container spacing={2}>
        <Grid xs={4}>
          <MuiCardComponent
            imageSrc={imageSrc}
            title={title}
            description={description}
          />
        </Grid>
        <Grid xs={4}>
          <MuiCardComponent
          imageSrc={imageSrc2 || '/default-image.jpg'}
          title={title2 || 'Default Title'}
          description={description2 || 'Default Description'}
          />
        </Grid>
      </Grid>
    </Box>

  );
};


const Header: React.FC<HeaderProps> = ({ className, imageSrc, title, description, imageSrc2, title2, description2 }) => {
  const HeaderComponent = className === 'MainHeader' ? MainHeader : SubHeader;

  return (
    <HeaderComponent
      className={className}
      imageSrc={imageSrc}
      title={title}
      description={description}
      imageSrc2={imageSrc2}
      title2={title2}
      description2={description2}
    />
  );
};

export default Header;
