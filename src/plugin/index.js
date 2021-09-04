import {
  createContext,
  useContext,
  useReducer,
  useRef,
  useState,
  useEffect,
  useCallback,
  Fragment,
  Suspense,
  useMemo,
} from 'react';
import { render } from 'react-dom';
import classNames from 'classnames';
import ThemeProvider from 'components/ThemeProvider';
import { SwitchTransition, Transition } from 'react-transition-group';
import Tooltip from 'components/Tooltip';
import Model from 'components/Model';
import Spinner from 'components/Spinner';
import Dropdown from 'components/Dropdown';
import Input from 'components/Input';
import Button from 'components/Button';
import { getImage, getImageBlob } from 'utils/image';
import { reflow } from 'utils/transition';
import { initialState, reducer } from 'plugin/reducer';
import deviceModels from 'components/Model/deviceModels';
import presets from './presets';
import './index.css';

export const PluginContext = createContext({});

const Preset = ({ index, label, children, ...rest }) => {
  const { dispatch, selectedPresetId } = useContext(PluginContext);
  const presetRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  const onClick = event => {
    event.preventDefault();
    event.stopPropagation();

    dispatch({ type: 'setSelectedPresetId', value: index });
  };

  return (
    <Fragment>
      <button
        ref={presetRef}
        className="sidebar__device-button"
        aria-pressed={selectedPresetId === index}
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

const Plugin = () => {
  const canvas = useRef();
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    selectedModelId,
    selection,
    color,
    modelRotation,
    cameraRotation,
    exportQuality,
  } = state;

  const modelSettings = useMemo(() => {
    const currentDevice = deviceModels[selectedModelId];

    return {
      models: [
        {
          ...currentDevice,
          texture: selection || currentDevice.texture,
          color,
          position: { x: 0, y: 0, z: 0 },
          rotation: modelRotation,
        },
      ],
      cameraRotation,
    };
  }, [selectedModelId, selection, color, modelRotation, cameraRotation]);

  useEffect(() => {
    window.onmessage = async event => {
      const { type, value } = event.data.pluginMessage;

      switch (type) {
        case 'selection': {
          if (!value) return dispatch({ type: 'setSelection', value: null });

          const blob = new Blob([value], { type: 'image/png' });

          const selection = await Promise.resolve(
            new Promise(resolve => {
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => resolve(reader.result);
            })
          );

          return dispatch({ type: 'setSelection', value: selection });
        }
        case 'save-canvas-image': {
          const render = canvas.current.export(exportQuality);

          const { name } = deviceModels[selectedModelId];
          const { width, height } = await getImage(render);
          const blob = getImageBlob(render);

          return parent.postMessage(
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
        }
        default:
          throw new Error();
      }
    };
  }, [exportQuality, selectedModelId]);

  const createEmptyFrame = useCallback(
    event => {
      event.preventDefault();

      const { name, width, height } = deviceModels[selectedModelId];

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
    [selectedModelId]
  );

  const saveCanvasImage = useCallback(async event => {
    event.preventDefault();
    parent.postMessage({ pluginMessage: { type: 'export' } }, '*');
  }, []);

  return (
    <PluginContext.Provider value={{ ...state, dispatch }}>
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
                key={selectedModelId}
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
                  options={Object.keys(deviceModels)}
                  onChange={device =>
                    dispatch({ type: 'setSelectedModelId', value: device })
                  }
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
                        src={deviceModels[selectedModelId].renders[index]}
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
                    defaultValue={modelRotation.x}
                    onChange={event =>
                      dispatch({
                        type: 'setModelRotation',
                        value: { ...modelRotation, x: Number(event.target.value) },
                      })
                    }
                  />
                  <Input
                    icon="rotateY"
                    label="Rotate Y"
                    type="number"
                    aria-describedby="deviceRotation"
                    defaultValue={modelRotation.y}
                    onChange={event =>
                      dispatch({
                        type: 'setModelRotation',
                        value: { ...modelRotation, y: Number(event.target.value) },
                      })
                    }
                  />
                  <Input
                    icon="rotateZ"
                    label="Rotate Z"
                    type="number"
                    aria-describedby="deviceRotation"
                    defaultValue={modelRotation.z}
                    onChange={event =>
                      dispatch({
                        type: 'setModelRotation',
                        value: { ...modelRotation, z: Number(event.target.value) },
                      })
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
                    defaultValue={cameraRotation.x}
                    onChange={event =>
                      dispatch({
                        type: 'setCameraRotation',
                        value: { ...cameraRotation, x: Number(event.target.value) },
                      })
                    }
                  />
                  <Input
                    icon="rotateY"
                    label="Rotate Y"
                    type="number"
                    aria-describedby="cameraRotation"
                    defaultValue={cameraRotation.y}
                    onChange={event =>
                      dispatch({
                        type: 'setCameraRotation',
                        value: { ...cameraRotation, y: Number(event.target.value) },
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
                    defaultValue={color}
                    onChange={event =>
                      dispatch({ type: 'setColor', value: event.target.value })
                    }
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
    </PluginContext.Provider>
  );
};

render(<Plugin />, document.getElementById('root'));
