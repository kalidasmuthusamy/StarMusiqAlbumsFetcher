import React from 'react';
import PropTypes from 'prop-types';

import {
  CardImageHolder,
  CardTitleHolder,
  CardListItem,
} from './components/';

import FaIcon from '../FaIcon';

import {
  PrimaryButtonLink,
  OutlinePrimaryButtonLink,
  OutlineInfoButtonLink,
} from '../Buttons/Links/';

const AlbumCard = ({
  album,
  streamButtonRef,
  individualSongsButtonRef,
  normalDownloadButtonRef,
  hqDownloadButtonRef,
}) => {
  return (
    <div className='card card-cascade wider reverse my-4'>
      {/* Album Icon */}
      <CardImageHolder
        imageSource={album.movieIconUrl}
        customClassNames={album.unvisited ? 'animated pulse infinite' : ''}
      />
      <div className='card-body text-center'>
        {/* Album Header */}
        <CardTitleHolder
          albumName={album.albumName}
          musicDirector={album.musicDirector}
          customClassNames={album.unvisited ? 'animated pulse infinite' : ''}
        />

        <ul className='list-group list-group-flush'>
          {/* Album Casts List */}
          <CardListItem>
            <p className='card-title'>{album.casts}</p>
          </CardListItem>

          {/* Audio Streaming Button Block */}
          <CardListItem>
            <PrimaryButtonLink
              linkRef={streamButtonRef}
              routeTo={album.streamingUrl}
            >
              {'                    '}
              <FaIcon
                className='fa-play-circle'
              />
            </PrimaryButtonLink>

            {/* Individual Songs Link Block */}
            <PrimaryButtonLink
              linkRef={individualSongsButtonRef}
              routeTo={album.movieUrl}
            >
              {'                    '}
              <FaIcon
                className='fa-external-link'
              />
            </PrimaryButtonLink>
          </CardListItem>

          {/* Direct Downloads Block */}
          <CardListItem>
            {/* Normal Quality */}
            <OutlineInfoButtonLink
              linkRef={normalDownloadButtonRef}
              routeTo={album.downloadLinkNormal}
            >
              {'                    '}
              <FaIcon
                className='fa-download'
              />
            </OutlineInfoButtonLink>

            {/* High Quality */}
            <OutlinePrimaryButtonLink
              linkRef={hqDownloadButtonRef}
              routeTo={album.downloadLinkHq}
            >
              <FaIcon
                className='fa-download'
              />
              {'                    '}
              <span className='hq-dwld-text'>(HQ)</span>
            </OutlinePrimaryButtonLink>
          </CardListItem>
        </ul>
        
      </div>
    </div>
  );
}

AlbumCard.propTypes = {
  album: PropTypes.shape({
    albumName: PropTypes.string.isRequired,
    casts: PropTypes.string.isRequired,
    downloadLinkHq: PropTypes.string.isRequired,
    downloadLinkNormal: PropTypes.string.isRequired,
    movieIconUrl: PropTypes.string.isRequired,
    movieId: PropTypes.string.isRequired,
    movieUrl: PropTypes.string.isRequired,
    musicDirector: PropTypes.string.isRequired,
    streamingUrl: PropTypes.string.isRequired,
  }).isRequired,
  hqDownloadButtonRef: PropTypes.func.isRequired,
  individualSongsButtonRef: PropTypes.func.isRequired,
  normalDownloadButtonRef: PropTypes.func.isRequired,
  streamButtonRef: PropTypes.func.isRequired,
};

export default AlbumCard;
