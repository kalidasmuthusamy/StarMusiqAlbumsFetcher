const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client')));
  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
