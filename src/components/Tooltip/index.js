import classNames from 'classnames';
import { Transition } from 'react-transition-group';
import { reflow } from 'utils/transition';
import offset from 'utils/offset';
import './index.css';

const Tooltip = ({ id, visible, top, bottom, parent, children }) => (
  <Transition in={visible} timeout={0} onEnter={reflow}>
    {status => (
      <div
        className={classNames('tooltip', `tooltip--${status}`, {
          'tooltip--top': top,
          'tooltip--bottom': bottom,
        })}
        id={id}
        role="tooltip"
        style={offset(parent.current)}
      >
        {children}
      </div>
    )}
  </Transition>
);

export default Tooltip;
