import { isNil, isEmpty } from 'lodash';

const ALBUM_IDENTIFIER_REF_KEY = 'albumMovieIds';

class AlbumsStorageManager {
  static getVisitedAlbumIds = () => (
    JSON.parse(window.localStorage.getItem(ALBUM_IDENTIFIER_REF_KEY) || '[]')
  )

  static isVisitedAlbumsPresent = () => {
    const albumIds = AlbumsStorageManager.getVisitedAlbumIds();
    return !(
      isNil(albumIds) || isEmpty(albumIds)
    );
  }

  static setVisitedAlbumIds = (albumIds = []) => {
    window.localStorage.setItem(ALBUM_IDENTIFIER_REF_KEY, JSON.stringify(albumIds));
  }
}

export default AlbumsStorageManager;
