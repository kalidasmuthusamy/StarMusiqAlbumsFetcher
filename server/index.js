import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import webpush from 'web-push';
import _ from 'lodash';

import db from './db';
import logger from './logger';

import Album from './models/Album';
import Subscription from './models/Subscription';

import asyncMiddleware from './middlewares/asyncMiddleware';
import basicAuthMiddleware from './middlewares/basicAuthMiddleware';

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

  // For all GET requests except for internal API's (starts with /api/), handle with client files
  // Handle React routing, return all requests to React app
  app.get(/^((?!\/api\/).)*$/, function (_req, res) {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
  });
} else {
  app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
}

app.get('/api/get_albums', asyncMiddleware(async (_req, res, _next) => {
  const albums = await Album.find().sort([['weightage', 'descending']]);

  res.json({
    albums,
    status: 'success',
  });
}));

app.post('/api/hydrate_albums', basicAuthMiddleware, asyncMiddleware(async (_req, res, _next) => {
  const reversedPageNumbers = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  // get albums from page 1 to 10
  const scrapedAlbumsCollection = await Promise.all(_.map(reversedPageNumbers, async (pageNumber) => {
    const response = await (new StarMusiqAlbumsFetcher().fetchAlbums(pageNumber));

    return ({
      pageNumber: pageNumber,
      albums: response.albums || [],
    });
  }));

  // filter collections which have non-empty albums
  const nonEmptyAlbumsCollection = _.filter(scrapedAlbumsCollection, (albumCollectionWithPageNumber) => (
    !_.isEmpty(albumCollectionWithPageNumber.albums)
  ));

  const sortedPagesWithAlbums = _.sortBy(nonEmptyAlbumsCollection, 'pageNumber');
  // // get highest page number which have album collections
  const farthestPageWithAlbums = _.last(sortedPagesWithAlbums)['pageNumber'];
  const reversedContentPageNumbers = _.slice(reversedPageNumbers, _.indexOf(reversedPageNumbers, farthestPageWithAlbums));

  const createdAlbums = await Promise.all(_.map(reversedContentPageNumbers, async (pageNumber, pageNumberIdx) => {
    const albumsCollectionForCurrPageNumber = _.find(nonEmptyAlbumsCollection, { pageNumber: pageNumber});
    // reversing albums since first album in the page should be created latest
    const scrapedAlbums = _.reverse(albumsCollectionForCurrPageNumber['albums']);
    const upsertedAlbums = await Promise.all(_.map(scrapedAlbums, async (scrapedAlbum, scrapedAlbumIdx) => {
      const similarScrapedAlbumInDb = await Album.findOneAndUpdate({ movieId: scrapedAlbum.movieId }, { movieIconUrl: scrapedAlbum.movieIconUrl });
      if (similarScrapedAlbumInDb) {
        return similarScrapedAlbumInDb;
      } else {
        const createdScrapedAlbum = await Album.create({
          ...scrapedAlbum,
          weightage: (((pageNumberIdx + 1) * 50) + (scrapedAlbumIdx + 1)),
        });

        return createdScrapedAlbum;
      }
    }));

    return upsertedAlbums;
  }));

  res.json({ albums: createdAlbums });
}));


app.post('/api/refresh_albums', basicAuthMiddleware, asyncMiddleware(async (_req, res, _next) => {
  const starMusiqAlbumsRetriever = new StarMusiqAlbumsFetcher();
  const latestAlbumsPageNumber = 1;

  const dbAlbums = await Album.find().sort([['weightage', 'descending']]);
  const highestPersistedWeightage = _.head(dbAlbums)['weightage'] || 100000;

  const fetchedAlbumsPayload = await starMusiqAlbumsRetriever.fetchAlbums(latestAlbumsPageNumber);
  const { albums: scrapedAlbums } = fetchedAlbumsPayload;

  const newestScrapedAlbums = _.reverse(scrapedAlbums);
  const refreshedAlbums = await Promise.all(_.map(newestScrapedAlbums, async (scrapedAlbum, scrapedAlbumIdx) => {
    await Album.findOneAndDelete({ movieId: scrapedAlbum.movieId });
    const refreshedAlbum = await Album.create({
      ...scrapedAlbum,
      weightage: (highestPersistedWeightage + scrapedAlbumIdx + 1),
    });

    return refreshedAlbum;
  }));

  res.json({ refreshedAlbums: refreshedAlbums });
}));

app.post('/api/save_subscription', basicAuthMiddleware, asyncMiddleware(async (req, res, _next) => {
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

app.post('/api/push_to_subscribers', basicAuthMiddleware, asyncMiddleware(async (_req, res, _next) => {
  webpush.setGCMAPIKey(process.env.GCM_API_KEY);

  webpush.setVapidDetails(
    process.env.WEB_PUSH_MAIL_TO_URL,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const latestAlbums = await Album.find({}).sort([['weightage', 'descending']]);
  const latestAlbum = _.head(latestAlbums);
  const latestUnpublishedAlbum = latestAlbum.published ? null : latestAlbum;

  if(!_.isNil(latestUnpublishedAlbum)) {
    const userSubscriptions = await Subscription.find({});

    _.forEach(userSubscriptions, (userSubscription) => {
      const pushSubscriptionMap = userSubscription.get('payload');
      webpush.sendNotification(pushSubscriptionMap.toJSON(), JSON.stringify(latestUnpublishedAlbum));
    });

    await Album.findOneAndUpdate({ _id: latestUnpublishedAlbum['_id'] }, { published: true });
    res.json({ status: "success", usersNotifiedCount: _.size(userSubscriptions) });
  } else {
    res.json({ status: "no-op", message: "No unpublished albums found"});
  }
}));

app.listen(port, () => {
  logger(`Listening on port ${port}`);

  db.on('connected', () => {
    logger('DB connected');
  });
});

// handle all uncaught exceptions
// see - https://nodejs.org/api/process.html#process_event_uncaughtexception
process.on('uncaughtException', err => console.error('uncaught exception:', err));
// handle all unhandled promise rejections
// see - http://bluebirdjs.com/docs/api/error-management-configuration.html#global-rejection-events
// or for latest node - https://nodejs.org/api/process.html#process_event_unhandledrejection
process.on('unhandledRejection', error => console.error('unhandled rejection:', error));
