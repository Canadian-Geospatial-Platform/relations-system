"use strict";

const connectToDatabase = require("./db");
function HTTPError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

module.exports.healthCheck = async () => {
  await connectToDatabase();
  console.log("Connection successful.");
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Connection successful." })
  };
};

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
    const tag = await Tag.findById(event.pathParameters.id);
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
    const tag = await Tag.findById(event.pathParameters.id);
    if (!tag)
      throw new HTTPError(
        404,
        `Tag with id: ${event.pathParameters.id} was not found`
      );
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
    const tag = await Tag.findById(event.pathParameters.id);
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

module.exports.tagRelationCreate = async event => {
  try {
    const { TagRelation } = await connectToDatabase();
    const tagRelation = await TagRelation.create(JSON.parse(event.body));
    return {
      statusCode: 200,
      body: JSON.stringify(tagRelation)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not create the tagRelation. " + err
    };
  }
};

module.exports.tagRelationGetOne = async event => {
  try {
    const { TagRelation } = await connectToDatabase();
    const tagRelation = await TagRelation.findById(event.pathParameters.id);
    if (!tagRelation)
      throw new HTTPError(
        404,
        `TagRelation with id: ${event.pathParameters.id} was not found`
      );
    return {
      statusCode: 200,
      body: JSON.stringify(tagRelation)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not fetch the TagRelation."
    };
  }
};

module.exports.tagRelationGetAll = async () => {
  try {
    const { TagRelation } = await connectToDatabase();
    const tagRelations = await TagRelation.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(tagRelations)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the tagRelations."
    };
  }
};

module.exports.tagRelationUpdate = async event => {
  try {
    const input = JSON.parse(event.body);
    const { TagRelation } = await connectToDatabase();
    const tagRelation = await TagRelation.findById(event.pathParameters.id);
    if (!tagRelation)
      throw new HTTPError(
        404,
        `TagRelation with id: ${event.pathParameters.id} was not found`
      );
    if (input.PopularityIndex)
      tagRelation.PopularityIndex = input.PopularityIndex;
    if (input.RessourceId) tagRelation.RessourceId = input.RessourceId;
    await tagRelation.save();
    return {
      statusCode: 200,
      body: JSON.stringify(tagRelation)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not update the TagRelation."
    };
  }
};

module.exports.tagRelationDestroy = async event => {
  try {
    const { TagRelation } = await connectToDatabase();
    const tagRelation = await TagRelation.findById(event.pathParameters.id);
    if (!tagRelation)
      throw new HTTPError(
        404,
        `TagRelation with id: ${event.pathParameters.id} was not found`
      );
    await tagRelation.destroy();
    return {
      statusCode: 200,
      body: JSON.stringify(tagRelation)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not destroy the TagRelation."
    };
  }
};

module.exports.collectionCreate = async event => {
  try {
    const { Collection } = await connectToDatabase();
    const collection = await Collection.create(JSON.parse(event.body));
    return {
      statusCode: 200,
      body: JSON.stringify(collection)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not create the collection. " + err
    };
  }
};

module.exports.collectionGetOne = async event => {
  try {
    const { Collection } = await connectToDatabase();
    const collection = await Collection.findById(event.pathParameters.id);
    if (!collection)
      throw new HTTPError(
        404,
        `Collection with id: ${event.pathParameters.id} was not found`
      );
    return {
      statusCode: 200,
      body: JSON.stringify(collection)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not fetch the Collection."
    };
  }
};

module.exports.collectionGetAll = async () => {
  try {
    const { Collection } = await connectToDatabase();
    const collections = await Collection.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(collections)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the collections."
    };
  }
};

module.exports.collectionUpdate = async event => {
  try {
    const input = JSON.parse(event.body);
    const { Collection } = await connectToDatabase();
    const collection = await Collection.findById(event.pathParameters.id);
    if (!collection)
      throw new HTTPError(
        404,
        `Collection with id: ${event.pathParameters.id} was not found`
      );
    if (input.Title) collection.Title = input.Title;
    if (input.Description) collection.Description = input.Description;
    await collection.save();
    return {
      statusCode: 200,
      body: JSON.stringify(collection)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not update the Collection."
    };
  }
};

module.exports.collectionDestroy = async event => {
  try {
    const { Collection } = await connectToDatabase();
    const collection = await Collection.findById(event.pathParameters.id);
    if (!collection)
      throw new HTTPError(
        404,
        `Collection with id: ${event.pathParameters.id} was not found`
      );
    await collection.destroy();
    return {
      statusCode: 200,
      body: JSON.stringify(collection)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not destroy the Collection."
    };
  }
};

