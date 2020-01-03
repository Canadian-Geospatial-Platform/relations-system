module.exports = (sequelize, type) => {
  return sequelize.define("Ressource", {
    Id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Title: type.STRING,
    Description: type.STRING,
    RessourceUrl: type.STRING,
    PopularityIndex: {
      type: type.INTEGER,
      defaultValue: 0
    }
  });
};
