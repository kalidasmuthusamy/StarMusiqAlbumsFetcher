import $ from 'jquery';

class StarMusiqAlbumsFetcher {
  constructor(){
    this.siteConfig = {
      downloadBaseUrl: 'http://www.starfile.info/download-7s-zip-new/download-3.ashx?Token=',
      landingUrl: 'http://www.5starmusiq.com/topten-proc.asp?pgno=',
      streamBaseUrl: 'http://5starmusiq.com/audio-player-popup.asp?MovieID='
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

    const $albumsTable = $(responseText).find('.main_tb3');

    $albumsTable.each((index, albumBlock) => {
      const $album = $(albumBlock);
      const albumLink = $album.find('a').eq(1);
      const albumInfo = albumLink.text().split(' - ');
      const albumHref = albumLink.attr('href');
      const starrer = $album.find('tr').eq(2).find('td').last().text();
      const movieId = albumHref.substring(albumHref.indexOf('=') + 1);
      const movieIconUrl = $album.find('img').attr('src');

      const albumObj = {
        albumName: (albumInfo[0]),
        musicDirector: (albumInfo[1]),
        casts: (starrer),
        movieId: movieId,
        movieUrl: (albumLink.attr('href').replace('.', 'http://www.5starmusiq.com')),
        movieIcon: (movieIconUrl.replace('.', 'http://www.5starmusiq.com')),
        streamingUrl: (this.siteConfig.streamBaseUrl + movieId),
        downloadLinkNormal: (this.getDownloadLink(movieId, 'normal')),
        downloadLinkHq: (this.getDownloadLink(movieId, 'hq'))
      }

      this.albums.push(albumObj);
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
