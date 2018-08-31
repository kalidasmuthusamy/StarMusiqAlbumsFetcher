import mongoose from 'mongoose';

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
});

// TODO:
// Setters for download Links using Fetcher Module

const AlbumModel = mongoose.model('Album', AlbumSchema)

export default AlbumModel;
