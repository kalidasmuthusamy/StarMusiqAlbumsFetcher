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

const AlbumCard = ({album}) => {
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
              routeTo={album.streamingUrl}
            >
              Stream
              {'                    '}
              <FaIcon
                className='fa-play-circle'
              />
            </PrimaryButtonLink>
          </CardListItem>

          {/* Individual Songs Link Block */}
          <CardListItem>
            <PrimaryButtonLink
              routeTo={album.movieUrl}
            >
              Individual Songs
              {'                    '}
              <FaIcon
                className='fa-external-link'
              />
            </PrimaryButtonLink>
          </CardListItem>

          {/* Direct Downloads BLock */}
          <CardListItem>
            {/* Normal Quality */}
            <OutlineInfoButtonLink
              routeTo={album.downloadLinkNormal}
            >
              Normal
              {'                    '}
              <FaIcon
                className='fa-download'
              />
            </OutlineInfoButtonLink>

            {/* High Quality */}
            <OutlinePrimaryButtonLink
              routeTo={album.downloadLinkHq}
            >
              HQ
              {'                    '}
              <FaIcon
                className='fa-download'
              />
            </OutlinePrimaryButtonLink>
          </CardListItem>
        </ul>
        
      </div>
    </div>
  );
}

export default AlbumCard;