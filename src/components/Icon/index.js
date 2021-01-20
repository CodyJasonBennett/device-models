import icons from './icons';
import './index.css';

const Icon = ({ icon, ...rest }) => {
  const IconComponent = icons[icon];

  return <IconComponent className="icon" aria-hidden {...rest} />;
};

export default Icon;
export { icons };
