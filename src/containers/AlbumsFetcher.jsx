import React, { Component } from 'react';

import AlbumCardsContainer from '../components/AlbumCardsContainer';
import StarMusiqAlbumsFetcher from '../lib/StarMusiqAlbumsFetcher';

import { Shortcuts } from 'react-shortcuts';

class AlbumsFetcher extends Component {
  constructor(props) {
    super(props);

    this.starMusiqAlbumsRetriever = new StarMusiqAlbumsFetcher();
    this.loadingErrorMessage = 'Error! Please Try Again';
    this.topAlbumsPageLimit = 5;

    this.prevButtonRef = null;
    this.nextButtonRef = null;

    this.state = {
      albums: [],
      currentPageNumber: 1,
      loading: false,
      loadingError: false,
    };
  }

  fetchAlbums = (pageNumber) => {
    return this.starMusiqAlbumsRetriever.fetchAlbums(pageNumber);
  }

  displayAlbumsOfPage = async (pageNumber) => {
    this.setState({
      loading: true,
    });

    try {
      const { albums } = await this.fetchAlbums(pageNumber);
      this.setState({
        albums,
        currentPageNumber: pageNumber,
        loading: false,
      });
    } catch (e) {
      this.setState((prevState) => {
        return {
          loadingError: !prevState.loadingError,
          loading: false,
        }
      });
    }
  }

  _handleShortcuts = (action, event) => {
    switch (action) {
      case 'GO_TO_PREVIOUS_PAGE':
        this.prevButtonRef.click();
        console.log('Navigating to previous page');
        break;
      case 'GO_TO_NEXT_PAGE':
        this.nextButtonRef.click();
        console.log('Navigating to next page');
        break;
    }
  }

  componentDidMount = () => {
    this.displayAlbumsOfPage(this.state.currentPageNumber);
  }

  render() {
    return (
      <Shortcuts
        name='ALBUMS_CONTAINER'
        handler={this._handleShortcuts}
      >
        <AlbumCardsContainer
          {...this.state}
          displayAlbumsOfPage={this.displayAlbumsOfPage}
          topAlbumsPageLimit={this.topAlbumsPageLimit}
          loadingErrorMessage={this.loadingErrorMessage}
          prevButtonRef={(el) => this.prevButtonRef = el}
          nextButtonRef={(el) => this.nextButtonRef = el}
        />
      </Shortcuts>
    )
  }
}

export default AlbumsFetcher;
