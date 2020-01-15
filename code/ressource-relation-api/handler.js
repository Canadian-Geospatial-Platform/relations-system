"use strict";
const connectToDatabase = require("./utils/db");
const HTTPError = require("./utils/httpError");

module.exports.docs = async () => {
  const { ModelDocs } = await connectToDatabase();
  console.log("Connection successful.");

  return {
    statusCode: 200,
    body: ModelDocs
  };
};

module.exports.tagRelationCreate = async event => {
  try {
    const { TagRelation } = await connectToDatabase();
    const input = JSON.parse(event.body);
    if (
      (input.CollectionId && input.RessourceId) ||
      (!input.CollectionId && !input.RessourceId)
    )
      throw new HTTPError(
        422,
        `A TagRelation must have one CollectionId XOR RessourceId`
      );
    const tagRelation = await TagRelation.create(input);
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
    const tagRelation = await TagRelation.findByPk(event.pathParameters.id);
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
    const tagRelation = await TagRelation.findByPk(event.pathParameters.id);
    if (!tagRelation)
      throw new HTTPError(
        404,
        `TagRelation with id: ${event.pathParameters.id} was not found`
      );
    if (input.CollectionId && input.RessourceId)
      throw new HTTPError(
        422,
        `A TagRelation must have one CollectionId XOR RessourceId`
      );
    if (input.PopularityIndex)
      tagRelation.PopularityIndex = input.PopularityIndex;
    if (input.CollectionId) {
      tagRelation.RessourceId = null;
      tagRelation.CollectionId = input.CollectionId;
    }
    if (input.RessourceId) {
      tagRelation.CollectionId = null;
      tagRelation.RessourceId = input.RessourceId;
    }
    if (input.TagId) tagRelation.TagId = input.TagId;
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
    const tagRelation = await TagRelation.findByPk(event.pathParameters.id);
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

// module.exports.collectionCreate = async event => {
//   try {
//     const { Collection } = await connectToDatabase();
//     const collection = await Collection.create(JSON.parse(event.body));
//     return {
//       statusCode: 200,
//       body: JSON.stringify(collection)
//     };
//   } catch (err) {
//     console.log(err);
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: "Could not create the collection. " + err
//     };
//   }
// };

// module.exports.collectionGetOne = async event => {
//   try {
//     const { Collection } = await connectToDatabase();
//     const collection = await Collection.findByPk(event.pathParameters.id);
//     if (!collection)
//       throw new HTTPError(
//         404,
//         `Collection with id: ${event.pathParameters.id} was not found`
//       );
//     return {
//       statusCode: 200,
//       body: JSON.stringify(collection)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: err.message || "Could not fetch the Collection."
//     };
//   }
// };

// module.exports.collectionGetAll = async () => {
//   try {
//     const { Collection } = await connectToDatabase();
//     const collections = await Collection.findAll();
//     return {
//       statusCode: 200,
//       body: JSON.stringify(collections)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: "Could not fetch the collections."
//     };
//   }
// };

// module.exports.collectionUpdate = async event => {
//   try {
//     const input = JSON.parse(event.body);
//     const { Collection } = await connectToDatabase();
//     const collection = await Collection.findByPk(event.pathParameters.id);
//     if (!collection)
//       throw new HTTPError(
//         404,
//         `Collection with id: ${event.pathParameters.id} was not found`
//       );
//     if (input.PopularityIndex)
//       collection.PopularityIndex = input.PopularityIndex;
//     if (input.Title) collection.Title = input.Title;
//     if (input.Description) collection.Description = input.Description;
//     await collection.save();
//     return {
//       statusCode: 200,
//       body: JSON.stringify(collection)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: err.message || "Could not update the Collection."
//     };
//   }
// };

// module.exports.collectionDestroy = async event => {
//   try {
//     const { Collection } = await connectToDatabase();
//     const collection = await Collection.findByPk(event.pathParameters.id);
//     if (!collection)
//       throw new HTTPError(
//         404,
//         `Collection with id: ${event.pathParameters.id} was not found`
//       );
//     await collection.destroy();
//     return {
//       statusCode: 200,
//       body: JSON.stringify(collection)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: err.message || "Could not destroy the Collection."
//     };
//   }
// };

// module.exports.collectionRelationCreate = async event => {
//   try {
//     const { CollectionRelation } = await connectToDatabase();
//     const input = JSON.parse(event.body);
//     if (
//       (input.CollectionRessourceId && input.RessourceId) ||
//       (!input.CollectionRessourceId && !input.RessourceId)
//     )
//       throw new HTTPError(
//         422,
//         `A CollectionRelation must have one CollectionRessourceId XOR RessourceId`
//       );
//     const collectionRelation = await CollectionRelation.create(input);
//     return {
//       statusCode: 200,
//       body: JSON.stringify(collectionRelation)
//     };
//   } catch (err) {
//     console.log(err);
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: "Could not create the collectionRelation. " + err
//     };
//   }
// };

// module.exports.collectionRelationGetOne = async event => {
//   try {
//     const { CollectionRelation } = await connectToDatabase();
//     const collectionRelation = await CollectionRelation.findByPk(
//       event.pathParameters.id
//     );
//     if (!collectionRelation)
//       throw new HTTPError(
//         404,
//         `CollectionRelation with id: ${event.pathParameters.id} was not found`
//       );
//     return {
//       statusCode: 200,
//       body: JSON.stringify(collectionRelation)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: err.message || "Could not fetch the CollectionRelation."
//     };
//   }
// };

// module.exports.collectionRelationGetAll = async () => {
//   try {
//     const { CollectionRelation } = await connectToDatabase();
//     const collectionRelations = await CollectionRelation.findAll();
//     return {
//       statusCode: 200,
//       body: JSON.stringify(collectionRelations)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: "Could not fetch the collectionRelations."
//     };
//   }
// };

// module.exports.collectionRelationUpdate = async event => {
//   try {
//     const input = JSON.parse(event.body);
//     const { CollectionRelation } = await connectToDatabase();
//     const collectionRelation = await CollectionRelation.findByPk(
//       event.pathParameters.id
//     );
//     if (!collectionRelation)
//       throw new HTTPError(
//         404,
//         `CollectionRelation with id: ${event.pathParameters.id} was not found`
//       );
//     if (input.CollectionRessourceId && input.RessourceId)
//       throw new HTTPError(
//         422,
//         `A CollectionRelation must have one CollectionRessourceId XOR RessourceId`
//       );
//     if (input.PopularityIndex)
//       collectionRelation.PopularityIndex = input.PopularityIndex;
//     if (input.CollectionId)
//       collectionRelation.CollectionId = input.CollectionId;
//     if (input.CollectionRessourceId) {
//       collectionRelation.RessourceId = null;
//       collectionRelation.CollectionRessourceId = input.CollectionRessourceId;
//     }
//     if (input.RessourceId) {
//       collectionRelation.CollectionRessourceId = null;
//       collectionRelation.RessourceId = input.RessourceId;
//     }
//     await collectionRelation.save();
//     return {
//       statusCode: 200,
//       body: JSON.stringify(collectionRelation)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: err.message || "Could not update the CollectionRelation."
//     };
//   }
// };

// module.exports.collectionRelationDestroy = async event => {
//   try {
//     const { CollectionRelation } = await connectToDatabase();
//     const collectionRelation = await CollectionRelation.findByPk(
//       event.pathParameters.id
//     );
//     if (!collectionRelation)
//       throw new HTTPError(
//         404,
//         `CollectionRelation with id: ${event.pathParameters.id} was not found`
//       );
//     await collectionRelation.destroy();
//     return {
//       statusCode: 200,
//       body: JSON.stringify(collectionRelation)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: err.message || "Could not destroy the CollectionRelation."
//     };
//   }
// };
//
// module.exports.ressourceCreate = async event => {
//   try {
//     const { Ressource } = await connectToDatabase();
//     const ressource = await Ressource.create(JSON.parse(event.body));
//     return {
//       statusCode: 200,
//       body: JSON.stringify(ressource)
//     };
//   } catch (err) {
//     console.log(err);
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: "Could not create the ressource. " + err
//     };
//   }
// };

// module.exports.ressourceGetOne = async event => {
//   try {
//     const { Ressource } = await connectToDatabase();
//     const ressource = await Ressource.findByPk(event.pathParameters.id);
//     if (!ressource)
//       throw new HTTPError(
//         404,
//         `Ressource with id: ${event.pathParameters.id} was not found`
//       );
//     return {
//       statusCode: 200,
//       body: JSON.stringify(ressource)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: err.message || "Could not fetch the Ressource."
//     };
//   }
// };

// module.exports.ressourceGetAll = async () => {
//   try {
//     const { Ressource } = await connectToDatabase();
//     const ressources = await Ressource.findAll();
//     return {
//       statusCode: 200,
//       body: JSON.stringify(ressources)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: "Could not fetch the ressources."
//     };
//   }
// };

// module.exports.ressourceUpdate = async event => {
//   try {
//     const input = JSON.parse(event.body);
//     const { Ressource } = await connectToDatabase();
//     const ressource = await Ressource.findByPk(event.pathParameters.id);
//     if (!ressource)
//       throw new HTTPError(
//         404,
//         `Ressource with id: ${event.pathParameters.id} was not found`
//       );
//     if (input.PopularityIndex)
//       ressource.PopularityIndex = input.PopularityIndex;
//     if (input.Title) ressource.Title = input.Title;
//     if (input.Description) ressource.Description = input.Description;
//     if (input.RessourceUrl) ressource.RessourceUrl = input.RessourceUrl;
//     await ressource.save();
//     return {
//       statusCode: 200,
//       body: JSON.stringify(ressource)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: err.message || "Could not update the Ressource."
//     };
//   }
// };

// module.exports.ressourceDestroy = async event => {
//   try {
//     const { Ressource } = await connectToDatabase();
//     const ressource = await Ressource.findByPk(event.pathParameters.id);
//     if (!ressource)
//       throw new HTTPError(
//         404,
//         `Ressource with id: ${event.pathParameters.id} was not found`
//       );
//     await ressource.destroy();
//     return {
//       statusCode: 200,
//       body: JSON.stringify(ressource)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: err.message || "Could not destroy the Ressource."
//     };
//   }
// };
//
// module.exports.userCreate = async event => {
//   try {
//     const { User } = await connectToDatabase();
//     const user = await User.create(JSON.parse(event.body));
//     return {
//       statusCode: 200,
//       body: JSON.stringify(user)
//     };
//   } catch (err) {
//     console.log(err);
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: "Could not create the user. " + err
//     };
//   }
// };

// module.exports.userGetOne = async event => {
//   try {
//     const { User } = await connectToDatabase();
//     const user = await User.findByPk(event.pathParameters.id);
//     if (!user)
//       throw new HTTPError(
//         404,
//         `User with id: ${event.pathParameters.id} was not found`
//       );
//     return {
//       statusCode: 200,
//       body: JSON.stringify(user)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: err.message || "Could not fetch the User."
//     };
//   }
// };

// module.exports.userGetAll = async () => {
//   try {
//     const { User } = await connectToDatabase();
//     const users = await User.findAll();
//     return {
//       statusCode: 200,
//       body: JSON.stringify(users)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: "Could not fetch the users."
//     };
//   }
// };

// module.exports.userUpdate = async event => {
//   try {
//     const input = JSON.parse(event.body);
//     const { User } = await connectToDatabase();
//     const user = await User.findByPk(event.pathParameters.id);
//     if (!user)
//       throw new HTTPError(
//         404,
//         `User with id: ${event.pathParameters.id} was not found`
//       );
//     if (input.PopularityIndex) user.PopularityIndex = input.PopularityIndex;
//     if (input.Name) user.Name = input.Name;
//     if (input.Description) user.Description = input.Description;
//     await user.save();
//     return {
//       statusCode: 200,
//       body: JSON.stringify(user)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: err.message || "Could not update the User."
//     };
//   }
// };

// module.exports.userDestroy = async event => {
//   try {
//     const { User } = await connectToDatabase();
//     const user = await User.findByPk(event.pathParameters.id);
//     if (!user)
//       throw new HTTPError(
//         404,
//         `User with id: ${event.pathParameters.id} was not found`
//       );
//     await user.destroy();
//     return {
//       statusCode: 200,
//       body: JSON.stringify(user)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: err.message || "Could not destroy the User."
//     };
//   }
// };
//
// module.exports.communityCreate = async event => {
//   try {
//     const { Community } = await connectToDatabase();
//     const community = await Community.create(JSON.parse(event.body));
//     return {
//       statusCode: 200,
//       body: JSON.stringify(community)
//     };
//   } catch (err) {
//     console.log(err);
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: "Could not create the community. " + err
//     };
//   }
// };

// module.exports.communityGetOne = async event => {
//   try {
//     const { Community } = await connectToDatabase();
//     const community = await Community.findByPk(event.pathParameters.id);
//     if (!community)
//       throw new HTTPError(
//         404,
//         `Community with id: ${event.pathParameters.id} was not found`
//       );
//     return {
//       statusCode: 200,
//       body: JSON.stringify(community)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: err.message || "Could not fetch the Community."
//     };
//   }
// };

// module.exports.communityGetAll = async () => {
//   try {
//     const { Community } = await connectToDatabase();
//     const communitys = await Community.findAll();
//     return {
//       statusCode: 200,
//       body: JSON.stringify(communitys)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: "Could not fetch the communitys."
//     };
//   }
// };

// module.exports.communityUpdate = async event => {
//   try {
//     const input = JSON.parse(event.body);
//     const { Community } = await connectToDatabase();
//     const community = await Community.findByPk(event.pathParameters.id);
//     if (!community)
//       throw new HTTPError(
//         404,
//         `Community with id: ${event.pathParameters.id} was not found`
//       );
//     if (input.PopularityIndex)
//       community.PopularityIndex = input.PopularityIndex;
//     if (input.Name) community.Name = input.Name;
//     if (input.Description) community.Description = input.Description;
//     await community.save();
//     return {
//       statusCode: 200,
//       body: JSON.stringify(community)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: err.message || "Could not update the Community."
//     };
//   }
// };

// module.exports.communityDestroy = async event => {
//   try {
//     const { Community } = await connectToDatabase();
//     const community = await Community.findByPk(event.pathParameters.id);
//     if (!community)
//       throw new HTTPError(
//         404,
//         `Community with id: ${event.pathParameters.id} was not found`
//       );
//     await community.destroy();
//     return {
//       statusCode: 200,
//       body: JSON.stringify(community)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: err.message || "Could not destroy the Community."
//     };
//   }
// };
//
// module.exports.communityUserRelationCreate = async event => {
//   try {
//     const { CommunityUserRelation } = await connectToDatabase();
//     const communityUserRelation = await CommunityUserRelation.create(
//       JSON.parse(event.body)
//     );
//     return {
//       statusCode: 200,
//       body: JSON.stringify(communityUserRelation)
//     };
//   } catch (err) {
//     console.log(err);
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: "Could not create the communityUserRelation. " + err
//     };
//   }
// };

// module.exports.communityUserRelationGetOne = async event => {
//   try {
//     const { CommunityUserRelation } = await connectToDatabase();
//     const communityUserRelation = await CommunityUserRelation.findOne({
//       where: {
//         CommunityId: event.pathParameters.communityId,
//         UserId: event.pathParameters.userId
//       }
//     });
//     if (!communityUserRelation)
//       throw new HTTPError(
//         404,
//         `CommunityUserRelation with communityId: ${event.pathParameters.communityId} and userId: ${event.pathParameters.userId} was not found`
//       );
//     return {
//       statusCode: 200,
//       body: JSON.stringify(communityUserRelation)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: err.message || "Could not fetch the CommunityUserRelation."
//     };
//   }
// };

// module.exports.communityUserRelationGetAll = async () => {
//   try {
//     const { CommunityUserRelation } = await connectToDatabase();
//     const communityUserRelations = await CommunityUserRelation.findAll();
//     return {
//       statusCode: 200,
//       body: JSON.stringify(communityUserRelations)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: "Could not fetch the communityUserRelations."
//     };
//   }
// };

// module.exports.communityUserRelationUpdate = async event => {
//   try {
//     const input = JSON.parse(event.body);
//     const { CommunityUserRelation } = await connectToDatabase();
//     const communityUserRelation = await CommunityUserRelation.findOne({
//       where: {
//         CommunityId: event.pathParameters.communityId,
//         UserId: event.pathParameters.userId
//       }
//     });
//     if (!communityUserRelation)
//       throw new HTTPError(
//         404,
//         `CommunityUserRelation with communityId: ${event.pathParameters.communityId} and userId: ${event.pathParameters.userId} was not found`
//       );
//     if (input.PopularityIndex)
//       communityUserRelation.PopularityIndex = input.PopularityIndex;
//     await communityUserRelation.save();
//     return {
//       statusCode: 200,
//       body: JSON.stringify(communityUserRelation)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: err.message || "Could not update the CommunityUserRelation."
//     };
//   }
// };

// module.exports.communityUserRelationDestroy = async event => {
//   try {
//     const { CommunityUserRelation } = await connectToDatabase();
//     const communityUserRelation = await CommunityUserRelation.findOne({
//       where: {
//         CommunityId: event.pathParameters.communityId,
//         UserId: event.pathParameters.userId
//       }
//     });
//     if (!communityUserRelation)
//       throw new HTTPError(
//         404,
//         `CommunityUserRelation with communityId: ${event.pathParameters.communityId} and userId: ${event.pathParameters.userId} was not found`
//       );
//     await communityUserRelation.destroy();
//     return {
//       statusCode: 200,
//       body: JSON.stringify(communityUserRelation)
//     };
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { "Content-Type": "text/plain" },
//       body: err.message || "Could not destroy the CommunityUserRelation."
//     };
//   }
// };

// const communityUserRelation = require("./handlers/communityUserRelation");

//// testing
