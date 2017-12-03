import React, { Component } from 'react';

import AlbumCardsContainer from '../components/AlbumCardsContainer';
import StarMusiqAlbumsFetcher from '../lib/StarMusiqAlbumsFetcher';

class AlbumsFetcher extends Component {
  constructor(props) {
    super(props);

    this.starMusiqAlbumsRetriever = new StarMusiqAlbumsFetcher();
    this.loadingErrorMessage = 'Error! Please Try Again';
    this.topAlbumsPageLimit = 5;

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

  componentDidMount = () => {
    this.displayAlbumsOfPage(this.state.currentPageNumber);
  }

  render() {
    return (
      <AlbumCardsContainer
        {...this.state}
        displayAlbumsOfPage={this.displayAlbumsOfPage}
        topAlbumsPageLimit={this.topAlbumsPageLimit}
        loadingErrorMessage={this.loadingErrorMessage}
      />
    )
  }
}

export default AlbumsFetcher;
