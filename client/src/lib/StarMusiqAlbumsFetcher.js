import axios from 'axios';
import { forEach, split, nth } from 'lodash';
import cheerio from 'cheerio';
import btoa from 'btoa';

class StarMusiqAlbumsFetcher {
  constructor(){
    this.siteConfig = {
      albumBaseUrl: 'https://www.sunmusiq.com',
      downloadBaseUrl: 'http://www.starfile.fun/download-7s-zip-new/download-3.ashx?Token=',
      landingUrl: 'https://www.sunmusiq.com?pgNo=',
      streamBaseUrl: 'https://www.sunmusiq.com/audio-player-popup.asp?MovieID='
    };
    this.albums = [];
  }

  getDownloadLink(movieId, quality){
    function getDateTimeString() {
      const isoDateTimeString = new Date().toISOString();
      const date = isoDateTimeString.slice(0, isoDateTimeString.indexOf('T'));
      const utcTime = isoDateTimeString.slice((isoDateTimeString.indexOf('T') + 1), (isoDateTimeString.indexOf('T') + 9));
      return (date + ' ' + utcTime);
    }

    // Function to generate token for album download
    function getAlbumDownloadToken(movieId, dateTimeString, quality) {
      const movieType = quality === 'normal' ? 'Type2' : 'Type1';
      const tokenData = 'Movie' + '$$' + movieId + '$$' + movieType + '$$' + 'OpenDownload' + '$$' + dateTimeString;
      return btoa(tokenData);
    }

    return (this.siteConfig.downloadBaseUrl + getAlbumDownloadToken(movieId, getDateTimeString(), quality));
  }

  buildAlbumObjects(responseText) {
    // Making albums object empty for every page visit
    this.albums = [];

    const $ = cheerio.load(responseText);
    const $albumsTable = $(responseText).find('#featured_albums').find('.row');

    forEach($albumsTable, (albumRow) => {
      const rowAlbums = $(albumRow).children();

      forEach(rowAlbums, (singleAlbum) => {
        const $albumBlock = $(singleAlbum);
        const $linkSection = $albumBlock.find('.img-thumbnail').find('a').first();
        const $albumInfoSection = $albumBlock.find('.clearfix.text-nowrap');

        const albumHref = $linkSection.attr('href');
        const movieIconUrl = $linkSection.find('img').attr('src');
        const [albumName, musicDirector] = split($albumInfoSection.find('h5').find('a').attr('title'), ' - ');
        const casts = $albumInfoSection.find('div:nth-child(3) > span').attr('title') || '';
        const movieId = nth(
          split(albumHref, '-'),
          -3
        );

        const albumObj = {
          albumName,
          musicDirector,
          casts,
          movieId,
          movieUrl: `${this.siteConfig.albumBaseUrl}${albumHref}`,
          movieIconUrl: `${this.siteConfig.albumBaseUrl}${movieIconUrl}`,
          streamingUrl: `${this.siteConfig.streamBaseUrl}${movieId}`,
          downloadLinkNormal: (this.getDownloadLink(movieId, 'normal')),
          downloadLinkHq: (this.getDownloadLink(movieId, 'hq'))
        }

        if(movieId){
          this.albums.push(albumObj);
        }
      });
    });
  }

  // Fetch response through ajax
  // Build Album objects by response parsing
  // Return a promise to handle data
  // Asynchronously during DOM updation
  async fetchAlbums(pageNo) {
    const pageNumber = (pageNo == undefined) ? 1 : pageNo;
    const albumsURL = this.siteConfig.landingUrl + pageNumber;
    const thisContext = this;

    try {
      const response = await axios.get(albumsURL, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          ...((typeof(window) === 'undefined' || process.env.NODE_ENV !== 'development') && { origin: 'https://new-tamil-albums.herokuapp.com' })
        },
      });
      await thisContext.buildAlbumObjects(response.data);

      const albumsCollection = {
        status: 'success',
        albums: thisContext.albums,
      }
      return albumsCollection;
    } catch(e) {
      console.log(e);
      const errorObject = {
        status: 'failure',
        errorMessage: `${e}`,
      }

      return errorObject;
    };
  }
}

export default StarMusiqAlbumsFetcher;
