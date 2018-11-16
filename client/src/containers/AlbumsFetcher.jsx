import React, { Component } from 'react';
import { isEmpty, map, includes } from 'lodash';
import axios from 'axios';

import AlbumCardsContainer from '../components/AlbumCardsContainer';
import StarMusiqAlbumsFetcher from '../lib/CORSEnabledStarMusiqAlbumFetcher';
import AlbumsStorageManager from '../lib/AlbumsStorageManager';
import Header from '../components/Header';
import EndCard from '../components/EndCard';

import albumsFilter from '../lib/albumsFilter';

import * as Sentry from '@sentry/browser';

class AlbumsFetcher extends Component {
  constructor(props) {
    super(props);

    Sentry.init({ dsn: process.env.SENTRY_CLIENT_DSN });

    this.starMusiqAlbumsRetriever = new StarMusiqAlbumsFetcher();
    this.albumsPerPage = process.env.ALBUMS_PER_PAGE || 12;
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
      extractedAlbums: [],
      loading: false,
      loadingError: false,
      searchString: '',
      currPage: 1,
      reachedEnd: false,
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

  handleFetchAlbums = async () => {
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
      Sentry.captureException(responseObject);

      this.setState(prevState => {
        return {
          loadingError: !prevState.loadingError,
          loading: false
        };
      });
    }
  };

  extractAlbums = (pageNumber) => {
    const { albums: fetchedAlbums } = this.state;
    const { albumsPerPage } = this;

    return _.slice(fetchedAlbums, 0, (pageNumber * albumsPerPage));
  }

  componentDidMount = async () => {
    await this.handleFetchAlbums();
    const extractedAlbums = this.extractAlbums(this.state.currPage);

    this.setState({
      extractedAlbums,
    });

    window.addEventListener('scroll', this.handleScroll, false);
  };

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.handleScroll, false);
  }

  handleScroll = () => {
    const { loading, loadingError, currPage, albums: fetchedAlbums, reachedEnd } = this.state;

    if (loading || loadingError || reachedEnd) {
      return;
    }

    if (this.extractAlbums(currPage).length === fetchedAlbums.length) {
      this.setState({
        reachedEnd: true,
      });

      return;
    }

    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      this.setState(({currPage}) => ({
        currPage: currPage + 1,
        loading: true,
      }), () => {
        const extractedAlbums = this.extractAlbums(this.state.currPage);

        this.setState({
          loading: false,
          extractedAlbums,
        });
      });
    }
  }

  handleSearchStringChange = (event) => {
    const userInputSearchString = _.trim(event.target.value);
    const regexSafeSearchString = userInputSearchString.replace(/[^\w\s]/gi, '');

    _.debounce(
      () => {
        this.setState({
          ...this.state,
          searchString: regexSafeSearchString,
        });
      }, 500
    )();
  }

  render() {
    const { searchString, albums, extractedAlbums, reachedEnd } = this.state;
    const filteredAlbums = _.isEmpty(searchString) ? extractedAlbums : albumsFilter({ searchString, albumsPayload: albums });

    return (
      <React.Fragment>
        <Header
          onSearchStringChange={this.handleSearchStringChange}
        />
        <AlbumCardsContainer
          {...this.state}
          albums={filteredAlbums}
          loadingErrorMessage={this.loadingErrorMessage}
          streamButtonRef={el => this.streamButtonRef.push(el)}
          individualSongsButtonRef={el =>
            this.individualSongsButtonRef.push(el)
          }
          normalDownloadButtonRef={el => this.normalDownloadButtonRef.push(el)}
          hqDownloadButtonRef={el => this.hqDownloadButtonRef.push(el)}
        />
        {
          reachedEnd && isEmpty(searchString) && <EndCard />
        }
      </React.Fragment>
    );
  }
}

export default AlbumsFetcher;
