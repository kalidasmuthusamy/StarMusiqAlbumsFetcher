import React, {Component} from 'react';
import AlbumsFetcher from './containers/AlbumsFetcher';

class App extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <AlbumsFetcher />
    );
  }
}

export default App;
