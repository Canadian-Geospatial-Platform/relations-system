export default (sequelize, type) => {
  return sequelize.define("Theme", {
    Id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Title: type.STRING,
    Description: type.STRING,
    PopularityIndex: {
      type: type.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  });
};
