import React, { Component } from 'react';
import Button from './Button.jsx';

const AlbumCard = ({album}) => {
  return (
    <div className='card card-cascade wider reverse my-4'>
      <div className='view overlay hm-white-slight'>
        <img src={album.movieIcon} className='img-fluid center-image' />
          <a href='#!'>
            <div className='mask'></div>
          </a>
      </div>
      <div className='card-body text-center'>
        <h4 className='card-title indigo-text'><strong>{album.albumName}</strong></h4>
        <h5 className=''>
          <strong>
            {album.musicDirector}
            {'                    '}
            <i className='fa fa-music' aria-hidden="true"></i>
          </strong>
        </h5>

        <ul className='list-group list-group-flush'>
          <li className='list-group-item'>
            <p className='card-title'>{album.casts}</p>
          </li>
          <li className='list-group-item'>
            <a className='btn btn-primary waves-effect' href={album.streamingUrl} role='button' target='_blank'>
              Stream
              {'                    '}
              <i className='fa fa-play-circle' aria-hidden="true"></i>
            </a>
          </li>
          <li className='list-group-item'>
            <a className='btn btn-primary waves-effect' href={album.movieUrl} role='button' target='_blank'>
              Individual Songs
              {'                    '}
              <i className='fa fa-external-link' aria-hidden="true"></i>
            </a>
          </li>
          <li className='list-group-item'>
            <a className='btn btn-outline-info waves-effect' href={album.downloadLinkNormal} role='button' target='_blank'>
              Normal
              {'                    '}
              <i className='fa fa-download' aria-hidden="true"></i>
            </a>
            <a className='btn btn-outline-primary waves-effect' href={album.downloadLinkHq} role='button' target='_blank'>
              HQ
              {'                    '}
              <i className='fa fa-download' aria-hidden="true"></i>
            </a>
          </li>
        </ul>
        
      </div>
    </div>
  );
}

export default AlbumCard;