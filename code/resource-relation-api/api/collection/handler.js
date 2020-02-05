import connectToDatabase from "../../utils/db";
import HTTPError from "../../utils/httpError";

export async function create(event) {
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
}

export async function getOne(event) {
  try {
    const { Collection } = await connectToDatabase();
    const collection = await Collection.findByPk(event.pathParameters.id);
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
}

export async function getAll() {
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
}

export async function update(event) {
  try {
    const input = JSON.parse(event.body);
    const { Collection } = await connectToDatabase();
    const collection = await Collection.findByPk(event.pathParameters.id);
    if (!collection)
      throw new HTTPError(
        404,
        `Collection with id: ${event.pathParameters.id} was not found`
      );
    if (input.PopularityIndex)
      collection.PopularityIndex = input.PopularityIndex;
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
}

export async function destroy(event) {
  try {
    const { Collection } = await connectToDatabase();
    const collection = await Collection.findByPk(event.pathParameters.id);
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
}

export default { create, getOne, getAll, update, destroy };
