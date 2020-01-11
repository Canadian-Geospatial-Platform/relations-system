"use strict";

const Sequelize = require("sequelize");
const Gendoc = require("apidoc-sequelize-generator");
const Mysql2 = require("mysql2"); // Needed to fix sequelize issues with WebPack

const CollectionModel = require("../models/Collection");
const RessourceModel = require("../models/Ressource");
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
const Ressource = RessourceModel(sequelize, Sequelize);
const Tag = TagModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);
const Community = CommunityModel(sequelize, Sequelize);

const CollectionRessourceRelation = RelationModel(
  sequelize,
  Sequelize,
  "CollectionRessourceRelation"
);
const CollectionCollectionRelation = RelationModel(
  sequelize,
  Sequelize,
  "CollectionCollectionRelation"
);
const CommunityUserRelation = RelationModel(
  sequelize,
  Sequelize,
  "CommunityUserRelation"
);

Ressource.belongsToMany(Collection, {
  through: CollectionRessourceRelation,
  as: "ChildId",
  otherKey: "ParentId"
});
// Collection.belongsToMany(Ressource, {
//   through: CollectionRessourceRelation,
//   as: "ParentId",
//   otherKey: "ChildId"
// });

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

Community.belongsToMany(User, {
  through: CommunityUserRelation,
  as: "ParentId",
  otherKey: "ChildId"
});
User.belongsToMany(Community, {
  through: CommunityUserRelation,
  as: "ChildId",
  otherKey: "ParentId"
});

const ModelDocs = Gendoc(sequelize)
  .auto()
  .toString();

const Models = {
  Collection,
  ModelDocs, // The docs detailing the Models
  Ressource,
  Tag,
  User,
  Community,
  CommunityUserRelation,
  CollectionRessourceRelation,
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
