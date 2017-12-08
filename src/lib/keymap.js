import { range, map } from 'lodash';

/* Number Should be at the end since Keyboard event will emit info only for last key pressed
   An Album Link is selected from indexed links based on Number provided
*/
const albumCardsShortCuts = (keyCode = '', albumsCount) => (
  map(range(albumsCount), (num) => (
    `${keyCode}+${num}`
  ))
)

const albumContainerShortcuts = {
  ALBUMS_CONTAINER: {
    GO_TO_PREVIOUS_PAGE: ['ctrl+left', 'P', 'p'],
    GO_TO_NEXT_PAGE: ['ctrl+right', 'N', 'n'],
    CLICK_ALBUM_STREAM_LINK: albumCardsShortCuts('shift', 10),
    CLICK_ALBUM_IS_LINK: albumCardsShortCuts('ctrl', 10),
    CLICK_ALBUM_ND_LINK: albumCardsShortCuts('meta', 10),
    CLICK_ALBUM_HD_LINK: albumCardsShortCuts('alt', 10),
  }
};

export default albumContainerShortcuts;