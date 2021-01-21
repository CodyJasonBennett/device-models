import { useRef, useState, useMemo, useCallback, useEffect, Fragment } from 'react';
import { render } from 'react-dom';
import classNames from 'classnames';
import ThemeProvider, { tokenStyles } from 'components/ThemeProvider';
import Helmet from 'react-helmet';
import { Transition } from 'react-transition-group';
import Tooltip from 'components/Tooltip';
import Model, { models } from 'components/Model';
import Dropdown from 'components/Dropdown';
import Input from 'components/Input';
import Button from 'components/Button';
import { useFormInput } from 'hooks';
import { getImage, getImageBlob } from 'utils/image';
import { reflow } from 'utils/transition';
import presets from './presets';
import './index.css';

const devices = models.map(({ name }) => name);
const textures = models.map(({ texture }) => texture);

const Plugin = () => {
  const canvasRef = useRef();
  const [defaultTexture] = textures;
  const [texture, setTexture] = useState(defaultTexture);
  const [defaultDevice] = devices;
  const [deviceType, setDeviceType] = useState(defaultDevice);
  const [preset, setPreset] = useState();
  const [deviceRotation, setDeviceRotation] = useState([0, 0, 0]);
  const [cameraRotation, setCameraRotation] = useState([0, 0, 0]);
  const [deviceX, setDeviceX] = useFormInput(deviceRotation[0]);
  const [deviceY, setDeviceY] = useFormInput(deviceRotation[1]);
  const [deviceZ, setDeviceZ] = useFormInput(deviceRotation[2]);
  const [cameraX, setCameraX] = useFormInput(cameraRotation[0]);
  const [cameraY, setCameraY] = useFormInput(cameraRotation[1]);
  const [deviceColor] = useFormInput('#FFFFFF');

  // Event handler
  onmessage = async event => {
    const selection = event.data.pluginMessage;
    if (!selection) return setTexture(defaultTexture);

    const blob = new Blob([selection], { type: 'image/png' });

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => setTexture(reader.result);
  };

  useMemo(() => {
    const { texture: activeTexture } = models.find(({ name }) => name === deviceType);

    if (textures.includes(texture) && texture !== activeTexture)
      setTexture(activeTexture);
  }, [texture, deviceType]);

  useMemo(() => {
    const deviceRotation = [deviceX.value, deviceY.value, deviceZ.value];

    setDeviceRotation(deviceRotation);
  }, [deviceX.value, deviceY.value, deviceZ.value]);

  useMemo(() => {
    const cameraRotation = [cameraX.value, cameraY.value];

    setCameraRotation(cameraRotation);
  }, [cameraX.value, cameraY.value]);

  const updateRotation = useCallback(
    ({ deviceRotation, cameraRotation }) => {
      setDeviceRotation(deviceRotation);
      setCameraRotation(cameraRotation);

      const [deviceX, deviceY, deviceZ] = deviceRotation;

      setDeviceX(deviceX);
      setDeviceY(deviceY);
      setDeviceZ(deviceZ);

      const [cameraX, cameraY] = cameraRotation;

      setCameraX(cameraX);
      setCameraY(cameraY);
    },
    [setDeviceX, setDeviceY, setDeviceZ, setCameraX, setCameraY]
  );

  useEffect(() => {
    const [defaultPreset] = presets;

    updateRotation(defaultPreset);
  }, [updateRotation]);

  const createEmptyFrame = event => {
    event.preventDefault();
    event.stopPropagation();

    const { name, width, height } = models.filter(({ name }) => name === deviceType)[0];

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
  };

  const saveCanvasImage = async event => {
    event.preventDefault();
    event.stopPropagation();

    const { name } = models.filter(({ name }) => name === deviceType)[0];
    const { width, height } = await getImage(canvasRef.current.toDataURL());
    const blob = getImageBlob(canvasRef.current.toDataURL());

    parent.postMessage(
      {
        pluginMessage: {
          type: 'save-canvas-image',
          name,
          width,
          height,
          blob,
        },
      },
      '*'
    );
  };

  const Preset = ({
    index,
    label,
    deviceRotation,
    cameraRotation,
    children,
    ...rest
  }) => {
    const presetRef = useRef();
    const [isHovered, setIsHovered] = useState(false);
    const tooltipId = `device-tooltip-${index + 1}`;

    const onClick = event => {
      event.preventDefault();
      event.stopPropagation();

      setPreset(index);

      updateRotation({ deviceRotation, cameraRotation });
    };

    return (
      <Fragment>
        <button
          ref={presetRef}
          className="sidebar__device-button"
          aria-pressed={preset === index ? 'true' : 'false'}
          aria-describedby={tooltipId}
          onMouseOver={() => setIsHovered(true)}
          onMouseOut={() => setIsHovered(false)}
          onClick={onClick}
          {...rest}
        >
          {children}
        </button>
        <Tooltip id={tooltipId} visible={isHovered} parent={presetRef}>
          {label}
        </Tooltip>
      </Fragment>
    );
  };

  return (
    <ThemeProvider inline>
      <Helmet>
        <style>{tokenStyles}</style>
      </Helmet>
      <main className="ui" tabIndex={-1}>
        <div className="ui__layout">
          <div className="ui__viewport-wrapper">
            {devices.map(device => (
              <Fragment key={device}>
                {device === deviceType && (
                  <Transition in={true} timeout={0} onEnter={reflow}>
                    {status => (
                      <div
                        className={classNames('ui__viewport', `ui__viewport--${status}`)}
                      >
                        <Model
                          ref={canvasRef}
                          texture={texture}
                          device={device}
                          color={deviceColor.value}
                          deviceRotation={deviceRotation}
                          cameraRotation={cameraRotation}
                        />
                      </div>
                    )}
                  </Transition>
                )}
              </Fragment>
            ))}
          </div>
          <div className="sidebar">
            <div className="sidebar__control">
              <div className="sidebar__label" id="deviceModel">
                Device Model
              </div>
              <Dropdown options={devices} onChange={device => setDeviceType(device)} />
            </div>
            <div className="sidebar__control">
              <div className="sidebar__label" id="anglePreset">
                Angle Preset
              </div>
              <div className="sidebar__devices" data-scroll="true">
                {presets.map(({ label, ...rest }, index) => (
                  <Preset key={index} index={index} label={label} {...rest}>
                    <img
                      className="sidebar__device-image"
                      alt={label}
                      src={models.find(({ name }) => name === deviceType).renders[index]}
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
                <label className="input__label" id="13-label" htmlFor="13-input">
                  Device Color
                </label>
                <div className="dropdown">
                  <button
                    aria-haspopup="true"
                    className="dropdown__button input__color-swatch"
                    id="dropdown-button-12"
                    aria-expanded="true"
                    aria-label="Choose color style"
                    style={{ backgroundColor: deviceColor.value }}
                  />
                </div>
                <input
                  className="input__element"
                  id="13-input"
                  aria-labelledby="13-label"
                  type="text"
                  {...deviceColor}
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
