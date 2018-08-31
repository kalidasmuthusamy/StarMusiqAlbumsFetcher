const asyncMiddleware = routeHandlerFunction => {
  return (req, res, next) => {
    Promise.resolve(routeHandlerFunction(req, res, next)).catch(next);
  };
};

export default asyncMiddleware;
