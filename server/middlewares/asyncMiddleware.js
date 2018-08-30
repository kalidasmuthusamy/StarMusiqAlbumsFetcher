const asyncMiddleware = routeHandlerFunction => {
  return (req, res, next) => {
    Promise.resolve(routeHandlerFunction(req, res, next)).catch((error) => {
      console.log('error occured');
      next(error);
    });
  };
};

export default asyncMiddleware;