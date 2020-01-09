"use strict";
const connectToDatabase = require("../utils/db");
const HTTPError = require("../utils/httpError");

module.exports.userCreate = async event => {
  try {
    const { User } = await connectToDatabase();
    const user = await User.create(JSON.parse(event.body));
    return {
      statusCode: 200,
      body: JSON.stringify(user)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not create the user. " + err
    };
  }
};

module.exports.userGetOne = async event => {
  try {
    const { User } = await connectToDatabase();
    const user = await User.findByPk(event.pathParameters.id);
    if (!user)
      throw new HTTPError(
        404,
        `User with id: ${event.pathParameters.id} was not found`
      );
    return {
      statusCode: 200,
      body: JSON.stringify(user)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not fetch the User."
    };
  }
};

module.exports.userGetAll = async () => {
  try {
    const { User } = await connectToDatabase();
    const users = await User.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(users)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the users."
    };
  }
};

module.exports.userUpdate = async event => {
  try {
    const input = JSON.parse(event.body);
    const { User } = await connectToDatabase();
    const user = await User.findByPk(event.pathParameters.id);
    if (!user)
      throw new HTTPError(
        404,
        `User with id: ${event.pathParameters.id} was not found`
      );
    if (input.PopularityIndex) user.PopularityIndex = input.PopularityIndex;
    if (input.Name) user.Name = input.Name;
    if (input.Description) user.Description = input.Description;
    await user.save();
    return {
      statusCode: 200,
      body: JSON.stringify(user)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not update the User."
    };
  }
};

module.exports.userDestroy = async event => {
  try {
    const { User } = await connectToDatabase();
    const user = await User.findByPk(event.pathParameters.id);
    if (!user)
      throw new HTTPError(
        404,
        `User with id: ${event.pathParameters.id} was not found`
      );
    await user.destroy();
    return {
      statusCode: 200,
      body: JSON.stringify(user)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not destroy the User."
    };
  }
};
