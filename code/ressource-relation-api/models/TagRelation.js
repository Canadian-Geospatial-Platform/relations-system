module.exports = (sequelize, type) => {
  return sequelize.define("TagRelation", {
    Id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    PopularityIndex: {
      type: type.INTEGER,
      defaultValue: 0
    }
  });
};
