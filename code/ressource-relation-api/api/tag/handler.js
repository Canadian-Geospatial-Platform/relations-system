"use strict";
const connectToDatabase = require("../..//utils/db");
const HTTPError = require("../../utils/httpError");

module.exports.tagCreate = async event => {
  try {
    const { Tag } = await connectToDatabase();
    const tag = await Tag.create(JSON.parse(event.body));
    return {
      statusCode: 200,
      body: JSON.stringify(tag)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not create the tag. " + err
    };
  }
};

module.exports.tagGetOne = async event => {
  try {
    const { Tag } = await connectToDatabase();
    const tag = await Tag.findByPk(event.pathParameters.id);
    if (!tag)
      throw new HTTPError(
        404,
        `Tag with id: ${event.pathParameters.id} was not found`
      );
    return {
      statusCode: 200,
      body: JSON.stringify(tag)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not fetch the Tag."
    };
  }
};

module.exports.tagGetAll = async () => {
  try {
    const { Tag } = await connectToDatabase();
    const tags = await Tag.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(tags)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the tags."
    };
  }
};

module.exports.tagUpdate = async event => {
  try {
    const input = JSON.parse(event.body);
    const { Tag } = await connectToDatabase();
    const tag = await Tag.findByPk(event.pathParameters.id);
    if (!tag)
      throw new HTTPError(
        404,
        `Tag with id: ${event.pathParameters.id} was not found`
      );
    if (input.PopularityIndex) tag.PopularityIndex = input.PopularityIndex;
    if (input.title) tag.title = input.title;
    if (input.description) tag.description = input.description;
    await tag.save();
    return {
      statusCode: 200,
      body: JSON.stringify(tag)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not update the Tag."
    };
  }
};

module.exports.tagDestroy = async event => {
  try {
    const { Tag } = await connectToDatabase();
    const tag = await Tag.findByPk(event.pathParameters.id);
    if (!tag)
      throw new HTTPError(
        404,
        `Tag with id: ${event.pathParameters.id} was not found`
      );
    await tag.destroy();
    return {
      statusCode: 200,
      body: JSON.stringify(tag)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not destroy the Tag."
    };
  }
};
