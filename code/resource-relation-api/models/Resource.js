export default (sequelize, type) => {
  return sequelize.define("Resource", {
    Id: {
      allowNull: false,
      type: type.STRING,
      primaryKey: true
    },
    Title: type.STRING,
    Description: type.STRING,
    ResourceUrl: type.STRING,
    PopularityIndex: {
      type: type.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  });
};
