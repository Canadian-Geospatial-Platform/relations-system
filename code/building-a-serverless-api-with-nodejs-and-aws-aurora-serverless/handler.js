"use strict";

const connectToDatabase = require("./db");
function HTTPError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

module.exports.healthCheck = async () => {
  await connectToDatabase();
  console.log("Connection successful.");
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Connection successful." })
  };
};

module.exports.noteCreate = async event => {
  try {
    const { Note } = await connectToDatabase();
    const note = await Note.create(JSON.parse(event.body));
    return {
      statusCode: 200,
      body: JSON.stringify(note)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not create the note. " + err
    };
  }
};

module.exports.noteGetOne = async event => {
  try {
    const { Note } = await connectToDatabase();
    const note = await Note.findById(event.pathParameters.id);
    if (!note)
      throw new HTTPError(
        404,
        `Note with id: ${event.pathParameters.id} was not found`
      );
    return {
      statusCode: 200,
      body: JSON.stringify(note)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not fetch the Note."
    };
  }
};

module.exports.noteGetAll = async () => {
  try {
    const { Note } = await connectToDatabase();
    const notes = await Note.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(notes)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the notes."
    };
  }
};

module.exports.noteUpdate = async event => {
  try {
    const input = JSON.parse(event.body);
    const { Note } = await connectToDatabase();
    const note = await Note.findById(event.pathParameters.id);
    if (!note)
      throw new HTTPError(
        404,
        `Note with id: ${event.pathParameters.id} was not found`
      );
    if (input.title) note.title = input.title;
    if (input.description) note.description = input.description;
    await note.save();
    return {
      statusCode: 200,
      body: JSON.stringify(note)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not update the Note."
    };
  }
};

module.exports.noteDestroy = async event => {
  try {
    const { Note } = await connectToDatabase();
    const note = await Note.findById(event.pathParameters.id);
    if (!note)
      throw new HTTPError(
        404,
        `Note with id: ${event.pathParameters.id} was not found`
      );
    await note.destroy();
    return {
      statusCode: 200,
      body: JSON.stringify(note)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not destroy the Note."
    };
  }
};

module.exports.tagCreate = async event => {
  try {
    const { Tag } = await connectToDatabase();
    const tag = await Tag.create(JSON.parse(event.body));
    return {
      statusCode: 200,
      body: JSON.stringify(tag)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not create the tag. " + err
    };
  }
};

module.exports.tagGetOne = async event => {
  try {
    const { Tag } = await connectToDatabase();
    const tag = await Tag.findById(event.pathParameters.id);
    if (!tag)
      throw new HTTPError(
        404,
        `Tag with id: ${event.pathParameters.id} was not found`
      );
    return {
      statusCode: 200,
      body: JSON.stringify(tag)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not fetch the Tag."
    };
  }
};

module.exports.tagGetAll = async () => {
  try {
    const { Tag } = await connectToDatabase();
    const tags = await Tag.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(tags)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the tags."
    };
  }
};

module.exports.tagUpdate = async event => {
  try {
    const input = JSON.parse(event.body);
    const { Tag } = await connectToDatabase();
    const tag = await Tag.findById(event.pathParameters.id);
    if (!tag)
      throw new HTTPError(
        404,
        `Tag with id: ${event.pathParameters.id} was not found`
      );
    if (input.title) tag.title = input.title;
    if (input.description) tag.description = input.description;
    await tag.save();
    return {
      statusCode: 200,
      body: JSON.stringify(tag)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not update the Tag."
    };
  }
};

module.exports.tagDestroy = async event => {
  try {
    const { Tag } = await connectToDatabase();
    const tag = await Tag.findById(event.pathParameters.id);
    if (!tag)
      throw new HTTPError(
        404,
        `Tag with id: ${event.pathParameters.id} was not found`
      );
    await tag.destroy();
    return {
      statusCode: 200,
      body: JSON.stringify(tag)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not destroy the Tag."
    };
  }
};

module.exports.tagRelationCreate = async event => {
  try {
    const { TagRelation } = await connectToDatabase();
    const tagRelation = await TagRelation.create(JSON.parse(event.body));
    return {
      statusCode: 200,
      body: JSON.stringify(tagRelation)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not create the tagRelation. " + err
    };
  }
};

module.exports.tagRelationGetOne = async event => {
  try {
    const { TagRelation } = await connectToDatabase();
    const tagRelation = await TagRelation.findById(event.pathParameters.id);
    if (!tagRelation)
      throw new HTTPError(
        404,
        `TagRelation with id: ${event.pathParameters.id} was not found`
      );
    return {
      statusCode: 200,
      body: JSON.stringify(tagRelation)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not fetch the TagRelation."
    };
  }
};

module.exports.tagRelationGetAll = async () => {
  try {
    const { TagRelation } = await connectToDatabase();
    const tagRelations = await TagRelation.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(tagRelations)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the tagRelations."
    };
  }
};

module.exports.tagRelationUpdate = async event => {
  try {
    const input = JSON.parse(event.body);
    const { TagRelation } = await connectToDatabase();
    const tagRelation = await TagRelation.findById(event.pathParameters.id);
    if (!tagRelation)
      throw new HTTPError(
        404,
        `TagRelation with id: ${event.pathParameters.id} was not found`
      );
    if (input.title) tagRelation.title = input.title;
    if (input.description) tagRelation.description = input.description;
    await tagRelation.save();
    return {
      statusCode: 200,
      body: JSON.stringify(tagRelation)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not update the TagRelation."
    };
  }
};

module.exports.tagRelationDestroy = async event => {
  try {
    const { TagRelation } = await connectToDatabase();
    const tagRelation = await TagRelation.findById(event.pathParameters.id);
    if (!tagRelation)
      throw new HTTPError(
        404,
        `TagRelation with id: ${event.pathParameters.id} was not found`
      );
    await tagRelation.destroy();
    return {
      statusCode: 200,
      body: JSON.stringify(tagRelation)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not destroy the TagRelation."
    };
  }
};
