"use strict";

module.exports = (sequelize, type) => {
  return sequelize.define("Community", {
    Id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Name: type.STRING,
    Description: type.STRING,
    PopularityIndex: {
      type: type.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  });
};
