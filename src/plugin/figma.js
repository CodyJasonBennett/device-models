/* globals figma, __html__ */

figma.showUI(__html__, {
  width: 800,
  height: 500,
});

async function sendSelection() {
  const [selection] = figma.currentPage.selection;
  if (!selection) return figma.ui.postMessage({ type: 'selection', value: null });

  const blob = await selection.exportAsync();

  return figma.ui.postMessage({ type: 'selection', value: blob });
}

sendSelection();

figma.on('selectionchange', sendSelection);

figma.ui.onmessage = async ({ type, name, width, height, blob }) => {
  const selection = [];

  switch (type) {
    case 'create-empty-frame': {
      const frame = figma.createFrame();
      frame.name = `${name} Frame`;
      frame.resize(width, height);
      figma.currentPage.appendChild(frame);

      await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });
      await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });

      const text = figma.createText();
      text.characters = `${width}x${height}`;
      text.fontSize = 48;
      text.fontName = { family: 'Inter', style: 'Regular' };
      text.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
      text.x = width / 2 - text.width / 2;
      text.y = height / 2 - text.height / 2;
      frame.appendChild(text);

      selection.push(frame);

      figma.currentPage.selection = selection;
      figma.viewport.scrollAndZoomIntoView(selection);

      figma.off('selectionchange', sendSelection);
      return figma.closePlugin();
    }
    case 'save-canvas-image': {
      const rectangle = figma.createRectangle();
      rectangle.name = `${name} Render`;
      rectangle.resize(width, height);

      const image = figma.createImage(blob);
      rectangle.fills = [{ type: 'IMAGE', imageHash: image.hash, scaleMode: 'FILL' }];

      figma.currentPage.appendChild(rectangle);

      figma.currentPage.selection = selection;
      figma.viewport.scrollAndZoomIntoView(selection);

      figma.off('selectionchange', sendSelection);
      return figma.closePlugin();
    }
    case 'export': {
      const pixelRatio = 4;

      return figma.ui.postMessage({ type: 'save-canvas-image', value: pixelRatio });
    }
    default:
      throw new Error();
  }
};
