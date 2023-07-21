import React from 'react';
import '../styles/guideBox.css'
import MuiCardComponent from './card';

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

const MainHeader: React.FC<HeaderProps> = ({ className, imageSrc, title, description }) => {
  return (
    <div className={className}>
      <MuiCardComponent
        imageSrc={imageSrc}
        title={title}
        description={description}
      />
    </div>
  );
};

const SubHeader: React.FC<HeaderProps> = ({ className, imageSrc, title, description, imageSrc2, title2, description2 }) => {
  return (
    <div className={className}>
      <MuiCardComponent
        imageSrc={imageSrc}
        title={title}
        description={description}
      />
      <MuiCardComponent
        imageSrc={imageSrc2 || '/default-image.jpg'}
        title={title2 || 'Default Title'}
        description={description2 || 'Default Description'}
      />
    </div>
  );
};


const Header: React.FC<HeaderProps> = ({ className, imageSrc, title, description, imageSrc2, title2, description2 }) => {
  // You can determine which HOC to use based on the guideStyle prop or any other condition.
  const HeaderComponent = className === 'MainHeader' ? MainHeader : SubHeader;

  // Pass the appropriate props to the selected HOC
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
