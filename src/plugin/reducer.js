export const initialState = {
  modelId: 'iPhone 11',
  presetId: 0,
  modelRotation: { x: 0, y: 0, z: 0 },
  cameraRotation: { x: 0, y: 0 },
  color: '#FFFFFF',
  selection: null,
  exportQuality: 'Medium',
  requestOutputFrame: null,
};

export function reducer(state, action) {
  const { type, value } = action;

  switch (type) {
    case 'setModelId':
      return { ...state, modelId: value };
    case 'setPresetId':
      return { ...state, presetId: value };
    case 'setModelRotation':
      return { ...state, modelRotation: value };
    case 'setCameraRotation':
      return { ...state, cameraRotation: value };
    case 'setColor':
      return { ...state, color: value };
    case 'setSelection':
      return { ...state, selection: value };
    case 'setExportQuality':
      return { ...state, exportQuality: value };
    case 'setRequestOutputFrame':
      return { ...state, requestOutputFrame: value };
    default:
      throw new Error(type);
  }
}
