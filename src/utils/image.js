/**
 * Asynchronously gets an image by source
 */
export function getImage(src) {
  return new Promise (resolve => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.src = src
  })
}

/**
* Converts a URI to a Uint8Array for Figma
*/
export function getImageBlob(uri) {
  const data = uri.split(',')[1];
  const bytes = atob(data);
  const buf = new ArrayBuffer(bytes.length);
  let array = new Uint8Array(buf);

  for (let i = 0; i < bytes.length; i++) {
    array[i] = bytes.charCodeAt(i);
  }

  return array;
};
