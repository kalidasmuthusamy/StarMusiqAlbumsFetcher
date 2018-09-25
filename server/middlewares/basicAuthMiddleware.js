import auth from 'basic-auth';

const basicAuthMiddleware = (req, res, next) => {
  const user = auth(req);

  if(!user || user.name !== process.env.BASIC_AUTH_USER || user.pass !== process.env.BASIC_AUTH_PASS) {
    res.json({ message: 'Access Denied', status: 401});
  } else {
    next();
  }
};

export default basicAuthMiddleware;
