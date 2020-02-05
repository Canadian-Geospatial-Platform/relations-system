import connectToDatabase from "../../utils/db";
import HTTPError from "../../utils/httpError";

export async function create(event) {
  try {
    const { Theme } = await connectToDatabase();
    const theme = await Theme.create(JSON.parse(event.body));
    return {
      statusCode: 200,
      body: JSON.stringify(theme)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not create the theme. " + err
    };
  }
}

export async function getOne(event) {
  try {
    const { Theme } = await connectToDatabase();
    const theme = await Theme.findByPk(event.pathParameters.id);
    if (!theme)
      throw new HTTPError(
        404,
        `Theme with id: ${event.pathParameters.id} was not found`
      );
    return {
      statusCode: 200,
      body: JSON.stringify(theme)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not fetch the Theme."
    };
  }
}

export async function getAll() {
  try {
    const { Theme } = await connectToDatabase();
    const themes = await Theme.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(themes)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the themes."
    };
  }
}

export async function update(event) {
  try {
    const input = JSON.parse(event.body);
    const { Theme } = await connectToDatabase();
    const theme = await Theme.findByPk(event.pathParameters.id);
    if (!theme)
      throw new HTTPError(
        404,
        `Theme with id: ${event.pathParameters.id} was not found`
      );
    if (input.PopularityIndex) theme.PopularityIndex = input.PopularityIndex;
    if (input.Title) theme.Title = input.Title;
    if (input.Description) theme.Description = input.Description;
    await theme.save();
    return {
      statusCode: 200,
      body: JSON.stringify(theme)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not update the Theme."
    };
  }
}

export async function destroy(event) {
  try {
    const { Theme } = await connectToDatabase();
    const theme = await Theme.findByPk(event.pathParameters.id);
    if (!theme)
      throw new HTTPError(
        404,
        `Theme with id: ${event.pathParameters.id} was not found`
      );
    await theme.destroy();
    return {
      statusCode: 200,
      body: JSON.stringify(theme)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not destroy the Theme."
    };
  }
}

export default { create, getOne, getAll, update, destroy };
