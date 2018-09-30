import React, { Component } from 'react';
import { Shortcuts } from 'react-shortcuts';
import { toInteger, toArray, last, map, includes } from 'lodash';
import axios from 'axios';

import AlbumCardsContainer from '../components/AlbumCardsContainer';
import StarMusiqAlbumsFetcher from '../lib/CORSEnabledStarMusiqAlbumFetcher';
import AlbumsStorageManager from '../lib/AlbumsStorageManager';

class AlbumsFetcher extends Component {
  constructor(props) {
    super(props);

    this.starMusiqAlbumsRetriever = new StarMusiqAlbumsFetcher();
    this.loadingErrorMessage = "Error! Please Try Again";

    this.prevButtonRef = null;
    this.nextButtonRef = null;

    this.streamButtonRef = [];
    this.individualSongsButtonRef = [];
    this.normalDownloadButtonRef = [];
    this.hqDownloadButtonRef = [];

    this.getAlbumsEndpoint = (process.env.BACKEND_API_BASE_URL) + '/api/get_albums';

    this.state = {
      albums: [],
      loading: false,
      loadingError: false
    };
  }

  fetchAlbums = async () => {
    const response = await axios.get(this.getAlbumsEndpoint);
    return response.data;
  };

  highlightNewAlbums = (albums = []) => {
    let highlightedAlbums = albums;
    if (AlbumsStorageManager.isVisitedAlbumsPresent()) {
      const visitedAlbumIds = AlbumsStorageManager.getVisitedAlbumIds();
      highlightedAlbums = map(albums, (album) => ({
        ...album,
        unvisited: !includes(visitedAlbumIds, album['movieId']),
      }));
    }

    AlbumsStorageManager.setVisitedAlbumIds(map(albums, 'movieId'));
    return highlightedAlbums;
  }

  displayAlbumsOfPage = async () => {
    this.setState({
      loading: true,
    });

    const responseObject = await this.fetchAlbums();

    if (responseObject.status === 'success') {
      const { albums } = responseObject;
      const highlightedAlbums = this.highlightNewAlbums(albums);

      this.setState({
        albums: highlightedAlbums,
        loading: false
      });
    } else {
      console.log(responseObject.errorMessage);

      this.setState(prevState => {
        return {
          loadingError: !prevState.loadingError,
          loading: false
        };
      });
    }
  };

  _handleShortcuts = (action, event) => {
    const getAlbumIndex = (keyBoardEvent) => (
      /* using event.code since keyCode and which properties are deprecated
      and charCode is not required here
      Physical Key value is required */
      toInteger(last(toArray(keyBoardEvent.code))) - 1
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
    this.displayAlbumsOfPage();
  };

  render() {
    return (
      <Shortcuts
        name="ALBUMS_CONTAINER"
        handler={this._handleShortcuts}
        targetNodeSelector={'body'}
      >
        <AlbumCardsContainer
          {...this.state}
          loadingErrorMessage={this.loadingErrorMessage}
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
