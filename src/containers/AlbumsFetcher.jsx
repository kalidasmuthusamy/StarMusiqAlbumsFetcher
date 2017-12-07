import React, { Component } from 'react';

import AlbumCardsContainer from '../components/AlbumCardsContainer';
import StarMusiqAlbumsFetcher from '../lib/StarMusiqAlbumsFetcher';

import { Shortcuts } from 'react-shortcuts';

import { toInteger, toArray, last } from 'lodash';

class AlbumsFetcher extends Component {
  constructor(props) {
    super(props);

    this.starMusiqAlbumsRetriever = new StarMusiqAlbumsFetcher();
    this.loadingErrorMessage = "Error! Please Try Again";
    this.topAlbumsPageLimit = 5;

    this.prevButtonRef = null;
    this.nextButtonRef = null;

    this.streamButtonRef = [];
    this.individualSongsButtonRef = [];
    this.normalDownloadButtonRef = [];
    this.hqDownloadButtonRef = [];

    this.state = {
      albums: [],
      currentPageNumber: 1,
      loading: false,
      loadingError: false
    };
  }

  fetchAlbums = pageNumber => {
    return this.starMusiqAlbumsRetriever.fetchAlbums(pageNumber);
  };

  displayAlbumsOfPage = async pageNumber => {
    this.setState({
      loading: true
    });

    try {
      const { albums } = await this.fetchAlbums(pageNumber);
      this.setState({
        albums,
        currentPageNumber: pageNumber,
        loading: false
      });
    } catch (e) {
      this.setState(prevState => {
        return {
          loadingError: !prevState.loadingError,
          loading: false
        };
      });
    }
  };

  flushAlbumCardRefs = () => {
    this.streamButtonRef = [];
    this.individualSongsButtonRef = [];
    this.normalDownloadButtonRef = [];
    this.hqDownloadButtonRef = [];
  };

  _handleShortcuts = (action, event) => {
    const getAlbumIndex = (keyBoardEvent) => (
      /* using event.code since keyCode and which properties are deprecated
      and charCode is not required here
      Physical Key value is required */
      toInteger(last(toArray(keyBoardEvent.code)))
    );

    switch (action) {
      case "GO_TO_PREVIOUS_PAGE":
        this.prevButtonRef.click();
        console.log("Navigating to previous page");
        break;
      case "GO_TO_NEXT_PAGE":
        this.nextButtonRef.click();
        console.log("Navigating to next page");
        break;
      case "CLICK_ALBUM_STREAM_LINK":
        console.log("Album Card Stream Link Shortcut Triggered");
        this.streamButtonRef[getAlbumIndex(event)].click();
        break;
      case "CLICK_ALBUM_IS_LINK":
        console.log("Album Card Individual Songs Link Shortcut Triggered");
        this.individualSongsButtonRef[getAlbumIndex(event)].click();
        break;
      case "CLICK_ALBUM_ND_LINK":
        console.log("Album Card Normal Quality Download Link Shortcut Triggered");
        this.normalDownloadButtonRef[getAlbumIndex(event)].click();
        break;
      case "CLICK_ALBUM_HD_LINK":
        console.log("Album Card High Quality Link Shortcut Triggered");
        this.hqDownloadButtonRef[getAlbumIndex(event)].click();
        break;
    }
  };

  componentDidMount = () => {
    this.displayAlbumsOfPage(this.state.currentPageNumber);
  };

  componentWillUpdate = (nextProps, nextState) => {
    console.log('Album Card Link Refs Flushed');
    this.flushAlbumCardRefs();
  }

  render() {
    return (
      <Shortcuts 
        name="ALBUMS_CONTAINER"
        handler={this._handleShortcuts}
      >
        <AlbumCardsContainer
          {...this.state}
          displayAlbumsOfPage={this.displayAlbumsOfPage}
          topAlbumsPageLimit={this.topAlbumsPageLimit}
          loadingErrorMessage={this.loadingErrorMessage}
          prevButtonRef={el => (this.prevButtonRef = el)}
          nextButtonRef={el => (this.nextButtonRef = el)}
          streamButtonRef={el => this.streamButtonRef.push(el)}
          individualSongsButtonRef={el =>
            this.individualSongsButtonRef.push(el)
          }
          normalDownloadButtonRef={el => this.normalDownloadButtonRef.push(el)}
          hqDownloadButtonRef={el => this.hqDownloadButtonRef.push(el)}
        />
      </Shortcuts>
    );
  }
}

export default AlbumsFetcher;
