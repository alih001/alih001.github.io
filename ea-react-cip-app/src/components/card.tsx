import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

interface MuiCardProps {
  imageSrc: string;
  title: string;
  description: string;
}

const MuiCardComponent: React.FC<MuiCardProps> = ({ imageSrc, title, description }) => {
  return (
    <Card>
      {/* <CardActionArea> */}
        <CardMedia
          component="img"
          image={imageSrc}
          alt="card image"
          sx={{ width: 75, height: 75, objectFit: 'cover' }} // Set the desired width and height
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      {/* </CardActionArea> */}
    </Card>
  );
}

export default MuiCardComponent;
