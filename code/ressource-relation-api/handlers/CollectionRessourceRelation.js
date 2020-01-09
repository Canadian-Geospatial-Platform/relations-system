"use strict";
const connectToDatabase = require("../utils/db");
const HTTPError = require("../utils/httpError");

module.exports.collectionRessourceRelationCreate = async event => {
  try {
    const { CollectionRessourceRelation } = await connectToDatabase();
    const collectionRessourceRelation = await CollectionRessourceRelation.create(
      JSON.parse(event.body)
    );
    return {
      statusCode: 200,
      body: JSON.stringify(collectionRessourceRelation)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not create the collectionRessourceRelation. " + err
    };
  }
};

module.exports.collectionRessourceRelationGetOne = async event => {
  try {
    const { CollectionRessourceRelation } = await connectToDatabase();
    const collectionRessourceRelation = await CollectionRessourceRelation.findOne(
      {
        where: {
          CollectionId: event.pathParameters.collectionId,
          RessourceId: event.pathParameters.ressourceId
        }
      }
    );
    if (!collectionRessourceRelation)
      throw new HTTPError(
        404,
        `CollectionRessourceRelation with collectionId: ${event.pathParameters.collectionId} and ressourceId: ${event.pathParameters.ressourceId} was not found`
      );
    return {
      statusCode: 200,
      body: JSON.stringify(collectionRessourceRelation)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not fetch the CollectionRessourceRelation."
    };
  }
};

module.exports.collectionRessourceRelationGetAll = async () => {
  try {
    const { CollectionRessourceRelation } = await connectToDatabase();
    const collectionRessourceRelations = await CollectionRessourceRelation.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(collectionRessourceRelations)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the collectionRessourceRelations."
    };
  }
};

module.exports.collectionRessourceRelationUpdate = async event => {
  try {
    const input = JSON.parse(event.body);
    const { CollectionRessourceRelation } = await connectToDatabase();
    const collectionRessourceRelation = await CollectionRessourceRelation.findOne(
      {
        where: {
          CollectionId: event.pathParameters.collectionId,
          RessourceId: event.pathParameters.ressourceId
        }
      }
    );
    if (!collectionRessourceRelation)
      throw new HTTPError(
        404,
        `CollectionRessourceRelation with collectionId: ${event.pathParameters.collectionId} and ressourceId: ${event.pathParameters.ressourceId} was not found`
      );
    if (input.PopularityIndex)
      collectionRessourceRelation.PopularityIndex = input.PopularityIndex;
    await collectionRessourceRelation.save();
    return {
      statusCode: 200,
      body: JSON.stringify(collectionRessourceRelation)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not update the CollectionRessourceRelation."
    };
  }
};

module.exports.collectionRessourceRelationDestroy = async event => {
  try {
    const { CollectionRessourceRelation } = await connectToDatabase();
    const collectionRessourceRelation = await CollectionRessourceRelation.findOne(
      {
        where: {
          CollectionId: event.pathParameters.collectionId,
          RessourceId: event.pathParameters.ressourceId
        }
      }
    );
    if (!collectionRessourceRelation)
      throw new HTTPError(
        404,
        `CollectionRessourceRelation with collectionId: ${event.pathParameters.collectionId} and ressourceId: ${event.pathParameters.ressourceId} was not found`
      );
    await collectionRessourceRelation.destroy();
    return {
      statusCode: 200,
      body: JSON.stringify(collectionRessourceRelation)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not destroy the CollectionRessourceRelation."
    };
  }
};
