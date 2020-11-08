import React from 'react';
import { hydrate, render } from 'react-dom';
import App from './app';

const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}

// Event handler
onmessage = event => {
  const message = event.data.pluginMessage;

  console.log(message);
};
