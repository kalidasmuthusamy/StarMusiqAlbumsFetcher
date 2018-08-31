import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import db from './db';
import logger from './logger';

import asyncMiddleware from './middlewares/asyncMiddleware';

import StarMusiqAlbumsFetcher from '../client/src/lib/CORSEnabledStarMusiqAlbumFetcher';

import Album from './models/Album';
import Subscription from './models/Subscription';

import _ from 'lodash';

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../client')));
  // Handle React routing, return all requests to React app
  app.get('*', function (_req, res) {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
  });
}

app.get('/populate_latest_album', asyncMiddleware(async (_req, res, _next) => {
  const starMusiqAlbumsRetriever = new StarMusiqAlbumsFetcher();
  const latestAlbumsPageNumber = 1;

  const fetchedAlbumsPayload = await starMusiqAlbumsRetriever.fetchAlbums(latestAlbumsPageNumber);
  const { albums } = fetchedAlbumsPayload;
  const latestAlbum = _.head(albums);

  Album.findOne({ movieId: latestAlbum.movieId}, async (err, fetchedAlbum) => {
    if(err) {
      res.status(500).json({ error: err});
    } else {
      if(fetchedAlbum) {
        res.json({
          latestAlbum: fetchedAlbum,
          created: false,
        });
      } else {
        const createdAlbum = await Album.create({
          ...latestAlbum,
        });
        res.json({
          latestAlbum: createdAlbum,
          created: true,
        });
      }
    }
  });
}));

app.post('/save_subscription', asyncMiddleware(async (req, res, _next) => {
  const reqSubscriptionObject = req.body;

  const createdSubscriptionObject = await Subscription.create({
    payload: {
      ...reqSubscriptionObject,
    },
  });

  res.json({
    sub: createdSubscriptionObject,
    success: true,
  });
}));

app.listen(port, () => {
  logger(`Listening on port ${port}`);

  db.on('connected', () => {
    logger('DB connected');
  });
});
