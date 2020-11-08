import React, { useRef, useState, Fragment } from 'react';
import classNames from 'classnames';
import { Transition } from 'react-transition-group';
import Icon from 'components/Icon';
import { useId } from 'hooks';
import { reflow } from 'utils/transition';
import './index.css';

const Dropdown = ({ options, onChange }) => {
  const dropdown = useRef();
  const [defaultValue] = options;
  const [value, setValue] = useState(defaultValue);
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const dropdownId = `dropdown-button-${id}`;

  const updateValue = (option) => {
    setValue(option);
    if (onChange) onChange(option);

    setExpanded(false);
  };

  const getMenuCoords = () => {
    const dropdownRef = dropdown.current;
    if (!dropdownRef) return;

    const top = dropdownRef.offsetHeight + dropdownRef.offsetTop + 8;
    const left = dropdownRef.offsetRight;

    return { top, left };
  };

  return (
    <Fragment>
      <div
        className="dropdown"
        ref={dropdown}
      >
        <button
          aria-haspopup="true"
          className="dropdown__button dropdown__input"
          id={dropdownId}
          aria-expanded={expanded ? 'true' : 'false'}
          onClick={() => setExpanded(!expanded)}
        >
          <span>{value}</span>
          <Icon icon="chevron" className="dropdown__input-chevron" />
          <Icon icon="chevron" className="dropdown__input-chevron-active" />
        </button>
      </div>
      {expanded &&
        <Transition in={true} timeout={0} onEnter={reflow}>
          {status => (
            <div
              className={classNames('dropdown__menu-container', `dropdown__menu-container--${status}`)}
              role="menu"
              tabIndex={-1}
              aria-labelledby={dropdownId}
              style={getMenuCoords()}
            >
              {options.map(option => (
                <button
                  key={option}
                  className="dropdown__menu-item"
                  role="menuitemradio"
                  aria-checked={value === option ? 'true' : 'false'}
                  tabIndex={-1}
                  onClick={() => updateValue(option)}
                >
                  {value === option &&
                    <Icon icon="check" className="dropdown__menu-item-check" />
                  }
                  <span>{option}</span>
                </button>
              ))}
            </div>
          )}
        </Transition>
      }
    </Fragment>
  );
};

export default Dropdown;
