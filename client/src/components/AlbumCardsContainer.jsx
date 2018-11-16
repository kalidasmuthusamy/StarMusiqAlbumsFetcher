import React from 'react';
import PropTypes from 'prop-types';
import posed, { PoseGroup } from 'react-pose';

import AlbumCard from './AlbumCard/';
import Spinner from './Spinner';
import ErrorModal from './ErrorModal';

const AlbumAnimationItem = posed.div({
  enter: { opacity: 1 },
  exit: { opacity: 0 }
});

const AlbumCardsContainer = (props) => {
  const albumsDOMContent = (
    <div className='main-wrapper'>
      {props.loading && <Spinner />}
      <div className='row albums-card-container'>
        <PoseGroup>
          {
            !props.loading && props.albums.map((album) => {
              return (
                <AlbumAnimationItem
                  key={album.movieId}
                  className='col-sm-4 albums-card'
                >
                  <AlbumCard
                    album={album}
                    streamButtonRef={props.streamButtonRef}
                    individualSongsButtonRef={props.individualSongsButtonRef}
                    normalDownloadButtonRef={props.normalDownloadButtonRef}
                    hqDownloadButtonRef={props.hqDownloadButtonRef}
                  />
                </AlbumAnimationItem>
              );
            })
          }
        </PoseGroup>
      </div>
    </div>
  );

  return (
    <div className='container-fluid'>
      {props.loadingError ?
        (
          <ErrorModal
            message={props.loadingErrorMessage}
          />
        ) : albumsDOMContent
      }
    </div>
  );
}

AlbumCardsContainer.propTypes = {
  albums: PropTypes.arrayOf(
    PropTypes.shape({
      albumName: PropTypes.string.isRequired,
      casts: PropTypes.string.isRequired,
      downloadLinkHq: PropTypes.string.isRequired,
      downloadLinkNormal: PropTypes.string.isRequired,
      movieIconUrl: PropTypes.string.isRequired,
      movieId: PropTypes.number.isRequired,
      movieUrl: PropTypes.string.isRequired,
      musicDirector: PropTypes.string.isRequired,
      streamingUrl: PropTypes.string.isRequired,
      unvisited: PropTypes.bool,
    })
  ).isRequired,
  hqDownloadButtonRef: PropTypes.func.isRequired,
  individualSongsButtonRef: PropTypes.func.isRequired,
  normalDownloadButtonRef: PropTypes.func.isRequired,
  streamButtonRef: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  loadingError: PropTypes.bool.isRequired,
  loadingErrorMessage: PropTypes.string.isRequired,
};

export default AlbumCardsContainer;
