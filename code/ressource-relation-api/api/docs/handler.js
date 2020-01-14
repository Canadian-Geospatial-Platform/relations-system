"use strict";
const connectToDatabase = require("../../utils/db");
const HTTPError = require("../../utils/httpError");

module.exports.docs = async () => {
  const { ModelDocs } = await connectToDatabase();
  console.log("Connection successful.");

  return {
    statusCode: 200,
    body: ModelDocs
  };
};
