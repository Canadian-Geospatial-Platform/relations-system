/*
/ Caution: This file is referenced by symbolic link in children folders for packaging purposes
**/

import connectToDatabase from "../../../utils/db";
import HTTPError from "../../../utils/httpError";
import { Op, fn, col } from "sequelize";

export async function create(event) {
  try {
    const db = await connectToDatabase();
    console.log(JSON.stringify(event.body));
    console.log(process.env.TABLE_NAME);
    const relation = await db[process.env.TABLE_NAME].create(
      JSON.parse(event.body)
    );
    console.log(JSON.stringify(relation));
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
}

export async function getOne(event) {
  try {
    const db = await connectToDatabase();
    const relation = await db[process.env.TABLE_NAME].findOne({
      where: {
        [process.env.FK_NAME_1]: event.pathParameters.id1,
        [process.env.FK_NAME_2]: event.pathParameters.id2
      }
    });
    if (!relation)
      throw new HTTPError(
        404,
        `Relation with ${process.env.FK_NAME_1}: ${event.pathParameters.id1} and ${process.env.FK_NAME_2}: ${event.pathParameters.id2} was not found`
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
}

export async function getAll(event) {
  try {
    const db = await connectToDatabase();
    const relations = await db[process.env.TABLE_NAME].findAll({
      attributes: [
        process.env.FK_NAME_2,
        [fn("sum", col("PopularityIndex")), "PopularityIndex"]
      ],
      order: [["PopularityIndex", "DESC"]],
      offset: event["queryStringParameters"]["offset"],
      limit: event["queryStringParameters"]["limit"],
      group: process.env.FK_NAME_2,
      where: {
        [process.env.FK_NAME_1]: {
          [Op.or]: JSON.parse(
            event["queryStringParameters"][process.env.FK_NAME_1]
          )
        }
      }
    });
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
}

export async function update(event) {
  try {
    const input = JSON.parse(event.body);
    const db = await connectToDatabase();
    const relation = await db[process.env.TABLE_NAME].findOne({
      where: {
        [process.env.FK_NAME_1]: event.pathParameters.id1,
        [process.env.FK_NAME_2]: event.pathParameters.id2
      }
    });
    if (!relation)
      throw new HTTPError(
        404,
        `Relation with ${process.env.FK_NAME_1}: ${event.pathParameters.id1} and ${process.env.FK_NAME_2}: ${event.pathParameters.id2} was not found`
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
}

export async function destroy(event) {
  try {
    const db = await connectToDatabase();
    const relation = await db[process.env.TABLE_NAME].findOne({
      where: {
        [process.env.FK_NAME_1]: event.pathParameters.id1,
        [process.env.FK_NAME_2]: event.pathParameters.id2
      }
    });
    if (!relation)
      throw new HTTPError(
        404,
        `Relation with ${process.env.FK_NAME_1}: ${event.pathParameters.id1} and ${process.env.FK_NAME_2}: ${event.pathParameters.id2} was not found`
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
}

export default { create, getOne, getAll, update, destroy };
