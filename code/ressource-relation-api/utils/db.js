"use strict";
require("dotenv").config({ path: "../../.env" });
const Sequelize = require("sequelize");
const Gendoc = require("apidoc-sequelize-generator");
const Mysql2 = require("mysql2"); // Needed to fix sequelize issues with WebPack

const CollectionModel = require("../models/Collection");
const ResourceModel = require("../models/Resource");
const TagModel = require("../models/Tag");
const UserModel = require("../models/User");
const CommunityModel = require("../models/Community");
const RelationModel = require("../models/Relation");
const OwnershipRelationModel = require("../models/OwnershipRelation");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    dialectModule: Mysql2, // Needed to fix sequelize issues with WebPack
    dialectOptions: {
      connectTimeout: 60000
    },
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  }
);
const Collection = CollectionModel(sequelize, Sequelize);
const Resource = ResourceModel(sequelize, Sequelize);
const Tag = TagModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);
const Community = CommunityModel(sequelize, Sequelize);

const CommunityUserRelation = RelationModel(
  sequelize,
  Sequelize,
  "CommunityUserRelation",
  "CommunityId",
  "UserId"
);
Community.belongsToMany(User, {
  through: CommunityUserRelation
});
User.belongsToMany(Community, {
  through: CommunityUserRelation
});

const CollectionCollectionRelation = RelationModel(
  sequelize,
  Sequelize,
  "CollectionCollectionRelation",
  "ParentId",
  "ChildId"
);
Collection.belongsToMany(Collection, {
  through: CollectionCollectionRelation,
  as: "ParentId",
  otherKey: "ChildId"
});
Collection.belongsToMany(Collection, {
  through: CollectionCollectionRelation,
  as: "ChildId",
  otherKey: "ParentId"
});
CollectionCollectionRelation.removeAttribute("CollectionId"); // sequelize generates this useless attribute

const CollectionResourceRelation = RelationModel(
  sequelize,
  Sequelize,
  "CollectionResourceRelation",
  "CollectionId",
  "ResourceId"
);
Resource.belongsToMany(Collection, {
  through: CollectionResourceRelation
});
Collection.belongsToMany(Resource, {
  through: CollectionResourceRelation
});

const UserCommunityOwnershipRelation = OwnershipRelationModel(
  sequelize,
  Sequelize,
  "UserCommunityOwnershipRelation",
  "UserId",
  "CommunityId"
);

Community.belongsToMany(User, {
  through: UserCommunityOwnershipRelation
});
User.belongsToMany(Community, {
  through: UserCommunityOwnershipRelation
});

const UserResourceOwnershipRelation = OwnershipRelationModel(
  sequelize,
  Sequelize,
  "UserResourceOwnershipRelation",
  "UserId",
  "ResourceId"
);

Resource.belongsToMany(User, {
  through: UserResourceOwnershipRelation
});
User.belongsToMany(Resource, {
  through: UserResourceOwnershipRelation
});

const ModelDocs = Gendoc(sequelize)
  .auto()
  .toString();

const Models = {
  Collection,
  ModelDocs, // The docs detailing the Models
  Resource,
  Tag,
  User,
  Community,
  CommunityUserRelation,
  CollectionResourceRelation,
  CollectionCollectionRelation,
  UserCommunityOwnershipRelation,
  UserResourceOwnershipRelation
};

const connection = {};

module.exports = async () => {
  if (connection.isConnected) {
    console.log("=> Using existing connection.");
    return Models;
  }

  await sequelize.sync();
  await sequelize.authenticate();
  connection.isConnected = true;
  console.log("=> Created a new connection.");
  return Models;
};
