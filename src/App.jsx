import React, {Component} from 'react';
import Button from './components/Button.jsx';
import AlbumCard from './components/AlbumCard.jsx';
import Spinner from './components/Spinner.jsx';
import ErrorModal from './components/ErrorModal.jsx';
import StarMusiqAlbumsFetcher from './lib/StarMusiqAlbumsFetcher.jsx';

class App extends Component {
  constructor(props){
    super(props);

    this.starMusiqAlbumsRetriever = new StarMusiqAlbumsFetcher();
    this.loadingErrorMessage = 'Error! Please Try Again'
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

    try{
      const { albums } = await this.fetchAlbums(pageNumber);
      this.setState({
        albums,
        currentPageNumber: pageNumber,
        loading: false,
      });
    } catch(e){
        this.setState((prevState) => {
          return { loadingError: !prevState.loadingError, }
        });
    }
  }

  componentDidMount = () => {
    this.displayAlbumsOfPage(this.state.currentPageNumber);
  }

  render() {
    const albumsDOMContent = (
      <div className='main-wrapper'>
        {this.state.loading && <Spinner />}
        <div className='row albums-card-container'>
          {
            !this.state.loading && this.state.albums.map((album) => {
              return (
                <div key={album.movieId} className='col-sm-4 albums-card'>
                  <AlbumCard
                    album={album}
                  />
                </div>
              );
            })
          }
        </div>
        <div className='row justify-content-center'>
          <div className='col-6'>
            <Button
              className={'btn-primary waves-effect float-right'}
              onClick={() => (this.displayAlbumsOfPage(this.state.currentPageNumber - 1))}
              value='Prev'
              disabled={this.state.loading || (this.state.currentPageNumber == 1)}
            />
          </div>
          <div className='col-6'>
            <Button
              className={'btn-primary waves-effect float-left'}
              onClick={() => (this.displayAlbumsOfPage(this.state.currentPageNumber + 1))}
              value='Next'
              disabled={this.state.loading}
            />
          </div>
        </div>
      </div>
    );

    return (
      <div className='container-fluid'>
        { this.state.loadingError ?
            (
              <ErrorModal
                message={this.loadingErrorMessage}
              />
            ) : albumsDOMContent
        }
      </div>
    );
  }
}

export default App;
