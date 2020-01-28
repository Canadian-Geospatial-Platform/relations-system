"use strict";
const connectToDatabase = require("../../utils/db");
const HTTPError = require("../../utils/httpError");

module.exports.searchRecordCreate = async event => {
  try {
    const { SearchRecord } = await connectToDatabase();
    const searchRecord = await SearchRecord.create(JSON.parse(event.body));
    return {
      statusCode: 200,
      body: JSON.stringify(searchRecord)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not create the searchRecord. " + err
    };
  }
};

module.exports.searchRecordGetOne = async event => {
  try {
    const { SearchRecord } = await connectToDatabase();
    const searchRecord = await SearchRecord.findByPk(event.pathParameters.id);
    if (!searchRecord)
      throw new HTTPError(
        404,
        `SearchRecord with id: ${event.pathParameters.id} was not found`
      );
    return {
      statusCode: 200,
      body: JSON.stringify(searchRecord)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not fetch the SearchRecord."
    };
  }
};

module.exports.searchRecordGetAll = async () => {
  try {
    const { SearchRecord } = await connectToDatabase();
    const searchRecords = await SearchRecord.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(searchRecords)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the searchRecords."
    };
  }
};

module.exports.searchRecordUpdate = async event => {
  try {
    const input = JSON.parse(event.body);
    const { SearchRecord } = await connectToDatabase();
    const searchRecord = await SearchRecord.findByPk(event.pathParameters.id);
    if (!searchRecord)
      throw new HTTPError(
        404,
        `SearchRecord with id: ${event.pathParameters.id} was not found`
      );
    if (input.PopularityIndex)
      searchRecord.PopularityIndex = input.PopularityIndex;
    await searchRecord.save();
    return {
      statusCode: 200,
      body: JSON.stringify(searchRecord)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not update the SearchRecord."
    };
  }
};

module.exports.searchRecordDestroy = async event => {
  try {
    const { SearchRecord } = await connectToDatabase();
    const searchRecord = await SearchRecord.findByPk(event.pathParameters.id);
    if (!searchRecord)
      throw new HTTPError(
        404,
        `SearchRecord with id: ${event.pathParameters.id} was not found`
      );
    await searchRecord.destroy();
    return {
      statusCode: 200,
      body: JSON.stringify(searchRecord)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not destroy the SearchRecord."
    };
  }
};
