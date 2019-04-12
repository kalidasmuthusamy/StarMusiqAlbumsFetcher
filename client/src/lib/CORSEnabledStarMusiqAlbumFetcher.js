import StarMusiqAlbumFetcher from './StarMusiqAlbumsFetcher.js';

class CORSEnabledStarMusiqAlbumFetcher extends StarMusiqAlbumFetcher {
  constructor() {
    super();
    this.closed_proxy_url = 'https://cors-dass.herokuapp.com';
    this.siteConfig.landingUrl = `${this.closed_proxy_url}/${
      process.env.STARMUSIQ_BASE_URL
    }?pgNo=`;
  }
}

export default CORSEnabledStarMusiqAlbumFetcher;
