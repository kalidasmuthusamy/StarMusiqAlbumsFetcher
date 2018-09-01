import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import webpush from 'web-push';
import moment from 'moment';
import _ from 'lodash';

import db from './db';
import logger from './logger';

import Album from './models/Album';
import Subscription from './models/Subscription';

import asyncMiddleware from './middlewares/asyncMiddleware';

import StarMusiqAlbumsFetcher from '../client/src/lib/CORSEnabledStarMusiqAlbumFetcher';


const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../client')));

  app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  // Handle React routing, return all requests to React app
  app.get('*', function (_req, res) {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
  });
} else {
  app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
}

app.post('/populate_latest_album', asyncMiddleware(async (_req, res, _next) => {
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

app.get('/push_to_subscribers', asyncMiddleware(async (_req, res, _next) => {
  webpush.setGCMAPIKey(process.env.GCM_API_KEY);

  webpush.setVapidDetails(
    process.env.WEB_PUSH_MAIL_TO_URL,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const startOfToday = moment().startOf('day');
  Album.findOne({
    createdAt: {
      $gte: startOfToday,
    }
  }, (err, latestAlbum) => {
    if(err) {
      // Error Handling
    } else {
      if(latestAlbum) {
        Subscription.find({}, (err, subscriptionCollection) => {
          if (err) {
            res.status(500).json({ error: err });
          } else {
            if (subscriptionCollection) {
              _.forEach(subscriptionCollection, (subscriptionRecord) => {
                const pushSubscriptionMap = subscriptionRecord.get('payload');
                webpush.sendNotification(pushSubscriptionMap.toJSON(), JSON.stringify(latestAlbum));
              });

              res.json({ status: 'success' });
            } else {
              // No subscriptions
            }
          }
        });
      }
    }
  })

}));

app.listen(port, () => {
  logger(`Listening on port ${port}`);

  db.on('connected', () => {
    logger('DB connected');
  });
});
