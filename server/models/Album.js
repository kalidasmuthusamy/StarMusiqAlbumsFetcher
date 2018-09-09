import mongoose from 'mongoose';

import StarMusiqAlbumsFetcher from '../../client/src/lib/CORSEnabledStarMusiqAlbumFetcher';

const starMusiqAlbumsFetcher = new StarMusiqAlbumsFetcher();
const Schema = mongoose.Schema;

const albumSchema = new Schema({
  albumName: {
    type: String,
    required: true,
  },
  musicDirector: {
    type: String,
  },
  casts: {
    type: String,
  },
  movieId: {
    type: Number,
    required: true,
    unique: true,
  },
  movieUrl: {
    type: String,
    required: true,
  },
  movieIconUrl: {
    type: String,
    required: true,
  },
  streamingUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  published: {
    type: Boolean,
    default: false,
  },
  weightage: {
    type: Number,
    required: true,
    unique: true,
  }
}, {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  }
});

albumSchema.virtual('downloadLinkNormal').get(function(){
  return starMusiqAlbumsFetcher.getDownloadLink(this.movieId, 'normal');
});

albumSchema.virtual('downloadLinkHq').get(function () {
  return starMusiqAlbumsFetcher.getDownloadLink(this.movieId, 'hq');
});

const AlbumModel = mongoose.model('Album', albumSchema)

export default AlbumModel;
