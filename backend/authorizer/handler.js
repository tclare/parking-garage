'use strict';

module.exports.authorizerHandler = async (event) => {
  return {
    isAuthorized: event?.headers?.authorization === process.env.CAR_PARK_AUTHORIZATION
  };
};