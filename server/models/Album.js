import mongoose from 'mongoose';
import StarMusiqAlbumsFetcher from '../../client/src/lib/CORSEnabledStarMusiqAlbumFetcher';

const starMusiqAlbumsFetcher = new StarMusiqAlbumsFetcher();
const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
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
  }
}, {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  }
});

AlbumSchema.virtual('downloadLinkNormal').get(function(){
  return starMusiqAlbumsFetcher.getDownloadLink(this.movieId, 'normal');
});

AlbumSchema.virtual('downloadLinkHq').get(function () {
  return starMusiqAlbumsFetcher.getDownloadLink(this.movieId, 'hq');
});

const AlbumModel = mongoose.model('Album', AlbumSchema)

export default AlbumModel;
