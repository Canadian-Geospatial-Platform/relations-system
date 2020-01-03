module.exports = (sequelize, type) => {
  return sequelize.define("CollectionRelation", {
    Id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    PopularityIndex: type.INTEGER,
    RessourceUrl: type.STRING
  });
};
