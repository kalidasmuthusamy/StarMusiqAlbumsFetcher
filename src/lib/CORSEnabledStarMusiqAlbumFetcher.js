import StarMusiqAlbumFetcher from './StarMusiqAlbumsFetcher';

class CORSEnabledStarMusiqAlbumFetcher extends StarMusiqAlbumFetcher{
  constructor(){
    super();
    this.closed_proxy_url = 'https://cors-dass.herokuapp.com';
    this.siteConfig.landingUrl = `${this.closed_proxy_url}/https://www.5starmusiq.com/topten-proc.asp?pgno=`;
  }
}

export default CORSEnabledStarMusiqAlbumFetcher;
