export const initialState = {
  deviceRotation: [0, 0, 0],
  cameraRotation: [0, 0, 0],
};

export function reducer(state, action) {
  const { type, value } = action;

  switch (type) {
    case 'setDeviceRotation':
      return { ...state, deviceRotation: value };
    case 'setCameraRotation':
      return { ...state, cameraRotation: value };
    default:
      throw new Error();
  }
}
