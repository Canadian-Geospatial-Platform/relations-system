"use strict";
const connectToDatabase = require("../utils/db");
const HTTPError = require("../utils/httpError");

module.exports.relationCreate = async event => {
  try {
    const { Relation } = await connectToDatabase();
    const relation = await Relation.create(JSON.parse(event.body));
    return {
      statusCode: 200,
      body: JSON.stringify(relation)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not create the relation. " + err
    };
  }
};

module.exports.relationGetOne = async event => {
  try {
    const { Relation } = await connectToDatabase();
    const relation = await Relation.findOne({
      where: {
        CommunityId: event.pathParameters.communityId,
        UserId: event.pathParameters.userId
      }
    });
    if (!relation)
      throw new HTTPError(
        404,
        `Relation with communityId: ${event.pathParameters.communityId} and userId: ${event.pathParameters.userId} was not found`
      );
    return {
      statusCode: 200,
      body: JSON.stringify(relation)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not fetch the Relation."
    };
  }
};

module.exports.relationGetAll = async () => {
  try {
    const { Relation } = await connectToDatabase();
    const relations = await Relation.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(relations)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the relations."
    };
  }
};

module.exports.relationUpdate = async event => {
  try {
    const input = JSON.parse(event.body);
    const { Relation } = await connectToDatabase();
    const relation = await Relation.findOne({
      where: {
        CommunityId: event.pathParameters.communityId,
        UserId: event.pathParameters.userId
      }
    });
    if (!relation)
      throw new HTTPError(
        404,
        `Relation with communityId: ${event.pathParameters.communityId} and userId: ${event.pathParameters.userId} was not found`
      );
    if (input.PopularityIndex) relation.PopularityIndex = input.PopularityIndex;
    await relation.save();
    return {
      statusCode: 200,
      body: JSON.stringify(relation)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not update the Relation."
    };
  }
};

module.exports.relationDestroy = async event => {
  try {
    const { Relation } = await connectToDatabase();
    const relation = await Relation.findOne({
      where: {
        CommunityId: event.pathParameters.communityId,
        UserId: event.pathParameters.userId
      }
    });
    if (!relation)
      throw new HTTPError(
        404,
        `Relation with communityId: ${event.pathParameters.communityId} and userId: ${event.pathParameters.userId} was not found`
      );
    await relation.destroy();
    return {
      statusCode: 200,
      body: JSON.stringify(relation)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not destroy the Relation."
    };
  }
};
