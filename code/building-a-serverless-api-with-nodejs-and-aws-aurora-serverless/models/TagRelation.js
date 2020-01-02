module.exports = (sequelize, type) => {
  return sequelize.define("TagRelation", {
    Id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    PopularityIndex: type.INTEGER,
    ReferenceUrl: type.STRING
  });
};
