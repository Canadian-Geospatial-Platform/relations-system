"use strict";
const connectToDatabase = require("../../utils/db");
const HTTPError = require("../../utils/httpError");

module.exports.resourceCreate = async event => {
  try {
    const { Resource } = await connectToDatabase();
    const resource = await Resource.create(JSON.parse(event.body));
    return {
      statusCode: 200,
      body: JSON.stringify(resource)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not create the resource. " + err
    };
  }
};

module.exports.resourceGetOne = async event => {
  try {
    const { Resource } = await connectToDatabase();
    const resource = await Resource.findByPk(event.pathParameters.id);
    if (!resource)
      throw new HTTPError(
        404,
        `Resource with id: ${event.pathParameters.id} was not found`
      );
    return {
      statusCode: 200,
      body: JSON.stringify(resource)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not fetch the Resource."
    };
  }
};

module.exports.resourceGetAll = async () => {
  try {
    const { Resource } = await connectToDatabase();
    const resources = await Resource.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(resources)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the resources."
    };
  }
};

module.exports.resourceUpdate = async event => {
  try {
    const input = JSON.parse(event.body);
    const { Resource } = await connectToDatabase();
    const resource = await Resource.findByPk(event.pathParameters.id);
    if (!resource)
      throw new HTTPError(
        404,
        `Resource with id: ${event.pathParameters.id} was not found`
      );
    if (input.PopularityIndex) resource.PopularityIndex = input.PopularityIndex;
    if (input.Title) resource.Title = input.Title;
    if (input.Description) resource.Description = input.Description;
    if (input.ResourceUrl) resource.ResourceUrl = input.ResourceUrl;
    await resource.save();
    return {
      statusCode: 200,
      body: JSON.stringify(resource)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not update the Resource."
    };
  }
};

module.exports.resourceDestroy = async event => {
  try {
    const { Resource } = await connectToDatabase();
    const resource = await Resource.findByPk(event.pathParameters.id);
    if (!resource)
      throw new HTTPError(
        404,
        `Resource with id: ${event.pathParameters.id} was not found`
      );
    await resource.destroy();
    return {
      statusCode: 200,
      body: JSON.stringify(resource)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not destroy the Resource."
    };
  }
};
