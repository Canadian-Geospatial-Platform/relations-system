"use strict";
const connectToDatabase = require("../utils/db");
const HTTPError = require("../utils/httpError");

module.exports.communityUserRelationCreate = async event => {
  try {
    const { CommunityUserRelation } = await connectToDatabase();
    const communityUserRelation = await CommunityUserRelation.create(
      JSON.parse(event.body)
    );
    return {
      statusCode: 200,
      body: JSON.stringify(communityUserRelation)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not create the communityUserRelation. " + err
    };
  }
};

module.exports.communityUserRelationGetOne = async event => {
  try {
    const { CommunityUserRelation } = await connectToDatabase();
    const communityUserRelation = await CommunityUserRelation.findOne({
      where: {
        CommunityId: event.pathParameters.communityId,
        UserId: event.pathParameters.userId
      }
    });
    if (!communityUserRelation)
      throw new HTTPError(
        404,
        `CommunityUserRelation with communityId: ${event.pathParameters.communityId} and userId: ${event.pathParameters.userId} was not found`
      );
    return {
      statusCode: 200,
      body: JSON.stringify(communityUserRelation)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not fetch the CommunityUserRelation."
    };
  }
};

module.exports.communityUserRelationGetAll = async () => {
  try {
    const { CommunityUserRelation } = await connectToDatabase();
    const communityUserRelations = await CommunityUserRelation.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(communityUserRelations)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the communityUserRelations."
    };
  }
};

module.exports.communityUserRelationUpdate = async event => {
  try {
    const input = JSON.parse(event.body);
    const { CommunityUserRelation } = await connectToDatabase();
    const communityUserRelation = await CommunityUserRelation.findOne({
      where: {
        CommunityId: event.pathParameters.communityId,
        UserId: event.pathParameters.userId
      }
    });
    if (!communityUserRelation)
      throw new HTTPError(
        404,
        `CommunityUserRelation with communityId: ${event.pathParameters.communityId} and userId: ${event.pathParameters.userId} was not found`
      );
    if (input.PopularityIndex)
      communityUserRelation.PopularityIndex = input.PopularityIndex;
    await communityUserRelation.save();
    return {
      statusCode: 200,
      body: JSON.stringify(communityUserRelation)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not update the CommunityUserRelation."
    };
  }
};

module.exports.communityUserRelationDestroy = async event => {
  try {
    const { CommunityUserRelation } = await connectToDatabase();
    const communityUserRelation = await CommunityUserRelation.findOne({
      where: {
        CommunityId: event.pathParameters.communityId,
        UserId: event.pathParameters.userId
      }
    });
    if (!communityUserRelation)
      throw new HTTPError(
        404,
        `CommunityUserRelation with communityId: ${event.pathParameters.communityId} and userId: ${event.pathParameters.userId} was not found`
      );
    await communityUserRelation.destroy();
    return {
      statusCode: 200,
      body: JSON.stringify(communityUserRelation)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not destroy the CommunityUserRelation."
    };
  }
};
