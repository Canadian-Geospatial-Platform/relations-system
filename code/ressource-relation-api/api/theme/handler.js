
const connectToDatabase = require("../../utils/db");
const HTTPError = require("../../utils/httpError");

module.exports.themeCreate = async event => {
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
};

module.exports.themeGetOne = async event => {
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
};

module.exports.themeGetAll = async () => {
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
};

module.exports.themeUpdate = async event => {
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
};

module.exports.themeDestroy = async event => {
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
};
