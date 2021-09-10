import {
  createContext,
  useReducer,
  useRef,
  useState,
  Fragment,
  useEffect,
  Suspense,
  useMemo,
  useCallback,
} from 'react';
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
import {
  Option,
  OptionMenuHeader,
  OptionMenuItem,
  OptionMenuDivider,
} from 'components/Option';
import { getImage, getImageBlob } from 'utils/image';
import { reflow } from 'utils/transition';
import { initialState, reducer } from 'plugin/reducer';
import deviceModels from 'components/Scene/deviceModels';
import presets from 'data/presets';
import colors from 'data/colors';
import './index.css';

export const PluginContext = createContext({});

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
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    modelId,
    presetId,
    modelRotation,
    cameraRotation,
    color,
    selection,
    requestOutputFrame,
    exportQuality,
  } = state;

  useEffect(() => {
    const { modelRotation, cameraRotation } = presets[presetId];

    dispatch({ type: 'setModelRotation', value: modelRotation });
    dispatch({ type: 'setCameraRotation', value: cameraRotation });
  }, [presetId]);

  const modelSettings = useMemo(
    () => ({
      clay: false,
      model: modelId,
      selection,
      color,
      modelRotation,
      controls: {
        cameraRotation,
        onUpdate(cameraRotation) {
          dispatch({ type: 'setCameraRotation', value: cameraRotation });
        },
      },
    }),
    [modelId, selection, color, modelRotation, cameraRotation, dispatch]
  );

  useEffect(() => {
    window.onmessage = async event => {
      const { type, value } = event.data.pluginMessage;

      switch (type) {
        case 'selection': {
          if (!value) return dispatch({ type: 'setSelection', value: null });

          const blob = new Blob([value], { type: 'image/png' });

          return await Promise.resolve(
            new Promise(resolve => {
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => {
                dispatch({ type: 'setSelection', value: reader.result });
                resolve(reader.result);
              };
            })
          );
        }
        case 'save-canvas-image': {
          const render = requestOutputFrame(exportQuality);
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

  const createEmptyFrame = useCallback(
    event => {
      event.preventDefault();

      const { name, width, height } = deviceModels[modelId];

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
    [modelId]
  );

  const saveCanvasImage = event => {
    event.preventDefault();

    parent.postMessage({ pluginMessage: { type: 'export' } }, '*');
  };

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
                  onChange={value => dispatch({ type: 'setModelId', value })}
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

                        dispatch({ type: 'setPresetId', value: index });
                      }}
                    >
                      <img
                        className="sidebar__device-image"
                        alt={label}
                        src={deviceModels[modelId].renders[index]}
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
                    value={modelRotation.x}
                    onChange={event =>
                      dispatch({
                        type: 'setModelRotation',
                        value: { ...modelRotation, x: event.target.value },
                      })
                    }
                  />
                  <Input
                    icon="rotateY"
                    label="Rotate Y"
                    type="number"
                    aria-describedby="deviceRotation"
                    value={modelRotation.y}
                    onChange={event =>
                      dispatch({
                        type: 'setModelRotation',
                        value: { ...modelRotation, y: event.target.value },
                      })
                    }
                  />
                  <Input
                    icon="rotateZ"
                    label="Rotate Z"
                    type="number"
                    aria-describedby="deviceRotation"
                    value={modelRotation.z}
                    onChange={event =>
                      dispatch({
                        type: 'setModelRotation',
                        value: { ...modelRotation, z: event.target.value },
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
                    value={cameraRotation.x}
                    onChange={event =>
                      dispatch({
                        type: 'setCameraRotation',
                        value: { ...cameraRotation, x: event.target.value },
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
                      dispatch({
                        type: 'setCameraRotation',
                        value: { ...cameraRotation, y: event.target.value },
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
                  <div className="input__content">
                    {false && (
                      <Option
                        as="button"
                        className="input__color-swatch"
                        aria-label="Choose color style"
                        style={{ backgroundColor: color }}
                      >
                        <OptionMenuHeader>Kaleidoscope Colors</OptionMenuHeader>
                        {Object.entries(colors).map(([key, value]) => (
                          <OptionMenuItem
                            key={`kaleidoscope-${key}`}
                            selected={color === value}
                            onClick={() => dispatch({ type: 'setColor', value })}
                          >
                            <span
                              className="input__color-swatch"
                              style={{ backgroundColor: value }}
                            />
                            <span>{key}</span>
                          </OptionMenuItem>
                        ))}
                        <OptionMenuDivider />
                        <OptionMenuHeader>Document Colors</OptionMenuHeader>
                      </Option>
                    )}
                    <button
                      className="input__color-swatch"
                      aria-label="Choose color style"
                      style={{ backgroundColor: color }}
                    />
                    <input
                      className="input__element"
                      id="color-input"
                      aria-labelledby="color-label"
                      type="text"
                      value={color}
                      onChange={event =>
                        dispatch({ type: 'setColor', value: event.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="sidebar__actions">
                <Button onClick={createEmptyFrame}>Create Empty Frame</Button>
                <div className="sidebar__export">
                  <Button primary onClick={saveCanvasImage}>
                    Save as Image
                  </Button>
                  <div className="sidebar__export-config">
                    <Option grey iconOnly icon="settings" aria-label="Export Quality">
                      <OptionMenuHeader>Export Quality</OptionMenuHeader>
                      {['Low', 'Medium', 'High'].map(quality => (
                        <OptionMenuItem
                          key={`export-quality-${quality}`}
                          selected={exportQuality === quality}
                          onClick={() =>
                            dispatch({ type: 'setExportQuality', value: quality })
                          }
                        >
                          {quality}
                        </OptionMenuItem>
                      ))}
                    </Option>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </ThemeProvider>
    </PluginContext.Provider>
  );
};

render(<Plugin />, document.getElementById('root'));
