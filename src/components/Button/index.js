import classNames from 'classnames';
import Icon from 'components/Icon';
import { blurOnMouseUp } from 'utils/focus';
import './index.css';

const Button = ({
  as: Component = 'button',
  className,
  primary,
  iconOnly,
  grey,
  icon,
  children,
  ...rest
}) => (
  <Component
    className={classNames('button', className, {
      'button--primary': primary,
      'button--icon-only': iconOnly,
      'button--grey': grey,
    })}
    onMouseUp={blurOnMouseUp}
    {...rest}
  >
    {!iconOnly && children}
    {icon && <Icon icon={icon} />}
  </Component>
);

export default Button;
