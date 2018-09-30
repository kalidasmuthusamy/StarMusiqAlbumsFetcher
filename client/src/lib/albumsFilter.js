import _ from 'lodash';

const FILTERABLE_ALBUM_PROPS = ['albumName', 'casts', 'musicDirector'];

const albumsFilter = ({ searchString, albumsPayload }) => {
  const searchRegex = new RegExp(searchString, 'i');

  const filteredAlbums = _.filter(albumsPayload, (album) => (
    _.reduce(FILTERABLE_ALBUM_PROPS, (albumMatched, filterableAlbumProp) => (
      albumMatched = albumMatched || searchRegex.test(album[filterableAlbumProp])
    ), false)
  ));

  return filteredAlbums;
};

export default albumsFilter;
