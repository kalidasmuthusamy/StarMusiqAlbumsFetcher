window.starMusiqAlbumsRetriever = {
  // configuration values
  siteConfig: {
    downloadBaseUrl: "http://www.starfile.info/download-7s-zip-new/download-3.ashx?Token=",
    landingUrl: "http://www.5starmusiq.com/topten-proc.asp?pgno=",
    streamBaseUrl: "http://5starmusiq.com/audio-player-popup.asp?MovieID="
  },
  albums: [],
  
  getDownloadLink: function(movieId, quality){
    function getDateTimeString(){
      var isoDateTimeString = new Date().toISOString();
      var date = isoDateTimeString.slice(0, isoDateTimeString.indexOf('T')) ;
      var utcTime = isoDateTimeString.slice((isoDateTimeString.indexOf('T') + 1), (isoDateTimeString.indexOf('T') + 9));
      return (date + " " + utcTime);
    }

    // Function to generate token for album download
    function getAlbumDownloadToken(movieId, dateTimeString, quality){
      var movieType = quality === 'normal' ? 'Type2' : 'Type1';
      var tokenData = "Movie" + "$$" + movieId + "$$" + movieType + "$$" + "OpenDownload" + "$$" + dateTimeString;
      return btoa(tokenData);
    }

    return (this.siteConfig.downloadBaseUrl + getAlbumDownloadToken(movieId, getDateTimeString(), quality));
  },

  buildAlbumObjects: function(responseText){
    // Making albums object empty for every page visit
    this.albums=[];

    $albumsTable = $(responseText).find(".main_tb3");

    $albumsTable.each(function(index,albumBlock){
      var $album = $(albumBlock);
      var albumLink = $album.find('a').eq(1);
      var albumInfo = albumLink.text().split(' - ');
      var albumHref = albumLink.attr('href');
      var starrer = $album.find('tr').eq(2).find('td').last().text();
      var movieId = albumHref.substring(albumHref.indexOf("=") + 1);
      var movieIconUrl = $album.find('img').attr('src');

      var albumObj = {
        albumName: (albumInfo[0]),
        musicDirector: (albumInfo[1]),
        casts: (starrer),
        movieId: movieId,
        movieUrl: (albumLink.attr('href').replace(".", "http://www.5starmusiq.com")),
        movieIcon: (movieIconUrl.replace(".", "http://www.5starmusiq.com")),
        streamingUrl: (this.siteConfig.streamBaseUrl + movieId),
        downloadLinkNormal: (this.getDownloadLink(movieId, "normal")),
        downloadLinkHq: (this.getDownloadLink(movieId, "hq"))
      }

      this.albums.push(albumObj);
    }.bind(this));

  },

  // Fetch response through ajax
  // Build Album objects by response parsing
  // Return a promise to handle data 
  // Asynchronously during DOM updation
  fetchAlbums: function(pageNumber){
    var pageNumber = (pageNumber == undefined) ? 1 : pageNumber;
    var albumsURL = this.siteConfig.landingUrl + pageNumber;
    var thisContext = this;

    return new Promise(function(resolve, reject){
      var jqxhr = $.ajax( albumsURL );
      jqxhr.done(function (response) {
        thisContext.buildAlbumObjects(response);
      }).then(function(){
        var resolvedObject = {
          albums: thisContext.albums,
          currPageNumber: 1
        }
        resolve(resolvedObject);
      });

      jqxhr.fail(function (jqXHR, textStatus, errorThrown) {
        var errorObject = {
          status: textStatus,
          errorMessage: errorThrown
        }
        reject(errorObject);
      });
    });
  }
};
