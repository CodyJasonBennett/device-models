import Icon from 'components/Icon';
import { useId } from 'hooks';
import './index.css';

const Input = ({ style, icon, label, type = 'text', ...rest }) => {
  const id = useId();
  const inputId = `${id}-input`;

  return (
    <div className="input" style={style}>
      {icon && <Icon icon={icon} className="input__icon" />}
      <input
        className="input__element"
        id={inputId}
        aria-label={label}
        type={type}
        {...rest}
      />
    </div>
  );
};

export default Input;
