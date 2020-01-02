module.exports = (sequelize, type) => {
  return sequelize.define('note', {
    Id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Title: type.STRING,
    Description: type.STRING
  })
}
