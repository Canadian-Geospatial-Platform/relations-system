"use strict";

require("dotenv").config({ path: "../.env" });
const Sequelize = require("sequelize");
const Gendoc = require("apidoc-sequelize-generator");
const Mysql2 = require("mysql2");

const CollectionModel = require("../models/Collection");
const ResourceModel = require("../models/Resource");
const TagModel = require("../models/Tag");
const UserModel = require("../models/User");
const CommunityModel = require("../models/Community");
const ThemeModel = require("../models/Theme");
const RelationModel = require("../models/Relation");
const OwnershipRelationModel = require("../models/OwnershipRelation");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    logging: false,
    dialect: "mysql",
    dialectModule: Mysql2,
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
const Theme = ThemeModel(sequelize, Sequelize);

Theme.belongsTo(Community, { onDelete: "cascade" });

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

const UserTagOwnershipRelation = OwnershipRelationModel(
  sequelize,
  Sequelize,
  "UserTagOwnershipRelation",
  "UserId",
  "TagId"
);

Tag.belongsToMany(User, {
  through: UserTagOwnershipRelation
});
User.belongsToMany(Tag, {
  through: UserTagOwnershipRelation
});

const UserCollectionOwnershipRelation = OwnershipRelationModel(
  sequelize,
  Sequelize,
  "UserCollectionOwnershipRelation",
  "UserId",
  "CollectionId"
);

Collection.belongsToMany(User, {
  through: UserCollectionOwnershipRelation
});
User.belongsToMany(Collection, {
  through: UserCollectionOwnershipRelation
});

const CommunityCollectionOwnershipRelation = OwnershipRelationModel(
  sequelize,
  Sequelize,
  "CommunityCollectionOwnershipRelation",
  "CommunityId",
  "CollectionId"
);

Collection.belongsToMany(Community, {
  through: CommunityCollectionOwnershipRelation
});
Community.belongsToMany(Collection, {
  through: CommunityCollectionOwnershipRelation
});

const CommunityTagOwnershipRelation = OwnershipRelationModel(
  sequelize,
  Sequelize,
  "CommunityTagOwnershipRelation",
  "CommunityId",
  "TagId"
);

Tag.belongsToMany(Community, {
  through: CommunityTagOwnershipRelation
});
Community.belongsToMany(Tag, {
  through: CommunityTagOwnershipRelation
});

const CommunityResourceOwnershipRelation = OwnershipRelationModel(
  sequelize,
  Sequelize,
  "CommunityResourceOwnershipRelation",
  "CommunityId",
  "ResourceId"
);

Resource.belongsToMany(Community, {
  through: CommunityResourceOwnershipRelation
});
Community.belongsToMany(Resource, {
  through: CommunityResourceOwnershipRelation
});

const ModelDocs = Gendoc(sequelize)
  .auto()
  .toString();

const Models = {
  Collection,
  ModelDocs, // The docs detailing the Models
  Resource,
  Tag,
  Theme,
  User,
  Community,
  CommunityUserRelation,
  CollectionResourceRelation,
  CollectionCollectionRelation,
  UserCommunityOwnershipRelation,
  UserResourceOwnershipRelation,
  UserTagOwnershipRelation,
  UserCollectionOwnershipRelation,
  CommunityCollectionOwnershipRelation,
  CommunityTagOwnershipRelation,
  CommunityResourceOwnershipRelation,
  sequelize
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
