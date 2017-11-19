import React, {Component} from 'react';
import Button from './components/Button.jsx';
import AlbumCard from './components/AlbumCard.jsx';
import Spinner from './components/Spinner.jsx';

class App extends Component {
  constructor(props){
    super(props);

    this.starMusiqAlbumsRetriever = window.starMusiqAlbumsRetriever;
    this.state = {
      albums: [],
      currentPageNumber: 1,
      loading: false,
    };
  }

  fetchAlbums = (pageNumber) => {
    return this.starMusiqAlbumsRetriever.fetchAlbums(pageNumber);
  }

  displayAlbumsOfPage = async (pageNumber) => {
    this.setState({
      loading: true,
    });

    const { albums } = await this.fetchAlbums(pageNumber);
    
    this.setState({
      albums,
      currentPageNumber: pageNumber,
      loading: false,
    });
  }

  componentDidMount = () => {
    this.displayAlbumsOfPage(this.state.currentPageNumber);
  }

  render() {
    return (
      <div className='container-fluid'>
        { this.state.loading && <Spinner /> }
        <div className="row">
          {
            !this.state.loading && this.state.albums.map((album) => {
              return (
                <div key={album.movieId} className="col-sm-4">
                  <AlbumCard 
                    album={album}
                  />
                </div>
              );
            })
          }
        </div>
        <div className='row'>
          <Button
            className={'btn-primary waves-effect'}
            onClick={() => (this.displayAlbumsOfPage(this.state.currentPageNumber - 1))}
            value='Prev'
            disabled={this.state.loading}
            />
            <Button
            className={'btn-primary waves-effect'}
            onClick={() => (this.displayAlbumsOfPage(this.state.currentPageNumber + 1))}
            value='Next' 
            disabled={this.state.loading}
          />
        </div>
      </div>
    );
  }
}
export default App;
