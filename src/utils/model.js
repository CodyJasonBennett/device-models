import { Box3, Vector3 } from 'three';

const MODEL_SIZE = 4;

const box = new Box3();
const vector = new Vector3();

/**
 * Normalizes a model's geometry to fit a size.
 */
export const normalizeModel = (model, size = MODEL_SIZE) => {
  // Normalize model dimensions
  const [scalar] = box
    .setFromObject(model)
    .getSize(vector)
    .toArray()
    .sort((a, b) => b - a);
  model.scale.multiplyScalar(size / scalar);

  // Center model based on bounding box
  const center = box.setFromObject(model).getCenter(vector);
  model.position.copy(center).multiplyScalar(-1);
};
