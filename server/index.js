import express from 'express';
import path from 'path';
import db from './db';
import logger from './logger';

import TestModel from './models/TestModel';

const app = express();
const port = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../client')));
  // Handle React routing, return all requests to React app
  app.get('*', function (_req, res) {
    const newTestRecord = new TestModel();
    newTestRecord.save();
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
  });
}

app.listen(port, () => {
  logger(`Listening on port ${port}`);

  db.on('connected', () => {
    logger('DB connected');
  });
});
