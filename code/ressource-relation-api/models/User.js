module.exports = (sequelize, type) => {
  return sequelize.define("User", {
    Id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Name: type.STRING,
    Description: type.STRING
  });
};