module.exports.collectionRelationCreate = async event => {
  try {
    const { CollectionRelation } = await connectToDatabase();
    const collectionRelation = await CollectionRelation.create(
      JSON.parse(event.body)
    );
    return {
      statusCode: 200,
      body: JSON.stringify(collectionRelation)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not create the collectionRelation. " + err
    };
  }
};

module.exports.collectionRelationGetOne = async event => {
  try {
    const { CollectionRelation } = await connectToDatabase();
    const collectionRelation = await CollectionRelation.findById(
      event.pathParameters.id
    );
    if (!collectionRelation)
      throw new HTTPError(
        404,
        `CollectionRelation with id: ${event.pathParameters.id} was not found`
      );
    return {
      statusCode: 200,
      body: JSON.stringify(collectionRelation)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not fetch the CollectionRelation."
    };
  }
};

module.exports.collectionRelationGetAll = async () => {
  try {
    const { CollectionRelation } = await connectToDatabase();
    const collectionRelations = await CollectionRelation.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(collectionRelations)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the collectionRelations."
    };
  }
};

module.exports.collectionRelationUpdate = async event => {
  try {
    const input = JSON.parse(event.body);
    const { CollectionRelation } = await connectToDatabase();
    const collectionRelation = await CollectionRelation.findById(
      event.pathParameters.id
    );
    if (!collectionRelation)
      throw new HTTPError(
        404,
        `CollectionRelation with id: ${event.pathParameters.id} was not found`
      );
    if (input.PopularityIndex)
      collectionRelation.PopularityIndex = input.PopularityIndex;
    if (input.RessourceId) collectionRelation.RessourceId = input.RessourceId;
    await collectionRelation.save();
    return {
      statusCode: 200,
      body: JSON.stringify(collectionRelation)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not update the CollectionRelation."
    };
  }
};

module.exports.collectionRelationDestroy = async event => {
  try {
    const { CollectionRelation } = await connectToDatabase();
    const collectionRelation = await CollectionRelation.findById(
      event.pathParameters.id
    );
    if (!collectionRelation)
      throw new HTTPError(
        404,
        `CollectionRelation with id: ${event.pathParameters.id} was not found`
      );
    await collectionRelation.destroy();
    return {
      statusCode: 200,
      body: JSON.stringify(collectionRelation)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not destroy the CollectionRelation."
    };
  }
};
//
module.exports.ressourceCreate = async event => {
  try {
    const { Ressource } = await connectToDatabase();
    const ressource = await Ressource.create(JSON.parse(event.body));
    return {
      statusCode: 200,
      body: JSON.stringify(ressource)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not create the ressource. " + err
    };
  }
};

module.exports.ressourceGetOne = async event => {
  try {
    const { Ressource } = await connectToDatabase();
    const ressource = await Ressource.findById(event.pathParameters.id);
    if (!ressource)
      throw new HTTPError(
        404,
        `Ressource with id: ${event.pathParameters.id} was not found`
      );
    return {
      statusCode: 200,
      body: JSON.stringify(ressource)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not fetch the Ressource."
    };
  }
};

module.exports.ressourceGetAll = async () => {
  try {
    const { Ressource } = await connectToDatabase();
    const ressources = await Ressource.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(ressources)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the ressources."
    };
  }
};

module.exports.ressourceUpdate = async event => {
  try {
    const input = JSON.parse(event.body);
    const { Ressource } = await connectToDatabase();
    const ressource = await Ressource.findById(event.pathParameters.id);
    if (!ressource)
      throw new HTTPError(
        404,
        `Ressource with id: ${event.pathParameters.id} was not found`
      );
    if (input.Title) ressource.Title = input.Title;
    if (input.Description) ressource.Description = input.Description;
    if (input.RessourceUrl) ressource.RessourceUrl = input.RessourceUrl;
    await ressource.save();
    return {
      statusCode: 200,
      body: JSON.stringify(ressource)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not update the Ressource."
    };
  }
};

module.exports.ressourceDestroy = async event => {
  try {
    const { Ressource } = await connectToDatabase();
    const ressource = await Ressource.findById(event.pathParameters.id);
    if (!ressource)
      throw new HTTPError(
        404,
        `Ressource with id: ${event.pathParameters.id} was not found`
      );
    await ressource.destroy();
    return {
      statusCode: 200,
      body: JSON.stringify(ressource)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not destroy the Ressource."
    };
  }
};
