import classNames from 'classnames';
import { Transition } from 'react-transition-group';
import { reflow } from 'utils/transition';
import './index.css';

const Spinner = () => (
  <Transition in={true} timeout={0} onEnter={reflow}>
    {status => (
      <div className={classNames('ui__spinner', `ui__spinner--${status}`)}>
        <div className="spinner">
          <svg
            className="spinner__element"
            fill="none"
            strokeWidth="2"
            width="32"
            height="32"
            strokeLinecap="round"
            viewBox="16 16 32 32"
          >
            <circle
              className="spinner__path"
              cx="32"
              cy="32"
              r="15"
              strokeDasharray="100.53096491487338 25.132741228718345"
              strokeDashoffset="100.53096491487338"
            />
          </svg>
        </div>
      </div>
    )}
  </Transition>
);

export default Spinner;
