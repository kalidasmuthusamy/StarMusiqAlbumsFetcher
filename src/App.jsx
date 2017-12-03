import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AlbumsFetcher from './containers/AlbumsFetcher';

import keymap from './lib/keymap';
import { ShortcutManager } from 'react-shortcuts';

class App extends Component {
  constructor(props){
    super(props);
    this.shortcutManager = new ShortcutManager(keymap)
  }

  getChildContext() {
    return { shortcuts: this.shortcutManager }
  }

  render() {
    return (
      <AlbumsFetcher />
    );
  }
}

App.childContextTypes = {
  shortcuts: PropTypes.object.isRequired
}

export default App;
