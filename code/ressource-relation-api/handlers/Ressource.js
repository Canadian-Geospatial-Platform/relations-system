"use strict";
const connectToDatabase = require("../utils/db");
const HTTPError = require("../utils/httpError");

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
    const ressource = await Ressource.findByPk(event.pathParameters.id);
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
    const ressource = await Ressource.findByPk(event.pathParameters.id);
    if (!ressource)
      throw new HTTPError(
        404,
        `Ressource with id: ${event.pathParameters.id} was not found`
      );
    if (input.PopularityIndex)
      ressource.PopularityIndex = input.PopularityIndex;
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
    const ressource = await Ressource.findByPk(event.pathParameters.id);
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
