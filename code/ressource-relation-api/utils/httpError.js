"use strict";

const HTTPError = () => {
  // your method logic
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

module.exports = {
  HTTPError
};
