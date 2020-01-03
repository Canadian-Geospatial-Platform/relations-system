const Sequelize = require("sequelize");
const mysql2 = require("mysql2"); // Needed to fix sequelize issues with WebPack

const CollectionModel = require("./models/Collection");
const CollectionRelationModel = require("./models/CollectionRelation");
const TagModel = require("./models/Tag");
const TagRelationModel = require("./models/TagRelation");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    dialectModule: mysql2, // Needed to fix sequelize issues with WebPack
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  }
);
const Collection = CollectionModel(sequelize, Sequelize);
const CollectionRelation = CollectionRelationModel(sequelize, Sequelize);
const Tag = TagModel(sequelize, Sequelize);
const TagRelation = TagRelationModel(sequelize, Sequelize);

const Models = { Collection, CollectionRelation, Tag, TagRelation };
const connection = {};

CollectionRelation.belongsTo(Collection, { onDelete: "cascade" });
TagRelation.belongsTo(Tag, { onDelete: "cascade" });

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
