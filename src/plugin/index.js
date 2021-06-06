import {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
  Fragment,
  Suspense,
} from 'react';
import { render } from 'react-dom';
import classNames from 'classnames';
import { MathUtils } from 'three';
import ThemeProvider from 'components/ThemeProvider';
import { SwitchTransition, Transition } from 'react-transition-group';
import Tooltip from 'components/Tooltip';
import Model from 'components/Model';
import Spinner from 'components/Spinner';
import Dropdown from 'components/Dropdown';
import Input from 'components/Input';
import Button from 'components/Button';
import { useFormInput } from 'hooks';
import { getImage, getImageBlob } from 'utils/image';
import { reflow } from 'utils/transition';
import deviceModels from 'components/Model/deviceModels';
import presets from './presets';
import './index.css';

const devices = Object.values(deviceModels);
const [defaultDevice] = devices;

const Plugin = () => {
  const canvas = useRef();
  const [texture, setTexture] = useState(defaultDevice.texture);
  const [device, setDevice] = useState(defaultDevice.name);
  const [preset, setPreset] = useState(0);
  const { deviceRotation, cameraRotation } = presets[preset];
  const deviceX = useFormInput(deviceRotation.x);
  const deviceY = useFormInput(deviceRotation.y);
  const deviceZ = useFormInput(deviceRotation.z);
  const cameraX = useFormInput(cameraRotation.x);
  const cameraY = useFormInput(cameraRotation.y);
  const color = useFormInput('#FFFFFF');

  const activeDevice = useMemo(
    () => devices.find(({ name }) => name === device),
    [device]
  );

  useMemo(() => {
    if (texture && devices.find(device => device.texture === texture)) {
      setTexture(activeDevice.texture);
    }
  }, [texture, activeDevice.texture]);

  const modelSettings = useMemo(
    () => ({
      cameraRotation: {
        x: MathUtils.degToRad(cameraX.value),
        y: MathUtils.degToRad(cameraY.value),
        z: 0,
      },
      models: [
        {
          ...activeDevice,
          rotation: {
            x: MathUtils.degToRad(deviceX.value),
            y: MathUtils.degToRad(deviceY.value),
            z: MathUtils.degToRad(deviceZ.value),
          },
          color: color.value,
          texture,
        },
      ],
    }),
    [
      cameraX.value,
      cameraY.value,
      activeDevice,
      deviceX.value,
      deviceY.value,
      deviceZ.value,
      color.value,
      texture,
    ]
  );

  useEffect(() => {
    window.onmessage = async event => {
      const { type, value } = event.data.pluginMessage;

      switch (type) {
        case 'selection': {
          if (!value) return setTexture(defaultDevice.texture);

          const blob = new Blob([value], { type: 'image/png' });

          return await Promise.resolve(
            new Promise(resolve => {
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => {
                setTexture(reader.result);
                resolve(reader.result);
              };
            })
          );
        }
        case 'save-canvas-image': {
          const render = canvas.current.export(value);

          const { width, height } = await getImage(render);
          const blob = getImageBlob(render);

          return parent.postMessage(
            {
              pluginMessage: {
                type: 'save-canvas-image',
                name: activeDevice.name,
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
  }, [activeDevice.name]);

  const createEmptyFrame = useCallback(
    event => {
      event.preventDefault();

      const { name, width, height } = activeDevice;

      parent.postMessage(
        {
          pluginMessage: {
            type: 'create-empty-frame',
            name,
            width,
            height,
          },
        },
        '*'
      );
    },
    [activeDevice]
  );

  const saveCanvasImage = useCallback(async event => {
    event.preventDefault();

    const { width, height } = canvas.current;

    parent.postMessage(
      {
        pluginMessage: {
          type: 'export',
          width,
          height,
        },
      },
      '*'
    );
  }, []);

  const Preset = ({ index, label, children, ...rest }) => {
    const presetRef = useRef();
    const [isHovered, setIsHovered] = useState(false);

    const onClick = event => {
      event.preventDefault();
      event.stopPropagation();

      setPreset(index);
    };

    return (
      <Fragment>
        <button
          ref={presetRef}
          className="sidebar__device-button"
          aria-pressed={preset === index}
          onMouseOver={() => setIsHovered(true)}
          onFocus={() => setIsHovered(true)}
          onMouseOut={() => setIsHovered(false)}
          onBlur={() => setIsHovered(false)}
          onClick={onClick}
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
              appear
              timeout={{ enter: 400, exit: 200 }}
              key={device}
              onEnter={reflow}
            >
              {status => (
                <div className={classNames('ui__viewport', `ui__viewport--${status}`)}>
                  <Suspense fallback={<Spinner />}>
                    <Model ref={canvas} {...modelSettings} />
                  </Suspense>
                </div>
              )}
            </Transition>
          </SwitchTransition>
          <div className="sidebar">
            <div className="sidebar__control">
              <div className="sidebar__label">Device Model</div>
              <Dropdown
                options={devices.map(device => device.name)}
                onChange={device => setDevice(device)}
              />
            </div>
            <div className="sidebar__control">
              <div className="sidebar__label" id="anglePreset">
                Angle Preset
              </div>
              <div className="sidebar__devices" data-scroll>
                {presets.map(({ label }, index) => (
                  <Preset
                    key={index}
                    index={index}
                    label={label}
                    aria-describedby="anglePreset"
                  >
                    <img
                      className="sidebar__device-image"
                      alt={label}
                      src={activeDevice.renders[index]}
                    />
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
                  {...deviceX}
                />
                <Input
                  icon="rotateY"
                  label="Rotate Y"
                  type="number"
                  aria-describedby="deviceRotation"
                  {...deviceY}
                />
                <Input
                  icon="rotateZ"
                  label="Rotate Z"
                  type="number"
                  aria-describedby="deviceRotation"
                  {...deviceZ}
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
                  {...cameraX}
                />
                <Input
                  icon="rotateY"
                  label="Rotate Y"
                  type="number"
                  aria-describedby="cameraRotation"
                  {...cameraY}
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
                    aria-haspopup
                    aria-expanded={false}
                    className="dropdown__button input__color-swatch"
                    aria-label="Choose color style"
                    style={{ backgroundColor: color.value }}
                  />
                </div>
                <input
                  className="input__element"
                  id="color-input"
                  aria-labelledby="color-label"
                  type="text"
                  {...color}
                />
              </div>
            </div>
            <div className="sidebar__actions">
              <Button onClick={createEmptyFrame}>Create Empty Frame</Button>
              <Button primary onClick={saveCanvasImage}>
                Save as Image
              </Button>
            </div>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
};

render(<Plugin />, document.getElementById('root'));
