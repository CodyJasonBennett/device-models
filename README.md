# Device Models

A Figma plugin to create mockups with 3D device models.

[![Site preview](/public/social-image.png)](https://devicemodels.com)

Create mockups with 3D device models. Customize the color, camera angle, and device model for your mockups. Includes models for the iPhone, Macbook Pro, iMac, and iPad with more models on the way for other devices.

How to use:

1. Run Device Models from the plugin menu

2. Choose a device model

3. Select any layer to render it on the device's screen. For best results select a layer that's close to the device's screen dimensions (or the same aspect ratio). If it's not exact that's fine, images will be placed similar to Figma's 'Fill' setting for image fills. To create a frame with the right dimensions click the "Create Empty Frame" button.

4. To change the camera angle select an angle preset or click and drag over the device. Alternatively, you can set an exact rotation in degrees on the right. You can also modify the rotation of the model itself there.

5. Choose a device color. If you have local color styles click the color swatch to choose one, or manually enter a hex code.

6. Click "Save as Image" to render the current view as an image layer in Figma.

## Install & run

Make sure you have nodejs and yarn installed. Install dependencies with:

```bash
yarn
```

Once it's done start up a local server with:

```bash
yarn start
```

To run get a production-ready build:

```bash
yarn build
```
