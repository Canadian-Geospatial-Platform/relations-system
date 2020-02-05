import connectToDatabase from "../../utils/db";
import HTTPError from "../../utils/httpError";

export async function create(event) {
  try {
    const { SearchRecord } = await connectToDatabase();
    const searchRecord = await SearchRecord.create(JSON.parse(event.body));
    return {
      statusCode: 200,
      body: JSON.stringify(searchRecord)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not create the searchRecord. " + err
    };
  }
}

export async function getOne(event) {
  try {
    const { SearchRecord } = await connectToDatabase();
    const searchRecord = await SearchRecord.findByPk(event.pathParameters.id);
    if (!searchRecord)
      throw new HTTPError(
        404,
        `SearchRecord with id: ${event.pathParameters.id} was not found`
      );
    return {
      statusCode: 200,
      body: JSON.stringify(searchRecord)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not fetch the SearchRecord."
    };
  }
}

module.exports.searchRecordGetAll = async () => {
  try {
    const { SearchRecord } = await connectToDatabase();
    const searchRecords = await SearchRecord.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(searchRecords)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the searchRecords."
    };
  }
};

export async function update(event) {
  try {
    const input = JSON.parse(event.body);
    const { SearchRecord } = await connectToDatabase();
    const searchRecord = await SearchRecord.findByPk(event.pathParameters.id);
    if (!searchRecord)
      throw new HTTPError(
        404,
        `SearchRecord with id: ${event.pathParameters.id} was not found`
      );
    if (input.PopularityIndex)
      searchRecord.PopularityIndex = input.PopularityIndex;
    await searchRecord.save();
    return {
      statusCode: 200,
      body: JSON.stringify(searchRecord)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not update the SearchRecord."
    };
  }
}

export async function destroy(event) {
  try {
    const { SearchRecord } = await connectToDatabase();
    const searchRecord = await SearchRecord.findByPk(event.pathParameters.id);
    if (!searchRecord)
      throw new HTTPError(
        404,
        `SearchRecord with id: ${event.pathParameters.id} was not found`
      );
    await searchRecord.destroy();
    return {
      statusCode: 200,
      body: JSON.stringify(searchRecord)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not destroy the SearchRecord."
    };
  }
}

export default { create, getOne, getAll, update, destroy };
