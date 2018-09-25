import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { ShortcutManager } from 'react-shortcuts';
import { StaggeredMotion, spring, presets } from 'react-motion';
import { range } from 'lodash';

import Header from './components/Header';
import AlbumsFetcher from './containers/AlbumsFetcher';

import keymap from './lib/keymap';

class App extends Component {
  constructor(props){
    super(props);
    this.shortcutManager = new ShortcutManager(keymap);
    this.state = { x: 250, y: 300 };
  }

  getChildContext() {
    return { shortcuts: this.shortcutManager }
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchmove', this.handleTouchMove);
  }

  handleMouseMove = ({ pageX: x, pageY: y }) => {
    this.setState({ x, y });
  };

  handleTouchMove = ({ touches }) => {
    this.handleMouseMove(touches[0]);
  };

  getStyles = (prevStyles) => {
    // `prevStyles` is the interpolated value of the last tick
    const endValue = prevStyles.map((_, i) => {
      return i === 0
        ? this.state
        : {
          x: spring(prevStyles[i - 1].x, presets.gentle),
          y: spring(prevStyles[i - 1].y, presets.gentle),
        };
    });
    return endValue;
  };


  render() {
    return (
      <div>
        <StaggeredMotion
          defaultStyles={range(3).map(() => ({ x: 0, y: 0 }))}
          styles={this.getStyles}>
          {musicHeads =>
            <div>
              {musicHeads.map(({ x, y }, i) =>
                <div
                  key={i}
                  className={`music-head-wrap music-head-${i}`}
                  style={{
                    WebkitTransform: `translate3d(${x - 25}px, ${y - 25}px, 0)`,
                    transform: `translate3d(${x - 25}px, ${y - 25}px, 0)`,
                    zIndex: musicHeads.length - i,
                  }}
                >
                  <i className="fa fa-music" aria-hidden="true"></i>
                </div>
              )}
            </div>
          }
        </StaggeredMotion>
        <Header />
        <AlbumsFetcher />
      </div>
    );
  }
}

App.childContextTypes = {
  shortcuts: PropTypes.object.isRequired
}

export default App;
