import connectToDatabase from "../../utils/db";
import HTTPError from "../../utils/httpError";

export async function create(event) {
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
}

export async function getOne(event) {
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
}

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

export async function update(event) {
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
}

export async function destroy(event) {
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
}

export default { create, getOne, getAll, update, destroy };
