import connectToDatabase from "../../utils/db";
import HTTPError from "../../utils/httpError";

export async function create(event) {
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
}

export async function getOne(event) {
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
}

export async function getAll() {
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
}

export async function update(event) {
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
}

export async function destroy(event) {
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
}

export default { create, getOne, getAll, update, destroy };
