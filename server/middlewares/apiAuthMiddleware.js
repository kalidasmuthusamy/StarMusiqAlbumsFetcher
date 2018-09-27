const apiAuthMiddleware = (req, res, next) => {
  const reqSecretToken = req.headers['api-secret-token'];

  if (process.env.API_SECRET_TOKEN == undefined) {
    res.json({ status: 401, message: 'Unauthorized. API Secret is Missing' });
  }
  else if (reqSecretToken === process.env.API_SECRET_TOKEN){
    next();
  } else {
    res.json({ status: 401, message: 'Unauthorized' });
  }
};

export default apiAuthMiddleware;
