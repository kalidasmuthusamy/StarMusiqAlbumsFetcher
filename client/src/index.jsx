// Application entrypoint.

// Load up the application styles
require('../styles/application.scss');

import ProcessEnvExporter from './lib/ProcessEnvExporter';
ProcessEnvExporter.export();

// Render the top-level React component
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import Favicon from 'react-favicon';

ReactDOM.render(
  <div>
    <Favicon url="client/assets/music-icon.png" />
    <App />
  </div>
  , document.getElementById('react-root')
);

// ReactDOM.render(<App />, document.getElementById('react-root'));
