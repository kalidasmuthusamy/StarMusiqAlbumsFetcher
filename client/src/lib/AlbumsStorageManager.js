import { get, isNil, isEmpty } from 'lodash';

const ALBUM_NAMES_REF_KEY = 'albumNames';

class AlbumsStorageManager {
  static getVisitedAlbumNames = () => (
    JSON.parse(window.localStorage.getItem(ALBUM_NAMES_REF_KEY) || '[]')
  )

  static isVisitedAlbumsPresent = () => {
    const albumNames = AlbumsStorageManager.getVisitedAlbumNames();
    return !(
      isNil(albumNames) || isEmpty(albumNames)
    );
  }

  static setVisitedAlbumNames = (albumNames = []) => {
    window.localStorage.setItem(ALBUM_NAMES_REF_KEY, JSON.stringify(albumNames));
  }
}

export default AlbumsStorageManager;
