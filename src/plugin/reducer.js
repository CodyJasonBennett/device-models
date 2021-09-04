import presets from './presets';

const [defaultPreset] = presets;

export const initialState = {
  ...defaultPreset,
  color: '#FFFFFF',
  exportQuality: 4,
  selectedModelId: 'iPhone 11',
  selectedPresetId: 0,
  selection: null,
};

export function reducer(state, action) {
  const { type, value } = action;

  switch (type) {
    case 'setCameraRotation':
      return { ...state, cameraRotation: value };
    case 'setModelRotation':
      return { ...state, modelRotation: value };
    case 'setColor':
      return { ...state, color: value };
    case 'setExportQuality':
      return { ...state, exportQuality: Math.max(1, Number(value)) };
    case 'setSelectedModelId':
      return { ...state, selectedModelId: value };
    case 'setSelectedPresetId': {
      const selectedPreset = presets[value];
      return { ...state, selectedPresetId: value, ...selectedPreset };
    }
    case 'setSelection':
      return { ...state, selection: value };
    default:
      throw new Error();
  }
}
