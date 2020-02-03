

module.exports = (sequelize, type) => {
  return sequelize.define("SearchRecord", {
    Id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Type: type.STRING,
    Value: type.STRING,
    PopularityIndex: {
      type: type.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  });
};
