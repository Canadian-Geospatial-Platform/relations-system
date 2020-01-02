module.exports = (sequelize, type) => {
  return sequelize.define("TagRelation", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    popularityindex: type.INTEGER,
    referenceurl: type.STRING
  });
};
