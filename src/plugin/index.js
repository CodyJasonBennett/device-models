import { useRef, useState, Fragment, useEffect, Suspense, useMemo } from 'react';
import { render } from 'react-dom';
import classNames from 'classnames';
import ThemeProvider from 'components/ThemeProvider';
import { SwitchTransition, Transition } from 'react-transition-group';
import Tooltip from 'components/Tooltip';
import Spinner from 'components/Spinner';
import Scene from 'components/Scene';
import Dropdown from 'components/Dropdown';
import Input from 'components/Input';
import Button from 'components/Button';
import { getImage, getImageBlob } from 'utils/image';
import { reflow } from 'utils/transition';
import deviceModels from 'components/Scene/deviceModels';
import presets from './presets';
import './index.css';

const Preset = ({ label, children, ...rest }) => {
  const presetRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Fragment>
      <button
        ref={presetRef}
        className="sidebar__device-button"
        onMouseOver={() => setIsHovered(true)}
        onFocus={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
        onBlur={() => setIsHovered(false)}
        {...rest}
      >
        {children}
      </button>
      <Tooltip bottom visible={isHovered} parent={presetRef}>
        {label}
      </Tooltip>
    </Fragment>
  );
};

const Plugin = () => {
  const [modelId, setModelId] = useState('Google Pixel 6');
  const [presetId, setPresetId] = useState(0);
  const [modelRotation, setModelRotation] = useState(presets[presetId].modelRotation);
  const [cameraRotation, setCameraRotation] = useState(presets[presetId].cameraRotation);
  const [color, setColor] = useState('#FFFFFF');
  const [selection, setSelection] = useState();
  const [requestOutputFrame, setRequestOutputFrame] = useState();
  const [exportQuality] = useState(4);

  const modelSettings = useMemo(
    () => ({
      clay: false,
      model: modelId,
      selection,
      color,
      modelRotation,
      setRequestOutputFrame,
      controls: {
        cameraRotation,
        onUpdate: setCameraRotation,
      },
    }),
    [modelId, selection, color, modelRotation, cameraRotation]
  );

  useEffect(() => {
    window.onmessage = async event => {
      const { type, value } = event.data.pluginMessage;

      switch (type) {
        case 'selection': {
          if (!value) return setSelection(null);

          const blob = new Blob([value], { type: 'image/png' });

          return await Promise.resolve(
            new Promise(resolve => {
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => {
                setSelection(reader.result);
                resolve(reader.result);
              };
            })
          );
        }
        case 'save-canvas-image': {
          const render = requestOutputFrame?.(exportQuality);
          if (!render) return;

          const { width, height } = await getImage(render);
          const blob = getImageBlob(render);

          return parent.postMessage(
            {
              pluginMessage: {
                type: 'save-canvas-image',
                name: modelId,
                width,
                height,
                blob,
              },
            },
            '*'
          );
        }
        default:
          throw new Error();
      }
    };
  }, [requestOutputFrame, exportQuality, modelId]);

  return (
    <ThemeProvider inline>
      <main className="ui" tabIndex={-1}>
        <div className="ui__layout">
          <SwitchTransition
            mode="out-in"
            className="ui__viewport-wrapper"
            component="div"
          >
            <Transition
              mountOnEnter
              unmountOnExit
              timeout={800}
              key={modelId}
              onEnter={reflow}
            >
              {status => (
                <div className={classNames('ui__viewport', `ui__viewport--${status}`)}>
                  <Suspense fallback={<Spinner />}>
                    <Scene {...modelSettings} />
                  </Suspense>
                </div>
              )}
            </Transition>
          </SwitchTransition>
          <div className="sidebar">
            <div className="sidebar__control">
              <div className="sidebar__label">Device Model</div>
              <Dropdown
                options={Object.keys(deviceModels)}
                onChange={key => setModelId(key)}
              />
            </div>
            <div className="sidebar__control">
              <div className="sidebar__label" id="anglePreset">
                Angle Preset
              </div>
              <div className="sidebar__devices" data-scroll>
                {presets.map(({ label }, index) => (
                  <Preset
                    key={`angle-preset-${index}`}
                    label={label}
                    aria-describedby="anglePreset"
                    aria-pressed={presetId === index}
                    onClick={event => {
                      event.preventDefault();
                      event.stopPropagation();

                      setPresetId(index);
                    }}
                  >
                    <img className="sidebar__device-image" alt={label} src={undefined} />
                  </Preset>
                ))}
              </div>
            </div>
            <div className="sidebar__control">
              <div className="sidebar__label" id="deviceRotation">
                Device Rotation
              </div>
              <div className="sidebar__control-group">
                <Input
                  icon="rotateX"
                  label="Rotate X"
                  type="number"
                  aria-describedby="deviceRotation"
                  value={modelRotation.x}
                  onChange={event =>
                    setModelRotation({ ...modelRotation, x: Number(event.target.value) })
                  }
                />
                <Input
                  icon="rotateY"
                  label="Rotate Y"
                  type="number"
                  aria-describedby="deviceRotation"
                  value={modelRotation.y}
                  onChange={event =>
                    setModelRotation({ ...modelRotation, y: Number(event.target.value) })
                  }
                />
                <Input
                  icon="rotateZ"
                  label="Rotate Z"
                  type="number"
                  aria-describedby="deviceRotation"
                  value={modelRotation.z}
                  onChange={event =>
                    setModelRotation({ ...modelRotation, z: Number(event.target.value) })
                  }
                />
              </div>
            </div>
            <div className="sidebar__control">
              <div className="sidebar__label" id="cameraRotation">
                Camera Rotation
              </div>
              <div className="sidebar__control-group">
                <Input
                  icon="rotateX"
                  label="Rotate X"
                  type="number"
                  aria-describedby="cameraRotation"
                  value={cameraRotation.x}
                  onChange={event =>
                    setCameraRotation({
                      ...cameraRotation,
                      x: event.target.value,
                    })
                  }
                />
                <Input
                  icon="rotateY"
                  label="Rotate Y"
                  type="number"
                  aria-describedby="cameraRotation"
                  value={cameraRotation.y}
                  onChange={event =>
                    setCameraRotation({
                      ...cameraRotation,
                      y: event.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="sidebar__control">
              <div className="input">
                <label className="input__label" id="color-label" htmlFor="color-input">
                  Model Color
                </label>
                <div className="dropdown">
                  <button
                    aria-haspopup={false}
                    aria-expanded={false}
                    className="dropdown__button input__color-swatch"
                    aria-label="Choose color style"
                    style={{ backgroundColor: color }}
                  />
                </div>
                <input
                  className="input__element"
                  id="color-input"
                  aria-labelledby="color-label"
                  type="text"
                  value={color}
                  onChange={event => setColor(event.target.value)}
                />
              </div>
            </div>
            <div className="sidebar__actions">
              <Button>Create Empty Frame</Button>
              <Button primary>Save as Image</Button>
            </div>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
};

render(<Plugin />, document.getElementById('root'));
