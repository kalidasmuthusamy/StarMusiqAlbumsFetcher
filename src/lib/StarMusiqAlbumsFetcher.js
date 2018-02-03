import $ from 'jquery';
import { forEach, split, nth } from 'lodash';

class StarMusiqAlbumsFetcher {
  constructor(){
    this.siteConfig = {
      albumBaseUrl: 'https://www.sunmusiq.com',
      downloadBaseUrl: 'http://www.starfile.info/download-7s-zip-new/download-3.ashx?Token=',
      landingUrl: 'https://www.sunmusiq.com?pgNo=',
      streamBaseUrl: 'https://www.sunmusiq.com/audio-player-popup.asp?MovieID='
    };
    this.albums = [];
  }

  /* Download Link Generation Helper */
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
    /*  Making albums object empty for every page visit */
    this.albums = [];

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
          movieIcon: `${this.siteConfig.albumBaseUrl}${movieIconUrl}`,
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
  fetchAlbums(pageNo) {
    const pageNumber = (pageNo == undefined) ? 1 : pageNo;
    const albumsURL = this.siteConfig.landingUrl + pageNumber;
    const thisContext = this;

    return new window.Promise(function (resolve, reject) {
      const jqxhr = $.ajax(albumsURL);
      jqxhr.done(function (response) {
        thisContext.buildAlbumObjects(response);
      }).then(function () {
        const resolvedObject = {
          albums: thisContext.albums,
          currPageNumber: 1
        }
        resolve(resolvedObject);
      });

      jqxhr.fail(function (jqXHR, textStatus, errorThrown) {
        const errorObject = {
          status: textStatus,
          errorMessage: errorThrown
        }
        reject(errorObject);
      });
    });
  }
}

export default StarMusiqAlbumsFetcher;
