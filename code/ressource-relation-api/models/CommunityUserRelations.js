module.exports = (sequelize, type) => {
  return sequelize.define("CommunityUserRelation", {
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
