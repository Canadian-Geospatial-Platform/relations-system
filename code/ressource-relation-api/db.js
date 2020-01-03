const Sequelize = require("sequelize");
const Gendoc = require("apidoc-sequelize-generator");
const Mysql2 = require("mysql2"); // Needed to fix sequelize issues with WebPack

const CollectionModel = require("./models/Collection");
const CollectionRelationModel = require("./models/CollectionRelation");
const RessourceModel = require("./models/Ressource");
const TagModel = require("./models/Tag");
const TagRelationModel = require("./models/TagRelation");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    dialectModule: Mysql2, // Needed to fix sequelize issues with WebPack
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  }
);
const Collection = CollectionModel(sequelize, Sequelize);
const CollectionRelation = CollectionRelationModel(sequelize, Sequelize);
const Ressource = RessourceModel(sequelize, Sequelize);
const Tag = TagModel(sequelize, Sequelize);
const TagRelation = TagRelationModel(sequelize, Sequelize);

CollectionRelation.belongsTo(Collection, {
  foreignKey: { allowNull: false },
  onDelete: "cascade"
});
CollectionRelation.belongsTo(Ressource, {
  foreignKey: { allowNull: false },
  onDelete: "cascade"
});
TagRelation.belongsTo(Collection, { onDelete: "cascade" });
TagRelation.belongsTo(Ressource, { onDelete: "cascade" });
TagRelation.belongsTo(Tag, {
  foreignKey: { allowNull: false },
  onDelete: "cascade"
});

const ModelDocs = Gendoc(sequelize)
  .auto()
  .toString();

const Models = {
  Collection,
  CollectionRelation,
  ModelDocs, // The docs detailing the Models
  Ressource,
  Tag,
  TagRelation
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
