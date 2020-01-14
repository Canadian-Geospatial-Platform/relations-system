"use strict";

const Sequelize = require("sequelize");
const Gendoc = require("apidoc-sequelize-generator");
const Mysql2 = require("mysql2"); // Needed to fix sequelize issues with WebPack

const CollectionModel = require("../models/Collection");
const ResourceModel = require("../models/Resource");
const TagModel = require("../models/Tag");
const UserModel = require("../models/User");
const CommunityModel = require("../models/Community");
const RelationModel = require("../models/Relation");

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

const CollectionCollectionRelation = RelationModel(
  sequelize,
  Sequelize,
  "CollectionCollectionRelation",
  "ParentId",
  "ChildId"
);

const CollectionResourceRelation = RelationModel(
  sequelize,
  Sequelize,
  "CollectionResourceRelation",
  "CollectionId",
  "ResourceId"
);
const CommunityUserRelation = RelationModel(
  sequelize,
  Sequelize,
  "CommunityUserRelation",
  "CommunityId",
  "UserId"
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

Resource.belongsToMany(Collection, {
  through: CollectionResourceRelation
});
Collection.belongsToMany(Resource, {
  through: CollectionResourceRelation
});

Community.belongsToMany(User, {
  through: CommunityUserRelation
});
User.belongsToMany(Community, {
  through: CommunityUserRelation
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
  CollectionCollectionRelation
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
