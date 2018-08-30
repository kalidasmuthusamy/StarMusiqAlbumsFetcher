import express from 'express';
import path from 'path';
import db from './db';
import logger from './logger';

import asyncMiddleware from './middlewares/asyncMiddleware';

import StarMusiqAlbumsFetcher from '../client/src/lib/CORSEnabledStarMusiqAlbumFetcher';
import Album from './models/Album';

const app = express();
const port = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../client')));
  // Handle React routing, return all requests to React app
  app.get('*', function (_req, res) {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
  });
}

app.get('/print-new-albums', asyncMiddleware(async (_req, res, _next) => {
  const starMusiqAlbumsRetriever = new StarMusiqAlbumsFetcher();
  const latestAlbumsPageNumber = 1;

  const fetchedAlbums = await starMusiqAlbumsRetriever.fetchAlbums(latestAlbumsPageNumber);

  res.json(fetchedAlbums);
}));

app.listen(port, () => {
  logger(`Listening on port ${port}`);

  db.on('connected', () => {
    logger('DB connected');
  });
});
