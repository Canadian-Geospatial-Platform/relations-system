import connectToDatabase from "../../utils/db";
import HTTPError from "../../utils/httpError";

export async function create(event) {
  try {
    const { Community } = await connectToDatabase();
    const community = await Community.create(JSON.parse(event.body));
    return {
      statusCode: 200,
      body: JSON.stringify(community)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not create the community. " + err
    };
  }
}

export async function getOne(event) {
  try {
    const { Community } = await connectToDatabase();
    const community = await Community.findByPk(event.pathParameters.id);
    if (!community)
      throw new HTTPError(
        404,
        `Community with id: ${event.pathParameters.id} was not found`
      );
    return {
      statusCode: 200,
      body: JSON.stringify(community)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not fetch the Community."
    };
  }
}

export async function getAll() {
  try {
    const { Community } = await connectToDatabase();
    const communities = await Community.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(communities)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the communities."
    };
  }
}

export async function update(event) {
  try {
    const input = JSON.parse(event.body);
    const { Community } = await connectToDatabase();
    const community = await Community.findByPk(event.pathParameters.id);
    if (!community)
      throw new HTTPError(
        404,
        `Community with id: ${event.pathParameters.id} was not found`
      );
    if (input.PopularityIndex)
      community.PopularityIndex = input.PopularityIndex;
    if (input.Name) community.Name = input.Name;
    if (input.Description) community.Description = input.Description;
    await community.save();
    return {
      statusCode: 200,
      body: JSON.stringify(community)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not update the Community."
    };
  }
}

export async function destroy(event) {
  try {
    const { Community } = await connectToDatabase();
    const community = await Community.findByPk(event.pathParameters.id);
    if (!community)
      throw new HTTPError(
        404,
        `Community with id: ${event.pathParameters.id} was not found`
      );
    await community.destroy();
    return {
      statusCode: 200,
      body: JSON.stringify(community)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not destroy the Community."
    };
  }
}

export default { create, getOne, getAll, update, destroy };
