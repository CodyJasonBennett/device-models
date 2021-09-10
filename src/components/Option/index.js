import classNames from 'classnames';
import { useState, Fragment, useRef, useEffect } from 'react';
import { Transition } from 'react-transition-group';
import Icon from 'components/Icon';
import Button from 'components/Button';
import { useId } from 'hooks';
import { reflow } from 'utils/transition';
import { blurOnMouseUp } from 'utils/focus';
import './index.css';

export const OptionMenuDivider = () => <div className="option-menu__divider"></div>;

export const OptionMenuHeader = ({ children }) => (
  <div className="option-menu__header">{children}</div>
);

export const OptionMenuItem = ({ selected = false, children, ...rest }) => (
  <button
    className="option-menu__menu-item"
    role="menuitemradio"
    aria-checked={selected}
    tabIndex={-1}
    {...rest}
  >
    {selected && <Icon className="option-menu__menu-item-check" icon="check" />}
    <span>{children}</span>
  </button>
);

export const Option = ({ as, className, children, ...rest }) => {
  const parent = useRef();
  const menu = useRef();
  const Component = as || Button;
  const [expanded, setExpanded] = useState(false);
  const [offset, setOffset] = useState();
  const id = useId();
  const optionId = `optionMenu-button-${id}`;

  useEffect(() => {
    if (!expanded || offset) return;

    const optionRef = parent.current;
    const menuRef = menu.current;
    if (!optionRef || !menuRef) return;

    const top = optionRef.offsetTop - menuRef.clientHeight - 8;
    const left = optionRef.offsetLeft + optionRef.clientWidth - menuRef.clientWidth;

    setOffset({ top, left });
  }, [expanded, offset]);

  const onClick = event => {
    event.preventDefault();
    event.stopPropagation();

    const handleClick = () => {
      setExpanded(!expanded);
      document.removeEventListener('click', handleClick);
    };

    document.addEventListener('click', handleClick);
    setExpanded(!expanded);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  };

  return (
    <Fragment>
      <div className="option-menu" ref={parent}>
        <Component
          aria-haspopup
          aria-expanded={expanded}
          className={classNames('option-menu__button', className)}
          id={optionId}
          onClick={onClick}
          onMouseUp={blurOnMouseUp}
          {...rest}
        />
      </div>
      {expanded && (
        <Transition in={true} timeout={0} onEnter={reflow}>
          {status => (
            <div
              ref={menu}
              className={classNames(
                'option-menu__menu-container',
                `option-menu__menu-container--${status}`
              )}
              role="menu"
              tabIndex={-1}
              aria-labelledby={optionId}
              onClick={onClick}
              style={offset}
            >
              {children}
            </div>
          )}
        </Transition>
      )}
    </Fragment>
  );
};
