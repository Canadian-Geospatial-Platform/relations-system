
const connectToDatabase = require("../../utils/db");
const HTTPError = require("../../utils/httpError");

module.exports.ownershipRelationCreate = async event => {
  try {
    const db = await connectToDatabase();
    const ownershipRelation = await db[process.env.TABLE_NAME].create(
      JSON.parse(event.body)
    );
    return {
      statusCode: 200,
      body: JSON.stringify(ownershipRelation)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not create the ownershipRelation. " + err
    };
  }
};

module.exports.ownershipRelationGetOne = async event => {
  try {
    const db = await connectToDatabase();
    const ownershipRelation = await db[process.env.TABLE_NAME].findOne({
      where: {
        [process.env.FK_NAME_1]: event.pathParameters.id1,
        [process.env.FK_NAME_2]: event.pathParameters.id2
      }
    });
    if (!ownershipRelation)
      throw new HTTPError(
        404,
        `OwnershipRelation with ${process.env.FK_NAME_1}: ${event.pathParameters.id1} and ${process.env.FK_NAME_2}: ${event.pathParameters.id2} was not found`
      );
    return {
      statusCode: 200,
      body: JSON.stringify(ownershipRelation)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not fetch the OwnershipRelation."
    };
  }
};

module.exports.ownershipRelationGetAll = async () => {
  try {
    const db = await connectToDatabase();
    const ownershipRelations = await db[process.env.TABLE_NAME].findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(ownershipRelations)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the ownershipRelations."
    };
  }
};

module.exports.ownershipRelationUpdate = async event => {
  try {
    const input = JSON.parse(event.body);
    const db = await connectToDatabase();
    const ownershipRelation = await db[process.env.TABLE_NAME].findOne({
      where: {
        [process.env.FK_NAME_1]: event.pathParameters.id1,
        [process.env.FK_NAME_2]: event.pathParameters.id2
      }
    });
    if (!ownershipRelation)
      throw new HTTPError(
        404,
        `OwnershipRelation with ${process.env.FK_NAME_1}: ${event.pathParameters.id1} and ${process.env.FK_NAME_2}: ${event.pathParameters.id2} was not found`
      );
    if (input.OwnershipTypeId)
      ownershipRelation.OwnershipTypeId = input.OwnershipTypeId;
    await ownershipRelation.save();
    return {
      statusCode: 200,
      body: JSON.stringify(ownershipRelation)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not update the OwnershipRelation."
    };
  }
};

module.exports.ownershipRelationDestroy = async event => {
  try {
    const db = await connectToDatabase();
    const ownershipRelation = await db[process.env.TABLE_NAME].findOne({
      where: {
        [process.env.FK_NAME_1]: event.pathParameters.id1,
        [process.env.FK_NAME_2]: event.pathParameters.id2
      }
    });
    if (!ownershipRelation)
      throw new HTTPError(
        404,
        `OwnershipRelation with ${process.env.FK_NAME_1}: ${event.pathParameters.id1} and ${process.env.FK_NAME_2}: ${event.pathParameters.id2} was not found`
      );
    await ownershipRelation.destroy();
    return {
      statusCode: 200,
      body: JSON.stringify(ownershipRelation)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not destroy the OwnershipRelation."
    };
  }
};
