import React, { Component } from 'react';

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
        imageSource={album.movieIcon}
      />
      <div className='card-body text-center'>
        {/* Album Header */}
        <CardTitleHolder
          albumName={album.albumName}
          musicDirector={album.musicDirector}
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
          </CardListItem>

          {/* Individual Songs Link Block */}
          <CardListItem>
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

export default AlbumCard;
